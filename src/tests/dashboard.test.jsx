import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard.jsx'

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Level 2 Dashboard & Monitoring', () => {
  it('renders Dashboard title and subtitle', async () => {
    renderWithRouter(<Dashboard />)
    expect(await screen.findByText('Land Acquisition Dashboard')).toBeInTheDocument()
    expect(screen.getByText(/Real-time monitoring of acquisition, compensation/i)).toBeInTheDocument()
  })

  it('renders executive KPI cards', async () => {
    renderWithRouter(<Dashboard />)
    expect(await screen.findByText('Active Projects')).toBeInTheDocument()
    expect(screen.getByText('Acquisition Cases')).toBeInTheDocument()
    expect(screen.getByText('Pending Verification')).toBeInTheDocument()
  })

  it('renders acquisition status pipeline and project progress sections', async () => {
    renderWithRouter(<Dashboard />)
    expect(await screen.findByText('Acquisition Status Pipeline')).toBeInTheDocument()
    expect(screen.getByText('Project Progress Overview')).toBeInTheDocument()
  })

  it('renders compensation summary and key indicators', async () => {
    renderWithRouter(<Dashboard />)
    expect(await screen.findByText('Compensation & R&R Summary')).toBeInTheDocument()
  })
})
