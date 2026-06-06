import { useEffect, useMemo, useRef, useState } from 'react'
import { useMobileHeaderActions } from '../context/MobileHeaderContext'
import type { Order, Period } from '../types/analytics'
import { periodBounds } from '../utils/analyticsUtils'
import { useOrdersPaginated, useOrdersAggregates } from '../hooks/useFirestore'
import DateRangePicker, { type DateRange, type PresetPeriod } from '../components/analytics/DateRangePicker'
import { parseTikTokCSV, parseTikTokXLSX } from '../utils/csvParser'
import { fsBatchOrders, fsCheckExistingOrderIds, fsSyncEntitiesFromOrders } from '../lib/firestore'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

const PERIODS: PresetPeriod[] = [
  { label: 'Ce mois-ci',       value: 'ce_mois' },
  { label: 'Mois précédent',   value: 'mois_precedent' },
  { label: 'Ce trimestre',     value: 'ce_trimestre' },
  { label: 'Trim. précédent',  value: 'trimestre_precedent' },
  { label: 'Cette année',      value: 'cette_annee' },
  { label: 'Année dernière',   value: 'annee_derniere' },
]

const STATUS_STYLES: Record<Order['status'], string> = {
  'Réglée':     'bg-emerald-50 text-emerald-600',
  'En attente': 'bg-amber-50 text-amber-600',
  'Inéligible': 'bg-red-50 text-red-500',
}

const TYPE_STYLES: Record<Order['orderType'], string> = {
  affiliée:     'bg-blue-50 text-blue-600',
  pub_shopping: 'bg-violet-50 text-violet-600',
}

const TYPE_LABELS: Record<Order['orderType'], string> = {
  affiliée:     'Affiliée',
  pub_shopping: 'Pub',
}

function fmtAmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function formatRange(range: DateRange): string {
  const f = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return `${f(range.start)} – ${f(range.end)}`
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Import modal types ───────────────────────────────────────────────────────

type ImportStep = 'idle' | 'preview' | 'importing' | 'done' | 'error'

type ImportPreview = {
  total: number
  newOrders: Order[]        // pas encore en base
  updatedOrders: Order[]    // déjà en base, seront écrasées
  intraDuplicates: number   // doublons intra-fichier ignorés
  dateMin: Date
  dateMax: Date
  skippedLines: number
  newMarques: number
  newProducts: number
  newRealisations: number
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Commandes() {
  // ── Period state ────────────────────────────────────────────────────────────
  const [period, setPeriod]           = useState<Period>('ce_mois')
  const [customRange, setCustomRange] = useState<DateRange | null>(null)
  const [pickerOpen, setPickerOpen]   = useState(false)

  // ── Derived date range ──────────────────────────────────────────────────────
  const { start, end } = useMemo(() => {
    if (customRange) return { start: customRange.start, end: customRange.end }
    return periodBounds(period, new Date())
  }, [period, customRange])

  // ── Filter & sort state ─────────────────────────────────────────────────────
  const [sortKey, setSortKey]             = useState<'date' | 'price' | 'commission'>('date')
  const [sortDir, setSortDir]             = useState<'asc' | 'desc'>('desc')
  const [filterStatuts, setFilterStatuts] = useState<Set<Order['status']>>(new Set())
  const [filterTypes, setFilterTypes]     = useState<Set<Order['orderType']>>(new Set())

  // ── Orders : paginés sans filtre, complets avec filtre ──────────────────────
  const { orders, loading, loadingMore, hasMore, loadMore } = useOrdersPaginated(start, end, filterStatuts, filterTypes)

  // ── Server-side aggregates (vrais totaux, indépendants de la pagination) ────
  const { data: agg, loading: aggLoading } = useOrdersAggregates(start, end)

  // ── Import state ────────────────────────────────────────────────────────────
  const fileInputRef                    = useRef<HTMLInputElement>(null)
  const [importStep, setImportStep]     = useState<ImportStep>('idle')
  const [preview, setPreview]           = useState<ImportPreview | null>(null)
  const [importProgress, setProgress]   = useState({ done: 0, total: 0 })
  const [importResult, setImportResult] = useState<{ written: number; updated: number; newMarques: number; newProducts: number; newRealisations: number } | null>(null)
  const [importError, setImportError]   = useState<string | null>(null)
  const [checking, setChecking]         = useState(false)   // vérification IDs en cours
  const [syncStep, setSyncStep]         = useState('')      // message d'étape lors du sync entités

  // Le filtrage est fait dans le hook (Firestore côté serveur pour la date,
  // client-side pour statut/type sur le résultat déjà réduit)
  const sorted = useMemo(() => {
    return [...orders].sort((a, b) => {
      let diff = 0
      if (sortKey === 'date')       diff = a.date.getTime() - b.date.getTime()
      if (sortKey === 'price')      diff = a.price - b.price
      if (sortKey === 'commission') diff = (a.commissionStandard + a.commissionPub) - (b.commissionStandard + b.commissionPub)
      return sortDir === 'desc' ? -diff : diff
    })
  }, [orders, sortKey, sortDir])

  // Totaux agrégés — viennent du serveur, indépendants de la pagination
  const totalCA    = agg?.totalCA ?? 0
  const totalComm  = agg?.totalCommissions ?? 0
  const réglées    = agg?.réglées   ?? 0
  const enAttente  = agg?.enAttente ?? 0
  const ineligibles = agg?.ineligibles ?? 0

  // ── Handlers ────────────────────────────────────────────────────────────────

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  function selectPeriod(p: Period) {
    setPeriod(p)
    setCustomRange(null)
    setPickerOpen(false)
  }

  function toggleStatut(s: Order['status']) {
    setFilterStatuts((prev) => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }

  function toggleType(t: Order['orderType']) {
    setFilterTypes((prev) => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const isXlsx = file.name.toLowerCase().endsWith('.xlsx')
    const reader = new FileReader()

    reader.onload = async (ev) => {
      let parsed: ReturnType<typeof parseTikTokCSV>['orders']
      let skipped: number

      if (isXlsx) {
        const result = await parseTikTokXLSX(ev.target?.result as ArrayBuffer)
        parsed  = result.orders
        skipped = result.skipped
      } else {
        const result = parseTikTokCSV(ev.target?.result as string)
        parsed  = result.orders
        skipped = result.skipped
      }

      // Dédoublonnage intra-CSV (même ID qui apparaît plusieurs fois dans le fichier)
      const seen = new Set<string>()
      const deduped = parsed.filter((o) => {
        if (seen.has(o.id)) return false
        seen.add(o.id)
        return true
      })
      const intraDuplicates = parsed.length - deduped.length

      // Vérification Firestore : quels IDs existent déjà en base ?
      setChecking(true)
      const existingInFirestore = await fsCheckExistingOrderIds(deduped.map((o) => o.id))

      const newOrders     = deduped.filter((o) => !existingInFirestore.has(o.id))
      const updatedOrders = deduped.filter((o) =>  existingInFirestore.has(o.id))

      // Dates calculées sur l'ensemble des commandes à écrire
      const allDates = deduped.map((o) => o.date.getTime())

      // Compter les nouvelles entités à créer (marques, produits, réalisations)
      const [marqueSnap, productSnap, realisationSnap] = await Promise.all([
        getDocs(collection(db, 'marques')),
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'realisations')),
      ])
      const existingMarqueNames = new Set(marqueSnap.docs.map((d) => (d.data().name as string).toLowerCase()))
      const existingProductNames = new Set(productSnap.docs.map((d) => (d.data().name as string).toLowerCase()))
      const existingRealisationUrls = new Set(
        realisationSnap.docs.map((d) => d.data().tiktokUrl as string | undefined).filter(Boolean)
      )

      const uniqueBoutiques = [...new Set(newOrders.map((o) => o.boutiqueName).filter(Boolean))]
      const newMarques = uniqueBoutiques.filter((n) => !existingMarqueNames.has(n.toLowerCase())).length

      const uniqueProductNames = [...new Set(newOrders.map((o) => o.productName).filter(Boolean))]
      const newProducts = uniqueProductNames.filter((n) => !existingProductNames.has(n.toLowerCase())).length

      const uniqueVideoUrls = [...new Set(newOrders.map((o) => o.videoUrl).filter(Boolean) as string[])]
      const newRealisations = uniqueVideoUrls.filter((u) => !existingRealisationUrls.has(u)).length

      setChecking(false)

      setPreview({
        total: parsed.length,
        newOrders,
        updatedOrders,
        intraDuplicates,
        dateMin: allDates.length ? new Date(Math.min(...allDates)) : new Date(),
        dateMax: allDates.length ? new Date(Math.max(...allDates)) : new Date(),
        skippedLines: skipped,
        newMarques,
        newProducts,
        newRealisations,
      })
      setImportStep('preview')
    }
    if (isXlsx) reader.readAsArrayBuffer(file)
    else reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }

  async function handleConfirmImport() {
    if (!preview) return
    setImportStep('importing')
    setSyncStep('')
    const allOrders = [...preview.newOrders, ...preview.updatedOrders]
    setProgress({ done: 0, total: allOrders.length })
    try {
      await fsBatchOrders(allOrders, (done, total) => {
        setProgress({ done, total })
      })
      // Sync entités uniquement sur les nouvelles commandes
      const sync = await fsSyncEntitiesFromOrders(preview.newOrders, (step) => setSyncStep(step))
      setSyncStep('')
      setImportResult({
        written: preview.newOrders.length,
        updated: preview.updatedOrders.length,
        newMarques: sync.newMarques,
        newProducts: sync.newProducts,
        newRealisations: sync.newRealisations,
      })
      setImportStep('done')
    } catch (err) {
      setImportError(String(err))
      setImportStep('error')
    }
  }

  function closeModal() {
    setImportStep('idle')
    setPreview(null)
    setProgress({ done: 0, total: 0 })
    setImportResult(null)
    setImportError(null)
    setSyncStep('')
  }

  // ── Mobile header actions ────────────────────────────────────────────────────

  const { setActions } = useMobileHeaderActions()

  useEffect(() => {
    setActions(
      <div className="flex items-center gap-1.5">
        {/* Import */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={checking}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand transition-all disabled:opacity-60"
        >
          {checking ? (
            <span className="w-3 h-3 border-2 border-slate-300 border-t-brand rounded-full animate-spin" />
          ) : (
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
              <path d="M9 12V3M5 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 15h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
          {checking ? 'Vérif…' : 'Importer'}
        </button>
        {/* Date picker */}
        <button
          onClick={() => setPickerOpen((o) => !o)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            pickerOpen
              ? 'bg-white border-brand/50 text-brand shadow-sm'
              : customRange
                ? 'bg-brand text-white border-brand shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-brand/40 hover:text-slate-800'
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
  }, [pickerOpen, customRange, period, checking])

  // ── Render ──────────────────────────────────────────────────────────────────

  const SortIcon = ({ k }: { k: typeof sortKey }) => (
    <span className={`ml-1 transition-opacity ${sortKey === k ? 'opacity-100' : 'opacity-30'}`}>
      {sortKey === k && sortDir === 'asc' ? '↑' : '↓'}
    </span>
  )

  const pct = importProgress.total > 0
    ? Math.round((importProgress.done / importProgress.total) * 100)
    : 0

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">

      {/* ── Import modal ─────────────────────────────────────────────────── */}
      {importStep !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md mx-4 p-6">

            {importStep === 'preview' && preview && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3 14l3-4 3 3 3-5 3 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 4h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Importer des commandes</h2>
                    <p className="text-xs text-slate-400">TikTok Shop CSV</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Commandes dans le fichier</span>
                      <span className="font-semibold text-slate-800">{preview.total.toLocaleString('fr-FR')}</span>
                    </div>
                    {preview.intraDuplicates > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Doublons intra-fichier ignorés</span>
                        <span className="text-slate-400">{preview.intraDuplicates.toLocaleString('fr-FR')}</span>
                      </div>
                    )}
                    {preview.skippedLines > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-500">Lignes illisibles</span>
                        <span className="text-amber-500">{preview.skippedLines}</span>
                      </div>
                    )}
                    <div className="h-px bg-slate-200 my-1" />
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-brand">Nouvelles commandes</span>
                      <span className="font-bold text-brand">+{preview.newOrders.length.toLocaleString('fr-FR')}</span>
                    </div>
                    {preview.updatedOrders.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-amber-600">Mises à jour (statut…)</span>
                        <span className="font-bold text-amber-600">↻ {preview.updatedOrders.length.toLocaleString('fr-FR')}</span>
                      </div>
                    )}
                  </div>

                  {preview.newOrders.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
                      <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                        <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                        <path d="M6 1v4M12 1v4M2 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span>Période : {fmtDate(preview.dateMin)} → {fmtDate(preview.dateMax)}</span>
                    </div>
                  )}

                  {/* Entités qui seront créées */}
                  {(preview.newMarques > 0 || preview.newProducts > 0 || preview.newRealisations > 0) && (
                    <div className="bg-brand/5 border border-brand/10 rounded-xl p-3.5 space-y-1.5">
                      <p className="text-xs font-semibold text-brand mb-2">Entités créées automatiquement</p>
                      {preview.newMarques > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Nouvelles marques</span>
                          <span className="font-semibold text-slate-700">+{preview.newMarques}</span>
                        </div>
                      )}
                      {preview.newProducts > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Nouveaux produits</span>
                          <span className="font-semibold text-slate-700">+{preview.newProducts}</span>
                        </div>
                      )}
                      {preview.newRealisations > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Nouvelles réalisations</span>
                          <span className="font-semibold text-slate-700">+{preview.newRealisations}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    disabled={preview.newOrders.length === 0 && preview.updatedOrders.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-40 disabled:cursor-default shadow-sm"
                  >
                    {preview.newOrders.length > 0 && preview.updatedOrders.length > 0
                      ? `+${preview.newOrders.length.toLocaleString('fr-FR')} / ↻${preview.updatedOrders.length.toLocaleString('fr-FR')}`
                      : preview.updatedOrders.length > 0
                        ? `Mettre à jour ${preview.updatedOrders.length.toLocaleString('fr-FR')} commande${preview.updatedOrders.length > 1 ? 's' : ''}`
                        : `Importer ${preview.newOrders.length.toLocaleString('fr-FR')} commande${preview.newOrders.length > 1 ? 's' : ''}`
                    }
                    <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </>
            )}

            {importStep === 'importing' && (
              <div className="text-center py-4">
                <div className="w-10 h-10 border-2 border-brand/30 border-t-brand rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-700 mb-1">
                  {syncStep || 'Import en cours…'}
                </p>
                {!syncStep && (
                  <>
                    <p className="text-xs text-slate-400 mb-4 tabular-nums">
                      {importProgress.done.toLocaleString('fr-FR')} / {importProgress.total.toLocaleString('fr-FR')} commandes
                    </p>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-brand h-2 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-brand font-semibold mt-2">{pct}%</p>
                  </>
                )}
              </div>
            )}

            {importStep === 'done' && importResult && (
              <>
                <div className="text-center py-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                    <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="7" stroke="#10b981" strokeWidth="1.8"/>
                      <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-base font-bold text-slate-900">Import terminé !</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {importResult.written > 0 && (
                      <>{importResult.written.toLocaleString('fr-FR')} nouvelle{importResult.written > 1 ? 's' : ''}</>
                    )}
                    {importResult.written > 0 && importResult.updated > 0 && ' · '}
                    {importResult.updated > 0 && (
                      <>{importResult.updated.toLocaleString('fr-FR')} mise{importResult.updated > 1 ? 's' : ''} à jour</>
                    )}
                  </p>
                </div>

                {(importResult.newMarques > 0 || importResult.newProducts > 0 || importResult.newRealisations > 0) && (
                  <div className="bg-slate-50 rounded-xl p-3.5 space-y-1.5 mb-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Entités créées</p>
                    {importResult.newMarques > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Marques</span>
                        <span className="font-semibold text-emerald-600">+{importResult.newMarques}</span>
                      </div>
                    )}
                    {importResult.newProducts > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Produits</span>
                        <span className="font-semibold text-emerald-600">+{importResult.newProducts}</span>
                      </div>
                    )}
                    {importResult.newRealisations > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Réalisations</span>
                        <span className="font-semibold text-emerald-600">+{importResult.newRealisations}</span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={closeModal}
                  className="w-full py-2 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
                >
                  Fermer
                </button>
              </>
            )}

            {importStep === 'error' && (
              <>
                <div className="text-center py-2 mb-5">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                    <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="7" stroke="#ef4444" strokeWidth="1.8"/>
                      <path d="M9 5.5v4M9 12v.5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-base font-bold text-slate-900">Erreur lors de l'import</p>
                  <p className="text-xs text-slate-400 mt-1 break-all">{importError}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Fermer
                </button>
              </>
            )}
          </div>
        </div>
      )}

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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ── Header — desktop uniquement ──────────────────────────────────── */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Commandes</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading
              ? 'Chargement…'
              : `${orders.length.toLocaleString('fr-FR')} commande${orders.length > 1 ? 's' : ''} chargée${orders.length > 1 ? 's' : ''}${hasMore ? ' (suite disponible)' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={checking}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand transition-all disabled:opacity-60"
          >
            {checking ? (
              <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-brand rounded-full animate-spin" />
            ) : (
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M9 12V3M5 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            )}
            {checking ? 'Vérification…' : 'Importer CSV / XLSX'}
          </button>
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
              {customRange
                ? formatRange(customRange)
                : PERIODS.find((p) => p.value === period)?.label ?? 'Période'}
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
      </div>

      {/* ── Summary chips ────────────────────────────────────────────────── */}
      {/* Mobile : grille 2×2 compacte */}
      <div className="grid grid-cols-2 gap-2 mb-4 md:hidden">
        <div className="bg-white border border-slate-100 rounded-xl px-3 py-2.5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-medium mb-0.5">CA réglé</p>
          {aggLoading ? <span className="w-16 h-4 bg-slate-100 rounded animate-pulse block" />
            : <span className="text-sm font-bold text-slate-800">{fmtAmt(totalCA)}</span>}
        </div>
        <div className="bg-white border border-slate-100 rounded-xl px-3 py-2.5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-medium mb-0.5">Commissions</p>
          {aggLoading ? <span className="w-16 h-4 bg-slate-100 rounded animate-pulse block" />
            : <span className="text-sm font-bold text-emerald-600">{fmtAmt(totalComm)}</span>}
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5 shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-emerald-600 font-medium">Réglées</p>
            {aggLoading ? <span className="w-8 h-4 bg-emerald-100 rounded animate-pulse block" />
              : <span className="text-sm font-bold text-emerald-700">{réglées.toLocaleString('fr-FR')}</span>}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] text-amber-600 font-medium">En attente</p>
            {aggLoading ? <span className="w-8 h-4 bg-amber-100 rounded animate-pulse block" />
              : <span className="text-sm font-bold text-amber-700">{enAttente.toLocaleString('fr-FR')}</span>}
          </div>
        </div>
      </div>
      {/* Desktop : chips en ligne */}
      <div className="hidden md:flex flex-wrap gap-3 mb-5">
        <div className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">CA réglé</span>
          {aggLoading ? <span className="w-20 h-4 bg-slate-100 rounded animate-pulse" />
            : <span className="text-sm font-bold text-slate-800">{fmtAmt(totalCA)}</span>}
        </div>
        <div className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Commissions</span>
          {aggLoading ? <span className="w-20 h-4 bg-slate-100 rounded animate-pulse" />
            : <span className="text-sm font-bold text-emerald-600">{fmtAmt(totalComm)}</span>}
        </div>
        <div className="w-px self-stretch bg-slate-200 mx-1" />
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-xs text-emerald-600 font-medium">Réglées</span>
          {aggLoading ? <span className="w-8 h-4 bg-emerald-100 rounded animate-pulse" />
            : <span className="text-sm font-bold text-emerald-700">{réglées.toLocaleString('fr-FR')}</span>}
        </div>
        {(aggLoading || enAttente > 0) && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <span className="text-xs text-amber-600 font-medium">En attente</span>
            {aggLoading ? <span className="w-8 h-4 bg-amber-100 rounded animate-pulse" />
              : <span className="text-sm font-bold text-amber-700">{enAttente.toLocaleString('fr-FR')}</span>}
          </div>
        )}
        {(aggLoading || ineligibles > 0) && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-400 font-medium">Inéligibles</span>
            {aggLoading ? <span className="w-8 h-4 bg-slate-100 rounded animate-pulse" />
              : <span className="text-sm font-bold text-slate-500">{ineligibles.toLocaleString('fr-FR')}</span>}
          </div>
        )}
      </div>

      {/* ── Filters — scroll horizontal sur mobile ───────────────────────── */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex-shrink-0">Statut</span>
        {(['Réglée', 'En attente', 'Inéligible'] as Order['status'][]).map((s) => {
          const active = filterStatuts.has(s)
          const cls = {
            'Réglée':     active ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-600 border-slate-200',
            'En attente': active ? 'bg-amber-400 text-white border-amber-400'     : 'bg-white text-slate-600 border-slate-200',
            'Inéligible': active ? 'bg-slate-400 text-white border-slate-400'     : 'bg-white text-slate-600 border-slate-200',
          }[s]
          return (
            <button key={s} onClick={() => toggleStatut(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${cls}`}>
              {s}
            </button>
          )
        })}
        <div className="w-px h-5 bg-slate-200 flex-shrink-0" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex-shrink-0">Type</span>
        {(['affiliée', 'pub_shopping'] as Order['orderType'][]).map((t) => {
          const active = filterTypes.has(t)
          const label = t === 'affiliée' ? 'Affiliée' : 'Pub Shopping'
          const cls = t === 'affiliée'
            ? active ? 'bg-blue-500 text-white border-blue-500'     : 'bg-white text-slate-600 border-slate-200'
            : active ? 'bg-violet-500 text-white border-violet-500' : 'bg-white text-slate-600 border-slate-200'
          return (
            <button key={t} onClick={() => toggleType(t)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${cls}`}>
              {label}
            </button>
          )
        })}
        {(filterStatuts.size > 0 || filterTypes.size > 0) && (
          <button onClick={() => { setFilterStatuts(new Set()); setFilterTypes(new Set()) }}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-100 transition-all">
            Réinitialiser
          </button>
        )}
      </div>

      {/* ── Cards mobile ─────────────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col gap-2 mb-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-brand rounded-full animate-spin" />
            <span className="text-sm">Chargement…</span>
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-center py-12 text-sm text-slate-400">Aucune commande sur cette période</p>
        ) : (
          sorted.map((order) => {
            const comm = order.commissionStandard + order.commissionPub
            return (
              <div key={order.id} className="bg-white border border-slate-100 rounded-2xl px-4 py-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{order.productName}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{order.boutiqueName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${TYPE_STYLES[order.orderType]}`}>
                      {TYPE_LABELS[order.orderType]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-50">
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {order.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 tabular-nums">{fmtAmt(order.price)}</span>
                    <span className={`text-xs font-semibold tabular-nums ${comm > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {fmtAmt(comm)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Table desktop ────────────────────────────────────────────────── */}
      <div className="hidden md:block bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-brand rounded-full animate-spin" />
            <span className="text-sm">Chargement des commandes…</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th onClick={() => toggleSort('date')}
                  className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-600 select-none">
                  Date <SortIcon k="date" />
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Produit</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Boutique</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Statut</th>
                <th onClick={() => toggleSort('price')}
                  className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-600 select-none">
                  Prix <SortIcon k="price" />
                </th>
                <th onClick={() => toggleSort('commission')}
                  className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide cursor-pointer hover:text-slate-600 select-none">
                  Commission <SortIcon k="commission" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                    Aucune commande sur cette période
                  </td>
                </tr>
              ) : (
                sorted.map((order, i) => {
                  const comm = order.commissionStandard + order.commissionPub
                  return (
                    <tr key={order.id}
                      className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${i === sorted.length - 1 ? 'border-none' : ''}`}>
                      <td className="px-5 py-3 text-slate-500 tabular-nums whitespace-nowrap">
                        {order.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3 text-slate-800 font-medium max-w-[220px] truncate" title={order.productName}>
                        {order.productName}
                      </td>
                      <td className="px-5 py-3 text-slate-500 max-w-[160px] truncate">
                        {order.boutiqueName}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${TYPE_STYLES[order.orderType]}`}>
                          {TYPE_LABELS[order.orderType]}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-slate-700 font-medium">
                        {fmtAmt(order.price)}
                      </td>
                      <td className={`px-5 py-3 text-right tabular-nums font-semibold ${comm > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {fmtAmt(comm)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Footer: compteur + charger plus ──────────────────────────────── */}
      {!loading && sorted.length > 0 && (
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-slate-400">
            {sorted.length.toLocaleString('fr-FR')} commande{sorted.length > 1 ? 's' : ''} affichée{sorted.length > 1 ? 's' : ''}
          </p>
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand transition-all disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-brand rounded-full animate-spin" />
                  Chargement…
                </>
              ) : (
                <>
                  Charger 50 de plus
                  <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                    <path d="M9 4v10M4 10l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
