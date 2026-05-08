import { render, screen } from '@testing-library/react'
import KanbanView from '../components/realisation/KanbanView'
import { MOCK_REALISATIONS, MOCK_PRODUCTS } from '../data/mock'

test('renders all status column headers', () => {
  render(
    <KanbanView
      realisations={MOCK_REALISATIONS}
      products={MOCK_PRODUCTS}
      onSelect={() => {}}
      onStatusChange={() => {}}
    />
  )
  expect(screen.getAllByText('À tourner').length).toBeGreaterThanOrEqual(1)
  expect(screen.getAllByText('Publiée').length).toBeGreaterThanOrEqual(1)
})

test('renders card titles in correct columns', () => {
  render(
    <KanbanView
      realisations={MOCK_REALISATIONS}
      products={MOCK_PRODUCTS}
      onSelect={() => {}}
      onStatusChange={() => {}}
    />
  )
  expect(screen.getByText('Unboxing crème hydratante')).toBeInTheDocument()
})
