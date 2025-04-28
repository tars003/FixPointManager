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
  PieChart, TrendingUp, TrendingDown, Star, BoxSelect, Brain
} from 'lucide-react';

// Mock data for vehicle worth chart
const vehicleWorthData = [
  { vehicle: 'Tata Nexon EV', worth: 892500, percentage: 67 },
  { vehicle: 'Honda City', worth: 375000, percentage: 28 },
  { vehicle: 'TVS iQube', worth: 73500, percentage: 5 },
];

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

// Dynamic floating particles background
const ParticleBg = () => {
  const particles = Array.from({ length: 15 }, (_, i) => i);
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.map((i) => {
        const size = Math.random() * 20 + 10;
        const duration = Math.random() * 20 + 10;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const delay = Math.random() * 5;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-500/10 backdrop-blur-sm"
            style={{ width: size, height: size, left: `${initialX}%`, top: `${initialY}%` }}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              opacity: [0.1, 0.2, 0.1]
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
  <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-5`}>
    <div className="flex items-center gap-4">
      <div className={`rounded-full p-3 ${accent}`}>
        <Icon className={`h-6 w-6 text-white`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
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
  return (
    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">{vehicle}</CardTitle>
          <Brain className="h-5 w-5 text-indigo-500" />
        </div>
        <CardDescription>AI-generated vehicle story</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {story}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end">
        <Button variant="ghost" size="sm" className="text-xs">
          <Share className="h-3.5 w-3.5 mr-1" />
          Share Story
        </Button>
      </CardFooter>
    </Card>
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

const TimelineEvent = ({ icon: Icon, title, date, color }: { icon: any; title: string; date: string; color: string }) => {
  return (
    <motion.div 
      className="flex items-start gap-3 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ x: 5 }}
    >
      <div className={`rounded-full p-2 ${color} mt-0.5 shadow-md`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm">{title}</h4>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">
          <span>View details</span>
        </div>
      </div>
    </motion.div>
  );
};

const VehicleTimeline = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Clock className="h-5 w-5 text-blue-500" />
        Vehicle Timeline
      </h3>
      
      <div className="relative pl-6 before:absolute before:left-[9px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700 space-y-4">
        <TimelineEvent 
          icon={Calendar} 
          title="Honda City - Regular Service Completed" 
          date="2 weeks ago" 
          color="bg-green-500" 
        />
        <TimelineEvent 
          icon={Shield} 
          title="Tata Nexon EV - Battery Health Check" 
          date="1 month ago" 
          color="bg-blue-500" 
        />
        <TimelineEvent 
          icon={FileText} 
          title="TVS iQube - Insurance Renewed" 
          date="2 months ago" 
          color="bg-indigo-500" 
        />
        <TimelineEvent 
          icon={Car} 
          title="Tata Nexon EV - Major Service" 
          date="4 months ago" 
          color="bg-purple-500" 
        />
        <TimelineEvent 
          icon={Car} 
          title="TVS iQube - Purchase Date" 
          date="8 months ago" 
          color="bg-amber-500" 
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

const VehicleVault = () => {
  const [activeTab, setActiveTab] = useState('community');
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

  return (
    <>
      <ParticleBg />
      <div className="container mx-auto px-4 py-6">
        {/* Enhanced header section */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 mb-8"
          style={{ opacity: headerOpacity }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400/10 to-transparent z-0"></div>
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
            <Car className="h-48 w-48 text-white opacity-10" />
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
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-red-500" />
                  Vehicle Health
                </h3>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">Good</Badge>
              </div>
              <div className="text-center mb-2">
                <AnimatedCounter target={75} />
                <span className="ml-1">%</span>
              </div>
              <Progress value={75} className="h-2 mb-3" />
              <p className="text-xs text-center text-slate-500">Overall fleet health score</p>
            </div>
          </FadeInView>
          
          <FadeInView delay={0.2} direction="up">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  Upcoming Services
                </h3>
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">Due Soon</Badge>
              </div>
              <div className="text-center mb-2">
                <AnimatedCounter target={2} duration={1} />
              </div>
              <div className="text-xs text-center text-slate-500 space-y-1">
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Honda City - Oil Change (3 days)
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Tata Nexon EV - Battery Check (8 days)
                </motion.p>
              </div>
            </div>
          </FadeInView>
          
          <FadeInView delay={0.3} direction="up">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  Alerts
                </h3>
                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">Action Required</Badge>
              </div>
              <div className="text-center mb-2">
                <AnimatedCounter target={1} duration={1} />
              </div>
              <motion.div 
                className="text-xs text-center text-red-600 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p>Honda City - Brake Inspection Required</p>
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