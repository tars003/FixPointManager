import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation, Flag, Map } from 'lucide-react';

interface LocationVerificationProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  onSelectDomestic: () => void;
  onSelectInternational: () => void;
  theme: 'light' | 'dark';
}

export default function LocationVerification({
  location,
  onSelectDomestic,
  onSelectInternational,
  theme
}: LocationVerificationProps) {
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  
  // Simplified map for demonstration
  const LocationMap = () => (
    <div className={`relative h-48 rounded-lg overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
      {/* This would be a real map component in production */}
      <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30">
        <div className="flex items-center justify-center h-full">
          <div className="relative">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500/50 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-10 px-4 py-2 bg-white/80 dark:bg-black/50 rounded shadow-sm">
              <p className="text-xs font-medium">{location.address}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={`absolute bottom-2 right-2 rounded bg-white dark:bg-gray-800 p-1 shadow-md`}>
        <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Emergency Location Verification
        </h2>
        <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          Please confirm your location to get the appropriate emergency assistance
        </p>
      </div>
      
      <Card className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800/80 border-gray-700'}`}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <LocationMap />
            
            <div className="flex items-start space-x-2 py-2">
              <Checkbox 
                id="confirm-location" 
                checked={locationConfirmed}
                onCheckedChange={() => setLocationConfirmed(!locationConfirmed)}
              />
              <Label 
                htmlFor="confirm-location" 
                className={`text-sm font-medium leading-tight ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
              >
                I confirm my current location is correct. If not accurate, please allow location access or manually select your emergency region below.
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Button
          className={`h-20 text-lg flex flex-col items-center justify-center ${locationConfirmed ? 'bg-red-600 hover:bg-red-700' : 'bg-red-400 cursor-not-allowed'} text-white`}
          onClick={onSelectDomestic}
          disabled={!locationConfirmed}
        >
          <Flag className="h-6 w-6 mb-1" />
          <span>Domestic (India)</span>
        </Button>
        
        <Button
          className={`h-20 text-lg flex flex-col items-center justify-center ${locationConfirmed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'} text-white`}
          onClick={onSelectInternational}
          disabled={!locationConfirmed}
        >
          <Globe className="h-6 w-6 mb-1" />
          <span>International</span>
        </Button>
      </div>
      
      <div className={`text-center text-sm mt-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
        <p>For immediate emergency in India, call 112</p>
      </div>
    </motion.div>
  );
}