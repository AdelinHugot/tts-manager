import type { Realisation, Product } from '../../types/realisation'
import StatusBadge from './StatusBadge'

type Props = {
  realisations: Realisation[]
  products: Product[]
  onSelect: (r: Realisation) => void
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function ListView({ realisations, products, onSelect }: Props) {
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Titre</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Statut</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Produit</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Publication</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Rushs</th>
          </tr>
        </thead>
        <tbody>
          {realisations.map((r) => (
            <tr
              key={r.id}
              onClick={() => onSelect(r)}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 cursor-pointer transition-colors group"
            >
              <td className="px-5 py-4">
                <span className="font-medium text-slate-800 group-hover:text-brand transition-colors">
                  {r.title}
                </span>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-5 py-4 text-slate-500">
                {productMap[r.productId]?.name ?? '—'}
              </td>
              <td className="px-5 py-4 text-slate-500">
                {formatDate(r.publishDate)}
              </td>
              <td className="px-5 py-4">
                {r.rushIds.length > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ▶ {r.rushIds.length} fichier{r.rushIds.length > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-slate-300 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
