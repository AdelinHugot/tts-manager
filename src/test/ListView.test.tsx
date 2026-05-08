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
  expect(screen.getByText('Unboxing crème hydratante')).toBeInTheDocument()
  expect(screen.getByText('GRWM avec le sac en cuir')).toBeInTheDocument()
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
  fireEvent.click(screen.getByText('Unboxing crème hydratante'))
  expect(handler).toHaveBeenCalledWith(MOCK_REALISATIONS[0])
})
