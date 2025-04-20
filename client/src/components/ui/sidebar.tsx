import { Link, useLocation } from 'wouter';
import { 
  Car, 
  Calendar, 
  Map, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Heart 
} from 'lucide-react';

const Sidebar = () => {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };
  
  const linkClass = (path: string) => {
    return `flex items-center px-4 py-2 text-neutral-dark rounded-md ${
      isActive(path) 
        ? 'bg-neutral-lightest text-primary font-medium' 
        : 'hover:bg-neutral-lightest'
    }`;
  };
  
  const iconClass = (path: string) => {
    return `h-5 w-5 mr-3 ${isActive(path) ? 'text-primary' : 'text-neutral-light'}`;
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-primary rounded-md p-1.5 mr-2">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-neutral-dark">FixPoint</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <Link href="/vehicles">
          <a className={linkClass('/vehicles')}>
            <Car className={iconClass('/vehicles')} />
            My Vehicles
          </a>
        </Link>
        
        <Link href="/book-service">
          <a className={linkClass('/book-service')}>
            <Calendar className={iconClass('/book-service')} />
            Book Service
          </a>
        </Link>
        
        <Link href="/nearby">
          <a className={linkClass('/nearby')}>
            <Map className={iconClass('/nearby')} />
            Nearby
          </a>
        </Link>
        
        <Link href="/explore">
          <a className={linkClass('/explore')}>
            <BookOpen className={iconClass('/explore')} />
            Explore
          </a>
        </Link>
        
        <Link href="/learn-driving">
          <a className={linkClass('/learn-driving')}>
            <GraduationCap className={iconClass('/learn-driving')} />
            Learn Driving
          </a>
        </Link>
        
        <div className="pt-4 border-t border-gray-200 mt-4">
          <h3 className="px-4 text-xs font-semibold text-neutral-light uppercase tracking-wider">
            Account
          </h3>
        </div>
        
        <Link href="/settings">
          <a className={linkClass('/settings')}>
            <Settings className={iconClass('/settings')} />
            Settings
          </a>
        </Link>
        
        <Link href="/logout">
          <a className={linkClass('/logout')}>
            <LogOut className={iconClass('/logout')} />
            Logout
          </a>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
