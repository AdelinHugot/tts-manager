import { useEffect, useRef, useState } from 'react'
import type { Period } from '../../types/analytics'

export type DateRange = { start: Date; end: Date }

export type PresetPeriod = { label: string; value: Period }

type Props = {
  value: DateRange | null
  activePeriod: Period | null
  periods: PresetPeriod[]
  onApply: (range: DateRange) => void
  onSelectPeriod: (p: Period) => void
  onClear: () => void
  onClose: () => void
}

const DAY_HEADERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function sod(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function sameDay(a: Date, b: Date): boolean {
  return a.getTime() === sod(b).getTime()
}

function buildMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const offset = (firstDay.getDay() + 6) % 7
  const days: (Date | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
  while (days.length % 7 !== 0) days.push(null)
  return days
}

function monthLabel(year: number, month: number): string {
  const s = new Date(year, month, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function DateRangePicker({
  value,
  activePeriod,
  periods,
  onApply,
  onSelectPeriod,
  onClear,
  onClose,
}: Props) {
  const [leftYear, setLeftYear] = useState(2026)
  const [leftMonth, setLeftMonth] = useState(3) // April — last two months of mock data

  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1

  const [pickStart, setPickStart] = useState<Date | null>(null)
  const [hover, setHover] = useState<Date | null>(null)

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const today = sod(new Date())

  const display: DateRange | null = (() => {
    if (pickStart) {
      const end = hover ? sod(hover) : sod(pickStart)
      const s = sod(pickStart)
      return s <= end ? { start: s, end } : { start: end, end: s }
    }
    return value ? { start: sod(value.start), end: sod(value.end) } : null
  })()

  function handleDayClick(date: Date) {
    if (!pickStart) {
      setPickStart(date)
      setHover(date)
    } else {
      const a = sod(pickStart)
      const b = sod(date)
      const range = a <= b ? { start: a, end: b } : { start: b, end: a }
      onApply(range)
      setPickStart(null)
      setHover(null)
    }
  }

  function prevMonth() {
    if (leftMonth === 0) { setLeftYear(y => y - 1); setLeftMonth(11) }
    else setLeftMonth(m => m - 1)
  }
  function nextMonth() {
    if (leftMonth === 11) { setLeftYear(y => y + 1); setLeftMonth(0) }
    else setLeftMonth(m => m + 1)
  }

  function renderMonth(year: number, month: number, showPrev: boolean, showNext: boolean) {
    const days = buildMonthDays(year, month)
    return (
      <div className="w-[224px]">
        <div className="flex items-center justify-between mb-2 h-8">
          {showPrev ? (
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 text-lg transition-colors">‹</button>
          ) : <div className="w-8" />}
          <span className="text-sm font-semibold text-slate-700">{monthLabel(year, month)}</span>
          {showNext ? (
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 text-lg transition-colors">›</button>
          ) : <div className="w-8" />}
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAY_HEADERS.map((h, i) => (
            <div key={i} className="text-center text-[10px] font-semibold text-slate-400 py-1">{h}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((date, i) => {
            if (!date) return <div key={i} className="h-8" />
            const d = sod(date)
            const isStart = display ? sameDay(d, display.start) : false
            const isEnd = display ? sameDay(d, display.end) : false
            const isInRange = display ? d > display.start && d < display.end : false
            const isToday = sameDay(d, today)
            const inBand = isStart || isEnd || isInRange

            return (
              <div key={i} className="relative h-8 flex items-center justify-center">
                {inBand && !(isStart && isEnd) && (
                  <div className={`absolute inset-y-[2px] bg-brand/10 ${
                    isStart ? 'left-1/2 right-0' :
                    isEnd   ? 'left-0 right-1/2' :
                              'left-0 right-0'
                  }`} />
                )}
                <button
                  onClick={() => handleDayClick(date)}
                  onMouseEnter={() => pickStart && setHover(date)}
                  className={`relative z-10 w-7 h-7 rounded-full text-xs font-medium transition-colors select-none
                    ${isStart || isEnd ? 'bg-brand text-white shadow-sm' :
                      isInRange ? 'text-brand' :
                      isToday ? 'ring-1 ring-brand/40 text-brand font-semibold' :
                      'text-slate-700 hover:bg-slate-100'}
                  `}
                >
                  {date.getDate()}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  function formatShort(d: Date) {
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 select-none overflow-hidden"
      onMouseLeave={() => pickStart && setHover(pickStart)}
    >
      <div className="flex">
        {/* Left column — preset periods */}
        <div className="w-36 border-r border-slate-100 py-3 flex flex-col gap-0.5 px-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide px-2 mb-1">Périodes</p>
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => { onSelectPeriod(p.value); setPickStart(null); setHover(null) }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePeriod === p.value && !value
                  ? 'bg-brand/10 text-brand font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Right — calendars + footer */}
        <div className="flex flex-col p-5">
          {/* Two months */}
          <div className="flex gap-4 items-start">
            {renderMonth(leftYear, leftMonth, true, false)}
            <div className="w-px self-stretch bg-slate-100 mx-1" />
            {renderMonth(rightYear, rightMonth, false, true)}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => { onClear(); setPickStart(null); setHover(null) }}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Effacer
            </button>

            <div className="text-xs text-center">
              {pickStart ? (
                <span className="text-brand font-medium animate-pulse">
                  {display ? `${formatShort(display.start)} → ${formatShort(display.end)}` : 'Sélectionnez la date de fin'}
                </span>
              ) : display ? (
                <span className="text-slate-500">{formatShort(display.start)} → {formatShort(display.end)}</span>
              ) : (
                <span className="text-slate-400 italic">Cliquez une date de début</span>
              )}
            </div>

            <button
              onClick={onClose}
              disabled={!!pickStart}
              className="text-xs font-semibold text-white bg-brand px-3 py-1.5 rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-40 disabled:cursor-default"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
