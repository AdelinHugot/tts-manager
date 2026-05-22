import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { Realisation } from '../types/realisation'
import { STATUS_COLORS } from '../types/realisation'
import CalendarGrid from '../components/planning/CalendarGrid'
import UnscheduledList from '../components/planning/UnscheduledList'

type Props = {
  realisations: Realisation[]
  onPublishDateChange: (id: string, date: string | null) => void
}

export default function Planning({ realisations, onPublishDateChange }: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const unscheduled = realisations.filter((r) => r.publishDate === null)
  const activeRealisation = activeId ? realisations.find((r) => r.id === activeId) ?? null : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const id = String(active.id)
    const overId = String(over.id)

    if (overId === 'unscheduled') {
      onPublishDateChange(id, null)
    } else {
      onPublishDateChange(id, overId)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Planning</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {realisations.length} réalisations au total · {unscheduled.length} sans date
        </p>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 items-start">
          {/* Calendar — flex-grow */}
          <div className="flex-1 min-w-0">
            <CalendarGrid
              realisations={realisations}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </div>

          {/* Unscheduled — fixed right column */}
          <div className="w-72 flex-shrink-0" style={{ height: 'calc(100vh - 200px)' }}>
            <UnscheduledList realisations={unscheduled} />
          </div>
        </div>

        {/* Ghost chip while dragging */}
        <DragOverlay>
          {activeRealisation && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-lg select-none cursor-grabbing opacity-90">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  STATUS_COLORS[activeRealisation.status].dot
                }`}
              />
              <span className="truncate max-w-[120px]">{activeRealisation.title}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
