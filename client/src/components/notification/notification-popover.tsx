import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, FileText, Wrench, Car, CreditCard, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/components/common/NotificationProvider';
import { useTranslation } from 'react-i18next';

// Define Notification type to match what we expect from NotificationProvider
interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'system' | 'document' | 'vehicle' | 'service' | 'reminder' | 'payment';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  date: Date;
  actionUrl?: string;
}

export function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(['common']);
  const { notifications, markAsRead, removeNotification, unreadCount } = useNotifications();
  
  // Mark all as read
  const markAllAsRead = () => {
    notifications.forEach(notification => {
      markAsRead(notification.id);
    });
  };
  
  // Get icon based on notification category
  const getNotificationIcon = (category: Notification['category']) => {
    switch (category) {
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'service':
        return <Wrench className="h-4 w-4 text-amber-500" />;
      case 'vehicle':
        return <Car className="h-4 w-4 text-green-500" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-violet-500" />;
      case 'reminder':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get background color based on notification priority
  const getNotificationBg = (priority: Notification['priority'], read: boolean) => {
    if (read) return 'bg-white';
    
    switch (priority) {
      case 'urgent':
        return 'bg-red-50';
      case 'high':
        return 'bg-orange-50';
      case 'medium':
        return 'bg-amber-50';
      case 'low':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };
  
  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return t('notifications.timeAgo.justNow');
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return t('notifications.timeAgo.minutesAgo', { count: diffInMinutes });
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return t('notifications.timeAgo.hoursAgo', { count: diffInHours });
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return t('notifications.timeAgo.daysAgo', { count: diffInDays });
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return t('notifications.timeAgo.weeksAgo', { count: diffInWeeks });
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return t('notifications.timeAgo.monthsAgo', { count: diffInMonths });
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return t('notifications.timeAgo.yearsAgo', { count: diffInYears });
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
                  className={`border-b last:border-0 ${getNotificationBg(notification.priority, notification.read)}`}
                >
                  <div 
                    className="p-4 flex gap-3 relative"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.category === 'document' ? 'bg-blue-100' : 
                        notification.category === 'service' ? 'bg-amber-100' : 
                        notification.category === 'vehicle' ? 'bg-green-100' : 
                        notification.category === 'payment' ? 'bg-violet-100' : 
                        notification.category === 'reminder' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        {getNotificationIcon(notification.category)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h5 className={`font-medium text-sm ${!notification.read ? 'text-neutral-900' : 'text-neutral-600'}`}>
                          {notification.title}
                        </h5>
                        <button 
                          className="text-neutral-400 hover:text-neutral-700 rounded-full p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      <p className="text-xs text-neutral-500 mt-1 mb-2">
                        {notification.message}
                      </p>
                      
                      <p className="text-[10px] text-neutral-400">
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
              <p className="text-neutral-800 font-medium">{t('notifications.noNotifications')}</p>
              <p className="text-neutral-500 text-sm mt-1">{t('notifications.allCaughtUp')}</p>
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