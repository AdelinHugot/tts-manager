import type { VideoPerformanceItem } from '../../utils/analyticsUtils'

type SortKey = 'ca' | 'commissions' | 'tauxCommission' | 'averageBasket' | 'orderCount' | 'views' | 'conversionRate'

type Props = {
  items: VideoPerformanceItem[]
  sortKey: SortKey
  onSortChange: (k: SortKey) => void
  tiktokConnected?: boolean
  onConnectTikTok?: () => void
}

function fmtEur(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function fmtViews(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'k'
  return String(n)
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
      {value.toFixed(1)} %
    </span>
  )
}

function ConversionBadge({ value }: { value: number }) {
  // value is in %, typically 0.01–2%
  const cls =
    value >= 1
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : value >= 0.3
        ? 'bg-brand/10 text-brand border-brand/20'
        : 'bg-amber-50 text-amber-700 border-amber-200'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {value.toFixed(2)} %
    </span>
  )
}

function SortBtn({
  label, k, active, onSort,
}: { label: string; k: SortKey; active: boolean; onSort: (k: SortKey) => void }) {
  return (
    <button
      onClick={() => onSort(k)}
      className={`text-right text-xs font-semibold uppercase tracking-wide pb-3 whitespace-nowrap transition-colors ${
        active ? 'text-brand' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {label}{active && ' ▾'}
    </button>
  )
}

export default function VideoPerformanceTable({
  items, sortKey, onSortChange, tiktokConnected = false, onConnectTikTok,
}: Props) {
  const hasViews = items.some((i) => i.views !== undefined)

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 text-2xl mx-auto mb-3">▶</div>
        <p className="text-sm text-slate-400 font-medium">Aucune vidéo publiée sur cette période</p>
        <p className="text-xs text-slate-300 mt-1">Publie des réalisations avec une URL TikTok pour voir les performances ici</p>
      </div>
    )
  }

  const sorted = [...items].sort((a, b) => {
    const av = (a[sortKey] ?? 0) as number
    const bv = (b[sortKey] ?? 0) as number
    return bv - av
  })
  const maxCA = Math.max(...sorted.map((i) => i.ca), 1)

  return (
    <div className="space-y-4">
      {/* TikTok connect banner if not connected */}
      {!tiktokConnected && onConnectTikTok && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.5a8.27 8.27 0 004.84 1.55V6.6a4.85 4.85 0 01-1.07.09z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Connecte TikTok pour voir les vues & conversions</p>
              <p className="text-[10px] text-slate-400">Taux de conversion vues → commandes, revenu par vue</p>
            </div>
          </div>
          <button
            onClick={onConnectTikTok}
            className="flex-shrink-0 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-700 transition-colors px-3 py-1.5 rounded-lg"
          >
            Connecter
          </button>
        </div>
      )}

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 w-8 pl-1">#</th>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4">Vidéo</th>
              <th className="pr-4"><SortBtn label="CA" k="ca" active={sortKey === 'ca'} onSort={onSortChange} /></th>
              <th className="pr-4"><SortBtn label="Commissions" k="commissions" active={sortKey === 'commissions'} onSort={onSortChange} /></th>
              <th className="pr-4"><SortBtn label="Taux comm." k="tauxCommission" active={sortKey === 'tauxCommission'} onSort={onSortChange} /></th>
              {hasViews && (
                <>
                  <th className="pr-4"><SortBtn label="Vues" k="views" active={sortKey === 'views'} onSort={onSortChange} /></th>
                  <th className="pr-4"><SortBtn label="Conversion" k="conversionRate" active={sortKey === 'conversionRate'} onSort={onSortChange} /></th>
                </>
              )}
              <th className="pr-4"><SortBtn label="Panier moy." k="averageBasket" active={sortKey === 'averageBasket'} onSort={onSortChange} /></th>
              <th><SortBtn label="Cmdes" k="orderCount" active={sortKey === 'orderCount'} onSort={onSortChange} /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, i) => (
              <tr
                key={item.realisationId}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
              >
                {/* Rang */}
                <td className="py-3 pr-2 pl-1 align-top pt-4">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                    {i + 1}
                  </div>
                </td>

                {/* Titre + produit + barre CA */}
                <td className="py-3 pr-4">
                  <div className="flex items-start gap-2.5">
                    {item.tiktokUrl ? (
                      <a
                        href={item.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0 hover:bg-slate-700 transition-colors mt-0.5"
                        title="Voir sur TikTok"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.5a8.27 8.27 0 004.84 1.55V6.6a4.85 4.85 0 01-1.07.09z"/>
                        </svg>
                      </a>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6"/>
                          <polygon points="7.5,6.5 13,9 7.5,11.5" fill="currentColor"/>
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 truncate max-w-[200px] md:max-w-sm leading-tight">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px] md:max-w-sm">{item.productName}</p>
                      {!item.isLinked && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full mt-1">
                          <svg width="8" height="8" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.8"/><path d="M9 5.5v4M9 12v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                          Pas d'URL TikTok
                        </span>
                      )}
                      {/* Barre de progression CA */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="h-1 bg-slate-100 rounded-full w-24 md:w-32 flex-shrink-0">
                          <div
                            className="h-full bg-brand/60 rounded-full"
                            style={{ width: `${Math.round((item.ca / maxCA) * 100)}%` }}
                          />
                        </div>
                        {item.publishDate && (
                          <span className="text-[10px] text-slate-300">
                            {new Date(item.publishDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Métriques financières */}
                <td className="py-3 pr-4 text-right font-semibold text-slate-800 tabular-nums align-top pt-4">
                  {item.ca > 0 ? fmtEur(item.ca) : <span className="text-slate-300">—</span>}
                </td>
                <td className="py-3 pr-4 text-right font-semibold text-emerald-600 tabular-nums align-top pt-4">
                  {item.commissions > 0 ? fmtEur(item.commissions) : <span className="text-slate-300">—</span>}
                </td>
                <td className="py-3 pr-4 text-right align-top pt-4">
                  <TauxBadge value={item.tauxCommission} />
                </td>

                {/* Métriques TikTok */}
                {hasViews && (
                  <>
                    <td className="py-3 pr-4 text-right font-semibold text-slate-600 tabular-nums align-top pt-4">
                      {item.views !== undefined ? (
                        <span className="flex items-center justify-end gap-1">
                          <svg width="10" height="10" viewBox="0 0 18 18" fill="none" className="text-slate-400 flex-shrink-0">
                            <ellipse cx="9" cy="9" rx="7" ry="5" stroke="currentColor" strokeWidth="1.6"/>
                            <circle cx="9" cy="9" r="2.5" fill="currentColor"/>
                          </svg>
                          {fmtViews(item.views)}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="py-3 pr-4 text-right align-top pt-4">
                      {item.conversionRate !== undefined && item.views
                        ? <ConversionBadge value={item.conversionRate} />
                        : <span className="text-slate-300 text-xs">—</span>}
                    </td>
                  </>
                )}

                <td className="py-3 pr-4 text-right text-slate-600 tabular-nums align-top pt-4">
                  {item.orderCount > 0 ? fmtEur(item.averageBasket) : <span className="text-slate-300">—</span>}
                </td>
                <td className="py-3 text-right text-slate-500 tabular-nums align-top pt-4">
                  {item.orderCount > 0 ? item.orderCount : <span className="text-slate-300">0</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
