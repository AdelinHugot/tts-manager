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
  expect(screen.getByText('Enzymes Digestives Manager')).toBeInTheDocument()
  expect(screen.getByText('QINGLIN Crème Rajeunissante')).toBeInTheDocument()
  expect(screen.getByText('Papills Sommeil')).toBeInTheDocument()
  expect(screen.getByText('Démarreur Portable 7000A')).toBeInTheDocument()
})

test('shows correct realisation count per product', () => {
  render(
    <ProductCardsView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
    />
  )
  // p1–p5 + p8 have 2 vidéos each, p6 + p7 have 1 vidéo each
  expect(screen.getAllByText('2 vidéos')).toHaveLength(6)
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
  fireEvent.click(screen.getByText('Enzymes Digestives Manager'))
  expect(handler).toHaveBeenCalledWith(MOCK_PRODUCTS[0])
})
