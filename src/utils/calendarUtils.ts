/**
 * Returns an array of weeks for the given month.
 * Each week is an array of 7 Date objects (Mon–Sun).
 * Padding days from adjacent months are included.
 * @param year full year (e.g. 2026)
 * @param month 0-indexed month (0 = January)
 */
export function buildCalendarWeeks(year: number, month: number): Date[][] {
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth = new Date(year, month + 1, 0)

  // Mon=0 … Sun=6  (getDay() returns 0=Sun, so we shift)
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const endOffset = (7 - ((lastOfMonth.getDay() + 6) % 7 + 1)) % 7

  const totalDays = lastOfMonth.getDate() + startOffset + endOffset
  const weeks: Date[][] = []

  for (let i = 0; i < totalDays; i += 7) {
    const week: Date[] = []
    for (let j = 0; j < 7; j++) {
      week.push(new Date(year, month, 1 - startOffset + i + j))
    }
    weeks.push(week)
  }

  return weeks
}

/** Returns true if two dates fall on the same calendar day. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Formats a Date as 'YYYY-MM-DD' (matches Realisation.publishDate). */
export function toISODateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
