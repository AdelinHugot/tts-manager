# Produits Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full CRUD product management page with Cards and List views, a slide-in side panel for editing, and display of linked réalisations per product.

**Architecture:** Extend the existing `Product` type with `description`, `status`, and `url` fields. Reuse the ViewSwitcher (with a new optional `views` filter prop), and follow the RealisationPanel pattern exactly for the ProductPanel (AnimatePresence + spring motion, draft state, inline editing).

**Tech Stack:** React 18, TypeScript, Vite, TailwindCSS v3, Framer Motion, Vitest + React Testing Library

---

## Chunk 1: Types, Data, ViewSwitcher

### Task 1: Extend Product type and update mock data

**Files:**
- Modify: `src/types/realisation.ts`
- Modify: `src/data/mock.ts`

- [ ] **Step 1: Write the failing test**

Create `src/test/ProductType.test.ts`:

```ts
import { MOCK_PRODUCTS } from '../data/mock'
import { PRODUCT_STATUS_LABELS, PRODUCT_STATUS_COLORS } from '../types/realisation'

test('all mock products have required fields', () => {
  for (const p of MOCK_PRODUCTS) {
    expect(p.id).toBeTruthy()
    expect(p.name).toBeTruthy()
    expect(p.imageUrl).toBeTruthy()
    expect(p.description).toBeDefined()
    expect(['actif', 'rupture_stock', 'inactif']).toContain(p.status)
  }
})

test('PRODUCT_STATUS_LABELS covers all statuses', () => {
  expect(PRODUCT_STATUS_LABELS['actif']).toBe('Actif')
  expect(PRODUCT_STATUS_LABELS['rupture_stock']).toBe('Rupture de stock')
  expect(PRODUCT_STATUS_LABELS['inactif']).toBe('Inactif')
})

test('PRODUCT_STATUS_COLORS covers all statuses', () => {
  for (const status of ['actif', 'rupture_stock', 'inactif'] as const) {
    expect(PRODUCT_STATUS_COLORS[status].dot).toBeTruthy()
    expect(PRODUCT_STATUS_COLORS[status].badge).toBeTruthy()
  }
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/ProductType.test.ts`
Expected: FAIL (PRODUCT_STATUS_LABELS not exported, Product missing fields)

- [ ] **Step 3: Extend `src/types/realisation.ts`**

In `src/types/realisation.ts`, find and replace the entire `Product` type block (starting from `export type Product = {` to the closing `}` — currently lines 42–46) with the following block. The rest of the file stays unchanged:

```ts
export type ProductStatus = 'actif' | 'rupture_stock' | 'inactif'

export type Product = {
  id: string
  name: string
  imageUrl: string
  description: string
  status: ProductStatus
  url?: string
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  actif: 'Actif',
  rupture_stock: 'Rupture de stock',
  inactif: 'Inactif',
}

export const PRODUCT_STATUS_COLORS: Record<ProductStatus, { dot: string; badge: string }> = {
  actif:         { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-600' },
  rupture_stock: { dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-600' },
  inactif:       { dot: 'bg-slate-300',   badge: 'bg-slate-100 text-slate-500' },
}
```

- [ ] **Step 4: Update `src/data/mock.ts` MOCK_PRODUCTS**

Replace the 4 products with:

```ts
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Crème hydratante bio',
    imageUrl: 'https://placehold.co/400x400/e2e8f0/94a3b8?text=Prod',
    description: 'Crème visage à base d\'aloe vera et d\'huile de jojoba. Convient à tous types de peaux.',
    status: 'actif',
    url: 'https://shop.tiktok.com/p1',
  },
  {
    id: 'p2',
    name: 'Sac en cuir végétal',
    imageUrl: 'https://placehold.co/400x400/e2e8f0/94a3b8?text=Prod',
    description: 'Sac à main fabriqué en cuir végétal certifié, disponible en 3 coloris.',
    status: 'actif',
    url: 'https://shop.tiktok.com/p2',
  },
  {
    id: 'p3',
    name: 'Montre minimaliste',
    imageUrl: 'https://placehold.co/400x400/e2e8f0/94a3b8?text=Prod',
    description: 'Montre analogique au design épuré, bracelet interchangeable, résistante à l\'eau.',
    status: 'rupture_stock',
    url: 'https://shop.tiktok.com/p3',
  },
  {
    id: 'p4',
    name: 'Diffuseur huiles essentielles',
    imageUrl: 'https://placehold.co/400x400/e2e8f0/94a3b8?text=Prod',
    description: 'Diffuseur ultrasonique 300ml, 7 couleurs LED, minuterie intégrée.',
    status: 'actif',
    url: 'https://shop.tiktok.com/p4',
  },
]
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/test/ProductType.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 6: Run TypeScript check and full test suite**

Run: `npx tsc --noEmit && npx vitest run`
Expected: PASS — zero TypeScript errors, all existing tests pass. TypeScript is the authoritative gate: any inline `Product` construction missing the new required fields (`status`, `description`) will be caught here as a compile error.

- [ ] **Step 7: Commit**

```bash
git add src/types/realisation.ts src/data/mock.ts src/test/ProductType.test.ts
git commit -m "feat: extend Product type with description, status, url and add status labels/colors"
```

---

### Task 2: Extend ViewSwitcher with optional views filter

**Files:**
- Modify: `src/components/realisation/ViewSwitcher.tsx`
- Modify: `src/test/ViewSwitcher.test.tsx`

- [ ] **Step 1: Read the existing ViewSwitcher test**

Read `src/test/ViewSwitcher.test.tsx` to understand what's currently tested.

- [ ] **Step 2: Write the failing test**

Append only these two test blocks at the bottom of `src/test/ViewSwitcher.test.tsx` (do not duplicate the existing imports):

```tsx
test('shows only specified views when views prop is provided', () => {
  render(
    <ViewSwitcher activeView="cards" onViewChange={() => {}} views={['list', 'cards']} />
  )
  expect(screen.getByTitle('Vue Liste')).toBeInTheDocument()
  expect(screen.getByTitle('Vue Cards')).toBeInTheDocument()
  expect(screen.queryByTitle('Vue Kanban')).not.toBeInTheDocument()
})

test('shows all views when views prop is omitted', () => {
  render(<ViewSwitcher activeView="list" onViewChange={() => {}} />)
  expect(screen.getByTitle('Vue Liste')).toBeInTheDocument()
  expect(screen.getByTitle('Vue Kanban')).toBeInTheDocument()
  expect(screen.getByTitle('Vue Cards')).toBeInTheDocument()
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/test/ViewSwitcher.test.tsx`
Expected: FAIL (views prop not accepted yet)

- [ ] **Step 4: Replace `src/components/realisation/ViewSwitcher.tsx` entirely with:**

```tsx
import type { ReactNode } from 'react'

export type ViewType = 'list' | 'kanban' | 'cards'

type Props = {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
  views?: ViewType[]
}

const VIEWS: { id: ViewType; label: string; icon: ReactNode }[] = [
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

export default function ViewSwitcher({ activeView, onViewChange, views }: Props) {
  const visibleViews = views ? VIEWS.filter((v) => views.includes(v.id)) : VIEWS

  return (
    <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-lg">
      {visibleViews.map((view) => (
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

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/test/ViewSwitcher.test.tsx`
Expected: PASS (all tests)

- [ ] **Step 6: Run TypeScript check and full test suite**

Run: `npx tsc --noEmit && npx vitest run`
Expected: PASS — zero TypeScript errors, all tests pass (RealisationPage still calls ViewSwitcher without the `views` prop, which remains valid since the prop is optional)

- [ ] **Step 7: Commit**

```bash
git add src/components/realisation/ViewSwitcher.tsx src/test/ViewSwitcher.test.tsx
git commit -m "feat: add optional views filter prop to ViewSwitcher"
```

---

## Chunk 2: View Components

### Task 3: Create ProductCardsView

**Files:**
- Create: `src/components/produits/ProductCardsView.tsx`
- Create: `src/test/ProductCardsView.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/ProductCardsView.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCardsView from '../components/produits/ProductCardsView'
import { MOCK_PRODUCTS } from '../data/mock'
import { MOCK_REALISATIONS } from '../data/mock'

test('renders all product names', () => {
  render(
    <ProductCardsView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
    />
  )
  expect(screen.getByText('Crème hydratante bio')).toBeInTheDocument()
  expect(screen.getByText('Sac en cuir végétal')).toBeInTheDocument()
  expect(screen.getByText('Montre minimaliste')).toBeInTheDocument()
  expect(screen.getByText('Diffuseur huiles essentielles')).toBeInTheDocument()
})

test('shows correct realisation count per product', () => {
  render(
    <ProductCardsView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
    />
  )
  // p1 has r1 + r5 = 2 réalisations
  expect(screen.getByText('2 vidéos')).toBeInTheDocument()
})

test('calls onSelect when a card is clicked', () => {
  const handler = vi.fn()
  render(
    <ProductCardsView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={handler}
    />
  )
  fireEvent.click(screen.getByText('Crème hydratante bio'))
  expect(handler).toHaveBeenCalledWith(MOCK_PRODUCTS[0])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/ProductCardsView.test.tsx`
Expected: FAIL (module not found)

- [ ] **Step 3: Create `src/components/produits/ProductCardsView.tsx`**

```tsx
import type { Product, Realisation } from '../../types/realisation'
import { PRODUCT_STATUS_LABELS, PRODUCT_STATUS_COLORS } from '../../types/realisation'

type Props = {
  products: Product[]
  realisations: Realisation[]
  onSelect: (p: Product) => void
}

export default function ProductCardsView({ products, realisations, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const count = realisations.filter((r) => r.productId === product.id).length
        const { dot, badge } = PRODUCT_STATUS_COLORS[product.status]

        return (
          <div
            key={product.id}
            onClick={() => onSelect(product)}
            className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            {/* Image */}
            <div className="relative aspect-square bg-slate-100 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full font-medium px-2 py-0.5 text-xs ${badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                  {PRODUCT_STATUS_LABELS[product.status]}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-3 group-hover:text-brand transition-colors line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{count} vidéo{count !== 1 ? 's' : ''}</span>
                <span className="font-medium text-slate-500">0 €</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/ProductCardsView.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/produits/ProductCardsView.tsx src/test/ProductCardsView.test.tsx
git commit -m "feat: add ProductCardsView component"
```

---

### Task 4: Create ProductListView

**Files:**
- Create: `src/components/produits/ProductListView.tsx`
- Create: `src/test/ProductListView.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/ProductListView.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ProductListView from '../components/produits/ProductListView'
import { MOCK_PRODUCTS, MOCK_REALISATIONS } from '../data/mock'

test('renders all product names in table', () => {
  render(
    <ProductListView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
      onDelete={() => {}}
    />
  )
  expect(screen.getByText('Crème hydratante bio')).toBeInTheDocument()
  expect(screen.getByText('Sac en cuir végétal')).toBeInTheDocument()
})

test('calls onSelect when a row is clicked', () => {
  const handler = vi.fn()
  render(
    <ProductListView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={handler}
      onDelete={() => {}}
    />
  )
  fireEvent.click(screen.getByText('Crème hydratante bio'))
  expect(handler).toHaveBeenCalledWith(MOCK_PRODUCTS[0])
})

test('calls onDelete when delete button is clicked', () => {
  const handler = vi.fn()
  render(
    <ProductListView
      products={MOCK_PRODUCTS}
      realisations={MOCK_REALISATIONS}
      onSelect={() => {}}
      onDelete={handler}
    />
  )
  const deleteButtons = screen.getAllByTitle('Supprimer')
  fireEvent.click(deleteButtons[0])
  expect(handler).toHaveBeenCalledWith(MOCK_PRODUCTS[0].id)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/ProductListView.test.tsx`
Expected: FAIL (module not found)

- [ ] **Step 3: Create `src/components/produits/ProductListView.tsx`**

```tsx
import type { Product, Realisation } from '../../types/realisation'
import { PRODUCT_STATUS_LABELS, PRODUCT_STATUS_COLORS } from '../../types/realisation'

type Props = {
  products: Product[]
  realisations: Realisation[]
  onSelect: (p: Product) => void
  onDelete: (id: string) => void
}

export default function ProductListView({ products, realisations, onSelect, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Produit</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Statut</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Vidéos</th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">Commission</th>
            <th className="px-5 py-3.5" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const count = realisations.filter((r) => r.productId === product.id).length
            const { dot, badge } = PRODUCT_STATUS_COLORS[product.status]

            return (
              <tr
                key={product.id}
                onClick={() => onSelect(product)}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 cursor-pointer transition-colors group"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                    />
                    <span className="font-medium text-slate-800 group-hover:text-brand transition-colors">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full font-medium px-2.5 py-1 text-xs ${badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                    {PRODUCT_STATUS_LABELS[product.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {count} vidéo{count !== 1 ? 's' : ''}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  0 €
                </td>
                <td className="px-5 py-4">
                  <button
                    title="Supprimer"
                    onClick={(e) => { e.stopPropagation(); onDelete(product.id) }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 3.5h10M5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 7a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/ProductListView.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/produits/ProductListView.tsx src/test/ProductListView.test.tsx
git commit -m "feat: add ProductListView component"
```

---

## Chunk 3: Panel + Page

### Task 5: Create ProductPanel

**Files:**
- Create: `src/components/produits/ProductPanel.tsx`
- Create: `src/test/ProductPanel.test.tsx`

**Note on live updates:** ProductPanel calls `onUpdate` on every field change (deliberate deviation from the spec's "buffered save" note — follows the established RealisationPanel pattern for consistency). There is no separate "Save" button.

**Note on realisation status imports:** `STATUS_LABELS` and `STATUS_COLORS` are already exported from `src/types/realisation.ts`. `STATUS_COLORS` has the shape `{ bg: string; text: string; dot: string }` — verified in the existing file at lines 16–22. These are distinct from `PRODUCT_STATUS_LABELS`/`PRODUCT_STATUS_COLORS` which use `{ dot, badge }`.

**Note on réalisation rows:** Each linked réalisation row must have `onClick={() => {}}` and `cursor-pointer` (no-op click per spec).

- [ ] **Step 1: Write the failing test**

Create `src/test/ProductPanel.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ProductPanel from '../components/produits/ProductPanel'
import { MOCK_PRODUCTS, MOCK_REALISATIONS } from '../data/mock'

const product = MOCK_PRODUCTS[0]

test('renders nothing when product is null', () => {
  const { container } = render(
    <ProductPanel
      product={null}
      realisations={MOCK_REALISATIONS}
      onClose={() => {}}
      onUpdate={() => {}}
      onDelete={() => {}}
    />
  )
  expect(container).toBeEmptyDOMElement()
})

test('renders product name when open', () => {
  render(
    <ProductPanel
      product={product}
      realisations={MOCK_REALISATIONS}
      onClose={() => {}}
      onUpdate={() => {}}
      onDelete={() => {}}
    />
  )
  expect(screen.getByDisplayValue(product.name)).toBeInTheDocument()
})

test('calls onClose when overlay is clicked', () => {
  const onClose = vi.fn()
  render(
    <ProductPanel
      product={product}
      realisations={MOCK_REALISATIONS}
      onClose={onClose}
      onUpdate={() => {}}
      onDelete={() => {}}
    />
  )
  const overlay = document.querySelector('.fixed.inset-0') as HTMLElement
  fireEvent.click(overlay)
  expect(onClose).toHaveBeenCalled()
})

test('calls onUpdate when description is edited', () => {
  const onUpdate = vi.fn()
  render(
    <ProductPanel
      product={product}
      realisations={MOCK_REALISATIONS}
      onClose={() => {}}
      onUpdate={onUpdate}
      onDelete={() => {}}
    />
  )
  const textarea = screen.getByPlaceholderText('Description du produit…')
  fireEvent.change(textarea, { target: { value: 'nouvelle description' } })
  expect(onUpdate).toHaveBeenCalledWith(
    expect.objectContaining({ description: 'nouvelle description' })
  )
})

test('shows linked realisations', () => {
  render(
    <ProductPanel
      product={product}
      realisations={MOCK_REALISATIONS}
      onClose={() => {}}
      onUpdate={() => {}}
      onDelete={() => {}}
    />
  )
  // p1 has r1 "Unboxing crème hydratante" and r5 "Crème hydratante — before/after"
  expect(screen.getByText('Unboxing crème hydratante')).toBeInTheDocument()
  expect(screen.getByText('Crème hydratante — before/after')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/ProductPanel.test.tsx`
Expected: FAIL (module not found)

- [ ] **Step 3: Create `src/components/produits/ProductPanel.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Product, Realisation, ProductStatus } from '../../types/realisation'
import { PRODUCT_STATUS_LABELS, PRODUCT_STATUS_COLORS, STATUS_LABELS, STATUS_COLORS } from '../../types/realisation'

type Props = {
  product: Product | null
  realisations: Realisation[]
  onClose: () => void
  onUpdate: (updated: Product) => void
  onDelete: (id: string) => void
}

const ALL_STATUSES: ProductStatus[] = ['actif', 'rupture_stock', 'inactif']

export default function ProductPanel({ product, realisations, onClose, onUpdate, onDelete }: Props) {
  const [draft, setDraft] = useState<Product | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setDraft(product ? { ...product } : null)
    setConfirmDelete(false)
  }, [product])

  function update(patch: Partial<Product>) {
    if (!draft) return
    const updated = { ...draft, ...patch }
    setDraft(updated)
    onUpdate(updated)
  }

  const linked = product ? realisations.filter((r) => r.productId === product.id) : []
  const isOpen = product !== null

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
              <div className="flex items-center gap-4 flex-1 pr-4">
                <img
                  src={draft.imageUrl}
                  alt={draft.name}
                  className="w-14 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <input
                    className="text-base font-semibold text-slate-900 w-full outline-none focus:ring-2 focus:ring-brand/30 rounded-lg px-2 py-1 -mx-2 -my-1 hover:bg-slate-50 transition-colors"
                    value={draft.name}
                    onChange={(e) => update({ name: e.target.value })}
                  />
                  <div className="mt-2">
                    <select
                      value={draft.status}
                      onChange={(e) => update({ status: e.target.value as ProductStatus })}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{PRODUCT_STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
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

              {/* Description */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Description
                </h3>
                <textarea
                  value={draft.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="Description du produit…"
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 resize-none placeholder-slate-300"
                />
              </section>

              {/* URL */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Lien TikTok Shop
                </h3>
                <input
                  type="url"
                  value={draft.url ?? ''}
                  onChange={(e) => update({ url: e.target.value || undefined })}
                  placeholder="https://shop.tiktok.com/…"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 placeholder-slate-300"
                />
              </section>

              {/* Réalisations liées */}
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Réalisations liées
                  <span className="ml-2 font-medium text-slate-300 normal-case tracking-normal">({linked.length})</span>
                </h3>
                {linked.length === 0 ? (
                  <p className="text-sm text-slate-300 italic">Aucune vidéo réalisée sur ce produit.</p>
                ) : (
                  <div className="space-y-2">
                    {linked.map((r) => {
                      const { bg, text, dot } = STATUS_COLORS[r.status]
                      return (
                        <div
                          key={r.id}
                          onClick={() => {}}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700 truncate mr-3">{r.title}</span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full font-medium px-2 py-0.5 text-xs flex-shrink-0 ${bg} ${text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                            {STATUS_LABELS[r.status]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* Footer: delete */}
            <div className="p-6 border-t border-slate-100">
              {confirmDelete ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 flex-1">Supprimer ce produit ?</span>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => { onDelete(draft.id); onClose() }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M8.5 6v4M3 3.5l.7 7a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9l.7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Supprimer le produit
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/ProductPanel.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: PASS — zero errors. This confirms `STATUS_LABELS`, `STATUS_COLORS`, `PRODUCT_STATUS_LABELS`, `PRODUCT_STATUS_COLORS` are all correctly imported and their shapes match usage.

- [ ] **Step 6: Commit**

```bash
git add src/components/produits/ProductPanel.tsx src/test/ProductPanel.test.tsx
git commit -m "feat: add ProductPanel with inline editing and linked réalisations"
```

---

### Task 6: Build ProduitsPage and wire everything together

**Files:**
- Modify: `src/pages/Produits.tsx`
- Create: `src/test/ProduitsPage.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/ProduitsPage.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ProduitsPage from '../pages/Produits'

test('renders page title', () => {
  render(<ProduitsPage />)
  expect(screen.getByText('Produits')).toBeInTheDocument()
})

test('shows product count', () => {
  render(<ProduitsPage />)
  expect(screen.getByText(/4 produits/)).toBeInTheDocument()
})

test('renders cards view by default', () => {
  render(<ProduitsPage />)
  expect(screen.getByText('Crème hydratante bio')).toBeInTheDocument()
})

test('can switch to list view', () => {
  render(<ProduitsPage />)
  fireEvent.click(screen.getByTitle('Vue Liste'))
  // table header appears
  expect(screen.getByText('Produit')).toBeInTheDocument()
})

test('clicking nouveau produit adds a product and opens panel', () => {
  render(<ProduitsPage />)
  fireEvent.click(screen.getByText('Nouveau produit'))
  expect(screen.getByText(/5 produits/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/test/ProduitsPage.test.tsx`
Expected: FAIL (page is a stub)

- [ ] **Step 3: Replace `src/pages/Produits.tsx`**

```tsx
import { useState } from 'react'
import type { Product } from '../types/realisation'
import { MOCK_PRODUCTS, MOCK_REALISATIONS } from '../data/mock'
import ViewSwitcher from '../components/realisation/ViewSwitcher'
import type { ViewType } from '../components/realisation/ViewSwitcher'
import ProductCardsView from '../components/produits/ProductCardsView'
import ProductListView from '../components/produits/ProductListView'
import ProductPanel from '../components/produits/ProductPanel'

const PRODUCT_VIEWS: ViewType[] = ['cards', 'list']

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [activeView, setActiveView] = useState<ViewType>('cards')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = products.find((p) => p.id === selectedId) ?? null

  function handleUpdate(updated: Product) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  function handleNew() {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: 'Nouveau produit',
      imageUrl: 'https://placehold.co/400x400/e2e8f0/94a3b8?text=Prod',
      description: '',
      status: 'actif',
    }
    setProducts((prev) => [newProduct, ...prev])
    setSelectedId(newProduct.id)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produits</h1>
          <p className="text-sm text-slate-400 mt-0.5">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewSwitcher
            activeView={activeView}
            onViewChange={setActiveView}
            views={PRODUCT_VIEWS}
          />
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Nouveau produit
          </button>
        </div>
      </div>

      {/* Views */}
      {activeView === 'cards' && (
        <ProductCardsView
          products={products}
          realisations={MOCK_REALISATIONS}
          onSelect={(p) => setSelectedId(p.id)}
        />
      )}
      {activeView === 'list' && (
        <ProductListView
          products={products}
          realisations={MOCK_REALISATIONS}
          onSelect={(p) => setSelectedId(p.id)}
          onDelete={handleDelete}
        />
      )}

      {/* Side panel */}
      <ProductPanel
        product={selected}
        realisations={MOCK_REALISATIONS}
        onClose={() => setSelectedId(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/test/ProduitsPage.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Run TypeScript check and full test suite**

Run: `npx tsc --noEmit && npx vitest run`
Expected: PASS — zero TypeScript errors, all tests pass

- [ ] **Step 6: Commit**

```bash
git add src/pages/Produits.tsx src/test/ProduitsPage.test.tsx
git commit -m "feat: build Produits page with Cards/List views, CRUD, and side panel"
```
