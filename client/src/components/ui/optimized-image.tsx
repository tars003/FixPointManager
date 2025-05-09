import React, { useState, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized image component that:
 * - Supports lazy loading
 * - Shows placeholders while loading
 * - Handles loading errors gracefully
 * - Applies modern sizing and loading attributes for better performance
 */
const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  loading = 'lazy',
  quality = 80, // Default quality set lower for better performance
  fallbackSrc,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [error, setError] = useState(false);

  // Reset states when src changes
  useEffect(() => {
    setIsLoading(!priority);
    setError(false);
  }, [src, priority]);

  // Handle image loading
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    setError(true);
    onError?.();
  };

  // Calculate final image source with quality parameter if needed
  const finalSrc = error && fallbackSrc ? fallbackSrc : src;

  return (
    <div className={cn(
      'relative overflow-hidden',
      className
    )} style={{ width: width || '100%', height: height || 'auto' }}>
      {/* Loading placeholder */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse" 
          style={{ width: '100%', height: '100%' }}
        />
      )}
      
      {/* Actual image */}
      <img
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
        )}
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
        }}
      />
      
      {/* Error fallback */}
      {error && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <span className="text-sm">{alt || 'Image not available'}</span>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;