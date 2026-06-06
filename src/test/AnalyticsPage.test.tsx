import { render, screen, fireEvent } from '@testing-library/react'
import Analytics from '../pages/Analytics'
import { MOCK_ORDERS } from '../data/mockAnalytics'

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

test('renders page title', () => {
  render(<Analytics orders={MOCK_ORDERS} />)
  expect(screen.getByText('Analytics')).toBeDefined()
})

test('renders 4 KPI cards', () => {
  render(<Analytics orders={MOCK_ORDERS} />)
  expect(screen.getByText('CA Généré')).toBeDefined()
  expect(screen.getByText('Commissions')).toBeDefined()
  expect(screen.getByText('Commandes réglées')).toBeDefined()
  expect(screen.getByText('Panier moyen')).toBeDefined()
})

test('renders period button with active label', () => {
  render(<Analytics orders={MOCK_ORDERS} />)
  // Button shows the active period label (default: Ce mois-ci)
  expect(screen.getByText('Ce mois-ci')).toBeDefined()
})

test('renders tabs', () => {
  render(<Analytics orders={MOCK_ORDERS} />)
  expect(screen.getByText('Vue générale')).toBeDefined()
  expect(screen.getByText('Top Produits')).toBeDefined()
  expect(screen.getByText('Top Boutiques')).toBeDefined()
})

test('switches to Top Produits tab on click', () => {
  render(<Analytics orders={MOCK_ORDERS} />)
  fireEvent.click(screen.getByText('Top Produits'))
  // Both the tab button and the section heading say "Top Produits"
  expect(screen.getAllByText('Top Produits').length).toBeGreaterThanOrEqual(2)
})

test('switches to Top Boutiques tab on click', () => {
  render(<Analytics orders={MOCK_ORDERS} />)
  fireEvent.click(screen.getByText('Top Boutiques'))
  expect(screen.getAllByText('Top Boutiques').length).toBeGreaterThanOrEqual(2)
})

test('changing period via picker updates display without crashing', () => {
  render(<Analytics orders={MOCK_ORDERS} />)
  // Open the picker then click a preset inside it
  fireEvent.click(screen.getByText('Ce mois-ci'))
  fireEvent.click(screen.getByText('Mois précédent'))
  expect(screen.getByText('CA Généré')).toBeDefined()
})
