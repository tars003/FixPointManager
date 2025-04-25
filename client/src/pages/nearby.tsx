import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ServiceProvider } from '@shared/schema';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { MapPin, List, MapIcon, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MapView from '@/components/nearby/map-view';
import ContentReaction from '@/components/ui/content-reaction';
import FeedbackButton from '@/components/ui/feedback-button';

const Nearby = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [userCoordinates, setUserCoordinates] = useState<{latitude: string, longitude: string} | null>(null);
  
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
        // Use default coordinates (San Francisco)
        setUserCoordinates({
          latitude: "37.7749",
          longitude: "-122.4194"
        });
      }
    );
  }, [toast]);
  
  // Fetch nearby service providers
  const { data: providers, isLoading, isError } = useQuery<ServiceProvider[]>({
    queryKey: ['/api/service-providers', userCoordinates],
    enabled: !!userCoordinates,
  });
  
  const handleSelectProvider = (provider: ServiceProvider) => {
    navigate(`/book-service?providerId=${provider.id}`);
  };
  
  // Filter providers based on search query
  const filteredProviders = providers?.filter(provider => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      provider.name.toLowerCase().includes(query) ||
      provider.address.toLowerCase().includes(query) ||
      provider.city.toLowerCase().includes(query) ||
      provider.services.some(service => service.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-dark lg:block hidden mb-2">Nearby Service Providers</h2>
        <p className="text-neutral-light">Find trusted service providers in your area</p>
        
        <div className="relative mt-4">
          <Input 
            type="search" 
            placeholder="Search by name, address, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MapPin className="h-5 w-5 text-neutral-light" />
          </div>
        </div>
      </div>
      
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
            <div className="bg-neutral-lightest rounded-lg h-[400px] animate-pulse flex items-center justify-center">
              <p className="text-neutral-light">Loading map...</p>
            </div>
          ) : isError ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-red-500 mb-2">Error loading map data</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : filteredProviders && filteredProviders.length > 0 ? (
            <MapView 
              providers={filteredProviders}
              onSelectProvider={handleSelectProvider}
            />
          ) : (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="mb-2">No service providers found in your area</p>
              <p className="text-neutral-light mb-4">Try expanding your search or changing your filters</p>
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
                <Card key={provider.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{provider.name}</h3>
                        <p className="text-neutral-light text-sm">{provider.address}, {provider.city}</p>
                        <p className="text-sm mt-1">{provider.phone}</p>
                      </div>
                      <div className="flex items-center text-sm bg-neutral-lightest px-2 py-1 rounded-full">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{provider.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {provider.services.slice(0, 4).map((service, i) => (
                        <span key={i} className="text-xs bg-primary-light text-primary px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                      {provider.services.length > 4 && (
                        <span className="text-xs bg-neutral-lightest px-2 py-1 rounded-full">
                          +{provider.services.length - 4} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-light flex items-center">
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          Give feedback on this provider
                        </span>
                        <ContentReaction
                          contentId={`provider-${provider.id}`}
                          contentType="provider"
                          variant="minimal"
                          enableComments={true}
                        />
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => handleSelectProvider(provider)}
                      >
                        Select Provider
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="mb-2">No service providers found</p>
              <p className="text-neutral-light mb-4">Try expanding your search or changing your filters</p>
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
              <p className="text-neutral-light">Your feedback helps us improve our nearby services feature</p>
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
              <p className="text-sm text-neutral-light mb-3">Were the service providers accurately located on the map?</p>
              <ContentReaction 
                contentId="nearby-location-accuracy"
                contentType="feature"
                variant="minimal"
              />
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-4 border">
              <h4 className="font-medium mb-2">Search Experience</h4>
              <p className="text-sm text-neutral-light mb-3">How easy was it to find the services you were looking for?</p>
              <ContentReaction 
                contentId="nearby-search-experience"
                contentType="feature"
                variant="minimal"
              />
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-4 border">
              <h4 className="font-medium mb-2">Provider Information</h4>
              <p className="text-sm text-neutral-light mb-3">Was the information about service providers helpful?</p>
              <ContentReaction 
                contentId="nearby-provider-info"
                contentType="feature"
                variant="minimal"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Add a floating feedback button */}
      <FeedbackButton 
        contentId="vehicleassist-nearby"
        contentType="feature"
        position="bottom-right"
        variant="pill"
      />
    </div>
  );
};

export default Nearby;
