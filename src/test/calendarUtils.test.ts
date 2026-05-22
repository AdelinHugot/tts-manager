import { buildCalendarWeeks, isSameDay, toISODateString } from '../utils/calendarUtils'

test('buildCalendarWeeks returns array of 7-element arrays', () => {
  const weeks = buildCalendarWeeks(2026, 4) // May 2026
  for (const week of weeks) {
    expect(week).toHaveLength(7)
  }
})

test('buildCalendarWeeks includes all 31 days of May 2026', () => {
  const weeks = buildCalendarWeeks(2026, 4)
  const allDays = weeks.flat()
  const mayDays = allDays.filter((d) => d.getMonth() === 4 && d.getFullYear() === 2026)
  expect(mayDays).toHaveLength(31)
})

test('buildCalendarWeeks first cell is a Monday', () => {
  const weeks = buildCalendarWeeks(2026, 4) // May 2026 starts on Friday
  const firstCell = weeks[0][0]
  expect(firstCell.getDay()).toBe(1) // Monday = 1
})

test('buildCalendarWeeks last cell is a Sunday', () => {
  const weeks = buildCalendarWeeks(2026, 4)
  const lastWeek = weeks[weeks.length - 1]
  const lastCell = lastWeek[6]
  expect(lastCell.getDay()).toBe(0) // Sunday = 0
})

test('isSameDay returns true for same date different time', () => {
  const a = new Date(2026, 4, 15, 0, 0)
  const b = new Date(2026, 4, 15, 23, 59)
  expect(isSameDay(a, b)).toBe(true)
})

test('isSameDay returns false for adjacent days', () => {
  const a = new Date(2026, 4, 15)
  const b = new Date(2026, 4, 16)
  expect(isSameDay(a, b)).toBe(false)
})

test('toISODateString formats single-digit day and month with padding', () => {
  expect(toISODateString(new Date(2026, 0, 5))).toBe('2026-01-05')
})

test('toISODateString formats double-digit day and month', () => {
  expect(toISODateString(new Date(2026, 11, 25))).toBe('2026-12-25')
})
