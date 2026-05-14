import { render, screen, fireEvent } from '@testing-library/react'
import ProduitsPage from '../pages/Produits'

test('renders page title', () => {
  render(<ProduitsPage />)
  expect(screen.getByText('Produits')).toBeInTheDocument()
})

test('shows product count', () => {
  render(<ProduitsPage />)
  expect(screen.getByText(/4 produits/)).toBeInTheDocument()
})

test('renders cards view by default', () => {
  render(<ProduitsPage />)
  expect(screen.getByText('Crème hydratante bio')).toBeInTheDocument()
})

test('can switch to list view', () => {
  render(<ProduitsPage />)
  fireEvent.click(screen.getByTitle('Vue Liste'))
  // table header appears
  expect(screen.getByText('Produit')).toBeInTheDocument()
})

test('clicking nouveau produit adds a product and opens panel', () => {
  render(<ProduitsPage />)
  fireEvent.click(screen.getByText('Nouveau produit'))
  expect(screen.getByText(/5 produits/)).toBeInTheDocument()
})
