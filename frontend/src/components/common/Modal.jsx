import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl
  className = ''
}) => {
  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent background scrolling when open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4 h-[calc(100vh-32px)]'
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full bg-surface border border-border-color shadow-2xl rounded-xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden ${currentSize} ${className}`}
          >
            {/* Header */}
            {title && (
              <div className="px-6 py-4 border-b border-border-color flex items-center justify-between bg-surface sticky top-0 z-10">
                <h3 className="text-base font-semibold text-text-primary uppercase tracking-wider">
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-bg-primary transition-all duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {!title && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-bg-primary transition-all duration-200 z-10"
              >
                <X size={18} />
              </button>
            )}

            {/* Content Body */}
            <div className="flex-1 p-6 overflow-y-auto text-left">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
