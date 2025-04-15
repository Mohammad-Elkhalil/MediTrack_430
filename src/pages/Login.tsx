import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LoginErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Email validation using RFC 5322 standard
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: LoginErrors = {};
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Rate limiting check
      const rateLimitKey = `login_attempts_${email}`;
      const attempts = parseInt(localStorage.getItem(rateLimitKey) || '0');
      if (attempts >= 5) {
        const lastAttemptTime = parseInt(localStorage.getItem(`${rateLimitKey}_time`) || '0');
        const timeElapsed = Date.now() - lastAttemptTime;
        
        if (timeElapsed < 15 * 60 * 1000) { // 15 minutes
          toast({
            variant: "destructive",
            title: "Too many attempts",
            description: "Please try again in 15 minutes",
          });
          return;
        } else {
          // Reset rate limiting after 15 minutes
          localStorage.removeItem(rateLimitKey);
          localStorage.removeItem(`${rateLimitKey}_time`);
        }
      }

      await login(email, password, role);
      
      // Clear rate limiting on success
      localStorage.removeItem(rateLimitKey);
      localStorage.removeItem(`${rateLimitKey}_time`);
      
      // Navigate to appropriate dashboard
      navigate(role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard");
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
    } catch (err) {
      // Increment rate limiting counter
      const rateLimitKey = `login_attempts_${email}`;
      const attempts = parseInt(localStorage.getItem(rateLimitKey) || '0');
      localStorage.setItem(rateLimitKey, (attempts + 1).toString());
      localStorage.setItem(`${rateLimitKey}_time`, Date.now().toString());
      
      const errorMessage = err instanceof Error ? err.message : "Invalid email or password";
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to your account
          </p>
        </div>

        <Tabs defaultValue="patient" className="w-full" onValueChange={(value) => setRole(value as UserRole)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </div>
        </Tabs>

        <div className="text-center text-sm">
          <span className="text-gray-500">Don't have an account? </span>
          <Link to="/register" className="text-blue-500 hover:text-blue-700">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 