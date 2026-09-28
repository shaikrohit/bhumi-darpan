import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import Projects from '../pages/Projects.jsx'
import ProjectDetails from '../pages/ProjectDetails.jsx'
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  updateProjectStatus,
  updateProjectMilestone,
  resetProjectsStore,
} from '../services/mockService.js'

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Level 3 Projects & Acquisition Workflow', () => {
  beforeEach(() => {
    resetProjectsStore()
  })

  it('renders Projects page title and actions', async () => {
    renderWithRouter(<Projects />)
    expect(await screen.findByText('Projects Management')).toBeInTheDocument()
  })

  it('renders project table records', async () => {
    renderWithRouter(<Projects />)
    const matches = await screen.findAllByText('National Highway NH-16 Expansion')
    expect(matches[0]).toBeInTheDocument()
    expect(screen.getAllByText('BD-P-001')[0]).toBeInTheDocument()
  })

  it('filters projects by search input', async () => {
    renderWithRouter(<Projects />)
    await screen.findByText('Projects Management')

    const searchInput = screen.getByPlaceholderText(/Search by Project Name/i)
    fireEvent.change(searchInput, { target: { value: 'Canal' } })

    expect(await screen.findByText('Nagarjuna Sagar Canal Modernization')).toBeInTheDocument()
    expect(screen.queryByText('National Highway NH-16 Expansion')).not.toBeInTheDocument()
  })

  it('filters projects by status selector', async () => {
    renderWithRouter(<Projects />)
    await screen.findByText('Projects Management')

    const statusSelect = screen.getByLabelText('Filter by Status')
    fireEvent.change(statusSelect, { target: { value: 'Delayed' } })

    await waitFor(() => {
      expect(screen.getByText(/Visakhapatnam–Chennai Industrial Corridor/i)).toBeInTheDocument()
    })
  })

  it('validates project creation service with required fields', async () => {
    await expect(createProject({})).rejects.toThrow('Missing required project fields')
  })

  it('successfully creates new synthetic project via service', async () => {
    const newProj = await createProject({
      name: 'Vizag Port Logistics Hub',
      authority: 'Port Authority',
      district: 'Visakhapatnam',
      landRequired: '50 acres',
      projectType: 'Infrastructure',
    })

    expect(newProj.id).toMatch(/^BD-P-/)
    expect(newProj.name).toBe('Vizag Port Logistics Hub')

    const fetched = await getProjectById(newProj.id)
    expect(fetched.name).toBe('Vizag Port Logistics Hub')
  })

  it('renders Project Details route with 9-stage lifecycle timeline', async () => {
    render(
      <MemoryRouter initialEntries={['/projects/BD-P-001']}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText('National Highway NH-16 Expansion')).toBeInTheDocument()
    expect(screen.getByText('Acquisition Lifecycle Timeline')).toBeInTheDocument()
    expect(screen.getByText('Affected Land Parcels')).toBeInTheDocument()
  })

  it('updates project status via mock service', async () => {
    const updated = await updateProjectStatus('BD-P-001', 'At Risk')
    expect(updated.status).toBe('At Risk')

    const fetched = await getProjectById('BD-P-001')
    expect(fetched.status).toBe('At Risk')
  })

  it('updates milestone status via mock service', async () => {
    const updated = await updateProjectMilestone('BD-P-001', 'MS-006', {
      status: 'Completed',
      date: '2026-03-28',
    })
    expect(updated.milestones.find((m) => m.id === 'MS-006').status).toBe('Completed')
  })
})
