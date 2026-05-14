# Page Rushs — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a centralized Rushs page where videos are uploaded, displayed as list or 4:5 cards, and linked to Réalisations — replacing the embedded `RushFile` model with a global `Rush` pool.

**Architecture:** Rushes become top-level entities (`Rush` type) stored in `AppLayout` state and shared with both `RushsPage` and `RealisationPage`. `Realisation.rushes: RushFile[]` is replaced by `Realisation.rushIds: string[]`. Thumbnails and durations are extracted client-side via `HTMLVideoElement` + Canvas API. Drag-and-drop from Rushs page into `RealisationPanel` uses `dataTransfer`.

**Tech Stack:** React 18 + TypeScript, Vite/Vitest + @testing-library/react, Framer Motion, TailwindCSS v3, native HTML drag-and-drop.

**Spec:** `docs/superpowers/specs/2026-05-14-rushs-page-design.md`

---

## Chunk 1: Data Layer

### Task 1: Rush type + mock data migration

**Context:** `RushFile` in `realisation.ts` has no `duration` or `thumbnailUrl`. We create a standalone `Rush` type, remove `RushFile`, and migrate the entire codebase. `Realisation.rushes: RushFile[]` becomes `Realisation.rushIds: string[]`. Four component files use `r.rushes.length` — each becomes `r.rushIds.length`.

**Files:**
- Create: `src/types/rush.ts`
- Modify: `src/types/realisation.ts`
- Modify: `src/data/mock.ts`
- Modify: `src/components/realisation/ListView.tsx`
- Modify: `src/components/realisation/CardsView.tsx`
- Modify: `src/components/realisation/KanbanView.tsx`
- Modify: `src/pages/Realisation.tsx`
- Create: `src/test/RushType.test.ts`

---

- [ ] **Step 1 — Write failing test**

```ts
// src/test/RushType.test.ts
import { MOCK_RUSHES, MOCK_REALISATIONS } from '../data/mock'

test('MOCK_RUSHES exists and items have required fields', () => {
  expect(MOCK_RUSHES.length).toBeGreaterThan(0)
  for (const r of MOCK_RUSHES) {
    expect(r.id).toBeTruthy()
    expect(r.name).toBeTruthy()
    expect(typeof r.duration).toBe('number')
    expect(r.thumbnailUrl).toBeDefined()
    expect(typeof r.size).toBe('number')
  }
})

test('MOCK_REALISATIONS use rushIds (not rushes)', () => {
  for (const r of MOCK_REALISATIONS) {
    expect(Array.isArray(r.rushIds)).toBe(true)
    expect((r as any).rushes).toBeUndefined()
  }
})
```

- [ ] **Step 2 — Run test, verify it fails**

```bash
npx vitest run src/test/RushType.test.ts
```
Expected: FAIL — `MOCK_RUSHES` not exported, `rushIds` undefined.

- [ ] **Step 3 — Create `src/types/rush.ts`**

```ts
export type Rush = {
  id: string
  name: string
  url: string
  size: number
  duration: number     // seconds
  thumbnailUrl: string // base64 JPEG from Canvas or empty string for mock data
}
```

- [ ] **Step 4 — Update `src/types/realisation.ts`**

Remove the `RushFile` type entirely. Update `Realisation`:

```ts
// Remove these lines entirely:
// export type RushFile = { ... }

// Change Realisation type:
export type Realisation = {
  id: string
  title: string
  status: RealisationStatus
  productId: string
  publishDate: string | null
  notes: string
  rushIds: string[]   // was: rushes: RushFile[]
  createdAt: string
}
```

- [ ] **Step 5 — Update `src/data/mock.ts`**

Add `MOCK_RUSHES` and migrate `MOCK_REALISATIONS` to `rushIds`:

```ts
import type { Realisation, Product } from '../types/realisation'
import type { Rush } from '../types/rush'

export const MOCK_PRODUCTS: Product[] = [
  // ... unchanged
]

export const MOCK_RUSHES: Rush[] = [
  { id: 'f1', name: 'rush_01.mp4',         url: '#', size: 245_000_000, duration: 45, thumbnailUrl: '' },
  { id: 'f2', name: 'broll_01.mp4',        url: '#', size: 120_000_000, duration: 23, thumbnailUrl: '' },
  { id: 'f3', name: 'final_v2.mp4',        url: '#', size: 310_000_000, duration: 67, thumbnailUrl: '' },
  { id: 'f4', name: 'rush_matin_01.mp4',   url: '#', size: 450_000_000, duration: 89, thumbnailUrl: '' },
  { id: 'f5', name: 'rush_matin_02.mp4',   url: '#', size: 200_000_000, duration: 34, thumbnailUrl: '' },
]

export const MOCK_REALISATIONS: Realisation[] = [
  {
    id: 'r1',
    title: 'Unboxing crème hydratante',
    status: 'publiee',
    productId: 'p1',
    publishDate: '2026-04-20',
    notes: 'Très bon engagement, 42k vues en 48h.',
    rushIds: ['f1', 'f2'],
    createdAt: '2026-04-15',
  },
  {
    id: 'r2',
    title: 'GRWM avec le sac en cuir',
    status: 'a_publier',
    productId: 'p2',
    publishDate: '2026-05-10',
    notes: 'Penser à ajouter le lien produit en bio.',
    rushIds: ['f3'],
    createdAt: '2026-05-01',
  },
  {
    id: 'r3',
    title: 'Review montre — lifestyle morning',
    status: 'a_monter',
    productId: 'p3',
    publishDate: '2026-05-15',
    notes: '',
    rushIds: ['f4', 'f5'],
    createdAt: '2026-05-03',
  },
  {
    id: 'r4',
    title: 'Tuto diffuseur — 3 mélanges',
    status: 'script',
    productId: 'p4',
    publishDate: '2026-05-22',
    notes: 'Script en cours, angle bien-être + sommeil.',
    rushIds: [],
    createdAt: '2026-05-05',
  },
  {
    id: 'r5',
    title: 'Crème hydratante — before/after',
    status: 'a_tourner',
    productId: 'p1',
    publishDate: '2026-05-28',
    notes: '',
    rushIds: [],
    createdAt: '2026-05-06',
  },
  {
    id: 'r6',
    title: 'Sac en cuir — styling 5 tenues',
    status: 'a_tourner',
    productId: 'p2',
    publishDate: null,
    notes: '',
    rushIds: [],
    createdAt: '2026-05-07',
  },
]
```

- [ ] **Step 6 — Fix `src/components/realisation/ListView.tsx`**

Line 56-59: replace `r.rushes` with `r.rushIds`:

```tsx
<td className="px-5 py-4">
  {r.rushIds.length > 0 ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
      ▶ {r.rushIds.length} fichier{r.rushIds.length > 1 ? 's' : ''}
    </span>
  ) : (
    <span className="text-slate-300 text-xs">—</span>
  )}
</td>
```

- [ ] **Step 7 — Fix `src/components/realisation/CardsView.tsx`**

Replace every `r.rushes` with `r.rushIds` (3 occurrences at lines 30, 43, 46):

```tsx
// Line 30
{r.rushIds.length > 0 ? (
// Line 43
{r.rushIds.length > 0 && (
// Line 46
  {r.rushIds.length} rush{r.rushIds.length > 1 ? 's' : ''}
```

- [ ] **Step 8 — Fix `src/components/realisation/KanbanView.tsx`**

Line 65-66: replace `realisation.rushes` with `realisation.rushIds`:

```tsx
{realisation.rushIds.length > 0 && (
  <span className="text-xs text-slate-400">▶ {realisation.rushIds.length}</span>
)}
```

- [ ] **Step 9 — Fix `src/pages/Realisation.tsx`**

In `handleNew`, change `rushes: []` to `rushIds: []`:

```ts
const newReal: Realisation = {
  id: crypto.randomUUID(),
  title: 'Nouvelle réalisation',
  status: 'a_tourner',
  productId: MOCK_PRODUCTS[0].id,
  publishDate: null,
  notes: '',
  rushIds: [],
  createdAt: new Date().toISOString().split('T')[0],
}
```

- [ ] **Step 10 — Run full test suite**

```bash
npx vitest run
```

Expected: `RushType.test.ts` PASS. `RealisationPanel.test.tsx` may show TypeScript errors (props mismatch) — those will be fixed in Task 5. Other tests pass.

- [ ] **Step 11 — Commit**

```bash
git add src/types/rush.ts src/types/realisation.ts src/data/mock.ts \
        src/components/realisation/ListView.tsx src/components/realisation/CardsView.tsx \
        src/components/realisation/KanbanView.tsx src/pages/Realisation.tsx \
        src/test/RushType.test.ts
git commit -m "feat: introduce Rush type and migrate Realisation.rushIds"
```

---

### Task 2: videoMetadata utility

**Context:** Extracting the first frame and duration from a `File` requires `HTMLVideoElement` + Canvas. jsdom doesn't implement these, so tests mock `document.createElement`. The utility returns a Promise that resolves once the `seeked` event fires.

**Files:**
- Create: `src/utils/videoMetadata.ts`
- Create: `src/test/videoMetadata.test.ts`

---

- [ ] **Step 1 — Write failing tests**

```ts
// src/test/videoMetadata.test.ts
import { formatDuration, formatSize, extractVideoMetadata } from '../utils/videoMetadata'

test('formatDuration formats seconds to mm:ss', () => {
  expect(formatDuration(0)).toBe('0:00')
  expect(formatDuration(61)).toBe('1:01')
  expect(formatDuration(125)).toBe('2:05')
  expect(formatDuration(3599)).toBe('59:59')
})

test('formatSize formats bytes to human-readable', () => {
  expect(formatSize(500)).toBe('500 Ko')
  expect(formatSize(2_500_000)).toBe('2 Mo')
  expect(formatSize(1_500_000_000)).toBe('1.5 Go')
})

test('extractVideoMetadata resolves with duration and thumbnailUrl', async () => {
  const loadedListeners: Array<() => void> = []
  const seekedListeners: Array<() => void> = []

  const mockVideo = {
    duration: 42,
    videoWidth: 640,
    videoHeight: 480,
    preload: '',
    muted: false,
    playsInline: false,
    src: '',
    currentTime: 0,
    addEventListener: vi.fn((event: string, cb: () => void) => {
      if (event === 'loadedmetadata') loadedListeners.push(cb)
      if (event === 'seeked') seekedListeners.push(cb)
    }),
  }

  const mockCtx = { drawImage: vi.fn() }
  const mockCanvas = {
    width: 0,
    height: 0,
    getContext: vi.fn().mockReturnValue(mockCtx),
    toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,abc123'),
  }

  const originalCreate = document.createElement.bind(document)
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'video') return mockVideo as unknown as HTMLVideoElement
    if (tag === 'canvas') return mockCanvas as unknown as HTMLCanvasElement
    return originalCreate(tag)
  })
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

  const file = new File([''], 'test.mp4', { type: 'video/mp4' })
  const promise = extractVideoMetadata(file)

  // Simulate browser events
  loadedListeners.forEach((cb) => cb())
  seekedListeners.forEach((cb) => cb())

  const result = await promise

  expect(result.duration).toBe(42)
  expect(result.thumbnailUrl).toBe('data:image/jpeg;base64,abc123')
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')

  vi.restoreAllMocks()
})
```

- [ ] **Step 2 — Run test, verify it fails**

```bash
npx vitest run src/test/videoMetadata.test.ts
```
Expected: FAIL — `../utils/videoMetadata` not found.

- [ ] **Step 3 — Create `src/utils/videoMetadata.ts`**

```ts
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatSize(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} Go`
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} Mo`
  return `${(bytes / 1_000).toFixed(0)} Ko`
}

export function extractVideoMetadata(
  file: File
): Promise<{ duration: number; thumbnailUrl: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const video = document.createElement('video')

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = 0
    })

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 320
      canvas.height = video.videoHeight || 180
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(video as unknown as CanvasImageSource, 0, 0, canvas.width, canvas.height)
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8)
      URL.revokeObjectURL(objectUrl)
      resolve({ duration: video.duration, thumbnailUrl })
    })

    video.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error(`Failed to load video: ${file.name}`))
    })

    video.src = objectUrl
  })
}
```

- [ ] **Step 4 — Run tests, verify they pass**

```bash
npx vitest run src/test/videoMetadata.test.ts
```
Expected: 3/3 PASS.

- [ ] **Step 5 — Commit**

```bash
git add src/utils/videoMetadata.ts src/test/videoMetadata.test.ts
git commit -m "feat: add videoMetadata utility (extractVideoMetadata, formatDuration, formatSize)"
```

---

## Chunk 2: State Wiring + Component Updates

### Task 3: AppLayout state lift + Sidebar rushs item + RealisationPage props

**Context:** Both `RushsPage` and `RealisationPage` need access to the same `rushes` and `realisations` state. Currently `Realisation.tsx` owns its own state. We lift both states to `AppLayout`. The page components become stateless regarding data — they receive props and callbacks. The `PAGE_COMPONENTS` generic record is replaced with explicit conditional rendering (required to pass typed props). Sidebar gets a new `rushs` nav item between `realisation` and `produits`.

**Files:**
- Modify: `src/components/layout/AppLayout.tsx`
- Modify: `src/components/layout/Sidebar.tsx`
- Modify: `src/pages/Realisation.tsx`

---

- [ ] **Step 1 — Update `src/components/layout/Sidebar.tsx`**

Insert the `rushs` item in `NAV_ITEMS` between `realisation` and `produits`:

```tsx
  {
    id: 'rushs',
    label: 'Rushs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="4" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M1 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="4.5" cy="11" r="1" fill="currentColor"/>
        <circle cx="9" cy="11" r="1" fill="currentColor"/>
        <circle cx="13.5" cy="11" r="1" fill="currentColor"/>
      </svg>
    ),
  },
```

Place it so the array reads: `dashboard`, `analytics`, `realisation`, `rushs`, `produits`.

- [ ] **Step 2 — Update `src/pages/Realisation.tsx` to accept props**

Remove the direct imports of `MOCK_REALISATIONS`, `MOCK_PRODUCTS`. Rename `RealisationPage` export and change its signature to receive all data as props:

```tsx
import { useState } from 'react'
import type { Realisation, RealisationStatus, Product } from '../types/realisation'
import type { Rush } from '../types/rush'
import ViewSwitcher, { type ViewType } from '../components/realisation/ViewSwitcher'
import ListView from '../components/realisation/ListView'
import KanbanView from '../components/realisation/KanbanView'
import CardsView from '../components/realisation/CardsView'
import RealisationPanel from '../components/realisation/RealisationPanel'

type Props = {
  rushes: Rush[]
  onAddRush: (rush: Rush) => void
  realisations: Realisation[]
  products: Product[]
  onUpdate: (updated: Realisation) => void
  onStatusChange: (id: string, status: RealisationStatus) => void
  onNew: () => void
  initialSelectedId?: string | null
}

export default function RealisationPage({
  rushes,
  onAddRush,
  realisations,
  products,
  onUpdate,
  onStatusChange,
  onNew,
  initialSelectedId,
}: Props) {
  const [activeView, setActiveView] = useState<ViewType>('list')
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null)

  const selected = realisations.find((r) => r.id === selectedId) ?? null

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Réalisation</h1>
          <p className="text-sm text-slate-400 mt-0.5">{realisations.length} vidéos</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
          <button
            onClick={onNew}
            className="flex items-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Nouvelle vidéo
          </button>
        </div>
      </div>

      {activeView === 'list' && (
        <ListView realisations={realisations} products={products} onSelect={(r) => setSelectedId(r.id)} />
      )}
      {activeView === 'kanban' && (
        <KanbanView
          realisations={realisations}
          products={products}
          onSelect={(r) => setSelectedId(r.id)}
          onStatusChange={onStatusChange}
        />
      )}
      {activeView === 'cards' && (
        <CardsView realisations={realisations} products={products} onSelect={(r) => setSelectedId(r.id)} />
      )}

      <RealisationPanel
        realisation={selected}
        products={products}
        rushes={rushes}
        onAddRush={onAddRush}
        onClose={() => setSelectedId(null)}
        onUpdate={onUpdate}
      />
    </div>
  )
}
```

- [ ] **Step 3 — Rewrite `src/components/layout/AppLayout.tsx`**

Lift state, define handlers, render pages with explicit conditionals:

```tsx
import { useState } from 'react'
import Sidebar from './Sidebar'
import Dashboard from '../../pages/Dashboard'
import Analytics from '../../pages/Analytics'
import RealisationPage from '../../pages/Realisation'
import Produits from '../../pages/Produits'
import Parametres from '../../pages/Parametres'
import type { Realisation, RealisationStatus } from '../../types/realisation'
import type { Rush } from '../../types/rush'
import { MOCK_REALISATIONS, MOCK_PRODUCTS, MOCK_RUSHES } from '../../data/mock'

export default function AppLayout() {
  const [activePage, setActivePage] = useState('realisation')
  const [rushes, setRushes] = useState<Rush[]>(MOCK_RUSHES)
  const [realisations, setRealisations] = useState<Realisation[]>(MOCK_REALISATIONS)
  const [pendingRealisationId, setPendingRealisationId] = useState<string | null>(null)

  function handleAddRush(rush: Rush) {
    setRushes((prev) => [...prev, rush])
  }

  function handleDeleteRush(rushId: string) {
    setRushes((prev) => prev.filter((r) => r.id !== rushId))
    setRealisations((prev) =>
      prev.map((r) => ({ ...r, rushIds: r.rushIds.filter((id) => id !== rushId) }))
    )
  }

  function handleLinkRush(realisationId: string, rushId: string) {
    setRealisations((prev) =>
      prev.map((r) =>
        r.id === realisationId && !r.rushIds.includes(rushId)
          ? { ...r, rushIds: [...r.rushIds, rushId] }
          : r
      )
    )
  }

  function handleRealisationUpdate(updated: Realisation) {
    setRealisations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
  }

  function handleRealisationStatusChange(id: string, status: RealisationStatus) {
    setRealisations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  function handleNewRealisation(rushId?: string) {
    const newReal: Realisation = {
      id: crypto.randomUUID(),
      title: 'Nouvelle réalisation',
      status: 'a_tourner',
      productId: MOCK_PRODUCTS[0].id,
      publishDate: null,
      notes: '',
      rushIds: rushId ? [rushId] : [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    setRealisations((prev) => [newReal, ...prev])
    setPendingRealisationId(newReal.id)
    if (rushId) setActivePage('realisation')
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-auto">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'analytics' && <Analytics />}
        {activePage === 'realisation' && (
          <RealisationPage
            rushes={rushes}
            onAddRush={handleAddRush}
            realisations={realisations}
            products={MOCK_PRODUCTS}
            onUpdate={handleRealisationUpdate}
            onStatusChange={handleRealisationStatusChange}
            onNew={() => handleNewRealisation()}
            initialSelectedId={pendingRealisationId}
          />
        )}
        {activePage === 'rushs' && (
          // RushsPage will be added in Task 9
          <div className="p-8"><p className="text-slate-400">Page Rushs — coming soon</p></div>
        )}
        {activePage === 'produits' && <Produits />}
        {activePage === 'parametres' && <Parametres />}
      </main>
    </div>
  )
}
```

Note: `pendingRealisationId` is passed to `RealisationPage` as `initialSelectedId`. Since the page remounts each time `activePage` changes to `'realisation'`, this is sufficient — no `useEffect` needed in `RealisationPage`.

- [ ] **Step 4 — Run the app and verify navigation works**

```bash
npm run dev
```

Check: sidebar shows Rushs item between Réalisation and Produits. Réalisation page loads correctly. Clicking "Nouvelle vidéo" still works.

- [ ] **Step 5 — Run test suite**

```bash
npx vitest run
```

Expected: most tests pass. `RealisationPanel.test.tsx` will fail (missing `rushes` prop) — will be fixed in Task 4.

- [ ] **Step 6 — Commit**

```bash
git add src/components/layout/AppLayout.tsx src/components/layout/Sidebar.tsx src/pages/Realisation.tsx
git commit -m "feat: lift realisation+rushes state to AppLayout, add rushs sidebar item"
```

---

### Task 4: FileUploadZone → async Rush creation + RealisationPanel rushIds support

**Context:** `FileUploadZone` currently creates `RushFile` objects synchronously. It must now call `extractVideoMetadata` for each dropped file (async) and produce `Rush` objects. While extraction is in progress, show a loading skeleton. `RealisationPanel` must be updated: it now receives `rushes: Rush[]` + `onAddRush` instead of managing embedded `rushes`. The section renders rushes resolved from `draft.rushIds`. The zone also accepts drops of a `rushId` from the Rushs page (drag-to-link).

**Files:**
- Modify: `src/components/realisation/FileUploadZone.tsx`
- Modify: `src/components/realisation/RealisationPanel.tsx`
- Modify: `src/test/RealisationPanel.test.tsx`

---

- [ ] **Step 1 — Rewrite `src/components/realisation/FileUploadZone.tsx`**

```tsx
import { useRef, useState } from 'react'
import type { Rush } from '../../types/rush'
import { extractVideoMetadata, formatSize } from '../../utils/videoMetadata'

type Props = {
  rushIds: string[]
  allRushes: Rush[]
  onAdd: (rushes: Rush[]) => void       // new Rush objects to add to global pool + link
  onUnlink: (rushId: string) => void    // remove ID from this realisation only
  onLinkExisting?: (rushId: string) => void // drop from Rushs page
}

export default function FileUploadZone({ rushIds, allRushes, onAdd, onUnlink, onLinkExisting }: Props) {
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const linkedRushes = rushIds
    .map((id) => allRushes.find((r) => r.id === id))
    .filter((r): r is Rush => r !== undefined)

  async function handleFiles(fileList: FileList) {
    setProcessing(true)
    const files = Array.from(fileList)
    const newRushes: Rush[] = await Promise.all(
      files.map(async (f) => {
        const { duration, thumbnailUrl } = await extractVideoMetadata(f)
        return {
          id: crypto.randomUUID(),
          name: f.name,
          url: URL.createObjectURL(f),
          size: f.size,
          duration,
          thumbnailUrl,
        }
      })
    )
    onAdd(newRushes)
    setProcessing(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)

    // Check if this is a rush-id drop from the Rushs page
    const rushId = e.dataTransfer.getData('text/rush-id')
    if (rushId && onLinkExisting) {
      onLinkExisting(rushId)
      return
    }

    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
          dragging
            ? 'border-brand bg-brand/5'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 text-xl shadow-sm">
          {processing ? (
            <svg className="animate-spin w-5 h-5 text-brand" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : '↑'}
        </div>
        <p className="text-sm font-medium text-slate-600">
          {processing ? 'Traitement en cours…' : 'Déposer les rushs ici'}
        </p>
        {!processing && <p className="text-xs text-slate-400">ou cliquer pour parcourir</p>}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {linkedRushes.length > 0 && (
        <ul className="space-y-2">
          {linkedRushes.map((rush) => (
            <li
              key={rush.id}
              className="flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-100 rounded-lg"
            >
              {rush.thumbnailUrl ? (
                <img
                  src={rush.thumbnailUrl}
                  alt={rush.name}
                  className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                  ▶
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{rush.name}</p>
                <p className="text-xs text-slate-400">{formatSize(rush.size)}</p>
              </div>
              <button
                onClick={() => onUnlink(rush.id)}
                className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded"
                title="Retirer de cette réalisation"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 2 — Update `src/components/realisation/RealisationPanel.tsx`**

Update imports, Props, and the rushes section:

```tsx
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Realisation, Product, RealisationStatus } from '../../types/realisation'
import type { Rush } from '../../types/rush'
import StatusBadge from './StatusBadge'
import FileUploadZone from './FileUploadZone'

type Props = {
  realisation: Realisation | null
  products: Product[]
  rushes: Rush[]
  onAddRush: (rush: Rush) => void
  onClose: () => void
  onUpdate: (updated: Realisation) => void
}

// Inside the component:
function handleAddRushes(newRushes: Rush[]) {
  if (!draft) return
  // Add each rush to global pool, link IDs to this realisation
  newRushes.forEach((r) => onAddRush(r))
  update({ rushIds: [...draft.rushIds, ...newRushes.map((r) => r.id)] })
}

function handleUnlinkRush(rushId: string) {
  if (!draft) return
  update({ rushIds: draft.rushIds.filter((id) => id !== rushId) })
}

function handleLinkExisting(rushId: string) {
  if (!draft || draft.rushIds.includes(rushId)) return
  update({ rushIds: [...draft.rushIds, rushId] })
}

// In the rushes section JSX:
<FileUploadZone
  rushIds={draft.rushIds}
  allRushes={rushes}
  onAdd={handleAddRushes}
  onUnlink={handleUnlinkRush}
  onLinkExisting={handleLinkExisting}
/>
```

Full updated file:

```tsx
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Realisation, Product, RealisationStatus } from '../../types/realisation'
import type { Rush } from '../../types/rush'
import StatusBadge from './StatusBadge'
import FileUploadZone from './FileUploadZone'

type Props = {
  realisation: Realisation | null
  products: Product[]
  rushes: Rush[]
  onAddRush: (rush: Rush) => void
  onClose: () => void
  onUpdate: (updated: Realisation) => void
}

const ALL_STATUSES: RealisationStatus[] = [
  'a_tourner', 'script', 'a_monter', 'a_publier', 'publiee',
]

export default function RealisationPanel({ realisation, products, rushes, onAddRush, onClose, onUpdate }: Props) {
  const [draft, setDraft] = useState<Realisation | null>(null)
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  useEffect(() => {
    setDraft(realisation ? { ...realisation } : null)
    setShowStatusMenu(false)
  }, [realisation])

  function update(patch: Partial<Realisation>) {
    if (!draft) return
    const updated = { ...draft, ...patch }
    setDraft(updated)
    onUpdate(updated)
  }

  function handleAddRushes(newRushes: Rush[]) {
    if (!draft) return
    newRushes.forEach((r) => onAddRush(r))
    update({ rushIds: [...draft.rushIds, ...newRushes.map((r) => r.id)] })
  }

  function handleUnlinkRush(rushId: string) {
    if (!draft) return
    update({ rushIds: draft.rushIds.filter((id) => id !== rushId) })
  }

  function handleLinkExisting(rushId: string) {
    if (!draft || draft.rushIds.includes(rushId)) return
    update({ rushIds: [...draft.rushIds, rushId] })
  }

  const isOpen = realisation !== null

  return (
    <AnimatePresence>
      {isOpen && draft && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div className="flex-1 pr-4">
                <input
                  className="text-lg font-semibold text-slate-900 w-full outline-none focus:ring-2 focus:ring-brand/30 rounded-lg px-2 py-1 -mx-2 -my-1 hover:bg-slate-50 transition-colors"
                  value={draft.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
                <div className="mt-2.5 relative">
                  <button
                    onClick={() => setShowStatusMenu((v) => !v)}
                    className="flex items-center gap-1"
                  >
                    <StatusBadge status={draft.status} />
                    <span className="text-slate-300 text-xs ml-0.5">▾</span>
                  </button>
                  {showStatusMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-10 min-w-[180px]">
                      {ALL_STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => { update({ status: s }); setShowStatusMenu(false) }}
                          className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm hover:bg-slate-50 transition-colors ${
                            draft.status === s ? 'font-semibold text-brand' : 'text-slate-600'
                          }`}
                        >
                          <StatusBadge status={s} size="sm" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-7">
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Informations</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">Produit</label>
                    <select
                      value={draft.productId}
                      onChange={(e) => update({ productId: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1.5 block">Date de publication</label>
                    <input
                      type="date"
                      value={draft.publishDate ?? ''}
                      onChange={(e) => update({ publishDate: e.target.value || null })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Rushs</h3>
                <FileUploadZone
                  rushIds={draft.rushIds}
                  allRushes={rushes}
                  onAdd={handleAddRushes}
                  onUnlink={handleUnlinkRush}
                  onLinkExisting={handleLinkExisting}
                />
              </section>

              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Notes</h3>
                <textarea
                  value={draft.notes}
                  onChange={(e) => update({ notes: e.target.value })}
                  placeholder="Ajouter une note…"
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 resize-none placeholder-slate-300"
                />
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3 — Fix `src/test/RealisationPanel.test.tsx`**

Add the `rushes` and `onAddRush` props to all render calls:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import RealisationPanel from '../components/realisation/RealisationPanel'
import { MOCK_REALISATIONS, MOCK_PRODUCTS, MOCK_RUSHES } from '../data/mock'

const realisation = MOCK_REALISATIONS[0]
const defaultProps = {
  products: MOCK_PRODUCTS,
  rushes: MOCK_RUSHES,
  onAddRush: () => {},
  onClose: () => {},
  onUpdate: () => {},
}

test('renders nothing when realisation is null', () => {
  const { container } = render(
    <RealisationPanel realisation={null} {...defaultProps} />
  )
  expect(container).toBeEmptyDOMElement()
})

test('renders realisation title when open', () => {
  render(<RealisationPanel realisation={realisation} {...defaultProps} />)
  expect(screen.getByDisplayValue(realisation.title)).toBeInTheDocument()
})

test('calls onClose when overlay is clicked', () => {
  const onClose = vi.fn()
  render(<RealisationPanel realisation={realisation} {...defaultProps} onClose={onClose} />)
  const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
  fireEvent.click(overlay)
  expect(onClose).toHaveBeenCalled()
})

test('calls onUpdate when notes are edited', () => {
  const onUpdate = vi.fn()
  render(<RealisationPanel realisation={realisation} {...defaultProps} onUpdate={onUpdate} />)
  const textarea = screen.getByPlaceholderText('Ajouter une note…')
  fireEvent.change(textarea, { target: { value: 'nouvelle note' } })
  expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ notes: 'nouvelle note' }))
})
```

- [ ] **Step 4 — Run full test suite**

```bash
npx vitest run
```
Expected: all tests PASS.

- [ ] **Step 5 — Commit**

```bash
git add src/components/realisation/FileUploadZone.tsx \
        src/components/realisation/RealisationPanel.tsx \
        src/test/RealisationPanel.test.tsx
git commit -m "feat: FileUploadZone and RealisationPanel migrated to Rush type with async metadata extraction"
```

---

## Chunk 3: Rushs Page UI

### Task 5: RushsListView

**Context:** A list view showing all rushes — thumbnail, name, duration, size, "Lié" badge if the rush ID appears in any réalisation, and a delete button. The implementer needs to handle the case where `thumbnailUrl` is empty (mock data has `''`).

**Files:**
- Create: `src/components/rushs/RushsListView.tsx`
- Create: `src/test/RushsListView.test.tsx`

---

- [ ] **Step 1 — Write failing tests**

```tsx
// src/test/RushsListView.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import RushsListView from '../components/rushs/RushsListView'
import { MOCK_RUSHES, MOCK_REALISATIONS } from '../data/mock'

test('renders all rush names', () => {
  render(
    <RushsListView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
      onDelete={() => {}}
    />
  )
  expect(screen.getByText('rush_01.mp4')).toBeInTheDocument()
  expect(screen.getByText('broll_01.mp4')).toBeInTheDocument()
  expect(screen.getByText('final_v2.mp4')).toBeInTheDocument()
})

test('shows "Lié" badge for rushes linked to a realisation', () => {
  render(
    <RushsListView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
      onDelete={() => {}}
    />
  )
  // f1, f2, f3, f4, f5 are all linked — should show 5 "Lié" badges
  expect(screen.getAllByText('Lié')).toHaveLength(5)
})

test('calls onSelect when a row is clicked', () => {
  const onSelect = vi.fn()
  render(
    <RushsListView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={onSelect}
      onDelete={() => {}}
    />
  )
  fireEvent.click(screen.getByText('rush_01.mp4'))
  expect(onSelect).toHaveBeenCalledWith(MOCK_RUSHES[0])
})

test('calls onDelete when delete button is clicked', () => {
  const onDelete = vi.fn()
  render(
    <RushsListView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
      onDelete={onDelete}
    />
  )
  const deleteButtons = screen.getAllByTitle('Supprimer ce rush')
  fireEvent.click(deleteButtons[0])
  expect(onDelete).toHaveBeenCalledWith(MOCK_RUSHES[0].id)
})
```

- [ ] **Step 2 — Run tests, verify they fail**

```bash
npx vitest run src/test/RushsListView.test.tsx
```
Expected: FAIL — `RushsListView` not found.

- [ ] **Step 3 — Create `src/components/rushs/RushsListView.tsx`**

```tsx
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
```

- [ ] **Step 4 — Run tests, verify they pass**

```bash
npx vitest run src/test/RushsListView.test.tsx
```
Expected: 4/4 PASS.

- [ ] **Step 5 — Commit**

```bash
git add src/components/rushs/RushsListView.tsx src/test/RushsListView.test.tsx
git commit -m "feat: add RushsListView component"
```

---

### Task 6: RushsCardsView

**Context:** Cards at 4:5 ratio, 5 columns (xl: 6). Thumbnail fills the card. Name + duration in a semi-transparent overlay at the bottom. Each card is draggable (sets `text/rush-id` on dataTransfer so it can be dropped into `RealisationPanel`).

**Files:**
- Create: `src/components/rushs/RushsCardsView.tsx`
- Create: `src/test/RushsCardsView.test.tsx`

---

- [ ] **Step 1 — Write failing tests**

```tsx
// src/test/RushsCardsView.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import RushsCardsView from '../components/rushs/RushsCardsView'
import { MOCK_RUSHES, MOCK_REALISATIONS } from '../data/mock'

test('renders all rush names', () => {
  render(
    <RushsCardsView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
    />
  )
  expect(screen.getByText('rush_01.mp4')).toBeInTheDocument()
  expect(screen.getByText('final_v2.mp4')).toBeInTheDocument()
})

test('calls onSelect when a card is clicked', () => {
  const onSelect = vi.fn()
  render(
    <RushsCardsView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={onSelect}
    />
  )
  fireEvent.click(screen.getByText('rush_01.mp4'))
  expect(onSelect).toHaveBeenCalledWith(MOCK_RUSHES[0])
})

test('sets rushId on dragStart', () => {
  render(
    <RushsCardsView
      rushes={MOCK_RUSHES}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
    />
  )
  const cards = screen.getAllByRole('article')
  const setData = vi.fn()
  fireEvent.dragStart(cards[0], {
    dataTransfer: { setData, effectAllowed: '' },
  })
  expect(setData).toHaveBeenCalledWith('text/rush-id', MOCK_RUSHES[0].id)
})
```

- [ ] **Step 2 — Run tests, verify they fail**

```bash
npx vitest run src/test/RushsCardsView.test.tsx
```
Expected: FAIL.

- [ ] **Step 3 — Create `src/components/rushs/RushsCardsView.tsx`**

```tsx
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

          {/* Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 pt-6">
            <p className="text-white text-xs font-medium truncate leading-tight">{rush.name}</p>
            <p className="text-white/70 text-xs tabular-nums mt-0.5">{formatDuration(rush.duration)}</p>
          </div>

          {/* Linked badge */}
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
```

- [ ] **Step 4 — Run tests, verify they pass**

```bash
npx vitest run src/test/RushsCardsView.test.tsx
```
Expected: 3/3 PASS.

- [ ] **Step 5 — Commit**

```bash
git add src/components/rushs/RushsCardsView.tsx src/test/RushsCardsView.test.tsx
git commit -m "feat: add RushsCardsView component (4:5 grid, draggable)"
```

---

### Task 7: RushPanel

**Context:** Slide-in panel (same Framer Motion pattern as other panels). Shows thumbnail, name, duration, size. If the rush is linked to a réalisation: shows the réalisation title. Buttons: "Créer une Réalisation" (always visible), delete (with warning if the linked réalisation is in a risky status). Risky statuses: `a_tourner`, `script`, `a_monter`. Safe statuses: `a_publier`, `publiee`.

**Files:**
- Create: `src/components/rushs/RushPanel.tsx`
- Create: `src/test/RushPanel.test.tsx`

---

- [ ] **Step 1 — Write failing tests**

```tsx
// src/test/RushPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import RushPanel from '../components/rushs/RushPanel'
import { MOCK_RUSHES, MOCK_REALISATIONS } from '../data/mock'

const rush = MOCK_RUSHES[0] // f1, linked to r1 (publiee — safe status)
const rushUnlinked = MOCK_RUSHES[4] // f5, linked to r3 (a_monter — risky)

const defaultProps = {
  realisations: MOCK_REALISATIONS,
  onClose: () => {},
  onDelete: () => {},
  onCreateRealisation: () => {},
}

test('renders nothing when rush is null', () => {
  const { container } = render(<RushPanel rush={null} {...defaultProps} />)
  expect(container).toBeEmptyDOMElement()
})

test('renders rush name when open', () => {
  render(<RushPanel rush={rush} {...defaultProps} />)
  expect(screen.getByText('rush_01.mp4')).toBeInTheDocument()
})

test('shows linked realisation title', () => {
  render(<RushPanel rush={rush} {...defaultProps} />)
  expect(screen.getByText('Unboxing crème hydratante')).toBeInTheDocument()
})

test('calls onClose when overlay clicked', () => {
  const onClose = vi.fn()
  render(<RushPanel rush={rush} {...defaultProps} onClose={onClose} />)
  const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
  fireEvent.click(overlay)
  expect(onClose).toHaveBeenCalled()
})

test('shows warning before delete when linked realisation has risky status', () => {
  render(<RushPanel rush={rushUnlinked} {...defaultProps} />)
  fireEvent.click(screen.getByText('Supprimer le rush'))
  expect(screen.getByText(/ne semble pas complètement prête/)).toBeInTheDocument()
})

test('does NOT show warning when linked realisation is published', () => {
  render(<RushPanel rush={rush} {...defaultProps} />)
  fireEvent.click(screen.getByText('Supprimer le rush'))
  // Should go straight to confirmation, no warning text
  expect(screen.queryByText(/ne semble pas complètement prête/)).not.toBeInTheDocument()
  expect(screen.getByText('Confirmer')).toBeInTheDocument()
})

test('calls onDelete after confirmation (safe path)', () => {
  const onDelete = vi.fn()
  render(<RushPanel rush={rush} {...defaultProps} onDelete={onDelete} />)
  fireEvent.click(screen.getByText('Supprimer le rush'))
  fireEvent.click(screen.getByText('Confirmer'))
  expect(onDelete).toHaveBeenCalledWith(rush.id)
})

test('calls onDelete after confirming through risky warning', () => {
  const onDelete = vi.fn()
  render(<RushPanel rush={rushUnlinked} {...defaultProps} onDelete={onDelete} />)
  // First click shows warning
  fireEvent.click(screen.getByText('Supprimer le rush'))
  expect(screen.getByText(/ne semble pas complètement prête/)).toBeInTheDocument()
  // Second click confirms through the warning
  fireEvent.click(screen.getByText('Confirmer quand même'))
  expect(onDelete).toHaveBeenCalledWith(rushUnlinked.id)
})

test('calls onCreateRealisation when button clicked', () => {
  const onCreate = vi.fn()
  render(<RushPanel rush={rush} {...defaultProps} onCreateRealisation={onCreate} />)
  fireEvent.click(screen.getByText('Créer une Réalisation'))
  expect(onCreate).toHaveBeenCalledWith(rush.id)
})
```

- [ ] **Step 2 — Run tests, verify they fail**

```bash
npx vitest run src/test/RushPanel.test.tsx
```
Expected: FAIL.

- [ ] **Step 3 — Create `src/components/rushs/RushPanel.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Rush } from '../../types/rush'
import type { Realisation } from '../../types/realisation'
import { formatDuration, formatSize } from '../../utils/videoMetadata'

type Props = {
  rush: Rush | null
  realisations: Realisation[]
  onClose: () => void
  onDelete: (rushId: string) => void
  onCreateRealisation: (rushId: string) => void
}

const RISKY_STATUSES = new Set(['a_tourner', 'script', 'a_monter'])

export default function RushPanel({ rush, realisations, onClose, onDelete, onCreateRealisation }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    setConfirmDelete(false)
    setShowWarning(false)
  }, [rush])

  const linkedRealisation = rush
    ? realisations.find((r) => r.rushIds.includes(rush.id)) ?? null
    : null

  function handleDeleteClick() {
    if (!rush) return
    if (linkedRealisation && RISKY_STATUSES.has(linkedRealisation.status)) {
      setShowWarning(true)
    } else {
      setConfirmDelete(true)
    }
  }

  const isOpen = rush !== null

  return (
    <AnimatePresence>
      {isOpen && rush && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-4 flex-1 pr-4">
                {rush.thumbnailUrl ? (
                  <img
                    src={rush.thumbnailUrl}
                    alt={rush.name}
                    className="w-14 h-[70px] rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-[70px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                    ▶
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-slate-900 truncate">{rush.name}</p>
                  <p className="text-sm text-slate-400 mt-0.5 tabular-nums">{formatDuration(rush.duration)}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{formatSize(rush.size)}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Linked realisation */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Réalisation liée
                </h3>
                {linkedRealisation ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 truncate">{linkedRealisation.title}</span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 italic">Non assigné à une réalisation.</p>
                )}
              </section>

              {/* Create realisation CTA */}
              <section>
                <button
                  onClick={() => onCreateRealisation(rush.id)}
                  className="w-full flex items-center justify-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
                >
                  <span className="text-base leading-none">+</span>
                  Créer une Réalisation
                </button>
              </section>
            </div>

            {/* Footer: delete */}
            <div className="p-6 border-t border-slate-100">
              {showWarning ? (
                <div className="space-y-3">
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 leading-relaxed">
                    ⚠️ Attention, la vidéo ne semble pas complètement prête. La suppression du rush est irréversible. Tu es sûr ?
                  </p>
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => setShowWarning(false)}
                      className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => { onDelete(rush.id); onClose() }}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      Confirmer quand même
                    </button>
                  </div>
                </div>
              ) : confirmDelete ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 flex-1">Supprimer ce rush ?</span>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => { onDelete(rush.id); onClose() }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 7a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Supprimer le rush
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 4 — Run tests, verify they pass**

```bash
npx vitest run src/test/RushPanel.test.tsx
```
Expected: 8/8 PASS.

- [ ] **Step 5 — Commit**

```bash
git add src/components/rushs/RushPanel.tsx src/test/RushPanel.test.tsx
git commit -m "feat: add RushPanel with delete warning and create-réalisation CTA"
```

---

### Task 8: RushsPage + AppLayout registration

**Context:** The main page container. The entire page is a drop zone (video files). Has a header with counter + ViewSwitcher (list/cards only). Renders `RushsListView` or `RushsCardsView` based on active view. Opens `RushPanel` on click. Manages the delete flow (delegates to `onDeleteRush` from AppLayout). After this task, AppLayout is updated to render `RushsPage` instead of the placeholder div, and `pendingRealisationId` is cleared after RealisationPage consumes it.

**Files:**
- Create: `src/pages/Rushs.tsx`
- Modify: `src/components/layout/AppLayout.tsx`
- Create: `src/test/RushsPage.test.tsx`

---

- [ ] **Step 1 — Write failing tests**

```tsx
// src/test/RushsPage.test.tsx
import { render, screen } from '@testing-library/react'
import RushsPage from '../pages/Rushs'
import { MOCK_RUSHES, MOCK_REALISATIONS } from '../data/mock'

const defaultProps = {
  rushes: MOCK_RUSHES,
  realisations: MOCK_REALISATIONS,
  onAddRush: () => {},
  onDeleteRush: () => {},
  onLinkRush: () => {},
  onCreateRealisation: () => {},
}

test('renders page title', () => {
  render(<RushsPage {...defaultProps} />)
  expect(screen.getByText('Rushs')).toBeInTheDocument()
})

test('shows rush count in subtitle', () => {
  render(<RushsPage {...defaultProps} />)
  expect(screen.getByText(`${MOCK_RUSHES.length} rushs`)).toBeInTheDocument()
})

test('shows empty state when no rushes', () => {
  render(<RushsPage {...defaultProps} rushes={[]} />)
  expect(screen.getByText(/Dépose tes rushs ici/)).toBeInTheDocument()
})

test('renders list view by default with rush names visible', () => {
  render(<RushsPage {...defaultProps} />)
  expect(screen.getByText('rush_01.mp4')).toBeInTheDocument()
})
```

- [ ] **Step 2 — Run tests, verify they fail**

```bash
npx vitest run src/test/RushsPage.test.tsx
```
Expected: FAIL.

- [ ] **Step 3 — Create `src/pages/Rushs.tsx`**

```tsx
import { useRef, useState } from 'react'
import type { Rush } from '../types/rush'
import type { Realisation } from '../types/realisation'
import ViewSwitcher, { type ViewType } from '../components/realisation/ViewSwitcher'
import RushsListView from '../components/rushs/RushsListView'
import RushsCardsView from '../components/rushs/RushsCardsView'
import RushPanel from '../components/rushs/RushPanel'
import { extractVideoMetadata } from '../utils/videoMetadata'

type Props = {
  rushes: Rush[]
  realisations: Realisation[]
  onAddRush: (rush: Rush) => void
  onDeleteRush: (rushId: string) => void
  onLinkRush: (realisationId: string, rushId: string) => void
  onCreateRealisation: (rushId: string) => void
}

const RUSH_VIEWS: ViewType[] = ['list', 'cards']

export default function RushsPage({
  rushes,
  realisations,
  onAddRush,
  onDeleteRush,
  onLinkRush,
  onCreateRealisation,
}: Props) {
  const [activeView, setActiveView] = useState<ViewType>('list')
  const [selectedRush, setSelectedRush] = useState<Rush | null>(null)
  const [pageDragging, setPageDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(fileList: FileList) {
    setProcessing(true)
    const files = Array.from(fileList)
    await Promise.all(
      files.map(async (f) => {
        const { duration, thumbnailUrl } = await extractVideoMetadata(f)
        onAddRush({
          id: crypto.randomUUID(),
          name: f.name,
          url: URL.createObjectURL(f),
          size: f.size,
          duration,
          thumbnailUrl,
        })
      })
    )
    setProcessing(false)
  }

  function handlePageDrop(e: React.DragEvent) {
    e.preventDefault()
    setPageDragging(false)
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      className={`p-8 max-w-7xl mx-auto min-h-screen transition-colors ${
        pageDragging ? 'bg-brand/5' : ''
      }`}
      onDragOver={(e) => { e.preventDefault(); setPageDragging(true) }}
      onDragLeave={(e) => {
        // Only clear if leaving the page entirely (not entering a child)
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPageDragging(false)
        }
      }}
      onDrop={handlePageDrop}
    >
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rushs</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {processing ? 'Traitement en cours…' : `${rushes.length} rush${rushes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} views={RUSH_VIEWS} />
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Ajouter des rushs
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="video/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Drop overlay hint */}
      {pageDragging && (
        <div className="fixed inset-0 border-4 border-dashed border-brand/40 rounded-2xl pointer-events-none z-30 m-4 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 text-center shadow-xl">
            <p className="text-brand font-semibold text-lg">Dépose tes rushs ici</p>
            <p className="text-slate-400 text-sm mt-1">Fichiers vidéo acceptés</p>
          </div>
        </div>
      )}

      {/* Content */}
      {rushes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 text-3xl mb-4">
            ▶
          </div>
          <p className="text-slate-500 font-medium">Aucun rush pour l'instant</p>
          <p className="text-slate-400 text-sm mt-1">Dépose tes rushs ici ou clique sur "Ajouter des rushs"</p>
        </div>
      ) : activeView === 'list' ? (
        <RushsListView
          rushes={rushes}
          realisations={realisations}
          onSelect={setSelectedRush}
          onDelete={onDeleteRush}
        />
      ) : (
        <RushsCardsView
          rushes={rushes}
          realisations={realisations}
          onSelect={setSelectedRush}
        />
      )}

      {/* Rush panel */}
      <RushPanel
        rush={selectedRush}
        realisations={realisations}
        onClose={() => setSelectedRush(null)}
        onDelete={(rushId) => {
          onDeleteRush(rushId)
          setSelectedRush(null)
        }}
        onCreateRealisation={(rushId) => {
          onCreateRealisation(rushId)
          setSelectedRush(null)
        }}
      />
    </div>
  )
}
```

- [ ] **Step 4 — Update `src/components/layout/AppLayout.tsx` — replace placeholder with RushsPage**

Replace the `rushs` placeholder div with the real component:

```tsx
import RushsPage from '../../pages/Rushs'

// In the JSX, replace:
// {activePage === 'rushs' && <div ...>coming soon</div>}
// With:
{activePage === 'rushs' && (
  <RushsPage
    rushes={rushes}
    realisations={realisations}
    onAddRush={handleAddRush}
    onDeleteRush={handleDeleteRush}
    onLinkRush={handleLinkRush}
    onCreateRealisation={(rushId) => handleNewRealisation(rushId)}
  />
)}
```

Also clear `pendingRealisationId` inside `RealisationPage` after consuming it. Since the page remounts on navigation, pass `initialSelectedId` from state and reset after render via a callback:

In AppLayout, add `onInitialSelectionConsumed` prop to RealisationPage:
```tsx
{activePage === 'realisation' && (
  <RealisationPage
    ...
    initialSelectedId={pendingRealisationId}
    onInitialSelectionConsumed={() => setPendingRealisationId(null)}
  />
)}
```

Update `RealisationPage` Props to add this optional callback and call it in a `useEffect`:
```tsx
// In src/pages/Realisation.tsx
type Props = {
  ...
  initialSelectedId?: string | null
  onInitialSelectionConsumed?: () => void
}

// In the component body, after useState:
useEffect(() => {
  if (initialSelectedId) {
    setSelectedId(initialSelectedId)
    onInitialSelectionConsumed?.()
  }
}, [])  // Only on mount
```

- [ ] **Step 5 — Run full test suite**

```bash
npx vitest run
```
Expected: all tests PASS.

- [ ] **Step 6 — Run app and do end-to-end smoke test**

```bash
npm run dev
```

Manual checks:
1. ✅ Sidebar shows "Rushs" between Réalisation and Produits
2. ✅ Rushs page loads with list view showing MOCK_RUSHES
3. ✅ Clicking "Rush" opens `RushPanel`
4. ✅ "Créer une Réalisation" navigates to Réalisation and opens the new réalisation panel
5. ✅ Switch to cards view: 4:5 grid renders correctly
6. ✅ Delete rush from panel: rush disappears from list
7. ✅ Delete rush linked to `a_monter` réalisation: warning appears

- [ ] **Step 7 — Commit**

```bash
git add src/pages/Rushs.tsx \
        src/components/layout/AppLayout.tsx \
        src/pages/Realisation.tsx \
        src/test/RushsPage.test.tsx
git commit -m "feat: add RushsPage and wire up full Rushs feature in AppLayout"
```
