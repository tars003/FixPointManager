import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationCenter, Notification } from './NotificationCenter';

// Add type definition for the global window object
declare global {
  interface Window {
    addNotification?: (notification: Omit<Notification, 'read'>) => void;
    markNotificationAsRead?: (id: string) => void;
    clearAllNotifications?: () => void;
  }
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'read'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Add a notification
  const addNotification = (notification: Omit<Notification, 'read'>) => {
    setNotifications(prev => [
      {
        ...notification,
        read: false,
      },
      ...prev
    ]);
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };
  
  // Make functions available globally
  useEffect(() => {
    window.addNotification = addNotification;
    window.markNotificationAsRead = markAsRead;
    window.clearAllNotifications = clearAll;
    
    return () => {
      window.addNotification = undefined;
      window.markNotificationAsRead = undefined;
      window.clearAllNotifications = undefined;
    };
  }, []);
  
  const value = {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
    unreadCount,
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationButton() {
  const { notifications } = useNotifications();
  
  return (
    <div className="relative">
      <NotificationCenter />
    </div>
  );
}