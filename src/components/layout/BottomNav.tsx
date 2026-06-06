import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../lib/firebase'

export const SECONDARY_PAGES = ['commandes', 'rushs', 'produits', 'analytics', 'parametres']

type Props = {
  activePage: string
  onNavigate: (page: string) => void
  showMore: boolean
  onToggleMore: () => void
  onNewVideo: () => void
}

export default function BottomNav({ activePage, onNavigate, showMore, onToggleMore, onNewVideo }: Props) {
  const [showCreate, setShowCreate] = useState(false)

  const user = auth.currentUser
  const photo = user?.photoURL

  function closeAll() {
    setShowCreate(false)
    if (showMore) onToggleMore()
  }

  return (
    <>
      {/* Backdrop create ou more */}
      {(showCreate || showMore) && (
        <div className="fixed inset-0 z-40" onClick={closeAll} />
      )}

      {/* Bulle "Créer" — au-dessus du bouton + */}
      {showCreate && (
        <div className="fixed z-50 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 overflow-hidden">
          {/* Flèche vers le bas */}
          <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r border-b border-slate-100 rotate-45" />

          <button
            onClick={() => { onNewVideo(); closeAll() }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.8"/>
                <polygon points="7.5,6 13,9 7.5,12" fill="currentColor"/>
              </svg>
            </span>
            Nouvelle vidéo
          </button>

          <button
            onClick={() => { onNavigate('ideas'); closeAll() }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5a5 5 0 0 1 3 9c-.5.4-.8 1-.8 1.5v.5H6.8V12c0-.6-.3-1.1-.8-1.5a5 5 0 0 1 3-9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M6.8 14.5h4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            Nouvelle idée
          </button>

          <button
            onClick={() => { onNavigate('rushs'); closeAll() }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="4" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M5 4V3a2 2 0 014 0v1M9 4V3a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            Nouveaux rushs
          </button>
        </div>
      )}

      {/* Feuille "Plus" */}
      {showMore && (
        <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 mx-3 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
          </div>
          {[
            {
              id: 'analytics', label: 'Analytics',
              icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14l4-5 3 3 4-6 3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
            },
            {
              id: 'commandes', label: 'Commandes',
              icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M5 6h8M5 9h8M5 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
            },
            {
              id: 'rushs', label: 'Rushs',
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="4" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                  <rect x="1" y="2" width="16" height="2.5" rx="1" fill="currentColor" opacity=".3"/>
                  <rect x="3.5" y="1" width="2" height="4" rx=".8" fill="currentColor"/>
                  <rect x="7.5" y="1" width="2" height="4" rx=".8" fill="currentColor"/>
                  <rect x="11.5" y="1" width="2" height="4" rx=".8" fill="currentColor"/>
                  <path d="M6 9l4-2v4l-4-2z" fill="currentColor" opacity=".7"/>
                </svg>
              ),
            },
            {
              id: 'produits', label: 'Produits',
              icon: (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1.5l7 3.5v8L9 16.5 2 13V5l7-3.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M9 1.5v15M2 5l7 3.5L16 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              ),
            },
            {
              id: 'parametres', label: 'Profil & Paramètres',
              icon: photo
                ? <img src={photo} alt="" className="w-[18px] h-[18px] rounded-full object-cover" />
                : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M3 15c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onToggleMore() }}
              className={`flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium transition-colors ${
                activePage === item.id ? 'text-brand bg-brand/5' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={activePage === item.id ? 'text-brand' : 'text-slate-400'}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="h-px bg-slate-100 mx-4" />
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 3H4a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              <path d="M12 6l3 3-3 3M15 9H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Se déconnecter
          </button>
          <div className="pb-2" />
        </div>
      )}

      {/* Barre de navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-100"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-end">

          {/* Dashboard */}
          <NavItem
            label="Accueil"
            active={activePage === 'dashboard'}
            onClick={() => { onNavigate('dashboard'); closeAll() }}
            icon={
              <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="7" height="7" rx="2" fill="currentColor" opacity=".8"/>
                <rect x="10" y="1" width="7" height="7" rx="2" fill="currentColor" opacity=".4"/>
                <rect x="1" y="10" width="7" height="7" rx="2" fill="currentColor" opacity=".4"/>
                <rect x="10" y="10" width="7" height="7" rx="2" fill="currentColor" opacity=".8"/>
              </svg>
            }
          />

          {/* Vidéos */}
          <NavItem
            label="Vidéos"
            active={activePage === 'realisation'}
            onClick={() => { onNavigate('realisation'); closeAll() }}
            icon={
              <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.8"/>
                <polygon points="7.5,6 13,9 7.5,12" fill="currentColor"/>
              </svg>
            }
          />

          {/* Bouton + central */}
          <div className="flex-1 flex flex-col items-center pb-2">
            <button
              onClick={() => { setShowCreate((v) => !v); if (showMore) onToggleMore() }}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                showCreate
                  ? 'bg-slate-700 rotate-45'
                  : 'bg-brand'
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                <path d="M9 3v12M3 9h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Idées */}
          <NavItem
            label="Idées"
            active={activePage === 'ideas'}
            onClick={() => { onNavigate('ideas'); closeAll() }}
            icon={
              <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5a5 5 0 0 1 3 9c-.5.4-.8 1-.8 1.5v.5H6.8V12c0-.6-.3-1.1-.8-1.5a5 5 0 0 1 3-9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M6.8 14.5h4.4M7.5 16.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            }
          />

          {/* Plus */}
          <NavItem
            label="Plus"
            active={showMore || SECONDARY_PAGES.includes(activePage)}
            onClick={() => { onToggleMore(); setShowCreate(false) }}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
              </svg>
            }
          />

        </div>
      </nav>
    </>
  )
}

function NavItem({
  label, active, onClick, icon,
}: {
  label: string
  active: boolean
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
        active ? 'text-brand' : 'text-slate-400'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </button>
  )
}
