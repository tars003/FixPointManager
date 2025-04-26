import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Eye, BarChart3, Camera, Settings2, AlertTriangle, Check, Clock } from 'lucide-react';

const Drishti: React.FC = () => {
  return (
    <div className="container px-4 py-8 mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <Eye className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold tracking-tight">Drishti</h1>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          Advanced vision-based analytics and insights for your vehicle. Monitor road conditions, 
          detect potential hazards, and receive real-time alerts for safer driving.
        </p>
      </motion.div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="cameras">Cameras</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DrishtiStatusCard 
              title="System Status" 
              status="Active" 
              statusColor="text-green-500" 
              icon={<Check className="h-5 w-5 text-green-500" />}
              description="All systems are functioning properly"
            />
            
            <DrishtiStatusCard 
              title="Last Scan" 
              status="10 minutes ago" 
              statusColor="text-blue-500" 
              icon={<Clock className="h-5 w-5 text-blue-500" />}
              description="Regular scanning intervals active"
            />
            
            <DrishtiStatusCard 
              title="Alerts" 
              status="2 New" 
              statusColor="text-amber-500" 
              icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
              description="Minor alerts detected, tap to view"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Detections</CardTitle>
              <CardDescription>Objects and conditions detected in your recent drives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDetections.map((detection, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${detection.bgColor}`}>
                        {detection.icon}
                      </div>
                      <div>
                        <p className="font-medium">{detection.name}</p>
                        <p className="text-sm text-muted-foreground">{detection.time}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${detection.statusColor}`}>
                      {detection.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Drive Analytics</CardTitle>
              <CardDescription>Visual data insights from your recent journeys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/60" />
                  <p className="mt-2 text-muted-foreground">Analytics visualization will appear here</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-medium text-lg">Analysis Period</h3>
                <RadioGroup defaultValue="week" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="day" id="day" />
                    <Label htmlFor="day">Day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="week" id="week" />
                    <Label htmlFor="week">Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="month" id="month" />
                    <Label htmlFor="month">Month</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cameras" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Front Camera</CardTitle>
                <CardDescription>Forward-facing camera feed and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground/60" />
                </div>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm">Live View</Button>
                  <Button variant="outline" size="sm">Recorded Clips</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cabin Camera</CardTitle>
                <CardDescription>Interior monitoring and driver assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground/60" />
                </div>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm">Live View</Button>
                  <Button variant="outline" size="sm">Recorded Clips</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure Drishti vision system parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Automatic Recording</h3>
                    <p className="text-sm text-muted-foreground">Record video clips when incidents are detected</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Detection Sensitivity</h3>
                    <p className="text-sm text-muted-foreground">Adjust how sensitively the system responds to events</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Alert Preferences</h3>
                    <p className="text-sm text-muted-foreground">Choose which events trigger notifications</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Camera Calibration</h3>
                    <p className="text-sm text-muted-foreground">Adjust camera positioning and field of view</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DrishtiStatusCardProps {
  title: string;
  status: string;
  statusColor: string;
  icon: React.ReactNode;
  description: string;
}

const DrishtiStatusCard: React.FC<DrishtiStatusCardProps> = ({
  title,
  status,
  statusColor,
  icon,
  description
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <p className={`text-xl font-bold ${statusColor}`}>{status}</p>
          </div>
          <div className="p-2 rounded-full bg-muted">
            {icon}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
};

// Sample data for the recent detections
const recentDetections = [
  {
    name: "Pothole Detected",
    time: "Today, 2:30 PM",
    status: "Moderate",
    statusColor: "text-amber-500",
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    bgColor: "bg-amber-100",
  },
  {
    name: "Lane Departure",
    time: "Today, 1:45 PM",
    status: "Minor",
    statusColor: "text-blue-500",
    icon: <AlertTriangle className="h-4 w-4 text-blue-500" />,
    bgColor: "bg-blue-100",
  },
  {
    name: "Traffic Sign Recognition",
    time: "Today, 12:15 PM",
    status: "Normal",
    statusColor: "text-green-500",
    icon: <Check className="h-4 w-4 text-green-500" />,
    bgColor: "bg-green-100",
  },
  {
    name: "Vehicle Proximity Alert",
    time: "Yesterday, 6:20 PM",
    status: "Caution",
    statusColor: "text-amber-500",
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    bgColor: "bg-amber-100",
  },
];

export default Drishti;