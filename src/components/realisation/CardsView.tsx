import type { Realisation, Product } from '../../types/realisation'
import StatusBadge from './StatusBadge'

type Props = {
  realisations: Realisation[]
  products: Product[]
  onSelect: (r: Realisation) => void
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  })
}

export default function CardsView({ realisations, products, onSelect }: Props) {
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {realisations.map((r) => (
        <div
          key={r.id}
          onClick={() => onSelect(r)}
          className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          {/* Thumbnail */}
          <div className="relative h-40 bg-slate-100 overflow-hidden">
            {r.rushIds.length > 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <span className="text-white/60 text-4xl">▶</span>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <span className="text-slate-300 text-3xl">◎</span>
                <span className="text-slate-300 text-xs">Aucun rush</span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <StatusBadge status={r.status} size="sm" />
            </div>
            {r.rushIds.length > 0 && (
              <div className="absolute bottom-3 left-3">
                <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {r.rushIds.length} rush{r.rushIds.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="p-4">
            <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 group-hover:text-brand transition-colors line-clamp-2">
              {r.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 truncate max-w-[150px]">
                {productMap[r.productId]?.name ?? '—'}
              </span>
              {r.publishDate && (
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {formatDate(r.publishDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
