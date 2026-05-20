import React from 'react';
import { X } from 'lucide-react';

export const Badge = ({
  children,
  variant = 'secondary', // primary, secondary, outline, dark
  size = 'md',
  onRemove,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1 rounded-full font-medium tracking-wide uppercase';
  
  const variants = {
    primary: 'bg-accent text-surface',
    secondary: 'bg-bg-secondary text-text-primary border border-border-color/40',
    outline: 'bg-transparent text-text-secondary border border-border-color',
    dark: 'bg-neutral-900 text-surface border border-neutral-800'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-1 text-[10px]',
    lg: 'px-3 py-1.5 text-xs'
  };

  const currentVariant = variants[variant] || variants.secondary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <span
      className={`${baseStyles} ${currentVariant} ${currentSize} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-black/10 dark:hover:bg-white/15 p-0.5 rounded-full inline-flex items-center transition-colors"
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
};
