import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { LoginRequest, AuthResponse } from '@/types/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor';
  doctor_id?: string;
  patient_id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'patient' | 'doctor') => {
    try {
      const loginData: LoginRequest = {
        email,
        password,
        role
      };

      const response = await authService.login(loginData);
      
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      // Store authentication data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login error:', error.message);
        throw new Error(error.message);
      } else {
        console.error('Login error:', error);
        throw new Error('An unexpected error occurred during login');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 