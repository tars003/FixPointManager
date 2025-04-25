import { useEffect, useRef, useState } from 'react';
import { ServiceProvider } from '@shared/schema';
import { 
  MapPin, 
  Navigation, 
  MessageSquare, 
  Phone, 
  Globe, 
  Clock, 
  Star,
  Calendar,
  Info,
  Fuel,
  Wrench,
  Car,
  Battery,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import ContentReaction from '@/components/ui/content-reaction';

// Type for map marker categories
type MarkerCategory = 'fuel' | 'service' | 'tire' | 'wash' | 'rto' | 'roadside' | 'battery' | 'emission' | 'parts' | 'insurance' | 'user';

// Service category color mapping for map pins
const CATEGORY_COLORS: Record<MarkerCategory, string> = {
  fuel: '#ef4444',       // Red
  service: '#3b82f6',    // Blue
  tire: '#f97316',       // Orange
  wash: '#06b6d4',       // Cyan
  rto: '#8b5cf6',        // Purple
  roadside: '#f43f5e',   // Rose
  battery: '#10b981',    // Emerald
  emission: '#6366f1',   // Indigo
  parts: '#fbbf24',      // Amber
  insurance: '#64748b',  // Slate
  user: '#000000',       // Black
};

// Service category icon mapping
const CATEGORY_ICONS: Record<MarkerCategory, React.ElementType> = {
  fuel: Fuel,
  service: Wrench,
  tire: Car,
  wash: Car,
  rto: Info,
  roadside: Car,
  battery: Battery,
  emission: Car,
  parts: Wrench,
  insurance: Info,
  user: MapPin
};

interface EnhancedMapViewProps {
  providers: ServiceProvider[];
  onSelectProvider: (provider: ServiceProvider) => void;
  isEmergencyMode?: boolean;
  selectedCategories?: string[];
}

// Combine ServiceProvider type with enhanced fields
type EnhancedServiceProvider = ServiceProvider & {
  category?: MarkerCategory;
  isOpen?: boolean;
  distance?: number;
  waitTime?: string;
  specializations?: string[];
  formattedOperatingHours?: { day: string; hours: string }[];
}

declare global {
  interface Window {
    google: any;
  }
}

const EnhancedMapView = ({ 
  providers, 
  onSelectProvider,
  isEmergencyMode = false,
  selectedCategories = []
}: EnhancedMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<EnhancedServiceProvider | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const { toast } = useToast();

  // Determine marker category based on provider services
  const getMarkerCategory = (provider: ServiceProvider): MarkerCategory => {
    const services = provider.services.map(s => s.toLowerCase());
    
    if (services.some(s => s.includes('fuel') || s.includes('gas') || s.includes('petrol') || s.includes('diesel')))
      return 'fuel';
    if (services.some(s => s.includes('repair') || s.includes('service') || s.includes('maintenance')))
      return 'service';
    if (services.some(s => s.includes('tire') || s.includes('wheel') || s.includes('puncture')))
      return 'tire';
    if (services.some(s => s.includes('wash') || s.includes('clean')))
      return 'wash';
    if (services.some(s => s.includes('rto') || s.includes('registration')))
      return 'rto';
    if (services.some(s => s.includes('roadside') || s.includes('emergency') || s.includes('towing')))
      return 'roadside';
    if (services.some(s => s.includes('battery') || s.includes('charging')))
      return 'battery';
    if (services.some(s => s.includes('emission') || s.includes('pollution')))
      return 'emission';
    if (services.some(s => s.includes('parts') || s.includes('spares')))
      return 'parts';
    if (services.some(s => s.includes('insurance') || s.includes('policy')))
      return 'insurance';
    
    return 'service'; // Default
  };

  // Initialize map
  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google) {
      toast({
        title: "Map Error",
        description: "Google Maps API is not available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Initialize map centered on user location
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 13,
          mapId: 'DEMO_MAP_ID',
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        setMap(mapInstance);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast({
          title: "Location Error",
          description: "Couldn't get your location. Using default location.",
          variant: "destructive",
        });

        // Default location (Mumbai, India)
        const defaultLocation = { lat: 19.0760, lng: 72.8777 };
        setUserLocation(defaultLocation);

        // Initialize map with default location
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 13,
          mapId: 'DEMO_MAP_ID',
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        setMap(mapInstance);
      }
    );
  }, [toast]);

  // Add markers for service providers
  useEffect(() => {
    if (!map || !providers.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: any[] = [];

    // Enhance providers with additional data
    const enhancedProviders = providers.map(provider => {
      const category = getMarkerCategory(provider);
      // Add extended data that would come from the backend
      const enhancedProvider: EnhancedServiceProvider = {
        ...provider,
        category,
        isOpen: Math.random() > 0.2, // Sample data for demonstration
        waitTime: ['No wait', '5-10 mins', '15-20 mins', '30+ mins'][Math.floor(Math.random() * 4)],
        // Use provider's actual amenities if available, or provide sample data
        amenities: provider.amenities || ['Restrooms', 'Food', 'Wi-Fi', 'Coffee', 'Parking', 'Air conditioning'].filter(() => Math.random() > 0.5),
        specializations: ['Engine repair', 'Electrical', 'Transmission', 'Suspension', 'Brakes', 'A/C Service'].filter(() => Math.random() > 0.6),
        formattedOperatingHours: [
          { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
          { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
          { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
          { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
          { day: 'Friday', hours: '9:00 AM - 6:00 PM' },
          { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
          { day: 'Sunday', hours: 'Closed' },
        ],
        distance: userLocation ? 
          calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            parseFloat(provider.latitude), 
            parseFloat(provider.longitude)
          ) : 0
      };
      return enhancedProvider;
    });

    // Add markers for each provider
    for (const provider of enhancedProviders) {
      const lat = parseFloat(provider.latitude);
      const lng = parseFloat(provider.longitude);
      
      if (isNaN(lat) || isNaN(lng)) continue;

      // Get marker color based on provider category
      const category = provider.category || 'service';
      const markerColor = CATEGORY_COLORS[category];

      // Create marker
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: provider.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: '#ffffff',
          scale: isEmergencyMode && category === 'roadside' ? 12 : 10,
        },
      });

      // Add click event to marker
      marker.addListener('click', () => {
        setSelectedProvider(provider);
      });

      newMarkers.push(marker);
    }

    setMarkers(newMarkers);

    // Add user location marker if available
    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
          scale: 8,
        },
        zIndex: 1000 // Ensure user marker is on top
      });
      newMarkers.push(userMarker);
      
      // Add a radius circle around user location
      const radiusCircle = new window.google.maps.Circle({
        strokeColor: "#3b82f6",
        strokeOpacity: 0.2,
        strokeWeight: 1,
        fillColor: "#3b82f6",
        fillOpacity: 0.05,
        map,
        center: userLocation,
        radius: 5000, // 5km radius by default
      });
      newMarkers.push(radiusCircle);
    }

    // Adjust map bounds to show all markers
    const bounds = new window.google.maps.LatLngBounds();
    enhancedProviders.forEach(provider => {
      const lat = parseFloat(provider.latitude);
      const lng = parseFloat(provider.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        bounds.extend({ lat, lng });
      }
    });
    if (userLocation) {
      bounds.extend(userLocation);
    }
    map.fitBounds(bounds);

    return () => {
      newMarkers.forEach(marker => {
        if (marker.setMap) marker.setMap(null);
      });
    };
  }, [map, providers, userLocation, markers, isEmergencyMode]);

  // Calculate distance between two coordinates in km
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  const handleSelectProvider = () => {
    if (selectedProvider) {
      onSelectProvider(selectedProvider);
    }
  };

  const getDirections = () => {
    if (!selectedProvider || !userLocation) return;
    
    const providerLat = parseFloat(selectedProvider.latitude);
    const providerLng = parseFloat(selectedProvider.longitude);
    
    if (isNaN(providerLat) || isNaN(providerLng)) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${providerLat},${providerLng}`;
    window.open(url, '_blank');
  };

  // Make a call to the provider
  const callProvider = () => {
    if (!selectedProvider?.phone) return;
    window.location.href = `tel:${selectedProvider.phone}`;
  };

  // Visit provider website
  const visitWebsite = () => {
    // In a real app, would use the provider's actual website
    window.open('https://example.com', '_blank');
  };

  // Get icon for service category
  const CategoryIcon = (category: MarkerCategory) => {
    const Icon = CATEGORY_ICONS[category] || MapPin;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={mapRef} className="w-full h-[350px] md:h-[500px] rounded-lg"></div>
      
      {selectedProvider && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold">{selectedProvider.name}</CardTitle>
                <p className="text-neutral-500 text-sm">{selectedProvider.address}, {selectedProvider.city}</p>
              </div>
              <div className="flex items-center">
                <Badge 
                  variant={selectedProvider.isOpen ? "default" : "outline"} 
                  className={selectedProvider.isOpen ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}
                >
                  {selectedProvider.isOpen ? "Open Now" : "Closed"}
                </Badge>
                <div className="ml-2 flex items-center text-sm bg-neutral-100 px-2 py-1 rounded-full">
                  <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                  <span>{selectedProvider.rating}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="pt-4">
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-neutral-50 p-2 rounded-md">
                    <p className="text-xs font-medium text-neutral-500">Distance</p>
                    <p className="text-sm">{selectedProvider.distance} km</p>
                  </div>
                  <div className="bg-neutral-50 p-2 rounded-md">
                    <p className="text-xs font-medium text-neutral-500">Wait Time</p>
                    <p className="text-sm">{selectedProvider.waitTime || 'Not available'}</p>
                  </div>
                  <div className="bg-neutral-50 p-2 rounded-md">
                    <p className="text-xs font-medium text-neutral-500">Phone</p>
                    <p className="text-sm">{selectedProvider.phone}</p>
                  </div>
                  <div className="bg-neutral-50 p-2 rounded-md">
                    <p className="text-xs font-medium text-neutral-500">Type</p>
                    <p className="text-sm flex items-center">
                      {selectedProvider.category && CategoryIcon(selectedProvider.category)}
                      <span className="ml-1 capitalize">{selectedProvider.category}</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Services</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProvider.services.map((service, i) => (
                      <span key={i} className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                
                {selectedProvider.amenities && selectedProvider.amenities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Amenities</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedProvider.amenities.map((amenity, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedProvider.formattedOperatingHours && (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="hours">
                      <AccordionTrigger className="text-sm py-2">
                        Operating Hours
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-xs space-y-1">
                          {selectedProvider.formattedOperatingHours.map((item: {day: string, hours: string}, i: number) => (
                            <div key={i} className="flex justify-between">
                              <span className="font-medium">{item.day}</span>
                              <span>{item.hours}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="space-y-3">
                  <div className="text-center py-6">
                    <p className="text-neutral-500 text-sm">Reviews will be shown here</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="photos">
                <div className="text-center py-6">
                  <p className="text-neutral-500 text-sm">Photos will be shown here</p>
                </div>
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex justify-between items-center w-full">
                <span className="text-xs text-neutral-500 flex items-center">
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  Rate this provider
                </span>
                <ContentReaction
                  contentId={`provider-map-${selectedProvider.id}`}
                  contentType="provider"
                  variant="minimal"
                  enableComments={true}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button 
                  onClick={handleSelectProvider}
                  className={isEmergencyMode ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  {isEmergencyMode ? 'Request Emergency Help' : 'Select Provider'}
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" onClick={getDirections} className="p-2">
                    <Navigation className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={callProvider} className="p-2">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={visitWebsite} className="p-2">
                    <Globe className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default EnhancedMapView;