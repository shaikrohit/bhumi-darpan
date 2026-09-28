import {
  projects as initialProjects,
  parcels as initialParcels,
  documents as initialDocuments,
  notifications as initialNotifications,
  beneficiaries as initialBeneficiaries,
  possessionRecords as initialPossessionRecords,
  verificationRecords as initialVerificationRecords,
  analyticsData,
  dashboardKPIs,
  acquisitionStatusData,
  projectProgressData,
  compensationChartData,
  timelineChartData,
  districts,
  documentCategories,
  STAGES,
} from '../data/mockData.js'

let projectsStore = JSON.parse(JSON.stringify(initialProjects))
let parcelsStore = JSON.parse(JSON.stringify(initialParcels))
let documentsStore = JSON.parse(JSON.stringify(initialDocuments))
let verificationRecordsStore = JSON.parse(JSON.stringify(initialVerificationRecords))

const delay = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms))

export function resetProjectsStore() {
  projectsStore = JSON.parse(JSON.stringify(initialProjects))
}

export async function getProjects(filters = {}) {
  await delay()
  let result = [...projectsStore]
  if (filters.status && filters.status !== 'All') {
    result = result.filter((p) => p.status === filters.status)
  }
  if (filters.district && filters.district !== 'All') {
    result = result.filter((p) => p.district === filters.district)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    )
  }
  return { data: result, total: result.length }
}

export async function getProjectById(id) {
  await delay()
  const project = projectsStore.find((p) => p.id === id)
  if (!project) throw new Error('Project not found')
  const projectParcels = parcelsStore.filter((p) => p.projectId === id)
  const projectDocs = documentsStore.filter((d) => d.projectId === id)
  return {
    ...project,
    parcelsList: projectParcels,
    parcels: projectParcels,
    documents: projectDocs,
  }
}

export async function createProject(data) {
  await delay()
  if (!data || !data.name || !data.authority || !data.district) {
    throw new Error('Missing required project fields')
  }
  const newId = `BD-P-00${projectsStore.length + 1}`
  const newProject = {
    id: newId,
    name: data.name,
    authority: data.authority,
    district: data.district,
    totalLand: data.landRequired || '0 acres',
    parcels: 0,
    currentStage: 'Proposal',
    currentStageIndex: 0,
    progress: 0,
    compensation: '₹0 Cr',
    compensationDisbursed: '₹0 Cr',
    rrTotal: 0,
    rrCompleted: 0,
    status: 'On Track',
    startDate: new Date().toISOString().split('T')[0],
    description: data.description || '',
    milestones: [
      { id: 'MS-001', name: 'Project Proposal Submitted', status: 'Completed', date: new Date().toISOString().split('T')[0] },
      { id: 'MS-006', name: 'Land Scrutiny & Verification', status: 'Pending', date: null },
    ],
    stageHistory: STAGES.map((s, i) => ({
      stage: s,
      date: i === 0 ? new Date().toISOString().split('T')[0] : null,
      status: i === 0 ? 'completed' : 'pending',
    })),
  }
  projectsStore.unshift(newProject)
  return newProject
}

export async function updateProject(id, updates) {
  await delay()
  const idx = projectsStore.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error('Project not found')
  projectsStore[idx] = { ...projectsStore[idx], ...updates }
  return projectsStore[idx]
}

export async function updateProjectStatus(id, status) {
  await delay()
  const project = projectsStore.find((p) => p.id === id)
  if (!project) throw new Error('Project not found')
  project.status = status
  return project
}

export async function updateProjectMilestone(id, milestoneId, updates) {
  await delay()
  const project = projectsStore.find((p) => p.id === id)
  if (!project) throw new Error('Project not found')
  if (!project.milestones) {
    project.milestones = [
      { id: milestoneId, name: 'Milestone', status: updates.status, date: updates.date },
    ]
  } else {
    const ms = project.milestones.find((m) => m.id === milestoneId)
    if (ms) {
      Object.assign(ms, updates)
    } else {
      project.milestones.push({ id: milestoneId, name: 'Milestone', ...updates })
    }
  }
  return project
}

export async function getLandParcels(filters = {}) {
  await delay()
  let result = [...parcelsStore]
  if (filters.district && filters.district !== 'All') {
    result = result.filter((p) => p.district === filters.district)
  }
  if (filters.village && filters.village !== 'All') {
    result = result.filter((p) => p.village === filters.village)
  }
  if (filters.status && filters.status !== 'All') {
    result = result.filter((p) => p.status === filters.status)
  }
  if (filters.verification && filters.verification !== 'All') {
    result = result.filter((p) => p.verification === filters.verification)
  }
  if (filters.projectId && filters.projectId !== 'All') {
    result = result.filter((p) => p.projectId === filters.projectId)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.ulpin?.toLowerCase().includes(q) ||
        p.surveyNumber?.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
    )
  }
  return { data: result, total: result.length }
}

export async function getParcelById(id) {
  await delay()
  const parcel = parcelsStore.find((p) => p.id === id)
  if (!parcel) throw new Error('Parcel not found')
  return parcel
}

export async function getParcelsByProject(projectId) {
  await delay()
  return parcelsStore.filter((p) => p.projectId === projectId)
}

export async function searchParcels(query) {
  await delay()
  if (!query) return { data: parcelsStore, total: parcelsStore.length }
  const q = query.toLowerCase()
  const result = parcelsStore.filter(
    (p) =>
      p.id.toLowerCase().includes(q) ||
      p.ulpin?.toLowerCase().includes(q) ||
      p.surveyNumber?.toLowerCase().includes(q) ||
      p.village?.toLowerCase().includes(q)
  )
  return { data: result, total: result.length }
}

export async function getParcelStats() {
  await delay()
  const total = parcelsStore.length
  const verified = parcelsStore.filter((p) => p.verification === 'Verified').length
  const pending = parcelsStore.filter(
    (p) => p.verification === 'Needs Review' || p.verification === 'Pending'
  ).length
  const acquired = parcelsStore.filter((p) => p.status === 'Acquired').length
  return { total, verified, pending, acquired }
}

export async function getParcelMapData(filters = {}) {
  await delay()
  let list = [...parcelsStore]
  if (filters.district && filters.district !== 'All') {
    list = list.filter((p) => p.district === filters.district)
  }
  if (filters.status && filters.status !== 'All') {
    list = list.filter((p) => p.status === filters.status)
  }

  return {
    type: 'FeatureCollection',
    features: list.map((p) => ({
      type: 'Feature',
      id: p.id,
      properties: { ...p },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.0, 16.0],
            [80.01, 16.0],
            [80.01, 16.01],
            [80.0, 16.01],
            [80.0, 16.0],
          ],
        ],
      },
    })),
  }
}

export async function getDocuments(filters = {}) {
  await delay()
  let result = [...documentsStore]
  if (filters.category && filters.category !== 'All') {
    result = result.filter((d) => d.category === filters.category)
  }
  if (filters.projectId && filters.projectId !== 'All') {
    result = result.filter((d) => d.projectId === filters.projectId)
  }
  if (filters.verificationStatus && filters.verificationStatus !== 'All') {
    result = result.filter((d) => d.verification === filters.verificationStatus)
  }
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (d) =>
        d.id.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
    )
  }
  return { data: result, total: result.length }
}

export async function getDocumentById(id) {
  await delay()
  const doc = documentsStore.find((d) => d.id === id)
  if (!doc) throw new Error('Document not found')
  return doc
}

export async function createDocument(docData) {
  await delay()
  if (!docData.name || !docData.category) {
    throw new Error('Document name and category are required')
  }
  const newId = `BD-DOC-00${documentsStore.length + 1}`
  const newDoc = {
    id: newId,
    name: docData.name,
    type: docData.type || 'PDF Document',
    category: docData.category,
    projectId: docData.projectId || 'BD-P-001',
    parcelId: docData.parcelId || 'BD-PARCEL-001',
    uploadDate: new Date().toISOString().split('T')[0],
    uploadedBy: 'District Revenue Officer',
    version: 'v1.0',
    size: docData.size || '2.4 MB',
    verification: 'Pending',
    versions: [
      { version: 'v1.0', uploadDate: new Date().toISOString().split('T')[0], status: 'Active', size: docData.size || '2.4 MB' },
    ],
    audit: [
      { date: new Date().toISOString().split('T')[0], action: 'Document Uploaded', actor: 'System' },
    ],
  }
  documentsStore.unshift(newDoc)
  return newDoc
}

export async function addDocumentVersion(docId, versionData) {
  await delay()
  const doc = documentsStore.find((d) => d.id === docId)
  if (!doc) throw new Error('Document not found')
  const newVersionNum = `v${(parseFloat(doc.version.replace('v', '')) + 1.0).toFixed(1)}`
  doc.versions.forEach((v) => (v.status = 'Superseded'))
  doc.versions.unshift({
    version: newVersionNum,
    uploadDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    size: versionData.size || '2.5 MB',
  })
  doc.version = newVersionNum
  doc.audit.unshift({
    date: new Date().toISOString().split('T')[0],
    action: `New version ${newVersionNum} uploaded`,
    actor: 'District Officer',
  })
  return doc
}

export async function getDocumentsByParcel(parcelId) {
  await delay()
  return documentsStore.filter((d) => d.parcelId === parcelId)
}

export async function getDocumentsByProject(projectId) {
  await delay()
  return documentsStore.filter((d) => d.projectId === projectId)
}

export async function getNotifications(filters = {}) {
  await delay()
  let result = [...initialNotifications]
  if (filters.severity) result = result.filter((n) => n.severity === filters.severity)
  if (filters.unreadOnly) result = result.filter((n) => !n.read)
  return { data: result, total: result.length, unread: result.filter((n) => !n.read).length }
}

export async function getBeneficiaries(filters = {}) {
  await delay()
  let result = [...initialBeneficiaries]
  if (filters.compStatus) result = result.filter((b) => b.compensationStatus === filters.compStatus)
  if (filters.rrStatus) result = result.filter((b) => b.rrStatus === filters.rrStatus)
  return { data: result, total: result.length }
}

export async function getPossessionRecords() {
  await delay()
  return { data: initialPossessionRecords, total: initialPossessionRecords.length }
}

export async function getVerificationRecords() {
  await delay()
  return { data: verificationRecordsStore, total: verificationRecordsStore.length }
}

export async function getVerificationById(id) {
  await delay()
  const record = verificationRecordsStore.find((v) => v.id === id)
  if (!record) throw new Error('Verification record not found')
  return record
}

export async function compareVerificationFields(caseId) {
  await delay()
  const record = verificationRecordsStore.find((v) => v.id === caseId)
  if (!record) throw new Error('Record not found')
  return {
    fields: [
      { field: 'Survey Number', landRecord: record.surveyNumber, documentData: record.documentData?.surveyNumber || record.surveyNumber, match: true },
      { field: 'Area (Acres)', landRecord: record.extent, documentData: record.documentData?.extent || record.extent, match: record.extent === (record.documentData?.extent || record.extent) },
      { field: 'Owner Name', landRecord: record.ownerName, documentData: record.documentData?.ownerName || record.ownerName, match: true },
    ],
  }
}

export async function updateVerificationStatus(caseId, status, notes = '') {
  await delay()
  const record = verificationRecordsStore.find((v) => v.id === caseId)
  if (!record) throw new Error('Record not found')
  record.status = status
  if (!record.auditTrail) record.auditTrail = []
  record.auditTrail.unshift({
    timestamp: new Date().toISOString(),
    action: `Status updated to ${status}`,
    user: 'Revenue Inspector',
    notes,
  })
  return record
}

export async function addVerificationAuditEvent(caseId, action, details = '') {
  await delay()
  const record = verificationRecordsStore.find((v) => v.id === caseId)
  if (!record) throw new Error('Record not found')
  if (!record.auditTrail) record.auditTrail = []
  record.auditTrail.unshift({
    timestamp: new Date().toISOString(),
    action,
    user: 'Revenue Inspector',
    notes: details,
  })
  return record
}

export async function simulateOCRExtraction(docId) {
  await delay(150)
  return {
    confidence: 0.94,
    extractedData: {
      surveyNumber: '142/3A',
      extent: '2.45 acres',
      ownerName: 'K. Venkateswara Rao',
      landType: 'Wet Agricultural',
    },
  }
}

export async function getDashboardData() {
  await delay()
  return {
    kpis: dashboardKPIs,
    acquisitionStatus: acquisitionStatusData,
    projectProgress: projectProgressData,
    compensation: compensationChartData,
    timeline: timelineChartData,
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
