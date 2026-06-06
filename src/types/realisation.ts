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

export type Realisation = {
  id: string
  title: string
  status: RealisationStatus
  productId: string
  publishDate: string | null
  notes: string
  rushIds: string[]
  createdAt: string
  tiktokUrl?: string   // lien vers la vidéo TikTok publiée
}

export type ProductStatus = 'actif' | 'rupture_stock' | 'inactif'

export type Product = {
  id: string
  name: string
  imageUrl: string
  description: string
  status: ProductStatus
  url?: string
  marqueId?: string          // référence vers la collection marques
  tiktokProductId?: string   // ID TikTok Shop du produit (pour lien direct)
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

export type Comment = {
  id: string
  text: string
  authorName: string
  authorEmail: string
  authorPhotoURL?: string
  createdAt: string   // ISO string
}
