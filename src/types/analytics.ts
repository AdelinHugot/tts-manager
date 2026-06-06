export type OrderStatus = 'Réglée' | 'Inéligible' | 'En attente'
export type OrderType = 'affiliée' | 'pub_shopping'
export type Period =
  | 'ce_mois'
  | 'mois_precedent'
  | 'ce_trimestre'
  | 'trimestre_precedent'
  | 'cette_annee'
  | 'annee_derniere'

export type Order = {
  id: string
  date: Date
  productName: string
  boutiqueName: string
  price: number
  commissionStandard: number
  commissionPub: number
  orderType: OrderType
  status: OrderStatus
  videoUrl?: string          // URL TikTok de la vidéo ayant généré la commande (col 7 CSV)
  tiktokProductId?: string   // ID produit TikTok Shop (col 3 XLSX)
}

export type KPIData = {
  totalCA: number
  totalCommissions: number
  totalOrders: number      // all statuses
  validatedOrders: number  // Réglée only
  enAttenteOrders: number  // pending, may still be paid or cancelled
  ineligibleOrders: number // won't generate any commission
  averageBasket: number
  caGrowth: number | null
  commissionsGrowth: number | null
  ordersGrowth: number | null
}

export type WeeklyPoint = {
  week: string
  ca: number
  commissions: number
}

export type TopItem = {
  name: string
  ca: number
  commissions: number
  orderCount: number
}
