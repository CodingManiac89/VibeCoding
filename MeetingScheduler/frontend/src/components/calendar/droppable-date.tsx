'use client'

import { useDroppable } from '@dnd-kit/core'

interface DroppableDateProps {
  id: string
  date: Date
  children: React.ReactNode
  className?: string
}

export function DroppableDate({ id, date, children, className = '' }: DroppableDateProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { date },
  })

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`}
    >
      {children}
    </div>
  )
}
