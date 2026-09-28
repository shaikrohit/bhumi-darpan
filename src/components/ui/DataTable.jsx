import React from 'react';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

export default function DataTable({ 
  columns = [], 
  data = [], 
  onRowClick, 
  emptyMessage = 'No data available', 
  loading = false, 
  className = '' 
}) {
  if (loading) {
    return <LoadingState className="py-12" />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No Records Found" description={emptyMessage} />;
  }

  const handleKeyDown = (e, row) => {
    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  scope="col"
                  className={`py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6 ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                onKeyDown={(e) => handleKeyDown(e, row)}
                tabIndex={onRowClick ? 0 : undefined}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50 focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-inset focus:ring-navy-500' : ''}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={`${row.id || rowIdx}-${col.key || colIdx}`}
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
