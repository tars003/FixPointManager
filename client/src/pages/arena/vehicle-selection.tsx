import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Car, 
  Bike, 
  Truck,
  Battery, 
  Fuel, 
  Filter,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ArenaWrapper from '@/components/arena/ArenaWrapper';
import VehicleModel from '@/components/arena/vehicle-models/VehicleModel';

// Vehicle type definitions
type VehicleType = 'two-wheeler' | 'three-wheeler' | 'four-wheeler' | 'heavy-vehicle' | 'agricultural' | 'specialty';
type FuelType = 'electric' | 'hybrid' | 'petrol' | 'diesel' | 'cng-lpg' | 'hydrogen';

interface VehicleOption {
  id: number;
  name: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  fuelType: FuelType;
  image?: string;
  modelId: string;
  description: string;
  popularity: number;
  specifications: {
    engine?: string;
    power?: string;
    torque?: string;
    transmission?: string;
    dimensions?: string;
    groundClearance?: string;
  };
  customizationOptions: {
    exterior: boolean;
    interior: boolean;
    performance: boolean;
    wheels: boolean;
    lighting: boolean;
    wraps: boolean;
  };
}

// Demo data - would come from API in a real application
const vehicleOptions: VehicleOption[] = [
  // Two Wheelers
  {
    id: 1,
    name: 'Royal Enfield Classic 350',
    type: 'two-wheeler',
    make: 'Royal Enfield',
    model: 'Classic 350',
    year: 2023,
    fuelType: 'petrol',
    modelId: 'classic350',
    description: 'The timeless design of the Classic 350 now meets modern technology.',
    popularity: 92,
    specifications: {
      engine: '349cc, Single Cylinder',
      power: '20.2 bhp @ 6100 rpm',
      torque: '27 Nm @ 4000 rpm',
      transmission: '5-Speed Manual',
      dimensions: 'L: 2145mm x W: 785mm x H: 1090mm',
      groundClearance: '170 mm'
    },
    customizationOptions: {
      exterior: true,
      interior: false,
      performance: true,
      wheels: true,
      lighting: true,
      wraps: true
    }
  },
  {
    id: 2,
    name: 'TVS Apache RTR 160',
    type: 'two-wheeler',
    make: 'TVS',
    model: 'Apache RTR 160',
    year: 2023,
    fuelType: 'petrol',
    modelId: 'apache160',
    description: 'A performance-oriented motorcycle with racing DNA.',
    popularity: 85,
    specifications: {
      engine: '159.7cc, Single Cylinder',
      power: '17.55 bhp @ 9250 rpm',
      torque: '14.73 Nm @ 7250 rpm',
      transmission: '5-Speed Manual',
      dimensions: 'L: 2085mm x W: 730mm x H: 1105mm',
      groundClearance: '180 mm'
    },
    customizationOptions: {
      exterior: true,
      interior: false,
      performance: true,
      wheels: true,
      lighting: true,
      wraps: true
    }
  },
  
  // Four Wheelers
  {
    id: 3,
    name: 'Maruti Suzuki Swift',
    type: 'four-wheeler',
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2023,
    fuelType: 'petrol',
    modelId: 'swift2023',
    description: 'The iconic hatchback with sporty styling and efficient performance.',
    popularity: 95,
    specifications: {
      engine: '1.2L K-Series Dual Jet',
      power: '89 bhp @ 6000 rpm',
      torque: '113 Nm @ 4400 rpm',
      transmission: '5-Speed Manual/AMT',
      dimensions: 'L: 3845mm x W: 1735mm x H: 1530mm',
      groundClearance: '163 mm'
    },
    customizationOptions: {
      exterior: true,
      interior: true,
      performance: true,
      wheels: true,
      lighting: true,
      wraps: true
    }
  },
  {
    id: 4,
    name: 'Hyundai Creta',
    type: 'four-wheeler',
    make: 'Hyundai',
    model: 'Creta',
    year: 2023,
    fuelType: 'diesel',
    modelId: 'creta2023',
    description: 'A feature-rich compact SUV with bold design and advanced technology.',
    popularity: 90,
    specifications: {
      engine: '1.5L U2 CRDi Diesel',
      power: '113 bhp @ 4000 rpm',
      torque: '250 Nm @ 1500-2750 rpm',
      transmission: '6-Speed Manual/Automatic',
      dimensions: 'L: 4300mm x W: 1790mm x H: 1635mm',
      groundClearance: '190 mm'
    },
    customizationOptions: {
      exterior: true,
      interior: true,
      performance: true,
      wheels: true,
      lighting: true,
      wraps: true
    }
  },
  {
    id: 5,
    name: 'Tata Nexon EV',
    type: 'four-wheeler',
    make: 'Tata',
    model: 'Nexon EV',
    year: 2023,
    fuelType: 'electric',
    modelId: 'nexonev2023',
    description: 'An electric SUV with impressive range and instant torque.',
    popularity: 88,
    specifications: {
      engine: 'Permanent Magnet Synchronous Motor',
      power: '127 bhp',
      torque: '245 Nm',
      transmission: 'Single-Speed Automatic',
      dimensions: 'L: 3993mm x W: 1811mm x H: 1606mm',
      groundClearance: '205 mm'
    },
    customizationOptions: {
      exterior: true,
      interior: true,
      performance: false,
      wheels: true,
      lighting: true,
      wraps: true
    }
  },
  
  // Heavy Vehicles
  {
    id: 6,
    name: 'Tata Prima',
    type: 'heavy-vehicle',
    make: 'Tata',
    model: 'Prima',
    year: 2023,
    fuelType: 'diesel',
    modelId: 'prima2023',
    description: 'A modern heavy-duty truck designed for maximum efficiency and comfort.',
    popularity: 82,
    specifications: {
      engine: '5.9L Cummins ISBe 5.9',
      power: '220 bhp @ 2500 rpm',
      torque: '700 Nm @ 1200-1600 rpm',
      transmission: '9-Speed Manual',
      dimensions: 'L: 7240mm x W: 2490mm x H: 3130mm',
      groundClearance: '320 mm'
    },
    customizationOptions: {
      exterior: true,
      interior: true,
      performance: true,
      wheels: true,
      lighting: true,
      wraps: true
    }
  },
  
  // Three Wheelers
  {
    id: 7,
    name: 'Piaggio Ape City Plus',
    type: 'three-wheeler',
    make: 'Piaggio',
    model: 'Ape City Plus',
    year: 2023,
    fuelType: 'cng-lpg',
    modelId: 'apecityplus',
    description: 'A versatile three-wheeler for urban transportation and last-mile connectivity.',
    popularity: 78,
    specifications: {
      engine: '230cc, Single Cylinder',
      power: '8.7 bhp',
      torque: '18.7 Nm',
      transmission: '4-Speed Manual',
      dimensions: 'L: 2700mm x W: 1350mm x H: 1750mm',
      groundClearance: '170 mm'
    },
    customizationOptions: {
      exterior: true,
      interior: true,
      performance: false,
      wheels: true,
      lighting: true,
      wraps: true
    }
  },
  
  // Agricultural vehicles
  {
    id: 8,
    name: 'Mahindra 575 DI',
    type: 'agricultural',
    make: 'Mahindra',
    model: '575 DI',
    year: 2023,
    fuelType: 'diesel',
    modelId: 'mahindra575di',
    description: 'A powerful tractor designed for various agricultural applications.',
    popularity: 75,
    specifications: {
      engine: '2.7L, 3-Cylinder',
      power: '45 HP @ 2200 rpm',
      torque: '155 Nm',
      transmission: '8 Forward + 2 Reverse',
      dimensions: 'L: 3330mm x W: 1710mm x H: 2440mm',
      groundClearance: '350 mm'
    },
    customizationOptions: {
      exterior: true,
      interior: false,
      performance: true,
      wheels: true,
      lighting: true,
      wraps: true
    }
  },
  
  // Specialty vehicles
  {
    id: 9,
    name: 'JCB 3DX Backhoe Loader',
    type: 'specialty',
    make: 'JCB',
    model: '3DX',
    year: 2023,
    fuelType: 'diesel',
    modelId: 'jcb3dx',
    description: 'A construction equipment known for its versatility and reliability.',
    popularity: 70,
    specifications: {
      engine: '4.4L, 4-Cylinder',
      power: '76 HP @ 2200 rpm',
      torque: '306 Nm @ 1300 rpm',
      transmission: '4-Speed Synchromesh',
      dimensions: 'L: 5700mm x W: 2350mm x H: 3540mm',
      groundClearance: '370 mm'
    },
    customizationOptions: {
      exterior: true,
      interior: true,
      performance: false,
      wheels: true,
      lighting: true,
      wraps: false
    }
  }
];

// Vehicle Icons
const VehicleTypeIcon = ({ type }: { type: VehicleType }) => {
  switch (type) {
    case 'two-wheeler':
      return <Bike className="h-5 w-5" />;
    case 'three-wheeler':
      return <span className="font-bold text-xs">3W</span>;
    case 'four-wheeler':
      return <Car className="h-5 w-5" />;
    case 'heavy-vehicle':
      return <Truck className="h-5 w-5" />;
    case 'agricultural':
      return <span className="font-bold text-xs">AG</span>;
    case 'specialty':
      return <span className="font-bold text-xs">SP</span>;
    default:
      return <Car className="h-5 w-5" />;
  }
};

// Fuel Type Icon
const FuelTypeIcon = ({ type }: { type: FuelType }) => {
  switch (type) {
    case 'electric':
      return <Battery className="h-4 w-4" />;
    case 'hybrid':
      return (
        <div className="relative">
          <Battery className="h-4 w-4" />
          <div className="absolute -top-1 -right-1">
            <Fuel className="h-3 w-3" />
          </div>
        </div>
      );
    case 'petrol':
    case 'diesel':
    case 'cng-lpg':
    case 'hydrogen':
      return <Fuel className="h-4 w-4" />;
    default:
      return <Fuel className="h-4 w-4" />;
  }
};

const VehicleSelection: React.FC = () => {
  const [_, setLocation] = useLocation();
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | 'all'>('all');
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(null);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleOption[]>(vehicleOptions);
  const [currentStep, setCurrentStep] = useState<'select' | 'customize'>('select');
  const [selectedMake, setSelectedMake] = useState<string>('all');
  const [activeVehicleId, setActiveVehicleId] = useState<number | null>(null);
  
  // Get unique makes for the filter
  const uniqueMakes = Array.from(new Set(vehicleOptions.map(v => v.make)));
  
  // Filter vehicles based on selections
  useEffect(() => {
    let result = [...vehicleOptions];
    
    // Type filter
    if (selectedVehicleType !== 'all') {
      result = result.filter(v => v.type === selectedVehicleType);
    }
    
    // Fuel type filter
    if (selectedFuelType !== 'all') {
      result = result.filter(v => v.fuelType === selectedFuelType);
    }
    
    // Make filter
    if (selectedMake !== 'all') {
      result = result.filter(v => v.make === selectedMake);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.name.toLowerCase().includes(query) || 
        v.make.toLowerCase().includes(query) || 
        v.model.toLowerCase().includes(query)
      );
    }
    
    setFilteredVehicles(result);
  }, [selectedVehicleType, selectedFuelType, selectedMake, searchQuery]);
  
  // Handle vehicle selection
  const handleVehicleSelect = (vehicle: VehicleOption) => {
    setSelectedVehicle(vehicle);
    setActiveVehicleId(vehicle.id);
  };
  
  // Handle proceed to customization
  const handleProceedToCustomize = () => {
    if (selectedVehicle) {
      // In a real app, you'd save the selected vehicle to context/store
      // Then navigate to the customization page
      setLocation(`/arena/customize/${selectedVehicle.id}`);
    }
  };
  
  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <ArenaWrapper>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-background border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Arena Vehicle Selection
              </h1>
              <p className="text-muted-foreground">Select your vehicle to begin customization</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setLocation('/arena')}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Arena
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Filters Panel */}
          <div className="p-4 lg:w-80 border-r bg-muted/30">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Search</h3>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search vehicles..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Vehicle Type</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={selectedVehicleType === 'all' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedVehicleType('all')}
                  >
                    <span className="text-xs">All</span>
                  </Button>
                  
                  <Button 
                    variant={selectedVehicleType === 'two-wheeler' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedVehicleType('two-wheeler')}
                  >
                    <Bike className="h-4 w-4 mr-1" />
                    <span className="text-xs">Bikes</span>
                  </Button>
                  
                  <Button 
                    variant={selectedVehicleType === 'three-wheeler' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedVehicleType('three-wheeler')}
                  >
                    <span className="text-xs">3-Wheeler</span>
                  </Button>
                  
                  <Button 
                    variant={selectedVehicleType === 'four-wheeler' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedVehicleType('four-wheeler')}
                  >
                    <Car className="h-4 w-4 mr-1" />
                    <span className="text-xs">Cars</span>
                  </Button>
                  
                  <Button 
                    variant={selectedVehicleType === 'heavy-vehicle' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedVehicleType('heavy-vehicle')}
                  >
                    <Truck className="h-4 w-4 mr-1" />
                    <span className="text-xs">Trucks</span>
                  </Button>
                  
                  <Button 
                    variant={selectedVehicleType === 'agricultural' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedVehicleType('agricultural')}
                  >
                    <span className="text-xs">Farm</span>
                  </Button>
                  
                  <Button 
                    variant={selectedVehicleType === 'specialty' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedVehicleType('specialty')}
                  >
                    <span className="text-xs">Special</span>
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Fuel Type</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={selectedFuelType === 'all' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedFuelType('all')}
                  >
                    <span className="text-xs">All</span>
                  </Button>
                  
                  <Button 
                    variant={selectedFuelType === 'electric' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedFuelType('electric')}
                  >
                    <Battery className="h-4 w-4 mr-1" />
                    <span className="text-xs">Electric</span>
                  </Button>
                  
                  <Button 
                    variant={selectedFuelType === 'hybrid' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedFuelType('hybrid')}
                  >
                    <span className="text-xs">Hybrid</span>
                  </Button>
                  
                  <Button 
                    variant={selectedFuelType === 'petrol' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedFuelType('petrol')}
                  >
                    <Fuel className="h-4 w-4 mr-1" />
                    <span className="text-xs">Petrol</span>
                  </Button>
                  
                  <Button 
                    variant={selectedFuelType === 'diesel' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedFuelType('diesel')}
                  >
                    <span className="text-xs">Diesel</span>
                  </Button>
                  
                  <Button 
                    variant={selectedFuelType === 'cng-lpg' ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2"
                    onClick={() => setSelectedFuelType('cng-lpg')}
                  >
                    <span className="text-xs">CNG/LPG</span>
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Make</h3>
                <Select
                  value={selectedMake}
                  onValueChange={(value) => setSelectedMake(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Makes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Makes</SelectItem>
                    {uniqueMakes.map((make) => (
                      <SelectItem key={make} value={make}>{make}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedVehicleType('all');
                    setSelectedFuelType('all');
                    setSelectedMake('all');
                    setSearchQuery('');
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Vehicles List */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">
                  Found {filteredVehicles.length} vehicles
                </h2>
                
                <div className="flex items-center space-x-2">
                  <Select defaultValue="popularity">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Sort by Popularity</SelectItem>
                      <SelectItem value="name-asc">Sort by Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Sort by Name (Z-A)</SelectItem>
                      <SelectItem value="year-desc">Sort by Year (New to Old)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Vehicle list scrollable area */}
              <ScrollArea className="flex-1 h-full max-h-[calc(100vh-13rem)] lg:max-h-full">
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 p-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                      <motion.div 
                        key={vehicle.id}
                        variants={itemVariants}
                      >
                        <Card 
                          className={`cursor-pointer hover:border-primary transition-all overflow-hidden ${activeVehicleId === vehicle.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => handleVehicleSelect(vehicle)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <div>
                                <CardTitle className="flex items-center gap-1.5">
                                  <div className="p-1 bg-primary/10 rounded-sm">
                                    <VehicleTypeIcon type={vehicle.type} />
                                  </div>
                                  {vehicle.make} {vehicle.model}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="rounded-sm flex gap-1 items-center font-normal">
                                    <FuelTypeIcon type={vehicle.fuelType} />
                                    {vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1)}
                                  </Badge>
                                  <span>{vehicle.year}</span>
                                </CardDescription>
                              </div>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge className="h-6 hover:bg-primary">
                                      {vehicle.popularity}% Popular
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Based on user customizations</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                              {/* This would be an actual vehicle image in a real app */}
                              <div className="text-4xl font-bold text-muted-foreground">
                                {vehicle.make.charAt(0)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                              {vehicle.description}
                            </p>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <div className="flex flex-wrap gap-1 text-xs">
                              {Object.entries(vehicle.customizationOptions)
                                .filter(([_, available]) => available)
                                .map(([option, _]) => (
                                  <Badge key={option} variant="secondary" className="font-normal capitalize">
                                    {option}
                                  </Badge>
                                ))
                              }
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                      <div className="bg-muted/50 p-4 rounded-full mb-4">
                        <Car className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-lg">No vehicles found</h3>
                      <p className="text-muted-foreground mt-1">
                        Try adjusting your filters or search criteria
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSelectedVehicleType('all');
                          setSelectedFuelType('all');
                          setSelectedMake('all');
                          setSearchQuery('');
                        }}
                      >
                        Reset All Filters
                      </Button>
                    </div>
                  )}
                </motion.div>
              </ScrollArea>
              
              {/* Vehicle details panel */}
              <div className="lg:w-1/2 xl:w-2/5 border-l">
                {selectedVehicle ? (
                  <div className="h-full flex flex-col">
                    <div className="border-b p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold">{selectedVehicle.name}</h2>
                          <p className="text-muted-foreground text-sm">
                            {selectedVehicle.year} · {selectedVehicle.fuelType.charAt(0).toUpperCase() + selectedVehicle.fuelType.slice(1)}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedVehicle(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto">
                      <div className="p-4">
                        <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden mb-4">
                          <VehicleModel
                            modelId={selectedVehicle.modelId}
                            vehicleMake={selectedVehicle.make}
                            vehicleModel={selectedVehicle.model}
                            autoRotate={true}
                          />
                        </div>
                        
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {selectedVehicle.description}
                        </p>
                        
                        <h3 className="font-medium mb-2">Specifications</h3>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {Object.entries(selectedVehicle.specifications).map(([key, value]) => (
                            value && (
                              <div key={key} className="bg-muted/50 p-2 rounded">
                                <div className="text-xs text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="text-sm font-medium truncate">
                                  {value}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                        
                        <h3 className="font-medium mb-2">Available Customizations</h3>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {Object.entries(selectedVehicle.customizationOptions).map(([option, available]) => (
                            <div 
                              key={option} 
                              className={`p-2 rounded text-center text-xs ${
                                available 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <div className="capitalize">{option}</div>
                              <div className="text-[10px] mt-0.5">
                                {available ? 'Available' : 'Unavailable'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t">
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleProceedToCustomize}
                      >
                        Proceed to Customization
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-xs p-6">
                      <div className="bg-muted/50 p-4 rounded-full inline-block mb-4">
                        <Info className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-lg">Select a Vehicle</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Choose a vehicle from the list to view its details and proceed to customization
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ArenaWrapper>
  );
};

export default VehicleSelection;