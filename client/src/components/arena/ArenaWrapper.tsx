import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ArenaWrapperProps {
  children: ReactNode;
}

/**
 * A wrapper component for Arena pages with shared animations and styling
 */
const ArenaWrapper: React.FC<ArenaWrapperProps> = ({ children }) => {
  return (
    <motion.div 
      className="h-screen w-full flex flex-col overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

export default ArenaWrapper;