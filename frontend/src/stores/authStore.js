import { create } from 'zustand';
import pb from '../lib/pocketbase';

export const useAuthStore = create((set) => {
  // Listen for changes in the PocketBase auth store to keep Zustand in sync
  pb.authStore.onChange((token, model) => {
    set({ user: model, isAuthenticated: !!model });
  });

  return {
    user: pb.authStore.model,
    isAuthenticated: pb.authStore.isValid,
    isLoading: false,
    error: null,

    // Login with Email & Password
    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        set({ user: authData.record, isAuthenticated: true, isLoading: false });
        return authData;
      } catch (err) {
        let msg = err.message || 'Authentication failed.';
        if (err.data && err.data.message) {
          msg = err.data.message;
          if (err.data.data) {
            const keys = Object.keys(err.data.data);
            if (keys.length > 0) {
              const firstErr = err.data.data[keys[0]];
              msg += `: ${firstErr.message || JSON.stringify(firstErr)}`;
            }
          }
        }
        set({ error: msg, isLoading: false });
        throw new Error(msg);
      }
    },

    // Login with Google OAuth2
    loginWithGoogle: async () => {
      set({ isLoading: true, error: null });
      try {
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
        set({ user: authData.record, isAuthenticated: true, isLoading: false });
        return authData;
      } catch (err) {
        let msg = err.message || 'Google authentication failed.';
        if (msg.includes('provider') || msg.includes('Google') || err.status === 400) {
          msg = 'Google login failed. Please ensure Google OAuth2 is configured and enabled in your PocketBase Admin settings (http://127.0.0.1:8090/_/#/settings/auth-providers).';
        }
        set({ error: msg, isLoading: false });
        throw new Error(msg);
      }
    },

    // Signup / Register New Account
    signup: async (email, password, passwordConfirm, name) => {
      set({ isLoading: true, error: null });
      try {
        const signUpData = {
          email,
          emailVisibility: true,
          password,
          passwordConfirm,
          name: name || email.split('@')[0],
          username: email.split('@')[0] + Math.floor(Math.random() * 1000)
        };

        const record = await pb.collection('users').create(signUpData);
        // Auto-authenticate after creation
        const authData = await pb.collection('users').authWithPassword(email, password);
        set({ user: authData.record, isAuthenticated: true, isLoading: false });
        return record;
      } catch (err) {
        let msg = err.message || 'Registration failed.';
        if (err.data && err.data.message) {
          msg = err.data.message;
          if (err.data.data) {
            const keys = Object.keys(err.data.data);
            if (keys.length > 0) {
              const firstErr = err.data.data[keys[0]];
              msg += `: ${firstErr.message || JSON.stringify(firstErr)}`;
            }
          }
        }
        set({ error: msg, isLoading: false });
        throw new Error(msg);
      }
    },

    // Update Profile Name
    updateProfile: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const userId = pb.authStore.model?.id;
        if (!userId) throw new Error('No authenticated user found.');
        const record = await pb.collection('users').update(userId, data);
        set({ user: record, isLoading: false });
        return record;
      } catch (err) {
        set({ error: err.message, isLoading: false });
        throw err;
      }
    },

    // Logout
    logout: () => {
      pb.authStore.clear();
      set({ user: null, isAuthenticated: false, error: null });
    },

    // Clear Errors
    clearError: () => set({ error: null })
  };
});
