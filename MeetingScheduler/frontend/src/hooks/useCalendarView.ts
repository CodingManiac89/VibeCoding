import { useCalendarStore } from '@/stores/calendar'
import { CalendarViewType } from '@/types'

/**
 * Custom hook to manage calendar state and view type
 * Provides a simple interface to interact with the Zustand calendar store
 */
export function useCalendarView() {
  const { currentView, setView, setDate, selectedDate } = useCalendarStore()

  const changeView = (viewType: 'month' | 'week' | 'day') => {
    const viewTypeMap = {
      month: CalendarViewType.MONTH,
      week: CalendarViewType.WEEK,
      day: CalendarViewType.DAY,
    }
    setView(viewTypeMap[viewType])
  }

  const goToDate = (date: Date) => {
    setDate(date)
  }

  const goToToday = () => {
    setDate(new Date())
  }

  const navigateBy = (amount: number, unit: 'day' | 'week' | 'month') => {
    const newDate = new Date(selectedDate)
    
    switch (unit) {
      case 'day':
        newDate.setDate(newDate.getDate() + amount)
        break
      case 'week':
        newDate.setDate(newDate.getDate() + amount * 7)
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + amount)
        break
    }
    
    setDate(newDate)
  }

  return {
    currentView,
    selectedDate,
    changeView,
    goToDate,
    goToToday,
    navigateBy,
  }
}

/**
 * Helper to get a human-readable view type string
 */
export function getViewLabel(viewType: CalendarViewType): string {
  const labels = {
    [CalendarViewType.DAY]: 'Day',
    [CalendarViewType.WEEK]: 'Week',
    [CalendarViewType.MONTH]: 'Month',
    [CalendarViewType.AGENDA]: 'Agenda',
  }
  return labels[viewType] || 'Month'
}

/**
 * Format date range based on view type
 */
export function formatDateRange(view: { type: CalendarViewType; date: Date }): string {
  const { type, date } = view
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }

  switch (type) {
    case CalendarViewType.DAY:
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    case CalendarViewType.WEEK:
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return `${weekStart.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${weekEnd.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`
    case CalendarViewType.MONTH:
      return date.toLocaleDateString('en-US', options)
    default:
      return date.toLocaleDateString('en-US', options)
  }
}
