import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import LandParcels from '../pages/LandParcels.jsx'
import ProjectDetails from '../pages/ProjectDetails.jsx'
import {
  getLandParcels,
  getParcelById,
  getParcelsByProject,
  searchParcels,
  getParcelStats,
  getParcelMapData,
} from '../services/mockService.js'

// Polyfill ResizeObserver for Leaflet map testing in jsdom
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Level 4 Land Parcels & Cadastral GIS Workspace', () => {
  it('renders Land Parcels page title, subtitle and top controls', async () => {
    renderWithRouter(<LandParcels />)
    const matches = await screen.findAllByText('Land Parcels')
    expect(matches[0]).toBeInTheDocument()
    expect(
      screen.getByText('Cadastral parcel registry and GIS-based acquisition monitoring')
    ).toBeInTheDocument()
  })

  it('renders parcel records in registry table and result count', async () => {
    renderWithRouter(<LandParcels />)
    const matches = await screen.findAllByText('BD-PARCEL-001')
    expect(matches[0]).toBeInTheDocument()
    expect(screen.getAllByText('BD-ULPIN-000001')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Ramapuram')[0]).toBeInTheDocument()
    expect(screen.getByText(/Parcels Found/i)).toBeInTheDocument()
  })

  it('filters parcels by live search query (Parcel ID / ULPIN / Village)', async () => {
    renderWithRouter(<LandParcels />)
    await screen.findAllByText('BD-PARCEL-001')

    const searchInput = screen.getByLabelText('Search Land Parcels')
    fireEvent.change(searchInput, { target: { value: 'BD-PARCEL-002' } })

    const matches = await screen.findAllByText('BD-PARCEL-002', {}, { timeout: 3000 })
    expect(matches[0]).toBeInTheDocument()
    expect(screen.queryByText('BD-PARCEL-001')).not.toBeInTheDocument()
  })

  it('filters parcels by District selector', async () => {
    renderWithRouter(<LandParcels />)
    await screen.findAllByText('BD-PARCEL-001')

    const districtSelect = screen.getByLabelText('Filter by District')
    fireEvent.change(districtSelect, { target: { value: 'Krishna' } })

    const matches = await screen.findAllByText('BD-PARCEL-006', {}, { timeout: 3000 })
    expect(matches[0]).toBeInTheDocument()
    expect(screen.queryByText('BD-PARCEL-001')).not.toBeInTheDocument()
  })

  it('filters parcels by Village selector', async () => {
    renderWithRouter(<LandParcels />)
    await screen.findAllByText('BD-PARCEL-001')

    const villageSelect = screen.getByLabelText('Filter by Village')
    fireEvent.change(villageSelect, { target: { value: 'Renigunta' } })

    const matches = await screen.findAllByText('BD-PARCEL-014', {}, { timeout: 3000 })
    expect(matches[0]).toBeInTheDocument()
  })

  it('filters parcels by Verification Status selector', async () => {
    renderWithRouter(<LandParcels />)
    await screen.findAllByText('BD-PARCEL-001')

    const vSelect = screen.getByLabelText('Filter by Verification Status')
    fireEvent.change(vSelect, { target: { value: 'Needs Review' } })

    const matches = await screen.findAllByText('BD-PARCEL-003', {}, { timeout: 3000 })
    expect(matches[0]).toBeInTheDocument()
  })

  it('filters parcels by Acquisition Status selector', async () => {
    renderWithRouter(<LandParcels />)
    await screen.findAllByText('BD-PARCEL-001')

    const aSelect = screen.getByLabelText('Filter by Acquisition Status')
    fireEvent.change(aSelect, { target: { value: 'Acquired' } })

    const matches = await screen.findAllByText('BD-PARCEL-002', {}, { timeout: 3000 })
    expect(matches[0]).toBeInTheDocument()
  })

  it('filters parcels by Project selector', async () => {
    renderWithRouter(<LandParcels />)
    await screen.findAllByText('BD-PARCEL-001')

    const pSelect = screen.getByLabelText('Filter by Project')
    fireEvent.change(pSelect, { target: { value: 'BD-P-007' } })

    const matches = await screen.findAllByText('BD-PARCEL-014', {}, { timeout: 3000 })
    expect(matches[0]).toBeInTheDocument()
  })

  it('resets all filters when Reset Filters button is clicked', async () => {
    renderWithRouter(<LandParcels />)
    await screen.findAllByText('BD-PARCEL-001')

    const searchInput = screen.getByLabelText('Search Land Parcels')
    fireEvent.change(searchInput, { target: { value: 'Renigunta' } })

    const resetBtn = await screen.findByRole('button', { name: /reset filters/i })
    fireEvent.click(resetBtn)

    await waitFor(() => {
      expect(searchInput.value).toBe('')
    })
  })

  it('opens Parcel Details panel when a parcel is selected from list or table', async () => {
    renderWithRouter(<LandParcels />)
    await screen.findAllByText('BD-PARCEL-001')

    const viewBtns = screen.getAllByRole('button', { name: /^view$/i })
    fireEvent.click(viewBtns[0])

    expect(await screen.findByText('Identification')).toBeInTheDocument()
    expect(screen.getByText('Location & GIS')).toBeInTheDocument()
    expect(screen.getAllByText('LANDHOLDER-001')[0]).toBeInTheDocument()
  })

  it('tests service methods getLandParcels, getParcelById, searchParcels, getParcelMapData', async () => {
    const all = await getLandParcels()
    expect(all.total).toBeGreaterThanOrEqual(24)

    const p1 = await getParcelById('BD-PARCEL-001')
    expect(p1.id).toBe('BD-PARCEL-001')
    expect(p1.ulpin).toBe('BD-ULPIN-000001')

    const searchRes = await searchParcels('BD-ULPIN-000006')
    expect(searchRes.data[0].id).toBe('BD-PARCEL-006')

    const mapData = await getParcelMapData({ district: 'Guntur' })
    expect(mapData.type).toBe('FeatureCollection')
    expect(mapData.features.length).toBeGreaterThan(0)

    const stats = await getParcelStats()
    expect(stats.total).toBeGreaterThanOrEqual(24)
    expect(stats.verified).toBeGreaterThan(0)
  })

  it('integrates Project Details with associated land parcels and links to GIS', async () => {
    render(
      <MemoryRouter initialEntries={['/projects/BD-P-001']}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText('Affected Land Parcels')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /view parcels in gis workspace/i })).toBeInTheDocument()
    expect(screen.getAllByText('BD-PARCEL-001')[0]).toBeInTheDocument()
  })
})
