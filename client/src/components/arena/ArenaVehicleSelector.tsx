import React, { useState, useEffect } from 'react';
import { Car, Star, ChevronRight, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { VehicleCategory } from '@shared/schema';

// Types for the component
interface ArenaVehicleSelectorProps {
  category: VehicleCategory;
  onSelectVehicle: (id: number) => void;
  selectedVehicleId: number | null;
}

// Mock vehicle data (in a real app this would come from an API)
const demoVehicles = [
  {
    id: 1,
    name: 'Swift DZire',
    manufacturer: 'Maruti Suzuki',
    category: 'four-wheeler',
    subcategory: 'sedan',
    year: 2023,
    thumbnailUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753',
    popularity: 85
  },
  {
    id: 2,
    name: 'Thar',
    manufacturer: 'Mahindra',
    category: 'four-wheeler',
    subcategory: 'suv',
    year: 2023,
    thumbnailUrl: 'https://images.unsplash.com/photo-1669809048335-b79ea6a66790',
    popularity: 92
  },
  {
    id: 3,
    name: 'Royal Enfield Classic 350',
    manufacturer: 'Royal Enfield',
    category: 'two-wheeler',
    subcategory: 'cruiser',
    year: 2023,
    thumbnailUrl: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e',
    popularity: 88
  },
  {
    id: 4,
    name: 'Activa 6G',
    manufacturer: 'Honda',
    category: 'two-wheeler',
    subcategory: 'scooter',
    year: 2023,
    thumbnailUrl: 'https://images.unsplash.com/photo-1619771914272-1cc844827bde',
    popularity: 90
  },
  {
    id: 5,
    name: 'Auto Rickshaw',
    manufacturer: 'Bajaj',
    category: 'three-wheeler',
    subcategory: 'auto',
    year: 2023,
    thumbnailUrl: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca',
    popularity: 75
  },
  {
    id: 6,
    name: 'Volvo 9400XL',
    manufacturer: 'Volvo',
    category: 'heavy-vehicle',
    subcategory: 'bus',
    year: 2023,
    thumbnailUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e',
    popularity: 82
  },
  {
    id: 7,
    name: 'Tata Prima',
    manufacturer: 'Tata Motors',
    category: 'heavy-vehicle',
    subcategory: 'truck',
    year: 2023,
    thumbnailUrl: 'https://images.unsplash.com/photo-1525130413817-d45c1d127c42',
    popularity: 78
  }
];

const ArenaVehicleSelector: React.FC<ArenaVehicleSelectorProps> = ({
  category,
  onSelectVehicle,
  selectedVehicleId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState(demoVehicles);
  
  // Filter vehicles when category or search query changes
  useEffect(() => {
    const filtered = demoVehicles.filter(vehicle => {
      // Filter by category
      const categoryMatch = vehicle.category === category;
      
      // Filter by search term
      const searchTerms = searchQuery.toLowerCase().split(' ');
      const matchesSearch = searchQuery === '' || searchTerms.every(term => 
        vehicle.name.toLowerCase().includes(term) || 
        vehicle.manufacturer.toLowerCase().includes(term) ||
        vehicle.subcategory.toLowerCase().includes(term)
      );
      
      return categoryMatch && matchesSearch;
    });
    
    setFilteredVehicles(filtered);
  }, [category, searchQuery]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Vehicle Models</CardTitle>
        <CardDescription>Select a vehicle to customize</CardDescription>
        
        <div className="mt-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[260px]">
          <div className="px-4 pb-4 space-y-2">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className={`
                    rounded-lg p-3 cursor-pointer transition-colors
                    ${selectedVehicleId === vehicle.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-accent'}
                  `}
                  onClick={() => onSelectVehicle(vehicle.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-secondary/40 shrink-0 flex items-center justify-center">
                      {vehicle.thumbnailUrl ? (
                        <div 
                          className="w-full h-full rounded-md bg-cover bg-center" 
                          style={{ backgroundImage: `url(${vehicle.thumbnailUrl})` }}
                        />
                      ) : (
                        <Car className="text-muted-foreground h-6 w-6" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium truncate">
                          {vehicle.name}
                        </h4>
                        {vehicle.popularity > 85 && (
                          <Badge variant="secondary" className="ml-2">
                            <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {vehicle.manufacturer} • {vehicle.year}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {vehicle.subcategory}
                      </p>
                    </div>
                    
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Car className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No vehicles found. Try a different search.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t pt-3 pb-2 flex justify-between">
        <Button variant="outline" size="sm" disabled={!selectedVehicleId}>
          View Details
        </Button>
        <Button variant="secondary" size="sm" disabled={!selectedVehicleId} className="ml-auto">
          Select Model
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArenaVehicleSelector;