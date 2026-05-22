import { render, screen } from '@testing-library/react'
import TopTable from '../components/analytics/TopTable'
import type { TopItem } from '../types/analytics'

const items: TopItem[] = [
  { name: 'Produit Alpha', ca: 3240, commissions: 259, orderCount: 42 },
  { name: 'Produit Beta', ca: 1870, commissions: 150, orderCount: 38 },
  { name: 'Produit Gamma', ca: 980, commissions: 78, orderCount: 20 },
]

test('renders all items', () => {
  render(<TopTable items={items} label="Produit" />)
  expect(screen.getByText('Produit Alpha')).toBeDefined()
  expect(screen.getByText('Produit Beta')).toBeDefined()
  expect(screen.getByText('Produit Gamma')).toBeDefined()
})

test('shows rank numbers', () => {
  render(<TopTable items={items} label="Produit" />)
  expect(screen.getByText('1')).toBeDefined()
  expect(screen.getByText('2')).toBeDefined()
})

test('displays CA values formatted', () => {
  render(<TopTable items={items} label="Produit" />)
  // Match locale-formatted 3240 — accepts both thin-space (fr-FR) and regular space
  expect(screen.getByText(/3.?240/)).toBeDefined()
})

test('shows empty state when no items', () => {
  render(<TopTable items={[]} label="Produit" />)
  expect(screen.getByText(/aucune donnée/i)).toBeDefined()
})
