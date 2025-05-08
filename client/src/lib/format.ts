/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format currency in Indian Rupee format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format a number with commas as thousands separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return 'N/A';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Format a date range (e.g., "Jan 15 - Feb 20, 2023")
 */
export function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate) return 'N/A';
  
  try {
    const start = new Date(startDate);
    const startFormatted = new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short'
    }).format(start);
    
    if (!endDate) {
      return `${startFormatted}, ${start.getFullYear()}`;
    }
    
    const end = new Date(endDate);
    const endFormatted = new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(end);
    
    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return 'Invalid date range';
  }
}