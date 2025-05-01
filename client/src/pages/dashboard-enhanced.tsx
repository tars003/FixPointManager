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
  CreditCard
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
      icon: <PieChart className="h-5 w-5 text-blue-500" />,
      path: '/compare' 
    },
    { 
      id: 'history', 
      name: 'Service History', 
      description: 'Past service records',
      icon: <History className="h-5 w-5 text-emerald-500" />,
      path: '/history' 
    },
    { 
      id: 'fastag', 
      name: 'FASTag & eChallan', 
      description: 'Manage tolls & fines',
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
      {/* Customize Dashboard Dialog */}
      <CustomizeDashboardDialog 
        open={isCustomizeDialogOpen}
        onOpenChange={setIsCustomizeDialogOpen}
        modules={dashboardModules}
        onSaveModules={handleSaveDashboardModules}
      />
      
      {/* Hero section with main stats & welcome */}
      <motion.div
        className="bg-gradient-to-r from-blue-700 to-indigo-700 pt-12 pb-24 px-4 rounded-b-3xl relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated automotive background elements - Enhanced with more animations */}
        <motion.div 
          className="absolute bottom-0 right-0 w-40 h-24 opacity-10"
          initial={{ x: 50, opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: 0.1,
            transition: { 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut" 
            }
          }}
        >
          <svg viewBox="0 0 640 512" fill="white">
            <path d="M608 128.2C604.5 104 585.4 84.9 561.2 81.4C549 79.8 536.8 78.4 524.7 77.1L522.3 48.9C521.9 43 520.9 37.2 516.1 32.8C511.3 28.4 504.8 29.1 498.9 29.9L75 94.6c-18.3 2.3-35.6 10.5-48.6 23.5c-13 13-21.1 30.3-23.5 48.6L.0265 179.6c-.1108 1-.2211 1.9-.2211 2.9c0 33.1 26.9 60 60 60H81.45c-14.5 9.1-27.6 22.2-36.6 38.8c-18.1 33.5-16 75.6 6 107.6L4.289 430.1c-5.031 2.8-6.906 9.1-4.172 14.1C1.738 447.8 4.914 450 8.438 450c1.703 0 3.437-.4375 5.047-1.328l59.3-32.9c5.828 4.6 12.05 8.5 18.51 11.7c20.88 10.4 44.28 11.6 65.98 3.5c13.8-5.2 26.1-13.8 35.9-24.9h234.6c9.799 11.1 22.08 19.7 35.9 24.9c21.69 8.1 45.09 6.9 65.98-3.5c6.451-3.2 12.68-7.1 18.51-11.7l59.3 32.9c1.609 .8906 3.344 1.328 5.047 1.328c3.523 0 6.7-2.2 8.016-5.766C643.9 438.3 642 431.9 636.1 429.1L590.5 388.4c.6406-.6289 1.242-1.289 1.857-1.953C596.8 381.9 599.8 377 599.8 372c0-44.2-35.8-80-80-80H144.1c-.168 0-.2988 .0723-.4668 .0723c2.691-5.914 5.832-11.55 9.488-16.85C166.3 256.8 185.7 245.4 207.3 241.4l278.4-33.4c34.9-4.2 59.7-35.3 57.6-70.4C542.4 129.3 533.4 121.4 608 128.2zM64 224c-17.66 0-32-14.3-32-32c0-17.1 13.83-30.9 31.03-31.9l3.172-.375L68.58 176H112v16H64zM528 304c30.9 0 56 25.1 56 56c0 1.1-.3203 2.1-.4336 3.2C576.4 377.1 566.1 387.9 552 391.7c-15.31 4-31.66 .9336-44.06-8.469l-4.141-3.109l.2344-.1445c-5.094-4.062-8.062-10.2-8.062-16.7c0-11.8 9.469-21.3 21.31-21.3h4.688v-16H496v16h8C518.8 342 531.9 358.9 528 304zM111.9 342c0 11.8 9.5 21.3 21.3 21.3H144v-16h-10.7c-2.9 0-5.3-2.4-5.3-5.3s2.4-5.3 5.3-5.3H144v-16h-10.7C121.4 320.7 111.9 330.2 111.9 342zM208 384h-64c-8.801 0-16-7.2-16-16s7.199-16 16-16h64c8.8 0 16 7.2 16 16S216.8 384 208 384zM256 368c0 8.8-7.2 16-16 16s-16-7.2-16-16s7.2-16 16-16S256 359.2 256 368zM368 368c0 8.8-7.2 16-16 16h-64c-8.8 0-16-7.2-16-16s7.2-16 16-16h64C360.8 352 368 359.2 368 368zM396.1 368c0-8.8 7.199-16 16-16h64c8.801 0 16 7.2 16 16s-7.199 16-16 16h-64C403.3 384 396.1 376.8 396.1 368zM444.1 400h17.9c13.83 0 26.36 7.3 33.16 19.7c6.1 11.1 6.693 24.2 1.5 35.8c-5.623 12.4-15.92 20.4-28.33 23.2c-2.502 .5-5.621 1.3-8.939 1.3c-9.422 0-18.42-3.281-25.62-9.281c-4.859-4.031-8.621-9.25-10.94-15.25C415.1 437.5 425.3 418.9 444.1 400zM476.1 208.7l-278.4 33.4c-28.1 5.3-52.5 20.4-69.3 41.8H273.7L476.1 208.7zM178.6 400c-19.66 18.9-29.02 37.5-21.26 55.5c2.314 6 6.076 11.22 10.94 15.25c7.203 6 16.2 9.281 25.62 9.281c3.736 0 7.387-.7539 10.75-1.531c9.035-2.062 17.16-7.406 22.3-15.38c8.469-13.13 8.173-31.13-1.047-46.88C214.6 399.8 196.4 394.2 178.6 400z"/>
          </svg>
        </motion.div>
        
        <motion.div 
          className="absolute top-10 left-10 w-24 h-24 opacity-10"
          initial={{ rotate: -10 }}
          animate={{ 
            rotate: 10,
            transition: { 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut" 
            }
          }}
        >
          <svg viewBox="0 0 512 512" fill="white">
            <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
          </svg>
        </motion.div>
        
        <motion.div 
          className="absolute top-40 right-12 w-20 h-20 opacity-10"
          animate={{ 
            y: [0, -15, 0],
            transition: { 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut" 
            }
          }}
        >
          <svg viewBox="0 0 512 512" fill="white">
            <path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
          </svg>
        </motion.div>
        
        {/* NEW ANIMATION: Fuel Gauge */}
        <motion.div 
          className="absolute top-20 right-32 w-16 h-16 opacity-10"
          animate={{ 
            rotate: [-30, 30, -30],
            transition: { 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut" 
            }
          }}
        >
          <svg viewBox="0 0 576 512" fill="white">
            <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32h64V384zm384-32c0 17.7-14.3 32-32 32H192V96H480c17.7 0 32 14.3 32 32V352zM304 208v-6.9c-18-10.1-46.3-.5-46.3 22.5c0 15.4 11.1 24.7 31.7 33.4l7.6 3.2c10.6 4.4 16.8 9 16.8 16.6c0 8.5-7.5 15.3-17.7 15.3c-11.6 0-18.4-6.8-19.2-14.3c-.4-2.9-3-5.2-6.2-5.2H253.9c-3.5 0-6.3 2.8-6.1 6.3c1.1 18.3 16.2 32.1 34.8 35V328c0 13.3 10.7 24 24 24s24-10.7 24-24v-13.6c16.6-10.1 28.8-27.1 28.8-47.5c0-31.8-28.7-47.2-53.2-57l-7.2-3c-7.1-3-15.5-7.9-15.5-15.7c0-7.4 6.4-13.7 14.6-13.7c7.8 0 13.1 5.1 14.3 11.2c.9 4.2 5.1 7 9.5 5.5l13.4-4.5c3.3-1.1 5.2-4.4 4.7-7.7z"/>
          </svg>
        </motion.div>
        
        {/* NEW ANIMATION: Tire */}
        <motion.div 
          className="absolute bottom-14 left-14 w-20 h-20 opacity-10"
          animate={{ 
            rotate: 360,
            transition: { 
              duration: 10,
              repeat: Infinity,
              ease: "linear" 
            }
          }}
        >
          <svg viewBox="0 0 512 512" fill="white">
            <path d="M464 96h-192l-64-64h-160C21.5 32 0 53.5 0 80v352C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM336 311.9c-10.11 35.75-42.63 61.23-79.96 62.98c-22.13 1.045-42.21-6.387-57.39-18.96c-9.422 14.87-25.79 24.11-43.15 24.11c-28.97 0-52.5-23.53-52.5-52.5s23.53-52.5 52.5-52.5c15.66 0 29.43 7.164 38.96 18.03C209.9 279 230.5 269.8 256 269.8C295.2 269.8 326.5 287.1 336 311.9zM352 288c-15.25-12.61-34.13-21.08-54.71-24.15c-3.76-.6406-7.672-1.064-11.68-1.266C256.8 252.7 240.2 236.3 224 228.1C218 225.1 211.1 222.9 204.6 221.1C216.3 205.2 223.1 184.5 223.1 161.1C223.1 107.9 180.1 64 127.1 64c-4.25 0-8.477 .2334-12.67 .6992c-4.281 .4801-7.596 4.201-7.596 8.525c0 4.939 4.129 8.902 9.061 8.301C120.3 81.17 124.2 81 127.1 81c45.42 0 82.36 36.84 83.96 82.09c0 .2832-.0586 .5488-.0684 .8281C209.7 171.1 207.7 179.2 204.5 186C212.2 177.5 223.5 172 236 172c24.81 0 44.91 20.16 44.91 45c0 .1445-.0137 .2871-.0176 .4316c19.36 12.22 34.8 29.91 44.13 50.76C313.8 251 291.3 238.7 266.7 237.3c-32.31-1.812-63.31 12.98-79.91 38.19c44.46 7.891 77.31 48.33 70.1 94.3C251.8 383.6 238.1 393.8 224 397.6V400c0 8.836-7.162 16-15.1 16S192 408.8 192 400v-2.369c-14.47-3.771-27.33-14.31-32.76-29.52C158.3 367.3 158.2 366.4 158.1 365.6c-14.68 8.514-24.8 24.53-24.1 42.89c0 26.51 21.49 48 47.1 48s48-21.49 48-48c0-6.514-1.469-12.54-3.643-18.28C239.4 401.1 255.1 407.3 272 407.3c5.732 0 11.42-.5742 17.02-1.723C296.2 404.7 303.1 403.1 309.7 400H384c8.844 0 16 7.156 16 16S392.8 432 384 432h-120.1c49.55-18.33 78.04-71.46 65.31-124.3C322.5 291.6 318.9 273.1 311.2 257.9c20.26 24.31 52.04 40.14 88.78 40.14c7.26 0 14.39-.7285 21.27-2.109C433.9 292.6 446.9 288 461.2 288h2.795C465.1 289.3 464 290.6 464 292c0 17.67 14.33 32 32 32c.6543 0 1.293-.0801 1.937-.1191c3.475-.2129 6.596-2.324 8.063-5.525c1.467-3.193 .9473-6.969-1.342-9.623l-9.949-11.59C494 295.3 494 293.7 494 292c0-17.67-14.33-32-32-32H352zM95.1 64h.0008c-.0008 0 .002 0 0 0zM413.7 234.5c3.121-17.12-5.262-34.56-22.46-39.5c-17.2-4.938-35.09 4.652-40.09 21.5c-5.007 16.85 4.93 34.72 22.13 39.66C392.8 261.8 410.6 251.4 413.7 234.5z"/>
          </svg>
        </motion.div>
        
        {/* NEW ANIMATION: Key/Remote */}
        <motion.div 
          className="absolute top-24 left-40 w-16 h-16 opacity-10"
          animate={{ 
            scale: [1, 1.1, 1],
            transition: { 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }
          }}
        >
          <svg viewBox="0 0 512 512" fill="white">
            <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"/>
          </svg>
        </motion.div>
        
        {/* NEW ANIMATION: Road/Highway */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-2 bg-white/10 overflow-hidden"
        >
          <motion.div 
            className="absolute top-0 h-full w-[20%] bg-white/30"
            animate={{
              x: ["-100%", "500%"],
              transition: {
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
          <motion.div 
            className="absolute top-0 h-full w-[15%] bg-white/30"
            animate={{
              x: ["-100%", "700%"],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }
            }}
          />
        </motion.div>
        
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
                onClick={() => navigateTo('/vehicle-vault/add')}
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
          className="bg-white rounded-2xl shadow-lg p-5 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Road animation in background */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-200 overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 w-20 bg-gray-400"
              animate={{
                x: ["0%", "100%"],
                transition: {
                  duration: 3,
                  ease: "linear",
                  repeat: Infinity
                }
              }}
            />
            <motion.div 
              className="absolute inset-y-0 left-0 w-10 bg-gray-400"
              animate={{
                x: ["0%", "100%"],
                transition: {
                  duration: 2,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 0.5
                }
              }}
            />
          </div>
        
          {/* Animated speedometer icon */}
          <motion.div 
            className="absolute top-3 right-12 w-8 h-8 text-blue-100 opacity-10"
            animate={{
              rotate: [0, 180, 0],
              transition: {
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity
              }
            }}
          >
            <svg viewBox="0 0 512 512" fill="currentColor">
              <path d="M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM256 448C362 448 448 362 448 256C448 149.1 362 64 256 64C149.1 64 64 149.1 64 256C64 362 149.1 448 256 448zM135.4 357.8C140.1 363.5 149.8 369.1 160.7 371.4C171.5 373.7 184.3 371.9 197 360.7L279.2 293.4C282.6 290.7 287 289.3 291.5 289.3C296 289.3 300.4 290.6 303.8 293.4L383.6 358.7C387.1 361.4 392.3 362.8 396.8 362.8C401.3 362.8 405.7 361.5 409.1 358.7C415.8 353.1 417.2 343.4 411.7 336.7C407.3 331.3 397.8 322.8 384.1 313.8C380.3 310.8 375.7 309.2 371 309.1L370.9 309.1C366.2 309.1 361.7 310.7 357.9 313.5L328.8 337.6L264.7 282.6C255.4 274.6 243.7 270 231.3 269.2C218.8 268.5 206.6 271.7 196.3 278.9C195.2 279.7 194.2 280.5 193.2 281.4L133.6 332.7C132.7 333.5 131.8 334.3 130.9 335.2C125.8 340.4 124.6 348.5 127.7 354.9C129.1 358.1 131.8 360.8 135.4 357.8L135.4 357.8zM138.7 192C138.7 178.7 149.5 168 162.7 168C176 168 186.7 178.7 186.7 192C186.7 205.3 176 216 162.7 216C149.5 216 138.7 205.3 138.7 192z"/>
            </svg>
          </motion.div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Overall Summary</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/overall-summary')}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                View Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  /* Share functionality would be implemented here */
                  alert('Sharing dashboard summary...');
                }}
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
              >
                Share
                <Share2 className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Trends - New Design */}
            <motion.div 
              className="relative rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 shadow-lg p-0"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                  className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-indigo-600 opacity-20"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-purple-500 opacity-20"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 0.8], rotate: [360, 180, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* Header section */}
              <div className="relative p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <BarChart3 className="h-5 w-5 text-purple-300" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Current Trends</h3>
                    <div className="text-xs text-purple-200">Automotive news & updates</div>
                  </div>
                </div>
                
                <div className="text-xs font-medium text-white bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  Latest News
                </div>
              </div>
              
              {/* News content with glassmorphism */}
              <div className="relative px-4 pt-2 pb-4">
                <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-4">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
                  
                  <div className="space-y-3 max-h-44 overflow-auto pr-1 relative z-10">
                    {[
                      {
                        title: "EV Market Growing at 26% CAGR",
                        desc: "Electric vehicle adoption surges as new models hit Indian market",
                        color: "purple"
                      },
                      {
                        title: "New Fuel Efficiency Standards",
                        desc: "Government announces stricter emission norms for vehicles",
                        color: "blue"
                      },
                      {
                        title: "Connected Car Technology Surges",
                        desc: "IoT integration becoming standard in mid-range vehicles",
                        color: "emerald"
                      },
                      {
                        title: "Auto Parts Market Forecast",
                        desc: "Aftermarket expected to grow 12% by end of year",
                        color: "amber"
                      }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-start gap-3 bg-white/5 p-3 backdrop-blur-sm rounded-lg cursor-pointer"
                        whileHover={{ x: 3, backgroundColor: "rgba(255,255,255,0.1)" }}
                      >
                        <motion.div 
                          className={`w-2 h-2 rounded-full bg-${item.color}-400 mt-1.5 flex-shrink-0`}
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.7, 1, 0.7] 
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5 
                          }}
                        />
                        <div>
                          <h5 className="text-sm font-medium text-white">{item.title}</h5>
                          <p className="text-xs text-white/70 mt-0.5">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center text-white/70">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="text-xs">Updated 3 hours ago</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7 px-3 text-white hover:bg-white/10 border border-white/20"
                    >
                      View All
                    </Button>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 cursor-pointer" onClick={() => navigate('/overall-summary')}></div>
            </motion.div>
            
            {/* Overall Vehicle Net Value - New Design */}
            <motion.div 
              className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-teal-900 shadow-lg p-0"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                  className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-teal-600 opacity-20"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-blue-500 opacity-20"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 0.8], rotate: [360, 180, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* Header section */}
              <div className="relative p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <IndianRupee className="h-5 w-5 text-teal-300" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Vehicle Net Value</h3>
                    <div className="text-xs text-teal-200">Market valuation trends</div>
                  </div>
                </div>
                
                <div className="text-xs font-medium text-white bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  As of Today
                </div>
              </div>
              
              {/* Value display with glassmorphism */}
              <div className="relative px-4 pt-2 pb-4">
                <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-4">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
                  
                  <div className="relative z-10">
                    {/* Total value */}
                    <motion.div 
                      className="text-center py-3"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: [0.9, 1, 0.9] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-teal-200 to-blue-300 text-transparent bg-clip-text">
                        ₹32,85,000
                      </div>
                      <div className="text-xs text-white/70 mt-1">Total Fleet Value</div>
                    </motion.div>
                    
                    {/* Value progress bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full mt-3 mb-5 overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-teal-400 to-blue-400"
                        style={{ width: '65%' }}
                        initial={{ x: -100 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    
                    {/* Value breakdown */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Current", value: "₹21,35,250", color: "white" },
                        { label: "Appreciation", value: "+₹2,50,000", color: "emerald-400" },
                        { label: "Depreciation", value: "₹11,49,750", color: "rose-400" }
                      ].map((item, i) => (
                        <motion.div 
                          key={i}
                          className="p-2 rounded-lg bg-white/5 text-center backdrop-blur-sm"
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <div className={`text-sm font-medium text-${item.color}`}>{item.value}</div>
                          <div className="text-[10px] text-white/60">{item.label}</div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center text-white/70">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        <span className="text-xs">Last updated: Today</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-7 px-3 text-white hover:bg-white/10 border border-white/20"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Service Health Tracker - Completely Fresh Design */}
            <motion.div 
              className="relative rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 shadow-lg p-0"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                  className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-purple-600 opacity-20"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-indigo-500 opacity-20"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 0.8], rotate: [360, 180, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* Header section with glowing title */}
              <div className="relative p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Wrench className="h-5 w-5 text-purple-300" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-shadow">Service Health</h3>
                    <div className="text-xs text-purple-200">Vehicle maintenance status</div>
                  </div>
                </div>
                
                <div className="text-xs font-medium text-white bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  Next 60 Days
                </div>
              </div>
              
              {/* Main interactive service visualization */}
              <div className="relative px-4 pt-2 pb-4">
                {/* Service status indicators with neon glow */}
                <div className="flex justify-around mb-4">
                  {[
                    { status: 'Complete', count: 2, color: 'bg-emerald-500', glow: 'emerald' },
                    { status: 'Due Soon', count: 1, color: 'bg-amber-500', glow: 'amber' },
                    { status: 'Overdue', count: 0, color: 'bg-rose-500', glow: 'rose' }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      className="flex flex-col items-center relative"
                      whileHover={{ y: -3 }}
                    >
                      <motion.div 
                        className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center relative`}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <motion.div 
                          className={`absolute inset-0 rounded-full bg-${item.glow}-500 opacity-60 blur-sm`}
                          animate={{ 
                            scale: [0.8, 1.2, 0.8],
                            opacity: [0.3, 0.6, 0.3] 
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        <span className="text-white font-bold text-lg relative z-10">{item.count}</span>
                      </motion.div>
                      <span className="text-xs text-white/80 mt-2">{item.status}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Interactive 3D-like service bars */}
                <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-4 mt-2">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
                  
                  {/* Service Status Bars */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/80">Honda City</span>
                        <span className="text-white font-medium">14 days</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                          style={{ width: '70%' }}
                          initial={{ x: -100 }}
                          animate={{ x: 0 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/80">Tata Nexon</span>
                        <span className="text-white font-medium">30 days</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                          style={{ width: '45%' }}
                          initial={{ x: -100 }}
                          animate={{ x: 0 }}
                          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/80">Maruti Swift</span>
                        <span className="text-white font-medium">Complete</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                          style={{ width: '100%' }}
                          initial={{ x: -100 }}
                          animate={{ x: 0 }}
                          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <motion.div 
                    className="mt-4 w-full"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:from-purple-700 hover:to-indigo-700"
                      onClick={() => navigateTo('/book-service')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Service
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        
        {/* FixPoint Membership Card */}
        {(() => {
          // Find membership module
          const membershipModule = dashboardModules.find(m => m.id === 'membership');
          // Only render if module exists and is visible
          if (membershipModule && membershipModule.visible) {
            return (
              <motion.div 
                className="mb-10 p-6 rounded-xl bg-gradient-to-br from-indigo-900 to-purple-900 shadow-lg overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div 
                    className="absolute -right-16 -bottom-16 w-40 h-40 rounded-full bg-purple-600 opacity-20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div 
                    className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-blue-500 opacity-20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <div className="lg:w-1/2">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                      FixPoint Premium Card
                      <motion.span 
                        className="inline-block ml-2"
                        animate={{ rotate: [0, 15, 0, -15, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                      >
                        <Sparkles className="h-5 w-5 text-yellow-300" />
                      </motion.span>
                    </h2>
                    <p className="text-indigo-200 mb-6 max-w-md">
                      Unlock premium vehicle services with priority booking, nationwide roadside assistance, and exclusive discounts. Earn points on every service.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        className="bg-white/20 hover:bg-white/30 text-white" 
                        onClick={() => navigateTo('/membership')}
                      >
                        View Membership
                      </Button>
                      <Button 
                        variant="outline" 
                        className="bg-transparent border-white/30 text-white hover:bg-white/10"
                        onClick={() => navigateTo('/membership')}
                      >
                        Upgrade Benefits
                      </Button>
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-1/2 max-w-sm mx-auto lg:mx-0 scale-90 lg:scale-100 transform lg:translate-y-0">
                    <div className="relative w-full perspective-1000">
                      <motion.div 
                        className="relative w-full overflow-hidden rounded-xl shadow-xl"
                        style={{ transform: 'rotateY(-8deg) rotateX(5deg)' }}
                        whileHover={{ rotateY: 0, rotateX: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-5 min-h-[200px] relative">
                          {/* Animated card glow effect */}
                          <motion.div 
                            className="absolute right-0 top-0 w-40 h-20 rotate-45 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                              x: ['-100%', '300%'],
                              opacity: [0, 0.1, 0.2, 0.1, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatDelay: 8,
                            }}
                          />
                          
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h3 className="text-white text-xl font-bold">FixPoint</h3>
                                <Sparkles className="h-5 w-5 ml-1 text-yellow-300" />
                              </div>
                              <p className="text-white/70 text-xs uppercase tracking-wider font-medium">
                                Premium Membership
                              </p>
                            </div>
                            
                            <div className="flex items-center">
                              <Car className="h-7 w-7 text-white/80" />
                              <CreditCard className="h-6 w-6 ml-1 text-white/80" />
                            </div>
                          </div>

                          <div className="mt-8">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-white/90 uppercase text-sm tracking-wider font-medium">Member</p>
                              <p className="text-white/90 text-sm">Since April 2025</p>
                            </div>
                            <h2 className="text-white text-lg font-medium">{user.name}</h2>
                          </div>

                          <div className="mt-5">
                            <p className="text-white/90 text-sm font-mono tracking-wider">
                              2241 8891 •••• ••••
                            </p>
                            
                            <div className="flex justify-between items-center mt-3">
                              <div>
                                <p className="text-white/70 text-xs">Vehicles</p>
                                <p className="text-white text-sm font-medium">{stats.totalVehicles}</p>
                              </div>
                              <div>
                                <p className="text-white/70 text-xs">Points</p>
                                <p className="text-white text-sm font-medium">{stats.totalPoints}</p>
                              </div>
                              <div>
                                <p className="text-white/70 text-xs">Exp</p>
                                <p className="text-white text-sm font-medium">04/28</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }
          return null;
        })()}
        
        {/* Membership Card Section */}
        {(() => {
          const { data: membershipData, isLoading } = useMembership();
          
          // Show loading state
          if (isLoading) {
            return (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">FixPoint Membership</h2>
                  <div className="h-10 w-36 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
                <div className="h-60 bg-gray-200 animate-pulse rounded-xl"></div>
              </section>
            );
          }
          
          // If user has membership, just show the card
          if (membershipData?.hasMembership) {
            const data = membershipData.membershipData;
            return (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Your Membership</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => navigateTo('/membership')}
                  >
                    Manage Membership
                    <CreditCard className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <FixPointCard
                    userName="Rajesh Kumar"
                    membershipType={data?.membershipType || "premium"}
                    membershipNumber={data?.membershipNumber || "2241 8891 4412 5551"}
                    vehicleCount={data?.vehicleCount || 2}
                    points={data?.points || 1250}
                    memberSince={data?.memberSince || "April 2025"}
                    expiryDate={data?.expiryDate || "04/28"}
                    onManage={() => navigateTo('/membership')}
                  />
                </div>
              </section>
            );
          }
          
          // If user doesn't have membership, show the full promotion section
          return (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">FixPoint Membership</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => navigateTo('/membership')}
                >
                  View Plans
                  <CreditCard className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <FixPointCard
                    userName="Rajesh Kumar"
                    membershipType="premium"
                    membershipNumber="2241 8891 4412 5551"
                    vehicleCount={2}
                    points={1250}
                    onActivate={() => navigateTo('/membership')}
                    onManage={() => navigateTo('/membership')}
                  />
                </div>
                
                <div className="col-span-1 bg-gray-50 rounded-xl p-6 border">
                  <h3 className="font-bold text-lg mb-4">Membership Benefits</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <Shield className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Premium Roadside Assistance</h4>
                        <p className="text-sm text-gray-600">24/7 emergency assistance with faster response times</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <Zap className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Priority Service Booking</h4>
                        <p className="text-sm text-gray-600">Skip the queue with priority scheduling at authorized centers</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <Star className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Rewards Program</h4>
                        <p className="text-sm text-gray-600">Earn points on every service and redeem for benefits</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      onClick={() => navigateTo('/membership')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      View All Benefits
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}
        
        {/* Key Feature Modules */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Key Features</h2>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsCustomizeDialogOpen(true)}
            >
              Customize Dashboard
              <Settings className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 auto-rows-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featureModules.filter(module => {
              // Find the module in dashboardModules
              const dashModule = dashboardModules.find(m => m.id === module.id);
              // If found and visible is false, filter it out, otherwise keep it
              return !dashModule || dashModule.visible !== false;
            }).map((module, index) => (
              <motion.div
                key={module.id}
                className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer border ${
                  // Apply size classes based on dashboard module settings
                  (() => {
                    const dashModule = dashboardModules.find(m => m.id === module.id);
                    if (dashModule) {
                      if (dashModule.size === 'small') return 'col-span-1';
                      if (dashModule.size === 'large') return 'col-span-2 md:col-span-2';
                    }
                    return 'col-span-1 md:col-span-1'; // Default medium size
                  })()
                }`}
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
        
        {/* Essential Tools Section - Clean Canva-inspired design */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Essential Tools</h2>
            <p className="text-gray-600 max-w-3xl">
              Powerful utilities to manage every aspect of your vehicle ownership experience.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {essentialTools.filter(tool => {
              // Find the module in dashboardModules
              const dashModule = dashboardModules.find(m => m.id === tool.id);
              // If found and visible is false, filter it out, otherwise keep it
              return !dashModule || dashModule.visible !== false;
            }).map((tool, index) => {
              // Define clean, vibrant colors for tool cards
              const toolColors = {
                'nearby': 'bg-rose-500',
                'marketplace': 'bg-cyan-500',
                'documents': 'bg-violet-500',
                'emergency': 'bg-amber-500'
              };
              
              const bgColor = toolColors[tool.id as keyof typeof toolColors] || 'bg-blue-500';
              
              return (
                <motion.div
                  key={tool.id}
                  className={`cursor-pointer rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg ${
                    // Apply size classes based on dashboard module settings
                    (() => {
                      const dashModule = dashboardModules.find(m => m.id === tool.id);
                      if (dashModule) {
                        if (dashModule.size === 'small') return 'col-span-1';
                        if (dashModule.size === 'large') return 'col-span-2 md:col-span-2';
                      }
                      return 'col-span-1 md:col-span-1'; // Default medium size
                    })()
                  }`}
                  onClick={() => navigateTo(tool.path)}
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Header with icon - with automotive animations */}
                  <div className={`${bgColor} p-5 flex items-center h-28 relative overflow-hidden`}>
                    {/* Tool-specific automotive animations in background */}
                    {tool.id === 'nearby' && (
                      <>
                        <motion.div 
                          className="absolute right-0 top-1/2 w-12 h-4 opacity-10"
                          animate={{ 
                            x: [20, -60],
                            transition: { 
                              duration: 3, 
                              repeat: Infinity,
                              ease: "linear"
                            }
                          }}
                        >
                          <svg viewBox="0 0 640 512" fill="white">
                            <path d="M342.5 32C357.2 32 370.7 38.7 379.5 50.3L548.7 296.4C559.8 311.3 566.3 329.3 566.3 348.1C566.3 399.5 524.6 441.2 473.2 441.2H86.8C35.4 441.2-6.3 399.5-6.3 348.1C-6.3 329.3 .2 311.3 11.3 296.4L180.5 50.3C189.3 38.7 202.8 32 217.5 32H342.5zM280 224C280 251.9 302.3 274.2 330.2 271.9L389.9 378.6C391.9 382.1 389.1 386.7 385.1 386.7H254.9C250.9 386.7 248.1 382.1 250.1 378.6L309.8 271.9C337.7 274.2 360 251.9 360 224C360 196.1 337.7 173.8 309.8 176.1L250.1 69.43C248.1 65.92 250.9 61.27 254.9 61.27H385.1C389.1 61.27 391.9 65.92 389.9 69.43L330.2 176.1C302.3 173.8 280 196.1 280 224z"/>
                          </svg>
                        </motion.div>
                        <motion.div 
                          className="absolute right-4 bottom-2 w-6 h-6 opacity-10"
                          animate={{ 
                            y: [0, -4, 0],
                            transition: { 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                        >
                          <svg viewBox="0 0 384 512" fill="white">
                            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                          </svg>
                        </motion.div>
                      </>
                    )}
                    
                    {tool.id === 'marketplace' && (
                      <motion.div 
                        className="absolute right-5 bottom-4 w-10 h-10 opacity-10"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          transition: { 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                      >
                        <svg viewBox="0 0 576 512" fill="white">
                          <path d="M312 24V34.5c6.4 1.2 12.6 2.7 18.2 4.2c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17c-10.9-2.9-21.1-4.9-30.2-5c-7.3-.1-14.7 1.7-19.4 4.4c-2.1 1.3-3.1 2.4-3.5 3c-.3 .5-.7 1.2-.7 2.8c0 .3 0 .5 0 .6c.2 .2 .9 1.2 3.3 2.6c5.8 3.5 14.4 6.2 27.4 10.1l.9 .3c11.1 3.3 25.9 7.8 37.9 15.3c13.7 8.6 26.1 22.9 26.4 44.9c.3 22.5-11.4 38.9-26.7 48.5c-6.7 4.1-13.9 7-21.3 8.8V232c0 13.3-10.7 24-24 24s-24-10.7-24-24V220.6c-9.5-2.3-18.2-5.3-25.6-7.8c-2.1-.7-4.1-1.4-6-2c-12.6-4.2-19.4-17.8-15.2-30.4s17.8-19.4 30.4-15.2c2.6 .9 5 1.7 7.3 2.5c13.6 4.6 23.4 7.9 33.9 8.3c8 .3 15.1-1.6 19.2-4.1c1.9-1.2 2.8-2.2 3.2-2.9c.4-.6 .9-1.8 .8-4.1l0-.2c0-1 0-2.1-4-4.6c-5.7-3.6-14.3-6.4-27.1-10.3l-1.9-.6c-10.8-3.2-25-7.5-36.4-14.4c-13.5-8.1-26.5-22-26.6-44.1c-.1-22.9 12.9-38.6 27.7-47.4c6.4-3.8 13.3-6.4 20.2-8.2V24c0-13.3 10.7-24 24-24s24 10.7 24 24zM568.2 336.3c13.1 17.8 9.3 42.8-8.5 55.9L433.1 485.5c-23.4 17.2-51.6 26.5-80.7 26.5H192 32c-17.7 0-32-14.3-32-32V416c0-17.7 14.3-32 32-32H68.8l44.9-36c22.7-18.2 50.9-28 80-28H272h16 64c17.7 0 32 14.3 32 32s-14.3 32-32 32H288 272c-8.8 0-16 7.2-16 16s7.2 16 16 16H392.6l119.7-88.2c17.8-13.1 42.8-9.3 55.9 8.5zM193.6 384l0 0-.9 0c.3 0 .6 0 .9 0z"/>
                        </svg>
                      </motion.div>
                    )}
                    
                    {tool.id === 'documents' && (
                      <motion.div 
                        className="absolute right-4 top-4 w-8 h-8 opacity-10"
                        initial={{ rotate: 0 }}
                        animate={{ 
                          rotate: [-5, 5, -5],
                          transition: { 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                      >
                        <svg viewBox="0 0 384 512" fill="white">
                          <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
                        </svg>
                      </motion.div>
                    )}
                    
                    {tool.id === 'emergency' && (
                      <motion.div 
                        className="absolute right-3 top-3 w-10 h-10 opacity-10"
                        animate={{ 
                          scale: [1, 1.5, 1],
                          transition: { 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: "easeOut"
                          }
                        }}
                      >
                        <svg viewBox="0 0 640 512" fill="white">
                          <path d="M112 32c-8.8 0-16 7.2-16 16V64H48C21.5 64 0 85.5 0 112v64c0 26.5 21.5 48 48 48H64v48c0 26.5 21.5 48 48 48h32v96c0 35.3 28.7 64 64 64s64-28.7 64-64V320h32c26.5 0 48-21.5 48-48V224h16c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H336V48c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H160V48c0-8.8-7.2-16-16-16H112zM352 368c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H368c-8.8 0-16 7.2-16 16zm64 64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H432c-8.8 0-16 7.2-16 16zm64-64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H496c-8.8 0-16 7.2-16 16zm64 64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H560c-8.8 0-16 7.2-16 16z"/>
                        </svg>
                      </motion.div>
                    )}
                    
                    <motion.div 
                      className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner"
                      whileHover={{ rotate: 10 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {React.cloneElement(tool.icon, { className: "h-8 w-8 text-white" })}
                    </motion.div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg text-white">{tool.name}</h3>
                      <p className="text-white/80 text-sm">{tool.description}</p>
                    </div>
                  </div>
                  
                  {/* Key feature highlight */}
                  <div className="p-5">
                    <div className="mb-4">
                      <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">Key Feature</div>
                      <p className="text-sm text-gray-700">{tool.keyFeature}</p>
                    </div>
                    
                    <Button 
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo(tool.path);
                      }}
                    >
                      <span>Access Tool</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
        
        {/* More Modules Section - Clean Canva-inspired design */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">More Modules</h2>
            <p className="text-gray-600 max-w-3xl">
              Explore additional specialized modules designed to enhance your vehicle management experience.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 auto-rows-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {additionalModules.filter(module => {
              // Find the module in dashboardModules
              const dashModule = dashboardModules.find(m => m.id === module.id);
              // If found and visible is false, filter it out, otherwise keep it
              return !dashModule || dashModule.visible !== false;
            }).map((module, index) => {
              // Define module colors - vibrant solid colors inspired by Canva
              const moduleColors = {
                'commercial': { bg: 'bg-emerald-500', text: 'text-white' },
                'learning': { bg: 'bg-violet-500', text: 'text-white' },
                'energy': { bg: 'bg-amber-500', text: 'text-white' },
                'compare': { bg: 'bg-blue-500', text: 'text-white' },
                'history': { bg: 'bg-rose-500', text: 'text-white' },
                'fastag': { bg: 'bg-purple-500', text: 'text-white' },
              };
              
              const color = moduleColors[module.id as keyof typeof moduleColors] || 
                { bg: 'bg-gray-500', text: 'text-white' };
              
              return (
                <motion.div
                  key={module.id}
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className={`cursor-pointer rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg ${
                    // Apply size classes based on dashboard module settings
                    (() => {
                      const dashModule = dashboardModules.find(m => m.id === module.id);
                      if (dashModule && dashModule.size === 'large') {
                        return 'col-span-2 md:col-span-2';
                      }
                      return 'col-span-1'; // Default small/medium size for these compact cards
                    })()
                  }`}
                  onClick={() => navigateTo(module.path)}
                >
                  {/* Clean header with icon and automotive animations */}
                  <div className={`${color.bg} p-5 flex justify-center items-center h-28 relative overflow-hidden`}>
                    {/* Module-specific automotive animations in background */}
                    {module.id === 'commercial' && (
                      <motion.div 
                        className="absolute bottom-2 right-2 w-14 h-14 opacity-10"
                        animate={{ 
                          x: [0, 10, 0],
                          transition: { 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }
                        }}
                      >
                        <svg viewBox="0 0 640 512" fill="white">
                          <path d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                        </svg>
                      </motion.div>
                    )}
                    
                    {module.id === 'compare' && (
                      <motion.div 
                        className="absolute w-12 h-12 opacity-10 left-4 top-4"
                        animate={{ 
                          rotate: [0, -10, 0, 10, 0],
                          transition: { 
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }
                        }}
                      >
                        <svg viewBox="0 0 640 512" fill="white">
                          <path d="M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L550.2 352H592c26.5 0 48-21.5 48-48V176c0-26.5-21.5-48-48-48H516h-4-.7l-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c11.5-9.3 25.9-14.4 41-14.4c13.5 0 26.5 4.1 37.5 11.7l51.5 33.1c2.6 1.7 5.6 2.8 8.7 3.2H517.6c12.1-1.3 24.9 .8 36.6 6.5c21.8 10.7 35.8 32.9 35.8 57.3V304c0 13.3-10.7 24-24 24H488c-9.1 0-17.4-5.1-21.5-13.3l-67.8-137.4c-7.9-15.9-24.1-26-42.2-26c-14.1 0-27.5 6.4-36.3 17.4zM224 128c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H208c8.8 0 16 7.2 16 16zm-16 64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H208zm-16 64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H192zm-96 64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h16z"/>
                        </svg>
                      </motion.div>
                    )}
                    
                    {module.id === 'energy' && (
                      <motion.div 
                        className="absolute right-3 bottom-3 w-12 h-12 opacity-10"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          transition: { 
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }
                        }}
                      >
                        <svg viewBox="0 0 576 512" fill="white">
                          <path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H96 288h32V448H288V384h32V288H96v64H64V92.5c0-7.4 5-13.7 12.1-15.5L256 32V160H224c-17.7 0-32 14.3-32 32s14.3 32 32 32h32 32c17.7 0 32-14.3 32-32s-14.3-32-32-32H288V32h32zM528 256c8.8 0 16-7.2 16-16s-7.2-16-16-16H368c-8.8 0-16 7.2-16 16s7.2 16 16 16H528zM368 288c-8.8 0-16 7.2-16 16s7.2 16 16 16H528c8.8 0 16-7.2 16-16s-7.2-16-16-16H368zM352 368c0 8.8 7.2 16 16 16H528c8.8 0 16-7.2 16-16s-7.2-16-16-16H368c-8.8 0-16 7.2-16 16zM352 432c0 8.8 7.2 16 16 16H528c8.8 0 16-7.2 16-16s-7.2-16-16-16H368c-8.8 0-16 7.2-16 16z"/>
                        </svg>
                      </motion.div>
                    )}
                    
                    {module.id === 'fastag' && (
                      <motion.div 
                        className="absolute left-4 top-3 w-10 h-10 opacity-10"
                        animate={{ 
                          y: [0, 5, 0],
                          transition: { 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }
                        }}
                      >
                        <svg viewBox="0 0 576 512" fill="white">
                          <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64V320c35.3 0 64 28.7 64 64zM64 192V128h64c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64v64H448zm64-192c-35.3 0-64-28.7-64-64h64v64zM400 256c0 61.9-50.1 112-112 112s-112-50.1-112-112s50.1-112 112-112s112 50.1 112 112z"/>
                        </svg>
                      </motion.div>
                    )}
                    
                    {module.id === 'learning' && (
                      <motion.div 
                        className="absolute top-4 right-5 w-10 h-10 opacity-10"
                        animate={{ 
                          rotate: [0, 20, 0],
                          transition: { 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut" 
                          }
                        }}
                      >
                        <svg viewBox="0 0 384 512" fill="white">
                          <path d="M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"/>
                        </svg>
                      </motion.div>
                    )}
                    
                    {module.id === 'history' && (
                      <motion.div 
                        className="absolute bottom-3 left-4 w-12 h-12 opacity-10"
                        animate={{ 
                          rotate: [0, 360],
                          transition: { 
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear" 
                          }
                        }}
                      >
                        <svg viewBox="0 0 512 512" fill="white">
                          <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
                        </svg>
                      </motion.div>
                    )}
                    
                    <motion.div
                      whileHover={{ 
                        rotate: 15,
                        scale: 1.1,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                    >
                      {React.cloneElement(module.icon as React.ReactElement, { className: 'h-10 w-10 text-white' })}
                    </motion.div>
                  </div>
                  
                  {/* Simple text with ample spacing */}
                  <div className="px-4 pt-4 pb-5">
                    <h3 className="font-semibold text-base mb-1">{module.name}</h3>
                    <p className="text-xs text-gray-500">{module.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          <motion.div 
            className="mt-16 rounded-xl overflow-hidden bg-blue-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="py-8 px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Looking for more functionality?
                </h3>
                <p className="text-gray-600">
                  We're constantly adding new features to enhance your experience.
                </p>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 h-auto text-base font-medium rounded-lg transition-colors">
                Send Feedback
                <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
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