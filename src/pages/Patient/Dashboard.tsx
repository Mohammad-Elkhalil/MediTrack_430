import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Appointment, Patient } from '@/types/api';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for demonstration
        const mockAppointments: Appointment[] = [
          {
            id: "a101",
            patientId: user?.id || "",
            patientName: user?.name || "",
            doctorId: "d12345",
            doctorName: "Dr. Smith",
            date: new Date().toISOString().split('T')[0],
            time: "10:30",
            status: "scheduled"
          },
          {
            id: "a102",
            patientId: user?.id || "",
            patientName: user?.name || "",
            doctorId: "d12346",
            doctorName: "Dr. Johnson",
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            time: "14:15",
            status: "scheduled"
          }
        ];

        const mockMedicalHistory = [
          {
            id: "m101",
            date: "2024-03-15",
            doctor: "Dr. Smith",
            diagnosis: "Regular checkup",
            treatment: "No treatment needed",
            notes: "Patient in good health"
          },
          {
            id: "m102",
            date: "2024-02-20",
            doctor: "Dr. Johnson",
            diagnosis: "Flu symptoms",
            treatment: "Prescribed medication",
            notes: "Follow up in 2 weeks"
          }
        ];

        setUpcomingAppointments(mockAppointments);
        setMedicalHistory(mockMedicalHistory);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{appointment.doctorName}</p>
                      <p className="text-gray-600">{appointment.date} at {appointment.time}</p>
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
            <h2 className="text-xl font-semibold mb-4">Medical History</h2>
            <div className="space-y-4">
              {medicalHistory.map(record => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{record.doctor}</p>
                      <p className="text-gray-600">{record.date}</p>
                      <p className="text-gray-600 mt-2">{record.diagnosis}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 