import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Target, 
  MapPin, 
  HelpCircle, 
  Activity, 
  BookOpen, 
  Lightbulb, 
  Edit,
  Info,
  CheckCircle,
  RefreshCw,
  Map
} from 'lucide-react';

// Define severity level type
type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

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

const GeofencingControl: React.FC = () => {
  // Geofencing state variables
  const [geofenceEnabled, setGeofenceEnabled] = useState<boolean>(false);
  const [geofenceRadius, setGeofenceRadius] = useState<number>(100);
  const [geofenceDialogOpen, setGeofenceDialogOpen] = useState<boolean>(false);
  const [manualGeofenceInput, setManualGeofenceInput] = useState<string>('');
  const [geofenceTroubleshootOpen, setGeofenceTroubleshootOpen] = useState<boolean>(false);
  const [networkTestOpen, setNetworkTestOpen] = useState<boolean>(false);
  const [networkSpeed, setNetworkSpeed] = useState<number | null>(null);
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false);
  const [recommendationOpen, setRecommendationOpen] = useState<boolean>(false);
  
  // Run network speed test
  const runNetworkTest = () => {
    setNetworkSpeed(null);
    // Simulate network test
    setTimeout(() => {
      setNetworkSpeed(Math.floor(Math.random() * 50) + 10); // 10-60 Mbps
    }, 1500);
  };
  
  // Manual Geofence Input Dialog
  const GeofenceManualInputDialog = () => {
    const [inputValue, setInputValue] = useState(geofenceRadius.toString());
    const [error, setError] = useState<string | null>(null);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setError(null);
    };
    
    const handleApply = () => {
      const radius = parseInt(inputValue);
      if (isNaN(radius)) {
        setError("Please enter a valid number");
        return;
      }
      
      if (radius < 1) {
        setError("Radius must be at least 1 km");
        return;
      }
      
      if (radius > 1000) {
        setError("Radius cannot exceed 1000 km");
        return;
      }
      
      setGeofenceRadius(radius);
      setGeofenceDialogOpen(false);
    };
    
    return (
      <Dialog open={geofenceDialogOpen} onOpenChange={setGeofenceDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Set Geofence Radius Manually
            </DialogTitle>
            <DialogDescription>
              Enter a custom radius for your geofence perimeter
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manual-radius">Radius (1-1000 km)</Label>
              <div className="flex gap-2">
                <Input
                  id="manual-radius"
                  type="number"
                  min={1}
                  max={1000}
                  value={inputValue}
                  onChange={handleInputChange}
                  className={error ? "border-red-300" : ""}
                />
                <span className="flex items-center text-sm font-medium">km</span>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            
            <div className="p-3 bg-purple-50 rounded-md">
              <div className="flex gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <Info className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-sm text-purple-700">
                  Setting a larger radius will create a wider geofenced area around your vehicle's current location.
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setGeofenceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Radius
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Geofencing Troubleshooting Dialog
  const GeofenceTroubleshootingDialog = () => {
    const [selectedIssue, setSelectedIssue] = useState<string>("signal-loss");
    
    const geofenceIssues = [
      {
        id: "signal-loss",
        title: "GPS Signal Loss",
        description: "Geofencing may not work properly due to GPS signal interference",
        severity: "high",
        solutions: [
          "Move your vehicle to an open area away from tall buildings",
          "Check if your device has clear view of the sky",
          "Verify that your vehicle's GPS antenna is properly connected",
          "Try refreshing your device's GPS connection"
        ]
      },
      {
        id: "delayed-alerts",
        title: "Delayed Geofence Alerts",
        description: "Alerts are received with significant delay after boundary crossing",
        severity: "medium",
        solutions: [
          "Check your network connectivity strength",
          "Reduce the geofence radius for faster detection",
          "Ensure 'Background Location' permission is enabled",
          "Update to the latest version of the Drishti firmware"
        ]
      },
      {
        id: "false-triggers",
        title: "False Alert Triggers",
        description: "System reports boundary crossing when vehicle is within the geofence",
        severity: "medium",
        solutions: [
          "Increase your geofence radius slightly",
          "Calibrate your device's GPS receiver",
          "Set up a buffer zone around critical boundaries",
          "Switch to high-precision mode in settings"
        ]
      }
    ];
    
    const getSelectedIssue = () => {
      return geofenceIssues.find(issue => issue.id === selectedIssue);
    };
    
    return (
      <Dialog open={geofenceTroubleshootOpen} onOpenChange={setGeofenceTroubleshootOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500 mr-1" />
              Geofencing Troubleshooting
            </DialogTitle>
            <DialogDescription>
              Resolve common issues with geofence boundary monitoring
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="space-y-4 md:col-span-1">
              <div className="font-medium text-sm mb-2">Common Issues</div>
              <div className="space-y-2">
                {geofenceIssues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue.id)}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedIssue === issue.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 mt-1.5 rounded-full ${getSeverityBgColor(getSelectedIssue()?.severity || 'medium')}`}></div>
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
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setGeofenceTroubleshootOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Network Test Dialog
  const NetworkTestDialog = () => {
    return (
      <Dialog open={networkTestOpen} onOpenChange={setNetworkTestOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Network Speed Test
            </DialogTitle>
            <DialogDescription>
              Testing connection quality to the OBD2 service
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {networkSpeed === null ? (
              <div className="flex flex-col items-center justify-center p-6">
                <div className="relative h-16 w-16 mb-4">
                  <RefreshCw className="h-16 w-16 text-blue-100 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-blue-500/80"></div>
                  </div>
                </div>
                <p className="text-center text-sm">Running speed test...</p>
                <p className="text-center text-xs text-gray-500 mt-1">Testing connection to vehicle diagnostics servers</p>
              </div>
            ) : (
              <div className="flex flex-col items-center p-4">
                <div className="relative h-20 w-20 mb-2">
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
                      stroke={networkSpeed > 30 ? "#22c55e" : networkSpeed > 15 ? "#eab308" : "#ef4444"}
                      strokeWidth="12"
                      strokeDasharray="339.292"
                      strokeDashoffset={`${339.292 * (1 - networkSpeed / 60)}`} // 60 Mbps as max
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold">{networkSpeed}</span>
                    <span className="text-xs">Mbps</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <p className="font-medium">{
                    networkSpeed > 30 ? 'Excellent Connection' :
                    networkSpeed > 15 ? 'Good Connection' :
                    'Poor Connection'
                  }</p>
                  <p className="text-sm text-gray-500 mt-1">{
                    networkSpeed > 30 ? 'Optimal for all features including real-time video' :
                    networkSpeed > 15 ? 'Suitable for most features with minor delays' :
                    'May experience lag with advanced features'
                  }</p>
                </div>
                
                <Button onClick={runNetworkTest} size="sm" variant="outline" className="mb-2">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test Again
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNetworkTestOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Recommendation Dialog
  const RecommendationDialog = () => {
    return (
      <Dialog open={recommendationOpen} onOpenChange={setRecommendationOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Connection Recommendation
            </DialogTitle>
            <DialogDescription>
              Based on your vehicle and device compatibility
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white rounded-full">
                  <Target className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium">
                    Optimal Geofencing Configuration
                  </h3>
                  <p className="text-sm text-gray-600">Recommended settings for best performance</p>
                </div>
              </div>
              
              <div className="ml-12 space-y-2">
                <p className="text-sm font-medium">Recommendations:</p>
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <p className="text-sm">Use a 250-500m radius for urban environments</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <p className="text-sm">Set up multiple smaller geofences instead of a single large one</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <p className="text-sm">Enable "Stay inside boundary" for parked vehicles</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <p className="text-sm">Configure alert delivery via both push notification and SMS</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              <p className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                <span className="text-gray-600">
                  These recommendations are based on typical usage patterns and can be adjusted based on your specific needs.
                </span>
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecommendationOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setGeofenceRadius(250);
              setRecommendationOpen(false);
              if (!geofenceEnabled) setGeofenceEnabled(true);
            }}>
              Apply Recommended Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Tutorial Dialog
  const TutorialDialog = () => {
    return (
      <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Geofencing Tutorial
            </DialogTitle>
            <DialogDescription>
              Learn how to set up and use geofencing effectively
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-gray-50 p-3 font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 text-sm">1</span>
                    </div>
                    <span>Getting Started with Geofencing</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sm">
                    Geofencing allows you to create virtual boundaries around your vehicle and receive alerts 
                    when it enters or exits these areas. To get started:
                  </p>
                  <ol className="text-sm space-y-2 list-decimal pl-5">
                    <li>Enable geofencing with the toggle switch</li>
                    <li>Set a radius for your geofence (recommended: 100-500m for urban areas)</li>
                    <li>The geofence center is automatically set to your vehicle's current location</li>
                    <li>You can change the center using the "Set Current Location" button</li>
                  </ol>
                </div>
              </div>
              
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-gray-50 p-3 font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 text-sm">2</span>
                    </div>
                    <span>Setting Up Alert Preferences</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sm">
                    Configure how you receive geofence alerts:
                  </p>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    <li>Go to Settings &gt; Notifications &gt; Geofence Alerts</li>
                    <li>Choose notification methods: push, SMS, email, or in-app</li>
                    <li>Set alert rules for boundary crossing (enter, exit, or both)</li>
                    <li>Configure quiet hours to prevent alerts during specific times</li>
                  </ul>
                </div>
              </div>
              
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-gray-50 p-3 font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 text-sm">3</span>
                    </div>
                    <span>Advanced Geofencing Features</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sm">
                    Explore additional capabilities:
                  </p>
                  <ul className="text-sm space-y-2 list-disc pl-5">
                    <li>Create multiple geofences for different locations</li>
                    <li>Set time-based geofences that activate on schedules</li>
                    <li>Use polygon geofences for custom-shaped boundaries</li>
                    <li>Export geofence history reports for analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTutorialOpen(false)}>
              Close Tutorial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
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
            <Switch 
              id="geofence-toggle"
              checked={geofenceEnabled}
              onCheckedChange={setGeofenceEnabled}
            />
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <Label htmlFor="geofence-radius">Geofence Radius</Label>
              <span className="text-sm font-medium">{geofenceRadius} km</span>
            </div>
            <Slider
              id="geofence-radius"
              min={1}
              max={1000}
              step={1}
              value={[geofenceRadius]}
              onValueChange={(value) => setGeofenceRadius(value[0])}
              disabled={!geofenceEnabled}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 km</span>
              <span>1000 km</span>
            </div>
          </div>
          
          <div className="mb-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mb-2"
              onClick={() => setGeofenceDialogOpen(true)}
              disabled={!geofenceEnabled}
            >
              <Edit className="h-4 w-4 mr-2" />
              Set Manual Radius
            </Button>
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
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button variant="outline" size="sm" disabled={!geofenceEnabled}>
              <MapPin className="h-4 w-4 mr-1" />
              Set Current Location
            </Button>
            <Button variant="outline" size="sm" disabled={!geofenceEnabled}>
              <Map className="h-4 w-4 mr-1" />
              View on Map
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setGeofenceTroubleshootOpen(true)}
              className="flex-1"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Troubleshoot
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setNetworkTestOpen(true);
                runNetworkTest();
              }}
              className="flex-1"
            >
              <Activity className="h-4 w-4 mr-1" />
              Test Speed
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setTutorialOpen(true)}
              className="flex-1"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Tutorial
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setRecommendationOpen(true)}
              className="flex-1"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              Recommend
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="text-gray-500">Alerts received</span>
            <Badge variant="outline" className={geofenceEnabled ? "bg-amber-50 text-amber-600 border-amber-200" : ""}>
              {geofenceEnabled ? 3 : 0}
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Render dialogs */}
      <GeofenceManualInputDialog />
      <GeofenceTroubleshootingDialog />
      <NetworkTestDialog />
      <RecommendationDialog />
      <TutorialDialog />
    </>
  );
};

export default GeofencingControl;