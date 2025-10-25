import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { CalendarView, CalendarViewType, CalendarEvent } from '@/types'

interface CalendarState {
  currentView: CalendarView
  events: CalendarEvent[]
  selectedDate: Date
  isLoading: boolean
  error: string | null
}

interface CalendarActions {
  setView: (viewType: CalendarViewType) => void
  setDate: (date: Date) => void
  setEvents: (events: CalendarEvent[]) => void
  addEvent: (event: CalendarEvent) => void
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void
  removeEvent: (eventId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchEvents: (start: Date, end: Date) => Promise<void>
}

type CalendarStore = CalendarState & CalendarActions

const getInitialView = (): CalendarView => {
  const today = new Date()
  return {
    type: CalendarViewType.MONTH,
    date: today,
    range: {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    },
  }
}

export const useCalendarStore = create<CalendarStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentView: getInitialView(),
      events: [],
      selectedDate: new Date(),
      isLoading: false,
      error: null,

      // Actions
      setView: (viewType: CalendarViewType) => {
        const { selectedDate } = get()
        const newView: CalendarView = {
          type: viewType,
          date: selectedDate,
          range: calculateRange(viewType, selectedDate),
        }
        set({ currentView: newView }, false, 'setView')
      },

      setDate: (date: Date) => {
        const { currentView } = get()
        const newView: CalendarView = {
          ...currentView,
          date,
          range: calculateRange(currentView.type, date),
        }
        set({ selectedDate: date, currentView: newView }, false, 'setDate')
      },

      setEvents: (events: CalendarEvent[]) =>
        set({ events }, false, 'setEvents'),

      addEvent: (event: CalendarEvent) =>
        set(
          (state) => ({ events: [...state.events, event] }),
          false,
          'addEvent'
        ),

      updateEvent: (eventId: string, updates: Partial<CalendarEvent>) =>
        set(
          (state) => ({
            events: state.events.map((event) =>
              event.id === eventId ? { ...event, ...updates } : event
            ),
          }),
          false,
          'updateEvent'
        ),

      removeEvent: (eventId: string) =>
        set(
          (state) => ({
            events: state.events.filter((event) => event.id !== eventId),
          }),
          false,
          'removeEvent'
        ),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }, false, 'setLoading'),

      setError: (error: string | null) =>
        set({ error }, false, 'setError'),

      fetchEvents: async (start: Date, end: Date) => {
        set({ isLoading: true, error: null }, false, 'fetchEvents/start')

        try {
          // TODO: Replace with actual API call
          const mockEvents: CalendarEvent[] = [
            {
              id: '1',
              title: 'Team Standup',
              start: new Date(),
              end: new Date(Date.now() + 30 * 60 * 1000),
              allDay: false,
              color: '#3b82f6',
            },
            {
              id: '2',
              title: 'Project Review',
              start: new Date(Date.now() + 2 * 60 * 60 * 1000),
              end: new Date(Date.now() + 3 * 60 * 60 * 1000),
              allDay: false,
              color: '#ef4444',
            },
          ]

          await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

          set({ events: mockEvents, isLoading: false }, false, 'fetchEvents/success')
        } catch (error) {
          set(
            {
              error: error instanceof Error ? error.message : 'Failed to fetch events',
              isLoading: false,
            },
            false,
            'fetchEvents/error'
          )
        }
      },
    }),
    {
      name: 'calendar-store',
    }
  )
)

// Helper function to calculate date ranges for different view types
function calculateRange(viewType: CalendarViewType, date: Date): { start: Date; end: Date } {
  const start = new Date(date)
  const end = new Date(date)

  switch (viewType) {
    case CalendarViewType.DAY:
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case CalendarViewType.WEEK:
      const dayOfWeek = start.getDay()
      start.setDate(start.getDate() - dayOfWeek)
      start.setHours(0, 0, 0, 0)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      break
    case CalendarViewType.MONTH:
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(end.getMonth() + 1)
      end.setDate(0)
      end.setHours(23, 59, 59, 999)
      break
    default:
      break
  }

  return { start, end }
}