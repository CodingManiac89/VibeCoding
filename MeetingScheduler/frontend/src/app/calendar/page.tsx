'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { MainLayout } from '@/components/layout/main-layout'
import { CalendarView } from '@/components/calendar/calendar-view'
import { EventDetailsModal } from '@/components/calendar/event-details-modal'
import { CreateMeetingModal } from '@/components/calendar/create-meeting-modal'
import { EditMeetingModal } from '@/components/calendar/edit-meeting-modal'
import { DragDropCalendar } from '@/components/calendar/drag-drop-calendar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

// Local interface for calendar events (simpler than full Meeting type)
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

export default function CalendarPage() {
  // Local state for events (will integrate with backend API later)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [showCreateMeeting, setShowCreateMeeting] = useState(false)
  const [showEditMeeting, setShowEditMeeting] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // Initialize with mock data on mount
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Team Standup',
        description: 'Daily team sync to discuss progress and blockers',
        startTime: '2025-01-15T09:00:00',
        endTime: '2025-01-15T09:30:00',
        room: 'Conference Room A',
        status: 'scheduled',
        color: 'blue',
        participants: 8,
        organizer: 'John Doe',
      },
      {
        id: '2',
        title: 'Project Review',
        description: 'Quarterly project review with stakeholders',
        startTime: '2025-01-15T14:00:00',
        endTime: '2025-01-15T15:30:00',
        room: 'Board Room',
        status: 'scheduled',
        color: 'green',
        participants: 12,
        organizer: 'Jane Smith',
      },
      {
        id: '3',
        title: 'Client Meeting',
        description: 'Demo and feedback session with client',
        startTime: '2025-01-16T10:00:00',
        endTime: '2025-01-16T11:00:00',
        room: 'Conference Room B',
        status: 'scheduled',
        color: 'purple',
        participants: 5,
        organizer: 'Bob Wilson',
      },
    ]
    setEvents(mockEvents)
  }, [])

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowCreateMeeting(true)
  }

  const handleCreateMeeting = () => {
    setSelectedDate(undefined)
    setShowCreateMeeting(true)
  }

  const handleCreateMeetingSubmit = (meetingData: {
    title: string
    description: string
    startTime: string
    endTime: string
    room: string
  }) => {
    const newMeeting: CalendarEvent = {
      id: Date.now().toString(),
      ...meetingData,
      status: 'scheduled',
      color: 'blue',
      participants: 0,
      organizer: 'You',
    }

    setEvents([...events, newMeeting])
    toast.success('Meeting created successfully', {
      description: `${meetingData.title} has been scheduled`,
    })
    console.log('Meeting created:', newMeeting)
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventDetails(false)
    setShowEditMeeting(true)
  }

  const handleUpdateMeeting = (meetingData: {
    title: string
    description: string
    startTime: string
    endTime: string
    room: string
  }) => {
    if (selectedEvent) {
      setEvents(events.map((e) => 
        e.id === selectedEvent.id
          ? { ...e, ...meetingData }
          : e
      ))
      toast.success('Meeting updated successfully', {
        description: `${meetingData.title} has been updated`,
      })
      console.log('Meeting updated:', selectedEvent.id)
    }
  }

  const handleDeleteEvent = (eventId: string) => {
    const deletedEvent = events.find((e) => e.id === eventId)
    setEvents(events.filter((e) => e.id !== eventId))
    setShowEventDetails(false)
    toast.success('Meeting deleted', {
      description: deletedEvent ? `${deletedEvent.title} has been removed` : 'Meeting removed from calendar',
    })
    console.log('Event deleted:', eventId)
  }

  const handleEventDrop = (eventId: string, newDate: Date) => {
    const movedEvent = events.find((e) => e.id === eventId)
    
    setEvents(events.map((event) => {
      if (event.id === eventId) {
        // Calculate the time difference to maintain the same time of day
        const oldStart = new Date(event.startTime)
        const oldEnd = new Date(event.endTime)
        const duration = oldEnd.getTime() - oldStart.getTime()

        // Create new date with the same time
        const newStart = new Date(newDate)
        newStart.setHours(oldStart.getHours(), oldStart.getMinutes(), 0, 0)
        
        const newEnd = new Date(newStart.getTime() + duration)

        return {
          ...event,
          startTime: newStart.toISOString(),
          endTime: newEnd.toISOString(),
        }
      }
      return event
    }))
    
    toast.success('Meeting rescheduled', {
      description: movedEvent 
        ? `${movedEvent.title} moved to ${newDate.toLocaleDateString()}`
        : `Event moved to ${newDate.toLocaleDateString()}`,
    })
    console.log(`Event ${eventId} moved to ${newDate.toLocaleDateString()}`)
  }

  return (
    <MainLayout>
      <DragDropCalendar events={events} onEventDrop={handleEventDrop}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Calendar</h1>
              <p className="text-gray-600 mt-2">
                View and manage your schedule. Drag events to reschedule.
              </p>
            </div>
            <Button onClick={handleCreateMeeting}>
              <Plus className="h-4 w-4 mr-2" />
              Create Meeting
            </Button>
          </div>

          <CalendarView
            events={events}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
            enableDragDrop={true}
          />

          <EventDetailsModal
            event={selectedEvent}
            open={showEventDetails}
            onOpenChange={setShowEventDetails}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />

          <CreateMeetingModal
            open={showCreateMeeting}
            onOpenChange={setShowCreateMeeting}
            onCreateMeeting={handleCreateMeetingSubmit}
            selectedDate={selectedDate}
          />

          {selectedEvent && (
            <EditMeetingModal
              event={selectedEvent}
              open={showEditMeeting}
              onOpenChange={setShowEditMeeting}
              onUpdateMeeting={handleUpdateMeeting}
            />
          )}
        </div>
      </DragDropCalendar>
    </MainLayout>
  )
}
