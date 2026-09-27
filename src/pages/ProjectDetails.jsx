import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Building2, Users, FileText, CheckCircle2, Clock, Circle, ChevronDown } from 'lucide-react';
import { projects, parcels } from '../data/mockData.js';
import StatusBadge from '../components/StatusBadge.jsx';

const LIFECYCLE_STAGES = [
  'Proposal',
  'Submission',
  'Verification',
  'Approval',
  'Notification',
  'Award',
  'Compensation & R&R',
  'Possession',
  'Closure'
];

export default function ProjectDetails() {
  const { projectId } = useParams();
  
  // Find project
  const project = projects.find((p) => p.id === projectId);
  
  // Related parcels
  const projectParcels = parcels.filter((p) => p.projectId === projectId);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-slate-400 mb-4">
          <FileText className="w-16 h-16" />
        </div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Project Not Found</h2>
        <p className="text-slate-500 mb-6">The project ID you requested does not exist or has been removed.</p>
        <Link to="/projects" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>
    );
  }

  // Calculate timeline states
  const currentStageIndex = LIFECYCLE_STAGES.indexOf(project.currentStage) !== -1 
    ? LIFECYCLE_STAGES.indexOf(project.currentStage) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header and Back Button */}
      <div>
        <Link to="/projects" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-slate-500 mt-1">Project ID: {project.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              Download Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Edit Project
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Compensation</p>
              <p className="text-2xl font-bold text-slate-900">{project.compensation || '₹0'}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">Total Land Required</p>
              <p className="text-2xl font-bold text-slate-900">{project.totalLand || '0'} Hectares</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500 mb-1">R&R Progress</p>
              <p className="text-2xl font-bold text-slate-900">
                {project.rrCompleted || 0} <span className="text-sm font-normal text-slate-500">/ {project.rrTotal || 0} Families</span>
              </p>
            </div>
          </div>

          {/* Project Overview Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800">Project Overview</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-6">{project.description || 'No description provided for this project.'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Executing Authority</p>
                    <p className="text-sm text-slate-900 font-medium">{project.authority || 'NHAI'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Location</p>
                    <p className="text-sm text-slate-900 font-medium">{project.district}{project.villages ? `, ${project.villages}` : ''}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Start Date</p>
                    <p className="text-sm text-slate-900 font-medium">{project.startDate || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Expected Completion</p>
                    <p className="text-sm text-slate-900 font-medium">{project.expectedEndDate || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Affected Parcels</p>
                    <p className="text-sm text-slate-900 font-medium">{project.parcels || projectParcels.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Parcels Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Affected Land Parcels</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {projectParcels.length} Total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parcel ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {projectParcels.length > 0 ? (
                    projectParcels.map((parcel) => (
                      <tr key={parcel.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          <Link to={`/parcels/${parcel.id}`}>{parcel.id}</Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{parcel.ownerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{parcel.area} Hectares</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={parcel.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                        No parcels have been associated with this project yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Lifecycle Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-800">Lifecycle Timeline</h2>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul role="list" className="-mb-8">
                  {LIFECYCLE_STAGES.map((stage, stageIdx) => {
                    const isCompleted = stageIdx < currentStageIndex;
                    const isCurrent = stageIdx === currentStageIndex;
                    const isLast = stageIdx === LIFECYCLE_STAGES.length - 1;

                    return (
                      <li key={stage}>
                        <div className="relative pb-8">
                          {!isLast && (
                            <span
                              className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${
                                isCompleted ? 'bg-green-500' : 'bg-slate-200'
                              }`}
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  isCompleted
                                    ? 'bg-green-500'
                                    : isCurrent
                                    ? 'bg-blue-100'
                                    : 'bg-slate-100'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-white" aria-hidden="true" />
                                ) : isCurrent ? (
                                  <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                                  </span>
                                ) : (
                                  <Circle className="w-3 h-3 text-slate-300" aria-hidden="true" />
                                )}
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-500'
                                  }`}
                                >
                                  {stage}
                                </p>
                                {isCurrent && (
                                  <p className="text-xs text-blue-600 font-medium mt-1">Current Stage</p>
                                )}
                              </div>
                              <div className="whitespace-nowrap text-right text-xs text-slate-500">
                                {(isCompleted || isCurrent) && project.lastUpdated && (
                                  <time dateTime={project.lastUpdated}>{project.lastUpdated}</time>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
