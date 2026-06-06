import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Comment, Realisation, Product, RealisationStatus } from '../../types/realisation'
import type { Rush } from '../../types/rush'
import StatusBadge from './StatusBadge'
import FileUploadZone from './FileUploadZone'
import ProductPicker from './ProductPicker'
import { fsFindVideoUrlForProduct, fsAddComment, fsSubscribeComments } from '../../lib/firestore'
import { uploadFinalVideo, deleteFinalVideo } from '../../lib/storage'
import { auth } from '../../lib/firebase'

type Props = {
  realisation: Realisation | null
  products: Product[]
  rushes: Rush[]
  onAddRush: (rush: Rush) => void
  onClose: () => void
  onUpdate: (updated: Realisation) => void
  onDelete: (id: string) => void
}

const ALL_STATUSES: RealisationStatus[] = [
  'a_tourner', 'script', 'a_monter', 'a_publier', 'publiee',
]

/** Extrait l'ID vidéo TikTok depuis une URL du type @user/video/ID */
function extractTikTokId(url: string): string | null {
  const m = url.match(/\/video\/(\d+)/)
  return m ? m[1] : null
}

export default function RealisationPanel({ realisation, products, rushes, onAddRush, onClose, onUpdate, onDelete }: Props) {
  const [draft, setDraft] = useState<Realisation | null>(null)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [finalVideoUploading, setFinalVideoUploading] = useState(false)
  const [finalVideoProgress, setFinalVideoProgress] = useState(0)
  const finalVideoInputRef = useRef<HTMLInputElement>(null)

  // ── Comments ──────────────────────────────────────────────────────────────
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [sending, setSending] = useState(false)
  const commentsEndRef = useRef<HTMLDivElement>(null)

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
      // Clear transition after spring back
      setTimeout(() => { if (sheet) sheet.style.transition = '' }, 400)
    }
  }, [onClose])

  useEffect(() => {
    setDraft(realisation ? { ...realisation } : null)
    setUrlInput(realisation?.tiktokUrl ?? '')
    setShowStatusMenu(false)
    setConfirmDelete(false)
    setDetecting(false)
    setComments([])
    setCommentText('')
  }, [realisation])

  // Escape pour fermer + lock scroll body quand ouvert
  useEffect(() => {
    if (!realisation) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [realisation, onClose])

  useEffect(() => {
    if (!realisation?.id) return
    const unsub = fsSubscribeComments(realisation.id, setComments)
    return unsub
  }, [realisation?.id])

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  async function handleSendComment() {
    const text = commentText.trim()
    if (!text || sending || !realisation?.id) return
    const user = auth.currentUser
    setSending(true)
    setCommentText('')
    await fsAddComment(
      realisation.id,
      text,
      user?.displayName || user?.email?.split('@')[0] || 'Anonyme',
      user?.email || '',
      user?.photoURL ?? undefined,
    )
    setSending(false)
  }

  function update(patch: Partial<Realisation>) {
    if (!draft) return
    const updated = { ...draft, ...patch }
    setDraft(updated)
    onUpdate(updated)
  }

  function handleAddRushes(newRushes: Rush[]) {
    if (!draft) return
    newRushes.forEach((r) => onAddRush(r))
    update({ rushIds: [...draft.rushIds, ...newRushes.map((r) => r.id)] })
  }

  function handleUnlinkRush(rushId: string) {
    if (!draft) return
    update({ rushIds: draft.rushIds.filter((id) => id !== rushId) })
  }

  function handleLinkExisting(rushId: string) {
    if (!draft || draft.rushIds.includes(rushId)) return
    update({ rushIds: [...draft.rushIds, rushId] })
  }

  async function handleFinalVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !draft) return
    setFinalVideoUploading(true)
    setFinalVideoProgress(0)
    try {
      const url = await uploadFinalVideo(draft.id, file, setFinalVideoProgress)
      update({ finalVideoUrl: url })
    } catch (err) {
      console.error('[Final video upload]', err)
    } finally {
      setFinalVideoUploading(false)
      setFinalVideoProgress(0)
    }
  }

  async function handleDeleteFinalVideo() {
    if (!draft?.finalVideoUrl) return
    await deleteFinalVideo(draft.finalVideoUrl)
    update({ finalVideoUrl: undefined })
  }

  async function handleDownloadFinalVideo(url: string, title: string) {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const ext = blob.type.includes('quicktime') ? 'mov' : blob.type.split('/')[1] ?? 'mp4'
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${title}.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(a.href)
    } catch {
      window.open(url, '_blank')
    }
  }

  const isOpen = realisation !== null

  // ── Shared content sections ─────────────────────────────────────────────
  const bodyContent = draft && (
    <>
      {/* ── Bloc méta : Produit + Date ── */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-4 md:pb-5 border-b border-slate-100">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Produit</label>
            <ProductPicker
              products={products}
              value={draft.productId}
              onChange={(id) => update({ productId: id })}
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Publication</label>
            <input
              type="date"
              value={draft.publishDate ?? ''}
              onChange={(e) => update({ publishDate: e.target.value || null })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40"
            />
          </div>
        </div>
      </div>

      {/* ── Rushs ── */}
      {draft.status !== 'publiee' && (
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-4 md:pb-5 border-b border-slate-100">
          <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Rushs</h3>
          <FileUploadZone
            rushIds={draft.rushIds}
            allRushes={rushes}
            onAdd={handleAddRushes}
            onUnlink={handleUnlinkRush}
            onLinkExisting={handleLinkExisting}
          />
        </div>
      )}

      {/* ── Vidéo finale ── */}
      {(draft.status === 'a_publier' || draft.status === 'publiee') && (
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-4 md:pb-5 border-b border-slate-100">
          <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Vidéo finale</h3>

          {/* Upload en cours */}
          {finalVideoUploading && (
            <div className="flex items-center gap-3 px-4 py-3 bg-brand/5 border border-brand/20 rounded-xl text-sm text-brand font-medium">
              <div className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span>Upload en cours…</span>
                  <span className="text-xs font-bold">{finalVideoProgress}%</span>
                </div>
                <div className="h-1.5 bg-brand/20 rounded-full overflow-hidden">
                  <div className="h-full bg-brand rounded-full transition-all duration-200" style={{ width: `${finalVideoProgress}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Vidéo présente */}
          {draft.finalVideoUrl && !finalVideoUploading && (
            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden bg-black">
                <video
                  src={draft.finalVideoUrl}
                  controls
                  playsInline
                  className="w-full"
                  style={{ maxHeight: 320 }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadFinalVideo(draft.finalVideoUrl!, draft.title)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2v10M5 8l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  Télécharger
                </button>
                <button
                  onClick={() => finalVideoInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:border-brand/40 hover:text-brand transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                    <path d="M9 16v-10M5 10l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  Remplacer
                </button>
                <button
                  onClick={handleDeleteFinalVideo}
                  className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M3 3.5l.7 7a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          )}

          {/* Zone d'upload vide */}
          {!draft.finalVideoUrl && !finalVideoUploading && (
            <button
              onClick={() => finalVideoInputRef.current?.click()}
              className="w-full flex flex-col items-center gap-2 py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-brand/40 hover:text-brand transition-colors"
            >
              <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
                <path d="M9 12V4M5 8l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <span className="text-sm font-medium">Ajouter la vidéo montée</span>
              <span className="text-xs text-slate-300">MP4, MOV, M4V…</span>
            </button>
          )}

          <input
            ref={finalVideoInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/x-m4v,video/*"
            className="hidden"
            onChange={handleFinalVideoChange}
          />
        </div>
      )}

      {/* ── Vidéo TikTok ── */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-4 md:pb-5 border-b border-slate-100">
        {(() => {
          const id = extractTikTokId(urlInput || draft.tiktokUrl || '')

          if (!id) {
            return (
              <>
                <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Vidéo TikTok</h3>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://www.tiktok.com/@user/video/…"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onBlur={() => { const c = urlInput.trim(); update({ tiktokUrl: c || undefined }) }}
                    className="flex-1 min-w-0 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 placeholder-slate-300"
                  />
                  <button
                    disabled={detecting}
                    onClick={async () => {
                      const product = products.find(p => p.id === draft.productId)
                      if (!product) return
                      setDetecting(true)
                      const found = await fsFindVideoUrlForProduct(product.name)
                      setDetecting(false)
                      if (found) { setUrlInput(found); update({ tiktokUrl: found }) }
                    }}
                    title="Retrouver l'URL depuis les commandes"
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-500 hover:border-brand/40 hover:text-brand transition-all disabled:opacity-50"
                  >
                    {detecting
                      ? <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-brand rounded-full animate-spin" />
                      : <svg width="13" height="13" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.7"/><path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
                    }
                    Détecter
                  </button>
                </div>
              </>
            )
          }

          return (
            <>
              <div className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-black mb-3"
                   style={{ aspectRatio: '9/16' }}>
                <iframe
                  key={id}
                  src={`https://www.tiktok.com/embed/v2/${id}`}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 'none' }}
                  allow="encrypted-media"
                  allowFullScreen
                  scrolling="no"
                />
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 18 18" fill="none" className="text-slate-300 flex-shrink-0">
                  <path d="M7.5 10.5a4 4 0 0 0 5.657 0l2-2a4 4 0 0 0-5.656-5.657L8.25 4.09" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M10.5 7.5a4 4 0 0 0-5.657 0l-2 2a4 4 0 0 0 5.656 5.657L9.75 13.91" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onBlur={() => { const c = urlInput.trim(); update({ tiktokUrl: c || undefined }) }}
                  className="flex-1 min-w-0 bg-transparent text-xs text-slate-500 outline-none placeholder-slate-300 truncate"
                />
                <button
                  onClick={() => { setUrlInput(''); update({ tiktokUrl: undefined }) }}
                  className="flex-shrink-0 text-slate-300 hover:text-slate-500 transition-colors text-xs"
                  title="Effacer"
                >
                  ✕
                </button>
              </div>
            </>
          )
        })()}
      </div>

      {/* ── Notes ── */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-4 md:pb-5 border-b border-slate-100">
        <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Notes</h3>
        <textarea
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Ajouter une note…"
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 resize-none placeholder-slate-300"
        />
      </div>

      {/* ── Commentaires ── */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-6">
        <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Commentaires</h3>
        <div className="space-y-2 mb-3 min-h-[40px]">
          {comments.length === 0 && (
            <p className="text-xs text-slate-300 text-center py-4">Aucun commentaire pour l'instant</p>
          )}
          {comments.map((c) => {
            const isMe = c.authorEmail === auth.currentUser?.email
            const initials = c.authorName.slice(0, 2).toUpperCase()
            const time = new Date(c.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            const date = new Date(c.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
            const photo = c.authorPhotoURL
            return (
              <div key={c.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-6 h-6 rounded-full flex-shrink-0 mb-0.5 overflow-hidden bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-500">
                  {photo
                    ? <img src={photo} alt="" className="w-full h-full object-cover" />
                    : initials
                  }
                </div>
                <div className={`flex flex-col gap-0.5 max-w-[72%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-[10px] text-slate-400 px-1">{c.authorName}</span>}
                  <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    isMe ? 'bg-brand text-white rounded-br-sm' : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                  }`}>
                    {c.text}
                  </div>
                  <span className="text-[10px] text-slate-300 px-1">{date} · {time}</span>
                </div>
              </div>
            )
          })}
          <div ref={commentsEndRef} />
        </div>
        <div className="flex gap-2 items-end">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment() }
            }}
            placeholder="Écrire un commentaire… (Entrée pour envoyer)"
            rows={1}
            className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 resize-none placeholder-slate-300 leading-relaxed"
            style={{ minHeight: 40, maxHeight: 120, overflowY: 'auto' }}
          />
          <button
            onClick={handleSendComment}
            disabled={!commentText.trim() || sending}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending
              ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M2 9l14-6-6 14-2-5-6-3z" fill="currentColor"/></svg>
            }
          </button>
        </div>
      </div>
    </>
  )

  return (
    <AnimatePresence>
      {isOpen && draft && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
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
            style={{ maxHeight: '92vh', paddingBottom: 'env(safe-area-inset-bottom)', touchAction: 'pan-y' }}
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
            <div className="flex items-start justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
              <div className="flex-1 pr-3 min-w-0">
                <input
                  className="text-base font-semibold text-slate-900 w-full outline-none focus:ring-2 focus:ring-brand/30 rounded-lg px-2 py-1 -mx-2 -my-1 hover:bg-slate-50 transition-colors"
                  value={draft.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
                <div className="mt-2 relative">
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
              <div className="flex items-center gap-1 flex-shrink-0">
                {confirmDelete ? (
                  <>
                    <button
                      onClick={() => { onDelete(draft.id); onClose() }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white"
                    >
                      Supprimer
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 bg-slate-100"
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400"
                  >
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                      <path d="M3 5h12M8 5V3h2v2M7 5v9a1 1 0 001 1h2a1 1 0 001-1V5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-sm flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body mobile — scrollable vertical seulement */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
              {bodyContent}
            </div>
          </motion.div>

          {/* ── Desktop : side panel ── */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="hidden md:flex fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 flex-col overflow-hidden"
          >
            {/* Header desktop */}
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
              <div className="flex items-center gap-1 flex-shrink-0">
                {confirmDelete ? (
                  <>
                    <button
                      onClick={() => { onDelete(draft.id); onClose() }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      Supprimer
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    title="Supprimer cette réalisation"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                      <path d="M3 5h12M8 5V3h2v2M7 5v9a1 1 0 001 1h2a1 1 0 001-1V5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body desktop */}
            <div className="flex-1 overflow-y-auto">
              {bodyContent}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
