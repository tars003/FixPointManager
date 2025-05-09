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
  MoveHorizontal,
  Calendar,
  Info,
  Download
} from 'lucide-react';
import { Vehicle } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/format';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

// Vehicle portfolio value data
const vehiclePortfolioData = [
  { id: 1, name: 'Tata Nexon EV', fuelType: 'Electric', value: 892500 },
  { id: 2, name: 'Honda City', fuelType: 'Petrol', value: 375000 },
  { id: 3, name: 'TVS iQube', fuelType: 'Electric', value: 73500 }
];

// Status cards data
const statusCardsData = [
  {
    title: 'Vehicle Health',
    value: '75%',
    icon: <Info className="h-5 w-5 text-blue-500" />,
    color: 'blue'
  },
  {
    title: 'Upcoming Services',
    value: '2 services due this month',
    icon: <Calendar className="h-5 w-5 text-amber-500" />,
    color: 'amber'
  },
  {
    title: 'Alerts',
    value: '1 urgent maintenance required',
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    color: 'red'
  }
];

// COLORS
const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

const VehicleVault = () => {
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
  
  // View vehicle details
  const viewVehicleDetails = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/vehicles/${id}`);
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
  
  // Get fuel type display and color
  const getFuelTypeDisplay = (type?: string) => {
    if (!type) return { label: 'Unknown', className: 'bg-gray-700 text-gray-300' };
    
    switch (type.toLowerCase()) {
      case 'electric':
        return { label: 'Electric', className: 'bg-blue-900/30 text-blue-400' };
      case 'hybrid':
        return { label: 'Hybrid', className: 'bg-green-900/30 text-green-400' };
      case 'petrol':
        return { label: 'Petrol', className: 'bg-amber-900/30 text-amber-400' };
      case 'diesel':
        return { label: 'Diesel', className: 'bg-orange-900/30 text-orange-400' };
      default:
        return { label: type.charAt(0).toUpperCase() + type.slice(1), className: 'bg-gray-700 text-gray-300' };
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
  
  // Calculate total portfolio value
  const totalPortfolioValue = vehiclePortfolioData.reduce((total, vehicle) => total + vehicle.value, 0);
  
  return (
    <div className="container px-4 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">VehicleVault</h1>
          <p className="text-gray-400 mt-1">Manage and maintain your vehicle fleet in one place.</p>
        </div>
        
        <div className="flex gap-2">
          {compareMode ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setCompareMode(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={startComparison}
                className={`${selectedVehiclesToCompare.length > 1 ? 'bg-primary hover:bg-primary/90 text-black' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
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
                className="hidden md:flex border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <MoveHorizontal className="h-4 w-4 mr-2" />
                Compare Vehicles
              </Button>
              <Button 
                onClick={addNewVehicle}
                className="bg-primary hover:bg-primary/90 text-black font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {statusCardsData.map((card, index) => (
          <Card key={index} className="bg-gray-800 border-none">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {card.icon}
                <CardTitle className="text-sm font-medium text-gray-400">{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Vehicle Portfolio Value */}
      <Card className="mb-6 bg-gray-800 border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Vehicle Portfolio Value</CardTitle>
          <CardDescription>Total estimated value of your vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-bold text-primary mb-6">₹{totalPortfolioValue.toLocaleString()}</h2>
          
          <div className="space-y-4">
            {vehiclePortfolioData.map((vehicle, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center">
                    <Car className="h-3 w-3 text-gray-300" />
                  </div>
                  <span className="font-medium">{vehicle.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getFuelTypeDisplay(vehicle.fuelType).className}>
                    {getFuelTypeDisplay(vehicle.fuelType).label}
                  </Badge>
                  <span className="text-gray-300">₹{vehicle.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Distribution Chart */}
      <Card className="mb-6 bg-gray-800 border-none">
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
                      <span className="text-gray-400">
                        {item.value} {item.value === 1 ? 'vehicle' : 'vehicles'} ({Math.round(item.value / vehicleDistributionData.reduce((sum, curr) => sum + curr.value, 0) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center pt-2 border-t border-gray-700">
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
      
      {/* My Vehicles Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Vehicles</h2>
        <Button 
          variant="outline"
          className="flex items-center gap-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/40"
        >
          <Download className="h-4 w-4" />
          Export & Share
        </Button>
      </div>
      
      {/* Enhanced Tabs and Filters */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-2">Fuel Type</label>
            <Select defaultValue="all-fuel-types">
              <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                <SelectValue placeholder="All Fuel Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-fuel-types">All Fuel Types</SelectItem>
                {FUEL_TYPES.map(type => (
                  <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-2">Vehicle Type</label>
            <Select defaultValue="all-vehicle-types">
              <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                <SelectValue placeholder="All Vehicle Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-vehicle-types">All Vehicle Types</SelectItem>
                {VEHICLE_TYPES.map(type => (
                  <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-2">Geographic Location</label>
            <Select defaultValue="all-locations">
              <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-locations">All Locations</SelectItem>
                {LOCATIONS.map(location => (
                  <SelectItem key={location} value={location.toLowerCase()}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <Card 
              key={vehicle.id} 
              className="bg-gray-800 border-none hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigateToVehicle(vehicle.id)}
            >
              <CardHeader className="pb-2 pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-semibold">{vehicle.make} {vehicle.model}</CardTitle>
                  </div>
                  {compareMode && (
                    <div 
                      className={`h-5 w-5 rounded border ${selectedVehiclesToCompare.includes(vehicle.id) ? 'bg-primary border-primary text-black' : 'border-gray-600'} flex items-center justify-center cursor-pointer`}
                      onClick={(e) => toggleVehicleForComparison(vehicle.id, e)}
                    >
                      {selectedVehiclesToCompare.includes(vehicle.id) && <CheckCircle className="h-4 w-4" />}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400">{vehicle.year} • {vehicle.registrationNumber}</p>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mileage:</span>
                    <span>{vehicle.mileage} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Service:</span>
                    <span>{formatDate(vehicle.lastServiceDate)}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between text-yellow-400 hover:text-yellow-300 border-yellow-900/50 bg-yellow-900/10 hover:bg-yellow-900/20"
                  onClick={(e) => viewVehicleDocuments(vehicle.id, e)}
                >
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    View Documents
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-primary text-black border-none hover:bg-primary/90"
                  onClick={(e) => viewVehicleDetails(vehicle.id, e)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleVault;