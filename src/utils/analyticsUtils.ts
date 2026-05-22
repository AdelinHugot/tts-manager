import type { Order, Period, KPIData, WeeklyPoint, TopItem } from '../types/analytics'

export function filterByPeriod(orders: Order[], period: Period): Order[] {
  if (period === 'tout') return orders
  const now = new Date()
  const msMap: Record<Exclude<Period, 'tout'>, number> = {
    '7j': 7 * 86400000,
    '30j': 30 * 86400000,
    '3m': 90 * 86400000,
    '6m': 180 * 86400000,
  }
  const cutoff = new Date(now.getTime() - msMap[period])
  return orders.filter(o => o.date >= cutoff)
}

function getPreviousPeriodOrders(orders: Order[], period: Period): Order[] {
  if (period === 'tout') return []
  const now = new Date()
  const msMap: Record<Exclude<Period, 'tout'>, number> = {
    '7j': 7 * 86400000,
    '30j': 30 * 86400000,
    '3m': 90 * 86400000,
    '6m': 180 * 86400000,
  }
  const ms = msMap[period]
  const end = new Date(now.getTime() - ms)
  const start = new Date(now.getTime() - ms * 2)
  return orders.filter(o => o.date >= start && o.date < end)
}

function growth(current: number, previous: number): number | null {
  if (previous === 0) return null
  return Math.round(((current - previous) / previous) * 100)
}

export function computeKPIs(currentOrders: Order[], allOrders: Order[], period: Period = 'tout'): KPIData {
  const totalCA = currentOrders.reduce((s, o) => s + o.price, 0)
  const totalCommissions = currentOrders.reduce((s, o) => s + o.commissionStandard + o.commissionPub, 0)
  const totalOrders = currentOrders.length
  const validatedOrders = currentOrders.length
  const averageBasket = totalOrders > 0 ? totalCA / totalOrders : 0

  const prevOrders = getPreviousPeriodOrders(allOrders, period).filter(o => o.status === 'Réglée')
  const prevCA = prevOrders.reduce((s, o) => s + o.price, 0)
  const prevCommissions = prevOrders.reduce((s, o) => s + o.commissionStandard + o.commissionPub, 0)

  return {
    totalCA,
    totalCommissions,
    totalOrders,
    validatedOrders,
    averageBasket,
    caGrowth: growth(totalCA, prevCA),
    commissionsGrowth: growth(totalCommissions, prevCommissions),
    ordersGrowth: growth(totalOrders, prevOrders.length),
  }
}

export function computeWeeklyTrend(orders: Order[]): WeeklyPoint[] {
  const réglées = orders.filter(o => o.status === 'Réglée')
  if (réglées.length === 0) return []

  const map = new Map<string, { ca: number; commissions: number; date: Date }>()
  for (const o of réglées) {
    const key = getISOWeekKey(o.date)
    const existing = map.get(key) ?? { ca: 0, commissions: 0, date: o.date }
    map.set(key, {
      ca: existing.ca + o.price,
      commissions: existing.commissions + o.commissionStandard + o.commissionPub,
      date: existing.date < o.date ? existing.date : o.date,
    })
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, val], i) => ({
      week: `S${i + 1}`,
      ca: Math.round(val.ca * 100) / 100,
      commissions: Math.round(val.commissions * 100) / 100,
    }))
}

function getISOWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

export function computeOrderTypeBreakdown(orders: Order[]): { affiliée: number; pub_shopping: number } {
  return {
    affiliée: orders.filter(o => o.orderType === 'affiliée').length,
    pub_shopping: orders.filter(o => o.orderType === 'pub_shopping').length,
  }
}

function groupAndSort(orders: Order[], key: keyof Pick<Order, 'productName' | 'boutiqueName'>, limit = 10): TopItem[] {
  const map = new Map<string, TopItem>()
  for (const o of orders) {
    const name = o[key]
    const existing = map.get(name) ?? { name, ca: 0, commissions: 0, orderCount: 0 }
    map.set(name, {
      name,
      ca: existing.ca + o.price,
      commissions: existing.commissions + o.commissionStandard + o.commissionPub,
      orderCount: existing.orderCount + 1,
    })
  }
  return Array.from(map.values())
    .sort((a, b) => b.ca - a.ca)
    .slice(0, limit)
    .map(item => ({ ...item, ca: Math.round(item.ca * 100) / 100, commissions: Math.round(item.commissions * 100) / 100 }))
}

export function computeTopProducts(orders: Order[], limit = 10): TopItem[] {
  return groupAndSort(orders, 'productName', limit)
}

export function computeTopBoutiques(orders: Order[], limit = 10): TopItem[] {
  return groupAndSort(orders, 'boutiqueName', limit)
}
