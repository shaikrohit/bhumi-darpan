import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, ChevronRight } from 'lucide-react'
import Card from '../common/Card'
import StatusBadge from '../StatusBadge'

export default function ProjectProgressList({ projects = [] }) {
  const navigate = useNavigate()

  return (
    <Card
      title="Project Progress Overview"
      subtitle="Real-time execution status of key infrastructure projects"
      icon={FolderKanban}
    >
      <div className="divide-y divide-gray-100">
        {projects.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">
            No projects match the selected district or status filter.
          </div>
        ) : (
          projects.map((proj) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="w-full p-4 text-left hover:bg-blue-50/40 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 truncate transition-colors">
                    {proj.name}
                  </h4>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100 font-semibold shrink-0">
                    {proj.id}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-gray-500">
                  <span>{proj.district} District</span>
                  <span>•</span>
                  <span>Stage: <strong className="text-gray-700">{proj.currentStage}</strong></span>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 w-full sm:w-64 space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-gray-700">
                    <span>Acquisition Progress</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        proj.status === 'Delayed' ? 'bg-red-500' : proj.status === 'At Risk' ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={proj.status} dot />
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" aria-hidden="true" />
              </div>
            </button>
          ))
        )}
      </div>
    </Card>
  )
}
