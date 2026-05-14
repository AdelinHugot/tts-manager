import type { Rush } from '../../types/rush'
import type { Realisation } from '../../types/realisation'
import { formatDuration, formatSize } from '../../utils/videoMetadata'

type Props = {
  rushes: Rush[]
  realisations: Realisation[]
  onSelect: (rush: Rush) => void
  onDelete: (rushId: string) => void
}

export default function RushsListView({ rushes, realisations, onSelect, onDelete }: Props) {
  const linkedIds = new Set(realisations.flatMap((r) => r.rushIds))

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Rush</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Durée</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Taille</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Statut</th>
            <th className="px-5 py-3.5" />
          </tr>
        </thead>
        <tbody>
          {rushes.map((rush) => (
            <tr
              key={rush.id}
              onClick={() => onSelect(rush)}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 cursor-pointer transition-colors group"
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  {rush.thumbnailUrl ? (
                    <img
                      src={rush.thumbnailUrl}
                      alt={rush.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                      ▶
                    </div>
                  )}
                  <span className="font-medium text-slate-800 group-hover:text-brand transition-colors truncate max-w-[240px]">
                    {rush.name}
                  </span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-slate-500 tabular-nums">
                {formatDuration(rush.duration)}
              </td>
              <td className="px-5 py-3.5 text-slate-500">
                {formatSize(rush.size)}
              </td>
              <td className="px-5 py-3.5">
                {linkedIds.has(rush.id) ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand bg-brand/10 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                    Lié
                  </span>
                ) : (
                  <span className="text-slate-300 text-xs">—</span>
                )}
              </td>
              <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onDelete(rush.id)}
                  title="Supprimer ce rush"
                  className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded opacity-0 group-hover:opacity-100"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 7a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
