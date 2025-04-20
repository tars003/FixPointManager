import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

export function generateAvatarColor(name: string): string {
  if (!name) return '#6366f1';
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#F97316', // orange
  ];
  
  return colors[Math.abs(hash) % colors.length];
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
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function convertLitersPer100KmToMpg(litersPer100Km: number): number {
  // Convert L/100km to MPG (Imperial)
  return 282.48 / litersPer100Km;
}

export function convertMpgToLitersPer100Km(mpg: number): number {
  // Convert MPG (Imperial) to L/100km
  return 282.48 / mpg;
}

export function convertKmToMiles(km: number): number {
  return km * 0.621371;
}

export function convertMilesToKm(miles: number): number {
  return miles * 1.60934;
}