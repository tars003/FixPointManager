import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  ChevronRight, 
  InfoIcon, 
  LockIcon, 
  Zap, 
  Star 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Types for the component
interface CustomizationPanelProps {
  category: string;
  subcategory: string;
  vehicleId: number | null;
  onSelectItem?: (itemId: number) => void;
}

// Mock customization items (in a real app this would come from an API)
interface CustomizationItem {
  id: number;
  name: string;
  description: string;
  thumbnailUrl?: string;
  price: number;
  currency: string;
  category: string;
  subcategory: string;
  compatibleVehicleIds: number[];
  installationDifficulty: number; // 1-5
  popularity: number; // 0-100
  pointsRequired: number;
  isLocked: boolean;
}

// Mock data for customization items
const mockCustomizationItems: CustomizationItem[] = [
  // Exterior - Body Kits
  {
    id: 101,
    name: 'Sport Body Kit',
    description: 'Aggressive aerodynamic design with front splitter and side skirts',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341',
    price: 28000,
    currency: 'INR',
    category: 'exterior',
    subcategory: 'body-kits',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 4,
    popularity: 85,
    pointsRequired: 0,
    isLocked: false
  },
  {
    id: 102,
    name: 'Premium Aero Kit',
    description: 'High-end carbon fiber body kit with superior aerodynamics',
    thumbnailUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a',
    price: 45000,
    currency: 'INR',
    category: 'exterior',
    subcategory: 'body-kits',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 5,
    popularity: 92,
    pointsRequired: 150,
    isLocked: true
  },
  
  // Exterior - Spoilers
  {
    id: 201,
    name: 'Low Profile Spoiler',
    description: 'Subtle spoiler that enhances style without being too flashy',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590214074321-7054d45a373f',
    price: 8500,
    currency: 'INR',
    category: 'exterior',
    subcategory: 'spoilers',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 2,
    popularity: 78,
    pointsRequired: 0,
    isLocked: false
  },
  {
    id: 202,
    name: 'GT Wing Spoiler',
    description: 'High-performance racing spoiler with adjustable angle',
    thumbnailUrl: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d109',
    price: 12000,
    currency: 'INR',
    category: 'exterior',
    subcategory: 'spoilers',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 3,
    popularity: 65,
    pointsRequired: 100,
    isLocked: true
  },
  
  // Exterior - Headlights
  {
    id: 301,
    name: 'LED Matrix Headlights',
    description: 'Advanced LED headlights with dynamic light pattern',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556800572-1b8aeef2c54f',
    price: 15000,
    currency: 'INR',
    category: 'exterior',
    subcategory: 'headlights',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 3,
    popularity: 88,
    pointsRequired: 0,
    isLocked: false
  },
  {
    id: 302,
    name: 'Smoked Projector Headlights',
    description: 'Stylish smoked headlights with projector technology',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de',
    price: 9800,
    currency: 'INR',
    category: 'exterior',
    subcategory: 'headlights',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 3,
    popularity: 72,
    pointsRequired: 75,
    isLocked: true
  },
  
  // Interior - Seats
  {
    id: 401,
    name: 'Sport Bucket Seats',
    description: 'Racing-inspired bucket seats with improved lateral support',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551761429-8232f9f5955c',
    price: 24000,
    currency: 'INR',
    category: 'interior',
    subcategory: 'seats',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 2,
    popularity: 76,
    pointsRequired: 0,
    isLocked: false
  },
  {
    id: 402,
    name: 'Premium Leather Seats',
    description: 'Luxury leather seats with heating and ventilation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1659287390287-e2531de44409',
    price: 35000,
    currency: 'INR',
    category: 'interior',
    subcategory: 'seats',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 3,
    popularity: 92,
    pointsRequired: 125,
    isLocked: true
  },
  
  // Interior - Dashboard
  {
    id: 501,
    name: 'Carbon Fiber Trim',
    description: 'Lightweight carbon fiber dashboard trim panels',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551829723-b485c7621957',
    price: 7500,
    currency: 'INR',
    category: 'interior',
    subcategory: 'dashboard',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 2,
    popularity: 84,
    pointsRequired: 0,
    isLocked: false
  },
  {
    id: 502,
    name: 'Digital Dashboard Upgrade',
    description: 'Full digital dashboard with customizable displays',
    thumbnailUrl: 'https://images.unsplash.com/photo-1494905998402-395d579af36f',
    price: 22000,
    currency: 'INR',
    category: 'interior',
    subcategory: 'dashboard',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 4,
    popularity: 89,
    pointsRequired: 200,
    isLocked: true
  },
  
  // Performance - Engine
  {
    id: 601,
    name: 'Performance Chip',
    description: 'ECU tuning chip for improved power and throttle response',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581288696726-7671d94c8c5f',
    price: 8000,
    currency: 'INR',
    category: 'performance',
    subcategory: 'engine',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 2,
    popularity: 75,
    pointsRequired: 0,
    isLocked: false
  },
  {
    id: 602,
    name: 'Turbocharger Kit',
    description: 'Complete turbocharger system for significant power increase',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536584754829-12214d439f0a',
    price: 85000,
    currency: 'INR',
    category: 'performance',
    subcategory: 'engine',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 5,
    popularity: 90,
    pointsRequired: 250,
    isLocked: true
  },
  
  // Wheels - Rims
  {
    id: 701,
    name: 'Split-Spoke Alloy Wheels',
    description: 'Lightweight alloy wheels with split-spoke design',
    thumbnailUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d',
    price: 16000,
    currency: 'INR',
    category: 'wheels',
    subcategory: 'rims',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 2,
    popularity: 82,
    pointsRequired: 0,
    isLocked: false
  },
  {
    id: 702,
    name: 'Forged Racing Wheels',
    description: 'Lightweight forged wheels designed for performance',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611921561569-f8c0147b6fe4',
    price: 32000,
    currency: 'INR',
    category: 'wheels',
    subcategory: 'rims',
    compatibleVehicleIds: [1, 2],
    installationDifficulty: 2,
    popularity: 88,
    pointsRequired: 175,
    isLocked: true
  },
];

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  category,
  subcategory,
  vehicleId,
  onSelectItem
}) => {
  const [filteredItems, setFilteredItems] = useState<CustomizationItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
  // Filter customization items based on category, subcategory, and vehicleId
  useEffect(() => {
    const filtered = mockCustomizationItems.filter(item => {
      const categoryMatch = item.category === category;
      const subcategoryMatch = item.subcategory === subcategory;
      const vehicleCompatible = vehicleId ? item.compatibleVehicleIds.includes(vehicleId) : true;
      
      return categoryMatch && subcategoryMatch && vehicleCompatible;
    });
    
    setFilteredItems(filtered);
    
    // Reset selection when filters change
    setSelectedItemId(null);
  }, [category, subcategory, vehicleId]);
  
  // Handle item selection
  const handleSelectItem = (id: number) => {
    setSelectedItemId(id);
    if (onSelectItem) {
      onSelectItem(id);
    }
  };
  
  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };
  
  // Render difficulty level indicators
  const renderDifficultyLevel = (level: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index}
            className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
              index < level ? 'bg-orange-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-3">
      {filteredItems.length > 0 ? (
        filteredItems.map(item => (
          <div
            key={item.id}
            className={`
              relative rounded-lg border transition-all
              ${selectedItemId === item.id 
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent'}
              ${item.isLocked ? 'opacity-80' : 'cursor-pointer'}
            `}
            onClick={() => !item.isLocked && handleSelectItem(item.id)}
          >
            {/* Locked overlay */}
            {item.isLocked && (
              <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                <div className="bg-background/80 rounded-md px-3 py-2 flex items-center gap-2 border shadow-sm">
                  <LockIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">
                    Unlock with {item.pointsRequired} points
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex p-3">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-secondary/40 mr-3 shadow-sm">
                {item.thumbnailUrl ? (
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-xs text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium leading-tight">{item.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  
                  {item.popularity > 80 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 shrink-0">
                      <Star className="h-3 w-3 mr-0.5 fill-amber-400 text-amber-400" />
                      <span className="text-[10px]">Top</span>
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center mr-2">
                            <span className="text-xs font-medium">
                              {formatPrice(item.price, item.currency)}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">Installation cost not included</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-1">Difficulty:</span>
                            {renderDifficultyLevel(item.installationDifficulty)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">
                            Installation difficulty: {item.installationDifficulty}/5
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  {selectedItemId === item.id && (
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="flex flex-col items-center">
            <InfoIcon className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No customization options available for this selection.
            </p>
            {vehicleId === null && (
              <p className="text-xs text-muted-foreground mt-1">
                Please select a vehicle first.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationPanel;