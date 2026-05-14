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
  expect(screen.getByText('rush_01.mp4')).toBeInTheDocument()
  expect(screen.getByText('broll_01.mp4')).toBeInTheDocument()
  expect(screen.getByText('final_v2.mp4')).toBeInTheDocument()
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
  expect(screen.getAllByText('Lié')).toHaveLength(5)
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
  fireEvent.click(screen.getByText('rush_01.mp4'))
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
