import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import { cn } from '@/lib/utils';

type VehicleItem = {
  id: number;
  vehicle: string;
  worth: number;
  fuelType: string;
};

interface VehiclePortfolioValueProps {
  vehicles: VehicleItem[];
}

const VehiclePortfolioValue: React.FC<VehiclePortfolioValueProps> = ({ vehicles }) => {
  const [totalValue, setTotalValue] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);
  const [showedValues, setShowedValues] = useState<boolean[]>(Array(vehicles.length).fill(false));

  // Format currency in Indian Rupees
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace('₹', '₹');
  };

  // Calculate total value
  useEffect(() => {
    const total = vehicles.reduce((acc, vehicle) => acc + vehicle.worth, 0);
    setTotalValue(total);
  }, [vehicles]);

  // Animate total value counter
  useEffect(() => {
    const duration = 1500;
    const interval = 20;
    const steps = duration / interval;
    const increment = totalValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalValue) {
        setDisplayValue(totalValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [totalValue]);

  // Animate showing individual values sequentially
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < vehicles.length) {
        setShowedValues(prev => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    
    return () => clearInterval(interval);
  }, [vehicles.length]);

  // Get fuel type color
  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case 'electric':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'petrol':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'diesel':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'cng':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'lpg':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'hybrid':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900 text-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-2">Vehicle Portfolio Value</h2>
      <p className="text-slate-400 text-sm mb-4">Total estimated value of your vehicles</p>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl font-bold text-green-400 mb-6"
      >
        {formatCurrency(displayValue)}
      </motion.div>
      
      <div className="space-y-3">
        {vehicles.map((vehicle, index) => (
          <motion.div 
            key={vehicle.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: showedValues[index] ? 1 : 0,
              x: showedValues[index] ? 0 : -20
            }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                <Car className="w-4 h-4 text-slate-400" />
              </div>
              <span className="font-medium">{vehicle.vehicle}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("px-2 py-0.5 text-xs rounded-full", getFuelTypeColor(vehicle.fuelType))}>
                {vehicle.fuelType}
              </span>
              <span className="font-semibold">{formatCurrency(vehicle.worth)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default VehiclePortfolioValue;