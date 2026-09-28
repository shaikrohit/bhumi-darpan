import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Info, ArrowRight } from 'lucide-react'
import Card from '../common/Card'
import Badge from '../common/Badge'

export default function AlertPanel({ alerts = [] }) {
  const navigate = useNavigate()

  return (
    <Card
      title="Attention Required"
      subtitle="Highest priority operational bottlenecks, pending approvals, and delayed cases"
      icon={AlertTriangle}
    >
      <div className="divide-y divide-gray-100">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">
            No active critical alerts matching criteria.
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.severity === 'critical'
            const isWarning = alert.severity === 'warning'

            return (
              <div
                key={alert.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isCritical ? 'bg-red-50/40' : isWarning ? 'bg-amber-50/40' : 'bg-blue-50/40'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {isCritical ? (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={isCritical ? 'danger' : isWarning ? 'warning' : 'info'} size="sm">
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <h4 className="text-xs font-bold text-gray-900 truncate">{alert.title}</h4>
                      {alert.caseId && (
                        <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-xs font-semibold">
                          {alert.caseId}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{alert.explanation}</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">{alert.timestamp}</p>
                  </div>
                </div>

                <div className="sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate('/notifications')}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    <span>View Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
