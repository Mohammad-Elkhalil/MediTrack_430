import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import zxcvbn from 'zxcvbn';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authService } from '@/services/authService';
import { DoctorRegisterRequest } from '@/types/api';

interface RegistrationErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  licenseNumber?: string;
  specialization?: string;
  hospital?: string;
  credentials?: string;
}

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(false);

  // Email validation using RFC 5322 standard
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  // Phone number validation (international format)
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  // Name validation (2-50 characters, letters, spaces, and hyphens only)
  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s-]{2,50}$/;
    return nameRegex.test(name);
  };

  const validatePassword = (password: string) => {
    // Check password strength using zxcvbn
    const result = zxcvbn(password);
    setPasswordStrength(result.score);

    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return {
      isValid: Object.values(validations).every(Boolean),
      score: result.score,
      feedback: result.feedback,
    };
  };

  const validateForm = () => {
    const newErrors: RegistrationErrors = {};
    let isValid = true;

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!validateName(name)) {
      newErrors.name = "Name should be 2-50 characters long and contain only letters, spaces, and hyphens";
      isValid = false;
    }

    if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid international phone number";
      isValid = false;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.feedback.warning || "Password does not meet security requirements";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Rate limiting check with 15-minute timeout
      const rateLimitKey = `register_attempts_${email}`;
      const rateLimitData = localStorage.getItem(rateLimitKey);
      
      if (rateLimitData) {
        const { attempts, timestamp } = JSON.parse(rateLimitData);
        const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
        
        // Reset rate limiting if 15 minutes have passed
        if (timestamp < fifteenMinutesAgo) {
          localStorage.removeItem(rateLimitKey);
        } else if (attempts >= 3) {
          const timeLeft = Math.ceil((timestamp + 15 * 60 * 1000 - Date.now()) / 60000);
          toast({
            variant: "destructive",
            title: "Too many attempts",
            description: `Please try again in ${timeLeft} minutes`,
          });
          return;
        }
      }

      await register(email, password, name, phone, role);
      
      // Clear rate limiting on success
      localStorage.removeItem(rateLimitKey);
      
      // Show success message
      toast({
        title: "Registration successful",
        description: "Please login with your credentials",
      });

      // Navigate to login page
      navigate("/login");
      
    } catch (err) {
      // Update rate limiting with timestamp
      const rateLimitKey = `register_attempts_${email}`;
      const rateLimitData = localStorage.getItem(rateLimitKey);
      const currentData = rateLimitData 
        ? JSON.parse(rateLimitData)
        : { attempts: 0, timestamp: Date.now() };
      
      localStorage.setItem(rateLimitKey, JSON.stringify({
        attempts: currentData.attempts + 1,
        timestamp: Date.now()
      }));
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error || "Please try again later",
      });
    }
  };

  const handleSocialRegister = async (provider: 'google' | 'facebook') => {
    try {
      // TODO: Implement social media registration
      // This would typically involve:
      // 1. Opening OAuth popup
      // 2. Handling the OAuth callback
      // 3. Verifying the token with your backend
      // 4. Creating or linking the user account
      
      toast({
        title: "Social Registration",
        description: `Registration with ${provider} is not implemented yet`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Social registration failed",
        description: "Please try again later",
      });
    }
  };

  // Doctor registration form state
  const [doctorData, setDoctorData] = useState<DoctorRegisterRequest>({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    license_number: '',
    specialization: '',
    hospital: '',
  });

  const validateDoctorForm = (): boolean => {
    const newErrors: RegistrationErrors = {};
    
    // Name validation
    if (!doctorData.full_name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (!validateName(doctorData.full_name)) {
      newErrors.name = 'Invalid name format';
    }

    // Email validation
    if (!doctorData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(doctorData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    if (!doctorData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(doctorData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    // Password validation
    if (!doctorData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(doctorData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.feedback.warning || 'Password is not strong enough';
      }
    }

    // License number validation
    if (!doctorData.license_number.trim()) {
      newErrors.licenseNumber = 'Medical license number is required';
    }

    // Specialization validation
    if (!doctorData.specialization) {
      newErrors.specialization = 'Specialization is required';
    }

    // Hospital validation
    if (!doctorData.hospital.trim()) {
      newErrors.hospital = 'Hospital/Clinic name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDoctorRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDoctorForm()) {
      return;
    }

    try {
      setIsLoadingDoctor(true);

      // Validate required fields
      if (!doctorData.email || !doctorData.password || !doctorData.full_name || 
          !doctorData.phone || !doctorData.license_number || 
          !doctorData.specialization || !doctorData.hospital) {
        throw new Error('Please fill in all required fields');
      }

      // Create a clean copy of the data
      const registrationData = {
        ...doctorData,
        email: doctorData.email.trim(),
        full_name: doctorData.full_name.trim(),
        phone: doctorData.phone.trim(),
        license_number: doctorData.license_number.trim(),
        specialization: doctorData.specialization.trim(),
        hospital: doctorData.hospital.trim(),
      };

      const response = await authService.registerDoctor(registrationData);
      
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      // Store authentication data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });

      // Navigate to dashboard
      navigate('/doctor-dashboard');
    } catch (error) {
      let errorMessage = 'An error occurred during registration';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
      });

      console.error('Registration error:', error);
    } finally {
      setIsLoadingDoctor(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Create an Account</h2>
          <p className="text-sm text-gray-500 mt-2">
            Join our healthcare platform
          </p>
        </div>

        <Tabs defaultValue="patient" className="w-full" onValueChange={(value) => setRole(value as UserRole)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex gap-1 mt-1">
                  {[0, 1, 2, 3, 4].map((score) => (
                    <div
                      key={score}
                      className={`h-2 w-full rounded ${
                        score <= passwordStrength
                          ? [
                              "bg-red-500",
                              "bg-orange-500",
                              "bg-yellow-500",
                              "bg-green-500",
                              "bg-green-600",
                            ][passwordStrength]
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialRegister('google')}
                  disabled={isLoading}
                >
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialRegister('facebook')}
                  disabled={isLoading}
                >
                  Facebook
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </TabsContent>

          <TabsContent value="doctor">
            <form onSubmit={handleDoctorRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Dr. John Doe"
                  value={doctorData.full_name}
                  onChange={(e) => setDoctorData({ ...doctorData, full_name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={doctorData.email}
                  onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={doctorData.phone}
                  onChange={(e) => setDoctorData({ ...doctorData, phone: e.target.value })}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number</Label>
                <Input
                  id="licenseNumber"
                  placeholder="ML123456"
                  value={doctorData.license_number}
                  onChange={(e) => setDoctorData({ ...doctorData, license_number: e.target.value })}
                  className={errors.licenseNumber ? "border-red-500" : ""}
                />
                {errors.licenseNumber && <p className="text-sm text-red-500">{errors.licenseNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select
                  value={doctorData.specialization}
                  onValueChange={(value) => setDoctorData({ ...doctorData, specialization: value })}
                >
                  <SelectTrigger className={errors.specialization ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Practitioner</SelectItem>
                    <SelectItem value="cardiology">Cardiologist</SelectItem>
                    <SelectItem value="dermatology">Dermatologist</SelectItem>
                    <SelectItem value="pediatrics">Pediatrician</SelectItem>
                    <SelectItem value="neurology">Neurologist</SelectItem>
                    <SelectItem value="orthopedics">Orthopedist</SelectItem>
                    <SelectItem value="psychiatry">Psychiatrist</SelectItem>
                    <SelectItem value="ophthalmology">Ophthalmologist</SelectItem>
                  </SelectContent>
                </Select>
                {errors.specialization && <p className="text-sm text-red-500">{errors.specialization}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital/Clinic</Label>
                <Input
                  id="hospital"
                  placeholder="Medical Center Name"
                  value={doctorData.hospital}
                  onChange={(e) => setDoctorData({ ...doctorData, hospital: e.target.value })}
                  className={errors.hospital ? "border-red-500" : ""}
                />
                {errors.hospital && <p className="text-sm text-red-500">{errors.hospital}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={doctorData.password}
                    onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                {passwordStrength > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((score) => (
                        <div
                          key={score}
                          className={`h-2 w-1/4 rounded ${
                            score <= passwordStrength
                              ? score <= 2
                                ? "bg-red-500"
                                : score === 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password strength:{" "}
                      {passwordStrength <= 2
                        ? "Weak"
                        : passwordStrength === 3
                        ? "Good"
                        : "Strong"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentials">Upload Credentials</Label>
                <Input
                  id="credentials"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setDoctorData({ ...doctorData, credentials: file });
                    }
                  }}
                />
                <p className="text-xs text-gray-500">Upload your medical license and certifications (PDF, DOC, DOCX)</p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoadingDoctor}>
                {isLoadingDoctor ? "Creating account..." : "Create Doctor Account"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Register; 