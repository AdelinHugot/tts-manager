import { useEffect, useRef, useState } from 'react'

export type FilterItem = { id: string; name: string }

type Props = {
  items: FilterItem[]
  value: string            // 'all' ou un id
  onChange: (id: string) => void
  allLabel: string         // ex. "Tous les produits"
  placeholder?: string     // placeholder de recherche
}

export default function FilterPicker({ items, value, onChange, allLabel, placeholder = 'Rechercher…' }: Props) {
  const selected  = value === 'all' ? null : items.find((i) => i.id === value) ?? null
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState('')
  const [cursor, setCursor] = useState(-1)
  const inputRef  = useRef<HTMLInputElement>(null)
  const listRef   = useRef<HTMLUListElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
    : items

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setQuery('')
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function openPicker() {
    setQuery(''); setCursor(-1); setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function pick(id: string) {
    onChange(id); setOpen(false); setQuery('')
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    // cursor -1 = "all" option, 0..n-1 = items
    const total = filtered.length
    if (e.key === 'ArrowDown') {
      e.preventDefault(); setCursor((c) => Math.min(c + 1, total - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setCursor((c) => Math.max(c - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (cursor === -1) pick('all')
      else if (filtered[cursor]) pick(filtered[cursor].id)
    } else if (e.key === 'Escape') {
      setOpen(false); setQuery('')
    }
  }

  useEffect(() => {
    if (cursor >= 0 && listRef.current) {
      const item = listRef.current.children[cursor + 1] as HTMLElement | undefined
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [cursor])

  const isActive = value !== 'all'

  return (
    <div ref={wrapRef} className="relative">
      {!open ? (
        <button
          type="button"
          onClick={openPicker}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold border transition-all shadow-sm whitespace-nowrap ${
            isActive
              ? 'bg-brand text-white border-brand'
              : 'bg-white text-slate-600 border-slate-200 hover:border-brand/40 hover:text-slate-800'
          }`}
        >
          <span className="max-w-[180px] truncate">
            {selected ? selected.name : allLabel}
          </span>
          {isActive ? (
            <span
              onMouseDown={(e) => { e.stopPropagation(); onChange('all') }}
              className="ml-0.5 opacity-70 hover:opacity-100 text-white font-bold"
            >✕</span>
          ) : (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="opacity-50">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setCursor(-1) }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-48 border border-brand/40 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 shadow-sm placeholder-slate-300"
        />
      )}

      {open && (
        <ul
          ref={listRef}
          className="absolute z-50 top-full left-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1 min-w-[220px]"
        >
          {/* Option "Tous" */}
          <li
            onMouseDown={() => pick('all')}
            onMouseEnter={() => setCursor(-1)}
            className={`px-3 py-2 text-xs cursor-pointer transition-colors font-semibold ${
              value === 'all'
                ? 'text-brand bg-brand/5'
                : cursor === -1
                  ? 'bg-slate-50 text-slate-700'
                  : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {allLabel}
          </li>
          <li className="h-px bg-slate-100 mx-2 my-0.5" />

          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-xs text-slate-400 italic">Aucun résultat</li>
          ) : (
            filtered.map((item, i) => (
              <li
                key={item.id}
                onMouseDown={() => pick(item.id)}
                onMouseEnter={() => setCursor(i)}
                className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
                  item.id === value
                    ? 'text-brand font-semibold bg-brand/5'
                    : cursor === i
                      ? 'bg-slate-50 text-slate-800'
                      : 'text-slate-700'
                }`}
              >
                {item.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
