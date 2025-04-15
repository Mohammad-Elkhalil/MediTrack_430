
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, UserIcon, Bell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Appointment, Patient } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // This would be API calls in a real app
    // For demo, we'll set mock data after a delay to simulate loading
    const timer = setTimeout(() => {
      setTodayAppointments([
        {
          id: "a101",
          patientId: "p12345",
          patientName: "Jane Doe",
          doctorId: user?.id || "",
          doctorName: user?.name || "",
          date: "2025-04-11", // Today's date
          time: "10:30",
          status: "scheduled"
        },
        {
          id: "a102",
          patientId: "p12346",
          patientName: "John Smith",
          doctorId: user?.id || "",
          doctorName: user?.name || "",
          date: "2025-04-11", // Today's date
          time: "11:45",
          status: "scheduled"
        },
        {
          id: "a103",
          patientId: "p12347",
          patientName: "Emma Johnson",
          doctorId: user?.id || "",
          doctorName: user?.name || "",
          date: "2025-04-11", // Today's date
          time: "14:15",
          status: "scheduled"
        }
      ]);

      setRecentPatients([
        {
          id: "p12345",
          email: "jane.doe@example.com",
          name: "Jane Doe",
          role: "patient",
          phone: "+1234567890"
        },
        {
          id: "p12346",
          email: "john.smith@example.com",
          name: "John Smith",
          role: "patient",
          phone: "+1234567891"
        },
        {
          id: "p12347",
          email: "emma.johnson@example.com",
          name: "Emma Johnson",
          role: "patient",
          phone: "+1234567892"
        }
      ]);

      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col gap-4">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome, Dr. {user?.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Today's Appointments</CardTitle>
                <Calendar className="h-5 w-5 text-meditrack-500" />
              </div>
              <CardDescription>Your schedule for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-start space-x-4 py-2 border-b last:border-0">
                      <div className="bg-meditrack-100 dark:bg-meditrack-900 rounded-full p-3 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-meditrack-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{appointment.patientName}</p>
                          <Badge variant="outline">{appointment.time}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Patient ID: {appointment.patientId.substring(0, 6)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/patient-details/${appointment.patientId}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500 mb-2">No appointments scheduled for today</p>
                  <Button size="sm" asChild>
                    <Link to="/doctor-appointments">View Schedule</Link>
                  </Button>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/doctor-appointments" className="flex items-center justify-center gap-2">
                    View full schedule
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Recent Patients</CardTitle>
                <UserIcon className="h-5 w-5 text-meditrack-500" />
              </div>
              <CardDescription>Patients you've seen recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.slice(0, 3).map((patient) => (
                  <div key={patient.id} className="flex items-center space-x-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-meditrack-200 dark:bg-meditrack-800 flex items-center justify-center">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-500">{patient.phone}</p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/patient-details/${patient.id}`}>
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/doctor-patients" className="flex items-center justify-center gap-2">
                    View all patients
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Operating Room Status</CardTitle>
                <Calendar className="h-5 w-5 text-meditrack-500" />
              </div>
              <CardDescription>Current OR availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>OR 1</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30">Available</Badge>
                </div>
                <div className="flex items-center justify-between px-4 py-2 bg-red-100 dark:bg-red-900/20 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>OR 2</span>
                  </div>
                  <Badge variant="outline" className="bg-red-50 dark:bg-red-900/30">In Use</Badge>
                </div>
                <div className="flex items-center justify-between px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>OR 3</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30">Available</Badge>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/operating-rooms" className="flex items-center justify-center gap-2">
                    View all operating rooms
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
                <FileText className="h-5 w-5 text-meditrack-500" />
              </div>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link to="/create-prescription">
                  <FileText className="h-4 w-4" />
                  Create Prescription
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link to="/update-patient-record">
                  <UserIcon className="h-4 w-4" />
                  Update Patient Record
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link to="/start-virtual-consultation">
                  <Bell className="h-4 w-4" />
                  Start Virtual Consultation
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link to="/schedule-surgery">
                  <Calendar className="h-4 w-4" />
                  Schedule Surgery
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 hover-scale">
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
                  <div className="space-y-1 flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Schedule update:</span> Patient John Smith cancelled their appointment for tomorrow at 2:30 PM
                    </p>
                    <p className="text-xs text-gray-500">Today, 9:42 AM</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Mark as Read
                  </Button>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-meditrack-100 dark:bg-meditrack-900 rounded-md p-3">
                    <Clock className="h-4 w-4 text-meditrack-600" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">OR availability:</span> Operating Room 1 is now available for today from 3:00 PM to 6:00 PM
                    </p>
                    <p className="text-xs text-gray-500">Yesterday, 3:15 PM</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Mark as Read
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link to="/doctor-notifications" className="flex items-center justify-center gap-2">
                    View all notifications
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

export default DoctorDashboard;
