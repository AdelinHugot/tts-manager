import type { Order, OrderType, OrderStatus } from '../types/analytics'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseAmount(s: string): number {
  if (!s || s === '/' || s.trim() === '') return 0
  const val = parseFloat(s.replace(',', '.'))
  return isNaN(val) ? 0 : val
}

/** Parse "DD/MM/YYYY HH:MM:SS" → Date (time ignored, midnight local) */
function parseDate(s: string): Date {
  const [datePart] = s.trim().split(' ')
  const [day, month, year] = datePart.split('/')
  return new Date(+year, +month - 1, +day)
}

function parseType(s: string): OrderType {
  return s.toLowerCase().includes('affili') ? 'affiliée' : 'pub_shopping'
}

function parseStatus(s: string): OrderStatus {
  if (s === 'Réglée')     return 'Réglée'
  if (s === 'Inéligible') return 'Inéligible'
  return 'En attente'
}

/**
 * Minimal RFC-4180 CSV parser — handles quoted fields and commas inside quotes.
 * French CSVs from TikTok Shop: comma separator, numbers quoted with comma decimal.
 */
function splitCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++ // escaped quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}

// ─── Public API ──────────────────────────────────────────────────────────────

export type ParseResult = {
  orders: Order[]
  skipped: number  // lines that couldn't be parsed
}

// ─── Column mappings ─────────────────────────────────────────────────────────
//
// CSV export  (≥40 cols)          XLSX export  (≥46 cols)
// ─────────────────────────────   ───────────────────────────────────────────
//  0  id                           0  id
//  1  date "DD/MM/YYYY …"          2  productName
//  2  price                        4  price
//  7  videoUrl  (full URL)         7  boutiqueName
//  9  productName                 12  orderType
// 12  boutiqueName                13  status
// 16  orderType                   17  videoId  (bare numeric ID, not URL)
// 17  status                      35  commissionStandard
// 38  commissionPub               36  commissionPub
// 39  commissionStandard          45  date "DD/MM/YYYY …"

type ColMap = {
  id: number; date: number; price: number
  productName: number; boutiqueName: number
  orderType: number; status: number
  videoCol: number; videoIsId: boolean  // true → wrap as /video/{id}
  commissionStandard: number; commissionPub: number
  tiktokProductIdCol: number | null     // null = non disponible dans ce format
  minCols: number
}

const CSV_COLS: ColMap = {
  id: 0, date: 1, price: 2,
  productName: 9, boutiqueName: 12,
  orderType: 16, status: 17,
  videoCol: 7, videoIsId: false,
  commissionPub: 38, commissionStandard: 39,
  tiktokProductIdCol: null,
  minCols: 40,
}

const XLSX_COLS: ColMap = {
  id: 0, date: 45, price: 4,
  productName: 2, boutiqueName: 7,
  orderType: 12, status: 13,
  videoCol: 17, videoIsId: true,
  commissionStandard: 35, commissionPub: 36,
  tiktokProductIdCol: 3,   // "ID du produit"
  minCols: 46,
}

/**
 * Détecte automatiquement le format d'après la ligne de header.
 * XLSX : la col 45 contient "Date de la commande".
 * CSV  : la col 1 ressemble à une date "DD/MM/YYYY HH:MM:SS".
 */
function detectColMap(header: string[]): ColMap {
  if (header[45]?.toLowerCase().includes('date')) return XLSX_COLS
  return CSV_COLS
}

/**
 * Noyau commun : convertit un tableau de lignes (string[][]) en commandes.
 * Détecte automatiquement le format CSV ou XLSX via la ligne d'en-tête.
 */
function parseRows(rows: string[][]): ParseResult {
  const orders: Order[] = []
  let skipped = 0

  if (rows.length < 2) return { orders, skipped }

  const map = detectColMap(rows[0])

  for (let i = 1; i < rows.length; i++) {
    try {
      const cols = rows[i]
      if (cols.length < map.minCols) { skipped++; continue }

      const id           = cols[map.id].trim()
      const dateStr      = cols[map.date].trim()
      const productName  = cols[map.productName].trim()
      const boutiqueName = cols[map.boutiqueName].trim()

      if (!id || !dateStr || !productName) { skipped++; continue }

      const rawVideo = cols[map.videoCol]?.trim()
      const videoUrl = rawVideo
        ? map.videoIsId
          ? `https://www.tiktok.com/video/${rawVideo}`
          : rawVideo
        : undefined

      const tiktokProductId = map.tiktokProductIdCol !== null
        ? cols[map.tiktokProductIdCol]?.trim() || undefined
        : undefined

      orders.push({
        id,
        date: parseDate(dateStr),
        price: parseAmount(cols[map.price].trim()),
        productName,
        boutiqueName,
        orderType: parseType(cols[map.orderType].trim()),
        status: parseStatus(cols[map.status].trim()),
        commissionStandard: parseAmount(cols[map.commissionStandard].trim()),
        commissionPub: parseAmount(cols[map.commissionPub].trim()),
        videoUrl,
        tiktokProductId,
      })
    } catch {
      skipped++
    }
  }

  return { orders, skipped }
}

/** Parse a TikTok Shop commission export CSV (French locale). */
export function parseTikTokCSV(text: string): ParseResult {
  // Strip BOM if present
  const clean = text.startsWith('﻿') ? text.slice(1) : text
  const lines = clean.split(/\r?\n/).filter((l) => l.trim())
  const rows = lines.map(splitCSVLine)
  return parseRows(rows)
}

/**
 * Parse a TikTok Shop commission export XLSX.
 * Uses SheetJS to read the first sheet and convert cells to strings.
 */
export async function parseTikTokXLSX(buffer: ArrayBuffer): Promise<ParseResult> {
  const XLSX = await import('xlsx')
  const wb = XLSX.read(buffer, { type: 'array', cellText: true, cellDates: false })
  const ws = wb.Sheets[wb.SheetNames[0]]
  // sheet_to_json with header:1 returns string[][] — force all cells as strings
  const raw = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '', raw: false })
  const rows = raw.map((row) => (row as unknown[]).map((cell) => String(cell ?? '')))
  return parseRows(rows)
}
