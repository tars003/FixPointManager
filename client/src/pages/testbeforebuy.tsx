import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HeroSlider from '@/components/testbeforebuy/hero-slider';
import CatalogShowcase from '@/components/testbeforebuy/catalog-showcase';
import VehicleDiscovery from '@/components/testbeforebuy/vehicle-discovery';
import VehicleAdvisor from '@/components/testbeforebuy/vehicle-advisor';
import ComparisonTool from '@/components/testbeforebuy/comparison-tool';
import SalesElements from '@/components/testbeforebuy/sales-elements';
import PlatformComparison from '@/components/testbeforebuy/platform-comparison';
import PageTransition from '@/components/transitions/page-transition';
import ContentReaction from '@/components/ui/content-reaction';
import FeedbackButton from '@/components/ui/feedback-button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CarFront, CarIcon } from 'lucide-react';

const TestBeforeBuy: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<'new' | 'preowned'>('new');
  
  return (
    <PageTransition type="fade">
      <div className={`w-full max-w-7xl mx-auto px-4 py-6 ${vehicleType === 'preowned' ? 'preowned-theme' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${
                vehicleType === 'new' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent'
              }`}>
                TestBeforeBuy
              </h1>
              <p className="text-neutral-500 mt-2">
                Discover, compare & book test drives for your next perfect vehicle
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Tabs 
                value={vehicleType} 
                onValueChange={(v) => setVehicleType(v as 'new' | 'preowned')}
                className="border rounded-lg p-1 bg-white"
              >
                <TabsList className="grid grid-cols-2 h-9">
                  <TabsTrigger value="new" className="flex items-center gap-2 text-xs">
                    <CarFront className="h-3.5 w-3.5" />
                    <span>New</span>
                  </TabsTrigger>
                  <TabsTrigger value="preowned" className="flex items-center gap-2 text-xs">
                    <CarIcon className="h-3.5 w-3.5" />
                    <span>Pre-owned</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <HeroSlider isPreowned={vehicleType === 'preowned'} />
        </motion.div>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CatalogShowcase 
              isPreowned={vehicleType === 'preowned'} 
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <VehicleDiscovery 
              isPreowned={vehicleType === 'preowned'}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ComparisonTool 
              isPreowned={vehicleType === 'preowned'}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className={`text-2xl font-bold mb-6 ${
              vehicleType === 'new'
                ? 'text-blue-700'
                : 'text-amber-700'
            }`}>
              {vehicleType === 'new' ? 'Ownership & Purchase Support' : 'Pre-owned Vehicle Assurance'}
            </h2>
            <SalesElements 
              isPreowned={vehicleType === 'preowned'}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <PlatformComparison 
              isPreowned={vehicleType === 'preowned'}
            />
          </motion.div>
        </div>
        
        {/* Vehicle Advisor AI Assistant (floating) */}
        <VehicleAdvisor />
        
        {/* Feedback button (floating) */}
        <FeedbackButton 
          contentId="testbeforebuy-main"
          contentType="feature"
          position="bottom-right"
          variant="pill"
        />
        
        {/* Page section reactions */}
        <div className="mt-12 border-t border-neutral-200 pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-1">How was your experience with TestBeforeBuy?</h3>
              <p className="text-neutral-500">Your feedback helps us improve our vehicle discovery platform.</p>
            </div>
            <ContentReaction 
              contentId="testbeforebuy-overall"
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
                contentId="testbeforebuy-discovery" 
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
                contentId="testbeforebuy-comparison" 
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
                contentId="testbeforebuy-financial" 
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