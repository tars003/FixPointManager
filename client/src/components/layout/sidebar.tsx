import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
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
  CreditCard,
  Search,
  Activity,
  GraduationCap,
  FileSearch,
  AlertTriangle,
  AlertCircle,
  Truck,
  Gamepad2,
  Tag,
  Receipt,
  BookOpen,
  Eye,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'VehicleVault',
    icon: Car,
    href: '/vehicle-vault',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Book Service',
    icon: Wrench,
    href: '/book-service',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'FASTag & E-Challan',
    icon: Receipt,
    href: '/fastag-echallan',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  {
    title: 'Emergency Services',
    icon: AlertTriangle,
    href: '/emergency',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Nearby Services',
    icon: MapPin,
    href: '/nearby',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Drishti',
    icon: Eye,
    href: '/drishti',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    title: 'TestBeforeBuy',
    icon: Car,
    href: '/autovista',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Marketplace',
    icon: ShoppingBag,
    href: '/marketplace',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Find & Verify Parts',
    icon: FileSearch,
    href: '/parts',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
  },
  {
    title: 'FixPoint Card',
    icon: CreditCard,
    href: '/card',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
  {
    title: 'Learn Driving & RTO',
    icon: GraduationCap,
    href: '/driving-education',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Educational',
    icon: BookOpen,
    href: '/educational',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
  {
    title: 'Arena',
    icon: Gamepad2,
    href: '/arena',
    color: 'text-violet-500',
    bgColor: 'bg-violet-50',
  },
  {
    title: 'Commercial Fleet',
    icon: Truck,
    href: '/commercial-fleet',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Animation Demo',
    icon: Sparkles,
    href: '/animation-demo',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
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

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [location, navigate] = useLocation();
  
  const isActive = (href: string) => {
    if (href === '/') {
      return location === href;
    }
    return location.startsWith(href);
  };
  
  return (
    <aside className={cn("h-full w-64 border-r bg-white flex-shrink-0 hidden md:block", className)}>
      <div className="p-4 flex items-center gap-2 border-b">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white font-semibold">F</span>
        </div>
        <h2 className="font-bold text-lg">FixPoint</h2>
      </div>
      
      <div className="py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <motion.button
              key={item.href}
              className={cn(
                "flex items-center w-full px-2 py-2 text-sm rounded-md group transition-colors",
                isActive(item.href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-neutral-600 hover:bg-neutral-50"
              )}
              onClick={() => navigate(item.href)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={cn(
                  "mr-3 flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center",
                  isActive(item.href) ? item.bgColor : "text-neutral-400"
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
            </motion.button>
          ))}
        </nav>
      </div>
      
      <div className="px-3 py-4 border-t">
        <button 
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md flex items-center justify-center mb-4 animate-pulse transition-colors"
          onClick={() => navigate('/emergency')}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Emergency SOS
        </button>
        
        <p className="px-3 text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
          Account
        </p>
        <nav className="space-y-1">
          {accountItems.map((item) => (
            <motion.button
              key={item.href}
              className={cn(
                "flex items-center w-full px-2 py-2 text-sm rounded-md group transition-colors",
                isActive(item.href)
                  ? "bg-neutral-100 text-neutral-900 font-medium"
                  : "text-neutral-600 hover:bg-neutral-50"
              )}
              onClick={() => navigate(item.href)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={cn(
                  "mr-3 flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center",
                  isActive(item.href) ? item.bgColor : "text-neutral-400"
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
            </motion.button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;