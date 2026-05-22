import { render, screen } from '@testing-library/react'
import Planning from '../pages/Planning'
import { MOCK_REALISATIONS, MOCK_PRODUCTS } from '../data/mock'

const noop = () => {}

test('renders Planning page title', () => {
  render(<Planning realisations={MOCK_REALISATIONS} products={MOCK_PRODUCTS} onPublishDateChange={noop} />)
  expect(screen.getByText('Planning')).toBeInTheDocument()
})

test('shows current month in calendar header', () => {
  render(<Planning realisations={MOCK_REALISATIONS} products={MOCK_PRODUCTS} onPublishDateChange={noop} />)
  const now = new Date()
  const label = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const capitalized = label.charAt(0).toUpperCase() + label.slice(1)
  expect(screen.getByText(capitalized)).toBeInTheDocument()
})

test('shows day-of-week headers', () => {
  render(<Planning realisations={MOCK_REALISATIONS} products={MOCK_PRODUCTS} onPublishDateChange={noop} />)
  expect(screen.getByText('Lun')).toBeInTheDocument()
  expect(screen.getByText('Dim')).toBeInTheDocument()
})

test('shows unscheduled section with count', () => {
  render(<Planning realisations={MOCK_REALISATIONS} products={MOCK_PRODUCTS} onPublishDateChange={noop} />)
  const unscheduledCount = MOCK_REALISATIONS.filter((r) => r.publishDate === null).length
  expect(screen.getByText(`Sans date (${unscheduledCount})`)).toBeInTheDocument()
})

test('renders chips for unscheduled realisations in right column', () => {
  render(<Planning realisations={MOCK_REALISATIONS} products={MOCK_PRODUCTS} onPublishDateChange={noop} />)
  const unscheduled = MOCK_REALISATIONS.filter((r) => r.publishDate === null)
  expect(screen.getAllByText(unscheduled[0].title).length).toBeGreaterThanOrEqual(1)
})
