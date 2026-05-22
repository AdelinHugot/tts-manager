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
    () => filterByPeriod(MOCK_ORDERS, period),
    [period]
  )
  const filteredRéglées = useMemo(
    () => filtered.filter(o => o.status === 'Réglée'),
    [filtered]
  )
  const allRéglées = useMemo(() => MOCK_ORDERS.filter(o => o.status === 'Réglée'), [])

  const kpis = useMemo(() => computeKPIs(filtered, allRéglées, period), [filtered, allRéglées, period])
  const weeklyTrend = useMemo(() => computeWeeklyTrend(filteredRéglées), [filteredRéglées])
  const breakdown = useMemo(() => computeOrderTypeBreakdown(filteredRéglées), [filteredRéglées])
  const topProducts = useMemo(() => computeTopProducts(filteredRéglées), [filteredRéglées])
  const topBoutiques = useMemo(() => computeTopBoutiques(filteredRéglées), [filteredRéglées])

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
