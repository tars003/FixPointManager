import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  ChevronLeft, 
  ChevronRight, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  AlertCircle, 
  BarChart2,
  Car,
  RefreshCw,
  Clock,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Truck,
  Tag
} from 'lucide-react';
import { MotionCard, MotionCardHeader, MotionValue, MotionBadge, AnimatedProgressBar } from '@/components/summary/motion-card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

// Define types for our data
interface VehicleWithValue {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  purchasePrice: number;
  currentValue: number;
  valueTrend: 'up' | 'down' | 'stable';
  valueDifference: number;
  depreciationRate: number;
  lastUpdated: string;
  mileage: number;
  condition: string;
  image?: string;
}

interface DepreciationFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

const VehicleNetValuePage: React.FC = () => {
  const { toast } = useToast();
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  
  // Fetch vehicles with value data
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery<VehicleWithValue[]>({
    queryKey: ['/api/vehicles/with-value'],
    queryFn: async () => {
      try {
        // Fetch vehicles with value information
        const response = await fetch('/api/vehicles');
        const vehiclesData = await response.json();
        
        // If we have vehicles data, return it enhanced with financial information
        if (vehiclesData.length > 0) {
          return vehiclesData.map((vehicle: any) => ({
            ...vehicle,
            purchasePrice: vehicle.purchasePrice || 0,
            currentValue: vehicle.currentValue || 0,
            valueTrend: vehicle.valueTrend || 'stable',
            valueDifference: vehicle.valueDifference || 0,
            depreciationRate: vehicle.depreciationRate || 0,
            lastUpdated: vehicle.lastUpdated || new Date().toISOString(),
            mileage: vehicle.mileage || 0,
            condition: vehicle.condition || 'Good'
          }));
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching vehicles with value:', error);
        return [];
      }
    },
  });
  
  // Set the first vehicle as selected if nothing is selected
  useEffect(() => {
    if (vehicles.length > 0 && selectedVehicleId === null) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  
  // Calculate total fleet value
  const totalFleetValue = vehicles.reduce((sum, vehicle) => sum + (vehicle.currentValue || 0), 0);
  
  // Calculate total appreciation/depreciation
  const totalValueChange = vehicles.reduce(
    (sum, vehicle) => sum + (vehicle.valueDifference || 0), 
    0
  );

  const depreciationFactors: DepreciationFactor[] = [
    { 
      factor: 'Age', 
      impact: 'high',
      description: 'Vehicle age is a primary factor in depreciation, with newer models retaining value better.'
    },
    { 
      factor: 'Mileage', 
      impact: 'high',
      description: 'Higher mileage generally leads to faster depreciation, especially after key milestones.'
    },
    { 
      factor: 'Service History', 
      impact: 'medium',
      description: 'Regular maintenance and complete service records help maintain higher resale value.'
    },
    { 
      factor: 'Market Demand', 
      impact: 'medium',
      description: 'Models with higher market demand typically experience slower depreciation.'
    }
  ];
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace(/^₹/, '₹');
  };
  
  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };
  
  const refreshData = () => {
    toast({
      title: "Refreshing valuation data",
      description: "Fetching the latest market valuations for your vehicles",
    });
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
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Net Value</h1>
          <MotionBadge
            color="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
          >
            <IndianRupee className="h-3 w-3 mr-1" />
            Market Valuation
          </MotionBadge>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={refreshData}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Valuations
        </Button>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main value summary area */}
        <motion.div 
          className="lg:col-span-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MotionCard className="bg-gradient-to-br from-cyan-700 to-blue-800 text-white p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1 text-cyan-50">Total Fleet Value</h2>
                <p className="text-cyan-200 text-sm mb-4 lg:mb-0">Market valuation of all your vehicles</p>
              </div>
              <div className="flex items-end gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <span className="text-5xl font-bold text-white">₹{totalFleetValue.toLocaleString('en-IN')}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`flex items-center text-sm ${totalValueChange >= 0 ? 'text-emerald-300' : 'text-rose-300'} mb-2`}
                >
                  {totalValueChange >= 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>+₹{Math.abs(totalValueChange).toLocaleString('en-IN')}</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      <span>-₹{Math.abs(totalValueChange).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </MotionCard>
          
          {/* Vehicle breakdowns */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Vehicle Value Breakdown</h3>
              <div className="flex text-sm text-gray-500 items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Last updated: Today</span>
              </div>
            </div>

            {/* Value distribution cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current</h4>
                <div className="text-lg md:text-xl font-bold text-cyan-600 dark:text-cyan-400">₹21,35,250</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Estimated market value today</p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 border border-emerald-200 dark:border-emerald-900">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Appreciation</h4>
                <div className="text-lg md:text-xl font-bold text-emerald-600 dark:text-emerald-400">+₹2,50,000</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Value increase since purchase</p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 border border-rose-200 dark:border-rose-900">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Depreciation</h4>
                <div className="text-lg md:text-xl font-bold text-rose-600 dark:text-rose-400">-₹11,49,750</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Value decrease since purchase</p>
              </motion.div>
            </div>

            {/* Selected vehicle details */}
            <AnimatePresence mode="wait">
              {selectedVehicle && (
                <motion.div
                  key={selectedVehicle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-100 dark:bg-cyan-900 p-2 rounded-lg">
                        <Car className="h-6 w-6 text-cyan-700 dark:text-cyan-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{selectedVehicle.name}</h3>
                        <p className="text-sm text-gray-500">{selectedVehicle.make} {selectedVehicle.model}, {selectedVehicle.year}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center text-sm">
                        <Tag className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <span>{selectedVehicle.registrationNumber}</span>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center text-sm">
                        <Truck className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <span>{selectedVehicle.mileage.toLocaleString()} km</span>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                        <span>{selectedVehicle.year}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Purchase Price</p>
                      <p className="text-lg font-semibold">₹{selectedVehicle.purchasePrice.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Current Value</p>
                      <p className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">
                        ₹{selectedVehicle.currentValue.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Value Change</p>
                      <p className={`text-lg font-semibold flex items-center ${
                        selectedVehicle.valueDifference >= 0 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {selectedVehicle.valueDifference >= 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 mr-1.5" />
                            +₹{Math.abs(selectedVehicle.valueDifference).toLocaleString('en-IN')}
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 mr-1.5" />
                            -₹{Math.abs(selectedVehicle.valueDifference).toLocaleString('en-IN')}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Depreciation Rate</p>
                    <div className="flex items-center gap-2">
                      <AnimatedProgressBar 
                        value={selectedVehicle.depreciationRate} 
                        max={100} 
                        colorClass={
                          selectedVehicle.depreciationRate < 10 ? "bg-emerald-500" :
                          selectedVehicle.depreciationRate < 25 ? "bg-amber-500" : "bg-rose-500"
                        }
                        className="w-full flex-1"
                      />
                      <span className={`text-sm font-medium ${
                        selectedVehicle.depreciationRate < 10 ? "text-emerald-600" :
                        selectedVehicle.depreciationRate < 25 ? "text-amber-600" : "text-rose-600"
                      }`}>
                        {selectedVehicle.depreciationRate}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
                  
            {/* Market analysis */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Market Analysis</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Market analysis is based on current vehicle sales data, market demand, and regional pricing trends.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Market Demand</span>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>High</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Resale Potential</span>
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm">
                    <BarChart2 className="h-3.5 w-3.5" />
                    <span>Medium</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Price Volatility</span>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm">
                    <TrendingDown className="h-3.5 w-3.5" />
                    <span>Low</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall Market Trend</span>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Appreciating</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Depreciation factors */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-4">Factors Affecting Value</h3>
              
              <div className="space-y-4">
                {depreciationFactors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`mt-1 h-4 w-4 rounded-full flex-shrink-0 ${
                      factor.impact === 'high' ? 'bg-rose-500' :
                      factor.impact === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{factor.factor}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{factor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Sidebar with vehicle list */}
        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Vehicle selector */}
          <MotionCard className="mb-6">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Your Vehicles</h3>
              <p className="text-sm text-gray-500">Select a vehicle to view detailed valuation</p>
            </div>
            
            <div className="p-2">
              {vehicles.map((vehicle) => (
                <motion.button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                    selectedVehicleId === vehicle.id
                      ? 'bg-cyan-50 dark:bg-cyan-900/30 border-l-4 border-cyan-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      selectedVehicleId === vehicle.id 
                        ? 'bg-cyan-100 dark:bg-cyan-800' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <Car className={`h-5 w-5 ${
                        selectedVehicleId === vehicle.id 
                          ? 'text-cyan-600 dark:text-cyan-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        selectedVehicleId === vehicle.id 
                          ? 'text-cyan-900 dark:text-cyan-50' 
                          : 'text-gray-900 dark:text-gray-50'
                      }`}>
                        {vehicle.name}
                      </p>
                      <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model}</p>
                    </div>
                    <div className={`${
                      vehicle.valueTrend === 'up' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : vehicle.valueTrend === 'down' 
                          ? 'text-rose-600 dark:text-rose-400' 
                          : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {vehicle.valueTrend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : vehicle.valueTrend === 'down' ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <BarChart2 className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <Link href="/vehicle-vault">
                <Button variant="outline" className="w-full gap-1">
                  <Truck className="h-4 w-4" />
                  View All in Vehicle Vault
                </Button>
              </Link>
            </div>
          </MotionCard>
          
          {/* Valuation tip card */}
          <MotionCard className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/30">
            <div className="p-4">
              <div className="bg-blue-100 dark:bg-blue-800/30 h-10 w-10 rounded-full flex items-center justify-center mb-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Valuation Tip</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Regular maintenance and complete service history can increase your vehicle's resale value by up to 10%. 
                Consider maintaining full service records in Document Vault.
              </p>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 gap-1">
                  Learn More
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </MotionCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VehicleNetValuePage;