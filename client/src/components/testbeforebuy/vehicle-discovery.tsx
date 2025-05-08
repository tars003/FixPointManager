import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, Truck, Bike, Zap, 
  Droplet, Fan, Atom, Fuel, 
  Search, Gauge, Filter, Clock,
  ShieldCheck, History, Shield, Award, LucideIcon 
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import ContentReaction from '@/components/ui/content-reaction';

interface VehicleDiscoveryProps {
  isPreowned?: boolean;
}

// Vehicle category interfaces
interface VehicleCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  count: number;
}

// Fuel type interfaces
interface FuelType {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

// Popular model interface
interface PopularModel {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  fuel: string;
}

const vehicleCategories: VehicleCategory[] = [
  { 
    id: 'two-wheelers', 
    name: 'Two Wheelers', 
    icon: Bike, 
    description: 'Motorcycles, scooters, and mopeds',
    count: 12500
  },
  { 
    id: 'cars', 
    name: 'Cars', 
    icon: Car, 
    description: 'Hatchbacks, sedans, SUVs, and luxury vehicles',
    count: 18700
  },
  { 
    id: 'commercial', 
    name: 'Commercial', 
    icon: Truck, 
    description: 'Trucks, pickups, vans, and delivery vehicles',
    count: 9800
  },
  { 
    id: 'three-wheelers', 
    name: 'Three Wheelers', 
    icon: Car, 
    description: 'Auto rickshaws, cargo three-wheelers',
    count: 3200
  },
];

const fuelTypes: FuelType[] = [
  { id: 'all', name: 'All Fuels', icon: Filter, color: 'bg-neutral-500' },
  { id: 'petrol', name: 'Petrol', icon: Fuel, color: 'bg-red-500' },
  { id: 'diesel', name: 'Diesel', icon: Droplet, color: 'bg-blue-500' },
  { id: 'electric', name: 'Electric', icon: Zap, color: 'bg-emerald-500' },
  { id: 'cng', name: 'CNG', icon: Fuel, color: 'bg-green-500' },
  { id: 'hybrid', name: 'Hybrid', icon: Fan, color: 'bg-purple-500' },
  { id: 'hydrogen', name: 'Hydrogen', icon: Atom, color: 'bg-cyan-500' },
];

const popularModels: PopularModel[] = [
  { 
    id: 1, 
    name: 'Maruti Suzuki Swift', 
    category: 'cars', 
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    price: 599000,
    fuel: 'petrol',
  },
  { 
    id: 2, 
    name: 'Honda Activa', 
    category: 'two-wheelers', 
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    price: 74000,
    fuel: 'petrol',
  },
  { 
    id: 3, 
    name: 'Tata Nexon EV', 
    category: 'cars', 
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    price: 1499000,
    fuel: 'electric',
  },
  { 
    id: 4, 
    name: 'Ashok Leyland Ecomet', 
    category: 'commercial', 
    imageUrl: 'https://images.unsplash.com/photo-1532330393533-443990a51d10?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    price: 1990000,
    fuel: 'diesel',
  },
];

const trendingSearches = [
  "Best electric two-wheelers",
  "SUVs under 15 lakhs",
  "Upcoming car launches",
  "CNG cars with lowest running cost",
  "Safest cars in India",
  "Hydrogen cars in India",
  "Best commercial vehicles",
  "Luxury cars under 50 lakhs"
];

// Pre-owned trending searches
const preownedTrendingSearches = [
  "Certified pre-owned cars under 5 lakhs",
  "Best pre-owned SUVs",
  "Single-owner vehicles",
  "Pre-owned electric vehicles",
  "Vehicles with service history",
  "Pre-owned cars with warranty",
  "Low mileage used motorcycles",
  "Pre-owned luxury cars"
];

// Pre-owned specific categories
const preownedSpecificCategories = [
  { 
    id: 'certified', 
    name: 'Certified', 
    icon: ShieldCheck, 
    description: 'Thoroughly inspected with warranty',
    count: 5350
  },
  { 
    id: 'single-owner', 
    name: 'Single Owner', 
    icon: History, 
    description: 'First-owner vehicles with complete records',
    count: 8700
  },
  { 
    id: 'under-3-years', 
    name: 'Under 3 Years', 
    icon: Clock, 
    description: 'Recent models with modern features',
    count: 4800
  },
  { 
    id: 'luxury', 
    name: 'Luxury', 
    icon: Car, 
    description: 'Premium brands at affordable prices',
    count: 2200
  },
];

const VehicleDiscovery: React.FC<VehicleDiscoveryProps> = ({ isPreowned = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFuel, setSelectedFuel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([isPreowned ? 300000 : 500000]);
  const [condition, setCondition] = useState<string>(isPreowned ? 'excellent' : '');
  
  // Handle budget slider change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };
  
  // Format price to display in lakhs or thousands
  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${(price / 1000).toFixed(0)}K`;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-8">Find Your Perfect Vehicle</h2>
      
      {/* Category selection */}
      <div className={`mb-8 ${isPreowned ? 'preowned-theme' : ''}`}>
        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">
          {isPreowned ? 'Choose Pre-owned Type' : 'Choose Vehicle Type'}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(isPreowned ? preownedSpecificCategories : vehicleCategories).map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`cursor-pointer rounded-lg border p-4 text-center transition-all
                ${selectedCategory === category.id ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'}
              `}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3
                ${selectedCategory === category.id ? 'bg-primary/10 text-primary' : 'bg-neutral-100 text-neutral-500'}
              `}>
                <category.icon className="w-6 h-6" />
              </div>
              <h4 className="font-medium mb-1">{category.name}</h4>
              <p className="text-xs text-neutral-500 mb-2">{category.description}</p>
              <Badge variant="outline" className="text-xs font-normal">
                {category.count.toLocaleString()} vehicles
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Fuel type tabs */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">
          Select Fuel Type
        </h3>
        
        <Tabs value={selectedFuel} onValueChange={setSelectedFuel} className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-7 h-auto">
            {fuelTypes.map((fuel) => (
              <TabsTrigger
                key={fuel.id}
                value={fuel.id}
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary flex flex-col py-3"
              >
                <fuel.icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{fuel.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Add TabsContent for each fuel type */}
          {fuelTypes.map((fuel) => (
            <TabsContent key={fuel.id} value={fuel.id} className="mt-4 animate-in fade-in">
              <div className="bg-neutral-50 rounded-lg p-4 border">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${fuel.color}`}>
                    <fuel.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{fuel.name} Vehicles</h4>
                    <p className="text-xs text-neutral-500">
                      {fuel.id === 'petrol' && 'Efficient and widespread, ideal for city driving'}
                      {fuel.id === 'diesel' && 'Great mileage, perfect for long-distance travelers'}
                      {fuel.id === 'electric' && 'Zero emissions, lower running costs with growing charging network'}
                      {fuel.id === 'hybrid' && 'Best of both worlds with improved fuel efficiency'}
                      {fuel.id === 'cng' && 'Economical and eco-friendly alternative to petrol'}
                      {fuel.id === 'lpg' && 'Affordable running costs with lower emissions than petrol'}
                      {fuel.id === 'hydrogen' && 'Future tech with water as the only emission'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded p-3 border">
                    <div className="text-xs text-neutral-500">Avg. Running Cost</div>
                    <div className="font-semibold">
                      {fuel.id === 'petrol' && '₹6-8/km'}
                      {fuel.id === 'diesel' && '₹5-7/km'}
                      {fuel.id === 'electric' && '₹1-2/km'}
                      {fuel.id === 'hybrid' && '₹4-6/km'}
                      {fuel.id === 'cng' && '₹2-3/km'}
                      {fuel.id === 'lpg' && '₹3-4/km'}
                      {fuel.id === 'hydrogen' && '₹7-9/km'}
                    </div>
                  </div>
                  <div className="bg-white rounded p-3 border">
                    <div className="text-xs text-neutral-500">Models Available</div>
                    <div className="font-semibold">
                      {fuel.id === 'petrol' && '2,500+'}
                      {fuel.id === 'diesel' && '1,800+'}
                      {fuel.id === 'electric' && '120+'}
                      {fuel.id === 'hybrid' && '350+'}
                      {fuel.id === 'cng' && '200+'}
                      {fuel.id === 'lpg' && '80+'}
                      {fuel.id === 'hydrogen' && '5+'}
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Browse {fuel.name} Vehicles
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Budget range slider */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            Budget Range
          </h3>
          <span className="text-sm font-medium">Up to {formatPrice(priceRange[0])}</span>
        </div>
        
        <Slider
          defaultValue={[500000]}
          max={5000000}
          step={50000}
          value={priceRange}
          onValueChange={handlePriceRangeChange}
          className="mb-1"
        />
        
        <div className="flex justify-between text-xs text-neutral-500">
          <span>₹50K</span>
          <span>₹50L</span>
        </div>
      </div>
      
      {/* Popular models */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            Popular Models
          </h3>
          <Button variant="link" className="text-sm p-0 h-auto">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {popularModels.map((model) => (
            <motion.div
              key={model.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg border shadow-sm overflow-hidden"
            >
              <div className="h-32 overflow-hidden">
                <img 
                  src={model.imageUrl} 
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium mb-1 truncate">{model.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-primary">
                    {formatPrice(model.price)}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`
                      text-xs 
                      ${model.fuel === 'electric' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}
                      ${model.fuel === 'petrol' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                      ${model.fuel === 'diesel' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                    `}
                  >
                    {model.fuel.charAt(0).toUpperCase() + model.fuel.slice(1)}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Pre-owned condition selector - only shown for pre-owned vehicles */}
      {isPreowned && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">
            Vehicle Condition
          </h3>
          
          <Tabs value={condition} onValueChange={setCondition} className="w-full">
            <TabsList className="grid grid-cols-3 h-auto">
              <TabsTrigger value="excellent" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Excellent
              </TabsTrigger>
              <TabsTrigger value="good" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Good
              </TabsTrigger>
              <TabsTrigger value="fair" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Fair
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="excellent" className="mt-4 bg-amber-50 p-4 rounded-lg border-amber-200 border">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-amber-600" />
                <div>
                  <h4 className="font-medium text-amber-800">Excellent Condition</h4>
                  <p className="text-xs text-amber-700">
                    Vehicles in pristine condition with minimal wear, complete service history, and like-new appearance
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="good" className="mt-4 bg-amber-50 p-4 rounded-lg border-amber-200 border">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-amber-600" />
                <div>
                  <h4 className="font-medium text-amber-800">Good Condition</h4>
                  <p className="text-xs text-amber-700">
                    Well-maintained vehicles with normal wear and tear, regular service history, and all systems functioning properly
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="fair" className="mt-4 bg-amber-50 p-4 rounded-lg border-amber-200 border">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <h4 className="font-medium text-amber-800">Fair Condition</h4>
                  <p className="text-xs text-amber-700">
                    Vehicles with visible wear that may require minor repairs but have been inspected for safety and functionality
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {/* Trending searches ticker */}
      <div className={isPreowned ? 'preowned-theme' : ''}>
        <div className="flex items-center mb-3">
          <Search className={`w-4 h-4 mr-2 ${isPreowned ? 'text-amber-600' : 'text-primary'}`} />
          <h3 className="text-sm font-medium text-neutral-500">
            Trending Searches
          </h3>
        </div>
        
        <div className="relative overflow-hidden h-8 bg-neutral-50 rounded-full">
          <motion.div
            className="absolute whitespace-nowrap flex gap-4 items-center h-full px-4"
            animate={{
              x: [0, -2000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {(isPreowned ? preownedTrendingSearches : trendingSearches).concat(isPreowned ? preownedTrendingSearches : trendingSearches).map((search, i) => (
              <span 
                key={i} 
                className="text-sm text-neutral-600 flex items-center"
              >
                <span className={`inline-block h-1.5 w-1.5 rounded-full mr-2 ${isPreowned ? 'bg-amber-500' : 'bg-primary'}`}></span>
                {search}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Feedback section */}
      <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h3 className="font-medium text-sm">Did you find the search options helpful?</h3>
          <p className="text-xs text-neutral-500 mt-1">Your feedback will help us improve our vehicle finder</p>
        </div>
        <div className="mt-3 sm:mt-0">
          <ContentReaction
            contentId={`vehicle-discovery-${selectedCategory}-${selectedFuel}`}
            contentType="feature" 
            variant="minimal"
            enableComments={true}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleDiscovery;