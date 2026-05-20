import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  icon,
  ...props
}, ref) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 text-left ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-text-muted pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full px-3.5 py-2.5 text-sm bg-surface rounded-lg border border-border-color/80 text-text-primary placeholder-text-muted/70 transition-all duration-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent hover:border-border-color ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-neutral-900 focus:ring-black' : ''}`}
          {...props}
        />
      </div>
      {error ? (
        <span className="text-xs font-medium text-text-primary italic mt-0.5">
          * {error}
        </span>
      ) : helperText ? (
        <span className="text-xs text-text-muted">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
