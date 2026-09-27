import React from 'react';
import { 
  FolderKanban, 
  FileText, 
  ShieldCheck, 
  Banknote, 
  Users, 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  Legend 
} from 'recharts';

import { 
  dashboardKPIs, 
  acquisitionStatusData, 
  projectProgressData, 
  compensationChartData, 
  timelineChartData 
} from '../data/mockData.js';
import StatusBadge from '../components/StatusBadge.jsx';

const kpiIcons = [FolderKanban, FileText, ShieldCheck, Banknote, Users, CheckCircle2];

const recentActivity = [
  { id: 1, text: 'Compensation disbursed for BH-AP-005301', time: '2 hours ago', icon: Banknote, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 2, text: 'Document verified — Survey 142/3A', time: '4 hours ago', icon: FileCheck2, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 3, text: 'New project proposal submitted: Smart City Phase II', time: '1 day ago', icon: FolderKanban, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { id: 4, text: 'Approval delayed for Industrial Corridor', time: '2 days ago', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  { id: 5, text: 'Possession scheduled for NH-16 Expansion', time: '2 days ago', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
];

export default function Dashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e3a5f]">Land Acquisition Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time monitoring of acquisition, compensation, R&R and possession</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardKPIs.map((kpi, i) => {
          const Icon = kpiIcons[i % kpiIcons.length];
          return (
            <div 
              key={i} 
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
            >
              <div className={`p-3 rounded-lg bg-${kpi.color}-50 text-${kpi.color}-600`}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</h3>
                <p className={`text-sm mt-1 ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-amber-600' : 'text-gray-500'}`}>
                  {kpi.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Chart 1: Acquisition Pipeline */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acquisition Pipeline</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={acquisitionStatusData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {acquisitionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Project Progress */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Progress</h2>
          <div className="space-y-4 overflow-y-auto max-h-[250px] pr-2">
            {projectProgressData.map((project, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{project.name}</h4>
                    <p className="text-xs text-gray-500">{project.district}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${project.progress > 75 ? 'bg-green-500' : project.progress > 40 ? 'bg-blue-500' : 'bg-amber-500'}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-8">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Compensation Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compensation Distribution</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compensationChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {compensationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Monthly Acquisition Trend */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Acquisition Trend</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" name="Completed" />
                <Area type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPending)" name="Pending" />
                <Legend verticalAlign="top" height={36} iconType="circle" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const ActivityIcon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-full ${activity.bg} ${activity.color}`}>
                  <ActivityIcon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
