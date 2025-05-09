import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Fuel, 
  Coffee, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save, 
  Share2, 
  Info,
  FileText,
  Car,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { useToast } from '@/hooks/use-toast';

interface Destination {
  id: number;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

interface TripEstimate {
  distance: string;
  duration: string;
  fuelCost: string;
  tollCost: string;
  totalCost: string;
}

interface SavedTrip {
  id: number;
  name: string;
  date: string;
  origin: string;
  destination: string;
  stops: number;
  distance: string;
}

const TripPlanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [destinations, setDestinations] = useState<Destination[]>([
    { id: 1, name: 'Home', address: 'M.G. Road, Bangalore' },
    { id: 2, name: 'Office', address: 'Electronic City, Bangalore' }
  ]);
  const [vehicleType, setVehicleType] = useState('car');
  const [showTolls, setShowTolls] = useState(true);
  const [avoidHighways, setAvoidHighways] = useState(false);
  const [estimate, setEstimate] = useState<TripEstimate>({
    distance: '22.5 km',
    duration: '45 min',
    fuelCost: '₹180',
    tollCost: '₹65',
    totalCost: '₹245'
  });
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([
    { 
      id: 1, 
      name: 'Weekend Getaway', 
      date: '10 May 2025', 
      origin: 'Bangalore', 
      destination: 'Mysore', 
      stops: 2, 
      distance: '150 km' 
    },
    { 
      id: 2, 
      name: 'Office Commute', 
      date: '08 May 2025', 
      origin: 'Home', 
      destination: 'Office', 
      stops: 0, 
      distance: '22.5 km' 
    },
    { 
      id: 3, 
      name: 'Shopping Trip', 
      date: '05 May 2025', 
      origin: 'Home', 
      destination: 'Phoenix Mall', 
      stops: 1, 
      distance: '15 km' 
    }
  ]);
  
  const { toast } = useToast();
  
  const addDestination = () => {
    const newId = destinations.length > 0 ? Math.max(...destinations.map(d => d.id)) + 1 : 1;
    setDestinations([...destinations, { id: newId, name: '', address: '' }]);
  };
  
  const removeDestination = (id: number) => {
    if (destinations.length <= 2) {
      toast({
        title: "Cannot remove destination",
        description: "A trip must have at least an origin and a destination.",
        variant: "destructive"
      });
      return;
    }
    setDestinations(destinations.filter(dest => dest.id !== id));
  };
  
  const updateDestination = (id: number, field: keyof Destination, value: string) => {
    setDestinations(destinations.map(dest => 
      dest.id === id ? { ...dest, [field]: value } : dest
    ));
  };
  
  const calculateTrip = () => {
    // This would be an API call in a real app
    // For demo purposes, we'll just show a toast
    toast({
      title: "Trip calculated",
      description: "Route optimized based on selected preferences.",
    });
    
    // In a real app, this would update based on the API response
    setEstimate({
      distance: '22.5 km',
      duration: '45 min',
      fuelCost: '₹180',
      tollCost: showTolls ? '₹65' : '₹0',
      totalCost: showTolls ? '₹245' : '₹180'
    });
  };
  
  const saveTrip = () => {
    toast({
      title: "Trip saved",
      description: "Your trip has been saved successfully.",
    });
  };
  
  const shareTrip = () => {
    toast({
      title: "Share link copied",
      description: "Share link has been copied to clipboard.",
    });
  };
  
  const resetForm = () => {
    setDestinations([
      { id: 1, name: '', address: '' },
      { id: 2, name: '', address: '' }
    ]);
    setVehicleType('car');
    setShowTolls(true);
    setAvoidHighways(false);
    toast({
      title: "Form reset",
      description: "All fields have been cleared.",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <PageHeader 
        title="Trip Planner" 
        description="Plan your journey, calculate fuel costs, and save routes for future trips."
        icon={<Navigation className="h-6 w-6 text-teal-500" />}
      />
      
      <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="new">New Trip</TabsTrigger>
          <TabsTrigger value="saved">Saved Trips</TabsTrigger>
          <TabsTrigger value="history">Trip History</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          {/* Trip Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trip Details</CardTitle>
                  <CardDescription>Enter your journey details to calculate the best route</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {destinations.map((dest, index) => (
                    <div key={dest.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-teal-500" />
                        <Label className="text-base font-medium">
                          {index === 0 ? 'Origin' : index === destinations.length - 1 ? 'Destination' : `Stop ${index}`}
                        </Label>
                        {index > 0 && index < destinations.length - 1 && (
                          <Badge variant="outline" className="ml-auto">Stop {index}</Badge>
                        )}
                        {destinations.length > 2 && index > 0 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeDestination(dest.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input 
                          placeholder="Location name" 
                          value={dest.name} 
                          onChange={(e) => updateDestination(dest.id, 'name', e.target.value)}
                        />
                        <Input 
                          placeholder="Full address" 
                          value={dest.address} 
                          onChange={(e) => updateDestination(dest.id, 'address', e.target.value)}
                        />
                      </div>
                      {index < destinations.length - 1 && (
                        <div className="flex items-center gap-2 ml-6">
                          <div className="h-6 border-l-2 border-dashed border-teal-500"></div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <Button variant="outline" onClick={addDestination} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stop
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetForm}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={calculateTrip}>
                    Calculate Trip
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Trip Options</CardTitle>
                  <CardDescription>Customize your trip preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vehicle Type</Label>
                      <Select value={vehicleType} onValueChange={setVehicleType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="truck">Truck</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Fuel Type</Label>
                      <Select defaultValue="petrol">
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="cng">CNG</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="show-tolls" 
                      checked={showTolls} 
                      onCheckedChange={setShowTolls} 
                    />
                    <Label htmlFor="show-tolls">Include toll charges</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="avoid-highways" 
                      checked={avoidHighways} 
                      onCheckedChange={setAvoidHighways} 
                    />
                    <Label htmlFor="avoid-highways">Avoid highways</Label>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Points of Interest</CardTitle>
                  <CardDescription>Find facilities along your route</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">
                      <Fuel className="h-3 w-3 mr-1" />
                      Fuel Stations
                    </Badge>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer">
                      <Coffee className="h-3 w-3 mr-1" />
                      Food & Beverages
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer">
                      <FileText className="h-3 w-3 mr-1" />
                      ATMs
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer">
                      <Car className="h-3 w-3 mr-1" />
                      Service Centers
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 space-y-6">
              <Card className="bg-teal-50 border-teal-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Navigation className="h-5 w-5 mr-2 text-teal-600" />
                    Trip Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {destinations.length >= 2 && (
                    <>
                      <div>
                        <span className="text-sm text-gray-500">From</span>
                        <p className="font-medium">{destinations[0].name || 'Starting Point'}</p>
                      </div>
                      
                      {destinations.length > 2 && (
                        <div>
                          <span className="text-sm text-gray-500">Via</span>
                          <p className="font-medium">{destinations.length - 2} stops</p>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-sm text-gray-500">To</span>
                        <p className="font-medium">{destinations[destinations.length - 1].name || 'Destination'}</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <Navigation className="h-4 w-4 mr-1" />
                            <span className="text-sm">Distance</span>
                          </div>
                          <p className="font-semibold">{estimate.distance}</p>
                        </div>
                        <div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">Duration</span>
                          </div>
                          <p className="font-semibold">{estimate.duration}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <span className="text-sm text-gray-500">Cost Breakdown</span>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <span>Fuel cost</span>
                            <span className="font-medium">{estimate.fuelCost}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Toll charges</span>
                            <span className="font-medium">{estimate.tollCost}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span>Total estimated cost</span>
                            <span>{estimate.totalCost}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={shareTrip}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button onClick={saveTrip}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Trip
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Travel Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm">Check your vehicle's tire pressure before a long journey for better fuel efficiency.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm">Keep an emergency kit in your vehicle with first aid supplies, water, and basic tools.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm">Take regular breaks during long journeys - rest every 2 hours for at least 15 minutes.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedTrips.map(trip => (
              <Card key={trip.id} className="overflow-hidden">
                <div className="h-2 bg-teal-500"></div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{trip.name}</CardTitle>
                    <Badge variant="outline">{trip.date}</Badge>
                  </div>
                  <CardDescription>
                    Total distance: {trip.distance}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-teal-100 p-1 rounded-full">
                        <MapPin className="h-4 w-4 text-teal-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="font-medium">{trip.origin}</p>
                      </div>
                    </div>
                    
                    {trip.stops > 0 && (
                      <div className="flex items-center gap-2 ml-2.5">
                        <div className="h-6 border-l-2 border-dashed border-teal-300"></div>
                        <Badge variant="outline" className="ml-1">{trip.stops} stops</Badge>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <div className="bg-red-100 p-1 rounded-full">
                        <MapPin className="h-4 w-4 text-red-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">To</p>
                        <p className="font-medium">{trip.destination}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button variant="link" className="ml-auto">
                    Load Trip
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip History</CardTitle>
              <CardDescription>View your recent trips and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedTrips.map(trip => (
                  <div key={trip.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{trip.name}</h3>
                        <p className="text-sm text-gray-500">{trip.date}</p>
                      </div>
                      <Badge>{trip.distance}</Badge>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-gray-600">{trip.origin}</span>
                      <ArrowRight className="h-3 w-3 mx-2 text-gray-400" />
                      <span className="text-gray-600">{trip.destination}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripPlanner;