import { useMemo, useState } from 'react'
import {
  computeKPIs,
  computeDailyTrend,
  computeTopProducts,
} from '../utils/analyticsUtils'
import KPICard from '../components/analytics/KPICard'
import TrendChart from '../components/analytics/TrendChart'
import type { Realisation, Product } from '../types/realisation'
import { STATUS_LABELS, STATUS_COLORS } from '../types/realisation'
import type { Order } from '../types/analytics'

type Props = {
  realisations: Realisation[]
  products: Product[]
  orders: Order[]
}

type DashPeriod = 'mois' | '30j' | 'tout'

const PERIOD_LABELS: { value: DashPeriod; label: string }[] = [
  { value: 'mois', label: 'Ce mois' },
  { value: '30j', label: '30 jours' },
  { value: 'tout', label: 'Tout' },
]

const STATUS_ORDER: Realisation['status'][] = ['a_tourner', 'script', 'a_monter', 'a_publier']

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function filterByDashPeriod(orders: typeof MOCK_ORDERS, period: DashPeriod) {
  const now = new Date()
  if (period === 'tout') return orders
  if (period === 'mois')
    return orders.filter(
      (o) => o.date.getMonth() === now.getMonth() && o.date.getFullYear() === now.getFullYear()
    )
  // 30j
  const cutoff = new Date(now.getTime() - 30 * 86400000)
  return orders.filter((o) => o.date >= cutoff)
}

export default function Dashboard({ realisations, products, orders }: Props) {
  const [period, setPeriod] = useState<DashPeriod>('mois')
  const [topSortBy, setTopSortBy] = useState<'ca' | 'commissions'>('commissions')

  const allRéglées = useMemo(() => orders.filter((o) => o.status === 'Réglée'), [orders])

  const filteredOrders = useMemo(() => filterByDashPeriod(orders, period), [orders, period])
  const filteredRéglées = useMemo(
    () => filteredOrders.filter((o) => o.status === 'Réglée'),
    [filteredOrders]
  )

  const kpis = useMemo(
    () => computeKPIs(filteredOrders, allRéglées, period === '30j' ? '30j' : 'tout'),
    [filteredOrders, allRéglées, period]
  )
  const dailyTrend = useMemo(() => computeDailyTrend(filteredRéglées), [filteredRéglées])
  const topProducts = useMemo(
    () => computeTopProducts(filteredRéglées, 5, topSortBy),
    [filteredRéglées, topSortBy]
  )

  const todo = useMemo(
    () =>
      realisations
        .filter((r) => r.status !== 'publiee')
        .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)),
    [realisations]
  )

  const now = new Date()
  const monthLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const capitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

  return (
    // h-full + overflow-hidden = pas de scroll, tout tient dans la fenêtre
    <div className="flex flex-col h-full p-6 gap-4 overflow-hidden">

      {/* Header + KPIs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">{capitalized}</p>
          </div>
          {/* Sélecteur de période */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {PERIOD_LABELS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === p.value
                    ? 'bg-white text-brand shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
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
      </div>

      {/* Main area — flex-1 remplit tout l'espace restant */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* Colonne gauche : graphique + top produits empilés */}
        <div className="flex flex-col gap-4 flex-1 min-w-0 min-h-0">

          {/* Graphique */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col flex-1 min-h-0">
            <h3 className="text-xs font-semibold text-slate-500 mb-3 flex-shrink-0">
              Évolution CA & Commissions — {capitalized}
            </h3>
            <div className="flex-1 min-h-0">
              {dailyTrend.length > 0 ? (
                <TrendChart data={dailyTrend} />
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-slate-400">
                  Pas de données validées pour ce mois
                </div>
              )}
            </div>
          </div>

          {/* Top Produits */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h3 className="text-xs font-semibold text-slate-500">Top Produits</h3>
              <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setTopSortBy('commissions')}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                    topSortBy === 'commissions'
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Commissions
                </button>
                <button
                  onClick={() => setTopSortBy('ca')}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                    topSortBy === 'ca'
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  CA
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-0.5 overflow-y-auto">
              <div className="grid grid-cols-[1.5rem_1fr_3rem_5rem_5rem] gap-2 px-2 pb-2 border-b border-slate-100 flex-shrink-0">
                <span />
                <span className="text-xs font-semibold text-slate-400">Produit</span>
                <span className="text-xs font-semibold text-slate-400 text-right">Ventes</span>
                <span className="text-xs font-semibold text-slate-400 text-right">CA</span>
                <span className="text-xs font-semibold text-slate-400 text-right">Comm.</span>
              </div>
              {topProducts.map((item, i) => (
                <div
                  key={item.name}
                  className="grid grid-cols-[1.5rem_1fr_3rem_5rem_5rem] gap-2 items-center px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors flex-shrink-0"
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 truncate">{item.name}</span>
                  <span className="text-xs font-semibold text-slate-600 text-right">{item.orderCount}</span>
                  <span className="text-xs text-slate-600 text-right tabular-nums">
                    {item.ca.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                  </span>
                  <span className="text-xs text-brand font-semibold text-right tabular-nums">
                    {item.commissions.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne droite : todo sur toute la hauteur */}
        <div className="w-72 flex-shrink-0 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h3 className="text-xs font-semibold text-slate-500">Vidéos à traiter</h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {todo.length}
            </span>
          </div>

          {todo.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Tout est publié 🎉</p>
          ) : (
            <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
              {todo.map((r) => {
                const product = products.find((p) => p.id === r.productId)
                const colors = STATUS_COLORS[r.status]
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex-shrink-0"
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{r.title}</p>
                      {product && (
                        <p className="text-xs text-slate-400 truncate">{product.name}</p>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${colors.bg} ${colors.text}`}
                    >
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
