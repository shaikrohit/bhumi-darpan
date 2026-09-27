const variants = {
  // Generic
  'Verified': 'bg-green-50 text-green-700 border-green-200',
  'Completed': 'bg-green-50 text-green-700 border-green-200',
  'Acquired': 'bg-green-50 text-green-700 border-green-200',
  'On Track': 'bg-green-50 text-green-700 border-green-200',
  'Disbursed': 'bg-green-50 text-green-700 border-green-200',
  'Audited': 'bg-green-50 text-green-700 border-green-200',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Verification': 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Acquisition': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'Delayed': 'bg-red-50 text-red-700 border-red-200',
  'At Risk': 'bg-red-50 text-red-700 border-red-200',
  'Needs Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Partial': 'bg-orange-50 text-orange-700 border-orange-200',
  'Scheduled': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  // Stages
  'Approval Pending': 'bg-purple-50 text-purple-700 border-purple-200',
  'Award Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Compensation Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Possession Ready': 'bg-teal-50 text-teal-700 border-teal-200',
  // Severity
  'critical': 'bg-red-50 text-red-700 border-red-200',
  'warning': 'bg-amber-50 text-amber-700 border-amber-200',
  'info': 'bg-blue-50 text-blue-700 border-blue-200',
}

const dotColors = {
  'Verified': 'bg-green-500',
  'Completed': 'bg-green-500',
  'Acquired': 'bg-green-500',
  'On Track': 'bg-green-500',
  'Disbursed': 'bg-green-500',
  'Audited': 'bg-green-500',
  'Pending': 'bg-amber-500',
  'Under Review': 'bg-blue-500',
  'Under Verification': 'bg-blue-500',
  'Under Acquisition': 'bg-indigo-500',
  'In Progress': 'bg-blue-500',
  'Delayed': 'bg-red-500',
  'At Risk': 'bg-red-500',
  'Needs Review': 'bg-amber-500',
  'Partial': 'bg-orange-500',
  'Scheduled': 'bg-cyan-500',
  'Approval Pending': 'bg-purple-500',
  'critical': 'bg-red-500',
  'warning': 'bg-amber-500',
  'info': 'bg-blue-500',
}

export default function StatusBadge({ status, dot = false, className = '' }) {
  const variant = variants[status] || 'bg-gray-50 text-gray-700 border-gray-200'
  const dotColor = dotColors[status] || 'bg-gray-500'

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${variant} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {status}
    </span>
  )
}
