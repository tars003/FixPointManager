import React from 'react';
import { Check, Star, Bookmark, Car, Truck, Bike } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

// Types for the component
interface ArenaVehicleSelectorProps {
  onSelectVehicle: (id: number) => void;
  selectedVehicleId: number | null;
}

// Mock vehicle data
interface Vehicle {
  id: number;
  name: string;
  category: 'two-wheeler' | 'four-wheeler' | 'special';
  type: string;
  brand: string;
  imageUrl: string;
  popularity: number;
  isNewModel: boolean;
  rating: number;
  isFavorite: boolean;
}

// Vehicle data mock
const vehicles: Vehicle[] = [
  // Cars
  {
    id: 1,
    name: 'Swift DZire',
    category: 'four-wheeler',
    type: 'Sedan',
    brand: 'Maruti Suzuki',
    imageUrl: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106257/dzire-exterior-right-front-three-quarter-2.jpeg',
    popularity: 82,
    isNewModel: false,
    rating: 4.3,
    isFavorite: true
  },
  {
    id: 2,
    name: 'Thar',
    category: 'four-wheeler',
    type: 'SUV',
    brand: 'Mahindra',
    imageUrl: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg',
    popularity: 93,
    isNewModel: true,
    rating: 4.7,
    isFavorite: true
  },
  {
    id: 3,
    name: 'Creta',
    category: 'four-wheeler',
    type: 'SUV',
    brand: 'Hyundai',
    imageUrl: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-2.jpeg',
    popularity: 88,
    isNewModel: false,
    rating: 4.5,
    isFavorite: false
  },
  {
    id: 4,
    name: 'XUV700',
    category: 'four-wheeler',
    type: 'SUV',
    brand: 'Mahindra',
    imageUrl: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter.jpeg',
    popularity: 91,
    isNewModel: false,
    rating: 4.6,
    isFavorite: false
  },
  {
    id: 5,
    name: 'City',
    category: 'four-wheeler',
    type: 'Sedan',
    brand: 'Honda',
    imageUrl: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-hybrid-exterior-right-front-three-quarter.jpeg',
    popularity: 85,
    isNewModel: true,
    rating: 4.4,
    isFavorite: false
  },
  
  // Bikes
  {
    id: 6,
    name: 'Splendor Plus',
    category: 'two-wheeler',
    type: 'Commuter',
    brand: 'Hero',
    imageUrl: 'https://imgd.aeplcdn.com/393x221/bw/models/hero-splendor-plus-self-alloy-wheel-spoke-ks--new-bs6-202101120519.jpg',
    popularity: 96,
    isNewModel: false,
    rating: 4.2,
    isFavorite: false
  },
  {
    id: 7,
    name: 'Royal Enfield Classic 350',
    category: 'two-wheeler',
    type: 'Cruiser',
    brand: 'Royal Enfield',
    imageUrl: 'https://imgd.aeplcdn.com/393x221/bw/models/royal-enfield-classic-350-single-channel-abs--bs6-gunmetal-grey-dual-tone20200803140042.jpg',
    popularity: 92,
    isNewModel: false,
    rating: 4.5,
    isFavorite: true
  },
  {
    id: 8,
    name: 'Pulsar 150',
    category: 'two-wheeler',
    type: 'Sport',
    brand: 'Bajaj',
    imageUrl: 'https://imgd.aeplcdn.com/393x221/bw/models/bajaj-pulsar-150-dual-disc--twin-disc--abs--bs620210316134628.jpg',
    popularity: 87,
    isNewModel: false,
    rating: 4.1,
    isFavorite: false
  },
  
  // Special
  {
    id: 9,
    name: 'Fortuner',
    category: 'special',
    type: 'Premium SUV',
    brand: 'Toyota',
    imageUrl: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-19.jpeg',
    popularity: 89,
    isNewModel: true,
    rating: 4.8,
    isFavorite: true
  },
  {
    id: 10,
    name: 'YZF R15',
    category: 'special',
    type: 'Sport Bike',
    brand: 'Yamaha',
    imageUrl: 'https://imgd.aeplcdn.com/393x221/bw/models/yamaha-yzf-r15-v4-racing-blue20210921190115.jpg',
    popularity: 90,
    isNewModel: true,
    rating: 4.7,
    isFavorite: true
  }
];

const ArenaVehicleSelector: React.FC<ArenaVehicleSelectorProps> = ({
  onSelectVehicle,
  selectedVehicleId
}) => {
  // Filter vehicles by category
  const cars = vehicles.filter(v => v.category === 'four-wheeler');
  const bikes = vehicles.filter(v => v.category === 'two-wheeler');
  const special = vehicles.filter(v => v.category === 'special');
  
  return (
    <Tabs defaultValue="cars" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="cars" className="flex items-center gap-1">
          <Car className="h-4 w-4" />
          <span className="hidden sm:inline">Cars</span>
        </TabsTrigger>
        <TabsTrigger value="bikes" className="flex items-center gap-1">
          <Bike className="h-4 w-4" />
          <span className="hidden sm:inline">Bikes</span>
        </TabsTrigger>
        <TabsTrigger value="special" className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          <span className="hidden sm:inline">Special</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="cars" className="mt-3">
        <VehicleList
          vehicles={cars}
          onSelectVehicle={onSelectVehicle}
          selectedVehicleId={selectedVehicleId}
        />
      </TabsContent>
      
      <TabsContent value="bikes" className="mt-3">
        <VehicleList
          vehicles={bikes}
          onSelectVehicle={onSelectVehicle}
          selectedVehicleId={selectedVehicleId}
        />
      </TabsContent>
      
      <TabsContent value="special" className="mt-3">
        <VehicleList
          vehicles={special}
          onSelectVehicle={onSelectVehicle}
          selectedVehicleId={selectedVehicleId}
        />
      </TabsContent>
    </Tabs>
  );
};

// VehicleList component to display vehicles
const VehicleList: React.FC<{
  vehicles: Vehicle[];
  onSelectVehicle: (id: number) => void;
  selectedVehicleId: number | null;
}> = ({ vehicles, onSelectVehicle, selectedVehicleId }) => {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={selectedVehicleId === vehicle.id}
            onClick={() => onSelectVehicle(vehicle.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

// VehicleCard component to display individual vehicle details
const VehicleCard: React.FC<{
  vehicle: Vehicle;
  isSelected: boolean;
  onClick: () => void;
}> = ({ vehicle, isSelected, onClick }) => {
  // Format ratings
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-0.5" />
        <span className="text-xs font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div
      className={`
        relative flex items-center p-2 rounded-md cursor-pointer transition-all
        ${isSelected 
          ? 'bg-primary/10 border-primary border' 
          : 'bg-card hover:bg-accent/50 border border-border'}
      `}
      onClick={onClick}
    >
      {/* Vehicle image */}
      <div className="w-16 h-16 rounded-md overflow-hidden mr-3 flex-shrink-0 bg-muted">
        <img
          src={vehicle.imageUrl}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Vehicle details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-medium truncate">{vehicle.name}</h4>
            <p className="text-xs text-muted-foreground">
              {vehicle.brand} · {vehicle.type}
            </p>
          </div>
          
          {isSelected && (
            <Check className="h-4 w-4 text-primary shrink-0" />
          )}
        </div>
        
        <div className="flex items-center mt-1 gap-2">
          {renderRating(vehicle.rating)}
          
          {vehicle.isNewModel && (
            <Badge variant="secondary" className="h-5 text-[10px] px-1.5">
              New
            </Badge>
          )}
          
          {vehicle.isFavorite && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Bookmark className="h-3 w-3 text-primary fill-primary" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Favorite</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArenaVehicleSelector;