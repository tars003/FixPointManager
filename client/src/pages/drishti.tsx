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
  Wifi,
  Power,
  Target,
  Zap,
  History as HistoryIcon,
  AlertCircle,
  HelpCircle,
  X,
  Cpu,
  Upload,
  Download,
  LineChart,
  Sliders,
  SwitchCamera,
  Radio,
  Info,
  Play,
  ExternalLink,
  Lightbulb,
  Save,
  ChevronRight,
  CheckCircle,
  Cog,
  RotateCcw
} from 'lucide-react';

// Custom icons are defined below
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

// Define feature configuration dialog type
type ConfigDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  featureId: string;
  isActive: boolean;
  toggleActive: (id: string) => void;
};

// Define severity level type
type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

// Define troubleshooting issue type
type TroubleshootingIssue = {
  id: string;
  title: string;
  description: string;
  solutions: string[];
  severity: SeverityLevel;
};

const Drishti: React.FC = () => {
  const [mainTab, setMainTab] = useState<string>('dashboard');
  const [advancedFeatureTab, setAdvancedFeatureTab] = useState<string>('energy');
  const [advancedAIFeatureTab, setAdvancedAIFeatureTab] = useState<string>('route');
  const [connectionMethod, setConnectionMethod] = useState<string>('bluetooth');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [engineOn, setEngineOn] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState<boolean>(false);
  const [currentFeature, setCurrentFeature] = useState<string>('');
  const [activeFeatures, setActiveFeatures] = useState<{[key: string]: boolean}>({
    'realtime-tracking': true,
    'driving-behavior': true,
    'trip-history': true,
    'fuel-consumption': true,
    'dashcam': false
  });
  const [troubleshootingOpen, setTroubleshootingOpen] = useState<boolean>(false);
  const [networkTestOpen, setNetworkTestOpen] = useState<boolean>(false);
  const [networkSpeed, setNetworkSpeed] = useState<number | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false);
  const [recommendationOpen, setRecommendationOpen] = useState<boolean>(false);
  
  // Handle connect button click with animated status changes
  const handleConnect = () => {
    setConnectionStatus('connecting');
    setConnectionError(null);
    
    // Simulate connection process
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      if (success) {
        setConnectionStatus('connected');
        setIsConnected(true);
      } else {
        setConnectionStatus('error');
        setConnectionError('Connection failed. Please check your device and try again.');
      }
    }, 2000);
  };
  
  // Handle engine power toggle
  const toggleEngine = () => {
    setEngineOn(!engineOn);
  };
  
  // Toggle feature active status
  const toggleFeatureActive = (featureId: string) => {
    setActiveFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };
  
  // Open configuration dialog for a feature
  const openConfigDialog = (featureId: string) => {
    setCurrentFeature(featureId);
    setConfigDialogOpen(true);
  };
  
  // Get feature details by ID
  const getFeatureDetails = (featureId: string) => {
    const details = {
      'realtime-tracking': {
        title: 'Realtime Vehicle Tracking',
        description: 'Configure live location tracking settings including refresh interval and precision level.'
      },
      'driving-behavior': {
        title: 'Driving Behavior Analysis',
        description: 'Adjust sensitivity levels for acceleration, braking, and cornering detection.'
      },
      'trip-history': {
        title: 'Trip History Replay',
        description: 'Set recording parameters and storage options for your trip data.'
      },
      'fuel-consumption': {
        title: 'Fuel Consumption Analytics',
        description: 'Configure fuel monitoring parameters and reporting intervals.'
      },
      'dashcam': {
        title: 'Integrated Dashcam',
        description: 'Set recording quality, event triggers, and storage options for video capture.'
      }
    };
    return details[featureId as keyof typeof details];
  };
  
  // Run network speed test
  const runNetworkTest = () => {
    setNetworkSpeed(null);
    // Simulate network test
    setTimeout(() => {
      setNetworkSpeed(Math.floor(Math.random() * 50) + 10); // 10-60 Mbps
    }, 1500);
  };
  
  // Get recommended connection method based on device
  const getRecommendedConnection = () => {
    const options = [
      { method: 'bluetooth', reason: 'Best for quick connections with minimal setup' },
      { method: 'wifi', reason: 'Recommended for stable, high-bandwidth data transfer' },
      { method: 'wire', reason: 'Most reliable connection for diagnostic operations' }
    ];
    return options[Math.floor(Math.random() * options.length)];
  };
  
  // Common troubleshooting issues
  const troubleshootingIssues: TroubleshootingIssue[] = [
    {
      id: 'connection-failed',
      title: 'Connection Failed',
      description: 'Unable to establish connection with the OBD2 device',
      severity: 'high',
      solutions: [
        'Ensure the device is powered on and within range',
        'Restart the device and try connecting again',
        'Check if device is paired with another phone or tablet',
        'Try a different connection method (e.g., wire instead of Bluetooth)'
      ]
    },
    {
      id: 'data-error',
      title: 'Incorrect Data Reading',
      description: 'Device is connected but showing incorrect or no data',
      severity: 'medium',
      solutions: [
        'Make sure the vehicle ignition is on',
        'Verify the OBD2 port is compatible with your vehicle',
        'Try selecting a specific OBD protocol instead of Auto-detect',
        'Update the device firmware if available'
      ]
    },
    {
      id: 'disconnects',
      title: 'Frequent Disconnections',
      description: 'Device keeps disconnecting during usage',
      severity: 'medium',
      solutions: [
        'Move closer to the OBD2 device if using Bluetooth or WiFi',
        'Check for interference from other electronic devices',
        'Ensure the device has sufficient battery power',
        'Try switching to a wired connection for more stability'
      ]
    }
  ];
  
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
                
                <div className="space-y-3">
                  {connectionError && (
                    <div className="p-2 bg-red-50 border border-red-100 rounded-md flex items-start gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Connection failed</p>
                        <p>{connectionError}</p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-red-600 underline"
                          onClick={() => setTroubleshootingOpen(true)}
                        >
                          View troubleshooting guide
                        </Button>
                      </div>
                    </div>
                  )}
                
                  <Button 
                    onClick={handleConnect}
                    className={`${
                      connectionStatus === 'connecting' 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white w-full h-11 relative overflow-hidden transition-colors`}
                    disabled={connectionStatus === 'connecting'}
                  >
                    {connectionStatus === 'connecting' ? (
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      <span>
                        Connect {connectionMethod === 'bluetooth' ? 'via Bluetooth' : 
                                connectionMethod === 'wifi' ? 'via WiFi' : 
                                connectionMethod === 'esim' ? 'with eSIM' : 
                                connectionMethod === 'simcard' ? 'with SIM Card' : 
                                'with Wire'}
                      </span>
                    )}
                  </Button>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTroubleshootingOpen(true)}
                      className="flex-1"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Troubleshoot
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setNetworkTestOpen(true)}
                      className="flex-1"
                    >
                      <LineChart className="h-4 w-4 mr-2" />
                      Test Speed
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTutorialOpen(true)}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Tutorial
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setRecommendationOpen(true)}
                      className="flex-1"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Recommend
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Vehicle Control Center */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Vehicle Control Center</CardTitle>
            <CardDescription>Monitor and control your vehicle remotely</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Remote Engine Control */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Power className="h-5 w-5 text-gray-500" />
                    Remote Engine Control
                  </CardTitle>
                  <CardDescription>Remotely turn your vehicle's engine on/off</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`w-28 h-28 rounded-full ${engineOn ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center mx-auto mb-4`}>
                    <Power className={`h-12 w-12 ${engineOn ? 'text-green-500' : 'text-gray-400'}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{engineOn ? 'Engine On' : 'Engine Off'}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {engineOn 
                      ? 'Vehicle engine is currently running' 
                      : 'Vehicle engine is currently turned off'}
                  </p>
                  <Button 
                    className={`${engineOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                    onClick={toggleEngine}
                  >
                    <Power className="h-4 w-4 mr-2" />
                    {engineOn ? 'Turn Off Engine' : 'Turn On Engine'}
                  </Button>
                </CardContent>
              </Card>
              
              {/* Live Speed Monitoring */}
              <Card className="border shadow-sm">
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
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="M20 12h2" />
                      <path d="M2 12h2" />
                      <path d="m16 8-4 4" />
                    </svg>
                    Live Speed Monitoring
                  </CardTitle>
                  <CardDescription>Current vehicle speed and tracking</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-100 flex items-center justify-center mx-auto mb-2 relative">
                    <div>
                      <span className="text-3xl font-bold">0</span>
                      <span className="text-sm">km/h</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Max Speed</p>
                      <p className="font-semibold">120 km/h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Average</p>
                      <p className="font-semibold">45 km/h</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Speed Limit Alert</span>
                      <span className="font-medium">80 km/h</span>
                    </div>
                    <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Geofencing Control */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Geofencing Control
                  </CardTitle>
                  <CardDescription>Set location boundaries for your vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="geofence-toggle">Enable Geofencing</Label>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white data-[state=checked]:bg-green-500">
                      <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition-transform data-[state=checked]:translate-x-6" style={{ transform: 'translateX(20px)' }}></span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="geofence-radius">Geofence Radius</Label>
                      <span className="text-sm font-medium">3 km</span>
                    </div>
                    <div className="w-full h-2 bg-green-100 rounded-full">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-2 mb-4 rounded-md bg-gray-50 flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Current Center</p>
                      <p className="text-xs text-gray-500">Mumbai, Maharashtra, India</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      Set Current Location
                    </Button>
                    <Button variant="outline" size="sm">
                      View on Map
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-gray-500">Alerts received</span>
                    <Badge variant="outline">3</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Advanced OBD2+GPS Features */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <CardTitle>Advanced OBD2+GPS Features</CardTitle>
            </div>
            <CardDescription>Enhanced monitoring and analytics capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Realtime Vehicle Tracking */}
              <Card className="border shadow-sm">
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
                      className={`${
                        activeFeatures['realtime-tracking'] 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {activeFeatures['realtime-tracking'] ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openConfigDialog('realtime-tracking')}
                    >
                      <Cog className="h-3.5 w-3.5 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Driving Behavior Analysis */}
              <Card className="border shadow-sm">
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
                      className={`${
                        activeFeatures['driving-behavior'] 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {activeFeatures['driving-behavior'] ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openConfigDialog('driving-behavior')}
                    >
                      <Cog className="h-3.5 w-3.5 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Trip History Replay */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <HistoryIcon className="h-5 w-5 text-indigo-500" />
                    Trip History Replay
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-3">Visualize past trips with detailed route information</p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`${
                        activeFeatures['trip-history'] 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {activeFeatures['trip-history'] ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openConfigDialog('trip-history')}
                    >
                      <Cog className="h-3.5 w-3.5 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Fuel Consumption Analytics */}
              <Card className="border shadow-sm">
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
                      className={`${
                        activeFeatures['fuel-analytics'] 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {activeFeatures['fuel-analytics'] ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openConfigDialog('fuel-analytics')}
                    >
                      <Cog className="h-3.5 w-3.5 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Integrated Dashcam */}
              <Card className="border shadow-sm">
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
                      className={`${
                        activeFeatures['dashcam'] 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {activeFeatures['dashcam'] ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openConfigDialog('dashcam')}
                    >
                      <Cog className="h-3.5 w-3.5 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
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

// Reference the SeverityLevel type defined above
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

// Feature Configuration Dialog
const FeatureConfigDialog: React.FC<ConfigDialogProps> = ({
  isOpen,
  title,
  description,
  onClose,
  featureId,
  isActive,
  toggleActive
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cog className="h-5 w-5 text-blue-500" />
            {title} Configuration
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive}
                onCheckedChange={() => toggleActive(featureId)}
                id={`${featureId}-switch`}
              />
              <Label htmlFor={`${featureId}-switch`} className="font-medium">
                {isActive ? 'Active' : 'Inactive'}
              </Label>
            </div>
            
            <Badge 
              variant="outline"
              className={isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}
            >
              {isActive ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          
          {featureId === 'realtime-tracking' && (
            <>
              <div className="space-y-2">
                <Label>Update Frequency</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['Every 5s', 'Every 15s', 'Every 30s'].map((option) => (
                    <Button 
                      key={option} 
                      variant={option === 'Every 5s' ? 'default' : 'outline'}
                      size="sm"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Location Precision</Label>
                <Select defaultValue="high">
                  <SelectTrigger>
                    <SelectValue placeholder="Select precision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (±10m)</SelectItem>
                    <SelectItem value="medium">Medium (±5m)</SelectItem>
                    <SelectItem value="high">High (±2m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          {featureId === 'driving-behavior' && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Acceleration Sensitivity</Label>
                  <span className="text-sm font-medium">Medium</span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="60"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Braking Sensitivity</Label>
                  <span className="text-sm font-medium">High</span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}
          
          {featureId === 'trip-history' && (
            <>
              <div className="space-y-2">
                <Label>Recording Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="record-location" defaultChecked />
                    <Label htmlFor="record-location">GPS Location</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="record-speed" defaultChecked />
                    <Label htmlFor="record-speed">Vehicle Speed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="record-fuel" defaultChecked />
                    <Label htmlFor="record-fuel">Fuel Consumption</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Storage Duration</Label>
                <RadioGroup defaultValue="90days">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30days" id="30days" />
                    <Label htmlFor="30days">30 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="90days" id="90days" />
                    <Label htmlFor="90days">90 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="365days" id="365days" />
                    <Label htmlFor="365days">1 year</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
          
          {featureId === 'fuel-consumption' && (
            <>
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
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Measurement Units</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="default" size="sm">Metric (L/100km)</Button>
                  <Button variant="outline" size="sm">Imperial (MPG)</Button>
                </div>
              </div>
            </>
          )}
          
          {featureId === 'dashcam' && (
            <>
              <div className="space-y-2">
                <Label>Video Quality</Label>
                <Select defaultValue="720p">
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p (SD)</SelectItem>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Recording Triggers</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="trigger-collision" defaultChecked />
                    <Label htmlFor="trigger-collision">Collision Detection</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="trigger-manual" defaultChecked />
                    <Label htmlFor="trigger-manual">Manual Recording</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="trigger-parking" />
                    <Label htmlFor="trigger-parking">Parking Mode</Label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Troubleshooting Guide Dialog
const TroubleshootingDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  issues: TroubleshootingIssue[];
}> = ({ isOpen, onClose, issues }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            Connection Troubleshooting Guide
          </DialogTitle>
          <DialogDescription>
            Step-by-step solutions for common connection issues
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {issues.map((issue, index) => (
            <div key={issue.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">{issue.title}</h3>
                  <p className="text-sm text-gray-500">{issue.description}</p>
                </div>
              </div>
              
              <div className="ml-12 space-y-2">
                <p className="text-sm font-medium">Solutions:</p>
                <div className="space-y-2">
                  {issue.solutions.map((solution, sIndex) => (
                    <div key={sIndex} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5" />
                      <p className="text-sm">{solution}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {index < issues.length - 1 && <hr className="mt-4" />}
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Got It
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Network Speed Test Dialog
const NetworkTestDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  runTest: () => void;
  speed: number | null;
}> = ({ isOpen, onClose, runTest, speed }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-500" />
            Network Speed Test
          </DialogTitle>
          <DialogDescription>
            Test your connection speed for optimal device performance
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {speed === null ? (
            <div className="text-center py-10">
              <div className="mb-4">
                <RefreshCw className="h-12 w-12 mx-auto text-blue-500 animate-spin" />
              </div>
              <p>Testing network speed...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="flex flex-col items-center">
                  <Upload className="h-6 w-6 text-blue-500 mb-1" />
                  <span className="text-xl font-bold">{Math.round(speed * 0.7)} Mbps</span>
                  <span className="text-xs text-gray-500">Upload</span>
                </div>
                
                <div className="h-16 border-r border-gray-200"></div>
                
                <div className="flex flex-col items-center">
                  <Download className="h-6 w-6 text-green-500 mb-1" />
                  <span className="text-xl font-bold">{speed} Mbps</span>
                  <span className="text-xs text-gray-500">Download</span>
                </div>
              </div>
              
              <div className="mt-6 text-left">
                <p className="text-sm font-medium mb-2">Connection Quality:</p>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      speed > 40 ? 'bg-green-500' : 
                      speed > 20 ? 'bg-blue-500' : 
                      speed > 10 ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`} 
                    style={{ width: `${Math.min(speed * 1.5, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Poor</span>
                  <span className="text-xs text-gray-500">Excellent</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700 text-left">
                <p className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {speed > 20 
                      ? 'Your connection is excellent for OBD2 data transmission.' 
                      : 'Your connection may be slow for real-time data. Consider using a different connection method or reducing update frequency.'}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {speed !== null && (
            <Button variant="outline" onClick={runTest}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Run Again
            </Button>
          )}
          <Button onClick={onClose}>
            {speed === null ? 'Cancel' : 'Close'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Connection Tutorial Dialog
const TutorialDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  connectionMethod: string;
}> = ({ isOpen, onClose, connectionMethod }) => {
  // Tutorial steps for each connection method
  const tutorialSteps = {
    wire: [
      'Locate the OBD2 port in your vehicle (usually under the dashboard)',
      'Connect the Drishti device directly to the OBD2 port',
      'Ensure the connection is secure and the device powers on',
      'Select "Wire" connection in the app and click "Connect"'
    ],
    bluetooth: [
      'Plug the Drishti device into your vehicle\'s OBD2 port',
      'Turn on Bluetooth on your phone or tablet',
      'Select "Bluetooth" connection in the app',
      'Choose "Drishti OBD2 Scanner" from the device list',
      'Enter the pairing code (usually 1234 or 0000)'
    ],
    wifi: [
      'Connect the Drishti device to your vehicle\'s OBD2 port',
      'Wait for the device LED to turn solid blue (about 10 seconds)',
      'Go to your device WiFi settings and connect to "Drishti_WiFi"',
      'Return to the app and select "WiFi" connection',
      'Click "Connect" to establish the connection'
    ],
    esim: [
      'Ensure your Drishti device has an active eSIM subscription',
      'Connect the device to your vehicle\'s OBD2 port',
      'Select "eSIM" connection in the app',
      'Choose your provider and data plan',
      'Click "Connect" to establish connection via cellular network'
    ],
    simcard: [
      'Insert your SIM card into the Drishti device',
      'Connect the device to your vehicle\'s OBD2 port',
      'Select "SIM Card" connection in the app',
      'Enter the required SIM details and APN settings',
      'Click "Connect" to establish connection via cellular network'
    ]
  };
  
  const steps = tutorialSteps[connectionMethod as keyof typeof tutorialSteps] || tutorialSteps.bluetooth;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-blue-500" />
            Connection Tutorial
          </DialogTitle>
          <DialogDescription>
            {connectionMethod === 'wire' ? 'Wired Connection Guide' :
             connectionMethod === 'bluetooth' ? 'Bluetooth Connection Guide' :
             connectionMethod === 'wifi' ? 'WiFi Connection Guide' :
             connectionMethod === 'esim' ? 'eSIM Connection Guide' :
             'SIM Card Connection Guide'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                  {index + 1}
                </div>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-amber-50 rounded-md text-sm text-amber-700">
            <p className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                For optimal performance, ensure your vehicle's engine is running during the connection process.
              </span>
            </p>
          </div>
          
          <div className="text-center">
            <Button variant="outline" className="text-blue-600" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Video Tutorial
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Got It
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Connection Recommendation Dialog
const RecommendationDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  setMethod: (method: string) => void;
}> = ({ isOpen, onClose, setMethod }) => {
  const recommendation = {
    method: 'bluetooth',
    reason: 'Best for quick connections with minimal setup',
    benefits: [
      'No cables required',
      'Works with most modern vehicles',
      'Easy to set up in under 60 seconds'
    ]
  };
  
  const handleApply = () => {
    setMethod(recommendation.method);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-500" />
            Intelligent Connection Recommendation
          </DialogTitle>
          <DialogDescription>
            Based on your device and vehicle compatibility
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white rounded-full">
                {recommendation.method === 'bluetooth' ? (
                  <BluetoothIcon className="h-6 w-6 text-blue-500" />
                ) : recommendation.method === 'wifi' ? (
                  <Wifi className="h-6 w-6 text-blue-500" />
                ) : (
                  <CableIcon className="h-6 w-6 text-blue-500" />
                )}
              </div>
              <div>
                <h3 className="font-medium">
                  {recommendation.method === 'bluetooth' ? 'Bluetooth Connection' :
                   recommendation.method === 'wifi' ? 'WiFi Connection' :
                   'Wired Connection'}
                </h3>
                <p className="text-sm text-gray-600">{recommendation.reason}</p>
              </div>
            </div>
            
            <div className="ml-12 space-y-2">
              <p className="text-sm font-medium">Benefits:</p>
              <div className="space-y-1">
                {recommendation.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <p className="text-sm">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md text-sm">
            <p className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
              <span className="text-gray-600">
                This recommendation is based on your device model and previous connection history.
              </span>
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Recommendation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Drishti;