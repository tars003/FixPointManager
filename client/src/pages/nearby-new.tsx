import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ServiceProvider } from '@shared/schema';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  List, 
  MapIcon, 
  Filter, 
  Fuel, 
  Wrench, 
  Car, 
  Truck,
  Bike,
  Droplet,
  Gauge,
  Bus,
  Construction,
  Clock,
  Zap,
  Battery,
  Scroll,
  SlidersHorizontal,
  ShieldAlert,
  Search,
  Undo2,
  ChevronDown,
  Calendar,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import ContentReaction from '@/components/ui/content-reaction';
import FeedbackButton from '@/components/ui/feedback-button';
import MapView from '@/components/nearby/map-view';

// Vehicle types
const VEHICLE_TYPES = [
  { id: 'two-wheeler', name: 'Two Wheeler', icon: Bike },
  { id: 'three-wheeler', name: 'Three Wheeler', icon: Car },
  { id: 'car', name: 'Car', icon: Car },
  { id: 'truck', name: 'Truck', icon: Truck },
  { id: 'bus', name: 'Bus', icon: Bus },
  { id: 'tractor', name: 'Tractor', icon: Truck },
  { id: 'construction', name: 'Construction', icon: Construction },
];

// Fuel types
const FUEL_TYPES = [
  { id: 'petrol', name: 'Petrol', icon: Fuel },
  { id: 'diesel', name: 'Diesel', icon: Droplet },
  { id: 'hybrid', name: 'Hybrid', icon: Zap },
  { id: 'cng', name: 'CNG', icon: Gauge },
  { id: 'electric', name: 'Electric', icon: Battery },
  { id: 'solar', name: 'Solar', icon: Zap },
  { id: 'hydrogen', name: 'Hydrogen', icon: Gauge },
];

// Service categories
const SERVICE_CATEGORIES = [
  { id: 'fuel-station', name: 'Fuel Stations', icon: Fuel },
  { id: 'service-center', name: 'Service Centers', icon: Wrench },
  { id: 'tire-service', name: 'Tire Services', icon: Car },
  { id: 'washing', name: 'Vehicle Washing', icon: Droplet },
  { id: 'rto', name: 'RTO Offices', icon: Scroll },
  { id: 'roadside', name: 'Roadside Assistance', icon: ShieldAlert },
  { id: 'battery', name: 'Battery Services', icon: Battery },
  { id: 'emission', name: 'Emission Testing', icon: Gauge },
  { id: 'parts', name: 'Spare Parts Markets', icon: Wrench },
  { id: 'insurance', name: 'Vehicle Insurance', icon: Scroll },
];

// Mock emergency types for emergency service flow
const EMERGENCY_TYPES = [
  { id: 'breakdown', name: 'Vehicle Breakdown', icon: Car },
  { id: 'accident', name: 'Accident', icon: ShieldAlert },
  { id: 'flat-tire', name: 'Flat Tire', icon: Car },
  { id: 'fuel', name: 'Out of Fuel', icon: Fuel },
  { id: 'battery', name: 'Battery Issue', icon: Battery },
  { id: 'keys', name: 'Locked Keys', icon: Car },
];

const NearbyNew = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [userCoordinates, setUserCoordinates] = useState<{latitude: string, longitude: string} | null>(null);
  
  // Vehicle and service filters
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('car');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('petrol');
  const [selectedServiceCategories, setSelectedServiceCategories] = useState<string[]>(['service-center']);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [searchRadius, setSearchRadius] = useState<number[]>([5]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<string | null>(null);
  
  // Get user's location on component mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoordinates({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        toast({
          title: "Location Error",
          description: "Couldn't get your location. Some features might be limited.",
          variant: "destructive",
        });
        // Use default coordinates (Mumbai, India)
        setUserCoordinates({
          latitude: "19.0760",
          longitude: "72.8777"
        });
      }
    );
  }, [toast]);
  
  // Fetch nearby service providers
  const { data: providers, isLoading, isError } = useQuery<ServiceProvider[]>({
    queryKey: ['/api/service-providers', userCoordinates, selectedServiceCategories, selectedVehicleType, selectedFuelType, searchRadius],
    enabled: !!userCoordinates,
  });
  
  const handleSelectProvider = (provider: ServiceProvider) => {
    // If in emergency mode, handle differently
    if (isEmergencyMode) {
      toast({
        title: "Emergency Request Sent",
        description: `Help is on the way! ${provider.name} has been notified of your emergency.`,
      });
      // Would typically initiate emergency flow here
      return;
    }
    
    navigate(`/book-service?providerId=${provider.id}`);
  };
  
  // Filter providers based on search query and filters
  const filteredProviders = providers?.filter(provider => {
    // Skip filtering in emergency mode - show all emergency providers
    if (isEmergencyMode) {
      return provider.services.some(s => s.toLowerCase().includes('emergency'));
    }
    
    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        provider.name.toLowerCase().includes(query) ||
        provider.address.toLowerCase().includes(query) ||
        provider.city.toLowerCase().includes(query) ||
        provider.services.some(service => service.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }
    
    // Service category filtering
    if (selectedServiceCategories.length > 0) {
      // Map service category ids to actual service keywords
      const categoryKeywords: {[key: string]: string[]} = {
        'fuel-station': ['fuel', 'gas', 'petrol', 'diesel', 'charging'],
        'service-center': ['repair', 'service', 'maintenance'],
        'tire-service': ['tire', 'wheel', 'puncture'],
        'washing': ['wash', 'clean', 'detailing'],
        'rto': ['rto', 'registration', 'license'],
        'roadside': ['roadside', 'towing', 'emergency'],
        'battery': ['battery', 'charging'],
        'emission': ['emission', 'pollution'],
        'parts': ['parts', 'spares', 'accessories'],
        'insurance': ['insurance', 'policy']
      };
      
      const relevantKeywords = selectedServiceCategories.flatMap(cat => categoryKeywords[cat] || []);
      const hasRelevantService = provider.services.some(service => 
        relevantKeywords.some(keyword => service.toLowerCase().includes(keyword))
      );
      
      if (!hasRelevantService) return false;
    }
    
    // Open only filter
    if (showOpenOnly) {
      // In a real implementation, we would check current time against operating hours
      // For demo purposes, just use the mock "isOpen" property if it exists or assume open
      const isOpen = (provider as any).isOpen !== false;
      if (!isOpen) return false;
    }
    
    return true;
  });
  
  // Toggle emergency mode
  const toggleEmergencyMode = () => {
    setIsEmergencyMode(!isEmergencyMode);
    
    if (!isEmergencyMode) {
      // Entering emergency mode
      toast({
        title: "Emergency Mode Activated",
        description: "Showing nearest emergency service providers. Select your emergency type.",
        variant: "destructive",
      });
      
      // Reset filters to focus on emergency services
      setSelectedServiceCategories(['roadside']);
    } else {
      // Exiting emergency mode
      setSelectedEmergencyType(null);
      toast({
        title: "Emergency Mode Deactivated",
        description: "Returned to normal service provider view.",
      });
    }
  };
  
  const handleEmergencyServiceSelect = (provider: ServiceProvider) => {
    toast({
      title: "Emergency Request Sent",
      description: `${provider.name} has been contacted. Help is on the way. ETA: 15-20 minutes.`,
    });
    
    // In a real implementation, would initiate contact and tracking flow
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header and location section */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold lg:block hidden mb-2">
              {isEmergencyMode ? (
                <span className="text-red-600">Emergency Services</span>
              ) : (
                "Nearby Service Providers"
              )}
            </h2>
            <p className="text-neutral-500">
              {isEmergencyMode 
                ? "Connecting you with immediate assistance"
                : "Find trusted service providers in your area"
              }
            </p>
          </div>
          
          {/* Emergency mode toggle */}
          <Button 
            variant={isEmergencyMode ? "destructive" : "outline"} 
            size="sm"
            className="flex items-center gap-1"
            onClick={toggleEmergencyMode}
          >
            {isEmergencyMode ? (
              <>
                <Undo2 className="h-4 w-4" />
                Exit Emergency Mode
              </>
            ) : (
              <>
                <ShieldAlert className="h-4 w-4" />
                Emergency Assistance
              </>
            )}
          </Button>
        </div>
        
        {/* Location and search */}
        <div className="relative mt-4">
          <Input 
            type="search" 
            placeholder={isEmergencyMode 
              ? "Describe your emergency or location details..." 
              : "Search by name, service, or address..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
        </div>
      </div>
      
      {/* Emergency mode selection UI */}
      {isEmergencyMode && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-red-700 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Select Emergency Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {EMERGENCY_TYPES.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedEmergencyType === type.id ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center h-20 ${
                    selectedEmergencyType === type.id ? "border-red-500 bg-red-100 text-red-700" : "border-red-100"
                  }`}
                  onClick={() => setSelectedEmergencyType(type.id)}
                >
                  <type.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs">{type.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-red-600">
              Select your emergency type to find the most appropriate assistance. We'll connect you with the nearest available service.
            </p>
          </CardFooter>
        </Card>
      )}
      
      {/* Filter section - Only show in non-emergency mode */}
      {!isEmergencyMode && (
        <div className="mb-6 border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Service Filters
            </h3>
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => {
              setSelectedVehicleType('car');
              setSelectedFuelType('petrol');
              setSelectedServiceCategories(['service-center']);
              setSearchRadius([5]);
              setShowOpenOnly(false);
            }}>
              Reset Filters
            </Button>
          </div>
          
          {/* Vehicle type selection */}
          <div className="mb-4">
            <Label className="text-xs text-neutral-500 mb-1.5 block">Vehicle Type</Label>
            <div className="flex overflow-x-auto pb-1 gap-1">
              {VEHICLE_TYPES.map((vehicle) => (
                <Button
                  key={vehicle.id}
                  variant={selectedVehicleType === vehicle.id ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-1 whitespace-nowrap"
                  onClick={() => setSelectedVehicleType(vehicle.id)}
                >
                  <vehicle.icon className="h-3.5 w-3.5" />
                  <span>{vehicle.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Fuel type selection */}
          <div className="mb-4">
            <Label className="text-xs text-neutral-500 mb-1.5 block">Fuel Type</Label>
            <div className="flex overflow-x-auto pb-1 gap-1">
              {FUEL_TYPES.map((fuel) => (
                <Button
                  key={fuel.id}
                  variant={selectedFuelType === fuel.id ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-1 whitespace-nowrap"
                  onClick={() => setSelectedFuelType(fuel.id)}
                >
                  <fuel.icon className="h-3.5 w-3.5" />
                  <span>{fuel.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Service categories */}
          <div className="mb-4">
            <Label className="text-xs text-neutral-500 mb-1.5 block">Service Categories</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {SERVICE_CATEGORIES.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`service-${service.id}`} 
                    checked={selectedServiceCategories.includes(service.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedServiceCategories(prev => [...prev, service.id]);
                      } else {
                        setSelectedServiceCategories(prev => prev.filter(id => id !== service.id));
                      }
                    }}
                  />
                  <Label 
                    htmlFor={`service-${service.id}`}
                    className="text-sm flex items-center cursor-pointer"
                  >
                    <service.icon className="h-3.5 w-3.5 mr-1.5" />
                    {service.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Additional filters row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search radius slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label className="text-xs text-neutral-500">Search Radius</Label>
                <span className="text-sm font-medium">{searchRadius[0]} km</span>
              </div>
              <Slider
                defaultValue={[5]}
                max={50}
                step={1}
                value={searchRadius}
                onValueChange={setSearchRadius}
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>
            
            {/* Open now toggle */}
            <div className="flex items-center justify-between space-x-2 border rounded-md p-3">
              <div className="flex flex-col">
                <Label htmlFor="open-now" className="text-sm font-medium">Open Now</Label>
                <span className="text-xs text-neutral-500">Show only available providers</span>
              </div>
              <Switch
                id="open-now"
                checked={showOpenOnly}
                onCheckedChange={setShowOpenOnly}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Main content area */}
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="map" className="flex items-center">
            <MapIcon className="h-4 w-4 mr-2" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center">
            <List className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map">
          {isLoading ? (
            <div className="bg-neutral-100 rounded-lg h-[400px] animate-pulse flex items-center justify-center">
              <p className="text-neutral-500">Loading map...</p>
            </div>
          ) : isError ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-red-500 mb-2">Error loading map data</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : filteredProviders && filteredProviders.length > 0 ? (
            <MapView 
              providers={filteredProviders}
              onSelectProvider={isEmergencyMode ? handleEmergencyServiceSelect : handleSelectProvider}
            />
          ) : (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="mb-2">No service providers found in your area</p>
              <p className="text-neutral-500 mb-4">Try expanding your search radius or changing your filters</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow-sm h-32 animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-red-500 mb-2">Error loading service providers</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : filteredProviders && filteredProviders.length > 0 ? (
            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <Card key={provider.id} className={`overflow-hidden ${isEmergencyMode ? 'border-red-200' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{provider.name}</h3>
                        <p className="text-neutral-500 text-sm">{provider.address}, {provider.city}</p>
                        <div className="flex items-center text-sm mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1 text-neutral-500" />
                          <span className="text-neutral-500">
                            {/* Simulate open status - in real app would use operating hours */}
                            {Math.random() > 0.2 ? (
                              <span className="text-green-600">Open now</span>
                            ) : (
                              <span className="text-red-500">Closed</span>
                            )}
                            {" · "}
                            <span>2.3 km away</span>
                          </span>
                        </div>
                        <p className="text-sm mt-1">{provider.phone}</p>
                      </div>
                      <div className="flex items-center text-sm bg-neutral-100 px-2 py-1 rounded-full">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{provider.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {provider.services.slice(0, 4).map((service, i) => (
                        <span key={i} className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                      {provider.services.length > 4 && (
                        <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
                          +{provider.services.length - 4} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-500 flex items-center">
                          {isEmergencyMode ? (
                            <>
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              Average response time: 15-20 min
                            </>
                          ) : (
                            <>
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              Booking availability: Today
                            </>
                          )}
                        </span>
                        <ContentReaction
                          contentId={`provider-${provider.id}`}
                          contentType="provider"
                          variant="minimal"
                          enableComments={true}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          className={`flex-1 ${isEmergencyMode ? 'bg-red-600 hover:bg-red-700' : ''}`}
                          onClick={() => isEmergencyMode ? handleEmergencyServiceSelect(provider) : handleSelectProvider(provider)}
                        >
                          {isEmergencyMode ? 'Request Emergency Help' : 'Select Provider'}
                        </Button>
                        <Button variant="outline" className="flex items-center">
                          <Navigation className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="mb-2">No service providers found</p>
              <p className="text-neutral-500 mb-4">Try expanding your search or changing your filters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Service Provider Feedback Section */}
      {!isLoading && !isError && filteredProviders && filteredProviders.length > 0 && (
        <div className="mt-8 bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-lg">How was your experience with our service finder?</h3>
              <p className="text-neutral-500">Your feedback helps us improve our nearby services feature</p>
            </div>
            <ContentReaction 
              contentId="nearby-service-finder"
              contentType="feature"
              variant="standard"
              showCount={true}
              className="pt-2 sm:pt-0"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-50 rounded-lg p-4 border">
              <h4 className="font-medium mb-2">Location Accuracy</h4>
              <p className="text-sm text-neutral-500 mb-3">Were the service providers accurately located on the map?</p>
              <ContentReaction 
                contentId="nearby-location-accuracy"
                contentType="feature"
                variant="minimal"
              />
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-4 border">
              <h4 className="font-medium mb-2">Filter Experience</h4>
              <p className="text-sm text-neutral-500 mb-3">How easy was it to find the services you were looking for?</p>
              <ContentReaction 
                contentId="nearby-search-experience"
                contentType="feature"
                variant="minimal"
              />
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-4 border">
              <h4 className="font-medium mb-2">Service Information</h4>
              <p className="text-sm text-neutral-500 mb-3">Was the information about service providers helpful?</p>
              <ContentReaction 
                contentId="nearby-provider-info"
                contentType="feature"
                variant="minimal"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Planning & Trip integration section */}
      {!isEmergencyMode && !isLoading && !isError && filteredProviders && filteredProviders.length > 0 && (
        <div className="mt-6 border rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">Plan Your Journey</h3>
          <p className="text-sm text-neutral-500 mb-4">
            Optimize your trip by finding service points along your route
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-3">
              <div>
                <Label className="text-sm font-medium" htmlFor="start-location">Starting Point</Label>
                <Input id="start-location" placeholder="Current location" />
              </div>
              <div>
                <Label className="text-sm font-medium" htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="Enter destination" />
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <div>
                <Label className="text-sm font-medium">Required Service Points</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select required services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuel">Fuel stations</SelectItem>
                    <SelectItem value="food">Food & rest areas</SelectItem>
                    <SelectItem value="service">Service centers</SelectItem>
                    <SelectItem value="charging">EV charging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="mt-auto">Plan Route with Service Points</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add floating feedback button */}
      <FeedbackButton 
        contentId="vehicleassist-nearby"
        contentType="feature"
        position="bottom-right"
        variant="pill"
      />
    </div>
  );
};

export default NearbyNew;