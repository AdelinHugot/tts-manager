import type { Rush } from '../../types/rush'
import type { Realisation } from '../../types/realisation'
import { formatDuration } from '../../utils/videoMetadata'

type Props = {
  rushes: Rush[]
  realisations: Realisation[]
  onSelect: (rush: Rush) => void
}

export default function RushsCardsView({ rushes, realisations, onSelect }: Props) {
  const linkedIds = new Set(realisations.flatMap((r) => r.rushIds))

  return (
    <div className="grid grid-cols-5 xl:grid-cols-6 gap-3">
      {rushes.map((rush) => (
        <article
          key={rush.id}
          role="article"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/rush-id', rush.id)
            e.dataTransfer.effectAllowed = 'link'
          }}
          onClick={() => onSelect(rush)}
          className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 cursor-pointer group hover:ring-2 hover:ring-brand/50 transition-all"
        >
          {rush.thumbnailUrl ? (
            <img
              src={rush.thumbnailUrl}
              alt={rush.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
              <span className="text-slate-400 text-3xl">▶</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 pt-6">
            <p className="text-white text-xs font-medium truncate leading-tight">{rush.name}</p>
            <p className="text-white/70 text-xs tabular-nums mt-0.5">{formatDuration(rush.duration)}</p>
          </div>

          {linkedIds.has(rush.id) && (
            <div className="absolute top-2 right-2">
              <span className="w-2 h-2 rounded-full bg-brand block ring-2 ring-white" title="Lié à une réalisation" />
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
