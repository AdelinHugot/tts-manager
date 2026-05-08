import { useState } from 'react'

type NavItem = {
  id: string
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'analytics', label: 'Analytics', icon: '↗' },
  { id: 'realisation', label: 'Réalisation', icon: '◉' },
  { id: 'produits', label: 'Produits', icon: '⊞' },
  { id: 'parametres', label: 'Paramètres', icon: '⚙' },
]

type SidebarProps = {
  activePage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-100 flex flex-col py-6 px-4 gap-1">
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white text-sm font-bold">T</div>
        <span className="font-semibold text-slate-800 text-base">TTS Manager</span>
      </div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
            activePage === item.id
              ? 'bg-brand/10 text-brand'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <span className="text-base w-5 text-center">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </aside>
  )
}
