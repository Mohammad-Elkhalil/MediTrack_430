// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
  role: 'patient' | 'doctor';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'patient' | 'doctor';
    doctor_id?: string;
    patient_id?: string;
  };
}

export interface DoctorRegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  license_number: string;
  specialization: string;
  hospital: string;
  credentials?: File;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  specialization: string;
  hospital: string;
  is_verified: boolean;
  credentials_url?: string;
}

export interface PatientRegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
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
}

// Error Response type
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
} 