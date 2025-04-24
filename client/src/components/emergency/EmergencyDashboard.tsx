import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import LocationVerification from './LocationVerification';
import DomesticEmergency from './DomesticEmergency';
import InternationalEmergency from './InternationalEmergency';
import EmergencyProfile from './EmergencyProfile';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ArrowLeft, Globe, MapPin, PhoneCall, Share2, Users, Home } from 'lucide-react';

// Emergency states
type EmergencyState = 'location-verification' | 'domestic' | 'international' | 'profile';

export default function EmergencyDashboard({ theme }: { theme: 'light' | 'dark' }) {
  // Set default state to domestic as per requirements
  const [emergencyState, setEmergencyState] = useState<EmergencyState>('domestic');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [, setLocation2] = useLocation();
  
  // Assuming user ID 1 for demo purposes (would be from auth context in real app)
  const userId = 1;

  // Fetch user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would perform reverse geocoding to get address
          // For demo, we're hardcoding an address
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'Bannerghatta Road, Bengaluru, Karnataka, India'
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location
          setLocation({
            latitude: 12.9716,
            longitude: 77.5946,
            address: 'Bannerghatta Road, Bengaluru, Karnataka, India'
          });
        }
      );
    } else {
      // Geolocation not supported
      setLocation({
        latitude: 12.9716,
        longitude: 77.5946,
        address: 'Bannerghatta Road, Bengaluru, Karnataka, India'
      });
    }
  }, []);

  const handleEmergencyProfileToggle = () => {
    if (emergencyState === 'profile') {
      // Go back to previous state
      setEmergencyState(localStorage.getItem('previousEmergencyState') as EmergencyState || 'location-verification');
    } else {
      // Save current state and go to profile
      localStorage.setItem('previousEmergencyState', emergencyState);
      setEmergencyState('profile');
    }
  };

  const handleGoBack = () => {
    if (emergencyState === 'profile') {
      setEmergencyState(localStorage.getItem('previousEmergencyState') as EmergencyState || 'domestic');
    } else {
      // Go back to main app for any other state - with tabs, we don't need to go back to location verification
      setLocation2('/');
    }
  };

  // Share current location
  const handleShareLocation = () => {
    if (location) {
      // Create shareable location text
      const locationText = `I'm currently at ${location.address}. My coordinates are: ${location.latitude}, ${location.longitude}`;
      const shareUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
      
      // Check if Web Share API is available
      if (navigator.share) {
        navigator.share({
          title: 'My Emergency Location',
          text: locationText,
          url: shareUrl
        }).catch(error => {
          console.error('Error sharing:', error);
          // Fallback to copying to clipboard
          navigator.clipboard.writeText(`${locationText}\n${shareUrl}`).then(() => {
            alert('Location copied to clipboard');
          });
        });
      } else {
        // Fallback for browsers that don't support sharing
        navigator.clipboard.writeText(`${locationText}\n${shareUrl}`).then(() => {
          alert('Location copied to clipboard');
        });
      }
    }
  };

  // Render emergency header with critical tools
  const renderEmergencyHeader = () => {
    return (
      <div className={`sticky top-0 z-10 py-3 px-4 ${theme === 'light' 
        ? 'bg-white border-b border-gray-100 shadow-sm' 
        : 'bg-gray-900 border-b border-gray-800'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleGoBack}
              className={theme === 'light' 
                ? 'hover:bg-gray-100 text-gray-700' 
                : 'hover:bg-gray-800 text-gray-200'}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className={`text-lg font-bold flex items-center ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                <AlertTriangle className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`} />
                {emergencyState === 'domestic' 
                  ? 'Emergency Assistance - India'
                  : emergencyState === 'international'
                  ? 'Global Emergency Assistance'
                  : emergencyState === 'profile'
                  ? 'Emergency Profile'
                  : 'Emergency Location'
                }
              </h1>
              {location && emergencyState !== 'profile' && (
                <p className={`text-xs flex items-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  <MapPin className="h-3 w-3 mr-1" />
                  {location.address}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {emergencyState !== 'location-verification' && emergencyState !== 'profile' && (
              <>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleShareLocation}
                  className={theme === 'light' 
                    ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-sm' 
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-750'}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share Location
                </Button>
                
                {emergencyState === 'domestic' && (
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {window.open('tel:112', '_self')}}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-md"
                  >
                    <PhoneCall className="h-4 w-4 mr-1" />
                    Call 112
                  </Button>
                )}
                
                {emergencyState === 'international' && (
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {window.open('tel:112', '_self')}}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-md"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    Emergency Call
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEmergencyProfileToggle}
                  className={theme === 'light' 
                    ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-sm' 
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-750'}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Emergency Profile
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {renderEmergencyHeader()}
      
      <div className={`container max-w-5xl mx-auto px-4 py-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        {/* Add Tab Navigation System */}
        {(emergencyState === 'domestic' || emergencyState === 'international') && (
          <Tabs 
            defaultValue={emergencyState} 
            onValueChange={(value) => setEmergencyState(value as EmergencyState)}
            className="mb-4"
          >
            <TabsList className={`grid w-full grid-cols-2 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
              <TabsTrigger 
                value="domestic"
                className={`flex items-center gap-2 ${theme === 'light' 
                  ? 'data-[state=active]:bg-white' 
                  : 'data-[state=active]:bg-gray-700'}`}
              >
                <Home className="h-4 w-4" />
                Domestic (India)
              </TabsTrigger>
              <TabsTrigger 
                value="international"
                className={`flex items-center gap-2 ${theme === 'light' 
                  ? 'data-[state=active]:bg-white' 
                  : 'data-[state=active]:bg-gray-700'}`}
              >
                <Globe className="h-4 w-4" />
                International
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={theme === 'light' ? 'shadow-sm rounded-xl overflow-hidden' : ''}
        >
          {emergencyState === 'location-verification' && location && (
            <LocationVerification 
              location={location}
              onSelectDomestic={() => setEmergencyState('domestic')}
              onSelectInternational={() => setEmergencyState('international')}
              theme={theme}
            />
          )}
          
          {emergencyState === 'domestic' && location && (
            <DomesticEmergency 
              location={location}
              theme={theme}
              onShowProfile={handleEmergencyProfileToggle}
            />
          )}
          
          {emergencyState === 'international' && location && (
            <InternationalEmergency 
              location={location}
              theme={theme}
              onShowProfile={handleEmergencyProfileToggle}
            />
          )}
          
          {emergencyState === 'profile' && (
            <EmergencyProfile 
              userId={userId}
              theme={theme}
              onBack={handleGoBack}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}