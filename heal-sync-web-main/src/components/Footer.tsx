
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-meditrack-500 text-white font-bold text-xl">
                M
              </div>
              <span className="text-xl font-bold">MediTrack</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              MediTrack is a comprehensive healthcare management system designed for patients and doctors 
              to streamline medical care and improve patient outcomes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-600 dark:text-gray-400 hover:text-meditrack-600 dark:hover:text-meditrack-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 dark:text-gray-400 hover:text-meditrack-600 dark:hover:text-meditrack-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 dark:text-gray-400 hover:text-meditrack-600 dark:hover:text-meditrack-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/login" 
                  className="text-gray-600 dark:text-gray-400 hover:text-meditrack-600 dark:hover:text-meditrack-400 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="text-gray-600 dark:text-gray-400 hover:text-meditrack-600 dark:hover:text-meditrack-400 transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link 
                  to="/doctor-register" 
                  className="text-gray-600 dark:text-gray-400 hover:text-meditrack-600 dark:hover:text-meditrack-400 transition-colors"
                >
                  Doctor Registration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} MediTrack. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link 
              to="/privacy" 
              className="text-gray-600 dark:text-gray-400 hover:text-meditrack-600 dark:hover:text-meditrack-400 transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-gray-600 dark:text-gray-400 hover:text-meditrack-600 dark:hover:text-meditrack-400 transition-colors text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
