import axios from 'axios';
import {
  PatientRegisterRequest,
  PatientRegisterResponse,
  LoginRequest,
  LoginResponse,
  BookAppointmentRequest,
  BookAppointmentResponse,
  DoctorAppointmentsResponse,
  UpdateHealthRecordRequest,
  UpdateHealthRecordResponse,
  RemindersResponse,
  CancelAppointmentRequest,
  CancelAppointmentResponse,
  DoctorDashboardResponse,
  CreatePrescriptionRequest,
  CreatePrescriptionResponse,
  UploadMedicalRecordResponse,
  MedicalHistoryResponse,
  UpdateDoctorProfileRequest,
  UpdateDoctorProfileResponse,
  WaitlistPositionResponse,
  NotificationsResponse,
  StartCallResponse,
  SuggestedDoctorsResponse,
  WaitTimeComparisonResponse,
  ORAvailabilityResponse
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication endpoints
export const registerPatient = async (data: PatientRegisterRequest): Promise<PatientRegisterResponse> => {
  const response = await api.post<PatientRegisterResponse>('/patient/register', data);
  return response.data;
};

export const loginPatient = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/patient/login', data);
  return response.data;
};

export const loginDoctor = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/doctor/login', data);
  return response.data;
};

// Appointment endpoints
export const bookAppointment = async (data: BookAppointmentRequest): Promise<BookAppointmentResponse> => {
  const response = await api.post<BookAppointmentResponse>('/appointments/book', data);
  return response.data;
};

export const getDoctorAppointments = async (doctorId: string): Promise<DoctorAppointmentsResponse> => {
  const response = await api.get<DoctorAppointmentsResponse>(`/doctor/${doctorId}/appointments`);
  return response.data;
};

export const updateHealthRecord = async (
  patientId: string,
  data: UpdateHealthRecordRequest
): Promise<UpdateHealthRecordResponse> => {
  const response = await api.put<UpdateHealthRecordResponse>(`/patient/${patientId}/records`, data);
  return response.data;
};

export const getPatientReminders = async (patientId: string): Promise<RemindersResponse> => {
  const response = await api.get<RemindersResponse>(`/patient/${patientId}/reminders`);
  return response.data;
};

export const cancelAppointment = async (data: CancelAppointmentRequest): Promise<CancelAppointmentResponse> => {
  const response = await api.post<CancelAppointmentResponse>('/appointments/cancel', data);
  return response.data;
};

// Dashboard endpoints
export const getDoctorDashboard = async (doctorId: string): Promise<DoctorDashboardResponse> => {
  const response = await api.get<DoctorDashboardResponse>(`/doctor/${doctorId}/dashboard`);
  return response.data;
};

// Prescription endpoints
export const createPrescription = async (data: CreatePrescriptionRequest): Promise<CreatePrescriptionResponse> => {
  const response = await api.post<CreatePrescriptionResponse>('/prescriptions/create', data);
  return response.data;
};

// Medical Records endpoints
export const uploadMedicalRecord = async (
  patientId: string,
  file: File
): Promise<UploadMedicalRecordResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<UploadMedicalRecordResponse>(`/patient/${patientId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getMedicalHistory = async (patientId: string): Promise<MedicalHistoryResponse> => {
  const response = await api.get<MedicalHistoryResponse>(`/patient/${patientId}/history`);
  return response.data;
};

export const downloadMedicalReport = async (patientId: string, recordId: string): Promise<Blob> => {
  const response = await api.get(`/patient/${patientId}/download/${recordId}`, {
    responseType: 'blob',
  });
  return response.data;
};

// Doctor Profile endpoints
export const updateDoctorProfile = async (
  doctorId: string,
  data: UpdateDoctorProfileRequest
): Promise<UpdateDoctorProfileResponse> => {
  const response = await api.put<UpdateDoctorProfileResponse>(`/doctor/${doctorId}/profile`, data);
  return response.data;
};

// Waitlist endpoints
export const getWaitlistPosition = async (patientId: string): Promise<WaitlistPositionResponse> => {
  const response = await api.get<WaitlistPositionResponse>(`/patient/${patientId}/waitlist`);
  return response.data;
};

export const getPatientNotifications = async (patientId: string): Promise<NotificationsResponse> => {
  const response = await api.get<NotificationsResponse>(`/patient/${patientId}/notifications`);
  return response.data;
};

// Virtual Consultation endpoints
export const startVirtualConsultation = async (appointmentId: string): Promise<StartCallResponse> => {
  const response = await api.get<StartCallResponse>(`/appointments/${appointmentId}/start-call`);
  return response.data;
};

// Doctor Suggestions endpoints
export const getSuggestedDoctors = async (
  patientId: string,
  doctorId: string
): Promise<SuggestedDoctorsResponse> => {
  const response = await api.get<SuggestedDoctorsResponse>(
    `/patient/${patientId}/suggested-doctors?doctor_id=${doctorId}`
  );
  return response.data;
};

export const compareWaitTimes = async (doctorIds: string[]): Promise<WaitTimeComparisonResponse> => {
  const response = await api.get<WaitTimeComparisonResponse>(
    `/doctor/compare-wait-times?doctor_ids=${doctorIds.join(',')}`
  );
  return response.data;
};

// Operating Room endpoints
export const getORAvailability = async (
  doctorId: string,
  date: string
): Promise<ORAvailabilityResponse> => {
  const response = await api.get<ORAvailabilityResponse>(
    `/doctor/${doctorId}/or-availability?date=${date}`
  );
  return response.data;
};

export default api; 