import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col text-text-primary">
      {/* Desktop Sidebar (Fixed) */}
      <Sidebar />

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-64 max-w-xs h-full bg-surface shadow-2xl z-10 flex flex-col"
            >
              <Sidebar isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main View Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar onMenuOpen={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
