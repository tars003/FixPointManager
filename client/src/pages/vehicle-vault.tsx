import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityIntegration from '@/components/service-booking/community-integration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
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
  Building2, KeyRound, Tag, CheckCircle, Scale, Trash2, FileX,
  Plus, Edit, Eye, Calendar as CalendarIcon, Clock as CalendarClock,
  Smartphone as SmartphoneNfc, Receipt, CalendarCheck,
  Fuel, Route, User as UserCircle, UserCog, CreditCard, Truck,
  Filter as FilterX, CheckCircle as CheckCircle2, MapPin, HelpCircle as FileQuestion,
  FileCheck
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Import our components
import VehicleCarousel from '@/components/vehicle-vault/VehicleCarousel';
import VehicleDetailAnalysis from '@/components/vehicle-vault/VehicleDetailAnalysis';
import VehicleCategorySelector from '@/components/vehicle-vault/VehicleCategorySelector';
import VehicleMoodIndicator from '@/components/vehicle-vault/VehicleMoodIndicator';
import VehicleStoryCard from '@/components/vehicle-vault/VehicleStoryCard';
import VehicleDashboardCard from '@/components/vehicle-vault/VehicleDashboardCard';
import ColorAdaptiveUI from '@/components/vehicle-vault/ColorAdaptiveUI';

// Define Vehicle type to match our vehicleData props
type Vehicle = {
  id: number;
  vehicle: string;
  worth: number; 
  percentage: number;
  image: string;
  mileage: number;
  fuelType: string;
  batteryHealth?: number;
  engineHealth?: number;
  lastService: string;
  nextService: string;
  purchaseDate: string;
  insuranceValid: string;
  maintenanceCost: number;
  efficiency: string;
  averageCharge?: string;
  averageFuel?: string;
  range?: string;
  carbonOffset?: string;
  topSpeed?: string;
  emissionRating?: string;
  registrationNumber: string;
  chassisNumber: string;
  engineNumber: string;
  owner: string;
  rcExpiryDate: string;
};

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
    carbonOffset: '2.4 tonnes',
    registrationNumber: 'MH 01 AB 1234',
    chassisNumber: 'TNEJ3498323CNEX',
    engineNumber: 'EV77123NX',
    owner: 'Raj Kumar',
    rcExpiryDate: 'May 15, 2028'
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
    emissionRating: 'BS6',
    registrationNumber: 'DL 8C AB 3921',
    chassisNumber: 'HONC4723984CTY',
    engineNumber: 'PE239874HC',
    owner: 'Anjali Singh',
    rcExpiryDate: 'Jul 20, 2029'
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
    carbonOffset: '0.3 tonnes',
    registrationNumber: 'KA 01 MJ 9023',
    chassisNumber: 'TVS23487234IQB',
    engineNumber: 'ETV98712',
    owner: 'Sunil Patel',
    rcExpiryDate: 'Aug 04, 2028'
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
    emissionRating: 'BS6',
    registrationNumber: 'UP 32 BT 5687',
    chassisNumber: 'MHXXUV7002384753',
    engineNumber: 'DZ15893XUV',
    owner: 'Vikram Rathore',
    rcExpiryDate: 'Jan 09, 2033'
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
    emissionRating: 'BS6',
    registrationNumber: 'TN 75 AQ 4523',
    chassisNumber: 'RE350CL23784952',
    engineNumber: 'CL35089234',
    owner: 'Karthik Narayanan',
    rcExpiryDate: 'Mar 17, 2031'
  },
  // Recently Purchased Vehicles
  { 
    id: 6,
    vehicle: 'Bajaj Chetak Electric', 
    worth: 142000, 
    percentage: 98,
    image: 'https://bd.gaadicdn.com/processedimages/bajaj/chetak-2019/source/chetak-201962ebba5fc1e52.jpg',
    mileage: 120,
    fuelType: 'Electric',
    batteryHealth: 100,
    lastService: 'None',
    nextService: '3 months',
    purchaseDate: 'Apr 10, 2025', // Recently purchased (current date is April 2025)
    insuranceValid: 'Apr 2028',
    maintenanceCost: 0,
    efficiency: '99%',
    averageCharge: '2.1 kWh',
    range: '95 km',
    carbonOffset: '0.1 tonnes',
    registrationNumber: 'Registration in progress',
    chassisNumber: 'BCH20250410TRE',
    engineNumber: 'ECH25041078',
    owner: 'Divya Sharma',
    rcExpiryDate: 'Pending'
  },
  { 
    id: 7,
    vehicle: 'Piaggio Ape E-City', 
    worth: 335000, 
    percentage: 99,
    image: 'https://bd.gaadicdn.com/processedimages/piaggio/ape-e-city/source/ape-e-city625906a6aefa9.jpg',
    mileage: 240,
    fuelType: 'Electric',
    batteryHealth: 100,
    lastService: 'None',
    nextService: '6 months',
    purchaseDate: 'Mar 22, 2025', // Recently purchased
    insuranceValid: 'Mar 2028',
    maintenanceCost: 0,
    efficiency: '97%',
    averageCharge: '4.5 kWh',
    range: '110 km',
    carbonOffset: '0.3 tonnes',
    registrationNumber: 'DL 02 CD 3456',
    chassisNumber: 'PIAE250322CIT',
    engineNumber: 'API2503223WE',
    owner: 'Rakesh Patel Transport',
    rcExpiryDate: 'Mar 21, 2035'
  },
  { 
    id: 8,
    vehicle: 'Skoda Slavia', 
    worth: 1250000, 
    percentage: 97,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Skoda/Slavia/9218/1645698138797/front-left-side-47.jpg',
    mileage: 350,
    fuelType: 'Petrol',
    engineHealth: 100,
    lastService: 'PDI Completed',
    nextService: '6 months',
    purchaseDate: 'Feb 15, 2025', // Recently purchased
    insuranceValid: 'Feb 2028',
    maintenanceCost: 0,
    efficiency: '18.0 km/l',
    averageFuel: '5.5 l/100km',
    topSpeed: '195 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'MH 12 FG 7654',
    chassisNumber: 'SKSL2502155HT',
    engineNumber: 'SL25021512YG',
    owner: 'Arjun Menon',
    rcExpiryDate: 'Feb 14, 2035'
  },
  { 
    id: 9,
    vehicle: 'Tata Intra V50', 
    worth: 820000, 
    percentage: 99,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Intra-V50/7376/1684224761578/front-left-side-47.jpg',
    mileage: 185,
    fuelType: 'Diesel',
    engineHealth: 100,
    lastService: 'PDI Completed',
    nextService: '3 months',
    purchaseDate: 'Mar 30, 2025', // Recently purchased
    insuranceValid: 'Mar 2028',
    maintenanceCost: 0,
    efficiency: '19.3 km/l',
    averageFuel: '5.2 l/100km',
    topSpeed: '110 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'GJ 01 XY 9087',
    chassisNumber: 'TINTV250330CM',
    engineNumber: 'INV25033089T',
    owner: 'Krishna Logistics Ltd',
    rcExpiryDate: 'Mar 29, 2035'
  },
  { 
    id: 10,
    vehicle: 'Ashok Leyland Partner', 
    worth: 1750000, 
    percentage: 100,
    image: 'https://5.imimg.com/data5/ANDROID/Default/2020/10/WK/PJ/CF/15239911/product-jpeg-500x500.jpg',
    mileage: 90,
    fuelType: 'Diesel',
    engineHealth: 100,
    lastService: 'None',
    nextService: '3 months',
    purchaseDate: 'Apr 02, 2025', // Recently purchased
    insuranceValid: 'Apr 2028',
    maintenanceCost: 0,
    efficiency: '10.5 km/l',
    averageFuel: '9.5 l/100km',
    topSpeed: '90 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'Registration in progress',
    chassisNumber: 'ALPT25040258K',
    engineNumber: 'APT2504029XZ',
    owner: 'Fast Delivery Services',
    rcExpiryDate: 'Pending'
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
  const [selectedStatus, setSelectedStatus] = useState<string | null>('Active');
  const [selectedDocumentVehicle, setSelectedDocumentVehicle] = useState<typeof vehicleData[0] | null>(null);
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
  
  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setActiveTab('documents');
    toast({
      title: `${status} Vehicles Selected`,
      description: `Viewing documents for ${status} vehicles`,
    });
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
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Active' ? 'ring-2 ring-green-500 dark:ring-green-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Active')}
                >
                  <Car className="h-3.5 w-3.5" />
                  Active
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Recently Purchased' ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Recently Purchased')}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Recently Purchased
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Pre-owned' ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Pre-owned')}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Pre-owned
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'In Maintenance' ? 'ring-2 ring-amber-500 dark:ring-amber-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('In Maintenance')}
                >
                  <Wrench className="h-3.5 w-3.5" />
                  In Maintenance
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Garage Stored' ? 'ring-2 ring-sky-500 dark:ring-sky-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Garage Stored')}
                >
                  <Warehouse className="h-3.5 w-3.5" />
                  Garage Stored
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/40 dark:text-slate-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Out of Service' ? 'ring-2 ring-slate-500 dark:ring-slate-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Out of Service')}
                >
                  <AlertOctagon className="h-3.5 w-3.5" />
                  Out of Service
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Commercial Fleet' ? 'ring-2 ring-purple-500 dark:ring-purple-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Commercial Fleet')}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  Commercial Fleet
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Leased Out' ? 'ring-2 ring-emerald-500 dark:ring-emerald-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Leased Out')}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Leased Out
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'For Sale' ? 'ring-2 ring-pink-500 dark:ring-pink-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('For Sale')}
                >
                  <Tag className="h-3.5 w-3.5" />
                  For Sale
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Sold' ? 'ring-2 ring-violet-500 dark:ring-violet-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Sold')}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Sold
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Impounded' ? 'ring-2 ring-rose-500 dark:ring-rose-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Impounded')}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Impounded
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Under Legal Hold' ? 'ring-2 ring-yellow-500 dark:ring-yellow-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Under Legal Hold')}
                >
                  <Scale className="h-3.5 w-3.5" />
                  Under Legal Hold
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Stolen' ? 'ring-2 ring-red-500 dark:ring-red-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Stolen')}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Stolen
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800/40 dark:text-gray-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Scrapped' ? 'ring-2 ring-gray-500 dark:ring-gray-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Scrapped')}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Scrapped
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:bg-stone-800/40 dark:text-stone-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Totaled' ? 'ring-2 ring-stone-500 dark:ring-stone-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Totaled')}
                >
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
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {selectedStatus === 'Active' && <div className="h-3 w-3 rounded-full bg-green-500"></div>}
                        {selectedStatus === 'Recently Purchased' && <div className="h-3 w-3 rounded-full bg-blue-500"></div>}
                        {selectedStatus === 'Pre-owned' && <div className="h-3 w-3 rounded-full bg-indigo-500"></div>}
                        {selectedStatus === 'In Maintenance' && <div className="h-3 w-3 rounded-full bg-amber-500"></div>}
                        {selectedStatus === 'Garage Stored' && <div className="h-3 w-3 rounded-full bg-sky-500"></div>}
                        {selectedStatus === 'Out of Service' && <div className="h-3 w-3 rounded-full bg-slate-500"></div>}
                        {selectedStatus === 'Commercial Fleet' && <div className="h-3 w-3 rounded-full bg-purple-500"></div>}
                        {selectedStatus === 'Leased Out' && <div className="h-3 w-3 rounded-full bg-emerald-500"></div>}
                        {selectedStatus === 'For Sale' && <div className="h-3 w-3 rounded-full bg-pink-500"></div>}
                        {selectedStatus === 'Sold' && <div className="h-3 w-3 rounded-full bg-violet-500"></div>}
                        {selectedStatus === 'Impounded' && <div className="h-3 w-3 rounded-full bg-rose-500"></div>}
                        {selectedStatus === 'Under Legal Hold' && <div className="h-3 w-3 rounded-full bg-yellow-500"></div>}
                        {selectedStatus === 'Stolen' && <div className="h-3 w-3 rounded-full bg-red-500"></div>}
                        {selectedStatus === 'Scrapped' && <div className="h-3 w-3 rounded-full bg-gray-500"></div>}
                        {selectedStatus === 'Totaled' && <div className="h-3 w-3 rounded-full bg-stone-500"></div>}
                        {selectedStatus} Vehicle Documents
                      </CardTitle>
                      <CardDescription>Manage all your important vehicle documents in one place</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        Export All
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Add Document
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {selectedStatus === 'Active' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-center mb-4">Select a Vehicle to View Documents</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData.map((vehicle) => (
                              <Card 
                                key={vehicle.id} 
                                className={`cursor-pointer transition-all hover:shadow-md ${selectedDocumentVehicle?.id === vehicle.id ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                                onClick={() => setSelectedDocumentVehicle(vehicle)}
                              >
                                <CardContent className="p-4">
                                  <div className="aspect-video w-full overflow-hidden rounded-md mb-3">
                                    <img 
                                      src={vehicle.image} 
                                      alt={vehicle.vehicle} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="font-semibold">{vehicle.vehicle}</h4>
                                    <p className="text-xs text-slate-500">{vehicle.registrationNumber || "No registration"}</p>
                                    <div className="flex justify-between items-center">
                                      <Badge variant="outline" className="text-xs px-2 py-0">
                                        {vehicle.fuelType}
                                      </Badge>
                                      <p className="text-xs text-slate-500">Owner: {vehicle.owner || "Unknown"}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // Vehicle Documents Display State
                        <div className="space-y-6">
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={selectedDocumentVehicle.image} />
                                <AvatarFallback>{selectedDocumentVehicle.vehicle.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{selectedDocumentVehicle.vehicle}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-500">{selectedDocumentVehicle.registrationNumber || "No registration"}</p>
                                  <Badge variant="outline" className="text-xs">{selectedDocumentVehicle.fuelType}</Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedDocumentVehicle(null)}
                            >
                              Change Vehicle
                            </Button>
                          </div>
                          
                          {/* Vehicle Registration Certificate */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            Vehicle Registration Certificate (RC)
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Original RC book/card</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                View Original RC
                              </Button>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Digital Copy</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <SmartphoneNfc className="h-4 w-4 mr-2 text-green-500" />
                                Access Digital RC
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <h4 className="text-sm font-medium mb-2">Renewal Information</h4>
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarClock className="h-4 w-4 text-amber-500" />
                              <span>Renewal due in <strong>245 days</strong> (12/01/2026)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-3">
                            <span className="text-sm text-gray-500">Last Updated: 05/15/2024</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              Valid
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Insurance Documentation */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Shield className="h-5 w-5 text-violet-500" />
                            Insurance Documentation
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Policy Documents</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <FileText className="h-4 w-4 mr-2 text-violet-500" />
                                View Policy Details
                              </Button>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Premium Payment</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <Receipt className="h-4 w-4 mr-2 text-amber-500" />
                                View Payment Receipts
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <h4 className="text-sm font-medium mb-2">No-Claim Bonus</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">Current NCB: <strong>25%</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarClock className="h-4 w-4 text-amber-500" />
                              <span>Renewal due in <strong>123 days</strong> (08/31/2025)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-3">
                            <span className="text-sm text-gray-500">Last Updated: 07/22/2024</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              Valid
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Pollution Control Certificate */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-green-500" />
                            Pollution Control Certificate
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Certificate</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <FileText className="h-4 w-4 mr-2 text-green-500" />
                                View Certificate
                              </Button>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Testing Center</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                View Testing Location
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <h4 className="text-sm font-medium mb-2">Emission Test Results</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Status: <strong>Within Permissible Limits</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarClock className="h-4 w-4 text-amber-500" />
                              <span>Renewal due in <strong>45 days</strong> (06/15/2025)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-3">
                            <span className="text-sm text-gray-500">Last Updated: 12/15/2024</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              Valid
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tax Documentation */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-amber-500" />
                            Tax Documentation
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Road Tax Receipt</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <Receipt className="h-4 w-4 mr-2 text-amber-500" />
                                View Tax Receipt
                              </Button>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tax Validity</span>
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarCheck className="h-4 w-4 text-blue-500" />
                                <span>Valid until <strong>12/31/2027</strong></span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-3">
                            <span className="text-sm text-gray-500">Last Updated: 01/05/2025</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              Paid
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Service Records */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-blue-500" />
                            Service Records
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <Wrench className="h-4 w-4 text-blue-500" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Regular Service</h4>
                                  <p className="text-xs text-gray-500">March 10, 2025</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                  <FilterX className="h-4 w-4 text-amber-500" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Oil Change</h4>
                                  <p className="text-xs text-gray-500">January 15, 2025</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Complete Service</h4>
                                  <p className="text-xs text-gray-500">October 5, 2024</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium">Upcoming Service</h4>
                              <Button variant="outline" size="sm" className="h-7">
                                Schedule
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarClock className="h-4 w-4 text-amber-500" />
                              <span>Next service due in <strong>4500 km</strong> or <strong>4 months</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Vehicle Performance Logs */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-500" />
                            Vehicle Performance Logs
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-3">
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                                <Fuel className="h-4 w-4 text-amber-500" />
                                Fuel Efficiency
                              </h4>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold">17.5 km/l</span>
                                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                  +2.1%
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-3">
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                                <Route className="h-4 w-4 text-blue-500" />
                                Trip History
                              </h4>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold">2,345 km</span>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                  View Trips
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <h4 className="text-sm font-medium mb-3">Performance Overview</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between items-center mb-1 text-xs">
                                  <span>Engine Health</span>
                                  <span className="font-medium">92%</span>
                                </div>
                                <Progress value={92} className="h-1.5" />
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1 text-xs">
                                  <span>Battery Condition</span>
                                  <span className="font-medium">87%</span>
                                </div>
                                <Progress value={87} className="h-1.5" />
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1 text-xs">
                                  <span>Brake Wear</span>
                                  <span className="font-medium">22%</span>
                                </div>
                                <Progress value={22} className="h-1.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Driver Information */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            Driver Information
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                                RK
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">Rahul Kumar</h4>
                              <p className="text-sm text-gray-500">Primary Driver</p>
                            </div>
                            <Button variant="ghost" size="sm" className="ml-auto">
                              <UserCog className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">License Details</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-blue-500" />
                                  <span>MH-1420110012345</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CalendarCheck className="h-4 w-4 text-green-500" />
                                  <span>Valid until: <strong>06/12/2029</strong></span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Authorization</h4>
                              <div className="space-y-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  Authorized
                                </Badge>
                                <div className="flex">
                                  <Button variant="outline" size="sm" className="text-xs h-7">
                                    <Plus className="h-3.5 w-3.5 mr-1" />
                                    Add Driver
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {selectedStatus === 'Recently Purchased' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State for Recently Purchased
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-center mb-4 text-blue-700 dark:text-blue-400">Select a Recently Purchased Vehicle</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData
                              .slice(5, 10) // The recently purchased vehicles (IDs 6-10)
                              .map((vehicle) => (
                                <Card 
                                  key={vehicle.id} 
                                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${selectedDocumentVehicle?.id === vehicle.id ? 'border-blue-500 dark:border-blue-400' : 'border-transparent'}`}
                                  onClick={() => setSelectedDocumentVehicle(vehicle)}
                                >
                                  <CardContent className="p-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-md mb-3 relative">
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.vehicle} 
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                        New
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-semibold">{vehicle.vehicle}</h4>
                                      <p className="text-xs text-slate-500">{vehicle.registrationNumber || "Registration in progress"}</p>
                                      <div className="flex justify-between items-center">
                                        <Badge variant="outline" className="text-xs px-2 py-0 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                          {vehicle.fuelType}
                                        </Badge>
                                        <p className="text-xs text-slate-500">Purchased: {vehicle.purchaseDate}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ) : (
                        // Recently Purchased Vehicle Documents Display
                        <div className="space-y-6">
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={selectedDocumentVehicle.image} />
                                <AvatarFallback>{selectedDocumentVehicle.vehicle.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{selectedDocumentVehicle.vehicle}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-500">{selectedDocumentVehicle.registrationNumber || "Registration in progress"}</p>
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">Recently Purchased</Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedDocumentVehicle(null)}
                              className="text-blue-700 dark:text-blue-400"
                            >
                              Change Vehicle
                            </Button>
                          </div>
                          
                          {/* Purchase Documentation */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <ShoppingBag className="h-5 w-5" />
                                Purchase Documentation
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sales Invoice</h4>
                                  <p className="text-xs text-gray-500">Itemized breakdown with all costs</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                    Upload Invoice
                                  </Button>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Receipt</h4>
                                  <p className="text-xs text-gray-500">PDI (Pre-Delivery Inspection) details</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <Truck className="h-4 w-4 mr-2 text-green-500" />
                                    Upload Receipt
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                <h4 className="text-sm font-medium mb-2">Post-purchase Checklist</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="check1" checked={true} />
                                    <label htmlFor="check1" className="text-sm">Sales invoice received</label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="check2" checked={true} />
                                    <label htmlFor="check2" className="text-sm">Delivery receipt signed</label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="check3" checked={false} />
                                    <label htmlFor="check3" className="text-sm">Registration process initiated</label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="check4" checked={false} />
                                    <label htmlFor="check4" className="text-sm">Warranty activated</label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="check5" checked={false} />
                                    <label htmlFor="check5" className="text-sm">First service scheduled</label>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                                <div className="flex items-center gap-2">
                                  <CalendarClock className="h-4 w-4 text-amber-500" />
                                  <span className="text-sm">Transition to "Active" in <strong>45 days</strong></span>
                                </div>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                  In Progress
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {/* Ownership Transfer */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <RefreshCw className="h-5 w-5" />
                                Ownership Transfer
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Transfer Documents</h4>
                                  <p className="text-xs text-gray-500">Form 29/30 and related papers</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                                    Upload Forms
                                  </Button>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Previous Owner's NOC</h4>
                                  <p className="text-xs text-gray-500">No Objection Certificate</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                                    Upload NOC
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Financing/Loan Details */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <CreditCard className="h-5 w-5" />
                                Financing/Loan Details
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan Agreement</h4>
                                  <p className="text-xs text-gray-500">Terms and conditions document</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileText className="h-4 w-4 mr-2 text-amber-500" />
                                    Upload Agreement
                                  </Button>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">EMI Schedule</h4>
                                  <p className="text-xs text-gray-500">Payment tracking document</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <Calendar className="h-4 w-4 mr-2 text-violet-500" />
                                    Upload Schedule
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Warranty Information */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6">
                            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <Shield className="h-5 w-5" />
                                Warranty Information
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Manufacturer Warranty</h4>
                                  <p className="text-xs text-gray-500">Coverage details and terms</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileText className="h-4 w-4 mr-2 text-green-500" />
                                    Upload Certificate
                                  </Button>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Extended Warranty</h4>
                                  <p className="text-xs text-gray-500">Additional coverage purchased</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                                    Upload Details
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-lg">
                                <div className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  <span>Warranty active until: <strong>Jan 2028</strong></span>
                                </div>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                  Active
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {/* Initial Vehicle Documentation */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6">
                            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <FileText className="h-5 w-5" />
                                Initial Vehicle Documentation
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">VIN Details</h4>
                                  <p className="text-xs text-gray-500">Vehicle identification number information</p>
                                  <p className="text-xs font-medium mt-1 text-slate-700 dark:text-slate-300">{selectedDocumentVehicle.chassisNumber}</p>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Engine/Chassis Numbers</h4>
                                  <p className="text-xs text-gray-500">Core vehicle identifiers</p>
                                  <p className="text-xs font-medium mt-1 text-slate-700 dark:text-slate-300">Engine: {selectedDocumentVehicle.engineNumber}</p>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Color & Variant</h4>
                                  <p className="text-xs text-gray-500">Vehicle specifications</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileText className="h-4 w-4 mr-2 text-amber-500" />
                                    Upload Specs
                                  </Button>
                                </div>
                              </div>
                              
                              <Separator className="my-2" />
                              
                              <div className="mt-2">
                                <h4 className="text-sm font-medium mb-2">Vehicle Feature Documentation</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                    Owner's Manual
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-purple-500" />
                                    Service Schedule
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-emerald-500" />
                                    Feature Guide
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-amber-500" />
                                    Accessory Catalog
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-lg mt-4">
                                <div className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                  <CalendarCheck className="h-4 w-4" />
                                  <span>First service scheduled for: <strong>Feb 15, 2025</strong></span>
                                </div>
                                <Button variant="outline" size="sm" className="h-8 bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400">
                                  Reschedule
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 justify-end mt-6">
                            <Button variant="outline" className="gap-2">
                              <Download className="h-4 w-4" />
                              Export All Documents
                            </Button>
                            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                              <CheckCircle className="h-4 w-4" />
                              Complete Setup
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {selectedStatus !== 'Active' && selectedStatus !== 'Recently Purchased' && (
                    <div className="text-center py-12">
                      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <FileQuestion className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Documents Setup</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                        Documents for {selectedStatus} vehicles have not been configured yet. Click below to set up document management for this category.
                      </p>
                      <Button variant="default">
                        <Plus className="h-4 w-4 mr-2" />
                        Set Up Documents
                      </Button>
                    </div>
                  )}
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