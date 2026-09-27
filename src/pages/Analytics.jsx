import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  MapPin, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { 
  BarChart, Bar, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, 
  AreaChart, Area, 
  Legend, CartesianGrid, 
  PieChart, Pie, Cell 
} from 'recharts';
import { analyticsData } from '../data/mockData.js';

const rrData = [
  { name: 'Completed', value: 32 },
  { name: 'In Progress', value: 3 },
  { name: 'Pending', value: 12 }
];

const PIE_COLORS = ['#16a34a', '#2563eb', '#f59e0b'];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics & Insights</h1>
          <p className="text-slate-500">Data-driven monitoring and decision support</p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Total Cases Processed</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <p className="text-3xl font-semibold text-slate-800">186</p>
            <span className="ml-2 flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              14.2%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Avg. Completion Time</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <p className="text-3xl font-semibold text-slate-800">285 <span className="text-lg font-normal text-slate-500">days</span></p>
            <span className="ml-2 flex items-center text-sm font-medium text-green-600">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              8.3%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Compensation Efficiency</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <p className="text-3xl font-semibold text-slate-800">82%</p>
            <span className="ml-2 flex items-center text-sm font-medium text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              5.1%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Pending Cases</h3>
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <p className="text-3xl font-semibold text-slate-800">108</p>
            <span className="ml-2 flex items-center text-sm font-medium text-green-600">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              12 this month
            </span>
          </div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Acquisition Completion Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Acquisition Completion Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.completionTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Average Stage Duration */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Average Stage Duration (Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={analyticsData.averageStageDuration} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="days" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Pending Cases by Stage */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Pending Cases by Stage</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.pendingByStage} margin={{ top: 5, right: 20, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} angle={-45} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Compensation Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Compensation Trend (₹ Cr)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.compensationTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="disbursed" name="Disbursed" stroke="#16a34a" fillOpacity={1} fill="url(#colorDisbursed)" strokeWidth={2} />
                <Area type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPending)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: District Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">District Performance</h3>
            <MapPin className="w-5 h-5 text-slate-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-l-lg">District</th>
                  <th className="px-4 py-3 font-medium">Projects</th>
                  <th className="px-4 py-3 font-medium">Completed</th>
                  <th className="px-4 py-3 font-medium">Avg Duration</th>
                  <th className="px-4 py-3 font-medium rounded-r-lg">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analyticsData.districtPerformance?.map((dist, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-slate-800">{dist.district}</td>
                    <td className="px-4 py-4 text-slate-600">{dist.projects}</td>
                    <td className="px-4 py-4 text-slate-600">{dist.completed}</td>
                    <td className="px-4 py-4 text-slate-600">{dist.avgDuration} days</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-2 max-w-[80px]">
                          <div 
                            className={`h-2 rounded-full ${dist.efficiency > 80 ? 'bg-green-500' : dist.efficiency > 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${dist.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-600">{dist.efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart 6: R&R Completion */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">R&R Completion Status</h3>
          <div className="h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rrData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {rrData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-8">
              <span className="text-3xl font-bold text-slate-800">47</span>
              <span className="text-xs text-slate-500">Total Cases</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
