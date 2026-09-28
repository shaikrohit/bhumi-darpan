import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { MapPin, List, Map as MapIcon, RefreshCw, Eye, Layers } from 'lucide-react'
import { PageHeader, Badge, Button } from '../components/common'
import { DataTable, LoadingState, EmptyState, ErrorState } from '../components/ui'
import {
  ParcelFilters,
  ParcelCard,
  GISMap,
  ParcelDetailPanel,
  ParcelMapLegend,
  ParcelSummary,
} from '../components/parcels'
import { getLandParcels, getParcelStats } from '../services/mockService'

export default function LandParcels() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [parcels, setParcels] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedParcel, setSelectedParcel] = useState(null)
  const [activeMobileTab, setActiveMobileTab] = useState('list') // 'list' or 'map'

  // Filter state synced with URL searchParams if present
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    district: searchParams.get('district') || '',
    village: searchParams.get('village') || '',
    landType: searchParams.get('landType') || '',
    verificationStatus: searchParams.get('verificationStatus') || '',
    acquisitionStatus: searchParams.get('acquisitionStatus') || '',
    projectId: searchParams.get('projectId') || '',
  })

  // Fetch data on filter change
  const loadParcels = async () => {
    setLoading(true)
    setError(null)
    try {
      const [res, statsRes] = await Promise.all([
        getLandParcels(filters),
        getParcelStats(filters),
      ])
      setParcels(res.data)
      setStats(statsRes)

      // Auto-select parcel if requested via URL param or default to first
      const requestedId = searchParams.get('parcelId')
      if (requestedId) {
        const found = res.data.find((p) => p.id === requestedId)
        if (found) setSelectedParcel(found)
      } else if (!selectedParcel && res.data.length > 0) {
        setSelectedParcel(res.data[0])
      } else if (selectedParcel && !res.data.some((p) => p.id === selectedParcel.id)) {
        setSelectedParcel(res.data[0] || null)
      }
    } catch (err) {
      setError(err.message || 'Failed to load land parcel records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadParcels()
  }, [filters])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    // Update URL params
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    setSearchParams(params, { replace: true })
  }

  const handleResetFilters = () => {
    const empty = {
      search: '',
      district: '',
      village: '',
      landType: '',
      verificationStatus: '',
      acquisitionStatus: '',
      projectId: '',
    }
    setFilters(empty)
    setSearchParams({}, { replace: true })
  }

  const handleSelectParcel = (parcel) => {
    setSelectedParcel(parcel)
  }

  // Table Columns definition for DataTable
  const tableColumns = [
    {
      key: 'id',
      label: 'Parcel ID',
      render: (row) => (
        <span className="font-bold text-blue-700 font-mono text-xs">{row.id}</span>
      ),
    },
    {
      key: 'ulpin',
      label: 'ULPIN',
      render: (row) => (
        <span className="font-mono text-[11px] text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
          {row.ulpin}
        </span>
      ),
    },
    {
      key: 'surveyNumber',
      label: 'Survey No.',
      render: (row) => (
        <span className="font-semibold text-gray-800 text-xs">
          {row.surveyNumber || row.surveyNo}
        </span>
      ),
    },
    {
      key: 'village',
      label: 'Village',
      render: (row) => (
        <span className="text-gray-700 text-xs">
          {row.village}, <span className="text-gray-400">{row.district}</span>
        </span>
      ),
    },
    {
      key: 'area',
      label: 'Area',
      render: (row) => (
        <span className="font-semibold text-gray-900 text-xs">{row.area}</span>
      ),
    },
    {
      key: 'landType',
      label: 'Land Type',
      render: (row) => (
        <Badge variant="neutral" size="sm">
          {row.landType}
        </Badge>
      ),
    },
    {
      key: 'projectId',
      label: 'Project',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-navy-700">
          {row.projectId}
        </span>
      ),
    },
    {
      key: 'verificationStatus',
      label: 'Verification',
      render: (row) => {
        const v = row.verificationStatus || row.verification
        const variant = v === 'Verified' ? 'success' : v === 'Needs Review' ? 'danger' : 'warning'
        return <Badge variant={variant} size="sm" dot>{v}</Badge>
      },
    },
    {
      key: 'acquisitionStatus',
      label: 'Acquisition',
      render: (row) => {
        const a = row.acquisitionStatus || row.status
        const variant = a === 'Acquired' || a === 'Possession Ready' ? 'info' : a === 'Compensation Pending' ? 'warning' : 'primary'
        return <Badge variant={variant} size="sm">{a}</Badge>
      },
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <Button
          variant={selectedParcel && selectedParcel.id === row.id ? 'primary' : 'secondary'}
          size="sm"
          icon={Eye}
          onClick={() => handleSelectParcel(row)}
        >
          View
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Land Parcels"
        subtitle="Cadastral parcel registry and GIS-based acquisition monitoring"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Land Parcels' },
        ]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={loadParcels}
            loading={loading}
          >
            Refresh Spatial Data
          </Button>
        }
      />

      {/* Top Filter Bar */}
      <ParcelFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalCount={parcels.length}
      />

      {/* Verification KPI Summary & Map Legend */}
      <div className="space-y-3">
        <ParcelSummary stats={stats} totalCount={parcels.length} />
        <ParcelMapLegend />
      </div>

      {/* Mobile / Tablet View Switcher Buttons */}
      <div className="flex items-center justify-between lg:hidden bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
        <span className="text-xs font-medium text-gray-500 px-2">GIS Workspace View:</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveMobileTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeMobileTab === 'list'
                ? 'bg-navy-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <List className="w-4 h-4" /> Parcel List ({parcels.length})
          </button>
          <button
            onClick={() => setActiveMobileTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeMobileTab === 'map'
                ? 'bg-navy-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MapIcon className="w-4 h-4" /> Cadastral Map
          </button>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && <LoadingState message="Fetching cadastral spatial parcel dataset..." />}
      {error && <ErrorState message={error} onRetry={loadParcels} />}

      {!loading && !error && parcels.length === 0 && (
        <EmptyState
          icon={Layers}
          title="No Land Parcels Found"
          description="No cadastral land parcels match your active filter criteria. Try searching for a different survey number, village or reset filters."
          action={
            <Button variant="secondary" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          }
        />
      )}

      {/* Main Split-Screen Workspace (Desktop + Responsive Mobile) */}
      {!loading && !error && parcels.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT / CENTER: Parcel Registry Table & Map Workspace */}
          <div
            className={`lg:col-span-8 space-y-6 ${
              activeMobileTab === 'map' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* GIS Map Container */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900">Cadastral GIS Map</h3>
                </div>
                {selectedParcel && (
                  <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    Selected: {selectedParcel.id} ({selectedParcel.surveyNumber || selectedParcel.surveyNo})
                  </span>
                )}
              </div>

              <GISMap
                parcels={parcels}
                selectedParcel={selectedParcel}
                onSelectParcel={handleSelectParcel}
                className="h-[420px]"
              />
            </div>

            {/* Desktop Table Registry */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                <span>Cadastral Parcel Registry</span>
                <span className="text-xs font-normal text-gray-500">
                  Showing {parcels.length} parcels
                </span>
              </h3>

              <DataTable
                columns={tableColumns}
                data={parcels}
                onRowClick={handleSelectParcel}
                emptyMessage="No land parcels available"
              />
            </div>

            {/* Mobile Cards Registry View */}
            <div className="block md:hidden space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Parcels Directory ({parcels.length})
              </h3>
              {parcels.map((parcel) => (
                <ParcelCard
                  key={parcel.id}
                  parcel={parcel}
                  isSelected={selectedParcel && selectedParcel.id === parcel.id}
                  onSelect={(p) => {
                    handleSelectParcel(p)
                    setActiveMobileTab('map')
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Selected Parcel Inspection Panel */}
          <div
            className={`lg:col-span-4 ${
              activeMobileTab === 'list' && 'hidden lg:block'
            }`}
          >
            {/* Map tab display on mobile */}
            <div className="block lg:hidden mb-4">
              <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4">
                <GISMap
                  parcels={parcels}
                  selectedParcel={selectedParcel}
                  onSelectParcel={handleSelectParcel}
                  className="h-[300px]"
                />
              </div>
            </div>

            <div className="sticky top-20 min-h-[500px]">
              <ParcelDetailPanel
                parcel={selectedParcel}
                onClose={() => setSelectedParcel(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
