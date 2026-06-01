import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Realisation, RealisationStatus, Product } from '../types/realisation'
import type { Rush } from '../types/rush'
import type { Order } from '../types/analytics'

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
  })
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
