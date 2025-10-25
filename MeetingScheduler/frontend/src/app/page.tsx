import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <MainLayout>
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Enterprise Ready
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Modern Meeting Scheduler
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your team's meeting management with intelligent scheduling,
            room booking, and seamless calendar integration.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started Free</Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📅 Calendar Management</CardTitle>
                <CardDescription>
                  Intuitive calendar interface with multiple views
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Monthly, weekly, and daily views</li>
                  <li>• Drag & drop rescheduling</li>
                  <li>• External calendar sync</li>
                  <li>• Timezone support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🏢 Room Booking</CardTitle>
                <CardDescription>
                  Real-time room availability and resource management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time availability</li>
                  <li>• Equipment booking</li>
                  <li>• Capacity planning</li>
                  <li>• Virtual meeting rooms</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>👥 Team Collaboration</CardTitle>
                <CardDescription>
                  Seamless participant management and invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Smart participant search</li>
                  <li>• Availability checking</li>
                  <li>• RSVP tracking</li>
                  <li>• External guests</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔔 Smart Notifications</CardTitle>
                <CardDescription>
                  Multi-channel notification system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Email & SMS alerts</li>
                  <li>• Push notifications</li>
                  <li>• Customizable reminders</li>
                  <li>• Real-time updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Analytics & Reports</CardTitle>
                <CardDescription>
                  Insightful meeting analytics and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Meeting statistics</li>
                  <li>• Resource utilization</li>
                  <li>• Team engagement metrics</li>
                  <li>• Custom reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔐 Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-grade security and compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• SSO integration</li>
                  <li>• Role-based access</li>
                  <li>• Data encryption</li>
                  <li>• GDPR compliant</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <Badge variant="success" className="mb-4">
            Phase 1 Complete • 62.5% Progress
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Development in Progress</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're actively building out the complete feature set. The foundation is ready,
            and we're now implementing the core components and functionality.
          </p>
          <Button variant="outline" size="lg">
            View Progress Tracker
          </Button>
        </div>
      </section>
    </MainLayout>
  )
}