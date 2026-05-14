# Produits Page Design

## Goal

Build a full CRUD product management page with Cards and List views, a slide-in side panel for editing, and display of linked réalisations per product.

## Context

Products are the reference database that Réalisations link to via `productId`. Commission and pricing data will be computed from a future Orders page — the Produits page shows `0` as a placeholder for now.

## Data Model

Extend the existing `Product` type:

```ts
export type Product = {
  id: string
  name: string
  imageUrl: string
  description: string
  status: 'actif' | 'rupture_stock' | 'inactif'
  url?: string
}

export const PRODUCT_STATUS_LABELS: Record<Product['status'], string> = {
  actif: 'Actif',
  rupture_stock: 'Rupture de stock',
  inactif: 'Inactif',
}

export const PRODUCT_STATUS_COLORS: Record<Product['status'], { dot: string; badge: string }> = {
  actif: { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-600' },
  rupture_stock: { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-600' },
  inactif: { dot: 'bg-slate-300', badge: 'bg-slate-100 text-slate-500' },
}
```

## Architecture

### Files modified
- `src/types/realisation.ts` — extend Product type, add status labels/colors
- `src/data/mock.ts` — update 4 mock products with new fields
- `src/components/realisation/ViewSwitcher.tsx` — add optional `views?: ViewType[]` prop

### Files created
- `src/pages/Produits.tsx` — page with state management
- `src/components/produits/ProductCardsView.tsx` — grid cards view
- `src/components/produits/ProductListView.tsx` — table list view
- `src/components/produits/ProductPanel.tsx` — side panel

## Components

### ViewSwitcher extension
Add optional `views?: ViewType[]` prop. When provided, only render buttons for those views. Default behavior unchanged (all 3 views).

### ProductCardsView
Responsive grid of product cards. Each card shows:
- Product image (aspect-square, object-cover, rounded-xl)
- Status badge (color-coded pill)
- Product name (font-semibold)
- Nb of linked réalisations (count from `realisations` prop filtered by `productId`)
- Commission total: `0 €` placeholder

Clickable → `onSelect(product)`.

### ProductListView
Table with columns: Image (40px thumbnail), Nom, Statut, Vidéos, Commission, Actions (delete button).
Row click → `onSelect(product)`.

### ProductPanel
480px slide-in panel from right. Pattern mirrors RealisationPanel exactly:
- `AnimatePresence` + `motion.div` with spring transition
- Dark overlay (click to close)
- Draft state: edits are buffered, saved on "Sauvegarder" click
- Fields: name (text input), description (textarea), status (select), url (text input)
- Section "Réalisations liées": list of réalisations filtered by `productId`, each showing title + status badge, clickable (no-op for now)
- Delete button at bottom with confirmation

### ProduitsPage
State:
- `products: Product[]` — initialized from MOCK_PRODUCTS
- `activeView: 'cards' | 'list'`
- `selectedId: string | null`

Operations:
- `handleNew()` — prepend new product with default fields, select it
- `handleUpdate(updated: Product)` — replace in array
- `handleDelete(id: string)` — filter out, clear selection

## Design Tokens
Same as rest of app: bg `#F4F6FA`, cards white with `border-slate-100`, accent `brand: #3B5BFF`.

## Out of Scope
- Real commission data (deferred to Orders page)
- Image upload (imageUrl remains a string URL for now)
- Search/filter
