import React from 'react'
import { Clock, ShieldCheck, FileCheck, Banknote, Upload, Landmark, Bell } from 'lucide-react'
import Card from '../common/Card'
import StatusBadge from '../StatusBadge'

const typeIcons = {
  verification: ShieldCheck,
  award: FileCheck,
  compensation: Banknote,
  document: Upload,
  possession: Landmark,
  notification: Bell,
}

export default function ActivityTimeline({ activities = [] }) {
  return (
    <Card
      title="Recent Activity"
      subtitle="Audit trail of live land acquisition events and milestone completions"
      icon={Clock}
    >
      <div className="p-4">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {activities.map((act) => {
            const Icon = typeIcons[act.type] || Clock

            return (
              <div key={act.id} className="relative flex items-start justify-between gap-3">
                <span className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-4 ring-white">
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold text-gray-900">{act.title}</p>
                    {act.target && (
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-xs font-semibold">
                        {act.target}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{act.time}</p>
                </div>

                {act.status && (
                  <div className="shrink-0">
                    <StatusBadge status={act.status} size="sm" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
