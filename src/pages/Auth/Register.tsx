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
  pinCode?: string;
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

  // Phone number validation (Lebanese format)
  const validatePhone = (phone: string) => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid Lebanese number
    // Should start with 961 or 03,71,70,76,78,79,81,01,04,05,06,07,08,09 etc
    const lebaneseRegex = /^(961[1-9]\d{6}|[0-9][1-9]\d{6})$/;
    return lebaneseRegex.test(cleanPhone);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleanNumber = value.replace(/\D/g, '');
    
    // Format based on number length
    if (cleanNumber.startsWith('961')) {
      // International format
      if (cleanNumber.length > 11) return cleanNumber.slice(0, 11);
      return cleanNumber.replace(/(\d{3})(\d{1})(\d{3})(\d{3})/, '$1 $2 $3 $4');
    } else {
      // Local format
      if (cleanNumber.length > 8) return cleanNumber.slice(0, 8);
      return cleanNumber.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
    }
  };

  // Name validation (2-50 characters, more inclusive format)
  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s.'-]{2,50}$/;
    return nameRegex.test(name);
  };

  const getPasswordStrengthColor = (score: number) => {
    switch (score) {
      case 0: return "bg-gray-200 dark:bg-gray-700";
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-green-500";
      default: return "bg-gray-200 dark:bg-gray-700";
    }
  };

  const getPasswordRequirements = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const getPasswordFeedback = (score: number) => {
    switch (score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "Very Weak";
    }
  };

  const validateForm = () => {
    const newErrors: RegistrationErrors = {};
    let isValid = true;

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!validateName(name)) {
      newErrors.name = "Name should be 2-50 characters long";
      isValid = false;
    }

    if (!validatePhone(phone)) {
      newErrors.phone = "Please enter a valid Lebanese phone number";
      isValid = false;
    }

    // Password validation
    const requirements = getPasswordRequirements(password);
    const allRequirementsMet = Object.values(requirements).every(Boolean);
    if (!allRequirementsMet) {
      newErrors.password = "Password does not meet all requirements";
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
    pin_code: '',
  });

  const [doctorConfirmPassword, setDoctorConfirmPassword] = useState('');

  const validateDoctorForm = (): boolean => {
    const newErrors: RegistrationErrors = {};
    
    if (!validateName(doctorData.full_name)) {
      newErrors.name = "Invalid name format";
    }

    if (!validateEmail(doctorData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!validatePhone(doctorData.phone)) {
      newErrors.phone = "Please enter a valid Lebanese phone number";
    }

    // Password validation
    const requirements = getPasswordRequirements(doctorData.password);
    const allRequirementsMet = Object.values(requirements).every(Boolean);
    if (!allRequirementsMet) {
      newErrors.password = "Password does not meet all requirements";
    }

    if (doctorData.password !== doctorConfirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!doctorData.license_number.trim()) {
      newErrors.licenseNumber = "Medical license number is required";
    }

    if (!doctorData.specialization) {
      newErrors.specialization = "Specialization is required";
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

      // Create a clean copy of the data
      const registrationData = {
        email: doctorData.email.trim(),
        password: doctorData.password,
        full_name: doctorData.full_name.trim(),
        phone: doctorData.phone.trim(),
        license_number: doctorData.license_number.trim(),
        specialization: doctorData.specialization.trim(),
        pin_code: doctorData.pin_code.trim()
      };

      const response = await authService.registerDoctor(registrationData);
      
      if (response && response.token && response.user) {
        // Store authentication data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully.",
        });

        // Navigate to dashboard
        navigate('/doctor-dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
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
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="03 123 456 or +961 3 123 456"
                    value={phone}
                    onChange={(e) => {
                      const formattedNumber = formatPhoneNumber(e.target.value);
                      setPhone(formattedNumber);
                    }}
                    className={`${errors.phone ? "border-red-500" : ""} font-mono`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
                <p className="text-sm text-gray-500">
                  Enter a valid Lebanese phone number (e.g., 03 123 456 or +961 3 123 456)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      const result = zxcvbn(e.target.value);
                      setPasswordStrength(result.score);
                    }}
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
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((score) => (
                      <div
                        key={score}
                        className={`h-2 w-full rounded-full transition-all duration-300 ${
                          score <= passwordStrength
                            ? getPasswordStrengthColor(passwordStrength)
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className={`font-medium ${
                      passwordStrength <= 1 ? "text-red-500" :
                      passwordStrength === 2 ? "text-orange-500" :
                      passwordStrength === 3 ? "text-yellow-500" :
                      passwordStrength === 4 ? "text-green-500" :
                      "text-gray-500"
                    }`}>
                      Password Strength: {getPasswordFeedback(passwordStrength)}
                    </span>
                  </div>
                  {password && (
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-500">Password requirements:</p>
                      <ul className="space-y-1 text-sm">
                        {Object.entries(getPasswordRequirements(password)).map(([requirement, isMet]) => (
                          <li
                            key={requirement}
                            className={`flex items-center space-x-2 ${
                              isMet ? "text-green-500" : "text-gray-500"
                            }`}
                          >
                            <CheckCircle size={14} className={isMet ? "opacity-100" : "opacity-40"} />
                            <span>
                              {requirement === "minLength" && "At least 8 characters"}
                              {requirement === "hasUppercase" && "At least one uppercase letter"}
                              {requirement === "hasLowercase" && "At least one lowercase letter"}
                              {requirement === "hasNumber" && "At least one number"}
                              {requirement === "hasSpecial" && "At least one special character"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="03 123 456 or +961 3 123 456"
                    value={doctorData.phone}
                    onChange={(e) => {
                      const formattedNumber = formatPhoneNumber(e.target.value);
                      setDoctorData({ ...doctorData, phone: formattedNumber });
                    }}
                    className={`${errors.phone ? "border-red-500" : ""} font-mono`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
                <p className="text-sm text-gray-500">
                  Enter a valid Lebanese phone number (e.g., 03 123 456 or +961 3 123 456)
                </p>
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
                <Label htmlFor="pinCode">Hospital PIN Code</Label>
                <div className="relative">
                  <Input
                    id="pinCode"
                    type="password"
                    maxLength={4}
                    placeholder="Enter 4-digit PIN"
                    value={doctorData.pin_code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setDoctorData({ ...doctorData, pin_code: value });
                    }}
                    className={`${errors.pinCode ? "border-red-500" : ""} text-center tracking-widest font-mono`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                    {doctorData.pin_code.length}/4
                  </div>
                </div>
                {errors.pinCode && <p className="text-sm text-red-500">{errors.pinCode}</p>}
                <p className="text-sm text-gray-500">This PIN is provided by your hospital for verification</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select
                  value={doctorData.specialization}
                  onValueChange={(value) => setDoctorData({ ...doctorData, specialization: value })}
                >
                  <SelectTrigger 
                    className={`w-full ${errors.specialization ? "border-red-500" : ""} 
                      bg-white dark:bg-gray-800 
                      hover:bg-gray-50 dark:hover:bg-gray-700 
                      focus:ring-2 focus:ring-blue-500 
                      transition-colors duration-200`}
                  >
                    <SelectValue 
                      placeholder={
                        <span className="text-gray-500 dark:text-gray-400">
                          Select your medical specialization
                        </span>
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent 
                    position="popper"
                    className="max-h-[300px] overflow-y-auto bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50"
                    style={{ width: 'var(--radix-select-trigger-width)' }}
                  >
                    <SelectItem 
                      value="general" 
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer py-2"
                    >
                      General Practitioner
                    </SelectItem>
                    <SelectItem 
                      value="cardiology" 
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer py-2"
                    >
                      Cardiologist
                    </SelectItem>
                    <SelectItem 
                      value="dermatology" 
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer py-2"
                    >
                      Dermatologist
                    </SelectItem>
                    <SelectItem 
                      value="pediatrics" 
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer py-2"
                    >
                      Pediatrician
                    </SelectItem>
                    <SelectItem 
                      value="neurology" 
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer py-2"
                    >
                      Neurologist
                    </SelectItem>
                    <SelectItem 
                      value="orthopedics" 
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer py-2"
                    >
                      Orthopedist
                    </SelectItem>
                    <SelectItem 
                      value="psychiatry" 
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer py-2"
                    >
                      Psychiatrist
                    </SelectItem>
                    <SelectItem 
                      value="ophthalmology" 
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer py-2"
                    >
                      Ophthalmologist
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.specialization && (
                  <p className="text-sm text-red-500 mt-1">{errors.specialization}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={doctorData.password}
                    onChange={(e) => {
                      setDoctorData({ ...doctorData, password: e.target.value });
                      const result = zxcvbn(e.target.value);
                      setPasswordStrength(result.score);
                    }}
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
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((score) => (
                      <div
                        key={score}
                        className={`h-2 w-full rounded-full transition-all duration-300 ${
                          score <= passwordStrength
                            ? getPasswordStrengthColor(passwordStrength)
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className={`font-medium ${
                      passwordStrength <= 1 ? "text-red-500" :
                      passwordStrength === 2 ? "text-orange-500" :
                      passwordStrength === 3 ? "text-yellow-500" :
                      passwordStrength === 4 ? "text-green-500" :
                      "text-gray-500"
                    }`}>
                      Password Strength: {getPasswordFeedback(passwordStrength)}
                    </span>
                  </div>
                  {doctorData.password && (
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-500">Password requirements:</p>
                      <ul className="space-y-1 text-sm">
                        {Object.entries(getPasswordRequirements(doctorData.password)).map(([requirement, isMet]) => (
                          <li
                            key={requirement}
                            className={`flex items-center space-x-2 ${
                              isMet ? "text-green-500" : "text-gray-500"
                            }`}
                          >
                            <CheckCircle size={14} className={isMet ? "opacity-100" : "opacity-40"} />
                            <span>
                              {requirement === "minLength" && "At least 8 characters"}
                              {requirement === "hasUppercase" && "At least one uppercase letter"}
                              {requirement === "hasLowercase" && "At least one lowercase letter"}
                              {requirement === "hasNumber" && "At least one number"}
                              {requirement === "hasSpecial" && "At least one special character"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                  placeholder="••••••••"
                  value={doctorConfirmPassword}
                  onChange={(e) => setDoctorConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
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