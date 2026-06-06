import { filterByPeriod, computeKPIs, computeWeeklyTrend, computeOrderTypeBreakdown, computeTopProducts, computeTopBoutiques } from '../utils/analyticsUtils'
import type { Order } from '../types/analytics'
import { MOCK_ORDERS } from '../data/mockAnalytics'

// today = June 1, 2026 (injected by test environment via currentDate context)
const now = new Date()
const y = now.getFullYear()   // 2026
const m = now.getMonth()      // 5 (June)

const today:   Order = { id: '1', date: new Date(y, m, 1),      productName: 'Prod A', boutiqueName: 'Shop X', price: 100, commissionStandard: 10, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' }
const today2:  Order = { id: '2', date: new Date(y, m, 1),      productName: 'Prod A', boutiqueName: 'Shop X', price: 50,  commissionStandard: 0,  commissionPub: 5,  orderType: 'pub_shopping', status: 'Réglée' }
const inelig:  Order = { id: '3', date: new Date(y, m, 1),      productName: 'Prod B', boutiqueName: 'Shop Y', price: 200, commissionStandard: 20, commissionPub: 0, orderType: 'affiliée', status: 'Inéligible' }
const q1Order: Order = { id: '4', date: new Date(y, 1, 15),     productName: 'Prod C', boutiqueName: 'Shop Z', price: 80,  commissionStandard: 8,  commissionPub: 0, orderType: 'affiliée', status: 'Réglée' }
// ^ Feb 15, 2026 — Q1

const orders = [today, today2, inelig, q1Order]

// ─── filterByPeriod ──────────────────────────────────────────────────────────

test('filterByPeriod "ce_mois" includes only current-month orders', () => {
  const result = filterByPeriod(orders, 'ce_mois')
  // today, today2, inelig are in June; q1Order is in Feb → excluded
  expect(result).toHaveLength(3)
  expect(result.every(o => o.id !== '4')).toBe(true)
})

test('filterByPeriod "ce_trimestre" includes Q2 but not Q1 order', () => {
  // Q2 2026 = Apr–Jun; q1Order is Feb → excluded
  const result = filterByPeriod(orders, 'ce_trimestre')
  expect(result.every(o => o.id !== '4')).toBe(true)
})

test('filterByPeriod "cette_annee" includes all 2026 orders', () => {
  const result = filterByPeriod(orders, 'cette_annee')
  expect(result).toHaveLength(4)
})

test('filterByPeriod "mois_precedent" returns May 2026 orders only', () => {
  // None of our test orders are in May → empty
  const result = filterByPeriod(orders, 'mois_precedent')
  expect(result).toHaveLength(0)
})

test('filterByPeriod "annee_derniere" returns 2025 orders only', () => {
  const lastYear: Order = { ...today, id: 'ly', date: new Date(y - 1, 6, 1) }
  const result = filterByPeriod([...orders, lastYear], 'annee_derniere')
  expect(result).toHaveLength(1)
  expect(result[0].id).toBe('ly')
})

test('filterByPeriod "trimestre_precedent" returns Q1 2026 order', () => {
  // Previous of Q2 2026 = Q1 2026 (Jan–Mar)
  const result = filterByPeriod(orders, 'trimestre_precedent')
  expect(result.some(o => o.id === '4')).toBe(true)
  // today/today2/inelig (June) should NOT appear
  expect(result.every(o => ['1','2','3'].indexOf(o.id) === -1)).toBe(true)
})

// ─── computeKPIs ─────────────────────────────────────────────────────────────

test('computeKPIs calculates correctly on Réglée orders only', () => {
  const kpis = computeKPIs(orders, orders.filter(o => o.status === 'Réglée'))
  expect(kpis.totalOrders).toBe(4)           // all orders in period
  expect(kpis.validatedOrders).toBe(3)       // Réglée: 1, 2, 4
  expect(kpis.enAttenteOrders).toBe(0)
  expect(kpis.ineligibleOrders).toBe(1)
  expect(kpis.totalCA).toBeCloseTo(230)      // 100 + 50 + 80
  expect(kpis.totalCommissions).toBeCloseTo(23) // 10 + 5 + 8
  expect(kpis.averageBasket).toBeCloseTo(230 / 3)
  expect(kpis.caGrowth).toBeNull()           // no period → no comparison
})

test('computeKPIs caGrowth compares cette_annee vs annee_derniere', () => {
  const prevOrder: Order = { id: 'prev', date: new Date(y - 1, 5, 15), productName: 'X', boutiqueName: 'Y', price: 100, commissionStandard: 10, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' }
  const currOrder: Order = { id: 'curr', date: new Date(y, 5, 1),      productName: 'X', boutiqueName: 'Y', price: 150, commissionStandard: 15, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' }
  const all = [prevOrder, currOrder]
  const kpis = computeKPIs([currOrder], all, 'cette_annee')
  expect(kpis.caGrowth).toBe(50)        // (150 - 100) / 100 * 100
  expect(kpis.commissionsGrowth).toBe(50)
})

// ─── Other utils ─────────────────────────────────────────────────────────────

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
  expect(breakdown.affiliée).toBe(2)      // orders 1 and 4
  expect(breakdown.pub_shopping).toBe(1)  // order 2
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
