import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, ArrowUpDown, ChevronRight, FolderKanban } from 'lucide-react'
import { PageHeader, Card, StatusBadge } from '../components/common'
import { DataTable, SearchField, EmptyState, LoadingState } from '../components/ui'
import { getProjects } from '../services/mockService'

export default function Projects() {
  const navigate = useNavigate()
  const [projectsList, setProjectsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getProjects({ search: searchQuery, status: selectedStatus === 'All' ? undefined : selectedStatus })
      .then((res) => {
        if (isMounted) {
          setProjectsList(res.data)
          setLoading(false)
        }
      })
    return () => { isMounted = false }
  }, [searchQuery, selectedStatus])

  const columns = [
    {
      key: 'id',
      label: 'PROJECT ID',
      render: (row) => (
        <span className="font-semibold text-blue-600 hover:underline">{row.id}</span>
      ),
    },
    {
      key: 'name',
      label: 'PROJECT NAME',
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.authority}</p>
        </div>
      ),
    },
    { key: 'district', label: 'DISTRICT' },
    { key: 'parcels', label: 'PARCELS' },
    { key: 'currentStage', label: 'CURRENT STAGE' },
    {
      key: 'progress',
      label: 'PROGRESS',
      render: (row) => (
        <div className="w-28 space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>{row.progress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${row.progress}%` }} />
          </div>
        </div>
      ),
    },
    { key: 'compensation', label: 'COMPENSATION' },
    {
      key: 'status',
      label: 'STATUS',
      render: (row) => <StatusBadge status={row.status} dot />,
    },
    {
      key: 'action',
      label: '',
      render: () => <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Projects Management"
        subtitle="Manage and track land acquisition projects across districts"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Projects' }]}
      />

      <Card padding="none">
        {/* Filter bar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="w-full sm:w-72">
            <SearchField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search by Project Name or ID..."
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Filter className="w-4 h-4 text-gray-500" />
            <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="On Track">On Track</option>
              <option value="Delayed">Delayed</option>
              <option value="At Risk">At Risk</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={projectsList}
          loading={loading}
          onRowClick={(row) => navigate(`/projects/${row.id}`)}
          emptyMessage="No land acquisition projects match your criteria."
        />
      </Card>
    </div>
  )
}
