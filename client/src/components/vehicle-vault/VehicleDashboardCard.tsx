import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface VehicleDashboardCardProps {
  vehicle: string;
  registrationNumber: string;
  fuelType: string;
  serviceStatus: 'up_to_date' | 'due' | 'overdue';
  healthPercentage: number;
  lastUpdated: Date;
  status: string;
}

const statusColors: Record<string, string> = {
  'Active': 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  'Recently Purchased': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  'Pre-owned': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  'In Maintenance': 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  'Garage Stored': 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400',
  'Out of Service': 'bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-400',
  'Commercial Fleet': 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  'Leased Out': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  'For Sale': 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
  'Sold': 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
  'Impounded': 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',
  'Under Legal Hold': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  'Stolen': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  'Scrapped': 'bg-gray-50 text-gray-700 dark:bg-gray-800/40 dark:text-gray-400',
  'Totaled': 'bg-stone-50 text-stone-700 dark:bg-stone-800/40 dark:text-stone-400'
};

const VehicleDashboardCard: React.FC<VehicleDashboardCardProps> = ({
  vehicle,
  registrationNumber,
  fuelType,
  serviceStatus,
  healthPercentage,
  lastUpdated,
  status
}) => {
  const fuelBadgeColor = fuelType === 'petrol' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
    : fuelType === 'diesel' 
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  
  const healthBadgeColor = healthPercentage >= 90 
    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
    : healthPercentage >= 70 
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  
  return (
    <motion.div 
      className="bg-gray-50 dark:bg-slate-800/50 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-700/50"
      whileHover={{ y: -4, boxShadow: '0 12px 20px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative p-4 flex items-center justify-between">
        <div className="h-14 w-14 bg-gray-200 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
          <svg className="h-8 w-8 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2zm0 0v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3M18 21h2a2 2 0 0 0 2-2v-5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="7" cy="17" r="1"/>
            <circle cx="16" cy="17" r="1"/>
          </svg>
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge className={`${fuelBadgeColor} rounded-full text-xs px-2 py-0.5`}>
            {fuelType}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3 -mt-6">
          <Badge className={`${statusColors[status] || 'bg-gray-100 text-gray-800'} rounded-full text-xs px-2 py-0.5`}>
            {status}
          </Badge>
        </div>
      </div>
      
      <div className="px-4 pt-1 pb-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{vehicle}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{registrationNumber}</p>
          </div>
          <Badge className={`${healthBadgeColor} rounded-full px-2 py-0.5`}>{healthPercentage}%</Badge>
        </div>
        
        <div className="flex items-center justify-between text-xs mt-3">
          <div className="flex items-center">
            {serviceStatus === 'up_to_date' ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                <span className="text-green-600 dark:text-green-400">Service up to date</span>
              </>
            ) : serviceStatus === 'due' ? (
              <>
                <Clock className="h-3.5 w-3.5 text-amber-500 mr-1" />
                <span className="text-amber-600 dark:text-amber-400">Service due</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-red-500 mr-1" />
                <span className="text-red-600 dark:text-red-400">Service overdue</span>
              </>
            )}
          </div>
          <span className="text-gray-400">
            Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleDashboardCard;