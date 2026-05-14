import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Product, Realisation, ProductStatus } from '../../types/realisation'
import { PRODUCT_STATUS_LABELS, STATUS_LABELS, STATUS_COLORS } from '../../types/realisation'

type Props = {
  product: Product | null
  realisations: Realisation[]
  onClose: () => void
  onUpdate: (updated: Product) => void
  onDelete: (id: string) => void
}

const ALL_STATUSES: ProductStatus[] = ['actif', 'rupture_stock', 'inactif']

export default function ProductPanel({ product, realisations, onClose, onUpdate, onDelete }: Props) {
  const [draft, setDraft] = useState<Product | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setDraft(product ? { ...product } : null)
    setConfirmDelete(false)
  }, [product])

  function update(patch: Partial<Product>) {
    if (!draft) return
    const updated = { ...draft, ...patch }
    setDraft(updated)
    onUpdate(updated)
  }

  const linked = product ? realisations.filter((r) => r.productId === product.id) : []
  const isOpen = product !== null

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
              <div className="flex items-center gap-4 flex-1 pr-4">
                <img
                  src={draft.imageUrl}
                  alt={draft.name}
                  className="w-14 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <input
                    className="text-base font-semibold text-slate-900 w-full outline-none focus:ring-2 focus:ring-brand/30 rounded-lg px-2 py-1 -mx-2 -my-1 hover:bg-slate-50 transition-colors"
                    value={draft.name}
                    onChange={(e) => update({ name: e.target.value })}
                  />
                  <div className="mt-2">
                    <select
                      value={draft.status}
                      onChange={(e) => update({ status: e.target.value as ProductStatus })}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{PRODUCT_STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
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

              {/* Description */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Description
                </h3>
                <textarea
                  value={draft.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="Description du produit…"
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 resize-none placeholder-slate-300"
                />
              </section>

              {/* URL */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Lien TikTok Shop
                </h3>
                <input
                  type="url"
                  value={draft.url ?? ''}
                  onChange={(e) => update({ url: e.target.value || undefined })}
                  placeholder="https://shop.tiktok.com/…"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 placeholder-slate-300"
                />
              </section>

              {/* Réalisations liées */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Réalisations liées
                  <span className="ml-2 font-medium text-slate-300 normal-case tracking-normal">({linked.length})</span>
                </h3>
                {linked.length === 0 ? (
                  <p className="text-sm text-slate-300 italic">Aucune vidéo réalisée sur ce produit.</p>
                ) : (
                  <div className="space-y-2">
                    {linked.map((r) => {
                      const { bg, text, dot } = STATUS_COLORS[r.status]
                      return (
                        <div
                          key={r.id}
                          onClick={() => {}}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700 truncate mr-3">{r.title}</span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full font-medium px-2 py-0.5 text-xs flex-shrink-0 ${bg} ${text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                            {STATUS_LABELS[r.status]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* Footer: delete */}
            <div className="p-6 border-t border-slate-100">
              {confirmDelete ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 flex-1">Supprimer ce produit ?</span>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => { onDelete(draft.id); onClose() }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 7a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Supprimer le produit
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
