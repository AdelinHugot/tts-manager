import { useEffect, useMemo, useState } from 'react'
import { useMobileHeaderActions } from '../context/MobileHeaderContext'
import {
  computeKPIs,
  computeDailyTrend,
  computeTopProducts,
  filterByPeriod,
  filterByDateRange,
  isComptabilisable,
} from '../utils/analyticsUtils'
import KPICard from '../components/analytics/KPICard'
import TrendChart from '../components/analytics/TrendChart'
import DateRangePicker, { type DateRange, type PresetPeriod } from '../components/analytics/DateRangePicker'
import type { Realisation, Product } from '../types/realisation'
import { STATUS_LABELS, STATUS_COLORS } from '../types/realisation'
import type { Order, Period } from '../types/analytics'

type Props = {
  realisations: Realisation[]
  products: Product[]
  orders: Order[]
}

const PERIODS: PresetPeriod[] = [
  { value: 'ce_mois',             label: 'Ce mois-ci' },
  { value: 'mois_precedent',      label: 'Mois précédent' },
  { value: 'ce_trimestre',        label: 'Ce trimestre' },
  { value: 'trimestre_precedent', label: 'Trim. précédent' },
  { value: 'cette_annee',         label: 'Cette année' },
  { value: 'annee_derniere',      label: 'Année dernière' },
]

function formatRange(range: DateRange): string {
  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return `${fmt(range.start)} – ${fmt(range.end)}`
}

const STATUS_ORDER: Realisation['status'][] = ['a_tourner', 'script', 'a_monter', 'a_publier']

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

export default function Dashboard({ realisations, products, orders }: Props) {
  const [period, setPeriod] = useState<Period>('ce_mois')
  const [customRange, setCustomRange] = useState<DateRange | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [topSortBy, setTopSortBy] = useState<'ca' | 'commissions'>('commissions')

  const filteredOrders = useMemo(
    () => customRange
      ? filterByDateRange(orders, customRange.start, customRange.end)
      : filterByPeriod(orders, period),
    [orders, period, customRange]
  )
  const filteredComptabilisées = useMemo(
    () => filteredOrders.filter(isComptabilisable),
    [filteredOrders]
  )

  const kpis = useMemo(
    () => computeKPIs(filteredOrders, orders, customRange ? undefined : period),
    [filteredOrders, orders, period, customRange]
  )

  function selectPeriod(p: Period) {
    setPeriod(p)
    setCustomRange(null)
    setPickerOpen(false)
  }
  const dailyTrend = useMemo(() => computeDailyTrend(filteredComptabilisées), [filteredComptabilisées])
  const topProducts = useMemo(
    () => computeTopProducts(filteredComptabilisées, 5, topSortBy),
    [filteredComptabilisées, topSortBy]
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

  // ── Mobile header actions ─────────────────────────────────────────────────
  const { setActions } = useMobileHeaderActions()
  useEffect(() => {
    setActions(
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setPickerOpen((o) => !o)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            pickerOpen
              ? 'bg-white border-brand/50 text-brand shadow-sm'
              : customRange
                ? 'bg-brand text-white border-brand shadow-sm'
                : 'bg-white border-slate-200 text-slate-600'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M2 8h14" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          {customRange
            ? formatRange(customRange)
            : PERIODS.find((p) => p.value === period)?.label ?? 'Période'}
        </button>
      </div>
    )
    return () => setActions(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerOpen, customRange, period])


  return (
    <>
      {/* DateRangePicker — sur mobile rendu ici (hors du header) pour éviter le clipping backdrop-filter */}
      <div className="md:hidden">
        {pickerOpen && (
          <DateRangePicker
            value={customRange}
            activePeriod={customRange ? null : period}
            periods={PERIODS}
            onApply={(range) => { setCustomRange(range); setPickerOpen(false) }}
            onSelectPeriod={selectPeriod}
            onClear={() => setCustomRange(null)}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </div>

      {/* ─── Mobile ─── scroll vertical */}
      <div className="md:hidden flex flex-col p-4 gap-4 overflow-y-auto">

        {/* KPIs — 2×2 */}
        <div className="grid grid-cols-2 gap-3">
          <KPICard label="CA Généré" value={fmt(kpis.totalCA)} trend={kpis.caGrowth} />
          <KPICard label="Commissions" value={fmt(kpis.totalCommissions)} trend={kpis.commissionsGrowth} />
          <KPICard label="Commandes réglées" value={String(kpis.validatedOrders)} trend={kpis.ordersGrowth}
            subtitle={[kpis.enAttenteOrders > 0 && `${kpis.enAttenteOrders} en attente`, kpis.ineligibleOrders > 0 && `${kpis.ineligibleOrders} inéligibles`].filter(Boolean).join(' · ') || undefined} />
          <KPICard label="Panier moyen" value={fmt(kpis.averageBasket)} trend={null} subtitle="cmd. validées" />
        </div>

        {/* Vidéos à traiter */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-500">Vidéos à traiter</h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{todo.length}</span>
          </div>
          {todo.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Tout est publié 🎉</p>
          ) : (
            <div className="flex flex-col gap-2">
              {todo.slice(0, 5).map((r) => {
                const product = products.find((p) => p.id === r.productId)
                const colors = STATUS_COLORS[r.status]
                return (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{r.title}</p>
                      {product && <p className="text-xs text-slate-400 truncate">{product.name}</p>}
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${colors.bg} ${colors.text}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>
                )
              })}
              {todo.length > 5 && (
                <p className="text-xs text-slate-400 text-center pt-1">+{todo.length - 5} autres</p>
              )}
            </div>
          )}
        </div>

        {/* Graphique */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm overflow-hidden">
          <h3 className="text-xs font-semibold text-slate-500 mb-3">Évolution CA & Commissions</h3>
          {dailyTrend.length > 0 ? (
            <TrendChart data={dailyTrend} />
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-slate-400">
              Pas de données pour cette période
            </div>
          )}
        </div>

        {/* Top Produits */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-slate-500">Top Produits</h3>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
              {(['commissions', 'ca'] as const).map((v) => (
                <button key={v} onClick={() => setTopSortBy(v)}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${topSortBy === v ? 'bg-white text-brand shadow-sm' : 'text-slate-400'}`}>
                  {v === 'commissions' ? 'Comm.' : 'CA'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {topProducts.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                  {i + 1}
                </span>
                <span className="flex-1 text-xs font-semibold text-slate-700 truncate">{item.name}</span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400">{item.orderCount} ventes</span>
                  <span className="text-xs text-brand font-semibold tabular-nums">
                    {(topSortBy === 'commissions' ? item.commissions : item.ca).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                  </span>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">Aucune donnée</p>
            )}
          </div>
        </div>

      </div>

      {/* ─── Desktop ─── layout fixe sans scroll */}
      <div className="hidden md:flex flex-col h-full p-6 gap-4 overflow-hidden">

        {/* Header + KPIs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 hidden md:block">Dashboard</h1>
              <p className="text-xs text-slate-400 mt-0.5">{capitalized}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setPickerOpen(o => !o)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  pickerOpen
                    ? 'bg-white border-brand/50 text-brand shadow-sm'
                    : customRange
                      ? 'bg-brand text-white border-brand shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-brand/40 hover:text-slate-800'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M2 8h14" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                {customRange
                  ? formatRange(customRange)
                  : PERIODS.find(p => p.value === period)?.label ?? 'Période'}
              </button>
              {pickerOpen && (
                <DateRangePicker
                  value={customRange}
                  activePeriod={customRange ? null : period}
                  periods={PERIODS}
                  onApply={(range) => { setCustomRange(range); setPickerOpen(false) }}
                  onSelectPeriod={selectPeriod}
                  onClear={() => setCustomRange(null)}
                  onClose={() => setPickerOpen(false)}
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <KPICard label="CA Généré" value={fmt(kpis.totalCA)} trend={kpis.caGrowth} />
            <KPICard label="Commissions" value={fmt(kpis.totalCommissions)} trend={kpis.commissionsGrowth} />
            <KPICard label="Commandes réglées" value={String(kpis.validatedOrders)} trend={kpis.ordersGrowth}
              subtitle={[kpis.enAttenteOrders > 0 && `${kpis.enAttenteOrders} en attente`, kpis.ineligibleOrders > 0 && `${kpis.ineligibleOrders} inéligibles`].filter(Boolean).join(' · ') || undefined} />
            <KPICard label="Panier moyen" value={fmt(kpis.averageBasket)} trend={null} subtitle="commandes validées" />
          </div>
        </div>

        {/* Main area */}
        <div className="flex gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-4 w-2/3 min-w-0 min-h-0">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col flex-1 min-h-0">
              <h3 className="text-xs font-semibold text-slate-500 mb-3 flex-shrink-0">Évolution CA & Commissions — {capitalized}</h3>
              <div className="flex-1 min-h-0">
                {dailyTrend.length > 0 ? <TrendChart data={dailyTrend} /> : (
                  <div className="h-full flex items-center justify-center text-sm text-slate-400">Pas de données validées pour ce mois</div>
                )}
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col flex-1 min-h-0">
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h3 className="text-xs font-semibold text-slate-500">Top Produits</h3>
                <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
                  {(['commissions', 'ca'] as const).map((v) => (
                    <button key={v} onClick={() => setTopSortBy(v)}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${topSortBy === v ? 'bg-white text-brand shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                      {v === 'commissions' ? 'Commissions' : 'CA'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-0.5 overflow-y-auto">
                <div className="grid grid-cols-[1.5rem_1fr_3rem_5rem_5rem] gap-2 px-2 pb-2 border-b border-slate-100 flex-shrink-0">
                  <span /><span className="text-xs font-semibold text-slate-400">Produit</span>
                  <span className="text-xs font-semibold text-slate-400 text-right">Ventes</span>
                  <span className="text-xs font-semibold text-slate-400 text-right">CA</span>
                  <span className="text-xs font-semibold text-slate-400 text-right">Comm.</span>
                </div>
                {topProducts.map((item, i) => (
                  <div key={item.name} className="grid grid-cols-[1.5rem_1fr_3rem_5rem_5rem] gap-2 items-center px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors flex-shrink-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                    <span className="text-xs font-semibold text-slate-700 truncate">{item.name}</span>
                    <span className="text-xs font-semibold text-slate-600 text-right">{item.orderCount}</span>
                    <span className="text-xs text-slate-600 text-right tabular-nums">{item.ca.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</span>
                    <span className="text-xs text-brand font-semibold text-right tabular-nums">{item.commissions.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-1/3 flex-shrink-0 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h3 className="text-xs font-semibold text-slate-500">Vidéos à traiter</h3>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{todo.length}</span>
            </div>
            {todo.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Tout est publié 🎉</p>
            ) : (
              <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
                {todo.map((r) => {
                  const product = products.find((p) => p.id === r.productId)
                  const colors = STATUS_COLORS[r.status]
                  return (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex-shrink-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{r.title}</p>
                        {product && <p className="text-xs text-slate-400 truncate">{product.name}</p>}
                      </div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${colors.bg} ${colors.text}`}>{STATUS_LABELS[r.status]}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
