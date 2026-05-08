import { useState } from 'react'
import type { Realisation, RealisationStatus } from '../types/realisation'
import { MOCK_REALISATIONS, MOCK_PRODUCTS } from '../data/mock'
import ViewSwitcher, { type ViewType } from '../components/realisation/ViewSwitcher'
import ListView from '../components/realisation/ListView'
import KanbanView from '../components/realisation/KanbanView'
import CardsView from '../components/realisation/CardsView'
import RealisationPanel from '../components/realisation/RealisationPanel'

export default function RealisationPage() {
  const [realisations, setRealisations] = useState<Realisation[]>(MOCK_REALISATIONS)
  const [activeView, setActiveView] = useState<ViewType>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = realisations.find((r) => r.id === selectedId) ?? null

  function handleUpdate(updated: Realisation) {
    setRealisations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
  }

  function handleStatusChange(id: string, status: RealisationStatus) {
    setRealisations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
  }

  function handleNew() {
    const newReal: Realisation = {
      id: crypto.randomUUID(),
      title: 'Nouvelle réalisation',
      status: 'a_tourner',
      productId: MOCK_PRODUCTS[0].id,
      publishDate: null,
      notes: '',
      rushes: [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    setRealisations((prev) => [newReal, ...prev])
    setSelectedId(newReal.id)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Réalisation</h1>
          <p className="text-sm text-slate-400 mt-0.5">{realisations.length} vidéos</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Nouvelle vidéo
          </button>
        </div>
      </div>

      {/* Views */}
      {activeView === 'list' && (
        <ListView
          realisations={realisations}
          products={MOCK_PRODUCTS}
          onSelect={(r) => setSelectedId(r.id)}
        />
      )}
      {activeView === 'kanban' && (
        <KanbanView
          realisations={realisations}
          products={MOCK_PRODUCTS}
          onSelect={(r) => setSelectedId(r.id)}
          onStatusChange={handleStatusChange}
        />
      )}
      {activeView === 'cards' && (
        <CardsView
          realisations={realisations}
          products={MOCK_PRODUCTS}
          onSelect={(r) => setSelectedId(r.id)}
        />
      )}

      {/* Side panel */}
      <RealisationPanel
        realisation={selected}
        products={MOCK_PRODUCTS}
        onClose={() => setSelectedId(null)}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
