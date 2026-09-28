import React from 'react'
import { Link } from 'react-router-dom'
import {
  X,
  MapPin,
  Landmark,
  ShieldCheck,
  FileCheck,
  Banknote,
  ExternalLink,
  Layers,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { Badge, Button } from '../common'

function getStatusBadge(status, type = 'verification') {
  if (!status) return <Badge variant="neutral">N/A</Badge>

  if (type === 'verification') {
    if (status === 'Verified') return <Badge variant="success" dot>Verified</Badge>
    if (status === 'Needs Review') return <Badge variant="danger" dot>Needs Review</Badge>
    return <Badge variant="warning" dot>Pending</Badge>
  }

  if (type === 'acquisition') {
    if (status === 'Acquired' || status === 'Possession Ready') return <Badge variant="info">{status}</Badge>
    if (status === 'Compensation Pending') return <Badge variant="warning">{status}</Badge>
    if (status === 'Awarded') return <Badge variant="purple">{status}</Badge>
    if (status === 'Not Started') return <Badge variant="neutral">{status}</Badge>
    return <Badge variant="primary">{status}</Badge>
  }

  if (type === 'compensation') {
    if (status === 'Disbursed') return <Badge variant="success">Disbursed</Badge>
    return <Badge variant="warning">Pending</Badge>
  }

  return <Badge variant="neutral">{status}</Badge>
}

export default function ParcelDetailPanel({ parcel, onClose }) {
  if (!parcel) {
    return (
      <div className="h-full bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
        <MapPin className="w-10 h-10 text-gray-300 mb-3" />
        <h4 className="text-sm font-semibold text-gray-700">No Parcel Selected</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-xs">
          Select a land parcel from the directory list or GIS map to view cadastral records and acquisition context.
        </p>
      </div>
    )
  }

  const vStatus = parcel.verificationStatus || parcel.verification
  const aStatus = parcel.acquisitionStatus || parcel.status

  return (
    <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col text-xs">
      {/* Panel Header */}
      <div className="p-4 bg-navy-900 text-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm font-mono tracking-wide">{parcel.id}</h3>
            <span className="text-[10px] font-mono bg-navy-800 text-blue-200 px-2 py-0.5 rounded border border-navy-700">
              {parcel.ulpin}
            </span>
          </div>
          <p className="text-[11px] text-gray-300 mt-0.5">Survey No: {parcel.surveyNumber || parcel.surveyNo}</p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close Parcel Details"
            className="p-1.5 hover:bg-navy-800 rounded-lg text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-gray-100">
        {/* IDENTIFICATION */}
        <div className="space-y-2 pt-1">
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-navy-600" /> Identification
          </h4>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <div>
              <span className="text-gray-400 block text-[10px]">Parcel ID</span>
              <span className="font-mono font-bold text-gray-900">{parcel.id}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">ULPIN</span>
              <span className="font-mono font-semibold text-blue-700">{parcel.ulpin}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Survey Number</span>
              <span className="font-semibold text-gray-800">{parcel.surveyNumber || parcel.surveyNo}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Owner Reference</span>
              <span className="font-semibold text-gray-800">{parcel.ownerRef || parcel.owner}</span>
            </div>
          </div>
        </div>

        {/* LOCATION */}
        <div className="space-y-2 pt-3">
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-navy-600" /> Location & GIS
          </h4>
          <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-500">Village:</span>
              <span className="font-semibold text-gray-900">{parcel.village}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tehsil / Mandal:</span>
              <span className="font-semibold text-gray-900">{parcel.tehsil || parcel.mandal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">District & State:</span>
              <span className="font-semibold text-gray-900">
                {parcel.district}, {parcel.state}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200/60 pt-1.5 mt-1.5">
              <span className="text-gray-500">Geo Coordinates:</span>
              <span className="font-mono text-[11px] text-blue-700 font-medium">
                {parcel.latitude && parcel.longitude
                  ? `${parcel.latitude}° N, ${parcel.longitude}° E`
                  : parcel.geoCoords}
              </span>
            </div>
          </div>
        </div>

        {/* LAND */}
        <div className="space-y-2 pt-3">
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-navy-600" /> Land Particulars
          </h4>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <div>
              <span className="text-gray-400 block text-[10px]">Total Area</span>
              <span className="font-bold text-gray-900 text-sm">{parcel.area}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Land Category</span>
              <span className="font-semibold text-gray-800">{parcel.landType}</span>
            </div>
          </div>
        </div>

        {/* ACQUISITION CONTEXT */}
        <div className="space-y-2 pt-3">
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-navy-600" /> Acquisition Context
          </h4>
          <div className="space-y-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-400 block text-[10px]">Associated Project</span>
                <span className="font-bold text-navy-900">{parcel.projectId}</span>
                {parcel.projectName && <p className="text-[11px] text-gray-600 font-medium">{parcel.projectName}</p>}
              </div>

              {parcel.projectId && (
                <Link
                  to={`/projects/${parcel.projectId}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                >
                  View Project <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-blue-100 pt-2">
              <div>
                <span className="text-gray-400 block text-[10px]">Acquisition Stage</span>
                <span className="font-semibold text-gray-900">{parcel.acquisitionStage || 'Verification'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Acquisition Status</span>
                {getStatusBadge(aStatus, 'acquisition')}
              </div>
            </div>
          </div>
        </div>

        {/* VERIFICATION & AUDIT */}
        <div className="space-y-2 pt-3">
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-navy-600" /> Verification Status
          </h4>
          <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Land Record Verification:</span>
              {getStatusBadge(vStatus, 'verification')}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">GIS Cadastral Match:</span>
              {vStatus === 'Verified' ? (
                <Badge variant="success" size="sm">
                  100% Boundary Match
                </Badge>
              ) : vStatus === 'Needs Review' ? (
                <Badge variant="danger" size="sm">
                  Boundary Discrepancy
                </Badge>
              ) : (
                <Badge variant="warning" size="sm">
                  Verification Pending
                </Badge>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Document Verification:</span>
              <Badge variant={vStatus === 'Verified' ? 'success' : 'warning'} size="sm">
                {vStatus === 'Verified' ? 'Verified' : 'In Review'}
              </Badge>
            </div>
          </div>
        </div>

        {/* FINANCIAL & POSSESSION */}
        <div className="space-y-2 pt-3">
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-navy-600" /> Financial & Possession Summary
          </h4>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <div>
              <span className="text-gray-400 block text-[10px]">Compensation Status</span>
              {getStatusBadge(parcel.compensationStatus || 'Pending', 'compensation')}
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">R&R Resettlement</span>
              <span className="font-semibold text-gray-800">{parcel.rrStatus || 'Pending'}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Possession Status</span>
              <span className="font-semibold text-gray-800">{parcel.possessionStatus || 'Pending'}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px]">Affected Family ID</span>
              <span className="font-mono text-gray-700 font-semibold">{parcel.affectedFamilyId || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {parcel.projectId && (
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <Link to={`/projects/${parcel.projectId}`}>
            <Button variant="primary" size="sm" icon={ExternalLink} className="w-full justify-center">
              View Associated Acquisition Project ({parcel.projectId})
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
