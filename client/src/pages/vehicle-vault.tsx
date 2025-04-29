import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityIntegration from '@/components/service-booking/community-integration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView, animate } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Calendar, ChevronDown, Download, Share, Award,
  Gauge, Settings, Clock, BookOpen, Users, Trophy,
  Car, FileText, HeartPulse, Shield, FileImage, BarChart3,
  PieChart, TrendingUp, TrendingDown, Star, BoxSelect, Brain,
  Battery, Leaf, Droplets, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  AlertTriangle, Activity, Info, Zap, BadgeCheck, Wrench, X, PlusCircle,
  AlertCircle, ThumbsUp, ShoppingBag, RefreshCw, Warehouse, AlertOctagon,
  Building2, KeyRound, Tag, CheckCircle, Scale, Trash2, FileX
} from 'lucide-react';

// Import our components
import VehicleCarousel from '@/components/vehicle-vault/VehicleCarousel';
import VehicleDetailAnalysis from '@/components/vehicle-vault/VehicleDetailAnalysis';
import VehicleCategorySelector from '@/components/vehicle-vault/VehicleCategorySelector';
import VehicleMoodIndicator from '@/components/vehicle-vault/VehicleMoodIndicator';
import VehicleStoryCard from '@/components/vehicle-vault/VehicleStoryCard';
import VehicleDashboardCard from '@/components/vehicle-vault/VehicleDashboardCard';
import ColorAdaptiveUI from '@/components/vehicle-vault/ColorAdaptiveUI';

// Extended vehicle data with more details
const vehicleData = [
  { 
    id: 1,
    vehicle: 'Tata Nexon EV', 
    worth: 892500, 
    percentage: 67,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Nexon-EV/9779/1673939319612/front-left-side-47.jpg',
    mileage: 15200,
    fuelType: 'Electric',
    batteryHealth: 93,
    lastService: '2 months ago',
    nextService: '4 months',
    purchaseDate: 'Jun 15, 2023',
    insuranceValid: 'May 2025',
    maintenanceCost: 12500,
    efficiency: '88%',
    averageCharge: '35 kWh',
    range: '312 km',
    carbonOffset: '2.4 tonnes'
  },
  { 
    id: 2,
    vehicle: 'Honda City', 
    worth: 375000, 
    percentage: 28,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/9710/1677914238296/front-left-side-47.jpg',
    mileage: 45700,
    fuelType: 'Petrol',
    engineHealth: 87,
    lastService: '2 weeks ago',
    nextService: '3 months',
    purchaseDate: 'Aug 21, 2019',
    insuranceValid: 'Jul 2025',
    maintenanceCost: 38500,
    efficiency: '16.5 km/l',
    averageFuel: '5.2 l/100km',
    topSpeed: '185 km/h',
    emissionRating: 'BS6'
  },
  { 
    id: 3,
    vehicle: 'TVS iQube', 
    worth: 73500, 
    percentage: 5,
    image: 'https://bd.gaadicdn.com/processedimages/tvs/iqube/source/iqube62edf2890fdfa.jpg',
    mileage: 1200,
    fuelType: 'Electric',
    batteryHealth: 98,
    lastService: 'None',
    nextService: '2 months',
    purchaseDate: 'Aug 05, 2023',
    insuranceValid: 'Aug 2026',
    maintenanceCost: 2500,
    efficiency: '95%',
    averageCharge: '2.8 kWh',
    range: '85 km',
    carbonOffset: '0.3 tonnes'
  },
  { 
    id: 4,
    vehicle: 'Mahindra XUV700', 
    worth: 1250000, 
    percentage: 82,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mahindra/XUV700/10798/1690452411429/front-left-side-47.jpg',
    mileage: 8500,
    fuelType: 'Diesel',
    engineHealth: 96,
    lastService: '1 month ago',
    nextService: '5 months',
    purchaseDate: 'Jan 10, 2023',
    insuranceValid: 'Dec 2026',
    maintenanceCost: 15000,
    efficiency: '14.3 km/l',
    averageFuel: '7.0 l/100km',
    topSpeed: '200 km/h',
    emissionRating: 'BS6'
  },
  { 
    id: 5,
    vehicle: 'Royal Enfield Classic 350', 
    worth: 190000, 
    percentage: 38,
    image: 'https://bd.gaadicdn.com/processedimages/royal-enfield/classic-350/source/classic-35062f3b48bfe873.jpg',
    mileage: 22500,
    fuelType: 'Petrol',
    engineHealth: 90,
    lastService: '3 months ago',
    nextService: '1 month',
    purchaseDate: 'Mar 18, 2021',
    insuranceValid: 'Feb 2025',
    maintenanceCost: 18500,
    efficiency: '35 km/l',
    averageFuel: '2.9 l/100km',
    topSpeed: '120 km/h',
    emissionRating: 'BS6'
  }
];

// Extract the first 3 vehicles for the worth chart
const vehicleWorthData = vehicleData.slice(0, 3).map(v => ({
  vehicle: v.vehicle,
  worth: v.worth,
  percentage: v.percentage
}));

// AI generated stories for each vehicle
const vehicleStories = {
  'Tata Nexon EV': "Your Tata Nexon EV has been with you for 2 years, reliably serving through 15,000 km of urban commutes and 3 memorable road trips. Its electric powertrain has saved approximately ₹87,500 in fuel costs compared to a petrol equivalent, while helping reduce your carbon footprint by an estimated 3.2 tonnes of CO2.",
  'Honda City': "Your Honda City has been a loyal companion for 5 years, clocking 45,000 km across various terrains. It's witnessed 2 family vacations to the hills and has an impressive service record with only one major maintenance issue. The fuel efficiency remains excellent at 16.5 km/l, above the average for its age.",
  'TVS iQube': "The TVS iQube, your newest addition from 8 months ago, has transformed your daily commute. With 1,200 km on the odometer, it's already saved you 30 hours in traffic and reduced your monthly transportation budget by 35%. Its charging efficiency remains at factory optimal levels.",
  'Mahindra XUV700': "Your Mahindra XUV700, acquired just 16 months ago, has already become the family favorite for weekend getaways. With 8,500 km logged, it's taken you on 4 long trips and countless city drives. Its spacious interior and advanced safety features have provided peace of mind during monsoon travel conditions.",
  'Royal Enfield Classic 350': "The Royal Enfield Classic 350 has been your weekend companion for 3 years now. It's participated in 5 group rides, including the prestigious Royal Enfield Rider Mania. With 22,500 km on the odometer, it's developed that distinctive character that Royal Enfield enthusiasts cherish, and its value has remained remarkably stable."
};

// Community leaderboard data
const communityLeaderboard = [
  { name: 'Rajesh M.', points: 2450, contributions: 47, badges: 8 },
  { name: 'Priya S.', points: 2120, contributions: 39, badges: 7 },
  { name: 'Vikram K.', points: 1870, contributions: 31, badges: 6 },
  { name: 'Anjali P.', points: 1650, contributions: 28, badges: 5 },
  { name: 'Sanjay R.', points: 1520, contributions: 25, badges: 4 },
];

// Add keyframes for pulse animation
const pulseKeyframes = `
@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-10px) translateX(5px);
  }
  66% {
    transform: translateY(5px) translateX(-5px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(100, 149, 237, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(100, 149, 237, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(100, 149, 237, 0.3);
  }
}
`;

// Dynamic floating particles background
const ParticleBg = () => {
  const particles = Array.from({ length: 25 }, (_, i) => i);
  
  useEffect(() => {
    // Insert keyframes into document
    const style = document.createElement('style');
    style.textContent = pulseKeyframes;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.map((i) => {
        const size = Math.random() * 20 + 10;
        const duration = Math.random() * 20 + 10;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.2 + 0.05;
        const blur = Math.random() * 10 + 5;
        
        // Generate a random color from a palette of blues and purples
        const colors = ['from-blue-400/10 to-indigo-500/10', 'from-indigo-300/10 to-purple-400/10', 'from-blue-500/10 to-emerald-500/10'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-gradient-to-br ${color} backdrop-blur-sm`}
            style={{ 
              width: size, 
              height: size, 
              left: `${initialX}%`, 
              top: `${initialY}%`,
              opacity: opacity,
              filter: `blur(${blur}px)`,
              animation: `float ${duration}s infinite ease-in-out`
            }}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              opacity: [opacity, opacity * 2, opacity]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay,
            }}
          />
        );
      })}
    </div>
  );
};

const AnimatedCounter = ({ target, duration = 2 }: { target: number, duration?: number }) => {
  const nodeRef = useRef(null);
  const count = useMotionValue(0);
  const roundedCount = useTransform(count, Math.round);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      count.set(0);
      const controls = animate(count, target, { duration });
      return controls.stop;
    }
  }, [count, target, duration, isInView]);

  return (
    <motion.span ref={ref} className="text-4xl font-bold">
      {roundedCount}
    </motion.span>
  );
};

const FadeInView = ({ children, delay = 0, direction = null }: { children: React.ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right' | null }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  let initialProps: any = { opacity: 0 };
  if (direction === 'up') initialProps = { ...initialProps, y: 50 };
  if (direction === 'down') initialProps = { ...initialProps, y: -50 };
  if (direction === 'left') initialProps = { ...initialProps, x: 50 };
  if (direction === 'right') initialProps = { ...initialProps, x: -50 };
  
  return (
    <motion.div
      ref={ref}
      initial={initialProps}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const TabTransition = ({ children, isActive }: { children: React.ReactNode, isActive: boolean }) => (
  <AnimatePresence mode="wait">
    {isActive && (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const InfoBox = ({ icon: Icon, title, value, accent }: { icon: any; title: string; value: string; accent: string }) => (
  <div className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg p-5 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
    <div className="flex items-center gap-4">
      <div className={`rounded-full p-3 ${accent} shadow-md transform transition-all duration-300 hover:scale-110`}>
        <Icon className={`h-6 w-6 text-white`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">{value}</h3>
      </div>
    </div>
  </div>
);

const VehicleWorthVisual = () => {
  const [progress, setProgress] = useState<number[]>([0, 0, 0]);
  
  useEffect(() => {
    // Animate progress bars
    const timer = setTimeout(() => {
      setProgress(vehicleWorthData.map(v => v.percentage));
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const totalWorth = vehicleWorthData.reduce((sum, vehicle) => sum + vehicle.worth, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">Total Fleet Value</h3>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-3xl md:text-4xl font-bold">
                ₹{totalWorth.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Combined value of 3 primary vehicles
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <FileText className="h-4 w-4 mr-1" />
                <span className="text-xs">Report</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-4 w-4 mr-1" />
                <span className="text-xs">Export</span>
              </Button>
            </div>
          </div>
        </div>
        
        {vehicleWorthData.map((vehicle, index) => (
          <div key={vehicle.vehicle} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-slate-600" />
                <span className="font-medium">{vehicle.vehicle}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {vehicle.percentage}%
              </Badge>
            </div>
            <p className="text-xl font-bold">₹{vehicle.worth.toLocaleString('en-IN')}</p>
            <Progress value={progress[index]} className="h-2 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Using the imported VehicleStoryCard component

const PredictiveMaintenance = () => {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-start gap-2">
        <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-1 mt-0.5">
          <AlertTriangle className="h-3 w-3 text-amber-500" />
        </div>
        <div>
          <p className="font-medium">Honda City - Brake pads</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Expected replacement in 2 months (15,000 km)</p>
        </div>
      </div>
      <Separator />
      <div className="flex items-start gap-2">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
          <Zap className="h-3 w-3 text-green-500" />
        </div>
        <div>
          <p className="font-medium">Tata Nexon EV - Battery health</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Excellent condition (93% capacity)</p>
        </div>
      </div>
      <Separator />
      <div className="flex items-start gap-2">
        <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 mt-0.5">
          <Info className="h-3 w-3 text-blue-500" />
        </div>
        <div>
          <p className="font-medium">TVS iQube - First service</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Schedule first service in 3 weeks</p>
        </div>
      </div>
    </div>
  );
};

const CommunityLeaderboardCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Community Leaderboard</CardTitle>
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {communityLeaderboard.slice(0, 3).map((user, index) => (
            <motion.div 
              key={user.name}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'
                }`}>
                  {index + 1}
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {Array.from({ length: Math.min(3, Math.floor(user.badges / 3)) }).map((_, i) => (
                    <div 
                      key={i} 
                      className="h-4 w-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center -ml-1 first:ml-0 border border-white dark:border-slate-800"
                    >
                      <Star className="h-2.5 w-2.5 text-amber-500" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">{user.points} pts</span>
              </div>
            </motion.div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">View All Rankings</Button>
      </CardContent>
    </Card>
  );
};

// Floating Action Button
const FloatingActionButton = () => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-10"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <Button 
        className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg hover:shadow-xl"
        aria-label="Add Vehicle"
      >
        <PlusCircle className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};

const VehicleVault = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicleData[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('cars');
  const { toast } = useToast();
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.3]);
  const mainContentScale = useSpring(
    useTransform(scrollY, [0, 100], [1, 0.98]), 
    { stiffness: 300, damping: 30 }
  );
  
  // Filter vehicles by category
  const getFilteredVehicles = () => {
    if (selectedCategory === 'two-wheelers') {
      return vehicleData.filter(v => v.vehicle.includes('TVS') || v.vehicle.includes('Royal Enfield'));
    } else if (selectedCategory === 'cars') {
      return vehicleData.filter(v => v.vehicle.includes('Tata') || v.vehicle.includes('Honda') || v.vehicle.includes('Mahindra'));
    } else if (selectedCategory === 'commercial') {
      return vehicleData.filter(v => v.vehicle.includes('Mahindra') || v.vehicle.includes('XUV'));
    } else if (selectedCategory === 'three-wheelers') {
      // No three-wheelers in our data, so return an empty array
      return [];
    }
    return vehicleData;
  };
  
  const filteredVehicles = getFilteredVehicles();
  
  const handleVehicleSelect = (vehicle: typeof vehicleData[0]) => {
    setSelectedVehicle(vehicle);
    toast({
      title: `${vehicle.vehicle} selected`,
      description: "Vehicle details loaded successfully",
    });
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedVehicle(null);
  };
  
  return (
    <>
      <div className="relative">
        <ParticleBg />
        <div className="relative z-10">
          {selectedVehicle && (
            <ColorAdaptiveUI vehicleType={selectedVehicle.vehicle}>
              <div className="absolute inset-0 pointer-events-none z-[-1] opacity-30">
                <div className="w-full h-full bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10" />
              </div>
            </ColorAdaptiveUI>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Your Vehicles
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  View and manage your entire vehicle fleet
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Vehicle
              </Button>
            </div>
          </motion.div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div
            style={{ opacity: headerOpacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm mb-4 overflow-x-auto">
              <div className="flex space-x-3 min-w-max">
                <Badge variant="outline" className="py-2 px-3 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1.5 cursor-pointer">
                  <Car className="h-3.5 w-3.5" />
                  Active
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 flex items-center gap-1.5 cursor-pointer">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Recently Purchased
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 flex items-center gap-1.5 cursor-pointer">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Pre-owned
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 flex items-center gap-1.5 cursor-pointer">
                  <Wrench className="h-3.5 w-3.5" />
                  In Maintenance
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 flex items-center gap-1.5 cursor-pointer">
                  <Warehouse className="h-3.5 w-3.5" />
                  Garage Stored
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/40 dark:text-slate-400 flex items-center gap-1.5 cursor-pointer">
                  <AlertOctagon className="h-3.5 w-3.5" />
                  Out of Service
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 flex items-center gap-1.5 cursor-pointer">
                  <Building2 className="h-3.5 w-3.5" />
                  Commercial Fleet
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 flex items-center gap-1.5 cursor-pointer">
                  <KeyRound className="h-3.5 w-3.5" />
                  Leased Out
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400 flex items-center gap-1.5 cursor-pointer">
                  <Tag className="h-3.5 w-3.5" />
                  For Sale
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 flex items-center gap-1.5 cursor-pointer">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Sold
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 flex items-center gap-1.5 cursor-pointer">
                  <Shield className="h-3.5 w-3.5" />
                  Impounded
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 flex items-center gap-1.5 cursor-pointer">
                  <Scale className="h-3.5 w-3.5" />
                  Under Legal Hold
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-1.5 cursor-pointer">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Stolen
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800/40 dark:text-gray-400 flex items-center gap-1.5 cursor-pointer">
                  <Trash2 className="h-3.5 w-3.5" />
                  Scrapped
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:bg-stone-800/40 dark:text-stone-400 flex items-center gap-1.5 cursor-pointer">
                  <FileX className="h-3.5 w-3.5" />
                  Totaled
                </Badge>
              </div>
            </div>
            
            <TabsList className="grid grid-cols-2 w-fit p-1">
              <TabsTrigger value="vehicles" className="px-4 py-2 text-sm flex gap-2 items-center">
                <Car className="h-4 w-4" />
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="documents" className="px-4 py-2 text-sm flex gap-2 items-center">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>
          </motion.div>
        
          <TabsContent value="vehicles" className="m-0">
            <TabTransition isActive={activeTab === 'vehicles'}>
              <Card className="mt-0">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Your Vehicles</CardTitle>
                      <CardDescription>View and manage your entire vehicle fleet</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <PlusCircle className="h-4 w-4" />
                      Add Vehicle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-6">
                    {/* Vehicle category selector */}
                    <div className="mb-6">
                      <VehicleCategorySelector 
                        selectedCategory={selectedCategory}
                        onCategorySelect={handleCategorySelect}
                      />
                    </div>
                    
                    {/* Vehicle Dashboard Cards */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        Vehicle Dashboard
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <VehicleDashboardCard 
                          vehicle="Honda City"
                          registrationNumber="MH02AB1234"
                          fuelType="petrol"
                          serviceStatus="up_to_date"
                          healthPercentage={92}
                          lastUpdated={new Date(Date.now() - 3 * 60 * 60 * 1000)} // 3 hours ago
                          status="Active"
                        />
                        <VehicleDashboardCard 
                          vehicle="Hyundai Creta"
                          registrationNumber="KA01MJ5678"
                          fuelType="diesel"
                          serviceStatus="due"
                          healthPercentage={75}
                          lastUpdated={new Date(Date.now() - 24 * 60 * 60 * 1000)} // 1 day ago
                          status="Commercial Fleet"
                        />
                        <VehicleDashboardCard 
                          vehicle="Maruti Swift"
                          registrationNumber="DL7CX9012"
                          fuelType="petrol"
                          serviceStatus="up_to_date"
                          healthPercentage={95}
                          lastUpdated={new Date(Date.now() - 5 * 60 * 60 * 1000)} // 5 hours ago
                          status="Recently Purchased"
                        />
                      </div>
                    </div>
                    
                    {/* Vehicle carousel section */}
                    <VehicleCarousel 
                      vehicles={filteredVehicles} 
                      onVehicleSelect={handleVehicleSelect}
                    />
                    
                    {/* Selected vehicle analysis */}
                    {selectedVehicle && (
                      <div className="mt-8">
                        <div className="mb-4 flex justify-between items-center">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-1.5 rounded-lg shadow-md">
                              <Activity className="h-4 w-4" />
                            </div>
                            Vehicle Analysis
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400">
                              Active
                            </Badge>
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline"
                              size="sm" 
                              className="text-xs gap-1 rounded-full border-slate-300"
                            >
                              <Share className="h-3.5 w-3.5" />
                              Share
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="text-xs gap-1 bg-red-500 hover:bg-red-600"
                            >
                              <span className="font-medium">₹</span>
                              Sell Vehicle
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs gap-1 rounded-full" 
                              onClick={() => setSelectedVehicle(null)}
                            >
                              <X className="h-3.5 w-3.5" />
                              Close
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                            <VehicleDetailAnalysis vehicle={selectedVehicle} />
                          </div>
                          <div>
                            <VehicleMoodIndicator vehicle={selectedVehicle} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabTransition>
          </TabsContent>
          
          <TabsContent value="documents" className="m-0">
            <TabTransition isActive={activeTab === 'documents'}>
              <Card className="mt-0">
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl">Vehicle Documents</CardTitle>
                  <CardDescription>All your important vehicle documents in one place</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center p-12 text-gray-500">
                    Vehicle documents section will be available here.
                  </div>
                </CardContent>
              </Card>
            </TabTransition>
          </TabsContent>
          
          <TabsContent value="service-history" className="m-0">
            <TabTransition isActive={activeTab === 'service-history'}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="mt-0">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-xl">Service History</CardTitle>
                      <CardDescription>Complete history of all your vehicle services</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-center p-12 text-gray-500">
                        Service history records will be displayed here.
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabTransition>
          </TabsContent>
          
          <TabsContent value="health" className="m-0">
            <TabTransition isActive={activeTab === 'health'}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="mt-0 h-full">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-xl">Vehicle Health & Value Analysis</CardTitle>
                      <CardDescription>Interactive visualization of your vehicles' health and current market value</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <VehicleWorthVisual />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">AI Insights</CardTitle>
                        <Brain className="h-5 w-5 text-purple-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <PredictiveMaintenance />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Recommended Actions</CardTitle>
                        <Settings className="h-5 w-5 text-blue-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                          Schedule Honda City service
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          Update insurance documents
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  AI-Generated Vehicle Stories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(vehicleStories).map(([vehicle, story]) => (
                    <VehicleStoryCard key={vehicle} vehicle={vehicle} story={story} />
                  ))}
                </div>
              </div>
            </TabTransition>
          </TabsContent>
          
          <TabsContent value="community" className="m-0">
            <TabTransition isActive={activeTab === 'community'}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="mt-0">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-xl">Community Knowledge Base</CardTitle>
                      <CardDescription>Learn from other owners and share your experience</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CommunityIntegration />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <CommunityLeaderboardCard />
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Your Engagement</CardTitle>
                        <Users className="h-5 w-5 text-indigo-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Contributions</span>
                          <span className="font-semibold">14</span>
                        </div>
                        <Progress value={46} className="h-1.5" />
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-slate-500">Badges Earned</span>
                          <span className="font-semibold">3</span>
                        </div>
                        <Progress value={37} className="h-1.5" />
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-slate-500">Reputation Points</span>
                          <span className="font-semibold">850</span>
                        </div>
                        <Progress value={28} className="h-1.5" />
                      </div>
                      
                      <div className="mt-6">
                        <Button variant="outline" size="sm" className="w-full">View Your Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabTransition>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
};

export default VehicleVault;