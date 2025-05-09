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
  ChevronRight,
  FileText,
  Share2,
  Eye,
  BarChart3,
  MoveHorizontal
} from 'lucide-react';
import { Vehicle } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/format';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Mock user
const user = {
  name: 'Raj',
  id: 1
};

// Filter options
const FUEL_TYPES = ['Electric', 'Hybrid', 'Petrol', 'Diesel', 'CNG'];
const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020'];
const MAKES = ['Toyota', 'Honda', 'Tesla', 'Tata', 'Volkswagen', 'Ford', 'Hyundai', 'Maruti Suzuki', 'Mahindra', 'Renault', 'Chevrolet'];
const VEHICLE_TYPES = ['2-Wheeler', '3-Wheeler', '4-Wheeler', 'Commercial'];
const LOCATIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];

// Vehicle distribution data
const vehicleDistributionData = [
  { name: 'Personal Use', value: 4, color: '#3B82F6' },
  { name: 'Family Use', value: 2, color: '#10B981' },
  { name: 'Commercial', value: 1, color: '#F59E0B' }
];

// COLORS
const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

const MyVehicles = () => {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVehiclesToCompare, setSelectedVehiclesToCompare] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState<{
    fuelTypes: string[];
    years: string[];
    makes: string[];
    vehicleTypes: string[];
    locations: string[];
  }>({
    fuelTypes: [],
    years: [],
    makes: [],
    vehicleTypes: [],
    locations: []
  });
  
  // Fetch vehicles
  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles', { userId: user.id }],
    enabled: !!user.id,
  });
  
  // Handle filter changes
  const toggleFilter = (
    type: 'fuelTypes' | 'years' | 'makes' | 'vehicleTypes' | 'locations', 
    value: string
  ) => {
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
  
  // Toggle vehicle selection for comparison
  const toggleVehicleForComparison = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedVehiclesToCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(vehicleId => vehicleId !== id);
      } else {
        // Limit to 4 vehicles for comparison
        if (prev.length < 4) {
          return [...prev, id];
        }
        return prev;
      }
    });
  };
  
  // Start comparison
  const startComparison = () => {
    if (selectedVehiclesToCompare.length > 1) {
      // In a real app, we would navigate to a comparison page with the selected vehicle IDs
      console.log('Comparing vehicles:', selectedVehiclesToCompare);
      // navigate(`/vehicles/compare?ids=${selectedVehiclesToCompare.join(',')}`);
    }
  };
  
  // Share vehicle report
  const shareVehicleReport = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // In a real app, implement sharing functionality
    console.log('Sharing vehicle report:', id);
  };
  
  // View vehicle documents
  const viewVehicleDocuments = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // In a real app, navigate to documents view
    console.log('Viewing vehicle documents:', id);
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
  const getHealthStatusColor = (score?: number | null) => {
    if (score === undefined || score === null) return 'bg-gray-100 text-gray-500';
    if (score >= 80) return 'bg-green-100 text-green-600';
    if (score >= 60) return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
  };
  
  // Get health status icon
  const getHealthStatusIcon = (score?: number | null) => {
    if (score === undefined || score === null) return null;
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
    navigate('/vehicle-vault');
  };
  
  return (
    <div className="container px-4 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-dark">My Vehicles</h1>
          <p className="text-neutral-light mt-1">Manage and monitor your vehicles</p>
        </div>
        
        <div className="flex gap-2">
          {compareMode ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setCompareMode(false)}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={startComparison}
                className={`${selectedVehiclesToCompare.length > 1 ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={selectedVehiclesToCompare.length < 2}
              >
                <MoveHorizontal className="h-4 w-4 mr-2" />
                Compare ({selectedVehiclesToCompare.length})
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline"
                onClick={() => setCompareMode(true)}
                className="hidden md:flex"
              >
                <MoveHorizontal className="h-4 w-4 mr-2" />
                Compare Vehicles
              </Button>
              <Button 
                onClick={addNewVehicle}
                className="bg-primary text-white hover:bg-primary-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Distribution Chart */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Vehicle Distribution</CardTitle>
          <CardDescription>Breakdown of your vehicles by usage type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center h-64">
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vehicleDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 pt-4 md:pt-0 md:pl-8">
              <div className="space-y-4">
                {vehicleDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1 flex justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-neutral-light">
                        {item.value} {item.value === 1 ? 'vehicle' : 'vehicles'} ({Math.round(item.value / vehicleDistributionData.reduce((sum, curr) => sum + curr.value, 0) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center pt-2 border-t">
                  <div className="w-4 h-4 mr-2 opacity-0"></div>
                  <div className="flex-1 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">
                      {vehicleDistributionData.reduce((sum, curr) => sum + curr.value, 0)} vehicles
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Enhanced Tabs and Filters */}
      <div className="mb-6">
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList className="mb-4 md:mb-0">
              <TabsTrigger value="all">All Vehicles</TabsTrigger>
              <TabsTrigger value="2-wheeler">2-Wheeler</TabsTrigger>
              <TabsTrigger value="3-wheeler">3-Wheeler</TabsTrigger>
              <TabsTrigger value="4-wheeler">4-Wheeler</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <div className="relative flex-1 min-w-[200px]">
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
                  <Button variant="outline" className="w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Filters</span>
                    {Object.values(activeFilters).some(arr => arr.length > 0) && (
                      <Badge className="ml-2 h-5 px-1 bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                        {Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0)}
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
                  <DropdownMenuLabel>Vehicle Type</DropdownMenuLabel>
                  {VEHICLE_TYPES.map(type => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={activeFilters.vehicleTypes.includes(type)}
                      onCheckedChange={() => toggleFilter('vehicleTypes', type)}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Location</DropdownMenuLabel>
                  {LOCATIONS.map(location => (
                    <DropdownMenuCheckboxItem
                      key={location}
                      checked={activeFilters.locations.includes(location)}
                      onCheckedChange={() => toggleFilter('locations', location)}
                    >
                      {location}
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
          </div>
          
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    className={`fx-card overflow-hidden cursor-pointer border rounded-lg shadow-sm ${compareMode && selectedVehiclesToCompare.includes(vehicle.id) ? 'ring-2 ring-primary' : ''}`}
                    onClick={compareMode ? () => toggleVehicleForComparison(vehicle.id, {} as React.MouseEvent) : () => navigateToVehicle(vehicle.id)}
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
                      
                      {compareMode && (
                        <div className="absolute top-3 left-3">
                          <input 
                            type="checkbox"
                            checked={selectedVehiclesToCompare.includes(vehicle.id)}
                            onChange={(e) => toggleVehicleForComparison(vehicle.id, e as unknown as React.MouseEvent)}
                            className="h-5 w-5 rounded-full border-2 border-white bg-white/70 checked:bg-primary"
                          />
                        </div>
                      )}
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
                      
                      <div className="flex justify-between text-sm mt-4 text-neutral-light border-t pt-3">
                        <div>
                          <p className="text-xs text-neutral-light">Last Service</p>
                          <p className="font-medium">{vehicle.lastService ? formatDate(vehicle.lastService) : 'Never'}</p>
                        </div>
                        
                        {!compareMode && (
                          <div className="flex items-center text-primary">
                            <span className="font-medium">Details</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        )}
                      </div>
                      
                      {!compareMode && (
                        <div className="flex justify-between gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={(e) => viewVehicleDocuments(vehicle.id, e)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Documents
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={(e) => shareVehicleReport(vehicle.id, e)}
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            Share Report
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToVehicle(vehicle.id);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      )}
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
                      setActiveFilters({
                        fuelTypes: [],
                        years: [],
                        makes: [],
                        vehicleTypes: [],
                        locations: []
                      });
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
          </TabsContent>
          
          {/* Other tabs would have similar content but filtered by vehicle type */}
          <TabsContent value="2-wheeler" className="mt-6">
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-neutral-light">2-Wheeler vehicle list will be displayed here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="3-wheeler" className="mt-6">
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-neutral-light">3-Wheeler vehicle list will be displayed here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="4-wheeler" className="mt-6">
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-neutral-light">4-Wheeler vehicle list will be displayed here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="commercial" className="mt-6">
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-neutral-light">Commercial vehicle list will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyVehicles;