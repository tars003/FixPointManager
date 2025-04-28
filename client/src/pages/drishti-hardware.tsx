import React, { useState, useEffect } from 'react';
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
  AlertTriangle, 
  Check, 
  Clock, 
  Heart, 
  Wrench, 
  MapPin, 
  TrendingUp, 
  Droplet, 
  Thermometer, 
  Battery, 
  Activity, 
  Power,
  Target,
  Smartphone,
  RefreshCw,
  Zap,
  Car,
  History,
  ArrowUpRight
} from 'lucide-react';

const DrishtiHardware: React.FC = () => {
  // Connection state
  const [connectionMethod, setConnectionMethod] = useState("bluetooth");
  const [isConnected, setIsConnected] = useState(true);
  const [engineStatus, setEngineStatus] = useState(false);
  const [geofenceEnabled, setGeofenceEnabled] = useState(true);
  const [geofenceRadius, setGeofenceRadius] = useState(5);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  
  // Simulate vehicle behavior
  useEffect(() => {
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
  
  // Toggle engine
  const toggleEngine = () => {
    setEngineStatus(!engineStatus);
  };
  
  // Toggle geofence
  const toggleGeofence = () => {
    setGeofenceEnabled(!geofenceEnabled);
  };
  
  return (
    <div className="container px-4 py-6 mx-auto">
      {/* Header */}
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
              <h1 className="text-3xl font-bold tracking-tight">Drishti OBD2+GPS</h1>
              <p className="text-muted-foreground">
                Advanced Vehicle Monitoring System
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
      
      {/* Connection Methods Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Hardware Connection</CardTitle>
            <CardDescription>Select your preferred connection method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={connectionMethod} onValueChange={setConnectionMethod} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="wire" className="flex flex-col gap-2 py-3">
                  <svg 
                    className="h-5 w-5 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z" />
                    <path d="M9 9v6" />
                    <path d="M15 9v6" />
                  </svg>
                  <span className="text-xs">Wire</span>
                </TabsTrigger>
                <TabsTrigger value="bluetooth" className="flex flex-col gap-2 py-3">
                  <svg 
                    className="h-5 w-5 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m7 7 10 10-5 5V2l5 5L7 17" />
                  </svg>
                  <span className="text-xs">Bluetooth</span>
                </TabsTrigger>
                <TabsTrigger value="wifi" className="flex flex-col gap-2 py-3">
                  <svg 
                    className="h-5 w-5 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13a10 10 0 0 1 14 0" />
                    <path d="M8.5 16.5a5 5 0 0 1 7 0" />
                    <path d="M2 8.82a15 15 0 0 1 20 0" />
                    <line x1="12" y1="20" x2="12" y2="20" />
                  </svg>
                  <span className="text-xs">WiFi</span>
                </TabsTrigger>
                <TabsTrigger value="esim" className="flex flex-col gap-2 py-3">
                  <Smartphone className="h-5 w-5 mx-auto" />
                  <span className="text-xs">eSIM</span>
                </TabsTrigger>
                <TabsTrigger value="simcard" className="flex flex-col gap-2 py-3">
                  <svg 
                    className="h-5 w-5 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                  <span className="text-xs">SIM Card</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="bluetooth">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                      <svg 
                        className="h-12 w-12 text-blue-500 mb-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m7 7 10 10-5 5V2l5 5L7 17" />
                      </svg>
                      <h3 className="text-lg font-semibold mb-1">Bluetooth Connection</h3>
                      <p className="text-sm text-gray-600 mb-4">Wireless BLE connection to your vehicle</p>
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Convenient</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Easy setup</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>No cabling required</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Connection Status</h3>
                      <Badge
                        className={
                          isConnected 
                            ? "bg-green-100 text-green-700" 
                            : "bg-amber-100 text-amber-700"
                        }
                      >
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                    
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
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="wifi">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                      <svg 
                        className="h-12 w-12 text-blue-500 mb-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 13a10 10 0 0 1 14 0" />
                        <path d="M8.5 16.5a5 5 0 0 1 7 0" />
                        <path d="M2 8.82a15 15 0 0 1 20 0" />
                        <line x1="12" y1="20" x2="12" y2="20" />
                      </svg>
                      <h3 className="text-lg font-semibold mb-1">WiFi Connection</h3>
                      <p className="text-sm text-gray-600 mb-4">Connect using local WiFi network</p>
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Home network integration</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Medium range</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Fast data transfer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
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
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="wire">
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
              </TabsContent>
              
              <TabsContent value="esim">
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
              </TabsContent>
              
              <TabsContent value="simcard">
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Vehicle Control Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Vehicle Control Center</h2>
        
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
                <svg 
                  className="h-5 w-5 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="M20 12h2" />
                  <path d="M2 12h2" />
                  <path d="m16 8-4 4" />
                </svg>
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
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Max Speed</p>
                    <p className="font-semibold">120 km/h</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Average</p>
                    <p className="font-semibold">45 km/h</p>
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
                    <p className="text-xs text-gray-500">Mumbai, Maharashtra, India</p>
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
                    3
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
          {/* Realtime Tracking */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <svg 
                  className="h-5 w-5 text-blue-500" 
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
                Realtime Vehicle Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">Live location tracking with 5-second intervals</p>
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-600 border-emerald-200"
                >
                  Active
                </Badge>
                <Button size="sm" variant="ghost">Configure</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Driving Behavior */}
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" />
                Driving Behavior Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">AI analysis of acceleration, braking, and cornering patterns</p>
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-600 border-emerald-200"
                >
                  Active
                </Badge>
                <Button size="sm" variant="ghost">Configure</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Trip History */}
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-500" />
                Trip History Replay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">Visualize past trips with detailed route information</p>
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-600 border-emerald-200"
                >
                  Active
                </Badge>
                <Button size="sm" variant="ghost">Configure</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Fuel Monitoring */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <svg 
                  className="h-5 w-5 text-green-500" 
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" />
                  <path d="M10 10v11" />
                  <path d="M7 13h6" />
                </svg>
                Fuel Consumption Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">Track fuel levels, consumption rates, and efficiency patterns</p>
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-600 border-emerald-200"
                >
                  Active
                </Badge>
                <Button size="sm" variant="ghost">Configure</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Dashcam */}
          <Card className="border-l-4 border-l-gray-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <svg 
                  className="h-5 w-5 text-gray-400" 
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 8-6 4 6 4V8Z" />
                  <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                </svg>
                Integrated Dashcam
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">Event-triggered video recording with cloud storage</p>
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-500 border-gray-200"
                >
                  Inactive
                </Badge>
                <Button size="sm" variant="ghost">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      
      {/* Vehicle Health Score KPI - Compact Version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-[#F8F9FA] to-[#F0F8FF]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#0056B3]" />
              Vehicle Health Score
            </CardTitle>
            <CardDescription>Overall vehicle condition index</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative h-28 w-28 flex items-center justify-center">
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
                  <Progress value={92} className="h-2 bg-gray-100" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Transmission</span>
                    <span className="text-sm font-medium text-[#88C34A]">86%</span>
                  </div>
                  <Progress value={86} className="h-2 bg-gray-100" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Brakes</span>
                    <span className="text-sm font-medium text-[#FFC107]">74%</span>
                  </div>
                  <Progress value={74} className="h-2 bg-gray-100" />
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2 ml-auto">
                <Button>View Full Report</Button>
                <span className="text-xs text-muted-foreground">Last updated: 2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DrishtiHardware;