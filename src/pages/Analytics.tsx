import { useEffect, useMemo, useState } from 'react'
import { useMobileHeaderActions } from '../context/MobileHeaderContext'
import type { Period, Order } from '../types/analytics'
import type { Realisation, Product } from '../types/realisation'
import {
  filterByPeriod,
  filterByDateRange,
  computeKPIs,
  computeDailyTrend,
  computeOrderTypeBreakdown,
  computeStrategicBoutiques,
  computeStrategicProducts,
  computeVideoPerformance,
} from '../utils/analyticsUtils'
import KPICard from '../components/analytics/KPICard'
import TrendChart from '../components/analytics/TrendChart'
import DonutChart from '../components/analytics/DonutChart'
import StrategicTable from '../components/analytics/StrategicTable'
import VideoPerformanceTable from '../components/analytics/VideoPerformanceTable'
import DateRangePicker, { type DateRange, type PresetPeriod } from '../components/analytics/DateRangePicker'
import { useTikTokAuth } from '../hooks/useTikTokAuth'

const PERIODS: PresetPeriod[] = [
  { label: 'Ce mois-ci',       value: 'ce_mois' },
  { label: 'Mois précédent',   value: 'mois_precedent' },
  { label: 'Ce trimestre',     value: 'ce_trimestre' },
  { label: 'Trim. précédent',  value: 'trimestre_precedent' },
  { label: 'Cette année',      value: 'cette_annee' },
  { label: 'Année dernière',   value: 'annee_derniere' },
]

type Tab = 'compte' | 'marques' | 'produits' | 'videos'
type StrategicSortKey = 'ca' | 'commissions' | 'tauxCommission' | 'averageBasket' | 'orderCount'
type VideoSortKey = StrategicSortKey | 'views' | 'conversionRate'

function formatRange(range: DateRange): string {
  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return `${fmt(range.start)} – ${fmt(range.end)}`
}

function fmtEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function fmtPct(n: number) {
  return n.toFixed(1) + ' %'
}

type Props = { orders: Order[]; realisations: Realisation[]; products: Product[] }

export default function Analytics({ orders, realisations, products }: Props) {
  const [period, setPeriod] = useState<Period>('ce_mois')
  const [customRange, setCustomRange] = useState<DateRange | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('compte')
  const [sortMarques, setSortMarques] = useState<StrategicSortKey>('ca')
  const [sortProduits, setSortProduits] = useState<StrategicSortKey>('ca')
  const [sortVideos, setSortVideos] = useState<VideoSortKey>('ca')

  // TikTok metrics
  const { status: tiktokStatus, connect: connectTikTok, getVideoMetrics } = useTikTokAuth()
  const [tiktokMetrics, setTiktokMetrics] = useState<Map<string, { view_count: number; like_count: number; share_count: number }>>(new Map())

  const filtered = useMemo(() => {
    if (customRange) return filterByDateRange(orders, customRange.start, customRange.end)
    return filterByPeriod(orders, period)
  }, [orders, period, customRange])

  const filteredRéglées = useMemo(() => filtered.filter(o => o.status === 'Réglée'), [filtered])
  const allRéglées = useMemo(() => orders.filter(o => o.status === 'Réglée'), [orders])

  const kpis = useMemo(
    () => computeKPIs(filtered, allRéglées, customRange ? undefined : period),
    [filtered, allRéglées, period, customRange]
  )

  // Extra strategic metrics
  const tauxCommission = kpis.totalCA > 0 ? (kpis.totalCommissions / kpis.totalCA) * 100 : 0
  const commParCommande = kpis.validatedOrders > 0 ? kpis.totalCommissions / kpis.validatedOrders : 0
  const tauxEligibilite = (kpis.validatedOrders + kpis.ineligibleOrders) > 0
    ? (kpis.validatedOrders / (kpis.validatedOrders + kpis.ineligibleOrders)) * 100
    : null

  const dailyTrend = useMemo(() => computeDailyTrend(filteredRéglées), [filteredRéglées])
  const breakdown = useMemo(() => computeOrderTypeBreakdown(filteredRéglées), [filteredRéglées])
  const strategicMarques = useMemo(() => computeStrategicBoutiques(filteredRéglées), [filteredRéglées])
  const strategicProduits = useMemo(() => computeStrategicProducts(filteredRéglées), [filteredRéglées])
  const videoPerformance = useMemo(() => {
    const base = computeVideoPerformance(realisations, filteredRéglées, products)
    if (tiktokMetrics.size === 0) return base
    return base.map((item) => {
      if (!item.tiktokVideoId) return item
      const m = tiktokMetrics.get(item.tiktokVideoId)
      if (!m) return item
      const views = m.view_count
      return {
        ...item,
        views,
        likes: m.like_count,
        shares: m.share_count,
        conversionRate: views > 0 ? (item.orderCount / views) * 100 : 0,
        revenuePerView: views > 0 ? item.ca / views : 0,
      }
    })
  }, [realisations, filteredRéglées, products, tiktokMetrics])

  // Fetch TikTok metrics when tab is opened and account is connected
  useEffect(() => {
    if (tab !== 'videos' || tiktokStatus !== 'connected') return
    const ids = videoPerformance
      .map((v) => v.tiktokVideoId)
      .filter((id): id is string => !!id)
    if (ids.length === 0) return
    getVideoMetrics(ids).then((map) => {
      setTiktokMetrics(new Map(map))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, tiktokStatus])

  function selectPeriod(p: Period) {
    setPeriod(p)
    setCustomRange(null)
    setPickerOpen(false)
  }

  // ── Mobile header actions ──────────────────────────────────────────────────
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
          {customRange ? formatRange(customRange) : PERIODS.find(p => p.value === period)?.label ?? 'Période'}
        </button>
      </div>
    )
    return () => setActions(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerOpen, customRange, period])

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">

      {/* DateRangePicker mobile (hors header pour éviter le clipping backdrop-filter) */}
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

      {/* Header desktop */}
      <div className="hidden md:flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">{orders.length} commandes au total</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setPickerOpen((o) => !o)}
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
            {customRange ? formatRange(customRange) : PERIODS.find(p => p.value === period)?.label ?? 'Période'}
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

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        {([
          ['compte',   'Compte'],
          ['marques',  'Marques'],
          ['produits', 'Produits'],
          ['videos',   'Vidéos'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === value ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab : Compte ── */}
      {tab === 'compte' && (
        <div className="space-y-6">
          {/* KPI row 1 — Revenue */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <KPICard label="CA Généré" value={fmtEur(kpis.totalCA)} trend={kpis.caGrowth} />
            <KPICard label="Commissions" value={fmtEur(kpis.totalCommissions)} trend={kpis.commissionsGrowth} />
            <div className="col-span-2 md:col-span-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Taux de commission</div>
              <div className="text-2xl font-extrabold text-slate-900 mb-1">{fmtPct(tauxCommission)}</div>
              <div className="text-xs text-slate-400">de chaque € vendu vous revient</div>
            </div>
          </div>

          {/* KPI row 2 — Orders */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <KPICard
              label="Commandes réglées"
              value={`${kpis.validatedOrders}`}
              trend={kpis.ordersGrowth}
              subtitle={[
                kpis.enAttenteOrders > 0 && `${kpis.enAttenteOrders} en attente`,
                kpis.ineligibleOrders > 0 && `${kpis.ineligibleOrders} inéligibles`,
              ].filter(Boolean).join(' · ') || undefined}
            />
            <KPICard label="Panier moyen" value={fmtEur(kpis.averageBasket)} subtitle="par commande réglée" />
            <div className="col-span-2 md:col-span-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Commission / commande</div>
              <div className="text-2xl font-extrabold text-slate-900 mb-1">{fmtEur(commParCommande)}</div>
              <div className="text-xs text-slate-400">revenu moyen par commande réglée</div>
            </div>
          </div>

          {/* Taux d'éligibilité (si données disponibles) */}
          {tauxEligibilite !== null && kpis.ineligibleOrders > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-amber-500 flex-shrink-0">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M9 5.5v4M9 12v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span className="text-amber-700">
                <span className="font-semibold">{fmtPct(tauxEligibilite)} d'éligibilité</span>
                {' '}— {kpis.ineligibleOrders} commande{kpis.ineligibleOrders > 1 ? 's' : ''} inéligible{kpis.ineligibleOrders > 1 ? 's' : ''} sur la période
              </span>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 mb-4">Évolution CA & Commissions</h3>
              <TrendChart data={dailyTrend} />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 mb-4">Type de commandes</h3>
              <DonutChart affiliée={breakdown.affiliée} pub_shopping={breakdown.pub_shopping} />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab : Marques ── */}
      {tab === 'marques' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-700">Performance par marque</h3>
            <span className="text-xs text-slate-400">{strategicMarques.length} marque{strategicMarques.length > 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Le <span className="font-semibold text-slate-500">taux de commission</span> indique quelle marque est la plus rentable à promouvoir.
            <span className="inline-flex items-center gap-1 ml-2">
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">≥10% excellent</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand/10 text-brand border border-brand/20">5-10% correct</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">&lt;5% faible</span>
            </span>
          </p>
          <StrategicTable
            items={strategicMarques}
            showBoutique={false}
            sortKey={sortMarques}
            onSortChange={setSortMarques}
          />
        </div>
      )}

      {/* ── Tab : Produits ── */}
      {tab === 'produits' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-700">Performance par produit</h3>
            <span className="text-xs text-slate-400">{strategicProduits.length} produit{strategicProduits.length > 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Identifie les produits avec le meilleur <span className="font-semibold text-slate-500">taux de commission</span> et le <span className="font-semibold text-slate-500">panier moyen</span> le plus élevé pour orienter ta stratégie contenu.
          </p>
          <StrategicTable
            items={strategicProduits}
            showBoutique={true}
            sortKey={sortProduits}
            onSortChange={setSortProduits}
          />
        </div>
      )}

      {/* ── Tab : Vidéos ── */}
      {tab === 'videos' && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-700">Performance par vidéo</h3>
            <span className="text-xs text-slate-400">{videoPerformance.length} vidéo{videoPerformance.length > 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">
            Performances cumulées de toutes tes vidéos publiées — reliées aux commandes via l'URL TikTok.
          </p>
          {videoPerformance.some((v) => !v.isLinked) && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 mb-5">
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M9 5.5v4M9 12v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span>
                Certaines réalisations n'ont pas d'URL TikTok et ne peuvent pas être reliées aux commandes.
                Ajoute l'URL dans le panneau de la réalisation pour les suivre.
              </span>
            </div>
          )}
          {!videoPerformance.some((v) => !v.isLinked) && <div className="mb-5" />}
          <VideoPerformanceTable
            items={videoPerformance}
            sortKey={sortVideos}
            onSortChange={setSortVideos}
            tiktokConnected={tiktokStatus === 'connected'}
            onConnectTikTok={connectTikTok}
          />
        </div>
      )}
    </div>
  )
}
