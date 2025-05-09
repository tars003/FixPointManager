import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PageLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

/**
 * Optimized page loader component that displays a loading spinner
 * Uses minimal DOM elements to ensure fast rendering
 */
const PageLoader: React.FC<PageLoaderProps> = ({ 
  size = 'md', 
  message 
}) => {
  const { t } = useTranslation();
  const displayMessage = message || t('common.loading');
  
  // Map size to appropriate dimensions
  const dimensions = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 
          className={`${dimensions[size]} animate-spin text-blue-600`} 
          aria-hidden="true"
        />
        <p className="text-gray-600 text-sm font-medium">
          {displayMessage}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;