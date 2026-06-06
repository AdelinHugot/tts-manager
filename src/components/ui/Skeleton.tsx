// ─── Primitive ────────────────────────────────────────────────────────────────

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-slate-200 animate-pulse rounded-lg ${className}`} />
}

// ─── App layout skeleton (affiché pendant le chargement initial) ───────────────

export function SkeletonAppLayout() {
  return (
    <div className="flex h-screen bg-[#F4F6FA]">

      {/* Sidebar */}
      <aside className="w-60 min-h-screen bg-white border-r border-slate-100 flex flex-col py-6 px-4">
        <div className="flex items-center gap-3 px-3 mb-8">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-28 h-4" />
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <Skeleton className="w-5 h-5 rounded-md" />
              <Skeleton className="w-20 h-3" />
            </div>
          ))}
        </nav>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Skeleton className="w-5 h-5 rounded-md" />
            <Skeleton className="w-24 h-3" />
          </div>
          <div className="p-3 rounded-xl bg-slate-50 flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="flex-1 h-3" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="w-40 h-7 mb-2" />
          <Skeleton className="w-56 h-4 rounded" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className={`h-14 rounded-2xl ${i % 3 === 1 ? 'opacity-70' : ''}`} />
          ))}
        </div>
      </main>
    </div>
  )
}

// ─── Skeleton pour grille de cartes (Réalisations, Produits) ─────────────────

export function SkeletonCardGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      ))}
    </div>
  )
}

// ─── Skeleton pour tableau (Commandes) ────────────────────────────────────────

export function SkeletonTable({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 px-4 py-2">
        {[60, 120, 80, 80, 60].map((w, i) => (
          <Skeleton key={i} className="h-3 rounded" style={{ width: w }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`flex gap-4 px-4 py-3 bg-white rounded-xl items-center ${i % 4 === 2 ? 'opacity-60' : ''}`}>
          <Skeleton className="h-4 rounded" style={{ width: 60 }} />
          <Skeleton className="h-4 flex-1 rounded" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>
      ))}
    </div>
  )
}
