import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  MapPin, 
  Search, 
  ChevronLeft,
  Car,
  PaintBucket,
  Sofa,
  Settings,
  Package,
  FileText
} from 'lucide-react';

interface ConfiguratorHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  vehicleName?: string;
  vehicleYear?: string;
  brand?: string;
  showBackButton?: boolean;
}

const ConfiguratorHeader: React.FC<ConfiguratorHeaderProps> = ({
  activeTab,
  onTabChange,
  vehicleName = '',
  vehicleYear = '',
  brand = '',
  showBackButton = true
}) => {
  const [, setLocation] = useLocation();
  
  const tabs = [
    { id: 'design', label: 'Design', icon: <Car className="h-4 w-4" /> },
    { id: 'exterior', label: 'Exterior', icon: <PaintBucket className="h-4 w-4" /> },
    { id: 'interior', label: 'Interior', icon: <Sofa className="h-4 w-4" /> },
    { id: 'options', label: 'Options', icon: <Settings className="h-4 w-4" /> },
    { id: 'accessories', label: 'Accessories', icon: <Package className="h-4 w-4" /> },
    { id: 'summary', label: 'Summary', icon: <FileText className="h-4 w-4" /> }
  ];
  
  return (
    <div className="w-full bg-background border-b">
      {/* Top header with brand and account */}
      <div className="w-full bg-black text-white">
        <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Brand logo */}
            <div className="mr-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="2" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="white" />
                <path d="M12 6l-4 6h8l-4-6zM8 14l4 4 4-4H8z" fill="white" />
              </svg>
            </div>
            
            {/* Main navigation */}
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a href="#vehicles" className="text-sm font-medium hover:text-slate-300 transition-colors">Vehicles</a>
                </li>
                <li>
                  <a href="#electric" className="text-sm font-medium hover:text-slate-300 transition-colors">Electric</a>
                </li>
                <li>
                  <a href="#shopping" className="text-sm font-medium hover:text-slate-300 transition-colors">Shopping</a>
                </li>
                <li>
                  <a href="#owners" className="text-sm font-medium hover:text-slate-300 transition-colors">Owners</a>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-slate-800">
              <User className="h-4 w-4 mr-2" />
              <span className="text-xs">My Account</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-slate-800">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-xs">Find a Dealer</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-slate-800">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Configuration tabs */}
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          {showBackButton && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1"
                onClick={() => setLocation('/')}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              
              <Separator orientation="vertical" className="h-6 mx-4" />
            </>
          )}
          
          {(vehicleName || vehicleYear) && (
            <div className="mr-8">
              <h2 className="text-lg font-medium flex items-center">
                {vehicleYear && <span className="mr-2">{vehicleYear}</span>}
                {brand && <span className="mr-1 font-semibold">{brand}</span>}
                {vehicleName}
              </h2>
            </div>
          )}
          
          <nav className="flex-1">
            <ul className="flex">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <Button
                    variant="ghost"
                    className={`relative px-4 py-2 h-16 rounded-none ${
                      activeTab === tab.id 
                        ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 text-blue-600' 
                        : ''
                    }`}
                    onClick={() => onTabChange(tab.id)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {tab.icon}
                      <span className="text-xs">{tab.label}</span>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ConfiguratorHeader;