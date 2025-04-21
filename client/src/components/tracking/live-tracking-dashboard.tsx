import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  Truck,
  User,
  Building,
  AlertTriangle,
  Eye,
  LocateFixed,
  Route,
  History,
  Phone,
  Filter,
  ZoomIn,
  ZoomOut,
  Layers,
  Map as MapIcon,
  Navigation,
  Clock,
  Fuel,
  Activity,
  Thermometer,
  Battery,
  BarChart,
  MessageSquare,
  BellRing,
  Circle,
  Square,
  Hexagon,
  PlayCircle,
  PauseCircle,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  RotateCw,
  AlarmCheck,
  Shield,
  AlertCircle,
} from 'lucide-react';

// Mock vehicle tracking data for simulation
const mockVehicles = [
  {
    id: 1,
    registrationNumber: 'TN01-3456',
    name: 'Toyota Innova Crysta',
    driver: 'Rajesh Kumar',
    status: 'moving',
    speed: 58,
    location: { lat: 12.9716, lng: 77.5946 },
    address: 'Bannerghatta Road, Bengaluru',
    heading: 'North-East',
    fuelLevel: 65,
    engineStatus: 'running',
    engineHours: '4h 32m',
    temperature: '38°C',
    batteryLevel: 92,
    currentTrip: {
      duration: '1h 47m',
      distance: '38.4 km',
      eta: '14:35',
      routeAdherence: 98,
      stops: 2,
      idleTime: '5m',
    },
    alerts: [],
    lastUpdated: new Date().getTime() - 45000, // 45 seconds ago
    connected: true,
  },
  {
    id: 2,
    registrationNumber: 'DL01-8794',
    name: 'Mahindra Bolero',
    driver: 'Suresh Singh',
    status: 'idle',
    speed: 0,
    location: { lat: 12.9352, lng: 77.6245 },
    address: 'Koramangala, Bengaluru',
    heading: 'Stationary',
    fuelLevel: 32,
    engineStatus: 'running',
    engineHours: '6h 12m',
    temperature: '42°C',
    batteryLevel: 87,
    currentTrip: {
      duration: '2h 32m',
      distance: '45.7 km',
      eta: '15:10',
      routeAdherence: 92,
      stops: 4,
      idleTime: '23m',
    },
    alerts: [{ type: 'idle', message: 'Excessive idle time', severity: 'warning' }],
    lastUpdated: new Date().getTime() - 12000, // 12 seconds ago
    connected: true,
  },
  {
    id: 3,
    registrationNumber: 'MH02-4532',
    name: 'Tata Ace',
    driver: 'Amit Sharma',
    status: 'stopped',
    speed: 0,
    location: { lat: 12.9796, lng: 77.5453 },
    address: 'Rajajinagar, Bengaluru',
    heading: 'Stationary',
    fuelLevel: 45,
    engineStatus: 'off',
    engineHours: '3h 45m',
    temperature: '35°C',
    batteryLevel: 78,
    currentTrip: {
      duration: '3h 15m',
      distance: '52.3 km',
      eta: 'Arrived',
      routeAdherence: 96,
      stops: 5,
      idleTime: '17m',
    },
    alerts: [],
    lastUpdated: new Date().getTime() - 180000, // 3 minutes ago
    connected: true,
  },
  {
    id: 4,
    registrationNumber: 'KA01-9834',
    name: 'Ashok Leyland Dost',
    driver: 'Venkatesh Rao',
    status: 'moving',
    speed: 64,
    location: { lat: 13.0298, lng: 77.5761 },
    address: 'Hebbal, Bengaluru',
    heading: 'South',
    fuelLevel: 28,
    engineStatus: 'running',
    engineHours: '5h 22m',
    temperature: '41°C',
    batteryLevel: 81,
    currentTrip: {
      duration: '1h 05m',
      distance: '22.7 km',
      eta: '13:50',
      routeAdherence: 99,
      stops: 1,
      idleTime: '3m',
    },
    alerts: [{ type: 'fuel', message: 'Low fuel level', severity: 'warning' }],
    lastUpdated: new Date().getTime() - 8000, // 8 seconds ago
    connected: true,
  },
  {
    id: 5,
    registrationNumber: 'GJ05-2143',
    name: 'Bajaj RE Auto',
    driver: 'Mukesh Patel',
    status: 'offline',
    speed: 0,
    location: { lat: 12.9766, lng: 77.6097 },
    address: 'Indiranagar, Bengaluru',
    heading: 'Unknown',
    fuelLevel: 50,
    engineStatus: 'unknown',
    engineHours: 'Unknown',
    temperature: 'Unknown',
    batteryLevel: 'Unknown',
    currentTrip: {
      duration: 'Unknown',
      distance: 'Unknown',
      eta: 'Unknown',
      routeAdherence: 0,
      stops: 0,
      idleTime: 'Unknown',
    },
    alerts: [{ type: 'connection', message: 'Device offline', severity: 'critical' }],
    lastUpdated: new Date().getTime() - 3600000, // 1 hour ago
    connected: false,
  }
];

// Mock geofence areas
const mockGeofences = [
  {
    id: 1,
    name: 'Warehouse Zone',
    type: 'polygon',
    color: '#3B82F6',
    coordinates: [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 12.9736, lng: 77.5966 },
      { lat: 12.9726, lng: 77.5986 },
      { lat: 12.9696, lng: 77.5976 },
    ],
    active: true,
  },
  {
    id: 2,
    name: 'Client Delivery Area',
    type: 'circle',
    color: '#10B981',
    center: { lat: 12.9352, lng: 77.6245 },
    radius: 1000, // meters
    active: true,
  },
  {
    id: 3,
    name: 'Restricted Zone',
    type: 'polygon',
    color: '#EF4444',
    coordinates: [
      { lat: 13.0298, lng: 77.5761 },
      { lat: 13.0318, lng: 77.5781 },
      { lat: 13.0308, lng: 77.5801 },
      { lat: 13.0278, lng: 77.5791 },
    ],
    active: true,
  }
];

// Mock alert data
const mockAlerts = [
  {
    id: 1,
    vehicle: 'DL01-8794 (Mahindra Bolero)',
    type: 'idle',
    message: 'Excessive idle time',
    timestamp: new Date().getTime() - 720000, // 12 minutes ago
    severity: 'warning',
    acknowledged: false,
    location: 'Koramangala, Bengaluru',
  },
  {
    id: 2,
    vehicle: 'KA01-9834 (Ashok Leyland Dost)',
    type: 'fuel',
    message: 'Low fuel level',
    timestamp: new Date().getTime() - 900000, // 15 minutes ago
    severity: 'warning',
    acknowledged: false,
    location: 'Hebbal, Bengaluru',
  },
  {
    id: 3,
    vehicle: 'GJ05-2143 (Bajaj RE Auto)',
    type: 'connection',
    message: 'Device offline',
    timestamp: new Date().getTime() - 3600000, // 1 hour ago
    severity: 'critical',
    acknowledged: true,
    location: 'Indiranagar, Bengaluru',
  },
  {
    id: 4,
    vehicle: 'TN01-3456 (Toyota Innova Crysta)',
    type: 'speeding',
    message: 'Speed limit exceeded',
    timestamp: new Date().getTime() - 1800000, // 30 minutes ago
    severity: 'critical',
    acknowledged: true,
    location: 'Bannerghatta Road, Bengaluru',
  },
  {
    id: 5,
    vehicle: 'MH02-4532 (Tata Ace)',
    type: 'geofence',
    message: 'Geofence exit - Warehouse Zone',
    timestamp: new Date().getTime() - 5400000, // 1.5 hours ago
    severity: 'info',
    acknowledged: true,
    location: 'Rajajinagar, Bengaluru',
  },
];

interface LiveTrackingDashboardProps {
  theme: 'light' | 'dark';
}

export default function LiveTrackingDashboard({ theme }: LiveTrackingDashboardProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('map');
  const [showGeofences, setShowGeofences] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [mapView, setMapView] = useState('roadmap');
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [isPlaying, setIsPlaying] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(12);
  
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Simulate real-time updates
  useEffect(() => {
    if (!isPlaying) return;
    
    const updateInterval = setInterval(() => {
      // Update vehicle positions with small random movements
      setVehicles(vehicles => vehicles.map(vehicle => {
        if (vehicle.status === 'moving') {
          const latChange = (Math.random() - 0.5) * 0.002;
          const lngChange = (Math.random() - 0.5) * 0.002;
          
          // Update speed with small random changes
          let newSpeed = vehicle.speed + (Math.random() - 0.5) * 5;
          newSpeed = Math.max(45, Math.min(75, newSpeed)); // Keep between 45-75
          
          // Update location
          return {
            ...vehicle,
            location: {
              lat: vehicle.location.lat + latChange,
              lng: vehicle.location.lng + lngChange
            },
            speed: Math.round(newSpeed),
            lastUpdated: new Date().getTime()
          };
        }
        
        // For idle vehicles, just update the lastUpdated time
        if (vehicle.status === 'idle' || vehicle.status === 'stopped') {
          return {
            ...vehicle,
            lastUpdated: new Date().getTime()
          };
        }
        
        return vehicle;
      }));
      
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(updateInterval);
  }, [isPlaying]);
  
  // Format the time since last update
  const formatTimeSince = (timestamp: number) => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  
  // Get status color based on vehicle status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'moving':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'stopped':
        return 'bg-blue-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get alert severity color
  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-500';
      case 'warning':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-500';
      case 'info':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 border-blue-500';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400 border-gray-500';
    }
  };
  
  // Get icon for alert type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'speeding':
        return <Activity className="w-4 h-4" />;
      case 'idle':
        return <Clock className="w-4 h-4" />;
      case 'fuel':
        return <Fuel className="w-4 h-4" />;
      case 'connection':
        return <WifiOff className="w-4 h-4" />;
      case 'geofence':
        return <MapPin className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };
  
  // Filter vehicles based on status filter
  const filteredVehicles = vehicles.filter(vehicle => {
    if (filterStatus === 'all') return true;
    return vehicle.status === filterStatus;
  });
  
  // Handle vehicle selection
  const handleVehicleSelect = (id: number) => {
    setSelectedVehicle(id);
    setActiveTab('vehicle');
  };
  
  // Get selected vehicle details
  const selectedVehicleDetails = selectedVehicle 
    ? vehicles.find(v => v.id === selectedVehicle) 
    : null;
  
  return (
    <div className="space-y-4">
      {/* Map and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Side - Vehicles and Filters */}
        <div className="lg:col-span-1 space-y-4">
          {/* Vehicle Filters */}
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className={`text-base font-medium flex items-center ${theme === 'dark' ? 'text-white' : ''}`}>
                  <Filter className="h-4 w-4 mr-1" /> Filters
                </CardTitle>
                <Badge variant="outline" className={theme === 'dark' ? 'border-gray-600' : ''}>
                  {filteredVehicles.length} vehicles
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="status-filter" className={theme === 'dark' ? 'text-gray-400' : ''}>Status:</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className={`h-8 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : ''}>
                    <SelectItem value="all">All Vehicles</SelectItem>
                    <SelectItem value="moving">Moving</SelectItem>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="stopped">Stopped</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Moving</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Idle</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Stopped</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Offline</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Vehicle List */}
          <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-base font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                <Truck className="h-4 w-4 inline mr-1" /> Fleet Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {filteredVehicles.map(vehicle => (
                  <div 
                    key={vehicle.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedVehicle === vehicle.id 
                        ? (theme === 'dark' ? 'bg-blue-900/30 border-l-4 border-blue-500' : 'bg-blue-50 border-l-4 border-blue-500') 
                        : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100')
                    }`}
                    onClick={() => handleVehicleSelect(vehicle.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-sm flex items-center">
                          <span className={theme === 'dark' ? 'text-white' : ''}>
                            {vehicle.name}
                          </span>
                          {vehicle.alerts.length > 0 && (
                            <span className="ml-2">
                              <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {vehicle.registrationNumber}
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`text-xs px-1.5 py-0 h-5 flex items-center 
                          ${vehicle.connected ? 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400' : 'border-gray-500 text-gray-500'}`}
                      >
                        {vehicle.connected ? (
                          <><Wifi className="h-3 w-3 mr-1" /> Live</>
                        ) : (
                          <><WifiOff className="h-3 w-3 mr-1" /> Offline</>
                        )}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-1.5 ${getStatusColor(vehicle.status)}`}></div>
                        <span className="text-xs capitalize text-gray-600 dark:text-gray-300">
                          {vehicle.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeSince(vehicle.lastUpdated)}
                      </div>
                    </div>
                    
                    <div className="mt-1.5 text-xs grid grid-cols-2 gap-x-2 gap-y-1">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Navigation className="h-3 w-3 mr-1 text-gray-400" />
                        {vehicle.status === 'moving' ? `${vehicle.speed} km/h` : '0 km/h'}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <User className="h-3 w-3 mr-1 text-gray-400" />
                        {vehicle.driver}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Fuel className="h-3 w-3 mr-1 text-gray-400" />
                        {typeof vehicle.fuelLevel === 'number' ? `${vehicle.fuelLevel}%` : vehicle.fuelLevel}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="truncate" title={vehicle.address}>
                          {vehicle.address}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredVehicles.length === 0 && (
                  <div className={`p-4 text-center rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      No vehicles match the selected filter
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Side - Map and Vehicle Details */}
        <div className="lg:col-span-3 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid grid-cols-2 ${theme === 'dark' ? 'bg-gray-700' : ''}`}>
              <TabsTrigger value="map">
                <MapIcon className="h-4 w-4 mr-1" /> Map View
              </TabsTrigger>
              <TabsTrigger value="vehicle" disabled={!selectedVehicleDetails}>
                <Truck className="h-4 w-4 mr-1" /> Vehicle Details
              </TabsTrigger>
            </TabsList>
            
            {/* Map View */}
            <TabsContent value="map" className="mt-4 space-y-4">
              {/* Map Controls */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGeofences(!showGeofences)}
                    className={`${showGeofences ? (theme === 'dark' ? 'bg-blue-900/30 text-blue-400 border-blue-500' : 'bg-blue-50 text-blue-700') : ''} ${theme === 'dark' ? 'border-gray-600' : ''}`}
                  >
                    <Hexagon className={`h-4 w-4 ${showGeofences ? 'text-blue-500 mr-1' : 'mr-1'}`} />
                    Geofences
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAlerts(!showAlerts)}
                    className={`${showAlerts ? (theme === 'dark' ? 'bg-red-900/30 text-red-400 border-red-500' : 'bg-red-50 text-red-700') : ''} ${theme === 'dark' ? 'border-gray-600' : ''}`}
                  >
                    <AlertTriangle className={`h-4 w-4 ${showAlerts ? 'text-red-500 mr-1' : 'mr-1'}`} />
                    Alerts
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 20))}
                    className={theme === 'dark' ? 'border-gray-600' : ''}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 5))}
                    className={theme === 'dark' ? 'border-gray-600' : ''}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Select value={mapView} onValueChange={setMapView}>
                    <SelectTrigger className={`h-8 w-36 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}>
                      <Layers className="h-4 w-4 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : ''}>
                      <SelectItem value="roadmap">Road Map</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={theme === 'dark' ? 'border-gray-600' : ''}
                  >
                    {isPlaying ? (
                      <><PauseCircle className="h-4 w-4 mr-1" /> Pause</>
                    ) : (
                      <><PlayCircle className="h-4 w-4 mr-1" /> Play</>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Map Display */}
              <div 
                ref={mapRef} 
                className={`h-[500px] w-full rounded-lg relative overflow-hidden 
                  ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border'}`}
              >
                {/* Map placeholder - in a real app, this would be a real map component */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <MapIcon className="h-20 w-20 mx-auto mb-4 opacity-20" />
                    <p>Map rendering would appear here.</p>
                    <p className="text-sm mt-1">In a real implementation, this would integrate with Google Maps or similar mapping API.</p>
                  </div>
                </div>
                
                {/* Vehicle markers */}
                {filteredVehicles.map(vehicle => (
                  <motion.div
                    key={vehicle.id}
                    className={`absolute w-8 h-8 -ml-4 -mt-4 cursor-pointer
                      ${selectedVehicle === vehicle.id ? 'z-20' : 'z-10'}`}
                    style={{ 
                      left: `${(Math.random() * 80 + 10)}%`, 
                      top: `${(Math.random() * 80 + 10)}%` 
                    }}
                    initial={false}
                    animate={{
                      scale: selectedVehicle === vehicle.id ? 1.1 : 1,
                      boxShadow: selectedVehicle === vehicle.id ? '0 0 0 4px rgba(59, 130, 246, 0.5)' : 'none'
                    }}
                    onClick={() => handleVehicleSelect(vehicle.id)}
                  >
                    <div 
                      className={`absolute inset-0 rounded-full flex items-center justify-center
                        ${getStatusColor(vehicle.status)}`}
                    >
                      <Truck className="h-4 w-4 text-white" />
                    </div>
                    {vehicle.status === 'moving' && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white bg-opacity-50"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0 }}
                      />
                    )}
                  </motion.div>
                ))}
                
                {/* Geofence areas - simplified for demonstration */}
                {showGeofences && mockGeofences.map(geofence => (
                  <div
                    key={geofence.id}
                    className={`absolute rounded-full pointer-events-none z-0`}
                    style={{
                      left: `${geofence.type === 'circle' ? (Math.random() * 80 + 10) : (Math.random() * 70 + 15)}%`,
                      top: `${geofence.type === 'circle' ? (Math.random() * 80 + 10) : (Math.random() * 70 + 15)}%`,
                      width: `${geofence.type === 'circle' ? '120px' : '160px'}`,
                      height: `${geofence.type === 'circle' ? '120px' : '100px'}`,
                      backgroundColor: `${geofence.color}33`, // Add 20% opacity
                      borderColor: geofence.color,
                      borderWidth: '2px',
                      borderStyle: 'dashed'
                    }}
                  >
                    <div 
                      className={`absolute -top-6 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded text-xs whitespace-nowrap
                        ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
                      style={{ borderColor: geofence.color, borderWidth: '1px' }}
                    >
                      {geofence.name}
                    </div>
                  </div>
                ))}
                
                {/* Alert indicators */}
                {showAlerts && mockAlerts
                  .filter(alert => !alert.acknowledged)
                  .map(alert => (
                    <motion.div
                      key={alert.id}
                      className="absolute z-20"
                      style={{ 
                        left: `${(Math.random() * 80 + 10)}%`, 
                        top: `${(Math.random() * 80 + 10)}%` 
                      }}
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div 
                        className={`w-8 h-8 flex items-center justify-center rounded-full
                          ${alert.severity === 'critical' ? 'bg-red-500' : 
                           alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                      >
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                    </motion.div>
                  ))
                }
              </div>
              
              {/* Map Legend */}
              <div className={`p-2 rounded-md text-xs grid grid-cols-2 md:grid-cols-4 gap-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border'}`}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Moving Vehicle</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Idle Vehicle</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Stopped Vehicle</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Offline Vehicle</span>
                </div>
              </div>
            </TabsContent>
            
            {/* Vehicle Details View */}
            <TabsContent value="vehicle" className="mt-4 space-y-4">
              {selectedVehicleDetails && (
                <>
                  {/* Vehicle Header */}
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border'}`}>
                    <div className="flex justify-between">
                      <div>
                        <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                          {selectedVehicleDetails.name}
                        </h2>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedVehicleDetails.registrationNumber}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full mr-1.5 ${getStatusColor(selectedVehicleDetails.status)}`}></div>
                          <span className={`text-sm capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {selectedVehicleDetails.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Last updated: {formatTimeSince(selectedVehicleDetails.lastUpdated)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
                      >
                        <LocateFixed className="h-4 w-4 mr-1" />
                        Center on Map
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
                      >
                        <Route className="h-4 w-4 mr-1" />
                        Show Route
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
                      >
                        <History className="h-4 w-4 mr-1" />
                        Show History
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Contact Driver
                      </Button>
                    </div>
                  </div>
                  
                  {/* Vehicle Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Real-Time Information */}
                    <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                      <CardHeader className="pb-2">
                        <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                          <Activity className="h-4 w-4 inline mr-1 text-blue-500" /> Real-Time Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Speed:</div>
                          <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {selectedVehicleDetails.status === 'moving' ? `${selectedVehicleDetails.speed} km/h` : '0 km/h'}
                          </div>
                          
                          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Location:</div>
                          <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {selectedVehicleDetails.address}
                          </div>
                          
                          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Heading:</div>
                          <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {selectedVehicleDetails.heading}
                          </div>
                          
                          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Engine:</div>
                          <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {selectedVehicleDetails.engineStatus === 'running' ? (
                              <span className="text-green-500">Running</span>
                            ) : selectedVehicleDetails.engineStatus === 'off' ? (
                              <span className="text-red-500">Off</span>
                            ) : (
                              <span className="text-gray-500">Unknown</span>
                            )}
                          </div>
                          
                          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Engine Hours:</div>
                          <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {selectedVehicleDetails.engineHours}
                          </div>
                          
                          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Fuel:</div>
                          <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {typeof selectedVehicleDetails.fuelLevel === 'number' ? (
                              <div className="flex items-center justify-end">
                                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded mr-2">
                                  <div 
                                    className={`h-full rounded 
                                      ${selectedVehicleDetails.fuelLevel > 50 ? 'bg-green-500' : 
                                        selectedVehicleDetails.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${selectedVehicleDetails.fuelLevel}%` }}
                                  ></div>
                                </div>
                                {selectedVehicleDetails.fuelLevel}%
                              </div>
                            ) : (
                              selectedVehicleDetails.fuelLevel
                            )}
                          </div>
                          
                          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Temperature:</div>
                          <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {selectedVehicleDetails.temperature}
                          </div>
                          
                          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Battery:</div>
                          <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {typeof selectedVehicleDetails.batteryLevel === 'number' ? `${selectedVehicleDetails.batteryLevel}%` : selectedVehicleDetails.batteryLevel}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Current Trip Data */}
                    <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                      <CardHeader className="pb-2">
                        <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                          <Route className="h-4 w-4 inline mr-1 text-green-500" /> Current Trip Data
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        {selectedVehicleDetails.currentTrip.duration !== 'Unknown' ? (
                          <div className="grid grid-cols-2 gap-2">
                            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Duration:</div>
                            <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                              {selectedVehicleDetails.currentTrip.duration}
                            </div>
                            
                            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Distance:</div>
                            <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                              {selectedVehicleDetails.currentTrip.distance}
                            </div>
                            
                            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>ETA:</div>
                            <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                              {selectedVehicleDetails.currentTrip.eta}
                            </div>
                            
                            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Route Adherence:</div>
                            <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                              <div className="flex items-center justify-end">
                                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded mr-2">
                                  <div 
                                    className={`h-full rounded 
                                      ${selectedVehicleDetails.currentTrip.routeAdherence > 90 ? 'bg-green-500' : 
                                        selectedVehicleDetails.currentTrip.routeAdherence > 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${selectedVehicleDetails.currentTrip.routeAdherence}%` }}
                                  ></div>
                                </div>
                                {selectedVehicleDetails.currentTrip.routeAdherence}%
                              </div>
                            </div>
                            
                            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Stops:</div>
                            <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                              {selectedVehicleDetails.currentTrip.stops}
                            </div>
                            
                            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Idle Time:</div>
                            <div className={`text-right font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                              {selectedVehicleDetails.currentTrip.idleTime}
                            </div>
                          </div>
                        ) : (
                          <div className={`text-center py-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            No active trip data available
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Driver Information */}
                    <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                      <CardHeader className="pb-2">
                        <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                          <User className="h-4 w-4 inline mr-1 text-purple-500" /> Driver Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center 
                            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <User className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                          </div>
                          <div>
                            <div className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                              {selectedVehicleDetails.driver}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Primary Driver
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-around text-center mb-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
                          >
                            <User className="h-4 w-4 mr-1" />
                            Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                
                  {/* Alerts Section */}
                  {selectedVehicleDetails.alerts.length > 0 && (
                    <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                      <CardHeader className="pb-2">
                        <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                          <AlertTriangle className="h-4 w-4 inline mr-1 text-yellow-500" /> Active Alerts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedVehicleDetails.alerts.map((alert, index) => (
                            <div 
                              key={index} 
                              className={`p-3 rounded-md border-l-4 ${
                                alert.severity === 'critical' 
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                                  : alert.severity === 'warning'
                                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                                  : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`mt-0.5 mr-2 ${
                                  alert.severity === 'critical' 
                                    ? 'text-red-500' 
                                    : alert.severity === 'warning'
                                    ? 'text-yellow-500'
                                    : 'text-blue-500'
                                }`}>
                                  {getAlertIcon(alert.type)}
                                </div>
                                <div className="flex-1">
                                  <div className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                    {alert.message}
                                  </div>
                                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Alert Type: {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                                  </div>
                                </div>
                                <Badge variant="outline" className={
                                  alert.severity === 'critical' 
                                    ? 'border-red-500 text-red-500 dark:text-red-400'
                                    : alert.severity === 'warning'
                                    ? 'border-yellow-500 text-yellow-500 dark:text-yellow-400'
                                    : 'border-blue-500 text-blue-500 dark:text-blue-400'
                                }>
                                  {alert.severity.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Alerts Panel */}
      {showAlerts && (
        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className={`text-base font-medium flex items-center ${theme === 'dark' ? 'text-white' : ''}`}>
                <BellRing className="h-4 w-4 mr-1 text-yellow-500" /> Fleet Alerts
              </CardTitle>
              <Badge className="bg-yellow-500">{alerts.filter(a => !a.acknowledged).length} Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto p-2 space-y-2">
            {alerts.length > 0 ? (
              alerts.slice(0, 5).map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-md border-l-4 ${
                    alert.acknowledged ? 'opacity-60 ' : ''
                  } ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-2">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{alert.message}</div>
                      <div className="text-xs opacity-80">{alert.vehicle} • {alert.location}</div>
                      <div className="text-xs mt-1 opacity-70">{formatTimeSince(alert.timestamp)}</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 px-2 opacity-70 hover:opacity-100"
                    >
                      <AlarmCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-2">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <div>No active alerts at this time</div>
              </div>
            )}
          </CardContent>
          <CardFooter className="px-4 py-2 flex justify-center border-t border-gray-200 dark:border-gray-700">
            <Button variant="link" size="sm" className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>
              View All Alerts <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}