import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Clock, BarChart, Shield, Award, Star } from 'lucide-react';

// Brand logos (simulated with colored squares for now)
const brandLogos = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  color: `hsl(${Math.random() * 360}, 70%, 60%)`,
}));

interface CatalogShowcaseProps {
  isPreowned?: boolean;
}

const CatalogShowcase: React.FC<CatalogShowcaseProps> = ({ isPreowned = false }) => {
  const [vehicleCount, setVehicleCount] = useState(0);
  const targetCount = isPreowned ? 25000 : 50000;
  const countRef = useRef<NodeJS.Timeout | null>(null);
  const [brandIndex, setBrandIndex] = useState(0);
  
  // Animated counter effect
  useEffect(() => {
    countRef.current = setInterval(() => {
      setVehicleCount(prev => {
        if (prev >= targetCount) {
          if (countRef.current) clearInterval(countRef.current);
          return targetCount;
        }
        const increment = Math.max(1, Math.floor((targetCount - prev) / 20));
        return prev + increment;
      });
    }, 20);
    
    return () => {
      if (countRef.current) clearInterval(countRef.current);
    };
  }, []);

  // Brand logo carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBrandIndex(prev => (prev + 1) % brandLogos.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Visible brands in carousel
  const visibleBrands = Array.from({ length: 8 }).map((_, i) => 
    brandLogos[(brandIndex + i) % brandLogos.length]
  );

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${isPreowned ? 'preowned-theme' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 md:p-8">
        <h2 className={`text-2xl font-bold text-center mb-8 ${isPreowned ? 'text-amber-600' : 'text-blue-600'}`}>
          {isPreowned ? "India's Trusted Pre-owned Vehicle Collection" : "India's Largest Vehicle Catalog"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Vehicle Count */}
          <div className="flex flex-col items-center text-center">
            <div className={`mb-4 p-3 rounded-full ${isPreowned ? 'bg-amber-100' : 'bg-blue-100'}`}>
              <Database className={`h-6 w-6 ${isPreowned ? 'text-amber-600' : 'text-blue-600'}`} />
            </div>
            <div className={`text-3xl font-bold mb-1 ${isPreowned ? 'text-amber-600' : 'text-blue-600'}`}>
              {vehicleCount.toLocaleString()}+
            </div>
            <p className="text-neutral-500 text-sm">
              {isPreowned ? 'Verified pre-owned vehicles' : 'Vehicles in catalog'}
            </p>
          </div>
          
          {isPreowned ? (
            // Pre-owned certification stat
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 bg-orange-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-1">
                100%
              </div>
              <p className="text-neutral-500 text-sm">Certified & inspected</p>
            </div>
          ) : (
            // Brand Count
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 bg-purple-100 p-3 rounded-full">
                <BarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-1">
                200+
              </div>
              <p className="text-neutral-500 text-sm">Brands covered</p>
            </div>
          )}
          
          {isPreowned ? (
            // Warranty for pre-owned
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 bg-amber-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-3xl font-bold text-amber-600 mb-1">
                1 Year+
              </div>
              <p className="text-neutral-500 text-sm">Extended warranty available</p>
            </div>
          ) : (
            // Comparison stat
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 bg-emerald-100 p-3 rounded-full">
                <BarChart className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-1">
                3X
              </div>
              <p className="text-neutral-500 text-sm">More models than competitors</p>
            </div>
          )}
          
          {/* Update frequency */}
          <div className="flex flex-col items-center text-center">
            <div className={`mb-4 p-3 rounded-full ${isPreowned ? 'bg-orange-100' : 'bg-amber-100'}`}>
              <Clock className={`h-6 w-6 ${isPreowned ? 'text-orange-600' : 'text-amber-600'}`} />
            </div>
            <div className={`text-sm text-white px-3 py-1 rounded-full mb-1 ${isPreowned ? 'bg-orange-600' : 'bg-amber-600'}`}>
              Updated daily
            </div>
            <p className="text-neutral-500 text-sm">Last update: Today, 08:30 AM</p>
          </div>
        </div>
        
        {/* Brand logos carousel */}
        <div className="mt-10 overflow-hidden">
          <h3 className="text-center text-sm font-medium text-neutral-500 uppercase tracking-wide mb-5">
            {isPreowned ? "Extensive Brand Selection" : "200+ Brands Available"}
          </h3>
          <div className="flex justify-center gap-4 py-2">
            {visibleBrands.map((brand, i) => (
              <motion.div 
                key={`${brand.id}-${i}`}
                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                style={{ backgroundColor: brand.color }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white font-bold">
                  {String.fromCharCode(65 + brand.id % 26)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        
        {isPreowned ? (
          // Pre-owned reliability metrics
          <div className="mt-10">
            <h3 className="text-center text-sm font-medium text-neutral-500 uppercase tracking-wide mb-5">
              Verified Pre-owned Quality Metrics
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Verified History', percentage: 100, color: 'bg-amber-500' },
                { name: 'Service Records', percentage: 95, color: 'bg-orange-500' },
                { name: 'Ownership Status', percentage: 100, color: 'bg-amber-600' },
                { name: 'Inspection Score', percentage: 90, color: 'bg-orange-600' },
                { name: 'Accident History', percentage: 100, color: 'bg-amber-700' },
                { name: 'Engine Health', percentage: 90, color: 'bg-orange-700' },
                { name: 'Value Analysis', percentage: 100, color: 'bg-amber-800' },
                { name: 'Financial Clear', percentage: 95, color: 'bg-orange-800' },
              ].map((category, i) => (
                <div key={i} className="flex flex-col">
                  <div className="text-xs text-neutral-500 mb-1 flex justify-between">
                    <span>{category.name}</span>
                    <span>{category.percentage}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${category.color}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // New vehicle coverage infographic
          <div className="mt-10">
            <h3 className="text-center text-sm font-medium text-neutral-500 uppercase tracking-wide mb-5">
              Complete Vehicle Coverage
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Two Wheelers', percentage: 85, color: 'bg-red-500' },
                { name: 'Cars & SUVs', percentage: 95, color: 'bg-blue-500' },
                { name: 'Commercial', percentage: 80, color: 'bg-green-500' },
                { name: 'Electric', percentage: 90, color: 'bg-purple-500' },
                { name: 'Luxury', percentage: 75, color: 'bg-amber-500' },
                { name: 'Three Wheelers', percentage: 70, color: 'bg-emerald-500' },
                { name: 'Buses', percentage: 65, color: 'bg-indigo-500' },
                { name: 'Construction', percentage: 60, color: 'bg-pink-500' },
              ].map((category, i) => (
                <div key={i} className="flex flex-col">
                  <div className="text-xs text-neutral-500 mb-1 flex justify-between">
                    <span>{category.name}</span>
                    <span>{category.percentage}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${category.color}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CatalogShowcase;