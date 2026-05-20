import React from 'react';

export const SectionHeader = ({
  title,
  description,
  actions,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-color/60 mb-6 text-left ${className}`}>
      <div>
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
};
