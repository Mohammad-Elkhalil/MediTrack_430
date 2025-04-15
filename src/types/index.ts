export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availableSlots: TimeSlot[];
  rating: number;
  experience: number;
  hospital: string;
  contactNumber: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  date: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface AppointmentError {
  date?: string;
  timeSlot?: string;
  reason?: string;
  general?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 