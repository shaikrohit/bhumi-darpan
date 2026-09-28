import React, { useState, useEffect } from 'react'
import { Banknote, Users, Home, Search, Filter, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { PageHeader, Card, StatusBadge, StatCard } from '../components/common'
import { SearchField, DataTable, LoadingState } from '../components/ui'
import { getBeneficiaries } from '../services/mockService'

export default function Compensation() {
  const [beneficiariesList, setBeneficiariesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [compStatusFilter, setCompStatusFilter] = useState('All')
  const [rrStatusFilter, setRrStatusFilter] = useState('All')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getBeneficiaries().then((res) => {
      if (isMounted) {
        let filtered = res.data || []
        if (searchTerm) {
          const q = searchTerm.toLowerCase()
          filtered = filtered.filter(
            (b) =>
              b.name?.toLowerCase().includes(q) ||
              b.familyId?.toLowerCase().includes(q) ||
              b.village?.toLowerCase().includes(q)
          )
        }
        if (compStatusFilter !== 'All') {
          filtered = filtered.filter((b) => (b.compensationStatus || b.compStatus) === compStatusFilter)
        }
        if (rrStatusFilter !== 'All') {
          filtered = filtered.filter((b) => b.rrStatus === rrStatusFilter)
        }
        setBeneficiariesList(filtered)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [searchTerm, compStatusFilter, rrStatusFilter])

  const columns = [
    {
      key: 'familyId',
      label: 'FAMILY ID & NAME',
      render: (b) => (
        <div>
          <p className="font-semibold text-gray-900">{b.name}</p>
          <p className="text-xs text-gray-500">ID: {b.familyId}</p>
        </div>
      ),
    },
    { key: 'parcelId', label: 'PARCEL ID' },
    { key: 'village', label: 'VILLAGE' },
    { key: 'entitlement', label: 'ENTITLEMENT' },
    { key: 'compensation', label: 'ASSESSED COMP.' },
    {
      key: 'compensationStatus',
      label: 'COMP. STATUS',
      render: (b) => <StatusBadge status={b.compensationStatus || b.compStatus || 'Pending'} dot />,
    },
    { key: 'rrType', label: 'R&R TYPE' },
    {
      key: 'rrStatus',
      label: 'R&R STATUS',
      render: (b) => <StatusBadge status={b.rrStatus || 'Pending'} />,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Compensation & Rehabilitation (R&R)"
        subtitle="Direct benefit transfer tracking, entitlement assessment, and rehabilitation monitoring"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Compensation & R&R' }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assessed Compensation" value="₹18.6 Cr" subtitle="Across 186 acquisition cases" icon={Banknote} iconColor="text-blue-600" />
        <StatCard title="Disbursed Compensation" value="₹14.8 Cr" subtitle="79.5% disbursed to bank accounts" icon={CheckCircle2} iconColor="text-emerald-600" />
        <StatCard title="Pending Compensation" value="₹3.8 Cr" subtitle="Under bank verification" icon={Clock} iconColor="text-amber-600" />
        <StatCard title="Eligible R&R Families" value="47 Families" subtitle="32 rehabilitation completed" icon={Users} iconColor="text-purple-600" />
      </div>

      <Card padding="none" title="Beneficiary Entitlement & Payment Directory">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="w-full sm:w-80">
            <SearchField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              placeholder="Search by Family ID, Name, or Village..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select
              aria-label="Filter Compensation Status"
              value={compStatusFilter}
              onChange={(e) => setCompStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Comp. Statuses</option>
              <option value="Disbursed">Disbursed</option>
              <option value="Pending">Pending</option>
              <option value="Verification Required">Verification Required</option>
            </select>

            <select
              aria-label="Filter R&R Status"
              value={rrStatusFilter}
              onChange={(e) => setRrStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white py-1.5 px-3 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All R&R Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={beneficiariesList}
          loading={loading}
          emptyMessage="No beneficiary records match criteria."
        />
      </Card>
    </div>
  )
}
