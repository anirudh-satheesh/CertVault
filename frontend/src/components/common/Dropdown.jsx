import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`w-full flex flex-col gap-1.5 text-left relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 bg-surface text-sm text-left text-text-primary border rounded-lg flex items-center justify-between transition-all duration-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent ${
          error ? 'border-neutral-900' : 'border-border-color/80'
        }`}
      >
        <span className={selectedOption ? 'text-text-primary' : 'text-text-muted/70'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+4px)] left-0 w-full bg-surface border border-border-color shadow-lg rounded-lg z-50 overflow-hidden max-h-60 overflow-y-auto"
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-text-muted italic">No options available</div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-sm text-left hover:bg-bg-primary transition-colors flex items-center justify-between ${
                    value === option.value ? 'bg-bg-primary font-medium text-text-primary' : 'text-text-secondary'
                  }`}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <span className="h-1.5 w-1.5 bg-accent rounded-full" />
                  )}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <span className="text-xs font-medium text-text-primary italic mt-0.5">
          * {error}
        </span>
      )}
    </div>
  );
};
