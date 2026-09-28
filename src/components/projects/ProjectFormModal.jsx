import React, { useState, useEffect } from 'react'
import { FolderKanban, X, AlertCircle } from 'lucide-react'
import { Modal, Button } from '../common'
import { districts } from '../../data/mockData.js'

export default function ProjectFormModal({ isOpen, onClose, onSubmit, initialData = null, isEditing = false }) {
  const [formData, setFormData] = useState({
    name: '',
    authority: '',
    projectType: 'Highway',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    tehsil: '',
    village: '',
    landRequired: '',
    parcels: '15',
    expectedCompletion: '',
    description: '',
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        name: initialData.name || '',
        authority: initialData.authority || '',
        projectType: initialData.projectType || 'Highway',
        state: initialData.state || 'Andhra Pradesh',
        district: initialData.district || 'Guntur',
        tehsil: initialData.tehsil || '',
        village: initialData.village || '',
        landRequired: initialData.landRequired || '',
        parcels: String(initialData.parcels || initialData.affectedParcels || '15'),
        expectedCompletion: initialData.expectedCompletion || initialData.expectedEnd || '',
        description: initialData.description || '',
      })
    } else {
      setFormData({
        name: '',
        authority: '',
        projectType: 'Highway',
        state: 'Andhra Pradesh',
        district: 'Guntur',
        tehsil: '',
        village: '',
        landRequired: '',
        parcels: '15',
        expectedCompletion: '',
        description: '',
      })
    }
    setErrors({})
  }, [initialData, isEditing, isOpen])

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Project Name is required'
    if (!formData.authority.trim()) errs.authority = 'Executing Authority is required'
    if (!formData.state.trim()) errs.state = 'State is required'
    if (!formData.district.trim()) errs.district = 'District is required'
    if (!formData.landRequired.trim()) errs.landRequired = 'Land Required is required'
    if (!formData.projectType) errs.projectType = 'Project Type is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      setErrors({ form: err.message || 'Operation failed' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Project: ${initialData?.id}` : 'New Land Acquisition Project'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={submitting}>
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Project Name */}
          <div className="sm:col-span-2">
            <label htmlFor="form-project-name" className="block text-xs font-semibold text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              id="form-project-name"
              type="text"
              required
              placeholder="e.g. NH-16 Expansion Phase 3"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full rounded-lg border p-2 text-xs focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-500/20'
              }`}
            />
            {errors.name && <p className="text-[11px] text-red-600 mt-0.5">{errors.name}</p>}
          </div>

          {/* Executing Authority */}
          <div>
            <label htmlFor="form-authority" className="block text-xs font-semibold text-gray-700 mb-1">
              Executing Authority *
            </label>
            <input
              id="form-authority"
              type="text"
              required
              placeholder="e.g. NHAI / Irrigation Dept"
              value={formData.authority}
              onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
              className={`w-full rounded-lg border p-2 text-xs focus:outline-none focus:ring-2 ${
                errors.authority ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-500/20'
              }`}
            />
            {errors.authority && <p className="text-[11px] text-red-600 mt-0.5">{errors.authority}</p>}
          </div>

          {/* Project Type */}
          <div>
            <label htmlFor="form-project-type" className="block text-xs font-semibold text-gray-700 mb-1">
              Project Type *
            </label>
            <select
              id="form-project-type"
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Highway">Highway</option>
              <option value="Railway">Railway</option>
              <option value="Irrigation">Irrigation</option>
              <option value="Industrial">Industrial</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label htmlFor="form-state" className="block text-xs font-semibold text-gray-700 mb-1">
              State *
            </label>
            <input
              id="form-state"
              type="text"
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* District */}
          <div>
            <label htmlFor="form-district" className="block text-xs font-semibold text-gray-700 mb-1">
              District *
            </label>
            <select
              id="form-district"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {districts.filter(d => d !== 'All Districts').map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Tehsil / Mandal */}
          <div>
            <label htmlFor="form-tehsil" className="block text-xs font-semibold text-gray-700 mb-1">
              Tehsil / Mandal
            </label>
            <input
              id="form-tehsil"
              type="text"
              placeholder="e.g. Tenali Mandal"
              value={formData.tehsil}
              onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Village */}
          <div>
            <label htmlFor="form-village" className="block text-xs font-semibold text-gray-700 mb-1">
              Primary Village / Area
            </label>
            <input
              id="form-village"
              type="text"
              placeholder="e.g. Ramapuram, Chebrolu"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Land Required */}
          <div>
            <label htmlFor="form-land" className="block text-xs font-semibold text-gray-700 mb-1">
              Land Required (Acres) *
            </label>
            <input
              id="form-land"
              type="text"
              required
              placeholder="e.g. 124.5 acres"
              value={formData.landRequired}
              onChange={(e) => setFormData({ ...formData, landRequired: e.target.value })}
              className={`w-full rounded-lg border p-2 text-xs focus:outline-none focus:ring-2 ${
                errors.landRequired ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-blue-500/20'
              }`}
            />
            {errors.landRequired && <p className="text-[11px] text-red-600 mt-0.5">{errors.landRequired}</p>}
          </div>

          {/* Expected Completion Date */}
          <div>
            <label htmlFor="form-expected" className="block text-xs font-semibold text-gray-700 mb-1">
              Expected Completion Date
            </label>
            <input
              id="form-expected"
              type="date"
              value={formData.expectedCompletion}
              onChange={(e) => setFormData({ ...formData, expectedCompletion: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label htmlFor="form-description" className="block text-xs font-semibold text-gray-700 mb-1">
              Project Overview & Description
            </label>
            <textarea
              id="form-description"
              rows={3}
              placeholder="Brief description of the land acquisition project scope..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}
