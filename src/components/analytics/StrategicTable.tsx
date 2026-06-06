import type { StrategicItem } from '../../utils/analyticsUtils'

type SortKey = 'ca' | 'commissions' | 'tauxCommission' | 'averageBasket' | 'orderCount'

type Props = {
  items: StrategicItem[]
  showBoutique?: boolean
  sortKey?: SortKey
  onSortChange?: (key: SortKey) => void
}

function fmtEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function TauxBadge({ value }: { value: number }) {
  if (value === 0) return <span className="text-slate-300 text-xs">—</span>
  const cls =
    value >= 10
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : value >= 5
        ? 'bg-brand/10 text-brand border-brand/20'
        : 'bg-amber-50 text-amber-700 border-amber-200'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {value.toFixed(1)}%
    </span>
  )
}

function SortBtn({ label, sortKey, active, onSort }: { label: string; sortKey: SortKey; active: boolean; onSort: (k: SortKey) => void }) {
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`text-right text-xs font-semibold uppercase tracking-wide pb-3 whitespace-nowrap transition-colors ${
        active ? 'text-brand' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {label}{active && ' ▾'}
    </button>
  )
}

export default function StrategicTable({ items, showBoutique = false, sortKey = 'ca', onSortChange }: Props) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-300 italic py-8 text-center">Aucune donnée pour cette période.</p>
  }

  const sorted = [...items].sort((a, b) => b[sortKey] - a[sortKey])
  const maxCA = Math.max(...sorted.map(i => i.ca))

  const handleSort = (k: SortKey) => onSortChange?.(k)

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 w-8 pl-1">#</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">
              {showBoutique ? 'Produit' : 'Marque'}
            </th>
            {onSortChange ? (
              <>
                <th className="pr-4"><SortBtn label="CA" sortKey="ca" active={sortKey === 'ca'} onSort={handleSort} /></th>
                <th className="pr-4"><SortBtn label="Commissions" sortKey="commissions" active={sortKey === 'commissions'} onSort={handleSort} /></th>
                <th className="pr-4"><SortBtn label="Taux comm." sortKey="tauxCommission" active={sortKey === 'tauxCommission'} onSort={handleSort} /></th>
                <th className="pr-4"><SortBtn label="Panier moy." sortKey="averageBasket" active={sortKey === 'averageBasket'} onSort={handleSort} /></th>
                <th><SortBtn label="Cmdes" sortKey="orderCount" active={sortKey === 'orderCount'} onSort={handleSort} /></th>
              </>
            ) : (
              <>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">CA</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">Commissions</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">Taux comm.</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">Panier moy.</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Cmdes</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.map((item, i) => (
            <tr key={item.name} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
              <td className="py-3 pr-2 pl-1">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                  {i + 1}
                </div>
              </td>
              <td className="py-3 pr-4">
                <div className="font-medium text-slate-800 truncate max-w-[160px] md:max-w-xs">{item.name}</div>
                {showBoutique && item.subLabel && (
                  <div className="text-xs text-slate-400 truncate max-w-[160px] md:max-w-xs mt-0.5">{item.subLabel}</div>
                )}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="h-1 bg-slate-100 rounded-full w-20 md:w-28 flex-shrink-0">
                    <div
                      className="h-full bg-brand/60 rounded-full"
                      style={{ width: `${Math.round((item.ca / maxCA) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">{item.caShare}%</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-right font-semibold text-slate-800 tabular-nums">{fmtEur(item.ca)}</td>
              <td className="py-3 pr-4 text-right font-semibold text-emerald-600 tabular-nums">{fmtEur(item.commissions)}</td>
              <td className="py-3 pr-4 text-right">
                <TauxBadge value={item.tauxCommission} />
              </td>
              <td className="py-3 pr-4 text-right text-slate-600 tabular-nums">{fmtEur(item.averageBasket)}</td>
              <td className="py-3 text-right text-slate-500 tabular-nums">{item.orderCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
