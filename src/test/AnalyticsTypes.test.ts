import { MOCK_ORDERS } from '../data/mockAnalytics'

test('MOCK_ORDERS has at least 50 entries', () => {
  expect(MOCK_ORDERS.length).toBeGreaterThanOrEqual(50)
})

test('every Order has required fields with correct types', () => {
  for (const o of MOCK_ORDERS) {
    expect(typeof o.id).toBe('string')
    expect(o.date).toBeInstanceOf(Date)
    expect(typeof o.productName).toBe('string')
    expect(typeof o.boutiqueName).toBe('string')
    expect(typeof o.price).toBe('number')
    expect(typeof o.commissionStandard).toBe('number')
    expect(typeof o.commissionPub).toBe('number')
    expect(['affiliée', 'pub_shopping']).toContain(o.orderType)
    expect(['Réglée', 'Inéligible', 'En attente']).toContain(o.status)
  }
})

test('MOCK_ORDERS spans multiple months', () => {
  const months = new Set(MOCK_ORDERS.map(o => o.date.getMonth()))
  expect(months.size).toBeGreaterThanOrEqual(3)
})
