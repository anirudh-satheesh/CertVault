import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  ...props
}) => {
  const baseClasses = 'bg-surface border border-border-color rounded-xl p-5 shadow-sm text-left';
  const hoverClasses = hoverable 
    ? 'hover:shadow-md hover:border-border-color/100 cursor-pointer transition-all-custom' 
    : '';

  if (onClick) {
    return (
      <motion.div
        whileHover={hoverable ? { y: -2, scale: 1.005 } : {}}
        whileTap={hoverable ? { scale: 0.99 } : {}}
        onClick={onClick}
        className={`${baseClasses} ${hoverClasses} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};
