import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Define vehicle and comparison types
interface VehicleForComparison {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  image: string;
  specifications: {
    [key: string]: {
      value: string | number;
      unit?: string;
      isHighlighted?: boolean;
      isBetter?: boolean;
    };
  };
  features: {
    [key: string]: boolean;
  };
  pricing: {
    basePrice: number;
    onRoadPrice: number;
    emi: number;
    maintenanceCost: number;
  };
}

// Categories for comparison
const comparisonCategories = [
  { id: 'performance', label: 'Performance' },
  { id: 'comfort', label: 'Comfort & Convenience' },
  { id: 'safety', label: 'Safety' },
  { id: 'dimensions', label: 'Dimensions' },
  { id: 'fuel', label: 'Fuel Economy' },
  { id: 'pricing', label: 'Pricing & Costs' },
];

// Specs mapping for each category
const specsByCategory: {
  [key: string]: { key: string; label: string; hint?: string }[];
} = {
  performance: [
    { key: 'engine', label: 'Engine' },
    { key: 'power', label: 'Maximum Power', hint: 'Higher is better' },
    { key: 'torque', label: 'Maximum Torque', hint: 'Higher is better' },
    { key: 'transmission', label: 'Transmission' },
    { key: 'acceleration', label: '0-100 km/h', hint: 'Lower is better' },
    { key: 'topSpeed', label: 'Top Speed', hint: 'Higher is better' },
  ],
  comfort: [
    { key: 'seatingCapacity', label: 'Seating Capacity' },
    { key: 'infotainment', label: 'Infotainment System' },
    { key: 'airConditioning', label: 'Air Conditioning' },
    { key: 'soundSystem', label: 'Sound System' },
    { key: 'seatsType', label: 'Seats Type' },
  ],
  safety: [
    { key: 'airbags', label: 'Airbags' },
    { key: 'abs', label: 'ABS' },
    { key: 'parkingSensors', label: 'Parking Sensors' },
    { key: 'crashTestRating', label: 'Crash Test Rating' },
    { key: 'rearCamera', label: 'Rear Camera' },
  ],
  dimensions: [
    { key: 'length', label: 'Length' },
    { key: 'width', label: 'Width' },
    { key: 'height', label: 'Height' },
    { key: 'wheelbase', label: 'Wheelbase' },
    { key: 'bootSpace', label: 'Boot Space' },
    { key: 'groundClearance', label: 'Ground Clearance' },
  ],
  fuel: [
    { key: 'fuelType', label: 'Fuel Type' },
    { key: 'fuelTankCapacity', label: 'Fuel Tank Capacity' },
    { key: 'mileageCity', label: 'Mileage (City)', hint: 'Higher is better' },
    { key: 'mileageHighway', label: 'Mileage (Highway)', hint: 'Higher is better' },
    { key: 'emissionStandard', label: 'Emission Standard' },
  ],
  pricing: [
    { key: 'basePrice', label: 'Base Price', hint: 'Lower is better' },
    { key: 'onRoadPrice', label: 'On Road Price', hint: 'Lower is better' },
    { key: 'emi', label: 'Monthly EMI', hint: 'Lower is better' },
    { key: 'maintenanceCost', label: 'Annual Maintenance', hint: 'Lower is better' },
    { key: 'insurance', label: 'Insurance (Annual)', hint: 'Lower is better' },
  ],
};

// Features mapping for each category
const featuresByCategory: {
  [key: string]: { key: string; label: string }[];
} = {
  performance: [
    { key: 'driveModes', label: 'Drive Modes' },
    { key: 'allWheelDrive', label: 'All Wheel Drive' },
    { key: 'sportSuspension', label: 'Sport Suspension' },
    { key: 'paddleShifters', label: 'Paddle Shifters' },
  ],
  comfort: [
    { key: 'sunroof', label: 'Sunroof' },
    { key: 'wirelessCharging', label: 'Wireless Charging' },
    { key: 'headUpDisplay', label: 'Head-Up Display' },
    { key: 'ventilatedSeats', label: 'Ventilated Seats' },
    { key: 'ambientLighting', label: 'Ambient Lighting' },
    { key: 'keylessEntry', label: 'Keyless Entry' },
  ],
  safety: [
    { key: 'laneAssist', label: 'Lane Assist' },
    { key: 'blindSpotMonitoring', label: 'Blind Spot Monitoring' },
    { key: 'adaptiveCruiseControl', label: 'Adaptive Cruise Control' },
    { key: 'autoEmergencyBraking', label: 'Auto Emergency Braking' },
    { key: '360Camera', label: '360° Camera' },
  ],
  dimensions: [],
  fuel: [
    { key: 'startStop', label: 'Start-Stop System' },
    { key: 'regenerativeBraking', label: 'Regenerative Braking' },
    { key: 'ecoMode', label: 'Eco Mode' },
  ],
  pricing: [
    { key: 'extendedWarranty', label: 'Extended Warranty Available' },
    { key: 'servicePlan', label: 'Service Plan Available' },
    { key: 'roadAssistance', label: 'Road Assistance' },
  ],
};

interface SideBySideComparisonProps {
  vehicles: VehicleForComparison[];
  availableVehicles: VehicleForComparison[];
  onSelectVehicle: (position: 'left' | 'right', vehicleId: number) => void;
  className?: string;
}

const SideBySideComparison: React.FC<SideBySideComparisonProps> = ({
  vehicles,
  availableVehicles,
  onSelectVehicle,
  className,
}) => {
  const [activeCategory, setActiveCategory] = useState('performance');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    specifications: true,
    features: true,
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  
  const formatValue = (value: string | number, unit?: string) => {
    if (typeof value === 'number' && activeCategory === 'pricing') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    }
    
    return `${value}${unit ? ' ' + unit : ''}`;
  };
  
  // Helper function to get a better/worse icon
  const getComparisonIcon = (isBetter?: boolean) => {
    if (isBetter === undefined) return null;
    
    return isBetter ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-amber-500" />
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl flex items-center justify-between">
          Vehicle Comparison
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Print Comparison
          </Button>
        </CardTitle>
        <CardDescription>
          Compare vehicles side by side to help make the right decision
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Vehicle Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {['left', 'right'].map((position, index) => (
            <div key={position} className="space-y-2">
              <label className="text-sm font-medium">
                {position === 'left' ? 'First Vehicle' : 'Second Vehicle'}
              </label>
              <Select 
                onValueChange={(value) => onSelectVehicle(position as 'left' | 'right', Number(value))}
                defaultValue={vehicles[index]?.id.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.make} {vehicle.model} {vehicle.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {vehicles[index] && (
                <div className="relative aspect-video rounded-md overflow-hidden bg-neutral-100">
                  <div 
                    className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url(${vehicles[index].image})` }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h3 className="text-white font-medium text-sm md:text-base">
                      {vehicles[index].make} {vehicles[index].model}
                    </h3>
                    <p className="text-white/80 text-xs">{vehicles[index].year}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Category Tabs */}
        <Tabs 
          defaultValue="performance" 
          onValueChange={setActiveCategory}
          className="w-full mb-6"
        >
          <TabsList className="w-full justify-start overflow-x-auto">
            {comparisonCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="px-4 py-2"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {comparisonCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              {/* Specifications Section */}
              <div className="border rounded-md overflow-hidden mb-4">
                <div 
                  className="bg-neutral-50 p-3 flex justify-between items-center cursor-pointer border-b"
                  onClick={() => toggleSection('specifications')}
                >
                  <h3 className="font-medium">Specifications</h3>
                  <Button variant="ghost" size="sm">
                    {expandedSections.specifications ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>
                
                {expandedSections.specifications && (
                  <div className="divide-y">
                    {specsByCategory[category.id]?.map((spec) => (
                      <div key={spec.key} className="grid grid-cols-2 hover:bg-neutral-50">
                        <div className="p-3 flex items-center border-r">
                          <div>
                            <p className="font-medium text-sm">{spec.label}</p>
                            {spec.hint && (
                              <p className="text-xs text-neutral-500">{spec.hint}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 divide-x">
                          {vehicles.map((vehicle, idx) => (
                            <div 
                              key={`${vehicle.id}-${spec.key}`} 
                              className={`p-3 ${vehicle.specifications[spec.key]?.isHighlighted ? 'bg-primary/5' : ''}`}
                            >
                              <div className="flex items-center gap-1">
                                {getComparisonIcon(vehicle.specifications[spec.key]?.isBetter)}
                                <span className={`${vehicle.specifications[spec.key]?.isHighlighted ? 'font-medium text-primary' : ''}`}>
                                  {vehicle.specifications[spec.key] 
                                    ? formatValue(
                                        vehicle.specifications[spec.key].value, 
                                        vehicle.specifications[spec.key].unit
                                      ) 
                                    : '-'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Features Section */}
              {featuresByCategory[category.id]?.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <div 
                    className="bg-neutral-50 p-3 flex justify-between items-center cursor-pointer border-b"
                    onClick={() => toggleSection('features')}
                  >
                    <h3 className="font-medium">Features</h3>
                    <Button variant="ghost" size="sm">
                      {expandedSections.features ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </div>
                  
                  {expandedSections.features && (
                    <div className="divide-y">
                      {featuresByCategory[category.id]?.map((feature) => (
                        <div key={feature.key} className="grid grid-cols-2 hover:bg-neutral-50">
                          <div className="p-3 flex items-center border-r">
                            <p className="font-medium text-sm">{feature.label}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 divide-x">
                            {vehicles.map((vehicle) => (
                              <div key={`${vehicle.id}-${feature.key}`} className="p-3 flex items-center">
                                {vehicle.features[feature.key] ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <CheckCircle className="h-3 w-3 mr-1" /> Yes
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-200">
                                    <XCircle className="h-3 w-3 mr-1" /> No
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="w-full pt-4 text-center">
          <p className="text-sm text-neutral-500">
            Data sourced from manufacturer specifications. Values may vary based on conditions and variants.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SideBySideComparison;