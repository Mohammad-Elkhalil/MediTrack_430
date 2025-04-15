
import { Link } from "react-router-dom";
import { CheckCircle, Clock, FileText, Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-6xl mx-auto">
            <div className="flex-1 text-center md:text-left animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
                Your Health, <span className="text-meditrack-600">Simplified</span>
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-xl">
                MediTrack connects patients with doctors for seamless healthcare management. Book appointments, access records, and manage prescriptions all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                {user ? (
                  <Button size="lg" className="text-md" asChild>
                    <Link to={user.role === "patient" ? "/patient-dashboard" : "/doctor-dashboard"}>
                      Go to Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="text-md" asChild>
                      <Link to="/register">Get Started</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-md" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 mt-8 md:mt-0 w-full max-w-md mx-auto md:max-w-none">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-lg hover-scale">
                  <img 
                    src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg" 
                    alt="Doctor with patient" 
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 hidden md:block">
                  <Calendar className="h-10 w-10 text-meditrack-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose MediTrack?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform offers powerful features for both patients and doctors, making healthcare management simple and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover-scale">
              <div className="w-12 h-12 bg-meditrack-100 dark:bg-meditrack-900 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-meditrack-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Book appointments with your preferred doctors in just a few clicks.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover-scale">
              <div className="w-12 h-12 bg-meditrack-100 dark:bg-meditrack-900 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-meditrack-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Medical Records</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access and share your complete medical history securely.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover-scale">
              <div className="w-12 h-12 bg-meditrack-100 dark:bg-meditrack-900 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-meditrack-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Waitlist Updates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get notified instantly when earlier appointments become available.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover-scale">
              <div className="w-12 h-12 bg-meditrack-100 dark:bg-meditrack-900 rounded-full flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-meditrack-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Virtual Consultations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with doctors remotely for consultations when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 md:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Getting started with MediTrack is simple. Follow these steps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-meditrack-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up as a patient or doctor with your email address.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-meditrack-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
              <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add your personal information and medical history.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-meditrack-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
              <h3 className="text-xl font-semibold mb-2">Start Using MediTrack</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Book appointments, manage records, and more!
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button size="lg" className="text-md" asChild>
              <Link to="/register">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover how MediTrack has improved healthcare management for our users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-meditrack-200 flex items-center justify-center mr-4">
                  J
                </div>
                <div>
                  <h4 className="font-semibold">John D.</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Patient</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "MediTrack has made it so easy to book appointments and keep track of my medical history. The waitlist feature is a game-changer!"
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-meditrack-200 flex items-center justify-center mr-4">
                  S
                </div>
                <div>
                  <h4 className="font-semibold">Dr. Sarah M.</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Cardiologist</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "As a doctor, MediTrack helps me manage my appointments efficiently and access patient records quickly. The digital prescription system saves me a lot of time."
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-meditrack-200 flex items-center justify-center mr-4">
                  R
                </div>
                <div>
                  <h4 className="font-semibold">Rachel T.</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Patient</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "I love how easy it is to access my medical records and share them with different specialists. The virtual consultation feature is also very convenient!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 bg-meditrack-500 text-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Healthcare Experience?</h2>
            <p className="text-white/90 mb-8 text-lg">
              Join thousands of patients and doctors who are already using MediTrack to simplify healthcare management.
            </p>
            <Button size="lg" variant="secondary" className="text-md" asChild>
              <Link to="/register">Create Your Free Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
