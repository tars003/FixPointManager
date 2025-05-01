import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface BannerSliderProps {
  slides: Slide[];
  autoSlideInterval?: number;
  className?: string;
}

const BannerSlider: React.FC<BannerSliderProps> = ({ 
  slides, 
  autoSlideInterval = 5000,
  className = '' 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();
  const [isPaused, setIsPaused] = useState(false);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-slide effect
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const interval = setInterval(goToNextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [currentSlide, autoSlideInterval, isPaused, slides.length]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0.5, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.5, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full relative"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
          
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 lg:px-20">
            <div className="max-w-3xl text-white">
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {slides[currentSlide].title}
              </motion.h2>
              
              <motion.p 
                className="text-lg md:text-xl opacity-90 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {slides[currentSlide].description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-8 py-2 font-medium text-md"
                  onClick={() => setLocation(slides[currentSlide].buttonLink)}
                >
                  {slides[currentSlide].buttonText}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Arrows */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white/30 transition-colors"
        onClick={goToPrevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white/30 transition-colors"
        onClick={goToNextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-30">
        <div className="h-full bg-white/20"></div>
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-600"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ 
            duration: autoSlideInterval / 1000,
            ease: 'linear',
            repeat: slides.length > 1 ? Infinity : 0,
            repeatType: 'loop'
          }}
          style={{ 
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        ></motion.div>
      </div>
    </div>
  );
};

export default BannerSlider;