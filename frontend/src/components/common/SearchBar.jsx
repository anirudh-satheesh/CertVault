import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search certificates, skills, tags, or issuers...',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative w-full flex items-center ${className}`}>
      <span className="absolute left-3.5 text-text-muted flex items-center pointer-events-none">
        <Search size={16} />
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-surface text-sm text-text-primary border border-border-color/85 rounded-lg placeholder-text-muted/70 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all-custom"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 text-text-muted hover:text-text-primary p-0.5 rounded-full hover:bg-bg-primary transition-all-custom"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
