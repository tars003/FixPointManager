import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  Route, 
  StretchHorizontal,
  MessageSquare,
  Trophy,
  ScrollText,
  BatteryCharging,
  Share2,
  Brain,
  Globe,
  UserCog,
  Smartphone,
  RefreshCw,
  Wifi
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import custom components
import RealtimeEnergyMonitor from '@/components/drishti/realtime-energy-monitor';
import EfficiencyHeatMap from '@/components/drishti/efficiency-heat-map';
import CollaborativeAnnotations from '@/components/drishti/collaborative-annotations';
import GamifiedDriverPerformance from '@/components/drishti/gamified-driver-performance';
import MaintenanceTimeline from '@/components/drishti/maintenance-timeline';
import AIRouteRecommendation from '@/components/drishti/ai-route-recommendation';
import DriverAchievements from '@/components/drishti/driver-achievements';
import PredictiveBatteryHealth from '@/components/drishti/predictive-battery-health';

// Custom icons for the connection options
const CableIcon = (props: any) => (
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

const BluetoothIcon = (props: any) => (
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

const SimCardIcon = (props: any) => (
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

const Drishti: React.FC = () => {
  const [mainTab, setMainTab] = useState<string>('dashboard');
  const [advancedFeatureTab, setAdvancedFeatureTab] = useState<string>('energy');
  const [advancedAIFeatureTab, setAdvancedAIFeatureTab] = useState<string>('route');
  const [connectionMethod, setConnectionMethod] = useState<string>('bluetooth');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // Handle connect button click
  const handleConnect = () => {
    setIsConnected(true);
  };
  
  return (
    <div className="container px-4 py-6 mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#0056B3] p-2 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Drishti</h1>
            </div>
            <p className="text-muted-foreground max-w-3xl">
              Advanced Universal OBD2+GPS Device - Spatiotemporal intelligence system for vehicle 
              maintenance and optimization with edge AI computing.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 py-1 ${
                isConnected 
                  ? "border-emerald-200 text-emerald-600" 
                  : "border-amber-200 text-amber-600"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
              {isConnected ? "Device Connected" : "Not Connected"}
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Hardware Connection Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Hardware Connection</CardTitle>
            <CardDescription>Select your preferred connection method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2 mb-4">
                <Button
                  variant={connectionMethod === 'wire' ? "default" : "outline"}
                  className="flex flex-col py-3 h-auto"
                  onClick={() => setConnectionMethod('wire')}
                >
                  <CableIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">Wire</span>
                </Button>
                <Button
                  variant={connectionMethod === 'bluetooth' ? "default" : "outline"}
                  className="flex flex-col py-3 h-auto"
                  onClick={() => setConnectionMethod('bluetooth')}
                >
                  <BluetoothIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">Bluetooth</span>
                </Button>
                <Button
                  variant={connectionMethod === 'wifi' ? "default" : "outline"}
                  className="flex flex-col py-3 h-auto"
                  onClick={() => setConnectionMethod('wifi')}
                >
                  <Wifi className="h-5 w-5 mb-1" />
                  <span className="text-xs">WiFi</span>
                </Button>
                <Button
                  variant={connectionMethod === 'esim' ? "default" : "outline"}
                  className="flex flex-col py-3 h-auto"
                  onClick={() => setConnectionMethod('esim')}
                >
                  <Smartphone className="h-5 w-5 mb-1" />
                  <span className="text-xs">eSIM</span>
                </Button>
                <Button
                  variant={connectionMethod === 'simcard' ? "default" : "outline"}
                  className="flex flex-col py-3 h-auto"
                  onClick={() => setConnectionMethod('simcard')}
                >
                  <SimCardIcon className="h-5 w-5 mb-1" />
                  <span className="text-xs">SIM Card</span>
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Wire connection settings */}
                {connectionMethod === 'wire' && (
                  <>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="obd-port">OBD2 Port</Label>
                      <Select defaultValue="auto-detect">
                        <SelectTrigger id="obd-port">
                          <SelectValue placeholder="Select OBD2 port" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto-detect">Auto-detect</SelectItem>
                          <SelectItem value="usb">USB Connector</SelectItem>
                          <SelectItem value="serial">Serial Port</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="obd-protocol">OBD Protocol</Label>
                      <Select defaultValue="auto-detect">
                        <SelectTrigger id="obd-protocol">
                          <SelectValue placeholder="Select protocol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto-detect">Auto-detect</SelectItem>
                          <SelectItem value="iso9141">ISO 9141-2</SelectItem>
                          <SelectItem value="iso14230">ISO 14230-4 (KWP2000)</SelectItem>
                          <SelectItem value="iso15765">ISO 15765-4 (CAN)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                {/* Bluetooth connection settings */}
                {connectionMethod === 'bluetooth' && (
                  <>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="device-name">Device Name</Label>
                      <Select defaultValue="drishti-scanner">
                        <SelectTrigger id="device-name">
                          <SelectValue placeholder="Select device" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drishti-scanner">Drishti OBD2 Scanner</SelectItem>
                          <SelectItem value="generic-obd">Generic OBD2 Adapter</SelectItem>
                          <SelectItem value="elm327">ELM327 Bluetooth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="pairing-code">Pairing Code</Label>
                      <div className="grid grid-cols-4 gap-2">
                        <input 
                          type="text" 
                          maxLength={1} 
                          className="w-full h-12 text-center text-xl border rounded-md" 
                          defaultValue="1"
                        />
                        <input 
                          type="text" 
                          maxLength={1} 
                          className="w-full h-12 text-center text-xl border rounded-md" 
                          defaultValue="2"
                        />
                        <input 
                          type="text" 
                          maxLength={1} 
                          className="w-full h-12 text-center text-xl border rounded-md" 
                          defaultValue="3"
                        />
                        <input 
                          type="text" 
                          maxLength={1} 
                          className="w-full h-12 text-center text-xl border rounded-md" 
                          defaultValue="4"
                        />
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Scan for Devices
                    </Button>
                  </>
                )}
                
                {/* WiFi connection settings */}
                {connectionMethod === 'wifi' && (
                  <>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="wifi-network">WiFi Network</Label>
                      <Select defaultValue="home">
                        <SelectTrigger id="wifi-network">
                          <SelectValue placeholder="Select network" />
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
                      <div className="flex items-center space-x-2">
                        <input 
                          type="password" 
                          id="wifi-password"
                          className="w-full h-10 px-3 border rounded-md" 
                          defaultValue="password123"
                        />
                        <Button variant="outline" size="icon" className="h-10 w-10">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="save-network" className="rounded-sm" />
                      <Label htmlFor="save-network">Save network credentials</Label>
                    </div>
                  </>
                )}
                
                {/* eSIM connection settings */}
                {connectionMethod === 'esim' && (
                  <>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="esim-provider">eSIM Provider</Label>
                      <Select defaultValue="jio">
                        <SelectTrigger id="esim-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jio">Jio</SelectItem>
                          <SelectItem value="airtel">Airtel</SelectItem>
                          <SelectItem value="vodafone">Vodafone</SelectItem>
                          <SelectItem value="bsnl">BSNL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="esim-plan">Data Plan</Label>
                      <Select defaultValue="basic">
                        <SelectTrigger id="esim-plan">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (1GB/month)</SelectItem>
                          <SelectItem value="standard">Standard (5GB/month)</SelectItem>
                          <SelectItem value="premium">Premium (10GB/month)</SelectItem>
                          <SelectItem value="unlimited">Unlimited Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="p-3 rounded-md bg-blue-50 text-blue-700 text-sm">
                      <p>eSIM activation requires QR code from your service provider. Please ensure you have the activation QR code ready.</p>
                    </div>
                  </>
                )}
                
                {/* SIM Card connection settings */}
                {connectionMethod === 'simcard' && (
                  <>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="sim-number">SIM Card Number</Label>
                      <input 
                        type="text" 
                        id="sim-number"
                        className="w-full h-10 px-3 border rounded-md" 
                        placeholder="Enter SIM card number"
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="apn-settings">APN Settings</Label>
                      <input 
                        type="text" 
                        id="apn-settings"
                        className="w-full h-10 px-3 border rounded-md" 
                        defaultValue="internet"
                        placeholder="Access Point Name"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="data-roaming" className="cursor-pointer">Enable Data Roaming</Label>
                      <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full bg-gray-200">
                        <input
                          type="checkbox"
                          id="data-roaming"
                          className="absolute w-0 h-0 opacity-0"
                        />
                        <label
                          htmlFor="data-roaming"
                          className="absolute left-0 w-5 h-5 transition duration-100 ease-in-out transform bg-white border rounded-full cursor-pointer"
                          style={{ transform: 'translateX(0)' }}
                        ></label>
                      </div>
                    </div>
                  </>
                )}
                
                <Button 
                  onClick={handleConnect}
                  className="bg-green-500 hover:bg-green-600 text-white w-full"
                >
                  Connect {connectionMethod === 'bluetooth' ? 'via Bluetooth' : 
                           connectionMethod === 'wifi' ? 'via WiFi' : 
                           connectionMethod === 'esim' ? 'with eSIM' : 
                           connectionMethod === 'simcard' ? 'with SIM Card' : 
                           'with Wire'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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

        {/* VEHICLE HEALTH TAB */}
        <TabsContent value="vehicle-health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Diagnostic Overview</CardTitle>
                <CardDescription>Comprehensive system-by-system analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicleSystemStatus.map((system, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${system.bgColor}`}>
                          {system.icon}
                        </div>
                        <span>{system.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={system.health} className="w-24 h-2" 
                          indicatorClassName={`${getHealthColorClass(system.health)}`} />
                        <span className={`text-sm font-medium ${getHealthTextClass(system.health)}`}>
                          {system.health}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Run Comprehensive Scan</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Logs</CardTitle>
                <CardDescription>Detected issues and diagnostic codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {errorLogs.map((log, index) => (
                    <div key={index} className="p-3 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getSeverityBgColor(log.severity)}`}></div>
                          <span className="font-medium">{log.code}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.date}</span>
                      </div>
                      <p className="text-sm mb-1">{log.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button variant="ghost" size="sm">Clear</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Historical Health Trends</CardTitle>
              <CardDescription>Track your vehicle's health over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/60" />
                  <p className="mt-2 text-muted-foreground">Historical health data visualization will appear here</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-medium text-lg">Time Period</h3>
                <RadioGroup defaultValue="6month" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30day" id="30day" />
                    <Label htmlFor="30day">30 Days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6month" id="6month" />
                    <Label htmlFor="6month">6 Months</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1year" id="1year" />
                    <Label htmlFor="1year">1 Year</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREDICTIVE MAINTENANCE TAB */}
        <TabsContent value="predictive" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Component Longevity Forecast</CardTitle>
                <CardDescription>AI-generated predictions for critical components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-32 overflow-hidden my-6">
                  <div className="absolute w-full h-1 bg-gray-200 top-1/2 transform -translate-y-1/2"></div>
                  {/* Timeline markers */}
                  {componentPredictions.map((component, index) => (
                    <div 
                      key={index}
                      className="absolute top-1/2 transform -translate-y-1/2"
                      style={{ left: `${component.timelinePosition}%` }}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${getSeverityBgColor(component.urgency)} mb-2`}></div>
                        <div className="whitespace-nowrap text-sm font-medium -ml-10 w-20 text-center">
                          {component.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {component.timeFrame}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Current time marker */}
                  <div className="absolute top-0 left-5 h-full flex items-center">
                    <div className="h-full w-px bg-gray-400 relative">
                      <div className="absolute -left-[9px] top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center">
                        <span className="text-xs">Now</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {componentPredictions.slice(0, 2).map((component, index) => (
                    <Card key={index} className="bg-gray-50">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base">{component.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm mb-1">Estimated replacement: <span className="font-medium">{component.timeFrame}</span></p>
                            <p className="text-sm text-muted-foreground">Confidence: {component.confidence}%</p>
                          </div>
                          <Button size="sm">Schedule</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto">View All Components</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Maintenance</CardTitle>
                <CardDescription>Recommended service schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMaintenance.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Due in {item.dueIn}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <Button variant="outline" size="sm">Schedule</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Maintenance Cost Projections</CardTitle>
                <CardDescription>Estimated expenses and ROI analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center border rounded-md bg-muted/20 mb-4">
                  <div className="text-center">
                    <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground/60" />
                    <p className="mt-2 text-muted-foreground">Cost projections visualization will appear here</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Projected Annual Savings</p>
                    <p className="text-xl font-bold">₹24,800</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">ROI on Drishti Device</p>
                    <p className="text-xl font-bold">428%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* LOCATION INTELLIGENCE TAB */}
        <TabsContent value="location" className="space-y-6">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Geo-Contextual Performance</CardTitle>
              <CardDescription>Location-based vehicle performance assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md relative">
                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=28.644800,77.216721&zoom=11&size=800x400&maptype=roadmap&key=AIzaSyCkxx')]
                  bg-cover bg-center rounded-md">
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 bg-white/90 rounded-lg shadow-md">
                    <MapPin className="h-12 w-12 mx-auto text-[#0056B3]" />
                    <p className="mt-2 text-center">Interactive map visualization will appear here</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Route className="h-4 w-4 text-[#0056B3]" />
                    <h3 className="font-medium">Route Analysis</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Identify high-stress zones for your vehicle</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-[#0056B3]" />
                    <h3 className="font-medium">Performance Heatmap</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Visualize performance variations by location</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <StretchHorizontal className="h-4 w-4 text-[#0056B3]" />
                    <h3 className="font-medium">Route Optimization</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Find optimal routes based on vehicle health</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Analytics</CardTitle>
                <CardDescription>Journey logging and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrips.map((trip, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                      <div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#0056B3]" />
                          <p className="font-medium">{trip.route}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{trip.date} • {trip.distance}</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">View All Trips</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Driver Behavior Insights</CardTitle>
                <CardDescription>Efficiency optimization based on driving patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Driving Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16">
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
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">82</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm mb-1">Good driving habits</p>
                        <p className="text-xs text-muted-foreground">Recommendation: Reduce hard braking</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Key Metrics</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Avg. Speed</p>
                        <p className="font-medium">42 km/h</p>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Harsh Braking</p>
                        <p className="font-medium">3.2 / 100km</p>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Idle Time</p>
                        <p className="font-medium">8%</p>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Eco Score</p>
                        <p className="font-medium">76/100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CORE FEATURES TAB */}
        <TabsContent value="advanced" className="space-y-6">
          {/* Advanced Features Tabs */}
          <Tabs value={advancedFeatureTab} onValueChange={setAdvancedFeatureTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="energy" className="gap-1">
                <Droplet className="h-4 w-4" />
                <span className="hidden sm:inline-block">Energy</span>
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="gap-1">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline-block">Heatmap</span>
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="gap-1">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline-block">Collaborate</span>
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="gap-1">
                <ScrollText className="h-4 w-4" />
                <span className="hidden sm:inline-block">Timeline</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="energy" className="pt-6">
              <RealtimeEnergyMonitor />
            </TabsContent>
            
            <TabsContent value="heatmap" className="pt-6">
              <EfficiencyHeatMap />
            </TabsContent>
            
            <TabsContent value="collaboration" className="pt-6">
              <CollaborativeAnnotations />
            </TabsContent>
            
            <TabsContent value="maintenance" className="pt-6">
              <MaintenanceTimeline />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ADVANCED AI FEATURES TAB */}
        <TabsContent value="ai-features" className="space-y-6">
          <Card className="bg-gradient-to-r from-indigo-50 to-transparent border-indigo-100 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Brain className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-medium">Advanced AI-Driven Features</h2>
                  <p className="text-sm text-muted-foreground">Cutting-edge machine learning technologies to enhance your driving experience</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={advancedAIFeatureTab} onValueChange={setAdvancedAIFeatureTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="route" className="gap-1">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline-block">AI Route Planning</span>
                <span className="inline-block sm:hidden">Routes</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="gap-1">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline-block">Achievements</span>
                <span className="inline-block sm:hidden">Achieve</span>
              </TabsTrigger>
              <TabsTrigger value="battery" className="gap-1">
                <BatteryCharging className="h-4 w-4" />
                <span className="hidden sm:inline-block">Battery Health</span>
                <span className="inline-block sm:hidden">Battery</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="route" className="pt-6">
              <AIRouteRecommendation />
            </TabsContent>
            
            <TabsContent value="social" className="pt-6">
              <DriverAchievements />
            </TabsContent>
            
            <TabsContent value="battery" className="pt-6">
              <PredictiveBatteryHealth />
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#6366F1]" />
                  Predictive Collision Avoidance
                </CardTitle>
                <CardDescription>
                  Early warning system based on driving patterns and environmental conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border bg-muted/20 rounded-md">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 opacity-50" />
                    <p className="mt-2 text-sm text-muted-foreground">Advanced collision detection system coming soon</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">Learn More</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="h-5 w-5 text-purple-600" />
                  Emotional Intelligence Feedback
                </CardTitle>
                <CardDescription>
                  Personalized coaching based on driver emotional states
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border bg-muted/20 rounded-md">
                  <div className="text-center">
                    <UserCog className="h-12 w-12 mx-auto text-purple-600 opacity-50" />
                    <p className="mt-2 text-sm text-muted-foreground">Voice pattern analysis system coming soon</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper functions for conditional styling
const getHealthColorClass = (health: number) => {
  if (health >= 85) return 'bg-[#28A745]';
  if (health >= 70) return 'bg-[#88C34A]';
  if (health >= 50) return 'bg-[#FFC107]';
  if (health >= 30) return 'bg-[#FF9800]';
  return 'bg-[#DC3545]';
};

const getHealthTextClass = (health: number) => {
  if (health >= 85) return 'text-[#28A745]';
  if (health >= 70) return 'text-[#88C34A]';
  if (health >= 50) return 'text-[#FFC107]';
  if (health >= 30) return 'text-[#FF9800]';
  return 'text-[#DC3545]';
};

type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

const getSeverityBgColor = (severity: SeverityLevel | string) => {
  switch (severity as SeverityLevel) {
    case 'low': return 'bg-[#28A745]';
    case 'medium': return 'bg-[#FFC107]';
    case 'high': return 'bg-[#FF9800]';
    case 'critical': return 'bg-[#DC3545]';
    default: return 'bg-gray-400';
  }
};

// Sample data for the vehicle health systems
const vehicleSystemStatus = [
  {
    name: 'Engine System',
    health: 92,
    icon: <Gauge className="h-4 w-4 text-[#28A745]" />,
    bgColor: 'bg-[#28A745]/10',
  },
  {
    name: 'Transmission',
    health: 86,
    icon: <Activity className="h-4 w-4 text-[#88C34A]" />,
    bgColor: 'bg-[#88C34A]/10',
  },
  {
    name: 'Fuel System',
    health: 88,
    icon: <Droplet className="h-4 w-4 text-[#28A745]" />,
    bgColor: 'bg-[#28A745]/10',
  },
  {
    name: 'Brake System',
    health: 74,
    icon: <AlertTriangle className="h-4 w-4 text-[#FFC107]" />,
    bgColor: 'bg-[#FFC107]/10',
  },
  {
    name: 'Battery/Charging',
    health: 68,
    icon: <Battery className="h-4 w-4 text-[#FF9800]" />,
    bgColor: 'bg-[#FF9800]/10',
  },
  {
    name: 'Exhaust System',
    health: 81,
    icon: <Activity className="h-4 w-4 text-[#88C34A]" />,
    bgColor: 'bg-[#88C34A]/10',
  },
];

// Sample data for error logs
const errorLogs = [
  {
    code: 'P0420',
    description: 'Catalyst System Efficiency Below Threshold',
    date: '2 days ago',
    severity: 'medium',
  },
  {
    code: 'P0300',
    description: 'Random/Multiple Cylinder Misfire Detected',
    date: '1 week ago',
    severity: 'high',
  },
  {
    code: 'B1000',
    description: 'Driver\'s Airbag Igniter Circuit Resistance High',
    date: '2 weeks ago',
    severity: 'critical',
  },
];

// Sample data for component predictions
const componentPredictions = [
  {
    name: 'Brake Pads',
    timeFrame: '6 months',
    confidence: 86,
    urgency: 'medium',
    timelinePosition: 30, // position on timeline (%)
  },
  {
    name: 'Fuel Pump',
    timeFrame: '14 months',
    confidence: 72,
    urgency: 'low',
    timelinePosition: 70, // position on timeline (%)
  },
  {
    name: 'Air Filter',
    timeFrame: '3 months',
    confidence: 92,
    urgency: 'medium',
    timelinePosition: 15, // position on timeline (%)
  },
  {
    name: 'Battery',
    timeFrame: '18 months',
    confidence: 65,
    urgency: 'low',
    timelinePosition: 90, // position on timeline (%)
  },
];

// Sample data for upcoming maintenance
const upcomingMaintenance = [
  {
    name: 'Oil Change',
    dueIn: '2 weeks',
  },
  {
    name: 'Air Filter Replacement',
    dueIn: '3 months',
  },
  {
    name: 'Brake Inspection',
    dueIn: '4 months',
  },
];

// Sample data for recent trips
const recentTrips = [
  {
    route: 'Home to Office',
    date: 'Today, 9:15 AM',
    distance: '12.4 km',
  },
  {
    route: 'Office to Shopping Mall',
    date: 'Yesterday, 6:30 PM',
    distance: '5.7 km',
  },
  {
    route: 'Home to Airport',
    date: 'May 24, 11:20 AM',
    distance: '28.3 km',
  },
];

// Sample data for the recent alerts
const recentAlerts = [
  {
    name: "Brake Pad Wear",
    time: "Today, 2:30 PM",
    severity: "Warning",
    severityColor: "text-amber-500",
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    bgColor: "bg-amber-100",
  },
  {
    name: "Oil Change Due",
    time: "Today, 1:45 PM",
    severity: "Reminder",
    severityColor: "text-blue-500",
    icon: <Clock className="h-4 w-4 text-blue-500" />,
    bgColor: "bg-blue-100",
  },
  {
    name: "Battery Voltage Low",
    time: "Yesterday, 6:20 PM",
    severity: "Warning",
    severityColor: "text-amber-500",
    icon: <Battery className="h-4 w-4 text-amber-500" />,
    bgColor: "bg-amber-100",
  },
  {
    name: "Coolant Temperature High",
    time: "May 22, 3:15 PM",
    severity: "Critical",
    severityColor: "text-red-500",
    icon: <Thermometer className="h-4 w-4 text-red-500" />,
    bgColor: "bg-red-100",
  },
];

export default Drishti;