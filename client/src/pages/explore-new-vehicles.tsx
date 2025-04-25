import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Filter, 
  Search, 
  ChevronDown, 
  Star, 
  ArrowRight, 
  CarFront, 
  Truck, 
  Leaf, 
  Zap, 
  Fuel, 
  Wind, 
  PiggyBank, 
  Sun, 
  BadgeInfo 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
import PageTransition from '@/components/transitions/page-transition';
import VehicleAdvisor from '@/components/explore/vehicle-advisor';
import VehicleComparison from '@/components/explore/vehicle-comparison';

// Define types for vehicles
interface Vehicle {
  id: number;
  make: string;
  model: string;
  type: 'two-wheeler' | 'three-wheeler' | 'four-wheeler' | 'truck' | 'commercial' | 'bus' | 'tractor' | 'construction';
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'cng' | 'electric' | 'solar' | 'hydrogen';
  year: number;
  price: {
    min: number;
    max: number;
  };
  image: string;
  rating: number;
  features: string[];
  isFeatured?: boolean;
  isNew?: boolean;
}

// Sample vehicle data
const sampleVehicles: Vehicle[] = [
  {
    id: 1,
    make: 'Honda',
    model: 'City',
    type: 'four-wheeler',
    fuelType: 'petrol',
    year: 2023,
    price: {
      min: 1250000,
      max: 1850000
    },
    image: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?q=80&w=2070',
    rating: 4.5,
    features: ['Sunroof', '8-inch Touchscreen', 'Automatic Climate Control', 'LED Headlamps'],
    isFeatured: true
  },
  {
    id: 2,
    make: 'Tata',
    model: 'Nexon',
    type: 'four-wheeler',
    fuelType: 'electric',
    year: 2023,
    price: {
      min: 1450000,
      max: 1950000
    },
    image: 'https://images.unsplash.com/photo-1609679975088-bcb459448956?q=80&w=2070',
    rating: 4.3,
    features: ['Electric Drivetrain', '10.2-inch Touchscreen', 'Air Purifier', 'ADAS Features'],
    isNew: true
  },
  {
    id: 3,
    make: 'Hyundai',
    model: 'Creta',
    type: 'four-wheeler',
    fuelType: 'diesel',
    year: 2023,
    price: {
      min: 1050000,
      max: 1850000
    },
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070',
    rating: 4.2,
    features: ['Panoramic Sunroof', 'Bose Premium Sound', 'Ventilated Seats', 'BlueLink Connected Car'],
    isFeatured: true
  },
  {
    id: 4,
    make: 'Maruti Suzuki',
    model: 'Swift',
    type: 'four-wheeler',
    fuelType: 'cng',
    year: 2023,
    price: {
      min: 590000,
      max: 850000
    },
    image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=2070',
    rating: 4.1,
    features: ['CNG Kit', 'Touchscreen Infotainment', 'Automatic Climate Control', 'Alloy Wheels']
  },
  {
    id: 5,
    make: 'Mahindra',
    model: 'XUV700',
    type: 'four-wheeler',
    fuelType: 'hybrid',
    year: 2023,
    price: {
      min: 1380000,
      max: 2450000
    },
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070',
    rating: 4.6,
    features: ['ADAS Features', 'Amazon Alexa Built-in', 'Panoramic Sunroof', 'Dual 10.25-inch Screens'],
    isNew: true
  },
  {
    id: 6,
    make: 'Royal Enfield',
    model: 'Classic 350',
    type: 'two-wheeler',
    fuelType: 'petrol',
    year: 2023,
    price: {
      min: 190000,
      max: 250000
    },
    image: 'https://images.unsplash.com/photo-1558980394-34764db076b4?q=80&w=2070',
    rating: 4.4,
    features: ['350cc Engine', 'Digital Console', 'ABS', 'LED Lighting'],
    isFeatured: true
  },
  {
    id: 7,
    make: 'Ola',
    model: 'S1 Pro',
    type: 'two-wheeler',
    fuelType: 'electric',
    year: 2023,
    price: {
      min: 130000,
      max: 160000
    },
    image: 'https://images.unsplash.com/photo-1607305387197-a93d8b8f3818?q=80&w=2070',
    rating: 4.0,
    features: ['150km Range', 'Fast Charging', 'App Connectivity', 'Reverse Mode'],
    isNew: true
  },
  {
    id: 8,
    make: 'Ashok Leyland',
    model: 'BOSS',
    type: 'truck',
    fuelType: 'diesel',
    year: 2023,
    price: {
      min: 2800000,
      max: 3500000
    },
    image: 'https://images.unsplash.com/photo-1616432043562-3e159bad044f?q=80&w=2069',
    rating: 4.2,
    features: ['BS6 Engine', 'AC Cabin', 'Power Steering', 'Digital Dashboard']
  },
  {
    id: 9,
    make: 'Volvo',
    model: 'B11R',
    type: 'bus',
    fuelType: 'diesel',
    year: 2023,
    price: {
      min: 8500000,
      max: 12000000
    },
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069',
    rating: 4.7,
    features: ['49 Reclining Seats', 'I-Shift Transmission', 'ESP', 'LED Mood Lighting']
  },
  {
    id: 10,
    make: 'John Deere',
    model: '5310',
    type: 'tractor',
    fuelType: 'diesel',
    year: 2023,
    price: {
      min: 950000,
      max: 1200000
    },
    image: 'https://images.unsplash.com/photo-1542652694-40abf526446e?q=80&w=2070',
    rating: 4.5,
    features: ['55 HP Engine', 'Power Steering', 'Oil Immersed Brakes', 'Digital Display']
  },
  {
    id: 11,
    make: 'Piaggio',
    model: 'Ape City Plus',
    type: 'three-wheeler',
    fuelType: 'cng',
    year: 2023,
    price: {
      min: 280000,
      max: 320000
    },
    image: 'https://images.unsplash.com/photo-1619121883499-5307e393ef42?q=80&w=2070',
    rating: 4.0,
    features: ['230cc Engine', 'CNG Kit', 'Large Load Capacity', 'Semi-Cabin Design']
  },
  {
    id: 12,
    make: 'JCB',
    model: '3DX',
    type: 'construction',
    fuelType: 'diesel',
    year: 2023,
    price: {
      min: 2900000,
      max: 3500000
    },
    image: 'https://images.unsplash.com/photo-1532619031801-5a6e17ce59d0?q=80&w=2070',
    rating: 4.6,
    features: ['Backhoe Loader', '76 HP Engine', 'Air-Conditioned Cabin', 'Deluxe Suspension Seat']
  }
];

// Filter type
interface FilterOptions {
  type: string[];
  fuelType: string[];
  priceRange: {
    min: number;
    max: number;
  };
  features: string[];
  search: string;
}

const ExploreVehiclesPage: React.FC = () => {
  const [, setLocation] = useLocation();
  
  // State
  const [filters, setFilters] = useState<FilterOptions>({
    type: [],
    fuelType: [],
    priceRange: {
      min: 0,
      max: 15000000
    },
    features: [],
    search: ''
  });
  
  const [displayedVehicles, setDisplayedVehicles] = useState<Vehicle[]>(sampleVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle filter changes
  const updateFilter = <K extends keyof FilterOptions>(
    filterKey: K,
    value: FilterOptions[K]
  ) => {
    setFilters({
      ...filters,
      [filterKey]: value
    });
  };
  
  // Toggle type filter
  const toggleTypeFilter = (type: string) => {
    if (filters.type.includes(type)) {
      updateFilter('type', filters.type.filter(t => t !== type));
    } else {
      updateFilter('type', [...filters.type, type]);
    }
  };
  
  // Toggle fuel type filter
  const toggleFuelTypeFilter = (fuelType: string) => {
    if (filters.fuelType.includes(fuelType)) {
      updateFilter('fuelType', filters.fuelType.filter(f => f !== fuelType));
    } else {
      updateFilter('fuelType', [...filters.fuelType, fuelType]);
    }
  };
  
  // Apply filters
  const applyFilters = () => {
    let filtered = [...sampleVehicles];
    
    // Filter by type
    if (filters.type.length > 0) {
      filtered = filtered.filter(vehicle => 
        filters.type.includes(vehicle.type)
      );
    }
    
    // Filter by fuel type
    if (filters.fuelType.length > 0) {
      filtered = filtered.filter(vehicle => 
        filters.fuelType.includes(vehicle.fuelType)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(vehicle => 
      vehicle.price.min >= filters.priceRange.min &&
      vehicle.price.max <= filters.priceRange.max
    );
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(query)
      );
    }
    
    setDisplayedVehicles(filtered);
    setMobileFiltersOpen(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: [],
      fuelType: [],
      priceRange: {
        min: 0,
        max: 15000000
      },
      features: [],
      search: ''
    });
    setSearchQuery('');
    setDisplayedVehicles(sampleVehicles);
  };
  
  // Format price
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  // Get vehicle icon by type
  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'two-wheeler':
        return '🏍️';
      case 'three-wheeler':
        return '🛺';
      case 'four-wheeler':
        return '🚗';
      case 'truck':
        return '🚚';
      case 'commercial':
        return '🚐';
      case 'bus':
        return '🚌';
      case 'tractor':
        return '🚜';
      case 'construction':
        return '🏗️';
      default:
        return '🚗';
    }
  };

  // Get fuel type icon
  const getFuelIcon = (fuelType: string) => {
    switch (fuelType) {
      case 'petrol':
        return <Fuel className="h-4 w-4 mr-1" />;
      case 'diesel':
        return <Truck className="h-4 w-4 mr-1" />;
      case 'hybrid':
        return <Leaf className="h-4 w-4 mr-1" />;
      case 'cng':
        return <Wind className="h-4 w-4 mr-1" />;
      case 'electric':
        return <Zap className="h-4 w-4 mr-1" />;
      case 'solar':
        return <Sun className="h-4 w-4 mr-1" />;
      case 'hydrogen':
        return <Zap className="h-4 w-4 mr-1" />;
      default:
        return <Fuel className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <PageTransition type="complex" duration={0.6}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background sticky top-0 z-10">
          <div className="container mx-auto py-4 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setLocation('/')}
                  className="font-bold text-xl"
                >
                  FixPoint
                </Button>
                <Badge variant="secondary" className="ml-2">AutoExplorer</Badge>
              </div>
              
              <div className="hidden md:flex items-center gap-4 w-1/2">
                <div className="relative w-full">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by make, model..."
                    className="w-full pr-10"
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  />
                  <Search 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer" 
                    onClick={applyFilters} 
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="md:hidden"
                >
                  <Filter className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="default">
                  Compare Vehicles
                </Button>
              </div>
            </div>
            
            <div className="md:hidden mt-4">
              <div className="relative w-full">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by make, model..."
                  className="w-full pr-10"
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                />
                <Search 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer" 
                  onClick={applyFilters} 
                />
              </div>
            </div>
            
            <div className="mt-4">
              {/* Quick category selection */}
              <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                {[
                  { value: 'two-wheeler', label: 'Two Wheeler', icon: '🏍️' },
                  { value: 'three-wheeler', label: 'Three Wheeler', icon: '🛺' },
                  { value: 'four-wheeler', label: 'Four Wheeler', icon: '🚗' },
                  { value: 'truck', label: 'Truck', icon: '🚚' },
                  { value: 'commercial', label: 'Commercial', icon: '🚐' },
                  { value: 'bus', label: 'Bus', icon: '🚌' },
                  { value: 'tractor', label: 'Tractor', icon: '🚜' },
                  { value: 'construction', label: 'Construction', icon: '🏗️' }
                ].map((category) => (
                  <Button
                    key={category.value}
                    variant={filters.type.includes(category.value) ? "default" : "outline"}
                    size="sm"
                    className="flex-shrink-0 gap-1"
                    onClick={() => {
                      toggleTypeFilter(category.value);
                      applyFilters();
                    }}
                  >
                    <span>{category.icon}</span>
                    <span className="text-xs hidden sm:inline">{category.label}</span>
                  </Button>
                ))}
              </div>
              
              {/* Fuel type tabs */}
              <div className="flex overflow-x-auto gap-2 mt-2 pb-2 no-scrollbar">
                {[
                  { value: 'all', label: 'All Fuels', icon: <Fuel className="h-4 w-4 mr-1" /> },
                  { value: 'petrol', label: 'Petrol', icon: <Fuel className="h-4 w-4 mr-1" /> },
                  { value: 'diesel', label: 'Diesel', icon: <Truck className="h-4 w-4 mr-1" /> },
                  { value: 'hybrid', label: 'Hybrid', icon: <Leaf className="h-4 w-4 mr-1" /> },
                  { value: 'cng', label: 'CNG', icon: <Wind className="h-4 w-4 mr-1" /> },
                  { value: 'electric', label: 'Electric', icon: <Zap className="h-4 w-4 mr-1" /> },
                  { value: 'solar', label: 'Solar', icon: <Sun className="h-4 w-4 mr-1" /> },
                  { value: 'hydrogen', label: 'Hydrogen', icon: <Zap className="h-4 w-4 mr-1" /> }
                ].map((fuel) => (
                  <Button
                    key={fuel.value}
                    variant={fuel.value === 'all' ? 
                      (filters.fuelType.length === 0 ? "default" : "outline") :
                      (filters.fuelType.includes(fuel.value) ? "default" : "outline")
                    }
                    size="sm"
                    className="flex-shrink-0 h-8 gap-1"
                    onClick={() => {
                      if (fuel.value === 'all') {
                        updateFilter('fuelType', []);
                      } else {
                        toggleFuelTypeFilter(fuel.value);
                      }
                      applyFilters();
                    }}
                  >
                    {fuel.icon}
                    <span className="text-xs">{fuel.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto py-6 px-4">
          {/* Hero Section */}
          <section className="mb-8">
            <div className="relative overflow-hidden rounded-xl h-[300px] md:h-[400px] bg-gradient-to-r from-indigo-900 to-blue-700">
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070')] bg-cover bg-center"></div>
              <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Find Your Perfect Vehicle</h1>
                  <p className="text-white/80 text-sm md:text-base max-w-lg mb-6">
                    Explore our comprehensive range of vehicles across all categories and fuel types. 
                    Compare, research, and discover the right choice for your needs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="bg-white text-blue-700 hover:bg-white/90">
                      Use Vehicle Advisor
                    </Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white/20">
                      Compare Vehicles
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Featured Vehicles */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Featured Vehicles</h2>
              <Button variant="ghost" className="text-sm" onClick={() => setLocation('/vehicles')}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleVehicles.filter(v => v.isFeatured).map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {vehicle.isFeatured && (
                      <Badge className="absolute top-2 left-2 bg-primary text-white">Featured</Badge>
                    )}
                    {vehicle.isNew && (
                      <Badge className="absolute top-2 left-2 bg-green-600 text-white">New</Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{vehicle.make} {vehicle.model}</CardTitle>
                        <CardDescription>
                          {vehicle.year} • {getVehicleIcon(vehicle.type)} {vehicle.type.replace('-', ' ')}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm ml-1">{vehicle.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center mb-2">
                      {getFuelIcon(vehicle.fuelType)} 
                      <span className="text-sm capitalize">{vehicle.fuelType}</span>
                    </div>
                    <div className="font-medium">
                      {formatPrice(vehicle.price.min)} - {formatPrice(vehicle.price.max)}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {vehicle.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {vehicle.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{vehicle.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Button size="sm" className="flex-1">View Details</Button>
                      <Button size="sm" variant="outline">Add to Compare</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Vehicle Comparison Tool */}
          <section className="mb-10">
            <VehicleComparison />
          </section>

          {/* New Arrivals */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">New Arrivals</h2>
              <Button variant="ghost" className="text-sm" onClick={() => setLocation('/vehicles')}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sampleVehicles.filter(v => v.isNew).map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden group">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {vehicle.isNew && (
                      <Badge className="absolute top-2 left-2 bg-green-600 text-white">New</Badge>
                    )}
                  </div>
                  <CardHeader className="p-3 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{vehicle.make} {vehicle.model}</CardTitle>
                        <CardDescription className="text-xs">
                          {vehicle.year} • {vehicle.type.replace('-', ' ')}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs ml-1">{vehicle.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 pb-2">
                    <div className="flex items-center mb-1">
                      {getFuelIcon(vehicle.fuelType)} 
                      <span className="text-xs capitalize">{vehicle.fuelType}</span>
                    </div>
                    <div className="font-medium text-sm">
                      {formatPrice(vehicle.price.min)}
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 pt-0">
                    <Button size="sm" className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Browse by Fuel Type */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Browse by Fuel Type</h2>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="electric">Electric</TabsTrigger>
                <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
                <TabsTrigger value="petrol">Petrol</TabsTrigger>
                <TabsTrigger value="diesel">Diesel</TabsTrigger>
                <TabsTrigger value="cng">CNG</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['electric', 'hybrid', 'petrol'].map((fuelType) => (
                    <Card key={fuelType} className="overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="flex">
                        <div className="w-1/3">
                          <img 
                            src={`https://images.unsplash.com/photo-${fuelType === 'electric' ? '1607305387197-a93d8b8f3818' : fuelType === 'hybrid' ? '1494976388531-d1058494cdd8' : '1566473965997-3de9c817e938'}?q=80&w=400`}
                            alt={fuelType}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-4">
                          <h3 className="font-medium capitalize mb-1">{fuelType} Vehicles</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {fuelType === 'electric' 
                              ? 'Zero-emission vehicles powered by electricity.'
                              : fuelType === 'hybrid'
                                ? 'Combines conventional engine with electric motor.'
                                : 'Traditional vehicles running on petrol fuel.'}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">
                              <span className="font-medium">{sampleVehicles.filter(v => v.fuelType === fuelType).length}</span> models
                            </div>
                            <Button variant="ghost" size="sm" className="px-2 h-7">
                              Explore <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="electric">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleVehicles.filter(v => v.fuelType === 'electric').map((vehicle) => (
                    <Card key={vehicle.id} className="overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={vehicle.image}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{formatPrice(vehicle.price.min)} - {formatPrice(vehicle.price.max)}</p>
                        <div className="flex gap-1 mt-2">
                          {vehicle.features.slice(0, 2).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Similar content for other tabs */}
              <TabsContent value="hybrid">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sampleVehicles.filter(v => v.fuelType === 'hybrid').map((vehicle) => (
                    <Card key={vehicle.id} className="overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={vehicle.image}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{formatPrice(vehicle.price.min)} - {formatPrice(vehicle.price.max)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Additional tabs would follow the same pattern */}
            </Tabs>
          </section>
        </main>

        {/* Vehicle Advisor (Floating Button) */}
        <VehicleAdvisor />
      </div>
    </PageTransition>
  );
};

export default ExploreVehiclesPage;