import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { appointmentService } from '@/services/appointmentService';
import { Appointment, TimeSlot } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const AppointmentList: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      // TODO: Implement API endpoint for fetching patient appointments
      const response = await fetch(`/api/appointments/patient/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch appointments. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      await appointmentService.cancelAppointment(appointmentId);
      toast({
        title: "Success",
        description: "Appointment cancelled successfully.",
      });
      fetchAppointments();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel appointment. Please try again later.",
      });
    }
  };

  const handleReschedule = async () => {
    if (!selectedAppointment || !newTimeSlot) return;

    try {
      await appointmentService.rescheduleAppointment(selectedAppointment.id, newTimeSlot);
      toast({
        title: "Success",
        description: "Appointment rescheduled successfully.",
      });
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setNewTimeSlot(null);
      fetchAppointments();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reschedule appointment. Please try again later.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Appointments</h2>
      
      {appointments.length === 0 ? (
        <p className="text-gray-500">You have no appointments scheduled.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Dr. {appointment.doctorId}</h3>
                  <p className="text-gray-600">
                    {format(new Date(appointment.date), 'PPP')} at{' '}
                    {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                  </p>
                  <p className="text-gray-600">Reason: {appointment.reason}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>

              {appointment.status === 'scheduled' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setShowRescheduleModal(true);
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleCancel(appointment.id)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
            {/* Add rescheduling form here */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowRescheduleModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleReschedule}>Confirm Reschedule</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList; 