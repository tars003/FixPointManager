import { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { Link } from 'wouter';

type NavbarProps = {
  title: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
};

const Navbar = ({ 
  title, 
  showSearch = true, 
  showNotifications = true, 
  showUserMenu = true 
}: NavbarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  
  return (
    <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        {!searchOpen && <h1 className="text-lg font-semibold">{title}</h1>}
        {searchOpen && (
          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              className="pl-8 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        {showSearch && !searchOpen && (
          <button 
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Search className="h-5 w-5" />
          </button>
        )}
        
        {showNotifications && (
          <button className="p-2 rounded-full hover:bg-gray-100 ml-2">
            <Bell className="h-5 w-5" />
          </button>
        )}
        
        {showUserMenu && (
          <Link href="/profile">
            <a className="ml-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer">
              <span>JD</span>
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
