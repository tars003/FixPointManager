import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, TrendingUp, Shield, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedHeroProps {
  userName: string;
  membershipTier?: string;
  daysRemaining?: number;
  vehicleCount: number;
  servicesBooked: number;
  upcomingAppointments: number;
  healthScore: number;
  onAddVehicle?: () => void;
  onBookService?: () => void;
}

const EnhancedHero: React.FC<EnhancedHeroProps> = ({
  userName,
  membershipTier = "Gold Member",
  daysRemaining = 128,
  vehicleCount,
  servicesBooked,
  upcomingAppointments,
  healthScore,
  onAddVehicle,
  onBookService,
}) => {
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse move for subtle parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 2;
    const moveY = clientY - window.innerHeight / 2;
    const offsetFactor = 50; // Subtle movement

    setBackgroundPosition({
      x: moveX / offsetFactor,
      y: moveY / offsetFactor,
    });
  };

  // Social proof indicators - indirect sales tactics
  const socialProofItems = [
    { icon: <TrendingUp className="h-4 w-4 mr-1.5 text-blue-400" />, text: 'Trusted by 50,000+ owners' },
    { icon: <Shield className="h-4 w-4 mr-1.5 text-emerald-400" />, text: 'Certified experts nationwide' },
    { icon: <Award className="h-4 w-4 mr-1.5 text-amber-400" />, text: '#1 rated platform' },
  ];

  return (
    <div 
      className="relative overflow-hidden rounded-b-3xl bg-gradient-to-r from-blue-700 to-indigo-700 pt-12 pb-24 px-4"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"
          animate={{ 
            x: backgroundPosition.x * 1.2, 
            y: backgroundPosition.y * 1.2,
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"
          animate={{ 
            x: backgroundPosition.x * 0.5, 
            y: backgroundPosition.y * 0.5,
            scale: [1, 1.03, 1],
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-5"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"30\" height=\"30\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        />
      </div>

      {/* Sparkling premium effect */}
      <AnimatePresence>
        <motion.div 
          className="absolute right-12 top-12 opacity-70" 
          animate={{ 
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <Sparkles className="h-6 w-6 text-yellow-300" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-xl">{userName.charAt(0)}</span>
          </div>
          <div>
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome back, {userName}
            </motion.h1>
            <div className="flex items-center mt-1 text-blue-100 text-sm">
              <div className="flex items-center gap-1">
                <motion.span 
                  className="inline-block h-2 w-2 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.span>
                <span>{membershipTier}</span>
              </div>
              <span className="mx-2">•</span>
              <span>{daysRemaining} days remaining</span>
            </div>
          </div>
        </div>
        
        {/* Social proof bar - sales tactic #1: Social proof */}
        <motion.div 
          className="flex flex-wrap items-center gap-3 mt-2 mb-4 text-xs md:text-sm text-blue-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {socialProofItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {item.icon}
              <span>{item.text}</span>
              {index < socialProofItems.length - 1 && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-300/30 mx-3" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Main stats area with animated counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <StatCard 
            icon={<Car className="h-5 w-5 text-blue-200" />}
            value={vehicleCount}
            label="Vehicles"
            animateDelay={0.1}
          />
          <StatCard 
            icon={<Shield className="h-5 w-5 text-blue-200" />}
            value={servicesBooked}
            label="Services Booked"
            animateDelay={0.2}
          />
          <StatCard 
            icon={<TrendingUp className="h-5 w-5 text-blue-200" />}
            value={upcomingAppointments}
            label="Upcoming Appointments"
            animateDelay={0.3}
          />
          <StatCard 
            icon={<Award className="h-5 w-5 text-blue-200" />}
            value={healthScore}
            label="Health Score"
            suffix="%"
            animateDelay={0.4}
          />
        </div>

        {/* Action buttons with animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex gap-3 mt-6"
        >
          <Button 
            onClick={onAddVehicle} 
            className="bg-white text-blue-600 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            size="sm"
          >
            + Add Vehicle
          </Button>
          <Button 
            onClick={onBookService} 
            variant="outline" 
            className="bg-blue-700/30 text-white border-white/20 hover:bg-blue-600/50 hover:border-white/30 transition-all transform hover:scale-105"
            size="sm"
          >
            Book Service
          </Button>
        </motion.div>
      </div>

      {/* Stylized vehicle silhouette */}
      <div className="absolute bottom-0 right-0 w-40 h-32 opacity-15">
        <motion.svg 
          viewBox="0 0 100 70" 
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {/* Car body */}
          <motion.path
            d="M5,50 C5,50 15,45 25,45 C35,45 40,50 50,50 C60,50 65,45 75,45 C85,45 95,50 95,50 L95,60 C95,60 85,55 75,55 C65,55 60,58 50,58 C40,58 35,55 25,55 C15,55 5,60 5,60 L5,50 Z"
            fill="white"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          {/* Wheels */}
          <motion.circle 
            cx="25" cy="60" r="5" 
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          />
          <motion.circle 
            cx="75" cy="60" r="5" 
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.7 }}
          />
          {/* Windshield */}
          <motion.path
            d="M30,45 C30,45 40,25 50,25 C60,25 70,45 70,45"
            stroke="white"
            fill="transparent"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
          />
        </motion.svg>
      </div>
    </div>
  );
};

// Animated stat card component
const StatCard: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  animateDelay?: number;
}> = ({ icon, value, label, suffix = "", animateDelay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Animate counting up
  useEffect(() => {
    let startValue = 0;
    const endValue = value;
    const duration = 1500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    const increment = endValue / totalFrames;
    
    const timer = setTimeout(() => {
      const counter = setInterval(() => {
        startValue += increment;
        setDisplayValue(Math.min(Math.floor(startValue), endValue));
        
        if (startValue >= endValue) {
          clearInterval(counter);
          setDisplayValue(endValue);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }, animateDelay * 1000);
    
    return () => clearTimeout(timer);
  }, [value, animateDelay]);
  
  return (
    <motion.div 
      className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animateDelay }}
      whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
    >
      <div className="flex items-center mb-2">
        <div className="p-1.5 rounded-full bg-blue-600/50 mr-2">
          {icon}
        </div>
        <span className="text-xs font-medium text-blue-100">{label}</span>
      </div>
      <div className="text-xl font-bold text-white">{displayValue}{suffix}</div>
    </motion.div>
  );
};

export default EnhancedHero;