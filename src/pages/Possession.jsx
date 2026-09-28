import React, { useState, useEffect } from 'react'
import { Landmark, CheckCircle2, Circle, Clock, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react'
import { PageHeader, Card, StatusBadge, StatCard } from '../components/common'
import { DataTable, LoadingState } from '../components/ui'
import { getPossessionRecords } from '../services/mockService'

export default function Possession() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    let isMounted = true
    getPossessionRecords().then((res) => {
      if (isMounted) {
        setRecords(res.data || [])
        if (res.data?.length > 0) setSelectedRecord(res.data[0])
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [])

  if (loading) return <LoadingState message="Loading possession records..." />

  const columns = [
    { key: 'parcelId', label: 'PARCEL ID', render: (r) => <span className="font-semibold text-blue-600">{r.parcelId}</span> },
    { key: 'projectId', label: 'PROJECT' },
    { key: 'village', label: 'VILLAGE' },
    { key: 'owner', label: 'OWNER', render: (r) => r.owner || r.ownerName || '—' },
    { key: 'area', label: 'AREA' },
    { key: 'possessionDate', label: 'TARGET DATE' },
    { key: 'handoverStatus', label: 'HANDOVER STATUS', render: (r) => <StatusBadge status={r.handoverStatus} dot /> },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Land Possession & Handover Tracking"
        subtitle="Verification of prerequisite statutory milestones required prior to physical land possession"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Possession' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Parcels Ready for Possession" value="118 Parcels" subtitle="All prerequisites cleared" icon={Landmark} iconColor="text-emerald-600" />
        <StatCard title="Awaiting Compensation" value="32 Parcels" subtitle="Payment pending disbursement" icon={Clock} iconColor="text-amber-600" />
        <StatCard title="Total Handed Over" value="86 Parcels" subtitle="Possession certificate issued" icon={CheckCircle2} iconColor="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Possession Milestone Directory" padding="none">
            <DataTable
              columns={columns}
              data={records}
              onRowClick={(r) => setSelectedRecord(r)}
              emptyMessage="No possession records."
            />
          </Card>
        </div>

        {/* Milestone Verification Checklist */}
        {selectedRecord && (
          <Card title={`Milestone Checklist: ${selectedRecord.parcelId}`} subtitle="Statutory prerequisites for possession certificate">
            <div className="space-y-4 mt-2">
              <div className="p-3 bg-gray-50 rounded-xl border flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Handover Status</span>
                <StatusBadge status={selectedRecord.handoverStatus} dot />
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Prerequisite Milestones</h4>
                {[
                  { label: 'Award Declaration (Sec 23)', done: selectedRecord.awardCompleted ?? true },
                  { label: 'Compensation Disbursement', done: selectedRecord.compensationCompleted ?? true },
                  { label: 'R&R Resettlement Clearance', done: selectedRecord.rrCompleted ?? false },
                  { label: 'Legal & Dispute Approvals', done: selectedRecord.legalApprovals ?? selectedRecord.legalCompleted ?? true },
                ].map((m, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center gap-3 ${m.done ? 'bg-emerald-50/60 border-emerald-100 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    {m.done ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <Circle className="w-5 h-5 text-gray-300 shrink-0" />}
                    <span className="text-xs font-semibold flex-1">{m.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.done ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                      {m.done ? 'Cleared' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
