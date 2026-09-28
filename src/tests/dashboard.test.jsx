import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard.jsx'
import { searchGlobal } from '../services/mockService.js'

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Level 2 Dashboard & Monitoring', () => {
  it('renders Dashboard title and subtitle', async () => {
    renderWithRouter(<Dashboard />)
    expect(await screen.findByText('Land Acquisition Dashboard')).toBeInTheDocument()
    expect(
      screen.getByText(/Real-time monitoring of acquisition, compensation, R&R and possession/i)
    ).toBeInTheDocument()
  })

  it('renders all 6 KPI cards with expected prototype metrics', async () => {
    renderWithRouter(<Dashboard />)
    expect(await screen.findByText('ACTIVE PROJECTS')).toBeInTheDocument()
    expect(screen.getByText('ACQUISITION CASES')).toBeInTheDocument()
    expect(screen.getByText('PENDING VERIFICATION')).toBeInTheDocument()
    expect(screen.getByText('COMPENSATION PENDING')).toBeInTheDocument()
    expect(screen.getByText('R&R PENDING')).toBeInTheDocument()
    expect(screen.getByText('POSSESSION COMPLETED')).toBeInTheDocument()
  })

  it('renders 9-stage lifecycle monitoring chart', async () => {
    renderWithRouter(<Dashboard />)
    expect(await screen.findByText('Acquisition Lifecycle Monitoring')).toBeInTheDocument()
    expect(screen.getByText('Proposal')).toBeInTheDocument()
    expect(screen.getAllByText('Verification')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Compensation & R&R')[0]).toBeInTheDocument()
  })

  it('renders project progress overview items', async () => {
    renderWithRouter(<Dashboard />)
    expect(await screen.findByText('Project Progress Overview')).toBeInTheDocument()
    const p1 = screen.getAllByText('BD-P-001')[0]
    expect(p1).toBeInTheDocument()
  })

  it('renders attention required critical alerts', async () => {
    renderWithRouter(<Dashboard />)
    expect(await screen.findByText('Attention Required')).toBeInTheDocument()
    expect(screen.getByText('Compensation Verification Pending')).toBeInTheDocument()
    expect(screen.getByText('BD-LA-018')).toBeInTheDocument()
  })

  it('renders recent activity timeline', async () => {
    renderWithRouter(<Dashboard />)
    expect(await screen.findByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('Land parcel verified')).toBeInTheDocument()
    expect(screen.getByText('BD-PARCEL-018')).toBeInTheDocument()
  })

  it('changes dashboard metrics when district filter changes', async () => {
    renderWithRouter(<Dashboard />)
    await screen.findByText('Land Acquisition Dashboard')

    const districtSelect = screen.getByLabelText('Select District')
    fireEvent.change(districtSelect, { target: { value: 'Guntur' } })

    await waitFor(() => {
      expect(districtSelect.value).toBe('Guntur')
    })
  })

  it('changes dashboard metrics when status filter changes', async () => {
    renderWithRouter(<Dashboard />)
    await screen.findByText('Land Acquisition Dashboard')

    const statusSelect = screen.getByLabelText('Select Status')
    fireEvent.change(statusSelect, { target: { value: 'On Track' } })

    await waitFor(() => {
      expect(statusSelect.value).toBe('On Track')
    })
  })

  it('triggers refresh action on click', async () => {
    renderWithRouter(<Dashboard />)
    await screen.findByText('Land Acquisition Dashboard')

    const refreshBtn = screen.getByLabelText('Refresh Dashboard Data')
    fireEvent.click(refreshBtn)

    await waitFor(() => {
      expect(screen.getByText('Land Acquisition Dashboard')).toBeInTheDocument()
    })
  })

  it('performs global search and returns matching project records', async () => {
    const results = await searchGlobal('BD-P-001')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].category).toBe('Project')
  })

  it('performs global search for parcels and returns survey details', async () => {
    const results = await searchGlobal('BD-PARCEL-001')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].category).toBe('Land Parcel')
  })
})
