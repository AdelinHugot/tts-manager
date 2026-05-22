# Planning Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a calendar Planning page where réalisations are displayed by `publishDate` and unscheduled ones can be drag-and-dropped onto calendar days to assign a date.

**Architecture:** `Planning.tsx` (container, DndContext) receives `realisations` + `onPublishDateChange` from `AppLayout`. Left 2/3 is a `CalendarGrid` (month view, droppable `DayCell`s). Right 1/3 is `UnscheduledList` (draggable chips, also droppable to clear date). Draggable unit is `RealisationChip` (shared).

**Tech Stack:** React 18, TypeScript, TailwindCSS v3, @dnd-kit/core (already installed), Vitest + @testing-library/react

> **Note:** The spec mentions adding `publishedAt: Date | null` to `Realisation`, but the type already has `publishDate: string | null` (ISO format `'YYYY-MM-DD'`). This plan reuses `publishDate` as-is — no type change needed.

---

## Chunk 1: Foundation — routing, mock data enrichment

### Task 1: Add Planning route to AppLayout + Sidebar + placeholder page

**Files:**
- Create: `src/pages/Planning.tsx`
- Modify: `src/components/layout/AppLayout.tsx`
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/data/mock.ts`
- Create: `src/test/PlanningPage.test.tsx`

**Context:**
- `AppLayout.tsx` already manages `realisations` state and passes it to multiple pages. Follow the same pattern.
- `Sidebar.tsx` has a `NAV_ITEMS` array of `{ id, label, icon }` — add Planning after Analytics.
- `MOCK_REALISATIONS` in `src/data/mock.ts` currently has only 1 unscheduled entry (r6). Add 3 more so the unscheduled column has content.
- `publishDate` is `string | null` in ISO format (`'2026-05-22'`).

- [ ] **Step 1: Write the failing test**

```tsx
// src/test/PlanningPage.test.tsx
import { render, screen } from '@testing-library/react'
import Planning from '../pages/Planning'
import { MOCK_REALISATIONS } from '../data/mock'

const noop = () => {}

test('renders Planning page header', () => {
  render(
    <Planning
      realisations={MOCK_REALISATIONS}
      onPublishDateChange={noop}
    />
  )
  expect(screen.getByText('Planning')).toBeInTheDocument()
})

test('shows current month and year in calendar header', () => {
  render(
    <Planning
      realisations={MOCK_REALISATIONS}
      onPublishDateChange={noop}
    />
  )
  // Should show something like "Mai 2026"
  const now = new Date()
  const monthLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  // Capitalize first letter
  const capitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)
  expect(screen.getByText(capitalized)).toBeInTheDocument()
})

test('shows unscheduled section', () => {
  render(
    <Planning
      realisations={MOCK_REALISATIONS}
      onPublishDateChange={noop}
    />
  )
  expect(screen.getByText(/Sans date/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/test/PlanningPage.test.tsx
```
Expected: FAIL — "Cannot find module '../pages/Planning'"

- [ ] **Step 3: Add 3 more unscheduled mock réalisations in `src/data/mock.ts`**

Add after r6:
```ts
  {
    id: 'r7',
    title: 'Diffuseur — ambiance soirée',
    status: 'a_tourner',
    productId: 'p4',
    publishDate: null,
    notes: '',
    rushIds: [],
    createdAt: '2026-05-08',
  },
  {
    id: 'r8',
    title: 'Crème — routine nuit',
    status: 'script',
    productId: 'p1',
    publishDate: null,
    notes: '',
    rushIds: [],
    createdAt: '2026-05-09',
  },
  {
    id: 'r9',
    title: 'Montre — outfit business',
    status: 'a_monter',
    productId: 'p3',
    publishDate: null,
    notes: '',
    rushIds: [],
    createdAt: '2026-05-10',
  },
```

- [ ] **Step 4: Create `src/pages/Planning.tsx` placeholder**

```tsx
// src/pages/Planning.tsx
import type { Realisation } from '../types/realisation'

type Props = {
  realisations: Realisation[]
  onPublishDateChange: (id: string, date: string | null) => void
}

export default function Planning({ realisations, onPublishDateChange: _onChange }: Props) {
  const now = new Date()
  const monthLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const capitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

  const unscheduled = realisations.filter((r) => r.publishDate === null)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Planning</h1>
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">{capitalized}</p>
          </div>
        </div>
        <div className="w-72">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Sans date ({unscheduled.length})</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Add Planning nav item to `src/components/layout/Sidebar.tsx`**

Add after the Analytics entry in `NAV_ITEMS`:
```tsx
  {
    id: 'planning',
    label: 'Planning',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M2 8h14" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="5" y="11" width="2" height="2" rx="0.5" fill="currentColor"/>
        <rect x="8.5" y="11" width="2" height="2" rx="0.5" fill="currentColor"/>
      </svg>
    ),
  },
```

- [ ] **Step 6: Wire Planning in `src/components/layout/AppLayout.tsx`**

Add import:
```tsx
import Planning from '../../pages/Planning'
```

Add handler (after `handleRealisationStatusChange`):
```tsx
  function handlePublishDateChange(id: string, date: string | null) {
    setRealisations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, publishDate: date } : r))
    )
  }
```

Add route (after `{activePage === 'produits' && <Produits />}`):
```tsx
        {activePage === 'planning' && (
          <Planning
            realisations={realisations}
            onPublishDateChange={handlePublishDateChange}
          />
        )}
```

- [ ] **Step 7: Run tests to verify they pass**

```bash
npx vitest run src/test/PlanningPage.test.tsx
```
Expected: 3 tests PASS

- [ ] **Step 8: Run full test suite to check no regressions**

```bash
npx vitest run
```
Expected: all existing tests still passing

- [ ] **Step 9: Commit**

```bash
git add src/pages/Planning.tsx src/components/layout/AppLayout.tsx src/components/layout/Sidebar.tsx src/data/mock.ts src/test/PlanningPage.test.tsx
git commit -m "feat: add Planning page skeleton with routing and nav"
```

---

## Chunk 2: Calendar display

### Task 2: Calendar utility functions

**Files:**
- Create: `src/utils/calendarUtils.ts`
- Create: `src/test/calendarUtils.test.ts`

**Context:**
- Calendar needs a 7-column grid (Mon–Sun). Each row = 1 week.
- `buildCalendarWeeks` returns an array of weeks, each week = 7 `Date` objects (including padding days from adjacent months).
- `isSameDay` compares two dates by calendar day.
- `toISODateString` formats `Date` → `'YYYY-MM-DD'` (for matching `publishDate`).
- French locale: week starts on Monday (index 1). Padding: `(dayOfWeek + 6) % 7` gives Mon=0.

- [ ] **Step 1: Write the failing tests**

```ts
// src/test/calendarUtils.test.ts
import { buildCalendarWeeks, isSameDay, toISODateString } from '../utils/calendarUtils'

test('buildCalendarWeeks returns array of 7-element arrays', () => {
  const weeks = buildCalendarWeeks(2026, 4) // May 2026 (month is 0-indexed)
  for (const week of weeks) {
    expect(week).toHaveLength(7)
  }
})

test('buildCalendarWeeks includes all days of the target month', () => {
  const weeks = buildCalendarWeeks(2026, 4) // May 2026
  const allDays = weeks.flat()
  const mayDays = allDays.filter((d) => d.getMonth() === 4 && d.getFullYear() === 2026)
  expect(mayDays).toHaveLength(31) // May has 31 days
})

test('buildCalendarWeeks first cell is Monday', () => {
  const weeks = buildCalendarWeeks(2026, 4) // May 2026 starts on Friday
  const firstCell = weeks[0][0]
  expect(firstCell.getDay()).toBe(1) // Monday = 1
})

test('isSameDay returns true for same date', () => {
  const a = new Date(2026, 4, 15)
  const b = new Date(2026, 4, 15, 12, 30)
  expect(isSameDay(a, b)).toBe(true)
})

test('isSameDay returns false for different dates', () => {
  const a = new Date(2026, 4, 15)
  const b = new Date(2026, 4, 16)
  expect(isSameDay(a, b)).toBe(false)
})

test('toISODateString formats correctly', () => {
  expect(toISODateString(new Date(2026, 4, 5))).toBe('2026-05-05')
  expect(toISODateString(new Date(2026, 0, 1))).toBe('2026-01-01')
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npx vitest run src/test/calendarUtils.test.ts
```
Expected: FAIL — "Cannot find module '../utils/calendarUtils'"

- [ ] **Step 3: Implement `src/utils/calendarUtils.ts`**

```ts
// src/utils/calendarUtils.ts

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

  // Mon=0, Tue=1, ..., Sun=6  (getDay() returns 0=Sun, so we shift)
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const endOffset = (7 - ((lastOfMonth.getDay() + 6) % 7 + 1)) % 7

  const start = new Date(year, month, 1 - startOffset)
  const totalDays = lastOfMonth.getDate() + startOffset + endOffset
  const weeks: Date[][] = []

  for (let i = 0; i < totalDays; i += 7) {
    const week: Date[] = []
    for (let j = 0; j < 7; j++) {
      week.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i + j))
    }
    weeks.push(week)
  }

  return weeks
}

/**
 * Returns true if two dates fall on the same calendar day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * Formats a Date as 'YYYY-MM-DD' (matches Realisation.publishDate format).
 */
export function toISODateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/test/calendarUtils.test.ts
```
Expected: 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/calendarUtils.ts src/test/calendarUtils.test.ts
git commit -m "feat: add calendar utility functions"
```

---

### Task 3: RealisationChip component

**Files:**
- Create: `src/components/planning/RealisationChip.tsx`
- Create: `src/test/RealisationChip.test.tsx`

**Context:**
- Used both in `DayCell` (inside calendar) and `UnscheduledList` (right column).
- Must be `useDraggable` from @dnd-kit/core. Pattern: `useDraggable({ id: realisation.id })`.
- Renders: `[● Titre]` — a colored dot + truncated title.
- Status dot color: `STATUS_COLORS[realisation.status].dot` → Tailwind class like `bg-emerald-500`.
- When `isDragging`, apply `opacity-50` to the chip.
- KanbanView uses the same pattern — see `src/components/realisation/KanbanView.tsx` for reference.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/test/RealisationChip.test.tsx
import { render, screen } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import RealisationChip from '../components/planning/RealisationChip'
import { MOCK_REALISATIONS } from '../data/mock'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <DndContext>{children}</DndContext>
}

test('renders realisation title', () => {
  render(
    <Wrapper>
      <RealisationChip realisation={MOCK_REALISATIONS[0]} />
    </Wrapper>
  )
  expect(screen.getByText('Unboxing crème hydratante')).toBeInTheDocument()
})

test('renders status dot with correct color class', () => {
  render(
    <Wrapper>
      <RealisationChip realisation={MOCK_REALISATIONS[0]} />
    </Wrapper>
  )
  // MOCK_REALISATIONS[0] has status 'publiee' → dot class bg-emerald-500
  const dot = document.querySelector('.bg-emerald-500')
  expect(dot).toBeInTheDocument()
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npx vitest run src/test/RealisationChip.test.tsx
```
Expected: FAIL — "Cannot find module"

- [ ] **Step 3: Implement `src/components/planning/RealisationChip.tsx`**

```tsx
// src/components/planning/RealisationChip.tsx
import { useDraggable } from '@dnd-kit/core'
import type { Realisation } from '../../types/realisation'
import { STATUS_COLORS } from '../../types/realisation'

type Props = {
  realisation: Realisation
}

export default function RealisationChip({ realisation }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: realisation.id,
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  const dotClass = STATUS_COLORS[realisation.status].dot

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-100 rounded-lg text-xs font-medium text-slate-700 cursor-grab select-none shadow-sm hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
      <span className="truncate max-w-[120px]">{realisation.title}</span>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/test/RealisationChip.test.tsx
```
Expected: 2 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/planning/RealisationChip.tsx src/test/RealisationChip.test.tsx
git commit -m "feat: add RealisationChip draggable component"
```

---

### Task 4: DayCell component

**Files:**
- Create: `src/components/planning/DayCell.tsx`
- Create: `src/test/DayCell.test.tsx`

**Context:**
- Each cell in the calendar grid represents one day.
- Uses `useDroppable({ id: toISODateString(date) })` from @dnd-kit/core.
- `isCurrentMonth` prop: when `false`, render with `opacity-40` and do NOT make it droppable.
- Shows the day number + a list of `RealisationChip` components for réalisations on that day.
- When `isOver` (hovered by a draggable), show `bg-brand/5` background.
- A `DayCell` is "highlighted" (today) when date matches today's date: add `ring-2 ring-brand/30` on the day number.
- Min height: `min-h-[90px]` so empty days have visible height.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/test/DayCell.test.tsx
import { render, screen } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import DayCell from '../components/planning/DayCell'
import { MOCK_REALISATIONS } from '../data/mock'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <DndContext>{children}</DndContext>
}

test('renders day number', () => {
  render(
    <Wrapper>
      <DayCell
        date={new Date(2026, 4, 15)}
        realisations={[]}
        isCurrentMonth={true}
      />
    </Wrapper>
  )
  expect(screen.getByText('15')).toBeInTheDocument()
})

test('renders chips for realisations on that day', () => {
  const rWithDate = { ...MOCK_REALISATIONS[2], publishDate: '2026-05-15' }
  render(
    <Wrapper>
      <DayCell
        date={new Date(2026, 4, 15)}
        realisations={[rWithDate]}
        isCurrentMonth={true}
      />
    </Wrapper>
  )
  expect(screen.getByText('Review montre — lifestyle morning')).toBeInTheDocument()
})

test('out-of-month cell has reduced opacity class', () => {
  const { container } = render(
    <Wrapper>
      <DayCell
        date={new Date(2026, 3, 30)}
        realisations={[]}
        isCurrentMonth={false}
      />
    </Wrapper>
  )
  expect(container.firstChild).toHaveClass('opacity-40')
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npx vitest run src/test/DayCell.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Implement `src/components/planning/DayCell.tsx`**

```tsx
// src/components/planning/DayCell.tsx
import { useDroppable } from '@dnd-kit/core'
import type { Realisation } from '../../types/realisation'
import { toISODateString, isSameDay } from '../../utils/calendarUtils'
import RealisationChip from './RealisationChip'

type Props = {
  date: Date
  realisations: Realisation[]
  isCurrentMonth: boolean
}

export default function DayCell({ date, realisations, isCurrentMonth }: Props) {
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
        isCurrentMonth ? '' : 'opacity-40'
      } ${isOver ? 'bg-brand/5' : ''}`}
    >
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1 ${
          today
            ? 'bg-brand text-white'
            : 'text-slate-500'
        }`}
      >
        {date.getDate()}
      </span>
      <div className="flex flex-col gap-0.5">
        {realisations.map((r) => (
          <RealisationChip key={r.id} realisation={r} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/test/DayCell.test.tsx
```
Expected: 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/planning/DayCell.tsx src/test/DayCell.test.tsx
git commit -m "feat: add DayCell droppable calendar component"
```

---

### Task 5: CalendarGrid component

**Files:**
- Create: `src/components/planning/CalendarGrid.tsx`
- Create: `src/test/CalendarGrid.test.tsx`

**Context:**
- Receives `realisations`, `currentMonth: Date`, `onMonthChange: (d: Date) => void`.
- Uses `buildCalendarWeeks(year, month)` to compute the grid.
- Header: `← <Mois Année capitalisé> →` + day-of-week column labels `Lun Mar Mer Jeu Ven Sam Dim`.
- Passes each `DayCell` the réalisations for that day (filter by `publishDate === toISODateString(date)`).
- `isCurrentMonth`: `date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear()`.
- Navigation: `← → ` buttons call `onMonthChange` with a new `Date` offset by ±1 month.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/test/CalendarGrid.test.tsx
import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import CalendarGrid from '../components/planning/CalendarGrid'
import { MOCK_REALISATIONS } from '../data/mock'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <DndContext>{children}</DndContext>
}

test('renders day-of-week headers', () => {
  render(
    <Wrapper>
      <CalendarGrid
        realisations={MOCK_REALISATIONS}
        currentMonth={new Date(2026, 4, 1)}
        onMonthChange={() => {}}
      />
    </Wrapper>
  )
  expect(screen.getByText('Lun')).toBeInTheDocument()
  expect(screen.getByText('Dim')).toBeInTheDocument()
})

test('renders month label in header', () => {
  render(
    <Wrapper>
      <CalendarGrid
        realisations={MOCK_REALISATIONS}
        currentMonth={new Date(2026, 4, 1)}
        onMonthChange={() => {}}
      />
    </Wrapper>
  )
  expect(screen.getByText('Mai 2026')).toBeInTheDocument()
})

test('calls onMonthChange with next month on → click', () => {
  const onMonthChange = vi.fn()
  render(
    <Wrapper>
      <CalendarGrid
        realisations={MOCK_REALISATIONS}
        currentMonth={new Date(2026, 4, 1)}
        onMonthChange={onMonthChange}
      />
    </Wrapper>
  )
  fireEvent.click(screen.getByLabelText('Mois suivant'))
  expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 5, 1))
})

test('calls onMonthChange with previous month on ← click', () => {
  const onMonthChange = vi.fn()
  render(
    <Wrapper>
      <CalendarGrid
        realisations={MOCK_REALISATIONS}
        currentMonth={new Date(2026, 4, 1)}
        onMonthChange={onMonthChange}
      />
    </Wrapper>
  )
  fireEvent.click(screen.getByLabelText('Mois précédent'))
  expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 3, 1))
})

test('renders a chip for a realisation in its correct month', () => {
  render(
    <Wrapper>
      <CalendarGrid
        realisations={MOCK_REALISATIONS}
        currentMonth={new Date(2026, 4, 1)}
        onMonthChange={() => {}}
      />
    </Wrapper>
  )
  // r2: publishDate '2026-05-10', title 'GRWM avec le sac en cuir'
  expect(screen.getByText('GRWM avec le sac en cuir')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npx vitest run src/test/CalendarGrid.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Implement `src/components/planning/CalendarGrid.tsx`**

```tsx
// src/components/planning/CalendarGrid.tsx
import type { Realisation } from '../../types/realisation'
import { buildCalendarWeeks, toISODateString } from '../../utils/calendarUtils'
import DayCell from './DayCell'

const DAY_HEADERS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

type Props = {
  realisations: Realisation[]
  currentMonth: Date
  onMonthChange: (d: Date) => void
}

export default function CalendarGrid({ realisations, currentMonth, onMonthChange }: Props) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const weeks = buildCalendarWeeks(year, month)

  const monthLabel = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const capitalized = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

  function prevMonth() {
    onMonthChange(new Date(year, month - 1, 1))
  }

  function nextMonth() {
    onMonthChange(new Date(year, month + 1, 1))
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button
          onClick={prevMonth}
          aria-label="Mois précédent"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          ←
        </button>
        <h2 className="text-sm font-semibold text-slate-700">{capitalized}</h2>
        <button
          onClick={nextMonth}
          aria-label="Mois suivant"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          →
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-slate-400 border-r border-slate-100 last:border-r-0">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
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
            />
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/test/CalendarGrid.test.tsx
```
Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/planning/CalendarGrid.tsx src/test/CalendarGrid.test.tsx
git commit -m "feat: add CalendarGrid month view component"
```

---

## Chunk 3: Drag-and-drop wiring

### Task 6: UnscheduledList component

**Files:**
- Create: `src/components/planning/UnscheduledList.tsx`
- Create: `src/test/UnscheduledList.test.tsx`

**Context:**
- Shows all réalisations with `publishDate === null`.
- Makes the entire column a **droppable zone** with id `"unscheduled"` — dropping a chip here sets `publishDate = null`.
- Highlights with `bg-brand/5` when a chip is hovered over it.
- Header: `"Sans date (N)"` where N = count of unscheduled.
- Each item: a `RealisationChip`.
- If 0 unscheduled: show empty state text `"Toutes les vidéos ont une date 🎉"`.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/test/UnscheduledList.test.tsx
import { render, screen } from '@testing-library/react'
import { DndContext } from '@dnd-kit/core'
import UnscheduledList from '../components/planning/UnscheduledList'
import { MOCK_REALISATIONS } from '../data/mock'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <DndContext>{children}</DndContext>
}

test('shows count of unscheduled realisations', () => {
  const unscheduled = MOCK_REALISATIONS.filter((r) => r.publishDate === null)
  render(
    <Wrapper>
      <UnscheduledList realisations={unscheduled} />
    </Wrapper>
  )
  expect(screen.getByText(`Sans date (${unscheduled.length})`)).toBeInTheDocument()
})

test('renders chips for each unscheduled realisation', () => {
  const unscheduled = MOCK_REALISATIONS.filter((r) => r.publishDate === null)
  render(
    <Wrapper>
      <UnscheduledList realisations={unscheduled} />
    </Wrapper>
  )
  for (const r of unscheduled) {
    expect(screen.getByText(r.title)).toBeInTheDocument()
  }
})

test('shows empty state when no unscheduled realisations', () => {
  render(
    <Wrapper>
      <UnscheduledList realisations={[]} />
    </Wrapper>
  )
  expect(screen.getByText(/Toutes les vidéos ont une date/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npx vitest run src/test/UnscheduledList.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Implement `src/components/planning/UnscheduledList.tsx`**

```tsx
// src/components/planning/UnscheduledList.tsx
import { useDroppable } from '@dnd-kit/core'
import type { Realisation } from '../../types/realisation'
import RealisationChip from './RealisationChip'

type Props = {
  realisations: Realisation[]
}

export default function UnscheduledList({ realisations }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'unscheduled' })

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <h3 className="text-sm font-semibold text-slate-700">
          Sans date ({realisations.length})
        </h3>
      </div>

      {/* Droppable list */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-3 flex flex-col gap-2 transition-colors ${
          isOver ? 'bg-brand/5' : ''
        }`}
      >
        {realisations.length === 0 ? (
          <p className="text-xs text-slate-400 text-center mt-4">
            Toutes les vidéos ont une date 🎉
          </p>
        ) : (
          realisations.map((r) => <RealisationChip key={r.id} realisation={r} />)
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/test/UnscheduledList.test.tsx
```
Expected: 3 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/planning/UnscheduledList.tsx src/test/UnscheduledList.test.tsx
git commit -m "feat: add UnscheduledList droppable component"
```

---

### Task 7: Wire DnD in Planning.tsx

**Files:**
- Modify: `src/pages/Planning.tsx`
- Modify: `src/test/PlanningPage.test.tsx`

**Context:**
- `Planning.tsx` is the DnD root: wraps everything in `DndContext` + `DragOverlay`.
- `DragOverlay` renders a ghost chip while dragging (prevents layout shift on original).
- `onDragStart`: track `activeId` (the realisation id being dragged).
- `onDragEnd`: resolve which droppable received the drop, call `onPublishDateChange(id, dateStr | null)`.
- `sensors`: use `PointerSensor` with `activationConstraint: { distance: 5 }` (prevents accidental drags on click). Pattern from `KanbanView.tsx`.
- `DragOverlay` renders `RealisationChip` for the active realisation (without `useDraggable` — pass a special `isOverlay` prop, or just copy the chip's visual appearance inline). Simplest: wrap the chip in a `div` inside `DragOverlay` since `DragOverlay` doesn't re-trigger `useDraggable`.

**Important:** `DragOverlay` content should NOT use `useDraggable` (it would conflict). Render the chip visuals directly.

- [ ] **Step 1: Update the existing Planning tests (add DnD wrapper test)**

Add to `src/test/PlanningPage.test.tsx`:
```tsx
import { act, fireEvent } from '@testing-library/react'

test('renders calendar grid day headers', () => {
  render(
    <Planning
      realisations={MOCK_REALISATIONS}
      onPublishDateChange={noop}
    />
  )
  expect(screen.getByText('Lun')).toBeInTheDocument()
  expect(screen.getByText('Dim')).toBeInTheDocument()
})

test('shows unscheduled realisation chips in right column', () => {
  const unscheduled = MOCK_REALISATIONS.filter((r) => r.publishDate === null)
  render(
    <Planning
      realisations={MOCK_REALISATIONS}
      onPublishDateChange={noop}
    />
  )
  // At least one unscheduled chip should appear
  expect(screen.getByText(unscheduled[0].title)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run updated tests to verify new ones fail**

```bash
npx vitest run src/test/PlanningPage.test.tsx
```
Expected: first 3 PASS, 2 new FAIL (CalendarGrid/UnscheduledList not yet in page)

- [ ] **Step 3: Rewrite `src/pages/Planning.tsx` with full implementation**

```tsx
// src/pages/Planning.tsx
import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { Realisation } from '../types/realisation'
import { STATUS_COLORS } from '../types/realisation'
import CalendarGrid from '../components/planning/CalendarGrid'
import UnscheduledList from '../components/planning/UnscheduledList'

type Props = {
  realisations: Realisation[]
  onPublishDateChange: (id: string, date: string | null) => void
}

export default function Planning({ realisations, onPublishDateChange }: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const unscheduled = realisations.filter((r) => r.publishDate === null)
  const activeRealisation = activeId
    ? realisations.find((r) => r.id === activeId) ?? null
    : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const realisationId = String(active.id)
    const overId = String(over.id)

    if (overId === 'unscheduled') {
      onPublishDateChange(realisationId, null)
    } else {
      // overId is an ISO date string like '2026-05-15'
      onPublishDateChange(realisationId, overId)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Planning</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {realisations.length} réalisations au total
        </p>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 items-start">
          {/* Calendar — left 2/3 */}
          <div className="flex-1 min-w-0">
            <CalendarGrid
              realisations={realisations}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </div>

          {/* Unscheduled — right 1/3 */}
          <div className="w-72 flex-shrink-0" style={{ height: 'calc(100vh - 220px)' }}>
            <UnscheduledList realisations={unscheduled} />
          </div>
        </div>

        {/* Drag overlay ghost */}
        <DragOverlay>
          {activeRealisation && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-lg select-none opacity-90 cursor-grabbing">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  STATUS_COLORS[activeRealisation.status].dot
                }`}
              />
              <span className="truncate max-w-[120px]">{activeRealisation.title}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
```

- [ ] **Step 4: Run all Planning tests**

```bash
npx vitest run src/test/PlanningPage.test.tsx
```
Expected: 5 tests PASS

- [ ] **Step 5: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass (no regressions)

- [ ] **Step 6: Commit**

```bash
git add src/pages/Planning.tsx src/test/PlanningPage.test.tsx
git commit -m "feat: wire DnD in Planning page — calendar + unscheduled column"
```

---

## Final verification

- [ ] **Run full test suite one last time**

```bash
npx vitest run
```
Expected: all tests pass

- [ ] **Manual smoke test** — navigate to Planning in the app, verify:
  - Calendar shows current month with réalisations on correct days
  - Right column shows unscheduled réalisations
  - Dragging a chip from right column to a calendar day assigns the date (chip disappears from right column, appears on calendar)
  - Dragging a chip from calendar back to right column clears the date
  - Month navigation `← →` works
  - Today's date is highlighted
