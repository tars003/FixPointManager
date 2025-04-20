import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { ChevronLeft, Search, Bell } from 'lucide-react';

const MobileHeader = () => {
  const [location] = useLocation();
  const [title, setTitle] = useState('My Vehicles');
  const [showBackButton, setShowBackButton] = useState(false);
  
  useEffect(() => {
    // Update title and back button based on route
    switch (true) {
      case location.startsWith('/vehicles'):
        setTitle('My Vehicles');
        setShowBackButton(false);
        break;
      case location.startsWith('/book-service'):
        setTitle('Book Service');
        setShowBackButton(location !== '/book-service');
        break;
      case location.startsWith('/nearby'):
        setTitle('Nearby Services');
        setShowBackButton(false);
        break;
      case location.startsWith('/explore'):
        setTitle('Explore Vehicles');
        setShowBackButton(false);
        break;
      case location.startsWith('/learn-driving'):
        setTitle('Learn Driving');
        setShowBackButton(false);
        break;
      case location.startsWith('/dashboard'):
        setTitle('Dashboard');
        setShowBackButton(false);
        break;
      case location.startsWith('/inspection'):
        setTitle('Inspection Report');
        setShowBackButton(true);
        break;
      case location.startsWith('/energy'):
        setTitle('Energy Usage');
        setShowBackButton(true);
        break;
      default:
        setTitle('FixPoint');
        setShowBackButton(location !== '/');
    }
  }, [location]);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm lg:hidden">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center">
          {showBackButton ? (
            <button onClick={handleBack} className="mr-2 p-1">
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : null}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 ml-2">
            <Bell className="h-5 w-5" />
          </button>
          <Link href="/profile">
            <a className="ml-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
              <span>JD</span>
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
