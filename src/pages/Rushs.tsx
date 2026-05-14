import { useRef, useState } from 'react'
import type { Rush } from '../types/rush'
import type { Realisation } from '../types/realisation'
import ViewSwitcher, { type ViewType } from '../components/realisation/ViewSwitcher'
import RushsListView from '../components/rushs/RushsListView'
import RushsCardsView from '../components/rushs/RushsCardsView'
import RushPanel from '../components/rushs/RushPanel'
import { extractVideoMetadata } from '../utils/videoMetadata'

type Props = {
  rushes: Rush[]
  realisations: Realisation[]
  onAddRush: (rush: Rush) => void
  onDeleteRush: (rushId: string) => void
  onLinkRush: (realisationId: string, rushId: string) => void
  onCreateRealisation: (rushId: string) => void
}

const RUSH_VIEWS: ViewType[] = ['list', 'cards']

export default function RushsPage({
  rushes,
  realisations,
  onAddRush,
  onDeleteRush,
  onLinkRush,
  onCreateRealisation,
}: Props) {
  const [activeView, setActiveView] = useState<ViewType>('list')
  const [selectedRush, setSelectedRush] = useState<Rush | null>(null)
  const [pageDragging, setPageDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(fileList: FileList) {
    setProcessing(true)
    const files = Array.from(fileList)
    await Promise.all(
      files.map(async (f) => {
        const { duration, thumbnailUrl } = await extractVideoMetadata(f)
        onAddRush({
          id: crypto.randomUUID(),
          name: f.name,
          url: URL.createObjectURL(f),
          size: f.size,
          duration,
          thumbnailUrl,
        })
      })
    )
    setProcessing(false)
  }

  function handlePageDrop(e: React.DragEvent) {
    e.preventDefault()
    setPageDragging(false)
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      className={`p-8 max-w-7xl mx-auto min-h-screen transition-colors ${
        pageDragging ? 'bg-brand/5' : ''
      }`}
      onDragOver={(e) => { e.preventDefault(); setPageDragging(true) }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPageDragging(false)
        }
      }}
      onDrop={handlePageDrop}
    >
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
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
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="video/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      </div>

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
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 text-3xl mb-4">
            ▶
          </div>
          <p className="text-slate-500 font-medium">Aucun rush pour l'instant</p>
          <p className="text-slate-400 text-sm mt-1">Dépose tes rushs ici ou clique sur "Ajouter des rushs"</p>
        </div>
      ) : activeView === 'list' ? (
        <RushsListView
          rushes={rushes}
          realisations={realisations}
          onSelect={setSelectedRush}
          onDelete={onDeleteRush}
        />
      ) : (
        <RushsCardsView
          rushes={rushes}
          realisations={realisations}
          onSelect={setSelectedRush}
        />
      )}

      {/* Rush panel */}
      <RushPanel
        rush={selectedRush}
        realisations={realisations}
        onClose={() => setSelectedRush(null)}
        onDelete={(rushId) => {
          onDeleteRush(rushId)
          setSelectedRush(null)
        }}
        onCreateRealisation={(rushId) => {
          onCreateRealisation(rushId)
          setSelectedRush(null)
        }}
      />
    </div>
  )
}
