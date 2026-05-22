import { useMemo } from 'react'
import { MOCK_ORDERS } from '../data/mockAnalytics'
import {
  computeKPIs,
  computeWeeklyTrend,
  computeTopProducts,
} from '../utils/analyticsUtils'
import KPICard from '../components/analytics/KPICard'
import TrendChart from '../components/analytics/TrendChart'
import type { Realisation, Product } from '../types/realisation'
import { STATUS_LABELS, STATUS_COLORS } from '../types/realisation'

type Props = {
  realisations: Realisation[]
  products: Product[]
}

const STATUS_ORDER: Realisation['status'][] = ['a_tourner', 'script', 'a_monter', 'a_publier']

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function filterCurrentMonth(orders: typeof MOCK_ORDERS) {
  const now = new Date()
  return orders.filter(
    (o) => o.date.getMonth() === now.getMonth() && o.date.getFullYear() === now.getFullYear()
  )
}

export default function Dashboard({ realisations, products }: Props) {
  const currentMonthOrders = useMemo(() => filterCurrentMonth(MOCK_ORDERS), [])
  const allRéglées = useMemo(() => MOCK_ORDERS.filter((o) => o.status === 'Réglée'), [])
  const currentMonthRéglées = useMemo(
    () => currentMonthOrders.filter((o) => o.status === 'Réglée'),
    [currentMonthOrders]
  )

  const kpis = useMemo(
    () => computeKPIs(currentMonthOrders, allRéglées, '30j'),
    [currentMonthOrders, allRéglées]
  )
  const weeklyTrend = useMemo(() => computeWeeklyTrend(currentMonthRéglées), [currentMonthRéglées])
  const topProducts = useMemo(() => computeTopProducts(allRéglées, 5), [allRéglées])

  // Todo: réalisations non publiées, triées par ordre de statut
  const todo = useMemo(
    () =>
      realisations
        .filter((r) => r.status !== 'publiee')
        .sort(
          (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
        ),
    [realisations]
  )

  const now = new Date()
  const monthLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const capitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5">{capitalized}</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard label="CA Généré" value={fmt(kpis.totalCA)} trend={kpis.caGrowth} />
        <KPICard label="Commissions" value={fmt(kpis.totalCommissions)} trend={kpis.commissionsGrowth} />
        <KPICard
          label="Commandes"
          value={String(kpis.validatedOrders)}
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

      {/* Chart */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-8">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">
          Évolution CA & Commissions — {capitalized}
        </h3>
        {weeklyTrend.length > 0 ? (
          <TrendChart data={weeklyTrend} />
        ) : (
          <div className="h-48 flex items-center justify-center text-sm text-slate-400">
            Pas de données validées pour ce mois
          </div>
        )}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Todo */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500">Vidéos à traiter</h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {todo.length}
            </span>
          </div>

          {todo.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Tout est publié 🎉</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
              {todo.map((r) => {
                const product = products.find((p) => p.id === r.productId)
                const colors = STATUS_COLORS[r.status]
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{r.title}</p>
                      {product && (
                        <p className="text-xs text-slate-400 truncate">{product.name}</p>
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${colors.bg} ${colors.text}`}
                    >
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top Produits */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 mb-4">Top Produits</h3>
          <div className="flex flex-col gap-1">
            {/* Header */}
            <div className="grid grid-cols-[1.5rem_1fr_3rem_5rem_5rem] gap-2 px-2 pb-2 border-b border-slate-100">
              <span />
              <span className="text-xs font-semibold text-slate-400">Produit</span>
              <span className="text-xs font-semibold text-slate-400 text-right">Ventes</span>
              <span className="text-xs font-semibold text-slate-400 text-right">CA</span>
              <span className="text-xs font-semibold text-slate-400 text-right">Comm.</span>
            </div>

            {topProducts.map((item, i) => (
              <div
                key={item.name}
                className="grid grid-cols-[1.5rem_1fr_3rem_5rem_5rem] gap-2 items-center px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                {/* Rank badge */}
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    i === 0
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {i + 1}
                </span>

                {/* Name */}
                <span className="text-xs font-semibold text-slate-700 truncate">{item.name}</span>

                {/* Sales count */}
                <span className="text-xs font-semibold text-slate-600 text-right">
                  {item.orderCount}
                </span>

                {/* CA */}
                <span className="text-xs text-slate-600 text-right tabular-nums">
                  {item.ca.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                </span>

                {/* Commissions */}
                <span className="text-xs text-brand font-semibold text-right tabular-nums">
                  {item.commissions.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
