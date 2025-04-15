import React, { useState, useEffect } from 'react';
import { 
  getPatientReminders, 
  getMedicalHistory, 
  getWaitlistPosition,
  bookAppointment,
  cancelAppointment
} from '../lib/api';
import { useNavigate } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    doctor_id: '',
    date: '',
    time: ''
  });
  const navigate = useNavigate();
  const patientId = localStorage.getItem('userId');

  useEffect(() => {
    if (!patientId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [remindersRes, historyRes, waitlistRes] = await Promise.all([
          getPatientReminders(patientId),
          getMedicalHistory(patientId),
          getWaitlistPosition(patientId)
        ]);

        setReminders(remindersRes.reminders);
        setMedicalHistory(historyRes.history);
        setWaitlistPosition(waitlistRes.position);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [patientId, navigate]);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookAppointment({
        patient_id: patientId!,
        ...appointmentData
      });
      setShowBookAppointment(false);
      // Refresh data
      const remindersRes = await getPatientReminders(patientId!);
      setReminders(remindersRes.reminders);
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment({
        appointment_id: appointmentId,
        reason: 'Patient requested cancellation'
      });
      // Refresh data
      const remindersRes = await getPatientReminders(patientId!);
      setReminders(remindersRes.reminders);
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Patient Dashboard</h1>

      <div style={{ marginBottom: '30px' }}>
        <h2>Upcoming Appointments</h2>
        {reminders.length === 0 ? (
          <p>No upcoming appointments</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reminders.map((reminder) => (
              <div 
                key={reminder.appointment_id}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '5px'
                }}
              >
                <p><strong>Date:</strong> {reminder.date}</p>
                <p><strong>Time:</strong> {reminder.time}</p>
                <p><strong>Message:</strong> {reminder.message}</p>
                <button
                  onClick={() => handleCancelAppointment(reminder.appointment_id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel Appointment
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setShowBookAppointment(!showBookAppointment)}
          style={{
            marginTop: '10px',
            padding: '8px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {showBookAppointment ? 'Hide Form' : 'Book New Appointment'}
        </button>

        {showBookAppointment && (
          <form onSubmit={handleBookAppointment} style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Doctor ID:</label>
              <input
                type="text"
                value={appointmentData.doctor_id}
                onChange={(e) => setAppointmentData({ ...appointmentData, doctor_id: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
              <input
                type="date"
                value={appointmentData.date}
                onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Time:</label>
              <input
                type="time"
                value={appointmentData.time}
                onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '8px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Book Appointment
            </button>
          </form>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Medical History</h2>
        {medicalHistory.length === 0 ? (
          <p>No medical history available</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {medicalHistory.map((entry, index) => (
              <div 
                key={index}
                style={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '5px'
                }}
              >
                <p><strong>Date:</strong> {entry.visit_date}</p>
                <p><strong>Diagnosis:</strong> {entry.diagnosis}</p>
                <p><strong>Prescriptions:</strong> {entry.prescriptions.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {waitlistPosition !== null && (
        <div>
          <h2>Waitlist Position</h2>
          <p>Your current position: {waitlistPosition}</p>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard; 