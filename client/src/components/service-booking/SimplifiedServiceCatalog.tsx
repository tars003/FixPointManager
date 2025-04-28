import React, { useState } from 'react';
import { Car, Bike, Truck, ShoppingCart, Star, Search, Award, ChevronDown, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
};

type ServiceProvider = {
  id: string;
  name: string;
  rating: number;
  ratingCount: number;
  basePrice: number;
  discountedPrice: number | null;
};

type Service = {
  id: string;
  name: string;
  description: string;
  providers: ServiceProvider[];
  estimatedTime: string;
  vehicleTypes: VehicleType[];
};

interface CartItem {
  serviceId: string;
  providerId: string;
  quantity: number;
}

// Mock data
const userVehicles: UserVehicle[] = [
  {
    id: 'v1',
    make: 'Hyundai',
    model: 'i10',
    year: 2022,
    type: 'four-wheeler',
    registrationNumber: 'MH01AB1234'
  },
  {
    id: 'v2',
    make: 'Honda',
    model: 'Activa',
    year: 2021,
    type: 'two-wheeler',
    registrationNumber: 'MH02CD5678'
  }
];

const services: Service[] = [
  {
    id: 'service1',
    name: 'Basic Service Package',
    description: 'Complete inspection with oil change and basic maintenance',
    estimatedTime: '3-4 hours',
    vehicleTypes: ['two-wheeler', 'four-wheeler'],
    providers: [
      {
        id: 'provider1',
        name: 'FixPoint Authorized',
        rating: 4.8,
        ratingCount: 1243,
        basePrice: 2999,
        discountedPrice: 2499
      },
      {
        id: 'provider2',
        name: 'QuickMech',
        rating: 4.5,
        ratingCount: 856,
        basePrice: 2499,
        discountedPrice: null
      }
    ]
  },
  {
    id: 'service2',
    name: 'Premium Service Package',
    description: 'Extensive service with detailed system checks',
    estimatedTime: '4-5 hours',
    vehicleTypes: ['four-wheeler'],
    providers: [
      {
        id: 'provider1',
        name: 'FixPoint Authorized',
        rating: 4.8,
        ratingCount: 1243,
        basePrice: 4999,
        discountedPrice: 3999
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

  // Filter services based on vehicle type and search query
  const filteredServices = services.filter(service => 
    service.vehicleTypes.includes(selectedVehicleType) &&
    (searchQuery === '' || 
     service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     service.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Book Service</h1>
      <p className="text-gray-600 mb-6">Find and book professional services for your vehicle</p>
      
      {/* Vehicle selection and search bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Tabs defaultValue={selectedVehicleType} onValueChange={value => setSelectedVehicleType(value as VehicleType)}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="two-wheeler">
                <Bike className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Two Wheeler</span>
              </TabsTrigger>
              <TabsTrigger value="three-wheeler">
                <span className="mr-2">🛺</span>
                <span className="hidden md:inline">Three Wheeler</span>
              </TabsTrigger>
              <TabsTrigger value="four-wheeler">
                <Car className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Four Wheeler</span>
              </TabsTrigger>
              <TabsTrigger value="heavy-vehicle">
                <Truck className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Heavy Vehicle</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search services..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart ({cartItems.length})
          </Button>
          
          <div className="flex items-center">
            <Award className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="font-medium">{userPoints} points</span>
          </div>
        </div>
      </div>
      
      {/* Selected vehicle info */}
      {selectedVehicle && (
        <div className={`${vehicleColorPalettes[selectedVehicle.type].secondary} p-4 rounded-lg mb-6 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`${vehicleColorPalettes[selectedVehicle.type].primary} h-10 w-10 rounded-full flex items-center justify-center`}>
              {selectedVehicle.type === 'four-wheeler' && <Car className="h-5 w-5 text-white" />}
              {selectedVehicle.type === 'two-wheeler' && <Bike className="h-5 w-5 text-white" />}
              {selectedVehicle.type === 'three-wheeler' && <span>🛺</span>}
              {selectedVehicle.type === 'heavy-vehicle' && <Truck className="h-5 w-5 text-white" />}
            </div>
            <div>
              <div className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</div>
              <div className="text-sm">{selectedVehicle.registrationNumber}</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            Change Vehicle
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Services listing */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Available Services</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center">
            <Filter className="h-3 w-3 mr-1" />
            Showing {filteredServices.length} services
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map(service => (
          <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className={`${vehicleColorPalettes[selectedVehicleType].secondary} pb-3`}>
              <CardTitle className="text-base">{service.name}</CardTitle>
              <p className="text-sm text-gray-600">{service.description}</p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {service.providers.map(provider => (
                  <div key={provider.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="flex items-center text-sm text-gray-600">
                          {renderStarRating(provider.rating)}
                          <span className="ml-1">({provider.ratingCount})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {formatPrice(provider.discountedPrice || provider.basePrice)}
                        </div>
                        {provider.discountedPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(provider.basePrice)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{service.estimatedTime}</span>
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
                      >
                        {isInCart(service.id, provider.id) ? "Remove" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimplifiedServiceCatalog;