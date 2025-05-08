import { useLocation, Link } from 'wouter';
import { Car, Calendar, Map, BookOpen, User } from 'lucide-react';

const MobileNav = () => {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };
  
  const linkClass = (path: string) => {
    return `flex flex-col items-center justify-center py-2 w-1/5 ${
      isActive(path) ? 'text-primary' : 'text-neutral-light'
    }`;
  };

  return (
    <nav className="lg:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-30">
      <div className="flex justify-around">
        <Link href="/vehicle-vault">
          <a className={linkClass('/vehicle-vault')}>
            <Car className="h-6 w-6" />
            <span className="text-xs mt-1">Vault</span>
          </a>
        </Link>
        
        <Link href="/book-service">
          <a className={linkClass('/book-service')}>
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Book</span>
          </a>
        </Link>
        
        <Link href="/nearby">
          <a className={linkClass('/nearby')}>
            <Map className="h-6 w-6" />
            <span className="text-xs mt-1">Nearby</span>
          </a>
        </Link>
        
        <Link href="/explore">
          <a className={linkClass('/explore')}>
            <BookOpen className="h-6 w-6" />
            <span className="text-xs mt-1">Explore</span>
          </a>
        </Link>
        
        <Link href="/testbeforebuy">
          <a className={linkClass('/testbeforebuy')}>
            <Car className="h-6 w-6" />
            <span className="text-xs mt-1">TestBeforeBuy</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={linkClass('/profile')}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
