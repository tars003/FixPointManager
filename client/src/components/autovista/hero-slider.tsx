import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Percent, Car, Award, Shield, Clock, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSliderProps {
  isPreowned?: boolean;
}

type SlideType = 'newLaunches' | 'seasonalOffers' | 'electricRevolution' | 'categorySpotlight' | 'certifiedPreowned' | 'warrantySpecials' | 'budgetFriendly';

interface Slide {
  type: SlideType;
  title: string;
  subtitle: string;
  description: string;
  bgColor: string;
  icon: React.ReactNode;
  ctaText: string;
  ctaAction: () => void;
}

const sliderData: Slide[] = [
  {
    type: 'newLaunches',
    title: 'Discover Latest Launches',
    subtitle: 'Be the first to explore',
    description: 'Experience the newest vehicles across all categories with exclusive early access and detailed specifications.',
    bgColor: 'from-blue-600 to-blue-900',
    icon: <Car size={48} className="text-white" />,
    ctaText: 'Explore First',
    ctaAction: () => console.log('Exploring new launches'),
  },
  {
    type: 'seasonalOffers',
    title: 'Seasonal Promotions',
    subtitle: 'Limited time offers',
    description: 'Take advantage of special manufacturer promotions and discounts available exclusively this season.',
    bgColor: 'from-amber-500 to-red-600',
    icon: <Percent size={48} className="text-white" />,
    ctaText: 'View Offers',
    ctaAction: () => console.log('Viewing seasonal offers'),
  },
  {
    type: 'electricRevolution',
    title: 'Electric Revolution',
    subtitle: 'Future of mobility',
    description: 'Explore India\'s growing electric vehicle ecosystem with detailed range, charging, and cost analysis.',
    bgColor: 'from-emerald-500 to-emerald-800',
    icon: <Zap size={48} className="text-white" />,
    ctaText: 'Discover EVs',
    ctaAction: () => console.log('Discovering electric vehicles'),
  },
  {
    type: 'categorySpotlight',
    title: 'SUV Showcase',
    subtitle: 'Category of the Month',
    description: 'Deep dive into India\'s most popular SUVs with comparisons, features, and ownership experiences.',
    bgColor: 'from-purple-600 to-indigo-900',
    icon: <Award size={48} className="text-white" />,
    ctaText: 'Explore Category',
    ctaAction: () => console.log('Exploring SUV category'),
  },
];

// Pre-owned vehicle slides
const preownedSliderData: Slide[] = [
  {
    type: 'certifiedPreowned',
    title: 'Certified Pre-owned Collection',
    subtitle: 'Quality assured',
    description: 'Browse our collection of certified pre-owned vehicles that undergo rigorous inspections and come with extended warranties.',
    bgColor: 'from-amber-500 to-orange-700',
    icon: <Shield size={48} className="text-white" />,
    ctaText: 'View Certified Vehicles',
    ctaAction: () => console.log('Viewing certified pre-owned vehicles'),
  },
  {
    type: 'warrantySpecials',
    title: 'Extended Warranty Offers',
    subtitle: 'Peace of mind ownership',
    description: 'Exclusive extended warranty packages available on select pre-owned vehicles for worry-free ownership experience.',
    bgColor: 'from-orange-500 to-red-600',
    icon: <Clock size={48} className="text-white" />,
    ctaText: 'Explore Warranty Options',
    ctaAction: () => console.log('Exploring warranty options'),
  },
  {
    type: 'budgetFriendly',
    title: 'Budget-Friendly Options',
    subtitle: 'Value that exceeds price',
    description: 'Discover high-value pre-owned vehicles across all price ranges with complete history and maintenance records.',
    bgColor: 'from-amber-600 to-amber-900',
    icon: <Medal size={48} className="text-white" />,
    ctaText: 'Find Your Match',
    ctaAction: () => console.log('Finding budget-friendly options'),
  },
  {
    type: 'seasonalOffers',
    title: 'Seasonal Pre-owned Deals',
    subtitle: 'Limited time specials',
    description: 'Take advantage of exclusive seasonal discounts and financing options on select pre-owned vehicles.',
    bgColor: 'from-yellow-500 to-orange-700',
    icon: <Percent size={48} className="text-white" />,
    ctaText: 'View Deals',
    ctaAction: () => console.log('Viewing pre-owned deals'),
  },
];

const HeroSlider: React.FC<HeroSliderProps> = ({ isPreowned = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Select the appropriate slider data based on isPreowned prop
  const activeSliderData = isPreowned ? preownedSliderData : sliderData;

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, isAnimating]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative overflow-hidden rounded-xl h-[450px] w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className={`absolute inset-0 bg-gradient-to-r ${sliderData[currentSlide].bgColor} p-8 md:p-12 flex flex-col justify-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative z-10 max-w-3xl">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              {sliderData[currentSlide].icon}
            </motion.div>
            
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-sm font-medium uppercase tracking-wider mb-2"
            >
              {sliderData[currentSlide].subtitle}
            </motion.h3>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white text-4xl md:text-5xl font-bold mb-4"
            >
              {sliderData[currentSlide].title}
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-lg mb-8 max-w-2xl"
            >
              {sliderData[currentSlide].description}
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                size="lg" 
                variant="secondary"
                className="font-medium"
                onClick={sliderData[currentSlide].ctaAction}
              >
                {sliderData[currentSlide].ctaText}
              </Button>
            </motion.div>
          </div>
          
          {/* Particle effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="particles-container">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 md:w-2 md:h-2 rounded-full bg-white/20"
                  initial={{ 
                    x: Math.random() * 100 - 50 + "%", 
                    y: Math.random() * 100 - 50 + "%",
                    opacity: 0.1
                  }}
                  animate={{ 
                    x: [
                      Math.random() * 100 - 50 + "%",
                      Math.random() * 100 - 50 + "%",
                      Math.random() * 100 - 50 + "%"
                    ],
                    y: [
                      Math.random() * 100 - 50 + "%",
                      Math.random() * 100 - 50 + "%",
                      Math.random() * 100 - 50 + "%"
                    ],
                    opacity: [0.1, 0.4, 0.1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: Math.random() * 10 + 10,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all z-20"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all z-20"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {sliderData.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 scale-100'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;