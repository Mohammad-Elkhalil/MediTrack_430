export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  type: string;
  doctor: string;
  fileUrl: string;
  isEncrypted: boolean;
}

export type MedicalRecordType = 'Laboratory' | 'Radiology' | 'Prescription' | 'Surgery' | 'Other';

export interface MedicalRecordError extends Error {
  code: 'UPLOAD_FAILED' | 'DOWNLOAD_FAILED' | 'VIEW_FAILED' | 'ENCRYPTION_FAILED' | 'DECRYPTION_FAILED';
  details?: string;
}

export interface MedicalRecordState {
  isUploading: boolean;
  isDownloading: boolean;
  isViewing: boolean;
  error: MedicalRecordError | null;
} 