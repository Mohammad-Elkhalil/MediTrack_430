// Authentication types
export interface PatientRegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

export interface PatientRegisterResponse {
  message: string;
  patient_id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  patient_id?: string;
  doctor_id?: string;
  token: string;
}

// Appointment types
export interface BookAppointmentRequest {
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
}

export interface BookAppointmentResponse {
  message: string;
  appointment_id: string;
}

export interface Appointment {
  appointment_id: string;
  patient_name: string;
  date: string;
  time: string;
}

export interface DoctorAppointmentsResponse {
  appointments: Appointment[];
}

// Health Record types
export interface UpdateHealthRecordRequest {
  doctor_id: string;
  notes: string;
  diagnosis: string;
  prescriptions: string[];
}

export interface UpdateHealthRecordResponse {
  message: string;
}

// Reminder types
export interface Reminder {
  appointment_id: string;
  date: string;
  time: string;
  message: string;
}

export interface RemindersResponse {
  reminders: Reminder[];
}

// Cancellation types
export interface CancelAppointmentRequest {
  appointment_id: string;
  reason: string;
}

export interface CancelAppointmentResponse {
  message: string;
}

// Dashboard types
export interface PatientInfo {
  patient_id: string;
  name: string;
  last_visit: string;
}

export interface DoctorDashboardResponse {
  patients: PatientInfo[];
}

// Prescription types
export interface CreatePrescriptionRequest {
  doctor_id: string;
  patient_id: string;
  medications: string[];
  notes: string;
}

export interface CreatePrescriptionResponse {
  message: string;
  prescription_id: string;
}

// Medical Records types
export interface UploadMedicalRecordResponse {
  message: string;
  record_id: string;
}

export interface MedicalHistoryEntry {
  visit_date: string;
  diagnosis: string;
  prescriptions: string[];
}

export interface MedicalHistoryResponse {
  history: MedicalHistoryEntry[];
}

// Doctor Profile types
export interface UpdateDoctorProfileRequest {
  specialty: string;
  bio: string;
  location: string;
  contact: string;
}

export interface UpdateDoctorProfileResponse {
  message: string;
}

// Waitlist types
export interface WaitlistPositionResponse {
  position: number;
  estimated_wait_time: string;
}

export interface Notification {
  type: string;
  message: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

// Virtual Consultation types
export interface StartCallResponse {
  video_link: string;
  expires_in: number;
}

// Doctor Suggestions types
export interface SuggestedDoctor {
  doctor_id: string;
  name: string;
  specialty: string;
  rating: number;
}

export interface SuggestedDoctorsResponse {
  suggestions: SuggestedDoctor[];
}

// Wait Time Comparison types
export interface WaitTimeComparisonResponse {
  wait_times: Record<string, string>;
}

// Operating Room types
export interface ORSlot {
  room: string;
  time: string;
}

export interface ORAvailabilityResponse {
  available_slots: ORSlot[];
}
