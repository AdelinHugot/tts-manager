import { useEffect, useState } from 'react'
import type { Realisation, RealisationStatus, Product } from '../types/realisation'
import type { Rush } from '../types/rush'
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

  useEffect(() => {
    if (initialSelectedId) {
      setSelectedId(initialSelectedId)
      onInitialSelectionConsumed?.()
    }
  }, []) // Only on mount

  const selected = realisations.find((r) => r.id === selectedId) ?? null

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
        <ListView realisations={realisations} products={products} onSelect={(r) => setSelectedId(r.id)} />
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
