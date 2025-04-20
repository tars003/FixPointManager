import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NotificationPopover } from '@/components/notification/notification-popover';

// Import the same nav items as sidebar
import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  Clock, 
  MapPin, 
  Wallet, 
  ShoppingBag,
  Building2,
  User,
  Settings,
  Battery,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'My Vehicles',
    icon: Car,
    href: '/vehicles',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Service Booking',
    icon: Wrench,
    href: '/book-service',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Service History',
    icon: Clock,
    href: '/history',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Energy Usage',
    icon: Battery,
    href: '/energy',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
  },
  {
    title: 'Nearby Services',
    icon: MapPin,
    href: '/nearby',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Wallet & Finance',
    icon: Wallet,
    href: '/wallet',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Marketplace',
    icon: ShoppingBag,
    href: '/marketplace',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Commercial Fleet',
    icon: Building2,
    href: '/fleet',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
];

const accountItems = [
  {
    title: 'Profile',
    icon: User,
    href: '/profile',
    color: 'text-neutral-500',
    bgColor: 'bg-neutral-50',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
    color: 'text-neutral-500',
    bgColor: 'bg-neutral-50',
  },
];

interface MobileHeaderProps {
  className?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  
  const isActive = (href: string) => {
    if (href === '/') {
      return location === href;
    }
    return location.startsWith(href);
  };
  
  const handleNav = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };
  
  return (
    <header className={cn("sticky top-0 z-50 w-full bg-white border-b md:hidden", className)}>
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
        
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-semibold text-sm">F</span>
          </div>
          <h1 className="ml-2 text-lg font-semibold">FixPoint</h1>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <NotificationPopover />
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-14 z-50 bg-white"
          >
            <div className="container h-full py-4 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <motion.button
                    key={item.href}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2.5 text-base rounded-md group",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-neutral-600 hover:bg-neutral-50"
                    )}
                    onClick={() => handleNav(item.href)}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "mr-3 flex-shrink-0 h-8 w-8 rounded-md flex items-center justify-center",
                          isActive(item.href) ? item.bgColor : "bg-neutral-100"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4",
                            isActive(item.href) ? item.color : "text-neutral-500"
                          )}
                        />
                      </div>
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </motion.button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t">
                <p className="px-3 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Account
                </p>
                <nav className="space-y-1">
                  {accountItems.map((item) => (
                    <motion.button
                      key={item.href}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2.5 text-base rounded-md group",
                        isActive(item.href)
                          ? "bg-neutral-100 text-neutral-900 font-medium"
                          : "text-neutral-600 hover:bg-neutral-50"
                      )}
                      onClick={() => handleNav(item.href)}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "mr-3 flex-shrink-0 h-8 w-8 rounded-md flex items-center justify-center",
                            isActive(item.href) ? item.bgColor : "bg-neutral-100"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4",
                              isActive(item.href) ? item.color : "text-neutral-500"
                            )}
                          />
                        </div>
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-neutral-400" />
                    </motion.button>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MobileHeader;