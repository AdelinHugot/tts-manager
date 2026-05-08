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
