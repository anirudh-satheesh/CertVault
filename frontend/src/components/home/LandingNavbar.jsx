import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const actions = useMemo(
    () => ({
      goLogin: () => navigate('/login'),
      goGetStarted: () => navigate('/login'),
    }),
    [navigate]
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/40 border-b border-border-color/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-3" aria-label="CertVault Home">
            <div className="h-8 w-8 rounded-lg bg-text-primary text-bg-primary flex items-center justify-center font-bold text-sm tracking-wider">
              CV
            </div>
            <span className="font-semibold tracking-wider text-sm text-text-primary">
              CertVault
            </span>
          </Link>
        </div>

        {/* Right: Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={actions.goLogin}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border-color bg-transparent text-text-primary hover:bg-bg-secondary transition-all duration-200"
          >
            Login
          </button>
          <button
            onClick={actions.goGetStarted}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-text-primary text-bg-primary hover:bg-neutral-900 transition-all duration-200"
          >
            Get Started
          </button>
        </div>

        {/* Mobile: Menu */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border-color/60 bg-bg-primary/90"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  actions.goLogin();
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border-color bg-transparent text-text-primary hover:bg-bg-secondary transition-all duration-200"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  actions.goGetStarted();
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-text-primary text-bg-primary hover:bg-neutral-900 transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

