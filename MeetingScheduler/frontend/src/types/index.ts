// User types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  department: string
  role: UserRole
  timezone: string
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

export interface UserPreferences {
  notifications: NotificationPreferences
  calendar: CalendarPreferences
  language: string
  theme: 'light' | 'dark' | 'system'
}

// Meeting types
export interface Meeting {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  timezone: string
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  organizer: User
  participants: Participant[]
  room?: Room
  status: MeetingStatus
  metadata: MeetingMetadata
  createdAt: Date
  updatedAt: Date
}

export enum MeetingStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

export interface Participant {
  user: User
  role: ParticipantRole
  status: ParticipantStatus
  joinedAt?: Date
}

export enum ParticipantRole {
  ORGANIZER = 'organizer',
  REQUIRED = 'required',
  OPTIONAL = 'optional',
}

export enum ParticipantStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  TENTATIVE = 'tentative',
}

// Room types
export interface Room {
  id: string
  name: string
  capacity: number
  location: string
  equipment: Equipment[]
  amenities: string[]
  isActive: boolean
  bookingRules: BookingRules
  createdAt: Date
  updatedAt: Date
}

export interface Equipment {
  id: string
  name: string
  type: EquipmentType
  isAvailable: boolean
}

export enum EquipmentType {
  PROJECTOR = 'projector',
  WHITEBOARD = 'whiteboard',
  CONFERENCE_PHONE = 'conference_phone',
  VIDEO_CONFERENCE = 'video_conference',
  LAPTOP = 'laptop',
  MICROPHONE = 'microphone',
}

// Calendar types
export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  resource?: Room
  meeting?: Meeting
  color?: string
}

export interface CalendarView {
  type: CalendarViewType
  date: Date
  range: {
    start: Date
    end: Date
  }
}

export enum CalendarViewType {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
  AGENDA = 'agenda',
}

// Notification types
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: Date
  userId: string
}

export enum NotificationType {
  MEETING_INVITATION = 'meeting_invitation',
  MEETING_REMINDER = 'meeting_reminder',
  MEETING_UPDATED = 'meeting_updated',
  MEETING_CANCELLED = 'meeting_cancelled',
  ROOM_BOOKED = 'room_booked',
  SYSTEM_ALERT = 'system_alert',
}

// Configuration types
export interface RecurrencePattern {
  frequency: RecurrenceFrequency
  interval: number
  endDate?: Date
  occurrences?: number
  daysOfWeek?: number[]
  dayOfMonth?: number
}

export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export interface BookingRules {
  maxAdvanceBookingDays: number
  minBookingDurationMinutes: number
  maxBookingDurationMinutes: number
  allowedTimeSlots: TimeSlot[]
  blackoutDates: Date[]
}

export interface TimeSlot {
  start: string // HH:mm format
  end: string // HH:mm format
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  inApp: boolean
  reminderTimes: number[] // minutes before meeting
}

export interface CalendarPreferences {
  defaultView: CalendarViewType
  workingHours: {
    start: string
    end: string
  }
  workingDays: number[]
  showWeekends: boolean
}

export interface MeetingMetadata {
  videoConferenceUrl?: string
  agenda?: string
  attachments?: string[]
  tags?: string[]
  isPrivate: boolean
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  message: string
  success: boolean
  timestamp: string
}

// Form types
export interface MeetingFormData {
  title: string
  description?: string
  startTime: Date
  endTime: Date
  timezone: string
  participants: string[] // user IDs
  roomId?: string
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  agenda?: string
  isPrivate: boolean
}

export interface UserFormData {
  email: string
  firstName: string
  lastName: string
  department: string
  role: UserRole
  timezone: string
}

// Error types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}