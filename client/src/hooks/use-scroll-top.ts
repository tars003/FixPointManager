import { useEffect } from 'react';
import { scrollToTop } from '@/utils/scroll-utils';

/**
 * Custom hook to scroll to the top of the page when a dependency changes
 * Useful for tab changes or other in-page navigation
 * 
 * @param dependency - The value to watch for changes (like a tab value)
 */
export function useScrollTop(dependency: any) {
  useEffect(() => {
    // Scroll to the top when the dependency changes
    scrollToTop();
  }, [dependency]);
}

/**
 * Custom hook that combines setting a value and scrolling to top
 * Perfect for tab navigation components
 * 
 * @returns A tuple with the current value and a setter function that also scrolls to top
 */
export function useTabWithScroll<T>(initialValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  
  // This effect runs whenever the value changes
  useScrollTop(value);
  
  // Return a function that both updates the value and scrolls to top
  const setValueWithScroll = (newValue: T) => {
    setValue(newValue);
    // Note: No need to call scrollToTop() here as the useEffect above will handle it
  };
  
  return [value, setValueWithScroll];
}

// Don't forget to add this import at the top
import { useState } from 'react';