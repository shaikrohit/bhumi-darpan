import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Edit3, ShieldCheck, Building2, MapPin, Calendar, Layers, FileText } from 'lucide-react'
import { PageHeader, Card, StatCard, StatusBadge, Button } from '../components/common'
import { LoadingState, ErrorState } from '../components/ui'
import {
  LifecycleTimeline,
  MilestoneTracker,
  ProjectFormModal,
  ProjectStatusModal,
  MilestoneUpdateModal,
} from '../components/projects'
import {
  getProjectById,
  updateProject,
  updateProjectStatus,
  updateProjectMilestone,
} from '../services/mockService'

export default function ProjectDetails() {
  const params = useParams()
  const navigate = useNavigate()
  const { addToast } = useOutletContext() || {}
  const targetId = params.projectId || params.id

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [msModalOpen, setMsModalOpen] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState(null)

  const loadProject = useCallback(() => {
    setLoading(true)
    setError(null)
    getProjectById(targetId)
      .then((res) => {
        setProject(res)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Project not found')
        setLoading(false)
      })
  }, [targetId])

  useEffect(() => {
    loadProject()
  }, [loadProject])

  const handleEditSubmit = async (formData) => {
    const updated = await updateProject(project.id, formData)
    if (addToast) addToast(`Project ${updated.id} details updated successfully.`, 'success')
    loadProject()
  }

  const handleStatusConfirm = async (newStatus) => {
    const updated = await updateProjectStatus(project.id, newStatus)
    if (addToast) addToast(`Project ${updated.id} status changed to "${newStatus}".`, 'success')
    loadProject()
  }

  const handleMilestoneConfirm = async (milestoneId, changes) => {
    const updated = await updateProjectMilestone(project.id, milestoneId, changes)
    if (addToast) addToast(`Milestone status updated.`, 'success')
    loadProject()
  }

  if (loading) return <LoadingState message="Loading land acquisition project details..." />
  if (error || !project) {
    return (
      <ErrorState
        title="Project Not Found"
        message={`The project ID "${targetId}" could not be found or loaded.`}
        onRetry={loadProject}
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title={project.name}
        subtitle={`Project ID: ${project.id} • ${project.district} District • ${project.authority}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Projects', href: '/projects' },
          { label: project.id },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate('/projects')}>
              Back to Projects
            </Button>
            <Button variant="secondary" size="sm" icon={Edit3} onClick={() => setEditModalOpen(true)}>
              Edit Project
            </Button>
            <Button size="sm" icon={ShieldCheck} onClick={() => setStatusModalOpen(true)}>
              Update Status
            </Button>
          </div>
        }
      />

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="LAND REQUIRED" value={project.landRequired} subtitle="Total land area" icon={Building2} iconColor="text-blue-600" />
        <StatCard title="AFFECTED PARCELS" value={`${project.parcels?.length || project.affectedParcels || 0} parcels`} subtitle="Mapped in cadastral GIS" icon={MapPin} iconColor="text-indigo-600" />
        <StatCard title="CURRENT STAGE" value={project.currentStage} subtitle={`Stage ${project.currentStageIndex + 1} of 9`} icon={Layers} iconColor="text-amber-600" />
        <StatCard title="OVERALL PROGRESS" value={`${project.progress}%`} subtitle="Acquisition lifecycle completed" trend="up" trendValue={`${project.progress}%`} icon={Calendar} iconColor="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Detailed Information & Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview Card */}
          <Card
            title="Project Information Overview"
            subtitle="Executive summary and administrative details"
            action={<StatusBadge status={project.status} dot />}
          >
            <div className="space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
                {project.description || 'Infrastructure land acquisition project under execution.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <div>
                  <span className="text-gray-500 font-medium">Project ID</span>
                  <p className="font-bold text-blue-600 font-mono mt-0.5">{project.id}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Executing Authority</span>
                  <p className="font-bold text-gray-900 mt-0.5">{project.authority}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Project Type</span>
                  <p className="font-bold text-gray-900 mt-0.5">{project.projectType || 'Infrastructure'}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">State</span>
                  <p className="font-bold text-gray-900 mt-0.5">{project.state || 'Andhra Pradesh'}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">District</span>
                  <p className="font-bold text-gray-900 mt-0.5">{project.district}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Tehsil / Mandal</span>
                  <p className="font-bold text-gray-900 mt-0.5">{project.tehsil || 'Central Mandal'}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Primary Village / Area</span>
                  <p className="font-bold text-gray-900 mt-0.5">{project.village}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Project Start Date</span>
                  <p className="font-bold text-gray-900 mt-0.5">{project.startDate}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Target Completion</span>
                  <p className="font-bold text-gray-900 mt-0.5">{project.expectedCompletion || project.expectedEnd}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Key Milestones Tracker */}
          <MilestoneTracker
            milestones={project.milestones || []}
            onUpdateMilestone={(ms) => {
              setSelectedMilestone(ms)
              setMsModalOpen(true)
            }}
          />
        </div>

        {/* Right Column: 9-Stage Acquisition Lifecycle Timeline */}
        <div>
          <LifecycleTimeline
            currentStage={project.currentStage}
            stageHistory={project.stageHistory || []}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <ProjectFormModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={project}
        isEditing={true}
      />

      {/* Status Modal */}
      <ProjectStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleStatusConfirm}
        project={project}
      />

      {/* Milestone Update Modal */}
      <MilestoneUpdateModal
        isOpen={msModalOpen}
        onClose={() => setMsModalOpen(false)}
        onConfirm={handleMilestoneConfirm}
        milestone={selectedMilestone}
      />
    </div>
  )
}
