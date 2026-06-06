import { useEffect, useRef, useState } from 'react'
import {
  collection, onSnapshot, query, orderBy,
  getDocs, where, limit, startAfter,
  type QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import {
  toRealisation,
  toRush,
  toProduct,
  toOrder,
  toIdea,
  toMarque,
  type FirestoreIdea,
} from '../lib/firestore'
import type { Realisation, Product } from '../types/realisation'
import type { Rush } from '../types/rush'
import type { Order } from '../types/analytics'
import type { Marque } from '../types/marque'

type CollectionState<T> = { data: T[]; loading: boolean; error: string | null }

function useCollection<T>(
  collectionName: string,
  converter: (id: string, d: Record<string, unknown>) => T,
  orderByField?: string
): CollectionState<T> {
  const [state, setState] = useState<CollectionState<T>>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const col = collection(db, collectionName)
    const q = orderByField ? query(col, orderBy(orderByField, 'desc')) : col

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) =>
          converter(d.id, d.data() as Record<string, unknown>)
        )
        setState({ data, loading: false, error: null })
      },
      (err) => {
        console.error(`[Firestore] ${collectionName}:`, err)
        setState((s) => ({ ...s, loading: false, error: err.message }))
      }
    )

    return unsub
  }, [collectionName, orderByField]) // eslint-disable-line

  return state
}

export function useRealisations(): CollectionState<Realisation> {
  return useCollection('realisations', toRealisation, 'createdAt')
}

export function useRushes(): CollectionState<Rush> {
  return useCollection('rushes', toRush)
}

export function useProducts(): CollectionState<Product> {
  return useCollection('products', toProduct)
}

export function useOrders(): CollectionState<Order> {
  return useCollection('orders', toOrder)
}

const PAGE_SIZE = 50

export type OrdersPageState = {
  orders: Order[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  loadMore: () => void
  total: number   // nombre de docs chargés jusqu'ici
}

/**
 * Charge les commandes pour une plage de dates.
 *
 * - Sans filtre actif  → pagination par 50, bouton "Charger plus"
 * - Avec filtre actif  → charge TOUS les orders de la période côté client
 *   (filtre date uniquement → pas besoin d'index composite)
 *
 * `filterStatuts` et `filterTypes` doivent être des sets stables (useRef/useMemo)
 * pour éviter des re-fetch inutiles.
 */
export function useOrdersPaginated(
  start: Date,
  end: Date,
  filterStatuts: Set<string>,
  filterTypes: Set<string>,
): OrdersPageState {
  const [orders, setOrders]           = useState<Order[]>([])
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore]         = useState(false)
  const lastDocRef                    = useRef<QueryDocumentSnapshot | null>(null)

  const startMs     = start.getTime()
  const endMs       = end.getTime()
  const filtersKey  = [...filterStatuts].sort().join(',') + '|' + [...filterTypes].sort().join(',')
  const hasFilters  = filterStatuts.size > 0 || filterTypes.size > 0

  const endTs = () => Timestamp.fromDate(
    new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59)
  )

  useEffect(() => {
    setLoading(true)
    setOrders([])
    setHasMore(false)
    lastDocRef.current = null

    if (hasFilters) {
      // Mode filtré : charge tous les orders de la période, filtre côté client
      const q = query(
        collection(db, 'orders'),
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', endTs()),
        orderBy('date', 'desc'),
      )
      getDocs(q)
        .then((snap) => {
          const all = snap.docs.map((d) => toOrder(d.id, d.data() as Record<string, unknown>))
          const filtered = all.filter((o) => {
            if (filterStatuts.size > 0 && !filterStatuts.has(o.status))    return false
            if (filterTypes.size   > 0 && !filterTypes.has(o.orderType))   return false
            return true
          })
          setOrders(filtered)
          setHasMore(false)   // pas de pagination en mode filtré
          setLoading(false)
        })
        .catch((err) => {
          console.error('[Firestore] orders filtered:', err)
          setLoading(false)
        })
    } else {
      // Mode paginé : 50 orders à la fois
      const q = query(
        collection(db, 'orders'),
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', endTs()),
        orderBy('date', 'desc'),
        limit(PAGE_SIZE),
      )
      getDocs(q)
        .then((snap) => {
          const data = snap.docs.map((d) => toOrder(d.id, d.data() as Record<string, unknown>))
          lastDocRef.current = snap.docs[snap.docs.length - 1] ?? null
          setOrders(data)
          setHasMore(snap.docs.length === PAGE_SIZE)
          setLoading(false)
        })
        .catch((err) => {
          console.error('[Firestore] orders page:', err)
          setLoading(false)
        })
    }
  }, [startMs, endMs, filtersKey]) // eslint-disable-line

  async function loadMore() {
    if (hasFilters || !lastDocRef.current || loadingMore) return
    setLoadingMore(true)

    const q = query(
      collection(db, 'orders'),
      where('date', '>=', Timestamp.fromDate(start)),
      where('date', '<=', endTs()),
      orderBy('date', 'desc'),
      startAfter(lastDocRef.current),
      limit(PAGE_SIZE),
    )

    try {
      const snap = await getDocs(q)
      const data = snap.docs.map((d) => toOrder(d.id, d.data() as Record<string, unknown>))
      lastDocRef.current = snap.docs[snap.docs.length - 1] ?? null
      setOrders((prev) => [...prev, ...data])
      setHasMore(snap.docs.length === PAGE_SIZE)
    } catch (err) {
      console.error('[Firestore] orders loadMore:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  return { orders, loading, loadingMore, hasMore, loadMore, total: orders.length }
}

export function useIdeas(): CollectionState<FirestoreIdea> {
  return useCollection('ideas', toIdea, 'createdAt')
}

export function useMarques(): CollectionState<Marque> {
  return useCollection('marques', toMarque)
}

// ─── Aggregate totals ─────────────────────────────────────────────────────────

export type OrdersAggregates = {
  totalCA: number
  totalCommissions: number
  réglées: number
  enAttente: number
  ineligibles: number
}

/**
 * Calcule les totaux CA/commissions et les compteurs par statut pour une
 * plage de dates.
 *
 * Utilise un seul getDocs filtré par date (index simple, auto-créé par
 * Firestore) et calcule les agrégats par statut côté client.
 * Évite le besoin d'un index composite (date, status).
 */
export function useOrdersAggregates(start: Date, end: Date): { data: OrdersAggregates | null; loading: boolean } {
  const [data, setData]       = useState<OrdersAggregates | null>(null)
  const [loading, setLoading] = useState(true)

  const startMs = start.getTime()
  const endMs   = end.getTime()

  useEffect(() => {
    setLoading(true)
    setData(null)

    const startTs = Timestamp.fromDate(start)
    const endTs   = Timestamp.fromDate(
      new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59)
    )

    const q = query(
      collection(db, 'orders'),
      where('date', '>=', startTs),
      where('date', '<=', endTs),
    )

    getDocs(q)
      .then((snap) => {
        let totalCA = 0, totalCommissions = 0
        let réglées = 0, enAttente = 0, ineligibles = 0

        for (const d of snap.docs) {
          const o = d.data()
          const status = o.status as string
          if (status === 'Réglée') {
            totalCA          += (o.price as number) || 0
            totalCommissions += ((o.commissionStandard as number) || 0) + ((o.commissionPub as number) || 0)
            réglées++
          } else if (status === 'En attente') {
            enAttente++
          } else {
            ineligibles++
          }
        }

        setData({ totalCA, totalCommissions, réglées, enAttente, ineligibles })
        setLoading(false)
      })
      .catch((err) => {
        console.error('[Firestore] aggregate:', err)
        setLoading(false)
      })
  }, [startMs, endMs]) // eslint-disable-line

  return { data, loading }
}
