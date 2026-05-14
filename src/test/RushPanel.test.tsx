import { render, screen, fireEvent } from '@testing-library/react'
import RushPanel from '../components/rushs/RushPanel'
import { MOCK_RUSHES, MOCK_REALISATIONS } from '../data/mock'

const rush = MOCK_RUSHES[0]         // f1, linked to r1 (publiee — safe)
const rushRisky = MOCK_RUSHES[3]    // f4, linked to r3 (a_monter — risky)

const defaultProps = {
  realisations: MOCK_REALISATIONS,
  onClose: () => {},
  onDelete: () => {},
  onCreateRealisation: () => {},
}

test('renders nothing when rush is null', () => {
  const { container } = render(<RushPanel rush={null} {...defaultProps} />)
  expect(container).toBeEmptyDOMElement()
})

test('renders rush name when open', () => {
  render(<RushPanel rush={rush} {...defaultProps} />)
  expect(screen.getByText('rush_01.mp4')).toBeInTheDocument()
})

test('shows linked realisation title', () => {
  render(<RushPanel rush={rush} {...defaultProps} />)
  expect(screen.getByText('Unboxing crème hydratante')).toBeInTheDocument()
})

test('calls onClose when overlay clicked', () => {
  const onClose = vi.fn()
  render(<RushPanel rush={rush} {...defaultProps} onClose={onClose} />)
  const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
  fireEvent.click(overlay)
  expect(onClose).toHaveBeenCalled()
})

test('shows warning before delete when linked realisation has risky status', () => {
  render(<RushPanel rush={rushRisky} {...defaultProps} />)
  fireEvent.click(screen.getByText('Supprimer le rush'))
  expect(screen.getByText(/ne semble pas complètement prête/)).toBeInTheDocument()
})

test('does NOT show warning when linked realisation is published', () => {
  render(<RushPanel rush={rush} {...defaultProps} />)
  fireEvent.click(screen.getByText('Supprimer le rush'))
  expect(screen.queryByText(/ne semble pas complètement prête/)).not.toBeInTheDocument()
  expect(screen.getByText('Confirmer')).toBeInTheDocument()
})

test('calls onDelete after confirmation (safe path)', () => {
  const onDelete = vi.fn()
  render(<RushPanel rush={rush} {...defaultProps} onDelete={onDelete} />)
  fireEvent.click(screen.getByText('Supprimer le rush'))
  fireEvent.click(screen.getByText('Confirmer'))
  expect(onDelete).toHaveBeenCalledWith(rush.id)
})

test('calls onDelete after confirming through risky warning', () => {
  const onDelete = vi.fn()
  render(<RushPanel rush={rushRisky} {...defaultProps} onDelete={onDelete} />)
  fireEvent.click(screen.getByText('Supprimer le rush'))
  expect(screen.getByText(/ne semble pas complètement prête/)).toBeInTheDocument()
  fireEvent.click(screen.getByText('Confirmer quand même'))
  expect(onDelete).toHaveBeenCalledWith(rushRisky.id)
})

test('calls onCreateRealisation when button clicked', () => {
  const onCreate = vi.fn()
  render(<RushPanel rush={rush} {...defaultProps} onCreateRealisation={onCreate} />)
  fireEvent.click(screen.getByText('Créer une Réalisation'))
  expect(onCreate).toHaveBeenCalledWith(rush.id)
})
