import React from 'react'
import { Banknote, Users, CheckCircle2, Clock } from 'lucide-react'
import Card from '../common/Card'

export default function CompensationSummary({ compensation = {}, rr = {} }) {
  return (
    <Card
      title="Compensation & R&R Overview"
      subtitle="Financial disbursement and rehabilitation entitlement tracking"
      icon={Banknote}
    >
      <div className="p-4 space-y-6">
        {/* Section A: Compensation Financial Breakdown */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            Land Compensation (₹ Crores)
          </h4>

          <div className="grid grid-cols-3 gap-3 text-center mb-3">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="text-[11px] font-semibold text-gray-500">Assessed</span>
              <p className="text-base font-extrabold text-gray-900 mt-0.5">{compensation.assessed || '₹42.8 Cr'}</p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[11px] font-semibold text-emerald-700">Disbursed</span>
              <p className="text-base font-extrabold text-emerald-900 mt-0.5">{compensation.disbursed || '₹24.2 Cr'}</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-[11px] font-semibold text-amber-700">Pending</span>
              <p className="text-base font-extrabold text-amber-900 mt-0.5">{compensation.pending || '₹18.6 Cr'}</p>
            </div>
          </div>

          {/* Visual Stacked Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span>Disbursed (56.5%)</span>
              <span>Pending (43.5%)</span>
            </div>
            <div className="h-2.5 w-full bg-amber-200 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-600" style={{ width: '56.5%' }} />
              <div className="h-full bg-amber-500" style={{ width: '43.5%' }} />
            </div>
          </div>
        </div>

        {/* Section B: Rehabilitation & Resettlement (R&R) */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            Rehabilitation & Resettlement (R&R)
          </h4>

          <div className="grid grid-cols-3 gap-3 text-center mb-3">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="text-[11px] font-semibold text-gray-500">Eligible Families</span>
              <p className="text-base font-extrabold text-gray-900 mt-0.5">{rr.eligible || 186}</p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="text-[11px] font-semibold text-purple-700">R&R Completed</span>
              <p className="text-base font-extrabold text-purple-900 mt-0.5">{rr.completed || 139}</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-[11px] font-semibold text-amber-700">R&R Pending</span>
              <p className="text-base font-extrabold text-amber-900 mt-0.5">{rr.pending || 47}</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span>Completed Families ({Math.round(((rr.completed || 139) / (rr.eligible || 186)) * 100)}%)</span>
              <span>Pending Families</span>
            </div>
            <div className="h-2.5 w-full bg-amber-200 rounded-full overflow-hidden flex">
              <div className="h-full bg-purple-600" style={{ width: `${Math.round(((rr.completed || 139) / (rr.eligible || 186)) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
