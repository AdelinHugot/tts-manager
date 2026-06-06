import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import { MobileHeaderProvider, useMobileHeaderActions } from '../../context/MobileHeaderContext'
import { SkeletonAppLayout } from '../ui/Skeleton'
import Dashboard from '../../pages/Dashboard'
import Analytics from '../../pages/Analytics'
import RealisationPage from '../../pages/Realisation'
import Produits from '../../pages/Produits'
import Parametres from '../../pages/Parametres'
import RushsPage from '../../pages/Rushs'
import Ideas from '../../pages/Ideas'
import Commandes from '../../pages/Commandes'
import type { Realisation, RealisationStatus, Product } from '../../types/realisation'
import type { Rush } from '../../types/rush'
import { useRealisations, useRushes, useProducts, useOrders, useMarques } from '../../hooks/useFirestore'
import {
  fsAddRealisation,
  fsUpdateRealisation,
  fsDeleteRealisation,
  fsAddRush,
  fsDeleteRush,
} from '../../lib/firestore'
import { deleteRushVideo } from '../../lib/storage'


export default function AppLayout() {
  const [activePage, setActivePage] = useState('dashboard')
  const [pendingRealisationId, setPendingRealisationId] = useState<string | null>(null)
  const [showMore, setShowMore] = useState(false)

  const { data: realisations, loading: realisationsLoading } = useRealisations()
  const { data: rushes, loading: rushesLoading } = useRushes()
  const { data: products, loading: productsLoading } = useProducts()
  const { data: orders, loading: ordersLoading } = useOrders()
  const { data: marques } = useMarques()

  const loading = realisationsLoading || rushesLoading || productsLoading || ordersLoading

  // ─── Rushs ──────────────────────────────────────────────────────────────────

  async function handleAddRush(rush: Rush) {
    await fsAddRush(rush)
  }

  async function handleDeleteRush(rushId: string) {
    // Supprimer le fichier dans Firebase Storage (silencieux si blob URL ou déjà supprimé)
    const rush = rushes.find((r) => r.id === rushId)
    if (rush?.url) await deleteRushVideo(rush.url)

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

  async function handleDeleteRealisation(id: string) {
    await fsDeleteRealisation(id)
  }

  async function handleRealisationStatusChange(id: string, status: RealisationStatus) {
    await fsUpdateRealisation(id, { status })
  }

  async function handleNewRealisation(rushIds?: string[], title?: string) {
    const newReal: Omit<Realisation, 'id'> = {
      title: title ?? 'Nouvelle réalisation',
      status: 'a_tourner',
      productId: products[0]?.id ?? '',
      publishDate: null,
      notes: '',
      rushIds: rushIds?.length ? rushIds : [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    const id = await fsAddRealisation(newReal)
    setPendingRealisationId(id)
    if (rushIds?.length) setActivePage('realisation')
  }

  // ─── Products ────────────────────────────────────────────────────────────────

  // Products are managed inside Produits page via its own Firestore calls

  if (loading) return <SkeletonAppLayout />

  const PAGE_TITLES: Record<string, string> = {
    dashboard:   'Dashboard',
    analytics:   'Analytics',
    realisation: 'Vidéos',
    commandes:   'Commandes',
    ideas:       'Idées',
    rushs:       'Rushs',
    produits:    'Produits',
    parametres:  'Paramètres',
  }

  return (
    <MobileHeaderProvider>
      <AppLayoutInner
        activePage={activePage}
        setActivePage={setActivePage}
        showMore={showMore}
        setShowMore={setShowMore}
        PAGE_TITLES={PAGE_TITLES}
        rushes={rushes}
        realisations={realisations}
        products={products}
        orders={orders}
        marques={marques}
        pendingRealisationId={pendingRealisationId}
        setPendingRealisationId={setPendingRealisationId}
        handleAddRush={handleAddRush}
        handleDeleteRush={handleDeleteRush}
        handleLinkRush={handleLinkRush}
        handleRealisationUpdate={handleRealisationUpdate}
        handleDeleteRealisation={handleDeleteRealisation}
        handleRealisationStatusChange={handleRealisationStatusChange}
        handleNewRealisation={handleNewRealisation}
      />
    </MobileHeaderProvider>
  )
}

function AppLayoutInner({
  activePage, setActivePage, showMore, setShowMore, PAGE_TITLES,
  rushes, realisations, products, orders, marques,
  pendingRealisationId, setPendingRealisationId,
  handleAddRush, handleDeleteRush, handleLinkRush,
  handleRealisationUpdate, handleDeleteRealisation, handleRealisationStatusChange, handleNewRealisation,
}: {
  activePage: string
  setActivePage: (p: string) => void
  showMore: boolean
  setShowMore: (v: boolean | ((prev: boolean) => boolean)) => void
  PAGE_TITLES: Record<string, string>
  rushes: Rush[]
  realisations: Realisation[]
  products: Product[]
  orders: ReturnType<typeof useOrders>['data']
  marques: ReturnType<typeof useMarques>['data']
  pendingRealisationId: string | null
  setPendingRealisationId: (id: string | null) => void
  handleAddRush: (rush: Rush) => Promise<void>
  handleDeleteRush: (id: string) => Promise<void>
  handleLinkRush: (realisationId: string, rushId: string) => Promise<void>
  handleRealisationUpdate: (updated: Realisation) => Promise<void>
  handleDeleteRealisation: (id: string) => Promise<void>
  handleRealisationStatusChange: (id: string, status: RealisationStatus) => Promise<void>
  handleNewRealisation: (rushIds?: string[], title?: string) => Promise<void>
}) {
  const { actions: headerActions } = useMobileHeaderActions()

  return (
    <div className="flex h-screen bg-[#F4F6FA]">
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
      </div>

      {/* Header fixe mobile — toujours sous le Dynamic Island */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-30 bg-[#F4F6FA]/95 backdrop-blur-md border-b border-slate-200/60"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="h-12 flex items-center justify-between px-4">
          <span className="text-[17px] font-semibold text-slate-900 tracking-tight">
            {PAGE_TITLES[activePage] ?? 'TTS Manager'}
          </span>
          {headerActions && (
            <div className="flex items-center gap-1.5">
              {headerActions}
            </div>
          )}
        </div>
      </div>

      <main
        className="flex-1 overflow-auto h-full
                   pt-[calc(env(safe-area-inset-top)+3rem)] md:pt-0
                   pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="h-full"
          >
            {activePage === 'dashboard' && (
              <Dashboard realisations={realisations} products={products} orders={orders} />
            )}
            {activePage === 'analytics' && (
              <Analytics orders={orders} realisations={realisations} products={products} />
            )}
            {activePage === 'commandes' && <Commandes />}
            {activePage === 'realisation' && (
              <RealisationPage
                rushes={rushes}
                onAddRush={handleAddRush}
                realisations={realisations}
                products={products}
                marques={marques}
                onUpdate={handleRealisationUpdate}
                onStatusChange={handleRealisationStatusChange}
                onDelete={handleDeleteRealisation}
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
                onCreateRealisation={(rushIds) => handleNewRealisation(rushIds)}
              />
            )}
            {activePage === 'ideas' && (
              <Ideas
                onConvertToVideo={async (title) => {
                  await handleNewRealisation(undefined, title)
                  setActivePage('realisation')
                }}
              />
            )}
            {activePage === 'produits' && <Produits />}
            {activePage === 'parametres' && <Parametres />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom nav — mobile only */}
      <div className="md:hidden">
        <BottomNav
          activePage={activePage}
          onNavigate={setActivePage}
          showMore={showMore}
          onToggleMore={() => setShowMore((v) => !v)}
          onNewVideo={() => { handleNewRealisation(); setActivePage('realisation') }}
        />
      </div>
    </div>
  )
}
