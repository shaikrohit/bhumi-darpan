import React from 'react'
import { MapPin, Eye, FileText, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
import { Badge, Button } from '../common'

function getVerificationBadgeVariant(status) {
  if (status === 'Verified') return 'success'
  if (status === 'Needs Review') return 'danger'
  return 'warning'
}

function getAcquisitionBadgeVariant(status) {
  if (status === 'Acquired' || status === 'Possession Ready') return 'info'
  if (status === 'Compensation Pending') return 'warning'
  if (status === 'Awarded') return 'purple'
  if (status === 'Not Started') return 'neutral'
  return 'primary'
}

export default function ParcelCard({ parcel, isSelected, onSelect }) {
  if (!parcel) return null

  return (
    <div
      onClick={() => onSelect && onSelect(parcel)}
      className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 font-mono text-sm">{parcel.id}</span>
            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 font-semibold">
              {parcel.ulpin}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Survey No: <span className="font-semibold text-gray-700">{parcel.surveyNumber || parcel.surveyNo}</span>
          </p>
        </div>

        <Badge variant={getVerificationBadgeVariant(parcel.verificationStatus || parcel.verification)} size="sm" dot>
          {parcel.verificationStatus || parcel.verification}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs py-2 my-2 border-y border-gray-100 text-gray-600">
        <div>
          <span className="text-gray-400 block text-[10px]">Village & District</span>
          <span className="font-medium text-gray-800 truncate block">
            {parcel.village}, {parcel.district}
          </span>
        </div>
        <div>
          <span className="text-gray-400 block text-[10px]">Area ({parcel.landType})</span>
          <span className="font-medium text-gray-800 block">{parcel.area}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <Badge variant={getAcquisitionBadgeVariant(parcel.acquisitionStatus || parcel.status)} size="sm">
          {parcel.acquisitionStatus || parcel.status}
        </Badge>

        <Button
          variant={isSelected ? 'primary' : 'secondary'}
          size="sm"
          icon={Eye}
          onClick={(e) => {
            e.stopPropagation()
            onSelect && onSelect(parcel)
          }}
        >
          View Parcel
        </Button>
      </div>
    </div>
  )
}
