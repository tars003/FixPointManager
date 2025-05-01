import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Vehicle } from '@shared/schema';
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
  CreditCard,
  ChevronLeft,
  Gauge,
  AlertTriangle,
  Fuel,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const OverallSummary = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Fetch user data (mock for now)
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
  
  // Mock data for summary metrics
  const fleetSummary = {
    totalVehicles: vehicles?.length || 3,
    activeVehicles: 3,
    inMaintenanceVehicles: 1,
    totalValue: '₹32,85,000',
    depreciation: '₹11,49,750',
    appreciation: '+₹2,50,000',
    averageHealthScore: 86,
    fuelConsumption: {
      monthly: '245 liters',
      change: '-12%',
      trend: 'down'
    },
    serviceMetrics: {
      upToDate: 2,
      upcoming: 1,
      overdue: 0,
      efficiency: '92%'
    },
    documents: {
      valid: 8,
      expiringSoon: 2,
      expired: 0
    }
  };
  
  // News and Updates
  const newsUpdates = [
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
  ];
  
  // Fleet health timeline data
  const healthTimeline = [
    { month: 'Jan', score: 82 },
    { month: 'Feb', score: 85 },
    { month: 'Mar', score: 79 },
    { month: 'Apr', score: 84 },
    { month: 'May', score: 88 },
    { month: 'Jun', score: 86 },
  ];
  
  // Service reminders
  const serviceReminders = [
    {
      vehicle: 'Honda City',
      type: 'Regular Maintenance',
      dueDate: '15 May 2025',
      status: 'upcoming',
      daysLeft: 14
    },
    {
      vehicle: 'Tata Nexon',
      type: 'Oil Change',
      dueDate: '28 May 2025',
      status: 'upcoming',
      daysLeft: 27
    },
    {
      vehicle: 'Hyundai Creta',
      type: 'Brake Inspection',
      dueDate: '12 June 2025',
      status: 'upcoming',
      daysLeft: 42
    }
  ];
  
  // Document renewals
  const documentRenewals = [
    {
      vehicle: 'Honda City',
      document: 'Insurance',
      expiryDate: '12 July 2025',
      status: 'valid',
      daysLeft: 72
    },
    {
      vehicle: 'Maruti Swift',
      document: 'Pollution Certificate',
      expiryDate: '30 May 2025',
      status: 'expiring-soon',
      daysLeft: 29
    },
    {
      vehicle: 'Hyundai Creta',
      document: 'Road Tax',
      expiryDate: '15 August 2025',
      status: 'valid',
      daysLeft: 106
    }
  ];
  
  // Vehicle Value Trends
  const valueHistory = [
    { month: 'Jan', value: 3125000 },
    { month: 'Feb', value: 3110000 },
    { month: 'Mar', value: 3095000 },
    { month: 'Apr', value: 3250000 },
    { month: 'May', value: 3285000 },
    { month: 'Jun', value: 3285000 },
  ];
  
  // Expense Breakdown
  const expenseBreakdown = [
    { category: 'Fuel', percentage: 45, amount: '₹15,750' },
    { category: 'Maintenance', percentage: 28, amount: '₹9,800' },
    { category: 'Insurance', percentage: 15, amount: '₹5,250' },
    { category: 'Taxes', percentage: 8, amount: '₹2,800' },
    { category: 'Other', percentage: 4, amount: '₹1,400' }
  ];
  
  // Fleet Usage Stats
  const fleetUsage = {
    totalKilometers: '12,580',
    averageKmPerVehicle: '4,193',
    mostUsedVehicle: 'Honda City',
    leastUsedVehicle: 'Maruti Swift',
    fuelEfficiency: '16.8 kmpl'
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
  
  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-amber-500';
    return 'text-rose-500';
  };
  
  const getHealthScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-100';
    if (score >= 75) return 'bg-amber-100';
    return 'bg-rose-100';
  };
  
  const getHealthScoreTextColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700';
    if (score >= 75) return 'text-amber-700';
    return 'text-rose-700';
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-emerald-100 text-emerald-700';
      case 'expiring-soon': return 'bg-amber-100 text-amber-700';
      case 'expired': return 'bg-rose-100 text-rose-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'overdue': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="pb-12">
      {/* Header section with navigation */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 pt-12 pb-20 px-4 rounded-b-3xl relative overflow-hidden">
        {/* Animated automotive background elements */}
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
            <path d="M608 128.2C604.5 104 585.4 84.9 561.2 81.4C549 79.8 536.8 78.4 524.7 77.1L522.3 48.9C521.9 43 520.9 37.2 516.1 32.8C511.3 28.4 504.8 29.1 498.9 29.9L75 94.6c-18.3 2.3-35.6 10.5-48.6 23.5c-13 13-21.1 30.3-23.5 48.6L.0265 179.6c-.1108 1-.2211 1.9-.2211 2.9c0 33.1 26.9 60 60 60H81.45c-14.5 9.1-27.6 22.2-36.6 38.8c-18.1 33.5-16 75.6 6 107.6L4.289 430.1c-5.031 2.8-6.906 9.1-4.172 14.1C1.738 447.8 4.914 450 8.438 450c1.703 0 3.437-.4375 5.047-1.328l59.3-32.9c5.828 4.6 12.05 8.5 18.51 11.7c20.88 10.4 44.28 11.6 65.98 3.5c13.8-5.2 26.1-13.8 35.9-24.9h234.6c9.799 11.1 22.08 19.7 35.9 24.9c21.69 8.1 45.09 6.9 65.98-3.5c6.451-3.2 12.68-7.1 18.51-11.7l59.3 32.9c1.609 .8906 3.344 1.328 5.047 1.328c3.523 0 6.7-2.2 8.016-5.766C643.9 438.3 642 431.9 636.1 429.1L590.5 388.4c.6406-.6289 1.242-1.289 1.857-1.953C596.8 381.9 599.8 377 599.8 372c0-44.2-35.8-80-80-80H144.1c-.168 0-.2988 .0723-.4668 .0723c2.691-5.914 5.832-11.55 9.488-16.85C166.3 256.8 185.7 245.4 207.3 241.4l278.4-33.4c34.9-4.2 59.7-35.3 57.6-70.4C542.4 129.3 533.4 121.4 608 128.2zM64 224c-17.66 0-32-14.3-32-32c0-17.1 13.83-30.9 31.03-31.9l3.172-.375L68.58 176H112v16H64zM528 304c30.9 0 56 25.1 56 56c0 1.1-.3203 2.1-.4336 3.2C576.4 377.1 566.1 387.9 552 391.7c-15.31 4-31.66 .9336-44.06-8.469l-4.141-3.109l.2344-.1445c-5.094-4.062-8.062-10.2-8.062-16.7c0-11.8 9.469-21.3 21.31-21.3h4.688v-16H496v16h8C518.8 342 531.9 358.9 528 304z"/>
          </svg>
        </motion.div>
        
        <div className="container mx-auto">
          {/* Back Navigation and Title */}
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/')}
              className="text-white/80 hover:text-white mr-3 flex items-center"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm">Back to Dashboard</span>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Overall Summary</h1>
              <p className="text-blue-100">Comprehensive fleet analysis and insights</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button className="bg-white text-blue-700 hover:bg-blue-50">
                <Share2 className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 -mt-10">
        {/* Tabs Navigation */}
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white rounded-lg shadow-lg p-1 mb-6">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-50">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="health" className="data-[state=active]:bg-blue-50">
                <HeartPulse className="h-4 w-4 mr-2" />
                Health
              </TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-blue-50">
                <CircleDollarSign className="h-4 w-4 mr-2" />
                Financial
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="data-[state=active]:bg-blue-50">
                <Wrench className="h-4 w-4 mr-2" />
                Maintenance
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-blue-50">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 mt-4">
          {/* Key Metrics */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-5 flex items-center gap-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fleet Size</div>
                  <div className="text-2xl font-bold">{fleetSummary.totalVehicles}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="text-emerald-500">{fleetSummary.activeVehicles} Active</span> · {fleetSummary.inMaintenanceVehicles} In maintenance
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-5 flex items-center gap-4">
                <div className="bg-amber-100 rounded-full p-3">
                  <Gauge className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Health Score</div>
                  <div className="text-2xl font-bold">
                    <span className={getHealthScoreColor(fleetSummary.averageHealthScore)}>
                      {fleetSummary.averageHealthScore}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Fleet average · <span className="text-emerald-500">+2% this month</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-5 flex items-center gap-4">
                <div className="bg-emerald-100 rounded-full p-3">
                  <IndianRupee className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Value</div>
                  <div className="text-2xl font-bold">{fleetSummary.totalValue}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="text-emerald-500">{fleetSummary.appreciation} gain</span> this quarter
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-5 flex items-center gap-4">
                <div className="bg-cyan-100 rounded-full p-3">
                  <Fuel className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fuel Consumption</div>
                  <div className="text-2xl font-bold">{fleetSummary.fuelConsumption.monthly}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="text-emerald-500">{fleetSummary.fuelConsumption.change}</span> vs. last month
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Main Dashboard Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    {newsUpdates.map((item, i) => (
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
                      className="text-xs h-7 px-3 text-white hover:bg-white/10 border border-white/20 rounded-full"
                    >
                      View All
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Vehicle Value Trend */}
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
                        {fleetSummary.totalValue}
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
                        { label: "Appreciation", value: fleetSummary.appreciation, color: "emerald-400" },
                        { label: "Depreciation", value: fleetSummary.depreciation, color: "rose-400" }
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
                        className="text-xs h-7 px-3 text-white hover:bg-white/10 border border-white/20 rounded-full"
                        onClick={() => setActiveTab('financial')}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Health Score Tracker */}
            <motion.div 
              className="relative rounded-xl overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-900 shadow-lg p-0"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                  className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-emerald-600 opacity-20"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-teal-500 opacity-20"
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
                      <Activity className="h-5 w-5 text-emerald-300" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Health Score</h3>
                    <div className="text-xs text-emerald-200">Fleet performance tracker</div>
                  </div>
                </div>
                
                <div className="text-xs font-medium text-white bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  6-Month Trend
                </div>
              </div>
              
              {/* Health score display with glassmorphism */}
              <div className="relative px-4 pt-2 pb-4">
                <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-4">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
                  
                  <div className="relative z-10">
                    {/* Health score */}
                    <motion.div 
                      className="flex items-center justify-center gap-4 py-3"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: [0.9, 1, 0.9] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <div className="text-center">
                        <div className="relative inline-flex items-center justify-center">
                          <svg className="w-24 h-24">
                            <circle 
                              className="text-white/10" 
                              strokeWidth="6" 
                              stroke="currentColor" 
                              fill="transparent" 
                              r="36" 
                              cx="48" 
                              cy="48" 
                            />
                            <motion.circle 
                              className="text-emerald-400" 
                              strokeWidth="6" 
                              strokeDasharray={36 * 2 * Math.PI} 
                              strokeDashoffset={36 * 2 * Math.PI * (1 - fleetSummary.averageHealthScore/100)} 
                              strokeLinecap="round" 
                              stroke="currentColor" 
                              fill="transparent" 
                              r="36" 
                              cx="48" 
                              cy="48"
                              initial={{ strokeDashoffset: 36 * 2 * Math.PI }}
                              animate={{ strokeDashoffset: 36 * 2 * Math.PI * (1 - fleetSummary.averageHealthScore/100) }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </svg>
                          <span className="absolute text-2xl font-bold text-white">{fleetSummary.averageHealthScore}%</span>
                        </div>
                        <div className="text-xs text-emerald-200 mt-2">Overall Health</div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-xs text-white/80 mb-1">Health Breakdown</div>
                        <div className="space-y-2">
                          {[
                            { label: "Engine", score: 90 },
                            { label: "Battery", score: 85 },
                            { label: "Brakes", score: 82 }
                          ].map((item, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-white/70">{item.label}</span>
                                <span className={`text-${getHealthScoreColor(item.score).split('-')[0]}-300`}>{item.score}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  className={`h-full bg-${getHealthScoreColor(item.score).split('-')[0]}-400`}
                                  style={{ width: `${item.score}%` }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.score}%` }}
                                  transition={{ duration: 1, delay: i * 0.2 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center text-white/70">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        <span className="text-xs">Last updated: Today</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-7 px-3 text-white hover:bg-white/10 border border-white/20 rounded-full"
                        onClick={() => setActiveTab('health')}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Service and Document Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Reminders */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden p-5"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Upcoming Service Reminders</h3>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {serviceReminders.length} Upcoming
                </Badge>
              </div>
              
              <div className="space-y-3">
                {serviceReminders.map((reminder, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Car className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{reminder.vehicle}</h4>
                        <p className="text-sm text-gray-500">{reminder.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{reminder.dueDate}</div>
                      <Badge className={getStatusColor(reminder.status)}>
                        {reminder.daysLeft} days left
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab('maintenance')}
                  className="text-blue-600 rounded-full"
                >
                  View All Services
                </Button>
              </div>
            </motion.div>
            
            {/* Document Renewals */}
            <motion.div 
              className="bg-white rounded-xl shadow-sm overflow-hidden p-5"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold">Document Renewals</h3>
                </div>
                <Badge className="bg-amber-100 text-amber-700">
                  {documentRenewals.filter(d => d.status === 'expiring-soon').length} Expiring Soon
                </Badge>
              </div>
              
              <div className="space-y-3">
                {documentRenewals.map((document, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <FileText className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{document.vehicle}</h4>
                        <p className="text-sm text-gray-500">{document.document}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{document.expiryDate}</div>
                      <Badge className={getStatusColor(document.status)}>
                        {document.daysLeft} days left
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setActiveTab('documents')}
                  className="text-indigo-600 rounded-full"
                >
                  View All Documents
                </Button>
              </div>
            </motion.div>
          </div>
        </TabsContent>
          
          {/* Health Tab */}
          <TabsContent value="health" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Activity className="h-4 w-4 text-emerald-600" />
                  </div>
                  Fleet Health Score
                </CardTitle>
                <CardDescription>Overall health assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-4">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-36 h-36">
                      <circle 
                        className="text-gray-100" 
                        strokeWidth="8" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="56" 
                        cx="72" 
                        cy="72" 
                      />
                      <motion.circle 
                        className={`text-${getHealthScoreColor(fleetSummary.averageHealthScore).split('-')[0]}-500`}
                        strokeWidth="8" 
                        strokeDasharray={56 * 2 * Math.PI} 
                        strokeDashoffset={56 * 2 * Math.PI * (1 - fleetSummary.averageHealthScore/100)} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="56" 
                        cx="72" 
                        cy="72"
                        initial={{ strokeDashoffset: 56 * 2 * Math.PI }}
                        animate={{ strokeDashoffset: 56 * 2 * Math.PI * (1 - fleetSummary.averageHealthScore/100) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-bold">{fleetSummary.averageHealthScore}%</span>
                      <span className={`text-sm ${getHealthScoreColor(fleetSummary.averageHealthScore)}`}>Excellent</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t flex justify-between">
                <span className="text-sm text-gray-500">Last updated: Today</span>
                <Badge className={`${getHealthScoreBgColor(fleetSummary.averageHealthScore)} ${getHealthScoreTextColor(fleetSummary.averageHealthScore)}`}>
                  +2% this month
                </Badge>
              </CardFooter>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BarChart2 className="h-4 w-4 text-blue-600" />
                  </div>
                  Health Score Trends
                </CardTitle>
                <CardDescription>6-month historical data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-end justify-between px-2">
                  {healthTimeline.map((month, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="relative w-12">
                        <motion.div 
                          className={`w-12 bg-${getHealthScoreColor(month.score).split('-')[0]}-500 rounded-t-lg`}
                          style={{ height: `${month.score * 0.5}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${month.score * 0.5}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        >
                          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                            {month.score}%
                          </div>
                        </motion.div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">{month.month}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t">
                <span className="text-sm text-gray-500">Score trending upward from last quarter</span>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  Maintenance Status
                </CardTitle>
                <CardDescription>Service compliance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Service Compliance</span>
                      <span className="text-sm font-medium">{fleetSummary.serviceMetrics.efficiency}</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="bg-emerald-50 p-3 rounded-lg text-center">
                      <div className="text-emerald-600 font-semibold">{fleetSummary.serviceMetrics.upToDate}</div>
                      <div className="text-xs text-gray-500">Up-to-date</div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                      <div className="text-amber-600 font-semibold">{fleetSummary.serviceMetrics.upcoming}</div>
                      <div className="text-xs text-gray-500">Upcoming</div>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-lg text-center">
                      <div className="text-rose-600 font-semibold">{fleetSummary.serviceMetrics.overdue}</div>
                      <div className="text-xs text-gray-500">Overdue</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full rounded-full"
                  onClick={() => setActiveTab('maintenance')}
                >
                  View Service Schedule
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-rose-100 p-2 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                  </div>
                  Issue Alerts
                </CardTitle>
                <CardDescription>Potential problems detected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-800">Tata Nexon</h5>
                      <p className="text-sm text-gray-500">Battery voltage below optimal range</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-800">Hyundai Creta</h5>
                      <p className="text-sm text-gray-500">Brake pad wear detected</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full rounded-full"
                >
                  View All Issues
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="bg-cyan-100 p-2 rounded-full">
                    <Gauge className="h-4 w-4 text-cyan-600" />
                  </div>
                  Performance Metrics
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Avg. Fuel Economy</div>
                    <div className="font-medium">{fleetUsage.fuelEfficiency}</div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Total Distance</div>
                    <div className="font-medium">{fleetUsage.totalKilometers} km</div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Avg per Vehicle</div>
                    <div className="font-medium">{fleetUsage.averageKmPerVehicle} km</div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Most Used</div>
                    <div className="font-medium">{fleetUsage.mostUsedVehicle}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full rounded-full"
                >
                  View Detailed Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default OverallSummary;