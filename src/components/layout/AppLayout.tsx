import { useState } from 'react'
import Sidebar from './Sidebar'
import Dashboard from '../../pages/Dashboard'
import Analytics from '../../pages/Analytics'
import RealisationPage from '../../pages/Realisation'
import Produits from '../../pages/Produits'
import Parametres from '../../pages/Parametres'
import RushsPage from '../../pages/Rushs'
import Planning from '../../pages/Planning'
import Ideas from '../../pages/Ideas'
import type { Realisation, RealisationStatus } from '../../types/realisation'
import type { Rush } from '../../types/rush'
import { MOCK_REALISATIONS, MOCK_PRODUCTS, MOCK_RUSHES } from '../../data/mock'

export default function AppLayout() {
  const [activePage, setActivePage] = useState('realisation')
  const [rushes, setRushes] = useState<Rush[]>(MOCK_RUSHES)
  const [realisations, setRealisations] = useState<Realisation[]>(MOCK_REALISATIONS)
  const [pendingRealisationId, setPendingRealisationId] = useState<string | null>(null)

  function handleAddRush(rush: Rush) {
    setRushes((prev) => [...prev, rush])
  }

  function handleDeleteRush(rushId: string) {
    setRushes((prev) => prev.filter((r) => r.id !== rushId))
    setRealisations((prev) =>
      prev.map((r) => ({ ...r, rushIds: r.rushIds.filter((id) => id !== rushId) }))
    )
  }

  function handleLinkRush(realisationId: string, rushId: string) {
    setRealisations((prev) =>
      prev.map((r) =>
        r.id === realisationId && !r.rushIds.includes(rushId)
          ? { ...r, rushIds: [...r.rushIds, rushId] }
          : r
      )
    )
  }

  function handleRealisationUpdate(updated: Realisation) {
    setRealisations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
  }

  function handlePublishDateChange(id: string, date: string | null) {
    setRealisations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, publishDate: date } : r))
    )
  }

  function handleRealisationStatusChange(id: string, status: RealisationStatus) {
    setRealisations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  function handleNewRealisation(rushId?: string) {
    const newReal: Realisation = {
      id: crypto.randomUUID(),
      title: 'Nouvelle réalisation',
      status: 'a_tourner',
      productId: MOCK_PRODUCTS[0].id,
      publishDate: null,
      notes: '',
      rushIds: rushId ? [rushId] : [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    setRealisations((prev) => [newReal, ...prev])
    setPendingRealisationId(newReal.id)
    if (rushId) setActivePage('realisation')
  }

  return (
    <div className="flex h-screen bg-[#F4F6FA]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-auto h-full">
        {activePage === 'dashboard' && (
          <Dashboard realisations={realisations} products={MOCK_PRODUCTS} />
        )}
        {activePage === 'analytics' && <Analytics />}
        {activePage === 'realisation' && (
          <RealisationPage
            rushes={rushes}
            onAddRush={handleAddRush}
            realisations={realisations}
            products={MOCK_PRODUCTS}
            onUpdate={handleRealisationUpdate}
            onStatusChange={handleRealisationStatusChange}
            onNew={() => handleNewRealisation()}
            initialSelectedId={pendingRealisationId}
            onInitialSelectionConsumed={() => setPendingRealisationId(null)}
          />
        )}
        {activePage === 'rushs' && (
          <RushsPage
            rushes={rushes}
            realisations={realisations}
            onAddRush={handleAddRush}
            onDeleteRush={handleDeleteRush}
            onLinkRush={handleLinkRush}
            onCreateRealisation={(rushId) => handleNewRealisation(rushId)}
          />
        )}
        {activePage === 'ideas' && <Ideas />}
        {activePage === 'planning' && (
          <Planning
            realisations={realisations}
            products={MOCK_PRODUCTS}
            onPublishDateChange={handlePublishDateChange}
          />
        )}
        {activePage === 'produits' && <Produits />}
        {activePage === 'parametres' && <Parametres />}
      </main>
    </div>
  )
}
