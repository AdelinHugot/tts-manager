import { render, screen } from '@testing-library/react'
import DonutChart from '../components/analytics/DonutChart'

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

test('renders without crashing', () => {
  const { container } = render(<DonutChart affiliée={70} pub_shopping={30} />)
  expect(container.firstChild).toBeTruthy()
})

test('shows percentages', () => {
  render(<DonutChart affiliée={70} pub_shopping={30} />)
  expect(screen.getByText(/70%/)).toBeDefined()
})

test('shows empty state when both are 0', () => {
  render(<DonutChart affiliée={0} pub_shopping={0} />)
  expect(screen.getByText(/aucune donnée/i)).toBeDefined()
})
