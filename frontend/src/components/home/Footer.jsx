import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-border-color/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-text-primary text-bg-primary flex items-center justify-center font-bold text-sm tracking-wider">
              CV
            </div>
            <div>
              <div className="font-semibold tracking-wider text-sm">CertVault</div>
              <div className="text-xs text-text-muted">Secure credential workspace</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="mt-8 text-xs text-text-muted">
          © {new Date().getFullYear()} CertVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

