import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import PageLoader from './page-loader';

interface LazyPageProps {
  children: React.ReactNode;
}

/**
 * Optimized wrapper for lazy loaded pages
 * Uses simplified animation for better performance
 */
const LazyPage: React.FC<LazyPageProps> = ({ children }) => {
  // Simple fade animation that's light on resources
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeVariants}
      transition={{ 
        duration: 0.2, // Short duration for faster perceived performance
        ease: "easeInOut" 
      }}
    >
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </motion.div>
  );
};

export default LazyPage;