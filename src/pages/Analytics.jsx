import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { PageHeader, Card, StatCard } from '../components/common'
import { LoadingState } from '../components/ui'
import { getAnalyticsData } from '../services/mockService'

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getAnalyticsData().then((res) => {
      if (isMounted) {
        setData(res)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [])

  if (loading) return <LoadingState message="Loading analytics dashboard..." />

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Analytics & Decision Support"
        subtitle="National-level monitoring of acquisition velocity, stage bottle-necks, and district performance"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Analytics' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cases Processed" value="186 Cases" subtitle="Up 14.2% YoY" trend="up" trendValue="+14.2%" icon={BarChart3} iconColor="text-blue-600" />
        <StatCard title="Average Stage Duration" value="285 Days" subtitle="Down 8.3% cycle time" trend="down" trendValue="-8.3%" icon={Clock} iconColor="text-indigo-600" />
        <StatCard title="Compensation Efficiency" value="82%" subtitle="Direct transfer rate" trend="up" trendValue="+5.1%" icon={CheckCircle2} iconColor="text-emerald-600" />
        <StatCard title="Pending Bottleneck Cases" value="108 Cases" subtitle="12 added this month" trend="neutral" trendValue="Action Required" icon={AlertTriangle} iconColor="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Performance Table */}
        <Card title="District Performance Benchmark" subtitle="Efficiency and case throughput by district">
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 uppercase text-gray-500 font-semibold border-b">
                <tr>
                  <th className="p-3">DISTRICT</th>
                  <th className="p-3">PROJECTS</th>
                  <th className="p-3">COMPLETED</th>
                  <th className="p-3">AVG DURATION</th>
                  <th className="p-3">EFFICIENCY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(data?.districtPerformance || []).map((row) => (
                  <tr key={row.district} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-900">{row.district}</td>
                    <td className="p-3 text-gray-600">{row.projects}</td>
                    <td className="p-3 text-gray-600">{row.completed}</td>
                    <td className="p-3 text-gray-600">{row.avgDuration} days</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${
                        row.efficiency >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {row.efficiency}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Stage Duration Metrics */}
        <Card title="Average Stage Duration Breakdown" subtitle="Time spent per workflow stage (Days)">
          <div className="space-y-3 mt-2">
            {(data?.averageStageDuration || []).map((s) => (
              <div key={s.stage} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-700">{s.stage}</span>
                  <span className="text-gray-900 font-bold">{s.days} days</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, (s.days / 70) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
