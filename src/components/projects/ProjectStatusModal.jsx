import React, { useState } from 'react'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { Modal, Button } from '../common'

export default function ProjectStatusModal({ isOpen, onClose, onConfirm, project }) {
  const [selectedStatus, setSelectedStatus] = useState(project?.status || 'On Track')
  const [submitting, setSubmitting] = useState(false)

  if (!project) return null

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      await onConfirm(selectedStatus)
      onClose()
    } catch {
      // Handled by parent
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Project Status: ${project.id}`}
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirm} loading={submitting}>
            Confirm Status Update
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <p className="text-gray-600 leading-relaxed">
          Change operational status for <strong className="text-gray-900">{project.name}</strong> ({project.id}):
        </p>

        <div className="grid grid-cols-2 gap-3">
          {[
            { status: 'On Track', desc: 'Project proceeding as per timeline', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
            { status: 'At Risk', desc: 'Minor delays or milestone risk', color: 'border-amber-300 bg-amber-50 text-amber-900' },
            { status: 'Delayed', desc: 'Significant bottleneck or court stay', color: 'border-red-300 bg-red-50 text-red-900' },
            { status: 'Completed', desc: 'Acquisition & possession finished', color: 'border-blue-300 bg-blue-50 text-blue-900' },
          ].map((item) => (
            <button
              key={item.status}
              type="button"
              onClick={() => setSelectedStatus(item.status)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedStatus === item.status ? `ring-2 ring-blue-500 font-bold ${item.color}` : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <p className="font-bold">{item.status}</p>
              <p className="text-[10px] opacity-80 mt-0.5">{item.desc}</p>
            </button>
          ))}
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900 text-[11px]">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Are you sure you want to update status for <strong>{project.id}</strong> to <strong>"{selectedStatus}"</strong>? This will update operational dashboards.
          </span>
        </div>
      </div>
    </Modal>
  )
}
