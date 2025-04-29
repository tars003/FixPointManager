import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  ShoppingBag,
  RefreshCw,
  Wrench,
  Warehouse,
  AlertOctagon,
  Building2,
  KeyRound,
  Tag,
  CheckCircle,
  AlertTriangle,
  Shield,
  FileX,
  Trash2,
  Scale
} from 'lucide-react';

type VehicleStatus = 
  'Active' | 
  'Recently Purchased' | 
  'Pre-owned' | 
  'In Maintenance' | 
  'Garage Stored' | 
  'Out of Service' | 
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
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onComplete?: () => void;
}

const AnimatedStatusTransition = ({
  previousStatus,
  currentStatus,
  showLabel = true,
  size = 'md',
  onComplete,
}: AnimatedStatusTransitionProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  
  useEffect(() => {
    if (previousStatus && previousStatus !== currentStatus) {
      setIsAnimating(true);
      setShowTransition(true);
      
      const timer = setTimeout(() => {
        setShowTransition(false);
        
        setTimeout(() => {
          setIsAnimating(false);
          if (onComplete) onComplete();
        }, 500);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [previousStatus, currentStatus, onComplete]);
  
  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Recently Purchased': return 'bg-blue-500';
      case 'Pre-owned': return 'bg-indigo-500';
      case 'In Maintenance': return 'bg-amber-500';
      case 'Garage Stored': return 'bg-sky-500';
      case 'Out of Service': return 'bg-slate-500';
      case 'Commercial Fleet': return 'bg-purple-500';
      case 'Leased Out': return 'bg-emerald-500';
      case 'For Sale': return 'bg-pink-500';
      case 'Sold': return 'bg-violet-500';
      case 'Impounded': return 'bg-rose-500';
      case 'Under Legal Hold': return 'bg-yellow-500';
      case 'Stolen': return 'bg-red-500';
      case 'Scrapped': return 'bg-gray-500';
      case 'Totaled': return 'bg-stone-500';
      default: return 'bg-green-500';
    }
  };
  
  const getStatusTextColor = (status: VehicleStatus) => {
    switch (status) {
      case 'Active': return 'text-green-500';
      case 'Recently Purchased': return 'text-blue-500';
      case 'Pre-owned': return 'text-indigo-500';
      case 'In Maintenance': return 'text-amber-500';
      case 'Garage Stored': return 'text-sky-500';
      case 'Out of Service': return 'text-slate-500';
      case 'Commercial Fleet': return 'text-purple-500';
      case 'Leased Out': return 'text-emerald-500';
      case 'For Sale': return 'text-pink-500';
      case 'Sold': return 'text-violet-500';
      case 'Impounded': return 'text-rose-500';
      case 'Under Legal Hold': return 'text-yellow-500';
      case 'Stolen': return 'text-red-500';
      case 'Scrapped': return 'text-gray-500';
      case 'Totaled': return 'text-stone-500';
      default: return 'text-green-500';
    }
  };
  
  const getStatusIcon = (status: VehicleStatus, size: string) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };
    
    const iconClass = sizeClasses[size as keyof typeof sizeClasses];
    
    switch (status) {
      case 'Active': 
        return <Car className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Recently Purchased': 
        return <ShoppingBag className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Pre-owned': 
        return <RefreshCw className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'In Maintenance': 
        return <Wrench className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Garage Stored': 
        return <Warehouse className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Out of Service': 
        return <AlertOctagon className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Commercial Fleet': 
        return <Building2 className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Leased Out': 
        return <KeyRound className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'For Sale': 
        return <Tag className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Sold': 
        return <CheckCircle className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Impounded': 
        return <Shield className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Under Legal Hold': 
        return <Scale className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Stolen': 
        return <AlertTriangle className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Scrapped': 
        return <Trash2 className={`${iconClass} ${getStatusTextColor(status)}`} />;
      case 'Totaled': 
        return <FileX className={`${iconClass} ${getStatusTextColor(status)}`} />;
      default: 
        return <Car className={`${iconClass} ${getStatusTextColor(status)}`} />;
    }
  };
  
  const sizeClasses = {
    sm: {
      container: 'text-xs',
      icon: 'h-4 w-4',
      text: 'text-xs',
      arrow: 'w-3 h-3',
    },
    md: {
      container: 'text-sm',
      icon: 'h-5 w-5',
      text: 'text-sm',
      arrow: 'w-4 h-4',
    },
    lg: {
      container: 'text-base',
      icon: 'h-6 w-6',
      text: 'text-base',
      arrow: 'w-5 h-5',
    },
  };
  
  if (!isAnimating && !previousStatus) {
    // Just show current status without animation
    return (
      <div className={`inline-flex items-center gap-1.5 ${sizeClasses[size].container}`}>
        {getStatusIcon(currentStatus, size)}
        {showLabel && <span className={`font-medium ${getStatusTextColor(currentStatus)}`}>{currentStatus}</span>}
      </div>
    );
  }
  
  return (
    <div className="relative">
      <AnimatePresence>
        {showTransition && previousStatus && (
          <motion.div
            className="absolute inset-0 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-1">
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: -20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-1.5"
              >
                {getStatusIcon(previousStatus, size)}
                {showLabel && <span className={`font-medium ${getStatusTextColor(previousStatus)}`}>{previousStatus}</span>}
              </motion.div>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mx-2 h-0.5 w-10 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500"
              />
              
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="flex items-center gap-1.5"
              >
                {getStatusIcon(currentStatus, size)}
                {showLabel && <span className={`font-medium ${getStatusTextColor(currentStatus)}`}>{currentStatus}</span>}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!showTransition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5"
        >
          {getStatusIcon(currentStatus, size)}
          {showLabel && <span className={`font-medium ${getStatusTextColor(currentStatus)}`}>{currentStatus}</span>}
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedStatusTransition;