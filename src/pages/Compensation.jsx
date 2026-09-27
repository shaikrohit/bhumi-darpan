import React, { useState } from 'react';
import { beneficiaries } from '../data/mockData.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { 
  Banknote, 
  Users, 
  Home, 
  Search, 
  Filter, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';

const compData = [
  { name: 'Disbursed', value: 14.8, color: '#16a34a' },
  { name: 'Pending', value: 3.2, color: '#f59e0b' },
  { name: 'Verification Required', value: 0.6, color: '#dc2626' }
];

const rrData = [
  { name: 'Completed', value: 32, color: '#16a34a' },
  { name: 'In Progress', value: 3, color: '#2563eb' },
  { name: 'Pending', value: 12, color: '#f59e0b' }
];

export default function Compensation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [compStatusFilter, setCompStatusFilter] = useState('All');
  const [rrStatusFilter, setRrStatusFilter] = useState('All');

  // Safely default to empty array if beneficiaries isn't available
  const safeBeneficiaries = Array.isArray(beneficiaries) ? beneficiaries : [];

  const filteredBeneficiaries = safeBeneficiaries.filter(b => {
    const matchesSearch = 
      (b.name && b.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.familyId && b.familyId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.village && b.village.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesComp = compStatusFilter === 'All' || b.compStatus === compStatusFilter;
    const matchesRr = rrStatusFilter === 'All' || b.rrStatus === rrStatusFilter;
    
    return matchesSearch && matchesComp && matchesRr;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Compensation & R&R</h1>
        <p className="text-slate-500">Track compensation disbursement and rehabilitation progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Compensation Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center">
              <Banknote className="w-5 h-5 mr-2 text-blue-600" />
              Compensation Overview
            </h2>
            <div className="text-sm text-slate-500 font-medium">Total Assessed: ₹18.6 Cr</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-md">
              <div className="text-sm text-slate-500 mb-1 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" /> Disbursed
              </div>
              <div className="text-xl font-bold text-slate-900">₹14.8 Cr</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-md">
              <div className="text-sm text-slate-500 mb-1 flex items-center">
                <Clock className="w-4 h-4 mr-1 text-amber-500" /> Pending
              </div>
              <div className="text-xl font-bold text-slate-900">₹3.2 Cr</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-md col-span-2">
              <div className="text-sm text-slate-500 mb-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 text-red-600" /> Verification Required
              </div>
              <div className="text-xl font-bold text-slate-900">₹0.6 Cr</div>
            </div>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `₹${value} Cr`} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {compData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* R&R Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center">
              <Home className="w-5 h-5 mr-2 text-purple-600" />
              Rehabilitation & Resettlement
            </h2>
            <div className="text-sm text-slate-500 font-medium">Eligible Families: 47</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-md">
              <div className="text-sm text-slate-500 mb-1">Completed</div>
              <div className="text-xl font-bold text-green-600">32</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-md">
              <div className="text-sm text-slate-500 mb-1">In Progress</div>
              <div className="text-xl font-bold text-blue-600">3</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-md">
              <div className="text-sm text-slate-500 mb-1">Pending</div>
              <div className="text-xl font-bold text-amber-500">12</div>
            </div>
          </div>
          
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rrData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {rrData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* R&R Types Legend */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-wrap gap-4 text-sm items-center">
        <span className="font-semibold text-slate-700 mr-2">R&R Types:</span>
        <span className="flex items-center text-slate-600"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Cash Compensation</span>
        <span className="flex items-center text-slate-600"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Alternative Land</span>
        <span className="flex items-center text-slate-600"><span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>Employment</span>
        <span className="flex items-center text-slate-600"><span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>Resettlement Colony</span>
      </div>

      {/* Beneficiary Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID, Name or Village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={compStatusFilter}
                onChange={(e) => setCompStatusFilter(e.target.value)}
                className="text-sm border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Comp. Status</option>
                <option value="Disbursed">Disbursed</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Verification Required">Verification Required</option>
              </select>
            </div>
            <select
              value={rrStatusFilter}
              onChange={(e) => setRrStatusFilter(e.target.value)}
              className="text-sm border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All R&R Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Not Applicable">Not Applicable</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Family ID / Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parcel / Village</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Comp. Details</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Comp. Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">R&R Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">R&R Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredBeneficiaries.length > 0 ? (
                filteredBeneficiaries.map((b, i) => (
                  <tr key={b.id || i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{b.familyId || '-'}</div>
                      <div className="text-sm text-slate-500">{b.name || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{b.parcelId || '-'}</div>
                      <div className="text-sm text-slate-500">{b.village || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 font-medium">{b.compensation ? `₹${b.compensation}` : '-'}</div>
                      <div className="text-xs text-slate-500">{b.entitlement || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {b.compStatus ? <StatusBadge status={b.compStatus} /> : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-700">{b.rrType || 'None'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {b.rrStatus ? <StatusBadge status={b.rrStatus} /> : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {b.paymentDate || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-slate-500">
                    No beneficiary records found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
