import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: NotificationPriority;
  link?: string;
  category: 'document' | 'service' | 'vehicle' | 'system';
}

interface NotificationCenterProps {
  className?: string;
}

// Sample notifications - in a real app, this would come from an API
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Document Expiring Soon',
    message: 'Your vehicle insurance is expiring in 15 days. Click to renew now.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    priority: 'high',
    link: '/document-vault?id=123',
    category: 'document'
  },
  {
    id: '2',
    title: 'RTO Service Booking Confirmed',
    message: 'Your license renewal appointment has been confirmed for tomorrow at 2:00 PM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    priority: 'medium',
    link: '/rto-services/bookings',
    category: 'service'
  },
  {
    id: '3',
    title: 'Service Reminder',
    message: 'Your vehicle is due for service. Schedule a service appointment now.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    priority: 'low',
    link: '/book-service',
    category: 'vehicle'
  },
  {
    id: '4',
    title: 'Document Shared Successfully',
    message: 'RC book has been shared with example@email.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    priority: 'low',
    category: 'document'
  }
];

const getPriorityIcon = (priority: NotificationPriority) => {
  switch (priority) {
    case 'high':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'low':
      return <Info className="h-4 w-4 text-blue-500" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'document':
      return 'bg-blue-100 text-blue-800';
    case 'service':
      return 'bg-green-100 text-green-800';
    case 'vehicle':
      return 'bg-purple-100 text-purple-800';
    case 'system':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const NotificationCenter = ({ className }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation(['common']);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.category === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Animation variants
  const notificationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -10 }
  };

  return (
    <div className={cn("relative", className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[380px] p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium text-lg">{t('notifications.title', 'Notifications')}</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs h-8"
                >
                  {t('notifications.markAllAsRead', 'Mark all as read')}
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpanded(!expanded)}
                className="p-1 h-8 w-8"
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {expanded && (
            <div className="p-2 border-b flex items-center gap-1 overflow-x-auto">
              <Badge 
                variant={filter === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilter('all')}
              >
                {t('notifications.all', 'All')}
              </Badge>
              <Badge 
                variant={filter === 'unread' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilter('unread')}
              >
                {t('notifications.unread', 'Unread')}
              </Badge>
              <Badge 
                variant={filter === 'document' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilter('document')}
              >
                {t('notifications.documents', 'Documents')}
              </Badge>
              <Badge 
                variant={filter === 'service' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilter('service')}
              >
                {t('notifications.services', 'Services')}
              </Badge>
              <Badge 
                variant={filter === 'vehicle' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilter('vehicle')}
              >
                {t('notifications.vehicles', 'Vehicles')}
              </Badge>
            </div>
          )}

          <div className="max-h-[400px] overflow-y-auto p-0">
            {filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {t('notifications.noNotifications', 'No notifications')}
              </div>
            ) : (
              <AnimatePresence>
                {filteredNotifications.map(notification => (
                  <motion.div
                    key={notification.id}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={notificationVariants}
                    className={cn(
                      "p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-muted/30"
                    )}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.link) {
                        // In a real app, use navigation library like useNavigate
                        window.location.href = notification.link;
                      }
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        {getPriorityIcon(notification.priority)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{notification.title}</span>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            <span className={cn(
                              "text-xs px-1.5 py-0.5 rounded-full",
                              getCategoryColor(notification.category)
                            )}>
                              {t(`notifications.categories.${notification.category}`, notification.category)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-50 hover:opacity-100"
                        onClick={(e) => deleteNotification(notification.id, e)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          
          <div className="p-2 text-center border-t">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs"
              onClick={() => {
                // Navigate to notifications page
                window.location.href = '/notifications';
                setIsOpen(false);
              }}
            >
              {t('notifications.viewAll', 'View all notifications')}
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationCenter;