import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle, AlertCircle } from "lucide-react";

const VerifyEmail = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get verification token from URL if present
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    // Redirect to login if no user
    if (!user) {
      navigate('/login');
      return;
    }

    // Auto-verify if token is present
    if (token) {
      verifyEmail(token);
    }

    // Start cooldown timer if needed
    const lastResend = localStorage.getItem('lastResendTime');
    if (lastResend) {
      const timeLeft = 60 - Math.floor((Date.now() - parseInt(lastResend)) / 1000);
      if (timeLeft > 0) {
        setResendCooldown(timeLeft);
        startCooldownTimer();
      }
    }
  }, [user, token]);

  const startCooldownTimer = () => {
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyEmail = async (verificationToken: string) => {
    setIsVerifying(true);
    try {
      // TODO: Implement actual email verification with backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Email verified",
        description: "Your email has been successfully verified.",
      });

      // Navigate to dashboard
      navigate('/patient-dashboard');
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Please try again or request a new verification link.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerification = async () => {
    if (resendCooldown > 0) return;

    try {
      // TODO: Implement actual resend verification with backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Start cooldown
      localStorage.setItem('lastResendTime', Date.now().toString());
      setResendCooldown(60);
      startCooldownTimer();

      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to resend",
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md animate-fade-in">
        <div className="text-center">
          {isVerifying ? (
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 animate-pulse" />
          ) : (
            <CheckCircle className="mx-auto h-12 w-12 text-blue-500" />
          )}
          <h1 className="mt-4 text-2xl font-bold">Verify your email</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We've sent a verification link to your email address. Please click the
            link to verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={resendVerification}
            disabled={resendCooldown > 0 || isVerifying}
            className="w-full"
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend verification email"}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 