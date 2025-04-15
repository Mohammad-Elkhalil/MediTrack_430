
import React, { createContext, useContext, useState, useEffect } from "react";
import { Notification } from "@/types";
import { useAuth } from "@/hooks/use-auth";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fetch notifications from API (mocked for now)
  const fetchNotifications = async () => {
    if (!user) return;
    
    // This would be an API call in a real app
    // For demo purposes, we'll create mock notifications
    const mockNotifications: Notification[] = [
      {
        id: "n1",
        userId: user.id,
        type: "appointment",
        message: "Reminder: You have an appointment tomorrow at 2:30 PM",
        date: new Date().toISOString(),
        isRead: false
      },
      {
        id: "n2",
        userId: user.id,
        type: "medical_record",
        message: "Dr. Smith updated your medical record",
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        isRead: true
      },
      {
        id: "n3",
        userId: user.id,
        type: "waitlist_update",
        message: "A slot opened up for Dr. Johnson on April 15",
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        isRead: false
      }
    ];
    
    setNotifications(mockNotifications);
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    
    // In a real app, this would be an API call
    // await api.notifications.markAsRead(id);
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    // In a real app, this would be an API call
    // await api.notifications.markAllAsRead();
  };

  // Load notifications when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      fetchNotifications,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
