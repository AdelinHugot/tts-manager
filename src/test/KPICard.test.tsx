import { render, screen } from '@testing-library/react'
import KPICard from '../components/analytics/KPICard'

test('renders label and value', () => {
  render(<KPICard label="CA Généré" value="1 234 €" />)
  expect(screen.getByText('CA Généré')).toBeDefined()
  expect(screen.getByText('1 234 €')).toBeDefined()
})

test('shows positive trend badge in green', () => {
  render(<KPICard label="CA" value="1 000 €" trend={18} />)
  const badge = screen.getByText(/↑.*18/)
  expect(badge.className).toMatch(/green|emerald/)
})

test('shows negative trend badge in red', () => {
  render(<KPICard label="CA" value="1 000 €" trend={-5} />)
  const badge = screen.getByText(/↓.*5/)
  expect(badge.className).toMatch(/red/)
})

test('shows no badge when trend is null', () => {
  render(<KPICard label="CA" value="1 000 €" trend={null} />)
  expect(screen.queryByText(/↑|↓/)).toBeNull()
})
