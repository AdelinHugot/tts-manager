export type OrderStatus = 'Réglée' | 'Inéligible' | 'En attente'
export type OrderType = 'affiliée' | 'pub_shopping'
export type Period = '7j' | '30j' | '3m' | '6m' | 'tout'

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
}

export type KPIData = {
  totalCA: number
  totalCommissions: number
  totalOrders: number
  validatedOrders: number
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
