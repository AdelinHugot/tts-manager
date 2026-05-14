import { MOCK_PRODUCTS } from '../data/mock'
import { PRODUCT_STATUS_LABELS, PRODUCT_STATUS_COLORS } from '../types/realisation'

test('all mock products have required fields', () => {
  for (const p of MOCK_PRODUCTS) {
    expect(p.id).toBeTruthy()
    expect(p.name).toBeTruthy()
    expect(p.imageUrl).toBeTruthy()
    expect(p.description).toBeDefined()
    expect(['actif', 'rupture_stock', 'inactif']).toContain(p.status)
  }
})

test('PRODUCT_STATUS_LABELS covers all statuses', () => {
  expect(PRODUCT_STATUS_LABELS['actif']).toBe('Actif')
  expect(PRODUCT_STATUS_LABELS['rupture_stock']).toBe('Rupture de stock')
  expect(PRODUCT_STATUS_LABELS['inactif']).toBe('Inactif')
})

test('PRODUCT_STATUS_COLORS covers all statuses', () => {
  for (const status of ['actif', 'rupture_stock', 'inactif'] as const) {
    expect(PRODUCT_STATUS_COLORS[status].dot).toBeTruthy()
    expect(PRODUCT_STATUS_COLORS[status].badge).toBeTruthy()
  }
})
