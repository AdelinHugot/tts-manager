import { useEffect, useRef, useState } from 'react'
import type { Rush } from '../../types/rush'
import type { Realisation } from '../../types/realisation'
import { formatDuration, formatSize, friendlyName } from '../../utils/videoMetadata'

// Affiche la miniature d'un rush : image si dispo, sinon première frame lazy-loadée
function RushThumbnail({ rush }: { rush: Rush }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const isStorageUrl = rush.url && !rush.url.startsWith('blob:') && !rush.url.startsWith('data:')
  const hasImg = rush.thumbnailUrl && !rush.thumbnailUrl.startsWith('blob:')

  useEffect(() => {
    if (hasImg || !isStorageUrl) return // Pas besoin d'observer
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { rootMargin: '100px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasImg, isStorageUrl])

  if (hasImg) {
    return (
      <img
        src={rush.thumbnailUrl}
        alt=""
        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-100"
      />
    )
  }

  if (isStorageUrl) {
    return (
      <div ref={containerRef} className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
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
            <div className="w-3 h-3 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
      <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6"/>
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
  onDelete: (rushId: string) => void
  onEnterSelectionMode: (rushId: string) => void
  onToggleSelect: (rushId: string) => void
}

const LONG_PRESS_MS = 500

export default function RushsListView({
  rushes, realisations, selectionMode, selectedIds,
  onSelect, onDelete, onEnterSelectionMode, onToggleSelect,
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

  function handleRowClick(rush: Rush) {
    if (selectionMode) {
      onToggleSelect(rush.id)
    } else {
      onSelect(rush)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <table className="w-full text-sm table-fixed">
        <thead>
          <tr className="border-b border-slate-100">
            {selectionMode && <th className="w-10 px-3 py-3.5" />}
            <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Rush</th>
            <th className="w-14 text-left px-2 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Durée</th>
            <th className="hidden md:table-cell w-20 text-left px-2 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Taille</th>
            <th className="hidden sm:table-cell w-20 text-left px-2 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Statut</th>
            {!selectionMode && <th className="w-10 px-3 py-3.5" />}
          </tr>
        </thead>
        <tbody>
          {rushes.map((rush) => {
            const isSelected = selectedIds.has(rush.id)
            return (
              <tr
                key={rush.id}
                onClick={() => handleRowClick(rush)}
                onPointerDown={() => { if (!selectionMode) startPress(rush.id) }}
                onPointerUp={cancelPress}
                onPointerLeave={cancelPress}
                onPointerMove={() => { movedRef.current = true; cancelPress() }}
                className={`border-b border-slate-50 last:border-0 cursor-pointer transition-colors group select-none ${
                  isSelected && selectionMode
                    ? 'bg-brand/5 hover:bg-brand/8'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                {/* Checkbox */}
                {selectionMode && (
                  <td className="px-3 py-3.5">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-brand border-brand' : 'border-slate-300'
                    }`}>
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </td>
                )}

                {/* Rush — thumbnail + nom */}
                <td className="px-4 py-3.5 min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <RushThumbnail rush={rush} />
                    <span className="font-medium text-slate-800 group-hover:text-brand transition-colors truncate">
                      {friendlyName(rush.name)}
                    </span>
                  </div>
                </td>

                {/* Durée */}
                <td className="px-2 py-3.5 text-slate-500 tabular-nums whitespace-nowrap text-xs">
                  {formatDuration(rush.duration)}
                </td>

                {/* Taille — masqué sur mobile */}
                <td className="hidden md:table-cell px-2 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                  {formatSize(rush.size)}
                </td>

                {/* Statut — masqué sur très petit écran */}
                <td className="hidden sm:table-cell px-2 py-3.5">
                  {linkedIds.has(rush.id) ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      Lié
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>

                {/* Supprimer — masqué en mode sélection */}
                {!selectionMode && (
                  <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onDelete(rush.id)}
                      title="Supprimer"
                      className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded opacity-0 group-hover:opacity-100"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 3.5h10M5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 7a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
