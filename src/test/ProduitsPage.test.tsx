import { render, screen, fireEvent } from '@testing-library/react'
import ProduitsPage from '../pages/Produits'
import { MOCK_PRODUCTS } from '../data/mock'

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

test('clicking nouveau produit adds a product and opens panel', () => {
  render(<ProduitsPage />)
  fireEvent.click(screen.getByText('Nouveau produit'))
  expect(screen.getByText(`${MOCK_PRODUCTS.length + 1} produits`)).toBeInTheDocument()
})
