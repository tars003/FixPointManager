import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  ChevronLeft, 
  Wrench, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  Car,
  BarChart2,
  ArrowRight,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  CircleDashed,
  CircleCheck,
  CircleX,
  Plus
} from 'lucide-react';
import { MotionCard, MotionCardHeader, MotionValue, MotionBadge, AnimatedProgressBar } from '@/components/summary/motion-card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface ServiceRecord {
  id: number;
  vehicleId: number;
  type: string;
  status: 'completed' | 'scheduled' | 'overdue' | 'in-progress';
  date: string;
  serviceCenter: string;
  cost: number;
  description: string;
  nextServiceDue?: string;
}

interface VehicleHealth {
  id: number;
  name: string;
  make: string;
  model: string;
  registrationNumber: string;
  lastService?: string;
  nextService?: string;
  overallHealth: number;
  status: 'good' | 'warning' | 'critical' | 'unknown';
  serviceDueDays?: number;
  components: {
    name: string;
    health: number;
    status: 'good' | 'warning' | 'critical' | 'unknown';
    lastChecked: string;
    recommendation?: string;
  }[];
}

const ServiceHealthPage: React.FC = () => {
  const { toast } = useToast();
  const [expandedVehicleId, setExpandedVehicleId] = useState<number | null>(null);
  
  // Fetch vehicles with health data
  const { data: vehicleHealth = [], isLoading: isLoadingHealth } = useQuery<VehicleHealth[]>({
    queryKey: ['/api/vehicles/health'],
    queryFn: async () => {
      try {
        // Try to fetch real vehicle health data
        const response = await fetch('/api/vehicles');
        const vehicles = await response.json();
        
        if (vehicles.length > 0) {
          // If we have vehicles data, return enhanced with health information
          return vehicles.map((vehicle: any) => ({
            ...vehicle,
            overallHealth: vehicle.overallHealth || Math.floor(Math.random() * 40) + 60, // 60-100%
            status: vehicle.status || 'good',
            components: vehicle.components || [],
            serviceDueDays: vehicle.serviceDueDays
          }));
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching vehicle health:', error);
        return [];
      }
    },
  });
  
  // Fetch service records
  const { data: serviceRecords = [], isLoading: isLoadingRecords } = useQuery<ServiceRecord[]>({
    queryKey: ['/api/service-records'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/service-records');
        return await response.json();
      } catch (error) {
        console.error('Error fetching service records:', error);
        return [];
      }
    }
  });

  // Calculate service statistics
  const completedServices = vehicleHealth.filter(v => v.status === 'good').length;
  const dueServices = vehicleHealth.filter(v => v.status === 'warning').length;
  const overdueServices = vehicleHealth.filter(v => v.status === 'critical').length;
  
  // Toggle expanded vehicle details
  const toggleVehicleExpand = (id: number) => {
    setExpandedVehicleId(expandedVehicleId === id ? null : id);
  };
  
  const refreshData = () => {
    toast({
      title: "Refreshing service data",
      description: "Getting the latest service health information",
    });
  };
  
  const scheduleService = (vehicleId: number) => {
    toast({
      title: "Scheduling service",
      description: "Redirecting to service booking page",
    });
  };

  const getStatusIcon = (status: string, size: number = 5) => {
    switch (status) {
      case 'good':
        return <CircleCheck className={`h-${size} w-${size} text-emerald-500`} />;
      case 'warning':
        return <AlertTriangle className={`h-${size} w-${size} text-amber-500`} />;
      case 'critical':
        return <CircleX className={`h-${size} w-${size} text-rose-500`} />;
      default:
        return <CircleDashed className={`h-${size} w-${size} text-gray-500`} />;
    }
  };
  
  const getHealthColor = (health: number) => {
    if (health >= 80) return "bg-emerald-500";
    if (health >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };
  
  const getDaysLabel = (days?: number) => {
    if (!days) return "N/A";
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return "Due today";
    return `${days} days`;
  };

  // Animation for page transition
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Service Health</h1>
          <MotionBadge
            color="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
          >
            <Wrench className="h-3 w-3 mr-1" />
            Maintenance Status
          </MotionBadge>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={refreshData}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Status
        </Button>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6">
        {/* Health status overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="bg-emerald-500 h-2" />
            <div className="p-5 flex flex-col items-center text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                <CircleCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">2</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Service Complete</p>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="bg-amber-500 h-2" />
            <div className="p-5 flex flex-col items-center text-center">
              <div className="bg-amber-100 dark:bg-amber-900 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-4xl font-bold text-amber-600 dark:text-amber-400">1</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Due Soon</p>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="bg-rose-500 h-2" />
            <div className="p-5 flex flex-col items-center text-center">
              <div className="bg-rose-100 dark:bg-rose-900 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                <AlertOctagon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-4xl font-bold text-rose-600 dark:text-rose-400">0</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Overdue</p>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Service history by vehicle */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Vehicle Service Status</h2>
            <Link href="/vehicle-vault">
              <Button variant="ghost" size="sm" className="gap-1 text-blue-600 dark:text-blue-400">
                View in Vehicle Vault
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* Honda City - Complete */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md border-l-4 border-emerald-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                    <Car className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Honda City</h3>
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">
                        Complete
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Last service: 14 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <span className="mr-1">Details</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Health status</span>
                <span className="ml-auto text-sm font-medium text-emerald-600 dark:text-emerald-400">Excellent</span>
              </div>
              <Progress value={95} className="h-2 bg-gray-100 dark:bg-gray-700">
                <motion.div 
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '95%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </Progress>
              
              <div className="flex justify-between mt-3">
                <span className="text-xs text-gray-500">Next service in 176 days</span>
                <span className="text-xs text-gray-500">14 Apr</span>
              </div>
            </div>
          </motion.div>
          
          {/* Tata Nexon - Due Soon */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md border-l-4 border-amber-500"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg">
                    <Car className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Tata Nexon</h3>
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                        Due Soon
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Last service: 152 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <span className="mr-1">Details</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Health status</span>
                <span className="ml-auto text-sm font-medium text-amber-600 dark:text-amber-400">Good</span>
              </div>
              <Progress value={75} className="h-2 bg-gray-100 dark:bg-gray-700">
                <motion.div 
                  className="h-full bg-amber-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </Progress>
              
              <div className="flex justify-between mt-3">
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Service recommended within 30 days</span>
                <Button variant="outline" size="sm" className="h-7 text-xs">Schedule Service</Button>
              </div>
            </div>
          </motion.div>
          
          {/* Maruti Swift - Complete */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md border-l-4 border-emerald-500"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                    <Car className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Maruti Swift</h3>
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">
                        Complete
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Last service: 5 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <span className="mr-1">Details</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Health status</span>
                <span className="ml-auto text-sm font-medium text-emerald-600 dark:text-emerald-400">Excellent</span>
              </div>
              <Progress value={98} className="h-2 bg-gray-100 dark:bg-gray-700">
                <motion.div 
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '98%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </Progress>
              
              <div className="flex justify-between mt-3">
                <span className="text-xs text-gray-500">Next service in 175 days</span>
                <span className="text-xs text-gray-500">8 Jun</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Action card */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Schedule Preventive Maintenance</h3>
                <p className="text-emerald-100 max-w-xl">
                  Proactive maintenance can extend your vehicle's life, improve fuel efficiency, and prevent unexpected breakdowns.
                </p>
              </div>
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-md">
                Schedule Service
              </Button>
            </div>
          </div>
          
          {/* Background elements */}
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-teal-400 rounded-full opacity-30 -translate-y-1/3 translate-x-1/3"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 rounded-full opacity-30 translate-y-1/3 -translate-x-1/3"
            animate={{ 
              scale: [1, 1.08, 1],
              rotate: [0, -5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          />
        </motion.div>
        
        {/* Maintenance Tips */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5"
        >
          <h3 className="font-semibold mb-4">Recommended Maintenance Tips</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-cyan-100 dark:bg-cyan-900 p-1.5 rounded-full mt-0.5">
                <CheckCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Check tire pressure monthly</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Proper tire pressure improves fuel efficiency and extends tire life.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-cyan-100 dark:bg-cyan-900 p-1.5 rounded-full mt-0.5">
                <CheckCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Change oil at recommended intervals</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Regular oil changes keep your engine running smoothly and prevent premature wear.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-cyan-100 dark:bg-cyan-900 p-1.5 rounded-full mt-0.5">
                <CheckCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Replace air filters regularly</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Clean air filters improve engine performance and reduce emissions.
                </p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-center">
            <Button variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" />
              View All Maintenance Tips
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ServiceHealthPage;