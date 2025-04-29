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
  AlertTriangle, Activity, Info, Zap, BadgeCheck, Wrench
} from 'lucide-react';

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
  'TVS iQube': "The TVS iQube, your newest addition from 8 months ago, has transformed your daily commute. With 1,200 km on the odometer, it's already saved you 30 hours in traffic and reduced your monthly transportation budget by 35%. Its charging efficiency remains at factory optimal levels."
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
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-bold">Total Portfolio Value</h3>
          <p className="text-sm text-gray-600">Current estimated market value</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            ₹{totalWorth.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
      
      <div className="space-y-5 mt-6">
        {vehicleWorthData.map((vehicle, index) => (
          <div key={vehicle.vehicle} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-slate-600" />
                <span className="font-medium">{vehicle.vehicle}</span>
              </div>
              <span className="font-semibold">₹{vehicle.worth.toLocaleString('en-IN')}</span>
            </div>
            <Progress value={progress[index]} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

const VehicleStoryCard = ({ vehicle, story }: { vehicle: string; story: string }) => {
  // Define different patterns for different vehicles
  const patterns = {
    'Tata Nexon EV': {
      gradient: 'from-blue-500/5 via-cyan-500/5 to-green-500/5',
      headerGradient: 'from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20',
      accent: 'bg-gradient-to-r from-blue-500 to-teal-500',
      icon: <motion.div 
              className="relative"
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="h-5 w-5 text-blue-500" />
              <motion.div 
                className="absolute inset-0 rounded-full bg-blue-400/20" 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    'Honda City': {
      gradient: 'from-indigo-500/5 via-purple-500/5 to-pink-500/5',
      headerGradient: 'from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20',
      accent: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      icon: <motion.div 
              className="relative"
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="h-5 w-5 text-purple-500" />
              <motion.div 
                className="absolute inset-0 rounded-full bg-purple-400/20" 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>,
      iconBg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    'TVS iQube': {
      gradient: 'from-amber-500/5 via-orange-500/5 to-red-500/5',
      headerGradient: 'from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20',
      accent: 'bg-gradient-to-r from-amber-500 to-orange-500',
      icon: <motion.div 
              className="relative"
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="h-5 w-5 text-orange-500" />
              <motion.div 
                className="absolute inset-0 rounded-full bg-orange-400/20" 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>,
      iconBg: 'bg-orange-100 dark:bg-orange-900/30'
    }
  };

  // Use type assertion to handle the TypeScript error
  const pattern = (patterns as any)[vehicle] || patterns['Tata Nexon EV'];

  return (
    <motion.div 
      className="h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`overflow-hidden border-0 shadow-lg bg-gradient-to-br ${pattern.gradient} backdrop-blur-sm h-full transform transition-all duration-300 hover:shadow-xl`}>
        <CardHeader className={`pb-2 bg-gradient-to-r ${pattern.headerGradient}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`rounded-full p-2 ${pattern.iconBg}`}>
                {pattern.icon}
              </div>
              <div>
                <CardTitle className="text-lg font-bold">{vehicle}</CardTitle>
                <CardDescription className="text-xs">AI-generated vehicle story</CardDescription>
              </div>
            </div>
            <div className={`h-8 w-8 rounded-full ${pattern.accent} flex items-center justify-center`}>
              <Car className="h-4 w-4 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 relative">
          <div className="absolute top-0 right-0 opacity-5">
            <Car className="h-32 w-32 text-slate-800 dark:text-white" />
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed relative z-10 font-medium">
            {story}
          </p>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <Button variant="ghost" size="sm" className="text-xs">
            <FileText className="h-3.5 w-3.5 mr-1" />
            Save to Memory
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Share className="h-3.5 w-3.5 mr-1" />
            Share Story
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const CommunityLeaderboardCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">Community Leaderboard</CardTitle>
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
        <CardDescription>Top contributors this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {communityLeaderboard.map((user, index) => (
            <div key={user.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                  ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-700' : 'bg-slate-600'}`}>
                  {index + 1}
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-sm">
                  <BookOpen className="h-3.5 w-3.5 mr-1 text-blue-500" />
                  <span>{user.contributions}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Award className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  <span>{user.badges}</span>
                </div>
                <div className="flex items-center text-sm font-semibold">
                  <Star className="h-3.5 w-3.5 mr-1 text-purple-500" />
                  <span>{user.points}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">View Full Leaderboard</Button>
      </CardFooter>
    </Card>
  );
};

const TimelineEvent = ({ icon: Icon, title, date, color, index }: { icon: any; title: string; date: string; color: string; index: number }) => {
  return (
    <motion.div 
      className="flex items-start gap-3 group rounded-lg p-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ x: 5, transition: { duration: 0.2 } }}
    >
      <div className="relative">
        <div className={`rounded-full p-2 ${color} shadow-md z-10 relative`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <motion.div 
          className={`absolute inset-0 rounded-full opacity-40 ${color}`}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2
          }}
        />
      </div>
      <div className="flex-1 backdrop-blur-sm bg-white/20 dark:bg-slate-700/20 p-2 rounded-lg border border-slate-200/40 dark:border-slate-700/40">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">{title}</h4>
          <Badge variant="outline" className="bg-white/60 dark:bg-black/30 text-[10px] h-5 px-2 font-medium">{date}</Badge>
        </div>
        <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m12 16 4-4-4-4"></path>
            <path d="M8 12h8"></path>
          </svg>
          <span>View details</span>
        </div>
      </div>
    </motion.div>
  );
};

const VehicleTimeline = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-1.5 rounded-lg shadow-md">
            <Clock className="h-4 w-4" />
          </div>
          Vehicle Timeline
        </h3>
        <Button variant="outline" size="sm" className="text-xs h-8 gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Show More
        </Button>
      </div>
      
      <div className="relative pl-6 before:absolute before:left-[9px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-amber-500 before:opacity-20 dark:before:opacity-30 space-y-4 overflow-hidden">
        <TimelineEvent 
          icon={Calendar} 
          title="Honda City - Regular Service Completed" 
          date="2 weeks ago" 
          color="bg-green-500" 
          index={0}
        />
        <TimelineEvent 
          icon={Shield} 
          title="Tata Nexon EV - Battery Health Check" 
          date="1 month ago" 
          color="bg-blue-500" 
          index={1}
        />
        <TimelineEvent 
          icon={FileText} 
          title="TVS iQube - Insurance Renewed" 
          date="2 months ago" 
          color="bg-indigo-500" 
          index={2}
        />
        <TimelineEvent 
          icon={Car} 
          title="Tata Nexon EV - Major Service" 
          date="4 months ago" 
          color="bg-purple-500" 
          index={3}
        />
        <TimelineEvent 
          icon={Car} 
          title="TVS iQube - Purchase Date" 
          date="8 months ago" 
          color="bg-amber-500" 
          index={4}
        />
      </div>
    </div>
  );
};

const PredictiveMaintenance = () => {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Brain className="h-5 w-5 text-purple-500" />
        AI Maintenance Predictions
      </h3>
      
      <div className="space-y-3">
        <motion.div 
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start gap-3">
            <div className="bg-red-500 rounded-full p-2 mt-0.5">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-red-700 dark:text-red-400">Honda City - Brake Pads</h4>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">Predicted to require replacement within 30 days based on wear patterns and service history.</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs text-red-600 border-red-200 hover:bg-red-50">
                Schedule Inspection
              </Button>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start gap-3">
            <div className="bg-amber-500 rounded-full p-2 mt-0.5">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-700 dark:text-amber-400">Tata Nexon EV - Battery Check</h4>
              <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">Recommended maintenance in 2 months to maintain optimal charging efficiency.</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs text-amber-600 border-amber-200 hover:bg-amber-50">
                Set Reminder
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Vehicle Carousel Component
const VehicleCarousel = ({ 
  vehicles, 
  onVehicleSelect 
}: { 
  vehicles: typeof vehicleData, 
  onVehicleSelect: (vehicle: typeof vehicleData[0]) => void 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const visibleCount = 3;
  
  // Calculate the total number of slides needed
  const totalSlides = Math.ceil(vehicles.length / visibleCount);
  
  // Implement auto sliding
  useEffect(() => {
    if (!autoSlide) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % totalSlides;
        return nextIndex;
      });
    }, 5000); // Auto slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [vehicles.length, totalSlides, autoSlide]);
  
  // Handle manual navigation
  const handlePrev = () => {
    setAutoSlide(false); // Disable auto-slide when manually navigating
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex === 0 ? totalSlides - 1 : prevIndex - 1;
      return nextIndex;
    });
  };
  
  const handleNext = () => {
    setAutoSlide(false); // Disable auto-slide when manually navigating
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % totalSlides;
      return nextIndex;
    });
  };
  
  // Get current visible vehicles
  const getVisibleVehicles = () => {
    const startIdx = currentIndex * visibleCount;
    const endIdx = Math.min(startIdx + visibleCount, vehicles.length);
    
    // Get a slice of the visible vehicles
    return vehicles.slice(startIdx, endIdx);
  };
  
  const visibleVehicles = getVisibleVehicles();
  
  // Resume auto-slide after 10 seconds of inactivity
  useEffect(() => {
    if (autoSlide) return;
    
    const timeout = setTimeout(() => {
      setAutoSlide(true);
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [autoSlide]);

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-xl">
        <div className="flex space-x-6 p-2">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              className="flex gap-6 w-full"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              {visibleVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  className="flex-1 min-w-0 cursor-pointer"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  onClick={() => onVehicleSelect(vehicle)}
                >
                  <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-700/50 h-full">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.vehicle} 
                        className="object-cover w-full h-full transform transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <p className="text-white font-bold text-lg drop-shadow-md">{vehicle.vehicle}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-white/90 text-sm">
                            <span className="font-medium">{vehicle.mileage.toLocaleString()}</span> km
                          </span>
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full">
                            {vehicle.fuelType}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between mb-2">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Est. Value</p>
                          <p className="font-bold text-primary">₹{vehicle.worth.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Next Service</p>
                          <p className="font-medium">{vehicle.nextService}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-500">Health</span>
                          <span className="text-xs font-medium">
                            {vehicle.batteryHealth || vehicle.engineHealth || 90}%
                          </span>
                        </div>
                        <Progress 
                          value={vehicle.batteryHealth || vehicle.engineHealth || 90} 
                          className="h-1.5" 
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {totalSlides > 1 && (
        <>
          <motion.button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-full h-10 w-10 flex items-center justify-center shadow-lg border border-slate-200 dark:border-slate-700"
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </motion.button>
          
          <motion.button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white dark:bg-slate-800 rounded-full h-10 w-10 flex items-center justify-center shadow-lg border border-slate-200 dark:border-slate-700"
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </motion.button>
          
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <motion.button
                key={idx}
                className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
                onClick={() => {
                  setAutoSlide(false);
                  setCurrentIndex(idx);
                }}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Vehicle Detail Analysis Component
const VehicleDetailAnalysis = ({ vehicle }: { vehicle: typeof vehicleData[0] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="aspect-video rounded-lg overflow-hidden mb-4">
            <img src={vehicle.image} alt={vehicle.vehicle} className="w-full h-full object-cover" />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{vehicle.vehicle}</h3>
              <p className="text-slate-500 dark:text-slate-400">Purchased on {vehicle.purchaseDate}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">Mileage</p>
                <p className="font-bold">{vehicle.mileage.toLocaleString()} km</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">Fuel Type</p>
                <p className="font-bold">{vehicle.fuelType}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">Last Service</p>
                <p className="font-bold">{vehicle.lastService}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">Next Due</p>
                <p className="font-bold">{vehicle.nextService}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Health Status</p>
              <div className="flex items-center gap-3">
                <Progress value={vehicle.batteryHealth || vehicle.engineHealth || 90} className="h-2 flex-grow" />
                <span className="text-sm font-bold">{vehicle.batteryHealth || vehicle.engineHealth || 90}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-800 dark:text-green-400">Current Value</h4>
                <div className="bg-green-100 dark:bg-green-800/50 p-1.5 rounded-full">
                  <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">₹{vehicle.worth.toLocaleString('en-IN')}</p>
              {vehicle.percentage > 50 ? (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> Appreciated 8% last quarter
                </p>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" /> Depreciated 5% last quarter
                </p>
              )}
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-800 dark:text-blue-400">Insurance</h4>
                <div className="bg-blue-100 dark:bg-blue-800/50 p-1.5 rounded-full">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Valid until</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{vehicle.insuranceValid}</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-800 dark:text-purple-400">Maintenance</h4>
                <div className="bg-purple-100 dark:bg-purple-800/50 p-1.5 rounded-full">
                  <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Lifetime cost</p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">₹{vehicle.maintenanceCost.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              Performance Metrics
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicle.fuelType === 'Electric' ? (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Charging Efficiency</p>
                      <p className="font-bold">{vehicle.efficiency}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <HeartPulse className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Average Charge</p>
                      <p className="font-bold">{vehicle.averageCharge}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Battery className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Range</p>
                      <p className="font-bold">{vehicle.range}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Gauge className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Carbon Offset</p>
                      <p className="font-bold">{vehicle.carbonOffset}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Fuel Efficiency</p>
                      <p className="font-bold">{vehicle.efficiency}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <HeartPulse className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Average Consumption</p>
                      <p className="font-bold">{vehicle.averageFuel}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Droplets className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Top Speed</p>
                      <p className="font-bold">{vehicle.topSpeed}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Gauge className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Emission Rating</p>
                      <p className="font-bold">{vehicle.emissionRating}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-bold">Recommended Actions</h4>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="rounded-full">
                <Calendar className="h-3.5 w-3.5 mr-2" />
                Schedule Service
              </Button>
              <Button size="sm" variant="outline" className="rounded-full">
                <FileText className="h-3.5 w-3.5 mr-2" />
                View Documents
              </Button>
              <Button size="sm" variant="outline" className="rounded-full">
                <BarChart3 className="h-3.5 w-3.5 mr-2" />
                Value History
              </Button>
              <Button size="sm" variant="outline" className="rounded-full">
                <Share className="h-3.5 w-3.5 mr-2" />
                Share Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VehicleVault = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicleData[0] | null>(null);
  const { toast } = useToast();
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.3]);
  const mainContentScale = useSpring(
    useTransform(scrollY, [0, 100], [1, 0.98]), 
    { stiffness: 300, damping: 30 }
  );

  // One-click vehicle memory book export
  const handleExportMemoryBook = () => {
    toast({
      title: "Memory Book Export Started",
      description: "Your complete vehicle history book is being prepared. It will be available for download shortly.",
    });
    
    // Simulate export completion
    setTimeout(() => {
      toast({
        title: "Memory Book Ready",
        description: "Your Vehicle Memory Book has been generated successfully!",
      });
    }, 2500);
  };
  
  // Handle vehicle selection
  const handleVehicleSelect = (vehicle: typeof vehicleData[0]) => {
    setSelectedVehicle(vehicle);
    toast({
      title: "Vehicle Selected",
      description: `Analyzing ${vehicle.vehicle} details...`,
    });
  };

  return (
    <>
      <ParticleBg />
      <div className="container mx-auto px-4 py-6">
        {/* Enhanced header section */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-8 mb-8 shadow-2xl"
          style={{ opacity: headerOpacity }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Light ray effects */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400 opacity-20 rounded-full filter blur-3xl z-0"></div>
          <div className="absolute top-20 right-20 w-48 h-48 bg-indigo-500 opacity-20 rounded-full filter blur-3xl z-0"></div>
          
          {/* Animated glow */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-500/5 z-0"
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          ></motion.div>
          
          {/* Particle dots */}
          <div className="absolute inset-0 z-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white/40 w-1 h-1"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `pulse ${Math.random() * 5 + 3}s infinite`
                }}
              />
            ))}
          </div>
          
          <motion.div 
            className="absolute -right-10 -bottom-10 z-0"
            animate={{ 
              rotate: [12, 15, 12],
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <Car className="h-48 w-48 text-white opacity-10 filter drop-shadow-xl" />
          </motion.div>
          
          <div className="relative z-10 flex justify-between">
            <div>
              <motion.h1 
                className="text-4xl font-bold mb-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Vehicle Vault
              </motion.h1>
              <motion.p 
                className="text-blue-100 max-w-2xl"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Your complete vehicle management center. Access service records, documents, 
                health statistics, and connect with the vehicle community.
              </motion.p>
              
              <motion.div 
                className="flex gap-3 mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
                  onClick={handleExportMemoryBook}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Memory Book
                </Button>
                <Button variant="outline" className="text-white border-white/40 bg-transparent hover:bg-white/20">
                  <BoxSelect className="h-4 w-4 mr-2" />
                  Manage Vehicles
                </Button>
              </motion.div>
            </div>
            
            <div className="hidden md:flex items-end gap-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <InfoBox 
                  icon={Car} 
                  title="Vehicles" 
                  value="3 Active" 
                  accent="bg-emerald-500" 
                />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <InfoBox 
                  icon={FileText} 
                  title="Documents" 
                  value="15 Total" 
                  accent="bg-blue-500" 
                />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <InfoBox 
                  icon={HeartPulse} 
                  title="Health Score" 
                  value="89/100" 
                  accent="bg-red-500" 
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Dashboard overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          style={{ scale: mainContentScale }}
        >
          <FadeInView delay={0.1} direction="up">
            <div className="bg-gradient-to-br from-white via-white to-gray-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 rounded-xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]" style={{ animation: "glow 4s infinite" }}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                    <HeartPulse className="h-5 w-5 text-red-500" />
                  </div>
                  <span className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Vehicle Health</span>
                </h3>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 px-2.5 py-0.5 font-semibold">Good</Badge>
              </div>
              <div className="text-center mb-2">
                <div className="inline-block relative">
                  <AnimatedCounter target={75} />
                  <span className="ml-1 text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">%</span>
                  <motion.div 
                    className="absolute inset-0 -z-10 rounded-full bg-green-100 dark:bg-green-900/20 opacity-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
              <Progress value={75} className="h-2.5 mb-3 bg-green-100 dark:bg-green-900/30">
                <motion.div
                  className="absolute inset-0 bg-green-500/20 rounded-full"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </Progress>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-medium mt-2">Overall fleet health score</p>
            </div>
          </FadeInView>
          
          <FadeInView delay={0.2} direction="up">
            <div className="bg-gradient-to-br from-white via-white to-gray-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 rounded-xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]" style={{ animation: "glow 4s infinite" }}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-amber-500" />
                  </div>
                  <span className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Upcoming Services</span>
                </h3>
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 px-2.5 py-0.5 font-semibold">Due Soon</Badge>
              </div>
              <div className="text-center mb-2">
                <div className="inline-block relative">
                  <AnimatedCounter target={2} duration={1} />
                  <motion.div 
                    className="absolute inset-0 -z-10 rounded-full bg-amber-100 dark:bg-amber-900/20 opacity-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <motion.div 
                  className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ x: 3 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-amber-800 dark:text-amber-300">Honda City - Oil Change</span>
                    <Badge variant="outline" className="text-xs font-bold bg-white/80 dark:bg-black/20">3 days</Badge>
                  </div>
                </motion.div>
                <motion.div 
                  className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ x: 3 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-blue-800 dark:text-blue-300">Tata Nexon EV - Battery Check</span>
                    <Badge variant="outline" className="text-xs font-bold bg-white/80 dark:bg-black/20">8 days</Badge>
                  </div>
                </motion.div>
              </div>
            </div>
          </FadeInView>
          
          <FadeInView delay={0.3} direction="up">
            <div className="bg-gradient-to-br from-white via-white to-gray-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 rounded-xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]" style={{ animation: "glow 4s infinite" }}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-red-500" />
                  </div>
                  <span className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Alerts</span>
                </h3>
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0 px-2.5 py-0.5 font-semibold">Action Required</Badge>
              </div>
              <div className="text-center mb-2">
                <div className="inline-block relative">
                  <AnimatedCounter target={1} duration={1} />
                  <motion.div 
                    className="absolute inset-0 -z-10 rounded-full bg-red-100 dark:bg-red-900/20 opacity-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
              <motion.div 
                className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-red-200 dark:bg-red-800/50 rounded-full p-1 mt-0.5">
                    <Shield className="h-3 w-3 text-red-600 dark:text-red-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-red-700 dark:text-red-400">Honda City - Brake Inspection Required</h4>
                    <div className="mt-1 flex">
                      <Button size="sm" variant="outline" className="text-[10px] h-6 text-red-600 border-red-200 hover:bg-red-50 rounded-full px-2 py-0 mr-1">
                        Schedule
                      </Button>
                      <Button size="sm" variant="ghost" className="text-[10px] h-6 text-red-600">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </FadeInView>
        </motion.div>
        
        {/* Tabs section */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TabsList className="grid grid-cols-5 w-fit p-1">
              <TabsTrigger value="documents" className="px-4 py-2 text-sm flex gap-2 items-center">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="service-history" className="px-4 py-2 text-sm flex gap-2 items-center">
                <Clock className="h-4 w-4" />
                Service History
              </TabsTrigger>
              <TabsTrigger value="health" className="px-4 py-2 text-sm flex gap-2 items-center">
                <HeartPulse className="h-4 w-4" />
                Health Records
              </TabsTrigger>
              <TabsTrigger value="community" className="px-4 py-2 text-sm flex gap-2 items-center">
                <Users className="h-4 w-4" />
                Community Hub
              </TabsTrigger>
              <TabsTrigger value="inspections" className="px-4 py-2 text-sm flex gap-2 items-center">
                <Shield className="h-4 w-4" />
                Inspections
              </TabsTrigger>
            </TabsList>
          </motion.div>
        
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
                
                <div>
                  <VehicleTimeline />
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
                <h2 className="text-xl font-bold mb-4">AI-Generated Vehicle Stories</h2>
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
          
          <TabsContent value="inspections" className="m-0">
            <TabTransition isActive={activeTab === 'inspections'}>
              <Card className="mt-0">
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl">Vehicle Inspections</CardTitle>
                  <CardDescription>View your vehicle inspection reports and findings</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center p-12 text-gray-500">
                    Inspection reports section will be available here.
                  </div>
                </CardContent>
              </Card>
            </TabTransition>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default VehicleVault;