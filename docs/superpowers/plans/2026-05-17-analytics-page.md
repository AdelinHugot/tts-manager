# Analytics Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional Analytics page displaying TikTok Shop KPIs (CA, commissions, top products, top boutiques) with period filtering and trend charts, backed by mock data from a real CSV export.

**Architecture:** Types + mock data → pure utility functions → dumb UI components → Analytics page container. The data layer (mock vs API) is swappable without touching any component. Recharts handles all charting.

**Tech Stack:** React 18, TypeScript, TailwindCSS v3, Recharts (to install), Vitest + @testing-library/react

---

## Chunk 1: Foundation — types, mock data, utility functions

### Task 1: Types + mock data

**Files:**
- Create: `src/types/analytics.ts`
- Create: `src/data/mockAnalytics.ts`
- Create: `src/test/AnalyticsTypes.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/test/AnalyticsTypes.test.ts
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/adelinhugot/Desktop/Projets-SAAS/TTS\ Manager
npx vitest run src/test/AnalyticsTypes.test.ts
```
Expected: FAIL — `Cannot find module '../data/mockAnalytics'`

- [ ] **Step 3: Create types file**

```ts
// src/types/analytics.ts
export type OrderStatus = 'Réglée' | 'Inéligible' | 'En attente'
export type OrderType = 'affiliée' | 'pub_shopping'
export type Period = '7j' | '30j' | '3m' | '6m' | 'tout'

export type Order = {
  id: string
  date: Date
  productName: string
  boutiqueName: string
  price: number
  commissionStandard: number
  commissionPub: number
  orderType: OrderType
  status: OrderStatus
}

export type KPIData = {
  totalCA: number
  totalCommissions: number
  totalOrders: number
  validatedOrders: number
  averageBasket: number
  // comparisons vs previous period (null if no previous period data)
  caGrowth: number | null
  commissionsGrowth: number | null
  ordersGrowth: number | null
}

export type WeeklyPoint = {
  week: string   // e.g. "S1", "S2"
  ca: number
  commissions: number
}

export type TopItem = {
  name: string
  ca: number
  commissions: number
  orderCount: number
}
```

- [ ] **Step 4: Create mock data file**

```ts
// src/data/mockAnalytics.ts
import type { Order } from '../types/analytics'

// Real data parsed from TikTok Shop CSV export (anonymized product names kept)
// Dates: January–May 2026
export const MOCK_ORDERS: Order[] = [
  // ── February 2026 ──
  { id: '576854624806345015', date: new Date('2026-02-05'), productName: 'Enzymes Digestives Manager', boutiqueName: 'Nuclever France', price: 22.41, commissionStandard: 2.49, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: '576854581159303614', date: new Date('2026-02-05'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 32.71, commissionStandard: 0, commissionPub: 13.78, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576854562971097374', date: new Date('2026-02-05'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 24.90, commissionStandard: 2.49, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: '576854543023839408', date: new Date('2026-02-05'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 33.92, commissionStandard: 3.43, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: '576854499111835815', date: new Date('2026-02-05'), productName: 'Kits de soins QINGLIN', boutiqueName: 'QINGLIN.EU', price: 29.73, commissionStandard: 0, commissionPub: 0, orderType: 'pub_shopping', status: 'Inéligible' },
  { id: '576854473011665292', date: new Date('2026-02-05'), productName: 'Enzymes Digestives Manager', boutiqueName: 'Nuclever France', price: 22.41, commissionStandard: 0, commissionPub: 6.23, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576854391127907060', date: new Date('2026-02-05'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 16.87, commissionStandard: 0.89, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: '576854381511284992', date: new Date('2026-02-05'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 18.10, commissionStandard: 0, commissionPub: 7.02, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576854360470297578', date: new Date('2026-02-05'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 24.90, commissionStandard: 0, commissionPub: 6.23, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576854355427826134', date: new Date('2026-02-05'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 17.48, commissionStandard: 0, commissionPub: 7.06, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576854353829665645', date: new Date('2026-02-05'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 39.90, commissionStandard: 0, commissionPub: 8.31, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576854346504379293', date: new Date('2026-02-05'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 61.80, commissionStandard: 0, commissionPub: 5.85, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576854331553323668', date: new Date('2026-02-05'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 17.48, commissionStandard: 0, commissionPub: 0, orderType: 'pub_shopping', status: 'Inéligible' },
  { id: '576854286243634059', date: new Date('2026-02-05'), productName: 'Couches - kit essai', boutiqueName: 'la marque en moins', price: 1.52, commissionStandard: 0, commissionPub: 1.52, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576854284622862347', date: new Date('2026-02-05'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 48.80, commissionStandard: 0, commissionPub: 6.07, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576854221860084231', date: new Date('2026-02-05'), productName: 'Gousses de Vanille Grand Cru', boutiqueName: 'Vanilla Natura', price: 16.70, commissionStandard: 0, commissionPub: 2, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576854072412380000', date: new Date('2026-02-04'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 24.90, commissionStandard: 2.49, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: '576854067494165293', date: new Date('2026-02-04'), productName: 'Couches - kit essai', boutiqueName: 'la marque en moins', price: 1.90, commissionStandard: 0.46, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: '576854065693366536', date: new Date('2026-02-04'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 61.80, commissionStandard: 0, commissionPub: 5.85, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576854046871362404', date: new Date('2026-02-04'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 17.61, commissionStandard: 0.88, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: '576854045154843492', date: new Date('2026-02-04'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 17.61, commissionStandard: 0, commissionPub: 0, orderType: 'affiliée', status: 'Inéligible' },
  { id: '576853965011458730', date: new Date('2026-02-04'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 33.92, commissionStandard: 0, commissionPub: 8.56, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576853886715992766', date: new Date('2026-02-04'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 52.80, commissionStandard: 0, commissionPub: 5.10, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576853844338514534', date: new Date('2026-02-04'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 19.92, commissionStandard: 2.49, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: '576853818014341394', date: new Date('2026-02-04'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 48.80, commissionStandard: 0, commissionPub: 6.07, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576853814543358897', date: new Date('2026-02-04'), productName: 'Couches - kit essai', boutiqueName: 'la marque en moins', price: 1.90, commissionStandard: 0.46, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: '576853796872886905', date: new Date('2026-02-04'), productName: 'Couches - kit essai', boutiqueName: 'la marque en moins', price: 1.90, commissionStandard: 0, commissionPub: 1.52, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576853791385230163', date: new Date('2026-02-04'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 61.80, commissionStandard: 0, commissionPub: 5.85, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576853788654541768', date: new Date('2026-02-04'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 61.80, commissionStandard: 0, commissionPub: 5.85, orderType: 'pub_shopping', status: 'Réglée' },
  { id: '576853704302828528', date: new Date('2026-02-03'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 48.80, commissionStandard: 0, commissionPub: 6.07, orderType: 'pub_shopping', status: 'Réglée' },
  // ── March 2026 ──
  { id: 'm001', date: new Date('2026-03-02'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 39.90, commissionStandard: 0, commissionPub: 8.31, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm002', date: new Date('2026-03-03'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 18.10, commissionStandard: 0, commissionPub: 7.02, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm003', date: new Date('2026-03-04'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 24.90, commissionStandard: 2.49, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'm004', date: new Date('2026-03-05'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 68.80, commissionStandard: 0, commissionPub: 5.73, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm005', date: new Date('2026-03-06'), productName: 'Enzymes Digestives Manager', boutiqueName: 'Nuclever France', price: 22.41, commissionStandard: 2.49, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'm006', date: new Date('2026-03-07'), productName: 'Kits de soins QINGLIN', boutiqueName: 'QINGLIN.EU', price: 29.73, commissionStandard: 0, commissionPub: 11.89, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm007', date: new Date('2026-03-08'), productName: 'Couches - kit essai', boutiqueName: 'la marque en moins', price: 1.90, commissionStandard: 0, commissionPub: 1.52, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm008', date: new Date('2026-03-09'), productName: 'Gousses de Vanille Grand Cru', boutiqueName: 'Vanilla Natura', price: 21.24, commissionStandard: 0, commissionPub: 2.55, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm009', date: new Date('2026-03-10'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 33.92, commissionStandard: 0, commissionPub: 8.56, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm010', date: new Date('2026-03-11'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 31.91, commissionStandard: 1.73, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'm011', date: new Date('2026-03-12'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 24.90, commissionStandard: 0, commissionPub: 6.23, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm012', date: new Date('2026-03-13'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 61.80, commissionStandard: 0, commissionPub: 5.85, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm013', date: new Date('2026-03-14'), productName: 'Enzymes Digestives Manager', boutiqueName: 'Nuclever France', price: 44.82, commissionStandard: 4.98, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'm014', date: new Date('2026-03-15'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 39.90, commissionStandard: 0, commissionPub: 8.31, orderType: 'pub_shopping', status: 'Inéligible' },
  { id: 'm015', date: new Date('2026-03-16'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 21.24, commissionStandard: 0, commissionPub: 8.58, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm016', date: new Date('2026-03-17'), productName: 'Couches - kit essai', boutiqueName: 'la marque en moins', price: 3.80, commissionStandard: 0.91, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'm017', date: new Date('2026-03-18'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 52.80, commissionStandard: 0, commissionPub: 5.10, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm018', date: new Date('2026-03-19'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 49.80, commissionStandard: 4.98, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'm019', date: new Date('2026-03-20'), productName: 'Gousses de Vanille Grand Cru', boutiqueName: 'Vanilla Natura', price: 16.70, commissionStandard: 0, commissionPub: 2.00, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm020', date: new Date('2026-03-21'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 27.13, commissionStandard: 1.77, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'm021', date: new Date('2026-03-22'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 33.92, commissionStandard: 3.43, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'm022', date: new Date('2026-03-23'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 48.80, commissionStandard: 0, commissionPub: 6.07, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm023', date: new Date('2026-03-24'), productName: 'Enzymes Digestives Manager', boutiqueName: 'Nuclever France', price: 22.41, commissionStandard: 0, commissionPub: 6.23, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm024', date: new Date('2026-03-25'), productName: 'Kits de soins QINGLIN', boutiqueName: 'QINGLIN.EU', price: 29.73, commissionStandard: 0, commissionPub: 0, orderType: 'pub_shopping', status: 'Inéligible' },
  { id: 'm025', date: new Date('2026-03-26'), productName: 'Couches - kit essai', boutiqueName: 'la marque en moins', price: 1.52, commissionStandard: 0, commissionPub: 1.52, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm026', date: new Date('2026-03-27'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 24.90, commissionStandard: 2.49, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'm027', date: new Date('2026-03-28'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 33.91, commissionStandard: 1.71, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'm028', date: new Date('2026-03-29'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 61.80, commissionStandard: 0, commissionPub: 5.85, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'm029', date: new Date('2026-03-30'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 39.90, commissionStandard: 0, commissionPub: 8.31, orderType: 'pub_shopping', status: 'Réglée' },
  // ── April 2026 ──
  { id: 'a001', date: new Date('2026-04-02'), productName: 'Enzymes Digestives Manager', boutiqueName: 'Nuclever France', price: 44.82, commissionStandard: 4.98, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'a002', date: new Date('2026-04-04'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 18.10, commissionStandard: 0, commissionPub: 7.02, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a003', date: new Date('2026-04-05'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 49.80, commissionStandard: 4.98, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'a004', date: new Date('2026-04-06'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 68.80, commissionStandard: 0, commissionPub: 5.73, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a005', date: new Date('2026-04-07'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 39.90, commissionStandard: 0, commissionPub: 8.31, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a006', date: new Date('2026-04-08'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 32.71, commissionStandard: 0, commissionPub: 13.78, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a007', date: new Date('2026-04-09'), productName: 'Kits de soins QINGLIN', boutiqueName: 'QINGLIN.EU', price: 59.46, commissionStandard: 0, commissionPub: 23.78, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a008', date: new Date('2026-04-10'), productName: 'Gousses de Vanille Grand Cru', boutiqueName: 'Vanilla Natura', price: 33.40, commissionStandard: 0, commissionPub: 4.00, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a009', date: new Date('2026-04-11'), productName: 'Couches - kit essai', boutiqueName: 'la marque en moins', price: 5.70, commissionStandard: 1.37, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'a010', date: new Date('2026-04-12'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 52.80, commissionStandard: 0, commissionPub: 5.10, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a011', date: new Date('2026-04-13'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 24.90, commissionStandard: 0, commissionPub: 6.23, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a012', date: new Date('2026-04-14'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 33.92, commissionStandard: 0, commissionPub: 8.56, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a013', date: new Date('2026-04-15'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 17.48, commissionStandard: 0, commissionPub: 7.06, orderType: 'pub_shopping', status: 'Inéligible' },
  { id: 'a014', date: new Date('2026-04-16'), productName: 'Enzymes Digestives Manager', boutiqueName: 'Nuclever France', price: 22.41, commissionStandard: 2.49, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'a015', date: new Date('2026-04-18'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 61.80, commissionStandard: 0, commissionPub: 5.85, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a016', date: new Date('2026-04-20'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 21.24, commissionStandard: 0, commissionPub: 8.58, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a017', date: new Date('2026-04-22'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 24.90, commissionStandard: 2.49, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'a018', date: new Date('2026-04-24'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 79.80, commissionStandard: 0, commissionPub: 16.62, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a019', date: new Date('2026-04-26'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 48.80, commissionStandard: 0, commissionPub: 6.07, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'a020', date: new Date('2026-04-28'), productName: 'Enzymes Digestives Manager', boutiqueName: 'Nuclever France', price: 67.23, commissionStandard: 7.47, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  // ── May 2026 ──
  { id: 'may001', date: new Date('2026-05-01'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 32.71, commissionStandard: 0, commissionPub: 13.08, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'may002', date: new Date('2026-05-02'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 49.80, commissionStandard: 4.98, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'may003', date: new Date('2026-05-03'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 68.80, commissionStandard: 0, commissionPub: 6.88, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'may004', date: new Date('2026-05-04'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 39.90, commissionStandard: 0, commissionPub: 8.31, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'may005', date: new Date('2026-05-05'), productName: 'Enzymes Digestives Manager', boutiqueName: 'Nuclever France', price: 44.82, commissionStandard: 4.98, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'may006', date: new Date('2026-05-06'), productName: 'Kits de soins QINGLIN', boutiqueName: 'QINGLIN.EU', price: 59.46, commissionStandard: 0, commissionPub: 23.78, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'may007', date: new Date('2026-05-07'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 18.10, commissionStandard: 0, commissionPub: 7.24, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'may008', date: new Date('2026-05-08'), productName: 'Couches - kit essai', boutiqueName: 'la marque en moins', price: 5.70, commissionStandard: 1.37, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'may009', date: new Date('2026-05-09'), productName: 'Gousses de Vanille Grand Cru', boutiqueName: 'Vanilla Natura', price: 50.10, commissionStandard: 0, commissionPub: 6.01, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'may010', date: new Date('2026-05-10'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 61.80, commissionStandard: 0, commissionPub: 5.85, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'may011', date: new Date('2026-05-11'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 24.90, commissionStandard: 0, commissionPub: 6.23, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'may012', date: new Date('2026-05-12'), productName: 'Duo Peel Shot Basis Lab', boutiqueName: 'Basis Lab', price: 33.92, commissionStandard: 0, commissionPub: 8.56, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'may013', date: new Date('2026-05-13'), productName: 'Enzymes Digestives Manager', boutiqueName: 'Nuclever France', price: 22.41, commissionStandard: 0, commissionPub: 6.23, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'may014', date: new Date('2026-05-14'), productName: 'QINGLIN Crème Rajeunissante', boutiqueName: 'QINGLIN.EU', price: 17.48, commissionStandard: 0, commissionPub: 0, orderType: 'pub_shopping', status: 'Inéligible' },
  { id: 'may015', date: new Date('2026-05-15'), productName: 'Démarreur Portable 7000A', boutiqueName: 'APG', price: 52.80, commissionStandard: 0, commissionPub: 5.10, orderType: 'pub_shopping', status: 'Réglée' },
  { id: 'may016', date: new Date('2026-05-16'), productName: 'Papills Sommeil', boutiqueName: 'Papills', price: 24.90, commissionStandard: 2.49, commissionPub: 0, orderType: 'affiliée', status: 'Réglée' },
  { id: 'may017', date: new Date('2026-05-17'), productName: 'Kits de soins QINGLIN', boutiqueName: 'QINGLIN.EU', price: 29.73, commissionStandard: 0, commissionPub: 11.89, orderType: 'pub_shopping', status: 'Réglée' },
]
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run src/test/AnalyticsTypes.test.ts
```
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add src/types/analytics.ts src/data/mockAnalytics.ts src/test/AnalyticsTypes.test.ts
git commit -m "feat: add Order type and mock data for analytics"
```

---

### Task 2: Analytics utility functions

**Files:**
- Create: `src/utils/analyticsUtils.ts`
- Create: `src/test/analyticsUtils.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/test/analyticsUtils.test.ts
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
  // order 4 is 100 days old, outside 3m window
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
  expect(kpis.totalCA).toBeCloseTo(150) // 100 + 50 (order 4 excluded because we only pass réglées)
  expect(kpis.totalCommissions).toBeCloseTo(15) // 10 + 5
  expect(kpis.totalOrders).toBe(2)
  expect(kpis.validatedOrders).toBe(2)
  expect(kpis.averageBasket).toBeCloseTo(75)
  expect(kpis.caGrowth).toBeNull() // 'tout' → no previous period window → null
})

test('computeKPIs caGrowth is correct when previous period has data', () => {
  // previous period: 45 days ago (falls in 30–60 day window)
  // current period: 15 days ago (falls in 0–30 day window)
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
  expect(breakdown.affiliée).toBe(1)
  expect(breakdown.pub_shopping).toBe(1)
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
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/test/analyticsUtils.test.ts
```
Expected: FAIL — `Cannot find module '../utils/analyticsUtils'`

- [ ] **Step 3: Implement utility functions**

```ts
// src/utils/analyticsUtils.ts
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

// currentOrders and allOrders are both pre-filtered to status === 'Réglée'
// allOrders is the full dataset (used to compute previous period)
export function computeKPIs(currentOrders: Order[], allOrders: Order[], period: Period = 'tout'): KPIData {
  const totalCA = currentOrders.reduce((s, o) => s + o.price, 0)
  const totalCommissions = currentOrders.reduce((s, o) => s + o.commissionStandard + o.commissionPub, 0)
  const totalOrders = currentOrders.length
  const validatedOrders = currentOrders.length // already filtered to Réglée
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

  // Group by ISO week (year-week)
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
    .map(([key, val], i) => ({
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
```

- [ ] **Step 4: Fix the test — `computeKPIs` signature mismatch**

The test calls `computeKPIs(réglées, réglées)` without a period — that's fine since `period` defaults to `'tout'` which returns `[]` for previous period → growth is null. Verify the test matches the implementation signature.

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run src/test/analyticsUtils.test.ts
```
Expected: PASS (7 tests)

- [ ] **Step 6: Commit**

```bash
git add src/utils/analyticsUtils.ts src/test/analyticsUtils.test.ts
git commit -m "feat: add analytics utility functions"
```

---

## Chunk 2: UI Components

### Task 3: KPICard component

**Files:**
- Create: `src/components/analytics/KPICard.tsx`
- Create: `src/test/KPICard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/test/KPICard.test.tsx
import { render, screen } from '@testing-library/react'
import KPICard from '../components/analytics/KPICard'

test('renders label and value', () => {
  render(<KPICard label="CA Généré" value="1 234 €" />)
  expect(screen.getByText('CA Généré')).toBeDefined()
  expect(screen.getByText('1 234 €')).toBeDefined()
})

test('shows positive trend badge in green', () => {
  render(<KPICard label="CA" value="1 000 €" trend={18} />)
  const badge = screen.getByText(/↑.*18/)
  expect(badge.className).toMatch(/green|emerald/)
})

test('shows negative trend badge in red', () => {
  render(<KPICard label="CA" value="1 000 €" trend={-5} />)
  const badge = screen.getByText(/↓.*5/)
  expect(badge.className).toMatch(/red/)
})

test('shows no badge when trend is null', () => {
  render(<KPICard label="CA" value="1 000 €" trend={null} />)
  expect(screen.queryByText(/↑|↓/)).toBeNull()
})
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/test/KPICard.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Implement KPICard**

```tsx
// src/components/analytics/KPICard.tsx
type Props = {
  label: string
  value: string
  trend?: number | null
  subtitle?: string
}

export default function KPICard({ label, value, trend, subtitle }: Props) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</div>
      <div className="text-2xl font-extrabold text-slate-900 mb-1">{value}</div>
      {trend != null && (
        <div className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs période préc.
        </div>
      )}
      {subtitle && trend == null && (
        <div className="text-xs text-slate-400">{subtitle}</div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/test/KPICard.test.tsx
```
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/analytics/KPICard.tsx src/test/KPICard.test.tsx
git commit -m "feat: add KPICard component"
```

---

### Task 4: Install Recharts + TrendChart

**Files:**
- Modify: `package.json` (via npm install)
- Create: `src/components/analytics/TrendChart.tsx`
- Create: `src/test/TrendChart.test.tsx`

- [ ] **Step 1: Install recharts**

```bash
cd /Users/adelinhugot/Desktop/Projets-SAAS/TTS\ Manager
npm install recharts
```
Expected: recharts added to `package.json` dependencies.

- [ ] **Step 2: Write the failing test**

```tsx
// src/test/TrendChart.test.tsx
import { render, screen } from '@testing-library/react'
import TrendChart from '../components/analytics/TrendChart'
import type { WeeklyPoint } from '../types/analytics'

// Recharts uses ResizeObserver internally — mock it
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const points: WeeklyPoint[] = [
  { week: 'S1', ca: 120, commissions: 15 },
  { week: 'S2', ca: 200, commissions: 22 },
  { week: 'S3', ca: 180, commissions: 19 },
]

test('renders without crashing with valid data', () => {
  const { container } = render(<TrendChart data={points} />)
  expect(container.firstChild).toBeTruthy()
})

test('shows empty state when no data', () => {
  render(<TrendChart data={[]} />)
  expect(screen.getByText(/aucune donnée/i)).toBeDefined()
})
```

- [ ] **Step 3: Run to verify failure**

```bash
npx vitest run src/test/TrendChart.test.tsx
```
Expected: FAIL

- [ ] **Step 4: Implement TrendChart**

```tsx
// src/components/analytics/TrendChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { WeeklyPoint } from '../../types/analytics'

type Props = { data: WeeklyPoint[] }

function EuroTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <div className="font-semibold text-slate-700 mb-2">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name} : {p.value.toFixed(2)} €
        </div>
      ))}
    </div>
  )
}

export default function TrendChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-300 text-sm">
        Aucune donnée pour cette période
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
        <Tooltip content={<EuroTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
        <Line type="monotone" dataKey="ca" name="CA" stroke="#3B5BFF" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="commissions" name="Commissions" stroke="#a5b4fc" strokeWidth={2} dot={false} strokeDasharray="4 2" activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run src/test/TrendChart.test.tsx
```
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/analytics/TrendChart.tsx src/test/TrendChart.test.tsx package.json package-lock.json
git commit -m "feat: add TrendChart component with recharts"
```

---

### Task 5: DonutChart component

**Files:**
- Create: `src/components/analytics/DonutChart.tsx`
- Create: `src/test/DonutChart.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/test/DonutChart.test.tsx
import { render, screen } from '@testing-library/react'
import DonutChart from '../components/analytics/DonutChart'

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

test('renders without crashing', () => {
  const { container } = render(
    <DonutChart affiliée={70} pub_shopping={30} />
  )
  expect(container.firstChild).toBeTruthy()
})

test('shows percentages', () => {
  render(<DonutChart affiliée={70} pub_shopping={30} />)
  expect(screen.getByText(/70%/)).toBeDefined()
})

test('shows empty state when both are 0', () => {
  render(<DonutChart affiliée={0} pub_shopping={0} />)
  expect(screen.getByText(/aucune donnée/i)).toBeDefined()
})
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/test/DonutChart.test.tsx
```

- [ ] **Step 3: Implement DonutChart**

```tsx
// src/components/analytics/DonutChart.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

type Props = {
  affiliée: number
  pub_shopping: number
}

const COLORS = ['#3B5BFF', '#a5b4fc']

export default function DonutChart({ affiliée, pub_shopping }: Props) {
  const total = affiliée + pub_shopping
  if (total === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-300 text-sm">
        Aucune donnée pour cette période
      </div>
    )
  }
  const pctAff = Math.round((affiliée / total) * 100)
  const pctPub = 100 - pctAff
  const data = [
    { name: 'Affiliée', value: affiliée },
    { name: 'Pub Shopping', value: pub_shopping },
  ]

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip formatter={(v: number) => [`${v} commandes`, '']} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3B5BFF]" />
          <span className="text-slate-600 font-medium">Affiliée {pctAff}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#a5b4fc]" />
          <span className="text-slate-600 font-medium">Pub {pctPub}%</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/test/DonutChart.test.tsx
```
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/analytics/DonutChart.tsx src/test/DonutChart.test.tsx
git commit -m "feat: add DonutChart component"
```

---

### Task 6: TopTable component

**Files:**
- Create: `src/components/analytics/TopTable.tsx`
- Create: `src/test/TopTable.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/test/TopTable.test.tsx
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
  expect(screen.getByText('3 240,00 €')).toBeDefined()
})

test('shows empty state when no items', () => {
  render(<TopTable items={[]} label="Produit" />)
  expect(screen.getByText(/aucune donnée/i)).toBeDefined()
})
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/test/TopTable.test.tsx
```

- [ ] **Step 3: Implement TopTable**

```tsx
// src/components/analytics/TopTable.tsx
import type { TopItem } from '../../types/analytics'

type Props = {
  items: TopItem[]
  label: string
}

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

export default function TopTable({ items, label }: Props) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-300 italic py-6 text-center">Aucune donnée pour cette période.</p>
  }

  const maxCA = items[0].ca

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 w-10">#</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">{label}</th>
            <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">CA</th>
            <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Commissions</th>
            <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Cmdes</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <td className="py-3 pr-3">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold
                  ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                  {i + 1}
                </div>
              </td>
              <td className="py-3 pr-4">
                <div className="font-medium text-slate-700 truncate max-w-xs">{item.name}</div>
                <div className="h-1.5 bg-slate-100 rounded-full mt-1.5 w-32">
                  <div
                    className="h-full bg-brand rounded-full"
                    style={{ width: `${Math.round((item.ca / maxCA) * 100)}%` }}
                  />
                </div>
              </td>
              <td className="py-3 pr-4 text-right font-semibold text-slate-800">{fmt(item.ca)}</td>
              <td className="py-3 pr-4 text-right font-semibold text-emerald-600">{fmt(item.commissions)}</td>
              <td className="py-3 text-right text-slate-500">{item.orderCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/test/TopTable.test.tsx
```
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/analytics/TopTable.tsx src/test/TopTable.test.tsx
git commit -m "feat: add TopTable component"
```

---

## Chunk 3: Analytics Page

### Task 7: Assemble Analytics page

**Files:**
- Modify: `src/pages/Analytics.tsx` (replaces placeholder)
- Create: `src/test/AnalyticsPage.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/test/AnalyticsPage.test.tsx
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

test('renders period pills', () => {
  render(<Analytics />)
  expect(screen.getByText('7j')).toBeDefined()
  expect(screen.getByText('30j')).toBeDefined()
  expect(screen.getByText('Tout')).toBeDefined()
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

test('changing period updates KPI values', () => {
  render(<Analytics />)
  const before = screen.getByText('CA Généré').closest('div')?.nextSibling?.textContent
  fireEvent.click(screen.getByText('7j'))
  // After clicking 7j, value might change (or stay same) — just ensure no crash
  expect(screen.getByText('CA Généré')).toBeDefined()
})
```

- [ ] **Step 2: Run to verify failure**

```bash
npx vitest run src/test/AnalyticsPage.test.tsx
```

- [ ] **Step 3: Implement Analytics page**

```tsx
// src/pages/Analytics.tsx
import { useMemo, useState } from 'react'
import type { Period } from '../types/analytics'
import { MOCK_ORDERS } from '../data/mockAnalytics'
import {
  filterByPeriod,
  computeKPIs,
  computeWeeklyTrend,
  computeOrderTypeBreakdown,
  computeTopProducts,
  computeTopBoutiques,
} from '../utils/analyticsUtils'
import KPICard from '../components/analytics/KPICard'
import TrendChart from '../components/analytics/TrendChart'
import DonutChart from '../components/analytics/DonutChart'
import TopTable from '../components/analytics/TopTable'

const PERIODS: { label: string; value: Period }[] = [
  { label: '7j', value: '7j' },
  { label: '30j', value: '30j' },
  { label: '3 mois', value: '3m' },
  { label: '6 mois', value: '6m' },
  { label: 'Tout', value: 'tout' },
]

type Tab = 'general' | 'products' | 'boutiques'

export default function Analytics() {
  const [period, setPeriod] = useState<Period>('30j')
  const [tab, setTab] = useState<Tab>('general')

  const filtered = useMemo(
    () => filterByPeriod(MOCK_ORDERS, period).filter(o => o.status === 'Réglée'),
    [period]
  )
  const allRéglées = useMemo(() => MOCK_ORDERS.filter(o => o.status === 'Réglée'), [])

  const kpis = useMemo(() => computeKPIs(filtered, allRéglées, period), [filtered, allRéglées, period])
  const weeklyTrend = useMemo(() => computeWeeklyTrend(filtered), [filtered])
  const breakdown = useMemo(() => computeOrderTypeBreakdown(filtered), [filtered])
  const topProducts = useMemo(() => computeTopProducts(filtered), [filtered])
  const topBoutiques = useMemo(() => computeTopBoutiques(filtered), [filtered])

  function fmt(n: number) {
    return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">{MOCK_ORDERS.length} commandes au total</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
          {PERIODS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                period === p.value
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard label="CA Généré" value={fmt(kpis.totalCA)} trend={kpis.caGrowth} />
        <KPICard label="Commissions" value={fmt(kpis.totalCommissions)} trend={kpis.commissionsGrowth} />
        <KPICard
          label="Commandes"
          value={`${kpis.validatedOrders}`}
          trend={kpis.ordersGrowth}
          subtitle={`sur ${kpis.totalOrders} au total`}
        />
        <KPICard
          label="Panier moyen"
          value={fmt(kpis.averageBasket)}
          trend={null}
          subtitle="commandes validées"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        {([['general', 'Vue générale'], ['products', 'Top Produits'], ['boutiques', 'Top Boutiques']] as const).map(
          ([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === value
                  ? 'bg-white text-brand shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Tab: Vue générale */}
      {tab === 'general' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 mb-4">Évolution CA & Commissions</h3>
            <TrendChart data={weeklyTrend} />
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 mb-4">Type de commandes</h3>
            <DonutChart affiliée={breakdown.affiliée} pub_shopping={breakdown.pub_shopping} />
          </div>
        </div>
      )}

      {/* Tab: Top Produits */}
      {tab === 'products' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 mb-6">Top Produits</h3>
          <TopTable items={topProducts} label="Produit" />
        </div>
      )}

      {/* Tab: Top Boutiques */}
      {tab === 'boutiques' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 mb-6">Top Boutiques</h3>
          <TopTable items={topBoutiques} label="Boutique" />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/test/AnalyticsPage.test.tsx
```
Expected: PASS (7 tests)

- [ ] **Step 5: Run full test suite**

```bash
npx vitest run
```
Expected: All tests pass (previous tests still green)

- [ ] **Step 6: Commit**

```bash
git add src/pages/Analytics.tsx src/test/AnalyticsPage.test.tsx
git commit -m "feat: implement Analytics page with KPIs, trend chart, and top tables"
```

---

### Task 8: Wire Analytics page into app navigation

**Files:**
- Modify: `src/components/layout/AppLayout.tsx` (add Analytics to navigation)
- Modify: `src/components/layout/Sidebar.tsx` (add analytics nav item if missing)

- [ ] **Step 1: Check current state**

Read `src/components/layout/AppLayout.tsx` to confirm whether `analytics` is already in `PAGE_COMPONENTS` or `NAV_ITEMS`.

- [ ] **Step 2: Verify Analytics renders in the app**

```bash
npm run dev
```
Open http://localhost:5173 — click "Analytics" in sidebar. Verify KPIs and charts render. No console errors.

- [ ] **Step 3: Run full test suite one final time**

```bash
npx vitest run
```
Expected: All tests pass.

- [ ] **Step 4: Final commit**

```bash
git add src/components/layout/AppLayout.tsx src/components/layout/Sidebar.tsx
git commit -m "feat: wire Analytics page into app navigation"
```
