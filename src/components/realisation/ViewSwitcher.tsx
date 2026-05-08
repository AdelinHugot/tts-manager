export type ViewType = 'list' | 'kanban' | 'cards'

type Props = {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

const VIEWS: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  {
    id: 'list',
    label: 'Vue Liste',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <rect x="2" y="3" width="12" height="1.5" rx="0.75" fill="currentColor"/>
        <rect x="2" y="7.25" width="12" height="1.5" rx="0.75" fill="currentColor"/>
        <rect x="2" y="11.5" width="12" height="1.5" rx="0.75" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'kanban',
    label: 'Vue Kanban',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <rect x="1" y="2" width="4" height="12" rx="1" fill="currentColor"/>
        <rect x="6" y="2" width="4" height="8" rx="1" fill="currentColor"/>
        <rect x="11" y="2" width="4" height="10" rx="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'cards',
    label: 'Vue Cards',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function ViewSwitcher({ activeView, onViewChange }: Props) {
  return (
    <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-lg">
      {VIEWS.map((view) => (
        <button
          key={view.id}
          title={view.label}
          onClick={() => onViewChange(view.id)}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
            activeView === view.id
              ? 'bg-white text-brand shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {view.icon}
        </button>
      ))}
    </div>
  )
}
