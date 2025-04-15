import { Appointment, Doctor, TimeSlot } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const appointmentService = {
  async getAvailableDoctors(specialization?: string): Promise<Doctor[]> {
    try {
      const url = specialization 
        ? `${API_BASE_URL}/doctors?specialization=${specialization}`
        : `${API_BASE_URL}/doctors`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  async getDoctorAvailability(doctorId: string, date: string): Promise<TimeSlot[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}/availability?date=${date}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctor availability');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor availability:', error);
      throw error;
    }
  },

  async bookAppointment(appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to book appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  },

  async cancelAppointment(appointmentId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  },

  async rescheduleAppointment(appointmentId: string, newTimeSlot: TimeSlot): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeSlot: newTimeSlot }),
      });

      if (!response.ok) {
        throw new Error('Failed to reschedule appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  },

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/patient/${patientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patient appointments');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }
  }
}; 