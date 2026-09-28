import { projects, parcels, documents, notifications, beneficiaries, possessionRecords, verificationRecords, analyticsData, dashboardKPIs, acquisitionStatusData, projectProgressData, compensationChartData, timelineChartData, districts, documentCategories, STAGES } from '../data/mockData.js'

// Simulate async API calls with small delay
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

export async function getProjects(filters = {}) {
  await delay()
  let result = [...projects]
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
  const project = projects.find(p => p.id === id)
  if (!project) throw new Error('Project not found')
  const projectParcels = parcels.filter(p => p.projectId === id)
  const projectDocs = documents.filter(d => d.projectId === id)
  return { ...project, parcels: projectParcels, documents: projectDocs }
}

export async function getLandParcels(filters = {}) {
  await delay()
  let result = [...parcels]
  if (filters.district) result = result.filter(p => p.district === filters.district)
  if (filters.status) result = result.filter(p => p.status === filters.status)
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(p => 
      p.id.toLowerCase().includes(q) || 
      p.ulpin?.toLowerCase().includes(q) || 
      p.village.toLowerCase().includes(q)
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
