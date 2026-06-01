import { useEffect, useMemo, useState } from 'react'
import type { Realisation, RealisationStatus, Product } from '../types/realisation'
import { STATUS_LABELS } from '../types/realisation'
import type { Rush } from '../types/rush'

type StatusFilter = RealisationStatus | 'all'
import ViewSwitcher, { type ViewType } from '../components/realisation/ViewSwitcher'
import ListView from '../components/realisation/ListView'
import KanbanView from '../components/realisation/KanbanView'
import CardsView from '../components/realisation/CardsView'
import RealisationPanel from '../components/realisation/RealisationPanel'

type Props = {
  rushes: Rush[]
  onAddRush: (rush: Rush) => void
  realisations: Realisation[]
  products: Product[]
  onUpdate: (updated: Realisation) => void
  onStatusChange: (id: string, status: RealisationStatus) => void
  onNew: () => void
  initialSelectedId?: string | null
  onInitialSelectionConsumed?: () => void
}

export default function RealisationPage({
  rushes,
  onAddRush,
  realisations,
  products,
  onUpdate,
  onStatusChange,
  onNew,
  initialSelectedId,
  onInitialSelectionConsumed,
}: Props) {
  const [activeView, setActiveView] = useState<ViewType>('list')
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null)
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all')
  const [filterProduct, setFilterProduct] = useState<string>('all')

  useEffect(() => {
    if (initialSelectedId) {
      setSelectedId(initialSelectedId)
      onInitialSelectionConsumed?.()
    }
  }, []) // Only on mount

  const selected = realisations.find((r) => r.id === selectedId) ?? null

  // Produits présents dans les réalisations (pour le select)
  const usedProducts = useMemo(() => {
    const ids = new Set(realisations.map((r) => r.productId))
    return products.filter((p) => ids.has(p.id))
  }, [realisations, products])

  const filtered = useMemo(() => {
    return realisations.filter((r) => {
      if (filterStatus !== 'all' && r.status !== filterStatus) return false
      if (filterProduct !== 'all' && r.productId !== filterProduct) return false
      return true
    })
  }, [realisations, filterStatus, filterProduct])

  const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'a_tourner', label: STATUS_LABELS.a_tourner },
    { value: 'script', label: STATUS_LABELS.script },
    { value: 'a_monter', label: STATUS_LABELS.a_monter },
    { value: 'a_publier', label: STATUS_LABELS.a_publier },
    { value: 'publiee', label: STATUS_LABELS.publiee },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Réalisation</h1>
          <p className="text-sm text-slate-400 mt-0.5">{realisations.length} vidéos</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
          <button
            onClick={onNew}
            className="flex items-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Nouvelle vidéo
          </button>
        </div>
      </div>

      {activeView === 'list' && (
        <>
          {/* Filtres */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
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

            {/* Filtre produit */}
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50 shadow-sm cursor-pointer"
            >
              <option value="all">Tous les produits</option>
              {usedProducts.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Compteur résultats */}
            {(filterStatus !== 'all' || filterProduct !== 'all') && (
              <span className="text-xs text-slate-400 font-medium">
                {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
              </span>
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
      />
    </div>
  )
}
