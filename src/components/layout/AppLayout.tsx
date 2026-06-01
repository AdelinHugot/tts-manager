import { useState } from 'react'
import Sidebar from './Sidebar'
import Dashboard from '../../pages/Dashboard'
import Analytics from '../../pages/Analytics'
import RealisationPage from '../../pages/Realisation'
import Produits from '../../pages/Produits'
import Parametres from '../../pages/Parametres'
import RushsPage from '../../pages/Rushs'
import Ideas from '../../pages/Ideas'
import type { Realisation, RealisationStatus, Product } from '../../types/realisation'
import type { Rush } from '../../types/rush'
import { useRealisations, useRushes, useProducts, useOrders } from '../../hooks/useFirestore'
import {
  fsAddRealisation,
  fsUpdateRealisation,
  fsAddRush,
  fsDeleteRush,
} from '../../lib/firestore'

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#F4F6FA]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Chargement…</p>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const [activePage, setActivePage] = useState('dashboard')
  const [pendingRealisationId, setPendingRealisationId] = useState<string | null>(null)

  const { data: realisations, loading: realisationsLoading } = useRealisations()
  const { data: rushes, loading: rushesLoading } = useRushes()
  const { data: products, loading: productsLoading } = useProducts()
  const { data: orders, loading: ordersLoading } = useOrders()

  const loading = realisationsLoading || rushesLoading || productsLoading || ordersLoading

  // ─── Rushs ──────────────────────────────────────────────────────────────────

  async function handleAddRush(rush: Rush) {
    await fsAddRush(rush)
  }

  async function handleDeleteRush(rushId: string) {
    await fsDeleteRush(rushId)
    // Unlink from all réalisations
    const linked = realisations.filter((r) => r.rushIds.includes(rushId))
    await Promise.all(
      linked.map((r) =>
        fsUpdateRealisation(r.id, { rushIds: r.rushIds.filter((id) => id !== rushId) })
      )
    )
  }

  async function handleLinkRush(realisationId: string, rushId: string) {
    const r = realisations.find((r) => r.id === realisationId)
    if (!r || r.rushIds.includes(rushId)) return
    await fsUpdateRealisation(realisationId, { rushIds: [...r.rushIds, rushId] })
  }

  // ─── Réalisations ────────────────────────────────────────────────────────────

  async function handleRealisationUpdate(updated: Realisation) {
    const { id, ...data } = updated
    await fsUpdateRealisation(id, data)
  }

  async function handlePublishDateChange(id: string, date: string | null) {
    await fsUpdateRealisation(id, { publishDate: date })
  }

  async function handleRealisationStatusChange(id: string, status: RealisationStatus) {
    await fsUpdateRealisation(id, { status })
  }

  async function handleNewRealisation(rushId?: string, title?: string) {
    const newReal: Omit<Realisation, 'id'> = {
      title: title ?? 'Nouvelle réalisation',
      status: 'a_tourner',
      productId: products[0]?.id ?? '',
      publishDate: null,
      notes: '',
      rushIds: rushId ? [rushId] : [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    const id = await fsAddRealisation(newReal)
    setPendingRealisationId(id)
    if (rushId) setActivePage('realisation')
  }

  // ─── Products ────────────────────────────────────────────────────────────────

  // Products are managed inside Produits page via its own Firestore calls

  if (loading) return <LoadingScreen />

  return (
    <div className="flex h-screen bg-[#F4F6FA]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-auto h-full">
        {activePage === 'dashboard' && (
          <Dashboard realisations={realisations} products={products} orders={orders} />
        )}
        {activePage === 'analytics' && <Analytics orders={orders} />}
        {activePage === 'realisation' && (
          <RealisationPage
            rushes={rushes}
            onAddRush={handleAddRush}
            realisations={realisations}
            products={products}
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
        {activePage === 'ideas' && (
          <Ideas
            onConvertToVideo={(title) => {
              handleNewRealisation(undefined, title)
              setActivePage('realisation')
            }}
          />
        )}
        {activePage === 'produits' && <Produits />}
        {activePage === 'parametres' && <Parametres />}
      </main>
    </div>
  )
}
