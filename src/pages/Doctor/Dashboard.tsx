import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Appointment, Patient } from '@/types/api';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for demonstration
        const mockAppointments: Appointment[] = [
          {
            id: "a101",
            patientId: "p12345",
            patientName: "Jane Doe",
            doctorId: user?.id || "",
            doctorName: user?.name || "",
            date: new Date().toISOString().split('T')[0],
            time: "10:30",
            status: "scheduled"
          },
          {
            id: "a102",
            patientId: "p12346",
            patientName: "John Smith",
            doctorId: user?.id || "",
            doctorName: user?.name || "",
            date: new Date().toISOString().split('T')[0],
            time: "11:45",
            status: "scheduled"
          }
        ];

        const mockPatients: Patient[] = [
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
          }
        ];

        setTodayAppointments(mockAppointments);
        setRecentPatients(mockPatients);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
            <div className="space-y-4">
              {todayAppointments.map(appointment => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-gray-600">{appointment.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Patients</h2>
            <div className="space-y-4">
              {recentPatients.map(patient => (
                <div key={patient.id} className="border rounded-lg p-4">
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-gray-600">{patient.email}</p>
                  <p className="text-gray-600">{patient.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 