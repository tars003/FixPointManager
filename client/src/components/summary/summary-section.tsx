import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Calendar, 
  ChevronRight, 
  Clock, 
  IndianRupee, 
  Wrench 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummarySectionProps {
  navigateTo: (path: string) => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({ navigateTo }) => {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Overall Summary</h2>
        <p className="text-gray-600 max-w-3xl">
          Get a comprehensive view of your vehicles, market trends, and service health at a glance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Trends */}
        <motion.div 
          className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg cursor-pointer transform transition duration-300 overflow-hidden relative"
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => navigateTo('/overall-summary-currentTrends')}
        >
          <div className="flex items-center mb-3">
            <div className="bg-white/20 p-2 rounded-full">
              <BarChart2 className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold">Current Trends</h3>
              <p className="text-xs text-indigo-200">Automotive news & updates</p>
            </div>
          </div>
          <div className="text-sm text-indigo-100 mb-3 line-clamp-2">
            EV Market Growing at 26% CAGR. Electric vehicle adoption surges as new models hit Indian market.
          </div>
          <div className="flex justify-between items-center text-xs text-indigo-200">
            <span className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Updated 3 hours ago
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-white hover:bg-white/20 px-2 py-1">
              View <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
          
          {/* Background decorative elements */}
          <motion.div 
            className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/30 rounded-full"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Vehicle Net Value */}
        <motion.div 
          className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl p-5 text-white shadow-lg cursor-pointer transform transition duration-300 overflow-hidden relative"
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => navigateTo('/overall-summary-vehicle-net-value')}
        >
          <div className="flex items-center mb-3">
            <div className="bg-white/20 p-2 rounded-full">
              <IndianRupee className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold">Vehicle Net Value</h3>
              <p className="text-xs text-blue-200">Market valuation trends</p>
            </div>
          </div>
          <div className="text-3xl font-bold mb-3 text-center">₹32,85,000</div>
          <div className="flex justify-between items-center text-xs text-blue-200">
            <span className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              As of Today
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-white hover:bg-white/20 px-2 py-1">
              View <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
          
          {/* Background decorative elements */}
          <motion.div 
            className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/30 rounded-full"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          />
        </motion.div>
        
        {/* Service Health */}
        <motion.div 
          className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-5 text-white shadow-lg cursor-pointer transform transition duration-300 overflow-hidden relative"
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => navigateTo('/overall-summary-servicehealth')}
        >
          <div className="flex items-center mb-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold">Service Health</h3>
              <p className="text-xs text-emerald-200">Vehicle maintenance status</p>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex flex-col items-center">
              <div className="bg-emerald-500 rounded-full w-10 h-10 flex items-center justify-center mb-1">
                <span className="font-bold">2</span>
              </div>
              <span className="text-xs text-emerald-200">Complete</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-amber-500 rounded-full w-10 h-10 flex items-center justify-center mb-1">
                <span className="font-bold">1</span>
              </div>
              <span className="text-xs text-emerald-200">Due Soon</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-rose-500 rounded-full w-10 h-10 flex items-center justify-center mb-1">
                <span className="font-bold">0</span>
              </div>
              <span className="text-xs text-emerald-200">Overdue</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-emerald-200">
            <span className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Next 60 Days
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-white hover:bg-white/20 px-2 py-1">
              View <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
          
          {/* Background decorative elements */}
          <motion.div 
            className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-500/30 rounded-full"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 9, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default SummarySection;