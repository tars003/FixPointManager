import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  MapPin, 
  Navigation, 
  Route, 
  Zap, 
  Clock, 
  ThumbsUp, 
  Droplet, 
  Wind, 
  AlertTriangle,
  PlusCircle,
  Map,
  Settings,
  Crown,
  Star,
  Brain
} from 'lucide-react';

interface RouteOption {
  id: string;
  name: string;
  distance: string;
  estimatedTime: string;
  fuelEfficiency: number;
  vehicleImpact: number;
  trafficLevel: 'Low' | 'Moderate' | 'High';
  roadCondition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  matchScore: number;
  preferenceMatch: {
    time: number;
    comfort: number;
    efficiency: number;
    vehicleHealth: number;
  };
  highlights: string[];
  warnings: string[];
}

const AIRouteRecommendation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('recommended');
  const [selectedRoute, setSelectedRoute] = useState<string>(routeOptions[0].id);
  
  const selectedRouteDetails = routeOptions.find(route => route.id === selectedRoute) || routeOptions[0];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-[#6366F1]" />
                AI Route Recommendation Engine
              </CardTitle>
              <CardDescription>
                Machine learning-powered route planning optimized for your vehicle
              </CardDescription>
            </div>
            <Badge className="bg-[#6366F1]">AI-Powered</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Origin-Destination Input (Mock UI) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Starting Point</p>
                    <p className="font-medium">Current Location</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Navigation className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="font-medium">Office, Connaught Place</p>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Departure: <span className="font-medium">Now</span></p>
                  <Button variant="outline" size="sm" className="h-8">Change</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#6366F1]/5 border-[#6366F1]/20">
              <CardContent className="p-4">
                <h3 className="font-medium text-[#6366F1] flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4" />
                  Personalized Route Factors
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Time Optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Fuel Efficiency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">Battery Health</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm">Smooth Driving</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <Button size="sm" className="w-full h-8 bg-[#6366F1] hover:bg-[#5253CC]">
                    Customize Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Route Options */}
          <Tabs defaultValue="recommended" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-3">
                {routeOptions.slice(0, 3).map((route) => (
                  <RouteOptionCard 
                    key={route.id}
                    route={route}
                    isSelected={selectedRoute === route.id}
                    onClick={() => setSelectedRoute(route.id)}
                  />
                ))}
              </div>
              
              <div className="md:col-span-2">
                <RouteDetailCard route={selectedRouteDetails} />
              </div>
            </div>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t px-6 py-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Route recommendations based on OBD data, traffic, and your preferences
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <Settings className="h-4 w-4" />
              Options
            </Button>
            <Button className="gap-1">
              <Map className="h-4 w-4" />
              Navigate
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

interface RouteOptionCardProps {
  route: RouteOption;
  isSelected: boolean;
  onClick: () => void;
}

const RouteOptionCard: React.FC<RouteOptionCardProps> = ({ route, isSelected, onClick }) => {
  return (
    <div 
      className={`border rounded-lg p-3 cursor-pointer transition-all ${
        isSelected 
          ? 'border-[#6366F1] bg-[#6366F1]/5 shadow-sm' 
          : 'hover:border-gray-400'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between mb-2">
        <h3 className="font-medium flex items-center gap-1.5">
          <Route className={`h-4 w-4 ${isSelected ? 'text-[#6366F1]' : 'text-gray-500'}`} />
          {route.name}
        </h3>
        {route.id === 'route1' && (
          <Badge className="bg-[#6366F1]">Best</Badge>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-gray-500" />
          <span>{route.estimatedTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Navigation className="h-3.5 w-3.5 text-gray-500" />
          <span>{route.distance}</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplet className="h-3.5 w-3.5 text-gray-500" />
          <span>{route.fuelEfficiency}% eff.</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-3.5 w-3.5 text-gray-500" />
          <span>{route.vehicleImpact}% impact</span>
        </div>
      </div>
      
      <div className="mt-2 flex items-center gap-2">
        <div 
          className={`h-2 flex-1 rounded-full bg-gray-100 overflow-hidden`}
        >
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-[#6366F1]" 
            style={{ width: `${route.matchScore}%` }}
          ></div>
        </div>
        <span className="text-xs">{route.matchScore}% match</span>
      </div>
    </div>
  );
};

interface RouteDetailCardProps {
  route: RouteOption;
}

const RouteDetailCard: React.FC<RouteDetailCardProps> = ({ route }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="aspect-video bg-muted rounded-md relative overflow-hidden mb-4">
          <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=28.644800,77.216721&zoom=12&size=600x400&path=color:0x6366F1|weight:5|28.631460,77.216880|28.634750,77.220500|28.642690,77.227960|28.651390,77.233090&key=AIzaSyCkxx')]
            bg-cover bg-center rounded-md opacity-90">
          </div>
          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs font-medium">
            Traffic: {route.trafficLevel}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="font-medium">{route.estimatedTime}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-muted-foreground">Distance</p>
            <p className="font-medium">{route.distance}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-muted-foreground">Road Condition</p>
            <p className="font-medium">{route.roadCondition}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-muted-foreground">AI Confidence</p>
            <p className="font-medium">{route.confidenceScore}%</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Preference Match</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Time</span>
                  <span>{route.preferenceMatch.time}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${route.preferenceMatch.time}%` }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Comfort</span>
                  <span>{route.preferenceMatch.comfort}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${route.preferenceMatch.comfort}%` }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Efficiency</span>
                  <span>{route.preferenceMatch.efficiency}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${route.preferenceMatch.efficiency}%` }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Vehicle</span>
                  <span>{route.preferenceMatch.vehicleHealth}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${route.preferenceMatch.vehicleHealth}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
                Highlights
              </h4>
              <ul className="text-sm space-y-1">
                {route.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-1.5">
                    <div className="h-4 w-4 mt-0.5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-green-700">✓</span>
                    </div>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Considerations
              </h4>
              <ul className="text-sm space-y-1">
                {route.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-1.5">
                    <div className="h-4 w-4 mt-0.5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-amber-700">!</span>
                    </div>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample data
const routeOptions: RouteOption[] = [
  {
    id: 'route1',
    name: 'Optimal Route',
    distance: '14.2 km',
    estimatedTime: '32 mins',
    fuelEfficiency: 94,
    vehicleImpact: 88,
    trafficLevel: 'Moderate',
    roadCondition: 'Good',
    confidenceScore: 92,
    matchScore: 95,
    preferenceMatch: {
      time: 85,
      comfort: 92,
      efficiency: 96,
      vehicleHealth: 91
    },
    highlights: [
      'Smooth roads minimize suspension wear',
      'Well-timed traffic signals for minimal braking',
      'Gentle inclines for optimal battery efficiency',
      'Temperature-controlled route sections'
    ],
    warnings: [
      'Minor construction at Delhi Gate (300m section)',
      'Speed bumps near Connaught Place approach'
    ]
  },
  {
    id: 'route2',
    name: 'Fastest Route',
    distance: '16.8 km',
    estimatedTime: '26 mins',
    fuelEfficiency: 76,
    vehicleImpact: 65,
    trafficLevel: 'Low',
    roadCondition: 'Fair',
    confidenceScore: 84,
    matchScore: 78,
    preferenceMatch: {
      time: 95,
      comfort: 70,
      efficiency: 76,
      vehicleHealth: 68
    },
    highlights: [
      'Less traffic congestion',
      'Higher average speed zones',
      'Minimal stoppage time'
    ],
    warnings: [
      'Rough road surface for 2.3km section',
      'Multiple sharp turns may increase tire wear',
      'High-stress on brake system due to traffic pattern'
    ]
  },
  {
    id: 'route3',
    name: 'Vehicle-Friendly',
    distance: '15.5 km',
    estimatedTime: '35 mins',
    fuelEfficiency: 90,
    vehicleImpact: 96,
    trafficLevel: 'Moderate',
    roadCondition: 'Excellent',
    confidenceScore: 89,
    matchScore: 84,
    preferenceMatch: {
      time: 74,
      comfort: 96,
      efficiency: 89,
      vehicleHealth: 97
    },
    highlights: [
      'Recently resurfaced road throughout route',
      'Minimal stop-and-go traffic patterns',
      'Gradual turns and minimal lane changes',
      'Optimal engine temperature maintenance'
    ],
    warnings: [
      'Slightly longer time duration',
      'Moderate traffic during peak hours'
    ]
  }
];

export default AIRouteRecommendation;