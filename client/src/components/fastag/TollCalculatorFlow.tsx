import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  Navigation,
  X,
  ArrowLeft,
  Share2,
  Download,
  Info,
  ArrowRight,
  Route,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Route selection schema
const routeSchema = z.object({
  startPoint: z.string().min(3, { message: 'Please enter a valid starting point' }),
  destination: z.string().min(3, { message: 'Please enter a valid destination' }),
  vehicleType: z.string().min(1, { message: 'Please select a vehicle type' }),
});

type RouteFormValues = z.infer<typeof routeSchema>;

// Vehicle types
const vehicleTypes = [
  { value: 'car', label: 'Car/Jeep/Van' },
  { value: 'lcv', label: 'Light Commercial Vehicle' },
  { value: 'bus', label: 'Bus/Truck' },
  { value: 'heavy', label: 'Heavy Vehicle' },
  { value: 'multi', label: 'Multi-Axle Vehicle' },
];

// Mock toll plaza data for routes
const mockRouteData = {
  route1: {
    totalDistance: 235,
    estimatedTime: '3h 15m',
    tollPlazas: [
      { id: 'tp1', name: 'Kherki Daula Toll Plaza', amount: 65, location: 'NH-48, Gurugram' },
      { id: 'tp2', name: 'Kosi Kalan Toll Plaza', amount: 90, location: 'NH-19, Kosi Kalan' },
      { id: 'tp3', name: 'Runakta Toll Plaza', amount: 75, location: 'NH-19, Agra' },
    ],
    totalToll: 230,
  },
  route2: {
    totalDistance: 282,
    estimatedTime: '4h 05m',
    tollPlazas: [
      { id: 'tp4', name: 'Mahuvan Toll Plaza', amount: 60, location: 'NH-91, Mathura' },
      { id: 'tp5', name: 'Chamari Toll Plaza', amount: 85, location: 'NH-91, Etmadpur' },
    ],
    totalToll: 145,
  },
  route3: {
    totalDistance: 310,
    estimatedTime: '4h 45m',
    tollPlazas: [
      { id: 'tp6', name: 'Deedwana Toll Plaza', amount: 95, location: 'NH-709A, Didwana' },
      { id: 'tp7', name: 'Shahpura Toll Plaza', amount: 75, location: 'NH-148D, Shahpura' },
    ],
    totalToll: 170,
  },
};

interface TollCalculatorFlowProps {
  onClose: () => void;
}

const TollCalculatorFlow: React.FC<TollCalculatorFlowProps> = ({ onClose }) => {
  const [step, setStep] = useState<'route' | 'results'>('route');
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<'route1' | 'route2' | 'route3'>('route1');
  const [formData, setFormData] = useState<RouteFormValues | null>(null);

  // Route form
  const routeForm = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      startPoint: '',
      destination: '',
      vehicleType: 'car',
    },
  });

  // Handle route form submission
  const onRouteSubmit = (values: RouteFormValues) => {
    setFormData(values);
    setIsCalculating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsCalculating(false);
      setStep('results');
      
      toast({
        title: 'Route calculated',
        description: 'Showing toll details for your journey',
      });
    }, 2000);
  };

  // Share route details
  const handleShareRoute = () => {
    toast({
      title: 'Share route',
      description: 'Route details copied to clipboard',
    });
  };

  // Download route details
  const handleDownloadRoute = () => {
    toast({
      title: 'Download route',
      description: 'Route details downloaded as PDF',
    });
  };

  // Select a route
  const handleSelectRoute = (route: 'route1' | 'route2' | 'route3') => {
    setSelectedRoute(route);
    
    toast({
      title: 'Route selected',
      description: `Showing details for ${
        route === 'route1' ? 'fastest' : 
        route === 'route2' ? 'alternative' : 'scenic'
      } route`,
    });
  };

  // Get current route data
  const currentRouteData = mockRouteData[selectedRoute];

  // Apply vehicle type multiplier
  const getVehicleMultiplier = (type: string) => {
    switch (type) {
      case 'car': return 1;
      case 'lcv': return 1.5;
      case 'bus': return 2;
      case 'heavy': return 2.5;
      case 'multi': return 3;
      default: return 1;
    }
  };

  // Calculate adjusted toll based on vehicle type
  const calculateAdjustedToll = (baseAmount: number) => {
    const multiplier = formData ? getVehicleMultiplier(formData.vehicleType) : 1;
    return Math.round(baseAmount * multiplier);
  };

  // Calculate total toll
  const totalToll = calculateAdjustedToll(currentRouteData.totalToll);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              {step === 'results' && (
                <Button variant="ghost" size="icon" onClick={() => setStep('route')}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-bold">
                {step === 'route' && 'Toll Calculator'}
                {step === 'results' && 'Toll Calculation Results'}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Route Selection */}
          {step === 'route' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <p className="text-sm text-gray-500 mb-6">
                Enter your starting point and destination to calculate toll charges for your journey.
              </p>
              
              <Form {...routeForm}>
                <form onSubmit={routeForm.handleSubmit(onRouteSubmit)} className="space-y-6">
                  <div className="flex items-center">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-primary bg-white flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="h-12 w-0.5 bg-gray-200 my-1"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                        <Navigation className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <FormField
                        control={routeForm.control}
                        name="startPoint"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Starting Point</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input placeholder="Enter starting location" {...field} />
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                  onClick={() => {
                                    // Simulate current location
                                    field.onChange('Current Location');
                                    toast({
                                      title: 'Using current location',
                                      description: 'GPS coordinates fetched successfully',
                                    });
                                  }}
                                >
                                  <MapPin className="h-4 w-4 text-primary" />
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={routeForm.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter destination" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <FormField
                    control={routeForm.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicleTypes.map((vehicleType) => (
                              <SelectItem key={vehicleType.value} value={vehicleType.value}>
                                {vehicleType.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isCalculating}
                    >
                      {isCalculating ? 'Calculating...' : 'Calculate Toll'}
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <p>
                        Toll calculations are approximate and subject to change. Actual toll charges may vary based on time of travel, vehicle axle count, and payment method. For the most accurate information, please check with the respective toll authorities.
                      </p>
                    </div>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
          
          {/* Results */}
          {step === 'results' && formData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Map View Placeholder */}
              <div className="h-44 bg-blue-50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Route className="h-8 w-8 text-blue-300" />
                  <span className="text-blue-400 font-medium ml-2">Map View</span>
                </div>
                <div className="absolute inset-0 border-b border-blue-100"></div>
              </div>
              
              <div className="p-6">
                {/* Route Summary */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold">{formData.startPoint} to {formData.destination}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>{currentRouteData.totalDistance} km</span>
                      <span>•</span>
                      <span>{currentRouteData.estimatedTime}</span>
                      <span>•</span>
                      <span>{vehicleTypes.find(vt => vt.value === formData.vehicleType)?.label}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Total Toll</div>
                      <div className="text-2xl font-bold text-primary">₹{totalToll}</div>
                    </div>
                  </div>
                </div>
                
                {/* Route Options */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div 
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      selectedRoute === 'route1' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-400'
                    }`}
                    onClick={() => handleSelectRoute('route1')}
                  >
                    <div className="font-medium">Fastest</div>
                    <div className="text-sm text-gray-500">{mockRouteData.route1.totalDistance} km</div>
                    <div className="text-sm font-medium mt-1">₹{calculateAdjustedToll(mockRouteData.route1.totalToll)}</div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      selectedRoute === 'route2' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-400'
                    }`}
                    onClick={() => handleSelectRoute('route2')}
                  >
                    <div className="font-medium">Alternative</div>
                    <div className="text-sm text-gray-500">{mockRouteData.route2.totalDistance} km</div>
                    <div className="text-sm font-medium mt-1">₹{calculateAdjustedToll(mockRouteData.route2.totalToll)}</div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      selectedRoute === 'route3' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-400'
                    }`}
                    onClick={() => handleSelectRoute('route3')}
                  >
                    <div className="font-medium">Scenic</div>
                    <div className="text-sm text-gray-500">{mockRouteData.route3.totalDistance} km</div>
                    <div className="text-sm font-medium mt-1">₹{calculateAdjustedToll(mockRouteData.route3.totalToll)}</div>
                  </div>
                </div>
                
                {/* Toll Plazas */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Toll Plazas on Your Route</h3>
                  
                  <div className="space-y-3">
                    {currentRouteData.tollPlazas.map((plaza, index) => (
                      <div key={plaza.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-medium">{plaza.name}</h4>
                              <p className="text-xs text-gray-500">{plaza.location}</p>
                            </div>
                          </div>
                          <div className="font-bold">
                            ₹{calculateAdjustedToll(plaza.amount)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Journey Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-3">Journey Details</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Starting Point</span>
                      <span className="font-medium">{formData.startPoint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Destination</span>
                      <span className="font-medium">{formData.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Vehicle Type</span>
                      <span className="font-medium">{vehicleTypes.find(vt => vt.value === formData.vehicleType)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Distance</span>
                      <span className="font-medium">{currentRouteData.totalDistance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estimated Time</span>
                      <span className="font-medium">{currentRouteData.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Number of Toll Plazas</span>
                      <span className="font-medium">{currentRouteData.tollPlazas.length}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total Toll Amount</span>
                      <span>₹{totalToll}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep('route')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    New Calculation
                  </Button>
                  <Button className="flex-1" onClick={handleShareRoute}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Route
                  </Button>
                  <Button variant="secondary" onClick={handleDownloadRoute}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TollCalculatorFlow;