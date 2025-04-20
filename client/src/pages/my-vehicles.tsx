import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  Car,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  Filter,
  ChevronRight
} from 'lucide-react';
import { Vehicle } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/format';

// Mock user
const user = {
  name: 'Raj',
  id: 1
};

// Filter options
const FUEL_TYPES = ['Electric', 'Hybrid', 'Petrol', 'Diesel'];
const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020'];
const MAKES = ['Toyota', 'Honda', 'Tesla', 'Tata', 'Volkswagen'];

const MyVehicles = () => {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    fuelTypes: string[];
    years: string[];
    makes: string[];
  }>({
    fuelTypes: [],
    years: [],
    makes: []
  });
  
  // Fetch vehicles
  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles', { userId: user.id }],
    enabled: !!user.id,
  });
  
  // Handle filter changes
  const toggleFilter = (type: 'fuelTypes' | 'years' | 'makes', value: string) => {
    setActiveFilters(prev => {
      const currentFilters = [...prev[type]];
      const index = currentFilters.indexOf(value);
      
      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }
      
      return {
        ...prev,
        [type]: currentFilters
      };
    });
  };
  
  // Filter and search vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    // Search filter
    if (searchTerm && !vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Fuel type filter
    if (activeFilters.fuelTypes.length > 0 && vehicle.fuelType &&
        !activeFilters.fuelTypes.includes(vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1))) {
      return false;
    }
    
    // Year filter
    if (activeFilters.years.length > 0 && 
        !activeFilters.years.includes(vehicle.year.toString())) {
      return false;
    }
    
    // Make filter
    if (activeFilters.makes.length > 0 &&
        !activeFilters.makes.includes(vehicle.make.charAt(0).toUpperCase() + vehicle.make.slice(1))) {
      return false;
    }
    
    return true;
  });
  
  // Get health status color
  const getHealthStatusColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-500';
    if (score >= 80) return 'bg-green-100 text-green-600';
    if (score >= 60) return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
  };
  
  // Get health status icon
  const getHealthStatusIcon = (score?: number) => {
    if (!score) return null;
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };
  
  // Get fuel type display and color
  const getFuelTypeDisplay = (type?: string) => {
    if (!type) return { label: 'Unknown', className: 'bg-gray-100 text-gray-600' };
    
    switch (type.toLowerCase()) {
      case 'electric':
        return { label: 'Electric', className: 'bg-blue-100 text-blue-600' };
      case 'hybrid':
        return { label: 'Hybrid', className: 'bg-green-100 text-green-600' };
      case 'petrol':
        return { label: 'Petrol', className: 'bg-amber-100 text-amber-600' };
      case 'diesel':
        return { label: 'Diesel', className: 'bg-orange-100 text-orange-600' };
      default:
        return { label: type.charAt(0).toUpperCase() + type.slice(1), className: 'bg-gray-100 text-gray-600' };
    }
  };
  
  // Navigation to vehicle detail
  const navigateToVehicle = (id: number) => {
    navigate(`/vehicles/${id}`);
  };
  
  // Add new vehicle
  const addNewVehicle = () => {
    navigate('/vehicles/add');
  };
  
  return (
    <div className="container px-4 py-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-dark">My Vehicles</h1>
          <p className="text-neutral-light mt-1">Manage and monitor your vehicles</p>
        </div>
        
        <Button 
          onClick={addNewVehicle}
          className="bg-primary text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vehicles..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filters</span>
              {(activeFilters.fuelTypes.length > 0 || 
               activeFilters.years.length > 0 || 
               activeFilters.makes.length > 0) && (
                <Badge className="ml-2 h-5 px-1 bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                  {activeFilters.fuelTypes.length + 
                   activeFilters.years.length + 
                   activeFilters.makes.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Fuel Type</DropdownMenuLabel>
            {FUEL_TYPES.map(fuelType => (
              <DropdownMenuCheckboxItem
                key={fuelType}
                checked={activeFilters.fuelTypes.includes(fuelType)}
                onCheckedChange={() => toggleFilter('fuelTypes', fuelType)}
              >
                {fuelType}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Year</DropdownMenuLabel>
            {YEARS.map(year => (
              <DropdownMenuCheckboxItem
                key={year}
                checked={activeFilters.years.includes(year)}
                onCheckedChange={() => toggleFilter('years', year)}
              >
                {year}
              </DropdownMenuCheckboxItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Make</DropdownMenuLabel>
            {MAKES.map(make => (
              <DropdownMenuCheckboxItem
                key={make}
                checked={activeFilters.makes.includes(make)}
                onCheckedChange={() => toggleFilter('makes', make)}
              >
                {make}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Vehicle list */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              className="fx-card overflow-hidden cursor-pointer fx-card-hover border"
              onClick={() => navigateToVehicle(vehicle.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ 
                y: -5, 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }}
            >
              <div className="h-40 bg-neutral-100 relative">
                {vehicle.imageUrl ? (
                  <img 
                    src={vehicle.imageUrl} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="h-20 w-20 text-neutral-300" />
                  </div>
                )}
                
                <Badge
                  className={`absolute top-3 right-3 ${getFuelTypeDisplay(vehicle.fuelType).className}`}
                >
                  {getFuelTypeDisplay(vehicle.fuelType).label}
                </Badge>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{vehicle.name}</h3>
                    <p className="text-neutral-light text-sm">
                      {vehicle.make} {vehicle.model} • {vehicle.year}
                    </p>
                  </div>
                  
                  <Badge
                    className={getHealthStatusColor(vehicle.healthScore)}
                  >
                    {getHealthStatusIcon(vehicle.healthScore)}
                    <span className="ml-1">{vehicle.healthScore || 'N/A'}%</span>
                  </Badge>
                </div>
                
                <div className="flex justify-between text-sm mt-4 text-neutral-light">
                  <div>
                    <p className="text-xs text-neutral-light">Last Service</p>
                    <p className="font-medium">{vehicle.lastService ? formatDate(vehicle.lastService) : 'Never'}</p>
                  </div>
                  
                  <div className="flex items-center text-primary">
                    <span className="font-medium">Details</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <Car className="h-8 w-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
          <p className="text-neutral-light mb-6 max-w-md mx-auto">
            {searchTerm || Object.values(activeFilters).some(arr => arr.length > 0)
              ? "No vehicles match your current search filters. Try adjusting your criteria."
              : "You haven't added any vehicles yet. Add your first vehicle to get started."}
          </p>
          
          {searchTerm || Object.values(activeFilters).some(arr => arr.length > 0) ? (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setActiveFilters({ fuelTypes: [], years: [], makes: [] });
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button 
              onClick={addNewVehicle}
              className="bg-primary text-white hover:bg-primary-dark"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyVehicles;