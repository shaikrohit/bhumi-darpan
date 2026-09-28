import React from 'react'
import { CheckCircle2, Clock, AlertTriangle, Circle, Edit3 } from 'lucide-react'
import Card from '../common/Card'
import Badge from '../common/Badge'

export default function MilestoneTracker({ milestones = [], onUpdateMilestone }) {
  return (
    <Card
      title="Key Operational Milestones"
      subtitle="Statutory compliance and administrative milestone deadlines"
    >
      <div className="divide-y divide-gray-100">
        {milestones.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">
            No milestones configured for this project.
          </div>
        ) : (
          milestones.map((ms) => {
            const isCompleted = ms.status === 'Completed'
            const isInProgress = ms.status === 'In Progress'
            const isBlocked = ms.status === 'Blocked'

            return (
              <div
                key={ms.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors rounded-lg px-2"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isBlocked ? (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    ) : isInProgress ? (
                      <Clock className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold ${isBlocked ? 'text-red-900' : 'text-gray-900'}`}>
                        {ms.name}
                      </p>
                      <Badge
                        variant={isCompleted ? 'success' : isBlocked ? 'danger' : isInProgress ? 'info' : 'neutral'}
                        size="sm"
                      >
                        {ms.status}
                      </Badge>
                    </div>

                    {ms.date && (
                      <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                        Target Date: {ms.date}
                      </p>
                    )}

                    {ms.note && (
                      <p className={`text-[11px] mt-1 p-2 rounded-md ${
                        isBlocked ? 'bg-red-50 text-red-800 border border-red-200 font-medium' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {isBlocked ? <strong>Block Reason: </strong> : null}
                        {ms.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onUpdateMilestone(ms)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Update Milestone</span>
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
