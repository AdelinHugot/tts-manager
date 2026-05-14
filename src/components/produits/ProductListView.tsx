import type { Product, Realisation } from '../../types/realisation'
import { PRODUCT_STATUS_LABELS, PRODUCT_STATUS_COLORS } from '../../types/realisation'

type Props = {
  products: Product[]
  realisations: Realisation[]
  onSelect: (p: Product) => void
  onDelete: (id: string) => void
}

export default function ProductListView({ products, realisations, onSelect, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Produit</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Statut</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Vidéos</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Commission</th>
            <th className="px-5 py-3.5" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const count = realisations.filter((r) => r.productId === product.id).length
            const { dot, badge } = PRODUCT_STATUS_COLORS[product.status]

            return (
              <tr
                key={product.id}
                onClick={() => onSelect(product)}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 cursor-pointer transition-colors group"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                    />
                    <span className="font-medium text-slate-800 group-hover:text-brand transition-colors">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full font-medium px-2.5 py-1 text-xs ${badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                    {PRODUCT_STATUS_LABELS[product.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {count} vidéo{count !== 1 ? 's' : ''}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  0 €
                </td>
                <td className="px-5 py-4">
                  <button
                    title="Supprimer"
                    onClick={(e) => { e.stopPropagation(); onDelete(product.id) }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 3.5h10M5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 7a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
