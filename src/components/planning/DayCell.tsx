import { useDroppable } from '@dnd-kit/core'
import type { Realisation } from '../../types/realisation'
import { toISODateString, isSameDay } from '../../utils/calendarUtils'
import RealisationChip from './RealisationChip'

type Props = {
  date: Date
  realisations: Realisation[]
  isCurrentMonth: boolean
  onChipClick?: (r: Realisation, e: React.MouseEvent<HTMLDivElement>) => void
}

export default function DayCell({ date, realisations, isCurrentMonth, onChipClick }: Props) {
  const dateStr = toISODateString(date)
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
    disabled: !isCurrentMonth,
  })

  const today = isSameDay(date, new Date())

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[90px] p-1.5 border-r border-b border-slate-100 transition-colors ${
        !isCurrentMonth ? 'opacity-40' : ''
      } ${isOver ? 'bg-brand/5' : ''}`}
    >
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1 ${
          today ? 'bg-brand text-white' : 'text-slate-500'
        }`}
      >
        {date.getDate()}
      </span>
      <div className="flex flex-col gap-0.5">
        {realisations.map((r) => (
          <RealisationChip
            key={r.id}
            realisation={r}
            onClick={onChipClick ? (e) => onChipClick(r, e) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
