import { securityService } from './securityService';
import { useEncryption } from '@/contexts/EncryptionContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface HealthRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  notes: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecordError {
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  notes?: string;
  general?: string;
}

export const healthRecordService = {
  async getPatientRecords(patientId: string): Promise<HealthRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/records`);
      if (!response.ok) {
        throw new Error('Failed to fetch patient records');
      }
      const records = await response.json();
      
      // Decrypt sensitive data
      return records.map((record: HealthRecord) => ({
        ...record,
        diagnosis: securityService.decrypt(record.diagnosis),
        treatment: securityService.decrypt(record.treatment),
        notes: securityService.decrypt(record.notes)
      }));
    } catch (error) {
      console.error('Error fetching patient records:', error);
      throw error;
    }
  },

  async createHealthRecord(recordData: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthRecord> {
    try {
      // Encrypt sensitive data before sending
      const encryptedData = {
        ...recordData,
        diagnosis: securityService.encrypt(recordData.diagnosis),
        treatment: securityService.encrypt(recordData.treatment),
        notes: securityService.encrypt(recordData.notes)
      };

      const response = await fetch(`${API_BASE_URL}/health-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encryptedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create health record');
      }

      const record = await response.json();
      
      // Decrypt the response for immediate use
      return {
        ...record,
        diagnosis: securityService.decrypt(record.diagnosis),
        treatment: securityService.decrypt(record.treatment),
        notes: securityService.decrypt(record.notes)
      };
    } catch (error) {
      console.error('Error creating health record:', error);
      throw error;
    }
  },

  async updateHealthRecord(recordId: string, updates: Partial<HealthRecord>): Promise<HealthRecord> {
    try {
      // Encrypt sensitive data before sending
      const encryptedUpdates = {
        ...updates,
        diagnosis: updates.diagnosis ? securityService.encrypt(updates.diagnosis) : undefined,
        treatment: updates.treatment ? securityService.encrypt(updates.treatment) : undefined,
        notes: updates.notes ? securityService.encrypt(updates.notes) : undefined
      };

      const response = await fetch(`${API_BASE_URL}/health-records/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(encryptedUpdates),
      });

      if (!response.ok) {
        throw new Error('Failed to update health record');
      }

      const record = await response.json();
      
      // Decrypt the response for immediate use
      return {
        ...record,
        diagnosis: securityService.decrypt(record.diagnosis),
        treatment: securityService.decrypt(record.treatment),
        notes: securityService.decrypt(record.notes)
      };
    } catch (error) {
      console.error('Error updating health record:', error);
      throw error;
    }
  },

  async addAttachment(recordId: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/health-records/${recordId}/attachments`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload attachment');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  },

  async deleteAttachment(recordId: string, attachmentUrl: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/health-records/${recordId}/attachments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: attachmentUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete attachment');
      }
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw error;
    }
  },

  async deleteHealthRecord(recordId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/health-records/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete health record');
      }
    } catch (error) {
      console.error('Error deleting health record:', error);
      throw error;
    }
  }
}; 