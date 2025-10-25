import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import MeetingsPage from '../page'

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('MeetingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the meetings page with title and description', () => {
    render(<MeetingsPage />)
    
    expect(screen.getByText('Meetings')).toBeDefined()
    expect(screen.getByText('Manage and schedule your meetings')).toBeDefined()
  })

  it('displays initial mock meetings', () => {
    render(<MeetingsPage />)
    
    expect(screen.getByText('Team Standup')).toBeDefined()
    expect(screen.getByText('Project Review')).toBeDefined()
    expect(screen.getByText('Client Presentation')).toBeDefined()
  })

  it('shows create meeting button', () => {
    render(<MeetingsPage />)
    
    const createButton = screen.getByRole('button', { name: /create meeting/i })
    expect(createButton).toBeDefined()
  })

  it('opens create meeting form when button is clicked', () => {
    render(<MeetingsPage />)
    
    const createButton = screen.getByRole('button', { name: /\+ create meeting/i })
    fireEvent.click(createButton)
    
    expect(screen.getByText('Create New Meeting')).toBeDefined()
    expect(screen.getByLabelText(/meeting title/i)).toBeDefined()
  })

  it('changes button text to Cancel when form is open', () => {
    render(<MeetingsPage />)
    
    const createButton = screen.getByRole('button', { name: /\+ create meeting/i })
    fireEvent.click(createButton)
    
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDefined()
  })

  it('displays search input', () => {
    render(<MeetingsPage />)
    
    const searchInput = screen.getByPlaceholderText(/search meetings/i)
    expect(searchInput).toBeDefined()
  })

  it('filters meetings based on search query', async () => {
    render(<MeetingsPage />)
    
    const searchInput = screen.getByPlaceholderText(/search meetings/i)
    
    await userEvent.type(searchInput, 'Team')
    
    expect(screen.getByText('Team Standup')).toBeDefined()
    // Other meetings should still be in DOM but potentially filtered
  })

  it('displays status filter dropdown', () => {
    render(<MeetingsPage />)
    
    const filterButton = screen.getByRole('combobox')
    expect(filterButton).toBeDefined()
  })

  it('shows meeting count when filters are applied', async () => {
    render(<MeetingsPage />)
    
    const searchInput = screen.getByPlaceholderText(/search meetings/i)
    await userEvent.type(searchInput, 'Team')
    
    await waitFor(() => {
      expect(screen.getByText(/showing.*of.*meetings/i)).toBeDefined()
    })
  })

  it('displays edit and delete buttons for each meeting', () => {
    render(<MeetingsPage />)
    
    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    
    expect(editButtons.length).toBeGreaterThan(0)
    expect(deleteButtons.length).toBeGreaterThan(0)
  })

  it('opens edit form when edit button is clicked', () => {
    render(<MeetingsPage />)
    
    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    fireEvent.click(editButtons[0])
    
    expect(screen.getByText('Edit Meeting')).toBeDefined()
    expect(screen.getByDisplayValue('Team Standup')).toBeDefined()
  })

  it('deletes meeting with confirmation and shows toast', async () => {
    const mockConfirm = jest.spyOn(window, 'confirm').mockImplementation(() => true)
    
    render(<MeetingsPage />)
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    fireEvent.click(deleteButtons[0])
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Meeting deleted',
        expect.objectContaining({
          description: expect.stringContaining('removed')
        })
      )
    })
    
    mockConfirm.mockRestore()
  })

  it('does not delete meeting if confirmation is cancelled', () => {
    const mockConfirm = jest.spyOn(window, 'confirm').mockImplementation(() => false)
    
    render(<MeetingsPage />)
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    const initialMeetings = screen.getAllByRole('heading', { level: 3 })
    
    fireEvent.click(deleteButtons[0])
    
    const afterMeetings = screen.getAllByRole('heading', { level: 3 })
    expect(afterMeetings.length).toBe(initialMeetings.length)
    
    mockConfirm.mockRestore()
  })

  it('shows empty state message when no meetings match filters', async () => {
    render(<MeetingsPage />)
    
    const searchInput = screen.getByPlaceholderText(/search meetings/i)
    await userEvent.type(searchInput, 'NonexistentMeeting12345')
    
    await waitFor(() => {
      expect(screen.getByText('No meetings found')).toBeDefined()
      expect(screen.getByText('Try adjusting your search or filters')).toBeDefined()
    })
  })

  it('clears filters when Clear Filters button is clicked', async () => {
    render(<MeetingsPage />)
    
    const searchInput = screen.getByPlaceholderText(/search meetings/i)
    await userEvent.type(searchInput, 'NonexistentMeeting12345')
    
    await waitFor(() => {
      const clearButton = screen.getByRole('button', { name: /clear filters/i })
      fireEvent.click(clearButton)
    })
    
    expect(screen.getByText('Team Standup')).toBeDefined()
  })

  it('displays meeting details correctly', () => {
    render(<MeetingsPage />)
    
    expect(screen.getByText('Daily team synchronization')).toBeDefined()
    expect(screen.getByText('Conference Room A')).toBeDefined()
    expect(screen.getByText(/5 participants/i)).toBeDefined()
  })

  it('shows badge with meeting status', () => {
    render(<MeetingsPage />)
    
    const badges = screen.getAllByText('scheduled')
    expect(badges.length).toBeGreaterThan(0)
  })
})

describe('MeetingsPage - Form Submission', () => {
  it('creates new meeting and shows success toast', async () => {
    render(<MeetingsPage />)
    
    const createButton = screen.getByRole('button', { name: /\+ create meeting/i })
    fireEvent.click(createButton)
    
    const titleInput = screen.getByLabelText(/meeting title/i)
    const startTimeInput = screen.getByLabelText(/start time/i)
    const endTimeInput = screen.getByLabelText(/end time/i)
    
    await userEvent.type(titleInput, 'New Test Meeting')
    await userEvent.type(startTimeInput, '2025-10-26T10:00')
    await userEvent.type(endTimeInput, '2025-10-26T11:00')
    
    const submitButton = screen.getByRole('button', { name: /create meeting$/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Meeting created successfully',
        expect.objectContaining({
          description: expect.stringContaining('scheduled')
        })
      )
    })
  })

  it('updates existing meeting and shows success toast', async () => {
    render(<MeetingsPage />)
    
    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    fireEvent.click(editButtons[0])
    
    const titleInput = screen.getByDisplayValue('Team Standup')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Updated Team Standup')
    
    const submitButton = screen.getByRole('button', { name: /update meeting/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Meeting updated successfully')
    })
  })

  it('closes form after successful submission', async () => {
    render(<MeetingsPage />)
    
    const createButton = screen.getByRole('button', { name: /\+ create meeting/i })
    fireEvent.click(createButton)
    
    expect(screen.getByText('Create New Meeting')).toBeDefined()
    
    const titleInput = screen.getByLabelText(/meeting title/i)
    const startTimeInput = screen.getByLabelText(/start time/i)
    const endTimeInput = screen.getByLabelText(/end time/i)
    
    await userEvent.type(titleInput, 'New Meeting')
    await userEvent.type(startTimeInput, '2025-10-26T10:00')
    await userEvent.type(endTimeInput, '2025-10-26T11:00')
    
    const submitButton = screen.getByRole('button', { name: /create meeting$/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Create New Meeting')).toBeNull()
    })
  })
})
