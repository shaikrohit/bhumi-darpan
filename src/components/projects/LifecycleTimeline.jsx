import React from 'react'
import { CheckCircle2, Clock, AlertTriangle, Circle } from 'lucide-react'
import Card from '../common/Card'
import Badge from '../common/Badge'
import { STAGES } from '../../data/mockData.js'

export default function LifecycleTimeline({ currentStage = 'Verification', stageHistory = [] }) {
  const currentIndex = STAGES.indexOf(currentStage)
  const safeCurrentIndex = currentIndex !== -1 ? currentIndex : 2

  // Progress derived directly from stage completion index
  const progressPercent = Math.min(100, Math.round(((safeCurrentIndex + 1) / STAGES.length) * 100))

  return (
    <Card
      title="Statutory Acquisition Lifecycle Timeline"
      subtitle="9-stage digital workflow progression per LARR Act guidelines"
      action={
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">Overall Progress:</span>
          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            {progressPercent}%
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Progress Bar Header */}
        <div className="space-y-1.5 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>Completed Stages: <strong>{safeCurrentIndex}</strong></span>
            <span>Current Stage: <strong className="text-blue-700">{currentStage}</strong></span>
            <span>Remaining: <strong>{STAGES.length - safeCurrentIndex - 1}</strong></span>
          </div>
          <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 9-Stage Visual Vertical Timeline */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {STAGES.map((stageName, idx) => {
            const isCompleted = idx < safeCurrentIndex
            const isCurrent = idx === safeCurrentIndex
            const isPending = idx > safeCurrentIndex

            const histItem = stageHistory.find((h) => h.stage === stageName)
            const dateStr = histItem?.date || null

            return (
              <div key={stageName} className="relative flex items-start gap-4">
                {/* Numbered Indicator Node */}
                <span
                  className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ring-4 ring-white ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-blue-100 animate-pulse'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </span>

                <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold ${isCurrent ? 'text-blue-700 font-extrabold text-sm' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {idx + 1}. {stageName}
                      </p>

                      {isCurrent && (
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          Active Stage
                        </span>
                      )}
                    </div>

                    {dateStr && (
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {isCompleted ? `Completed on ${dateStr}` : `Started on ${dateStr}`}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 mt-1 sm:mt-0">
                    {isCompleted ? (
                      <Badge variant="success" size="sm" dot>Completed</Badge>
                    ) : isCurrent ? (
                      <Badge variant="info" size="sm" dot>In Progress</Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">Pending</Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
