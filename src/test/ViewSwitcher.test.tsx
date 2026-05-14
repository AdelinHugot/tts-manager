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

test('shows only specified views when views prop is provided', () => {
  render(
    <ViewSwitcher activeView="cards" onViewChange={() => {}} views={['list', 'cards']} />
  )
  expect(screen.getByTitle('Vue Liste')).toBeInTheDocument()
  expect(screen.getByTitle('Vue Cards')).toBeInTheDocument()
  expect(screen.queryByTitle('Vue Kanban')).not.toBeInTheDocument()
})

test('shows all views when views prop is omitted', () => {
  render(<ViewSwitcher activeView="list" onViewChange={() => {}} />)
  expect(screen.getByTitle('Vue Liste')).toBeInTheDocument()
  expect(screen.getByTitle('Vue Kanban')).toBeInTheDocument()
  expect(screen.getByTitle('Vue Cards')).toBeInTheDocument()
})
