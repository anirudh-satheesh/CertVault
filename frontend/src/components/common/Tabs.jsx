import React from 'react';
import { motion } from 'framer-motion';

export const Tabs = ({
  tabs = [], // [{ id, label, count }]
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex border-b border-border-color overflow-x-auto scrollbar-none gap-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="relative pb-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 focus:outline-none flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className={isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'}>
              {tab.label}
            </span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                isActive 
                  ? 'bg-neutral-900 text-surface' 
                  : 'bg-bg-secondary text-text-muted group-hover:text-text-primary'
              }`}>
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeTabBorder"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
