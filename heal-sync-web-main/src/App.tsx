import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Test from './pages/Test';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <div style={{ 
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1>Welcome to HealSync</h1>
          <p>Your comprehensive healthcare management system</p>
        </div>
        <Routes>
          <Route path="/" element={<Test />} />
          <Route path="/login" element={<Login />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
