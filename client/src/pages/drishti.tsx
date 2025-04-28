import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Edit,
  Map,
  BookOpen,
  Lightbulb,
  Info,
  ExternalLink,
  CheckCircle,
  Upload,
  Download,
  LineChart,
  Sliders,
  SwitchCamera,
  Radio,
  Play,
  Save,
  ChevronRight,
  Cog,
  RotateCcw,
  Bluetooth
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
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
import GeofencingControl from '@/components/drishti/geofencing-control';

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

// Helper function to get severity background color
const getSeverityBgColor = (severity: SeverityLevel | string): string => {
  switch (severity as SeverityLevel) {
    case 'critical':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-amber-500';
    case 'low':
      return 'bg-blue-500';
    default:
      // Handle custom colors for non-standard severities
      if (severity === 'Warning') return 'bg-amber-500';
      if (severity === 'Critical') return 'bg-red-500';
      if (severity === 'Reminder') return 'bg-blue-500';
      return 'bg-gray-400';
  }
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
  
  // Troubleshooting Dialog
  const TroubleshootingDialog = () => {
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
    
    const getSelectedIssue = () => {
      return troubleshootingIssues.find(issue => issue.id === selectedIssue);
    };
    
    return (
      <Dialog open={troubleshootingOpen} onOpenChange={setTroubleshootingOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-500" />
              Troubleshooting Guide
            </DialogTitle>
            <DialogDescription>
              Identify and resolve common issues with your OBD2 connection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="space-y-4 md:col-span-1">
              <div className="font-medium text-sm mb-2">Common Issues</div>
              <div className="space-y-2">
                {troubleshootingIssues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue.id)}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedIssue === issue.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 mt-1.5 rounded-full ${getSeverityBgColor(issue.severity)}`}></div>
                      <div>
                        <div className="font-medium text-sm">{issue.title}</div>
                        <div className="text-xs text-gray-500">{issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)} Severity</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-md">
              {selectedIssue ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{getSelectedIssue()?.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{getSelectedIssue()?.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recommended Solutions:</h4>
                    <div className="space-y-2">
                      {getSelectedIssue()?.solutions.map((solution, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <p className="text-sm">{solution}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-md mt-4">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0">
                        <Info className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-sm text-blue-700">
                        If these solutions don't resolve the issue, try restarting both your device and the OBD2 scanner, or contact support.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">Select an issue</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                    Choose a common issue from the left panel to view troubleshooting steps.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <div>
              <Button variant="link" onClick={() => window.open('https://support.fixpoint.com', '_blank')} className="text-sm px-0">
                Contact Support
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <Button variant="outline" onClick={() => setTroubleshootingOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Feature Configuration Dialog
  const FeatureConfigDialog = ({ isOpen, onClose, title, description, featureId, isActive, toggleActive }: ConfigDialogProps) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-blue-500" />
              {title}
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${featureId}-active`}>Enable Feature</Label>
              <Switch 
                id={`${featureId}-active`}
                checked={isActive}
                onCheckedChange={() => toggleActive(featureId)}
              />
            </div>
            
            <div className={`space-y-4 ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}>
              {featureId === 'realtime-tracking' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="location-frequency">Update Frequency</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="location-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (5 minutes)</SelectItem>
                        <SelectItem value="medium">Medium (1 minute)</SelectItem>
                        <SelectItem value="high">High (15 seconds)</SelectItem>
                        <SelectItem value="realtime">Real-time (5 seconds)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location-precision">Location Precision</Label>
                    <Select defaultValue="high">
                      <SelectTrigger id="location-precision">
                        <SelectValue placeholder="Select precision" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (100m)</SelectItem>
                        <SelectItem value="medium">Medium (50m)</SelectItem>
                        <SelectItem value="high">High (10m)</SelectItem>
                        <SelectItem value="highest">Highest (5m)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              {featureId === 'driving-behavior' && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="accel-sensitivity">Acceleration Sensitivity</Label>
                      <span className="text-sm text-gray-500">Medium</span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={1} id="accel-sensitivity" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="braking-sensitivity">Braking Sensitivity</Label>
                      <span className="text-sm text-gray-500">Medium</span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={1} id="braking-sensitivity" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="cornering-sensitivity">Cornering Sensitivity</Label>
                      <span className="text-sm text-gray-500">Medium</span>
                    </div>
                    <Slider defaultValue={[50]} max={100} step={1} id="cornering-sensitivity" />
                  </div>
                </>
              )}
              
              {featureId === 'fuel-consumption' && (
                <>
                  <div className="space-y-2">
                    <Label>Fuel Type</Label>
                    <RadioGroup defaultValue="petrol">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="petrol" id="petrol" />
                        <Label htmlFor="petrol">Petrol</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="diesel" id="diesel" />
                        <Label htmlFor="diesel">Diesel</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cng" id="cng" />
                        <Label htmlFor="cng">CNG</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="electric" id="electric" />
                        <Label htmlFor="electric">Electric</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tank-capacity">Fuel Tank Capacity (liters)</Label>
                    <Input id="tank-capacity" type="number" defaultValue="45" />
                  </div>
                </>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
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
                  <Bluetooth className="h-5 w-5 mb-1" />
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
                  <Globe className="h-5 w-5 mb-1" />
                  <span className="text-xs">eSIM</span>
                </Button>
                <Button
                  variant={connectionMethod === 'sim' ? "default" : "outline"}
                  className="flex flex-col py-3 h-auto"
                  onClick={() => setConnectionMethod('sim')}
                >
                  <Smartphone className="h-5 w-5 mb-1" />
                  <span className="text-xs">SIM Card</span>
                </Button>
              </div>
              
              {connectionMethod === 'bluetooth' && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-md mb-4">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0">
                        <Info className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-sm text-blue-700">
                        Ensure your device's Bluetooth is enabled and the OBD2 device is in pairing mode.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-white">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-sm mb-3">Available Devices</h3>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        <span className="text-xs">Refresh</span>
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200">
                        <div className="flex items-center gap-2">
                          <Bluetooth className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">OBD2-Scanner_XR321</span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Connected Before
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200">
                        <div className="flex items-center gap-2">
                          <Bluetooth className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Drishti_OBD2_89A4</span>
                        </div>
                        <Badge variant="outline" className="text-xs">New Device</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200">
                        <div className="flex items-center gap-2">
                          <Bluetooth className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">FixPoint_Diagnostic</span>
                        </div>
                        <Badge variant="outline" className="text-xs">New Device</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleConnect}
                    disabled={connectionStatus === 'connecting'}
                  >
                    {connectionStatus === 'connecting' ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : connectionStatus === 'connected' ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Connected
                      </>
                    ) : connectionStatus === 'error' ? (
                      <>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Retry Connection
                      </>
                    ) : (
                      <>
                        <Bluetooth className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                  
                  {connectionError && (
                    <div className="p-3 bg-red-50 rounded-md">
                      <div className="flex gap-2">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </div>
                        <p className="text-sm text-red-700">
                          {connectionError}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {connectionMethod === 'wifi' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wifi-ssid">WiFi Network Name (SSID)</Label>
                      <Input id="wifi-ssid" placeholder="Enter network name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wifi-password">WiFi Password</Label>
                      <Input id="wifi-password" type="password" placeholder="Enter password" />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-md">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0">
                        <Info className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-sm text-blue-700">
                        Your OBD2 device will connect to this WiFi network to transmit diagnostic data.
                        Ensure the device supports WiFi connectivity.
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Wifi className="h-4 w-4 mr-2" />
                    Connect via WiFi
                  </Button>
                </div>
              )}
              
              {/* Other connection methods would be implemented similarly */}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Vehicle Control Center */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="h-5 w-5 text-blue-500" />
              Vehicle Control Center
            </CardTitle>
            <CardDescription>Remote control & monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Power className="h-5 w-5 text-gray-500" />
                  <Label htmlFor="engine-toggle">Engine</Label>
                </div>
                <Switch 
                  id="engine-toggle"
                  checked={engineOn}
                  onCheckedChange={toggleEngine}
                  disabled={!isConnected}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <Label>Current Speed</Label>
                  <span className="text-sm font-medium">42 km/h</span>
                </div>
                <Progress value={42} max={220} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0 km/h</span>
                  <span>220 km/h</span>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" disabled={!isConnected}>
                    <Gauge className="h-4 w-4 mr-1" />
                    Diagnostics
                  </Button>
                  <Button variant="outline" size="sm" disabled={!isConnected}>
                    <Bell className="h-4 w-4 mr-1" />
                    Horn
                  </Button>
                  <Button variant="outline" size="sm" disabled={!isConnected}>
                    <Lock className="h-4 w-4 mr-1" />
                    Lock
                  </Button>
                  <Button variant="outline" size="sm" disabled={!isConnected}>
                    <Thermometer className="h-4 w-4 mr-1" />
                    Climate
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Geofencing Control */}
        <GeofencingControl />
        
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#00A3A3]" />
              Health Metrics
            </CardTitle>
            <CardDescription>Real-time vehicle health tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold">
                  89
                </div>
                <div>
                  <div className="font-medium">Health Score</div>
                  <div className="text-xs text-gray-500">Good condition</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="flex items-center gap-1">
                      <Battery className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">Battery</span>
                    </Label>
                    <span className="text-xs font-medium">78%</span>
                  </div>
                  <Progress value={78} max={100} className="h-1.5" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="flex items-center gap-1">
                      <Droplet className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">Oil Life</span>
                    </Label>
                    <span className="text-xs font-medium">65%</span>
                  </div>
                  <Progress value={65} max={100} className="h-1.5" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="flex items-center gap-1">
                      <Gauge className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">Tire Pressure</span>
                    </Label>
                    <span className="text-xs font-medium">92%</span>
                  </div>
                  <Progress value={92} max={100} className="h-1.5" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="flex items-center gap-1">
                      <Thermometer className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">Engine Temp</span>
                    </Label>
                    <span className="text-xs font-medium">Normal</span>
                  </div>
                  <Progress value={45} max={100} className="h-1.5" />
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full" disabled={!isConnected}>
                <Activity className="h-4 w-4 mr-1" />
                Run Full Diagnostics
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Main Tabs Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="dashboard" value={mainTab} onValueChange={setMainTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="features">Core Features</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
            <TabsTrigger value="ai">AI Features</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            {/* Dashboard content would go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Current Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-2 bg-gray-50 rounded-md mb-3">
                    <p className="text-sm font-medium">Mumbai, Maharashtra</p>
                    <p className="text-xs text-gray-500">Last updated: 2 mins ago</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Map className="h-4 w-4 mr-1" />
                    View on Map
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Route className="h-5 w-5 text-green-500" />
                    Recent Trips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Office Commute</p>
                        <p className="text-xs text-gray-500">Today, 9:15 AM</p>
                      </div>
                      <Badge variant="outline" className="text-xs">18 km</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Shopping Mall</p>
                        <p className="text-xs text-gray-500">Yesterday, 6:30 PM</p>
                      </div>
                      <Badge variant="outline" className="text-xs">7 km</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Upcoming Maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Badge className="mt-0.5 bg-amber-100 text-amber-700 hover:bg-amber-100">
                        Soon
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Oil Change</p>
                        <p className="text-xs text-gray-500">Due in 500 km</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">
                        Later
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Tire Rotation</p>
                        <p className="text-xs text-gray-500">Due in 2,500 km</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-500" />
                    Efficiency Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Fuel Efficiency</span>
                      <span className="text-sm font-medium">14.5 km/l</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Avg. Speed</span>
                      <span className="text-sm font-medium">32 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Driving Score</span>
                      <span className="text-sm font-medium">92/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* More dashboard content would go here */}
          </TabsContent>
          
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={!activeFeatures['realtime-tracking'] ? 'opacity-60' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      Realtime Vehicle Tracking
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openConfigDialog('realtime-tracking')}>
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>Track your vehicle's location in real-time</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center pb-2">
                    <Badge variant={activeFeatures['realtime-tracking'] ? 'default' : 'outline'} className="mb-2">
                      {activeFeatures['realtime-tracking'] ? 'Active' : 'Inactive'}
                    </Badge>
                    <Switch 
                      checked={activeFeatures['realtime-tracking']} 
                      onCheckedChange={() => toggleFeatureActive('realtime-tracking')}
                    />
                  </div>
                  <div className="p-2 bg-blue-50 rounded-md mt-2">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0">
                        <Info className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-xs text-blue-700">
                        This feature lets you monitor your vehicle's real-time location on a map with minute-by-minute updates.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={!activeFeatures['driving-behavior'] ? 'opacity-60' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      Driving Behavior Analysis
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openConfigDialog('driving-behavior')}>
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>Analyze and improve driving patterns</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center pb-2">
                    <Badge variant={activeFeatures['driving-behavior'] ? 'default' : 'outline'} className="mb-2">
                      {activeFeatures['driving-behavior'] ? 'Active' : 'Inactive'}
                    </Badge>
                    <Switch 
                      checked={activeFeatures['driving-behavior']} 
                      onCheckedChange={() => toggleFeatureActive('driving-behavior')}
                    />
                  </div>
                  <div className="p-2 bg-green-50 rounded-md mt-2">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0">
                        <Info className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-xs text-green-700">
                        Monitor acceleration, braking, and cornering patterns to improve driving efficiency and safety.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={!activeFeatures['fuel-consumption'] ? 'opacity-60' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-red-500" />
                      Fuel Consumption Analytics
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openConfigDialog('fuel-consumption')}>
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>Track and optimize fuel usage</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center pb-2">
                    <Badge variant={activeFeatures['fuel-consumption'] ? 'default' : 'outline'} className="mb-2">
                      {activeFeatures['fuel-consumption'] ? 'Active' : 'Inactive'}
                    </Badge>
                    <Switch 
                      checked={activeFeatures['fuel-consumption']} 
                      onCheckedChange={() => toggleFeatureActive('fuel-consumption')}
                    />
                  </div>
                  <div className="p-2 bg-red-50 rounded-md mt-2">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0">
                        <Info className="h-4 w-4 text-red-500" />
                      </div>
                      <p className="text-xs text-red-700">
                        Get detailed insights on fuel consumption patterns and receive recommendations for improving efficiency.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <div className="border-b pb-4 mb-4">
              <Tabs defaultValue="energy" value={advancedFeatureTab} onValueChange={setAdvancedFeatureTab}>
                <TabsList>
                  <TabsTrigger value="energy">Energy Monitoring</TabsTrigger>
                  <TabsTrigger value="efficiency">Efficiency Maps</TabsTrigger>
                  <TabsTrigger value="annotations">Collaborative Notes</TabsTrigger>
                  <TabsTrigger value="performance">Driver Performance</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance Timeline</TabsTrigger>
                </TabsList>
                
                <TabsContent value="energy" className="mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Real-time Energy Consumption Monitor</CardTitle>
                        <CardDescription>
                          Track your vehicle's energy usage patterns with detailed analytics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RealtimeEnergyMonitor />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="efficiency" className="mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Efficiency Heat Map</CardTitle>
                        <CardDescription>
                          Visualize efficiency patterns across routes and driving conditions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <EfficiencyHeatMap />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="annotations" className="mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Collaborative Trip Annotations</CardTitle>
                        <CardDescription>
                          Add notes and share insights with authorized users
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CollaborativeAnnotations />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="performance" className="mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Gamified Driver Performance</CardTitle>
                        <CardDescription>
                          Track and improve your driving skills with game-like feedback
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <GamifiedDriverPerformance />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="maintenance" className="mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Maintenance Timeline</CardTitle>
                        <CardDescription>
                          Comprehensive view of past and upcoming maintenance events
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <MaintenanceTimeline />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-6">
            <div className="border-b pb-4 mb-4">
              <Tabs defaultValue="route" value={advancedAIFeatureTab} onValueChange={setAdvancedAIFeatureTab}>
                <TabsList>
                  <TabsTrigger value="route">AI Route Recommendations</TabsTrigger>
                  <TabsTrigger value="achievements">Driver Achievements</TabsTrigger>
                  <TabsTrigger value="battery">Predictive Battery Health</TabsTrigger>
                </TabsList>
                
                <TabsContent value="route" className="mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>AI-Powered Route Recommendations</CardTitle>
                        <CardDescription>
                          Machine learning based route suggestions optimized for efficiency, time, and driver preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AIRouteRecommendation />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="achievements" className="mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Driver Achievements Platform</CardTitle>
                        <CardDescription>
                          Earn achievements and track your progress as a driver
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <DriverAchievements />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="battery" className="mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Predictive Battery Health for EVs</CardTitle>
                        <CardDescription>
                          Advanced predictions for electric vehicle battery performance and lifespan
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PredictiveBatteryHealth />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Settings</CardTitle>
                <CardDescription>Configure your Drishti OBD2+GPS device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="device-name">Device Name</Label>
                  <Input id="device-name" defaultValue="My Drishti Device" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="update-frequency">Data Update Frequency</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="update-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Save Battery)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (Detailed Data)</SelectItem>
                      <SelectItem value="realtime">Real-time (Maximum Detail)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Higher frequencies provide more detailed data but consume more battery and data.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="power-saving">Power Saving Mode</Label>
                  <Switch id="power-saving" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <Switch id="notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-connect">Auto-Connect on Start</Label>
                  <Switch id="auto-connect" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label>OBD Protocol</Label>
                  <RadioGroup defaultValue="auto">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="auto" id="auto" />
                      <Label htmlFor="auto">Auto-Detect</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="protocol-1" id="protocol-1" />
                      <Label htmlFor="protocol-1">ISO 9141-2 (Asian/European)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="protocol-2" id="protocol-2" />
                      <Label htmlFor="protocol-2">ISO 14230-4 (KWP2000)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="protocol-3" id="protocol-3" />
                      <Label htmlFor="protocol-3">SAE J1850 (American)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Firmware Updates</CardTitle>
                <CardDescription>Keep your device software up to date</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md bg-green-50">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800">Your device is up to date</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Current Firmware: v2.4.1
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Check for Updates
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your vehicle data and export options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period</Label>
                  <Select defaultValue="6months">
                    <SelectTrigger id="data-retention">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">1 Month</SelectItem>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Import Data
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="backup-sync">Auto Backup to Cloud</Label>
                  <Switch id="backup-sync" defaultChecked />
                </div>
                
                <div className="p-3 bg-amber-50 rounded-md">
                  <div className="flex gap-2">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-sm text-amber-700">
                      Clearing your data will permanently delete all vehicle records, trip histories, and 
                      custom settings. This action cannot be undone.
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700">
                  Clear All Device Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
      
      {/* Render dialogs */}
      <TroubleshootingDialog />
      <FeatureConfigDialog
        isOpen={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        title={getFeatureDetails(currentFeature)?.title || ''}
        description={getFeatureDetails(currentFeature)?.description || ''}
        featureId={currentFeature}
        isActive={activeFeatures[currentFeature as keyof typeof activeFeatures] || false}
        toggleActive={toggleFeatureActive}
      />
    </div>
  );
};

export default Drishti;

function Lock(props: any) {
  return (
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}