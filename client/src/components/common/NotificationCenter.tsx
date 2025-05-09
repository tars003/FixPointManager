import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bell, 
  BellOff, 
  Check, 
  Trash2, 
  X, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  MessageSquare, 
  Car, 
  FileText,
  Calendar,
  CircleCheck
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useNotifications } from './NotificationProvider';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'system' | 'document' | 'vehicle' | 'service' | 'reminder' | 'payment';
  link?: string;
}

// Helper function to format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Get icon for notification category
const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'system':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'document':
      return <FileText className="h-4 w-4 text-amber-500" />;
    case 'vehicle':
      return <Car className="h-4 w-4 text-green-500" />;
    case 'service':
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    case 'reminder':
      return <Calendar className="h-4 w-4 text-orange-500" />;
    case 'payment':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <MessageSquare className="h-4 w-4 text-gray-500" />;
  }
};

// Get priority indicator
const getPriorityIndicator = (priority?: string) => {
  switch (priority) {
    case 'low':
      return <div className="h-2 w-2 rounded-full bg-blue-400"></div>;
    case 'medium':
      return <div className="h-2 w-2 rounded-full bg-amber-400"></div>;
    case 'high':
      return <div className="h-2 w-2 rounded-full bg-orange-500"></div>;
    case 'urgent':
      return <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>;
    default:
      return <div className="h-2 w-2 rounded-full bg-gray-400"></div>;
  }
};

export function NotificationCenter() {
  const { t } = useTranslation(['common']);
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [, navigate] = useLocation();

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === notification.category) return true;
    return false;
  });

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.link) {
      setIsOpen(false);
      navigate(notification.link);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label={t('notifications.title', 'Notifications')}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[10px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-medium text-lg flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            {t('notifications.title', 'Notifications')}
            {unreadCount > 0 && (
              <Badge className="ml-2">{unreadCount}</Badge>
            )}
          </h3>
          <div className="flex space-x-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => {
                  notifications.forEach(n => markAsRead(n.id));
                }}
                title={t('notifications.markAllRead', 'Mark all as read')}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-500 hover:text-red-600" 
                onClick={clearAll}
                title={t('notifications.clearAll', 'Clear all notifications')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-4">
            <TabsList className="h-9 grid grid-cols-4">
              <TabsTrigger value="all" className="text-xs">
                {t('notifications.tabs.all', 'All')}
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                {t('notifications.tabs.unread', 'Unread')}
              </TabsTrigger>
              <TabsTrigger value="document" className="text-xs">
                {t('notifications.tabs.documents', 'Docs')}
              </TabsTrigger>
              <TabsTrigger value="service" className="text-xs">
                {t('notifications.tabs.services', 'Services')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[350px] p-0">
              <AnimatePresence>
                {filteredNotifications.length > 0 ? (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "flex items-start gap-2 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                          notification.read ? "bg-background" : "bg-blue-50/50 dark:bg-blue-900/10"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex-shrink-0 mt-1 relative">
                          {getCategoryIcon(notification.category)}
                          <div className="absolute -bottom-0.5 -right-0.5">
                            {getPriorityIndicator(notification.priority)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <p className={cn(
                              "text-sm font-medium line-clamp-1", 
                              !notification.read && "font-semibold"
                            )}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                              {formatRelativeTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 -mt-1 -mr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          {notification.read ? (
                            <Trash2 className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <BellOff className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-medium">
                      {t('notifications.empty.title', 'No notifications')}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                      {activeTab === 'all' 
                        ? t('notifications.empty.allMessage', 'You don\'t have any notifications yet.')
                        : t('notifications.empty.filteredMessage', 'No notifications in this category.')}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Separator />
        
        <div className="p-2 text-xs text-center text-muted-foreground">
          {t('notifications.footer', 'Notification settings can be configured in your profile')}
        </div>
      </PopoverContent>
    </Popover>
  );
}