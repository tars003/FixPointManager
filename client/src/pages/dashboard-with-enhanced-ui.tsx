import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Vehicle } from '@shared/schema';
import ValueTrendPredictor from '@/components/dashboard/ValueTrendPredictor';
import CustomizeDashboardDialog, { DashboardModule } from '@/components/dashboard/CustomizeDashboardDialog';
import { getDashboardModules, saveDashboardModules } from '@/services/dashboardPreferences';
import FixPointCard from '@/components/membership/FixPointCard';
import { useMembership } from '@/hooks/use-membership';
import EnhancedHero from '@/components/hero/enhanced-hero';
import PremiumCard from '@/components/premium/premium-card-fixed';
import EnhancedCard from '@/components/ui/enhanced-card';
import AnimatedBarChart from '@/components/charts/animated-bar-chart';
import ProgressCircle from '@/components/charts/progress-circle';

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
  CheckCircle,
  MessageCircle,
  Share2,
  Activity,
  BarChart2,
  XCircle,
  CreditCard,
  Route,
  Calculator,
  TrendingUp,
  Info
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

const DashboardWithEnhancedUI = () => {
  const [, navigate] = useLocation();
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const [dashboardModules, setDashboardModules] = useState<DashboardModule[]>([]);
  
  // Load dashboard modules on initial render
  useEffect(() => {
    const modules = getDashboardModules();
    setDashboardModules(modules);
  }, []);
  
  // Handle saving dashboard modules
  const handleSaveDashboardModules = (modules: DashboardModule[]) => {
    setDashboardModules(modules);
    saveDashboardModules(modules);
  };
  
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
  
  // Stats
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
      id: 'membership',
      name: 'FixPoint Card',
      tagline: 'Premium vehicle management membership',
      description: 'Access exclusive benefits, priority service, and roadside assistance with your premium membership card.',
      icon: <CreditCard className="h-6 w-6 text-white" />,
      bgClass: 'bg-gradient-to-br from-indigo-600 to-blue-700',
      accentColor: 'bg-indigo-500',
      path: '/membership',
      stats: [
        { label: 'Points', value: '1,250', trend: 'up' },
        { label: 'Status', value: 'Premium', trend: 'up' },
        { label: 'Benefits', value: '24', trend: 'stable' }
      ]
    },
    {
      id: 'vehiclevault',
      name: 'Vehicle Vault',
      tagline: 'Manage your fleet in one secure place',
      description: 'Store, organize, and monitor all your vehicles with detailed profiles, service history, and document management.',
      icon: <Shield className="h-6 w-6 text-white" />,
      bgClass: 'bg-gradient-to-br from-violet-600 to-purple-700',
      accentColor: 'bg-violet-500',
      path: '/vehicle-vault',
      stats: [
        { label: 'Vehicles', value: '4', trend: 'up' },
        { label: 'Documents', value: '16', trend: 'up' },
        { label: 'Reminders', value: '3', trend: 'stable' }
      ]
    },
    {
      id: 'marketplace',
      name: 'Parts Marketplace',
      tagline: 'Shop genuine parts & accessories',
      description: 'Browse, compare, and purchase certified automotive parts and accessories with verified quality and competitive pricing.',
      icon: <ShoppingBag className="h-6 w-6 text-white" />,
      bgClass: 'bg-gradient-to-br from-cyan-500 to-sky-600',
      accentColor: 'bg-cyan-500',
      path: '/marketplace',
      stats: [
        { label: 'Trending Parts', value: '57', trend: 'up' },
        { label: 'Verified Sellers', value: '128', trend: 'up' },
        { label: 'Avg. Savings', value: '₹1,850', trend: 'up' }
      ]
    },
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
      path: '/testbeforebuy',
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
      path: '/nearby',
      keyFeature: 'Real-time location tracking of nearby service centers with ratings and reviews'
    },
    { 
      id: 'marketplace', 
      name: 'Parts Marketplace', 
      description: 'Browse & purchase verified spare parts',
      icon: <ShoppingBag className="h-5 w-5 text-cyan-500" />,
      color: 'bg-cyan-100 text-cyan-600',
      path: '/marketplace',
      keyFeature: 'Genuine parts verification and price comparison across multiple vendors'
    },
    { 
      id: 'documents', 
      name: 'Document Vault', 
      description: 'All your vehicle documents in one place',
      icon: <FileText className="h-5 w-5 text-violet-500" />,
      color: 'bg-violet-100 text-violet-600',
      path: '/documents',
      keyFeature: 'Automatic renewal reminders for insurance, registration and pollution certificates'
    },
    { 
      id: 'emergency', 
      name: 'Emergency Services', 
      description: 'Quick access to roadside assistance & help',
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      color: 'bg-amber-100 text-amber-600',
      path: '/emergency',
      keyFeature: '24/7 SOS assistance with one-tap calling and location sharing'
    },
    { 
      id: 'tripplanner', 
      name: 'Trip Planner', 
      description: 'Plan routes, estimate costs & save trips',
      icon: <Route className="h-5 w-5 text-teal-500" />,
      color: 'bg-teal-100 text-teal-600',
      path: '/trip-planner',
      keyFeature: 'Multi-destination planning with fuel costs and points of interest along routes'
    },
    { 
      id: 'calculators', 
      name: 'Calculators', 
      description: 'EMI, fuel, depreciation & insurance tools',
      icon: <Calculator className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-100 text-blue-600',
      path: '/calculators',
      keyFeature: 'Comprehensive financial planning tools for all aspects of vehicle ownership'
    },
  ];
  
  // Additional modules
  const additionalModules = [
    { 
      id: 'commercial', 
      name: 'Commercial Fleet', 
      description: 'Manage business vehicles',
      icon: <Truck className="h-5 w-5 text-purple-500" />,
      path: '/commercial-fleet' 
    },
    { 
      id: 'learning', 
      name: 'Learning Center', 
      description: 'Driving tips & courses',
      icon: <GraduationCap className="h-5 w-5 text-green-500" />,
      path: '/driving-education' 
    },
    { 
      id: 'energy', 
      name: 'Energy Monitor', 
      description: 'Track EV consumption',
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      path: '/energy' 
    },
    { 
      id: 'compare', 
      name: 'Vehicle Compare', 
      description: 'Side-by-side analysis',
      icon: <BarChart2 className="h-5 w-5 text-blue-500" />,
      path: '/compare' 
    }
  ];

  // Membership data
  const { data: membershipData } = useMembership();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 pb-10"
    >
      {/* Enhanced Hero Section */}
      <EnhancedHero
        userName={user.name}
        membershipTier={user.level}
        daysRemaining={128}
        vehicleCount={stats.totalVehicles}
        servicesBooked={stats.servicesBooked}
        upcomingAppointments={stats.upcomingAppointments}
        healthScore={averageHealthScore}
        onAddVehicle={() => navigate('/vehicle-vault')}
        onBookService={() => navigate('/book-service')}
      />
      
      {/* Vehicle Quick Access Row - Enhanced with animated cards */}
      <div className="max-w-7xl mx-auto -mt-12 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicleQuickAccess.map((vehicle) => (
            <EnhancedCard 
              key={vehicle.id}
              clickable
              onClick={() => navigate(`/vehicle-vault/vehicle/${vehicle.id}`)}
              className="bg-white shadow-md overflow-hidden"
              hoverEffect="scale"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">{vehicle.name}</h3>
                      <p className="text-xs text-slate-500">{vehicle.licensePlate}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge 
                      className={
                        vehicle.serviceStatus === 'up-to-date' 
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }
                    >
                      {vehicle.serviceStatus === 'up-to-date' ? 'Up to date' : 'Service due'}
                    </Badge>
                    <span className="text-xs text-slate-400 mt-1">{vehicle.lastUpdate}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <ProgressCircle
                    value={vehicle.healthScore}
                    size={60}
                    strokeWidth={6}
                    label="Health"
                    showValue={true}
                    valueFormatter={(value) => `${value}%`}
                    color={vehicle.healthScore > 85 ? 'text-emerald-500' : vehicle.healthScore > 70 ? 'text-amber-500' : 'text-red-500'}
                  />
                  <div className="ml-4">
                    <div className="text-xs text-slate-500 mb-1">Fuel Type</div>
                    <div className="text-sm font-medium text-slate-700 capitalize">{vehicle.fuelType}</div>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Content Column */}
          <div className="md:w-2/3">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <EnhancedCard
                className="p-5"
                hoverEffect="glow"
                clickable
                onClick={() => navigate('/vehicle-vault')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Car className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-slate-800">Vehicles</h3>
                    </div>
                    <div className="mt-3 flex items-baseline">
                      <span className="text-3xl font-bold text-slate-800">{stats.totalVehicles}</span>
                      <span className="ml-2 text-sm text-green-500 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        <span>Active</span>
                      </span>
                    </div>
                  </div>
                  <AnimatedBarChart
                    data={[
                      { label: "Sedan", value: 2, color: "bg-blue-500" },
                      { label: "SUV", value: 1, color: "bg-indigo-500" },
                      { label: "Other", value: 0, color: "bg-gray-300" }
                    ]}
                    height={60}
                    showValues={false}
                    showLabels={false}
                    className="w-24"
                  />
                </div>
              </EnhancedCard>
              
              <EnhancedCard
                className="p-5"
                hoverEffect="glow"
                clickable
                onClick={() => navigate('/book-service')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-slate-800">Services</h3>
                    </div>
                    <div className="mt-3 flex items-baseline">
                      <span className="text-3xl font-bold text-slate-800">{stats.servicesBooked}</span>
                      <span className="ml-2 text-sm text-emerald-500 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        <span>Completed</span>
                      </span>
                    </div>
                  </div>
                  <ProgressCircle
                    value={89}
                    size={70}
                    strokeWidth={6}
                    label="Satisfaction"
                    showValue={true}
                    valueFormatter={(value) => `${value}%`}
                    color="text-emerald-500"
                  />
                </div>
              </EnhancedCard>
              
              <EnhancedCard
                className="p-5"
                hoverEffect="glow"
                clickable
                onClick={() => navigate('/my-appointments')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <h3 className="font-medium text-slate-800">Upcoming</h3>
                    </div>
                    <div className="mt-3 flex items-baseline">
                      <span className="text-3xl font-bold text-slate-800">{stats.upcomingAppointments}</span>
                      <span className="ml-2 text-sm text-amber-500 flex items-center">
                        <Clock className="h-3 w-3 mr-0.5" />
                        <span>Scheduled</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    {stats.upcomingAppointments > 0 ? (
                      <>
                        <div className="text-xs text-slate-500">Next Service:</div>
                        <div className="text-sm font-medium text-slate-800">May 15, 2025</div>
                        <div className="text-xs text-slate-500">10:30 AM</div>
                      </>
                    ) : (
                      <div className="text-sm text-slate-500 italic">No appointments</div>
                    )}
                  </div>
                </div>
              </EnhancedCard>
            </div>
            
            {/* Platform Features */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold text-slate-800">Platform Features</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => setIsCustomizeDialogOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  <span>Customize</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {featureModules.filter(m => {
                  const module = dashboardModules.find(dm => dm.id === m.id);
                  return !module || module.visible;
                }).slice(0, 4).map((module) => (
                  <EnhancedCard
                    key={module.id}
                    clickable
                    onClick={() => navigate(module.path)}
                    className="overflow-hidden"
                    hoverEffect="raise"
                    variant={module.id === 'membership' ? 'premium' : 'default'}
                  >
                    <div className={`p-1 ${module.bgClass}`}>
                      <div className="flex items-center p-3">
                        <div className="p-2 rounded-full bg-white/20 mr-3">
                          {module.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{module.name}</h3>
                          <p className="text-xs text-white/80">{module.tagline}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-slate-600 mb-4">{module.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        {module.stats.map((stat, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="text-slate-500">{stat.label}</span>
                            <span className="font-semibold text-slate-700 mt-1 flex items-center">
                              {stat.value}
                              {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3 ml-0.5 text-green-500" />}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </EnhancedCard>
                ))}
              </div>
              
              {/* View All Features Button */}
              <div className="mt-4 text-center">
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => setIsCustomizeDialogOpen(true)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  <span>View All Features</span>
                </Button>
              </div>
            </div>
            
            {/* Vehicle Health Overview */}
            <EnhancedCard className="mb-8 p-6" isNew={true}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Vehicle Health Overview</h2>
                <div className="flex items-center text-sm text-slate-500">
                  <span>Fleet Average:</span>
                  <span className="font-semibold text-slate-700 ml-1">{averageHealthScore}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <AnimatedBarChart
                    data={vehicleQuickAccess.map(v => ({ 
                      label: v.name, 
                      value: v.healthScore,
                      color: v.healthScore > 85 ? 'bg-emerald-500' : v.healthScore > 70 ? 'bg-amber-500' : 'bg-red-500'
                    }))}
                    height={180}
                    title="Vehicle Health Scores"
                    subtitle="Current diagnostic ratings"
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
                
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Health Insights</h3>
                  
                  <div className="space-y-3">
                    <EnhancedCard className="p-3 border border-emerald-100">
                      <div className="flex items-start">
                        <div className="p-1 bg-emerald-100 rounded-full mr-3">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-800">All systems optimal</h4>
                          <p className="text-xs text-slate-500">2 vehicles are performing at peak efficiency</p>
                        </div>
                      </div>
                    </EnhancedCard>
                    
                    <EnhancedCard className="p-3 border border-amber-100">
                      <div className="flex items-start">
                        <div className="p-1 bg-amber-100 rounded-full mr-3">
                          <Info className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-800">Service recommended</h4>
                          <p className="text-xs text-slate-500">Hyundai Creta is due for maintenance in 7 days</p>
                        </div>
                      </div>
                    </EnhancedCard>
                    
                    <EnhancedCard className="p-3 border border-blue-100">
                      <div className="flex items-start">
                        <div className="p-1 bg-blue-100 rounded-full mr-3">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-800">Improved performance</h4>
                          <p className="text-xs text-slate-500">Honda City showing 12% better fuel efficiency after last service</p>
                        </div>
                      </div>
                    </EnhancedCard>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => navigate('/drishti')}
                >
                  <span>View Detailed Diagnostics</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </EnhancedCard>
            
            {/* Essential Tools */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-5">Essential Tools</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {essentialTools.map(tool => (
                  <EnhancedCard
                    key={tool.id}
                    clickable
                    onClick={() => navigate(tool.path)}
                    className="p-4"
                    hoverEffect="scale"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-full ${tool.color.split(' ')[0]} mr-3`}>
                          {tool.icon}
                        </div>
                        <h3 className="font-medium text-slate-800">{tool.name}</h3>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">{tool.description}</p>
                      <div className="mt-auto">
                        <div className="text-xs text-blue-600 flex items-center mt-2">
                          <span>Launch Tool</span>
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      </div>
                    </div>
                  </EnhancedCard>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-1/3">
            {/* Premium Card */}
            <div className="mb-6">
              <PremiumCard 
                userName={user.name}
                points={user.points}
                onViewMembership={() => navigate('/membership')}
                onUpgradeBenefits={() => navigate('/membership/upgrade')}
              />
            </div>
            
            {/* Next Service Card */}
            <EnhancedCard className="mb-6 overflow-hidden" variant="subtle">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-slate-800 flex items-center">
                  <Calendar className="h-4 w-4 text-blue-500 mr-1.5" />
                  <span>Next Service Reminder</span>
                </h3>
              </div>
              
              <div className="p-4">
                {stats.upcomingAppointments > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="p-1.5 bg-emerald-100 rounded-full mr-2">
                          <Wrench className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-slate-800">Regular Maintenance</span>
                      </div>
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                        Upcoming
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-slate-500 mb-1">
                        <Clock className="h-4 w-4 mr-1.5" />
                        <span>May 15, 2025 • 10:30 AM</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        <span>AutoCare Service Center, Indiranagar</span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700 mb-4">
                      <div className="flex items-start">
                        <Info className="h-4 w-4 mt-0.5 mr-1.5 flex-shrink-0" />
                        <p>15-point inspection, oil change, and filter replacement scheduled for your Hyundai Creta.</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button size="sm">View Details</Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-medium text-slate-800 mb-1">No upcoming services</h4>
                    <p className="text-slate-500 text-sm mb-4">All your vehicles are up to date with their maintenance schedules.</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/book-service')}
                    >
                      Schedule Service
                    </Button>
                  </div>
                )}
              </div>
            </EnhancedCard>
            
            {/* Vehicle Value Trend */}
            <EnhancedCard className="mb-6 overflow-hidden" isNew={true}>
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-slate-800 flex items-center">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-1.5" />
                  <span>Vehicle Value Trends</span>
                </h3>
              </div>
              
              <div className="p-4">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-slate-500">Average Portfolio Value</div>
                    <div className="text-xl font-bold text-slate-800">₹24,85,000</div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+2.4%</span>
                  </Badge>
                </div>
                
                <AnimatedBarChart
                  data={[
                    { label: "May", value: 2340000, color: "bg-blue-300" },
                    { label: "Jun", value: 2385000, color: "bg-blue-400" },
                    { label: "Jul", value: 2410000, color: "bg-blue-500" },
                    { label: "Aug", value: 2440000, color: "bg-blue-600" },
                    { label: "Sep", value: 2485000, color: "bg-blue-700" },
                  ]}
                  height={120}
                  valueFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                />
                
                <div className="mt-4 text-xs text-center text-slate-500">
                  Based on market analysis of similar vehicles and maintenance history
                </div>
              </div>
            </EnhancedCard>
            
            {/* Additional Tools */}
            <EnhancedCard className="overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-slate-800 flex items-center">
                  <Lightbulb className="h-4 w-4 text-blue-500 mr-1.5" />
                  <span>Additional Tools</span>
                </h3>
              </div>
              
              <div className="p-2">
                {additionalModules.map(module => (
                  <Button
                    key={module.id}
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 h-auto"
                    onClick={() => navigate(module.path)}
                  >
                    <div className="flex items-center w-full">
                      <div className="p-1.5 rounded-full bg-slate-100 mr-3">
                        {module.icon}
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-medium text-slate-800">{module.name}</h4>
                        <p className="text-xs text-slate-500">{module.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                    </div>
                  </Button>
                ))}
              </div>
            </EnhancedCard>
          </div>
        </div>
      </div>
      
      {/* Customize Dashboard Dialog */}
      <CustomizeDashboardDialog
        open={isCustomizeDialogOpen}
        onOpenChange={setIsCustomizeDialogOpen}
        modules={dashboardModules}
        onSaveModules={handleSaveDashboardModules}
      />
    </motion.div>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  onClick?: () => void;
}

function StatsCard({ icon, label, value, trend, onClick }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white/10 backdrop-blur-sm p-4 rounded-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <div className="p-2 bg-white/10 rounded-full mr-3">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <div className="flex items-center">
          {trend === 'up' && <ArrowUpRight className="h-4 w-4 text-emerald-300" />}
          {trend === 'down' && <ArrowUpRight className="h-4 w-4 text-red-300 rotate-90" />}
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardWithEnhancedUI;