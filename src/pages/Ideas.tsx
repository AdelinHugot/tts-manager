import { useState, useRef } from 'react'

type IdeaStatus = 'pending' | 'validated' | 'rejected'
type Filter = 'all' | IdeaStatus

type Idea = {
  id: string
  text: string
  status: IdeaStatus
  createdAt: Date
}

// Pool d'idées IA basées sur les vrais produits du compte
const AI_SUGGESTIONS = [
  'Hook : "Ce produit a changé mes nuits en 7 jours — je vous explique"',
  'POV : tu reçois tes enzymes digestives pour la première fois',
  'Vidéo "avant/après" Papills Sommeil — 2 semaines de test honnête',
  '"J\'ai acheté le démarreur portable APG — voilà ce que j\'en pense vraiment"',
  'Hook choc : "Ne commandez PAS cette crème avant de regarder cette vidéo"',
  'Format GRWM avec le duo Peel Shot Basis Lab dans la routine matin',
  '3 raisons pour lesquelles la vanille Grand Cru vaut le prix',
  '"J\'ai testé les couches la marque en moins pendant 1 mois" — résultats',
  'Hook : "Le complément sommeil dont personne ne parle sur TikTok"',
  '"Pourquoi mes enzymes digestives ont tout changé" — storytelling personnel',
  'Comparison : QINGLIN crème vs grandes marques au même prix',
  '"Le kit QINGLIN complet — je vous montre tout" — unboxing satisfaisant',
  'Hook : "Ce démarreur de voiture m\'a sauvé la mise en plein hiver"',
  'Format recette courte avec les gousses de vanille Grand Cru',
  '"Ce que j\'aurais voulu savoir avant d\'acheter Papills Sommeil"',
  'Vidéo "valise de voyage" avec le démarreur portable — format lifestyle',
  'Hook : "3 produits TikTok Shop que j\'utilise vraiment au quotidien"',
  '"Mon avis honnête après 30 jours" — format long sur QINGLIN',
  'Format tutoriel : comment utiliser les enzymes digestives et à quel moment',
  'Trend sonore + produit Basis Lab — reel satisfaisant skincare',
]

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'En attente', value: 'pending' },
  { label: 'Validées', value: 'validated' },
  { label: 'Rejetées', value: 'rejected' },
]

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [aiLoading, setAiLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function addIdea(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setIdeas((prev) => [
      { id: crypto.randomUUID(), text: trimmed, status: 'pending', createdAt: new Date() },
      ...prev,
    ])
    setInput('')
  }

  function setStatus(id: string, status: IdeaStatus) {
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  function deleteIdea(id: string) {
    setIdeas((prev) => prev.filter((i) => i.id !== id))
  }

  function handleAISuggest() {
    setAiLoading(true)
    // Simulate a brief async call, then add 3 suggestions not already in the list
    setTimeout(() => {
      const existing = new Set(ideas.map((i) => i.text))
      const available = AI_SUGGESTIONS.filter((s) => !existing.has(s))
      const picks = available.sort(() => Math.random() - 0.5).slice(0, 3)
      if (picks.length === 0) return
      setIdeas((prev) => [
        ...picks.map((text) => ({
          id: crypto.randomUUID(),
          text,
          status: 'pending' as IdeaStatus,
          createdAt: new Date(),
        })),
        ...prev,
      ])
      setAiLoading(false)
    }, 600)
  }

  const filtered = ideas.filter((i) => filter === 'all' || i.status === filter)
  const validatedCount = ideas.filter((i) => i.status === 'validated').length
  const pendingCount = ideas.filter((i) => i.status === 'pending').length

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Idées</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {ideas.length} idées · {validatedCount} validées · {pendingCount} en attente
          </p>
        </div>
        <button
          onClick={handleAISuggest}
          disabled={aiLoading}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-60 shadow-sm"
        >
          {aiLoading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <span>✨</span>
          )}
          Suggérer avec l'IA
        </button>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-5">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addIdea(input)}
          placeholder="Nouvelle idée de hook ou de vidéo…"
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50 shadow-sm"
        />
        <button
          onClick={() => addIdea(input)}
          disabled={!input.trim()}
          className="px-4 py-3 bg-brand text-white rounded-xl font-bold text-lg hover:bg-brand/90 transition-colors disabled:opacity-40 shadow-sm"
        >
          +
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              filter === f.value
                ? 'bg-white text-brand shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ideas list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          {ideas.length === 0 ? (
            <>
              <p className="text-3xl mb-3">💡</p>
              <p className="text-sm font-medium">Aucune idée pour l'instant</p>
              <p className="text-xs mt-1">Écris ta première idée ou laisse l'IA t'inspirer</p>
            </>
          ) : (
            <p className="text-sm">Aucune idée dans cette catégorie</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onValidate={() => setStatus(idea.id, idea.status === 'validated' ? 'pending' : 'validated')}
              onReject={() => setStatus(idea.id, idea.status === 'rejected' ? 'pending' : 'rejected')}
              onDelete={() => deleteIdea(idea.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function IdeaCard({
  idea,
  onValidate,
  onReject,
  onDelete,
}: {
  idea: Idea
  onValidate: () => void
  onReject: () => void
  onDelete: () => void
}) {
  const isValidated = idea.status === 'validated'
  const isRejected = idea.status === 'rejected'

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
        isValidated
          ? 'bg-emerald-50 border-emerald-100'
          : isRejected
          ? 'bg-slate-50 border-slate-100 opacity-60'
          : 'bg-white border-slate-100 shadow-sm'
      }`}
    >
      <p
        className={`flex-1 text-sm leading-snug ${
          isRejected ? 'line-through text-slate-400' : 'text-slate-700'
        } ${isValidated ? 'font-medium text-emerald-800' : ''}`}
      >
        {idea.text}
      </p>

      {/* Validate */}
      <button
        onClick={onValidate}
        title="Valider"
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
          isValidated
            ? 'bg-emerald-500 text-white'
            : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
        }`}
      >
        ✓
      </button>

      {/* Reject */}
      <button
        onClick={onReject}
        title="Rejeter"
        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
          isRejected
            ? 'bg-slate-300 text-slate-600'
            : 'text-slate-400 hover:bg-red-50 hover:text-red-500'
        }`}
      >
        ✕
      </button>

      {/* Delete */}
      <button
        onClick={onDelete}
        title="Supprimer"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-100 hover:text-slate-500 transition-all text-xs"
      >
        🗑
      </button>
    </div>
  )
}
