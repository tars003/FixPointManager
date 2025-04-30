import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion, useAnimation } from 'framer-motion';
import { Play, Car, Gauge, Settings, ChevronRight } from 'lucide-react';

const LaunchArena: React.FC = () => {
  const [, setLocation] = useLocation();
  const controls = useAnimation();
  
  // Animation controls
  useEffect(() => {
    const sequence = async () => {
      await controls.start("visible");
    };
    sequence();
  }, [controls]);

  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const speedLineVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 0.6, 
      x: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Black background with diagonal line pattern */}
      <div className="absolute inset-0 z-0 bg-black">
        <div className="grid grid-cols-8 h-full">
          {Array.from({ length: 24 }).map((_, index) => (
            <div key={index} className="border-[0.5px] border-white/10 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[1px] h-6 bg-white/20 transform rotate-45"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Automotive animation elements */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {/* Speed lines */}
        <motion.div 
          className="absolute bottom-20 left-10 md:left-20 transform -rotate-12"
          initial="hidden"
          animate={controls}
          variants={speedLineVariants}
        >
          <div className="bg-blue-500/40 h-2 w-32 mb-4 rounded-full blur-sm"></div>
          <div className="bg-blue-500/40 h-2 w-48 mb-4 rounded-full blur-sm"></div>
          <div className="bg-blue-500/40 h-2 w-40 rounded-full blur-sm"></div>
        </motion.div>
        
        <motion.div 
          className="absolute top-40 right-10 md:right-20 transform rotate-12"
          initial="hidden"
          animate={controls}
          variants={speedLineVariants}
        >
          <div className="bg-blue-500/40 h-2 w-40 mb-4 rounded-full blur-sm"></div>
          <div className="bg-blue-500/40 h-2 w-32 mb-4 rounded-full blur-sm"></div>
          <div className="bg-blue-500/40 h-2 w-48 rounded-full blur-sm"></div>
        </motion.div>
      </div>
      
      {/* Floating automotive icons */}
      <motion.div 
        className="absolute top-1/4 left-1/6 text-white/30"
        variants={iconVariants}
        initial="hidden"
        animate={controls}
      >
        <Car className="h-12 w-12" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/4 right-1/6 text-white/30"
        variants={iconVariants}
        initial="hidden"
        animate={controls}
      >
        <Gauge className="h-10 w-10" />
      </motion.div>
      
      <motion.div 
        className="absolute top-1/3 right-1/4 text-white/30"
        variants={iconVariants}
        initial="hidden"
        animate={controls}
      >
        <Settings className="h-8 w-8" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/3 left-1/4 text-white/30"
        variants={iconVariants}
        initial="hidden"
        animate={controls}
      >
        <ChevronRight className="h-14 w-14" />
      </motion.div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-3xl mx-auto text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold tracking-tight text-white mb-4">Launch Arena</h1>
        <p className="text-lg text-white/90 mb-10">
          Experience the ultimate automotive customization studio with cutting-edge
          technology. Design your dream ride with precision and share it with the world.
        </p>
        
        <Button 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6"
          onClick={() => setLocation('/arena-studio')}
        >
          <Play className="mr-2 h-5 w-5" /> Launch Arena
        </Button>
      </motion.div>
    </div>
  );
};

export default LaunchArena;