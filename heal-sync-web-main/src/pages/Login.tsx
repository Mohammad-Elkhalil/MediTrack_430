import React, { useState } from 'react';
import { loginPatient, loginDoctor } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = userType === 'patient' 
        ? await loginPatient({ email, password })
        : await loginDoctor({ email, password });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userId', response.patient_id || response.doctor_id || '');
      
      navigate(userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setUserType('patient')}
          style={{
            padding: '10px',
            marginRight: '10px',
            backgroundColor: userType === 'patient' ? '#4CAF50' : '#ddd',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Patient
        </button>
        <button 
          onClick={() => setUserType('doctor')}
          style={{
            padding: '10px',
            backgroundColor: userType === 'doctor' ? '#4CAF50' : '#ddd',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Doctor
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

        <button 
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Login
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Don't have an account? <a href="/register" style={{ color: '#4CAF50' }}>Register here</a></p>
      </div>
    </div>
  );
};

export default Login; 