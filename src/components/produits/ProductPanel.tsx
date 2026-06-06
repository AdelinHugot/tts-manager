import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Product, Realisation, ProductStatus } from '../../types/realisation'
import { PRODUCT_STATUS_LABELS, STATUS_LABELS, STATUS_COLORS } from '../../types/realisation'
import ProductImage from './ProductImage'
import { uploadProductImage } from '../../lib/storage'

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
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  async function handleImageFile(file: File) {
    if (!draft || !file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const url = await uploadProductImage(draft.id, file)
      update({ imageUrl: url })
    } finally {
      setUploading(false)
    }
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
                {/* Vignette — drop zone + clic pour upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = '' }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleImageFile(f) }}
                  title="Glisser une image ou cliquer pour uploader"
                  className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
                    dragOver ? 'ring-2 ring-brand ring-offset-1 scale-105' : 'hover:ring-2 hover:ring-brand/30 hover:ring-offset-1'
                  }`}
                >
                  <ProductImage imageUrl={draft.imageUrl} name={draft.name} />
                  {/* Overlay upload */}
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                    uploading || dragOver ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                  }`}>
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                        <path d="M9 12V4M5 7l4-4 4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 15h12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                </div>
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

              {/* Image & Liens */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Image & Liens
                </h3>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">URL de l'image</label>
                    <input
                      type="url"
                      value={draft.imageUrl}
                      onChange={(e) => update({ imageUrl: e.target.value })}
                      placeholder="https://…"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 placeholder-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Lien TikTok Shop</label>
                    <input
                      type="url"
                      value={draft.url ?? ''}
                      onChange={(e) => update({ url: e.target.value || undefined })}
                      placeholder="https://shop.tiktok.com/…"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 placeholder-slate-300"
                    />
                  </div>
                  {draft.tiktokProductId && (
                    <a
                      href={`https://www.tiktok.com/view/product/${draft.tiktokProductId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-brand hover:underline"
                    >
                      <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                        <path d="M10 3h5v5M8 10l7-7M7 5H4a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Voir la fiche produit TikTok Shop
                    </a>
                  )}
                </div>
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
