import { useState } from 'react';
import { Check, Filter, ChevronDown, Heart, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface VehicleType {
  id: number;
  name: string;
  manufacturer: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  imageUrl: string;
  category: string;
  features: string[];
}

interface VehicleExplorerProps {
  vehicles: VehicleType[];
}

const VehicleExplorer = ({ vehicles }: VehicleExplorerProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);

  // Sort vehicles
  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (sortBy === "newest") return b.year - a.year;
    if (sortBy === "oldest") return a.year - b.year;
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  // Filter vehicles
  const filteredVehicles = sortedVehicles.filter(vehicle => {
    if (categoryFilter === "all") return true;
    return vehicle.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const viewVehicleDetails = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    setShowDialog(true);
  };

  // Get unique categories
  const categories = ["all", ...new Set(vehicles.map(v => v.category.toLowerCase()))];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Explore Vehicles</h2>
          <p className="text-neutral-light">Discover your next perfect vehicle</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                {categories.map((category) => (
                  <DropdownMenuRadioItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Sort By
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
          <p className="text-neutral-light">Try changing your filter options</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={vehicle.imageUrl} 
                  alt={`${vehicle.manufacturer} ${vehicle.model}`}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-white">
                  {vehicle.category}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-neutral rounded-full h-8 w-8"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-lg">{vehicle.manufacturer} {vehicle.model}</h3>
                  <p className="text-primary font-bold">${vehicle.price.toLocaleString()}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-xs bg-neutral-lightest px-2 py-1 rounded text-center">
                    <span className="block text-neutral-light">Year</span>
                    <span className="font-medium">{vehicle.year}</span>
                  </div>
                  <div className="text-xs bg-neutral-lightest px-2 py-1 rounded text-center">
                    <span className="block text-neutral-light">Fuel</span>
                    <span className="font-medium">{vehicle.fuelType}</span>
                  </div>
                  <div className="text-xs bg-neutral-lightest px-2 py-1 rounded text-center">
                    <span className="block text-neutral-light">Transmission</span>
                    <span className="font-medium">{vehicle.transmission}</span>
                  </div>
                  <div className="text-xs bg-neutral-lightest px-2 py-1 rounded text-center">
                    <span className="block text-neutral-light">Features</span>
                    <span className="font-medium">{vehicle.features.length}</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="default" 
                    className="flex-1 mr-2"
                    onClick={() => viewVehicleDetails(vehicle)}
                  >
                    View Details
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Vehicle Details Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl">
          {selectedVehicle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedVehicle.manufacturer} {selectedVehicle.model}</DialogTitle>
                <DialogDescription>
                  {selectedVehicle.year} • {selectedVehicle.category}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                <img 
                  src={selectedVehicle.imageUrl} 
                  alt={`${selectedVehicle.manufacturer} ${selectedVehicle.model}`}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-neutral-lightest p-3 rounded-lg text-center">
                    <span className="block text-neutral-light text-sm">Year</span>
                    <span className="font-semibold">{selectedVehicle.year}</span>
                  </div>
                  <div className="bg-neutral-lightest p-3 rounded-lg text-center">
                    <span className="block text-neutral-light text-sm">Price</span>
                    <span className="font-semibold">${selectedVehicle.price.toLocaleString()}</span>
                  </div>
                  <div className="bg-neutral-lightest p-3 rounded-lg text-center">
                    <span className="block text-neutral-light text-sm">Fuel Type</span>
                    <span className="font-semibold">{selectedVehicle.fuelType}</span>
                  </div>
                  <div className="bg-neutral-lightest p-3 rounded-lg text-center">
                    <span className="block text-neutral-light text-sm">Transmission</span>
                    <span className="font-semibold">{selectedVehicle.transmission}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedVehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center bg-primary-light text-primary px-3 py-1 rounded-full text-sm">
                      <Check className="h-3 w-3 mr-1" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" className="w-1/2 mr-2">
                    Book Test Drive
                  </Button>
                  <Button className="w-1/2">
                    Reserve Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleExplorer;
