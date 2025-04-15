import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users, Clock, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { doctorAppointmentService } from '@/services/doctorAppointmentService';
import { format } from 'date-fns';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTodayAppointments();
    }
  }, [user]);

  const fetchTodayAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const appointments = await doctorAppointmentService.getDoctorAppointments(
        user?.id || '',
        format(new Date(), 'yyyy-MM-dd')
      );
      setTodayAppointments(appointments);
    } catch (err) {
      setError('Failed to load appointments');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load today's appointments. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRecords = () => {
    toast({
      title: "Coming Soon",
      description: "Patient records feature will be available soon.",
    });
  };

  const handleUpdateSchedule = () => {
    toast({
      title: "Coming Soon",
      description: "Schedule management feature will be available soon.",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your dashboard</h2>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, Dr. {user.name}</h2>
          <p className="text-gray-600 mt-2">Here's your daily overview</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/profile')}>
            View Profile
          </Button>
          <Button variant="outline" onClick={() => navigate('/settings')}>
            Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Appointments Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Today's Appointments</CardTitle>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">
                {error}
                <Button variant="outline" className="mt-2" onClick={fetchTodayAppointments}>
                  Try Again
                </Button>
              </div>
            ) : todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-start space-x-4 py-2">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(appointment.date), 'PPP')} at {appointment.time}
                      </p>
                      <p className="text-xs text-gray-400">{appointment.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500 mb-4">No appointments scheduled for today</p>
                <Button size="sm" onClick={handleUpdateSchedule}>
                  Update Schedule
                </Button>
              </div>
            )}
            <Button className="w-full mt-4" asChild>
              <Link to="appointments">Manage All Appointments</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Patient Records Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Patient Records</CardTitle>
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <CardDescription>Access patient health records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 py-2">
                <div className="bg-green-100 dark:bg-green-900 rounded-md p-3">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">Recent Updates</p>
                  <p className="text-sm text-gray-500">3 new records added</p>
                  <p className="text-xs text-gray-400">Today</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleViewRecords}>
              View All Records
            </Button>
          </CardContent>
        </Card>

        {/* Schedule Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Schedule</CardTitle>
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <CardDescription>Manage your availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 py-2">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">Available Slots</p>
                  <p className="text-sm text-gray-500">5 slots available</p>
                  <p className="text-xs text-gray-400">Next week</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleUpdateSchedule}>
              Update Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Render child routes */}
      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorDashboard; 