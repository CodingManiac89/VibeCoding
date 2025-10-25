'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Search, Filter, Users, MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')
  const [capacityFilter, setCapacityFilter] = useState<string>('all')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  
  const [rooms] = useState([
    {
      id: '1',
      name: 'Conference Room A',
      capacity: 10,
      location: 'Floor 2, East Wing',
      equipment: ['Projector', 'Whiteboard', 'Video Conference'],
      available: true,
      nextBooking: '2:00 PM - 3:00 PM'
    },
    {
      id: '2',
      name: 'Conference Room B',
      capacity: 8,
      location: 'Floor 2, West Wing',
      equipment: ['TV Screen', 'Whiteboard'],
      available: true,
      nextBooking: '4:00 PM - 5:00 PM'
    },
    {
      id: '3',
      name: 'Main Hall',
      capacity: 50,
      location: 'Floor 1, Central',
      equipment: ['Stage', 'Sound System', 'Projector', 'Video Conference'],
      available: false,
      nextBooking: 'Available at 5:00 PM'
    },
    {
      id: '4',
      name: 'Small Meeting Room',
      capacity: 4,
      location: 'Floor 3, North',
      equipment: ['TV Screen'],
      available: true,
      nextBooking: 'No upcoming bookings'
    },
    {
      id: '5',
      name: 'Executive Boardroom',
      capacity: 15,
      location: 'Floor 4, Central',
      equipment: ['Video Conference', 'Whiteboard', 'Premium Audio'],
      available: true,
      nextBooking: 'Tomorrow 9:00 AM'
    },
    {
      id: '6',
      name: 'Training Room',
      capacity: 25,
      location: 'Floor 1, South',
      equipment: ['Projector', 'Multiple Screens', 'Sound System'],
      available: false,
      nextBooking: 'Available tomorrow'
    }
  ])

  // Filter and search logic
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = searchQuery === '' || 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.equipment.some(eq => eq.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesAvailability = 
        availabilityFilter === 'all' || 
        (availabilityFilter === 'available' && room.available) ||
        (availabilityFilter === 'busy' && !room.available)
      
      const matchesCapacity = 
        capacityFilter === 'all' ||
        (capacityFilter === 'small' && room.capacity <= 6) ||
        (capacityFilter === 'medium' && room.capacity > 6 && room.capacity <= 15) ||
        (capacityFilter === 'large' && room.capacity > 15)
      
      return matchesSearch && matchesAvailability && matchesCapacity
    })
  }, [rooms, searchQuery, availabilityFilter, capacityFilter])

  const handleBookRoom = (room: any) => {
    setSelectedRoom(room)
    setShowBookingModal(true)
  }

  const handleConfirmBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    toast.success('Room booked successfully', {
      description: `${selectedRoom?.name} reserved for ${formData.get('title')}`
    })
    setShowBookingModal(false)
    setSelectedRoom(null)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meeting Rooms</h1>
            <p className="text-muted-foreground">
              Browse and book available meeting spaces
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms by name, location, or equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rooms</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={capacityFilter} onValueChange={setCapacityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="small">Small (≤6)</SelectItem>
                    <SelectItem value="medium">Medium (7-15)</SelectItem>
                    <SelectItem value="large">Large (16+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(searchQuery || availabilityFilter !== 'all' || capacityFilter !== 'all') && (
              <div className="mt-3 text-sm text-muted-foreground">
                Showing {filteredRooms.length} of {rooms.length} rooms
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Now</p>
                    <p className="text-3xl font-bold text-green-600">
                      {filteredRooms.filter(r => r.available).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Showing Rooms</p>
                    <p className="text-3xl font-bold">{filteredRooms.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Rooms</p>
                    <p className="text-3xl font-bold">{rooms.length}</p>
                  </div>
                </div>
                <Badge variant="success" className="text-base px-4 py-2">
                  {rooms.length > 0 ? Math.round((rooms.filter(r => r.available).length / rooms.length) * 100) : 0}% Available
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {filteredRooms.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <p className="text-xl font-medium mb-2">No rooms found</p>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setAvailabilityFilter('all'); setCapacityFilter('all') }}>
                Clear Filters
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{room.name}</CardTitle>
                    <CardDescription>{room.location}</CardDescription>
                  </div>
                  {room.available ? (
                    <Badge variant="success">Available</Badge>
                  ) : (
                    <Badge variant="destructive">Occupied</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Capacity</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>👥</span>
                      <span>{room.capacity} people</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Equipment</p>
                    <div className="flex flex-wrap gap-2">
                      {room.equipment.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Next Booking</p>
                    <p className="text-sm text-muted-foreground">{room.nextBooking}</p>
                  </div>

                  <Button 
                    className="w-full" 
                    disabled={!room.available}
                    variant={room.available ? "default" : "outline"}
                    onClick={() => room.available && handleBookRoom(room)}
                  >
                    {room.available ? 'Book Room' : 'View Schedule'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedRoom && (
          <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Book {selectedRoom.name}</DialogTitle>
                <DialogDescription>
                  Reserve this room for your meeting
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Team Meeting"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{selectedRoom.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium">{selectedRoom.capacity} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equipment:</span>
                      <span className="font-medium">{selectedRoom.equipment.length} items</span>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowBookingModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Confirm Booking</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  )
}