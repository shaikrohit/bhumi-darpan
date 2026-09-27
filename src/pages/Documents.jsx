import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Search, Filter, FileText, Eye, Download, Clock, 
  ShieldCheck, FolderOpen, File, Upload, ChevronRight, 
  LayoutGrid, List as ListIcon, X
} from 'lucide-react';
import { documents as mockDocuments, documentCategories } from '../data/mockData.js';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Documents() {
  const { addToast } = useOutletContext() || {};
  const [documents, setDocuments] = useState(mockDocuments);
  const [activeCategory, setActiveCategory] = useState('All Documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: '', category: documentCategories[0] });

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesCategory = activeCategory === 'All Documents' || doc.category === activeCategory;
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.projectId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [documents, activeCategory, searchQuery]);

  // Counts
  const categoryCounts = useMemo(() => {
    const counts = { 'All Documents': documents.length };
    documentCategories.forEach(cat => {
      counts[cat] = documents.filter(d => d.category === cat).length;
    });
    return counts;
  }, [documents]);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.name) return;

    const newDoc = {
      id: `DOC-NEW-${Date.now()}`,
      name: uploadForm.name,
      type: uploadForm.category,
      category: uploadForm.category,
      projectId: 'N/A',
      parcelId: null,
      uploadDate: new Date().toISOString().split('T')[0],
      version: 'v1.0',
      verificationStatus: 'Pending',
      auditStatus: 'Pending',
      size: '0.0 MB'
    };

    setDocuments([newDoc, ...documents]);
    setIsUploadModalOpen(false);
    setUploadForm({ name: '', category: documentCategories[0] });
    
    if (addToast) {
      addToast({ title: 'Upload Successful', message: `${uploadForm.name} has been uploaded.`, type: 'success' });
    }
  };

  const openViewModal = (doc) => {
    setSelectedDoc(doc);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Documents</h1>
          <p className="text-slate-500 text-sm mt-1">
            Document management with version control and audit trail
          </p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Categories</h3>
            <div className="space-y-1">
              {['All Documents', ...documentCategories].map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                    activeCategory === category 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {category === 'All Documents' ? <FolderOpen className="w-4 h-4" /> : <File className="w-4 h-4" />}
                    <span className="truncate">{category}</span>
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeCategory === category ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {categoryCounts[category] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search documents by name or project..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex bg-slate-100 rounded-md p-1 border border-slate-200">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  title="List View"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Document Grid/List */}
          {filteredDocuments.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center shadow-sm">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No documents found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-900 truncate" title={doc.name}>{doc.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{doc.type}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Project:</span>
                      <span className="font-medium">{doc.projectId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Uploaded:</span>
                      <span>{doc.uploadDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Version:</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">{doc.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Size:</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-5">
                    <StatusBadge status={doc.verificationStatus} />
                    <StatusBadge status={doc.auditStatus} />
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => openViewModal(doc)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-sm font-medium transition-colors">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Document Name</th>
                      <th className="px-4 py-3 font-medium">Project</th>
                      <th className="px-4 py-3 font-medium">Date & Size</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDocuments.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <div>
                              <div className="font-medium text-slate-900">{doc.name}</div>
                              <div className="text-xs text-slate-500">{doc.type} • {doc.version}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{doc.projectId}</td>
                        <td className="px-4 py-3">
                          <div className="text-slate-700">{doc.uploadDate}</div>
                          <div className="text-xs text-slate-500">{doc.size}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1 items-start">
                            <StatusBadge status={doc.verificationStatus} />
                            {doc.auditStatus === 'Audited' && (
                              <span className="flex items-center gap-1 text-xs text-green-600">
                                <ShieldCheck className="w-3 h-3" /> Audited
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openViewModal(doc)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Download">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="History">
                              <Clock className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Document Modal */}
      {isViewModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">{selectedDoc.name}</h3>
                  <p className="text-xs text-slate-500">{selectedDoc.version} • {selectedDoc.uploadDate}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-6 bg-slate-100 overflow-y-auto">
              <div className="bg-white shadow-sm border border-slate-200 rounded p-8 min-h-[60vh] flex flex-col items-center justify-center text-center">
                <FileText className="w-16 h-16 text-slate-200 mb-4" />
                <h4 className="text-xl font-medium text-slate-400 mb-2">{selectedDoc.name}</h4>
                <p className="text-slate-400 max-w-md">
                  This is a mock preview of the document. In a real environment, an integrated PDF viewer or image renderer would display the actual file contents here.
                </p>
                
                <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-4 text-left text-sm bg-slate-50 p-6 rounded-lg border border-slate-100 w-full max-w-lg">
                  <div>
                    <span className="block text-slate-500 mb-1">Document ID</span>
                    <span className="font-medium text-slate-800">{selectedDoc.id}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Project ID</span>
                    <span className="font-medium text-slate-800">{selectedDoc.projectId}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Category</span>
                    <span className="font-medium text-slate-800">{selectedDoc.category}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">File Size</span>
                    <span className="font-medium text-slate-800">{selectedDoc.size}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Verification</span>
                    <StatusBadge status={selectedDoc.verificationStatus} />
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Audit Trail</span>
                    <StatusBadge status={selectedDoc.auditStatus} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm">
                <Download className="w-4 h-4" />
                Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-semibold text-lg text-slate-800">Upload Document</h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Document Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={uploadForm.name}
                    onChange={e => setUploadForm({...uploadForm, name: e.target.value})}
                    placeholder="e.g., Ownership Certificate - John Doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={uploadForm.category}
                    onChange={e => setUploadForm({...uploadForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {documentCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-700">Click to browse or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, DOCX, JPG, PNG up to 50MB</p>
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!uploadForm.name}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
