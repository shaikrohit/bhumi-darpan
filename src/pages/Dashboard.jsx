import React, { useState, useEffect } from 'react'
import {
  FolderKanban,
  FileText,
  ShieldCheck,
  Banknote,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
  BarChart2
} from 'lucide-react'
import { PageHeader, Card, StatCard, Badge, Button } from '../components/common'
import { getDashboardData } from '../services/mockService'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getDashboardData().then((res) => {
      if (isMounted) {
        setData(res)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Land Acquisition Dashboard"
        subtitle="Real-time monitoring of acquisition, compensation, R&R and possession"
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live System State
            </span>
          </div>
        }
      />

      {/* 1. KPI Area Placeholder */}
      <section aria-label="Key Performance Indicators">
        <h2 className="sr-only">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Active Projects"
            value="24"
            subtitle="+3 this month"
            trend="up"
            trendValue="+14%"
            icon={FolderKanban}
            iconColor="text-blue-600"
          />
          <StatCard
            title="Acquisition Cases"
            value="186"
            subtitle="+12 this quarter"
            trend="up"
            trendValue="+8%"
            icon={FileText}
            iconColor="text-indigo-600"
          />
          <StatCard
            title="Pending Verification"
            value="32"
            subtitle="-5 from last week"
            trend="down"
            trendValue="-13%"
            icon={ShieldCheck}
            iconColor="text-amber-600"
          />
          <StatCard
            title="Compensation Pending"
            value="₹18.6 Cr"
            subtitle="₹2.1 Cr disbursed"
            trend="neutral"
            trendValue="Pending"
            icon={Banknote}
            iconColor="text-emerald-600"
          />
          <StatCard
            title="R&R Pending"
            value="47"
            subtitle="8 families settled"
            trend="up"
            trendValue="+5"
            icon={Users}
            iconColor="text-purple-600"
          />
          <StatCard
            title="Possession Completed"
            value="118"
            subtitle="+6 this month"
            trend="up"
            trendValue="+5%"
            icon={CheckCircle2}
            iconColor="text-teal-600"
          />
        </div>
      </section>

      {/* Main Grid: Placeholder Sections for Level 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Acquisition Status Section Placeholder */}
        <Card
          title="Acquisition Status Pipeline"
          subtitle="Stage-wise distribution of land acquisition cases"
          icon={Layers}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 text-white rounded-lg">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Pipeline Analytics Placeholder</h4>
                  <p className="text-xs text-gray-500">Visual acquisition pipeline & stage conversion flow</p>
                </div>
              </div>
              <Badge variant="info">Level 2 Module</Badge>
            </div>
            <div className="space-y-3 pt-2">
              {['Proposal Submission', 'Scrutiny & Verification', 'Approval & Routing', 'Notification (Sec 11)', 'Award Declaration (Sec 23)'].map((stage, idx) => (
                <div key={stage} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-gray-700">
                    <span>{stage}</span>
                    <span>{[42, 32, 28, 22, 18][idx]} cases</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${[85, 65, 55, 45, 35][idx]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 3. Project Progress Section Placeholder */}
        <Card
          title="Project Progress Overview"
          subtitle="Real-time execution status of key infrastructure projects"
          icon={FolderKanban}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-600 text-white rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Project Monitoring Placeholder</h4>
                  <p className="text-xs text-gray-500">Milestone completion tracking & delay warnings</p>
                </div>
              </div>
              <Badge variant="purple">Level 2 Module</Badge>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { name: 'National Highway NH-16 Expansion', district: 'Guntur', progress: 78, status: 'On Track' },
                { name: 'Nagarjuna Sagar Canal Modernization', district: 'Krishna', progress: 55, status: 'On Track' },
                { name: 'Visakhapatnam-Chennai Corridor', district: 'Visakhapatnam', progress: 34, status: 'Delayed' },
                { name: 'East Coast Railway Doubling', district: 'Prakasam', progress: 91, status: 'On Track' },
              ].map((proj) => (
                <div key={proj.name} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">{proj.name}</p>
                    <p className="text-[11px] text-gray-500">{proj.district} District</p>
                  </div>
                  <div className="w-32 flex flex-col items-end gap-1">
                    <Badge variant={proj.status === 'Delayed' ? 'danger' : 'success'} size="sm">
                      {proj.status}
                    </Badge>
                    <span className="text-[10px] font-semibold text-gray-500">{proj.progress}% completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 4. Compensation & R&R Section Placeholder */}
        <Card
          title="Compensation & R&R Summary"
          subtitle="Financial disbursement and resettlement progress"
          icon={Banknote}
        >
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                <p className="text-xs text-emerald-700 font-medium">Total Assessed</p>
                <p className="text-lg font-bold text-emerald-900 mt-1">₹42.8 Cr</p>
                <p className="text-[10px] text-emerald-600 mt-0.5"> Across 24 projects</p>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 text-center">
                <p className="text-xs text-amber-700 font-medium">Pending Disbursement</p>
                <p className="text-lg font-bold text-amber-900 mt-1">₹18.6 Cr</p>
                <p className="text-[10px] text-amber-600 mt-0.5">32 verification cases</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <p className="text-xs text-gray-600">Detailed financial analytics & beneficiary breakdown available in Level 2.</p>
            </div>
          </div>
        </Card>

        {/* 5. System Alerts Section Placeholder */}
        <Card
          title="Critical Alerts & Action Required"
          subtitle="Pending approvals, verification delays, and milestone deadlines"
          icon={AlertTriangle}
        >
          <div className="p-4 space-y-3">
            {[
              { type: 'danger', title: 'Compensation Verification Delayed', msg: 'Case BD-LA-018 has pending compensation verification exceeding 15 days.', time: '2h ago' },
              { type: 'warning', title: 'Survey Mismatch Warning', msg: 'Parcel BD-PARCEL-004 survey boundary mismatch flagged by PostGIS check.', time: '5h ago' },
              { type: 'info', title: 'Section 11 Notification Published', msg: 'Notification published for Amaravati Capital Ring Road project.', time: '1d ago' },
            ].map((alert, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  alert.type === 'danger' ? 'bg-red-50/60 border-red-100 text-red-900' :
                  alert.type === 'warning' ? 'bg-amber-50/60 border-amber-100 text-amber-900' :
                  'bg-blue-50/60 border-blue-100 text-blue-900'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                  alert.type === 'danger' ? 'text-red-600' : alert.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold truncate">{alert.title}</p>
                    <span className="text-[10px] opacity-75">{alert.time}</span>
                  </div>
                  <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{alert.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
