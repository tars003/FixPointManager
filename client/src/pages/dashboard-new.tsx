import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Vehicle } from '@shared/schema';
import { 
  Car, 
  Bell, 
  Wrench, 
  MapPin, 
  History, 
  FileText,
  ShoppingBag,
  Calendar,
  Shield,
  ArrowRight,
  ChevronRight,
  Clock,
  BarChart3,
  Settings,
  CircleDollarSign,
  IndianRupee,
  RefreshCw,
  User,
  Sparkles,
  GraduationCap,
  Palette,
  HeartPulse,
  Truck,
  Lightbulb,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/format';
import { NotificationPopover } from '@/components/notification/notification-popover';
import { useTabWithScroll } from '@/hooks/use-scroll-top';

const DashboardNew = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useTabWithScroll<string>('overview');
  
  // Mock data for user
  const user = {
    name: 'Raj Kumar',
    id: 1,
    profileImage: '',
    points: 1250,
    level: 'Gold Member',
    nextLevelProgress: 75
  };
  
  // Fetch user's vehicles
  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles', { userId: user.id }],
    enabled: !!user.id,
  });
  
  // Mock stats
  const stats = {
    totalVehicles: vehicles?.length || 3,
    servicesBooked: 24,
    upcomingAppointments: 2,
    partsOrdered: 12,
    totalPoints: user.points
  };
  
  // Mock upcoming services
  const upcomingServices = [
    {
      id: 1,
      date: '2025-05-25',
      vehicle: 'Honda City',
      service: 'Regular Maintenance',
      daysLeft: 14,
      location: 'AutoCare Premium, Mumbai'
    },
    {
      id: 2,
      date: '2025-06-10',
      vehicle: 'Hyundai Creta',
      service: 'Engine Oil Change',
      daysLeft: 30,
      location: 'Service Station Plus, Delhi'
    }
  ];
  
  // Mock vehicle health status
  const vehicleHealthStatus = [
    {
      id: 1,
      name: 'Honda City',
      status: 'Good',
      score: 88,
      lastChecked: '2025-04-15',
      issues: 0
    },
    {
      id: 2,
      name: 'Hyundai Creta',
      status: 'Attention Needed',
      score: 75,
      lastChecked: '2025-04-10',
      issues: 1
    },
    {
      id: 3,
      name: 'Maruti Swift',
      status: 'Excellent',
      score: 95,
      lastChecked: '2025-04-20',
      issues: 0
    }
  ];
  
  // Main feature sections
  const mainFeatures = [
    {
      id: 'vehicles',
      name: 'VehicleVault',
      description: 'Manage all your vehicle details in one place',
      icon: <Car className="h-5 w-5" />,
      path: '/vehicle-vault',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'service',
      name: 'Service Booking',
      description: 'Schedule maintenance and repairs',
      icon: <Wrench className="h-5 w-5" />,
      path: '/book-service',
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'drishti',
      name: 'Drishti Intelligence',
      description: 'Advanced diagnostics and performance insights',
      icon: <HeartPulse className="h-5 w-5" />,
      path: '/drishti',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'arena',
      name: 'Arena Customization',
      description: 'Design and visualize vehicle modifications',
      icon: <Palette className="h-5 w-5" />,
      path: '/arena',
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50'
    }
  ];
  
  // Secondary features
  const secondaryFeatures = [
    { 
      id: 'nearby', 
      name: 'Nearby Services', 
      icon: <MapPin className="h-5 w-5 text-rose-500" />,
      path: '/nearby' 
    },
    { 
      id: 'marketplace', 
      name: 'Parts Marketplace', 
      icon: <ShoppingBag className="h-5 w-5 text-cyan-500" />,
      path: '/marketplace' 
    },
    { 
      id: 'learn', 
      name: 'Learning Center', 
      icon: <GraduationCap className="h-5 w-5 text-green-500" />,
      path: '/learning-center' 
    },
    { 
      id: 'test-buy', 
      name: 'TestBeforeBuy', 
      icon: <Building2 className="h-5 w-5 text-blue-500" />,
      path: '/testbeforebuy' 
    },
    { 
      id: 'emergency', 
      name: 'Emergency Services', 
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      path: '/emergency' 
    },
    { 
      id: 'commercial', 
      name: 'Commercial Fleet', 
      icon: <Truck className="h-5 w-5 text-purple-500" />,
      path: '/commercial-fleet' 
    }
  ];
  
  // Activity feed
  const recentActivity = [
    {
      id: 1,
      type: 'service',
      title: 'Service Completed',
      description: 'Regular maintenance for Honda City',
      timestamp: '2025-04-15',
      icon: <Wrench className="h-4 w-4 text-emerald-500" />
    },
    {
      id: 2,
      type: 'parts',
      title: 'Parts Ordered',
      description: 'Air filter and wiper blades',
      timestamp: '2025-04-10',
      icon: <ShoppingBag className="h-4 w-4 text-cyan-500" />
    },
    {
      id: 3,
      type: 'inspection',
      title: 'Inspection Report',
      description: 'Honda City passed with 92% score',
      timestamp: '2025-04-05',
      icon: <FileText className="h-4 w-4 text-violet-500" />
    },
    {
      id: 4,
      type: 'registration',
      title: 'Document Reminder',
      description: 'Vehicle insurance renewal due in 15 days',
      timestamp: '2025-04-01',
      icon: <Calendar className="h-4 w-4 text-rose-500" />
    }
  ];
  
  // Function to handle navigation to different sections
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  // Function to get status color
  const getStatusColor = (score: number) => {
    if (score >= 90) return 'text-green-500 bg-green-50';
    if (score >= 75) return 'text-amber-500 bg-amber-50';
    return 'text-rose-500 bg-rose-50';
  };
  
  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header with stats */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4 border-2 border-white">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="bg-blue-700">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h2>
                <div className="flex items-center mt-1">
                  <Sparkles className="h-4 w-4 mr-1" />
                  <span>{user.level} · {user.points} Points</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 max-w-sm">
              <div className="flex justify-between text-xs mb-1">
                <span>Level Progress</span>
                <span>{user.nextLevelProgress}%</span>
              </div>
              <Progress value={user.nextLevelProgress} className="h-1.5 bg-blue-400/30" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-3 rounded-lg"
              whileHover={{ y: -3 }}
            >
              <div className="text-white/70 text-xs mb-1">Vehicles</div>
              <div className="text-xl font-bold">{stats.totalVehicles}</div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-3 rounded-lg"
              whileHover={{ y: -3 }}
            >
              <div className="text-white/70 text-xs mb-1">Services Booked</div>
              <div className="text-xl font-bold">{stats.servicesBooked}</div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-3 rounded-lg"
              whileHover={{ y: -3 }}
            >
              <div className="text-white/70 text-xs mb-1">Upcoming</div>
              <div className="text-xl font-bold">{stats.upcomingAppointments}</div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-3 rounded-lg"
              whileHover={{ y: -3 }}
            >
              <div className="text-white/70 text-xs mb-1">Parts Ordered</div>
              <div className="text-xl font-bold">{stats.partsOrdered}</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Main Feature Cards */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              onClick={() => navigateTo(feature.path)}
            >
              <div className={`h-2 ${feature.color}`} />
              <div className="p-5">
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  {React.cloneElement(feature.icon, { className: `h-6 w-6 ${feature.color.replace('bg-', 'text-')}` })}
                </div>
                <h3 className="text-lg font-semibold mb-1">{feature.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{feature.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 w-full flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo(feature.path);
                  }}
                >
                  Open {feature.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Dashboard Tabs */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 lg:w-[400px] mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Vehicle Health Cards */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Vehicle Health</CardTitle>
                    <CardDescription>Current status of your vehicles</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigateTo('/vehicle-vault')}
                    className="flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicleHealthStatus.map((vehicle) => (
                    <div 
                      key={vehicle.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigateTo(`/vehicle-vault/${vehicle.id}`)}
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-50 p-2 rounded-md mr-4">
                          <Car className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{vehicle.name}</h4>
                          <div className="text-sm text-gray-500">
                            Last checked: {formatDate(vehicle.lastChecked)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4 text-right">
                          <div className={`text-sm font-medium ${getStatusColor(vehicle.score)}`}>
                            {vehicle.status}
                          </div>
                          <div className="text-xs text-gray-500">
                            {vehicle.issues} {vehicle.issues === 1 ? 'issue' : 'issues'} found
                          </div>
                        </div>
                        <Badge 
                          className={getStatusColor(vehicle.score).replace('text-', 'bg-').replace('bg-', 'text-')}
                        >
                          {vehicle.score}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Two column layout for services and quick access */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Services */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Upcoming Services</CardTitle>
                        <CardDescription>Scheduled maintenance and services</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigateTo('/book-service')}
                        className="flex items-center gap-1"
                      >
                        View All
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {upcomingServices.length === 0 ? (
                      <div className="text-center py-6">
                        <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <h4 className="font-medium">No Upcoming Services</h4>
                        <p className="text-sm text-gray-500 mt-1 mb-4">Book a service to see it here</p>
                        <Button 
                          size="sm" 
                          onClick={() => navigateTo('/book-service')}
                        >
                          Book Service
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcomingServices.map((service) => (
                          <div 
                            key={service.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigateTo(`/book-service/${service.id}`)}
                          >
                            <div className="flex items-center">
                              <div className="bg-emerald-50 p-2 rounded-md mr-4">
                                <Wrench className="h-5 w-5 text-emerald-500" />
                              </div>
                              <div>
                                <div className="font-medium">{service.service}</div>
                                <div className="text-sm text-gray-500">{service.vehicle}</div>
                                <div className="text-xs text-gray-400 mt-1">{service.location}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatDate(service.date)}</div>
                              <Badge 
                                className={service.daysLeft <= 7 ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}
                              >
                                {service.daysLeft} days left
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Access */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Access</CardTitle>
                    <CardDescription>Frequently used features</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {secondaryFeatures.map((feature) => (
                        <Button
                          key={feature.id}
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                          onClick={() => navigateTo(feature.path)}
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {feature.icon}
                          </div>
                          <span className="text-xs">{feature.name}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex">
                      <div className="bg-gray-100 rounded-full p-2 mr-4 h-fit">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                        <Separator className="mt-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Booking Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Book a Service</CardTitle>
                  <CardDescription>Schedule maintenance for your vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="flex justify-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : vehicles && vehicles.length > 0 ? (
                      vehicles.map((vehicle) => (
                        <div 
                          key={vehicle.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                          onClick={() => navigateTo(`/book-service/${vehicle.id}`)}
                        >
                          <div className="flex items-center">
                            <div className="bg-blue-50 p-2 rounded-md mr-4">
                              <Car className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <div className="font-medium">{vehicle.name}</div>
                              <div className="text-sm text-gray-500">
                                {vehicle.make} {vehicle.model} • {vehicle.year}
                              </div>
                            </div>
                          </div>
                          <Button size="sm">Book Service</Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Car className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <h4 className="font-medium">No Vehicles Found</h4>
                        <p className="text-sm text-gray-500 mt-1 mb-4">Add a vehicle first</p>
                        <Button 
                          size="sm" 
                          onClick={() => navigateTo('/vehicle-vault')}
                        >
                          Add Vehicle
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Nearby Services Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Nearby Service Centers</CardTitle>
                  <CardDescription>Find trusted service centers near you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg h-40 mb-4 flex items-center justify-center">
                    <MapPin className="h-10 w-10 text-gray-300" />
                  </div>
                  <Button className="w-full" onClick={() => navigateTo('/nearby')}>
                    Explore Nearby Services
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Service History */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Service History</CardTitle>
                <CardDescription>Past services and maintenance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <History className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <h4 className="font-medium">Service History Coming Soon</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    We're working on bringing your service history here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {/* Drishti Insights Card */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <HeartPulse className="h-5 w-5 text-purple-500" />
                      Drishti Intelligence
                    </CardTitle>
                    <CardDescription>Advanced vehicle performance insights</CardDescription>
                  </div>
                  <Button onClick={() => navigateTo('/drishti')}>
                    Open Drishti
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                  <div className="p-6 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">92%</div>
                    <div className="text-sm text-gray-500">Average Health Score</div>
                  </div>
                  <div className="p-6 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">17%</div>
                    <div className="text-sm text-gray-500">Fuel Efficiency Improved</div>
                  </div>
                  <div className="p-6 text-center">
                    <div className="text-4xl font-bold text-amber-600 mb-2">3</div>
                    <div className="text-sm text-gray-500">Preventive Alerts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Analytics Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Usage Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                    <BarChart3 className="h-10 w-10 text-gray-300" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-green-500" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                    <IndianRupee className="h-10 w-10 text-gray-300" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Arena Preview */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-amber-500" />
                      Arena Customization Studio
                    </CardTitle>
                    <CardDescription>Design your dream vehicle</CardDescription>
                  </div>
                  <Button onClick={() => navigateTo('/arena')}>
                    Open Arena
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Palette className="h-12 w-12 text-amber-500 mb-3" />
                  <h3 className="text-lg font-medium">Customize Your Vehicle</h3>
                  <p className="text-sm text-gray-500 max-w-md mt-1 mb-4">
                    Use our 360° interactive studio to visualize modifications before making them
                  </p>
                  <Button variant="outline" onClick={() => navigateTo('/arena')}>
                    Start Designing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default DashboardNew;