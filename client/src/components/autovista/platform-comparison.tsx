import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Trophy, Check, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface ComparisonItem {
  feature: string;
  autovista: string | number;
  competitors: string | number;
  advantageText: string;
}

const comparisonData: ComparisonItem[] = [
  {
    feature: 'Catalog Size',
    autovista: '50,000+ vehicles',
    competitors: '15,000-20,000 vehicles',
    advantageText: '3X larger catalog'
  },
  {
    feature: 'Comparison Depth',
    autovista: '300+ data points',
    competitors: '50-100 data points',
    advantageText: '3-6X more detailed comparisons'
  },
  {
    feature: 'Vehicle Types',
    autovista: 'All 8 categories',
    competitors: '2-3 categories',
    advantageText: 'Complete coverage'
  },
  {
    feature: 'AI Recommendation',
    autovista: 'Personalized matching',
    competitors: 'Basic filters',
    advantageText: 'Tailored to your needs'
  },
  {
    feature: 'Information Accuracy',
    autovista: 'Daily updates',
    competitors: 'Monthly updates',
    advantageText: 'Always up-to-date'
  }
];

// Testimonials
const testimonials = [
  {
    name: 'Rahul M.',
    avatar: 'RM',
    vehicle: 'Purchased Kia Seltos',
    comment: 'AutoVista saved me so much time. I compared 5 SUVs easily and found the perfect one for my family.',
    rating: 5
  },
  {
    name: 'Priya S.',
    avatar: 'PS',
    vehicle: 'Researching EVs',
    comment: 'The detailed EV comparisons helped me understand range, charging, and costs. Made my decision easy!',
    rating: 5
  },
  {
    name: 'Amit K.',
    avatar: 'AK',
    vehicle: 'Bought Tata Nexon',
    comment: 'The financial calculator was spot-on. My EMI is exactly what AutoVista predicted.',
    rating: 4
  }
];

const PlatformComparison: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const controls = useAnimation();
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-3 mb-10">
          <div className="bg-amber-100 p-3 rounded-full">
            <Trophy className="h-8 w-8 text-amber-600" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-center md:text-left">
              Why AutoVista is India's #1 Vehicle Discovery Platform
            </h2>
          </div>
        </div>
        
        {/* Comparison Table */}
        <motion.div
          ref={ref}
          className="mb-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-neutral-200">
                  <th className="py-3 text-left font-medium">Feature</th>
                  <th className="py-3 text-left font-medium text-primary">AutoVista</th>
                  <th className="py-3 text-left font-medium text-neutral-500">Other Platforms</th>
                  <th className="py-3 text-left font-medium text-primary">AutoVista Advantage</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <motion.tr
                    key={index}
                    className="border-b border-neutral-100"
                    variants={itemVariants}
                  >
                    <td className="py-4 font-medium">{item.feature}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <motion.div
                          variants={checkmarkVariants}
                          className="bg-green-100 rounded-full p-1"
                        >
                          <Check className="h-3 w-3 text-green-600" />
                        </motion.div>
                        <span>{item.autovista}</span>
                      </div>
                    </td>
                    <td className="py-4 text-neutral-500">{item.competitors}</td>
                    <td className="py-4 text-primary font-medium">{item.advantageText}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* User Testimonials */}
        <div>
          <h3 className="text-lg font-medium mb-6 text-center">What our users are saying</h3>
          
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1 bg-amber-100 rounded-full px-4 py-1">
              <span className="font-bold text-amber-700">4.9</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4"
                    fill="#FFA000"
                    color="#FFA000"
                  />
                ))}
              </div>
              <span className="text-xs text-amber-700">from 12,000+ reviews</span>
            </div>
          </div>
          
          <div className="relative h-64">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                index === activeTestimonial && (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="border rounded-lg p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h4 className="font-medium">{testimonial.name}</h4>
                          <p className="text-xs text-neutral-500">{testimonial.vehicle}</p>
                        </div>
                      </div>
                      
                      <div className="flex mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4"
                            fill={star <= testimonial.rating ? "#FFA000" : "#E5E7EB"}
                            color={star <= testimonial.rating ? "#FFA000" : "#E5E7EB"}
                          />
                        ))}
                      </div>
                      
                      <p className="text-neutral-600 italic flex-grow">
                        "{testimonial.comment}"
                      </p>
                      
                      <div className="flex justify-center gap-2 mt-4">
                        {testimonials.map((_, i) => (
                          <button
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i === activeTestimonial ? 'bg-primary' : 'bg-neutral-200'
                            }`}
                            onClick={() => setActiveTestimonial(i)}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformComparison;