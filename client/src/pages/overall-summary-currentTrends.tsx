import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BarChart2, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  Truck, 
  Zap, 
  Droplet,
  Wrench,
  Car,
  Route,
  Calculator
} from 'lucide-react';
import { MotionCard, MotionCardHeader, MotionBadge, AnimatedProgressBar } from '@/components/summary/motion-card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  category: 'market' | 'regulation' | 'technology' | 'maintenance';
  importance: 'high' | 'medium' | 'low';
  publishedAt: string;
  read?: boolean;
  saved?: boolean;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  vehicleId?: number;
}

const CurrentTrendsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'news' | 'activity'>('news');
  
  // Fetch news items
  const { data: newsItems = [], isLoading: isLoadingNews } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
    queryFn: async () => {
      // If API returns empty data, use these fallback items for demonstration
      const response = await fetch('/api/news');
      const data = await response.json();
      return data.length > 0 ? data : [];
    },
  });
  
  // Fetch recent activities
  const { data: recentActivities = [], isLoading: isLoadingActivities } = useQuery<RecentActivity[]>({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      // If API returns empty data, use these fallback items for demonstration
      const response = await fetch('/api/activities');
      const data = await response.json();
      return data.length > 0 ? data : [];
    },
  });
  
  // Fetch vehicles from vehicle vault
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['/api/vehicles'],
    queryFn: async () => {
      const response = await fetch('/api/vehicles');
      return response.json();
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const categoryColorMap = {
    market: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    regulation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    technology: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    maintenance: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
  };
  
  const categoryIconMap = {
    market: <TrendingUp className="h-4 w-4" />,
    regulation: <AlertTriangle className="h-4 w-4" />,
    technology: <Zap className="h-4 w-4" />,
    maintenance: <Wrench className="h-4 w-4" />
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
  
  const refreshData = () => {
    toast({
      title: "Refreshing data",
      description: "Getting the latest trends and activity",
    });
  };

  // Animation for page transition
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
    >
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard-enhanced">
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Current Trends</h1>
          <MotionBadge
            color="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
          >
            <Clock className="h-3 w-3 mr-1" />
            Latest Updates
          </MotionBadge>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={refreshData}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Tab navigation */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'news' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('news')}
          className="gap-1.5"
        >
          <BarChart2 className="h-4 w-4" />
          Automotive News
        </Button>
        <Button
          variant={activeTab === 'activity' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('activity')}
          className="gap-1.5"
        >
          <Calendar className="h-4 w-4" />
          Recent Activity
        </Button>
      </div>

      {/* Content area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: activeTab === 'news' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'news' && (
          <div className="grid gap-6">
            <motion.div 
              className="bg-gradient-to-r from-purple-700 to-violet-800 p-6 rounded-xl text-white relative overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-col z-10 relative">
                <BarChart2 className="h-8 w-8 mb-3 text-purple-300" />
                <h2 className="text-2xl font-bold mb-2">Automotive Trends & Updates</h2>
                <p className="text-purple-200 max-w-2xl mb-3">
                  Stay informed with the latest automotive news, market updates, and regulatory changes that may
                  affect your vehicles and driving experience.
                </p>
                <div className="flex gap-2 mt-2">
                  <MotionBadge color="bg-white/20 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" /> Market Trends
                  </MotionBadge>
                  <MotionBadge color="bg-white/20 text-white">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Regulations
                  </MotionBadge>
                  <MotionBadge color="bg-white/20 text-white">
                    <Zap className="h-3 w-3 mr-1" /> Technology
                  </MotionBadge>
                </div>
              </div>
              
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 rounded-full opacity-30 -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full opacity-20 translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            </motion.div>
            
            <motion.div
              className="grid gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Top news item */}
              <MotionCard className="border border-purple-200 dark:border-purple-900/30">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <MotionBadge color={categoryColorMap['market']}>
                        {categoryIconMap['market']}
                        <span className="ml-1">Market Trend</span>
                      </MotionBadge>
                      <MotionBadge color="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                        <span>High Impact</span>
                      </MotionBadge>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      3 hours ago
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-300">
                    EV Market Growing at 26% CAGR
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Electric vehicle adoption surges as new models hit Indian market. Government incentives and 
                    charging infrastructure expansion contribute to the accelerated growth.
                  </p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Award className="h-3.5 w-3.5" />
                      Save Article
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </MotionCard>
              
              {/* Additional news items */}
              <MotionCard className="border border-purple-200 dark:border-purple-900/30">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <MotionBadge color={categoryColorMap['regulation']}>
                        {categoryIconMap['regulation']}
                        <span className="ml-1">Regulation</span>
                      </MotionBadge>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      6 hours ago
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-blue-700 dark:text-blue-300">
                    New Fuel Efficiency Standards
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Government announces stricter emission norms for vehicles. New standards aim to reduce carbon 
                    footprint and promote cleaner automotive technologies.
                  </p>
                </div>
              </MotionCard>
              
              <MotionCard className="border border-purple-200 dark:border-purple-900/30">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <MotionBadge color={categoryColorMap['technology']}>
                        {categoryIconMap['technology']}
                        <span className="ml-1">Technology</span>
                      </MotionBadge>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      12 hours ago
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-emerald-700 dark:text-emerald-300">
                    Advanced Vehicle Diagnostics
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    New diagnostic tools use AI to predict vehicle issues before they occur. Technology can 
                    improve maintenance scheduling and reduce unexpected breakdowns.
                  </p>
                </div>
              </MotionCard>
            </motion.div>
            
            {/* Bottom info section */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Updated 3 hours ago</span>
              </div>
              <Button variant="link" className="text-purple-600 dark:text-purple-400 p-0 h-auto">
                View All News
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="grid gap-6">
            <motion.div 
              className="bg-gradient-to-r from-indigo-700 to-blue-800 p-6 rounded-xl text-white relative overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-col z-10 relative">
                <Calendar className="h-8 w-8 mb-3 text-indigo-300" />
                <h2 className="text-2xl font-bold mb-2">Recent Activity & Interactions</h2>
                <p className="text-indigo-200 max-w-2xl mb-3">
                  Track your recent interactions with the FixPoint platform including service bookings, document uploads,
                  and vehicle management activities.
                </p>
                <div className="flex gap-2 mt-2">
                  <MotionBadge color="bg-white/20 text-white">
                    <Wrench className="h-3 w-3 mr-1" /> Service Bookings
                  </MotionBadge>
                  <MotionBadge color="bg-white/20 text-white">
                    <Truck className="h-3 w-3 mr-1" /> Vehicle Updates
                  </MotionBadge>
                  <MotionBadge color="bg-white/20 text-white">
                    <Droplet className="h-3 w-3 mr-1" /> Maintenance
                  </MotionBadge>
                </div>
              </div>
              
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-30 -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 rounded-full opacity-20 translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            </motion.div>
            
            <motion.div
              className="grid gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Timeline of recent activities */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 border border-indigo-200 dark:border-indigo-900/30">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Activity Timeline</h3>
                
                <div className="space-y-4">
                  <div className="relative pl-6 pb-4 border-l-2 border-indigo-200 dark:border-indigo-700">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-indigo-500"></div>
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">Service Booking Confirmed</span>
                        <span className="text-sm text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Oil change and general inspection scheduled for your BMW 5 Series
                      </p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-6 pb-4 border-l-2 border-indigo-200 dark:border-indigo-700">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-indigo-500"></div>
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">Document Uploaded</span>
                        <span className="text-sm text-gray-500">5 hours ago</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Insurance policy document added for Honda City
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative pl-6 pb-4 border-l-2 border-indigo-200 dark:border-indigo-700">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-indigo-500"></div>
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">Vehicle Added</span>
                        <span className="text-sm text-gray-500">Yesterday</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Added Maruti Swift to your Vehicle Vault
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative pl-6 border-l-2 border-indigo-200 dark:border-indigo-700">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-indigo-500"></div>
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">Service Completed</span>
                        <span className="text-sm text-gray-500">3 days ago</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Brake pad replacement completed for Tata Nexon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Vehicle activity summary */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 border border-indigo-200 dark:border-indigo-900/30">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Your Vehicles Activity</h3>
                
                <div className="space-y-4">
                  {vehicles.slice(0, 3).map((vehicle: any, index: number) => (
                    <div key={vehicle.id || index} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          ['bg-indigo-100', 'bg-emerald-100', 'bg-amber-100', 'bg-rose-100'][index % 4]
                        }`}>
                          <Car className={`h-5 w-5 ${
                            ['text-indigo-600', 'text-emerald-600', 'text-amber-600', 'text-rose-600'][index % 4]
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{vehicle.name}</p>
                          <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-center">
                  <Button variant="outline" className="gap-1.5 mt-2">
                    <Truck className="h-4 w-4" />
                    View All Vehicles
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CurrentTrendsPage;