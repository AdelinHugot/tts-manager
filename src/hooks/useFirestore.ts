import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../lib/firebase'
import {
  toRealisation,
  toRush,
  toProduct,
  toOrder,
  toIdea,
  type FirestoreIdea,
} from '../lib/firestore'
import type { Realisation, Product } from '../types/realisation'
import type { Rush } from '../types/rush'
import type { Order } from '../types/analytics'

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

export function useIdeas(): CollectionState<FirestoreIdea> {
  return useCollection('ideas', toIdea, 'createdAt')
}
