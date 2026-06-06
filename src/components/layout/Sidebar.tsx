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
    id: 'commandes',
    label: 'Commandes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M5 6h8M5 9h8M5 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
    id: 'ideas',
    label: 'Idées',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 1.5a5 5 0 0 1 3 9c-.5.4-.8 1-.8 1.5v.5H6.8V12c0-.6-.3-1.1-.8-1.5a5 5 0 0 1 3-9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M6.8 14.5h4.4M7.5 16.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'rushs',
    label: 'Rushs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="4" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M1 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="4.5" cy="11" r="1" fill="currentColor"/>
        <circle cx="9" cy="11" r="1" fill="currentColor"/>
        <circle cx="13.5" cy="11" r="1" fill="currentColor"/>
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
]

const PARAMETRES_ITEM: NavItem = {
  id: 'parametres',
  label: 'Paramètres',
  icon: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
}

import { signOut } from 'firebase/auth'
import { auth } from '../../lib/firebase'

type SidebarProps = {
  activePage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const user = auth.currentUser
  const initials = (user?.displayName ?? user?.email ?? '?').slice(0, 2).toUpperCase()
  const photo = user?.photoURL
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-100 flex flex-col py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white text-sm font-bold">T</div>
        <span className="font-semibold text-slate-800 text-base">TTS Manager</span>
      </div>

      {/* Main nav */}
      <nav className="flex flex-col gap-1 flex-1">
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
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col gap-2 mt-4">
        {/* Paramètres */}
        <button
          onClick={() => onNavigate(PARAMETRES_ITEM.id)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
            activePage === PARAMETRES_ITEM.id
              ? 'bg-brand/10 text-brand'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <span className="w-5 flex items-center justify-center">{PARAMETRES_ITEM.icon}</span>
          {PARAMETRES_ITEM.label}
        </button>

        {/* User card */}
        <div className="mt-1 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex-shrink-0 shadow-sm overflow-hidden bg-gradient-to-br from-brand to-indigo-400 flex items-center justify-center text-white text-xs font-bold">
            {photo
              ? <img src={photo} alt="" className="w-full h-full object-cover" />
              : initials
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 truncate leading-tight">{user?.email ?? ''}</p>
          </div>
          <button
            onClick={() => signOut(auth)}
            title="Se déconnecter"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M7 3H4a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              <path d="M12 6l3 3-3 3M15 9H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
