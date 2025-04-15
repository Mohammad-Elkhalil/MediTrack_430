
import React from "react";
import { Card } from "@/components/ui/card";
import { Bell, Calendar, MessageSquare, MedicalCross, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PatientNotifications = () => {
  // Simple hardcoded notifications that a student might use
  const notifications = [
    {
      id: 1,
      type: "appointment",
      message: "Reminder: You have an appointment with Dr. Nabil tomorrow at 10:00 AM",
      time: "Just now",
      isRead: false,
    },
    {
      id: 2,
      type: "prescription",
      message: "Dr. Mohammed has prescribed you a new medication",
      time: "3 hours ago",
      isRead: false,
    },
    {
      id: 3,
      type: "message",
      message: "New message from Dr. Laila about your test results",
      time: "Yesterday",
      isRead: true,
    },
    {
      id: 4,
      type: "waitlist",
      message: "A slot opened up with Dr. Ahmad on April 13, 2025 at 11:30 AM",
      time: "2 days ago",
      isRead: true,
    },
  ];

  // Simple icon function - uses basic conditional logic like a student might write
  const getIcon = (type: string) => {
    if (type === "appointment") {
      return <Calendar className="h-5 w-5 text-blue-500" />;
    } else if (type === "prescription") {
      return <PlusCircle className="h-5 w-5 text-green-500" />;
    } else if (type === "message") {
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
    } else if (type === "waitlist") {
      return <Bell className="h-5 w-5 text-orange-500" />;
    } else {
      return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Notifications</h1>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`p-4 ${notification.isRead ? 'bg-gray-50' : 'bg-white border-l-4 border-l-meditrack-500'}`}>
            <div className="flex gap-3">
              <div className="mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className={`${notification.isRead ? 'text-gray-600' : 'font-medium'}`}>
                  {notification.message}
                </p>
                <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Student-style "load more" button instead of fancy pagination */}
      <div className="flex justify-center mt-6">
        <Button variant="outline">Load more</Button>
      </div>
    </div>
  );
};

export default PatientNotifications;
