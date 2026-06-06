import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  documentId,
  writeBatch,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Realisation, RealisationStatus, Product, Comment } from '../types/realisation'
import type { Rush } from '../types/rush'
import type { TikTokTokenData, TikTokVideoMetrics } from './tiktok'
import type { Order } from '../types/analytics'
import type { Marque } from '../types/marque'

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Convert a Firestore document snapshot data to our typed objects */
export function toRealisation(id: string, d: Record<string, unknown>): Realisation {
  return {
    id,
    title: d.title as string,
    status: d.status as RealisationStatus,
    productId: d.productId as string,
    publishDate: (d.publishDate as string | null) ?? null,
    notes: (d.notes as string) ?? '',
    rushIds: (d.rushIds as string[]) ?? [],
    createdAt: d.createdAt as string,
    tiktokUrl: (d.tiktokUrl as string | undefined) ?? undefined,
  }
}

export function toRush(id: string, d: Record<string, unknown>): Rush {
  return {
    id,
    name: d.name as string,
    url: (d.url as string) ?? '',
    size: (d.size as number) ?? 0,
    duration: (d.duration as number) ?? 0,
    thumbnailUrl: (d.thumbnailUrl as string) ?? '',
  }
}

export function toProduct(id: string, d: Record<string, unknown>): Product {
  return {
    id,
    name: d.name as string,
    imageUrl: (d.imageUrl as string) ?? '',
    description: (d.description as string) ?? '',
    status: (d.status as Product['status']) ?? 'actif',
    url: d.url as string | undefined,
    marqueId: d.marqueId as string | undefined,
    tiktokProductId: d.tiktokProductId as string | undefined,
  }
}

export function toMarque(id: string, d: Record<string, unknown>): Marque {
  return {
    id,
    name: d.name as string,
    shopUrl: (d.shopUrl as string) ?? '',
    notes: (d.notes as string) ?? '',
  }
}

export function toOrder(id: string, d: Record<string, unknown>): Order {
  const date = d.date instanceof Timestamp ? d.date.toDate() : new Date(d.date as string)
  return {
    id,
    date,
    productName: d.productName as string,
    boutiqueName: d.boutiqueName as string,
    price: d.price as number,
    commissionStandard: d.commissionStandard as number,
    commissionPub: d.commissionPub as number,
    orderType: d.orderType as Order['orderType'],
    status: d.status as Order['status'],
    videoUrl: (d.videoUrl as string | undefined) || undefined,
  }
}

export type IdeaStatus = 'pending' | 'validated' | 'rejected'
export type FirestoreIdea = {
  id: string
  text: string
  description: string
  inspirationUrl: string
  status: IdeaStatus
  createdAt: Date
}

export function toIdea(id: string, d: Record<string, unknown>): FirestoreIdea {
  const createdAt = d.createdAt instanceof Timestamp ? d.createdAt.toDate() : new Date(d.createdAt as string)
  return {
    id,
    text: d.text as string,
    description: (d.description as string) ?? '',
    inspirationUrl: (d.inspirationUrl as string) ?? '',
    status: (d.status as IdeaStatus) ?? 'pending',
    createdAt,
  }
}

// ─── Réalisations ────────────────────────────────────────────────────────────

export async function fsAddRealisation(r: Omit<Realisation, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'realisations'), r)
  return ref.id
}

export async function fsUpdateRealisation(id: string, data: Partial<Omit<Realisation, 'id'>>) {
  await updateDoc(doc(db, 'realisations', id), data as Record<string, unknown>)
}

export async function fsDeleteRealisation(id: string) {
  await deleteDoc(doc(db, 'realisations', id))
}

/** Passe toutes les réalisations en statut "publiee" en un seul batch. */
export async function fsMarkAllRealisationsPublished(onProgress?: (done: number, total: number) => void): Promise<number> {
  const snap = await getDocs(collection(db, 'realisations'))
  const docs = snap.docs
  const CHUNK = 400
  let done = 0
  for (let i = 0; i < docs.length; i += CHUNK) {
    const batch = writeBatch(db)
    for (const d of docs.slice(i, i + CHUNK)) {
      batch.update(doc(db, 'realisations', d.id), { status: 'publiee' })
    }
    await batch.commit()
    done += Math.min(CHUNK, docs.length - i)
    onProgress?.(done, docs.length)
  }
  return docs.length
}

// ─── Rushs ───────────────────────────────────────────────────────────────────

export async function fsAddRush(r: Rush) {
  await setDoc(doc(db, 'rushes', r.id), {
    name: r.name,
    url: r.url,
    size: r.size,
    duration: r.duration,
    thumbnailUrl: r.thumbnailUrl,
  })
}

export async function fsDeleteRush(id: string) {
  await deleteDoc(doc(db, 'rushes', id))
}

// ─── Ideas ───────────────────────────────────────────────────────────────────

export async function fsAddIdea(idea: Omit<FirestoreIdea, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'ideas'), {
    ...idea,
    createdAt: Timestamp.fromDate(idea.createdAt),
  })
  return ref.id
}

export async function fsUpdateIdea(id: string, data: Partial<Omit<FirestoreIdea, 'id' | 'createdAt'>>) {
  await updateDoc(doc(db, 'ideas', id), data as Record<string, unknown>)
}

export async function fsDeleteIdea(id: string) {
  await deleteDoc(doc(db, 'ideas', id))
}

// ─── Produits ─────────────────────────────────────────────────────────────────

export async function fsSetProduct(p: Product) {
  await setDoc(doc(db, 'products', p.id), {
    name: p.name,
    imageUrl: p.imageUrl,
    description: p.description,
    status: p.status,
    url: p.url ?? null,
    marqueId: p.marqueId ?? null,
    tiktokProductId: p.tiktokProductId ?? null,
  })
}

// ─── Marques ──────────────────────────────────────────────────────────────────

export async function fsSetMarque(m: Marque) {
  await setDoc(doc(db, 'marques', m.id), {
    name: m.name,
    shopUrl: m.shopUrl ?? '',
    notes: m.notes ?? '',
  })
}

export async function fsUpdateMarque(id: string, data: Partial<Omit<Marque, 'id'>>) {
  await updateDoc(doc(db, 'marques', id), data as Record<string, unknown>)
}

export async function fsDeleteMarque(id: string) {
  await deleteDoc(doc(db, 'marques', id))
}

export async function fsAddMarque(m: Omit<Marque, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'marques'), m)
  return ref.id
}

export async function fsUpdateProduct(id: string, data: Partial<Omit<Product, 'id'>>) {
  await updateDoc(doc(db, 'products', id), data as Record<string, unknown>)
}

export async function fsDeleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id))
}

export async function fsAddProduct(p: Omit<Product, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'products'), p)
  return ref.id
}

// ─── Commandes ───────────────────────────────────────────────────────────────

/**
 * Batch-write orders to Firestore in chunks of 400 (under the 500 limit).
 * Uses set() — idempotent, safe to re-import.
 * onProgress(done, total) is called after each chunk.
 */
export async function fsBatchOrders(
  orders: Order[],
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  const CHUNK = 400
  for (let i = 0; i < orders.length; i += CHUNK) {
    const chunk = orders.slice(i, i + CHUNK)
    const batch = writeBatch(db)
    for (const o of chunk) {
      batch.set(doc(db, 'orders', o.id), {
        date: Timestamp.fromDate(o.date),
        productName: o.productName,
        boutiqueName: o.boutiqueName,
        price: o.price,
        commissionStandard: o.commissionStandard,
        commissionPub: o.commissionPub,
        orderType: o.orderType,
        status: o.status,
        ...(o.videoUrl ? { videoUrl: o.videoUrl } : {}),
      })
    }
    await batch.commit()
    onProgress?.(Math.min(i + CHUNK, orders.length), orders.length)
  }
}

/**
 * Cherche la première URL vidéo TikTok dans les commandes pour un produit donné.
 * Retourne null si aucune commande n'a de videoUrl pour ce produit.
 */
/**
 * Vérifie dans Firestore quels IDs de commandes existent déjà.
 * Utilise documentId() 'in' par chunks de 30 (limite Firestore),
 * avec 10 requêtes parallèles max pour limiter la latence.
 * Retourne un Set des IDs existants.
 */
export async function fsCheckExistingOrderIds(ids: string[]): Promise<Set<string>> {
  const existing = new Set<string>()
  if (ids.length === 0) return existing

  const CHUNK = 30        // max items per 'in' query
  const CONCURRENT = 10   // parallel batches

  const chunks: string[][] = []
  for (let i = 0; i < ids.length; i += CHUNK) {
    chunks.push(ids.slice(i, i + CHUNK))
  }

  for (let i = 0; i < chunks.length; i += CONCURRENT) {
    await Promise.all(
      chunks.slice(i, i + CONCURRENT).map(async (chunk) => {
        const snap = await getDocs(
          query(collection(db, 'orders'), where(documentId(), 'in', chunk))
        )
        snap.docs.forEach((d) => existing.add(d.id))
      })
    )
  }

  return existing
}

export async function fsFindVideoUrlForProduct(productName: string): Promise<string | null> {
  const snap = await getDocs(
    query(collection(db, 'orders'), where('productName', '==', productName), limit(20))
  )
  for (const d of snap.docs) {
    const url = d.data().videoUrl as string | undefined
    if (url) return url
  }
  return null
}

export async function fsAddOrder(o: Order) {
  await setDoc(doc(db, 'orders', o.id), {
    date: Timestamp.fromDate(o.date),
    productName: o.productName,
    boutiqueName: o.boutiqueName,
    price: o.price,
    commissionStandard: o.commissionStandard,
    commissionPub: o.commissionPub,
    orderType: o.orderType,
    status: o.status,
  })
}

// ─── Entity sync from CSV orders ─────────────────────────────────────────────

export type SyncResult = {
  newMarques: number
  newProducts: number
  newRealisations: number
}

/**
 * À partir d'un lot de commandes importées, crée automatiquement :
 * - Les marques manquantes (identifiées par boutiqueName)
 * - Les produits manquants (identifiés par productName)
 * - Les réalisations manquantes (identifiées par videoUrl unique)
 *
 * Idempotent : skip si le nom / l'URL existe déjà en base.
 * Retourne le nombre d'entités créées.
 */
export async function fsSyncEntitiesFromOrders(
  orders: Order[],
  onProgress?: (step: string) => void,
): Promise<SyncResult> {
  onProgress?.('Chargement des marques existantes…')

  // 1. Charger toutes les marques et produits existants
  const [marqueSnap, productSnap, realisationSnap] = await Promise.all([
    getDocs(collection(db, 'marques')),
    getDocs(collection(db, 'products')),
    getDocs(collection(db, 'realisations')),
  ])

  const existingMarquesByName = new Map<string, string>() // name → id
  marqueSnap.docs.forEach((d) => {
    existingMarquesByName.set((d.data().name as string).toLowerCase(), d.id)
  })

  const existingProductsByName = new Map<string, string>() // name → id
  productSnap.docs.forEach((d) => {
    existingProductsByName.set((d.data().name as string).toLowerCase(), d.id)
  })

  const existingRealisationsByUrl = new Set<string>() // tiktokUrl
  realisationSnap.docs.forEach((d) => {
    const url = d.data().tiktokUrl as string | undefined
    if (url) existingRealisationsByUrl.add(url)
  })

  // 2. Marques : créer les boutiques inconnues
  onProgress?.('Création des nouvelles marques…')
  const uniqueBoutiques = [...new Set(orders.map((o) => o.boutiqueName).filter(Boolean))]
  let newMarques = 0
  for (const name of uniqueBoutiques) {
    if (!existingMarquesByName.has(name.toLowerCase())) {
      const ref = await addDoc(collection(db, 'marques'), { name, shopUrl: '', notes: '' })
      existingMarquesByName.set(name.toLowerCase(), ref.id)
      newMarques++
    }
  }

  // 3. Produits : créer les produits inconnus (liés à leur marque)
  onProgress?.('Création des nouveaux produits…')
  const uniqueProducts = [
    ...new Map(
      orders.map((o) => [o.productName.toLowerCase(), o] as [string, Order])
    ).values(),
  ]
  let newProducts = 0
  for (const o of uniqueProducts) {
    if (!existingProductsByName.has(o.productName.toLowerCase())) {
      const marqueId = existingMarquesByName.get(o.boutiqueName.toLowerCase())
      const ref = await addDoc(collection(db, 'products'), {
        name: o.productName,
        imageUrl: '',
        description: '',
        status: 'actif',
        url: null,
        marqueId: marqueId ?? null,
        tiktokProductId: o.tiktokProductId ?? null,
      })
      existingProductsByName.set(o.productName.toLowerCase(), ref.id)
      newProducts++
    }
  }

  // 4. Réalisations : une par videoUrl unique
  onProgress?.('Création des nouvelles réalisations…')
  // Regrouper les commandes par videoUrl, garder la date la plus ancienne
  const videoMap = new Map<string, { productName: string; boutiqueName: string; earliestDate: Date }>()
  for (const o of orders) {
    if (!o.videoUrl) continue
    const existing = videoMap.get(o.videoUrl)
    if (!existing || o.date < existing.earliestDate) {
      videoMap.set(o.videoUrl, {
        productName: o.productName,
        boutiqueName: o.boutiqueName,
        earliestDate: o.date,
      })
    }
  }

  let newRealisations = 0
  for (const [videoUrl, info] of videoMap.entries()) {
    if (existingRealisationsByUrl.has(videoUrl)) continue
    const productId = existingProductsByName.get(info.productName.toLowerCase()) ?? ''
    const publishDate = info.earliestDate.toISOString().slice(0, 10) // "YYYY-MM-DD"
    const title = info.productName

    await addDoc(collection(db, 'realisations'), {
      title,
      status: 'publiee',
      productId,
      publishDate,
      notes: '',
      rushIds: [],
      createdAt: new Date().toISOString(),
      tiktokUrl: videoUrl,
    })
    newRealisations++
  }

  return { newMarques, newProducts, newRealisations }
}

// ─── Comments ────────────────────────────────────────────────────────────────

export async function fsAddComment(
  realisationId: string,
  text: string,
  authorName: string,
  authorEmail: string,
  authorPhotoURL?: string,
): Promise<void> {
  const ref = collection(db, 'realisations', realisationId, 'comments')
  await addDoc(ref, {
    text,
    authorName,
    authorEmail,
    ...(authorPhotoURL ? { authorPhotoURL } : {}),
    createdAt: new Date().toISOString(),
  })
}

export function fsSubscribeComments(
  realisationId: string,
  cb: (comments: Comment[]) => void,
): () => void {
  const ref = collection(db, 'realisations', realisationId, 'comments')
  const q = query(ref, orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) => {
    cb(
      snap.docs.map((d) => ({
        id: d.id,
        text: d.data().text as string,
        authorName: d.data().authorName as string,
        authorEmail: d.data().authorEmail as string,
        authorPhotoURL: (d.data().authorPhotoURL as string | undefined) ?? undefined,
        createdAt: d.data().createdAt as string,
      })),
    )
  })
}

// ─── TikTok integration ──────────────────────────────────────────────────────

const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours

export async function fsSaveTikTokToken(uid: string, token: TikTokTokenData): Promise<void> {
  const ref = doc(db, 'users', uid, 'integrations', 'tiktok')
  await setDoc(ref, {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresAt: token.expiresAt,
    refreshExpiresAt: token.refreshExpiresAt,
    scope: token.scope,
    updatedAt: Date.now(),
  })
}

export async function fsGetTikTokToken(uid: string): Promise<TikTokTokenData | null> {
  const ref = doc(db, 'users', uid, 'integrations', 'tiktok')
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const d = snap.data()
  return {
    accessToken: d.accessToken as string,
    refreshToken: d.refreshToken as string,
    expiresAt: d.expiresAt as number,
    refreshExpiresAt: d.refreshExpiresAt as number,
    scope: (d.scope as string) ?? 'video.list',
  }
}

export async function fsDeleteTikTokToken(uid: string): Promise<void> {
  const ref = doc(db, 'users', uid, 'integrations', 'tiktok')
  await deleteDoc(ref)
}

export async function fsCacheTikTokMetrics(
  uid: string,
  metrics: TikTokVideoMetrics[],
): Promise<void> {
  if (metrics.length === 0) return
  const batch = writeBatch(db)
  const now = Date.now()
  for (const m of metrics) {
    const ref = doc(db, 'users', uid, 'tiktokCache', m.id)
    batch.set(ref, { ...m, cachedAt: now })
  }
  await batch.commit()
}

export type CachedMetrics = TikTokVideoMetrics & { cachedAt: number }

export async function fsGetCachedMetrics(
  uid: string,
  videoIds: string[],
): Promise<{ fresh: Map<string, TikTokVideoMetrics>; stale: string[] }> {
  const now = Date.now()
  const fresh = new Map<string, TikTokVideoMetrics>()
  const stale: string[] = []

  for (const id of videoIds) {
    const ref = doc(db, 'users', uid, 'tiktokCache', id)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      const d = snap.data() as CachedMetrics
      if (now - d.cachedAt < CACHE_TTL_MS) {
        fresh.set(id, { id: d.id, view_count: d.view_count, like_count: d.like_count, comment_count: d.comment_count, share_count: d.share_count })
      } else {
        stale.push(id)
      }
    } else {
      stale.push(id)
    }
  }

  return { fresh, stale }
}
