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
import ContentReaction from '@/components/ui/content-reaction';
import FeedbackButton from '@/components/ui/feedback-button';

const TestBeforeBuy: React.FC = () => {
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
                TestBeforeBuy
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
        
        {/* Feedback button (floating) */}
        <FeedbackButton 
          contentId="autovista-main"
          contentType="feature"
          position="bottom-right"
          variant="pill"
        />
        
        {/* Page section reactions */}
        <div className="mt-12 border-t border-neutral-200 pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-1">How was your experience with AutoVista?</h3>
              <p className="text-neutral-500">Your feedback helps us improve our platform.</p>
            </div>
            <ContentReaction 
              contentId="autovista-overall"
              contentType="feature"
              variant="standard"
              showCount={true}
              enableComments={true}
              className="mt-2 md:mt-0"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-5">
              <h4 className="text-lg font-medium mb-3">Vehicle Discovery</h4>
              <p className="text-neutral-600 text-sm mb-4">
                Rate our vehicle search and filtering functionality
              </p>
              <ContentReaction 
                contentId="autovista-discovery" 
                contentType="feature"
                variant="minimal"
              />
            </div>
            
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-5">
              <h4 className="text-lg font-medium mb-3">Comparison Tool</h4>
              <p className="text-neutral-600 text-sm mb-4">
                How useful was our vehicle comparison tool?
              </p>
              <ContentReaction 
                contentId="autovista-comparison" 
                contentType="feature"
                variant="minimal"
              />
            </div>
            
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-5">
              <h4 className="text-lg font-medium mb-3">Financial Tools</h4>
              <p className="text-neutral-600 text-sm mb-4">
                Rate our loan calculator and financial assistance tools
              </p>
              <ContentReaction 
                contentId="autovista-financial" 
                contentType="feature"
                variant="minimal"
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default TestBeforeBuy;