import { render, screen, fireEvent } from '@testing-library/react'
import ProductListView from '../components/produits/ProductListView'
import { MOCK_PRODUCTS, MOCK_REALISATIONS } from '../data/mock'

test('renders all product names in table', () => {
  render(
    <ProductListView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
      onDelete={() => {}}
    />
  )
  expect(screen.getByText('Enzymes Digestives Manager')).toBeInTheDocument()
  expect(screen.getByText('QINGLIN Crème Rajeunissante')).toBeInTheDocument()
})

test('calls onSelect when a row is clicked', () => {
  const handler = vi.fn()
  render(
    <ProductListView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={handler}
      onDelete={() => {}}
    />
  )
  fireEvent.click(screen.getByText('Enzymes Digestives Manager'))
  expect(handler).toHaveBeenCalledWith(MOCK_PRODUCTS[0])
})

test('calls onDelete when delete button is clicked', () => {
  const handler = vi.fn()
  render(
    <ProductListView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
      onDelete={handler}
    />
  )
  const deleteButtons = screen.getAllByTitle('Supprimer')
  fireEvent.click(deleteButtons[0])
  expect(handler).toHaveBeenCalledWith(MOCK_PRODUCTS[0].id)
})
