import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Rush } from '../../types/rush'
import type { Realisation } from '../../types/realisation'
import { formatDuration, formatSize } from '../../utils/videoMetadata'

type Props = {
  rush: Rush | null
  realisations: Realisation[]
  onClose: () => void
  onDelete: (rushId: string) => void
  onCreateRealisation: (rushId: string) => void
}

const RISKY_STATUSES = new Set(['a_tourner', 'script', 'a_monter'])

export default function RushPanel({ rush, realisations, onClose, onDelete, onCreateRealisation }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    setConfirmDelete(false)
    setShowWarning(false)
  }, [rush])

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-4 flex-1 pr-4">
                {rush.thumbnailUrl ? (
                  <img
                    src={rush.thumbnailUrl}
                    alt={rush.name}
                    className="w-14 h-[70px] rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-[70px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                    ▶
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-slate-900 truncate">{rush.name}</p>
                  <p className="text-sm text-slate-400 mt-0.5 tabular-nums">{formatDuration(rush.duration)}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{formatSize(rush.size)}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Réalisation liée
                </h3>
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
                <button
                  onClick={() => onCreateRealisation(rush.id)}
                  className="w-full flex items-center justify-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
                >
                  <span className="text-base leading-none">+</span>
                  Créer une Réalisation
                </button>
              </section>
            </div>

            {/* Footer: delete */}
            <div className="p-6 border-t border-slate-100">
              {showWarning ? (
                <div className="space-y-3">
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 leading-relaxed">
                    ⚠️ Attention, la vidéo ne semble pas complètement prête. La suppression du rush est irréversible. Tu es sûr ?
                  </p>
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => setShowWarning(false)}
                      className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => { onDelete(rush.id); onClose() }}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      Confirmer quand même
                    </button>
                  </div>
                </div>
              ) : confirmDelete ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 flex-1">Supprimer ce rush ?</span>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => { onDelete(rush.id); onClose() }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 7a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
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
