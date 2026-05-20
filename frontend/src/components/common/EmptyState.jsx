import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon = <FileText size={40} className="stroke-[1.25]" />,
  title = 'No certificates found',
  description = 'Try adjusting your search keywords, clearing your filters, or adding a new certificate to get started.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-color rounded-xl bg-surface/50 max-w-md mx-auto my-6 ${className}`}>
      <div className="p-4 bg-bg-primary text-text-muted rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary mb-6 max-w-xs leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
