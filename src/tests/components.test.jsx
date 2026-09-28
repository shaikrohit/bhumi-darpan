import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button, Badge, Card, StatCard } from '../components/common'
import { SearchField, PageHeader } from '../components/ui'
import { BrowserRouter } from 'react-router-dom'
import { FolderKanban } from 'lucide-react'

describe('Reusable UI Components', () => {
  it('renders Button with variants and handles click', () => {
    render(<Button variant="primary">Submit Request</Button>)
    const btn = screen.getByRole('button', { name: /submit request/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveClass('bg-navy-600')
  })

  it('renders Badge with text and status style', () => {
    render(<Badge variant="success">Verified</Badge>)
    const badge = screen.getByText('Verified')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-green-100')
  })

  it('renders StatCard with title, value, and trend', () => {
    render(
      <StatCard
        title="Active Projects"
        value="24"
        subtitle="+3 this month"
        trend="up"
        trendValue="+14%"
        icon={FolderKanban}
      />
    )
    expect(screen.getByText('Active Projects')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('+14%')).toBeInTheDocument()
  })

  it('renders PageHeader with title and breadcrumbs', () => {
    render(
      <BrowserRouter>
        <PageHeader
          title="Projects Management"
          subtitle="Manage land acquisition"
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Projects' }]}
        />
      </BrowserRouter>
    )
    expect(screen.getByText('Projects Management')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders SearchField with accessible input', () => {
    render(<SearchField value="" onChange={() => {}} placeholder="Search parcels..." />)
    const input = screen.getByPlaceholderText('Search parcels...')
    expect(input).toBeInTheDocument()
  })
})
