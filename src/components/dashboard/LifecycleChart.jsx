import React from 'react'
import { Layers } from 'lucide-react'
import Card from '../common/Card'

export default function LifecycleChart({ lifecycle = [] }) {
  const maxCount = Math.max(...lifecycle.map((s) => s.count), 1)

  return (
    <Card
      title="Acquisition Lifecycle Monitoring"
      subtitle="Distribution of land acquisition cases across statutory stages"
      icon={Layers}
    >
      <div className="p-4 space-y-3.5">
        {lifecycle.map((item, idx) => {
          const percentage = Math.round((item.count / maxCount) * 100)
          
          // Color coding by stage group
          const barColor = idx < 2
            ? 'bg-blue-600 text-blue-700'
            : idx < 5
            ? 'bg-indigo-600 text-indigo-700'
            : idx < 7
            ? 'bg-amber-600 text-amber-700'
            : 'bg-emerald-600 text-emerald-700'

          return (
            <div key={item.stage} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-800 truncate">{item.stage}</span>
                <span className="font-bold text-gray-900 ml-2 shrink-0">
                  {item.count} <span className="text-[10px] font-normal text-gray-500">cases</span>
                </span>
              </div>

              {/* Progress bar container */}
              <div
                role="progressbar"
                aria-valuenow={item.count}
                aria-valuemin={0}
                aria-valuemax={maxCount}
                aria-label={`${item.stage}: ${item.count} cases`}
                className="h-3.5 w-full bg-gray-100 rounded-lg overflow-hidden p-0.5"
              >
                <div
                  className={`h-full rounded-md transition-all duration-500 ${barColor.split(' ')[0]}`}
                  style={{ width: `${Math.max(percentage, 8)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
