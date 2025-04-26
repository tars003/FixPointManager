import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
  UserCog
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

const Drishti: React.FC = () => {
  const [mainTab, setMainTab] = useState<string>('dashboard');
  const [advancedFeatureTab, setAdvancedFeatureTab] = useState<string>('energy');
  const [advancedAIFeatureTab, setAdvancedAIFeatureTab] = useState<string>('route');
  
  return (
    <div className="container px-4 py-6 mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
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