import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info, Calendar, Wrench, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'maintenance' | 'reminder' | 'document' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const getMockNotifications = (): Notification[] => {
  return [
    {
      id: '1',
      type: 'maintenance',
      title: 'Service Reminder',
      message: 'Your Honda City is due for regular maintenance in 14 days',
      time: '2h ago',
      read: false
    },
    {
      id: '2',
      type: 'document',
      title: 'Document Expiring',
      message: 'Your vehicle insurance will expire in 30 days',
      time: '1d ago',
      read: false
    },
    {
      id: '3',
      type: 'system',
      title: 'Welcome to FixPoint',
      message: 'Thank you for joining our platform. Explore our services.',
      time: '3d ago',
      read: true
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Fuel Price Alert',
      message: 'Fuel prices have dropped by 5% in your area',
      time: '5d ago',
      read: true
    },
  ];
};

const getIconForNotificationType = (type: string) => {
  switch (type) {
    case 'maintenance':
      return <Wrench className="h-5 w-5 text-blue-500" />;
    case 'reminder':
      return <Calendar className="h-5 w-5 text-purple-500" />;
    case 'document':
      return <FileCheck className="h-5 w-5 text-green-500" />;
    case 'system':
    default:
      return <Info className="h-5 w-5 text-amber-500" />;
  }
};

interface NotificationPopoverProps {
  className?: string;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<Notification[]>(getMockNotifications());
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline"
          size="sm"
          className={cn("relative", className)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-[350px] p-0 max-h-[70vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-7 px-2"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="overflow-y-auto py-2 max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-neutral-light">No notifications</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "border-l-4 p-3 mx-2 mb-2 rounded-md flex bg-white",
                    notification.read ? "border-neutral-200" : "border-primary",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center mr-3 flex-shrink-0">
                    {getIconForNotificationType(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">
                        {notification.title}
                        {!notification.read && (
                          <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 text-[10px] py-0">
                            New
                          </Badge>
                        )}
                      </h4>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-neutral-400 hover:text-neutral-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-sm text-neutral-light mt-1 whitespace-normal break-words">
                      {notification.message}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-neutral-light">{notification.time}</p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-7 text-xs px-2 text-primary hover:text-primary-dark"
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        
        <div className="p-2 border-t mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => setIsOpen(false)}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;