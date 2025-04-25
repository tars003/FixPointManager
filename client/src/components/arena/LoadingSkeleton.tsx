import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  type: 'full-page' | 'card' | 'item' | 'table';
  rows?: number;
  columns?: number;
}

/**
 * Enhanced loading skeleton with animations for different UI elements
 */
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  rows = 3,
  columns = 2
}) => {
  // Skeleton pulse animation
  const pulseAnimation = {
    initial: { opacity: 0.6 },
    animate: { 
      opacity: [0.6, 0.9, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  // Render a full page loading skeleton
  const renderFullPage = () => {
    return (
      <div className="h-full w-full flex flex-col">
        {/* Header skeleton */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="h-8 w-24 bg-gray-200 rounded-md"
              {...pulseAnimation}
            />
            <motion.div 
              className="h-8 w-64 bg-gray-200 rounded-md"
              {...pulseAnimation}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.div 
              className="h-8 w-8 bg-gray-200 rounded-full"
              {...pulseAnimation}
            />
            <motion.div 
              className="h-8 w-24 bg-gray-200 rounded-md"
              {...pulseAnimation}
            />
            <motion.div 
              className="h-8 w-8 bg-gray-200 rounded-full"
              {...pulseAnimation}
            />
          </div>
        </div>
        
        {/* Tabs skeleton */}
        <div className="border-b bg-gray-50 px-4 py-1">
          <div className="flex items-center space-x-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div 
                key={i}
                className="h-8 w-24 bg-gray-200 rounded-md"
                {...pulseAnimation}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
        
        {/* Main content skeleton */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Banner skeleton */}
          <motion.div 
            className="w-full h-48 mb-8 bg-gray-200 rounded-xl"
            {...pulseAnimation}
          />
          
          {/* Card grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div 
                key={i}
                className="h-32 bg-gray-200 rounded-lg"
                {...pulseAnimation}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          
          {/* Content section skeleton */}
          <motion.div 
            className="h-8 w-48 bg-gray-200 rounded-md mb-4"
            {...pulseAnimation}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div 
                key={i}
                className="h-64 bg-gray-200 rounded-lg"
                {...pulseAnimation}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render a card skeleton
  const renderCard = () => {
    return (
      <motion.div 
        className="w-full h-full flex flex-col overflow-hidden rounded-lg bg-white border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Card header */}
        <div className="p-4 border-b">
          <motion.div 
            className="h-6 w-3/4 bg-gray-200 rounded-md mb-2"
            {...pulseAnimation}
          />
          <motion.div 
            className="h-4 w-2/4 bg-gray-100 rounded-md"
            {...pulseAnimation}
          />
        </div>
        
        {/* Card content */}
        <div className="p-4 flex-1">
          {Array.from({ length: rows }).map((_, i) => (
            <motion.div 
              key={i}
              className="h-6 bg-gray-200 rounded-md mb-3 last:mb-0"
              style={{ 
                width: `${Math.random() * 30 + 70}%`,
                animationDelay: `${i * 0.1}s` 
              }}
              {...pulseAnimation}
            />
          ))}
        </div>
        
        {/* Card footer */}
        <div className="p-4 border-t flex justify-end">
          <motion.div 
            className="h-8 w-24 bg-gray-200 rounded-md"
            {...pulseAnimation}
          />
        </div>
      </motion.div>
    );
  };
  
  // Render item skeletons (like in a list)
  const renderItems = () => {
    return (
      <div className="space-y-4 w-full">
        {Array.from({ length: rows }).map((_, i) => (
          <motion.div 
            key={i}
            className="flex items-center p-3 border rounded-lg bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: i * 0.05 }
            }}
          >
            <motion.div 
              className="h-10 w-10 rounded-full bg-gray-200 mr-3"
              {...pulseAnimation}
            />
            <div className="flex-1">
              <motion.div 
                className="h-5 bg-gray-200 rounded-md mb-2 w-1/3"
                {...pulseAnimation}
              />
              <motion.div 
                className="h-4 bg-gray-100 rounded-md w-2/3"
                {...pulseAnimation}
              />
            </div>
            <motion.div 
              className="h-8 w-20 bg-gray-200 rounded-md"
              {...pulseAnimation}
            />
          </motion.div>
        ))}
      </div>
    );
  };
  
  // Render a table skeleton
  const renderTable = () => {
    return (
      <div className="w-full overflow-hidden border rounded-lg bg-white">
        {/* Table header */}
        <div className="grid border-b p-3 bg-gray-50" 
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <motion.div 
              key={i}
              className="h-6 bg-gray-200 rounded-md mx-2"
              {...pulseAnimation}
            />
          ))}
        </div>
        
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={rowIndex}
            className={`grid p-3 ${rowIndex !== rows - 1 ? 'border-b' : ''}`}
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <motion.div 
                key={colIndex}
                className="h-5 bg-gray-100 rounded-md mx-2"
                style={{ 
                  width: `${Math.random() * 30 + 70}%`,
                  animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s` 
                }}
                {...pulseAnimation}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  // Render the appropriate skeleton based on type
  switch (type) {
    case 'full-page':
      return renderFullPage();
    case 'item':
      return renderItems();
    case 'table':
      return renderTable();
    case 'card':
    default:
      return renderCard();
  }
};

export default LoadingSkeleton;