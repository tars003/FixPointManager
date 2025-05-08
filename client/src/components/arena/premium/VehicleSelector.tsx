import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ThumbsUp, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  ArrowLeft, 
  Car,
  Truck,
  ChevronDown,
  Heart
} from 'lucide-react';
import { VehicleModelData, VehicleCategory } from '@shared/arena-schema';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Format price in Indian Rupees
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Get appropriate icon for vehicle category
const getCategoryIcon = (category: VehicleCategory) => {
  switch(category) {
    case 'two-wheeler':
      return <Car size={16} />;
    case 'three-wheeler':
      return <Car size={16} />;
    case 'four-wheeler':
      return <Car size={16} />;
    case 'heavy-vehicle':
      return <Truck size={16} />;
    case 'special':
    default:
      return <Car size={16} />;
  }
};

// Vehicle card component
interface VehicleCardProps {
  vehicle: VehicleModelData;
  onSelect: (vehicle: VehicleModelData) => void;
  isSelected?: boolean;
  view?: 'grid' | 'list';
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelect,
  isSelected = false,
  view = 'grid'
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  if (view === 'list') {
    return (
      <div 
        className={`flex border p-3 rounded-lg transition-all hover:bg-gray-50 ${
          isSelected ? 'border-blue-400 ring-1 ring-blue-400 bg-blue-50' : 'border-gray-200'
        }`}
      >
        <div 
          className="w-24 h-16 bg-gray-100 rounded-md bg-center bg-cover flex-shrink-0"
          style={{ backgroundImage: `url(${vehicle.thumbnailUrl})` }}
        ></div>
        <div className="ml-3 flex-grow">
          <div className="flex justify-between">
            <h3 className="font-medium text-gray-900">{vehicle.name}</h3>
            <button
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
              }`}
              onClick={toggleFavorite}
            >
              <Heart size={14} className={isFavorite ? 'fill-red-500' : ''} />
            </button>
          </div>
          <p className="text-sm text-gray-500">{vehicle.manufacturer} {vehicle.year}</p>
          <div className="flex justify-between items-center mt-1">
            <div className="text-blue-700 font-medium">
              {vehicle.basePrice ? formatPrice(vehicle.basePrice) : 'Price on request'}
            </div>
            <Button 
              size="sm" 
              variant={isSelected ? "default" : "outline"}
              onClick={() => onSelect(vehicle)}
              className="h-7 text-xs"
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className={`overflow-hidden h-full transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-400' : ''
      }`}
    >
      <CardHeader className="p-0 relative">
        <div 
          className="h-40 bg-gray-200 relative bg-cover bg-center"
          style={{ backgroundImage: `url(${vehicle.thumbnailUrl})` }}
        >
          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-black/70 text-white hover:bg-black/80 border-0">
              {getCategoryIcon(vehicle.category)}
              <span className="ml-1 capitalize">{vehicle.category}</span>
            </Badge>
          </div>

          {/* Favorite button */}
          <button
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${
              isFavorite 
                ? 'bg-red-100 text-red-500' 
                : 'bg-white/80 text-gray-600 hover:bg-gray-100'
            }`}
            onClick={toggleFavorite}
          >
            <Heart size={18} className={isFavorite ? 'fill-red-500' : ''} />
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{vehicle.name}</h3>
            <p className="text-sm text-gray-500">{vehicle.manufacturer} {vehicle.year}</p>
          </div>
          {vehicle.popularity && vehicle.popularity > 8 && (
            <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100">
              <ThumbsUp size={12} className="mr-1" /> Popular
            </Badge>
          )}
        </div>
        
        <div className="mt-3">
          <div className="font-medium text-blue-700 text-lg">
            {vehicle.basePrice ? formatPrice(vehicle.basePrice) : 'Price on request'}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t border-gray-100 flex justify-between">
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Info size={14} className="mr-1" /> Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{vehicle.name}</DialogTitle>
              <DialogDescription>
                {vehicle.manufacturer} {vehicle.year}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 space-y-4">
              {vehicle.thumbnailUrl && (
                <img 
                  src={vehicle.thumbnailUrl} 
                  alt={vehicle.name} 
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              
              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-gray-600">{vehicle.description}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Specifications</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-gray-500">Category</div>
                  <div className="capitalize">{vehicle.category}</div>
                  <div className="text-gray-500">Subcategory</div>
                  <div className="capitalize">{vehicle.subcategory}</div>
                  <div className="text-gray-500">Model Code</div>
                  <div>{vehicle.modelCode}</div>
                </div>
              </div>
              
              {vehicle.colors && vehicle.colors.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Available Colors</h4>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.colors.map((color) => (
                        <div 
                          key={color.id} 
                          className="flex items-center gap-1.5"
                        >
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-200" 
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <span className="text-sm">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-900">
                  {vehicle.basePrice ? formatPrice(vehicle.basePrice) : 'Price on request'}
                </div>
                <Button onClick={() => {
                  onSelect(vehicle);
                  setShowDetails(false);
                }}>
                  Select Vehicle
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          onClick={() => onSelect(vehicle)}
          variant={isSelected ? "default" : "secondary"}
        >
          {isSelected ? (
            <>
              <CheckCircle2 size={16} className="mr-1" /> Selected
            </>
          ) : 'Select'}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main vehicle selector component
interface VehicleSelectorProps {
  vehicles: VehicleModelData[];
  selectedVehicle?: number;
  onSelectVehicle: (vehicle: VehicleModelData) => void;
  loading?: boolean;
  error?: string;
  className?: string;
  onContinue?: () => void;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  loading = false,
  error,
  className = '',
  onContinue
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<VehicleCategory | 'all'>('all');
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique manufacturers for filter dropdown
  const manufacturers = Array.from(new Set(vehicles.map(v => v.manufacturer))).sort();
  
  // Get unique years for filter dropdown
  const years = Array.from(new Set(vehicles.map(v => v.year.toString()))).sort((a, b) => parseInt(b) - parseInt(a));

  // Filter the vehicles based on search and filters
  const filteredVehicles = vehicles
    .filter(vehicle => 
      !searchQuery || 
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(vehicle => 
      categoryFilter === 'all' || vehicle.category === categoryFilter
    )
    .filter(vehicle => 
      manufacturerFilter === 'all' || vehicle.manufacturer === manufacturerFilter
    )
    .filter(vehicle => 
      yearFilter === 'all' || vehicle.year.toString() === yearFilter
    );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter and search bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-grow max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            type="text"
            placeholder="Search vehicles..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as VehicleCategory | 'all')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="two-wheeler">Two Wheeler</SelectItem>
              <SelectItem value="three-wheeler">Three Wheeler</SelectItem>
              <SelectItem value="four-wheeler">Four Wheeler</SelectItem>
              <SelectItem value="heavy-vehicle">Heavy Vehicle</SelectItem>
              <SelectItem value="special">Special</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Manufacturer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Manufacturers</SelectItem>
              {manufacturers.map(manufacturer => (
                <SelectItem key={manufacturer} value={manufacturer}>{manufacturer}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* View mode toggle */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
            <TabsList className="grid w-24 grid-cols-2">
              <TabsTrigger value="grid" className="px-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </TabsTrigger>
              <TabsTrigger value="list" className="px-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          {filteredVehicles.length} vehicles found
        </div>
        <div className="flex items-center gap-2">
          {categoryFilter !== 'all' && (
            <Badge variant="outline" className="capitalize">
              {categoryFilter}
            </Badge>
          )}
          {manufacturerFilter !== 'all' && (
            <Badge variant="outline">
              {manufacturerFilter}
            </Badge>
          )}
          {yearFilter !== 'all' && (
            <Badge variant="outline">
              {yearFilter}
            </Badge>
          )}
          
          {(categoryFilter !== 'all' || manufacturerFilter !== 'all' || yearFilter !== 'all') && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => {
                setCategoryFilter('all');
                setManufacturerFilter('all');
                setYearFilter('all');
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Vehicle grid or list */}
      {loading ? (
        <div className={`grid ${
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
        } gap-4 py-6`}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className={`animate-pulse bg-gray-100 rounded-lg ${
                viewMode === 'grid' ? 'h-80' : 'h-20'
              }`}
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <div className="text-red-500 mb-2">{error}</div>
          <Button variant="outline" size="sm">
            Retry
          </Button>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 mb-2">No vehicles match your search</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setManufacturerFilter('all');
              setYearFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className={`grid ${
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
        } gap-4`}>
          <AnimatePresence>
            {filteredVehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <VehicleCard
                  vehicle={vehicle}
                  onSelect={onSelectVehicle}
                  isSelected={selectedVehicle === vehicle.id}
                  view={viewMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Continue button */}
      {selectedVehicle && onContinue && (
        <div className="flex justify-end mt-6">
          <Button 
            onClick={onContinue} 
            size="lg" 
            className="gap-2"
          >
            Continue to Customization
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VehicleSelector;