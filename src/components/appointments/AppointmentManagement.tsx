import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaCalendar, FaClock, FaUser, FaCheck, FaTimes } from 'react-icons/fa';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Doe',
    date: '2024-03-15',
    time: '09:00',
    reason: 'Regular checkup',
    status: 'scheduled',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    date: '2024-03-15',
    time: '10:30',
    reason: 'Follow-up consultation',
    status: 'scheduled',
  },
];

const AppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleStatusChange = async (appointmentId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      setLoading(true);
      // TODO: Implement actual status update with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      toast.success(`Appointment ${newStatus} successfully`);
    } catch (error) {
      toast.error('Failed to update appointment status');
      console.error('Status update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(
    appointment => appointment.date === selectedDate
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Appointments</h2>

      {/* Date Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <div className="relative">
          <FaCalendar className="absolute left-3 top-3 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No appointments for this date</p>
        ) : (
          filteredAppointments.map(appointment => (
            <div
              key={appointment.id}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <FaUser className="text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FaClock className="mr-2" />
                  {appointment.time}
                </div>
                <p className="text-sm text-gray-600">{appointment.reason}</p>
              </div>

              <div className="flex space-x-2">
                {appointment.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'completed')}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <FaCheck className="mr-2" />
                      Complete
                    </button>
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </>
                )}
                {appointment.status === 'completed' && (
                  <span className="inline-flex items-center px-3 py-2 text-sm text-green-700 bg-green-100 rounded-md">
                    <FaCheck className="mr-2" />
                    Completed
                  </span>
                )}
                {appointment.status === 'cancelled' && (
                  <span className="inline-flex items-center px-3 py-2 text-sm text-red-700 bg-red-100 rounded-md">
                    <FaTimes className="mr-2" />
                    Cancelled
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement; 