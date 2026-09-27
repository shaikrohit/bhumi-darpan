import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, FolderKanban, ChevronRight, ArrowUpDown } from 'lucide-react';
import { projects } from '../data/mockData.js';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  // Filter projects based on search and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-blue-600" />
          Projects
        </h1>
        <p className="text-slate-500 mt-1">Manage and track land acquisition projects across districts.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search by Project Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-500" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="Delayed">Delayed</option>
            <option value="At Risk">At Risk</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                    Project ID
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  District
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Parcels
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Current Stage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Compensation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  R&R Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {project.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {project.district}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {project.parcels}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {project.currentStage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-2 min-w-[80px]">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-600 font-medium">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                      {project.compensation || '₹0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {project.rrCompleted || 0} / {project.rrTotal || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-slate-500">
                    No projects found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProjects.length}</span> of <span className="font-medium">12</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-blue-50 text-sm font-medium text-blue-600">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
