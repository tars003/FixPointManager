import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Map, 
  MapPin, 
  Route, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Download,
  Share2 
} from 'lucide-react';

interface HeatMapDataPoint {
  lat: number;
  lng: number;
  value: number; // 0-100 efficiency value
}

interface RouteSegment {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  distance: string;
  avgEfficiency: number;
  date: string;
}

const EfficiencyHeatMap: React.FC = () => {
  const [mapType, setMapType] = useState<string>('satellite');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('week');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-[#0056B3]" />
              Efficiency Heat Map
            </CardTitle>
            <CardDescription>
              Geo-contextual performance visualization based on GPS and OBD data
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Map Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Tabs 
            defaultValue="efficiency" 
            className="w-full max-w-[400px]"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
              <TabsTrigger value="emissions">Emissions</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <Select value={mapType} onValueChange={setMapType}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Map Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roadmap">Road Map</SelectItem>
                <SelectItem value="satellite">Satellite</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Main Map Area */}
        <div className="relative w-full aspect-[3/2] overflow-hidden rounded-lg border bg-muted">
          {/* Placeholder for the map */}
          <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=28.644800,77.216721&zoom=13&size=800x600&maptype=hybrid&key=AIzaSyCkxx')] bg-cover bg-center opacity-85">
            {/* This would be replaced with the actual map implementation */}
          </div>
          
          {/* Heat Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-md shadow-md">
            <p className="text-xs font-medium mb-2">Efficiency Legend</p>
            <div className="flex items-center gap-1">
              <div className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs">Low</span>
              <span className="text-xs">Medium</span>
              <span className="text-xs">High</span>
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 shadow-md">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 shadow-md">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 shadow-md">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Route Selection */}
        <div>
          <h3 className="text-sm font-medium mb-2">Route Segments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {routeSegments.map((route) => (
              <RouteCard 
                key={route.id} 
                route={route} 
                isSelected={selectedRoute === route.id}
                onSelect={() => setSelectedRoute(route.id === selectedRoute ? 'all' : route.id)}
              />
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Average Efficiency:</span> 76% across all routes
        </div>
        <Button className="gap-1">
          <Share2 className="h-4 w-4" />
          Share Map
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper Components
interface RouteCardProps {
  route: RouteSegment;
  isSelected: boolean;
  onSelect: () => void;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, isSelected, onSelect }) => {
  return (
    <div 
      className={`p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Route className="h-3.5 w-3.5 text-[#0056B3]" />
            <p className="font-medium text-sm">{route.name}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {route.startLocation} to {route.endLocation}
          </p>
          <p className="text-xs text-muted-foreground">{route.date} • {route.distance}</p>
        </div>
        <div className="flex flex-col items-end">
          <div 
            className={`text-sm font-medium ${getEfficiencyTextColor(route.avgEfficiency)}`}
          >
            {route.avgEfficiency}%
          </div>
          <div 
            className={`w-10 h-1.5 mt-1 rounded-full ${getEfficiencyBgColor(route.avgEfficiency)}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Helper Functions
const getEfficiencyTextColor = (efficiency: number): string => {
  if (efficiency >= 80) return 'text-green-600';
  if (efficiency >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getEfficiencyBgColor = (efficiency: number): string => {
  if (efficiency >= 80) return 'bg-green-600';
  if (efficiency >= 60) return 'bg-yellow-600';
  return 'bg-red-600';
};

// Sample Data
const routeSegments: RouteSegment[] = [
  {
    id: 'route1',
    name: 'Home to Office',
    startLocation: 'Malviya Nagar',
    endLocation: 'Connaught Place',
    distance: '14.2 km',
    avgEfficiency: 82,
    date: 'Today, 9:15 AM'
  },
  {
    id: 'route2',
    name: 'Office to Shopping Mall',
    startLocation: 'Connaught Place',
    endLocation: 'Select Citywalk',
    distance: '8.7 km',
    avgEfficiency: 68,
    date: 'Yesterday, 6:30 PM'
  },
  {
    id: 'route3',
    name: 'Weekend Trip',
    startLocation: 'Delhi',
    endLocation: 'Gurugram',
    distance: '32.1 km',
    avgEfficiency: 75,
    date: 'Mar 12, 11:20 AM'
  },
  {
    id: 'route4',
    name: 'Airport Run',
    startLocation: 'Home',
    endLocation: 'IGI Airport',
    distance: '23.5 km',
    avgEfficiency: 61,
    date: 'Mar 10, 5:45 AM'
  },
  {
    id: 'route5',
    name: 'Evening Commute',
    startLocation: 'Office',
    endLocation: 'Home',
    distance: '15.8 km',
    avgEfficiency: 51,
    date: 'Mar 9, 7:30 PM'
  },
  {
    id: 'route6',
    name: 'Weekend Shopping',
    startLocation: 'Home',
    endLocation: 'DLF Mall',
    distance: '11.3 km',
    avgEfficiency: 73,
    date: 'Mar 5, 12:15 PM'
  },
];

export default EfficiencyHeatMap;