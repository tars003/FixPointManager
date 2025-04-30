import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const LaunchArena: React.FC = () => {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Diagonal line pattern background */}
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
          onClick={() => setLocation('/arena')}
        >
          <Play className="mr-2 h-5 w-5" /> Launch Arena
        </Button>
      </motion.div>
    </div>
  );
};

export default LaunchArena;