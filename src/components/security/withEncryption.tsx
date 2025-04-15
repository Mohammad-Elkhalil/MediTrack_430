import React from 'react';
import CryptoJS from 'crypto-js';

// Secret key for encryption/decryption - in production this should be in environment variables
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-key';

interface SensitiveData {
  diagnosis?: string;
  treatment?: string;
  medications?: string;
  notes?: string;
  [key: string]: any;
}

interface WithEncryptionProps<T extends SensitiveData> {
  data: T;
  onSubmit: (data: T) => void;
}

export function withEncryption<P extends WithEncryptionProps<T>, T extends SensitiveData>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithEncryptionComponent(props: P) {
    const handleEncryptedSubmit = (data: T) => {
      try {
        // Encrypt sensitive fields
        const encryptedData = {
          ...data,
          diagnosis: data.diagnosis ? encryptField(data.diagnosis) : undefined,
          treatment: data.treatment ? encryptField(data.treatment) : undefined,
          medications: data.medications ? encryptField(data.medications) : undefined,
          notes: data.notes ? encryptField(data.notes) : undefined,
        };

        // Call the original onSubmit with encrypted data
        props.onSubmit(encryptedData as T);
      } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
      }
    };

    return (
      <WrappedComponent
        {...props}
        onSubmit={handleEncryptedSubmit}
      />
    );
  };
}

// Utility function to encrypt a field
export function encryptField(value: string): string {
  try {
    return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Field encryption error:', error);
    throw new Error('Failed to encrypt field');
  }
}

// Utility function to decrypt a field
export function decryptField(encryptedValue: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Field decryption error:', error);
    throw new Error('Failed to decrypt field');
  }
} 