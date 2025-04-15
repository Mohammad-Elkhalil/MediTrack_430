import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, FileText, Pill } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { appointmentService } from '@/services/appointmentService';
import { Appointment, Doctor } from '@/types';
import { format } from 'date-fns';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Record<string, Doctor>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUpcomingAppointments();
      fetchDoctors();
    }
  }, [user]);

  const fetchDoctors = async () => {
    try {
      const doctorsList = await appointmentService.getAvailableDoctors();
      const doctorsMap = doctorsList.reduce((acc, doctor) => {
        acc[doctor.id] = doctor;
        return acc;
      }, {} as Record<string, Doctor>);
      setDoctors(doctorsMap);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const appointments = await appointmentService.getPatientAppointments(user?.id || '');
      setUpcomingAppointments(appointments.filter((apt: Appointment) => new Date(apt.date) >= new Date()));
    } catch (err) {
      setError('Failed to load appointments');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your appointments. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDoctorName = (doctorId: string) => {
    return doctors[doctorId]?.name || 'Unknown Doctor';
  };

  const handleViewRecords = () => {
    toast({
      title: "Coming Soon",
      description: "Medical records feature will be available soon.",
    });
  };

  const handleRefillPrescription = () => {
    toast({
      title: "Coming Soon",
      description: "Prescription refill feature will be available soon.",
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
          <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h2>
          <p className="text-gray-600 mt-2">Here's an overview of your health information</p>
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
              <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Your scheduled appointments</CardDescription>
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
                <Button variant="outline" className="mt-2" onClick={fetchUpcomingAppointments}>
                  Try Again
                </Button>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 2).map((appointment) => (
                  <div key={appointment.id} className="flex items-start space-x-4 py-2">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{getDoctorName(appointment.doctorId)}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(appointment.date), 'PPP')} at {appointment.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500 mb-4">No upcoming appointments</p>
                <Button size="sm" asChild>
                  <Link to="book-appointment">Book Now</Link>
                </Button>
              </div>
            )}
            <div className="mt-4 space-y-2">
              <Button className="w-full" asChild>
                <Link to="book-appointment">Schedule New Appointment</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="appointments">View All Appointments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Medical Records Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Medical Records</CardTitle>
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <CardDescription>Your health history and records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 py-2">
                <div className="bg-green-100 dark:bg-green-900 rounded-md p-3">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">Latest Blood Test</p>
                  <p className="text-sm text-gray-500">Results Available</p>
                  <p className="text-xs text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleViewRecords}>
              View All Records
            </Button>
          </CardContent>
        </Card>

        {/* Prescriptions Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Current Prescriptions</CardTitle>
              <Pill className="h-5 w-5 text-purple-500" />
            </div>
            <CardDescription>Your active medications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 py-2">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                  <Pill className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">Amoxicillin</p>
                  <p className="text-sm text-gray-500">500mg - 3 times daily</p>
                  <p className="text-xs text-gray-400">5 days remaining</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleRefillPrescription}>
              Refill Prescription
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

export default PatientDashboard; 