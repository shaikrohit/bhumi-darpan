import React from 'react'
import { RotateCcw, Filter } from 'lucide-react'
import { SearchField } from '../ui'
import { Button } from '../common'
import { getDistricts } from '../../services/mockService'

const VILLAGES = ['Ramapuram', 'Chebrolu', 'Ibrahimpatnam', 'Atchutapuram', 'Rambilli', 'Renigunta', 'Mangalagiri', 'Undavalli', 'Ongole']
const LAND_TYPES = ['Agricultural', 'Residential', 'Commercial', 'Government', 'Industrial']
const VERIFICATION_STATUSES = ['Verified', 'Pending', 'Needs Review']
const ACQUISITION_STATUSES = ['Not Started', 'Under Process', 'Awarded', 'Compensation Pending', 'Possession Ready', 'Acquired']
const PROJECTS = [
  { id: 'BD-P-001', name: 'NH-16 Expansion' },
  { id: 'BD-P-002', name: 'Nagarjuna Sagar Canal' },
  { id: 'BD-P-003', name: 'VCIC Industrial Corridor' },
  { id: 'BD-P-004', name: 'East Coast Railway Doubling' },
  { id: 'BD-P-006', name: 'Amaravati Ring Road' },
  { id: 'BD-P-007', name: 'Tirupati Airport Expansion' },
]

export default function ParcelFilters({
  filters = {},
  onFilterChange,
  onResetFilters,
  totalCount = 0,
}) {
  const districts = getDistricts()

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.district) ||
    Boolean(filters.village) ||
    Boolean(filters.landType) ||
    Boolean(filters.verificationStatus) ||
    Boolean(filters.acquisitionStatus) ||
    Boolean(filters.projectId)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="relative flex-1 max-w-md">
          <SearchField
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            onClear={() => handleChange('search', '')}
            placeholder="Search Parcel ID, ULPIN, Survey No, Village, Project ID..."
            label="Search Land Parcels"
          />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3">
          <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="text-navy-700 font-bold">{totalCount}</span> {totalCount === 1 ? 'Parcel Found' : 'Parcels Found'}
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={onResetFilters}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Select Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
        {/* District */}
        <div>
          <label htmlFor="parcel-district-select" className="block font-medium text-gray-700 mb-1">
            District
          </label>
          <select
            id="parcel-district-select"
            aria-label="Filter by District"
            value={filters.district || ''}
            onChange={(e) => handleChange('district', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Village */}
        <div>
          <label htmlFor="parcel-village-select" className="block font-medium text-gray-700 mb-1">
            Village
          </label>
          <select
            id="parcel-village-select"
            aria-label="Filter by Village"
            value={filters.village || ''}
            onChange={(e) => handleChange('village', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Villages</option>
            {VILLAGES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Land Type */}
        <div>
          <label htmlFor="parcel-landtype-select" className="block font-medium text-gray-700 mb-1">
            Land Type
          </label>
          <select
            id="parcel-landtype-select"
            aria-label="Filter by Land Type"
            value={filters.landType || ''}
            onChange={(e) => handleChange('landType', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Land Types</option>
            {LAND_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Verification Status */}
        <div>
          <label htmlFor="parcel-verification-select" className="block font-medium text-gray-700 mb-1">
            Verification
          </label>
          <select
            id="parcel-verification-select"
            aria-label="Filter by Verification Status"
            value={filters.verificationStatus || ''}
            onChange={(e) => handleChange('verificationStatus', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Verifications</option>
            {VERIFICATION_STATUSES.map((vs) => (
              <option key={vs} value={vs}>
                {vs}
              </option>
            ))}
          </select>
        </div>

        {/* Acquisition Status */}
        <div>
          <label htmlFor="parcel-acquisition-select" className="block font-medium text-gray-700 mb-1">
            Acquisition Status
          </label>
          <select
            id="parcel-acquisition-select"
            aria-label="Filter by Acquisition Status"
            value={filters.acquisitionStatus || ''}
            onChange={(e) => handleChange('acquisitionStatus', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Acquisition Statuses</option>
            {ACQUISITION_STATUSES.map((as) => (
              <option key={as} value={as}>
                {as}
              </option>
            ))}
          </select>
        </div>

        {/* Project */}
        <div>
          <label htmlFor="parcel-project-select" className="block font-medium text-gray-700 mb-1">
            Project
          </label>
          <select
            id="parcel-project-select"
            aria-label="Filter by Project"
            value={filters.projectId || ''}
            onChange={(e) => handleChange('projectId', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Projects</option>
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} ({p.name})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
