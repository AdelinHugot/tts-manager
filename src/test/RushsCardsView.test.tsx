import { render, screen, fireEvent } from '@testing-library/react'
import RushsCardsView from '../components/rushs/RushsCardsView'
import { MOCK_RUSHES, MOCK_REALISATIONS } from '../data/mock'

test('renders all rush names', () => {
  render(
    <RushsCardsView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
    />
  )
  expect(screen.getByText('rush_01.mp4')).toBeInTheDocument()
  expect(screen.getByText('final_v2.mp4')).toBeInTheDocument()
})

test('calls onSelect when a card is clicked', () => {
  const onSelect = vi.fn()
  render(
    <RushsCardsView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={onSelect}
    />
  )
  fireEvent.click(screen.getByText('rush_01.mp4'))
  expect(onSelect).toHaveBeenCalledWith(MOCK_RUSHES[0])
})

test('sets rushId on dragStart', () => {
  render(
    <RushsCardsView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
    />
  )
  const cards = screen.getAllByRole('article')
  const setData = vi.fn()
  fireEvent.dragStart(cards[0], {
    dataTransfer: { setData, effectAllowed: '' },
  })
  expect(setData).toHaveBeenCalledWith('text/rush-id', MOCK_RUSHES[0].id)
})
