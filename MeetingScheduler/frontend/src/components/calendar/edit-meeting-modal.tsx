'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EditMeetingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateMeeting: (meeting: {
    title: string
    description: string
    startTime: string
    endTime: string
    room: string
  }) => void
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
  }
}

export function EditMeetingModal({
  open,
  onOpenChange,
  onUpdateMeeting,
  event,
}: EditMeetingModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    room: '',
  })

  const rooms = [
    'Conference Room A',
    'Conference Room B',
    'Board Room',
    'Meeting Room 1',
    'Meeting Room 2',
    'Executive Suite',
  ]

  // Initialize form with event data when modal opens
  useEffect(() => {
    if (open && event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        startTime: new Date(event.startTime).toISOString().slice(0, 16),
        endTime: new Date(event.endTime).toISOString().slice(0, 16),
        room: event.room,
      })
    }
  }, [open, event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.startTime || !formData.endTime || !formData.room) {
      alert('Please fill in all required fields')
      return
    }

    // Validate end time is after start time
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      alert('End time must be after start time')
      return
    }

    onUpdateMeeting(formData)
    onOpenChange(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Meeting</DialogTitle>
          <DialogDescription>
            Update the meeting details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Meeting Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                placeholder="e.g., Team Standup, Client Review"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Meeting agenda and details..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startTime">
                  Start Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-endTime">
                  End Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Room Selection */}
            <div className="space-y-2">
              <Label htmlFor="edit-room">
                Room <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.room} onValueChange={(value) => handleChange('room', value)}>
                <SelectTrigger id="edit-room">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Participants (Disabled for now) */}
            <div className="space-y-2">
              <Label htmlFor="edit-participants">Participants</Label>
              <Input
                id="edit-participants"
                placeholder="Add participants (coming soon)"
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                Participant management will be available in a future update
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
