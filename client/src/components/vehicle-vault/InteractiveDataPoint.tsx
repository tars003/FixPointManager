import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface InteractiveDataPointProps {
  label: string;
  value: string | number;
  unit?: string;
  info?: string;
  trend?: 'up' | 'down' | 'neutral' | 'warning' | 'good';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showPulse?: boolean;
}

const InteractiveDataPoint = ({
  label,
  value,
  unit = '',
  info,
  trend = 'neutral',
  size = 'md',
  variant = 'default',
  showPulse = false,
}: InteractiveDataPointProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeClasses = {
    sm: {
      container: 'p-2 text-xs',
      value: 'text-sm font-medium',
      icon: 'h-3 w-3',
    },
    md: {
      container: 'p-3 text-sm',
      value: 'text-base font-semibold',
      icon: 'h-4 w-4',
    },
    lg: {
      container: 'p-4 text-base',
      value: 'text-xl font-bold',
      icon: 'h-5 w-5',
    },
  };
  
  const variantClasses = {
    default: 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700',
    outline: 'border border-slate-200 dark:border-slate-700',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800',
  };
  
  const getTrendIcon = () => {
    const colors = {
      up: 'text-green-500',
      down: 'text-red-500',
      neutral: 'text-slate-400',
      warning: 'text-amber-500',
      good: 'text-emerald-500',
    };
    
    const iconClass = `${sizeClasses[size].icon} ${colors[trend]}`;
    
    switch (trend) {
      case 'up':
        return <TrendingUp className={iconClass} />;
      case 'down':
        return <TrendingDown className={iconClass} />;
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      case 'good':
        return <CheckCircle2 className={iconClass} />;
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      className={`relative rounded-lg ${variantClasses[variant]} ${sizeClasses[size].container} transition-all duration-200 overflow-hidden`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {showPulse && (
        <span className="absolute top-1 right-1">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${trend === 'warning' ? 'bg-amber-400' : trend === 'down' ? 'bg-red-400' : 'bg-green-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${trend === 'warning' ? 'bg-amber-500' : trend === 'down' ? 'bg-red-500' : 'bg-green-500'}`}></span>
          </span>
        </span>
      )}
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">{label}</span>
          {info && (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: isHovered ? 1 : 0.6 }}
                    className="text-slate-400 dark:text-slate-500 cursor-help ml-1"
                  >
                    <InfoIcon className="h-3 w-3" />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {info}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="flex items-center mt-1 gap-1.5">
          <span className={sizeClasses[size].value}>
            {value}
            {unit && <span className="ml-1 text-slate-500 text-xs">{unit}</span>}
          </span>
          {getTrendIcon()}
        </div>
      </div>
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-slate-700/20 to-transparent"
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: isHovered ? '100%' : '-100%', opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

export default InteractiveDataPoint;