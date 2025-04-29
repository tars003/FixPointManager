import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Clock, 
  ArrowRight, 
  ThumbsUp,
  Wrench,
  ShoppingBag,
  Archive,
  Car,
  Award
} from 'lucide-react';

interface AnimatedStatusTransitionProps {
  fromStatus: string;
  toStatus: string;
  onComplete?: () => void;
  showProgress?: boolean;
  daysRemaining?: number;
  autoStart?: boolean;
}

const AnimatedStatusTransition: React.FC<AnimatedStatusTransitionProps> = ({
  fromStatus,
  toStatus,
  onComplete,
  showProgress = true,
  daysRemaining = 30,
  autoStart = false
}) => {
  const [isAnimating, setIsAnimating] = useState(autoStart);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let animationTimeout: NodeJS.Timeout;
    
    if (isAnimating && !isComplete) {
      const intervalId = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(intervalId);
            setIsComplete(true);
            animationTimeout = setTimeout(() => {
              if (onComplete) onComplete();
            }, 1500);
            return 100;
          }
          return newProgress;
        });
      }, 20);
      
      return () => {
        clearInterval(intervalId);
        if (animationTimeout) clearTimeout(animationTimeout);
      };
    }
  }, [isAnimating, isComplete, onComplete]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <Car className="h-5 w-5" />;
      case 'Recently Purchased':
        return <ShoppingBag className="h-5 w-5" />;
      case 'In Maintenance':
        return <Wrench className="h-5 w-5" />;
      case 'Pre-Owned':
        return <Award className="h-5 w-5" />;
      case 'Garage Stored':
        return <Archive className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'Recently Purchased':
        return 'text-blue-700 bg-blue-50 dark:bg-blue-900/20';
      case 'In Maintenance':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'Pre-Owned':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'Garage Stored':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-800/50';
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Status Transition</h3>
        {!isAnimating && !isComplete && (
          <motion.button
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAnimating(true)}
          >
            Simulate Transition
          </motion.button>
        )}
      </div>
      
      <div className="relative py-2">
        <div className="flex justify-between items-center">
          <div className={`rounded-full w-10 h-10 flex items-center justify-center ${getStatusColor(fromStatus)}`}>
            {getStatusIcon(fromStatus)}
          </div>
          
          <div className="flex-1 px-2">
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              {showProgress && (
                <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
          </div>
          
          <div className={`rounded-full w-10 h-10 flex items-center justify-center ${
            isComplete ? getStatusColor(toStatus) : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
          }`}>
            {isComplete ? getStatusIcon(toStatus) : (
              <motion.div
                animate={{ rotate: isAnimating ? 360 : 0 }}
                transition={{ duration: 1, repeat: isAnimating ? Infinity : 0, ease: "linear" }}
              >
                <Clock className="h-5 w-5" />
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Flow animation */}
        <div className="absolute top-7 left-10 right-10 flex justify-center">
          <AnimatePresence>
            {isAnimating && !isComplete && (
              <motion.div
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: [0, 100, 200], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute"
              >
                <ArrowRight className="h-4 w-4 text-blue-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{fromStatus}</span>
        {showProgress && !isComplete && (
          <span>{daysRemaining} days remaining</span>
        )}
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-green-500"
          >
            <ThumbsUp className="h-3 w-3 mr-1" />
            <span>Complete</span>
          </motion.div>
        )}
        <span>{toStatus}</span>
      </div>
    </div>
  );
};

export default AnimatedStatusTransition;