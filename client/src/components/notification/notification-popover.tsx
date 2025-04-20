import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Info, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatRelativeTime } from '@/lib/format';

// Type for notifications
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'reminder';
  read: boolean;
  date: Date;
}

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Service reminder',
    message: 'Your vehicle is due for service in 3 days.',
    type: 'reminder',
    read: false,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '2',
    title: 'Inspection completed',
    message: 'The inspection for your Honda City has been completed.',
    type: 'success',
    read: false,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '3',
    title: 'Document expiring',
    message: 'Your insurance is expiring in 15 days. Renew it now!',
    type: 'warning',
    read: true,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: '4',
    title: 'Appointment confirmed',
    message: 'Your service appointment has been confirmed for May 25th.',
    type: 'info',
    read: true,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  }
];

export function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };
  
  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== id)
    );
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'reminder':
        return <Calendar className="h-4 w-4 text-purple-500" />;
    }
  };
  
  // Get background color based on notification type
  const getNotificationBg = (type: Notification['type'], read: boolean) => {
    if (read) return 'bg-white';
    
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'warning':
        return 'bg-amber-50';
      case 'info':
        return 'bg-blue-50';
      case 'reminder':
        return 'bg-purple-50';
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
          onClick={() => setOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7" 
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            <AnimatePresence initial={false}>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`border-b last:border-0 ${getNotificationBg(notification.type, notification.read)}`}
                >
                  <div 
                    className="p-4 flex gap-3 relative"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${notification.type === 'success' ? 'bg-green-100' : ''}
                        ${notification.type === 'warning' ? 'bg-amber-100' : ''}
                        ${notification.type === 'info' ? 'bg-blue-100' : ''}
                        ${notification.type === 'reminder' ? 'bg-purple-100' : ''}
                      `}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h5 className={`font-medium text-sm ${!notification.read ? 'text-neutral-dark' : 'text-neutral'}`}>
                          {notification.title}
                        </h5>
                        <button 
                          className="text-neutral-light hover:text-neutral-dark rounded-full p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      <p className="text-xs text-neutral-light mt-1 mb-2">
                        {notification.message}
                      </p>
                      
                      <p className="text-[10px] text-neutral-light">
                        {formatRelativeTime(notification.date)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="py-8 text-center">
              <div className="w-12 h-12 bg-neutral-100 rounded-full mx-auto flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-neutral-400" />
              </div>
              <p className="text-neutral-dark font-medium">No notifications</p>
              <p className="text-neutral-light text-sm mt-1">You're all caught up!</p>
            </div>
          )}
        </div>
        
        <div className="p-2 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs justify-center text-primary"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}