import React from 'react'
import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react'
import { districts, STAGES } from '../../data/mockData.js'

export default function ProjectFilters({
  search,
  onSearchChange,
  district,
  onDistrictChange,
  status,
  onStatusChange,
  stage,
  onStageChange,
  sortBy,
  onSortByChange,
  onReset,
  totalResults,
}) {
  const isFiltered = search || district !== 'All' || status !== 'All' || stage !== 'All' || sortBy !== 'name'

  return (
    <div className="p-4 bg-gray-50/70 border-b border-gray-200 space-y-3">
      {/* Top row: Search & Result Count */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          <label htmlFor="project-search-input" className="sr-only">Search Projects</label>
          <input
            id="project-search-input"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ID, Name, District, Authority..."
            className="w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-bold text-gray-700 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-2xs">
            {totalResults} {totalResults === 1 ? 'Project Found' : 'Projects'}
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-red-600 bg-white border border-gray-300 hover:border-red-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Dropdown Filter Controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
        {/* District Filter */}
        <div className="flex items-center gap-1">
          <label htmlFor="filter-district" className="font-semibold text-gray-700 sr-only sm:not-sr-only">District:</label>
          <select
            id="filter-district"
            aria-label="Filter by District"
            value={district}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white py-1.5 px-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Districts</option>
            {districts.filter(d => d !== 'All Districts').map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          <label htmlFor="filter-status" className="font-semibold text-gray-700 sr-only sm:not-sr-only">Status:</label>
          <select
            id="filter-status"
            aria-label="Filter by Status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white py-1.5 px-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="At Risk">At Risk</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Lifecycle Stage Filter */}
        <div className="flex items-center gap-1">
          <label htmlFor="filter-stage" className="font-semibold text-gray-700 sr-only sm:not-sr-only">Stage:</label>
          <select
            id="filter-stage"
            aria-label="Filter by Acquisition Stage"
            value={stage}
            onChange={(e) => onStageChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white py-1.5 px-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-1 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
          <label htmlFor="filter-sort" className="font-semibold text-gray-700 sr-only sm:not-sr-only">Sort:</label>
          <select
            id="filter-sort"
            aria-label="Sort Projects By"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white py-1.5 px-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="name">Project Name</option>
            <option value="progress">Progress %</option>
            <option value="lastUpdated">Last Updated</option>
          </select>
        </div>
      </div>
    </div>
  )
}
