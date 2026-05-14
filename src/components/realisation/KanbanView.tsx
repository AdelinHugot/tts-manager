import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import type { Realisation, Product, RealisationStatus } from '../../types/realisation'
import { STATUS_LABELS, STATUS_COLORS } from '../../types/realisation'
import StatusBadge from './StatusBadge'

const ORDERED_STATUSES: RealisationStatus[] = [
  'a_tourner',
  'script',
  'a_monter',
  'a_publier',
  'publiee',
]

type Props = {
  realisations: Realisation[]
  products: Product[]
  onSelect: (r: Realisation) => void
  onStatusChange: (id: string, status: RealisationStatus) => void
}

function KanbanCard({
  realisation,
  product,
  onSelect,
}: {
  realisation: Realisation
  product: Product | undefined
  onSelect: (r: Realisation) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: realisation.id,
  })

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(realisation)}
      className={`bg-white border border-slate-100 rounded-xl p-3.5 cursor-pointer shadow-sm hover:shadow-md transition-all select-none ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <p className="text-sm font-semibold text-slate-800 mb-2 leading-snug">{realisation.title}</p>
      {product && (
        <p className="text-xs text-slate-400 mb-2.5 truncate">{product.name}</p>
      )}
      <div className="flex items-center justify-between">
        <StatusBadge status={realisation.status} size="sm" />
        {realisation.rushIds.length > 0 && (
          <span className="text-xs text-slate-400">▶ {realisation.rushIds.length}</span>
        )}
      </div>
    </div>
  )
}

function KanbanColumn({
  status,
  realisations,
  products,
  onSelect,
}: {
  status: RealisationStatus
  realisations: Realisation[]
  products: Product[]
  onSelect: (r: Realisation) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const { dot } = STATUS_COLORS[status]
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  return (
    <div className="flex flex-col gap-3 min-w-[220px] flex-1">
      <div className="flex items-center gap-2 px-1">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {STATUS_LABELS[status]}
        </span>
        <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {realisations.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2.5 min-h-[200px] rounded-xl p-2 transition-colors ${
          isOver ? 'bg-brand/5 border-2 border-brand/20' : 'bg-slate-100/50'
        }`}
      >
        {realisations.map((r) => (
          <KanbanCard
            key={r.id}
            realisation={r}
            product={productMap[r.productId]}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

export default function KanbanView({ realisations, products, onSelect, onStatusChange }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event
    setActiveId(null)
    if (over) {
      onStatusChange(active.id as string, over.id as RealisationStatus)
    }
  }

  const activeRealisation = realisations.find((r) => r.id === activeId)
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {ORDERED_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            realisations={realisations.filter((r) => r.status === status)}
            products={products}
            onSelect={onSelect}
          />
        ))}
      </div>
      <DragOverlay>
        {activeRealisation && (
          <div className="bg-white border border-brand/30 rounded-xl p-3.5 shadow-xl w-[220px] opacity-95">
            <p className="text-sm font-semibold text-slate-800">{activeRealisation.title}</p>
            <p className="text-xs text-slate-400 mt-1">
              {productMap[activeRealisation.productId]?.name}
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
