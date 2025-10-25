import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { User, UserRole } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User) =>
        set(
          {
            user,
            isAuthenticated: true,
            error: null,
          },
          false,
          'setUser'
        ),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }, false, 'setLoading'),

      setError: (error: string | null) =>
        set({ error, isLoading: false }, false, 'setError'),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null }, false, 'login/start')
        
        try {
          // TODO: Replace with actual API call
          const mockUser: User = {
            id: '1',
            email,
            firstName: 'John',
            lastName: 'Doe',
            department: 'Engineering',
            role: UserRole.USER,
            timezone: 'UTC',
            preferences: {
              notifications: {
                email: true,
                sms: false,
                push: true,
                inApp: true,
                reminderTimes: [15, 5],
              },
              calendar: {
                defaultView: 'month' as any,
                workingHours: { start: '09:00', end: '17:00' },
                workingDays: [1, 2, 3, 4, 5],
                showWeekends: true,
              },
              language: 'en',
              theme: 'system',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
          
          get().setUser(mockUser)
        } catch (error) {
          get().setError(error instanceof Error ? error.message : 'Login failed')
        }
      },

      logout: () =>
        set(
          {
            user: null,
            isAuthenticated: false,
            error: null,
          },
          false,
          'logout'
        ),

      clearError: () => set({ error: null }, false, 'clearError'),
    }),
    {
      name: 'auth-store',
    }
  )
)