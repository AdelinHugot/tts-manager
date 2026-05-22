import { render, screen } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import RealisationChip from '../components/planning/RealisationChip'
import { MOCK_REALISATIONS } from '../data/mock'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <DndContext>{children}</DndContext>
}

// MOCK_REALISATIONS[0] = r1, status: 'publiee'
// MOCK_REALISATIONS[5] = r6, status: 'script'

test('renders realisation title', () => {
  render(
    <Wrapper>
      <RealisationChip realisation={MOCK_REALISATIONS[0]} />
    </Wrapper>
  )
  expect(screen.getByText(MOCK_REALISATIONS[0].title)).toBeInTheDocument()
})

test('renders status dot with color class for publiee', () => {
  render(
    <Wrapper>
      <RealisationChip realisation={MOCK_REALISATIONS[0]} />
    </Wrapper>
  )
  // publiee → dot = bg-emerald-500
  expect(document.querySelector('.bg-emerald-500')).toBeInTheDocument()
})

test('renders status dot with color class for script', () => {
  render(
    <Wrapper>
      <RealisationChip realisation={MOCK_REALISATIONS[5]} />
    </Wrapper>
  )
  // MOCK_REALISATIONS[5] = r6, status: 'script' → dot = bg-violet-500
  expect(document.querySelector('.bg-violet-500')).toBeInTheDocument()
})
