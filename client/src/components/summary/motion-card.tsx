import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const MotionCard: React.FC<MotionCardProps> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  return (
    <motion.div
      className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
};

export const MotionCardHeader: React.FC<{ 
  title: string; 
  subtitle?: string; 
  icon?: ReactNode;
  className?: string;
}> = ({ title, subtitle, icon, className = "" }) => {
  return (
    <motion.div 
      className={`p-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export const MotionValue: React.FC<{ 
  value: string | number;
  label?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  valueSize?: 'sm' | 'md' | 'lg' | 'xl';
  accentColor?: string;
}> = ({ 
  value, 
  label, 
  trend, 
  className = "",
  valueSize = "lg",
  accentColor = "text-indigo-600 dark:text-indigo-400"
}) => {
  const valueSizeClass = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl"
  }[valueSize];

  const trendIcon = {
    up: (
      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    )
  };

  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
    >
      <div className="flex items-end gap-2">
        <span className={`font-bold ${valueSizeClass} ${accentColor}`}>{value}</span>
        {trend && <span className="mb-1">{trendIcon[trend]}</span>}
      </div>
      {label && <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">{label}</p>}
    </motion.div>
  );
};

export const MotionBadge: React.FC<{ 
  children: ReactNode;
  color?: string;
  className?: string;
}> = ({ 
  children, 
  color = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", 
  className = "" 
}) => {
  return (
    <motion.span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
    >
      {children}
    </motion.span>
  );
};

export const AnimatedProgressBar: React.FC<{
  value: number;
  max: number;
  colorClass?: string;
  height?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}> = ({
  value,
  max,
  colorClass = "bg-indigo-500",
  height = 8,
  label,
  showValue = false,
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div 
        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}
        style={{ height: `${height}px` }}
      >
        <motion.div
          className={`${colorClass} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            type: "spring", 
            stiffness: 60, 
            damping: 15, 
            delay: 0.1 
          }}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};