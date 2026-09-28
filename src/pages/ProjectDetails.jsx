import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Building2, CheckCircle2 } from 'lucide-react'
import { PageHeader, Card, StatusBadge, Button } from '../components/common'
import { LoadingState, ErrorState, DataTable } from '../components/ui'
import { getProjectById } from '../services/mockService'
import { STAGES } from '../data/mockData'

export default function ProjectDetails() {
  const params = useParams()
  const targetId = params.projectId || params.id
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)
    getProjectById(targetId)
      .then((res) => {
        if (isMounted) {
          setProject(res)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Project not found')
          setLoading(false)
        }
      })
    return () => { isMounted = false }
  }, [targetId])

  if (loading) return <LoadingState message="Loading project details..." />
  if (error || !project) {
    return (
      <ErrorState
        title="Project Not Found"
        message={`The requested project ID "${targetId}" could not be loaded.`}
      />
    )
  }

  const currentStageIndex = STAGES.indexOf(project.currentStage)
  const countDisplay = Array.isArray(project.parcels) ? project.parcels.length : (project.parcels || 0)
  const parcelsArray = Array.isArray(project.parcels) ? project.parcels : (project.parcelsList || [])

  const parcelColumns = [
    { key: 'id', label: 'PARCEL ID', render: (p) => <span className="font-semibold text-blue-600">{p.id}</span> },
    { key: 'ulpin', label: 'ULPIN' },
    { key: 'surveyNumber', label: 'SURVEY NO.' },
    { key: 'owner', label: 'OWNER' },
    { key: 'area', label: 'AREA' },
    { key: 'verification', label: 'VERIFICATION', render: (p) => <StatusBadge status={p.verification || 'Pending'} dot /> },
    { key: 'status', label: 'ACQUISITION STATUS', render: (p) => <StatusBadge status={p.status} /> },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={project.name}
        subtitle={`Project ID: ${project.id} • ${project.district} District`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Projects', href: '/projects' },
          { label: project.id },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} dot />
            <Button variant="secondary" size="sm">Download Report</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Project Overview & Parcels */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Project Overview" icon={Building2}>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {project.description || 'Infrastructure land acquisition project.'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-medium">Executing Authority</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{project.authority}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Land Required</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{project.totalLand}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Affected Parcels</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{countDisplay} parcels</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Start Date</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{project.startDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Target Completion</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{project.expectedCompletion || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Compensation Assessed</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{project.compensation}</p>
              </div>
            </div>
          </Card>

          {/* Affected Parcels List */}
          <Card
            title="Affected Land Parcels"
            subtitle={`Total ${countDisplay} parcels mapped`}
            action={
              <Link to={`/parcels?projectId=${project.id}`}>
                <Button variant="secondary" size="sm">
                  View Parcels in GIS Workspace
                </Button>
              </Link>
            }
            padding="none"
          >
            <DataTable
              columns={parcelColumns}
              data={parcelsArray}
              emptyMessage="No land parcels mapped to this project yet."
            />
          </Card>
        </div>

        {/* Right Column: 9-Stage Lifecycle Timeline */}
        <div className="space-y-6">
          <Card title="Acquisition Lifecycle Timeline" subtitle="9-stage digital workflow progression">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex
                const isCurrent = idx === currentStageIndex

                return (
                  <div key={stage} className="relative flex items-start gap-3">
                    <span
                      className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ring-4 ring-white ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-blue-100 animate-pulse'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold ${isCurrent ? 'text-blue-700 font-extrabold' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {stage}
                      </p>
                      {isCurrent && (
                        <span className="inline-block mt-0.5 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          Current Active Stage
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
