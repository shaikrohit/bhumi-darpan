import { projects, parcels, documents, notifications, beneficiaries, possessionRecords, verificationRecords, analyticsData, dashboardKPIs, acquisitionStatusData, projectProgressData, compensationChartData, timelineChartData, districts, documentCategories, STAGES } from '../data/mockData.js'

// Simulate async API calls (0ms default for fast responsive UI & test suites)
const delay = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

let projectsStore = [...projects]

export function resetProjectsStore() {
  projectsStore = [...projects]
}

export async function getProjects(filters = {}) {
  await delay()
  let result = [...projectsStore]
  if (filters.status) result = result.filter(p => p.status === filters.status)
  if (filters.district) result = result.filter(p => p.district === filters.district)
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
  }
  return { data: result, total: result.length }
}

export async function getProjectById(id) {
  await delay()
  const project = projectsStore.find(p => p.id === id)
  if (!project) throw new Error('Project not found')
  const projectParcels = parcels.filter(p => p.projectId === id)
  const projectDocs = documents.filter(d => d.projectId === id)
  return { ...project, parcels: projectParcels, documents: projectDocs }
}

export async function createProject(data) {
  await delay()
  if (!data.name || !data.authority || !data.district) {
    throw new Error('Missing required project fields')
  }
  const newId = `BD-P-0${projectsStore.length + 1}`
  const newProject = {
    id: newId,
    name: data.name,
    authority: data.authority,
    district: data.district,
    village: data.village || 'N/A',
    totalLand: data.landRequired || '0 acres',
    parcels: [],
    currentStage: 'Proposal',
    currentStageIndex: 0,
    progress: 10,
    compensation: '₹0',
    compensationDisbursed: '₹0',
    rrTotal: 0,
    rrCompleted: 0,
    status: 'On Track',
    startDate: new Date().toISOString().split('T')[0],
    expectedEnd: '2027-12-31',
    description: data.description || 'Synthetic project',
    milestones: [],
    stageHistory: STAGES.map((s, i) => ({
      stage: s,
      date: i === 0 ? new Date().toISOString().split('T')[0] : null,
      status: i === 0 ? 'in-progress' : 'pending',
    })),
  }
  projectsStore.unshift(newProject)
  return newProject
}

export async function updateProject(id, updates) {
  await delay()
  const idx = projectsStore.findIndex(p => p.id === id)
  if (idx === -1) throw new Error('Project not found')
  projectsStore[idx] = { ...projectsStore[idx], ...updates }
  return projectsStore[idx]
}

export async function updateProjectStatus(id, newStatus) {
  return updateProject(id, { status: newStatus })
}

export async function updateProjectMilestone(id, milestoneId, updates) {
  await delay()
  const project = projectsStore.find(p => p.id === id)
  if (!project) throw new Error('Project not found')
  if (!project.milestones) project.milestones = []
  const msIdx = project.milestones.findIndex(m => m.id === milestoneId)
  if (msIdx !== -1) {
    project.milestones[msIdx] = { ...project.milestones[msIdx], ...updates }
  } else {
    project.milestones.push({ id: milestoneId, ...updates })
  }
  return project
}

export async function getLandParcels(filters = {}) {
  await delay()
  let result = [...parcels]

  if (filters.district) {
    result = result.filter(p => p.district.toLowerCase() === filters.district.toLowerCase())
  }
  if (filters.village) {
    result = result.filter(p => p.village.toLowerCase() === filters.village.toLowerCase())
  }
  if (filters.landType) {
    result = result.filter(p => p.landType.toLowerCase() === filters.landType.toLowerCase())
  }
  if (filters.verificationStatus || filters.verification) {
    const vStatus = (filters.verificationStatus || filters.verification).toLowerCase()
    result = result.filter(p => p.verificationStatus.toLowerCase() === vStatus || p.verification.toLowerCase() === vStatus)
  }
  if (filters.acquisitionStatus || filters.status) {
    const aStatus = (filters.acquisitionStatus || filters.status).toLowerCase()
    result = result.filter(p => p.acquisitionStatus.toLowerCase() === aStatus || p.status.toLowerCase() === aStatus)
  }
  if (filters.projectId) {
    result = result.filter(p => p.projectId === filters.projectId)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(p =>
      p.id.toLowerCase().includes(q) ||
      (p.ulpin && p.ulpin.toLowerCase().includes(q)) ||
      (p.surveyNumber && p.surveyNumber.toLowerCase().includes(q)) ||
      (p.village && p.village.toLowerCase().includes(q)) ||
      (p.projectId && p.projectId.toLowerCase().includes(q))
    )
  }

  return { data: result, total: result.length }
}

export async function getParcelById(id) {
  await delay()
  const parcel = parcels.find(p => p.id === id)
  if (!parcel) throw new Error('Parcel not found')
  return parcel
}

export async function getParcelsByProject(projectId) {
  await delay()
  const list = parcels.filter(p => p.projectId === projectId)
  return { data: list, total: list.length }
}

export async function searchParcels(query) {
  return getLandParcels({ search: query })
}

export async function getParcelMapData(filters = {}) {
  const { data } = await getLandParcels(filters)
  const features = data.map(p => ({
    type: 'Feature',
    id: p.id,
    properties: {
      id: p.id,
      ulpin: p.ulpin,
      surveyNumber: p.surveyNumber,
      village: p.village,
      district: p.district,
      area: p.area,
      landType: p.landType,
      verificationStatus: p.verificationStatus,
      acquisitionStatus: p.acquisitionStatus,
      projectId: p.projectId
    },
    geometry: p.geometry
  }))
  return {
    type: 'FeatureCollection',
    features
  }
}

export async function getParcelStats(filters = {}) {
  const { data } = await getLandParcels(filters)
  const total = data.length
  const verified = data.filter(p => p.verificationStatus === 'Verified').length
  const pending = data.filter(p => p.verificationStatus === 'Pending').length
  const needsReview = data.filter(p => p.verificationStatus === 'Needs Review').length
  const acquired = data.filter(p => p.acquisitionStatus === 'Acquired').length

  return {
    total,
    verified,
    pending,
    needsReview,
    acquired,
    gisVerifiedPct: total > 0 ? Math.round((verified / total) * 100) : 0,
    recordVerifiedPct: total > 0 ? Math.round(((verified + pending) / total) * 100) : 0,
    needsReviewPct: total > 0 ? Math.round((needsReview / total) * 100) : 0
  }
}

export async function getDocuments(filters = {}) {
  await delay()
  let result = [...documents]
  if (filters.category) result = result.filter(d => d.category === filters.category)
  if (filters.projectId) result = result.filter(d => d.projectId === filters.projectId)
  return { data: result, total: result.length }
}

export async function getNotifications(filters = {}) {
  await delay()
  let result = [...notifications]
  if (filters.severity) result = result.filter(n => n.severity === filters.severity)
  if (filters.unreadOnly) result = result.filter(n => !n.read)
  return { data: result, total: result.length, unread: result.filter(n => !n.read).length }
}

export async function getBeneficiaries(filters = {}) {
  await delay()
  let result = [...beneficiaries]
  if (filters.compStatus) result = result.filter(b => b.compensationStatus === filters.compStatus)
  if (filters.rrStatus) result = result.filter(b => b.rrStatus === filters.rrStatus)
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

export async function getDashboardData() {
  await delay()
  return {
    kpis: dashboardKPIs,
    acquisitionStatus: acquisitionStatusData,
    projectProgress: projectProgressData,
    compensation: compensationChartData,
    timeline: timelineChartData
  }
}

export async function getAnalyticsData() {
  await delay()
  return analyticsData
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
