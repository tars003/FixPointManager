import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, ThumbsUp, ThumbsDown, Car, Heart, BatteryCharging, Clock, Tag, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

// User preference types
interface UserPreference {
  id: string;
  type: string;
  label: string;
  options: {
    id: string;
    label: string;
    value: any;
    icon?: JSX.Element;
  }[];
  value: any;
}

// Vehicle recommendation type
interface VehicleRecommendation {
  id: string;
  name: string;
  brand: string;
  type: string;
  thumbnail: string;
  price: number;
  matchScore: number;
  features: string[];
  pros: string[];
  cons: string[];
  specs: {
    engine?: string;
    power?: string;
    acceleration?: string;
    topSpeed?: string;
    range?: string;
    fuelConsumption?: string;
  };
  popular?: boolean;
  new?: boolean;
  electric?: boolean;
}

interface RecommendationEngineProps {
  onSelectVehicle: (vehicle: VehicleRecommendation) => void;
  formatPrice: (price: number) => string;
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  onSelectVehicle,
  formatPrice
}) => {
  // User preferences that affect recommendations
  const [preferences, setPreferences] = useState<UserPreference[]>([
    {
      id: 'vehicle-type',
      type: 'select',
      label: 'Vehicle Type',
      options: [
        { id: 'sedan', label: 'Sedan', value: 'sedan', icon: <Car className="h-4 w-4" /> },
        { id: 'suv', label: 'SUV', value: 'suv', icon: <Car className="h-4 w-4" /> },
        { id: 'sports', label: 'Sports', value: 'sports', icon: <Car className="h-4 w-4" /> },
        { id: 'electric', label: 'Electric', value: 'electric', icon: <BatteryCharging className="h-4 w-4" /> },
      ],
      value: null
    },
    {
      id: 'price-range',
      type: 'range',
      label: 'Budget',
      options: [
        { id: 'budget', label: 'Under ₹10,00,000', value: 'budget', icon: <Tag className="h-4 w-4" /> },
        { id: 'mid-range', label: '₹10,00,000 - ₹25,00,000', value: 'mid-range', icon: <Tag className="h-4 w-4" /> },
        { id: 'premium', label: '₹25,00,000 - ₹50,00,000', value: 'premium', icon: <Tag className="h-4 w-4" /> },
        { id: 'luxury', label: 'Over ₹50,00,000', value: 'luxury', icon: <Award className="h-4 w-4" /> },
      ],
      value: null
    },
    {
      id: 'primary-use',
      type: 'select',
      label: 'Primary Use',
      options: [
        { id: 'commute', label: 'Daily Commute', value: 'commute', icon: <Clock className="h-4 w-4" /> },
        { id: 'family', label: 'Family Travel', value: 'family', icon: <Clock className="h-4 w-4" /> },
        { id: 'performance', label: 'Performance', value: 'performance', icon: <Clock className="h-4 w-4" /> },
        { id: 'luxury', label: 'Luxury Experience', value: 'luxury', icon: <Clock className="h-4 w-4" /> },
      ],
      value: null
    }
  ]);
  
  // Sample recommendation data (this would come from an API in production)
  const [recommendations, setRecommendations] = useState<VehicleRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [step, setStep] = useState(0);
  const [likedVehicles, setLikedVehicles] = useState<string[]>([]);
  const [dislikedVehicles, setDislikedVehicles] = useState<string[]>([]);
  
  // Sample vehicles for recommendations
  const sampleVehicles: VehicleRecommendation[] = [
    {
      id: 'v1',
      name: 'Premium Sport',
      brand: 'Velocity',
      type: 'sports',
      thumbnail: '🏎️',
      price: 6000000,
      matchScore: 94,
      features: ['Twin-Turbo V6', 'All-Wheel Drive', 'Carbon Fiber Accents'],
      pros: ['Exceptional handling', 'Premium interior', 'Advanced tech'],
      cons: ['Limited cargo space', 'Higher fuel consumption'],
      specs: {
        engine: '3.0L Twin-Turbo V6',
        power: '450 bhp',
        acceleration: '0-100 in 4.2s',
        topSpeed: '290 km/h',
        fuelConsumption: '12 km/l'
      },
      popular: true
    },
    {
      id: 'v2',
      name: 'Urban Explorer',
      brand: 'TrekStar',
      type: 'suv',
      thumbnail: '🚙',
      price: 3500000,
      matchScore: 87,
      features: ['Panoramic Sunroof', 'Advanced Safety', '7-Seater Option'],
      pros: ['Spacious interior', 'Excellent ground clearance', 'Family-friendly'],
      cons: ['Moderate fuel economy', 'Larger turning radius'],
      specs: {
        engine: '2.0L Turbo',
        power: '240 bhp',
        acceleration: '0-100 in 8.2s',
        topSpeed: '210 km/h',
        fuelConsumption: '14 km/l'
      }
    },
    {
      id: 'v3',
      name: 'Electric GT',
      brand: 'VoltStar',
      type: 'electric',
      thumbnail: '⚡',
      price: 7500000,
      matchScore: 91,
      features: ['400km Range', 'Ultra-Fast Charging', 'Self-Driving Capability'],
      pros: ['Zero emissions', 'Lower running costs', 'Instant torque'],
      cons: ['Limited charging infrastructure', 'Higher initial cost'],
      specs: {
        power: '500 bhp equivalent',
        acceleration: '0-100 in 3.5s',
        topSpeed: '250 km/h',
        range: '400 km'
      },
      electric: true,
      new: true
    },
    {
      id: 'v4',
      name: 'City Commuter',
      brand: 'AutoLux',
      type: 'sedan',
      thumbnail: '🚗',
      price: 1800000,
      matchScore: 82,
      features: ['Hybrid Option', 'City Parking Assist', 'Economic Running Costs'],
      pros: ['Excellent fuel economy', 'Easy to park', 'Reliable'],
      cons: ['Less spacious than SUVs', 'Limited off-road capability'],
      specs: {
        engine: '1.5L Hybrid',
        power: '180 bhp',
        acceleration: '0-100 in 8.6s',
        topSpeed: '190 km/h',
        fuelConsumption: '20 km/l'
      }
    }
  ];
  
  // Update preference value
  const handlePreferenceChange = (preferenceId: string, value: any) => {
    setPreferences(preferences.map(pref => 
      pref.id === preferenceId ? { ...pref, value } : pref
    ));
  };
  
  // Next step in the preference gathering process
  const handleNextStep = () => {
    // If we're at the last step, generate recommendations
    if (step === preferences.length - 1) {
      handleGenerateRecommendations();
    } else {
      setStep(step + 1);
    }
  };
  
  // Previous step
  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  // Generate recommendations based on preferences
  const handleGenerateRecommendations = async () => {
    setLoading(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      // Filter and sort vehicles based on user preferences
      // In a real app, this would be done by an API with sophisticated matching
      
      const typePreference = preferences.find(p => p.id === 'vehicle-type')?.value;
      const pricePreference = preferences.find(p => p.id === 'price-range')?.value;
      
      // Sample filtering logic - in a real app this would be more sophisticated
      let filtered = [...sampleVehicles];
      
      if (typePreference === 'sedan') {
        filtered = filtered.filter(v => v.type === 'sedan');
      } else if (typePreference === 'suv') {
        filtered = filtered.filter(v => v.type === 'suv');
      } else if (typePreference === 'sports') {
        filtered = filtered.filter(v => v.type === 'sports');
      } else if (typePreference === 'electric') {
        filtered = filtered.filter(v => v.electric);
      }
      
      // Apply some randomness to scores to simulate personalization
      filtered = filtered.map(vehicle => ({
        ...vehicle,
        matchScore: Math.min(100, Math.floor(vehicle.matchScore + (Math.random() * 10) - 5))
      }));
      
      // Sort by match score
      filtered.sort((a, b) => b.matchScore - a.matchScore);
      
      setRecommendations(filtered);
      setLoading(false);
      setComplete(true);
    }, 1500);
  };
  
  // Reset the recommendation process
  const handleReset = () => {
    setPreferences(preferences.map(pref => ({ ...pref, value: null })));
    setRecommendations([]);
    setStep(0);
    setComplete(false);
    setLikedVehicles([]);
    setDislikedVehicles([]);
  };
  
  // Like a vehicle recommendation
  const handleLikeVehicle = (vehicleId: string) => {
    if (likedVehicles.includes(vehicleId)) {
      setLikedVehicles(likedVehicles.filter(id => id !== vehicleId));
    } else {
      setLikedVehicles([...likedVehicles, vehicleId]);
      setDislikedVehicles(dislikedVehicles.filter(id => id !== vehicleId));
    }
  };
  
  // Dislike a vehicle recommendation
  const handleDislikeVehicle = (vehicleId: string) => {
    if (dislikedVehicles.includes(vehicleId)) {
      setDislikedVehicles(dislikedVehicles.filter(id => id !== vehicleId));
    } else {
      setDislikedVehicles([...dislikedVehicles, vehicleId]);
      setLikedVehicles(likedVehicles.filter(id => id !== vehicleId));
    }
  };
  
  // Render the current preference selection step
  const renderPreferenceStep = () => {
    const currentPreference = preferences[step];
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPreference.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-medium">{currentPreference.label}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentPreference.options.map(option => (
              <Button
                key={option.id}
                variant={currentPreference.value === option.value ? "default" : "outline"}
                className="justify-start h-auto py-3"
                onClick={() => handlePreferenceChange(currentPreference.id, option.value)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {option.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{option.label}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              disabled={step === 0}
            >
              Back
            </Button>
            <Button 
              onClick={handleNextStep}
              disabled={currentPreference.value === null}
            >
              {step === preferences.length - 1 ? 'Get Recommendations' : 'Next'}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };
  
  // Render the loading state while generating recommendations
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <h3 className="text-lg font-medium mb-2">Generating Personalized Recommendations</h3>
      <p className="text-muted-foreground text-center max-w-md">
        Our AI is analyzing your preferences to find the perfect vehicle matches for you.
      </p>
    </div>
  );
  
  // Render the recommendations list
  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Your Personalized Recommendations</h3>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Start Over
        </Button>
      </div>
      
      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="py-8 flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Matches Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              We couldn't find any vehicles that match your specific preferences. Try adjusting your criteria.
            </p>
            <Button className="mt-4" onClick={handleReset}>
              Adjust Preferences
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {recommendations.map(vehicle => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Vehicle Preview */}
                  <div className="md:col-span-3 bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex items-center justify-center">
                    <div className="text-6xl">{vehicle.thumbnail}</div>
                  </div>
                  
                  {/* Vehicle Info */}
                  <div className="md:col-span-6 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold">
                          {vehicle.brand} {vehicle.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">{vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {vehicle.popular && (
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                            Popular
                          </Badge>
                        )}
                        {vehicle.new && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            New
                          </Badge>
                        )}
                        {vehicle.electric && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                            Electric
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Match Score:</span>
                        <span className="font-bold text-blue-600">{vehicle.matchScore}%</span>
                      </div>
                      <Progress value={vehicle.matchScore} className="h-2" />
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {vehicle.specs.engine && (
                        <div>
                          <span className="text-muted-foreground">Engine:</span> {vehicle.specs.engine}
                        </div>
                      )}
                      {vehicle.specs.power && (
                        <div>
                          <span className="text-muted-foreground">Power:</span> {vehicle.specs.power}
                        </div>
                      )}
                      {vehicle.specs.acceleration && (
                        <div>
                          <span className="text-muted-foreground">Acceleration:</span> {vehicle.specs.acceleration}
                        </div>
                      )}
                      {vehicle.specs.topSpeed && (
                        <div>
                          <span className="text-muted-foreground">Top Speed:</span> {vehicle.specs.topSpeed}
                        </div>
                      )}
                      {vehicle.specs.range && (
                        <div>
                          <span className="text-muted-foreground">Range:</span> {vehicle.specs.range}
                        </div>
                      )}
                      {vehicle.specs.fuelConsumption && (
                        <div>
                          <span className="text-muted-foreground">Fuel Economy:</span> {vehicle.specs.fuelConsumption}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-1">
                      {vehicle.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-slate-100">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price and Actions */}
                  <div className="md:col-span-3 p-4 border-t md:border-t-0 md:border-l bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="text-lg font-bold text-center">
                        {formatPrice(vehicle.price)}
                      </div>
                      <div className="text-xs text-center text-muted-foreground mb-4">
                        Ex-showroom price
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          onClick={() => onSelectVehicle(vehicle)}
                          className="w-full"
                        >
                          Select Vehicle
                        </Button>
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className={`h-9 w-9 rounded-full ${likedVehicles.includes(vehicle.id) ? 'bg-green-100 text-green-800 border-green-300' : ''}`}
                            onClick={() => handleLikeVehicle(vehicle.id)}
                            title="Like this recommendation"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className={`h-9 w-9 rounded-full ${dislikedVehicles.includes(vehicle.id) ? 'bg-red-100 text-red-800 border-red-300' : ''}`}
                            onClick={() => handleDislikeVehicle(vehicle.id)}
                            title="Dislike this recommendation"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            title="Save to favorites"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs">
                      {vehicle.pros.length > 0 && (
                        <div className="mb-2">
                          <div className="font-medium text-green-600 mb-1">Pros:</div>
                          <ul className="pl-4 list-disc">
                            {vehicle.pros.map((pro, idx) => (
                              <li key={idx}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {vehicle.cons.length > 0 && (
                        <div>
                          <div className="font-medium text-red-600 mb-1">Cons:</div>
                          <ul className="pl-4 list-disc">
                            {vehicle.cons.map((con, idx) => (
                              <li key={idx}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vehicle Recommendation Engine</CardTitle>
        <CardDescription>Tell us your preferences to get personalized vehicle recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        {!complete ? (
          loading ? renderLoading() : renderPreferenceStep()
        ) : (
          renderRecommendations()
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationEngine;