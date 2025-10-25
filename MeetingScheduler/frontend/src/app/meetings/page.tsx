'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Edit, Trash2, Search, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function MeetingsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [meetings, setMeetings] = useState([
    {
      id: '1',
      title: 'Team Standup',
      description: 'Daily team synchronization',
      startTime: '2025-10-25T09:00:00',
      endTime: '2025-10-25T09:30:00',
      participants: 5,
      room: 'Conference Room A',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Project Review',
      description: 'Q4 project progress review',
      startTime: '2025-10-25T14:00:00',
      endTime: '2025-10-25T15:00:00',
      participants: 8,
      room: 'Conference Room B',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Client Presentation',
      description: 'Product demo for new client',
      startTime: '2025-10-26T10:00:00',
      endTime: '2025-10-26T11:00:00',
      participants: 12,
      room: 'Main Hall',
      status: 'scheduled'
    }
  ])

  const handleCreateMeeting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    if (editingMeeting) {
      // Update existing meeting
      setMeetings(meetings.map(m => 
        m.id === editingMeeting ? {
          ...m,
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          startTime: formData.get('startTime') as string,
          endTime: formData.get('endTime') as string,
          room: formData.get('room') as string,
        } : m
      ))
      toast.success('Meeting updated successfully')
      setEditingMeeting(null)
    } else {
      // Create new meeting
      const newMeeting = {
        id: Date.now().toString(),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        startTime: formData.get('startTime') as string,
        endTime: formData.get('endTime') as string,
        participants: 0,
        room: formData.get('room') as string,
        status: 'scheduled'
      }
      setMeetings([newMeeting, ...meetings])
      toast.success('Meeting created successfully', {
        description: `${newMeeting.title} has been scheduled`
      })
    }
    
    setShowForm(false)
    e.currentTarget.reset()
  }

  const handleEditMeeting = (meeting: any) => {
    setEditingMeeting(meeting.id)
    setShowForm(true)
    // Form will be pre-filled via defaultValue
  }

  const handleDeleteMeeting = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setMeetings(meetings.filter(m => m.id !== id))
      toast.success('Meeting deleted', {
        description: `${title} has been removed`
      })
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingMeeting(null)
  }

  // Filter and search logic
  const filteredMeetings = useMemo(() => {
    return meetings.filter(meeting => {
      const matchesSearch = searchQuery === '' || 
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.room?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [meetings, searchQuery, statusFilter])

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meetings</h1>
            <p className="text-muted-foreground">
              Manage and schedule your meetings
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Meeting'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingMeeting ? 'Edit Meeting' : 'Create New Meeting'}</CardTitle>
              <CardDescription>
                {editingMeeting ? 'Update meeting details' : 'Schedule a new meeting with your team'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMeeting} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Meeting Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Team Standup"
                      defaultValue={editingMeeting ? meetings.find(m => m.id === editingMeeting)?.title : ''}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      name="room"
                      placeholder="e.g., Conference Room A"
                      defaultValue={editingMeeting ? meetings.find(m => m.id === editingMeeting)?.room : ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Meeting agenda and notes..."
                    defaultValue={editingMeeting ? meetings.find(m => m.id === editingMeeting)?.description : ''}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      defaultValue={editingMeeting ? new Date(meetings.find(m => m.id === editingMeeting)?.startTime || '').toISOString().slice(0, 16) : ''}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      defaultValue={editingMeeting ? new Date(meetings.find(m => m.id === editingMeeting)?.endTime || '').toISOString().slice(0, 16) : ''}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editingMeeting ? 'Update Meeting' : 'Create Meeting'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search meetings by title, description, or room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(searchQuery || statusFilter !== 'all') && (
              <div className="mt-3 text-sm text-muted-foreground">
                Showing {filteredMeetings.length} of {meetings.length} meetings
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {filteredMeetings.map((meeting) => (
            <Card key={meeting.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{meeting.title}</h3>
                      <Badge variant="secondary">{meeting.status}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {meeting.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{formatDateTime(meeting.startTime)} - {formatDateTime(meeting.endTime)}</span>
                      </div>
                      {meeting.room && (
                        <div className="flex items-center gap-2">
                          <span>🏢</span>
                          <span>{meeting.room}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span>👥</span>
                        <span>{meeting.participants} participants</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditMeeting(meeting)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteMeeting(meeting.id, meeting.title)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMeetings.length === 0 && meetings.length > 0 && (
          <Card className="p-12">
            <div className="text-center">
              <p className="text-xl font-medium mb-2">No meetings found</p>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all') }}>
                Clear Filters
              </Button>
            </div>
          </Card>
        )}

        {meetings.length === 0 && !showForm && (
          <Card className="p-12">
            <div className="text-center">
              <p className="text-xl font-medium mb-2">No meetings scheduled</p>
              <p className="text-muted-foreground mb-4">
                Create your first meeting to get started
              </p>
              <Button onClick={() => setShowForm(true)}>Create Meeting</Button>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}