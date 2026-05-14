import { render, screen, fireEvent } from '@testing-library/react'
import ProductPanel from '../components/produits/ProductPanel'
import { MOCK_PRODUCTS, MOCK_REALISATIONS } from '../data/mock'

const product = MOCK_PRODUCTS[0]

test('renders nothing when product is null', () => {
  const { container } = render(
    <ProductPanel
      product={null}
      realisations={MOCK_REALISATIONS}
      onClose={() => {}}
      onUpdate={() => {}}
      onDelete={() => {}}
    />
  )
  expect(container).toBeEmptyDOMElement()
})

test('renders product name when open', () => {
  render(
    <ProductPanel
      product={product}
      realisations={MOCK_REALISATIONS}
      onClose={() => {}}
      onUpdate={() => {}}
      onDelete={() => {}}
    />
  )
  expect(screen.getByDisplayValue(product.name)).toBeInTheDocument()
})

test('calls onClose when overlay is clicked', () => {
  const onClose = vi.fn()
  render(
    <ProductPanel
      product={product}
      realisations={MOCK_REALISATIONS}
      onClose={onClose}
      onUpdate={() => {}}
      onDelete={() => {}}
    />
  )
  const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
  fireEvent.click(overlay)
  expect(onClose).toHaveBeenCalled()
})

test('calls onUpdate when description is edited', () => {
  const onUpdate = vi.fn()
  render(
    <ProductPanel
      product={product}
      realisations={MOCK_REALISATIONS}
      onClose={() => {}}
      onUpdate={onUpdate}
      onDelete={() => {}}
    />
  )
  const textarea = screen.getByPlaceholderText('Description du produit…')
  fireEvent.change(textarea, { target: { value: 'nouvelle description' } })
  expect(onUpdate).toHaveBeenCalledWith(
    expect.objectContaining({ description: 'nouvelle description' })
  )
})

test('shows linked realisations', () => {
  render(
    <ProductPanel
      product={product}
      realisations={MOCK_REALISATIONS}
      onClose={() => {}}
      onUpdate={() => {}}
      onDelete={() => {}}
    />
  )
  // p1 has r1 "Unboxing crème hydratante" and r5 "Crème hydratante — before/after"
  expect(screen.getByText('Unboxing crème hydratante')).toBeInTheDocument()
  expect(screen.getByText('Crème hydratante — before/after')).toBeInTheDocument()
})
