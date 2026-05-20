import React from 'react';
import { motion } from 'framer-motion';

export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  // Styles aligned with CertVault's monochrome premium theme
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent text-surface hover:bg-accent-hover active:bg-neutral-900',
    secondary: 'bg-surface text-text-primary border border-border-color hover:bg-surface-hover active:bg-neutral-100',
    danger: 'bg-neutral-900 text-surface hover:bg-black active:bg-neutral-950 border border-neutral-800',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-neutral-100',
    sidebarActive: 'bg-surface text-text-primary shadow-sm font-semibold border border-border-color/60'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <motion.button
      ref={ref}
      whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${currentVariant} ${currentSize} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon && iconPosition === 'left' ? (
        <span className="mr-1.5 inline-flex items-center">{icon}</span>
      ) : null}
      
      <span>{children}</span>
      
      {!isLoading && icon && iconPosition === 'right' ? (
        <span className="ml-1.5 inline-flex items-center">{icon}</span>
      ) : null}
    </motion.button>
  );
});

Button.displayName = 'Button';
