import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { appointmentService } from '@/services/appointmentService';
import { Doctor } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';

const BookAppointment: React.FC = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && date) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDoctor, date]);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/doctors');
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load doctors. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableTimeSlots = async () => {
    if (!selectedDoctor || !date) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/doctors/${selectedDoctor.id}/availability?date=${format(date, 'yyyy-MM-dd')}`);
      if (!response.ok) throw new Error('Failed to fetch time slots');
      const data = await response.json();
      setAvailableTimeSlots(data.availableSlots);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available time slots. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !date || !timeSlot || !reason) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    try {
      setIsLoading(true);
      await appointmentService.bookAppointment({
        doctorId: selectedDoctor.id,
        patientId: user?.id || '',
        date: format(date, 'yyyy-MM-dd'),
        time: timeSlot,
        reason,
      });

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });

      // Reset form
      setSelectedDoctor(null);
      setDate(new Date());
      setTimeSlot('');
      setReason('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book appointment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Search and Doctor Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Doctor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={selectedDoctor?.id}
                onValueChange={(value) => {
                  const doctor = doctors.find(d => d.id === value);
                  setSelectedDoctor(doctor || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center space-x-2">
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-gray-500">{doctor.specialization}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Date and Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date and Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div>
                <Label>Time Slot</Label>
                <Select
                  value={timeSlot}
                  onValueChange={setTimeSlot}
                  disabled={!date || !selectedDoctor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reason for Visit */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Reason for Visit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Please describe your symptoms or reason for the visit</Label>
                <Input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your symptoms or reason for visit..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleBookAppointment}
          disabled={isLoading || !selectedDoctor || !date || !timeSlot || !reason}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            'Book Appointment'
          )}
        </Button>
      </div>
    </div>
  );
};

export default BookAppointment; 