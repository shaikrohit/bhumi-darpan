import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchField({ value = '', onChange, placeholder = 'Search...', className = '', onClear }) {
  return (
    <div className={`relative flex items-center w-full sm:max-w-md ${className}`}>
      <label htmlFor="search-input" className="sr-only">Search</label>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
        placeholder={placeholder}
        aria-label="Search"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-navy-500 rounded-r-lg"
          aria-label="Clear search"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
