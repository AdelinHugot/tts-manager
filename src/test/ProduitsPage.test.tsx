import { render, screen, fireEvent } from '@testing-library/react'
import ProduitsPage from '../pages/Produits'
import { MOCK_PRODUCTS, MOCK_REALISATIONS } from '../data/mock'

vi.mock('../hooks/useFirestore', () => ({
  useProducts: () => ({ data: MOCK_PRODUCTS, loading: false, error: null }),
  useRealisations: () => ({ data: MOCK_REALISATIONS, loading: false, error: null }),
}))

vi.mock('../lib/firestore', () => ({
  fsAddProduct: vi.fn().mockResolvedValue('new-id'),
  fsUpdateProduct: vi.fn().mockResolvedValue(undefined),
  fsDeleteProduct: vi.fn().mockResolvedValue(undefined),
}))

test('renders page title', () => {
  render(<ProduitsPage />)
  expect(screen.getByText('Produits')).toBeInTheDocument()
})

test('shows product count', () => {
  render(<ProduitsPage />)
  expect(screen.getByText(`${MOCK_PRODUCTS.length} produits`)).toBeInTheDocument()
})

test('renders cards view by default', () => {
  render(<ProduitsPage />)
  expect(screen.getByText('Enzymes Digestives Manager')).toBeInTheDocument()
})

test('can switch to list view', () => {
  render(<ProduitsPage />)
  fireEvent.click(screen.getByTitle('Vue Liste'))
  expect(screen.getByText('Produit')).toBeInTheDocument()
})
