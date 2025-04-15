
import { Link } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const authenticatedLinks = user
    ? user.role === "patient"
      ? [
          { name: "Dashboard", path: "/patient-dashboard" },
          { name: "Appointments", path: "/patient-appointments" },
          { name: "Medical Records", path: "/patient-records" },
        ]
      : [
          { name: "Dashboard", path: "/doctor-dashboard" },
          { name: "Appointments", path: "/doctor-appointments" },
          { name: "Patient Records", path: "/doctor-records" },
        ]
    : [];

  const allLinks = user ? [...authenticatedLinks, ...navLinks] : navLinks;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container flex items-center justify-between h-16 mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-meditrack-500 text-white font-bold text-xl">
              M
            </div>
            <span className="text-xl font-bold">MediTrack</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6">
          {allLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium hover:text-meditrack-600 dark:hover:text-meditrack-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                asChild
              >
                <Link to={user.role === "patient" ? "/patient-notifications" : "/doctor-notifications"}>
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-meditrack-500">
                    3
                  </Badge>
                </Link>
              </Button>
              
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
              
              <Button
                variant="ghost"
                className="rounded-full overflow-hidden"
                asChild
              >
                <Link
                  to={
                    user.role === "patient"
                      ? "/patient-profile"
                      : "/doctor-profile"
                  }
                >
                  <div className="w-8 h-8 rounded-full bg-meditrack-200 flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-meditrack-500 text-white font-bold text-xl">
                    M
                  </div>
                  <span className="text-xl font-bold">MediTrack</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              <div className="space-y-4 py-6 flex-1">
                {allLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block py-2 text-base font-medium hover:text-meditrack-600 dark:hover:text-meditrack-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="border-t py-4 space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-meditrack-200 flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </p>
                      </div>
                    </div>
                    <Button className="w-full" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        Register
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
