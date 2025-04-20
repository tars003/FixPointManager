import { format, formatDistance, parseISO, isValid, addDays, addMonths, isBefore, isAfter, startOfDay, endOfDay, getDay } from 'date-fns';

// Format a date to a string
export const formatDate = (date: Date | string): string => {
  if (!date) return 'N/A';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return 'Invalid Date';
  
  return format(parsedDate, 'MMM dd, yyyy');
};

// Format a date with time
export const formatDateTime = (date: Date | string): string => {
  if (!date) return 'N/A';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return 'Invalid Date';
  
  return format(parsedDate, 'MMM dd, yyyy h:mm a');
};

// Get relative time (e.g., "2 days ago", "in 3 months")
export const getRelativeTime = (date: Date | string): string => {
  if (!date) return 'N/A';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return 'Invalid Date';
  
  return formatDistance(parsedDate, new Date(), { addSuffix: true });
};

// Get time until next service
export const getTimeUntilNextService = (nextServiceDate: Date | string | null): string => {
  if (!nextServiceDate) return 'Not scheduled';
  
  const parsedDate = typeof nextServiceDate === 'string' ? parseISO(nextServiceDate) : nextServiceDate;
  
  if (!isValid(parsedDate)) return 'Invalid Date';
  
  if (isBefore(parsedDate, new Date())) {
    return 'Overdue';
  }
  
  return formatDistance(parsedDate, new Date(), { addSuffix: true });
};

// Get available dates for booking (next 60 days, excluding weekends)
export const getAvailableBookingDates = (excludeDays: number[] = [0, 6]): Date[] => {
  const dates: Date[] = [];
  const startDate = new Date();
  const endDate = addDays(startDate, 60);
  
  let currentDate = startDate;
  
  while (isBefore(currentDate, endDate)) {
    const dayOfWeek = getDay(currentDate);
    
    if (!excludeDays.includes(dayOfWeek)) {
      dates.push(new Date(currentDate));
    }
    
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};

// Get time slots for a given date
export const getTimeSlots = (
  date: Date, 
  startTime: string = '09:00', 
  endTime: string = '17:00', 
  intervalMinutes: number = 60
): string[] => {
  const slots: string[] = [];
  
  // Parse start and end times
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const start = new Date(date);
  start.setHours(startHour, startMinute, 0, 0);
  
  const end = new Date(date);
  end.setHours(endHour, endMinute, 0, 0);
  
  let current = new Date(start);
  
  while (isBefore(current, end)) {
    slots.push(format(current, 'HH:mm'));
    current = new Date(current.getTime() + intervalMinutes * 60000);
  }
  
  return slots;
};

// Check if date is in the past
export const isPastDate = (date: Date | string): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(parsedDate, new Date());
};

// Check if date is in the future
export const isFutureDate = (date: Date | string): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isAfter(parsedDate, new Date());
};

// Format day of week from number (0 = Sunday, 1 = Monday, etc.)
export const formatDayOfWeek = (day: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day] || 'Invalid Day';
};

// Format day of week (short version)
export const formatDayOfWeekShort = (day: number): string => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  return days[day] || 'Invalid';
};

// Get days in the current month
export const getDaysInMonth = (): number => {
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDayOfMonth.getDate();
};
