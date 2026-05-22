import { render, screen, fireEvent } from '@testing-library/react'
import RushPanel from '../components/rushs/RushPanel'
import { MOCK_RUSHES, MOCK_REALISATIONS } from '../data/mock'

// f3 (MOCK_RUSHES[2]) = 'rush_papills_v2.mp4', linked only to r5 (publiee) → safe
// f4 (MOCK_RUSHES[3]) = 'rush_basis_lab_01.mp4' — we override its linked réalisation to a_monter for risky tests
const rush = MOCK_RUSHES[2]
const rushRisky = MOCK_RUSHES[3]

// Réalisations with f4 linked to a risky (a_monter) status
const riskyRealisations = MOCK_REALISATIONS.map((r) =>
  r.rushIds.includes('f4') ? { ...r, status: 'a_monter' as const } : r
)

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
  expect(screen.getByText(rush.name)).toBeInTheDocument()
})

test('shows linked realisation title', () => {
  render(<RushPanel rush={rush} {...defaultProps} />)
  // rush (f3) is linked to r5: 'Papills Sommeil — test complet après 2 semaines'
  expect(screen.getByText(MOCK_REALISATIONS[4].title)).toBeInTheDocument()
})

test('calls onClose when overlay clicked', () => {
  const onClose = vi.fn()
  render(<RushPanel rush={rush} {...defaultProps} onClose={onClose} />)
  const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
  fireEvent.click(overlay)
  expect(onClose).toHaveBeenCalled()
})

test('shows warning before delete when linked realisation has risky status', () => {
  render(<RushPanel rush={rushRisky} {...defaultProps} realisations={riskyRealisations} />)
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
  render(<RushPanel rush={rushRisky} {...defaultProps} realisations={riskyRealisations} onDelete={onDelete} />)
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
