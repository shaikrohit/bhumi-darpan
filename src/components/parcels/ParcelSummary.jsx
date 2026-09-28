import React from 'react'
import { ShieldCheck, FileText, AlertTriangle, Layers } from 'lucide-react'

export default function ParcelSummary({ stats = {}, totalCount = 0 }) {
  const verifiedPct = stats.gisVerifiedPct ?? 82
  const recordPct = stats.recordVerifiedPct ?? 76
  const reviewPct = stats.needsReviewPct ?? 12

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] text-gray-500 block font-medium">GIS Boundary Verified</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gray-900">{verifiedPct}%</span>
            <span className="text-[10px] font-semibold text-emerald-600">({stats.verified ?? 18} parcels)</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] text-gray-500 block font-medium">Record Verification</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gray-900">{recordPct}%</span>
            <span className="text-[10px] font-semibold text-blue-600">Verified</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <div className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-100">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] text-gray-500 block font-medium">Needs Review</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-red-600">{reviewPct}%</span>
            <span className="text-[10px] font-semibold text-red-600">({stats.needsReview ?? 3} cases)</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] text-gray-500 block font-medium">Total Registered Parcels</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gray-900">{totalCount}</span>
            <span className="text-[10px] font-semibold text-purple-600">Cadastral</span>
          </div>
        </div>
      </div>
    </div>
  )
}
