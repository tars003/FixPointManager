/**
 * Utility functions for formatting values
 */

/**
 * Format a price in Indian Rupees (₹)
 * @param price - The price to format
 * @returns Formatted price string with ₹ symbol
 */
export const formatIndianPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Format a percentage value
 * @param value - The percentage value
 * @returns Formatted percentage string with % symbol
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format a date in Indian format
 * @param date - The date to format
 * @returns Formatted date string (DD/MM/YYYY)
 */
export const formatIndianDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

/**
 * Format a file size
 * @param bytes - The file size in bytes
 * @returns Formatted file size string (e.g., 1.5 MB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};