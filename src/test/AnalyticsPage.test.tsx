import { render, screen, fireEvent } from '@testing-library/react'
import Analytics from '../pages/Analytics'

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

test('renders page title', () => {
  render(<Analytics />)
  expect(screen.getByText('Analytics')).toBeDefined()
})

test('renders 4 KPI cards', () => {
  render(<Analytics />)
  expect(screen.getByText('CA Généré')).toBeDefined()
  expect(screen.getByText('Commissions')).toBeDefined()
  expect(screen.getByText('Commandes')).toBeDefined()
  expect(screen.getByText('Panier moyen')).toBeDefined()
})

test('renders period button with active label', () => {
  render(<Analytics />)
  // Button shows the active period label (default: 30 jours)
  expect(screen.getByText('30 jours')).toBeDefined()
})

test('renders tabs', () => {
  render(<Analytics />)
  expect(screen.getByText('Vue générale')).toBeDefined()
  expect(screen.getByText('Top Produits')).toBeDefined()
  expect(screen.getByText('Top Boutiques')).toBeDefined()
})

test('switches to Top Produits tab on click', () => {
  render(<Analytics />)
  fireEvent.click(screen.getByText('Top Produits'))
  // The TopTable header column "Produit" should appear
  expect(screen.getByText('Produit')).toBeDefined()
})

test('switches to Top Boutiques tab on click', () => {
  render(<Analytics />)
  fireEvent.click(screen.getByText('Top Boutiques'))
  expect(screen.getByText('Boutique')).toBeDefined()
})

test('changing period via picker updates display without crashing', () => {
  render(<Analytics />)
  // Open the picker then click a preset inside it
  fireEvent.click(screen.getByText('30 jours'))
  fireEvent.click(screen.getByText('7 jours'))
  expect(screen.getByText('CA Généré')).toBeDefined()
})
