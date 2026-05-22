import type { TopItem } from '../../types/analytics'

type Props = {
  items: TopItem[]
  label: string
}

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

export default function TopTable({ items, label }: Props) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-300 italic py-6 text-center">Aucune donnée pour cette période.</p>
  }

  const maxCA = items[0].ca

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 w-10">#</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">{label}</th>
            <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">CA</th>
            <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Commissions</th>
            <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Cmdes</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <td className="py-3 pr-3">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold
                  ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                  {i + 1}
                </div>
              </td>
              <td className="py-3 pr-4">
                <div className="font-medium text-slate-700 truncate max-w-xs">{item.name}</div>
                <div className="h-1.5 bg-slate-100 rounded-full mt-1.5 w-32">
                  <div
                    className="h-full bg-brand rounded-full"
                    style={{ width: `${Math.round((item.ca / maxCA) * 100)}%` }}
                  />
                </div>
              </td>
              <td className="py-3 pr-4 text-right font-semibold text-slate-800">{fmt(item.ca)}</td>
              <td className="py-3 pr-4 text-right font-semibold text-emerald-600">{fmt(item.commissions)}</td>
              <td className="py-3 text-right text-slate-500">{item.orderCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
