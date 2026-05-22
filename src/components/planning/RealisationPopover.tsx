import type { Realisation, Product } from '../../types/realisation'
import { STATUS_LABELS, STATUS_COLORS } from '../../types/realisation'

type Props = {
  realisation: Realisation
  product: Product | undefined
  anchorRect: DOMRect
  onClose: () => void
}

export default function RealisationPopover({ realisation, product, anchorRect, onClose }: Props) {
  // Position the popover: prefer below the chip, flip up if not enough space
  const popoverWidth = 260
  const popoverHeight = 200 // approximate
  const margin = 8

  let top = anchorRect.bottom + margin
  let left = anchorRect.left

  // Flip above if too close to bottom
  if (top + popoverHeight > window.innerHeight - margin) {
    top = anchorRect.top - popoverHeight - margin
  }

  // Clamp horizontally
  if (left + popoverWidth > window.innerWidth - margin) {
    left = window.innerWidth - popoverWidth - margin
  }
  if (left < margin) left = margin

  const dateLabel = realisation.publishDate
    ? new Date(realisation.publishDate + 'T00:00:00').toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Non planifiée'

  const dotClass = STATUS_COLORS[realisation.status].dot
  const badgeBg = STATUS_COLORS[realisation.status].bg
  const badgeText = STATUS_COLORS[realisation.status].text

  return (
    <>
      {/* Invisible backdrop to catch outside clicks */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popover card */}
      <div
        className="fixed z-50 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-100"
        style={{ width: popoverWidth, top, left }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotClass}`} />
            <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
              {realisation.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-2 text-xs">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Statut</span>
            <span className={`px-2 py-0.5 rounded-full font-semibold ${badgeBg} ${badgeText}`}>
              {STATUS_LABELS[realisation.status]}
            </span>
          </div>

          {/* Product */}
          {product && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Produit</span>
              <span className="text-slate-600 font-medium truncate max-w-[150px]">{product.name}</span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Publication</span>
            <span className={`font-medium ${realisation.publishDate ? 'text-slate-600' : 'text-slate-400 italic'}`}>
              {dateLabel}
            </span>
          </div>

          {/* Notes */}
          {realisation.notes && (
            <div className="mt-1 pt-2 border-t border-slate-100">
              <p className="text-slate-400 font-medium mb-1">Notes</p>
              <p className="text-slate-600 leading-relaxed">{realisation.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
