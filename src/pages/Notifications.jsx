import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, AlertTriangle, Info, CheckCircle2, Check, Filter } from 'lucide-react'
import { PageHeader, Card, StatusBadge, Button } from '../components/common'
import { LoadingState } from '../components/ui'
import { getNotifications } from '../services/mockService'

export default function Notifications() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSeverity, setSelectedSeverity] = useState('All')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getNotifications().then((res) => {
      if (isMounted) {
        let list = res.data || []
        if (selectedSeverity !== 'All') {
          list = list.filter((n) => n.severity.toLowerCase() === selectedSeverity.toLowerCase())
        }
        setNotifs(list)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [selectedSeverity])

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const toggleRead = (id) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)))
  }

  if (loading) return <LoadingState message="Loading notifications..." />

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notification Center & System Alerts"
        subtitle="Real-time alerts for pending verification approvals, delayed compensation, and legal milestones"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Notifications' }]}
        actions={
          <Button variant="secondary" size="sm" icon={Check} onClick={markAllRead}>
            Mark All as Read
          </Button>
        }
      />

      <Card padding="none">
        {/* Severity Tabs */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2 bg-gray-50/50">
          {['All', 'Critical', 'Warning', 'Info'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedSeverity(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedSeverity === tab ? 'bg-blue-600 text-white shadow-2xs' : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-100">
          {notifs.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">No notifications for selected severity filter.</div>
          ) : (
            notifs.map((n) => {
              const severity = n.severity?.toLowerCase()
              return (
                <div
                  key={n.id}
                  className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors ${
                    !n.read ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      severity === 'critical' ? 'bg-red-100 text-red-600' : severity === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {severity === 'critical' ? <AlertTriangle className="w-5 h-5" /> : severity === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-gray-900">{n.title}</h4>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
                      <span>{n.timestamp}</span>
                      {n.caseId && (
                        <Link to="/compensation" className="text-blue-600 hover:underline font-medium">
                          Case: {n.caseId}
                        </Link>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleRead(n.id)}
                    className="text-xs font-semibold text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {n.read ? 'Unread' : 'Mark Read'}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}
