'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { DraggableEvent } from './draggable-event'
import { DroppableDate } from './droppable-date'

// Optional: Can integrate with useCalendarView hook for Zustand store connection
// import { useCalendarView } from '@/hooks/useCalendarView'

type ViewType = 'month' | 'week' | 'day'

interface CalendarEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  room: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  color?: string
}

interface CalendarViewProps {
  events?: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
  enableDragDrop?: boolean
}

export function CalendarView({ events = [], onEventClick, onDateClick, enableDragDrop = false }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>('month')

  // Use provided events, no mock data
  const calendarEvents = events

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getWeekDays = (date: Date) => {
    const day = date.getDay()
    const diff = date.getDate() - day
    const sunday = new Date(date)
    sunday.setDate(diff)
    
    const weekDays: Date[] = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(sunday)
      day.setDate(sunday.getDate() + i)
      weekDays.push(day)
    }
    
    return weekDays
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    
    return calendarEvents.filter((event: CalendarEvent) => {
      const eventDate = new Date(event.startTime)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigate = (direction: 'prev' | 'next') => {
    if (viewType === 'month') navigateMonth(direction)
    else if (viewType === 'week') navigateWeek(direction)
    else navigateDay(direction)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default'
      case 'in-progress': return 'warning'
      case 'completed': return 'success'
      case 'cancelled': return 'destructive'
      default: return 'default'
    }
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-semibold py-2 text-gray-600">
            {day}
          </div>
        ))}
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date)
          const isTodayDate = isToday(date)
          
          const cellContent = (
            <div
              className={`min-h-[100px] border rounded-lg p-2 ${
                date ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
              } ${isTodayDate ? 'border-blue-500 border-2' : 'border-gray-200'}`}
              onClick={() => date && onDateClick?.(date)}
            >
              {date && (
                <>
                  <div className={`text-sm font-medium ${isTodayDate ? 'text-blue-600' : 'text-gray-700'}`}>
                    {date.getDate()}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event: CalendarEvent) => {
                      const eventElement = (
                        <div
                          className={`text-xs p-1 rounded truncate cursor-pointer ${
                            event.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            event.color === 'green' ? 'bg-green-100 text-green-700' :
                            event.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventClick?.(event)
                          }}
                        >
                          {formatTime(event.startTime)} {event.title}
                        </div>
                      )
                      
                      return enableDragDrop && event.status === 'scheduled' ? (
                        <DraggableEvent key={event.id} id={event.id}>
                          {eventElement}
                        </DraggableEvent>
                      ) : (
                        <div key={event.id}>{eventElement}</div>
                      )
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
          
          return enableDragDrop && date ? (
            <DroppableDate key={index} id={`date-${date.toISOString()}`} date={date}>
              {cellContent}
            </DroppableDate>
          ) : (
            <div key={index}>{cellContent}</div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate)
    const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM
    
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 text-sm font-semibold bg-gray-50 border-r">Time</div>
          {weekDays.map((day, index) => {
            const isTodayDate = isToday(day)
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            return (
              <div
                key={index}
                className={`p-2 text-center border-r last:border-r-0 ${
                  isTodayDate ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <div className={`text-xs ${isTodayDate ? 'text-blue-600' : 'text-gray-600'}`}>
                  {dayNames[day.getDay()]}
                </div>
                <div className={`text-lg font-semibold ${isTodayDate ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day.getDate()}
                </div>
              </div>
            )
          })}
        </div>
        <div className="overflow-y-auto max-h-[600px]">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
              <div className="p-2 text-sm text-gray-600 bg-gray-50 border-r">
                {hour % 12 || 12}:00 {hour < 12 ? 'AM' : 'PM'}
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDate(day).filter((event: CalendarEvent) => {
                  const eventHour = new Date(event.startTime).getHours()
                  return eventHour === hour
                })
                
                return (
                  <div
                    key={dayIndex}
                    className="p-1 min-h-[60px] border-r last:border-r-0 hover:bg-gray-50"
                  >
                    {dayEvents.map((event: CalendarEvent) => (
                      <div
                        key={event.id}
                        className={`text-xs p-2 rounded mb-1 cursor-pointer ${
                          event.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                          event.color === 'green' ? 'bg-green-100 text-green-700' :
                          event.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => onEventClick?.(event)}
                      >
                        <div className="font-semibold">{event.title}</div>
                        <div className="text-[10px]">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM
    const dayEvents = getEventsForDate(currentDate)
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {hours.map(hour => {
              const hourEvents = dayEvents.filter((event: CalendarEvent) => {
                const eventHour = new Date(event.startTime).getHours()
                return eventHour === hour
              })
              
              return (
                <div key={hour} className="flex border-b last:border-b-0 py-2">
                  <div className="w-24 text-sm text-gray-600 flex-shrink-0">
                    {hour % 12 || 12}:00 {hour < 12 ? 'AM' : 'PM'}
                  </div>
                  <div className="flex-1 space-y-2">
                    {hourEvents.map((event: CalendarEvent) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg cursor-pointer ${
                          event.color === 'blue' ? 'bg-blue-50 border-l-4 border-blue-500' :
                          event.color === 'green' ? 'bg-green-50 border-l-4 border-green-500' :
                          event.color === 'purple' ? 'bg-purple-50 border-l-4 border-purple-500' :
                          'bg-gray-50 border-l-4 border-gray-500'
                        }`}
                        onClick={() => onEventClick?.(event)}
                      >
                        <div className="font-semibold text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-gray-600">{event.room}</span>
                          <Badge variant={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Today
          </Button>
        </div>

        <h2 className="text-2xl font-bold">
          {viewType === 'month' && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          {viewType === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          {viewType === 'day' && currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>

        <div className="flex gap-2">
          <Button
            variant={viewType === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('month')}
          >
            Month
          </Button>
          <Button
            variant={viewType === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('week')}
          >
            Week
          </Button>
          <Button
            variant={viewType === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('day')}
          >
            Day
          </Button>
        </div>
      </div>

      {viewType === 'month' && renderMonthView()}
      {viewType === 'week' && renderWeekView()}
      {viewType === 'day' && renderDayView()}
    </div>
  )
}
