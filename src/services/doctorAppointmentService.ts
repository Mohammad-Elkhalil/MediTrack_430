import { Appointment, TimeSlot } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const doctorAppointmentService = {
  async getDoctorAppointments(doctorId: string, date?: string): Promise<Appointment[]> {
    try {
      const url = date 
        ? `${API_BASE_URL}/doctors/${doctorId}/appointments?date=${date}`
        : `${API_BASE_URL}/doctors/${doctorId}/appointments`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      throw error;
    }
  },

  async updateAppointmentStatus(appointmentId: string, status: 'completed' | 'cancelled'): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  async addNotes(appointmentId: string, notes: string): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to add notes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding notes:', error);
      throw error;
    }
  },

  async getAppointmentDetails(appointmentId: string): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointment details');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      throw error;
    }
  }
}; 