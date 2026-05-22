import { filterByPeriod, computeKPIs, computeWeeklyTrend, computeOrderTypeBreakdown, computeTopProducts, computeTopBoutiques } from '../utils/analyticsUtils'
import type { Order } from '../types/analytics'
import { MOCK_ORDERS } from '../data/mockAnalytics'

const now = Date.now()
const orders: Order[] = [
  { id: '1', date: new Date(now), productName: 'Prod A', boutiqueName: 'Shop X', price: 100, commissionStandard: 10, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: '2', date: new Date(now), productName: 'Prod A', boutiqueName: 'Shop X', price: 50, commissionStandard: 0, commissionPub: 5, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '3', date: new Date(now), productName: 'Prod B', boutiqueName: 'Shop Y', price: 200, commissionStandard: 20, commissionPub: 0, orderType: 'affiliée', status: 'Inéligible' },
  { id: '4', date: new Date(now - 100 * 86400000), productName: 'Prod C', boutiqueName: 'Shop Z', price: 80, commissionStandard: 8, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
]

test('filterByPeriod "30j" keeps only orders in last 30 days', () => {
  const result = filterByPeriod(orders, '30j')
  expect(result).toHaveLength(3)
  expect(result.every(o => o.id !== '4')).toBe(true)
})

test('filterByPeriod "7j" excludes orders older than 7 days', () => {
  const old = { ...orders[0], id: 'old', date: new Date(now - 10 * 86400000) }
  const result = filterByPeriod([...orders, old], '7j')
  expect(result.every(o => o.id !== 'old' && o.id !== '4')).toBe(true)
})

test('filterByPeriod "3m" keeps orders within 90 days', () => {
  const result = filterByPeriod(orders, '3m')
  expect(result.every(o => o.id !== '4')).toBe(true)
})

test('filterByPeriod "6m" includes orders within 180 days', () => {
  // order 4 is 100 days old → should be included in 6m window
  const result = filterByPeriod(orders, '6m')
  expect(result.some(o => o.id === '4')).toBe(true)
})

test('filterByPeriod "tout" returns all orders', () => {
  const result = filterByPeriod(orders, 'tout')
  expect(result).toHaveLength(4)
})

test('computeKPIs calculates correctly on Réglée orders', () => {
  const réglées = orders.filter(o => o.status === 'Réglée')
  const kpis = computeKPIs(réglées, réglées, 'tout')
  expect(kpis.totalCA).toBeCloseTo(230) // 100 + 50 + 80 (orders 1, 2, 4)
  expect(kpis.totalCommissions).toBeCloseTo(23) // 10 + 5 + 8
  expect(kpis.totalOrders).toBe(3)
  expect(kpis.validatedOrders).toBe(3)
  expect(kpis.averageBasket).toBeCloseTo(230 / 3)
  expect(kpis.caGrowth).toBeNull() // 'tout' → no previous period window → null
})

test('computeKPIs caGrowth is correct when previous period has data', () => {
  const prevOrder: Order = { id: 'prev', date: new Date(now - 45 * 86400000), productName: 'X', boutiqueName: 'Y', price: 100, commissionStandard: 10, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' }
  const currOrder: Order = { id: 'curr', date: new Date(now - 15 * 86400000), productName: 'X', boutiqueName: 'Y', price: 150, commissionStandard: 15, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' }
  const all = [prevOrder, currOrder]
  const current = [currOrder]
  const kpis = computeKPIs(current, all, '30j')
  expect(kpis.caGrowth).toBe(50) // (150 - 100) / 100 * 100 = 50%
  expect(kpis.commissionsGrowth).toBe(50)
})

test('computeTopProducts groups by productName and sorts by CA desc', () => {
  const tops = computeTopProducts(orders.filter(o => o.status === 'Réglée'))
  expect(tops[0].name).toBe('Prod A')
  expect(tops[0].ca).toBeCloseTo(150)
  expect(tops[0].commissions).toBeCloseTo(15)
  expect(tops[0].orderCount).toBe(2)
})

test('computeTopBoutiques groups by boutiqueName', () => {
  const tops = computeTopBoutiques(orders.filter(o => o.status === 'Réglée'))
  expect(tops[0].name).toBe('Shop X')
})

test('computeOrderTypeBreakdown returns affiliée and pub_shopping counts', () => {
  const breakdown = computeOrderTypeBreakdown(orders.filter(o => o.status === 'Réglée'))
  expect(breakdown.affiliée).toBe(2) // orders 1 and 4
  expect(breakdown.pub_shopping).toBe(1) // order 2
})

test('computeWeeklyTrend returns array of WeeklyPoints with week labels', () => {
  const points = computeWeeklyTrend(MOCK_ORDERS)
  expect(Array.isArray(points)).toBe(true)
  expect(points.length).toBeGreaterThan(0)
  for (const p of points) {
    expect(typeof p.week).toBe('string')
    expect(typeof p.ca).toBe('number')
    expect(typeof p.commissions).toBe('number')
  }
})
