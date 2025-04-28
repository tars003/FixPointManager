import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Bike, 
  Truck, 
  ShoppingCart, 
  Heart, 
  Star, 
  Filter, 
  ChevronDown,
  ChevronRight,
  Check,
  Search,
  Clock,
  Gift,
  Sparkles,
  Award,
  Zap,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Flame,
  Gauge,
  Wrench,
  Settings,
  Trash,
  Plus,
  CircleDollarSign,
  Droplet,
  Percent,
  Waves,
  CalendarClock,
  CalendarCheck,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Types for our service items
type VehicleType = 'two-wheeler' | 'three-wheeler' | 'four-wheeler' | 'heavy-vehicle';

// User's vehicle model type
type UserVehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  registrationNumber: string;
  image?: string;
};

type ServiceProvider = {
  id: string;
  name: string;
  rating: number;
  ratingCount: number;
  basePrice: number;
  discountedPrice: number | null;
  image: string;
  features: string[];
  recommended: boolean;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  deliveryTime: string;
  warranty: string;
};

type ServiceCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  subCategories: ServiceSubCategory[];
};

type ServiceSubCategory = {
  id: string;
  name: string;
  services: Service[];
};

type Service = {
  id: string;
  name: string;
  description: string;
  providers: ServiceProvider[];
  estimatedTime: string;
  vehicleTypes: VehicleType[];
};

// Mock data for service categories
const serviceCategories: ServiceCategory[] = [
  {
    id: 'periodic-services',
    name: 'Periodic Services',
    icon: <Car className="h-5 w-5" />,
    subCategories: [
      {
        id: 'basic-service',
        name: 'Basic Service',
        services: [
          {
            id: 'standard-service',
            name: 'Standard Service Package',
            description: 'Complete inspection with oil change and basic maintenance tasks',
            estimatedTime: '3-4 hours',
            vehicleTypes: ['two-wheeler', 'three-wheeler', 'four-wheeler', 'heavy-vehicle'],
            providers: [
              {
                id: 'service-provider-1',
                name: 'FixPoint Authorized Service',
                rating: 4.8,
                ratingCount: 1243,
                basePrice: 3299,
                discountedPrice: 2799,
                image: '/assets/service-providers/fixpoint.png',
                features: ['Free Pickup & Drop', 'Genuine Parts', '3 Month Warranty'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '3 Months'
              },
              {
                id: 'service-provider-2',
                name: 'QuickMech Services',
                rating: 4.5,
                ratingCount: 856,
                basePrice: 2999,
                discountedPrice: 2599,
                image: '/assets/service-providers/quickmech.png',
                features: ['Doorstep Service', 'Genuine Parts'],
                recommended: false,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '2 Months'
              }
            ]
          },
          {
            id: 'comprehensive-service',
            name: 'Comprehensive Service Package',
            description: 'Detailed servicing with fluid checks, filter replacements, and thorough inspection',
            estimatedTime: '5-6 hours',
            vehicleTypes: ['four-wheeler', 'heavy-vehicle'],
            providers: [
              {
                id: 'service-provider-1',
                name: 'FixPoint Authorized Service',
                rating: 4.8,
                ratingCount: 1243,
                basePrice: 5999,
                discountedPrice: 4999,
                image: '/assets/service-providers/fixpoint.png',
                features: ['Free Pickup & Drop', 'Genuine Parts', '6 Month Warranty', 'Engine Scanning'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '6 Months'
              }
            ]
          }
        ]
      },
      {
        id: 'standard-service',
        name: 'Standard Service',
        services: [
          {
            id: 'premium-service',
            name: 'Premium Service Package',
            description: 'Extensive service with detailed system checks and premium oil',
            estimatedTime: '4-5 hours',
            vehicleTypes: ['four-wheeler', 'heavy-vehicle'],
            providers: [
              {
                id: 'service-provider-1',
                name: 'FixPoint Authorized Service',
                rating: 4.8,
                ratingCount: 1243,
                basePrice: 4599,
                discountedPrice: 3999,
                image: '/assets/service-providers/fixpoint.png',
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
    icon: <div className="flex items-center justify-center h-5 w-5">❄️</div>,
    subCategories: [
      {
        id: 'ac-performance',
        name: 'AC Performance Check',
        services: [
          {
            id: 'ac-check-service',
            name: 'AC Performance Evaluation',
            description: 'Complete testing of AC performance with leak detection',
            estimatedTime: '1-2 hours',
            vehicleTypes: ['four-wheeler', 'heavy-vehicle'],
            providers: [
              {
                id: 'service-provider-3',
                name: 'CoolCar AC Specialists',
                rating: 4.7,
                ratingCount: 542,
                basePrice: 1299,
                discountedPrice: 999,
                image: '/assets/service-providers/coolcar.png',
                features: ['Specialized AC Technicians', 'Performance Report'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '1 Month'
              }
            ]
          }
        ]
      },
      {
        id: 'ac-repair',
        name: 'AC Repair',
        services: [
          {
            id: 'ac-repair-service',
            name: 'Complete AC Repair',
            description: 'Diagnosis and repair of AC system issues including gas refill',
            estimatedTime: '3-4 hours',
            vehicleTypes: ['four-wheeler', 'heavy-vehicle'],
            providers: [
              {
                id: 'service-provider-3',
                name: 'CoolCar AC Specialists',
                rating: 4.7,
                ratingCount: 542,
                basePrice: 3599,
                discountedPrice: 2999,
                image: '/assets/service-providers/coolcar.png',
                features: ['Specialized AC Technicians', '3 Month Warranty', 'Gas Refill Included'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '3 Months'
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
    icon: <div className="flex items-center justify-center h-5 w-5">🔋</div>,
    subCategories: [
      {
        id: 'car-batteries',
        name: 'Car Batteries',
        services: [
          {
            id: 'amaron-battery',
            name: 'Amaron (55 Months Warranty)',
            description: '35 Amp Hour battery with free installation',
            estimatedTime: '30-45 mins',
            vehicleTypes: ['four-wheeler'],
            providers: [
              {
                id: 'service-provider-4',
                name: 'Amaron Official',
                rating: 4.6,
                ratingCount: 876,
                basePrice: 6111,
                discountedPrice: 5500,
                image: '/assets/service-providers/amaron.png',
                features: ['Free Pickup & Drop', 'Free Installation', 'Old Battery Price Included', 'Available at Doorstep'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '55 Months'
              }
            ]
          },
          {
            id: 'exide-battery',
            name: 'Exide (48 Months Warranty)',
            description: '35 Amp Hour battery with doorstep service',
            estimatedTime: '30-45 mins',
            vehicleTypes: ['four-wheeler'],
            providers: [
              {
                id: 'service-provider-5',
                name: 'Exide Official',
                rating: 4.5,
                ratingCount: 755,
                basePrice: 5899,
                discountedPrice: 5200,
                image: '/assets/service-providers/exide.png',
                features: ['Free Installation', 'Old Battery Disposal', 'Doorstep Service'],
                recommended: false,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '48 Months'
              }
            ]
          }
        ]
      },
      {
        id: 'bike-batteries',
        name: 'Bike Batteries',
        services: [
          {
            id: 'exide-bike-battery',
            name: 'Exide Bike (36 Months Warranty)',
            description: 'Reliable battery for motorcycles and scooters',
            estimatedTime: '20-30 mins',
            vehicleTypes: ['two-wheeler'],
            providers: [
              {
                id: 'service-provider-5',
                name: 'Exide Official',
                rating: 4.5,
                ratingCount: 755,
                basePrice: 2399,
                discountedPrice: 1999,
                image: '/assets/service-providers/exide.png',
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
    icon: <div className="flex items-center justify-center h-5 w-5">🛞</div>,
    subCategories: [
      {
        id: 'car-tyres',
        name: 'Car Tyres',
        services: [
          {
            id: 'mrf-tyres',
            name: 'MRF ZLX (Set of 4)',
            description: 'Premium car tyres with balancing and alignment',
            estimatedTime: '1-2 hours',
            vehicleTypes: ['four-wheeler'],
            providers: [
              {
                id: 'service-provider-6',
                name: 'MRF Authorized Dealer',
                rating: 4.7,
                ratingCount: 632,
                basePrice: 24999,
                discountedPrice: 21999,
                image: '/assets/service-providers/mrf.png',
                features: ['Alignment & Balancing Included', 'Warranty Against Manufacturing Defects'],
                recommended: true,
                availability: 'in-stock',
                deliveryTime: 'Same Day',
                warranty: '5 Years'
              }
            ]
          }
        ]
      },
      {
        id: 'wheel-alignment',
        name: 'Wheel Alignment & Balancing',
        services: [
          {
            id: 'complete-alignment',
            name: 'Computerized Wheel Alignment',
            description: 'Precision wheel alignment with computerized equipment',
            estimatedTime: '45-60 mins',
            vehicleTypes: ['four-wheeler', 'heavy-vehicle'],
            providers: [
              {
                id: 'service-provider-7',
                name: 'TyreXperts',
                rating: 4.6,
                ratingCount: 415,
                basePrice: 1299,
                discountedPrice: 999,
                image: '/assets/service-providers/tyrexperts.png',
                features: ['Computerized Alignment', 'Before-After Report'],
                recommended: false,
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
    id: 'denting',
    name: 'Denting & Painting',
    icon: <div className="flex items-center justify-center h-5 w-5">🎨</div>,
    subCategories: []
  },
  {
    id: 'detailing',
    name: 'Detailing Services',
    icon: <div className="flex items-center justify-center h-5 w-5">✨</div>,
    subCategories: []
  },
  {
    id: 'car-spa',
    name: 'Car Spa & Cleaning',
    icon: <div className="flex items-center justify-center h-5 w-5">🧼</div>,
    subCategories: []
  },
  {
    id: 'windshields',
    name: 'Windshields & Lights',
    icon: <div className="flex items-center justify-center h-5 w-5">🪟</div>,
    subCategories: []
  },
  {
    id: 'custom-repairs',
    name: 'Custom Repairs',
    icon: <div className="flex items-center justify-center h-5 w-5">🔧</div>,
    subCategories: []
  }
];

// Interface for cart items
interface CartItem {
  serviceId: string;
  providerId: string;
  quantity: number;
}

// Interface for wishlist items
interface WishlistItem {
  serviceId: string;
  providerId: string;
}

// Mock user vehicles - normally these would come from an API call
const userVehicles: UserVehicle[] = [
  {
    id: 'v1',
    make: 'Hyundai',
    model: 'i10',
    year: 2022,
    type: 'four-wheeler',
    registrationNumber: 'MH01AB1234',
    image: '/hyundai-i10.jpg'
  },
  {
    id: 'v2',
    make: 'Honda',
    model: 'Activa',
    year: 2021,
    type: 'two-wheeler',
    registrationNumber: 'MH02CD5678',
    image: '/honda-activa.jpg'
  },
  {
    id: 'v3',
    make: 'Tata',
    model: 'Ace',
    year: 2020,
    type: 'three-wheeler',
    registrationNumber: 'MH03EF9012',
    image: '/tata-ace.jpg'
  },
  {
    id: 'v4',
    make: 'Mahindra',
    model: 'Bolero Pickup',
    year: 2019,
    type: 'heavy-vehicle',
    registrationNumber: 'MH04GH3456',
    image: '/mahindra-bolero.jpg'
  }
];

const ServiceCatalog: React.FC = () => {
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(serviceCategories[0].id);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    serviceCategories[0].subCategories.length > 0 ? serviceCategories[0].subCategories[0].id : null
  );
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('four-wheeler');
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 100000]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<UserVehicle | null>(userVehicles[0]);
  const [cartDialogOpen, setCartDialogOpen] = useState<boolean>(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [showRewardsDialog, setShowRewardsDialog] = useState<boolean>(false);
  const [userPoints, setUserPoints] = useState<number>(450);
  const [serviceRecommendations, setServiceRecommendations] = useState<Service[]>([]);
  
  // Color palettes for different vehicle types
  const vehicleColorPalettes = {
    'two-wheeler': {
      primary: 'bg-emerald-600',
      secondary: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      hover: 'hover:bg-emerald-50',
      badge: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
    },
    'three-wheeler': {
      primary: 'bg-amber-600',
      secondary: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-200',
      hover: 'hover:bg-amber-50',
      badge: 'bg-amber-100 text-amber-800 hover:bg-amber-200'
    },
    'four-wheeler': {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-50',
      badge: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    'heavy-vehicle': {
      primary: 'bg-purple-600',
      secondary: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-50',
      badge: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
    }
  };
  
  // Price categories for shop by price
  const priceCategories = [
    { label: 'Under ₹49', min: 1, max: 49 },
    { label: '₹49 - ₹99', min: 49, max: 99 },
    { label: '₹99 - ₹249', min: 99, max: 249 },
    { label: '₹249 - ₹499', min: 249, max: 499 },
    { label: '₹499 - ₹699', min: 499, max: 699 },
    { label: '₹699 - ₹999', min: 699, max: 999 },
    { label: '₹999 - ₹1,999', min: 999, max: 1999 },
    { label: '₹2,000 - ₹4,999', min: 2000, max: 4999 },
    { label: '₹5,000 - ₹9,999', min: 5000, max: 9999 },
    { label: '₹10,000 - ₹19,999', min: 10000, max: 19999 },
    { label: '₹20,000 - ₹49,999', min: 20000, max: 49999 },
    { label: 'Above ₹50,000', min: 50000, max: 100000 }
  ];
  
  // Seasonal offers
  const seasonalOffers = [
    { id: 'monsoon-special', name: 'Monsoon Special', discount: '20% Off' },
    { id: 'summer-service', name: 'Summer Service Deals', discount: '15% Off' },
    { id: 'diwali-offer', name: 'Diwali Special', discount: '25% Off' },
    { id: 'new-year-special', name: 'New Year Special', discount: '30% Off' }
  ];

  // Find the current category and subcategory objects
  const currentCategory = serviceCategories.find(c => c.id === selectedCategory);
  const currentSubCategory = currentCategory?.subCategories.find(s => s.id === selectedSubCategory);

  // Filter services based on vehicle type
  const filteredServices = currentSubCategory?.services.filter(service => 
    service.vehicleTypes.includes(selectedVehicleType)
  ) || [];

  // Apply price filter to service providers
  const filteredServiceProviders = filteredServices.map(service => ({
    ...service,
    providers: service.providers.filter(provider => {
      const price = provider.discountedPrice || provider.basePrice;
      return price >= priceRange[0] && price <= priceRange[1];
    })
  })).filter(service => service.providers.length > 0);

  // Apply rating filter if set
  const ratingFilteredServices = ratingFilter
    ? filteredServiceProviders.map(service => ({
        ...service,
        providers: service.providers.filter(provider => provider.rating >= ratingFilter)
      })).filter(service => service.providers.length > 0)
    : filteredServiceProviders;

  // Apply search query filter
  const searchFilteredServices = searchQuery
    ? ratingFilteredServices.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.providers.some(provider => 
          provider.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : ratingFilteredServices;

  // Helper function to check if an item is in the cart
  const isInCart = (serviceId: string, providerId: string): boolean => {
    return cartItems.some(item => item.serviceId === serviceId && item.providerId === providerId);
  };

  // Helper function to check if an item is in the wishlist
  const isInWishlist = (serviceId: string, providerId: string): boolean => {
    return wishlistItems.some(item => item.serviceId === serviceId && item.providerId === providerId);
  };

  // Add to cart handler
  const handleAddToCart = (serviceId: string, providerId: string) => {
    if (!isInCart(serviceId, providerId)) {
      setCartItems([...cartItems, { serviceId, providerId, quantity: 1 }]);
    }
  };

  // Remove from cart handler
  const handleRemoveFromCart = (serviceId: string, providerId: string) => {
    setCartItems(cartItems.filter(
      item => !(item.serviceId === serviceId && item.providerId === providerId)
    ));
  };

  // Toggle wishlist handler
  const handleToggleWishlist = (serviceId: string, providerId: string) => {
    if (isInWishlist(serviceId, providerId)) {
      setWishlistItems(wishlistItems.filter(
        item => !(item.serviceId === serviceId && item.providerId === providerId)
      ));
    } else {
      setWishlistItems([...wishlistItems, { serviceId, providerId }]);
    }
  };

  // Price formatter
  const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString()}`;
  };

  // Calculate the total items in cart
  const cartTotal = cartItems.length;
  
  // Calculate cart total price
  const calculateCartTotalPrice = () => {
    let total = 0;
    
    for (const item of cartItems) {
      const service = serviceCategories
        .flatMap(cat => cat.subCategories)
        .flatMap(subCat => subCat.services)
        .find(service => service.id === item.serviceId);
        
      const provider = service?.providers.find(provider => provider.id === item.providerId);
      
      if (provider) {
        total += (provider.discountedPrice || provider.basePrice) * item.quantity;
      }
    }
    
    return total;
  };
  
  // Get cart item details by serviceId and providerId
  const getCartItemDetails = (serviceId: string, providerId: string) => {
    const service = serviceCategories
      .flatMap(cat => cat.subCategories)
      .flatMap(subCat => subCat.services)
      .find(service => service.id === serviceId);
      
    const provider = service?.providers.find(provider => provider.id === providerId);
    
    if (service && provider) {
      return { service, provider };
    }
    
    return null;
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
  
  // Generate contextual service recommendations based on vehicle type
  useEffect(() => {
    // Gather all services that match the selected vehicle type
    const allMatchingServices = serviceCategories
      .flatMap(category => category.subCategories)
      .flatMap(subCategory => subCategory.services)
      .filter(service => service.vehicleTypes.includes(selectedVehicleType));
    
    // Filter to services with recommended providers
    const servicesWithRecommendedProviders = allMatchingServices
      .filter(service => service.providers.some(provider => provider.recommended));
    
    // Pick up to 4 recommended services
    setServiceRecommendations(servicesWithRecommendedProviders.slice(0, 4));
  }, [selectedVehicleType]);
  
  // Handle rewards dialog and point earning/redeeming
  const handleAddPoints = (amount: number) => {
    setUserPoints(prev => prev + amount);
  };
  
  const handleRedeemPoints = (amount: number) => {
    if (userPoints >= amount) {
      setUserPoints(prev => prev - amount);
      return true;
    }
    return false;
  };
  
  // Calculate rewards points to be earned for the current cart
  const calculateRewardsPoints = () => {
    const totalPrice = calculateCartTotalPrice();
    // 10 points for every ₹1000 spent
    return Math.floor(totalPrice / 1000) * 10;
  };
  
  // Calculate the carousel index for next/prev items
  const handlePrevCarousel = () => {
    setCarouselIndex(prev => (prev === 0 ? seasonalOffers.length - 1 : prev - 1));
  };
  
  const handleNextCarousel = () => {
    setCarouselIndex(prev => (prev === seasonalOffers.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold mb-2">Book Service</h1>
        <p className="text-gray-600">Find and book professional services for your vehicle</p>
      </header>

      {/* Sticky header with cart and user points */}
      <div className="sticky top-0 z-10 bg-white border-b mb-6 py-2 px-4 -mx-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Select value={selectedVehicleType} onValueChange={(value) => setSelectedVehicleType(value as VehicleType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="two-wheeler">
                <Bike className="h-4 w-4 mr-2 inline" /> Two Wheeler
              </SelectItem>
              <SelectItem value="three-wheeler">
                <span className="mr-2 inline">🛺</span> Three Wheeler
              </SelectItem>
              <SelectItem value="four-wheeler">
                <Car className="h-4 w-4 mr-2 inline" /> Four Wheeler
              </SelectItem>
              <SelectItem value="heavy-vehicle">
                <Truck className="h-4 w-4 mr-2 inline" /> Heavy Vehicle
              </SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search for services..." 
              className="pl-10 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setShowRewardsDialog(true)}
            >
              <Award className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-medium text-sm">{userPoints} points</span>
              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                +{calculateRewardsPoints()}
              </Badge>
            </div>
          </div>

          <Dialog open={cartDialogOpen} onOpenChange={setCartDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden md:inline">Cart</span>
                {cartItems.length > 0 && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full">{cartItems.length}</Badge>
                )}
              </Button>
            </DialogTrigger>
          </Dialog>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                {selectedVehicle && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className={`h-6 w-6 ${vehicleColorPalettes[selectedVehicle.type].primary} rounded-full flex items-center justify-center`}>
                        {selectedVehicle.type === 'four-wheeler' && <Car className="h-4 w-4 text-white" />}
                        {selectedVehicle.type === 'two-wheeler' && <Bike className="h-4 w-4 text-white" />}
                        {selectedVehicle.type === 'three-wheeler' && <span className="text-xs text-white">🛺</span>}
                        {selectedVehicle.type === 'heavy-vehicle' && <Truck className="h-4 w-4 text-white" />}
                      </div>
                      <span className="truncate text-sm">{selectedVehicle.make} {selectedVehicle.model}</span>
                    </div>
                  </>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
              <div className="p-4 border-b">
                <h4 className="font-medium mb-1">My Vehicles</h4>
                <p className="text-sm text-gray-500">Select a vehicle for service</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {userVehicles.map(vehicle => (
                  <div
                    key={vehicle.id}
                    className={`p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer ${selectedVehicle?.id === vehicle.id ? 'bg-blue-50' : ''}`}
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setSelectedVehicleType(vehicle.type);
                    }}
                  >
                    <div className={`h-10 w-10 ${vehicleColorPalettes[vehicle.type].primary} rounded-full flex items-center justify-center`}>
                      {vehicle.type === 'four-wheeler' && <Car className="h-6 w-6 text-white" />}
                      {vehicle.type === 'two-wheeler' && <Bike className="h-6 w-6 text-white" />}
                      {vehicle.type === 'three-wheeler' && <span className="text-sm text-white">🛺</span>}
                      {vehicle.type === 'heavy-vehicle' && <Truck className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                      <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                      <div className="text-xs text-gray-500">{vehicle.registrationNumber} • {vehicle.year}</div>
                    </div>
                    {selectedVehicle?.id === vehicle.id && (
                      <Check className="h-4 w-4 text-blue-500 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex flex-col gap-6">
        {/* Contextual Recommendations */}
        {serviceRecommendations.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Recommended for Your {selectedVehicleType.replace('-', ' ')}</h2>
              <Badge className={`${vehicleColorPalettes[selectedVehicleType].badge} px-3 py-1`}>Top Picks</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {serviceRecommendations.map(service => {
                const recommendedProvider = service.providers.find(p => p.recommended) || service.providers[0];
                return (
                  <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className={`${vehicleColorPalettes[selectedVehicleType].secondary} pb-2 flex flex-row items-center justify-between`}>
                      <div>
                        <CardTitle className="text-base">{service.name}</CardTitle>
                        <CardDescription className="text-xs line-clamp-1">{service.description}</CardDescription>
                      </div>
                      <div className={`h-8 w-8 ${vehicleColorPalettes[selectedVehicleType].primary} rounded-full flex items-center justify-center`}>
                        {service.id.includes('battery') && <Zap className="h-4 w-4 text-white" />}
                        {service.id.includes('service') && <Wrench className="h-4 w-4 text-white" />}
                        {service.id.includes('ac') && <Flame className="h-4 w-4 text-white" />}
                        {service.id.includes('tyre') && <Gauge className="h-4 w-4 text-white" />}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {renderStarRating(recommendedProvider.rating)}
                          <span className="ml-1 text-xs text-gray-500">({recommendedProvider.ratingCount})</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.estimatedTime}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-lg font-bold">
                            {formatPrice(recommendedProvider.discountedPrice || recommendedProvider.basePrice)}
                          </div>
                          {recommendedProvider.discountedPrice && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(recommendedProvider.basePrice)}
                            </div>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          className={`rounded-full ${isInCart(service.id, recommendedProvider.id) ? 'bg-green-500 hover:bg-green-600' : ''}`}
                          onClick={() => {
                            if (isInCart(service.id, recommendedProvider.id)) {
                              handleRemoveFromCart(service.id, recommendedProvider.id);
                            } else {
                              handleAddToCart(service.id, recommendedProvider.id);
                              toast({
                                title: "Added to cart",
                                description: `${service.name} by ${recommendedProvider.name}`,
                                duration: 2000,
                              });
                            }
                          }}
                        >
                          {isInCart(service.id, recommendedProvider.id) ? (
                            <Check className="h-4 w-4 mr-1" />
                          ) : (
                            <ShoppingCart className="h-4 w-4 mr-1" />
                          )}
                          {isInCart(service.id, recommendedProvider.id) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {recommendedProvider.features.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {recommendedProvider.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{recommendedProvider.features.length - 2} more</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Price Explorer */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Shop by Price</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {priceCategories.slice(0, 6).map((category, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 text-center cursor-pointer transition-all ${
                  selectedPriceRange === category.label 
                    ? `${vehicleColorPalettes[selectedVehicleType].primary} text-white shadow-md` 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => {
                  if (selectedPriceRange === category.label) {
                    setSelectedPriceRange(null);
                    setPriceRange([1, 100000]);
                  } else {
                    setSelectedPriceRange(category.label);
                    setPriceRange([category.min, category.max]);
                    toast({
                      description: `Showing services priced ${category.label}`,
                      duration: 2000,
                    });
                  }
                }}
              >
                <div className="font-medium">{category.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Seasonal Offers */}
        <div className="mb-6">
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {seasonalOffers.map((offer, index) => (
                  <div 
                    key={offer.id} 
                    className="w-full flex-shrink-0"
                  >
                    <div 
                      className={`border rounded-lg p-5 cursor-pointer transition-all hover:shadow-md bg-gradient-to-r ${
                        index === 0 ? 'from-blue-50 to-blue-100' : 
                        index === 1 ? 'from-orange-50 to-orange-100' : 
                        index === 2 ? 'from-purple-50 to-purple-100' : 
                        'from-cyan-50 to-cyan-100'
                      }`}
                      onClick={() => setSelectedOffer(selectedOffer === offer.id ? null : offer.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold">{offer.name}</h3>
                            {selectedOffer === offer.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Special deals for the {offer.name.split(' ')[0]} season
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge className="px-3 py-1 text-sm bg-primary/80 text-white hover:bg-primary">
                              {offer.discount}
                            </Badge>
                            <Button size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                toast({
                                  title: "Offer Applied",
                                  description: `${offer.name} with ${offer.discount} has been applied`,
                                });
                              }}
                            >
                              Apply Offer
                            </Button>
                          </div>
                        </div>
                        <div className="h-24 w-24 flex items-center justify-center bg-white bg-opacity-40 rounded-full">
                          {index === 0 && <div className="text-3xl">🌧️</div>}
                          {index === 1 && <div className="text-3xl">☀️</div>}
                          {index === 2 && <div className="text-3xl">🪔</div>}
                          {index === 3 && <div className="text-3xl">🎆</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white shadow-md" 
                onClick={handlePrevCarousel}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white shadow-md" 
                onClick={handleNextCarousel}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-center mt-3 gap-1">
            {seasonalOffers.map((_, index) => (
              <div 
                key={index} 
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  index === carouselIndex ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCarouselIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Services by Category */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Browse Services</h2>
              <div className="flex">
                {serviceCategories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    size="sm"
                    className="mr-1"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      if (category.subCategories.length > 0) {
                        setSelectedSubCategory(category.subCategories[0].id);
                      } else {
                        setSelectedSubCategory(null);
                      }
                    }}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {currentCategory && currentCategory.subCategories.length > 0 && (
              <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
                {currentCategory.subCategories.map(subCategory => (
                  <Badge 
                    key={subCategory.id}
                    variant={selectedSubCategory === subCategory.id ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1 text-sm"
                    onClick={() => setSelectedSubCategory(subCategory.id)}
                  >
                    {subCategory.name}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchFilteredServices.map(service => (
                <Card key={service.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                  <div className="grid md:grid-cols-2 h-full">
                    <div className="p-4 border-r">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`h-8 w-8 ${vehicleColorPalettes[selectedVehicleType].primary} rounded-full flex items-center justify-center`}>
                          {service.id.includes('battery') && <Zap className="h-4 w-4 text-white" />}
                          {service.id.includes('service') && <Wrench className="h-4 w-4 text-white" />}
                          {service.id.includes('tyre') && <Gauge className="h-4 w-4 text-white" />}
                          {service.id.includes('ac') && <Flame className="h-4 w-4 text-white" />}
                          {!service.id.includes('battery') && !service.id.includes('service') && 
                           !service.id.includes('tyre') && !service.id.includes('ac') && 
                           <Settings className="h-4 w-4 text-white" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-base">{service.name}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{service.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.estimatedTime}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">From</span>
                          <span className="font-medium">
                            {formatPrice(Math.min(...service.providers.map(p => p.discountedPrice || p.basePrice)))}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col p-3">
                      <div className="font-medium text-sm mb-2">Choose Provider</div>
                      <div className="space-y-2 overflow-y-auto flex-grow">
                        {service.providers.map(provider => (
                          <div 
                            key={provider.id} 
                            className={`border rounded-md p-2 cursor-pointer transition-colors ${
                              isInCart(service.id, provider.id) 
                                ? `${vehicleColorPalettes[selectedVehicleType].secondary} ${vehicleColorPalettes[selectedVehicleType].border}`
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              if (isInCart(service.id, provider.id)) {
                                handleRemoveFromCart(service.id, provider.id);
                              } else {
                                handleAddToCart(service.id, provider.id);
                                toast({
                                  title: "Added to cart",
                                  description: `${service.name} by ${provider.name}`,
                                  duration: 2000,
                                });
                              }
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <span className="font-medium text-sm">{provider.name}</span>
                                {provider.recommended && (
                                  <Badge variant="outline" className="ml-2 text-xs px-1">Top Pick</Badge>
                                )}
                              </div>
                              {renderStarRating(provider.rating)}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-bold">
                                  {formatPrice(provider.discountedPrice || provider.basePrice)}
                                </span>
                                {provider.discountedPrice && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {formatPrice(provider.basePrice)}
                                  </span>
                                )}
                              </div>
                              {isInCart(service.id, provider.id) ? (
                                <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromCart(service.id, provider.id);
                                }}>
                                  <Trash className="h-3 w-3 mr-1" /> Remove
                                </Button>
                              ) : (
                                <Button size="sm" className="h-7 px-2 text-xs" onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(service.id, provider.id);
                                  toast({
                                    title: "Added to cart",
                                    description: `${service.name} by ${provider.name}`,
                                    duration: 2000,
                                  });
                                }}>
                                  <ShoppingCart className="h-3 w-3 mr-1" /> Add
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Enhanced Cart Dialog */}
          <Dialog open={cartDialogOpen} onOpenChange={setCartDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center text-xl">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Your Cart
                </DialogTitle>
                <DialogDescription>
                  Review your selected services before checkout
                </DialogDescription>
              </DialogHeader>
              
              {cartItems.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
                  <p className="text-gray-500 mb-4">Start adding services to your cart</p>
                  <Button onClick={() => setCartDialogOpen(false)}>Browse Services</Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {cartItems.map((item, index) => {
                      const details = getCartItemDetails(item.serviceId, item.providerId);
                      if (!details) return null;
                      
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className={`h-10 w-10 ${vehicleColorPalettes[selectedVehicleType].primary} rounded-full flex items-center justify-center`}>
                            {details.service.id.includes('battery') && <Zap className="h-5 w-5 text-white" />}
                            {details.service.id.includes('service') && <Wrench className="h-5 w-5 text-white" />}
                            {details.service.id.includes('tyre') && <Gauge className="h-5 w-5 text-white" />}
                            {details.service.id.includes('ac') && <Flame className="h-5 w-5 text-white" />}
                            {!details.service.id.includes('battery') && !details.service.id.includes('service') && 
                             !details.service.id.includes('tyre') && !details.service.id.includes('ac') && 
                             <Settings className="h-5 w-5 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{details.service.name}</h4>
                              <div>
                                <Badge variant="outline" className="mr-2">{details.service.estimatedTime}</Badge>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFromCart(item.serviceId, item.providerId)}>
                                  <Trash className="h-4 w-4 text-gray-500" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <div className="text-sm text-gray-600">Provider: {details.provider.name}</div>
                              <div className="font-medium">
                                {formatPrice(details.provider.discountedPrice || details.provider.basePrice)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Frequently Bought Together */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-3">Frequently Bought Together</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {serviceCategories
                        .flatMap(cat => cat.subCategories)
                        .flatMap(subCat => subCat.services)
                        .filter(service => 
                          service.vehicleTypes.includes(selectedVehicleType) && 
                          !cartItems.some(item => item.serviceId === service.id)
                        )
                        .slice(0, 2)
                        .map(service => {
                          const bestProvider = service.providers.find(p => p.recommended) || service.providers[0];
                          return (
                            <div key={service.id} className="border rounded-md p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`h-8 w-8 ${vehicleColorPalettes[selectedVehicleType].primary} rounded-full flex items-center justify-center`}>
                                  {service.id.includes('battery') && <Zap className="h-4 w-4 text-white" />}
                                  {service.id.includes('service') && <Wrench className="h-4 w-4 text-white" />}
                                  {service.id.includes('tyre') && <Gauge className="h-4 w-4 text-white" />}
                                  {service.id.includes('ac') && <Flame className="h-4 w-4 text-white" />}
                                  {!service.id.includes('battery') && !service.id.includes('service') && 
                                   !service.id.includes('tyre') && !service.id.includes('ac') && 
                                   <Settings className="h-4 w-4 text-white" />}
                                </div>
                                <h4 className="font-medium text-sm">{service.name}</h4>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-sm">{bestProvider.name}</div>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="ml-1 text-xs">{bestProvider.rating}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-bold">
                                  {formatPrice(bestProvider.discountedPrice || bestProvider.basePrice)}
                                </span>
                                <Button 
                                  size="sm" 
                                  className="h-7 px-2 text-xs"
                                  onClick={() => {
                                    handleAddToCart(service.id, bestProvider.id);
                                    toast({
                                      title: "Added to cart",
                                      description: `${service.name} by ${bestProvider.name}`,
                                      duration: 2000,
                                    });
                                  }}
                                >
                                  <Plus className="h-3 w-3 mr-1" /> Add
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(calculateCartTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tax</span>
                      <span className="font-medium">{formatPrice(calculateCartTotalPrice() * 0.18)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(calculateCartTotalPrice() * 1.18)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm">You'll earn {calculateRewardsPoints()} points</span>
                      </div>
                      <Button 
                        className="gap-2"
                        onClick={() => {
                          setCartDialogOpen(false);
                          toast({
                            title: "Service booked successfully",
                            description: "Your service has been booked for your vehicle",
                          });
                          handleAddPoints(calculateRewardsPoints());
                        }}
                      >
                        <CircleDollarSign className="h-4 w-4" />
                        Checkout
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Rewards Dialog */}
          <Dialog open={showRewardsDialog} onOpenChange={setShowRewardsDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center text-xl">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  FixPoint Rewards
                </DialogTitle>
                <DialogDescription>
                  You've earned points through your service bookings
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">{userPoints}</div>
                  <div className="text-sm text-gray-500">Available Points</div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Rewards</h4>
                  <div className="space-y-3">
                    {[
                      { title: 'Free Oil Change', points: 200, icon: <Droplet className="h-5 w-5" /> },
                      { title: '10% Off Next Service', points: 350, icon: <Percent className="h-5 w-5" /> },
                      { title: 'Free Car Wash', points: 150, icon: <Waves className="h-5 w-5" /> },
                      { title: 'Priority Scheduling', points: 100, icon: <CalendarClock className="h-5 w-5" /> }
                    ].map((reward, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                            {reward.icon}
                          </div>
                          <div>
                            <div className="font-medium">{reward.title}</div>
                            <div className="text-sm text-gray-500">{reward.points} points</div>
                          </div>
                        </div>
                        <Button 
                          variant={userPoints >= reward.points ? "default" : "outline"} 
                          size="sm"
                          disabled={userPoints < reward.points}
                          onClick={() => {
                            if (handleRedeemPoints(reward.points)) {
                              toast({
                                title: "Reward Redeemed!",
                                description: `You've redeemed ${reward.title}. ${reward.points} points have been deducted.`,
                                duration: 3000,
                              });
                              setShowRewardsDialog(false);
                            }
                          }}
                        >
                          Redeem
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">How to Earn More</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-green-500" />
                      <span>10 points for every ₹1,000 spent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4 text-green-500" />
                      <span>25 points for booking recurring services</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-green-500" />
                      <span>50 points for referring a friend</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
          {/* Search bar and vehicle selection */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search for services, brands, or providers..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[200px] flex justify-between items-center gap-2">
                    {selectedVehicle ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            {selectedVehicle.type === 'four-wheeler' && <Car className="h-4 w-4" />}
                            {selectedVehicle.type === 'two-wheeler' && <Bike className="h-4 w-4" />}
                            {selectedVehicle.type === 'three-wheeler' && <span className="text-xs">🛺</span>}
                            {selectedVehicle.type === 'heavy-vehicle' && <Truck className="h-4 w-4" />}
                          </div>
                          <span className="truncate text-sm">{selectedVehicle.make} {selectedVehicle.model}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </>
                    ) : (
                      <>
                        <span>Select Vehicle</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="end">
                  <div className="p-4 border-b">
                    <h4 className="font-medium mb-1">Select from my vehicles</h4>
                    <p className="text-sm text-gray-500">Choose a vehicle for service</p>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {userVehicles.map(vehicle => (
                      <div
                        key={vehicle.id}
                        className={`p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer ${selectedVehicle?.id === vehicle.id ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setSelectedVehicleType(vehicle.type);
                        }}
                      >
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                          {vehicle.type === 'four-wheeler' && <Car className="h-6 w-6" />}
                          {vehicle.type === 'two-wheeler' && <Bike className="h-6 w-6" />}
                          {vehicle.type === 'three-wheeler' && <span className="text-sm">🛺</span>}
                          {vehicle.type === 'heavy-vehicle' && <Truck className="h-6 w-6" />}
                        </div>
                        <div>
                          <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                          <div className="text-xs text-gray-500">{vehicle.registrationNumber} • {vehicle.year}</div>
                        </div>
                        {selectedVehicle?.id === vehicle.id && (
                          <Check className="h-4 w-4 text-blue-500 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <span className="mr-2">+</span> Add New Vehicle
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {selectedVehicle && (
              <div className={`${vehicleColorPalettes[selectedVehicle.type].secondary} p-3 rounded-md flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <div className={`${vehicleColorPalettes[selectedVehicle.type].primary} p-2 rounded-full`}>
                    {selectedVehicle.type === 'four-wheeler' && <Car className="h-4 w-4 text-white" />}
                    {selectedVehicle.type === 'two-wheeler' && <Bike className="h-4 w-4 text-white" />}
                    {selectedVehicle.type === 'three-wheeler' && <span className="text-sm text-white">🛺</span>}
                    {selectedVehicle.type === 'heavy-vehicle' && <Truck className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <div className={`font-medium ${vehicleColorPalettes[selectedVehicle.type].text}`}>{selectedVehicle.make} {selectedVehicle.model}</div>
                    <div className={`text-xs ${vehicleColorPalettes[selectedVehicle.type].text}`}>{selectedVehicle.registrationNumber}</div>
                  </div>
                </div>
                <div>
                  <Badge className={vehicleColorPalettes[selectedVehicle.type].badge}>
                    Showing services for {selectedVehicle.type.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            )}
            
            {/* Gamified Rewards Banner */}
            <div className="mb-6">
              <div 
                className={`rounded-lg p-4 cursor-pointer flex items-center justify-between ${vehicleColorPalettes[selectedVehicleType].secondary} transition-all hover:shadow-md`}
                onClick={() => setShowRewardsDialog(true)}
              >
                <div className="flex items-center gap-3">
                  <div className={`${vehicleColorPalettes[selectedVehicleType].primary} h-10 w-10 rounded-full flex items-center justify-center text-white`}>
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${vehicleColorPalettes[selectedVehicleType].text}`}>FixPoint Rewards</h3>
                    <p className="text-sm text-gray-600">You have <span className="font-medium">{userPoints} points</span> to redeem</p>
                  </div>
                </div>
                <Badge className={`${vehicleColorPalettes[selectedVehicleType].badge} flex items-center gap-1`}>
                  <Sparkles className="h-3 w-3" />
                  <span>Earn {calculateRewardsPoints()} points on checkout</span>
                </Badge>
              </div>
            </div>
            
            {/* Seasonal Offers Carousel */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Seasonal Offers</h2>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-8 w-8" 
                    onClick={handlePrevCarousel}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full h-8 w-8" 
                    onClick={handleNextCarousel}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {seasonalOffers.map((offer, index) => (
                    <div 
                      key={offer.id} 
                      className="w-full flex-shrink-0 px-1"
                    >
                      <div 
                        className={`border rounded-lg p-5 cursor-pointer transition-all hover:shadow-md ${
                          selectedOffer === offer.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedOffer(selectedOffer === offer.id ? null : offer.id)}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-medium">{offer.name}</h3>
                              {selectedOffer === offer.id && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              Special service packages and deals for the {offer.name.split(' ')[0]} season
                            </p>
                            <div className="flex items-center gap-3">
                              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                {offer.discount}
                              </Badge>
                              <span className="text-sm text-gray-600 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" /> Limited Time Offer
                              </span>
                            </div>
                          </div>
                          <div className="h-20 w-20 flex items-center justify-center bg-primary/5 rounded-full">
                            {index === 0 && <div className="text-2xl">🌧️</div>}
                            {index === 1 && <div className="text-2xl">☀️</div>}
                            {index === 2 && <div className="text-2xl">🪔</div>}
                            {index === 3 && <div className="text-2xl">🎆</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-3 gap-1">
                  {seasonalOffers.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        index === carouselIndex ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      onClick={() => setCarouselIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Contextual Service Recommendations */}
            {serviceRecommendations.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">Recommended for Your {selectedVehicleType.replace('-', ' ')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceRecommendations.map(service => {
                    const recommendedProvider = service.providers.find(p => p.recommended) || service.providers[0];
                    return (
                      <Card key={service.id} className={`border-l-4 ${vehicleColorPalettes[selectedVehicleType].border}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`h-10 w-10 rounded-full ${vehicleColorPalettes[selectedVehicleType].secondary} flex items-center justify-center flex-shrink-0`}>
                              {service.id.includes('battery') && <Zap className={`h-5 w-5 ${vehicleColorPalettes[selectedVehicleType].text}`} />}
                              {service.id.includes('service') && <Wrench className={`h-5 w-5 ${vehicleColorPalettes[selectedVehicleType].text}`} />}
                              {service.id.includes('ac') && <Flame className={`h-5 w-5 ${vehicleColorPalettes[selectedVehicleType].text}`} />}
                              {service.id.includes('tyre') && <Gauge className={`h-5 w-5 ${vehicleColorPalettes[selectedVehicleType].text}`} />}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{service.name}</h3>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{formatPrice(recommendedProvider.discountedPrice || recommendedProvider.basePrice)}</span>
                                  {recommendedProvider.discountedPrice && (
                                    <span className="text-xs text-gray-500 line-through">{formatPrice(recommendedProvider.basePrice)}</span>
                                  )}
                                </div>
                                <Button 
                                  size="sm" 
                                  className={`rounded-full ${isInCart(service.id, recommendedProvider.id) ? 'bg-green-500 hover:bg-green-600' : ''}`}
                                  onClick={() => {
                                    if (isInCart(service.id, recommendedProvider.id)) {
                                      handleRemoveFromCart(service.id, recommendedProvider.id);
                                    } else {
                                      handleAddToCart(service.id, recommendedProvider.id);
                                    }
                                  }}
                                >
                                  {isInCart(service.id, recommendedProvider.id) ? 'Added' : 'Add to Cart'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Shop by Price Catalog Cards */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Shop by Price</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {priceCategories.slice(0, 6).map((category, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-3 text-center cursor-pointer transition-all ${
                      selectedPriceRange === category.label 
                        ? `${vehicleColorPalettes[selectedVehicleType].primary} text-white shadow-md` 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      if (selectedPriceRange === category.label) {
                        setSelectedPriceRange(null);
                        setPriceRange([1, 100000]);
                      } else {
                        setSelectedPriceRange(category.label);
                        setPriceRange([category.min, category.max]);
                      }
                    }}
                  >
                    <div className="font-medium">{category.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation path and cart summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <span>Services</span>
              <ChevronRight className="h-4 w-4 mx-1" />
              {currentCategory && (
                <>
                  <span className="text-gray-900 font-medium">{currentCategory.name}</span>
                  {currentSubCategory && (
                    <>
                      <ChevronRight className="h-4 w-4 mx-1" />
                      <span className="text-gray-900 font-medium">{currentSubCategory.name}</span>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span className="hidden md:inline">Wishlist</span>
                      {wishlistItems.length > 0 && (
                        <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full">{wishlistItems.length}</Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Wishlist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Dialog open={cartDialogOpen} onOpenChange={setCartDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden md:inline">Cart</span>
                    {cartItems.length > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full">{cartItems.length}</Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Service Cart
                    </DialogTitle>
                    <DialogDescription>
                      {cartItems.length > 0
                        ? `${cartItems.length} service${cartItems.length !== 1 ? 's' : ''} in your cart`
                        : 'Your cart is empty'}
                    </DialogDescription>
                  </DialogHeader>

                  {cartItems.length > 0 ? (
                    <>
                      <div className="max-h-[400px] overflow-y-auto">
                        <div className="space-y-4">
                          {cartItems.map((item) => {
                            const details = getCartItemDetails(item.serviceId, item.providerId);
                            if (!details) return null;
                            
                            const { service, provider } = details;
                            const price = provider.discountedPrice || provider.basePrice;
                            
                            return (
                              <div key={`${item.serviceId}-${item.providerId}`} className="border rounded-md p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-sm">{service.name}</h4>
                                    <p className="text-sm text-gray-500 mt-1">by {provider.name}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <div className="flex items-center">
                                        <Button 
                                          variant="outline" 
                                          size="icon" 
                                          className="h-6 w-6 rounded-full"
                                          onClick={() => {
                                            const newCartItems = cartItems.map(cartItem => {
                                              if (cartItem.serviceId === item.serviceId && cartItem.providerId === item.providerId) {
                                                return {
                                                  ...cartItem,
                                                  quantity: Math.max(1, cartItem.quantity - 1)
                                                };
                                              }
                                              return cartItem;
                                            });
                                            setCartItems(newCartItems);
                                          }}
                                        >
                                          <span className="text-xs">-</span>
                                        </Button>
                                        <span className="mx-2 text-sm">{item.quantity}</span>
                                        <Button 
                                          variant="outline" 
                                          size="icon" 
                                          className="h-6 w-6 rounded-full"
                                          onClick={() => {
                                            const newCartItems = cartItems.map(cartItem => {
                                              if (cartItem.serviceId === item.serviceId && cartItem.providerId === item.providerId) {
                                                return {
                                                  ...cartItem,
                                                  quantity: cartItem.quantity + 1
                                                };
                                              }
                                              return cartItem;
                                            });
                                            setCartItems(newCartItems);
                                          }}
                                        >
                                          <span className="text-xs">+</span>
                                        </Button>
                                      </div>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 px-1 text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveFromCart(item.serviceId, item.providerId)}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">{formatPrice(price * item.quantity)}</div>
                                    {item.quantity > 1 && (
                                      <div className="text-xs text-gray-500">({formatPrice(price)} each)</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="font-medium">{formatPrice(calculateCartTotalPrice())}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-500">Taxes & Fees</span>
                          <span className="font-medium">{formatPrice(calculateCartTotalPrice() * 0.18)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                          <span>Total</span>
                          <span>{formatPrice(calculateCartTotalPrice() * 1.18)}</span>
                        </div>
                      </div>
                    
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCartDialogOpen(false)}>
                          Continue Shopping
                        </Button>
                        <Button>
                          Checkout
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
                      <p className="text-gray-500 text-center mb-4">Browse services and add them to your cart</p>
                      <Button onClick={() => setCartDialogOpen(false)}>
                        Continue Shopping
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              
              {/* Rewards Dialog */}
              <Dialog open={showRewardsDialog} onOpenChange={setShowRewardsDialog}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      FixPoint Rewards
                    </DialogTitle>
                    <DialogDescription>
                      Earn points with every service booking and redeem them for discounts
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                      <div className="text-sm mb-1">Available points</div>
                      <div className="text-3xl font-bold mb-4">{userPoints}</div>
                      <div className="text-sm opacity-80">You will earn {calculateRewardsPoints()} points with your current cart</div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Redeem Points</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div 
                          className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all"
                          onClick={() => {
                            if (handleRedeemPoints(100)) {
                              toast({
                                title: "Points Redeemed",
                                description: "You've redeemed 100 points for a ₹100 discount",
                              });
                            } else {
                              toast({
                                title: "Not Enough Points",
                                description: "You need at least 100 points for this reward",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="bg-green-100 p-2 rounded-full">
                              <Zap className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded text-xs">100 pts</div>
                          </div>
                          <h4 className="font-medium">₹100 Discount</h4>
                          <p className="text-sm text-gray-500 mt-1">Apply to your next service booking</p>
                        </div>
                        
                        <div 
                          className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all"
                          onClick={() => {
                            if (handleRedeemPoints(250)) {
                              toast({
                                title: "Points Redeemed",
                                description: "You've redeemed 250 points for a free pickup & drop",
                              });
                            } else {
                              toast({
                                title: "Not Enough Points",
                                description: "You need at least 250 points for this reward",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="bg-orange-100 p-2 rounded-full">
                              <Car className="h-4 w-4 text-orange-600" />
                            </div>
                            <div className="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded text-xs">250 pts</div>
                          </div>
                          <h4 className="font-medium">Free Pickup & Drop</h4>
                          <p className="text-sm text-gray-500 mt-1">One-time free pickup & drop service</p>
                        </div>
                        
                        <div 
                          className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all"
                          onClick={() => {
                            if (handleRedeemPoints(400)) {
                              toast({
                                title: "Points Redeemed",
                                description: "You've redeemed 400 points for a free car wash",
                              });
                            } else {
                              toast({
                                title: "Not Enough Points",
                                description: "You need at least 400 points for this reward",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <div className="text-blue-600 text-xs">💦</div>
                            </div>
                            <div className="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded text-xs">400 pts</div>
                          </div>
                          <h4 className="font-medium">Free Car Wash</h4>
                          <p className="text-sm text-gray-500 mt-1">One premium car wash service</p>
                        </div>
                        
                        <div 
                          className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all"
                          onClick={() => {
                            if (handleRedeemPoints(1000)) {
                              toast({
                                title: "Points Redeemed",
                                description: "You've redeemed 1000 points for a free basic service",
                              });
                            } else {
                              toast({
                                title: "Not Enough Points",
                                description: "You need at least 1000 points for this reward",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="bg-purple-100 p-2 rounded-full">
                              <Wrench className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded text-xs">1000 pts</div>
                          </div>
                          <h4 className="font-medium">Free Basic Service</h4>
                          <p className="text-sm text-gray-500 mt-1">Complete basic service package</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium mb-2">How to Earn More Points</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Book services (10 points per ₹1,000 spent)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Complete vehicle profile (50 points)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Leave reviews after service (25 points)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Refer friends (100 points per referral)
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRewardsDialog(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Subcategory navigation */}
          {currentCategory && currentCategory.subCategories.length > 0 && (
            <div className="mb-6 overflow-x-auto pb-2">
              <div className="flex space-x-2">
                {currentCategory.subCategories.map(subCategory => (
                  <Button
                    key={subCategory.id}
                    variant={selectedSubCategory === subCategory.id ? 'default' : 'outline'}
                    onClick={() => setSelectedSubCategory(subCategory.id)}
                    className="whitespace-nowrap"
                  >
                    {subCategory.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Service listings */}
          <div className="space-y-6">
            {searchFilteredServices.length > 0 ? (
              searchFilteredServices.map(service => (
                <Card key={service.id} className="overflow-hidden border">
                  <CardHeader className="bg-gray-50 pb-2">
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 px-0">
                    <div className="space-y-1 px-6 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Estimated time: {service.estimatedTime}</span>
                      </div>
                    </div>
                    
                    <div className="divide-y">
                      {service.providers.map(provider => (
                        <div key={provider.id} className="p-6 hover:bg-gray-50">
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Provider info */}
                            <div className="md:w-3/4 space-y-3">
                              <div className="flex items-start gap-4">
                                <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                                  {provider.image ? (
                                    <img src={provider.image} alt={provider.name} className="h-12 w-12 object-contain" />
                                  ) : (
                                    <div className="text-gray-500 text-xs">{provider.name.slice(0, 1)}</div>
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium">{provider.name}</h3>
                                    {provider.recommended && (
                                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">RECOMMENDED</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    {renderStarRating(provider.rating)}
                                    <span className="text-gray-500">({provider.ratingCount})</span>
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {provider.features.map((feature, index) => (
                                      <Badge key={index} variant="outline" className="bg-gray-50">
                                        <Check className="h-3 w-3 text-green-500 mr-1" /> {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Price and action buttons */}
                            <div className="md:w-1/4 flex flex-col items-center justify-center">
                              <div className="text-center mb-3">
                                {provider.discountedPrice ? (
                                  <>
                                    <div className="text-xl font-bold">{formatPrice(provider.discountedPrice)}</div>
                                    <div className="flex items-center justify-center gap-2">
                                      <span className="text-sm text-gray-500 line-through">{formatPrice(provider.basePrice)}</span>
                                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                        -{Math.round((provider.basePrice - provider.discountedPrice) / provider.basePrice * 100)}%
                                      </Badge>
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-xl font-bold">{formatPrice(provider.basePrice)}</div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className={isInWishlist(service.id, provider.id) ? "text-red-500 border-red-200 hover:text-red-700" : ""}
                                  onClick={() => handleToggleWishlist(service.id, provider.id)}
                                >
                                  <Heart className={`h-4 w-4 mr-1 ${isInWishlist(service.id, provider.id) ? "fill-red-500" : ""}`} />
                                  {isInWishlist(service.id, provider.id) ? 'Saved' : 'Save'}
                                </Button>
                                {isInCart(service.id, provider.id) ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => handleRemoveFromCart(service.id, provider.id)}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Added
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleAddToCart(service.id, provider.id)}
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                    Add to Cart
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 border rounded-md bg-gray-50">
                <div className="text-gray-500 mb-2">No services found with the current filters</div>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery('');
                    setRatingFilter(null);
                    setPriceRange([500, 10000]);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCatalog;