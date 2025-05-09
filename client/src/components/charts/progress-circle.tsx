import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  circleClassName?: string;
  valueFormatter?: (value: number) => string;
  label?: string;
  color?: string;
  showValue?: boolean;
  animate?: boolean;
  Icon?: React.ReactNode;
}

/**
 * ProgressCircle - An animated circular progress chart
 */
const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 8,
  className,
  circleClassName,
  valueFormatter = (value) => `${value}%`,
  label,
  color = 'text-blue-500',
  showValue = true,
  animate = true,
  Icon,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Normalize value between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  // Animate value if enabled
  useEffect(() => {
    if (!animate) {
      setDisplayValue(normalizedValue);
      return;
    }
    
    const timer = setTimeout(() => {
      let startValue = 0;
      const endValue = normalizedValue;
      const duration = 1500;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      const increment = endValue / totalFrames;
      
      const counter = setInterval(() => {
        startValue += increment;
        setDisplayValue(Math.min(Math.floor(startValue), endValue));
        
        if (startValue >= endValue) {
          clearInterval(counter);
          setDisplayValue(endValue);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [normalizedValue, animate]);
  
  // Calculate circle props
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;
  
  // Get color class for indicator
  const getColorClass = () => {
    if (color) return color;
    
    if (normalizedValue >= 80) return 'text-emerald-500';
    if (normalizedValue >= 60) return 'text-blue-500';
    if (normalizedValue >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-100"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: animate ? 1.5 : 0, ease: "easeOut" }}
            className={cn(getColorClass(), circleClassName)}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {Icon && <div className="mb-1">{Icon}</div>}
          {showValue && (
            <div className="text-xl font-bold text-gray-800">
              {valueFormatter(value)}
            </div>
          )}
          {label && <div className="text-xs text-gray-500">{label}</div>}
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle;