import React, { useState } from 'react';
import { verificationRecords } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ChevronRight,
  FileText,
  Map,
  User,
  Ruler,
  TreePine,
  Search
} from 'lucide-react';

export default function Verification() {
  const [selectedRecord, setSelectedRecord] = useState(verificationRecords[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = verificationRecords.filter((rec) =>
    rec.parcelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCheckIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const checksList = [
    { key: 'ownerMatch', label: 'Owner Match' },
    { key: 'areaMatch', label: 'Area Match' },
    { key: 'landTypeMatch', label: 'Land Type Match' },
    { key: 'gisMatch', label: 'GIS Match' },
    { key: 'documentMatch', label: 'Document Match' },
    { key: 'duplicateCheck', label: 'Duplicate Check' },
    { key: 'encumbranceCheck', label: 'Encumbrance Check' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-blue-600" />
          Verification Workspace
        </h1>
        <p className="text-slate-500 mt-1">Cross-validate land records, GIS data, and documentation</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Record List */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="relative mb-4">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Parcel ID or Owner..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredRecords.map((record) => (
                <button
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedRecord?.id === record.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-900">{record.parcelId}</span>
                    <StatusBadge status={record.status} />
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><span className="font-medium">Survey No:</span> {record.surveyNo}</p>
                    <p><span className="font-medium">Village:</span> {record.village}</p>
                    <p><span className="font-medium">Owner:</span> {record.owner}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: Verification Detail */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          {selectedRecord ? (
            <>
              {/* Top Record Info Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Parcel {selectedRecord.parcelId}</h2>
                  <p className="text-slate-500">{selectedRecord.village}, {selectedRecord.district} District</p>
                </div>
                <StatusBadge status={selectedRecord.status} />
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Land Record Data */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-600" />
                    <h3 className="font-semibold text-slate-900">Land Record Data</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Area</p>
                      <p className="font-medium text-slate-900 flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-slate-400" />
                        {selectedRecord.landRecord.area}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Land Type</p>
                      <p className="font-medium text-slate-900 flex items-center gap-2">
                        <TreePine className="w-4 h-4 text-slate-400" />
                        {selectedRecord.landRecord.landType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Owner Name</p>
                      <p className="font-medium text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        {selectedRecord.landRecord.ownerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Encumbrance</p>
                      <p className="font-medium text-slate-900">{selectedRecord.landRecord.encumbrance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Tax Status</p>
                      <p className="font-medium text-slate-900">{selectedRecord.landRecord.taxPaid ? 'Paid' : 'Unpaid'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Last Transaction</p>
                      <p className="font-medium text-slate-900">{selectedRecord.landRecord.lastTransaction}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: GIS / Document Data */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
                    <Map className="w-5 h-5 text-slate-600" />
                    <h3 className="font-semibold text-slate-900">GIS & Document Data</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">GIS Measured Area</p>
                      <p className="font-medium text-slate-900">{selectedRecord.gisData.measuredArea}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Land Use</p>
                      <p className="font-medium text-slate-900">{selectedRecord.gisData.landUse}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Boundary Match</p>
                      <p className="font-medium text-slate-900">{selectedRecord.gisData.boundaryMatch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Coordinates & Elevation</p>
                      <p className="font-medium text-slate-900">{selectedRecord.gisData.coordinates} | {selectedRecord.gisData.elevationRange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Documents Available</p>
                      <ul className="text-sm font-medium text-slate-900 space-y-1">
                        <li>Ownership Doc: <span className="font-normal text-slate-600">{selectedRecord.documentData.ownershipDoc}</span></li>
                        <li>Survey Map: <span className="font-normal text-slate-600">{selectedRecord.documentData.surveyMap}</span></li>
                        <li>Tax Receipt: <span className="font-normal text-slate-600">{selectedRecord.documentData.taxReceipt}</span></li>
                        <li>Encumbrance Cert: <span className="font-normal text-slate-600">{selectedRecord.documentData.encumbranceCert}</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Checks */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Validation Checks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {checksList.map((check) => (
                    <div key={check.key} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      {renderCheckIcon(selectedRecord.checks[check.key])}
                      <span className="font-medium text-slate-700">{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remarks Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Remarks</h3>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {selectedRecord.remarks}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-end">
                <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Flag for Review
                </button>
                <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Request Survey
                </button>
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Approve Record
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-slate-500">
              <Eye className="w-12 h-12 mb-4 text-slate-300" />
              <p className="text-lg font-medium text-slate-900">No Record Selected</p>
              <p>Select a record from the list to view verification details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
