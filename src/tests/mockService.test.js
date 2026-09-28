import { describe, it, expect } from 'vitest'
import {
  getProjects,
  getProjectById,
  getLandParcels,
  getParcelById,
  getDocuments,
  getNotifications,
  getBeneficiaries,
  getDashboardData,
  getAnalyticsData,
  getDistricts,
  getStages,
} from '../services/mockService'

describe('Mock Service Layer', () => {
  it('fetches projects list correctly', async () => {
    const res = await getProjects()
    expect(res.data).toBeDefined()
    expect(res.data.length).toBeGreaterThan(0)
    expect(res.data[0].id).toMatch(/^BD-P-/)
  })

  it('filters projects by search term', async () => {
    const res = await getProjects({ search: 'Highway' })
    expect(res.data.length).toBeGreaterThan(0)
    expect(res.data[0].name).toContain('Highway')
  })

  it('fetches single project by ID', async () => {
    const project = await getProjectById('BD-P-001')
    expect(project).toBeDefined()
    expect(project.id).toBe('BD-P-001')
    expect(project.parcels).toBeDefined()
  })

  it('throws error for non-existent project ID', async () => {
    await expect(getProjectById('NON-EXISTENT')).rejects.toThrow('Project not found')
  })

  it('fetches land parcels correctly', async () => {
    const res = await getLandParcels()
    expect(res.data.length).toBeGreaterThan(0)
    expect(res.data[0].id).toMatch(/^BD-PARCEL-/)
  })

  it('fetches documents list', async () => {
    const res = await getDocuments()
    expect(res.data.length).toBeGreaterThan(0)
    expect(res.data[0].id).toMatch(/^BD-DOC-/)
  })

  it('fetches notifications with unread count', async () => {
    const res = await getNotifications()
    expect(res.data.length).toBeGreaterThan(0)
    expect(res.unread).toBeGreaterThanOrEqual(0)
  })

  it('fetches dashboard data structure', async () => {
    const data = await getDashboardData()
    expect(data.kpis).toBeDefined()
    expect(data.acquisitionStatus).toBeDefined()
    expect(data.projectProgress).toBeDefined()
  })

  it('returns static helper lists', () => {
    expect(getDistricts()).toContain('Guntur')
    expect(getStages()).toContain('Proposal')
  })
})
