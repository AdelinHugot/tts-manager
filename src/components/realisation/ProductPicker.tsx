import { useEffect, useRef, useState } from 'react'
import type { Product } from '../../types/realisation'

type Props = {
  products: Product[]
  value: string          // productId sélectionné
  onChange: (id: string) => void
}

export default function ProductPicker({ products, value, onChange }: Props) {
  const selected   = products.find((p) => p.id === value)
  const [open, setOpen]       = useState(false)
  const [query, setQuery]     = useState('')
  const inputRef  = useRef<HTMLInputElement>(null)
  const listRef   = useRef<HTMLUListElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const [cursor, setCursor]   = useState(-1)

  const filtered = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : products

  // Fermer si clic hors du composant
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function openPicker() {
    setQuery('')
    setCursor(-1)
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function pick(id: string) {
    onChange(id)
    setOpen(false)
    setQuery('')
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (cursor >= 0 && filtered[cursor]) pick(filtered[cursor].id)
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  // Scroll l'item surligné dans la vue
  useEffect(() => {
    if (cursor >= 0 && listRef.current) {
      const item = listRef.current.children[cursor] as HTMLElement | undefined
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [cursor])

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger / champ affiché */}
      {!open ? (
        <button
          type="button"
          onClick={openPicker}
          className="w-full flex items-center justify-between gap-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white hover:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-colors"
        >
          <span className="truncate text-left text-slate-700 min-w-0">
            {selected ? selected.name : <span className="text-slate-300">Choisir un produit…</span>}
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 text-slate-400">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setCursor(-1) }}
          onKeyDown={onKeyDown}
          placeholder="Rechercher un produit…"
          className="w-full border border-brand/40 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 placeholder-slate-300"
        />
      )}

      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-slate-400 italic">Aucun produit trouvé</li>
          ) : (
            filtered.map((p, i) => (
              <li
                key={p.id}
                onMouseDown={() => pick(p.id)}
                onMouseEnter={() => setCursor(i)}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  p.id === value
                    ? 'text-brand font-semibold bg-brand/5'
                    : cursor === i
                      ? 'bg-slate-50 text-slate-800'
                      : 'text-slate-700'
                }`}
              >
                {p.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
