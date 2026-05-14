import { render, screen, fireEvent } from '@testing-library/react'
import RealisationPanel from '../components/realisation/RealisationPanel'
import { MOCK_REALISATIONS, MOCK_PRODUCTS, MOCK_RUSHES } from '../data/mock'

const realisation = MOCK_REALISATIONS[0]
const defaultProps = {
  products: MOCK_PRODUCTS,
  rushes: MOCK_RUSHES,
  onAddRush: () => {},
  onClose: () => {},
  onUpdate: () => {},
}

test('renders nothing when realisation is null', () => {
  const { container } = render(
    <RealisationPanel realisation={null} {...defaultProps} />
  )
  expect(container).toBeEmptyDOMElement()
})

test('renders realisation title when open', () => {
  render(<RealisationPanel realisation={realisation} {...defaultProps} />)
  expect(screen.getByDisplayValue(realisation.title)).toBeInTheDocument()
})

test('calls onClose when overlay is clicked', () => {
  const onClose = vi.fn()
  render(<RealisationPanel realisation={realisation} {...defaultProps} onClose={onClose} />)
  const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
  fireEvent.click(overlay)
  expect(onClose).toHaveBeenCalled()
})

test('calls onUpdate when notes are edited', () => {
  const onUpdate = vi.fn()
  render(<RealisationPanel realisation={realisation} {...defaultProps} onUpdate={onUpdate} />)
  const textarea = screen.getByPlaceholderText('Ajouter une note…')
  fireEvent.change(textarea, { target: { value: 'nouvelle note' } })
  expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ notes: 'nouvelle note' }))
})
