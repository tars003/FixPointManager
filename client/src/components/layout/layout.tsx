import React, { ReactNode } from 'react';
import DesktopHeader from './desktop-header';
import MobileHeader from './mobile-header';
import Footer from './footer';
import CustomCursor from '../ui/custom-cursor';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
      
      <Footer />
    </div>
  );
};

export default Layout;