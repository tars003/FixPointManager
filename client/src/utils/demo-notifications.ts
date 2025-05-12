// Sample notification data generator for FixPoint application
import { Notification } from '@/components/common/NotificationCenter';

// Generate a simple UUID-like string for demo purposes
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

const demoNotifications: Notification[] = [
  {
    id: generateId(),
    title: 'Service Reminder',
    message: 'Your BMW 320i is due for its regular service in 3 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    read: false,
    priority: 'medium',
    category: 'reminder',
    link: '/vehicle-vault'
  },
  {
    id: generateId(),
    title: 'Document Expiring Soon',
    message: 'Your vehicle insurance is expiring in 15 days. Renew now for uninterrupted coverage.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    priority: 'high',
    category: 'document',
    link: '/documents'
  },
  {
    id: generateId(),
    title: 'Service Complete',
    message: 'The scheduled maintenance for your Audi Q5 has been completed. View the service report.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    read: true,
    priority: 'low',
    category: 'service'
  },
  {
    id: generateId(),
    title: 'Membership Offer',
    message: 'Get 25% off on FixPoint Premium Membership until this weekend.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    read: true,
    priority: 'medium',
    category: 'system',
    link: '/membership'
  },
  {
    id: generateId(),
    title: 'Payment Confirmation',
    message: 'Your payment of ₹2,500 for recent service has been successfully processed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    read: true,
    priority: 'low',
    category: 'payment'
  }
];

export function loadDemoNotifications(): void {
  // Add notifications through the global function if it exists
  if (window.addNotification) {
    // Add after a slight delay to ensure NotificationProvider is mounted
    setTimeout(() => {
      demoNotifications.forEach(notification => {
        window.addNotification?.(notification);
      });
      console.log('Demo notifications loaded');
    }, 1000);
  } else {
    console.warn('Notification provider not initialized. Cannot load demo notifications.');
  }
}

export default demoNotifications;