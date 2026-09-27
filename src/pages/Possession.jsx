import React, { useState } from 'react';
import { Landmark, CheckCircle2, Circle, Clock, Shield, Banknote, Users, Scale, ChevronRight, Search } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { possessionRecords } from '../data/mockData';

const Possession = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredRecords = possessionRecords?.filter(record => 
    record.parcelId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.projectId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.village?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalParcels = possessionRecords?.length || 0;
  const readyParcels = possessionRecords?.filter(r => r.handoverStatus === 'Ready').length || 0;
  const completedParcels = possessionRecords?.filter(r => r.handoverStatus === 'Completed').length || 0;
  const pendingParcels = possessionRecords?.filter(r => r.handoverStatus === 'Pending').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Possession Tracking</h1>
        <p className="text-gray-500">Monitor milestone completion and possession readiness</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-gray-500 mb-2">
            <Landmark className="w-5 h-5 mr-2" />
            <span>Total Parcels</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalParcels}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-green-600 mb-2">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span>Possession Ready</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{readyParcels}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-blue-600 mb-2">
            <Shield className="w-5 h-5 mr-2" />
            <span>Completed</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{completedParcels}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-amber-500 mb-2">
            <Clock className="w-5 h-5 mr-2" />
            <span>Pending</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{pendingParcels}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${selectedRecord ? 'lg:w-2/3' : 'w-full'}`}>
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Possession List</h2>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search parcels..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-medium text-gray-600 text-sm">Parcel ID</th>
                  <th className="p-4 font-medium text-gray-600 text-sm">Project ID</th>
                  <th className="p-4 font-medium text-gray-600 text-sm">Village</th>
                  <th className="p-4 font-medium text-gray-600 text-sm">District</th>
                  <th className="p-4 font-medium text-gray-600 text-sm">Area</th>
                  <th className="p-4 font-medium text-gray-600 text-sm">Status</th>
                  <th className="p-4 font-medium text-gray-600 text-sm"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr 
                    key={record.id} 
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedRecord?.id === record.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedRecord(record)}
                  >
                    <td className="p-4 font-medium text-blue-600">{record.parcelId}</td>
                    <td className="p-4 text-gray-700">{record.projectId}</td>
                    <td className="p-4 text-gray-700">{record.village}</td>
                    <td className="p-4 text-gray-700">{record.district}</td>
                    <td className="p-4 text-gray-700">{record.area}</td>
                    <td className="p-4">
                      <StatusBadge status={record.handoverStatus} />
                    </td>
                    <td className="p-4 text-gray-400">
                      <ChevronRight className="w-5 h-5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedRecord && (
          <div className="lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Possession Checklist</h3>
              <button onClick={() => setSelectedRecord(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Parcel</div>
                <div className="font-semibold text-gray-900 text-lg">{selectedRecord.parcelId}</div>
                <div className="text-sm text-gray-600 mt-1">Owner: {selectedRecord.ownerName || 'Unknown'}</div>
                {selectedRecord.possessionDate && (
                  <div className="text-sm text-gray-600 mt-1">Scheduled: {selectedRecord.possessionDate}</div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Required Milestones</h4>
                
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Scale className="w-5 h-5 text-gray-500" />
                    <span className={selectedRecord.milestones?.awardCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'}>Award Completed</span>
                  </div>
                  {selectedRecord.milestones?.awardCompleted ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Banknote className="w-5 h-5 text-gray-500" />
                    <span className={selectedRecord.milestones?.compensationCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'}>Compensation Completed</span>
                  </div>
                  {selectedRecord.milestones?.compensationCompleted ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className={selectedRecord.milestones?.rrCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'}>R&R Completed</span>
                  </div>
                  {selectedRecord.milestones?.rrCompleted ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <span className={selectedRecord.milestones?.legalCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'}>Legal Approvals Completed</span>
                  </div>
                  {selectedRecord.milestones?.legalCompleted ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-lg border ${
                selectedRecord.milestones?.awardCompleted && 
                selectedRecord.milestones?.compensationCompleted && 
                selectedRecord.milestones?.rrCompleted && 
                selectedRecord.milestones?.legalCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${
                    selectedRecord.milestones?.awardCompleted && 
                    selectedRecord.milestones?.compensationCompleted && 
                    selectedRecord.milestones?.rrCompleted && 
                    selectedRecord.milestones?.legalCompleted 
                      ? 'text-green-800' 
                      : 'text-gray-600'
                  }`}>Possession Ready</span>
                  {selectedRecord.milestones?.awardCompleted && 
                  selectedRecord.milestones?.compensationCompleted && 
                  selectedRecord.milestones?.rrCompleted && 
                  selectedRecord.milestones?.legalCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Possession;
