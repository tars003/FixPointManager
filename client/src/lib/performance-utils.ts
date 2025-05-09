/**
 * Utility functions for performance optimization
 */

/**
 * Defers non-critical work until after the main thread is idle
 * @param callback Function to execute when browser is idle
 * @param timeout Maximum timeout before forced execution
 */
export const runWhenIdle = (callback: () => void, timeout = 2000): void => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => callback(), { timeout });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, 100);
  }
};

/**
 * Preloads important resources
 * @param resources Array of URLs to preload
 * @param type Resource type (image, style, script, font)
 */
export const preloadResources = (
  resources: string[],
  type: 'image' | 'style' | 'script' | 'font' = 'image'
): void => {
  runWhenIdle(() => {
    resources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = type;
      if (type === 'font') {
        link.setAttribute('crossorigin', 'anonymous');
      }
      document.head.appendChild(link);
    });
  });
};

/**
 * Delays loading of non-critical CSS
 * @param href URL of CSS file to load
 */
export const loadCSS = (href: string): void => {
  runWhenIdle(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });
};

/**
 * Reduces layout thrashing by batching DOM read/write operations
 * @param readCallback Function that reads from the DOM
 * @param writeCallback Function that writes to the DOM
 */
export const batchDOMOperations = <T>(
  readCallback: () => T,
  writeCallback: (value: T) => void
): void => {
  // Read from the DOM first (forces layout calculation)
  const value = readCallback();
  
  // Then write to the DOM (minimizes layout recalculations)
  requestAnimationFrame(() => {
    writeCallback(value);
  });
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait = 100
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>): void => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};