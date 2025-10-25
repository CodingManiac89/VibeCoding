import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventDetailsModal } from '../event-details-modal'
import { CreateMeetingModal } from '../create-meeting-modal'
import { EditMeetingModal } from '../edit-meeting-modal'

describe('EventDetailsModal', () => {
  const mockEvent = {
    id: '1',
    title: 'Test Meeting',
    description: 'Test Description',
    startTime: '2025-10-25T09:00:00',
    endTime: '2025-10-25T10:00:00',
    room: 'Conference Room A',
    status: 'scheduled' as const,
    participants: 5,
    organizer: 'John Doe',
  }

  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders event details correctly', () => {
    render(
      <EventDetailsModal
        event={mockEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Test Meeting')).toBeDefined()
    expect(screen.getByText('Test Description')).toBeDefined()
    expect(screen.getByText('Conference Room A')).toBeDefined()
  })

  it('displays formatted date and time', () => {
    render(
      <EventDetailsModal
        event={mockEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    // Check if dates are formatted (exact format may vary)
    expect(screen.getByText(/Oct/i)).toBeDefined()
  })

  it('shows status badge', () => {
    render(
      <EventDetailsModal
        event={mockEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('SCHEDULED')).toBeDefined()
  })

  it('displays participant count', () => {
    render(
      <EventDetailsModal
        event={mockEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText(/5 participants/i)).toBeDefined()
  })

  it('shows Edit and Delete buttons', () => {
    render(
      <EventDetailsModal
        event={mockEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByRole('button', { name: /edit/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /cancel meeting/i })).toBeDefined()
  })

  it('calls onEdit when Edit button is clicked', () => {
    render(
      <EventDetailsModal
        event={mockEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockEvent)
  })

  it('calls onDelete when Delete button is clicked', () => {
    render(
      <EventDetailsModal
        event={mockEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /cancel meeting/i })
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockEvent.id)
  })

  it('renders null when event is null', () => {
    const { container } = render(
      <EventDetailsModal
        event={null}
        open={true}
        onOpenChange={mockOnOpenChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(container.firstChild).toBeNull()
  })
})

describe('CreateMeetingModal', () => {
  const mockOnCreateMeeting = jest.fn()
  const mockOnOpenChange = jest.fn()
  const selectedDate = new Date('2025-10-25T10:00:00')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders create meeting form', () => {
    render(
      <CreateMeetingModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreateMeeting={mockOnCreateMeeting}
      />
    )

    expect(screen.getByText('Create New Meeting')).toBeDefined()
    expect(screen.getByLabelText(/meeting title/i)).toBeDefined()
    expect(screen.getByLabelText(/description/i)).toBeDefined()
  })

  it('displays room selection dropdown', () => {
    render(
      <CreateMeetingModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreateMeeting={mockOnCreateMeeting}
      />
    )

    expect(screen.getByLabelText(/room/i)).toBeDefined()
  })

  it('shows date and time inputs', () => {
    render(
      <CreateMeetingModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreateMeeting={mockOnCreateMeeting}
      />
    )

    expect(screen.getByLabelText(/start time/i)).toBeDefined()
    expect(screen.getByLabelText(/end time/i)).toBeDefined()
  })

  it('displays required field indicators', () => {
    render(
      <CreateMeetingModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreateMeeting={mockOnCreateMeeting}
      />
    )

    const requiredIndicators = screen.getAllByText('*')
    expect(requiredIndicators.length).toBeGreaterThan(0)
  })

  it('shows Cancel and Create Meeting buttons', () => {
    render(
      <CreateMeetingModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreateMeeting={mockOnCreateMeeting}
      />
    )

    expect(screen.getByRole('button', { name: /cancel/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /create meeting/i })).toBeDefined()
  })

  it('pre-fills date when selectedDate is provided', () => {
    render(
      <CreateMeetingModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreateMeeting={mockOnCreateMeeting}
        selectedDate={selectedDate}
      />
    )

    const startTimeInput = screen.getByLabelText(/start time/i) as HTMLInputElement
    expect(startTimeInput.value).toBeTruthy()
  })

  it('calls onOpenChange when Cancel button is clicked', () => {
    render(
      <CreateMeetingModal
        open={true}
        onOpenChange={mockOnOpenChange}
        onCreateMeeting={mockOnCreateMeeting}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })
})

describe('EditMeetingModal', () => {
  const mockEvent = {
    id: '1',
    title: 'Test Meeting',
    description: 'Test Description',
    startTime: '2025-10-25T09:00:00',
    endTime: '2025-10-25T10:00:00',
    room: 'Conference Room A',
    status: 'scheduled' as const,
    participants: 5,
    organizer: 'John Doe',
  }

  const mockOnUpdateMeeting = jest.fn()
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders edit meeting form', () => {
    render(
      <EditMeetingModal
        event={mockEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateMeeting={mockOnUpdateMeeting}
      />
    )

    expect(screen.getByText('Edit Meeting')).toBeDefined()
    expect(screen.getByText('Update the meeting details below.')).toBeDefined()
  })

  it('pre-fills form with event data', () => {
    render(
      <EditMeetingModal
        event={mockEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateMeeting={mockOnUpdateMeeting}
      />
    )

    expect(screen.getByDisplayValue('Test Meeting')).toBeDefined()
    expect(screen.getByDisplayValue('Test Description')).toBeDefined()
  })

  it('shows Save Changes button instead of Create', () => {
    render(
      <EditMeetingModal
        event={mockEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateMeeting={mockOnUpdateMeeting}
      />
    )

    expect(screen.getByRole('button', { name: /save changes/i })).toBeDefined()
  })

  it('updates form values on event change', () => {
    const { rerender } = render(
      <EditMeetingModal
        event={mockEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateMeeting={mockOnUpdateMeeting}
      />
    )

    const updatedEvent = { ...mockEvent, title: 'Updated Meeting' }
    
    rerender(
      <EditMeetingModal
        event={updatedEvent}
        open={true}
        onOpenChange={mockOnOpenChange}
        onUpdateMeeting={mockOnUpdateMeeting}
      />
    )

    expect(screen.getByDisplayValue('Updated Meeting')).toBeDefined()
  })
})
