import { useEffect, useRef, useState } from 'react';
import { ServiceProvider } from '@shared/schema';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface MapViewProps {
  providers: ServiceProvider[];
  onSelectProvider: (provider: ServiceProvider) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const MapView = ({ providers, onSelectProvider }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const { toast } = useToast();

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

        // Default location (San Francisco)
        const defaultLocation = { lat: 37.7749, lng: -122.4194 };
        setUserLocation(defaultLocation);

        // Initialize map with default location
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: defaultLocation,
          zoom: 13,
          mapId: 'DEMO_MAP_ID',
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
    const newMarkers = [];

    // Add markers for each provider
    for (const provider of providers) {
      const lat = parseFloat(provider.latitude);
      const lng = parseFloat(provider.longitude);
      
      if (isNaN(lat) || isNaN(lng)) continue;

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: provider.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: '#ffffff',
          scale: 10,
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
          strokeWeight: 1,
          strokeColor: '#ffffff',
          scale: 8,
        },
      });
      newMarkers.push(userMarker);
    }

    // Adjust map bounds to show all markers
    const bounds = new window.google.maps.LatLngBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
    map.fitBounds(bounds);

    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, providers, userLocation, markers]);

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

  return (
    <div className="flex flex-col h-full">
      <div ref={mapRef} className="w-full h-[350px] md:h-[500px] rounded-lg"></div>
      
      {selectedProvider && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{selectedProvider.name}</h3>
                <p className="text-neutral-light text-sm">{selectedProvider.address}, {selectedProvider.city}</p>
                <p className="text-sm mt-1">{selectedProvider.phone}</p>
              </div>
              <div className="flex items-center text-sm bg-neutral-lightest px-2 py-1 rounded-full">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{selectedProvider.rating}</span>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1">
              {selectedProvider.services.slice(0, 4).map((service, i) => (
                <span key={i} className="text-xs bg-primary-light text-primary px-2 py-1 rounded-full">
                  {service}
                </span>
              ))}
              {selectedProvider.services.length > 4 && (
                <span className="text-xs bg-neutral-lightest px-2 py-1 rounded-full">
                  +{selectedProvider.services.length - 4} more
                </span>
              )}
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSelectProvider} className="flex-1">
                Select Provider
              </Button>
              <Button variant="outline" onClick={getDirections} className="flex items-center">
                <Navigation className="h-4 w-4 mr-1" />
                Directions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapView;
