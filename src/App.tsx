import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import { AuthProvider } from "@/hooks/use-auth";
import { ToastProvider } from "@/providers/ToastProvider";
import { EncryptionProvider } from "@/contexts/EncryptionContext";
import Register from "@/pages/Auth/Register";
import BookAppointment from "@/components/appointments/BookAppointment";
import AppointmentList from "@/components/appointments/AppointmentList";
import DoctorAppointments from "@/components/appointments/DoctorAppointments";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <EncryptionProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <div className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/patient-dashboard" element={<PatientDashboard />}>
                    <Route path="book-appointment" element={<BookAppointment />} />
                    <Route path="appointments" element={<AppointmentList />} />
                  </Route>
                  <Route path="/doctor-dashboard" element={<DoctorDashboard />}>
                    <Route path="appointments" element={<DoctorAppointments />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </Router>
        </ToastProvider>
      </EncryptionProvider>
    </AuthProvider>
  );
};

export default App; 