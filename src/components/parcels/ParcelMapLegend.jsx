import React from 'react'

export default function ParcelMapLegend({ className = '' }) {
  const items = [
    { label: 'Verified', color: 'bg-emerald-500 border-emerald-600', textColor: 'text-emerald-700' },
    { label: 'Pending', color: 'bg-amber-500 border-amber-600', textColor: 'text-amber-700' },
    { label: 'Needs Review', color: 'bg-red-500 border-red-600', textColor: 'text-red-700' },
    { label: 'Acquired', color: 'bg-blue-500 border-blue-600', textColor: 'text-blue-700' },
  ]

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3 text-xs ${className}`}>
      <span className="font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Spatial Status Legend:</span>
      <div className="flex flex-wrap items-center gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full border ${item.color}`} />
            <span className={`font-medium ${item.textColor}`}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
