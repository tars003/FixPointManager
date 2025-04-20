import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

export function generateAvatarColor(name: string): string {
  // List of tailwind colors that are suitable for backgrounds
  const colors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-amber-100',
    'bg-red-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-indigo-100',
    'bg-cyan-100',
    'bg-teal-100',
    'bg-orange-100',
  ];
  
  // Use consistent hash based on the user's name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Get a consistent index for the colors array
  const index = Math.abs(hash % colors.length);
  return colors[index];
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// For fuel consumption conversion
export function convertLitersPer100KmToMpg(litersPer100Km: number): number {
  if (litersPer100Km <= 0) return 0;
  return 235.214583 / litersPer100Km;
}

export function convertMpgToLitersPer100Km(mpg: number): number {
  if (mpg <= 0) return 0;
  return 235.214583 / mpg;
}

// For distance conversion
export function convertKmToMiles(km: number): number {
  return km * 0.621371;
}

export function convertMilesToKm(miles: number): number {
  return miles / 0.621371;
}