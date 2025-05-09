import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Bell, 
  AlertCircle, 
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NotificationPopover } from '@/components/notification/notification-popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

interface DesktopHeaderProps {
  className?: string;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ className }) => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  
  // Example user data
  const user = {
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    profileImage: '',
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log(`Searching for: ${searchQuery}`);
  };
  
  return (
    <header className={cn("bg-white border-b h-16 sticky top-0 z-40 hidden md:block", className)}>
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Left section - Logo and Search */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <button 
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h3 className="text-xl font-bold">FixPoint</h3>
          </button>
          
          {/* Search bar - matching the provided screenshot */}
          <motion.form 
            className="relative hidden lg:flex items-center"
            onSubmit={handleSearch}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative group">
              <Input
                type="text"
                placeholder="Search vehicles, services, parts..."
                className="w-80 pl-10 pr-4 h-10 bg-gray-50 border border-gray-200 rounded-md text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
              
              <motion.div 
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {searchQuery && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 p-0.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    <span className="sr-only">Clear search</span>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.form>
        </div>
        
        {/* Right section - Actions and User */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher variant="ghost" />
          
          {/* Emergency SOS Button */}
          <Button 
            variant="destructive"
            size="sm"
            className="bg-red-600 hover:bg-red-700 animate-pulse shadow-sm"
            onClick={() => navigate('/emergency')}
          >
            <AlertCircle className="h-4 w-4 mr-1.5" />
            {t('emergency.sos')}
          </Button>
          
          {/* Help */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h4 className="font-semibold">Need help?</h4>
                <p className="text-sm text-gray-500">Get quick assistance with our most common questions</p>
              </div>
              <div className="p-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left rounded-md hover:bg-gray-100 py-2 h-auto"
                  onClick={() => navigate('/help/vehicles')}
                >
                  <div>
                    <p className="font-medium">Vehicle Management</p>
                    <p className="text-xs text-gray-500">Add, edit or manage your vehicles</p>
                  </div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left rounded-md hover:bg-gray-100 py-2 h-auto"
                  onClick={() => navigate('/help/service')}
                >
                  <div>
                    <p className="font-medium">Service Booking</p>
                    <p className="text-xs text-gray-500">Schedule, track or cancel service appointments</p>
                  </div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left rounded-md hover:bg-gray-100 py-2 h-auto"
                  onClick={() => navigate('/help/payments')}
                >
                  <div>
                    <p className="font-medium">Payments & Billing</p>
                    <p className="text-xs text-gray-500">Manage payment methods and view invoices</p>
                  </div>
                </Button>
              </div>
              <div className="p-2 border-t pt-2 pb-1">
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={() => navigate('/help')}
                >
                  View Help Center
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Notifications */}
          <NotificationPopover />
          
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border border-gray-200">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-800 font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-gray-500">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;