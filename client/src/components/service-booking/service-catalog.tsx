import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
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

// Types for our service items
type VehicleType = 'two-wheeler' | 'three-wheeler' | 'four-wheeler' | 'heavy-vehicle';

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

const ServiceCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(serviceCategories[0].id);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    serviceCategories[0].subCategories.length > 0 ? serviceCategories[0].subCategories[0].id : null
  );
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('four-wheeler');
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 10000]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

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

  // Helper to render star ratings
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Book Service</h1>
      <p className="text-gray-600 mb-6">Find and book professional services for your vehicle</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="lg:w-1/4 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Vehicle Type</h3>
                <Tabs defaultValue={selectedVehicleType} onValueChange={value => setSelectedVehicleType(value as VehicleType)}>
                  <TabsList className="grid grid-cols-2 h-auto">
                    <TabsTrigger value="two-wheeler" className="h-12 px-2 py-1">
                      <div className="flex flex-col items-center">
                        <Bike className="h-4 w-4 mb-1" />
                        <span className="text-xs">Two Wheeler</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="four-wheeler" className="h-12 px-2 py-1">
                      <div className="flex flex-col items-center">
                        <Car className="h-4 w-4 mb-1" />
                        <span className="text-xs">Four Wheeler</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="three-wheeler" className="h-12 px-2 py-1">
                      <div className="flex flex-col items-center">
                        <div className="text-sm mb-1">🛺</div>
                        <span className="text-xs">Three Wheeler</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="heavy-vehicle" className="h-12 px-2 py-1">
                      <div className="flex flex-col items-center">
                        <Truck className="h-4 w-4 mb-1" />
                        <span className="text-xs">Heavy Vehicle</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="px-1">
                  <Slider 
                    defaultValue={[500, 10000]} 
                    min={500} 
                    max={30000} 
                    step={500} 
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Rating</h3>
                <div className="space-y-1">
                  {[4.5, 4, 3.5, 3].map(rating => (
                    <div 
                      key={rating} 
                      className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${ratingFilter === rating ? 'bg-blue-50' : ''}`}
                      onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                    >
                      <div className="flex items-center">
                        <Star className={`h-4 w-4 ${ratingFilter === rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`} />
                        <span className="ml-1 text-sm">{rating}+ stars</span>
                      </div>
                      {ratingFilter === rating && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pr-2">
              {serviceCategories.map(category => (
                <div 
                  key={category.id}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${selectedCategory === category.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
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
                    <span className="text-gray-600">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  {category.subCategories.length > 0 && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="lg:w-3/4">
          {/* Search bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search for services, brands, or providers..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="hidden md:inline">Cart</span>
                      {cartItems.length > 0 && (
                        <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full">{cartItems.length}</Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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