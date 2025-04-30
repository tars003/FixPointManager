import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import DesktopHeader from './desktop-header';
import MobileHeader from './mobile-header';
import Footer from './footer';
import CustomCursor from '../ui/custom-cursor';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const [showFooter, setShowFooter] = useState(true);
  
  // Check if we're on an Arena page that has issues with the footer
  useEffect(() => {
    // List of routes where we want to hide the footer
    const footerExcludedRoutes = [
      '/arena-studio',
      '/arena/vehicle-selection',
      '/arena/customize',
      '/arena-main',
      '/project'
    ];
    
    const shouldHideFooter = footerExcludedRoutes.some(route => 
      location.startsWith(route)
    );
    
    setShowFooter(!shouldHideFooter);
  }, [location]);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Custom magic wand cursor */}
      <CustomCursor />
      
      <div className="hidden md:block">
        <DesktopHeader />
      </div>
      <div className="block md:hidden">
        <MobileHeader />
      </div>
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;