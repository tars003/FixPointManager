import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedBarChartProps {
  data: DataPoint[];
  height?: number;
  showValues?: boolean;
  showLabels?: boolean;
  maxValue?: number; // Optional manual max value
  className?: string;
  valueFormatter?: (value: number) => string;
  horizontal?: boolean;
  title?: string;
  subtitle?: string;
}

/**
 * AnimatedBarChart - A visually appealing animated bar chart component
 */
const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  data,
  height = 200,
  showValues = true,
  showLabels = true,
  maxValue,
  className,
  valueFormatter = (value) => value.toString(),
  horizontal = false,
  title,
  subtitle,
}) => {
  // Calculate the maximum value in the data set if not provided
  const calculatedMax = maxValue || Math.max(...data.map(item => item.value), 10);
  
  // Default colors for bars
  const defaultColors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-green-500',
    'bg-emerald-500',
  ];

  return (
    <div className={cn("w-full p-4", className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-sm font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className={cn("w-full", horizontal ? "flex items-end" : "h-full")}>
        {horizontal ? (
          // Horizontal bar chart
          <div className="w-full space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {showLabels && (
                  <div className="w-20 text-xs text-gray-600 text-right truncate">
                    {item.label}
                  </div>
                )}
                <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden relative">
                  <motion.div
                    className={cn("h-full absolute left-0 top-0", item.color || defaultColors[index % defaultColors.length])}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / calculatedMax) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  />
                  {showValues && (
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <span className="text-xs font-medium text-gray-900">
                        {valueFormatter(item.value)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Vertical bar chart
          <div 
            className="flex items-end justify-around h-full gap-1 relative"
            style={{ height: `${height}px` }}
          >
            {/* Optional grid lines */}
            <div className="absolute inset-x-0 inset-y-0">
              {[0.25, 0.5, 0.75, 1].map((fraction) => (
                <div 
                  key={fraction}
                  className="absolute border-t border-gray-100 w-full"
                  style={{ top: `${(1 - fraction) * 100}%` }}
                />
              ))}
            </div>
            
            {data.map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center justify-end flex-1 px-1"
              >
                {showValues && (
                  <div className="text-xs text-gray-600 mb-1">
                    {valueFormatter(item.value)}
                  </div>
                )}
                <motion.div
                  className={cn("w-full rounded-t-md", item.color || defaultColors[index % defaultColors.length])}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.value / calculatedMax) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  whileHover={{ filter: "brightness(1.1)" }}
                />
                {showLabels && (
                  <div className="text-xs text-gray-600 mt-1 truncate" style={{ maxWidth: '100%' }}>
                    {item.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedBarChart;