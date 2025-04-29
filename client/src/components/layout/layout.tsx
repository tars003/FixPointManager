import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './sidebar';
import MobileHeader from './mobile-header';
import DesktopHeader from './desktop-header';
import Footer from './footer';
import { useLocation } from 'wouter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  
  // Determine if the current page should have a simplified layout
  // This is useful for pages like login, register, or full-screen experiences
  const isSimplifiedLayout = [
    '/auth',
    '/login',
    '/register',
    '/arena-customize'
  ].some(path => location.startsWith(path));
  
  // Determine if the current page should have a footer
  // Some pages might look better without a footer (e.g., full-screen maps)
  const shouldShowFooter = ![
    '/nearby', // Map view
    '/emergency' // Emergency services
  ].some(path => location === path);
  
  if (isSimplifiedLayout) {
    // Simplified layout without sidebar, headers, etc.
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Mobile header (visible on small screens) */}
      <MobileHeader />
      
      {/* Desktop header (visible on medium screens and above) */}
      <DesktopHeader />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (visible on medium screens and above) */}
        <Sidebar />
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 flex flex-col">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-6xl w-full flex-1"
          >
            {children}
          </motion.div>
          
          {/* Footer - conditionally shown */}
          {shouldShowFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};

export default Layout;