import { useMemo, useState } from 'react'
import type { Period, Order } from '../types/analytics'
import {
  filterByPeriod,
  filterByDateRange,
  computeKPIs,
  computeDailyTrend,
  computeOrderTypeBreakdown,
  computeTopProducts,
  computeTopBoutiques,
} from '../utils/analyticsUtils'
import KPICard from '../components/analytics/KPICard'
import TrendChart from '../components/analytics/TrendChart'
import DonutChart from '../components/analytics/DonutChart'
import TopTable from '../components/analytics/TopTable'
import DateRangePicker, { type DateRange, type PresetPeriod } from '../components/analytics/DateRangePicker'

const PERIODS: PresetPeriod[] = [
  { label: '7 jours', value: '7j' },
  { label: '30 jours', value: '30j' },
  { label: '3 mois', value: '3m' },
  { label: '6 mois', value: '6m' },
  { label: 'Tout', value: 'tout' },
]

type Tab = 'general' | 'products' | 'boutiques'

function formatRange(range: DateRange): string {
  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return `${fmt(range.start)} – ${fmt(range.end)}`
}

type Props = { orders: Order[] }

export default function Analytics({ orders }: Props) {
  const [period, setPeriod] = useState<Period>('30j')
  const [customRange, setCustomRange] = useState<DateRange | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('general')

  const filtered = useMemo(() => {
    if (customRange) return filterByDateRange(orders, customRange.start, customRange.end)
    return filterByPeriod(orders, period)
  }, [orders, period, customRange])

  const filteredRéglées = useMemo(
    () => filtered.filter(o => o.status === 'Réglée'),
    [filtered]
  )
  const allRéglées = useMemo(() => orders.filter(o => o.status === 'Réglée'), [orders])

  const kpis = useMemo(
    () => computeKPIs(filtered, allRéglées, customRange ? 'tout' : period),
    [filtered, allRéglées, period, customRange]
  )
  const weeklyTrend = useMemo(() => computeDailyTrend(filteredRéglées), [filteredRéglées])
  const breakdown = useMemo(() => computeOrderTypeBreakdown(filteredRéglées), [filteredRéglées])
  const topProducts = useMemo(() => computeTopProducts(filteredRéglées), [filteredRéglées])
  const topBoutiques = useMemo(() => computeTopBoutiques(filteredRéglées), [filteredRéglées])

  function fmt(n: number) {
    return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
  }

  function selectPeriod(p: Period) {
    setPeriod(p)
    setCustomRange(null)
    setPickerOpen(false)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">{orders.length} commandes au total</p>
        </div>

        {/* Single button that opens the combined picker */}
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
              onApply={(range) => setCustomRange(range)}
              onSelectPeriod={(p) => selectPeriod(p)}
              onClear={() => setCustomRange(null)}
              onClose={() => setPickerOpen(false)}
            />
          )}
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
