'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react'

interface EventDetailsModalProps {
  event: {
    id: string
    title: string
    description?: string
    startTime: string
    endTime: string
    room: string
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
    participants?: number
    organizer?: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (event: any) => void
  onDelete?: (eventId: string) => void
}

export function EventDetailsModal({
  event,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: EventDetailsModalProps) {
  if (!event) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default'
      case 'in-progress':
        return 'warning'
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'destructive'
      default:
        return 'default'
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event)
      onOpenChange(false)
    }
  }

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to cancel this meeting?')) {
      onDelete(event.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{event.title}</DialogTitle>
              <div className="mt-2">
                <Badge variant={getStatusColor(event.status)}>
                  {event.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          {event.description && (
            <DialogDescription className="text-base mt-4">
              {event.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date and Time */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium">Date & Time</div>
              <div className="text-sm text-muted-foreground">
                {formatDate(event.startTime)}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium">Duration</div>
              <div className="text-sm text-muted-foreground">
                {(() => {
                  const start = new Date(event.startTime)
                  const end = new Date(event.endTime)
                  const diffMs = end.getTime() - start.getTime()
                  const diffMins = Math.round(diffMs / 60000)
                  const hours = Math.floor(diffMins / 60)
                  const mins = diffMins % 60
                  return hours > 0
                    ? `${hours} hour${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} min` : ''}`
                    : `${mins} minutes`
                })()}
              </div>
            </div>
          </div>

          {/* Location/Room */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="font-medium">Location</div>
              <div className="text-sm text-muted-foreground">{event.room}</div>
            </div>
          </div>

          {/* Participants */}
          {(event.participants !== undefined || event.organizer) && (
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Participants</div>
                {event.organizer && (
                  <div className="text-sm text-muted-foreground">
                    Organizer: {event.organizer}
                  </div>
                )}
                {event.participants !== undefined && (
                  <div className="text-sm text-muted-foreground">
                    {event.participants} participant{event.participants !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Meeting Link (Future feature) */}
          <div className="border-t pt-4">
            <div className="text-sm text-muted-foreground">
              Meeting link and additional details will be available here.
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onEdit && event.status === 'scheduled' && (
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && event.status === 'scheduled' && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Cancel Meeting
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
