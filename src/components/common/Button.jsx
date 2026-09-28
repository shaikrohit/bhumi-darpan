import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  ...rest
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg';
  
  const variants = {
    primary: 'bg-navy-600 text-white hover:bg-navy-700 active:bg-navy-800 disabled:bg-navy-300',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-400'
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;
  const iconSize = iconSizes[size] || 18;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`${baseStyles} ${currentVariant} ${currentSize} ${className} ${isDisabled ? 'cursor-not-allowed opacity-70' : ''}`}
      disabled={isDisabled}
      {...rest}
    >
      {loading && <Loader2 size={iconSize} className="animate-spin" aria-hidden="true" />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={iconSize} aria-hidden="true" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={iconSize} aria-hidden="true" />}
    </button>
  );
}
