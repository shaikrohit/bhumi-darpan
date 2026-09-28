import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Verification from '../pages/Verification.jsx'
import {
  getVerificationRecords,
  getVerificationById,
  compareVerificationFields,
  updateVerificationStatus,
} from '../services/mockService.js'

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Level 5 Verification & Scrutiny Workspace', () => {
  it('renders Verification Workspace title and verification queue', async () => {
    renderWithRouter(<Verification />)
    expect(await screen.findByText('Verification Workspace')).toBeInTheDocument()
    expect(screen.getByText('Verification Queue')).toBeInTheDocument()
  })

  it('renders cross-validation side-by-side comparison panels', async () => {
    renderWithRouter(<Verification />)
    expect(await screen.findByText(/Cross-Validation/i)).toBeInTheDocument()
    expect(screen.getByText('State Land Record Data')).toBeInTheDocument()
    expect(screen.getByText('GIS & Uploaded Evidence')).toBeInTheDocument()
  })

  it('tests verification service methods', async () => {
    const records = await getVerificationRecords()
    expect(records.total).toBeGreaterThan(0)

    const rec1 = records.data[0]
    const fetched = await getVerificationById(rec1.id || rec1.parcelId)
    expect(fetched).toBeDefined()

    const updated = await updateVerificationStatus(rec1.id || rec1.parcelId, 'Approved', 'Verification completed cleanly')
    expect(updated.status).toBe('Approved')
  })
})
