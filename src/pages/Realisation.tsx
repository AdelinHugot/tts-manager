import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMobileHeaderActions } from '../context/MobileHeaderContext'
import type { Realisation, RealisationStatus, Product } from '../types/realisation'
import { STATUS_LABELS } from '../types/realisation'
import type { Rush } from '../types/rush'
import type { Marque } from '../types/marque'

type StatusFilter = RealisationStatus | 'all'
import ViewSwitcher, { type ViewType } from '../components/realisation/ViewSwitcher'
import ListView from '../components/realisation/ListView'
import KanbanView from '../components/realisation/KanbanView'
import CardsView from '../components/realisation/CardsView'
import RealisationPanel from '../components/realisation/RealisationPanel'
import FilterPicker from '../components/ui/FilterPicker'

type Props = {
  rushes: Rush[]
  onAddRush: (rush: Rush) => void
  realisations: Realisation[]
  products: Product[]
  marques: Marque[]
  onUpdate: (updated: Realisation) => void
  onStatusChange: (id: string, status: RealisationStatus) => void
  onDelete: (id: string) => void
  onNew: () => void
  initialSelectedId?: string | null
  onInitialSelectionConsumed?: () => void
}

export default function RealisationPage({
  rushes,
  onAddRush,
  realisations,
  products,
  marques,
  onUpdate,
  onStatusChange,
  onDelete,
  onNew,
  initialSelectedId,
  onInitialSelectionConsumed,
}: Props) {
  const [activeView, setActiveView] = useState<ViewType>('list')
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null)
  const [filterStatus, setFilterStatus]   = useState<StatusFilter>('all')
  const [filterMarque, setFilterMarque]   = useState<string>('all')
  const [filterProduct, setFilterProduct] = useState<string>('all')

  useEffect(() => {
    if (initialSelectedId) {
      setSelectedId(initialSelectedId)
      onInitialSelectionConsumed?.()
    }
  }, [initialSelectedId]) // eslint-disable-line

  const selected = realisations.find((r) => r.id === selectedId) ?? null

  // Quand on change de marque, reset le filtre produit si le produit sélectionné
  // n'appartient plus à la marque choisie
  useEffect(() => {
    if (filterMarque === 'all' || filterProduct === 'all') return
    const prod = products.find((p) => p.id === filterProduct)
    if (prod?.marqueId !== filterMarque) setFilterProduct('all')
  }, [filterMarque]) // eslint-disable-line

  // Marques présentes dans les réalisations
  const usedMarques = useMemo(() => {
    const productIds = new Set(realisations.map((r) => r.productId))
    const marqueIds  = new Set(
      products.filter((p) => productIds.has(p.id)).map((p) => p.marqueId).filter(Boolean)
    )
    return marques.filter((m) => marqueIds.has(m.id))
  }, [realisations, products, marques])

  // Produits filtrés par marque + présents dans les réalisations
  const usedProducts = useMemo(() => {
    const ids = new Set(realisations.map((r) => r.productId))
    return products.filter((p) => {
      if (!ids.has(p.id)) return false
      if (filterMarque !== 'all' && p.marqueId !== filterMarque) return false
      return true
    })
  }, [realisations, products, filterMarque])

  const filtered = useMemo(() => {
    return realisations.filter((r) => {
      if (filterStatus !== 'all' && r.status !== filterStatus) return false
      if (filterProduct !== 'all' && r.productId !== filterProduct) return false
      if (filterMarque !== 'all') {
        const prod = products.find((p) => p.id === r.productId)
        if (prod?.marqueId !== filterMarque) return false
      }
      return true
    })
  }, [realisations, filterStatus, filterProduct, filterMarque, products])

  const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
    { value: 'all',       label: 'Tous' },
    { value: 'a_tourner', label: STATUS_LABELS.a_tourner },
    { value: 'script',    label: STATUS_LABELS.script },
    { value: 'a_monter',  label: STATUS_LABELS.a_monter },
    { value: 'a_publier', label: STATUS_LABELS.a_publier },
    { value: 'publiee',   label: STATUS_LABELS.publiee },
  ]

  const hasFilters = filterStatus !== 'all' || filterMarque !== 'all' || filterProduct !== 'all'

  // ── Mobile header actions ─────────────────────────────────────────────────
  const { setActions } = useMobileHeaderActions()
  const handleViewChange = useCallback((v: ViewType) => setActiveView(v), [])
  useEffect(() => {
    setActions(
      <div className="flex items-center gap-1.5">
        <ViewSwitcher activeView={activeView} onViewChange={handleViewChange} />
        <button
          onClick={onNew}
          className="flex items-center gap-1 bg-brand text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-brand/90 transition-colors"
        >
          <span className="text-sm leading-none">+</span>
          <span>Vidéo</span>
        </button>
      </div>
    )
    return () => setActions(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView])

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="hidden md:flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Réalisation</h1>
          <p className="text-sm text-slate-400 mt-0.5">{realisations.length} vidéos</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
          <button
            onClick={onNew}
            className="flex items-center gap-1.5 bg-brand text-white text-sm font-medium px-3 py-2 md:px-4 md:py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            <span className="hidden sm:inline">Nouvelle vidéo</span>
          </button>
        </div>
      </div>

      {activeView === 'list' && (
        <>
          {/* Filtres */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
            {/* Filtre statut */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    filterStatus === f.value
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-slate-200 mx-0.5" />

            {/* Filtre marque */}
            <FilterPicker
              items={usedMarques.map((m) => ({ id: m.id, name: m.name }))}
              value={filterMarque}
              onChange={setFilterMarque}
              allLabel="Toutes les marques"
              placeholder="Chercher une marque…"
            />

            {/* Filtre produit */}
            <FilterPicker
              items={usedProducts.map((p) => ({ id: p.id, name: p.name }))}
              value={filterProduct}
              onChange={setFilterProduct}
              allLabel="Tous les produits"
              placeholder="Chercher un produit…"
            />

            {/* Compteur + reset */}
            {hasFilters && (
              <>
                <span className="text-xs text-slate-400 font-medium">
                  {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => { setFilterStatus('all'); setFilterMarque('all'); setFilterProduct('all') }}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold hover:bg-slate-100 px-2 py-1.5 rounded-lg transition-colors"
                >
                  Réinitialiser
                </button>
              </>
            )}
          </div>

          <ListView realisations={filtered} products={products} onSelect={(r) => setSelectedId(r.id)} />
        </>
      )}
      {activeView === 'kanban' && (
        <KanbanView
          realisations={realisations}
          products={products}
          onSelect={(r) => setSelectedId(r.id)}
          onStatusChange={onStatusChange}
        />
      )}
      {activeView === 'cards' && (
        <CardsView realisations={realisations} products={products} onSelect={(r) => setSelectedId(r.id)} />
      )}

      <RealisationPanel
        realisation={selected}
        products={products}
        rushes={rushes}
        onAddRush={onAddRush}
        onClose={() => setSelectedId(null)}
        onUpdate={onUpdate}
        onDelete={(id) => { onDelete(id); setSelectedId(null) }}
      />
    </div>
  )
}
