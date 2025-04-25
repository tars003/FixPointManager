import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ChevronRight, Send, User, MapPin, Calendar, DollarSign, Settings, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface VehicleAdvisorProps {
  className?: string;
}

type QuestionStep = 
  | 'initial' 
  | 'primary-user' 
  | 'vehicle-type' 
  | 'usage-pattern' 
  | 'budget' 
  | 'feature-priorities' 
  | 'timeline-location' 
  | 'recommendations' 
  | 'report';

interface UserPreferences {
  primaryUser: {
    type: string;
    age: number;
    details?: string;
  };
  vehicleType: string[];
  usagePattern: {
    primary: string;
    distance: number;
  };
  budget: {
    range: [number, number];
    financingPreference: 'purchase' | 'lease' | 'finance';
  };
  featurePriorities: Record<string, number>;
  timeline: string;
  location: string;
  serviceProximity: number;
}

const VehicleAdvisor: React.FC<VehicleAdvisorProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<QuestionStep>('initial');
  const [preferences, setPreferences] = useState<UserPreferences>({
    primaryUser: { type: '', age: 30, details: '' },
    vehicleType: [],
    usagePattern: { primary: '', distance: 50 },
    budget: { range: [500000, 1500000], financingPreference: 'purchase' },
    featurePriorities: {
      'Fuel Efficiency': 3,
      'Performance': 3,
      'Space/Capacity': 3,
      'Safety Features': 3,
      'Technology': 3,
      'Comfort': 3,
      'Environmental Impact': 3
    },
    timeline: '',
    location: '',
    serviceProximity: 3
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const fabVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  const pulseAnimation = {
    initial: { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' },
    pulse: {
      boxShadow: [
        '0 0 0 0 rgba(59, 130, 246, 0)',
        '0 0 0 10px rgba(59, 130, 246, 0.2)',
        '0 0 0 20px rgba(59, 130, 246, 0)',
      ],
      transition: {
        repeat: Infinity,
        duration: 2
      }
    }
  };

  const toggleAdvisor = () => {
    setIsOpen(!isOpen);
  };

  const handleNext = () => {
    const steps: QuestionStep[] = [
      'initial',
      'primary-user',
      'vehicle-type',
      'usage-pattern',
      'budget',
      'feature-priorities',
      'timeline-location',
      'recommendations',
      'report'
    ];

    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: QuestionStep[] = [
      'initial',
      'primary-user',
      'vehicle-type',
      'usage-pattern',
      'budget',
      'feature-priorities',
      'timeline-location',
      'recommendations',
      'report'
    ];

    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const resetAdvisor = () => {
    setCurrentStep('initial');
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'initial':
        return (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Vehicle Advisor</h3>
            <p className="text-sm text-muted-foreground mb-6">
              I'll help you find your perfect vehicle. Let's start with a few questions...
            </p>
            <Button onClick={handleNext} className="w-full">
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 'primary-user':
        return (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">Who will primarily be using this vehicle?</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {['Self', 'Spouse', 'Parent', 'Child (16+)', 'Family', 'Business'].map((user) => (
                <Button
                  key={user}
                  variant={preferences.primaryUser.type === user ? "default" : "outline"}
                  className="flex flex-col py-3 h-auto"
                  onClick={() => updatePreference('primaryUser', {
                    ...preferences.primaryUser,
                    type: user
                  })}
                >
                  <User className="h-5 w-5 mb-1" />
                  <span className="text-xs">{user}</span>
                </Button>
              ))}
            </div>
            
            <div className="mb-6">
              <Label className="text-sm mb-2 block">Age Range</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm">16</span>
                <Slider
                  value={[preferences.primaryUser.age]}
                  min={16}
                  max={80}
                  step={1}
                  onValueChange={(value) => updatePreference('primaryUser', {
                    ...preferences.primaryUser,
                    age: value[0]
                  })}
                  className="flex-1"
                />
                <span className="text-sm">80+</span>
              </div>
              <div className="text-center mt-1">
                <Badge variant="outline">{preferences.primaryUser.age} years</Badge>
              </div>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="userDetails" className="text-sm mb-2 block">Optional Details</Label>
              <Textarea
                id="userDetails"
                placeholder="Any specific requirements or preferences..."
                value={preferences.primaryUser.details}
                onChange={(e) => updatePreference('primaryUser', {
                  ...preferences.primaryUser,
                  details: e.target.value
                })}
                className="resize-none"
              />
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        );

      case 'vehicle-type':
        return (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">What type of vehicle are you interested in?</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Two-Wheeler', icon: '🏍️' },
                { label: 'Three-Wheeler', icon: '🛺' },
                { label: 'Four-Wheeler', icon: '🚗' },
                { label: 'Truck', icon: '🚚' },
                { label: 'Commercial', icon: '🚐' },
                { label: 'Bus', icon: '🚌' },
                { label: 'Tractor', icon: '🚜' },
                { label: 'Construction', icon: '🏗️' }
              ].map((vehicle) => (
                <div
                  key={vehicle.label}
                  className={`
                    border rounded-lg p-3 flex flex-col items-center cursor-pointer
                    ${preferences.vehicleType.includes(vehicle.label) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                  `}
                  onClick={() => {
                    const updatedTypes = preferences.vehicleType.includes(vehicle.label)
                      ? preferences.vehicleType.filter(type => type !== vehicle.label)
                      : [...preferences.vehicleType, vehicle.label];
                    updatePreference('vehicleType', updatedTypes);
                  }}
                >
                  <span className="text-3xl mb-2">{vehicle.icon}</span>
                  <span className="text-sm font-medium">{vehicle.label}</span>
                  <div className="mt-2">
                    <Checkbox
                      checked={preferences.vehicleType.includes(vehicle.label)}
                      onCheckedChange={() => {
                        const updatedTypes = preferences.vehicleType.includes(vehicle.label)
                          ? preferences.vehicleType.filter(type => type !== vehicle.label)
                          : [...preferences.vehicleType, vehicle.label];
                        updatePreference('vehicleType', updatedTypes);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={preferences.vehicleType.length === 0}>Next</Button>
            </div>
          </div>
        );

      case 'usage-pattern':
        return (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">How will this vehicle primarily be used?</h3>
            
            <RadioGroup
              value={preferences.usagePattern.primary}
              onValueChange={(value) => updatePreference('usagePattern', {
                ...preferences.usagePattern,
                primary: value
              })}
              className="gap-3 mb-6"
            >
              {[
                'Daily commute',
                'Weekend leisure',
                'Family transport',
                'Long-distance travel',
                'Off-road/adventure',
                'Commercial use',
                'Agriculture',
                'Construction'
              ].map((usage) => (
                <div key={usage} className="flex items-center space-x-2">
                  <RadioGroupItem value={usage} id={usage.replace(/\s+/g, '-').toLowerCase()} />
                  <Label htmlFor={usage.replace(/\s+/g, '-').toLowerCase()}>{usage}</Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="mb-6">
              <Label className="text-sm mb-2 block">Estimated distance per day (km)</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm">10</span>
                <Slider
                  value={[preferences.usagePattern.distance]}
                  min={10}
                  max={200}
                  step={5}
                  onValueChange={(value) => updatePreference('usagePattern', {
                    ...preferences.usagePattern,
                    distance: value[0]
                  })}
                  className="flex-1"
                />
                <span className="text-sm">200+</span>
              </div>
              <div className="text-center mt-1">
                <Badge variant="outline">{preferences.usagePattern.distance} km/day</Badge>
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={!preferences.usagePattern.primary}>Next</Button>
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">What's your budget range?</h3>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm">₹{(preferences.budget.range[0]/100000).toFixed(1)} Lakh</span>
                <span className="text-sm">₹{(preferences.budget.range[1]/100000).toFixed(1)} Lakh</span>
              </div>
              <Slider
                value={[preferences.budget.range[0], preferences.budget.range[1]]}
                min={100000}
                max={5000000}
                step={50000}
                onValueChange={(value) => updatePreference('budget', {
                  ...preferences.budget,
                  range: [value[0], value[1]]
                })}
                className="mb-6"
              />
              <div className="text-center">
                <Badge variant="outline">
                  ₹{(preferences.budget.range[0]/100000).toFixed(1)} - ₹{(preferences.budget.range[1]/100000).toFixed(1)} Lakh
                </Badge>
              </div>
            </div>
            
            <div className="mb-6">
              <Label className="text-sm mb-2 block">Financing Preference</Label>
              <div className="flex gap-2">
                {['purchase', 'lease', 'finance'].map((option) => (
                  <Button
                    key={option}
                    variant={preferences.budget.financingPreference === option ? "default" : "outline"}
                    className="flex-1 capitalize"
                    onClick={() => updatePreference('budget', {
                      ...preferences.budget,
                      financingPreference: option as 'purchase' | 'lease' | 'finance'
                    })}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        );

      case 'feature-priorities':
        return (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">Rank these features by importance to you</h3>
            
            <div className="space-y-4 mb-6">
              {Object.keys(preferences.featurePriorities).map((feature) => (
                <div key={feature} className="space-y-1">
                  <div className="flex justify-between">
                    <Label className="text-sm">{feature}</Label>
                    <span className="text-sm text-muted-foreground">
                      {preferences.featurePriorities[feature]} / 5
                    </span>
                  </div>
                  <Slider
                    value={[preferences.featurePriorities[feature]]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(value) => {
                      const updatedPriorities = {
                        ...preferences.featurePriorities,
                        [feature]: value[0]
                      };
                      updatePreference('featurePriorities', updatedPriorities);
                    }}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        );

      case 'timeline-location':
        return (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">When and where are you planning to purchase?</h3>
            
            <div className="mb-6">
              <Label className="text-sm mb-2 block">Purchase Timeline</Label>
              <RadioGroup
                value={preferences.timeline}
                onValueChange={(value) => updatePreference('timeline', value)}
                className="gap-3"
              >
                {['Immediate', '1-3 months', '3-6 months', '6+ months'].map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <RadioGroupItem value={time} id={time.replace(/\s+/g, '-').toLowerCase()} />
                    <Label htmlFor={time.replace(/\s+/g, '-').toLowerCase()}>{time}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="location" className="text-sm mb-2 block">Your Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="City, state or pincode"
                  value={preferences.location}
                  onChange={(e) => updatePreference('location', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <Label className="text-sm mb-2 block">Service Center Proximity Importance (1-5)</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm">Low</span>
                <Slider
                  value={[preferences.serviceProximity]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => updatePreference('serviceProximity', value[0])}
                  className="flex-1"
                />
                <span className="text-sm">High</span>
              </div>
              <div className="text-center mt-1">
                <Badge variant="outline">Importance: {preferences.serviceProximity}</Badge>
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button 
                onClick={handleNext} 
                disabled={!preferences.timeline || !preferences.location}
              >
                Get Recommendations
              </Button>
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">Based on your preferences, here are my top recommendations:</h3>
            
            <ScrollArea className="h-[300px] pr-4 mb-6">
              <div className="space-y-4">
                {[
                  {
                    name: 'Honda City',
                    type: 'Sedan',
                    price: '₹12.5 - 15.8 Lakh',
                    image: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?q=80&w=200',
                    match: 95,
                    fuelType: 'Petrol/Hybrid'
                  },
                  {
                    name: 'Tata Nexon',
                    type: 'SUV',
                    price: '₹8.1 - 13.5 Lakh',
                    image: 'https://images.unsplash.com/photo-1609679975088-bcb459448956?q=80&w=200',
                    match: 92,
                    fuelType: 'Petrol/Diesel/EV'
                  },
                  {
                    name: 'Maruti Suzuki Swift',
                    type: 'Hatchback',
                    price: '₹6.5 - 9.6 Lakh',
                    image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=200',
                    match: 88,
                    fuelType: 'Petrol/CNG'
                  },
                  {
                    name: 'Mahindra XUV700',
                    type: 'SUV',
                    price: '₹14.1 - 24.6 Lakh',
                    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=200',
                    match: 85,
                    fuelType: 'Petrol/Diesel'
                  },
                  {
                    name: 'Kia Sonet',
                    type: 'Compact SUV',
                    price: '₹7.9 - 13.7 Lakh',
                    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=200',
                    match: 82,
                    fuelType: 'Petrol/Diesel'
                  }
                ].map((vehicle, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="flex">
                      <div 
                        className="w-24 h-24 bg-center bg-cover" 
                        style={{ backgroundImage: `url(${vehicle.image})` }}
                      />
                      <div className="p-3 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{vehicle.name}</h4>
                            <p className="text-xs text-muted-foreground">{vehicle.type} • {vehicle.fuelType}</p>
                          </div>
                          <Badge className="bg-green-500">{vehicle.match}%</Badge>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs font-medium">{vehicle.price}</span>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            
            <Button 
              className="w-full mb-4" 
              variant="outline"
            >
              Add All to Comparison
            </Button>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>View Detailed Report</Button>
            </div>
          </div>
        );

      case 'report':
        return (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-4">Your Personalized Vehicle Report</h3>
            
            <Tabs defaultValue="overview" className="mb-6">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="costs">Costs</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="location">Nearby</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Top Recommendation</h4>
                  <Card className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        <Settings className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h5 className="font-medium">Honda City</h5>
                        <p className="text-xs text-muted-foreground">
                          Best match for your daily commute and feature priorities
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Match Analysis</h4>
                  <Card className="p-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Budget Alignment</span>
                        <span className="font-medium">Excellent</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '90%' }} />
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span>Feature Match</span>
                        <span className="font-medium">Very Good</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span>Usage Suitability</span>
                        <span className="font-medium">Excellent</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="costs" className="space-y-4">
                <Card className="p-3">
                  <h4 className="text-sm font-medium mb-2">Total Cost of Ownership (5 Years)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Purchase Price</span>
                      <span className="text-xs font-medium">₹12,50,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Fuel Costs</span>
                      <span className="text-xs font-medium">₹3,25,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Maintenance</span>
                      <span className="text-xs font-medium">₹1,15,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Insurance</span>
                      <span className="text-xs font-medium">₹85,000</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-sm font-bold">₹17,75,000</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-3">
                  <h4 className="text-sm font-medium mb-2">Monthly Payment Estimate</h4>
                  <div className="text-center py-3">
                    <span className="text-2xl font-bold">₹22,500</span>
                    <p className="text-xs text-muted-foreground mt-1">Based on 7.5% interest over 60 months</p>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4">
                <Card className="p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">Feature Highlights</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs flex justify-between">
                      <span>Fuel Efficiency</span>
                      <span className="font-medium">19.5 km/l</span>
                    </div>
                    <div className="text-xs flex justify-between">
                      <span>Engine Power</span>
                      <span className="font-medium">119 bhp</span>
                    </div>
                    <div className="text-xs flex justify-between">
                      <span>Safety Rating</span>
                      <span className="font-medium">5 Star NCAP</span>
                    </div>
                    <div className="text-xs flex justify-between">
                      <span>Boot Space</span>
                      <span className="font-medium">506 liters</span>
                    </div>
                    <div className="text-xs flex justify-between">
                      <span>Infotainment</span>
                      <span className="font-medium">8" Touchscreen</span>
                    </div>
                  </div>
                </Card>
                
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-primary/10">Sunroof</Badge>
                  <Badge variant="outline" className="bg-primary/10">Wireless Charging</Badge>
                  <Badge variant="outline" className="bg-primary/10">6 Airbags</Badge>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="space-y-4">
                <Card className="p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">Nearby Dealerships</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-xs border-b pb-2">
                      <div className="font-medium">Honda City Centre</div>
                      <div className="text-muted-foreground">5.2 km away • ⭐ 4.7 (230 reviews)</div>
                      <div className="mt-1">MG Road, Bengaluru</div>
                    </div>
                    
                    <div className="text-xs border-b pb-2">
                      <div className="font-medium">Magnum Honda</div>
                      <div className="text-muted-foreground">7.8 km away • ⭐ 4.5 (185 reviews)</div>
                      <div className="mt-1">Whitefield, Bengaluru</div>
                    </div>
                    
                    <div className="text-xs">
                      <div className="font-medium">Pride Honda</div>
                      <div className="text-muted-foreground">12.3 km away • ⭐ 4.3 (134 reviews)</div>
                      <div className="mt-1">Electronic City, Bengaluru</div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button variant="outline" className="text-xs h-9">
                <Calendar className="h-3 w-3 mr-1" /> Schedule Test Drive
              </Button>
              <Button variant="outline" className="text-xs h-9">
                <DollarSign className="h-3 w-3 mr-1" /> Financing Options
              </Button>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button variant="outline" onClick={resetAdvisor}>Start Over</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {/* Floating button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg z-50"
        onClick={toggleAdvisor}
        variants={fabVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        animate={isOpen ? 'rest' : 'pulse'}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <motion.div
            className="w-full h-full rounded-full flex items-center justify-center"
            variants={pulseAnimation}
            initial="initial"
            animate="pulse"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.div>
        )}
      </motion.button>

      {/* Advisor Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-background rounded-lg shadow-xl z-40 border overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-2 pt-3 px-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Vehicle Advisor</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={toggleAdvisor}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4">
                {renderStepContent()}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleAdvisor;