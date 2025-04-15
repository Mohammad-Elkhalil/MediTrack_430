
export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Doctor extends User {
  specialty: string;
  bio: string;
  location: string;
  contact: string;
  rating: number;
  avatarUrl?: string;
}

export interface Patient extends User {
  phone: string;
  avatarUrl?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  notes: string;
  prescriptions: string[];
  fileUrl?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medications: string[];
  notes: string;
}

export interface WaitlistPosition {
  position: number;
  estimatedWaitTime: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'waitlist_update' | 'medical_record' | 'prescription';
  message: string;
  date: string;
  isRead: boolean;
}

export interface OperatingRoom {
  room: string;
  time: string;
}
