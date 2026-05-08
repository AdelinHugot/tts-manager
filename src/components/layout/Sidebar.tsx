type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="2" fill="currentColor" opacity=".8"/>
        <rect x="10" y="1" width="7" height="7" rx="2" fill="currentColor" opacity=".4"/>
        <rect x="1" y="10" width="7" height="7" rx="2" fill="currentColor" opacity=".4"/>
        <rect x="10" y="10" width="7" height="7" rx="2" fill="currentColor" opacity=".8"/>
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 14 L6 8 L10 11 L14 4 L16 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'realisation',
    label: 'Réalisation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.8"/>
        <polygon points="7.5,6 13,9 7.5,12" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'produits',
    label: 'Produits',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
      </svg>
    ),
  },
  {
    id: 'parametres',
    label: 'Paramètres',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
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
          <span className="w-5 flex items-center justify-center">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </aside>
  )
}
