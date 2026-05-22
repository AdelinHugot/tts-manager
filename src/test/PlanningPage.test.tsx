import { render, screen } from '@testing-library/react'
import Planning from '../pages/Planning'
import { MOCK_REALISATIONS } from '../data/mock'

const noop = () => {}

test('renders Planning page title', () => {
  render(<Planning realisations={MOCK_REALISATIONS} onPublishDateChange={noop} />)
  expect(screen.getByText('Planning')).toBeInTheDocument()
})

test('shows current month in calendar header', () => {
  render(<Planning realisations={MOCK_REALISATIONS} onPublishDateChange={noop} />)
  const now = new Date()
  const label = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const capitalized = label.charAt(0).toUpperCase() + label.slice(1)
  expect(screen.getByText(capitalized)).toBeInTheDocument()
})

test('shows day-of-week headers', () => {
  render(<Planning realisations={MOCK_REALISATIONS} onPublishDateChange={noop} />)
  expect(screen.getByText('Lun')).toBeInTheDocument()
  expect(screen.getByText('Dim')).toBeInTheDocument()
})

test('shows unscheduled section with count', () => {
  render(<Planning realisations={MOCK_REALISATIONS} onPublishDateChange={noop} />)
  const unscheduledCount = MOCK_REALISATIONS.filter((r) => r.publishDate === null).length
  expect(screen.getByText(`Sans date (${unscheduledCount})`)).toBeInTheDocument()
})

test('renders chips for unscheduled realisations in right column', () => {
  render(<Planning realisations={MOCK_REALISATIONS} onPublishDateChange={noop} />)
  // r6, r7, r8, r9 have publishDate = null
  expect(screen.getAllByText('Sac en cuir — styling 5 tenues').length).toBeGreaterThanOrEqual(1)
  expect(screen.getAllByText('Diffuseur — ambiance soirée').length).toBeGreaterThanOrEqual(1)
})
