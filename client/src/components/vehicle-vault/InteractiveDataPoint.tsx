import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Calendar, 
  Gauge, 
  Droplet, 
  Leaf, 
  Battery, 
  Clock, 
  DollarSign,
  IndianRupee
} from 'lucide-react';

interface InteractiveDataPointProps {
  title: string;
  value: string | number;
  type: 'efficiency' | 'cost' | 'battery' | 'fuel' | 'emission' | 'mileage' | 'age' | 'time' | 'speed' | 'date' | 'charge';
  previousValue?: string | number;
  isPositive?: boolean;
  showChange?: boolean;
}

const InteractiveDataPoint: React.FC<InteractiveDataPointProps> = ({
  title,
  value,
  type,
  previousValue,
  isPositive = true,
  showChange = false
}) => {
  const [hovered, setHovered] = useState(false);

  // Get icon based on data type
  const getIcon = () => {
    switch (type) {
      case 'efficiency':
        return <Zap className="h-4 w-4" />;
      case 'cost':
        return <IndianRupee className="h-4 w-4" />;
      case 'battery':
        return <Battery className="h-4 w-4" />;
      case 'fuel':
        return <Droplet className="h-4 w-4" />;
      case 'emission':
        return <Leaf className="h-4 w-4" />;
      case 'mileage':
        return <Gauge className="h-4 w-4" />;
      case 'age':
      case 'date':
        return <Calendar className="h-4 w-4" />;
      case 'time':
        return <Clock className="h-4 w-4" />;
      case 'speed':
        return <TrendingUp className="h-4 w-4" />;
      case 'charge':
        return <Zap className="h-4 w-4" />;
      default:
        return <Gauge className="h-4 w-4" />;
    }
  };

  // Get color scheme based on data type
  const getColorScheme = () => {
    switch (type) {
      case 'efficiency':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'cost':
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'battery':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
      case 'fuel':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
      case 'emission':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'mileage':
        return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'age':
      case 'date':
        return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      case 'time':
        return 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 dark:text-cyan-400';
      case 'speed':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'charge':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Format value for display
  const formatValue = () => {
    if (type === 'cost') {
      // Add thousands separators for currency values
      return typeof value === 'number' 
        ? `₹${value.toLocaleString('en-IN')}`
        : value;
    }
    return value;
  };

  // Calculate change percentage if possible
  const calculateChange = () => {
    if (previousValue === undefined || !showChange) return null;
    
    let current = typeof value === 'number' ? value : parseFloat(value.toString());
    let previous = typeof previousValue === 'number' ? previousValue : parseFloat(previousValue.toString());
    
    if (isNaN(current) || isNaN(previous) || previous === 0) return null;
    
    const percentChange = ((current - previous) / previous) * 100;
    return percentChange.toFixed(1);
  };

  const change = calculateChange();

  return (
    <motion.div
      className={`rounded-lg p-3 ${getColorScheme()} relative overflow-hidden transition-all duration-300 cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0.8 }}
      animate={{ 
        opacity: 1,
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      {/* Hover effect light rays */}
      <AnimatePresence>
        {hovered && (
          <motion.div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full filter blur-xl transform -translate-y-1/2 opacity-70"></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium flex items-center gap-1">
          {getIcon()}
          {title}
        </span>
        
        {showChange && change && (
          <motion.div 
            className={`text-xs px-1.5 py-0.5 rounded ${
              isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isPositive ? '+' : ''}{change}%
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="text-lg font-bold"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {formatValue()}
      </motion.div>
      
      {/* Animated micro-bar chart */}
      <AnimatePresence>
        {hovered && (
          <motion.div 
            className="mt-2 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className={`h-full ${
                isPositive ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'
              }`}
              initial={{ width: '0%' }}
              animate={{ width: '60%' }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveDataPoint;