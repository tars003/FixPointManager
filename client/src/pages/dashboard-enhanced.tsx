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
  User,
  Sparkles,
  GraduationCap,
  Palette,
  HeartPulse,
  Truck,
  Lightbulb,
  Building2,
  Zap,
  Eye,
  Star,
  Award,
  PieChart,
  RefreshCw,
  Search,
  ArrowUpRight,
  CheckCircle
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

const DashboardEnhanced = () => {
  const [, navigate] = useLocation();
  
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
  
  // Health score
  const averageHealthScore = 86;
  
  // Key feature modules
  const featureModules = [
    {
      id: 'drishti',
      name: 'Drishti Intelligence',
      tagline: 'Smart diagnostics & preventive insights',
      description: 'Get real-time OBD2+GPS diagnostics, predictive maintenance alerts, and performance analytics for all your vehicles.',
      icon: <HeartPulse className="h-6 w-6 text-white" />,
      bgClass: 'bg-gradient-to-br from-purple-600 to-indigo-600',
      accentColor: 'bg-purple-500',
      path: '/drishti',
      stats: [
        { label: 'Health Score', value: '92%', trend: 'up' },
        { label: 'Issues Detected', value: '0', trend: 'stable' },
        { label: 'Fuel Efficiency', value: '+17%', trend: 'up' }
      ]
    },
    {
      id: 'arena',
      name: 'Arena Studio',
      tagline: 'Visualize your dream mods',
      description: 'Design custom vehicle modifications with 360° visualization, real-time parts integration, and share with the community.',
      icon: <Palette className="h-6 w-6 text-white" />,
      bgClass: 'bg-gradient-to-br from-amber-500 to-orange-600',
      accentColor: 'bg-amber-500',
      path: '/arena',
      stats: [
        { label: 'Projects', value: '3', trend: 'up' },
        { label: 'Parts Explored', value: '47', trend: 'up' },
        { label: 'Community Likes', value: '125', trend: 'up' }
      ]
    },
    {
      id: 'service',
      name: 'Service Booking',
      tagline: 'Hassle-free maintenance',
      description: 'Schedule services, track appointments, and maintain complete service history with trusted service providers.',
      icon: <Wrench className="h-6 w-6 text-white" />,
      bgClass: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      accentColor: 'bg-emerald-500',
      path: '/book-service',
      stats: [
        { label: 'Next Service', value: '14 days', trend: 'stable' },
        { label: 'Total Bookings', value: '24', trend: 'up' },
        { label: 'Saved Time', value: '32 hrs', trend: 'up' }
      ]
    },
    {
      id: 'testbuybefore',
      name: 'TestBeforeBuy',
      tagline: 'Compare before you decide',
      description: 'Compare up to 5 vehicles, book test drives, and find the perfect match for your needs before purchasing.',
      icon: <Building2 className="h-6 w-6 text-white" />,
      bgClass: 'bg-gradient-to-br from-blue-500 to-sky-600',
      accentColor: 'bg-blue-500',
      path: '/autovista',
      stats: [
        { label: 'Vehicles Compared', value: '12', trend: 'up' },
        { label: 'Test Drives', value: '4', trend: 'up' },
        { label: 'Saved Searches', value: '7', trend: 'up' }
      ]
    }
  ];
  
  // Vehicle quick access
  const vehicleQuickAccess = [
    {
      id: 1,
      name: 'Honda City',
      licensePlate: 'MH02AB1234',
      healthScore: 92,
      serviceStatus: 'up-to-date',
      fuelType: 'petrol',
      lastUpdate: '3 hours ago',
      imageSrc: ''
    },
    {
      id: 2,
      name: 'Hyundai Creta',
      licensePlate: 'KA01MJ5678',
      healthScore: 75,
      serviceStatus: 'due',
      fuelType: 'diesel',
      lastUpdate: '1 day ago',
      imageSrc: ''
    },
    {
      id: 3,
      name: 'Maruti Swift',
      licensePlate: 'DL7CX9012',
      healthScore: 95,
      serviceStatus: 'up-to-date',
      fuelType: 'petrol',
      lastUpdate: '5 hours ago',
      imageSrc: ''
    }
  ];
  
  // Essential tools section
  const essentialTools = [
    { 
      id: 'nearby', 
      name: 'Nearby Services', 
      description: 'Find workshops, fuel stations & more near you',
      icon: <MapPin className="h-5 w-5 text-rose-500" />,
      color: 'bg-rose-100 text-rose-600',
      path: '/nearby' 
    },
    { 
      id: 'marketplace', 
      name: 'Parts Marketplace', 
      description: 'Browse & purchase verified spare parts',
      icon: <ShoppingBag className="h-5 w-5 text-cyan-500" />,
      color: 'bg-cyan-100 text-cyan-600',
      path: '/marketplace' 
    },
    { 
      id: 'documents', 
      name: 'Document Vault', 
      description: 'All your vehicle documents in one place',
      icon: <FileText className="h-5 w-5 text-violet-500" />,
      color: 'bg-violet-100 text-violet-600',
      path: '/documents' 
    },
    { 
      id: 'emergency', 
      name: 'Emergency Services', 
      description: 'Quick access to roadside assistance & help',
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      color: 'bg-amber-100 text-amber-600',
      path: '/emergency' 
    },
  ];
  
  // Additional modules
  const additionalModules = [
    { 
      id: 'commercial', 
      name: 'Commercial Fleet', 
      icon: <Truck className="h-5 w-5 text-purple-500" />,
      path: '/commercial-fleet' 
    },
    { 
      id: 'learning', 
      name: 'Learning Center', 
      icon: <GraduationCap className="h-5 w-5 text-green-500" />,
      path: '/driving-education' 
    },
    { 
      id: 'energy', 
      name: 'Energy Monitor', 
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      path: '/energy' 
    },
    { 
      id: 'compare', 
      name: 'Vehicle Compare', 
      icon: <PieChart className="h-5 w-5 text-blue-500" />,
      path: '/compare' 
    },
    { 
      id: 'history', 
      name: 'Service History', 
      icon: <History className="h-5 w-5 text-emerald-500" />,
      path: '/history' 
    },
    { 
      id: 'fastag', 
      name: 'FASTag & eChallan', 
      icon: <IndianRupee className="h-5 w-5 text-rose-500" />,
      path: '/fastag-echallan' 
    },
  ];
  
  // Function to handle navigation to different sections
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  // Function to get health status color
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-amber-500';
    return 'text-rose-500';
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="pb-12">
      {/* Hero section with main stats & welcome */}
      <motion.div
        className="bg-gradient-to-r from-blue-700 to-indigo-700 pt-12 pb-24 px-4 rounded-b-3xl relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background decorative elements */}
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute top-1/4 left-0 w-32 h-32 bg-white opacity-5 rounded-full transform -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            {/* Welcome & profile section */}
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Avatar className="h-16 w-16 border-4 border-white/20 mr-4">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback className="bg-indigo-800 text-lg">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back, {user.name.split(' ')[0]}</h1>
                  <div className="flex items-center mt-1 text-blue-100">
                    <Sparkles className="h-4 w-4 mr-1" />
                    <span>{user.level} • {user.points} Points</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigateTo('/vehicles/add')}
                className="bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
              <Button 
                onClick={() => navigateTo('/book-service')}
                className="bg-white text-indigo-700 hover:bg-white/90 border-0"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Book Service
              </Button>
              <NotificationPopover />
            </div>
          </div>
          
          {/* Stats Counters */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatsCard 
              icon={<Car className="h-5 w-5" />}
              label="Vehicles"
              value={stats.totalVehicles.toString()}
              trend="stable"
              onClick={() => navigateTo('/vehicle-vault')}
            />
            <StatsCard 
              icon={<Wrench className="h-5 w-5" />}
              label="Services Booked"
              value={stats.servicesBooked.toString()}
              trend="up"
              onClick={() => navigateTo('/book-service')}
            />
            <StatsCard 
              icon={<Calendar className="h-5 w-5" />}
              label="Upcoming Appointments"
              value={stats.upcomingAppointments.toString()}
              trend="up"
              onClick={() => navigateTo('/book-service')}
            />
            <StatsCard 
              icon={<Shield className="h-5 w-5" />}
              label="Health Score"
              value={`${averageHealthScore}%`}
              trend="up"
              onClick={() => navigateTo('/drishti')}
            />
          </div>
        </div>
      </motion.div>
      
      {/* Vehicle quick access strip */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 mb-12">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Your Vehicles</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigateTo('/vehicle-vault')}
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            >
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicleQuickAccess.map(vehicle => (
              <motion.div 
                key={vehicle.id}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ y: -3 }}
                onClick={() => navigateTo(`/vehicle-vault/${vehicle.id}`)}
              >
                <div className="h-24 bg-gray-100 flex items-center justify-center relative">
                  {vehicle.imageSrc ? (
                    <img 
                      src={vehicle.imageSrc} 
                      alt={vehicle.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <Car className="h-10 w-10 text-gray-400" />
                  )}
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      vehicle.fuelType === 'electric' 
                        ? 'bg-blue-100 text-blue-600'
                        : vehicle.fuelType === 'diesel'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {vehicle.fuelType}
                  </Badge>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{vehicle.name}</h4>
                      <p className="text-xs text-gray-500">{vehicle.licensePlate}</p>
                    </div>
                    <Badge 
                      className={vehicle.healthScore >= 90
                        ? 'bg-emerald-100 text-emerald-700'
                        : vehicle.healthScore >= 75
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }
                    >
                      {vehicle.healthScore}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className={`flex items-center ${
                      vehicle.serviceStatus === 'up-to-date'
                        ? 'text-emerald-600'
                        : vehicle.serviceStatus === 'due'
                          ? 'text-amber-600'
                          : 'text-rose-600'
                    }`}>
                      {vehicle.serviceStatus === 'up-to-date' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      <span>
                        {vehicle.serviceStatus === 'up-to-date' 
                          ? 'Service up to date' 
                          : vehicle.serviceStatus === 'due'
                            ? 'Service due'
                            : 'Service overdue'
                        }
                      </span>
                    </div>
                    <span className="text-gray-400">Updated {vehicle.lastUpdate}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Key Feature Modules */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Key Features</h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => {}}
            >
              Customize Dashboard
              <Settings className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featureModules.map((module, index) => (
              <motion.div
                key={module.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer border"
                onClick={() => navigateTo(module.path)}
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div className={`${module.bgClass} p-5`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="bg-white/20 p-2 rounded-lg mr-4">
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{module.name}</h3>
                        <p className="text-white/80 text-sm">{module.tagline}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo(module.path);
                      }}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="text-gray-600 mb-5">{module.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {module.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Essential Tools Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Essential Tools</h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {essentialTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigateTo(tool.path)}
                variants={itemVariants}
                whileHover={{ y: -3 }}
              >
                <div className="p-5">
                  <div className={`w-12 h-12 rounded-full ${tool.color.split(' ')[0]} flex items-center justify-center mb-4`}>
                    {React.cloneElement(tool.icon, { className: `h-6 w-6 ${tool.color.split(' ')[1]}` })}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{tool.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{tool.description}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 -ml-2 mt-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo(tool.path);
                    }}
                  >
                    Access Tool
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Footer Tools Section */}
        <section>
          <div className="flex items-center mb-5">
            <h2 className="text-xl font-bold">More Modules</h2>
            <Separator className="flex-1 ml-3" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {additionalModules.map((module) => (
              <Button
                key={module.id}
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center gap-3"
                onClick={() => navigateTo(module.path)}
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {module.icon}
                </div>
                <span className="text-sm">{module.name}</span>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  icon, 
  label, 
  value, 
  trend,
  onClick
}) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer"
      whileHover={{ y: -3, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
      onClick={onClick}
    >
      <div className="flex items-center text-white/70 mb-3">
        {React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4 mr-2' })}
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend === 'up' && (
          <div className="flex items-center text-emerald-300 text-sm">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            <span>Up</span>
          </div>
        )}
        {trend === 'down' && (
          <div className="flex items-center text-rose-300 text-sm">
            <ArrowUpRight className="h-3 w-3 mr-1 transform rotate-90" />
            <span>Down</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Helper icons
function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default DashboardEnhanced;