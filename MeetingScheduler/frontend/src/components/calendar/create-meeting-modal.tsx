'use client'

import { useState } from 'react'
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

interface CreateMeetingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateMeeting: (meeting: {
    title: string
    description: string
    startTime: string
    endTime: string
    room: string
  }) => void
  selectedDate?: Date
}

export function CreateMeetingModal({
  open,
  onOpenChange,
  onCreateMeeting,
  selectedDate,
}: CreateMeetingModalProps) {
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

  // Pre-fill date if selected
  const getDefaultDateTime = (addHours = 0) => {
    const date = selectedDate || new Date()
    const hours = date.getHours() + addHours
    date.setHours(hours, 0, 0, 0)
    return date.toISOString().slice(0, 16)
  }

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

    onCreateMeeting(formData)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      room: '',
    })
    
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
          <DialogTitle>Create New Meeting</DialogTitle>
          <DialogDescription>
            Schedule a new meeting. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Meeting Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Team Standup, Client Review"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Meeting agenda and details..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">
                  Start Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime || getDefaultDateTime()}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">
                  End Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime || getDefaultDateTime(1)}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Room Selection */}
            <div className="space-y-2">
              <Label htmlFor="room">
                Room <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.room}
                onValueChange={(value) => handleChange('room', value)}
              >
                <SelectTrigger>
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

            {/* Participants (Future feature) */}
            <div className="space-y-2">
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                placeholder="Add participants (Coming soon)"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Participant management will be available in a future update.
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
            <Button type="submit">Create Meeting</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
