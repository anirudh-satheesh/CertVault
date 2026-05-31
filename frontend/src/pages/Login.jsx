import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  ArrowRight,
  User,
  Eye,
  EyeOff
} from 'lucide-react';

import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

import {
  login,
  signup,
  signInWithGoogle
} from '../services/supabaseAuth';

import { supabase } from '../services/supabase';


import { useAuthStore } from '../stores/authStore';

export const Login = () => {
  const navigate = useNavigate();

  // Mode
  const [isSignUp, setIsSignUp] = useState(false);

  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // UI
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zustand
  const { 
    clearError,
    error: storeError,
    setSession
  } = useAuthStore();


  const displayError = localError || storeError;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLocalError('');
    clearError();

    // Validation
    if (!email || !password) {
      setLocalError('Please fill in all mandatory fields.');
      return;
    }

    if (isSignUp && !passwordConfirm) {
      setLocalError('Please confirm your password.');
      return;
    }

    if (isSignUp && password !== passwordConfirm) {
      setLocalError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isSignUp) {
        await signup(email, password);

        setLocalError(
          'Account created successfully. Please check your email and verify your account before logging in.'
        );

        setIsSignUp(false);

        // After sign-up, Supabase may not have a session depending on email confirmation settings.
        // Do not force-auth; App will restore any existing session.
        return;
      }


      const user = await login(email, password);

      // Persist Supabase session into Zustand
      // signInWithPassword() stores session in supabase internally
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      navigate('/dashboard');


    } catch (err) {
      console.error(err);

      setLocalError(
        err?.message || 'Authentication failed.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError('');
    clearError();

    try {
      setIsSubmitting(true);
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setLocalError(err?.message || 'Google authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-bg-primary flex items-center justify-center p-4 selection:bg-neutral-800 selection:text-white relative">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-neutral-200/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-neutral-300/40 rounded-full blur-[100px]" />
      </div>

      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] bg-surface border border-border-color rounded-xl p-8 shadow-xl relative z-10 flex flex-col gap-6"
      >
        {/* Branding */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 bg-accent text-surface rounded-xl flex items-center justify-center font-bold text-base tracking-widest shadow-md">
            CV
          </div>

          <h1 className="text-sm font-bold uppercase tracking-widest text-text-primary mt-2">
            CertVault
          </h1>

          <p className="text-[11px] text-text-muted">
            {isSignUp
              ? 'Register Security Credentials'
              : 'Professional Credential Workspace'}
          </p>
        </div>

        <hr className="border-border-color/60" />

        {/* Intro */}
        <div className="text-left">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">
            {isSignUp ? 'Create an Account' : 'Sign In'}
          </h2>

          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            {isSignUp
              ? 'Establish your secure digital credentials vault.'
              : 'Access your credential workspace securely.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden flex flex-col gap-4"
              >
                <Input
                  label="Display Name (Optional)"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anirudh"
                  icon={<User size={16} />}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            icon={<Mail size={16} />}
            required
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock size={16} />}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-[35px] text-text-muted hover:text-text-primary transition-colors p-0.5 rounded"
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <AnimatePresence initial={false}>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden flex flex-col gap-4"
              >
                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Errors */}
          {displayError && (
            <div className="bg-neutral-900/5 border border-neutral-900/15 rounded-lg p-3 text-left text-xs text-text-primary italic leading-relaxed">
              * {displayError}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            variant="primary"
            className="w-full py-2.5 mt-2"
            icon={<ArrowRight size={14} />}
            iconPosition="right"
          >
            {isSignUp
              ? 'Create Vault Account'
              : 'Sign In to Workspace'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-border-color/60"></div>

          <span className="flex-shrink mx-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            or continue with
          </span>

          <div className="flex-grow border-t border-border-color/60"></div>
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
          isLoading={isSubmitting}
          onClick={handleGoogleSignIn}
        >
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.25.61 4.47 1.62l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.254-4.074 10.254-10.24 0-.595-.06-1.17-.16-1.728H12.24z" />
          </svg>

          <span className="text-xs uppercase tracking-wider font-semibold">
            Google Account
          </span>
        </Button>

        {/* Toggle */}
        <div className="text-center text-xs text-text-muted pt-2 border-t border-border-color/60">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setLocalError('');
                  clearError();
                }}
                className="font-semibold text-text-primary hover:underline bg-transparent border-none"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setLocalError('');
                  clearError();
                }}
                className="font-semibold text-text-primary hover:underline bg-transparent border-none"
              >
                Create one now
              </button>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};