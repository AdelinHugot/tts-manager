import { useDraggable } from '@dnd-kit/core'
import type { Realisation } from '../../types/realisation'
import { STATUS_COLORS } from '../../types/realisation'

type Props = {
  realisation: Realisation
}

export default function RealisationChip({ realisation }: Props) {
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
      className={`flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-100 rounded-lg text-xs font-medium text-slate-700 cursor-grab select-none shadow-sm hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_COLORS[realisation.status].dot}`}
      />
      <span className="truncate max-w-[120px]">{realisation.title}</span>
    </div>
  )
}
