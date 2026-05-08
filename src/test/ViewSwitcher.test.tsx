import { render, screen, fireEvent } from '@testing-library/react'
import ViewSwitcher from '../components/realisation/ViewSwitcher'

test('calls onViewChange when a view button is clicked', () => {
  const handler = vi.fn()
  render(<ViewSwitcher activeView="list" onViewChange={handler} />)
  fireEvent.click(screen.getByTitle('Vue Kanban'))
  expect(handler).toHaveBeenCalledWith('kanban')
})

test('highlights the active view', () => {
  render(<ViewSwitcher activeView="cards" onViewChange={() => {}} />)
  const cardsBtn = screen.getByTitle('Vue Cards')
  expect(cardsBtn.className).toMatch(/bg-white/)
})
