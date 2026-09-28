import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Table2, Map, Layers, Navigation, Plus, Minus, X } from 'lucide-react'
import { PageHeader, Card, StatusBadge, Button } from '../components/common'
import { DataTable, SearchField, LoadingState } from '../components/ui'
import { getLandParcels } from '../services/mockService'

export default function Parcels() {
  const [activeTab, setActiveTab] = useState('table')
  const [parcelsList, setParcelsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getLandParcels({
      search: searchQuery,
      district: selectedDistrict === 'All' ? undefined : selectedDistrict,
      status: selectedStatus === 'All' ? undefined : selectedStatus,
    }).then((res) => {
      if (isMounted) {
        setParcelsList(res.data)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [searchQuery, selectedDistrict, selectedStatus])

  const columns = [
    { key: 'id', label: 'PARCEL ID', render: (p) => <span className="font-semibold text-blue-600">{p.id}</span> },
    { key: 'ulpin', label: 'ULPIN' },
    { key: 'surveyNumber', label: 'SURVEY NO.' },
    {
      key: 'location',
      label: 'LOCATION',
      render: (p) => (
        <div>
          <p className="font-medium text-gray-900">{p.village}</p>
          <p className="text-xs text-gray-500">{p.district} District</p>
        </div>
      ),
    },
    { key: 'area', label: 'AREA' },
    { key: 'landType', label: 'LAND TYPE' },
    { key: 'verification', label: 'VERIFICATION', render: (p) => <StatusBadge status={p.verification || 'Pending'} dot /> },
    { key: 'status', label: 'ACQUISITION STATUS', render: (p) => <StatusBadge status={p.status} /> },
  ]

  return (
    <div className="space-y-6 animate-fade-in relative">
      <PageHeader
        title="Land Parcels & Cadastral GIS"
        subtitle="GIS-enabled parcel management, survey validation, and boundary tracking"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Land Parcels' }]}
        actions={
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'table' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table2 className="w-4 h-4" /> Table View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'map' ? 'bg-white text-blue-600 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Map className="w-4 h-4" /> GIS Map View
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="w-full sm:w-80">
            <SearchField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search by Parcel ID, ULPIN, or Village..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select
              aria-label="Filter by District"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Districts</option>
              <option value="Guntur">Guntur</option>
              <option value="Krishna">Krishna</option>
              <option value="Visakhapatnam">Visakhapatnam</option>
              <option value="Prakasam">Prakasam</option>
            </select>

            <select
              aria-label="Filter by Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Acquired">Acquired</option>
              <option value="Under Verification">Under Verification</option>
              <option value="Under Acquisition">Under Acquisition</option>
            </select>
          </div>
        </div>

        {/* Tab Content: Table vs Map */}
        {activeTab === 'table' ? (
          <DataTable
            columns={columns}
            data={parcelsList}
            loading={loading}
            onRowClick={(parcel) => setSelectedParcel(parcel)}
            emptyMessage="No land parcels match your search."
          />
        ) : (
          <div className="relative h-[550px] bg-slate-900 rounded-b-xl overflow-hidden flex items-center justify-center">
            {/* SVG Interactive Mock GIS Map */}
            <svg className="w-full h-full" viewBox="0 0 1000 600">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="#0f172a" />
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Highway corridor */}
              <path d="M 50 450 Q 450 300 950 150" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="12 6" opacity="0.6" />
              <text x="500" y="270" fill="#f59e0b" fontSize="12" fontWeight="bold">NH-16 Expansion Corridor</text>

              {/* Parcels Layer */}
              {parcelsList.map((p, idx) => {
                const x = 120 + (idx % 4) * 200 + (idx * 15) % 40
                const y = 80 + Math.floor(idx / 4) * 150 + (idx * 20) % 30
                const isSelected = selectedParcel?.id === p.id

                return (
                  <g
                    key={p.id}
                    onClick={() => setSelectedParcel(p)}
                    className="cursor-pointer transition-all duration-200 hover:opacity-100"
                    opacity={isSelected ? 1 : 0.8}
                  >
                    <polygon
                      points={`${x},${y} ${x + 140},${y - 20} ${x + 160},${y + 90} ${x + 20},${y + 110}`}
                      fill={p.status === 'Acquired' ? '#16a34a' : p.verification === 'Verified' ? '#2563eb' : '#f59e0b'}
                      fillOpacity={isSelected ? 0.6 : 0.3}
                      stroke={isSelected ? '#ffffff' : '#94a3b8'}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                    <text x={x + 35} y={y + 50} fill="#ffffff" fontSize="11" fontWeight="bold" pointerEvents="none">
                      {p.surveyNumber}
                    </text>
                    <text x={x + 35} y={y + 68} fill="#cbd5e1" fontSize="9" pointerEvents="none">
                      {p.area}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Floating Map Legend */}
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-3 text-xs text-white space-y-2 shadow-lg">
              <p className="font-bold border-b border-slate-700 pb-1">GIS Map Layers</p>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-emerald-500/60 border border-emerald-400" /> Acquired Parcel
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-blue-500/60 border border-blue-400" /> Verified Parcel
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-amber-500/60 border border-amber-400" /> Under Verification
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Slide-in Parcel Detail Panel (Responsive) */}
      {selectedParcel && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-white shadow-2xl border-l border-gray-200 p-6 overflow-y-auto animate-slide-in-right">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{selectedParcel.id}</h3>
              <p className="text-xs text-gray-500">ULPIN: {selectedParcel.ulpin}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedParcel(null)}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <StatusBadge status={selectedParcel.status} />
              <StatusBadge status={selectedParcel.verification || 'Pending'} dot />
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Parcel Attributes</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Survey Number</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedParcel.surveyNumber}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Area</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedParcel.area}</p>
                </div>
                <div>
                  <span className="text-gray-500">Land Type</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedParcel.landType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Village</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedParcel.village}</p>
                </div>
                <div>
                  <span className="text-gray-500">District</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedParcel.district}</p>
                </div>
                <div>
                  <span className="text-gray-500">Owner Name</span>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedParcel.owner}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
