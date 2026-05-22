import { useDroppable } from '@dnd-kit/core'
import type { Realisation } from '../../types/realisation'
import RealisationChip from './RealisationChip'

type Props = {
  realisations: Realisation[]
  onChipClick?: (r: Realisation, e: React.MouseEvent<HTMLDivElement>) => void
}

export default function UnscheduledList({ realisations, onChipClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'unscheduled' })

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden h-full">
      <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <h3 className="text-sm font-semibold text-slate-700">
          Sans date ({realisations.length})
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Glissez sur une date</p>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-3 flex flex-col gap-2 transition-colors min-h-[60px] ${
          isOver ? 'bg-brand/5' : ''
        }`}
      >
        {realisations.length === 0 ? (
          <p className="text-xs text-slate-400 text-center mt-4">
            Toutes les vidéos ont une date 🎉
          </p>
        ) : (
          realisations.map((r) => (
            <RealisationChip
              key={r.id}
              realisation={r}
              onClick={onChipClick ? (e) => onChipClick(r, e) : undefined}
            />
          ))
        )}
      </div>
    </div>
  )
}
