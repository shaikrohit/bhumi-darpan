import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Documents from '../pages/Documents.jsx'
import {
  getDocuments,
  getDocumentById,
  createDocument,
  addDocumentVersion,
} from '../services/mockService.js'

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Level 5 Document Management Workspace', () => {
  it('renders Document Vault page title and upload action', async () => {
    renderWithRouter(<Documents />)
    expect(await screen.findByText('Document Vault & Audit Trail')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /upload document/i })).toBeInTheDocument()
  })

  it('renders document records in table', async () => {
    renderWithRouter(<Documents />)
    const matches = await screen.findAllByText('Land Records — Survey 142/3A')
    expect(matches[0]).toBeInTheDocument()
    expect(screen.getAllByText('BD-P-001')[0]).toBeInTheDocument()
  })

  it('filters documents by search query', async () => {
    renderWithRouter(<Documents />)
    await screen.findAllByText('Land Records — Survey 142/3A')

    const searchInput = screen.getByPlaceholderText(/search/i)
    fireEvent.change(searchInput, { target: { value: 'Environmental' } })

    expect(await screen.findByText(/Environmental Impact Assessment/i)).toBeInTheDocument()
    expect(screen.queryByText('Land Records — Survey 142/3A')).not.toBeInTheDocument()
  })

  it('tests document service functions getDocuments, getDocumentById, createDocument, addDocumentVersion', async () => {
    const docs = await getDocuments()
    expect(docs.total).toBeGreaterThan(0)

    const doc1 = await getDocumentById('BD-DOC-001')
    expect(doc1.id).toBe('BD-DOC-001')

    const newDoc = await createDocument({
      name: 'Test Gazette Notification',
      category: 'Notifications',
      projectId: 'BD-P-001',
    })
    expect(newDoc.id).toMatch(/^BD-DOC-/)
    expect(newDoc.name).toBe('Test Gazette Notification')

    const updatedDoc = await addDocumentVersion(newDoc.id, { size: '3.0 MB' })
    expect(updatedDoc.versions.length).toBeGreaterThan(1)
  })
})
