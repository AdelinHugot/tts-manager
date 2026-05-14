import type { Realisation, Product } from '../types/realisation'
import type { Rush } from '../types/rush'

export const MOCK_RUSHES: Rush[] = [
  { id: 'f1', name: 'rush_01.mp4',         url: '#', size: 245_000_000, duration: 45, thumbnailUrl: '' },
  { id: 'f2', name: 'broll_01.mp4',        url: '#', size: 120_000_000, duration: 23, thumbnailUrl: '' },
  { id: 'f3', name: 'final_v2.mp4',        url: '#', size: 310_000_000, duration: 67, thumbnailUrl: '' },
  { id: 'f4', name: 'rush_matin_01.mp4',   url: '#', size: 450_000_000, duration: 89, thumbnailUrl: '' },
  { id: 'f5', name: 'rush_matin_02.mp4',   url: '#', size: 200_000_000, duration: 34, thumbnailUrl: '' },
]

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
    rushIds: ['f1', 'f2'],
    createdAt: '2026-04-15',
  },
  {
    id: 'r2',
    title: 'GRWM avec le sac en cuir',
    status: 'a_publier',
    productId: 'p2',
    publishDate: '2026-05-10',
    notes: 'Penser à ajouter le lien produit en bio.',
    rushIds: ['f3'],
    createdAt: '2026-05-01',
  },
  {
    id: 'r3',
    title: 'Review montre — lifestyle morning',
    status: 'a_monter',
    productId: 'p3',
    publishDate: '2026-05-15',
    notes: '',
    rushIds: ['f4', 'f5'],
    createdAt: '2026-05-03',
  },
  {
    id: 'r4',
    title: 'Tuto diffuseur — 3 mélanges',
    status: 'script',
    productId: 'p4',
    publishDate: '2026-05-22',
    notes: 'Script en cours, angle bien-être + sommeil.',
    rushIds: [],
    createdAt: '2026-05-05',
  },
  {
    id: 'r5',
    title: 'Crème hydratante — before/after',
    status: 'a_tourner',
    productId: 'p1',
    publishDate: '2026-05-28',
    notes: '',
    rushIds: [],
    createdAt: '2026-05-06',
  },
  {
    id: 'r6',
    title: 'Sac en cuir — styling 5 tenues',
    status: 'a_tourner',
    productId: 'p2',
    publishDate: null,
    notes: '',
    rushIds: [],
    createdAt: '2026-05-07',
  },
]
