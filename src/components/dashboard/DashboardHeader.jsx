import React from 'react'
import { MapPin, Filter, Calendar, RefreshCw, Plus } from 'lucide-react'
import { districts } from '../../data/mockData.js'

export default function DashboardHeader({
  selectedDistrict,
  onDistrictChange,
  selectedStatus,
  onStatusChange,
  selectedTimePeriod,
  onTimePeriodChange,
  onRefresh,
  refreshing,
  onNewCase,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-gray-200">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Land Acquisition Dashboard
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 font-medium">
          Real-time monitoring of acquisition, compensation, R&R and possession
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* District Selector */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" aria-hidden="true" />
          <label htmlFor="dashboard-district-select" className="sr-only">Select District</label>
          <select
            id="dashboard-district-select"
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
          >
            <option value="All">All Districts</option>
            {districts.filter(d => d !== 'All Districts').map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
          <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" aria-hidden="true" />
          <label htmlFor="dashboard-status-select" className="sr-only">Select Status</label>
          <select
            id="dashboard-status-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="Delayed">Delayed</option>
            <option value="At Risk">At Risk</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" aria-hidden="true" />
          <label htmlFor="dashboard-time-select" className="sr-only">Select Time Period</label>
          <select
            id="dashboard-time-select"
            value={selectedTimePeriod}
            onChange={(e) => onTimePeriodChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
            <option value="This Year">This Year</option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh Dashboard Data"
          className="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : 'text-gray-500'}`} aria-hidden="true" />
          <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>

        {/* New Acquisition Case Button */}
        <button
          type="button"
          onClick={onNewCase}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>+ New Acquisition Case</span>
        </button>
      </div>
    </div>
  )
}
