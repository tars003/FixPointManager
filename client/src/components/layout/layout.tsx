import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './sidebar';
import MobileHeader from './mobile-header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MobileHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-6xl"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;