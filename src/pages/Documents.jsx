import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FileText, Download, Eye, Upload, Filter, Search, CheckCircle2, Clock, X } from 'lucide-react'
import { PageHeader, Card, StatusBadge, Button } from '../components/common'
import { SearchField, DataTable, EmptyState, LoadingState } from '../components/ui'
import { getDocuments } from '../services/mockService'

export default function Documents() {
  const { addToast } = useOutletContext() || {}
  const [documentsList, setDocumentsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getDocuments({ category: selectedCategory === 'All' ? undefined : selectedCategory }).then((res) => {
      if (isMounted) {
        let filtered = res.data
        if (searchQuery) {
          filtered = filtered.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
        }
        setDocumentsList(filtered)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [selectedCategory, searchQuery])

  const handleUploadSubmit = (e) => {
    e.preventDefault()
    if (addToast) {
      addToast('Document uploaded successfully and queued for audit verification.', 'success')
    }
    setUploadModalOpen(false)
  }

  const columns = [
    {
      key: 'name',
      label: 'DOCUMENT NAME',
      render: (d) => (
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900">{d.name}</p>
            <p className="text-xs text-gray-500">{d.category} • {d.size}</p>
          </div>
        </div>
      ),
    },
    { key: 'projectId', label: 'PROJECT ID' },
    { key: 'version', label: 'VERSION' },
    { key: 'uploadDate', label: 'UPLOAD DATE' },
    { key: 'verification', label: 'STATUS', render: (d) => <StatusBadge status={d.verification || 'Verified'} dot /> },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (d) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setPreviewDoc(d); }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
            title="View document"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (addToast) addToast(`Downloading ${d.name}...`, 'info')
            }}
            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
            title="Download document"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Document Vault & Audit Trail"
        subtitle="Repository for land records, survey maps, Section 11 notifications, and compensation awards"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Documents' }]}
        actions={
          <Button icon={Upload} onClick={() => setUploadModalOpen(true)}>
            Upload Document
          </Button>
        }
      />

      <Card padding="none">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="w-full sm:w-80">
            <SearchField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search documents by name or project..."
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              aria-label="Filter by Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Land Records">Land Records</option>
              <option value="Ownership Documents">Ownership Documents</option>
              <option value="Cadastral Maps">Cadastral Maps</option>
              <option value="Notifications">Notifications</option>
              <option value="Awards">Awards</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={documentsList}
          loading={loading}
          emptyMessage="No documents found matching criteria."
        />
      </Card>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-900">{previewDoc.name}</h3>
              <button type="button" onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 bg-gray-50 border rounded-xl flex flex-col items-center justify-center text-center">
              <FileText className="w-12 h-12 text-blue-600 mb-2" />
              <p className="text-xs font-semibold text-gray-700">{previewDoc.category}</p>
              <p className="text-[11px] text-gray-500 mt-1">Version {previewDoc.version} • {previewDoc.size}</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setPreviewDoc(null)}>Close</Button>
              <Button size="sm" icon={Download} onClick={() => { setPreviewDoc(null); if (addToast) addToast(`Downloading ${previewDoc.name}...`, 'info') }}>Download</Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <form onSubmit={handleUploadSubmit} className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-900">Upload Land Document</h3>
              <button type="button" onClick={() => setUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Document Title *</label>
                <input required type="text" placeholder="e.g. Survey Map 142/3A" className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select className="w-full p-2 border rounded-lg text-sm">
                  <option>Land Records</option>
                  <option>Ownership Documents</option>
                  <option>Cadastral Maps</option>
                  <option>Notifications</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button variant="secondary" size="sm" onClick={() => setUploadModalOpen(false)}>Cancel</Button>
              <Button size="sm" type="submit">Upload File</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
