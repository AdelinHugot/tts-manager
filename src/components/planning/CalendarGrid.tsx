import type { Realisation } from '../../types/realisation'
import { buildCalendarWeeks, toISODateString } from '../../utils/calendarUtils'
import DayCell from './DayCell'

const DAY_HEADERS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

type Props = {
  realisations: Realisation[]
  currentMonth: Date
  onMonthChange: (d: Date) => void
  onChipClick?: (r: Realisation, e: React.MouseEvent<HTMLDivElement>) => void
}

export default function CalendarGrid({ realisations, currentMonth, onMonthChange, onChipClick }: Props) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const weeks = buildCalendarWeeks(year, month)

  const monthLabel = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const capitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button
          onClick={() => onMonthChange(new Date(year, month - 1, 1))}
          aria-label="Mois précédent"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors text-base"
        >
          ←
        </button>
        <h2 className="text-sm font-semibold text-slate-700">{capitalized}</h2>
        <button
          onClick={() => onMonthChange(new Date(year, month + 1, 1))}
          aria-label="Mois suivant"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors text-base"
        >
          →
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-semibold text-slate-400 border-r border-slate-100 last:border-r-0"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Weeks grid */}
      <div className="grid grid-cols-7">
        {weeks.flat().map((date) => {
          const dateStr = toISODateString(date)
          const isCurrentMonth = date.getMonth() === month && date.getFullYear() === year
          const dayRealisations = realisations.filter((r) => r.publishDate === dateStr)
          return (
            <DayCell
              key={dateStr}
              date={date}
              realisations={dayRealisations}
              isCurrentMonth={isCurrentMonth}
              onChipClick={onChipClick}
            />
          )
        })}
      </div>
    </div>
  )
}
