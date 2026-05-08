# Réalisation Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Réalisation page of the TikTok Shop CRM — a production management view with List, Kanban, and Cards views and a slide-in side panel for detail editing.

**Architecture:** Single-page React app with Vite. The Réalisation page manages a list of video production cards, each representing one video's lifecycle. A shared side panel slides in from the right when a card is clicked, exposing all detail fields. Data is mocked in a TypeScript file structured identically to the future Firebase schema.

**Tech Stack:** React 18, TypeScript, Vite, TailwindCSS v3, Framer Motion, @dnd-kit/core + @dnd-kit/sortable, Vitest, React Testing Library

> **Note:** The spec lists a shared `RealisationCard.tsx`. In this plan, card UI is intentionally inlined as local sub-components inside `KanbanView.tsx` and `CardsView.tsx` — the two views differ enough in layout that a shared card would require excessive props. Extraction can happen later if needed (YAGNI).

---

## Chunk 1: Project Setup + Types + Mock Data + App Shell

### Task 1: Initialize Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`

- [ ] **Step 1: Scaffold the project**

```bash
cd "/Users/adelinhugot/Desktop/Projets-SAAS/TTS Manager"
npm create vite@latest . -- --template react-ts
```

Expected: project files created at root level.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install tailwindcss@3 postcss autoprefixer framer-motion @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3: Initialize Tailwind**

```bash
npx tailwindcss init -p
```

- [ ] **Step 4: Configure tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#3B5BFF',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Replace src/index.css with Tailwind directives**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 6: Configure Vitest in vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 7: Create test setup file**

Create `src/test/setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 8: Commit**

```bash
git init
git add .
git commit -m "chore: initialize vite react ts project with tailwind and vitest"
```

---

### Task 2: Define TypeScript types

**Files:**
- Create: `src/types/realisation.ts`

- [ ] **Step 1: Write the types file**

```ts
export type RealisationStatus =
  | 'a_tourner'
  | 'script'
  | 'a_monter'
  | 'a_publier'
  | 'publiee'

export const STATUS_LABELS: Record<RealisationStatus, string> = {
  a_tourner: 'À tourner',
  script: 'Script à rédiger',
  a_monter: 'À monter',
  a_publier: 'À publier',
  publiee: 'Publiée',
}

export const STATUS_COLORS: Record<RealisationStatus, { bg: string; text: string; dot: string }> = {
  a_tourner: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  script:    { bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  a_monter:  { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  a_publier: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  publiee:   { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
}

export type RushFile = {
  id: string
  name: string
  url: string
  size: number
}

export type Realisation = {
  id: string
  title: string
  status: RealisationStatus
  productId: string
  publishDate: string | null
  notes: string
  rushes: RushFile[]
  createdAt: string
}

export type Product = {
  id: string
  name: string
  imageUrl: string
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/realisation.ts
git commit -m "feat: add realisation and product TypeScript types"
```

---

### Task 3: Create mock data

**Files:**
- Create: `src/data/mock.ts`

- [ ] **Step 1: Write mock data**

```ts
import type { Realisation, Product } from '../types/realisation'

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Crème hydratante bio', imageUrl: 'https://placehold.co/60x60/e2e8f0/94a3b8?text=Prod' },
  { id: 'p2', name: 'Sac en cuir végétal', imageUrl: 'https://placehold.co/60x60/e2e8f0/94a3b8?text=Prod' },
  { id: 'p3', name: 'Montre minimaliste', imageUrl: 'https://placehold.co/60x60/e2e8f0/94a3b8?text=Prod' },
  { id: 'p4', name: 'Diffuseur huiles essentielles', imageUrl: 'https://placehold.co/60x60/e2e8f0/94a3b8?text=Prod' },
]

export const MOCK_REALISATIONS: Realisation[] = [
  {
    id: 'r1',
    title: 'Unboxing crème hydratante',
    status: 'publiee',
    productId: 'p1',
    publishDate: '2026-04-20',
    notes: 'Très bon engagement, 42k vues en 48h.',
    rushes: [
      { id: 'f1', name: 'rush_01.mp4', url: '#', size: 245000000 },
      { id: 'f2', name: 'broll_01.mp4', url: '#', size: 120000000 },
    ],
    createdAt: '2026-04-15',
  },
  {
    id: 'r2',
    title: 'GRWM avec le sac en cuir',
    status: 'a_publier',
    productId: 'p2',
    publishDate: '2026-05-10',
    notes: 'Penser à ajouter le lien produit en bio.',
    rushes: [
      { id: 'f3', name: 'final_v2.mp4', url: '#', size: 310000000 },
    ],
    createdAt: '2026-05-01',
  },
  {
    id: 'r3',
    title: 'Review montre — lifestyle morning',
    status: 'a_monter',
    productId: 'p3',
    publishDate: '2026-05-15',
    notes: '',
    rushes: [
      { id: 'f4', name: 'rush_matin_01.mp4', url: '#', size: 450000000 },
      { id: 'f5', name: 'rush_matin_02.mp4', url: '#', size: 200000000 },
    ],
    createdAt: '2026-05-03',
  },
  {
    id: 'r4',
    title: 'Tuto diffuseur — 3 mélanges',
    status: 'script',
    productId: 'p4',
    publishDate: '2026-05-22',
    notes: 'Script en cours, angle bien-être + sommeil.',
    rushes: [],
    createdAt: '2026-05-05',
  },
  {
    id: 'r5',
    title: 'Crème hydratante — before/after',
    status: 'a_tourner',
    productId: 'p1',
    publishDate: '2026-05-28',
    notes: '',
    rushes: [],
    createdAt: '2026-05-06',
  },
  {
    id: 'r6',
    title: 'Sac en cuir — styling 5 tenues',
    status: 'a_tourner',
    productId: 'p2',
    publishDate: null,
    notes: '',
    rushes: [],
    createdAt: '2026-05-07',
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/data/mock.ts
git commit -m "feat: add mock realisations and products data"
```

---

### Task 4: Build app shell with sidebar navigation

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/AppLayout.tsx`
- Modify: `src/App.tsx`
- Create: `src/pages/Dashboard.tsx`, `src/pages/Analytics.tsx`, `src/pages/Realisation.tsx`, `src/pages/Produits.tsx`, `src/pages/Parametres.tsx`

- [ ] **Step 1: Create placeholder pages**

Create each of the 5 pages as a minimal stub, e.g. `src/pages/Dashboard.tsx`:
```tsx
export default function Dashboard() {
  return <div className="p-8 text-slate-700">Dashboard — coming soon</div>
}
```

Repeat for `Analytics.tsx`, `Realisation.tsx` (stub only for now), `Produits.tsx`, `Parametres.tsx`.

- [ ] **Step 2: Create Sidebar component**

Create `src/components/layout/Sidebar.tsx`:
```tsx
import { useState } from 'react'

type NavItem = {
  id: string
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'analytics', label: 'Analytics', icon: '↗' },
  { id: 'realisation', label: 'Réalisation', icon: '◉' },
  { id: 'produits', label: 'Produits', icon: '⊞' },
  { id: 'parametres', label: 'Paramètres', icon: '⚙' },
]

type SidebarProps = {
  activePage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-100 flex flex-col py-6 px-4 gap-1">
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white text-sm font-bold">T</div>
        <span className="font-semibold text-slate-800 text-base">TTS Manager</span>
      </div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
            activePage === item.id
              ? 'bg-brand/10 text-brand'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <span className="text-base w-5 text-center">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </aside>
  )
}
```

- [ ] **Step 3: Create AppLayout component**

Create `src/components/layout/AppLayout.tsx`:
```tsx
import { useState } from 'react'
import Sidebar from './Sidebar'
import Dashboard from '../../pages/Dashboard'
import Analytics from '../../pages/Analytics'
import Realisation from '../../pages/Realisation'
import Produits from '../../pages/Produits'
import Parametres from '../../pages/Parametres'


const PAGE_COMPONENTS: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  analytics: Analytics,
  realisation: Realisation,
  produits: Produits,
  parametres: Parametres,
}

export default function AppLayout() {
  const [activePage, setActivePage] = useState('realisation')
  const PageComponent = PAGE_COMPONENTS[activePage]

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-auto">
        <PageComponent />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Update App.tsx**

```tsx
import AppLayout from './components/layout/AppLayout'
import './index.css'

export default function App() {
  return <AppLayout />
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/ src/pages/ src/App.tsx
git commit -m "feat: add app shell with sidebar navigation and page stubs"
```

---

## Chunk 2: Base Components

### Task 5: StatusBadge component

**Files:**
- Create: `src/components/realisation/StatusBadge.tsx`
- Create: `src/test/StatusBadge.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/test/StatusBadge.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import StatusBadge from '../components/realisation/StatusBadge'

test('renders correct label for each status', () => {
  const { rerender } = render(<StatusBadge status="a_tourner" />)
  expect(screen.getByText('À tourner')).toBeInTheDocument()

  rerender(<StatusBadge status="publiee" />)
  expect(screen.getByText('Publiée')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/test/StatusBadge.test.tsx
```

Expected: FAIL — component not found.

- [ ] **Step 3: Implement StatusBadge**

Create `src/components/realisation/StatusBadge.tsx`:
```tsx
import { STATUS_COLORS, STATUS_LABELS, type RealisationStatus } from '../../types/realisation'

type Props = {
  status: RealisationStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const { bg, text, dot } = STATUS_COLORS[status]
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${bg} ${text} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {STATUS_LABELS[status]}
    </span>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/test/StatusBadge.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/realisation/StatusBadge.tsx src/test/StatusBadge.test.tsx
git commit -m "feat: add StatusBadge component"
```

---

### Task 6: ViewSwitcher component

**Files:**
- Create: `src/components/realisation/ViewSwitcher.tsx`
- Create: `src/test/ViewSwitcher.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/test/ViewSwitcher.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ViewSwitcher from '../components/realisation/ViewSwitcher'

test('calls onViewChange when a view button is clicked', () => {
  const handler = vi.fn()
  render(<ViewSwitcher activeView="list" onViewChange={handler} />)
  fireEvent.click(screen.getByTitle('Vue Kanban'))
  expect(handler).toHaveBeenCalledWith('kanban')
})

test('highlights the active view', () => {
  render(<ViewSwitcher activeView="cards" onViewChange={() => {}} />)
  const cardsBtn = screen.getByTitle('Vue Cards')
  expect(cardsBtn.className).toMatch(/bg-white/)
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/test/ViewSwitcher.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement ViewSwitcher**

Create `src/components/realisation/ViewSwitcher.tsx`:
```tsx
export type ViewType = 'list' | 'kanban' | 'cards'

type Props = {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

const VIEWS: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  {
    id: 'list',
    label: 'Vue Liste',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <rect x="2" y="3" width="12" height="1.5" rx="0.75" fill="currentColor"/>
        <rect x="2" y="7.25" width="12" height="1.5" rx="0.75" fill="currentColor"/>
        <rect x="2" y="11.5" width="12" height="1.5" rx="0.75" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'kanban',
    label: 'Vue Kanban',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <rect x="1" y="2" width="4" height="12" rx="1" fill="currentColor"/>
        <rect x="6" y="2" width="4" height="8" rx="1" fill="currentColor"/>
        <rect x="11" y="2" width="4" height="10" rx="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'cards',
    label: 'Vue Cards',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function ViewSwitcher({ activeView, onViewChange }: Props) {
  return (
    <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-lg">
      {VIEWS.map((view) => (
        <button
          key={view.id}
          title={view.label}
          onClick={() => onViewChange(view.id)}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
            activeView === view.id
              ? 'bg-white text-brand shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {view.icon}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/test/ViewSwitcher.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/realisation/ViewSwitcher.tsx src/test/ViewSwitcher.test.tsx
git commit -m "feat: add ViewSwitcher component with list/kanban/cards options"
```

---

### Task 7: FileUploadZone component

**Files:**
- Create: `src/components/realisation/FileUploadZone.tsx`

- [ ] **Step 1: Implement FileUploadZone**

Create `src/components/realisation/FileUploadZone.tsx`:
```tsx
import { useRef, useState } from 'react'
import type { RushFile } from '../../types/realisation'

type Props = {
  rushes: RushFile[]
  onAdd: (files: RushFile[]) => void
  onRemove: (id: string) => void
}

function formatSize(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} Go`
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} Mo`
  return `${(bytes / 1_000).toFixed(0)} Ko`
}

export default function FileUploadZone({ rushes, onAdd, onRemove }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(fileList: FileList) {
    const newRushes: RushFile[] = Array.from(fileList).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      url: URL.createObjectURL(f),
      size: f.size,
    }))
    onAdd(newRushes)
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
          dragging
            ? 'border-brand bg-brand/5'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 text-xl shadow-sm">
          ↑
        </div>
        <p className="text-sm font-medium text-slate-600">
          Déposer les rushs ici
        </p>
        <p className="text-xs text-slate-400">ou cliquer pour parcourir</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {rushes.length > 0 && (
        <ul className="space-y-2">
          {rushes.map((rush) => (
            <li
              key={rush.id}
              className="flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-100 rounded-lg"
            >
              <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                ▶
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{rush.name}</p>
                <p className="text-xs text-slate-400">{formatSize(rush.size)}</p>
              </div>
              <button
                onClick={() => onRemove(rush.id)}
                className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded"
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

- [ ] **Step 2: Commit**

```bash
git add src/components/realisation/FileUploadZone.tsx
git commit -m "feat: add FileUploadZone drag-and-drop component"
```

---

## Chunk 3: List View + Kanban View

### Task 8: ListView component

**Files:**
- Create: `src/components/realisation/ListView.tsx`
- Create: `src/test/ListView.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/test/ListView.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ListView from '../components/realisation/ListView'
import { MOCK_REALISATIONS, MOCK_PRODUCTS } from '../data/mock'

test('renders all realisations in the list', () => {
  render(
    <ListView
      realisations={MOCK_REALISATIONS}
      products={MOCK_PRODUCTS}
      onSelect={() => {}}
    />
  )
  expect(screen.getByText('Unboxing crème hydratante')).toBeInTheDocument()
  expect(screen.getByText('GRWM avec le sac en cuir')).toBeInTheDocument()
})

test('calls onSelect when a row is clicked', () => {
  const handler = vi.fn()
  render(
    <ListView
      realisations={MOCK_REALISATIONS}
      products={MOCK_PRODUCTS}
      onSelect={handler}
    />
  )
  fireEvent.click(screen.getByText('Unboxing crème hydratante'))
  expect(handler).toHaveBeenCalledWith(MOCK_REALISATIONS[0])
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/test/ListView.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement ListView**

Create `src/components/realisation/ListView.tsx`:
```tsx
import type { Realisation, Product } from '../../types/realisation'
import StatusBadge from './StatusBadge'

type Props = {
  realisations: Realisation[]
  products: Product[]
  onSelect: (r: Realisation) => void
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function ListView({ realisations, products, onSelect }: Props) {
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Titre</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Statut</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Produit</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Publication</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Rushs</th>
          </tr>
        </thead>
        <tbody>
          {realisations.map((r) => (
            <tr
              key={r.id}
              onClick={() => onSelect(r)}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 cursor-pointer transition-colors group"
            >
              <td className="px-5 py-4">
                <span className="font-medium text-slate-800 group-hover:text-brand transition-colors">
                  {r.title}
                </span>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-5 py-4 text-slate-500">
                {productMap[r.productId]?.name ?? '—'}
              </td>
              <td className="px-5 py-4 text-slate-500">
                {formatDate(r.publishDate)}
              </td>
              <td className="px-5 py-4">
                {r.rushes.length > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ▶ {r.rushes.length} fichier{r.rushes.length > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-slate-300 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/test/ListView.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/realisation/ListView.tsx src/test/ListView.test.tsx
git commit -m "feat: add ListView component for realisations"
```

---

### Task 9: KanbanView component

**Files:**
- Create: `src/components/realisation/KanbanView.tsx`

Note: KanbanView uses @dnd-kit for drag-and-drop. Each column represents a status. Dropping a card on a column updates its status.

- [ ] **Step 1: Write failing render test**

Create `src/test/KanbanView.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import KanbanView from '../components/realisation/KanbanView'
import { MOCK_REALISATIONS, MOCK_PRODUCTS } from '../data/mock'

test('renders all status column headers', () => {
  render(
    <KanbanView
      realisations={MOCK_REALISATIONS}
      products={MOCK_PRODUCTS}
      onSelect={() => {}}
      onStatusChange={() => {}}
    />
  )
  expect(screen.getByText('À tourner')).toBeInTheDocument()
  expect(screen.getByText('Publiée')).toBeInTheDocument()
})

test('renders card titles in correct columns', () => {
  render(
    <KanbanView
      realisations={MOCK_REALISATIONS}
      products={MOCK_PRODUCTS}
      onSelect={() => {}}
      onStatusChange={() => {}}
    />
  )
  expect(screen.getByText('Unboxing crème hydratante')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/test/KanbanView.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement KanbanView**

Create `src/components/realisation/KanbanView.tsx`:
```tsx
import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import type { Realisation, Product, RealisationStatus } from '../../types/realisation'
import { STATUS_LABELS, STATUS_COLORS } from '../../types/realisation'
import StatusBadge from './StatusBadge'

const ORDERED_STATUSES: RealisationStatus[] = [
  'a_tourner',
  'script',
  'a_monter',
  'a_publier',
  'publiee',
]

type Props = {
  realisations: Realisation[]
  products: Product[]
  onSelect: (r: Realisation) => void
  onStatusChange: (id: string, status: RealisationStatus) => void
}

function KanbanCard({
  realisation,
  product,
  onSelect,
}: {
  realisation: Realisation
  product: Product | undefined
  onSelect: (r: Realisation) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: realisation.id,
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(realisation)}
      className={`bg-white border border-slate-100 rounded-xl p-3.5 cursor-pointer shadow-sm hover:shadow-md transition-all select-none ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <p className="text-sm font-semibold text-slate-800 mb-2 leading-snug">{realisation.title}</p>
      {product && (
        <p className="text-xs text-slate-400 mb-2.5 truncate">{product.name}</p>
      )}
      <div className="flex items-center justify-between">
        <StatusBadge status={realisation.status} size="sm" />
        {realisation.rushes.length > 0 && (
          <span className="text-xs text-slate-400">▶ {realisation.rushes.length}</span>
        )}
      </div>
    </div>
  )
}

function KanbanColumn({
  status,
  realisations,
  products,
  onSelect,
}: {
  status: RealisationStatus
  realisations: Realisation[]
  products: Product[]
  onSelect: (r: Realisation) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const { dot } = STATUS_COLORS[status]
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  return (
    <div className="flex flex-col gap-3 min-w-[220px] flex-1">
      <div className="flex items-center gap-2 px-1">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {STATUS_LABELS[status]}
        </span>
        <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {realisations.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2.5 min-h-[200px] rounded-xl p-2 transition-colors ${
          isOver ? 'bg-brand/5 border-2 border-brand/20' : 'bg-slate-100/50'
        }`}
      >
        {realisations.map((r) => (
          <KanbanCard
            key={r.id}
            realisation={r}
            product={productMap[r.productId]}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

export default function KanbanView({ realisations, products, onSelect, onStatusChange }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event
    setActiveId(null)
    if (over && over.id !== active.id) {
      onStatusChange(active.id as string, over.id as RealisationStatus)
    }
  }

  const activeRealisation = realisations.find((r) => r.id === activeId)
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {ORDERED_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            realisations={realisations.filter((r) => r.status === status)}
            products={products}
            onSelect={onSelect}
          />
        ))}
      </div>
      <DragOverlay>
        {activeRealisation && (
          <div className="bg-white border border-brand/30 rounded-xl p-3.5 shadow-xl w-[220px] opacity-95">
            <p className="text-sm font-semibold text-slate-800">{activeRealisation.title}</p>
            <p className="text-xs text-slate-400 mt-1">
              {productMap[activeRealisation.productId]?.name}
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/test/KanbanView.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/realisation/KanbanView.tsx src/test/KanbanView.test.tsx
git commit -m "feat: add KanbanView with drag-and-drop status change"
```

---

## Chunk 4: Cards View + Side Panel

### Task 10: CardsView component

**Files:**
- Create: `src/components/realisation/CardsView.tsx`

- [ ] **Step 1: Implement CardsView**

Create `src/components/realisation/CardsView.tsx`:
```tsx
import type { Realisation, Product } from '../../types/realisation'
import StatusBadge from './StatusBadge'

type Props = {
  realisations: Realisation[]
  products: Product[]
  onSelect: (r: Realisation) => void
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  })
}

export default function CardsView({ realisations, products, onSelect }: Props) {
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {realisations.map((r) => (
        <div
          key={r.id}
          onClick={() => onSelect(r)}
          className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          {/* Thumbnail */}
          <div className="relative h-40 bg-slate-100 overflow-hidden">
            {r.rushes.length > 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <span className="text-white/60 text-4xl">▶</span>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <span className="text-slate-300 text-3xl">◎</span>
                <span className="text-slate-300 text-xs">Aucun rush</span>
              </div>
            )}
            {/* Status badge overlay */}
            <div className="absolute top-3 right-3">
              <StatusBadge status={r.status} size="sm" />
            </div>
            {/* Rush count badge */}
            {r.rushes.length > 0 && (
              <div className="absolute bottom-3 left-3">
                <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {r.rushes.length} rush{r.rushes.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="p-4">
            <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 group-hover:text-brand transition-colors line-clamp-2">
              {r.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 truncate max-w-[150px]">
                {productMap[r.productId]?.name ?? '—'}
              </span>
              {r.publishDate && (
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {formatDate(r.publishDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/realisation/CardsView.tsx
git commit -m "feat: add CardsView grid component with rush thumbnail"
```

---

### Task 11: RealisationPanel side panel

**Files:**
- Create: `src/components/realisation/RealisationPanel.tsx`

- [ ] **Step 1: Implement RealisationPanel**

Create `src/components/realisation/RealisationPanel.tsx`:
```tsx
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Realisation, Product, RealisationStatus, RushFile } from '../../types/realisation'
import { STATUS_LABELS } from '../../types/realisation'
import StatusBadge from './StatusBadge'
import FileUploadZone from './FileUploadZone'

type Props = {
  realisation: Realisation | null
  products: Product[]
  onClose: () => void
  onUpdate: (updated: Realisation) => void
}

const ALL_STATUSES: RealisationStatus[] = [
  'a_tourner', 'script', 'a_monter', 'a_publier', 'publiee',
]

export default function RealisationPanel({ realisation, products, onClose, onUpdate }: Props) {
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

  function handleAddRushes(files: RushFile[]) {
    if (!draft) return
    update({ rushes: [...draft.rushes, ...files] })
  }

  function handleRemoveRush(id: string) {
    if (!draft) return
    update({ rushes: draft.rushes.filter((r) => r.id !== id) })
  }

  const isOpen = realisation !== null

  return (
    <AnimatePresence>
      {isOpen && draft && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Panel */}
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

              {/* Metadata */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Informations
                </h3>
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

              {/* Rushes */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Rushs
                </h3>
                <FileUploadZone
                  rushes={draft.rushes}
                  onAdd={handleAddRushes}
                  onRemove={handleRemoveRush}
                />
              </section>

              {/* Notes */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Notes
                </h3>
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

- [ ] **Step 2: Write tests for RealisationPanel**

Create `src/test/RealisationPanel.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import RealisationPanel from '../components/realisation/RealisationPanel'
import { MOCK_REALISATIONS, MOCK_PRODUCTS } from '../data/mock'

const realisation = MOCK_REALISATIONS[0]

test('renders nothing when realisation is null', () => {
  const { container } = render(
    <RealisationPanel realisation={null} products={MOCK_PRODUCTS} onClose={() => {}} onUpdate={() => {}} />
  )
  expect(container).toBeEmptyDOMElement()
})

test('renders realisation title when open', () => {
  render(
    <RealisationPanel realisation={realisation} products={MOCK_PRODUCTS} onClose={() => {}} onUpdate={() => {}} />
  )
  expect(screen.getByDisplayValue(realisation.title)).toBeInTheDocument()
})

test('calls onClose when overlay is clicked', () => {
  const onClose = vi.fn()
  render(
    <RealisationPanel realisation={realisation} products={MOCK_PRODUCTS} onClose={onClose} onUpdate={() => {}} />
  )
  const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
  fireEvent.click(overlay)
  expect(onClose).toHaveBeenCalled()
})

test('calls onUpdate when notes are edited', () => {
  const onUpdate = vi.fn()
  render(
    <RealisationPanel realisation={realisation} products={MOCK_PRODUCTS} onClose={() => {}} onUpdate={onUpdate} />
  )
  const textarea = screen.getByPlaceholderText('Ajouter une note…')
  fireEvent.change(textarea, { target: { value: 'nouvelle note' } })
  expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ notes: 'nouvelle note' }))
})
```

- [ ] **Step 3: Run tests to verify they pass**

```bash
npx vitest run src/test/RealisationPanel.test.tsx
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/realisation/RealisationPanel.tsx src/test/RealisationPanel.test.tsx
git commit -m "feat: add RealisationPanel slide-in side panel"
```

---

## Chunk 5: Main Page + Final Polish

### Task 12: Wire everything in the Réalisation page

**Files:**
- Modify: `src/pages/Realisation.tsx`

- [ ] **Step 1: Implement the Réalisation page**

Replace the stub `src/pages/Realisation.tsx` with:
```tsx
import { useState } from 'react'
import type { Realisation, RealisationStatus } from '../types/realisation'
import { MOCK_REALISATIONS, MOCK_PRODUCTS } from '../data/mock'
import ViewSwitcher, { type ViewType } from '../components/realisation/ViewSwitcher'
import ListView from '../components/realisation/ListView'
import KanbanView from '../components/realisation/KanbanView'
import CardsView from '../components/realisation/CardsView'
import RealisationPanel from '../components/realisation/RealisationPanel'

export default function RealisationPage() {
  const [realisations, setRealisations] = useState<Realisation[]>(MOCK_REALISATIONS)
  const [activeView, setActiveView] = useState<ViewType>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = realisations.find((r) => r.id === selectedId) ?? null

  function handleUpdate(updated: Realisation) {
    setRealisations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
  }

  function handleStatusChange(id: string, status: RealisationStatus) {
    setRealisations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
  }

  function handleNew() {
    const newReal: Realisation = {
      id: crypto.randomUUID(),
      title: 'Nouvelle réalisation',
      status: 'a_tourner',
      productId: MOCK_PRODUCTS[0].id,
      publishDate: null,
      notes: '',
      rushes: [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    setRealisations((prev) => [newReal, ...prev])
    setSelectedId(newReal.id)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Réalisation</h1>
          <p className="text-sm text-slate-400 mt-0.5">{realisations.length} vidéos</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Nouvelle vidéo
          </button>
        </div>
      </div>

      {/* Views */}
      {activeView === 'list' && (
        <ListView
          realisations={realisations}
          products={MOCK_PRODUCTS}
          onSelect={(r) => setSelectedId(r.id)}
        />
      )}
      {activeView === 'kanban' && (
        <KanbanView
          realisations={realisations}
          products={MOCK_PRODUCTS}
          onSelect={(r) => setSelectedId(r.id)}
          onStatusChange={handleStatusChange}
        />
      )}
      {activeView === 'cards' && (
        <CardsView
          realisations={realisations}
          products={MOCK_PRODUCTS}
          onSelect={(r) => setSelectedId(r.id)}
        />
      )}

      {/* Side panel */}
      <RealisationPanel
        realisation={selected}
        products={MOCK_PRODUCTS}
        onClose={() => setSelectedId(null)}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
```

- [ ] **Step 2: Verify full flow in browser**

Open the dev server and check:
- List view loads with all 6 mock realisations
- Clicking a row opens the side panel
- Status can be changed from the panel badge
- Notes are editable
- ViewSwitcher toggles between all 3 views
- Kanban: drag a card to another column
- Cards: grid displays with correct thumbnail state
- "+ Nouvelle vidéo" creates a new card and opens the panel immediately

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Realisation.tsx
git commit -m "feat: wire Realisation page with all views and side panel"
```

---

### Task 13: Final visual polish

**Files:**
- Modify: `src/components/layout/Sidebar.tsx` (replace text icons with proper SVG icons)
- Modify: `src/index.css` (add custom scrollbar, font)

- [ ] **Step 1: Add Inter font via Google Fonts**

In `index.html`, add inside `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Update index.css to use Inter and custom scrollbar**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 99px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
```

- [ ] **Step 3: Replace emoji icons in Sidebar with inline SVG icons**

Update `src/components/layout/Sidebar.tsx`. Two changes are required:
1. Change the `NavItem` type: `icon: string` → `icon: React.ReactNode`
2. Replace the `NAV_ITEMS` array with SVG-based icons
3. The render line `<span className="text-base w-5 text-center">{item.icon}</span>` can stay — SVG renders fine inside a `<span>`

```tsx
type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="2" fill="currentColor" opacity=".8"/>
        <rect x="10" y="1" width="7" height="7" rx="2" fill="currentColor" opacity=".4"/>
        <rect x="1" y="10" width="7" height="7" rx="2" fill="currentColor" opacity=".4"/>
        <rect x="10" y="10" width="7" height="7" rx="2" fill="currentColor" opacity=".8"/>
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 14 L6 8 L10 11 L14 4 L16 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'realisation',
    label: 'Réalisation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.8"/>
        <polygon points="7.5,6 13,9 7.5,12" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'produits',
    label: 'Produits',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
      </svg>
    ),
  },
  {
    id: 'parametres',
    label: 'Paramètres',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]
```

- [ ] **Step 4: Final browser check**

Verify the complete UI looks polished:
- Inter font rendering correctly
- Sidebar icons clean and consistent
- Scrollbar subtle in the side panel
- All 3 views visually coherent

- [ ] **Step 5: Commit**

```bash
git add src/index.css index.html src/components/layout/Sidebar.tsx
git commit -m "polish: add Inter font, custom scrollbar, SVG nav icons"
```

---

## Summary

| Chunk | Tasks | Deliverable |
|---|---|---|
| 1 | 1–4 | Project setup, types, mock data, app shell |
| 2 | 5–7 | StatusBadge, ViewSwitcher, FileUploadZone |
| 3 | 8–9 | ListView, KanbanView with drag-and-drop |
| 4 | 10–11 | CardsView, RealisationPanel |
| 5 | 12–13 | Full page wiring + visual polish |
