import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ title = 'Something went wrong', message, onRetry, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg border border-red-200 ${className}`}>
      <AlertTriangle className="w-10 h-10 text-red-500 mb-4" aria-hidden="true" />
      <h3 className="text-lg font-medium text-red-800 mb-2">{title}</h3>
      {message && <p className="text-sm text-red-600 mb-4 max-w-md">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
