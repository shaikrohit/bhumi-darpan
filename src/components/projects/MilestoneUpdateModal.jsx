import React, { useState, useEffect } from 'react'
import { CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { Modal, Button } from '../common'

export default function MilestoneUpdateModal({ isOpen, onClose, onConfirm, milestone }) {
  const [status, setStatus] = useState(milestone?.status || 'Pending')
  const [completionDate, setCompletionDate] = useState('')
  const [blockReason, setBlockReason] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (milestone) {
      setStatus(milestone.status || 'Pending')
      setCompletionDate(milestone.date || new Date().toISOString().split('T')[0])
      setBlockReason(milestone.note && milestone.status === 'Blocked' ? milestone.note : '')
    }
    setError('')
  }, [milestone, isOpen])

  if (!milestone) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (status === 'Blocked' && !blockReason.trim()) {
      setError('Please provide a block reason explaining the delay or issue.')
      return
    }

    setSubmitting(true)
    try {
      await onConfirm(milestone.id, {
        status,
        date: status === 'Completed' ? completionDate : milestone.date,
        note: status === 'Blocked' ? blockReason : milestone.note,
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update milestone')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Milestone: ${milestone.name}`}
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={submitting}>
            Save Milestone Status
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="milestone-status-select" className="block font-semibold text-gray-700 mb-1">
            Milestone Progress Status *
          </label>
          <select
            id="milestone-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        {status === 'Completed' && (
          <div>
            <label htmlFor="completion-date-input" className="block font-semibold text-gray-700 mb-1">
              Completion Date *
            </label>
            <input
              id="completion-date-input"
              type="date"
              required
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        )}

        {status === 'Blocked' && (
          <div>
            <label htmlFor="block-reason-input" className="block font-semibold text-red-700 mb-1">
              Block Reason / Bottleneck Explanation *
            </label>
            <textarea
              id="block-reason-input"
              rows={3}
              required
              placeholder="e.g. Awaiting cadastral survey verification or court clarification..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="w-full p-2 border border-red-300 bg-red-50/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        )}
      </form>
    </Modal>
  )
}
