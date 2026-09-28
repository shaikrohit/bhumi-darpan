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
    expect(await screen.findByText('Land Acquisition Projects')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument()
  })

  it('renders project table records', async () => {
    renderWithRouter(<Projects />)
    const matches = await screen.findAllByText('National Highway NH-16 Expansion')
    expect(matches[0]).toBeInTheDocument()
    expect(screen.getAllByText('BD-P-001')[0]).toBeInTheDocument()
  })

  it('filters projects by search input', async () => {
    renderWithRouter(<Projects />)
    await screen.findByText('Land Acquisition Projects')

    const searchInput = screen.getByLabelText('Search Projects')
    fireEvent.change(searchInput, { target: { value: 'Irrigation' } })

    const matches = await screen.findAllByText('Nagarjuna Sagar Canal Modernization')
    expect(matches[0]).toBeInTheDocument()
    expect(screen.queryByText('National Highway NH-16 Expansion')).not.toBeInTheDocument()
  })

  it('filters projects by district selector', async () => {
    renderWithRouter(<Projects />)
    await screen.findByText('Land Acquisition Projects')

    const districtSelect = screen.getByLabelText('Filter by District')
    fireEvent.change(districtSelect, { target: { value: 'Krishna' } })

    const matches = await screen.findAllByText('Nagarjuna Sagar Canal Modernization')
    expect(matches[0]).toBeInTheDocument()
  })

  it('filters projects by status selector', async () => {
    renderWithRouter(<Projects />)
    await screen.findByText('Land Acquisition Projects')

    const statusSelect = screen.getByLabelText('Filter by Status')
    fireEvent.change(statusSelect, { target: { value: 'Delayed' } })

    const matches = await screen.findAllByText(/Industrial Corridor/i)
    expect(matches[0]).toBeInTheDocument()
  })

  it('filters projects by acquisition stage selector', async () => {
    renderWithRouter(<Projects />)
    await screen.findByText('Land Acquisition Projects')

    const stageSelect = screen.getByLabelText('Filter by Acquisition Stage')
    fireEvent.change(stageSelect, { target: { value: 'Approval' } })

    const matches = await screen.findAllByText(/Industrial Corridor/i)
    expect(matches[0]).toBeInTheDocument()
  })

  it('combines filters and displays result count', async () => {
    renderWithRouter(<Projects />)
    await screen.findByText('Land Acquisition Projects')

    const districtSelect = screen.getByLabelText('Filter by District')
    fireEvent.change(districtSelect, { target: { value: 'Visakhapatnam' } })

    expect(await screen.findByText('1 Project Found')).toBeInTheDocument()
  })

  it('resets filters on Reset Filters button click', async () => {
    renderWithRouter(<Projects />)
    await screen.findByText('Land Acquisition Projects')

    const searchInput = screen.getByLabelText('Search Projects')
    fireEvent.change(searchInput, { target: { value: 'Highway' } })

    const resetBtn = await screen.findByRole('button', { name: /reset filters/i })
    fireEvent.click(resetBtn)

    await waitFor(() => {
      expect(searchInput.value).toBe('')
    })
  })

  it('opens New Project modal on button click', async () => {
    renderWithRouter(<Projects />)
    await screen.findByText('Land Acquisition Projects')

    const newBtn = screen.getByRole('button', { name: /new project/i })
    fireEvent.click(newBtn)

    expect(screen.getByText('New Land Acquisition Project')).toBeInTheDocument()
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
    expect(screen.getByText('Statutory Acquisition Lifecycle Timeline')).toBeInTheDocument()
    expect(screen.getAllByText('78%')[0]).toBeInTheDocument()
  })

  it('renders Key Milestones Tracker on Project Details', async () => {
    render(
      <MemoryRouter initialEntries={['/projects/BD-P-001']}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText('Key Operational Milestones')).toBeInTheDocument()
    expect(screen.getByText('Project Proposal Approval')).toBeInTheDocument()
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
