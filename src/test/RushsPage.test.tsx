import { render, screen } from '@testing-library/react'
import RushsPage from '../pages/Rushs'
import { MOCK_RUSHES, MOCK_REALISATIONS } from '../data/mock'

const defaultProps = {
  rushes: MOCK_RUSHES,
  realisations: MOCK_REALISATIONS,
  onAddRush: () => {},
  onDeleteRush: () => {},
  onLinkRush: () => {},
  onCreateRealisation: () => {},
}

test('renders page title', () => {
  render(<RushsPage {...defaultProps} />)
  expect(screen.getByText('Rushs')).toBeInTheDocument()
})

test('shows rush count in subtitle', () => {
  render(<RushsPage {...defaultProps} />)
  expect(screen.getByText(`${MOCK_RUSHES.length} rushs`)).toBeInTheDocument()
})

test('shows empty state when no rushes', () => {
  render(<RushsPage {...defaultProps} rushes={[]} />)
  expect(screen.getByText(/Dépose tes rushs ici/)).toBeInTheDocument()
})

test('renders list view by default with rush names visible', () => {
  render(<RushsPage {...defaultProps} />)
  expect(screen.getByText(MOCK_RUSHES[0].name)).toBeInTheDocument()
})
