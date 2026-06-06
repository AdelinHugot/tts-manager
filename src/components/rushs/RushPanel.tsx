import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Rush } from '../../types/rush'
import type { Realisation } from '../../types/realisation'
import { formatDuration, formatSize, friendlyName } from '../../utils/videoMetadata'

type Props = {
  rush: Rush | null
  realisations: Realisation[]
  onClose: () => void
  onDelete: (rushId: string) => void
  onCreateRealisation: (rushId: string) => void
}

const RISKY_STATUSES = new Set(['a_tourner', 'script', 'a_monter'])

/** Lecteur vidéo avec frame de prévisualisation et fallback si URL expirée */
function VideoPreview({ url, maxHeight = '40vh' }: { url: string; maxHeight?: string }) {
  const [error, setError] = useState(false)
  // #t=0.001 force iOS Safari à charger et afficher la première frame
  const src = url ? `${url}#t=0.001` : ''

  if (!url) return null

  if (error) {
    return (
      <div className="w-full rounded-xl bg-slate-100 flex flex-col items-center justify-center gap-2 py-8 text-center px-4">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-lg">▶</div>
        <p className="text-xs text-slate-500 font-medium">Aperçu non disponible</p>
        <p className="text-[10px] text-slate-400">Rechargez la page ou ré-importez le fichier</p>
      </div>
    )
  }

  return (
    <video
      key={src}
      src={src}
      controls
      playsInline
      preload="metadata"
      onError={() => setError(true)}
      className="w-full rounded-xl bg-black"
      style={{ maxHeight, display: 'block' }}
    />
  )
}

export default function RushPanel({ rush, realisations, onClose, onDelete, onCreateRealisation }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  // ── Swipe-to-dismiss (drag handle only) ───────────────────────────────────
  const mobileSheetRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)

  const onHandleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const onHandleTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - touchStartY.current
    if (delta > 0 && mobileSheetRef.current) {
      mobileSheetRef.current.style.transform = `translateY(${delta}px)`
      mobileSheetRef.current.style.transition = 'none'
    }
  }, [])

  const onHandleTouchEnd = useCallback((e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientY - touchStartY.current
    const sheet = mobileSheetRef.current
    if (!sheet) return
    if (delta > 80) {
      onClose()
    } else {
      sheet.style.transform = ''
      sheet.style.transition = 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)'
      setTimeout(() => { if (sheet) sheet.style.transition = '' }, 400)
    }
  }, [onClose])

  useEffect(() => {
    setConfirmDelete(false)
    setShowWarning(false)
  }, [rush])

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (!rush) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [rush])

  // Close on Escape
  useEffect(() => {
    if (!rush) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [rush, onClose])

  const linkedRealisation = rush
    ? realisations.find((r) => r.rushIds.includes(rush.id)) ?? null
    : null

  function handleDeleteClick() {
    if (!rush) return
    if (linkedRealisation && RISKY_STATUSES.has(linkedRealisation.status)) {
      setShowWarning(true)
    } else {
      setConfirmDelete(true)
    }
  }

  const isOpen = rush !== null

  return (
    <AnimatePresence>
      {isOpen && rush && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* ── Mobile : bottom sheet ── */}
          <motion.div
            ref={mobileSheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: '88vh', paddingBottom: 'env(safe-area-inset-bottom)', touchAction: 'pan-y' }}
          >
            {/* Drag handle — swipe down to dismiss */}
            <div
              className="flex justify-center pt-3 pb-3 flex-shrink-0 cursor-grab active:cursor-grabbing"
              style={{ touchAction: 'none' }}
              onTouchStart={onHandleTouchStart}
              onTouchMove={onHandleTouchMove}
              onTouchEnd={onHandleTouchEnd}
            >
              <div className="w-9 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Header mobile */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 flex-shrink-0">
              {rush.thumbnailUrl ? (
                <img src={rush.thumbnailUrl} alt="" className="w-12 h-14 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6"/>
                    <polygon points="7.5,6.5 13,9 7.5,11.5" fill="currentColor"/>
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{friendlyName(rush.name)}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400 tabular-nums">{formatDuration(rush.duration)}</span>
                  <span className="text-slate-200">·</span>
                  <span className="text-xs text-slate-400">{formatSize(rush.size)}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-sm flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Body mobile */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-4 space-y-4">
              {/* Aperçu vidéo */}
              {rush.url && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Aperçu</p>
                  <VideoPreview url={rush.url} maxHeight="40vh" />
                </div>
              )}
              {/* Réalisation liée */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Réalisation liée</p>
                {linkedRealisation ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 truncate">{linkedRealisation.title}</span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 italic">Non assigné à une réalisation</p>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={() => onCreateRealisation(rush.id)}
                className="w-full flex items-center justify-center gap-2 bg-brand text-white text-sm font-semibold px-4 py-3 rounded-2xl hover:bg-brand/90 transition-colors shadow-sm"
              >
                <span className="text-base leading-none">+</span>
                Créer une réalisation
              </button>
            </div>

            {/* Footer mobile */}
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex-shrink-0">
              {showWarning ? (
                <div className="space-y-3">
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 leading-relaxed">
                    ⚠️ La vidéo n'est pas encore prête. Supprimer quand même ?
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowWarning(false)}
                      className="flex-1 py-2.5 text-sm text-slate-500 bg-slate-100 rounded-xl font-medium">
                      Annuler
                    </button>
                    <button onClick={() => { onDelete(rush.id); onClose() }}
                      className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl">
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : confirmDelete ? (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 font-medium text-center">Supprimer ce rush ?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmDelete(false)}
                      className="flex-1 py-2.5 text-sm text-slate-500 bg-slate-100 rounded-xl font-medium">
                      Annuler
                    </button>
                    <button onClick={() => { onDelete(rush.id); onClose() }}
                      className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl">
                      Confirmer
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={handleDeleteClick}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 7a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-7"
                      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Supprimer le rush
                </button>
              )}
            </div>
          </motion.div>

          {/* ── Desktop : side panel ── */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="hidden md:flex fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex-col overflow-hidden"
          >
            {/* Header desktop */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-4 flex-1 pr-4">
                {rush.thumbnailUrl ? (
                  <img src={rush.thumbnailUrl} alt={rush.name}
                    className="w-14 h-[70px] rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-14 h-[70px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">▶</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-slate-900 truncate">{friendlyName(rush.name)}</p>
                  <p className="text-sm text-slate-400 mt-0.5 tabular-nums">{formatDuration(rush.duration)}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{formatSize(rush.size)}</p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0">
                ✕
              </button>
            </div>

            {/* Body desktop */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Aperçu vidéo */}
              {rush.url && (
                <section>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Aperçu</h3>
                  <VideoPreview url={rush.url} maxHeight="45vh" />
                </section>
              )}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Réalisation liée</h3>
                {linkedRealisation ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 truncate">{linkedRealisation.title}</span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 italic">Non assigné à une réalisation.</p>
                )}
              </section>
              <section>
                <button onClick={() => onCreateRealisation(rush.id)}
                  className="w-full flex items-center justify-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm">
                  <span className="text-base leading-none">+</span>
                  Créer une Réalisation
                </button>
              </section>
            </div>

            {/* Footer desktop */}
            <div className="p-6 border-t border-slate-100">
              {showWarning ? (
                <div className="space-y-3">
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 leading-relaxed">
                    ⚠️ Attention, la vidéo ne semble pas complètement prête. La suppression est irréversible.
                  </p>
                  <div className="flex items-center gap-3 justify-end">
                    <button onClick={() => setShowWarning(false)}
                      className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                      Annuler
                    </button>
                    <button onClick={() => { onDelete(rush.id); onClose() }}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                      Confirmer quand même
                    </button>
                  </div>
                </div>
              ) : confirmDelete ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 flex-1">Supprimer ce rush ?</span>
                  <button onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                    Annuler
                  </button>
                  <button onClick={() => { onDelete(rush.id); onClose() }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                    Confirmer
                  </button>
                </div>
              ) : (
                <button onClick={handleDeleteClick}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 7a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-7"
                      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Supprimer le rush
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
