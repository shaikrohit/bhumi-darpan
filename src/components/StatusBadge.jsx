import React from 'react'

const variants = {
  // Verification statuses
  'Verified': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending Verification': 'bg-amber-50 text-amber-700 border-amber-200',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Needs Review': 'bg-red-50 text-red-700 border-red-200',
  'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
  'Warning': 'bg-amber-50 text-amber-700 border-amber-200',

  // Project / Parcel statuses
  'On Track': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Delayed': 'bg-red-50 text-red-700 border-red-200',
  'At Risk': 'bg-amber-50 text-amber-700 border-amber-200',
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Acquired': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Under Acquisition': 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Verification': 'bg-blue-50 text-blue-700 border-blue-200',

  // Milestone / Stage statuses
  'Award Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Compensation Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Possession Ready': 'bg-teal-50 text-teal-700 border-teal-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',

  // Notification severities
  'critical': 'bg-red-50 text-red-700 border-red-200',
  'warning': 'bg-amber-50 text-amber-700 border-amber-200',
  'info': 'bg-blue-50 text-blue-700 border-blue-200',
}

const dotColors = {
  'Verified': 'bg-emerald-500',
  'Pending Verification': 'bg-amber-500',
  'Pending': 'bg-amber-500',
  'Needs Review': 'bg-red-500',
  'Under Review': 'bg-blue-500',
  'Warning': 'bg-amber-500',

  'On Track': 'bg-emerald-500',
  'Delayed': 'bg-red-500',
  'At Risk': 'bg-amber-500',
  'Completed': 'bg-emerald-500',
  'Acquired': 'bg-emerald-500',
  'Under Acquisition': 'bg-blue-500',
  'Under Verification': 'bg-blue-500',

  'Award Completed': 'bg-emerald-500',
  'Compensation Pending': 'bg-amber-500',
  'Possession Ready': 'bg-teal-500',
  'In Progress': 'bg-blue-500',

  'critical': 'bg-red-500',
  'warning': 'bg-amber-500',
  'info': 'bg-blue-500',
}

export default function StatusBadge({ status, dot = false, className = '' }) {
  const normalizedStatus = status || 'Pending'
  const style = variants[normalizedStatus] || 'bg-gray-50 text-gray-700 border-gray-200'
  const dotColor = dotColors[normalizedStatus] || 'bg-gray-500'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${style} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} aria-hidden="true" />}
      {normalizedStatus}
    </span>
  )
}
