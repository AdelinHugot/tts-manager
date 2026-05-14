import { render, screen, fireEvent } from '@testing-library/react'
import ProductCardsView from '../components/produits/ProductCardsView'
import { MOCK_PRODUCTS, MOCK_REALISATIONS } from '../data/mock'

test('renders all product names', () => {
  render(
    <ProductCardsView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
    />
  )
  expect(screen.getByText('Crème hydratante bio')).toBeInTheDocument()
  expect(screen.getByText('Sac en cuir végétal')).toBeInTheDocument()
  expect(screen.getByText('Montre minimaliste')).toBeInTheDocument()
  expect(screen.getByText('Diffuseur huiles essentielles')).toBeInTheDocument()
})

test('shows correct realisation count per product', () => {
  render(
    <ProductCardsView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
    />
  )
  // p1 + p2 have 2 réalisations each, p3 + p4 have 1 each
  expect(screen.getAllByText('2 vidéos')).toHaveLength(2)
  expect(screen.getAllByText('1 vidéo')).toHaveLength(2)
})

test('calls onSelect when a card is clicked', () => {
  const handler = vi.fn()
  render(
    <ProductCardsView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={handler}
    />
  )
  fireEvent.click(screen.getByText('Crème hydratante bio'))
  expect(handler).toHaveBeenCalledWith(MOCK_PRODUCTS[0])
})
