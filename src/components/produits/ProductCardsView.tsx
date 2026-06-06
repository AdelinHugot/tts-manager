import type { Product, Realisation } from '../../types/realisation'
import { PRODUCT_STATUS_LABELS, PRODUCT_STATUS_COLORS } from '../../types/realisation'
import ProductImage from './ProductImage'

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
              <ProductImage
                imageUrl={product.imageUrl}
                name={product.name}
                className="group-hover:scale-105 transition-transform duration-300"
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
