
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, role);
    
    // Navigate based on role after successful login
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
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sign in to access your account
          </p>
        </div>

        <Tabs defaultValue="patient" onValueChange={(value) => setRole(value as UserRole)}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>

          <TabsContent value="patient">
            <form onSubmit={handleLogin} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-meditrack-600 hover:text-meditrack-700 dark:text-meditrack-400 dark:hover:text-meditrack-300">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/register" className="text-meditrack-600 hover:text-meditrack-700 dark:text-meditrack-400 dark:hover:text-meditrack-300">
                  Sign up
                </Link>
              </p>
            </form>
          </TabsContent>

          <TabsContent value="doctor">
            <form onSubmit={handleLogin} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="doctor-password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-meditrack-600 hover:text-meditrack-700 dark:text-meditrack-400 dark:hover:text-meditrack-300">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="doctor-password"
                  type="password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Are you a doctor? If you need access,{" "}
                <Link to="/doctor-register" className="text-meditrack-600 hover:text-meditrack-700 dark:text-meditrack-400 dark:hover:text-meditrack-300">
                  Register here
                </Link>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
