import { render, screen, fireEvent } from '@testing-library/react'
import RealisationPanel from '../components/realisation/RealisationPanel'
import { MOCK_REALISATIONS, MOCK_PRODUCTS } from '../data/mock'

const realisation = MOCK_REALISATIONS[0]

test('renders nothing when realisation is null', () => {
  const { container } = render(
    <RealisationPanel realisation={null} products={MOCK_PRODUCTS} onClose={() => {}} onUpdate={() => {}} />
  )
  expect(container).toBeEmptyDOMElement()
})

test('renders realisation title when open', () => {
  render(
    <RealisationPanel realisation={realisation} products={MOCK_PRODUCTS} onClose={() => {}} onUpdate={() => {}} />
  )
  expect(screen.getByDisplayValue(realisation.title)).toBeInTheDocument()
})

test('calls onClose when overlay is clicked', () => {
  const onClose = vi.fn()
  render(
    <RealisationPanel realisation={realisation} products={MOCK_PRODUCTS} onClose={onClose} onUpdate={() => {}} />
  )
  const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
  fireEvent.click(overlay)
  expect(onClose).toHaveBeenCalled()
})

test('calls onUpdate when notes are edited', () => {
  const onUpdate = vi.fn()
  render(
    <RealisationPanel realisation={realisation} products={MOCK_PRODUCTS} onClose={() => {}} onUpdate={onUpdate} />
  )
  const textarea = screen.getByPlaceholderText('Ajouter une note…')
  fireEvent.change(textarea, { target: { value: 'nouvelle note' } })
  expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ notes: 'nouvelle note' }))
})
