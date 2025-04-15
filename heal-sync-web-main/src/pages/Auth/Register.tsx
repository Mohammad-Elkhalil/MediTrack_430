
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    return password.length >= 8;
  };

  const passwordsMatch = () => {
    return password === confirmPassword;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }
    if (!passwordsMatch()) {
      return;
    }
    
    await register(email, password, name, phone, role);
    
    // Navigate based on role after successful registration
    if (role === "patient") {
      navigate("/patient-dashboard");
    } else {
      navigate("/doctor-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md animate-fade-in">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-meditrack-500 text-white font-bold text-lg">
              M
            </div>
            <span className="text-xl font-bold">MediTrack</span>
          </div>
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sign up to get started with MediTrack
          </p>
        </div>

        <Tabs defaultValue="patient" onValueChange={(value) => setRole(value as UserRole)}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  placeholder="Jane Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="patient@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone"
                  type="tel"
                  placeholder="+1234567890" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className={`w-4 h-4 ${validatePassword() ? 'text-green-500' : 'text-gray-400'}`}>
                    {validatePassword() ? <CheckCircle size={16} /> : '•'}
                  </div>
                  <span>At least 8 characters</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && !passwordsMatch() && (
                  <p className="text-sm text-red-600 dark:text-red-500">Passwords do not match</p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !validatePassword() || !passwordsMatch()}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-meditrack-600 hover:text-meditrack-700 dark:text-meditrack-400 dark:hover:text-meditrack-300">
                  Sign in
                </Link>
              </p>
            </form>
          </TabsContent>

          <TabsContent value="doctor">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-name">Full Name</Label>
                <Input 
                  id="doctor-name"
                  placeholder="Dr. Jane Smith" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor-email">Email</Label>
                <Input 
                  id="doctor-email"
                  type="email"
                  placeholder="doctor@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor-phone">Phone</Label>
                <Input 
                  id="doctor-phone"
                  type="tel"
                  placeholder="+1234567890" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor-password">Password</Label>
                <Input 
                  id="doctor-password"
                  type="password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className={`w-4 h-4 ${validatePassword() ? 'text-green-500' : 'text-gray-400'}`}>
                    {validatePassword() ? <CheckCircle size={16} /> : '•'}
                  </div>
                  <span>At least 8 characters</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor-confirm-password">Confirm Password</Label>
                <Input 
                  id="doctor-confirm-password"
                  type="password"
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && !passwordsMatch() && (
                  <p className="text-sm text-red-600 dark:text-red-500">Passwords do not match</p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !validatePassword() || !passwordsMatch()}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-meditrack-600 hover:text-meditrack-700 dark:text-meditrack-400 dark:hover:text-meditrack-300">
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
