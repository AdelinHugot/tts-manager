import { render, screen } from '@testing-library/react'
import TrendChart from '../components/analytics/TrendChart'
import type { WeeklyPoint } from '../types/analytics'

// Recharts uses ResizeObserver internally — mock it
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const points: WeeklyPoint[] = [
  { week: 'S1', ca: 120, commissions: 15 },
  { week: 'S2', ca: 200, commissions: 22 },
  { week: 'S3', ca: 180, commissions: 19 },
]

test('renders without crashing with valid data', () => {
  const { container } = render(<TrendChart data={points} />)
  expect(container.firstChild).toBeTruthy()
})

test('shows empty state when no data', () => {
  render(<TrendChart data={[]} />)
  expect(screen.getByText(/aucune donnée/i)).toBeDefined()
})
