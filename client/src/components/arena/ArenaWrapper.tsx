import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import ArenaFooterHider from './ArenaFooterHider';

interface ArenaWrapperProps {
  children: ReactNode;
}

/**
 * A wrapper component for Arena pages with shared animations and styling
 */
const ArenaWrapper: React.FC<ArenaWrapperProps> = ({ children }) => {
  return (
    <ArenaFooterHider>
      <motion.div 
        className="min-h-screen w-full flex flex-col overflow-auto bg-background pb-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </ArenaFooterHider>
  );
};

export default ArenaWrapper;