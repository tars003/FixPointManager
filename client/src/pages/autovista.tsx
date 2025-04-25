import React from 'react';
import { motion } from 'framer-motion';
import HeroSlider from '@/components/autovista/hero-slider';
import CatalogShowcase from '@/components/autovista/catalog-showcase';
import VehicleDiscovery from '@/components/autovista/vehicle-discovery';
import VehicleAdvisor from '@/components/autovista/vehicle-advisor';
import ComparisonTool from '@/components/autovista/comparison-tool';
import SalesElements from '@/components/autovista/sales-elements';
import PlatformComparison from '@/components/autovista/platform-comparison';
import PageTransition from '@/components/transitions/page-transition';

const AutoVista: React.FC = () => {
  return (
    <PageTransition type="fade">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent">
                AutoVista
              </h1>
              <p className="text-neutral-500 mt-2">
                India's largest vehicle discovery & comparison platform
              </p>
            </div>
          </div>
          
          <HeroSlider />
        </motion.div>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CatalogShowcase />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <VehicleDiscovery />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ComparisonTool />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6">Ownership & Purchase Support</h2>
            <SalesElements />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <PlatformComparison />
          </motion.div>
        </div>
        
        {/* Vehicle Advisor AI Assistant (floating) */}
        <VehicleAdvisor />
      </div>
    </PageTransition>
  );
};

export default AutoVista;