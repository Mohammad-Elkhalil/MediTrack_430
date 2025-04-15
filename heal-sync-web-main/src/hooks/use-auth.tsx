
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, User } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("meditrackUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // For demo, we'll simulate a successful login after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate different responses based on role
      const mockUserId = role === "patient" ? "p12345" : "d7890";
      const mockUser: User = {
        id: mockUserId,
        email,
        name: email.split("@")[0], // Just for demo purposes
        role,
      };

      // Save to localStorage and update state
      localStorage.setItem("meditrackUser", JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials and try again.");
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, phone: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // For demo, we'll simulate a successful registration after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUserId = role === "patient" ? `p${Math.floor(Math.random() * 10000)}` : `d${Math.floor(Math.random() * 10000)}`;
      const mockUser: User = {
        id: mockUserId,
        email,
        name,
        role,
      };

      // Auto login after registration
      localStorage.setItem("meditrackUser", JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("meditrackUser");
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
