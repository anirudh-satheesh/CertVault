import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  isAuthenticated: false,
  error: null,

  clearError: () => set({ error: null }),

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
    }),

  setAuthenticated: (value) => set({ isAuthenticated: !!value }),

  signOutLocal: () =>
    set({
      session: null,
      user: null,
      isAuthenticated: false,
      error: null,
    }),

  setError: (error) => set({ error }),
}));


