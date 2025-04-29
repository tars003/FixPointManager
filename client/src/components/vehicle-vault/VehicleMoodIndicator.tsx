import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Battery, AlertTriangle, Gauge, ThumbsUp, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface VehicleMoodIndicatorProps {
  vehicle: {
    batteryHealth?: number;
    engineHealth?: number;
    fuelType: string;
  };
}

const VehicleMoodIndicator: React.FC<VehicleMoodIndicatorProps> = ({ vehicle }) => {
  // Determine health percentage based on vehicle type
  const healthPercentage = vehicle.fuelType === 'Electric' 
    ? vehicle.batteryHealth || 0 
    : vehicle.engineHealth || 0;
  
  // Calculate mood based on health
  let mood: 'excellent' | 'good' | 'fair' | 'poor';
  if (healthPercentage >= 90) mood = 'excellent';
  else if (healthPercentage >= 75) mood = 'good';
  else if (healthPercentage >= 60) mood = 'fair';
  else mood = 'poor';
  
  // Define color schemes and emojis for different moods
  const moodConfig = {
    excellent: {
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      text: 'text-green-700',
      progress: 'bg-green-500',
      icon: ThumbsUp,
      message: 'Your vehicle is in excellent condition!'
    },
    good: {
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      progress: 'bg-blue-500',
      icon: Battery,
      message: 'Your vehicle is in good health.'
    },
    fair: {
      color: 'from-yellow-500 to-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      progress: 'bg-amber-500',
      icon: Gauge,
      message: 'Your vehicle needs some attention soon.'
    },
    poor: {
      color: 'from-red-500 to-orange-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
      progress: 'bg-red-500',
      icon: AlertTriangle,
      message: 'Your vehicle requires immediate service!'
    }
  };
  
  const config = moodConfig[mood];
  const MoodIcon = config.icon;
  
  return (
    <div className={`rounded-lg ${config.bg} p-4 border border-opacity-20 shadow-sm w-full`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-medium ${config.text} flex items-center gap-1.5`}>
          <HeartPulse className="h-4 w-4" />
          Vehicle Mood Indicator
        </h3>
        <span className="text-xs font-medium text-gray-500">AI-Powered</span>
      </div>
      
      <div className="flex items-center gap-3 my-3">
        <motion.div 
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-white`}
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 0 0 rgba(0, 0, 0, 0)', 
              '0 0 0 10px rgba(0, 0, 0, 0.1)', 
              '0 0 0 0 rgba(0, 0, 0, 0)'
            ]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <MoodIcon className="h-6 w-6" />
        </motion.div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-medium ${config.text}`}>
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </span>
            <span className="text-sm font-medium">{healthPercentage}%</span>
          </div>
          <Progress 
            value={healthPercentage} 
            className="h-2"
            style={{ 
              background: 'rgba(0,0,0,0.05)',
              '--progress-value': `${healthPercentage}%`,
              '--progress-color': config.progress
            } as any}
          />
        </div>
      </div>
      
      <p className={`text-sm ${config.text} mt-1 font-medium`}>{config.message}</p>
      
      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {vehicle.fuelType === 'Electric' ? 'Battery Health' : 'Engine Health'}
          </span>
          <span>Updated Today</span>
        </div>
      </div>
    </div>
  );
};

export default VehicleMoodIndicator;