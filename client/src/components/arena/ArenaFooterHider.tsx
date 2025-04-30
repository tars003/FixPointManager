import React, { ReactNode, useEffect } from 'react';

interface ArenaFooterHiderProps {
  children: ReactNode;
}

/**
 * This component injects CSS that hides the footer specifically for Arena pages
 */
const ArenaFooterHider: React.FC<ArenaFooterHiderProps> = ({ children }) => {
  useEffect(() => {
    // Create and inject a style element to hide the footer
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      footer {
        display: none !important;
      }
      
      /* Add extra padding at the bottom to ensure content is visible */
      main {
        margin-bottom: 100px !important;
      }
    `;
    
    document.head.appendChild(styleElement);
    
    // Clean up the style element when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return <>{children}</>;
};

export default ArenaFooterHider;