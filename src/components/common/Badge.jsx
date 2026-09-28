import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = ''
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  const dotColors = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-gray-500',
    purple: 'bg-purple-500'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-0.5 gap-1.5'
  };
  
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2'
  };

  const currentVariant = variants[variant] || variants.neutral;
  const currentSize = sizes[size] || sizes.md;
  const currentDotColor = dotColors[variant] || dotColors.neutral;
  const currentDotSize = dotSizes[size] || dotSizes.md;

  return (
    <span className={`${baseStyles} ${currentVariant} ${currentSize} ${className}`}>
      {dot && (
        <span 
          className={`${currentDotSize} rounded-full ${currentDotColor}`} 
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
