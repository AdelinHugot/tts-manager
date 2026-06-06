import { useEffect, useRef, useState } from 'react'
import type { Rush } from '../../types/rush'
import type { Realisation } from '../../types/realisation'
import { formatDuration, friendlyName } from '../../utils/videoMetadata'

function CardThumbnail({ rush }: { rush: Rush }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const isStorageUrl = rush.url && !rush.url.startsWith('blob:') && !rush.url.startsWith('data:')
  const hasImg = rush.thumbnailUrl && !rush.thumbnailUrl.startsWith('blob:')

  useEffect(() => {
    if (hasImg || !isStorageUrl) return
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { rootMargin: '150px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasImg, isStorageUrl])

  if (hasImg) {
    return <img src={rush.thumbnailUrl} alt="" className="w-full h-full object-cover" />
  }

  if (isStorageUrl) {
    return (
      <div ref={containerRef} className="w-full h-full bg-slate-900">
        {visible ? (
          <video
            src={`${rush.url}#t=0.001`}
            preload="metadata"
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
      <svg width="28" height="28" viewBox="0 0 18 18" fill="none" className="text-slate-400">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/>
        <polygon points="7.5,6.5 13,9 7.5,11.5" fill="currentColor"/>
      </svg>
    </div>
  )
}

type Props = {
  rushes: Rush[]
  realisations: Realisation[]
  selectionMode: boolean
  selectedIds: Set<string>
  onSelect: (rush: Rush) => void
  onEnterSelectionMode: (rushId: string) => void
  onToggleSelect: (rushId: string) => void
}

const LONG_PRESS_MS = 500

export default function RushsCardsView({
  rushes, realisations, selectionMode, selectedIds,
  onSelect, onEnterSelectionMode, onToggleSelect,
}: Props) {
  const linkedIds = new Set(realisations.flatMap((r) => r.rushIds))
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const movedRef = useRef(false)

  function startPress(rushId: string) {
    movedRef.current = false
    timerRef.current = setTimeout(() => {
      if (!movedRef.current) onEnterSelectionMode(rushId)
    }, LONG_PRESS_MS)
  }

  function cancelPress() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }

  function handleCardClick(rush: Rush) {
    if (selectionMode) {
      onToggleSelect(rush.id)
    } else {
      onSelect(rush)
    }
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3">
      {rushes.map((rush) => {
        const isSelected = selectedIds.has(rush.id)
        return (
          <article
            key={rush.id}
            role="article"
            draggable={!selectionMode}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/rush-id', rush.id)
              e.dataTransfer.effectAllowed = 'link'
            }}
            onClick={() => handleCardClick(rush)}
            onPointerDown={() => { if (!selectionMode) startPress(rush.id) }}
            onPointerUp={cancelPress}
            onPointerLeave={cancelPress}
            onPointerMove={() => { movedRef.current = true; cancelPress() }}
            className={`relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 cursor-pointer group transition-all select-none ${
              isSelected && selectionMode
                ? 'ring-2 ring-brand ring-offset-2'
                : 'hover:ring-2 hover:ring-brand/50'
            }`}
          >
            <CardThumbnail rush={rush} />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 pt-6">
              <p className="text-white text-xs font-medium truncate leading-tight">{friendlyName(rush.name)}</p>
              <p className="text-white/70 text-xs tabular-nums mt-0.5">{formatDuration(rush.duration)}</p>
            </div>

            {/* Dot lié — masqué si sélection */}
            {!selectionMode && linkedIds.has(rush.id) && (
              <div className="absolute top-2 right-2">
                <span className="w-2 h-2 rounded-full bg-brand block ring-2 ring-white" title="Lié à une réalisation" />
              </div>
            )}

            {/* Checkbox de sélection */}
            {selectionMode && (
              <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected ? 'bg-brand border-brand' : 'bg-white/80 border-slate-300'
              }`}>
                {isSelected && (
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            )}

            {/* Overlay de sélection */}
            {isSelected && selectionMode && (
              <div className="absolute inset-0 bg-brand/20" />
            )}
          </article>
        )
      })}
    </div>
  )
}
