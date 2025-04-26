import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info } from 'lucide-react';

// Import all our new components
import ColorCodedMetrics from '@/components/performance/color-coded-metrics';
import VehicleRecommendationWidget from '@/components/recommendations/vehicle-recommendation-widget';
import SideBySideComparison from '@/components/comparison/side-by-side-comparison';
import AutoEmojiSet from '@/components/ui/emoji-hover/auto-emoji-set';
import PremiumVehicleTour from '@/components/onboarding/premium-vehicle-tour';

// Sample data for performance metrics
const samplePerformanceMetrics = [
  {
    name: 'Fuel Efficiency',
    value: 18.5,
    unit: 'km/l',
    description: 'Average fuel consumption over the last 30 days',
    threshold: {
      excellent: 20,
      good: 15,
      average: 12,
      poor: 8,
    },
  },
  {
    name: 'Engine Health',
    value: 92,
    unit: '%',
    description: 'Overall engine performance based on diagnostics',
    threshold: {
      excellent: 90,
      good: 80,
      average: 70,
      poor: 60,
    },
  },
  {
    name: 'Brake Wear',
    value: 75,
    unit: '%',
    description: 'Remaining life of brake pads',
    threshold: {
      excellent: 80,
      good: 60,
      average: 40,
      poor: 20,
    },
  },
  {
    name: 'Tire Condition',
    value: 68,
    unit: '%',
    description: 'Overall tire health based on tread depth and pressure',
    threshold: {
      excellent: 85,
      good: 70,
      average: 50,
      poor: 30,
    },
  },
];

// Sample data for vehicle recommendations
const sampleRecommendations = [
  {
    id: 1,
    name: 'Premium Sedan',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741',
    price: '₹65,00,000',
    rating: 4.8,
    highlights: [
      'Matches your preference for luxury vehicles',
      'Similar to your current driving pattern',
      'Within your specified budget range',
      'Features the safety technologies you prioritize',
    ],
    matchScore: 92,
    category: 'luxury',
    features: [
      {
        key: 'Engine',
        value: '2.0L Turbo',
        icon: <AutoEmojiSet setKey="performance" size="sm" />,
      },
      {
        key: 'Transmission',
        value: '9-Speed Auto',
        icon: <AutoEmojiSet setKey="sporty" size="sm" />,
      },
      {
        key: 'Mileage',
        value: '14.6 km/l',
        icon: <AutoEmojiSet setKey="economy" size="sm" />,
      },
      {
        key: 'Safety',
        value: '5 Star NCAP',
        icon: <AutoEmojiSet setKey="luxury" size="sm" />,
      },
    ],
  },
  {
    id: 2,
    name: 'Electric SUV',
    make: 'Tesla',
    model: 'Model Y',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a',
    price: '₹55,00,000',
    rating: 4.7,
    highlights: [
      'Aligns with your interest in electric vehicles',
      'Higher seating position you preferred',
      'Latest technology features you valued',
      'Low maintenance cost profile',
    ],
    matchScore: 88,
    category: 'performance',
    features: [
      {
        key: 'Range',
        value: '450 km',
        icon: <AutoEmojiSet setKey="economy" size="sm" />,
      },
      {
        key: 'Acceleration',
        value: '3.5s (0-100)',
        icon: <AutoEmojiSet setKey="performance" size="sm" />,
      },
      {
        key: 'Cargo Space',
        value: '854 L',
        icon: <AutoEmojiSet setKey="utility" size="sm" />,
      },
      {
        key: 'Tech',
        value: 'Autopilot',
        icon: <AutoEmojiSet setKey="luxury" size="sm" />,
      },
    ],
  },
  {
    id: 3,
    name: 'Compact Hatchback',
    make: 'Maruti Suzuki',
    model: 'Baleno',
    year: 2023,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Baleno/8674/1645612088846/front-left-side-47.jpg',
    price: '₹8,50,000',
    rating: 4.2,
    highlights: [
      'Best-in-class fuel economy for city driving',
      'Compact size for easy urban navigation',
      'Low maintenance costs',
      'Features the connectivity options you wanted',
    ],
    matchScore: 78,
    category: 'budget',
    features: [
      {
        key: 'Engine',
        value: '1.2L Petrol',
        icon: <AutoEmojiSet setKey="economy" size="sm" />,
      },
      {
        key: 'Mileage',
        value: '22.3 km/l',
        icon: <AutoEmojiSet setKey="economy" size="sm" />,
      },
      {
        key: 'Features',
        value: 'Smart Connect',
        icon: <AutoEmojiSet setKey="luxury" size="sm" />,
      },
      {
        key: 'Warranty',
        value: '2 Years',
        icon: <AutoEmojiSet setKey="maintenance" size="sm" />,
      },
    ],
  },
];

// Sample data for vehicle comparison
const sampleVehiclesForComparison = [
  {
    id: 1,
    name: 'Premium Sedan',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741',
    specifications: {
      engine: { value: '2.0L Turbo', isHighlighted: true },
      power: { value: 194, unit: 'HP', isHighlighted: true, isBetter: true },
      torque: { value: 320, unit: 'Nm', isBetter: true },
      transmission: { value: '9-Speed Automatic' },
      acceleration: { value: 7.5, unit: 'sec' },
      topSpeed: { value: 240, unit: 'km/h', isBetter: true },
      seatingCapacity: { value: 5 },
      infotainment: { value: '12.3" Touchscreen', isHighlighted: true },
      airConditioning: { value: 'Auto 3-Zone' },
      soundSystem: { value: 'Burmester 13-Speaker' },
      seatsType: { value: 'Leather' },
      airbags: { value: 8 },
      abs: { value: 'Yes with EBD' },
      parkingSensors: { value: 'Front & Rear' },
      crashTestRating: { value: '5 Stars', isHighlighted: true, isBetter: true },
      rearCamera: { value: '360 Degree' },
      length: { value: 4935, unit: 'mm' },
      width: { value: 1852, unit: 'mm' },
      height: { value: 1460, unit: 'mm' },
      wheelbase: { value: 2939, unit: 'mm' },
      bootSpace: { value: 540, unit: 'L', isBetter: true },
      groundClearance: { value: 150, unit: 'mm' },
      fuelType: { value: 'Petrol' },
      fuelTankCapacity: { value: 66, unit: 'L', isBetter: true },
      mileageCity: { value: 12.5, unit: 'km/l' },
      mileageHighway: { value: 16.8, unit: 'km/l' },
      emissionStandard: { value: 'BS6' },
      basePrice: { value: 6500000, isBetter: false },
      onRoadPrice: { value: 7800000, isBetter: false },
      emi: { value: 98000, isBetter: false },
      maintenanceCost: { value: 45000, isBetter: false },
      insurance: { value: 85000, isBetter: false },
    },
    features: {
      driveModes: true,
      allWheelDrive: false,
      sportSuspension: true,
      paddleShifters: true,
      sunroof: true,
      wirelessCharging: true,
      headUpDisplay: true,
      ventilatedSeats: true,
      ambientLighting: true,
      keylessEntry: true,
      laneAssist: true,
      blindSpotMonitoring: true,
      adaptiveCruiseControl: true,
      autoEmergencyBraking: true,
      '360Camera': true,
      startStop: true,
      regenerativeBraking: false,
      ecoMode: true,
      extendedWarranty: true,
      servicePlan: true,
      roadAssistance: true,
    },
    pricing: {
      basePrice: 6500000,
      onRoadPrice: 7800000,
      emi: 98000,
      maintenanceCost: 45000,
    },
  },
  {
    id: 2,
    name: 'Electric SUV',
    make: 'Tesla',
    model: 'Model Y',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a',
    specifications: {
      engine: { value: 'Dual Motor Electric', isHighlighted: true },
      power: { value: 385, unit: 'HP', isHighlighted: true, isBetter: true },
      torque: { value: 510, unit: 'Nm', isHighlighted: true, isBetter: true },
      transmission: { value: 'Single-Speed' },
      acceleration: { value: 3.7, unit: 'sec', isHighlighted: true, isBetter: true },
      topSpeed: { value: 217, unit: 'km/h' },
      seatingCapacity: { value: 5 },
      infotainment: { value: '15" Touchscreen', isHighlighted: true },
      airConditioning: { value: 'Auto 2-Zone' },
      soundSystem: { value: 'Premium 14-Speaker' },
      seatsType: { value: 'Vegan Leather' },
      airbags: { value: 8 },
      abs: { value: 'Yes with EBD' },
      parkingSensors: { value: 'Front & Rear' },
      crashTestRating: { value: '5 Stars', isHighlighted: true, isBetter: true },
      rearCamera: { value: '360 Degree' },
      length: { value: 4750, unit: 'mm' },
      width: { value: 1920, unit: 'mm', isBetter: true },
      height: { value: 1624, unit: 'mm', isBetter: true },
      wheelbase: { value: 2890, unit: 'mm' },
      bootSpace: { value: 854, unit: 'L', isHighlighted: true, isBetter: true },
      groundClearance: { value: 167, unit: 'mm', isBetter: true },
      fuelType: { value: 'Electric', isHighlighted: true },
      fuelTankCapacity: { value: 'N/A', unit: '' },
      mileageCity: { value: 'N/A', unit: '' },
      mileageHighway: { value: 'N/A', unit: '' },
      emissionStandard: { value: 'Zero Emission', isHighlighted: true, isBetter: true },
      basePrice: { value: 5500000, isBetter: true },
      onRoadPrice: { value: 5800000, isBetter: true },
      emi: { value: 75000, isBetter: true },
      maintenanceCost: { value: 12000, isHighlighted: true, isBetter: true },
      insurance: { value: 65000, isBetter: true },
    },
    features: {
      driveModes: true,
      allWheelDrive: true,
      sportSuspension: false,
      paddleShifters: false,
      sunroof: true,
      wirelessCharging: true,
      headUpDisplay: false,
      ventilatedSeats: true,
      ambientLighting: true,
      keylessEntry: true,
      laneAssist: true,
      blindSpotMonitoring: true,
      adaptiveCruiseControl: true,
      autoEmergencyBraking: true,
      '360Camera': true,
      startStop: false,
      regenerativeBraking: true,
      ecoMode: true,
      extendedWarranty: true,
      servicePlan: true,
      roadAssistance: true,
    },
    pricing: {
      basePrice: 5500000,
      onRoadPrice: 5800000,
      emi: 75000,
      maintenanceCost: 12000,
    },
  },
];

const FeatureShowcase: React.FC = () => {
  const [showTour, setShowTour] = useState(false);
  const [activeTab, setActiveTab] = useState('metrics');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">New Features</h2>
        <Button onClick={() => setShowTour(true)}>Start Onboarding Tour</Button>
      </div>
      
      <Tabs defaultValue="metrics" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="emojis">Automotive Emojis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics">
          <ColorCodedMetrics metrics={samplePerformanceMetrics} />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <VehicleRecommendationWidget 
            recommendations={sampleRecommendations} 
            onViewDetails={(id) => console.log('View details for vehicle', id)}
          />
        </TabsContent>
        
        <TabsContent value="comparison" data-tour="comparison">
          <SideBySideComparison 
            vehicles={sampleVehiclesForComparison}
            availableVehicles={sampleVehiclesForComparison}
            onSelectVehicle={(position, vehicleId) => console.log(`Selected vehicle ${vehicleId} for ${position} position`)}
          />
        </TabsContent>
        
        <TabsContent value="emojis">
          <Card>
            <CardHeader>
              <CardTitle>Automotive Emoji Reactions</CardTitle>
              <CardDescription>
                Hover over the emojis to see animations and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    Performance Vehicle Set
                    <Info className="h-4 w-4 text-neutral-400" />
                  </h3>
                  <AutoEmojiSet setKey="performance" size="lg" showLabels={true} spacing="lg" />
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    Luxury Vehicle Set
                    <Info className="h-4 w-4 text-neutral-400" />
                  </h3>
                  <AutoEmojiSet setKey="luxury" size="lg" showLabels={true} spacing="lg" />
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    Economy Vehicle Set
                    <Info className="h-4 w-4 text-neutral-400" />
                  </h3>
                  <AutoEmojiSet setKey="economy" size="lg" showLabels={true} spacing="lg" />
                </div>
                
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    Maintenance Set
                    <Info className="h-4 w-4 text-neutral-400" />
                  </h3>
                  <AutoEmojiSet setKey="maintenance" size="lg" showLabels={true} spacing="lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {showTour && (
        <PremiumVehicleTour 
          onComplete={() => setShowTour(false)}
          onClose={() => setShowTour(false)}
        />
      )}
    </div>
  );
};

export default FeatureShowcase;