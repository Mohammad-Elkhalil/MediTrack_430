import CryptoJS from 'crypto-js';

// In a real application, these keys should be stored securely and rotated regularly
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secure-key-here';
const IV = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');

export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

export const securityService = {
  /**
   * Encrypts sensitive data using AES-256-CBC
   * @param data The data to encrypt
   * @returns Encrypted data as a string
   */
  encrypt(data: any): string {
    try {
      if (!data) {
        throw new SecurityError('No data provided for encryption');
      }

      const dataString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(dataString, ENCRYPTION_KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return encrypted.toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new SecurityError('Failed to encrypt data');
    }
  },

  /**
   * Decrypts encrypted data
   * @param encryptedData The encrypted data string
   * @returns Decrypted data
   */
  decrypt(encryptedData: string): any {
    try {
      if (!encryptedData) {
        throw new SecurityError('No encrypted data provided');
      }

      const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedString) {
        throw new SecurityError('Failed to decrypt data - invalid key or corrupted data');
      }

      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new SecurityError('Failed to decrypt data');
    }
  },

  /**
   * Hashes sensitive data using SHA-256
   * @param data The data to hash
   * @returns Hashed data as a string
   */
  hash(data: string): string {
    try {
      if (!data) {
        throw new SecurityError('No data provided for hashing');
      }

      return CryptoJS.SHA256(data).toString();
    } catch (error) {
      console.error('Hashing error:', error);
      throw new SecurityError('Failed to hash data');
    }
  },

  /**
   * Validates if the provided data is encrypted
   * @param data The data to validate
   * @returns boolean indicating if the data appears to be encrypted
   */
  isEncrypted(data: string): boolean {
    try {
      // Check if the string is a valid base64 format
      const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
      if (!base64Regex.test(data)) {
        return false;
      }

      // Try to decrypt a small portion to validate
      const testDecrypt = CryptoJS.AES.decrypt(data.substring(0, 32), ENCRYPTION_KEY, {
        iv: IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return testDecrypt.toString(CryptoJS.enc.Utf8).length > 0;
    } catch {
      return false;
    }
  }
}; 