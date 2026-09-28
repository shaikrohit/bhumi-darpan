import {
  projects as initialProjects,
  parcels,
  documents,
  notifications,
  beneficiaries,
  possessionRecords,
  verificationRecords,
  analyticsData,
  dashboardKPIs,
  districts,
  documentCategories,
  STAGES,
} from '../data/mockData.js'

// In-memory mutable projects array for frontend-only state
let projectsStore = JSON.parse(JSON.stringify(initialProjects))

export function resetProjectsStore() {
  projectsStore = JSON.parse(JSON.stringify(initialProjects))
}

// Fast delay helper
const delay = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetch projects with search, filtering (district, status, stage), and sorting
 */
export async function getProjects(filters = {}) {
  await delay()
  let result = [...projectsStore]

  // Filter by District
  if (filters.district && filters.district !== 'All' && filters.district !== 'All Districts') {
    const d = filters.district.toLowerCase().replace(' district', '')
    result = result.filter((p) => p.district.toLowerCase().includes(d))
  }

  // Filter by Project Status (On Track, At Risk, Delayed, Completed)
  if (filters.status && filters.status !== 'All') {
    result = result.filter((p) => p.status === filters.status)
  }

  // Filter by Acquisition Stage (Proposal, Submission, Verification, etc.)
  if (filters.stage && filters.stage !== 'All') {
    result = result.filter((p) => p.currentStage === filters.stage)
  }

  // Search by Project ID, Name, District, Authority
  if (filters.search) {
    const q = filters.search.trim().toLowerCase()
    result = result.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.authority.toLowerCase().includes(q)
    )
  }

  // Sorting: name, progress, lastUpdated
  if (filters.sortBy) {
    if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (filters.sortBy === 'progress') {
      result.sort((a, b) => b.progress - a.progress)
    } else if (filters.sortBy === 'lastUpdated') {
      result.sort((a, b) => new Date(b.lastUpdated || '2026-01-01') - new Date(a.lastUpdated || '2026-01-01'))
    }
  }

  return { data: result, total: result.length }
}

/**
 * Fetch single project by ID
 */
export async function getProjectById(id) {
  await delay()
  const project = projectsStore.find((p) => p.id === id)
  if (!project) throw new Error(`Project not found: ${id}`)
  const projectParcels = parcels.filter((p) => p.projectId === id)
  const projectDocs = documents.filter((d) => d.projectId === id)
  return {
    ...project,
    parcels: projectParcels,
    documents: projectDocs,
    milestones: project.milestones || [],
    stageHistory: project.stageHistory || [],
  }
}

/**
 * Create new synthetic project (Frontend state)
 */
export async function createProject(projectData) {
  await delay()
  if (!projectData.name || !projectData.authority || !projectData.district || !projectData.landRequired) {
    throw new Error('Missing required project fields')
  }

  const nextNum = projectsStore.length + 1
  const newId = `BD-P-${String(nextNum).padStart(3, '0')}`
  const today = new Date().toISOString().split('T')[0]

  const defaultStageHistory = STAGES.map((stage, i) => ({
    stage,
    date: i === 0 ? today : null,
    status: i === 0 ? 'completed' : i === 1 ? 'in-progress' : 'pending',
  }))

  const defaultMilestones = [
    { id: `${newId}-MS1`, name: 'Project Proposal Sanction', date: today, status: 'Completed', note: 'Created in platform' },
    { id: `${newId}-MS2`, name: 'Online Gazette Submission', date: projectData.expectedCompletion || '2026-06-30', status: 'In Progress', note: 'Scrutiny ongoing' },
    { id: `${newId}-MS3`, name: 'Joint Cadastral Survey', date: null, status: 'Pending', note: 'Upcoming' },
    { id: `${newId}-MS4`, name: 'Section 11 Preliminary Notice', date: null, status: 'Pending', note: 'Upcoming' },
    { id: `${newId}-MS5`, name: 'Section 19 Award Declaration', date: null, status: 'Pending', note: 'Upcoming' },
  ]

  const newProject = {
    id: newId,
    name: projectData.name,
    authority: projectData.authority,
    projectType: projectData.projectType || 'Infrastructure',
    state: projectData.state || 'Andhra Pradesh',
    district: projectData.district,
    tehsil: projectData.tehsil || `${projectData.district} Mandal`,
    village: projectData.village || `${projectData.district} Central`,
    landRequired: projectData.landRequired.includes('acre') ? projectData.landRequired : `${projectData.landRequired} acres`,
    affectedParcels: parseInt(projectData.parcels || '15', 10),
    parcels: parseInt(projectData.parcels || '15', 10),
    currentStage: 'Submission',
    currentStageIndex: 1,
    progress: 15,
    compensation: '₹12.5 Cr (Est)',
    compensationDisbursed: '₹0',
    rrTotal: 10,
    rrCompleted: 0,
    status: 'On Track',
    startDate: today,
    expectedCompletion: projectData.expectedCompletion || '2027-12-31',
    expectedEnd: projectData.expectedCompletion || '2027-12-31',
    lastUpdated: today,
    description: projectData.description || 'Land acquisition project initiated via online portal.',
    stageHistory: defaultStageHistory,
    milestones: defaultMilestones,
  }

  projectsStore = [newProject, ...projectsStore]
  return newProject
}

/**
 * Edit existing project attributes
 */
export async function updateProject(id, changes) {
  await delay()
  const index = projectsStore.findIndex((p) => p.id === id)
  if (index === -1) throw new Error(`Project ${id} not found`)

  const today = new Date().toISOString().split('T')[0]
  const updated = {
    ...projectsStore[index],
    ...changes,
    lastUpdated: today,
  }
  projectsStore[index] = updated
  return updated
}

/**
 * Update Project Status (On Track, At Risk, Delayed, Completed)
 */
export async function updateProjectStatus(id, newStatus) {
  await delay()
  const index = projectsStore.findIndex((p) => p.id === id)
  if (index === -1) throw new Error(`Project ${id} not found`)

  const today = new Date().toISOString().split('T')[0]
  projectsStore[index] = {
    ...projectsStore[index],
    status: newStatus,
    lastUpdated: today,
  }
  return projectsStore[index]
}

/**
 * Update Milestone status (Completed, In Progress, Pending, Blocked)
 */
export async function updateProjectMilestone(projectId, milestoneId, changes) {
  await delay()
  const projectIndex = projectsStore.findIndex((p) => p.id === projectId)
  if (projectIndex === -1) throw new Error(`Project ${projectId} not found`)

  const proj = projectsStore[projectIndex]
  const msIndex = (proj.milestones || []).findIndex((m) => m.id === milestoneId)
  if (msIndex === -1) throw new Error(`Milestone ${milestoneId} not found`)

  const today = new Date().toISOString().split('T')[0]
  const updatedMilestone = {
    ...proj.milestones[msIndex],
    ...changes,
    date: changes.status === 'Completed' ? (changes.date || today) : proj.milestones[msIndex].date,
  }

  const updatedMilestones = [...proj.milestones]
  updatedMilestones[msIndex] = updatedMilestone

  const completedCount = updatedMilestones.filter((m) => m.status === 'Completed').length
  const newProgress = Math.min(100, Math.round((completedCount / updatedMilestones.length) * 100))

  const updatedProject = {
    ...proj,
    milestones: updatedMilestones,
    progress: newProgress,
    lastUpdated: today,
  }

  projectsStore[projectIndex] = updatedProject
  return updatedProject
}

// ── Other Service Utilities (Kept intact) ───────────────────
export async function getLandParcels(filters = {}) {
  await delay()
  let result = [...parcels]
  if (filters.district && filters.district !== 'All' && filters.district !== 'All Districts') {
    result = result.filter((p) => p.district.toLowerCase().includes(filters.district.toLowerCase().replace(' district', '')))
  }
  if (filters.status && filters.status !== 'All') {
    result = result.filter((p) => p.status === filters.status)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.ulpin?.toLowerCase().includes(q) ||
        p.village?.toLowerCase().includes(q) ||
        p.surveyNumber?.toLowerCase().includes(q)
    )
  }
  return { data: result, total: result.length }
}

export async function getParcelById(id) {
  await delay()
  const parcel = parcels.find((p) => p.id === id)
  if (!parcel) throw new Error('Parcel not found')
  return parcel
}

export async function getDocuments(filters = {}) {
  await delay()
  let result = [...documents]
  if (filters.category && filters.category !== 'All') {
    result = result.filter((d) => d.category === filters.category)
  }
  if (filters.projectId) {
    result = result.filter((d) => d.projectId === filters.projectId)
  }
  return { data: result, total: result.length }
}

export async function getNotifications(filters = {}) {
  await delay()
  let result = [...notifications]
  if (filters.severity && filters.severity !== 'All') {
    result = result.filter((n) => n.severity.toLowerCase() === filters.severity.toLowerCase())
  }
  if (filters.unreadOnly) {
    result = result.filter((n) => !n.read)
  }
  return { data: result, total: result.length, unread: result.filter((n) => !n.read).length }
}

export async function getBeneficiaries(filters = {}) {
  await delay()
  let result = [...beneficiaries]
  if (filters.compStatus && filters.compStatus !== 'All') {
    result = result.filter((b) => (b.compensationStatus || b.compStatus) === filters.compStatus)
  }
  if (filters.rrStatus && filters.rrStatus !== 'All') {
    result = result.filter((b) => b.rrStatus === filters.rrStatus)
  }
  return { data: result, total: result.length }
}

export async function getPossessionRecords() {
  await delay()
  return { data: possessionRecords, total: possessionRecords.length }
}

export async function getVerificationRecords() {
  await delay()
  return { data: verificationRecords, total: verificationRecords.length }
}

export async function getAnalyticsData() {
  await delay()
  return analyticsData
}

export async function searchGlobal(query) {
  await delay(10)
  if (!query || !query.trim()) return []

  const q = query.trim().toLowerCase()
  const results = []

  projectsStore.forEach((p) => {
    if (p.id?.toLowerCase().includes(q) || p.name?.toLowerCase().includes(q) || p.district?.toLowerCase().includes(q)) {
      results.push({
        id: p.id,
        title: p.name,
        subtitle: `Project BD-P • ${p.district} District • ${p.status}`,
        category: 'Project',
        link: `/projects/${p.id}`,
      })
    }
  })

  parcels.forEach((p) => {
    if (
      p.id?.toLowerCase().includes(q) ||
      p.ulpin?.toLowerCase().includes(q) ||
      p.surveyNumber?.toLowerCase().includes(q) ||
      p.village?.toLowerCase().includes(q)
    ) {
      results.push({
        id: p.id,
        title: `Parcel ${p.id} (Survey ${p.surveyNumber})`,
        subtitle: `ULPIN: ${p.ulpin || 'N/A'} • Village: ${p.village} • ${p.status}`,
        category: 'Land Parcel',
        link: `/land-parcels?id=${p.id}`,
      })
    }
  })

  documents.forEach((d) => {
    if (d.id?.toLowerCase().includes(q) || d.name?.toLowerCase().includes(q) || d.category?.toLowerCase().includes(q)) {
      results.push({
        id: d.id,
        title: d.name,
        subtitle: `Document • ${d.category} • Version ${d.version}`,
        category: 'Document',
        link: `/documents?id=${d.id}`,
      })
    }
  })

  return results.slice(0, 8)
}

export async function getDashboardData(filters = {}) {
  await delay()

  const cleanDistrict = (filters.district && filters.district !== 'All' && filters.district !== 'All Districts')
    ? filters.district.replace(' District', '').toLowerCase()
    : null
  const cleanStatus = (filters.status && filters.status !== 'All') ? filters.status : null

  let filteredProjects = [...projectsStore]
  if (cleanDistrict) {
    filteredProjects = filteredProjects.filter((p) => p.district.toLowerCase().includes(cleanDistrict))
  }
  if (cleanStatus) {
    filteredProjects = filteredProjects.filter((p) => p.status === cleanStatus)
  }

  let filteredParcels = [...parcels]
  if (cleanDistrict) {
    filteredParcels = filteredParcels.filter((p) => p.district.toLowerCase().includes(cleanDistrict))
  }

  const activeCount = filteredProjects.filter((p) => p.status !== 'Completed').length
  const totalParcelsCount = filteredParcels.length
  const pendingVerifCount = filteredParcels.filter(
    (p) => p.verification === 'Pending' || p.verification === 'Needs Review' || p.status === 'Under Verification'
  ).length
  const possessionDoneCount = filteredParcels.filter((p) => p.status === 'Acquired').length

  const stageCounts = STAGES.map((stage) => {
    let count = 0
    filteredProjects.forEach((p) => {
      if (p.currentStage === stage) count += 1
    })
    filteredParcels.forEach((p) => {
      if (
        (stage === 'Verification' && p.status === 'Under Verification') ||
        (stage === 'Compensation & R&R' && p.status === 'Under Acquisition') ||
        (stage === 'Closure' && p.status === 'Acquired')
      ) {
        count += 2
      }
    })
    if (count === 0) count = Math.floor(Math.random() * 8) + 4
    return { stage, count }
  })

  const alerts = [
    { id: 'BD-ALT-001', severity: 'critical', title: 'Compensation Verification Pending', caseId: 'BD-LA-018', explanation: 'Case BD-LA-018 has pending compensation verification exceeding 12 days.', timestamp: '12 days pending' },
    { id: 'BD-ALT-002', severity: 'warning', title: 'R&R Milestone Approaching', caseId: 'BD-P-004', explanation: 'Rehabilitation entitlement distribution due in 5 days for East Coast Railway project.', timestamp: 'Due in 5 days' },
    { id: 'BD-ALT-003', severity: 'warning', title: 'District Approval Pending', caseId: 'BD-LA-027', explanation: 'Section 19 declaration awaiting DLAO signature approval.', timestamp: 'Awaiting signature' },
    { id: 'BD-ALT-004', severity: 'info', title: 'New Section 11 Submission', caseId: 'BD-LA-041', explanation: 'Nagarjuna Sagar Canal Modernization Phase 2 submitted online.', timestamp: 'Just now' },
  ]

  const recentActivity = [
    { id: 'ACT-001', type: 'verification', title: 'Land parcel verified', target: 'BD-PARCEL-018', time: '10 minutes ago', status: 'Verified' },
    { id: 'ACT-002', type: 'award', title: 'Award declared under Sec 23', target: 'BD-LA-031', time: '32 minutes ago', status: 'Award Completed' },
    { id: 'ACT-003', type: 'compensation', title: 'Compensation record updated', target: 'BD-LA-019', time: '1 hour ago', status: 'Disbursed' },
    { id: 'ACT-004', type: 'document', title: 'Cadastral survey map uploaded', target: 'BD-DOC-042', time: '2 hours ago', status: 'Uploaded' },
    { id: 'ACT-005', type: 'possession', title: 'Possession checklist completed', target: 'BD-P-006', time: '3 hours ago', status: 'Possession Ready' },
    { id: 'ACT-006', type: 'notification', title: 'Sec 11 preliminary notification issued', target: 'BD-P-001', time: '5 hours ago', status: 'Notification' },
  ]

  return {
    kpis: {
      activeProjects: { value: activeCount || 24, trend: '+4 this quarter', status: 'positive' },
      acquisitionCases: { value: totalParcelsCount ? totalParcelsCount * 15 + 6 : 186, trend: '+12 this quarter', status: 'positive' },
      pendingVerification: { value: pendingVerifCount || 32, trend: '-5 from last week', status: 'pending' },
      compensationPending: { value: cleanDistrict ? '₹4.2 Cr' : '₹18.6 Cr', trend: '₹2.1 Cr disbursed this week', status: 'pending' },
      rrPending: { value: cleanDistrict ? '12' : '47', trend: '8 completed this month', status: 'pending' },
      possessionCompleted: { value: possessionDoneCount ? possessionDoneCount * 10 + 8 : 118, trend: '+6 this month', status: 'completed' },
    },
    lifecycle: stageCounts,
    projects: filteredProjects.slice(0, 6),
    compensation: {
      assessed: cleanDistrict ? '₹8.4 Cr' : '₹42.8 Cr',
      disbursed: cleanDistrict ? '₹5.2 Cr' : '₹24.2 Cr',
      pending: cleanDistrict ? '₹3.2 Cr' : '₹18.6 Cr',
    },
    rr: {
      eligible: cleanDistrict ? 38 : 186,
      completed: cleanDistrict ? 26 : 139,
      pending: cleanDistrict ? 47 : 47,
    },
    alerts,
    recentActivity,
    acquisitionStatus: stageCounts,
    projectProgress: filteredProjects.slice(0, 6),
  }
}

export function getDistricts() {
  return districts
}

export function getDocumentCategories() {
  return documentCategories
}

export function getStages() {
  return STAGES
}
