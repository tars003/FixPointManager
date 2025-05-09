/**
 * Utility function to scroll to the top of the page
 * Can be used directly or within a useEffect hook for route changes
 */
export function scrollToTop() {
  // Use smooth scrolling for better user experience
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/**
 * Usage example in components that handle their own navigation:
 * 
 * import { useLocation } from 'wouter';
 * import { scrollToTop } from '@/utils/scroll-utils';
 * 
 * function YourComponent() {
 *   const [location, navigate] = useLocation();
 *   
 *   const handleNavigation = (path: string) => {
 *     // First scroll to top
 *     scrollToTop();
 *     // Then navigate
 *     navigate(path);
 *   };
 *   
 *   // Use handleNavigation instead of navigate directly
 *   return (
 *     <button onClick={() => handleNavigation('/some-path')}>
 *       Navigate
 *     </button>
 *   );
 * }
 */