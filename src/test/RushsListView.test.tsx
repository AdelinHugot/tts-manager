import { render, screen, fireEvent } from '@testing-library/react'
import RushsListView from '../components/rushs/RushsListView'
import { MOCK_RUSHES, MOCK_REALISATIONS } from '../data/mock'

test('renders all rush names', () => {
  render(
    <RushsListView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
      onDelete={() => {}}
    />
  )
  expect(screen.getByText(MOCK_RUSHES[0].name)).toBeInTheDocument()
  expect(screen.getByText(MOCK_RUSHES[1].name)).toBeInTheDocument()
  expect(screen.getByText(MOCK_RUSHES[2].name)).toBeInTheDocument()
})

test('shows "Lié" badge for rushes linked to a realisation', () => {
  render(
    <RushsListView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
      onDelete={() => {}}
    />
  )
  // All 6 rushes are linked to at least one réalisation
  expect(screen.getAllByText('Lié')).toHaveLength(MOCK_RUSHES.length)
})

test('calls onSelect when a row is clicked', () => {
  const onSelect = vi.fn()
  render(
    <RushsListView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={onSelect}
      onDelete={() => {}}
    />
  )
  fireEvent.click(screen.getByText(MOCK_RUSHES[0].name))
  expect(onSelect).toHaveBeenCalledWith(MOCK_RUSHES[0])
})

test('calls onDelete when delete button is clicked', () => {
  const onDelete = vi.fn()
  render(
    <RushsListView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
      onDelete={onDelete}
    />
  )
  const deleteButtons = screen.getAllByTitle('Supprimer ce rush')
  fireEvent.click(deleteButtons[0])
  expect(onDelete).toHaveBeenCalledWith(MOCK_RUSHES[0].id)
})
