import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Calendar, Clock, Zap, ChevronUp, TrendingDown, TrendingUp, 
  GaugeCircle, Droplets, Info, BarChart3, Wrench, AlertTriangle, PlugZap,
  Activity, Download, Share2, Upload, DollarSign, IndianRupee, Brain, Check, X, 
  MessageCircle, Car, Fuel, Coins, CircleDashed, AlertCircle, BadgeCheck, Share
} from 'lucide-react';

interface Vehicle {
  id: number;
  vehicle: string;
  worth: number;
  percentage: number;
  image: string;
  mileage: number;
  fuelType: string;
  batteryHealth?: number;
  engineHealth?: number;
  lastService: string;
  nextService: string;
  purchaseDate: string;
  insuranceValid: string;
  maintenanceCost: number;
  efficiency: string;
  averageCharge?: string;
  averageFuel?: string;
  range?: string;
  topSpeed?: string;
  carbonOffset?: string;
  emissionRating?: string;
}

interface VehicleDetailAnalysisProps {
  vehicle: Vehicle;
}

// Define recent activities for each vehicle
const recentActivities: Record<string, Array<{activity: string, timeAgo: string, icon: JSX.Element}>> = {
  'Tata Nexon EV': [
    { activity: 'Fuel refill', timeAgo: '3 days ago', icon: <Fuel className="h-4 w-4 text-green-500" /> },
    { activity: 'Oil check', timeAgo: '1 week ago', icon: <Droplets className="h-4 w-4 text-amber-500" /> },
    { activity: 'Trip to Mumbai', timeAgo: '2 weeks ago', icon: <Car className="h-4 w-4 text-blue-500" /> },
    { activity: 'Tire pressure check', timeAgo: '3 weeks ago', icon: <CircleDashed className="h-4 w-4 text-gray-500" /> },
    { activity: 'Washed vehicle', timeAgo: '1 month ago', icon: <Droplets className="h-4 w-4 text-blue-500" /> }
  ],
  'Honda City': [
    { activity: 'Fuel refill', timeAgo: '1 day ago', icon: <Fuel className="h-4 w-4 text-green-500" /> },
    { activity: 'Trip to Pune', timeAgo: '5 days ago', icon: <Car className="h-4 w-4 text-blue-500" /> },
    { activity: 'Tire replacement', timeAgo: '2 weeks ago', icon: <CircleDashed className="h-4 w-4 text-red-500" /> },
    { activity: 'Oil change', timeAgo: '1 month ago', icon: <Droplets className="h-4 w-4 text-amber-500" /> },
    { activity: 'Witnessed accident on highway', timeAgo: '1 month ago', icon: <AlertTriangle className="h-4 w-4 text-red-500" /> }
  ],
  'TVS iQube': [
    { activity: 'Fuel refill', timeAgo: '2 days ago', icon: <Fuel className="h-4 w-4 text-green-500" /> },
    { activity: 'Oil check', timeAgo: '1 week ago', icon: <Droplets className="h-4 w-4 text-amber-500" /> },
    { activity: 'Tire pressure', timeAgo: '2 weeks ago', icon: <CircleDashed className="h-4 w-4 text-gray-500" /> },
    { activity: 'First service', timeAgo: '3 months ago', icon: <Wrench className="h-4 w-4 text-blue-500" /> },
    { activity: 'Registration completed', timeAgo: '8 months ago', icon: <FileText className="h-4 w-4 text-purple-500" /> }
  ],
  'Mahindra XUV700': [
    { activity: 'Fuel refill', timeAgo: '5 days ago', icon: <Fuel className="h-4 w-4 text-green-500" /> },
    { activity: 'Trip to Goa', timeAgo: '2 weeks ago', icon: <Car className="h-4 w-4 text-blue-500" /> },
    { activity: 'Routine checkup', timeAgo: '1 month ago', icon: <Wrench className="h-4 w-4 text-gray-500" /> },
    { activity: 'Washed vehicle', timeAgo: '1 month ago', icon: <Droplets className="h-4 w-4 text-blue-500" /> },
    { activity: 'Software update', timeAgo: '2 months ago', icon: <Activity className="h-4 w-4 text-purple-500" /> }
  ],
  'Royal Enfield Classic 350': [
    { activity: 'Fuel refill', timeAgo: '1 week ago', icon: <Fuel className="h-4 w-4 text-green-500" /> },
    { activity: 'Group ride to hills', timeAgo: '3 weeks ago', icon: <Car className="h-4 w-4 text-blue-500" /> },
    { activity: 'Chain lubrication', timeAgo: '1 month ago', icon: <Wrench className="h-4 w-4 text-gray-500" /> },
    { activity: 'Brake pad replacement', timeAgo: '2 months ago', icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
    { activity: 'Modified exhaust installed', timeAgo: '3 months ago', icon: <Wrench className="h-4 w-4 text-purple-500" /> }
  ]
};

// Define AI generated stories for each vehicle
const vehicleStories: Record<string, string> = {
  'Tata Nexon EV': "Your Tata Nexon EV has been with you for 2 years, reliably serving through 15,000 km of urban commutes and 3 memorable road trips. Its electric powertrain has saved approximately ₹87,500 in fuel costs compared to a petrol equivalent, while helping reduce your carbon footprint by an estimated 3.2 tonnes of CO2.",
  'Honda City': "Your Honda City has been a loyal companion for 5 years, clocking 45,000 km across various terrains. It's witnessed 2 family vacations to the hills and has an impressive service record with only one major maintenance issue. The fuel efficiency remains excellent at 16.5 km/l, above the average for its age.",
  'TVS iQube': "The TVS iQube, your newest addition from 8 months ago, has transformed your daily commute. With 1,200 km on the odometer, it's already saved you 30 hours in traffic and reduced your monthly transportation budget by 35%. Its charging efficiency remains at factory optimal levels.",
  'Mahindra XUV700': "Your Mahindra XUV700, acquired just 16 months ago, has already become the family favorite for weekend getaways. With 8,500 km logged, it's taken you on 4 long trips and countless city drives. Its spacious interior and advanced safety features have provided peace of mind during monsoon travel conditions.",
  'Royal Enfield Classic 350': "The Royal Enfield Classic 350 has been your weekend companion for 3 years now. It's participated in 5 group rides, including the prestigious Royal Enfield Rider Mania. With 22,500 km on the odometer, it's developed that distinctive character that Royal Enfield enthusiasts cherish, and its value has remained remarkably stable."
};

// Document types for each vehicle
const documentTypes = [
  { name: 'Registration Certificate', icon: <FileText className="h-5 w-5 text-blue-500" /> },
  { name: 'Insurance Policy', icon: <FileText className="h-5 w-5 text-green-500" /> },
  { name: 'Service Records', icon: <FileText className="h-5 w-5 text-amber-500" /> },
  { name: 'Warranty Documents', icon: <FileText className="h-5 w-5 text-purple-500" /> },
  { name: 'Loan Documents', icon: <FileText className="h-5 w-5 text-red-500" /> },
  { name: 'Maintenance History', icon: <FileText className="h-5 w-5 text-indigo-500" /> },
  { name: 'Vehicle Manual', icon: <FileText className="h-5 w-5 text-gray-500" /> },
  { name: 'Modification Records', icon: <FileText className="h-5 w-5 text-orange-500" /> }
];

const VehicleDetailAnalysis: React.FC<VehicleDetailAnalysisProps> = ({ vehicle }) => {
  const isElectric = vehicle.fuelType === 'Electric';
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const handleSetReminder = () => {
    toast({
      title: "Reminder Set",
      description: `You'll be reminded about the service for your ${vehicle.vehicle} in 2 weeks.`
    });
  };
  
  const handleSaveToMemory = () => {
    toast({
      title: "Saved to Memory",
      description: "Vehicle story has been saved to your memories."
    });
  };
  
  const handleShareStory = () => {
    toast({
      title: "Story Shared",
      description: "Vehicle story has been shared to your contacts."
    });
  };
  
  // Get vehicle-specific recent activities or use a default
  const activities = recentActivities[vehicle.vehicle as keyof typeof recentActivities] || recentActivities['Honda City'];
  const story = vehicleStories[vehicle.vehicle as keyof typeof vehicleStories] || "Your vehicle has been serving you well. Our AI analysis is still learning about this particular model.";
  
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-14 h-14 flex items-center justify-center text-white shadow-lg">
          <Activity className="h-7 w-7" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{vehicle.vehicle}</h2>
              <p className="text-gray-500">
                Purchased on {vehicle.purchaseDate} • Insurance valid until {vehicle.insuranceValid}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="destructive" size="sm" className="gap-1">
                <IndianRupee className="h-4 w-4" />
                Sell Vehicle
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="overview" className="text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="activities" className="text-sm">
            Recent Activities
          </TabsTrigger>
          <TabsTrigger value="story" className="text-sm">
            AI Story
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-sm">
            Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-slate-500">Current Value</h3>
                    <p className="text-2xl font-bold">{formatCurrency(vehicle.worth)}</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-slate-500">Mileage</h3>
                    <p className="text-2xl font-bold">{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-slate-500">Maintenance Cost</h3>
                    <p className="text-2xl font-bold">{formatCurrency(vehicle.maintenanceCost)}</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-slate-500">{isElectric ? 'Battery Health' : 'Engine Health'}</h3>
                    <p className="text-2xl font-bold">{isElectric ? vehicle.batteryHealth : vehicle.engineHealth}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Service Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Last Service</span>
                    <span className="text-sm font-medium">{vehicle.lastService}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Next Service</span>
                    <span className="text-sm font-medium">{vehicle.nextService}</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleSetReminder}>
                  <Calendar className="h-4 w-4" />
                  Set Reminder
                </Button>
              </CardContent>
            </Card>
            
            {isElectric ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Battery Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Health</span>
                      <span className="text-sm font-medium">{vehicle.batteryHealth}%</span>
                    </div>
                    <Progress value={vehicle.batteryHealth} className="h-1.5" />
                    
                    <div className="flex justify-between mt-4">
                      <span className="text-sm text-slate-500">Avg. Charge</span>
                      <span className="text-sm font-medium">{vehicle.averageCharge}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Range</span>
                      <span className="text-sm font-medium">{vehicle.range}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Efficiency</span>
                      <span className="text-sm font-medium">{vehicle.efficiency}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GaugeCircle className="h-4 w-4 text-blue-500" />
                    Engine Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Health</span>
                      <span className="text-sm font-medium">{vehicle.engineHealth}%</span>
                    </div>
                    <Progress value={vehicle.engineHealth} className="h-1.5" />
                    
                    <div className="flex justify-between mt-4">
                      <span className="text-sm text-slate-500">Efficiency</span>
                      <span className="text-sm font-medium">{vehicle.efficiency}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Consumption</span>
                      <span className="text-sm font-medium">{vehicle.averageFuel}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Top Speed</span>
                      <span className="text-sm font-medium">{vehicle.topSpeed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-500" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {isElectric ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Carbon Offset</span>
                        <span className="text-sm font-medium">{vehicle.carbonOffset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">vs. Petrol</span>
                        <span className="text-sm font-medium flex items-center gap-1">
                          <TrendingDown className="h-3 w-3 text-emerald-500" />
                          -80%
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Emission Rating</span>
                        <span className="text-sm font-medium">{vehicle.emissionRating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Carbon Footprint</span>
                        <span className="text-sm font-medium">2.4 tonnes/year</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Eco Score</span>
                    <span className="text-sm font-medium">{isElectric ? '95/100' : '72/100'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest events and updates related to your vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="bg-gray-100 rounded-full p-2 mt-1">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{activity.activity}</h4>
                      <p className="text-xs text-gray-500">{activity.timeAgo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">View All History</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="story" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    AI-Generated Vehicle Story
                  </CardTitle>
                  <CardDescription>A personalized narrative based on your vehicle's data</CardDescription>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  AI-Powered
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-lg border border-purple-100 dark:border-slate-700">
                <div className="mb-3 flex items-center">
                  <div className="bg-white dark:bg-slate-700 rounded-full p-1.5 mr-2 shadow-sm">
                    <Car className="h-4 w-4 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium">{vehicle.vehicle}</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {story}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleSaveToMemory}>
                <Download className="h-4 w-4" />
                Save to Memory
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleShareStory}>
                <Share2 className="h-4 w-4" />
                Share Story
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Documents</CardTitle>
              <CardDescription>Manage all important documents related to your vehicle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {documentTypes.map((doc, index) => (
                  <Card key={index} className="border border-gray-200 dark:border-gray-800">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="mb-2">
                        {doc.icon}
                      </div>
                      <h4 className="text-sm font-medium mb-3">{doc.name}</h4>
                      <div className="flex gap-1.5 mt-auto">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download All
              </Button>
              <Button variant="default" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleDetailAnalysis;