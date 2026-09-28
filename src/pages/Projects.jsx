import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Plus, ChevronRight, Edit3, ShieldCheck, FolderKanban } from 'lucide-react'
import { PageHeader, Card, StatusBadge, Button } from '../components/common'
import { DataTable, EmptyState, LoadingState, ErrorState } from '../components/ui'
import {
  ProjectFilters,
  ProjectFormModal,
  ProjectStatusModal,
} from '../components/projects'
import { getProjects, createProject, updateProject, updateProjectStatus } from '../services/mockService'

export default function Projects() {
  const navigate = useNavigate()
  const { addToast } = useOutletContext() || {}

  // Filter States
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('All')
  const [status, setStatus] = useState('All')
  const [stage, setStage] = useState('All')
  const [sortBy, setSortBy] = useState('name')

  // Data & Modal States
  const [projectsList, setProjectsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  const loadProjects = useCallback(() => {
    setLoading(true)
    setError(null)
    getProjects({ search, district, status, stage, sortBy })
      .then((res) => {
        setProjectsList(res.data || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch projects list')
        setLoading(false)
      })
  }, [search, district, status, stage, sortBy])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const handleResetFilters = () => {
    setSearch('')
    setDistrict('All')
    setStatus('All')
    setStage('All')
    setSortBy('name')
  }

  // Create Project submit handler
  const handleCreateProject = async (formData) => {
    const created = await createProject(formData)
    if (addToast) {
      addToast(`Project "${created.name}" (${created.id}) created successfully!`, 'success')
    }
    loadProjects()
  }

  // Edit Project submit handler
  const handleEditProject = async (formData) => {
    if (!selectedProject) return
    const updated = await updateProject(selectedProject.id, formData)
    if (addToast) {
      addToast(`Project ${updated.id} details updated.`, 'success')
    }
    loadProjects()
  }

  // Update Status confirm handler
  const handleStatusConfirm = async (newStatus) => {
    if (!selectedProject) return
    const updated = await updateProjectStatus(selectedProject.id, newStatus)
    if (addToast) {
      addToast(`Project ${updated.id} status updated to "${newStatus}".`, 'success')
    }
    loadProjects()
  }

  const desktopColumns = [
    {
      key: 'id',
      label: 'PROJECT ID',
      render: (row) => (
        <span className="font-semibold text-blue-600 font-mono hover:underline">{row.id}</span>
      ),
    },
    {
      key: 'name',
      label: 'PROJECT NAME',
      render: (row) => (
        <div className="min-w-[180px]">
          <p className="font-bold text-gray-900 leading-tight">{row.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{row.authority}</p>
        </div>
      ),
    },
    { key: 'district', label: 'DISTRICT' },
    {
      key: 'landRequired',
      label: 'LAND REQ.',
      render: (row) => (
        <span className="text-xs font-semibold text-gray-700">{row.landRequired}</span>
      ),
    },
    {
      key: 'parcels',
      label: 'PARCELS',
      render: (row) => `${row.parcels || row.affectedParcels || 0} parcels`,
    },
    {
      key: 'currentStage',
      label: 'CURRENT STAGE',
      render: (row) => (
        <span className="inline-block text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md">
          {row.currentStage}
        </span>
      ),
    },
    {
      key: 'progress',
      label: 'PROGRESS',
      render: (row) => (
        <div className="w-28 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-gray-700">
            <span>{row.progress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                row.status === 'Delayed' ? 'bg-red-500' : row.status === 'At Risk' ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (row) => <StatusBadge status={row.status} dot />,
    },
    {
      key: 'lastUpdated',
      label: 'LAST UPDATED',
      render: (row) => <span className="text-xs text-gray-500">{row.lastUpdated || row.startDate}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedProject(row)
              setEditModalOpen(true)
            }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
            title="Edit Project"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedProject(row)
              setStatusModalOpen(true)
            }}
            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
            title="Update Status"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Land Acquisition Projects"
        subtitle="Monitor acquisition progress, milestones and project status"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Projects' }]}
        actions={
          <Button icon={Plus} onClick={() => setCreateModalOpen(true)}>
            New Project
          </Button>
        }
      />

      <Card padding="none">
        {/* Multi-attribute Filter Controls */}
        <ProjectFilters
          search={search}
          onSearchChange={setSearch}
          district={district}
          onDistrictChange={setDistrict}
          status={status}
          onStatusChange={setStatus}
          stage={stage}
          onStageChange={setStage}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onReset={handleResetFilters}
          totalResults={projectsList.length}
        />

        {error ? (
          <ErrorState message={error} onRetry={loadProjects} />
        ) : loading ? (
          <LoadingState message="Loading projects directory..." />
        ) : projectsList.length === 0 ? (
          <EmptyState
            title="No Matching Projects Found"
            description="No land acquisition projects match your current search and filter selections."
            action={
              <Button size="sm" variant="secondary" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            }
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <DataTable
                columns={desktopColumns}
                data={projectsList}
                onRowClick={(row) => navigate(`/projects/${row.id}`)}
              />
            </div>

            {/* Mobile Responsive Cards View */}
            <div className="md:hidden divide-y divide-gray-200">
              {projectsList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="p-4 space-y-3 hover:bg-blue-50/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100 font-semibold">
                        {p.id}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 mt-1">{p.name}</h4>
                      <p className="text-xs text-gray-500">{p.authority}</p>
                    </div>
                    <StatusBadge status={p.status} dot />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                    <div><span className="text-gray-400">District:</span> <strong>{p.district}</strong></div>
                    <div><span className="text-gray-400">Land:</span> <strong>{p.landRequired}</strong></div>
                    <div><span className="text-gray-400">Stage:</span> <strong>{p.currentStage}</strong></div>
                    <div><span className="text-gray-400">Parcels:</span> <strong>{p.parcels || p.affectedParcels}</strong></div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-700">
                      <span>Acquisition Progress</span>
                      <span>{p.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-gray-400 text-[11px]">Updated {p.lastUpdated || p.startDate}</span>
                    <span className="text-blue-600 font-bold flex items-center gap-0.5">
                      View Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* New Project Modal */}
      <ProjectFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        isEditing={false}
      />

      {/* Edit Project Modal */}
      <ProjectFormModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditProject}
        initialData={selectedProject}
        isEditing={true}
      />

      {/* Update Project Status Modal */}
      <ProjectStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onConfirm={handleStatusConfirm}
        project={selectedProject}
      />
    </div>
  )
}
