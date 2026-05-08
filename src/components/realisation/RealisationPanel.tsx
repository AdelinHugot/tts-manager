import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Realisation, Product, RealisationStatus, RushFile } from '../../types/realisation'
import StatusBadge from './StatusBadge'
import FileUploadZone from './FileUploadZone'

type Props = {
  realisation: Realisation | null
  products: Product[]
  onClose: () => void
  onUpdate: (updated: Realisation) => void
}

const ALL_STATUSES: RealisationStatus[] = [
  'a_tourner', 'script', 'a_monter', 'a_publier', 'publiee',
]

export default function RealisationPanel({ realisation, products, onClose, onUpdate }: Props) {
  const [draft, setDraft] = useState<Realisation | null>(null)
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  useEffect(() => {
    setDraft(realisation ? { ...realisation } : null)
    setShowStatusMenu(false)
  }, [realisation])

  function update(patch: Partial<Realisation>) {
    if (!draft) return
    const updated = { ...draft, ...patch }
    setDraft(updated)
    onUpdate(updated)
  }

  function handleAddRushes(files: RushFile[]) {
    if (!draft) return
    update({ rushes: [...draft.rushes, ...files] })
  }

  function handleRemoveRush(id: string) {
    if (!draft) return
    update({ rushes: draft.rushes.filter((r) => r.id !== id) })
  }

  const isOpen = realisation !== null

  return (
    <AnimatePresence>
      {isOpen && draft && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div className="flex-1 pr-4">
                <input
                  className="text-lg font-semibold text-slate-900 w-full outline-none focus:ring-2 focus:ring-brand/30 rounded-lg px-2 py-1 -mx-2 -my-1 hover:bg-slate-50 transition-colors"
                  value={draft.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
                <div className="mt-2.5 relative">
                  <button
                    onClick={() => setShowStatusMenu((v) => !v)}
                    className="flex items-center gap-1"
                  >
                    <StatusBadge status={draft.status} />
                    <span className="text-slate-300 text-xs ml-0.5">▾</span>
                  </button>
                  {showStatusMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-10 min-w-[180px]">
                      {ALL_STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => { update({ status: s }); setShowStatusMenu(false) }}
                          className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm hover:bg-slate-50 transition-colors ${
                            draft.status === s ? 'font-semibold text-brand' : 'text-slate-600'
                          }`}
                        >
                          <StatusBadge status={s} size="sm" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-7">

              {/* Metadata */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Informations
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">Produit</label>
                    <select
                      value={draft.productId}
                      onChange={(e) => update({ productId: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">Date de publication</label>
                    <input
                      type="date"
                      value={draft.publishDate ?? ''}
                      onChange={(e) => update({ publishDate: e.target.value || null })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40"
                    />
                  </div>
                </div>
              </section>

              {/* Rushes */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Rushs
                </h3>
                <FileUploadZone
                  rushes={draft.rushes}
                  onAdd={handleAddRushes}
                  onRemove={handleRemoveRush}
                />
              </section>

              {/* Notes */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Notes
                </h3>
                <textarea
                  value={draft.notes}
                  onChange={(e) => update({ notes: e.target.value })}
                  placeholder="Ajouter une note…"
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 resize-none placeholder-slate-300"
                />
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
