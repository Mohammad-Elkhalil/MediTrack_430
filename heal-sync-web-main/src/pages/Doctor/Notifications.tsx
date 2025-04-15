
import React from "react";
import { Card } from "@/components/ui/card";
import { Bell, Calendar, MessageSquare, User, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DoctorNotifications = () => {
  // Simple dummy notifications - a student might use hardcoded data like this
  const notifications = [
    {
      id: 1,
      type: "appointment",
      message: "New appointment with Sara Ahmad on April 15, 2025",
      time: "2 hours ago",
      isRead: false,
    },
    {
      id: 2,
      type: "cancellation",
      message: "Ahmad Khaled cancelled their appointment for today",
      time: "5 hours ago",
      isRead: false,
    },
    {
      id: 3,
      type: "message",
      message: "You have a new message from patient Laila Mohammed",
      time: "Yesterday",
      isRead: true,
    },
    {
      id: 4,
      type: "system",
      message: "System maintenance scheduled for tonight at 2 AM",
      time: "2 days ago",
      isRead: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "cancellation":
        return <X className="h-5 w-5 text-red-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notifications</h1>
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>

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
              <Button variant="ghost" size="sm">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Simple pagination - a student might implement basic pagination like this */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-meditrack-100">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorNotifications;
