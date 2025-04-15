
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Mail, MapPin, Phone, User } from "lucide-react";
import { Doctor } from "@/types";

const DoctorProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data - in a real app this would come from API
  const [doctor, setDoctor] = useState<Doctor>({
    id: "d123",
    email: "doctor@example.com",
    name: "Dr. John Smith",
    role: "doctor",
    specialty: "Cardiology",
    bio: "I've been practicing medicine for 7 years with a focus on cardiovascular health.",
    location: "Beirut Medical Center",
    contact: "+961 12 345 678",
    rating: 4.8
  });

  // Form fields
  const [formData, setFormData] = useState({
    name: doctor.name,
    specialty: doctor.specialty,
    bio: doctor.bio,
    location: doctor.location,
    contact: doctor.contact,
  });

  // Update form data when doctor data changes
  useEffect(() => {
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      bio: doctor.bio,
      location: doctor.location,
      contact: doctor.contact,
    });
  }, [doctor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    console.log("Saving profile data:", formData);
    
    // Update local state
    setDoctor({
      ...doctor,
      name: formData.name,
      specialty: formData.specialty,
      bio: formData.bio,
      location: formData.location,
      contact: formData.contact,
    });
    
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your profile information has been saved",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Doctor Profile</h1>
      
      {!isEditing ? (
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-meditrack-300 dark:bg-meditrack-800 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                {doctor.name.charAt(0)}
              </div>
              <div className="mt-4 text-center">
                <p className="font-semibold">Rating</p>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-xl font-bold">{doctor.rating}</span>
                  <span className="text-yellow-500 ml-1">★</span>
                </div>
              </div>
            </div>
            
            <div className="flex-grow">
              <h2 className="text-xl font-bold mb-2">{doctor.name}</h2>
              <p className="text-meditrack-600 dark:text-meditrack-400 mb-4">{doctor.specialty}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-500 mt-1" />
                  <p>{doctor.bio}</p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <p>{doctor.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <p>{doctor.contact}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <p>{doctor.email}</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsEditing(true)}
                className="mt-4 border border-gray-300"
                variant="outline"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Specialty</label>
              <Input
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <Textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Contact</label>
              <Input
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button type="submit">Save Changes</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-meditrack-500" />
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
          </div>
          
          {/* Just a simple placeholder - would be mapped from real data */}
          <div className="space-y-4">
            <div className="p-3 border rounded-md">
              <div className="flex justify-between">
                <p className="font-medium">Jane Smith</p>
                <p className="text-sm text-gray-500">10:00 AM</p>
              </div>
              <p className="text-sm text-gray-500">April 15, 2025</p>
            </div>
            <div className="p-3 border rounded-md">
              <div className="flex justify-between">
                <p className="font-medium">Mike Johnson</p>
                <p className="text-sm text-gray-500">11:30 AM</p>
              </div>
              <p className="text-sm text-gray-500">April 15, 2025</p>
            </div>
            <Button variant="outline" className="w-full">View All Appointments</Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Weekly Schedule</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p>Monday</p>
              <p className="text-gray-500">9:00 AM - 5:00 PM</p>
            </div>
            <div className="flex justify-between">
              <p>Tuesday</p>
              <p className="text-gray-500">9:00 AM - 5:00 PM</p>
            </div>
            <div className="flex justify-between">
              <p>Wednesday</p>
              <p className="text-gray-500">9:00 AM - 5:00 PM</p>
            </div>
            <div className="flex justify-between">
              <p>Thursday</p>
              <p className="text-gray-500">9:00 AM - 5:00 PM</p>
            </div>
            <div className="flex justify-between">
              <p>Friday</p>
              <p className="text-gray-500">9:00 AM - 1:00 PM</p>
            </div>
            <div className="flex justify-between">
              <p>Saturday</p>
              <p className="text-gray-500">Closed</p>
            </div>
            <div className="flex justify-between">
              <p>Sunday</p>
              <p className="text-gray-500">Closed</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfile;
