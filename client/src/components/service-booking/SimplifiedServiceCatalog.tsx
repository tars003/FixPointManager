import React, { useState, useEffect } from 'react';
import { 
  Car, Bike, Truck, ShoppingCart, Star, Search, Award, ChevronDown, Filter, 
  Settings, Flame, Wrench, Zap, Gauge, ChevronRight, ArrowRight, ArrowLeft,
  IndianRupee, Calendar, Clock, Heart, PercentIcon, Sparkles, Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Types
type VehicleType = 'two-wheeler' | 'three-wheeler' | 'four-wheeler' | 'heavy-vehicle';

type UserVehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  registrationNumber: string;
  fuelType?: string;
  image?: string;
};

type ServiceProvider = {
  id: string;
  name: string;
  rating: number;
  ratingCount: number;
  basePrice: number;
  discountedPrice: number | null;
  image?: string;
  features: string[];
  recommended: boolean;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  deliveryTime: string;
  warranty: string;
};

type Service = {
  id: string;
  name: string;
  description: string;
  providers: ServiceProvider[];
  estimatedTime: string;
  vehicleTypes: VehicleType[];
  image?: string;
  benefits?: string[];
};

type ServiceSubCategory = {
  id: string;
  name: string;
  description: string;
  services: Service[];
  image?: string;
};

type ServiceCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  subCategories: ServiceSubCategory[];
  image?: string;
};

type Offer = {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  validUntil: string;
  image?: string;
  backgroundColor: string;
  textColor: string;
};

interface CartItem {
  serviceId: string;
  providerId: string;
  quantity: number;
}

// Current offers data
const currentOffers: Offer[] = [
  {
    id: 'offer1',
    title: 'Monsoon Ready Offer',
    description: 'Get your vehicle monsoon-ready with our special service package',
    discount: '20% OFF',
    code: 'MONSOON20',
    validUntil: 'July 31, 2025',
    backgroundColor: 'bg-gradient-to-r from-blue-50 to-blue-100',
    textColor: 'text-blue-700'
  },
  {
    id: 'offer2',
    title: 'Summer Cooling Special',
    description: 'Beat the heat with our AC service package at special prices',
    discount: '15% OFF',
    code: 'SUMMER15',
    validUntil: 'May 31, 2025',
    backgroundColor: 'bg-gradient-to-r from-orange-50 to-orange-100',
    textColor: 'text-orange-700'
  },
  {
    id: 'offer3',
    title: 'Diwali Service Bonanza',
    description: 'Celebrate Diwali with premium services at festive prices',
    discount: '25% OFF',
    code: 'DIWALI25',
    validUntil: 'November 15, 2025',
    backgroundColor: 'bg-gradient-to-r from-purple-50 to-purple-100',
    textColor: 'text-purple-700'
  },
  {
    id: 'offer4',
    title: 'New Year Special',
    description: 'Start the year with a thorough vehicle check and service',
    discount: '30% OFF',
    code: 'NEWYEAR30',
    validUntil: 'January 31, 2026',
    backgroundColor: 'bg-gradient-to-r from-green-50 to-green-100',
    textColor: 'text-green-700'
  },
  {
    id: 'offer5',
    title: 'Referral Reward',
    description: 'Refer a friend and both get special discounts on your next service',
    discount: '₹500 OFF',
    code: 'REFER500',
    validUntil: 'Ongoing',
    backgroundColor: 'bg-gradient-to-r from-cyan-50 to-cyan-100',
    textColor: 'text-cyan-700'
  },
  {
    id: 'offer6',
    title: 'First-Time Customer',
    description: 'Special discount for first-time customers',
    discount: '10% OFF',
    code: 'FIRST10',
    validUntil: 'Ongoing',
    backgroundColor: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
    textColor: 'text-indigo-700'
  }
];

// Mock data
const userVehicles: UserVehicle[] = [
  {
    id: 'v1',
    make: 'Hyundai',
    model: 'i10',
    year: 2022,
    type: 'four-wheeler',
    registrationNumber: 'MH01AB1234',
    fuelType: 'Petrol'
  },
  {
    id: 'v2',
    make: 'Honda',
    model: 'Activa',
    year: 2021,
    type: 'two-wheeler',
    registrationNumber: 'MH02CD5678',
    fuelType: 'Petrol'
  },
  {
    id: 'v3',
    make: 'Bajaj',
    model: 'Maxima Z',
    year: 2020,
    type: 'three-wheeler',
    registrationNumber: 'MH03EF9012',
    fuelType: 'CNG'
  },
  {
    id: 'v4',
    make: 'Tata',
    model: 'Prima',
    year: 2019,
    type: 'heavy-vehicle',
    registrationNumber: 'MH04GH3456',
    fuelType: 'Diesel'
  }
];

// Service categories with nested structure
const serviceCategories: ServiceCategory[] = [
  {
    id: 'periodic-services',
    name: 'Periodic Services',
    icon: <Car className="h-5 w-5" />,
    description: 'Regular maintenance services to keep your vehicle in optimal condition',
    subCategories: [
      {
        id: 'basic-service',
        name: 'Basic Service',
        description: 'Essential maintenance for your vehicle',
        services: [
          {
            id: 'standard-service',
            name: 'Standard Service Package',
            description: 'Complete inspection with oil change and basic maintenance tasks',
            estimatedTime: '3-4 hours',
            vehicleTypes: ['two-wheeler', 'three-wheeler', 'four-wheeler', 'heavy-vehicle'],
            benefits: ['Improved fuel efficiency', 'Enhanced engine performance', 'Early detection of issues'],
            providers: [
              {
                id: 'provider1',
                name: 'FixPoint Authorized Service',
                rating: 4.8,
                ratingCount: 1243,
                basePrice: 3299,
                discountedPrice: 2799,
                features: ['Free Pickup & Drop', 'Genuine Parts', '3 Month Warranty'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '3 Months'
              },
              {
                id: 'provider2',
                name: 'QuickMech Services',
                rating: 4.5,
                ratingCount: 856,
                basePrice: 2999,
                discountedPrice: 2599,
                features: ['Doorstep Service', 'Genuine Parts'],
                recommended: false,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '2 Months'
              }
            ]
          }
        ]
      },
      {
        id: 'comprehensive-service',
        name: 'Comprehensive Service',
        description: 'Thorough maintenance for optimal performance',
        services: [
          {
            id: 'premium-service',
            name: 'Premium Service Package',
            description: 'Extensive service with detailed system checks and premium oil',
            estimatedTime: '4-5 hours',
            vehicleTypes: ['four-wheeler', 'heavy-vehicle'],
            benefits: ['Comprehensive diagnostics', 'Premium quality oils', 'Extended vehicle life'],
            providers: [
              {
                id: 'provider1',
                name: 'FixPoint Authorized Service',
                rating: 4.8,
                ratingCount: 1243,
                basePrice: 4599,
                discountedPrice: 3999,
                features: ['Free Pickup & Drop', 'Genuine Parts', '6 Month Warranty'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '6 Months'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ac-service',
    name: 'AC Service & Repair',
    icon: <Flame className="h-5 w-5" />,
    description: 'Cooling system maintenance and repair services',
    subCategories: [
      {
        id: 'ac-performance',
        name: 'AC Performance Check',
        description: 'Diagnose AC system performance',
        services: [
          {
            id: 'ac-check-service',
            name: 'AC Performance Evaluation',
            description: 'Complete testing of AC performance with leak detection',
            estimatedTime: '1-2 hours',
            vehicleTypes: ['four-wheeler', 'heavy-vehicle'],
            benefits: ['Improved cooling', 'Identify refrigerant leaks', 'System optimization'],
            providers: [
              {
                id: 'provider3',
                name: 'CoolCar AC Specialists',
                rating: 4.7,
                ratingCount: 542,
                basePrice: 1299,
                discountedPrice: 999,
                features: ['Specialized AC Technicians', 'Performance Report'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '1 Month'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'batteries',
    name: 'Batteries',
    icon: <Zap className="h-5 w-5" />,
    description: 'Battery replacement and maintenance services',
    subCategories: [
      {
        id: 'car-batteries',
        name: 'Car Batteries',
        description: 'High-performance batteries for cars',
        services: [
          {
            id: 'amaron-battery',
            name: 'Amaron (55 Months Warranty)',
            description: '35 Amp Hour battery with free installation',
            estimatedTime: '30-45 mins',
            vehicleTypes: ['four-wheeler'],
            benefits: ['Long service life', 'Maintenance-free', 'High cranking power'],
            providers: [
              {
                id: 'provider4',
                name: 'Amaron Official',
                rating: 4.6,
                ratingCount: 876,
                basePrice: 6111,
                discountedPrice: 5500,
                features: ['Free Pickup & Drop', 'Free Installation', 'Old Battery Price Included', 'Available at Doorstep'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '55 Months'
              }
            ]
          }
        ]
      },
      {
        id: 'bike-batteries',
        name: 'Bike Batteries',
        description: 'Reliable batteries for two-wheelers',
        services: [
          {
            id: 'exide-bike-battery',
            name: 'Exide Bike (36 Months Warranty)',
            description: 'Reliable battery for motorcycles and scooters',
            estimatedTime: '20-30 mins',
            vehicleTypes: ['two-wheeler'],
            benefits: ['Zero maintenance', 'Quick start capability', 'Vibration resistant'],
            providers: [
              {
                id: 'provider5',
                name: 'Exide Official',
                rating: 4.5,
                ratingCount: 755,
                basePrice: 2399,
                discountedPrice: 1999,
                features: ['Free Installation', 'Old Battery Disposal'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '36 Months'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'tyres',
    name: 'Tyres & Wheel Care',
    icon: <Gauge className="h-5 w-5" />,
    description: 'Tyre replacement, wheel alignment, and balancing services',
    subCategories: [
      {
        id: 'car-tyres',
        name: 'Car Tyres',
        description: 'Premium tyres for cars and SUVs',
        services: [
          {
            id: 'mrf-tyres',
            name: 'MRF ZLX (Set of 4)',
            description: 'Premium car tyres with balancing and alignment',
            estimatedTime: '1-2 hours',
            vehicleTypes: ['four-wheeler'],
            benefits: ['Superior grip', 'Reduced road noise', 'Better fuel efficiency'],
            providers: [
              {
                id: 'provider6',
                name: 'MRF Authorized Dealer',
                rating: 4.7,
                ratingCount: 632,
                basePrice: 24999,
                discountedPrice: 21999,
                features: ['Alignment & Balancing Included', 'Warranty Against Manufacturing Defects'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '5 Years'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'denting-painting',
    name: 'Denting & Painting',
    icon: <Settings className="h-5 w-5" />,
    description: 'Body repair and painting services for your vehicle',
    subCategories: [
      {
        id: 'full-body-painting',
        name: 'Full Body Painting',
        description: 'Complete vehicle repainting',
        services: [
          {
            id: 'premium-painting',
            name: 'Premium Painting Service',
            description: 'High-quality painting with 3-layer coating',
            estimatedTime: '3-4 days',
            vehicleTypes: ['four-wheeler'],
            benefits: ['UV protection', 'Scratch resistance', 'Long-lasting finish'],
            providers: [
              {
                id: 'provider7',
                name: 'ColorMaster Auto Paint',
                rating: 4.8,
                ratingCount: 324,
                basePrice: 35000,
                discountedPrice: 29999,
                features: ['Premium Paint', 'Multiple Coats', '3 Year Warranty'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: '4 Days',
                warranty: '3 Years'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'detailing-services',
    name: 'Detailing Services',
    icon: <Settings className="h-5 w-5" />,
    description: 'Premium detailing and deep cleaning services',
    subCategories: [
      {
        id: 'interior-detailing',
        name: 'Interior Detailing',
        description: 'Deep cleaning of vehicle interior',
        services: [
          {
            id: 'premium-interior-detailing',
            name: 'Premium Interior Detailing',
            description: 'Complete interior deep cleaning and sanitization',
            estimatedTime: '4-5 hours',
            vehicleTypes: ['four-wheeler'],
            benefits: ['Allergen removal', 'Odor elimination', 'Fabric protection'],
            providers: [
              {
                id: 'provider8',
                name: 'Detailers Pro',
                rating: 4.9,
                ratingCount: 218,
                basePrice: 5999,
                discountedPrice: 4999,
                features: ['Steam Cleaning', 'Germicidal Treatment', 'Fabric Protection'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '1 Month'
              }
            ]
          }
        ]
      }
    ]
  }
];

// Vehicle type color palettes
const vehicleColorPalettes = {
  'two-wheeler': {
    primary: 'bg-emerald-600',
    secondary: 'bg-emerald-100',
    text: 'text-emerald-700'
  },
  'three-wheeler': {
    primary: 'bg-amber-600',
    secondary: 'bg-amber-100',
    text: 'text-amber-700'
  },
  'four-wheeler': {
    primary: 'bg-blue-600',
    secondary: 'bg-blue-100',
    text: 'text-blue-700'
  },
  'heavy-vehicle': {
    primary: 'bg-purple-600',
    secondary: 'bg-purple-100',
    text: 'text-purple-700'
  }
};

const SimplifiedServiceCatalog = () => {
  const { toast } = useToast();
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('four-wheeler');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<UserVehicle | null>(userVehicles[0]);
  const [userPoints, setUserPoints] = useState<number>(450);
  const [selectedCategory, setSelectedCategory] = useState<string>(serviceCategories[0].id);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    serviceCategories[0].subCategories.length > 0 ? serviceCategories[0].subCategories[0].id : null
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 50000]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [offerCarouselIndex, setOfferCarouselIndex] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [serviceSort, setServiceSort] = useState<'price-low' | 'price-high' | 'rating' | 'popularity'>('popularity');
  
  // Additional filter states
  const [availabilityFilters, setAvailabilityFilters] = useState<{
    inStock: boolean;
    doorstep: boolean;
    freePickup: boolean;
    sameDay: boolean;
  }>({
    inStock: false,
    doorstep: false,
    freePickup: false,
    sameDay: false,
  });

  // Find current category and subcategory objects
  const currentCategory = serviceCategories.find(c => c.id === selectedCategory);
  const currentSubCategory = currentCategory?.subCategories.find(s => s.id === selectedSubCategory);
  
  // Get services for the current subcategory
  const currentServices = currentSubCategory?.services || [];
  
  // Filter services based on vehicle type, search query, price range, and rating
  const filteredServices = currentServices.filter(service => {
    // Vehicle type filter
    if (!service.vehicleTypes.includes(selectedVehicleType)) return false;
    
    // Search query filter
    if (searchQuery !== '' && 
        !service.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !service.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Price filter - check if any provider's price is within range
    const hasProviderInPriceRange = service.providers.some(provider => {
      const price = provider.discountedPrice || provider.basePrice;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    if (!hasProviderInPriceRange) return false;
    
    // Rating filter
    if (ratingFilter !== null) {
      const hasProviderWithRating = service.providers.some(provider => provider.rating >= ratingFilter);
      if (!hasProviderWithRating) return false;
    }
    
    // Availability filters
    if (availabilityFilters.inStock) {
      const hasInStockProvider = service.providers.some(p => p.availability === 'in-stock');
      if (!hasInStockProvider) return false;
    }
    
    if (availabilityFilters.doorstep) {
      const hasDoorstepProvider = service.providers.some(p => 
        p.features.some(f => f.toLowerCase().includes('doorstep'))
      );
      if (!hasDoorstepProvider) return false;
    }
    
    if (availabilityFilters.freePickup) {
      const hasPickupProvider = service.providers.some(p => 
        p.features.some(f => f.toLowerCase().includes('pickup'))
      );
      if (!hasPickupProvider) return false;
    }
    
    if (availabilityFilters.sameDay) {
      const hasSameDayProvider = service.providers.some(p => 
        p.deliveryTime.toLowerCase().includes('same day')
      );
      if (!hasSameDayProvider) return false;
    }
    
    return true;
  });
  
  // Sort filtered services
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (serviceSort === 'price-low') {
      const aMinPrice = Math.min(...a.providers.map(p => p.discountedPrice || p.basePrice));
      const bMinPrice = Math.min(...b.providers.map(p => p.discountedPrice || p.basePrice));
      return aMinPrice - bMinPrice;
    } else if (serviceSort === 'price-high') {
      const aMaxPrice = Math.max(...a.providers.map(p => p.discountedPrice || p.basePrice));
      const bMaxPrice = Math.max(...b.providers.map(p => p.discountedPrice || p.basePrice));
      return bMaxPrice - aMaxPrice;
    } else if (serviceSort === 'rating') {
      const aMaxRating = Math.max(...a.providers.map(p => p.rating));
      const bMaxRating = Math.max(...b.providers.map(p => p.rating));
      return bMaxRating - aMaxRating;
    } else {
      // Default: popularity - use the one with most rated providers
      const aTotalRatings = a.providers.reduce((sum, p) => sum + p.ratingCount, 0);
      const bTotalRatings = b.providers.reduce((sum, p) => sum + p.ratingCount, 0);
      return bTotalRatings - aTotalRatings;
    }
  });
  
  // Get recommended services for the current vehicle type
  const recommendedServices = serviceCategories
    .flatMap(category => category.subCategories)
    .flatMap(subCat => subCat.services)
    .filter(service => 
      service.vehicleTypes.includes(selectedVehicleType) &&
      service.providers.some(provider => provider.recommended)
    )
    .slice(0, 4);
  
  // Price formatter
  const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString()}`;
  };

  // Helper function to check if an item is in cart
  const isInCart = (serviceId: string, providerId: string): boolean => {
    return cartItems.some(item => item.serviceId === serviceId && item.providerId === providerId);
  };

  // Add to cart handler
  const handleAddToCart = (serviceId: string, providerId: string) => {
    if (!isInCart(serviceId, providerId)) {
      setCartItems([...cartItems, { serviceId, providerId, quantity: 1 }]);
      
      toast({
        title: "Added to cart",
        description: "Service has been added to your cart",
        duration: 2000,
      });
    }
  };

  // Remove from cart handler
  const handleRemoveFromCart = (serviceId: string, providerId: string) => {
    setCartItems(cartItems.filter(
      item => !(item.serviceId === serviceId && item.providerId === providerId)
    ));
  };

  // Helper to render star ratings
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  // Get service or provider details by ID
  const getServiceById = (serviceId: string) => {
    return serviceCategories
      .flatMap(cat => cat.subCategories)
      .flatMap(subCat => subCat.services)
      .find(s => s.id === serviceId);
  };
  
  const getProviderById = (providerId: string) => {
    return serviceCategories
      .flatMap(cat => cat.subCategories)
      .flatMap(subCat => subCat.services)
      .flatMap(s => s.providers)
      .find(p => p.id === providerId);
  };
  
  // Calculate cart total
  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const service = getServiceById(item.serviceId);
      const provider = service?.providers.find(p => p.id === item.providerId);
      
      if (service && provider) {
        return total + (provider.discountedPrice || provider.basePrice) * item.quantity;
      }
      
      return total;
    }, 0);
  };
  
  // Offer carousel controls
  const handlePrevOffer = () => {
    setOfferCarouselIndex(prev => 
      prev === 0 ? currentOffers.length - 1 : prev - 1
    );
  };
  
  const handleNextOffer = () => {
    setOfferCarouselIndex(prev => 
      prev === currentOffers.length - 1 ? 0 : prev + 1
    );
  };
  
  // Filter reset
  const resetFilters = () => {
    setPriceRange([500, 50000]);
    setRatingFilter(null);
    setAvailabilityFilters({
      inStock: false,
      doorstep: false,
      freePickup: false,
      sameDay: false
    });
    setServiceSort('popularity');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book Service</h1>
        <p className="text-gray-600">Find and book professional services for your vehicle</p>
      </div>
      
      {/* Vehicle selection tabs - non-overlapping with spacing */}
      <div className="mb-8">
        <Tabs 
          defaultValue={selectedVehicleType} 
          onValueChange={(value) => {
            setSelectedVehicleType(value as VehicleType);
            
            // Find a vehicle of this type and set it as selected
            const vehicleOfType = userVehicles.find(v => v.type === value);
            if (vehicleOfType) {
              setSelectedVehicle(vehicleOfType);
            }
          }}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-4 mb-2">
            <TabsTrigger value="two-wheeler" className="px-2 md:px-4 py-2 gap-2">
              <Bike className="h-4 w-4" />
              <span className="hidden md:inline text-sm whitespace-nowrap">Two Wheeler</span>
            </TabsTrigger>
            <TabsTrigger value="three-wheeler" className="px-2 md:px-4 py-2 gap-2">
              <span className="text-lg">🛺</span>
              <span className="hidden md:inline text-sm whitespace-nowrap">Three Wheeler</span>
            </TabsTrigger>
            <TabsTrigger value="four-wheeler" className="px-2 md:px-4 py-2 gap-2">
              <Car className="h-4 w-4" />
              <span className="hidden md:inline text-sm whitespace-nowrap">Four Wheeler</span>
            </TabsTrigger>
            <TabsTrigger value="heavy-vehicle" className="px-2 md:px-4 py-2 gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden md:inline text-sm whitespace-nowrap">Heavy Vehicle</span>
            </TabsTrigger>
          </TabsList>

          {/* Content for each vehicle tab with animations */}
          <AnimatePresence mode="wait">
            {['two-wheeler', 'three-wheeler', 'four-wheeler', 'heavy-vehicle'].map((type) => (
              selectedVehicleType === type && (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Selected vehicle info */}
                  {selectedVehicle && selectedVehicle.type === type && (
                    <div className={`${vehicleColorPalettes[type as VehicleType].secondary} p-4 rounded-lg mb-6 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <div className={`${vehicleColorPalettes[type as VehicleType].primary} h-10 w-10 rounded-full flex items-center justify-center`}>
                          {type === 'four-wheeler' && <Car className="h-5 w-5 text-white" />}
                          {type === 'two-wheeler' && <Bike className="h-5 w-5 text-white" />}
                          {type === 'three-wheeler' && <span>🛺</span>}
                          {type === 'heavy-vehicle' && <Truck className="h-5 w-5 text-white" />}
                        </div>
                        <div>
                          <div className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <span>{selectedVehicle.registrationNumber}</span>
                            {selectedVehicle.fuelType && (
                              <Badge variant="outline" className="ml-2 text-xs py-0 h-5">
                                {selectedVehicle.fuelType}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            Change Vehicle
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {userVehicles
                            .filter(vehicle => vehicle.type === type)
                            .map(vehicle => (
                              <DropdownMenuItem 
                                key={vehicle.id} 
                                onClick={() => setSelectedVehicle(vehicle)}
                              >
                                {vehicle.make} {vehicle.model} - {vehicle.registrationNumber}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </Tabs>
      </div>
      
      {/* Current Offers Carousel - First Dynamic Carousel */}
      <div className="mb-8 relative overflow-hidden rounded-xl">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <PercentIcon className="h-5 w-5 mr-2 text-yellow-500" />
          Current Offers
        </h2>
        <div className="relative">
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white/90"
            onClick={handlePrevOffer}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={offerCarouselIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className={`${currentOffers[offerCarouselIndex].backgroundColor} ${currentOffers[offerCarouselIndex].textColor} p-6 rounded-xl`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-bold">{currentOffers[offerCarouselIndex].title}</h3>
                    <p className="text-sm opacity-90 max-w-2xl">{currentOffers[offerCarouselIndex].description}</p>
                    <div className="mt-2 text-sm flex items-center">
                      <Badge variant="outline" className="mr-2 font-mono">
                        {currentOffers[offerCarouselIndex].code}
                      </Badge>
                      <span>Valid till: {currentOffers[offerCarouselIndex].validUntil}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{currentOffers[offerCarouselIndex].discount}</div>
                    <Button size="sm" variant="outline" className="mt-2">Apply Offer</Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white/90"
            onClick={handleNextOffer}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-center mt-2 gap-1">
          {currentOffers.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === offerCarouselIndex ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300'
              }`}
              onClick={() => setOfferCarouselIndex(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Search and Cart row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search services..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex-1 flex justify-center">
          <Select value={serviceSort} onValueChange={(value) => setServiceSort(value as any)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart ({cartItems.length})
          </Button>
          
          <div className="flex items-center px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
            <Award className="h-5 w-5 text-amber-500 mr-1" />
            <span className="font-medium">{userPoints} points</span>
          </div>
        </div>
      </div>
      
      {/* Recommended Services Carousel - Second Dynamic Carousel */}
      {recommendedServices.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
            Recommended for Your {selectedVehicle?.make} {selectedVehicle?.model}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedServices.map(service => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader className={`${vehicleColorPalettes[selectedVehicleType].secondary} pb-3`}>
                    <Badge className="w-fit mb-2 bg-amber-500 hover:bg-amber-600">Recommended</Badge>
                    <CardTitle className="text-base">{service.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 flex-grow">
                    {service.benefits && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Benefits:</p>
                        <ul className="text-sm text-gray-600">
                          {service.benefits.slice(0, 2).map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 mb-1">
                              <Check className="h-3 w-3 text-green-500 mt-1 shrink-0" />
                              <span className="line-clamp-1">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium mb-1">Best Provider:</p>
                      {service.providers
                        .filter(p => p.recommended)
                        .slice(0, 1)
                        .map(provider => (
                          <div key={provider.id} className="p-2 border rounded-md">
                            <div className="flex justify-between items-center mb-1">
                              <div className="font-medium">{provider.name}</div>
                              <div className="flex items-center">
                                {renderStarRating(provider.rating)}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-lg">
                                  {formatPrice(provider.discountedPrice || provider.basePrice)}
                                </span>
                                {provider.discountedPrice && (
                                  <span className="text-xs text-gray-500 line-through ml-1">
                                    {formatPrice(provider.basePrice)}
                                  </span>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {service.estimatedTime}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full"
                      variant={isInCart(service.id, service.providers[0].id) ? "destructive" : "default"}
                      onClick={() => {
                        const recommendedProvider = service.providers.find(p => p.recommended) || service.providers[0];
                        if (isInCart(service.id, recommendedProvider.id)) {
                          handleRemoveFromCart(service.id, recommendedProvider.id);
                        } else {
                          handleAddToCart(service.id, recommendedProvider.id);
                        }
                      }}
                    >
                      {isInCart(service.id, service.providers[0].id) ? "Remove from Cart" : "Add to Cart"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Service Categories - Hierarchical Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        <div className="md:col-span-3">
          <h2 className="text-xl font-bold mb-4">Service Categories</h2>
          <div className="border rounded-lg overflow-hidden">
            <ScrollArea className="h-[400px] md:h-auto">
              {serviceCategories.map(category => (
                <div key={category.id}>
                  <Button
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className={`w-full justify-start rounded-none h-auto py-3 px-4 ${
                      selectedCategory === category.id ? `${vehicleColorPalettes[selectedVehicleType].text}` : ""
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      if (category.subCategories.length > 0) {
                        setSelectedSubCategory(category.subCategories[0].id);
                      } else {
                        setSelectedSubCategory(null);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                  </Button>
                  
                  {/* Sub-categories when selected */}
                  {selectedCategory === category.id && category.subCategories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50"
                    >
                      {category.subCategories.map(subcat => (
                        <Button
                          key={subcat.id}
                          variant="ghost"
                          className={`w-full justify-start rounded-none pl-10 py-2 ${
                            selectedSubCategory === subcat.id ? `font-medium ${vehicleColorPalettes[selectedVehicleType].text}` : "text-gray-600"
                          }`}
                          onClick={() => setSelectedSubCategory(subcat.id)}
                        >
                          {subcat.name}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
        
        <div className="md:col-span-9">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center">
                {currentCategory?.name}
                {currentSubCategory && (
                  <>
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <span className="text-lg">{currentSubCategory.name}</span>
                  </>
                )}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {currentSubCategory?.description || currentCategory?.description}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          
          {/* Advanced Filters - Collapsible */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <CircleDollarSign className="h-4 w-4 mr-1" />
                          Price Range
                        </h3>
                        <div className="px-2">
                          <Slider
                            value={priceRange}
                            min={500}
                            max={50000}
                            step={500}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                            className="mb-2"
                          />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{formatPrice(priceRange[0])}</span>
                            <span>{formatPrice(priceRange[1])}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          Minimum Rating
                        </h3>
                        <div className="flex items-center gap-2">
                          {[4.5, 4.0, 3.5, 0].map(rating => (
                            <Button
                              key={rating}
                              variant={ratingFilter === rating ? "default" : "outline"}
                              size="sm"
                              className="flex items-center"
                              onClick={() => setRatingFilter(rating === 0 ? null : rating)}
                            >
                              {rating === 0 ? "Any" : `${rating}+`}
                              {rating > 0 && <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Availability
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="inStock" 
                              checked={availabilityFilters.inStock}
                              onCheckedChange={(checked) => 
                                setAvailabilityFilters({...availabilityFilters, inStock: checked as boolean})
                              }
                            />
                            <label htmlFor="inStock" className="text-sm">In stock</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="doorstep" 
                              checked={availabilityFilters.doorstep}
                              onCheckedChange={(checked) => 
                                setAvailabilityFilters({...availabilityFilters, doorstep: checked as boolean})
                              }
                            />
                            <label htmlFor="doorstep" className="text-sm">Doorstep service</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="freePickup" 
                              checked={availabilityFilters.freePickup}
                              onCheckedChange={(checked) => 
                                setAvailabilityFilters({...availabilityFilters, freePickup: checked as boolean})
                              }
                            />
                            <label htmlFor="freePickup" className="text-sm">Free pickup</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="sameDay" 
                              checked={availabilityFilters.sameDay}
                              onCheckedChange={(checked) => 
                                setAvailabilityFilters({...availabilityFilters, sameDay: checked as boolean})
                              }
                            />
                            <label htmlFor="sameDay" className="text-sm">Same day service</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={resetFilters}
                          className="mr-2"
                        >
                          Reset Filters
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => setShowAdvancedFilters(false)}
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Services Grid - with animation */}
          <div className="mb-4">
            <Badge variant="outline" className="mb-4">
              Showing {sortedServices.length} services
            </Badge>
            
            {sortedServices.length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <div className="text-gray-400 mb-2">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium">No services found</h3>
                <p className="text-gray-600">Try adjusting your filters or search term</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedServices.map(service => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className={`${vehicleColorPalettes[selectedVehicleType].secondary} pb-3`}>
                        <CardTitle className="text-base">{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.estimatedTime}
                          </Badge>
                          {service.benefits && service.benefits.length > 0 && (
                            <Badge variant="outline">
                              <Check className="h-3 w-3 mr-1" />
                              {service.benefits[0]}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {service.providers.map(provider => (
                            <motion.div
                              key={provider.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="p-3 border rounded-md"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <div className="font-medium flex items-center">
                                    {provider.name}
                                    {provider.recommended && (
                                      <Badge className="ml-2 text-xs bg-amber-500 hover:bg-amber-600">
                                        Recommended
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    {renderStarRating(provider.rating)}
                                    <span className="ml-1">({provider.ratingCount})</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-lg">
                                    {formatPrice(provider.discountedPrice || provider.basePrice)}
                                  </div>
                                  {provider.discountedPrice && (
                                    <div className="text-xs text-gray-500 line-through">
                                      {formatPrice(provider.basePrice)}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 my-2">
                                {provider.features.slice(0, 3).map((feature, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                                {provider.features.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{provider.features.length - 3} more
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex justify-between items-center mt-3">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      provider.availability === 'in-stock' 
                                        ? 'text-green-600 border-green-200 bg-green-50' 
                                        : provider.availability === 'limited' 
                                          ? 'text-amber-600 border-amber-200 bg-amber-50'
                                          : 'text-red-600 border-red-200 bg-red-50'
                                    }`}
                                  >
                                    {provider.availability === 'in-stock' 
                                      ? 'In Stock'
                                      : provider.availability === 'limited'
                                        ? 'Limited Availability'
                                        : 'Out of Stock'
                                    }
                                  </Badge>
                                </div>
                                <Button 
                                  size="sm"
                                  variant={isInCart(service.id, provider.id) ? "destructive" : "default"}
                                  onClick={() => {
                                    if (isInCart(service.id, provider.id)) {
                                      handleRemoveFromCart(service.id, provider.id);
                                    } else {
                                      handleAddToCart(service.id, provider.id);
                                    }
                                  }}
                                  className="gap-2"
                                >
                                  {isInCart(service.id, provider.id) ? (
                                    <>Remove</>
                                  ) : (
                                    <>Add to Cart<ShoppingCart className="h-3 w-3" /></>
                                  )}
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedServiceCatalog;