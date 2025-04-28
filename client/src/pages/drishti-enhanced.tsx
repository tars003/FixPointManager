import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  BarChart3, 
  Camera, 
  Settings2, 
  AlertTriangle, 
  Check, 
  Clock, 
  Heart, 
  Wrench, 
  MapPin, 
  TrendingUp, 
  Bell, 
  Droplet, 
  Thermometer, 
  Battery, 
  Gauge, 
  Activity, 
  Calendar, 
  Search, 
  StretchHorizontal,
  MessageSquare,
  Trophy,
  ScrollText,
  BatteryCharging,
  Share2,
  Brain,
  Globe,
  UserCog,
  Power,
  Target,
  Map,
  Lock,
  Unlock,
  Smartphone,
  RefreshCw,
  Zap,
  Car,
  History,
  Landmark,
  Timer,
  ArrowUpDown
} from 'lucide-react';

// Import custom components
import RealtimeEnergyMonitor from '@/components/drishti/realtime-energy-monitor';
import EfficiencyHeatMap from '@/components/drishti/efficiency-heat-map';
import CollaborativeAnnotations from '@/components/drishti/collaborative-annotations';
import GamifiedDriverPerformance from '@/components/drishti/gamified-driver-performance';
import MaintenanceTimeline from '@/components/drishti/maintenance-timeline';
import AIRouteRecommendation from '@/components/drishti/ai-route-recommendation';
import DriverAchievements from '@/components/drishti/driver-achievements';
import PredictiveBatteryHealth from '@/components/drishti/predictive-battery-health';

// Sample data
const recentAlerts = [
  {
    name: 'Engine Temperature Warning',
    time: '2 hours ago',
    severity: 'Medium',
    severityColor: 'text-amber-500',
    bgColor: 'bg-amber-100',
    icon: <Thermometer className="h-5 w-5 text-amber-500" />
  },
  {
    name: 'Brake Pad Wear Alert',
    time: '1 day ago',
    severity: 'Low',
    severityColor: 'text-green-500',
    bgColor: 'bg-green-100',
    icon: <AlertTriangle className="h-5 w-5 text-green-500" />
  },
  {
    name: 'Battery Health Degradation',
    time: '3 days ago',
    severity: 'Medium',
    severityColor: 'text-amber-500',
    bgColor: 'bg-amber-100',
    icon: <Battery className="h-5 w-5 text-amber-500" />
  }
];

const vehicleSystemStatus = [
  {
    name: 'Engine',
    health: 92,
    bgColor: 'bg-blue-100',
    icon: <Activity className="h-4 w-4 text-blue-500" />
  },
  {
    name: 'Transmission',
    health: 86,
    bgColor: 'bg-green-100',
    icon: <StretchHorizontal className="h-4 w-4 text-green-500" />
  },
  {
    name: 'Brakes',
    health: 74,
    bgColor: 'bg-amber-100',
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />
  },
  {
    name: 'Battery',
    health: 68,
    bgColor: 'bg-orange-100',
    icon: <Battery className="h-4 w-4 text-orange-500" />
  },
  {
    name: 'Cooling System',
    health: 95,
    bgColor: 'bg-blue-100',
    icon: <Thermometer className="h-4 w-4 text-blue-500" />
  },
  {
    name: 'Fuel System',
    health: 88,
    bgColor: 'bg-green-100',
    icon: <Droplet className="h-4 w-4 text-green-500" />
  }
];

const errorLogs = [
  {
    code: 'P0300',
    description: 'Random/Multiple Cylinder Misfire Detected',
    severity: 'medium',
    date: '2025-04-15'
  },
  {
    code: 'B0324',
    description: 'Battery Voltage Low',
    severity: 'low',
    date: '2025-04-08'
  }
];

// Vehicle control status
const vehicleControlStatus = {
  engineRunning: false,
  doorLocked: true,
  climate: {
    temperature: 22,
    fanSpeed: 2,
    ac: true
  },
  location: {
    latitude: 19.0760,
    longitude: 72.8777,
    address: "Mumbai, Maharashtra, India",
    lastUpdated: "2 minutes ago"
  },
  speed: {
    current: 0,
    max: 120,
    average: 45
  },
  geofence: {
    active: true,
    radius: 5, // km
    alerts: 3
  }
};

// Custom icons for the missing ones from lucide-react
const Cable = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z" />
    <path d="M9 9v6" />
    <path d="M15 9v6" />
  </svg>
);

const Bluetooth = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m7 7 10 10-5 5V2l5 5L7 17" />
  </svg>
);

const Wifi = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 13a10 10 0 0 1 14 0" />
    <path d="M8.5 16.5a5 5 0 0 1 7 0" />
    <path d="M2 8.82a15 15 0 0 1 20 0" />
    <line x1="12" y1="20" x2="12" y2="20" />
  </svg>
);

const SimCard = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M7 7h4v4H7z" />
    <path d="M7 13h.01" />
    <path d="M10 13h.01" />
    <path d="M13 13h.01" />
    <path d="M16 13h.01" />
    <path d="M7 16h.01" />
    <path d="M10 16h.01" />
    <path d="M13 16h.01" />
    <path d="M16 16h.01" />
  </svg>
);

const Locate = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2" />
    <path d="M12 19v2" />
    <path d="M3 12h2" />
    <path d="M19 12h2" />
    <path d="m18.364 5.636-.707.707" />
    <path d="m6.343 17.657-.707.707" />
    <path d="m5.636 5.636.707.707" />
    <path d="m17.657 17.657.707.707" />
  </svg>
);

const Speedometer = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M20 12h2" />
    <path d="M2 12h2" />
    <path d="m16 8-4 4" />
  </svg>
);

const Fuel = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" />
    <path d="M10 10v11" />
    <path d="M7 13h6" />
  </svg>
);

const Video = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
);

// Hardware connection options
const connectionOptions = [
  {
    id: 'wire',
    name: 'Wire',
    icon: <Cable className="h-5 w-5" />,
    description: 'Direct OBD2 port connection',
    advantages: ['Reliable', 'No power required', 'Fastest data transfer'],
    status: 'disconnected'
  },
  {
    id: 'bluetooth',
    name: 'Bluetooth',
    icon: <Bluetooth className="h-5 w-5" />,
    description: 'Wireless BLE connection',
    advantages: ['Convenient', 'Easy setup', 'Short-range'],
    status: 'connected'
  },
  {
    id: 'wifi',
    name: 'WiFi',
    icon: <Wifi className="h-5 w-5" />,
    description: 'Local WiFi network',
    advantages: ['Home network integration', 'Medium range', 'Fast data'],
    status: 'disconnected'
  },
  {
    id: 'esim',
    name: 'eSIM',
    icon: <Smartphone className="h-5 w-5" />,
    description: 'Built-in cellular connection',
    advantages: ['Global coverage', 'Always connected', 'Remote tracking'],
    status: 'disconnected'
  },
  {
    id: 'simcard',
    name: 'SIM Card',
    icon: <SimCard className="h-5 w-5" />,
    description: 'User provided SIM card',
    advantages: ['Flexible plans', 'Replaceable', 'Provider choice'],
    status: 'disconnected'
  }
];

// Advanced OBD2+GPS features
const advancedGpsObd2Features = [
  {
    id: 'realtime-tracking',
    name: 'Realtime Vehicle Tracking',
    icon: <Locate className="h-5 w-5 text-blue-500" />,
    description: 'Live location tracking with 5-second intervals',
    status: 'active'
  },
  {
    id: 'geofencing',
    name: 'Geofencing Control',
    icon: <Target className="h-5 w-5 text-purple-500" />,
    description: 'Set virtual boundaries with alerts when crossed',
    status: 'active'
  },
  {
    id: 'remote-disable',
    name: 'Remote Engine Control',
    icon: <Power className="h-5 w-5 text-red-500" />,
    description: 'Turn vehicle engine on/off remotely with security verification',
    status: 'inactive'
  },
  {
    id: 'speed-monitoring',
    name: 'Speed Monitoring',
    icon: <Speedometer className="h-5 w-5 text-amber-500" />,
    description: 'Live speed tracking with alert thresholds',
    status: 'active'
  },
  {
    id: 'driving-behavior',
    name: 'Driving Behavior Analysis',
    icon: <Activity className="h-5 w-5 text-emerald-500" />,
    description: 'AI analysis of acceleration, braking, and cornering patterns',
    status: 'active'
  },
  {
    id: 'trip-history',
    name: 'Trip History Replay',
    icon: <History className="h-5 w-5 text-indigo-500" />,
    description: 'Visualize past trips with detailed route information',
    status: 'active'
  },
  {
    id: 'fuel-monitoring',
    name: 'Fuel Consumption Analytics',
    icon: <Fuel className="h-5 w-5 text-green-500" />,
    description: 'Track fuel levels, consumption rates, and efficiency patterns',
    status: 'active'
  },
  {
    id: 'dashcam',
    name: 'Integrated Dashcam',
    icon: <Video className="h-5 w-5 text-rose-500" />,
    description: 'Event-triggered video recording with cloud storage',
    status: 'inactive'
  }
];

const DrishtiEnhanced: React.FC = () => {
  const [mainTab, setMainTab] = useState<string>('dashboard');
  const [advancedFeatureTab, setAdvancedFeatureTab] = useState<string>('energy');
  const [advancedAIFeatureTab, setAdvancedAIFeatureTab] = useState<string>('route');
  const [connectionTab, setConnectionTab] = useState<string>('bluetooth');
  const [engineStatus, setEngineStatus] = useState<boolean>(vehicleControlStatus.engineRunning);
  const [geofenceEnabled, setGeofenceEnabled] = useState<boolean>(vehicleControlStatus.geofence.active);
  const [geofenceRadius, setGeofenceRadius] = useState<number>(vehicleControlStatus.geofence.radius);
  const [currentSpeed, setCurrentSpeed] = useState<number>(vehicleControlStatus.speed.current);
  
  // Function to handle remote engine control
  const toggleEngine = () => {
    // In a real app, this would have additional security verification
    setEngineStatus(!engineStatus);
  };
  
  // Function to handle geofencing changes
  const toggleGeofence = () => {
    setGeofenceEnabled(!geofenceEnabled);
  };
  
  // Utility functions for status colors
  const getHealthColorClass = (health: number) => {
    if (health >= 90) return 'bg-green-500';
    if (health >= 75) return 'bg-amber-500';
    if (health >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const getHealthTextClass = (health: number) => {
    if (health >= 90) return 'text-green-500';
    if (health >= 75) return 'text-amber-500';
    if (health >= 60) return 'text-orange-500';
    return 'text-red-500';
  };
  
  const getSeverityBgColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-500';
    if (severity === 'medium') return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  // Simulate changing speed (this would be real data in production)
  React.useEffect(() => {
    // Simulate speed changes for demo purposes
    const interval = setInterval(() => {
      if (engineStatus) {
        // Random speed fluctuation when engine is on
        setCurrentSpeed(prev => {
          const change = Math.random() > 0.5 ? 2 : -1;
          return Math.max(0, Math.min(120, prev + change));
        });
      } else {
        // When engine is off, speed should be 0
        setCurrentSpeed(0);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [engineStatus]);
  
  return (
    <div className="container px-4 py-6 mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#0056B3] p-2 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Drishti</h1>
              <p className="text-muted-foreground">
                Advanced Universal OBD2+GPS Device Integration
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className="border-emerald-200 text-emerald-600 flex items-center gap-1 py-1"
            >
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Device Online
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Connection Status Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Cable className="h-5 w-5 text-[#0056B3]" />
              Hardware Connection
            </CardTitle>
            <CardDescription>Select and configure your preferred connection method</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={connectionTab} onValueChange={setConnectionTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                {connectionOptions.map(option => (
                  <TabsTrigger key={option.id} value={option.id} className="flex flex-col items-center gap-1 py-3">
                    {React.cloneElement(option.icon, { 
                      className: connectionTab === option.id 
                        ? "h-5 w-5 text-[#0056B3]" 
                        : "h-5 w-5 text-gray-500" 
                    })}
                    <span className="text-xs">{option.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {connectionOptions.map(option => (
                <TabsContent key={option.id} value={option.id}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                        {React.cloneElement(option.icon, { className: "h-12 w-12 text-[#0056B3] mb-4" })}
                        <h3 className="text-lg font-semibold mb-1">{option.name} Connection</h3>
                        <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                        <div className="space-y-2 w-full">
                          {option.advantages.map((adv, i) => (
                            <div key={i} className="flex items-center justify-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>{adv}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Connection Status</h3>
                        <Badge
                          className={
                            option.status === 'connected' 
                              ? "bg-green-100 text-green-700" 
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          {option.status === 'connected' ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </div>
                      
                      {option.id === 'bluetooth' && (
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="device-name">Device Name</Label>
                            <Input id="device-name" defaultValue="Drishti OBD2 Scanner" />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="device-pin">Pairing PIN</Label>
                            <Input id="device-pin" defaultValue="1234" type="password" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline">Scan for Devices</Button>
                            <Button>Connect</Button>
                          </div>
                        </div>
                      )}
                      
                      {option.id === 'wifi' && (
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="wifi-ssid">WiFi Network</Label>
                            <Select defaultValue="home">
                              <SelectTrigger>
                                <SelectValue placeholder="Select a WiFi network" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="home">Home Network</SelectItem>
                                <SelectItem value="office">Office WiFi</SelectItem>
                                <SelectItem value="mobile">Mobile Hotspot</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="wifi-password">WiFi Password</Label>
                            <Input id="wifi-password" type="password" />
                          </div>
                          <Button>Connect</Button>
                        </div>
                      )}
                      
                      {option.id === 'wire' && (
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="port-selection">OBD2 Port</Label>
                            <Select defaultValue="auto">
                              <SelectTrigger>
                                <SelectValue placeholder="Select OBD2 port" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="auto">Auto-detect</SelectItem>
                                <SelectItem value="usb">USB Connector</SelectItem>
                                <SelectItem value="serial">Serial Port</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="protocol">OBD Protocol</Label>
                            <Select defaultValue="auto">
                              <SelectTrigger>
                                <SelectValue placeholder="Select protocol" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="auto">Auto-detect</SelectItem>
                                <SelectItem value="iso9141">ISO 9141-2</SelectItem>
                                <SelectItem value="iso14230">ISO 14230-4 (KWP2000)</SelectItem>
                                <SelectItem value="iso15765">ISO 15765-4 (CAN)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button>Connect</Button>
                        </div>
                      )}
                      
                      {option.id === 'esim' && (
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="esim-provider">eSIM Provider</Label>
                            <Select defaultValue="jio">
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="jio">Jio</SelectItem>
                                <SelectItem value="airtel">Airtel</SelectItem>
                                <SelectItem value="vodafone">Vodafone</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="esim-plan">Data Plan</Label>
                            <Select defaultValue="basic">
                              <SelectTrigger>
                                <SelectValue placeholder="Select plan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basic">Basic (1GB/month)</SelectItem>
                                <SelectItem value="standard">Standard (5GB/month)</SelectItem>
                                <SelectItem value="premium">Premium (10GB/month)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button>Activate eSIM</Button>
                        </div>
                      )}
                      
                      {option.id === 'simcard' && (
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="simcard-number">SIM Card Number</Label>
                            <Input id="simcard-number" placeholder="Enter SIM card number" />
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="apn-settings">APN Settings</Label>
                            <Input id="apn-settings" placeholder="Access Point Name" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="data-roaming" />
                            <Label htmlFor="data-roaming">Enable Data Roaming</Label>
                          </div>
                          <Button>Apply Settings</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Vehicle Control Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Remote Engine Control */}
          <Card className={engineStatus ? "border-green-500" : "border-gray-200"}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Power className={`h-5 w-5 ${engineStatus ? "text-green-500" : "text-gray-500"}`} />
                Remote Engine Control
              </CardTitle>
              <CardDescription>
                Remotely turn your vehicle's engine on/off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-full ${engineStatus ? "bg-green-100" : "bg-gray-100"} flex items-center justify-center mb-4`}>
                  <Power className={`h-12 w-12 ${engineStatus ? "text-green-500" : "text-gray-500"}`} />
                </div>
                <h3 className="text-xl font-semibold mb-1">
                  {engineStatus ? "Engine Running" : "Engine Off"}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {engineStatus 
                    ? "Vehicle engine is currently running" 
                    : "Vehicle engine is currently turned off"
                  }
                </p>
                <Button 
                  className={engineStatus ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                  onClick={toggleEngine}
                >
                  {engineStatus ? (
                    <>
                      <Power className="h-4 w-4 mr-2" />
                      Turn Off Engine
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4 mr-2" />
                      Turn On Engine
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Live Speed Monitoring */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Speedometer className="h-5 w-5 text-blue-500" />
                Live Speed Monitoring
              </CardTitle>
              <CardDescription>
                Current vehicle speed and tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center mb-2 relative">
                  <span className="text-3xl font-bold">{currentSpeed}</span>
                  <span className="text-sm">km/h</span>
                  
                  {/* Speed gauge markers */}
                  <div className="absolute inset-0 w-full h-full">
                    <div 
                      className="absolute top-0 left-1/2 w-1 h-3 bg-gray-300 -translate-x-1/2"
                      style={{ transform: 'rotate(0deg) translateY(-50%) translateX(-50%)' }}
                    ></div>
                    <div 
                      className="absolute top-0 left-1/2 w-1 h-3 bg-gray-300 -translate-x-1/2"
                      style={{ transform: 'rotate(45deg) translateY(-1500%) translateX(20%)' }}
                    ></div>
                    <div 
                      className="absolute top-0 left-1/2 w-1 h-3 bg-gray-300 -translate-x-1/2"
                      style={{ transform: 'rotate(90deg) translateY(-1500%) translateX(90%)' }}
                    ></div>
                    <div 
                      className="absolute top-0 left-1/2 w-1 h-3 bg-gray-300 -translate-x-1/2"
                      style={{ transform: 'rotate(135deg) translateY(-800%) translateX(130%)' }}
                    ></div>
                    <div 
                      className="absolute top-0 left-1/2 w-1 h-3 bg-gray-300 -translate-x-1/2"
                      style={{ transform: 'rotate(180deg) translateY(-300%) translateX(0%)' }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Max Speed</p>
                    <p className="font-semibold">{vehicleControlStatus.speed.max} km/h</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Average</p>
                    <p className="font-semibold">{vehicleControlStatus.speed.average} km/h</p>
                  </div>
                </div>
                
                <div className="mt-4 w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Speed Limit Alert</span>
                    <span className="font-medium">80 km/h</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '66.7%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Geofencing Control */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Geofencing Control
              </CardTitle>
              <CardDescription>
                Set location boundaries for your vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="geofence-toggle">Enable Geofencing</Label>
                <Switch 
                  id="geofence-toggle"
                  checked={geofenceEnabled}
                  onCheckedChange={toggleGeofence}
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="geofence-radius">Geofence Radius</Label>
                    <span className="text-sm font-medium">{geofenceRadius} km</span>
                  </div>
                  <Slider
                    id="geofence-radius"
                    min={1}
                    max={10}
                    step={1}
                    value={[geofenceRadius]}
                    onValueChange={(value) => setGeofenceRadius(value[0])}
                    disabled={!geofenceEnabled}
                  />
                </div>
                
                <div className="p-2 rounded-md bg-gray-50 flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Current Center</p>
                    <p className="text-xs text-gray-500">{vehicleControlStatus.location.address}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" disabled={!geofenceEnabled}>
                    Set Current Location
                  </Button>
                  <Button variant="outline" disabled={!geofenceEnabled}>
                    View on Map
                  </Button>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Alerts received</span>
                  <Badge variant="outline" className="font-medium">
                    {vehicleControlStatus.geofence.alerts}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      
      {/* Advanced OBD2+GPS Features */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          Advanced OBD2+GPS Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {advancedGpsObd2Features.map(feature => (
            <Card 
              key={feature.id}
              className={`hover:shadow-md transition-shadow ${
                feature.status === 'active' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-gray-300'
              }`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {React.cloneElement(feature.icon, { className: `h-5 w-5 ${feature.status === 'active' ? '' : 'text-gray-400'}` })}
                  {feature.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-3">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={
                      feature.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-gray-50 text-gray-500 border-gray-200'
                    }
                  >
                    {feature.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button size="sm" variant="ghost">Configure</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs value={mainTab} onValueChange={setMainTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full max-w-4xl">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="vehicle-health">Vehicle Health</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="advanced">Core Features</TabsTrigger>
          <TabsTrigger value="ai-features">AI Features</TabsTrigger>
        </TabsList>

        {/* DASHBOARD TAB */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vehicle Health Score KPI */}
            <Card className="md:col-span-3 bg-gradient-to-r from-[#F8F9FA] to-[#F0F8FF]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-[#0056B3]" />
                  Vehicle Health Score
                </CardTitle>
                <CardDescription>Overall vehicle condition index combining all systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative h-36 w-36 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#28A745"
                        strokeWidth="12"
                        strokeDasharray="339.292"
                        strokeDashoffset="84.823" // 25% from full (339.292 * (1 - 0.75))
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold">87</span>
                      <span className="text-xs text-muted-foreground">out of 100</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Engine</span>
                        <span className="text-sm font-medium text-[#28A745]">92%</span>
                      </div>
                      <Progress value={92} className="h-2 bg-gray-100" indicatorClassName="bg-[#28A745]" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Transmission</span>
                        <span className="text-sm font-medium text-[#88C34A]">86%</span>
                      </div>
                      <Progress value={86} className="h-2 bg-gray-100" indicatorClassName="bg-[#88C34A]" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Brakes</span>
                        <span className="text-sm font-medium text-[#FFC107]">74%</span>
                      </div>
                      <Progress value={74} className="h-2 bg-gray-100" indicatorClassName="bg-[#FFC107]" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Battery</span>
                        <span className="text-sm font-medium text-[#FF9800]">68%</span>
                      </div>
                      <Progress value={68} className="h-2 bg-gray-100" indicatorClassName="bg-[#FF9800]" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">View Full Report</Button>
              </CardFooter>
            </Card>
            
            {/* Three KPI Cards */}
            <Card className="border-l-4 border-l-[#FFC107]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#FFC107]" />
                  Predictive Failure Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">6 months</p>
                <p className="text-sm text-muted-foreground">Until brake pad replacement recommended</p>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-yellow-400" style={{ width: '65%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-[#00A3A3]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-[#00A3A3]" />
                  Efficiency Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">12.4%</p>
                <p className="text-sm text-muted-foreground">Potential fuel efficiency improvement</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#00A3A3]/10 flex items-center justify-center">
                    <Check className="h-3 w-3 text-[#00A3A3]" />
                  </div>
                  <span className="text-xs text-muted-foreground">3 optimization recommendations</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-[#28A745]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#28A745]" />
                  Maintenance Cost Avoidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹12,450</p>
                <p className="text-sm text-muted-foreground">Estimated savings year-to-date</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#28A745]/10 flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-[#28A745]" />
                  </div>
                  <span className="text-xs text-muted-foreground">28% increase from last year</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Alerts */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>System notifications requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${alert.bgColor}`}>
                          {alert.icon}
                        </div>
                        <div>
                          <p className="font-medium">{alert.name}</p>
                          <p className="text-sm text-muted-foreground">{alert.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${alert.severityColor}`}>
                          {alert.severity}
                        </span>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs content would follow... keeping them minimal for now */}
        <TabsContent value="vehicle-health">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Health Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Vehicle health analytics content to be implemented.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predictive">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Predictive maintenance content to be implemented.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Location Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Location tracking content to be implemented.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Tabs value={advancedFeatureTab} onValueChange={setAdvancedFeatureTab}>
            <TabsList className="w-full border-b rounded-none">
              <TabsTrigger value="energy">Energy Monitor</TabsTrigger>
              <TabsTrigger value="efficiency">Efficiency Map</TabsTrigger>
              <TabsTrigger value="annotations">Collaborations</TabsTrigger>
              <TabsTrigger value="gamification">Gamification</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            <TabsContent value="energy" className="mt-4">
              <RealtimeEnergyMonitor />
            </TabsContent>
            <TabsContent value="efficiency" className="mt-4">
              <EfficiencyHeatMap />
            </TabsContent>
            <TabsContent value="annotations" className="mt-4">
              <CollaborativeAnnotations />
            </TabsContent>
            <TabsContent value="gamification" className="mt-4">
              <GamifiedDriverPerformance />
            </TabsContent>
            <TabsContent value="maintenance" className="mt-4">
              <MaintenanceTimeline />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="ai-features">
          <Tabs value={advancedAIFeatureTab} onValueChange={setAdvancedAIFeatureTab}>
            <TabsList className="w-full border-b rounded-none">
              <TabsTrigger value="route">Route Recommendation</TabsTrigger>
              <TabsTrigger value="driver">Driver Achievements</TabsTrigger>
              <TabsTrigger value="battery">Battery Health</TabsTrigger>
            </TabsList>
            <TabsContent value="route" className="mt-4">
              <AIRouteRecommendation />
            </TabsContent>
            <TabsContent value="driver" className="mt-4">
              <DriverAchievements />
            </TabsContent>
            <TabsContent value="battery" className="mt-4">
              <PredictiveBatteryHealth />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DrishtiEnhanced;