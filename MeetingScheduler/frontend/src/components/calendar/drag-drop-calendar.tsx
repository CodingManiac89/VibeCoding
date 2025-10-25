'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  room: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  color?: string
  participants?: number
  organizer?: string
}

interface DragDropCalendarProps {
  children: React.ReactNode
  events: CalendarEvent[]
  onEventDrop: (eventId: string, newDate: Date) => void
}

export function DragDropCalendar({ children, events, onEventDrop }: DragDropCalendarProps) {
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const draggedEvent = events.find((e) => e.id === event.active.id)
    if (draggedEvent) {
      setActiveEvent(draggedEvent)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      // Get the date from the droppable area
      const droppableData = over.data.current as { date: Date } | undefined
      
      if (droppableData?.date) {
        const eventId = active.id as string
        onEventDrop(eventId, droppableData.date)
      }
    }

    setActiveEvent(null)
  }

  const handleDragCancel = () => {
    setActiveEvent(null)
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      
      <DragOverlay>
        {activeEvent ? (
          <div className="bg-white border-2 border-blue-500 rounded-lg shadow-2xl p-3 cursor-grabbing">
            <div className="font-semibold text-sm">{activeEvent.title}</div>
            <div className="text-xs text-gray-600 mt-1">
              {new Date(activeEvent.startTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
