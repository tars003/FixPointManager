/**
 * Utility functions for formatting different data types consistently
 */

// Formats date as "April 20, 2025"
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  
  return dateObj.toLocaleDateString('en-US', options);
};

// Formats date and time as "April 20, 2025, 2:30 PM"
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  
  return dateObj.toLocaleDateString('en-US', options);
};

// Formats currency as "$123.45"
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Formats number with commas: "1,234.56"
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US').format(num);
};

// Formats percent as "12.34%"
export const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value / 100);
};

// Formats phone as "(123) 456-7890"
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return 'N/A';
  if (phone.length !== 10) return phone; // Return as is if not valid
  
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
};

// Formats distance as "1.23 km" or "12.3 mi"
export const formatDistance = (meters: number | null | undefined): string => {
  if (meters === null || meters === undefined) return 'N/A';
  
  if (meters < 1000) {
    return `${meters} m`;
  } else {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)} km`;
  }
};

// Formats file size as "1.23 MB"
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

// Formats duration as "1h 23m" or "23m"
export const formatDuration = (minutes: number | null | undefined): string => {
  if (minutes === null || minutes === undefined) return 'N/A';
  
  if (minutes < 60) {
    return `${minutes}m`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
};

// Formats relative time as "2 hours ago", "yesterday", etc.
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateObj);
  }
};