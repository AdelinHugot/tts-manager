import { render, screen, fireEvent } from '@testing-library/react'
import ListView from '../components/realisation/ListView'
import { MOCK_REALISATIONS, MOCK_PRODUCTS } from '../data/mock'

test('renders all realisations in the list', () => {
  render(
    <ListView
      realisations={MOCK_REALISATIONS}
      products={MOCK_PRODUCTS}
      onSelect={() => {}}
    />
  )
  expect(screen.getByText(MOCK_REALISATIONS[0].title)).toBeInTheDocument()
  expect(screen.getByText(MOCK_REALISATIONS[1].title)).toBeInTheDocument()
})

test('calls onSelect when a row is clicked', () => {
  const handler = vi.fn()
  render(
    <ListView
      realisations={MOCK_REALISATIONS}
      products={MOCK_PRODUCTS}
      onSelect={handler}
    />
  )
  fireEvent.click(screen.getByText(MOCK_REALISATIONS[0].title))
  expect(handler).toHaveBeenCalledWith(MOCK_REALISATIONS[0])
})
