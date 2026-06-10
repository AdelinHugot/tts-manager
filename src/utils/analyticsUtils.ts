import type { Order, Period, KPIData, WeeklyPoint, TopItem } from '../types/analytics'
import type { Realisation, Product } from '../types/realisation'

export function filterByDateRange(orders: Order[], start: Date, end: Date): Order[] {
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59)
  return orders.filter(o => o.date >= s && o.date <= e)
}

/** Shift a (year, quarter 0-3) pair by delta quarters. */
function shiftQ(y: number, q: number, delta: number): { y: number; q: number } {
  let nq = q + delta
  let ny = y
  while (nq < 0) { nq += 4; ny-- }
  while (nq >= 4) { nq -= 4; ny++ }
  return { y: ny, q: nq }
}

export function periodBounds(period: Period, now: Date): { start: Date; end: Date } {
  const y = now.getFullYear()
  const m = now.getMonth()          // 0-based
  const q = Math.floor(m / 3)       // 0–3

  switch (period) {
    case 'ce_mois':
      return { start: new Date(y, m, 1), end: now }

    case 'mois_precedent':
      return {
        start: new Date(y, m - 1, 1),
        end:   new Date(y, m, 0, 23, 59, 59),
      }

    case 'ce_trimestre':
      return { start: new Date(y, q * 3, 1), end: now }

    case 'trimestre_precedent': {
      const { y: py, q: pq } = shiftQ(y, q, -1)
      return {
        start: new Date(py, pq * 3, 1),
        end:   new Date(py, pq * 3 + 3, 0, 23, 59, 59),
      }
    }

    case 'cette_annee':
      return { start: new Date(y, 0, 1), end: now }

    case 'annee_derniere':
      return {
        start: new Date(y - 1, 0, 1),
        end:   new Date(y - 1, 11, 31, 23, 59, 59),
      }
  }
}

function prevPeriodBounds(period: Period, now: Date): { start: Date; end: Date } | null {
  const y = now.getFullYear()
  const m = now.getMonth()
  const q = Math.floor(m / 3)

  switch (period) {
    case 'ce_mois':
      return {
        start: new Date(y, m - 1, 1),
        end:   new Date(y, m, 0, 23, 59, 59),
      }

    case 'mois_precedent':
      return {
        start: new Date(y, m - 2, 1),
        end:   new Date(y, m - 1, 0, 23, 59, 59),
      }

    case 'ce_trimestre': {
      const { y: py, q: pq } = shiftQ(y, q, -1)
      return {
        start: new Date(py, pq * 3, 1),
        end:   new Date(py, pq * 3 + 3, 0, 23, 59, 59),
      }
    }

    case 'trimestre_precedent': {
      const { y: py, q: pq } = shiftQ(y, q, -2)
      return {
        start: new Date(py, pq * 3, 1),
        end:   new Date(py, pq * 3 + 3, 0, 23, 59, 59),
      }
    }

    case 'cette_annee':
      return {
        start: new Date(y - 1, 0, 1),
        end:   new Date(y - 1, 11, 31, 23, 59, 59),
      }

    case 'annee_derniere':
      return {
        start: new Date(y - 2, 0, 1),
        end:   new Date(y - 2, 11, 31, 23, 59, 59),
      }

    default:
      return null
  }
}

export function filterByPeriod(orders: Order[], period: Period): Order[] {
  const { start, end } = periodBounds(period, new Date())
  return orders.filter(o => o.date >= start && o.date <= end)
}

function getPreviousPeriodOrders(orders: Order[], period: Period | undefined): Order[] {
  if (!period) return []
  const bounds = prevPeriodBounds(period, new Date())
  if (!bounds) return []
  return orders.filter(o => o.date >= bounds.start && o.date <= bounds.end)
}

function growth(current: number, previous: number): number | null {
  if (previous === 0) return null
  return Math.round(((current - previous) / previous) * 100)
}

// Le CA encaissé et les commissions comptabilisent les commandes réglées
// ainsi que celles en attente (le règlement n'étant qu'une question de délai).
export function isComptabilisable(o: Order): boolean {
  return o.status === 'Réglée' || o.status === 'En attente'
}

export function computeKPIs(currentOrders: Order[], allOrders: Order[], period?: Period): KPIData {
  const réglées        = currentOrders.filter(o => o.status === 'Réglée')
  const enAttente      = currentOrders.filter(o => o.status === 'En attente')
  const ineligible     = currentOrders.filter(o => o.status === 'Inéligible')
  const comptabilisées = currentOrders.filter(isComptabilisable)

  const totalCA          = comptabilisées.reduce((s, o) => s + o.price, 0)
  const totalCommissions = comptabilisées.reduce((s, o) => s + o.commissionStandard + o.commissionPub, 0)
  const validatedOrders  = réglées.length
  const averageBasket    = comptabilisées.length > 0 ? totalCA / comptabilisées.length : 0

  const prevOrders       = getPreviousPeriodOrders(allOrders, period)
  const prevComptabilisées = prevOrders.filter(isComptabilisable)
  const prevCA           = prevComptabilisées.reduce((s, o) => s + o.price, 0)
  const prevCommissions  = prevComptabilisées.reduce((s, o) => s + o.commissionStandard + o.commissionPub, 0)
  const prevRéglées      = prevOrders.filter(o => o.status === 'Réglée')

  return {
    totalCA,
    totalCommissions,
    totalOrders: currentOrders.length,
    validatedOrders,
    enAttenteOrders: enAttente.length,
    ineligibleOrders: ineligible.length,
    averageBasket,
    caGrowth: growth(totalCA, prevCA),
    commissionsGrowth: growth(totalCommissions, prevCommissions),
    ordersGrowth: growth(validatedOrders, prevRéglées.length),
  }
}

export function computeWeeklyTrend(orders: Order[]): WeeklyPoint[] {
  const réglées = orders.filter(isComptabilisable)
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

export function computeDailyTrend(orders: Order[]): WeeklyPoint[] {
  const réglées = orders.filter(isComptabilisable)
  if (réglées.length === 0) return []

  const map = new Map<string, { ca: number; commissions: number }>()
  for (const o of réglées) {
    const d = o.date
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const existing = map.get(key) ?? { ca: 0, commissions: 0 }
    map.set(key, {
      ca: existing.ca + o.price,
      commissions: existing.commissions + o.commissionStandard + o.commissionPub,
    })
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateStr, val]) => {
      const date = new Date(dateStr + 'T12:00:00')
      const label = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
      return {
        week: label,
        ca: Math.round(val.ca * 100) / 100,
        commissions: Math.round(val.commissions * 100) / 100,
      }
    })
}

export function computeOrderTypeBreakdown(orders: Order[]): { affiliée: number; pub_shopping: number } {
  return {
    affiliée: orders.filter(o => o.orderType === 'affiliée').length,
    pub_shopping: orders.filter(o => o.orderType === 'pub_shopping').length,
  }
}

function groupAndSort(orders: Order[], key: keyof Pick<Order, 'productName' | 'boutiqueName'>, limit = 10, sortBy: 'ca' | 'commissions' = 'ca'): TopItem[] {
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
    .sort((a, b) => b[sortBy] - a[sortBy])
    .slice(0, limit)
    .map(item => ({ ...item, ca: Math.round(item.ca * 100) / 100, commissions: Math.round(item.commissions * 100) / 100 }))
}

export function computeTopProducts(orders: Order[], limit = 10, sortBy: 'ca' | 'commissions' = 'ca'): TopItem[] {
  return groupAndSort(orders, 'productName', limit, sortBy)
}

export function computeTopBoutiques(orders: Order[], limit = 10): TopItem[] {
  return groupAndSort(orders, 'boutiqueName', limit)
}

// ── Strategic items (with taux commission, panier moyen, part CA) ──────────

export type StrategicItem = {
  name: string
  subLabel?: string   // boutique name for products
  ca: number
  commissions: number
  orderCount: number
  tauxCommission: number  // commissions / ca * 100
  averageBasket: number   // ca / orderCount
  caShare: number         // ca / totalCA * 100
}

export function computeStrategicBoutiques(orders: Order[], limit = 20): StrategicItem[] {
  const map = new Map<string, { ca: number; commissions: number; orderCount: number }>()
  for (const o of orders) {
    const e = map.get(o.boutiqueName) ?? { ca: 0, commissions: 0, orderCount: 0 }
    map.set(o.boutiqueName, {
      ca: e.ca + o.price,
      commissions: e.commissions + o.commissionStandard + o.commissionPub,
      orderCount: e.orderCount + 1,
    })
  }
  const totalCA = Array.from(map.values()).reduce((s, v) => s + v.ca, 0)
  return Array.from(map.entries())
    .map(([name, v]) => ({
      name,
      ca: Math.round(v.ca * 100) / 100,
      commissions: Math.round(v.commissions * 100) / 100,
      orderCount: v.orderCount,
      tauxCommission: v.ca > 0 ? Math.round((v.commissions / v.ca) * 1000) / 10 : 0,
      averageBasket: v.orderCount > 0 ? Math.round((v.ca / v.orderCount) * 100) / 100 : 0,
      caShare: totalCA > 0 ? Math.round((v.ca / totalCA) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.ca - a.ca)
    .slice(0, limit)
}

export function computeStrategicProducts(orders: Order[], limit = 20): StrategicItem[] {
  const map = new Map<string, { ca: number; commissions: number; orderCount: number; boutique: string }>()
  for (const o of orders) {
    const e = map.get(o.productName) ?? { ca: 0, commissions: 0, orderCount: 0, boutique: o.boutiqueName }
    map.set(o.productName, {
      ca: e.ca + o.price,
      commissions: e.commissions + o.commissionStandard + o.commissionPub,
      orderCount: e.orderCount + 1,
      boutique: e.boutique,
    })
  }
  const totalCA = Array.from(map.values()).reduce((s, v) => s + v.ca, 0)
  return Array.from(map.entries())
    .map(([name, v]) => ({
      name,
      subLabel: v.boutique,
      ca: Math.round(v.ca * 100) / 100,
      commissions: Math.round(v.commissions * 100) / 100,
      orderCount: v.orderCount,
      tauxCommission: v.ca > 0 ? Math.round((v.commissions / v.ca) * 1000) / 10 : 0,
      averageBasket: v.orderCount > 0 ? Math.round((v.ca / v.orderCount) * 100) / 100 : 0,
      caShare: totalCA > 0 ? Math.round((v.ca / totalCA) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.ca - a.ca)
    .slice(0, limit)
}

// ── Video (Réalisation) performance ─────────────────────────────────────────

function extractTikTokVideoId(url?: string): string | null {
  if (!url) return null
  const m = url.match(/\/video\/(\d+)/)
  return m ? m[1] : null
}

export type VideoPerformanceItem = {
  realisationId: string
  title: string
  tiktokUrl?: string
  tiktokVideoId?: string
  productName: string
  publishDate: string | null
  ca: number
  commissions: number
  orderCount: number
  tauxCommission: number
  averageBasket: number
  isLinked: boolean
  // Enriched from TikTok API (optional)
  views?: number
  likes?: number
  shares?: number
  conversionRate?: number  // orderCount / views * 100
  revenuePerView?: number  // ca / views
}

/**
 * Croise les réalisations avec les commandes via l'ID vidéo TikTok.
 * `orders` doit déjà être filtré par la période choisie.
 */
export function computeVideoPerformance(
  realisations: Realisation[],
  orders: Order[],
  products: Product[],
): VideoPerformanceItem[] {
  const ordersByVideoId = new Map<string, Order[]>()
  for (const o of orders) {
    if (!isComptabilisable(o) || !o.videoUrl) continue
    const id = extractTikTokVideoId(o.videoUrl)
    if (!id) continue
    const arr = ordersByVideoId.get(id) ?? []
    arr.push(o)
    ordersByVideoId.set(id, arr)
  }

  const candidates = realisations.filter(
    (r) => r.status === 'publiee' || !!r.tiktokUrl,
  )

  return candidates
    .map((r) => {
      const videoId = extractTikTokVideoId(r.tiktokUrl) ?? undefined
      const linked  = videoId ? (ordersByVideoId.get(videoId) ?? []) : []
      const product = products.find((p) => p.id === r.productId)

      const ca          = linked.reduce((s, o) => s + o.price, 0)
      const commissions = linked.reduce((s, o) => s + o.commissionStandard + o.commissionPub, 0)
      const orderCount  = linked.length

      return {
        realisationId: r.id,
        title:         r.title,
        tiktokUrl:     r.tiktokUrl,
        tiktokVideoId: videoId,
        productName:   product?.name ?? '—',
        publishDate:   r.publishDate,
        ca:             Math.round(ca * 100) / 100,
        commissions:    Math.round(commissions * 100) / 100,
        orderCount,
        tauxCommission: ca > 0 ? Math.round((commissions / ca) * 1000) / 10 : 0,
        averageBasket:  orderCount > 0 ? Math.round((ca / orderCount) * 100) / 100 : 0,
        isLinked:       !!r.tiktokUrl,
      }
    })
    .sort((a, b) => b.ca - a.ca)
}
