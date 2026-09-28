import React from 'react'
import { FolderKanban, FileText, ShieldCheck, Banknote, Users, CheckCircle2 } from 'lucide-react'
import StatCard from '../common/StatCard'

export default function DashboardKpiGrid({ kpis = {} }) {
  return (
    <section aria-label="Key Operational Indicators">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="ACTIVE PROJECTS"
          value={kpis.activeProjects?.value ?? '24'}
          subtitle={kpis.activeProjects?.trend ?? '+4 this quarter'}
          trend="up"
          trendValue="+14%"
          icon={FolderKanban}
          iconColor="text-blue-600"
        />
        <StatCard
          title="ACQUISITION CASES"
          value={kpis.acquisitionCases?.value ?? '186'}
          subtitle={kpis.acquisitionCases?.trend ?? '+12 this quarter'}
          trend="up"
          trendValue="+8%"
          icon={FileText}
          iconColor="text-indigo-600"
        />
        <StatCard
          title="PENDING VERIFICATION"
          value={kpis.pendingVerification?.value ?? '32'}
          subtitle={kpis.pendingVerification?.trend ?? '-5 from last week'}
          trend="down"
          trendValue="-13%"
          icon={ShieldCheck}
          iconColor="text-amber-600"
        />
        <StatCard
          title="COMPENSATION PENDING"
          value={kpis.compensationPending?.value ?? '₹18.6 Cr'}
          subtitle={kpis.compensationPending?.trend ?? '₹2.1 Cr disbursed'}
          trend="neutral"
          trendValue="Pending"
          icon={Banknote}
          iconColor="text-emerald-600"
        />
        <StatCard
          title="R&R PENDING"
          value={kpis.rrPending?.value ?? '47'}
          subtitle={kpis.rrPending?.trend ?? '8 completed this month'}
          trend="up"
          trendValue="+5"
          icon={Users}
          iconColor="text-purple-600"
        />
        <StatCard
          title="POSSESSION COMPLETED"
          value={kpis.possessionCompleted?.value ?? '118'}
          subtitle={kpis.possessionCompleted?.trend ?? '+6 this month'}
          trend="up"
          trendValue="+5%"
          icon={CheckCircle2}
          iconColor="text-teal-600"
        />
      </div>
    </section>
  )
}
