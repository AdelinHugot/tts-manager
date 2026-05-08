import { render, screen } from '@testing-library/react'
import StatusBadge from '../components/realisation/StatusBadge'

test('renders correct label for each status', () => {
  const { rerender } = render(<StatusBadge status="a_tourner" />)
  expect(screen.getByText('À tourner')).toBeInTheDocument()

  rerender(<StatusBadge status="publiee" />)
  expect(screen.getByText('Publiée')).toBeInTheDocument()
})
