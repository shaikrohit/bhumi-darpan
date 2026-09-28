import React from 'react'
import { Search, X } from 'lucide-react'

export default function SearchField({
  value = '',
  onChange,
  placeholder = 'Search...',
  className = '',
  onClear,
  'aria-label': ariaLabel,
  ...props
}) {
  const handleChange = (e) => {
    if (!onChange) return
    onChange(e)
  }

  return (
    <div className={`relative flex items-center w-full sm:max-w-md ${className}`}>
      <label htmlFor="search-input" className="sr-only">
        {ariaLabel || 'Search'}
      </label>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </div>
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        className="block w-full pl-9 pr-9 py-1.5 border border-gray-300 rounded-lg text-xs leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        aria-label={ariaLabel || 'Search'}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
