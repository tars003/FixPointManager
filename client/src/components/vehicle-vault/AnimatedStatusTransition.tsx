import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Clock, Lock, Archive, Wrench, DollarSign, Building2, Truck, Map, ExternalLink } from 'lucide-react';

type VehicleStatus = 
  'Active' | 
  'Recently Purchased' | 
  'In Maintenance' | 
  'Out of Service' | 
  'Garage Stored' | 
  'Commercial Fleet' | 
  'Leased Out' |
  'For Sale' |
  'Sold' |
  'Impounded' |
  'Under Legal Hold' |
  'Stolen' |
  'Scrapped' |
  'Totaled';

interface AnimatedStatusTransitionProps {
  previousStatus?: VehicleStatus;
  currentStatus: VehicleStatus;
  duration?: number;
  showLabel?: boolean;
}

const AnimatedStatusTransition: React.FC<AnimatedStatusTransitionProps> = ({
  previousStatus,
  currentStatus,
  duration = 2000,
  showLabel = true
}) => {
  const [isTransitioning, setIsTransitioning] = useState(!!previousStatus);
  const [showPrevious, setShowPrevious] = useState(!!previousStatus);
  
  useEffect(() => {
    if (previousStatus) {
      setShowPrevious(true);
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setShowPrevious(false);
      }, duration / 2);
      
      const endTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, duration);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(endTimer);
      };
    }
  }, [previousStatus, duration]);
  
  const getIconByStatus = (status: VehicleStatus) => {
    switch(status) {
      case 'Active':
        return <CheckCircle className="text-emerald-500" />;
      case 'Recently Purchased':
        return <CheckCircle className="text-blue-500" />;
      case 'In Maintenance':
        return <Wrench className="text-amber-500" />;
      case 'Out of Service':
        return <AlertTriangle className="text-red-500" />;
      case 'Garage Stored':
        return <Archive className="text-purple-500" />;
      case 'Commercial Fleet':
        return <Truck className="text-indigo-500" />;
      case 'Leased Out':
        return <ExternalLink className="text-cyan-500" />;
      case 'For Sale':
        return <DollarSign className="text-green-500" />;
      case 'Sold':
        return <CheckCircle className="text-green-400" />;
      case 'Impounded':
        return <Building2 className="text-slate-500" />;
      case 'Under Legal Hold':
        return <Lock className="text-yellow-500" />;
      case 'Stolen':
        return <AlertTriangle className="text-red-600" />;
      case 'Scrapped':
        return <Wrench className="text-gray-500" />;
      case 'Totaled':
        return <AlertTriangle className="text-gray-600" />;
      default:
        return <Clock className="text-blue-500" />;
    }
  };
  
  const getColorByStatus = (status: VehicleStatus) => {
    switch(status) {
      case 'Active':
        return 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300';
      case 'Recently Purchased':
        return 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300';
      case 'In Maintenance':
        return 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300';
      case 'Out of Service':
        return 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300';
      case 'Garage Stored':
        return 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300';
      case 'Commercial Fleet':
        return 'bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300';
      case 'Leased Out':
        return 'bg-cyan-100 border-cyan-300 text-cyan-800 dark:bg-cyan-900/30 dark:border-cyan-700 dark:text-cyan-300';
      case 'For Sale':
        return 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300';
      case 'Sold':
        return 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300';
      case 'Impounded':
        return 'bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-900/30 dark:border-slate-700 dark:text-slate-300';
      case 'Under Legal Hold':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300';
      case 'Stolen':
        return 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300';
      case 'Scrapped':
        return 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900/30 dark:border-gray-700 dark:text-gray-300';
      case 'Totaled':
        return 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900/30 dark:border-gray-700 dark:text-gray-300';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300';
    }
  };

  const transitionVariants = {
    initial: { 
      opacity: 0,
      y: -10,
      scale: 0.9
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: 10,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };
  
  const containerVariants = {
    transitioning: {
      borderColor: ['rgba(200, 200, 200, 0.5)', 'rgba(250, 250, 250, 0.8)', 'rgba(200, 200, 200, 0.5)'],
      boxShadow: ['0 0 0 rgba(150, 150, 250, 0)', '0 0 20px rgba(150, 150, 250, 0.5)', '0 0 0 rgba(150, 150, 250, 0)'],
      transition: {
        duration: duration / 1000,
        times: [0, 0.5, 1],
        repeat: 0
      }
    },
    static: {
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <motion.div 
      className={`inline-flex items-center border rounded-full overflow-hidden transition-colors relative ${
        isTransitioning ? 'border-gray-300 dark:border-gray-600' : getColorByStatus(currentStatus)
      }`}
      variants={containerVariants}
      animate={isTransitioning ? 'transitioning' : 'static'}
    >
      <div className="pl-3 pr-3 py-1.5 flex items-center">
        <AnimatePresence mode="wait">
          {showPrevious && previousStatus ? (
            <motion.div
              key="previous"
              className="h-5 w-5"
              variants={transitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {getIconByStatus(previousStatus)}
            </motion.div>
          ) : (
            <motion.div
              key="current"
              className="h-5 w-5"
              variants={transitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {getIconByStatus(currentStatus)}
            </motion.div>
          )}
        </AnimatePresence>
        
        {showLabel && (
          <AnimatePresence mode="wait">
            {showPrevious && previousStatus ? (
              <motion.div
                key="previous-label"
                className="ml-2 text-sm font-medium"
                variants={transitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {previousStatus}
              </motion.div>
            ) : (
              <motion.div
                key="current-label"
                className="ml-2 text-sm font-medium"
                variants={transitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {currentStatus}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
      
      {isTransitioning && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: -100 }}
          animate={{ x: 200 }}
          transition={{
            duration: duration / 1000,
            ease: "linear",
            times: [0, 1],
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedStatusTransition;