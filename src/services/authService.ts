import { DoctorRegisterRequest, LoginRequest, AuthResponse, Doctor } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const authService = {
  async registerDoctor(data: DoctorRegisterRequest): Promise<AuthResponse> {
    try {
      // Check if there are any File objects that require FormData
      const hasFiles = data.credentials instanceof File;

      if (hasFiles) {
        // Use FormData for requests with files
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            if (value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, String(value));
            }
          }
        });

        const response = await fetch(`${API_BASE_URL}/doctors/register`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to register doctor');
        }

        return await response.json();
      } else {
        // Use JSON for requests without files
        const response = await fetch(`${API_BASE_URL}/doctors/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to register doctor');
        }

        return await response.json();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error registering doctor:', error.message);
        throw new Error(error.message);
      } else {
        console.error('Error registering doctor:', error);
        throw new Error('An unexpected error occurred during registration');
      }
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login error:', error.message);
        throw new Error(error.message);
      } else {
        console.error('Login error:', error);
        throw new Error('An unexpected error occurred during login');
      }
    }
  },

  async verifyDoctor(doctorId: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify doctor');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error verifying doctor:', error.message);
        throw new Error(error.message);
      } else {
        console.error('Error verifying doctor:', error);
        throw new Error('An unexpected error occurred during verification');
      }
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to request password reset');
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  async getDoctorProfile(token: string): Promise<Doctor> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch doctor profile');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching doctor profile:', error.message);
        throw new Error(error.message);
      } else {
        console.error('Error fetching doctor profile:', error);
        throw new Error('An unexpected error occurred while fetching profile');
      }
    }
  },
}; 