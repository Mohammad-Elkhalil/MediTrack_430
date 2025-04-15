import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar, FaClock, FaUserMd } from 'react-icons/fa';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availableDates: Date[];
}

// Mock data for available doctors
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    specialty: 'Cardiologist',
    availableDates: [
      new Date(2024, 2, 15),
      new Date(2024, 2, 16),
      new Date(2024, 2, 17),
    ],
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    specialty: 'Dermatologist',
    availableDates: [
      new Date(2024, 2, 15),
      new Date(2024, 2, 18),
      new Date(2024, 2, 19),
    ],
  },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const AppointmentBooking: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement actual appointment booking with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Appointment booked successfully!');
      
      // Reset form
      setSelectedDoctor('');
      setSelectedDate(null);
      setSelectedTime('');
      setReason('');
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctorData = mockDoctors.find(d => d.id === selectedDoctor);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Doctor
          </label>
          <div className="relative">
            <FaUserMd className="absolute left-3 top-3 text-gray-400" />
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Choose a doctor</option>
              {mockDoctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <div className="relative">
            <FaCalendar className="absolute left-3 top-3 text-gray-400 z-10" />
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              minDate={new Date()}
              filterDate={(date: Date) => {
                if (!selectedDoctorData) return false;
                return selectedDoctorData.availableDates.some(
                  availableDate => availableDate.toDateString() === date.toDateString()
                );
              }}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholderText="Select available date"
              required
            />
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time
          </label>
          <div className="relative">
            <FaClock className="absolute left-3 top-3 text-gray-400" />
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Choose a time slot</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reason for Visit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Visit
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Please describe your symptoms or reason for visit"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentBooking; 