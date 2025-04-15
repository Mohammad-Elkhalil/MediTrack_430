
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, Bell, Plus, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Appointment, MedicalRecord } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentRecords, setRecentRecords] = useState<MedicalRecord[]>([]);
  const [waitlistPosition, setWaitlistPosition] = useState({ position: 3, estimatedWaitTime: "5 days" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This would be API calls in a real app
    // For demo, we'll set mock data after a delay to simulate loading
    const timer = setTimeout(() => {
      setUpcomingAppointments([
        {
          id: "a101",
          patientId: user?.id || "",
          patientName: user?.name || "",
          doctorId: "d123",
          doctorName: "Dr. Sarah Johnson",
          date: "2025-04-15",
          time: "14:30",
          status: "scheduled"
        },
        {
          id: "a102",
          patientId: user?.id || "",
          patientName: user?.name || "",
          doctorId: "d456",
          doctorName: "Dr. Michael Chen",
          date: "2025-04-22",
          time: "10:15",
          status: "scheduled"
        }
      ]);

      setRecentRecords([
        {
          id: "r101",
          patientId: user?.id || "",
          doctorId: "d123",
          doctorName: "Dr. Sarah Johnson",
          date: "2025-03-20",
          diagnosis: "Mild hypertension",
          notes: "Blood pressure slightly elevated. Recommend dietary changes and follow-up in 1 month.",
          prescriptions: ["Lisinopril 10mg", "Hydrochlorothiazide 25mg"]
        },
        {
          id: "r102",
          patientId: user?.id || "",
          doctorId: "d456",
          doctorName: "Dr. Michael Chen",
          date: "2025-02-15",
          diagnosis: "Seasonal allergies",
          notes: "Experiencing nasal congestion and sneezing. Recommended over-the-counter antihistamine.",
          prescriptions: ["Cetirizine 10mg"]
        }
      ]);

      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col gap-4">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-60 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user?.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
                <Calendar className="h-5 w-5 text-meditrack-500" />
              </div>
              <CardDescription>Your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 2).map((appointment) => (
                    <div key={appointment.id} className="flex items-start space-x-4 py-2">
                      <div className="bg-meditrack-100 dark:bg-meditrack-900 rounded-md p-3">
                        <Calendar className="h-4 w-4 text-meditrack-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{appointment.doctorName}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(appointment.date)} at {appointment.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500 mb-4">No upcoming appointments</p>
                  <Button size="sm" asChild>
                    <Link to="/book-appointment">Book Now</Link>
                  </Button>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/patient-appointments" className="flex items-center justify-center gap-2">
                    View all appointments
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Medical Records</CardTitle>
                <FileText className="h-5 w-5 text-meditrack-500" />
              </div>
              <CardDescription>Your recent medical records</CardDescription>
            </CardHeader>
            <CardContent>
              {recentRecords.length > 0 ? (
                <div className="space-y-4">
                  {recentRecords.slice(0, 2).map((record) => (
                    <div key={record.id} className="flex items-start space-x-4 py-2">
                      <div className="bg-meditrack-100 dark:bg-meditrack-900 rounded-md p-3">
                        <FileText className="h-4 w-4 text-meditrack-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{record.diagnosis}</p>
                          <Badge variant="outline" className="ml-2">{formatDate(record.date)}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{record.doctorName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No medical records found</p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/patient-records" className="flex items-center justify-center gap-2">
                    View all records
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Waitlist Status</CardTitle>
                <Clock className="h-5 w-5 text-meditrack-500" />
              </div>
              <CardDescription>Your current position on waitlists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Dr. Williams - Dermatologist</span>
                  <Badge>{waitlistPosition.position} in queue</Badge>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-meditrack-500 h-full" 
                    style={{ width: '80%' }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Est. wait time: {waitlistPosition.estimatedWaitTime}
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link to="/suggested-doctors">View Suggested Alternatives</Link>
                </Button>
                <Button size="sm" variant="ghost" className="w-full" asChild>
                  <Link to="/waitlist" className="flex items-center justify-center gap-2">
                    View all waitlists
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <Plus className="h-5 w-5 text-meditrack-500" />
              </div>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/book-appointment" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Book New Appointment
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/upload-records" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Upload Medical Records
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/virtual-consultation" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Request Virtual Consultation
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Notifications</CardTitle>
                <Bell className="h-5 w-5 text-meditrack-500" />
              </div>
              <CardDescription>Your recent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-meditrack-100 dark:bg-meditrack-900 rounded-md p-3">
                    <Calendar className="h-4 w-4 text-meditrack-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Appointment reminder:</span> You have an appointment with Dr. Sarah Johnson tomorrow at 2:30 PM
                    </p>
                    <p className="text-xs text-gray-500">Today, 9:42 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-meditrack-100 dark:bg-meditrack-900 rounded-md p-3">
                    <Clock className="h-4 w-4 text-meditrack-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Waitlist update:</span> A slot opened up for Dr. Williams on April 15
                    </p>
                    <p className="text-xs text-gray-500">Yesterday, 3:15 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/patient-notifications" className="flex items-center justify-center gap-2">
                    View all notifications
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Health Summary</CardTitle>
                <FileText className="h-5 w-5 text-meditrack-500" />
              </div>
              <CardDescription>Your health at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last checkup</span>
                    <span className="text-sm font-medium">March 20, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Blood pressure</span>
                    <span className="text-sm font-medium">120/80 mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Heart rate</span>
                    <span className="text-sm font-medium">72 bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Weight</span>
                    <span className="text-sm font-medium">155 lbs</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/health-summary" className="flex items-center justify-center gap-2">
                    View full health profile
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
