import React, { useState, useEffect } from 'react'
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Check, X, ArrowRight } from 'lucide-react'
import { PageHeader, Card, StatusBadge, Button } from '../components/common'
import { LoadingState } from '../components/ui'
import { getVerificationRecords } from '../services/mockService'

export default function Verification() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    let isMounted = true
    getVerificationRecords().then((res) => {
      if (isMounted) {
        setRecords(res.data || [])
        if (res.data?.length > 0) setSelectedRecord(res.data[0])
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [])

  if (loading) return <LoadingState message="Loading verification workspace..." />

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Verification Workspace"
        subtitle="Side-by-side cross validation of state land records, GIS spatial measurements, and uploaded documents"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Verification' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Queue List */}
        <Card title="Verification Queue" subtitle={`${records.length} pending records`} padding="none">
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {records.map((rec) => {
              const isSelected = selectedRecord?.parcelId === rec.parcelId
              return (
                <button
                  key={rec.parcelId}
                  type="button"
                  onClick={() => setSelectedRecord(rec)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-start justify-between cursor-pointer ${
                    isSelected ? 'bg-blue-50/60 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900">{rec.parcelId}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Survey: {rec.surveyNumber} • {rec.village}</p>
                    <p className="text-[11px] text-gray-400 mt-1">Owner: {rec.ownerName}</p>
                  </div>
                  <StatusBadge status={rec.status || 'Needs Review'} size="sm" />
                </button>
              )
            })}
          </div>
        </Card>

        {/* Right: Side-by-Side Comparison */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-6">
            <Card
              title={`Cross-Validation: Parcel ${selectedRecord.parcelId}`}
              subtitle={`Village: ${selectedRecord.village} • District: ${selectedRecord.district}`}
              action={<StatusBadge status={selectedRecord.status} dot />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* Panel 1: State Land Record Data */}
                <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 space-y-3">
                  <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">State Land Record Data</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div><span className="text-gray-500">Record Owner:</span> <span className="font-semibold text-gray-900">{selectedRecord.landRecord?.ownerName}</span></div>
                    <div><span className="text-gray-500">Recorded Area:</span> <span className="font-semibold text-gray-900">{selectedRecord.landRecord?.area}</span></div>
                    <div><span className="text-gray-500">Land Classification:</span> <span className="font-semibold text-gray-900">{selectedRecord.landRecord?.landType}</span></div>
                    <div><span className="text-gray-500">Encumbrance:</span> <span className="font-semibold text-gray-900">{selectedRecord.landRecord?.encumbrance || 'None'}</span></div>
                  </div>
                </div>

                {/* Panel 2: GIS & Document Evidence */}
                <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100 space-y-3">
                  <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">GIS & Uploaded Evidence</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div><span className="text-gray-500">GIS Measured Area:</span> <span className="font-semibold text-gray-900">{selectedRecord.gisData?.measuredArea}</span></div>
                    <div><span className="text-gray-500">Boundary Match:</span> <span className="font-semibold text-gray-900">{selectedRecord.gisData?.boundaryMatch}</span></div>
                    <div><span className="text-gray-500">Uploaded Deed Owner:</span> <span className="font-semibold text-gray-900">{selectedRecord.documentData?.ownerName}</span></div>
                    <div><span className="text-gray-500">Audit Status:</span> <span className="font-semibold text-emerald-700">{selectedRecord.documentData?.auditStatus || 'Verified'}</span></div>
                  </div>
                </div>
              </div>

              {/* Validation Checkpoints */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Automated Validation Checkpoints</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Owner Identity Match', pass: selectedRecord.checks?.ownerMatch },
                    { label: 'GIS Area Measurement', pass: selectedRecord.checks?.areaMatch },
                    { label: 'Land Type Category', pass: selectedRecord.checks?.landTypeMatch },
                    { label: 'Document Authenticity', pass: selectedRecord.checks?.docMatch },
                    { label: 'Duplicate Check', pass: selectedRecord.checks?.duplicateCheck },
                  ].map((chk, i) => (
                    <div key={i} className={`p-3 rounded-lg border text-xs flex items-center justify-between ${chk.pass ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                      <span className="font-medium">{chk.label}</span>
                      {chk.pass ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
