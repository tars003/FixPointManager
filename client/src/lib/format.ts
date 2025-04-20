import { formatDistanceToNow, format, isValid } from 'date-fns';

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  
  return format(dateObj, 'MMM dd, yyyy, h:mm a');
};

export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  
  return `${value}%`;
};

export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return 'N/A';
  
  // Format for India phone numbers
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  return phone;
};

export const formatDistance = (meters: number | null | undefined): string => {
  if (meters === null || meters === undefined) return 'N/A';
  
  if (meters < 1000) {
    return `${meters.toFixed(0)} m`;
  } else {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  }
};

export const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined) return 'N/A';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const formatDuration = (minutes: number | null | undefined): string => {
  if (minutes === null || minutes === undefined) return 'N/A';
  
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${remainingMinutes} min`;
    }
  }
};

export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
};