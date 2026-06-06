import { useState } from 'react'
import type { Product } from '../types/realisation'
import ViewSwitcher from '../components/realisation/ViewSwitcher'
import type { ViewType } from '../components/realisation/ViewSwitcher'
import ProductCardsView from '../components/produits/ProductCardsView'
import ProductListView from '../components/produits/ProductListView'
import ProductPanel from '../components/produits/ProductPanel'
import { useProducts, useRealisations } from '../hooks/useFirestore'
import { fsAddProduct, fsUpdateProduct, fsDeleteProduct } from '../lib/firestore'

const PRODUCT_VIEWS: ViewType[] = ['cards', 'list']

export default function ProduitsPage() {
  const { data: products } = useProducts()
  const { data: realisations } = useRealisations()
  const [activeView, setActiveView] = useState<ViewType>('cards')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = products.find((p) => p.id === selectedId) ?? null

  async function handleUpdate(updated: Product) {
    const { id, ...data } = updated
    await fsUpdateProduct(id, data)
  }

  async function handleDelete(id: string) {
    if (selectedId === id) setSelectedId(null)
    await fsDeleteProduct(id)
  }

  async function handleNew() {
    const id = await fsAddProduct({
      name: 'Nouveau produit',
      imageUrl: 'https://placehold.co/400x400/e2e8f0/94a3b8?text=Prod',
      description: '',
      status: 'actif',
    })
    setSelectedId(id)
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produits</h1>
          <p className="text-sm text-slate-400 mt-0.5">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} views={PRODUCT_VIEWS} />
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Nouveau produit
          </button>
        </div>
      </div>

      {activeView === 'cards' && (
        <ProductCardsView products={products} realisations={realisations} onSelect={(p) => setSelectedId(p.id)} />
      )}
      {activeView === 'list' && (
        <ProductListView products={products} realisations={realisations} onSelect={(p) => setSelectedId(p.id)} onDelete={handleDelete} />
      )}

      <ProductPanel
        product={selected}
        realisations={realisations}
        onClose={() => setSelectedId(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}
