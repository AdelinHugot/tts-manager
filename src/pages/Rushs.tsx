import { useCallback, useEffect, useRef, useState } from 'react'
import { useMobileHeaderActions } from '../context/MobileHeaderContext'
import type { Rush } from '../types/rush'
import type { Realisation } from '../types/realisation'
import ViewSwitcher, { type ViewType } from '../components/realisation/ViewSwitcher'
import RushsListView from '../components/rushs/RushsListView'
import RushsCardsView from '../components/rushs/RushsCardsView'
import RushPanel from '../components/rushs/RushPanel'
import { extractVideoMetadata, generateId } from '../utils/videoMetadata'
import { uploadRushVideo } from '../lib/storage'

type Props = {
  rushes: Rush[]
  realisations: Realisation[]
  onAddRush: (rush: Rush) => void | Promise<void>
  onDeleteRush: (rushId: string) => void
  onLinkRush?: (realisationId: string, rushId: string) => void
  onCreateRealisation: (rushIds: string[]) => void
}

const RUSH_VIEWS: ViewType[] = ['list', 'cards']

export default function RushsPage({
  rushes,
  realisations,
  onAddRush,
  onDeleteRush,
  onLinkRush: _onLinkRush,
  onCreateRealisation,
}: Props) {
  const [activeView, setActiveView] = useState<ViewType>('list')
  const [selectedRush, setSelectedRush] = useState<Rush | null>(null)
  const [pageDragging, setPageDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({}) // rushId → 0–100
  const [uploadError, setUploadError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Multi-select ────────────────────────────────────────────────────────────
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  function enterSelectionMode(rushId: string) {
    setSelectionMode(true)
    setSelectedIds(new Set([rushId]))
    setSelectedRush(null)
  }

  function toggleSelect(rushId: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(rushId)) next.delete(rushId)
      else next.add(rushId)
      return next
    })
  }

  function cancelSelection() {
    setSelectionMode(false)
    setSelectedIds(new Set())
  }

  function createFromSelection() {
    if (selectedIds.size === 0) return
    onCreateRealisation([...selectedIds])
    cancelSelection()
  }

  async function handleFiles(fileList: FileList) {
    if (!fileList.length) return
    setProcessing(true)
    setUploadError(null)
    const files = Array.from(fileList)
    try {
      // Upload en séquence pour ne pas saturer la connexion mobile
      for (const f of files) {
        const rushId = generateId()

        // 1. Extraire metadata (durée + thumbnail) depuis le fichier en mémoire
        const { duration, thumbnailUrl } = await extractVideoMetadata(f)

        // 2. Uploader la vidéo dans Firebase Storage avec progression
        setUploadProgress((prev) => ({ ...prev, [rushId]: 0 }))
        const url = await uploadRushVideo(rushId, f, (pct) => {
          setUploadProgress((prev) => ({ ...prev, [rushId]: pct }))
        })
        setUploadProgress((prev) => {
          const next = { ...prev }
          delete next[rushId]
          return next
        })

        // 3. Sauvegarder en Firestore avec l'URL permanente
        await onAddRush({
          id: rushId,
          name: f.name,
          url,
          size: f.size,
          duration,
          thumbnailUrl,
        })
      }
    } catch (err) {
      console.error('[Rush upload]', err)
      setUploadError("Erreur lors de l'upload. Vérifie ta connexion et réessaie.")
    } finally {
      setProcessing(false)
      setUploadProgress({})
    }
  }

  function handlePageDrop(e: React.DragEvent) {
    e.preventDefault()
    setPageDragging(false)
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  // ── Mobile header actions ───────────────────────────────────────────────────
  const { setActions } = useMobileHeaderActions()
  const handleViewChange = useCallback((v: ViewType) => setActiveView(v), [])
  useEffect(() => {
    if (selectionMode) {
      // En mode sélection, pas de bouton dans le header
      setActions(null)
      return () => setActions(null)
    }
    setActions(
      <div className="flex items-center gap-1.5">
        <ViewSwitcher activeView={activeView} onViewChange={handleViewChange} views={RUSH_VIEWS} />
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1 bg-brand text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-brand/90 transition-colors shadow-sm"
        >
          <span className="text-sm leading-none">+</span>
          Rush
        </button>
      </div>
    )
    return () => setActions(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, selectionMode])

  return (
    <div
      className={`p-4 md:p-8 max-w-7xl mx-auto min-h-screen transition-colors ${
        pageDragging ? 'bg-brand/5' : ''
      }`}
      onDragOver={(e) => { e.preventDefault(); setPageDragging(true) }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPageDragging(false)
      }}
      onDrop={handlePageDrop}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="video/mp4,video/quicktime,video/x-m4v,video/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {/* Page header — desktop uniquement */}
      <div className="hidden md:flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rushs</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {processing ? 'Traitement en cours…' : `${rushes.length} rush${rushes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} views={RUSH_VIEWS} />
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Ajouter des rushs
          </button>
        </div>
      </div>

      {/* Feedback upload */}
      {processing && (
        <div className="mb-4 px-4 py-3 bg-brand/5 border border-brand/20 rounded-xl text-sm text-brand font-medium space-y-2">
          {Object.keys(uploadProgress).length > 0 ? (
            Object.entries(uploadProgress).map(([id, pct]) => (
              <div key={id} className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span>Upload en cours…</span>
                    <span className="text-xs font-bold">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-brand/20 rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full transition-all duration-200" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin flex-shrink-0" />
              Traitement en cours…
            </div>
          )}
        </div>
      )}
      {uploadError && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M9 5.5v4M9 12v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          {uploadError}
          <button onClick={() => setUploadError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Drop overlay hint */}
      {pageDragging && (
        <div className="fixed inset-0 border-4 border-dashed border-brand/40 rounded-2xl pointer-events-none z-30 m-4 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 text-center shadow-xl">
            <p className="text-brand font-semibold text-lg">Dépose tes rushs ici</p>
            <p className="text-slate-400 text-sm mt-1">Fichiers vidéo acceptés</p>
          </div>
        </div>
      )}

      {/* Content */}
      {rushes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 text-3xl mb-4">▶</div>
          <p className="text-slate-500 font-medium">Aucun rush pour l'instant</p>
          <p className="text-slate-400 text-sm mt-1">Dépose tes rushs ici ou clique sur "Ajouter des rushs"</p>
        </div>
      ) : activeView === 'list' ? (
        <RushsListView
          rushes={rushes}
          realisations={realisations}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onSelect={setSelectedRush}
          onDelete={onDeleteRush}
          onEnterSelectionMode={enterSelectionMode}
          onToggleSelect={toggleSelect}
        />
      ) : (
        <RushsCardsView
          rushes={rushes}
          realisations={realisations}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onSelect={setSelectedRush}
          onEnterSelectionMode={enterSelectionMode}
          onToggleSelect={toggleSelect}
        />
      )}

      {/* Rush panel */}
      {!selectionMode && (
        <RushPanel
          rush={selectedRush}
          realisations={realisations}
          onClose={() => setSelectedRush(null)}
          onDelete={(rushId) => {
            onDeleteRush(rushId)
            setSelectedRush(null)
          }}
          onCreateRealisation={(rushId) => {
            onCreateRealisation([rushId])
            setSelectedRush(null)
          }}
        />
      )}

      {/* ── Floating multi-select action bar ── */}
      {selectionMode && (
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-6 inset-x-4 z-40 flex items-center justify-between bg-slate-900 text-white rounded-2xl px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">
              {selectedIds.size} rush{selectedIds.size > 1 ? 's' : ''}
            </span>
            <button
              onClick={cancelSelection}
              className="text-slate-400 hover:text-white text-xs transition-colors"
            >
              Annuler
            </button>
          </div>
          <button
            onClick={createFromSelection}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-1.5 bg-brand text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-40"
          >
            <span className="text-base leading-none">+</span>
            Nouvelle réalisation
          </button>
        </div>
      )}
    </div>
  )
}
