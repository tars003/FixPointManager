import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, MapPin, Car, Wrench, CheckCircle2, Camera, ClipboardCheck, 
  ChevronDown, ChevronUp, CalendarClock, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Types
type ServiceStatus = 'scheduled' | 'in-progress' | 'on-way' | 'servicing' | 'completed' | 'delayed';

type Technician = {
  id: string;
  name: string;
  photo?: string;
  rating: number;
  specialization: string;
  experience: string;
};

type ServiceStep = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  estimatedTime?: string;
  completedAt?: string;
  notes?: string;
};

type ServiceBooking = {
  id: string;
  serviceType: string;
  vehicleId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: ServiceStatus;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimatedArrival?: string;
  technician?: Technician;
  progressPercentage: number;
  steps: ServiceStep[];
  liveStreamAvailable: boolean;
};

// Mock data for demonstration
const mockBooking: ServiceBooking = {
  id: 'SRV-12345',
  serviceType: 'Premium Service Package',
  vehicleId: 'v1',
  scheduledDate: '2025-05-15',
  scheduledTime: '10:00 AM',
  status: 'in-progress',
  currentLocation: {
    latitude: 19.0760,
    longitude: 72.8777,
    address: 'Andheri East, Mumbai, Maharashtra'
  },
  estimatedArrival: '15 minutes',
  technician: {
    id: 'tech-123',
    name: 'Rajesh Kumar',
    rating: 4.9,
    specialization: 'Engine Performance Specialist',
    experience: '8 years'
  },
  progressPercentage: 35,
  steps: [
    {
      id: 'step-1',
      title: 'Service Request Confirmed',
      description: 'Your service request has been confirmed and assigned to a technician',
      status: 'completed',
      completedAt: '2025-05-15 09:30 AM'
    },
    {
      id: 'step-2',
      title: 'Technician En Route',
      description: 'Your technician is on the way to your location',
      status: 'in-progress',
      estimatedTime: '15 minutes'
    },
    {
      id: 'step-3',
      title: 'Vehicle Inspection',
      description: 'Initial inspection of your vehicle before service',
      status: 'pending',
      estimatedTime: '20 minutes'
    },
    {
      id: 'step-4',
      title: 'Service in Progress',
      description: 'Main service work being performed on your vehicle',
      status: 'pending',
      estimatedTime: '120 minutes'
    },
    {
      id: 'step-5',
      title: 'Quality Check',
      description: 'Final inspection to ensure quality standards',
      status: 'pending',
      estimatedTime: '15 minutes'
    },
    {
      id: 'step-6',
      title: 'Service Completed',
      description: 'Your service has been successfully completed',
      status: 'pending'
    }
  ],
  liveStreamAvailable: true
};

// Helper function to get status color
const getStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'in-progress': return 'bg-amber-100 text-amber-800';
    case 'on-way': return 'bg-purple-100 text-purple-800';
    case 'servicing': return 'bg-indigo-100 text-indigo-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'delayed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: ServiceStatus) => {
  switch (status) {
    case 'scheduled': return <CalendarClock className="h-4 w-4" />;
    case 'in-progress': return <Clock className="h-4 w-4" />;
    case 'on-way': return <MapPin className="h-4 w-4" />;
    case 'servicing': return <Wrench className="h-4 w-4" />;
    case 'completed': return <CheckCircle2 className="h-4 w-4" />;
    case 'delayed': return <AlertTriangle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getStepStatusColor = (status: ServiceStep['status']) => {
  switch (status) {
    case 'pending': return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'in-progress': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'completed': return 'bg-green-50 text-green-700 border-green-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

// Real-time tracking component
const RealTimeTracking: React.FC = () => {
  const [booking, setBooking] = useState<ServiceBooking>(mockBooking);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [expandedSteps, setExpandedSteps] = useState<boolean>(true);
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBooking(prevBooking => {
        // Randomly update progress for demonstration
        const progressIncrement = Math.random() * 2;
        const newProgress = Math.min(100, prevBooking.progressPercentage + progressIncrement);
        
        // Update ETA
        let newEta = prevBooking.estimatedArrival;
        if (prevBooking.estimatedArrival?.includes('minutes')) {
          const minutes = parseInt(prevBooking.estimatedArrival.split(' ')[0]);
          if (minutes > 1) {
            newEta = `${minutes - 1} minutes`;
          } else {
            newEta = 'Less than 1 minute';
          }
        }
        
        // Update steps
        const updatedSteps = [...prevBooking.steps];
        
        // Check if we should update any step status based on progress
        if (newProgress > 20 && updatedSteps[1].status === 'in-progress' && Math.random() > 0.8) {
          updatedSteps[1].status = 'completed';
          updatedSteps[1].completedAt = new Date().toLocaleString();
          updatedSteps[2].status = 'in-progress';
        }
        
        if (newProgress > 40 && updatedSteps[2].status === 'in-progress' && Math.random() > 0.8) {
          updatedSteps[2].status = 'completed';
          updatedSteps[2].completedAt = new Date().toLocaleString();
          updatedSteps[3].status = 'in-progress';
        }
        
        return {
          ...prevBooking,
          progressPercentage: newProgress,
          estimatedArrival: newEta,
          steps: updatedSteps,
        };
      });
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Main booking status card */}
        <Card className="w-full md:w-2/3">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Service Tracking</CardTitle>
                <CardDescription>Track your service in real-time</CardDescription>
              </div>
              <Badge 
                className={`${getStatusColor(booking.status)} py-1 px-3 flex items-center gap-1`}
              >
                {getStatusIcon(booking.status)}
                {booking.status === 'scheduled' ? 'Scheduled' : 
                 booking.status === 'in-progress' ? 'In Progress' :
                 booking.status === 'on-way' ? 'On The Way' :
                 booking.status === 'servicing' ? 'Servicing' :
                 booking.status === 'completed' ? 'Completed' : 'Delayed'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-md">
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-1">Service Progress</h3>
                <div className="flex items-center gap-2">
                  <Progress value={booking.progressPercentage} className="h-2" />
                  <span className="text-sm font-medium">{Math.round(booking.progressPercentage)}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Service Type</span>
                  <span className="font-medium">{booking.serviceType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Scheduled Time</span>
                  <span className="font-medium">{booking.scheduledDate}, {booking.scheduledTime}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Service ID</span>
                  <span className="font-medium">{booking.id}</span>
                </div>
              </div>
            </div>
            
            {booking.technician && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-md">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-blue-200">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {booking.technician.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                    {booking.technician.photo && <AvatarImage src={booking.technician.photo} />}
                  </Avatar>
                  <div>
                    <p className="font-medium">{booking.technician.name}</p>
                    <p className="text-sm text-gray-600">{booking.technician.specialization}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm font-medium">{booking.technician.rating}</span>
                      </div>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-600">{booking.technician.experience}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant="outline" className="mb-2 bg-white">
                    <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="text-blue-700">On the way</span>
                  </Badge>
                  <p className="text-sm font-medium">ETA: {booking.estimatedArrival}</p>
                </div>
              </div>
            )}
            
            {/* Interactive service checklist */}
            <Collapsible open={expandedSteps} onOpenChange={setExpandedSteps}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Service Checklist</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {expandedSteps ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="mt-2">
                <div className="space-y-2">
                  {booking.steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border p-3 rounded-md ${getStepStatusColor(step.status)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {step.status === 'completed' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : step.status === 'in-progress' ? (
                              <Clock className="h-5 w-5 text-amber-500" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{step.title}</p>
                            <p className="text-sm text-gray-600">{step.description}</p>
                            {step.notes && (
                              <p className="text-sm italic mt-1 text-gray-600">{step.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          {step.status === 'completed' && step.completedAt && (
                            <span className="text-green-600">Completed at {step.completedAt}</span>
                          )}
                          {step.status === 'in-progress' && step.estimatedTime && (
                            <span className="text-amber-600">Est. time: {step.estimatedTime}</span>
                          )}
                          {step.status === 'pending' && step.estimatedTime && (
                            <span className="text-gray-500">Est. time: {step.estimatedTime}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm">
              Contact Technician
            </Button>
            <Button variant="secondary" size="sm">
              View Service Details
            </Button>
          </CardFooter>
        </Card>
        
        {/* Live stream and map sidebar */}
        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Live Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="map">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="map">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </TabsTrigger>
                <TabsTrigger value="stream">
                  <Camera className="h-4 w-4 mr-2" />
                  Live Feed
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="map" className="m-0">
                <div className="bg-slate-100 rounded-md overflow-hidden aspect-video flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Current Location</p>
                    <p className="text-xs text-gray-600 mt-1">{booking.currentLocation?.address}</p>
                    <Badge variant="outline" className="mt-2">
                      ETA: {booking.estimatedArrival}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <Button variant="outline" className="w-full">
                    Open in Maps
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="stream" className="m-0">
                {booking.liveStreamAvailable ? (
                  <div>
                    <div className="bg-slate-100 rounded-md overflow-hidden aspect-video flex items-center justify-center">
                      {showLiveStream ? (
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mt-2 animate-pulse">Live streaming...</p>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Live Stream Available</p>
                          <p className="text-xs text-gray-600 mt-1">Click below to start watching</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button 
                        variant={showLiveStream ? "destructive" : "default"} 
                        className="w-full"
                        onClick={() => setShowLiveStream(!showLiveStream)}
                      >
                        {showLiveStream ? "Stop Stream" : "Start Live Stream"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-100 rounded-md overflow-hidden aspect-video flex items-center justify-center">
                    <div className="text-center p-4">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium">Live Stream Unavailable</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Live stream will be available once service begins
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Recent Updates</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="text-sm">Technician has started the journey</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="text-sm">Service parts prepared and ready</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mt-2"></div>
                  <div>
                    <p className="text-sm">Technician assigned to your service</p>
                    <p className="text-xs text-gray-500">30 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeTracking;