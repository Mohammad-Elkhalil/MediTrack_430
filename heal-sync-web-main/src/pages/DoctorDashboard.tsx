import React, { useState, useEffect } from 'react';
import { 
  getDoctorAppointments,
  getDoctorDashboard,
  updateHealthRecord,
  createPrescription
} from '../lib/api';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [healthRecord, setHealthRecord] = useState({
    notes: '',
    diagnosis: '',
    prescriptions: ['']
  });
  const navigate = useNavigate();
  const doctorId = localStorage.getItem('userId');

  useEffect(() => {
    if (!doctorId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [appointmentsRes, dashboardRes] = await Promise.all([
          getDoctorAppointments(doctorId),
          getDoctorDashboard(doctorId)
        ]);

        setAppointments(appointmentsRes.appointments);
        setPatients(dashboardRes.patients);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [doctorId, navigate]);

  const handleUpdateHealthRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      await updateHealthRecord(selectedPatient, {
        doctor_id: doctorId!,
        ...healthRecord
      });
      setHealthRecord({ notes: '', diagnosis: '', prescriptions: [''] });
      alert('Health record updated successfully');
    } catch (error) {
      console.error('Error updating health record:', error);
    }
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      await createPrescription({
        doctor_id: doctorId!,
        patient_id: selectedPatient,
        medications: healthRecord.prescriptions.filter(p => p.trim() !== ''),
        notes: healthRecord.notes
      });
      alert('Prescription created successfully');
    } catch (error) {
      console.error('Error creating prescription:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Doctor Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h2>Today's Appointments</h2>
          {appointments.length === 0 ? (
            <p>No appointments scheduled</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {appointments.map((appointment) => (
                <div 
                  key={appointment.appointment_id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px'
                  }}
                >
                  <p><strong>Patient:</strong> {appointment.patient_name}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <button
                    onClick={() => setSelectedPatient(appointment.patient_id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    View Records
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2>Patient Records</h2>
          {selectedPatient ? (
            <div>
              <form onSubmit={handleUpdateHealthRecord} style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Notes:</label>
                  <textarea
                    value={healthRecord.notes}
                    onChange={(e) => setHealthRecord({ ...healthRecord, notes: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      minHeight: '100px'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Diagnosis:</label>
                  <input
                    type="text"
                    value={healthRecord.diagnosis}
                    onChange={(e) => setHealthRecord({ ...healthRecord, diagnosis: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
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
                  Update Health Record
                </button>
              </form>

              <form onSubmit={handleCreatePrescription}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Prescriptions:</label>
                  {healthRecord.prescriptions.map((prescription, index) => (
                    <div key={index} style={{ marginBottom: '5px' }}>
                      <input
                        type="text"
                        value={prescription}
                        onChange={(e) => {
                          const newPrescriptions = [...healthRecord.prescriptions];
                          newPrescriptions[index] = e.target.value;
                          setHealthRecord({ ...healthRecord, prescriptions: newPrescriptions });
                        }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setHealthRecord({ ...healthRecord, prescriptions: [...healthRecord.prescriptions, ''] })}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      marginTop: '5px'
                    }}
                  >
                    Add Another Prescription
                  </button>
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
                  Create Prescription
                </button>
              </form>
            </div>
          ) : (
            <p>Select a patient to view and update records</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 