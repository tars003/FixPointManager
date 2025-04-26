import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

// Define the performance metric type
interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  description: string;
  threshold: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
}

interface ColorCodedMetricsProps {
  metrics: PerformanceMetric[];
  className?: string;
}

const ColorCodedMetrics: React.FC<ColorCodedMetricsProps> = ({ metrics, className }) => {
  // Function to determine color based on thresholds
  const getMetricColor = (metric: PerformanceMetric) => {
    const { value, threshold } = metric;
    
    if (value >= threshold.excellent) return 'bg-green-500';
    if (value >= threshold.good) return 'bg-teal-500';
    if (value >= threshold.average) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Function to determine text color based on thresholds
  const getMetricTextColor = (metric: PerformanceMetric) => {
    const { value, threshold } = metric;
    
    if (value >= threshold.excellent) return 'text-green-700';
    if (value >= threshold.good) return 'text-teal-700';
    if (value >= threshold.average) return 'text-amber-700';
    return 'text-red-700';
  };
  
  // Function to get rating text
  const getRatingText = (metric: PerformanceMetric) => {
    const { value, threshold } = metric;
    
    if (value >= threshold.excellent) return 'Excellent';
    if (value >= threshold.good) return 'Good';
    if (value >= threshold.average) return 'Average';
    return 'Needs Improvement';
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Performance Metrics</CardTitle>
        <CardDescription>
          Color-coded visualization of key vehicle performance indicators
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => (
          <motion.div 
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{metric.name}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-neutral-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{metric.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${getMetricTextColor(metric)}`}>
                  {metric.value} {metric.unit}
                </span>
                <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full">
                  {getRatingText(metric)}
                </span>
              </div>
            </div>
            
            <div className="relative">
              <Progress 
                value={(metric.value / metric.threshold.excellent) * 100} 
                className="h-2 bg-neutral-100"
                indicatorClassName={getMetricColor(metric)}
              />
              
              {/* Threshold markers */}
              <div className="w-full flex justify-between mt-1">
                <span className="text-[10px] text-neutral-500">0</span>
                <span 
                  className="text-[10px] text-amber-500 absolute"
                  style={{ 
                    left: `${(metric.threshold.average / metric.threshold.excellent) * 100}%`,
                    transform: 'translateX(-50%)' 
                  }}
                >
                  |
                </span>
                <span 
                  className="text-[10px] text-teal-500 absolute"
                  style={{ 
                    left: `${(metric.threshold.good / metric.threshold.excellent) * 100}%`,
                    transform: 'translateX(-50%)' 
                  }}
                >
                  |
                </span>
                <span className="text-[10px] text-green-500">Max</span>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ColorCodedMetrics;