import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading...', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} text-navy-600 animate-spin`} aria-hidden="true" />
      {message && <p className="mt-4 text-sm font-medium text-gray-600">{message}</p>}
    </div>
  );
}
