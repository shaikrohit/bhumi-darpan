import React, { useState, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  DashboardHeader,
  DashboardKpiGrid,
  LifecycleChart,
  ProjectProgressList,
  CompensationSummary,
  AlertPanel,
  ActivityTimeline,
} from '../components/dashboard'
import { LoadingState, ErrorState, EmptyState } from '../components/ui'
import { getDashboardData } from '../services/mockService'

export default function Dashboard() {
  const { addToast } = useOutletContext() || {}

  // Filter States
  const [selectedDistrict, setSelectedDistrict] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('Last 90 Days')

  // Data Loading & Error States
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false)

  const loadData = useCallback((showRefreshToast = false) => {
    if (showRefreshToast) setRefreshing(true)
    else setLoading(true)
    setError(null)

    getDashboardData({
      district: selectedDistrict,
      status: selectedStatus,
      timePeriod: selectedTimePeriod,
    })
      .then((res) => {
        setData(res)
        setLoading(false)
        setRefreshing(false)
        if (showRefreshToast && addToast) {
          addToast('Dashboard metrics refreshed successfully', 'success')
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch dashboard monitoring data')
        setLoading(false)
        setRefreshing(false)
      })
  }, [selectedDistrict, selectedStatus, selectedTimePeriod, addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRefresh = () => {
    loadData(true)
  }

  if (loading && !refreshing) {
    return <LoadingState message="Loading land acquisition operational monitoring dashboard..." />
  }

  if (error) {
    return (
      <ErrorState
        title="Dashboard Load Failure"
        message={error}
        onRetry={() => loadData()}
      />
    )
  }

  const hasData = data && (data.projects?.length > 0 || data.lifecycle?.length > 0)

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* 1. Header with Filters & Controls */}
      <DashboardHeader
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedTimePeriod={selectedTimePeriod}
        onTimePeriodChange={setSelectedTimePeriod}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onNewCase={() => {
          // Open case modal or trigger global case button event
          const btn = document.querySelector('button:has(span:contains("New Case"))') || document.querySelector('button[aria-label="New Acquisition Case"]')
          if (btn) btn.click()
        }}
      />

      {/* 2. KPI Section */}
      <DashboardKpiGrid kpis={data?.kpis || {}} />

      {!hasData ? (
        <EmptyState
          title="No Matching Operational Data"
          description={`No land acquisition projects or cases match the filter criteria for "${selectedDistrict}" district.`}
        />
      ) : (
        <>
          {/* Main Desktop Grid / Responsive Mobile Stacking */}
          {/* Desktop order: Lifecycle + Progress | Mobile order: Alerts first */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3. Lifecycle Monitoring */}
            <div className="order-2 sm:order-1 lg:order-1">
              <LifecycleChart lifecycle={data?.lifecycle || []} />
            </div>

            {/* 4. Project Progress Overview */}
            <div className="order-3 sm:order-2 lg:order-2">
              <ProjectProgressList projects={data?.projects || []} />
            </div>
          </div>

          {/* 5. Compensation & R&R Summary */}
          <div>
            <CompensationSummary
              compensation={data?.compensation || {}}
              rr={data?.rr || {}}
            />
          </div>

          {/* Bottom Grid: Attention Required & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 6. Attention / Alerts */}
            <div className="order-1 sm:order-3 lg:order-1">
              <AlertPanel alerts={data?.alerts || []} />
            </div>

            {/* 7. Recent Activity Timeline */}
            <div className="order-4 sm:order-4 lg:order-2">
              <ActivityTimeline activities={data?.recentActivity || []} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
