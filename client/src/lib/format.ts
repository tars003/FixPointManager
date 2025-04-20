import { format, parseISO, isValid, formatDistance } from 'date-fns';

// Format a date string or Date object to a human-readable format
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(parsedDate)) {
      return 'Invalid date';
    }
    
    return format(parsedDate, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Format a date string or Date object to include time
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(parsedDate)) {
      return 'Invalid date';
    }
    
    return format(parsedDate, 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid date';
  }
};

// Format a number as currency
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format a number with commas for thousands
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US').format(num);
};

// Format a number as a percentage
export const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '0%';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

// Format a phone number
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return '';
  
  // Strip non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format US phone number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format with country code
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if we can't format
  return phone;
};

// Format a distance in miles
export const formatDistance = (meters: number | null | undefined): string => {
  if (meters === null || meters === undefined) {
    return '0 mi';
  }
  
  // Convert meters to miles
  const miles = meters * 0.000621371;
  
  if (miles < 0.1) {
    return '<0.1 mi';
  }
  
  return `${miles.toFixed(1)} mi`;
};

// Format a file size
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined || bytes === 0) {
    return '0 Bytes';
  }
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Format a duration in minutes to hours and minutes
export const formatDuration = (minutes: number | null | undefined): string => {
  if (minutes === null || minutes === undefined) {
    return '0m';
  }
  
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Format a relative time (e.g., "2 days ago")
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(parsedDate)) {
      return 'Invalid date';
    }
    
    return formatDistance(parsedDate, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};
