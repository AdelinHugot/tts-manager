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
