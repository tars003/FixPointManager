import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X, ChevronRight, ChevronLeft, Car, AlertCircle, Check, MessageSquare } from 'lucide-react';
import AutoEmojiHover from '@/components/ui/emoji-hover/auto-emoji-hover';
import AutoEmojiSet from '@/components/ui/emoji-hover/auto-emoji-set';
import confetti from 'canvas-confetti';

// Define tour step type
interface TourStep {
  id: string;
  title: string;
  description: string;
  position: 'bottom' | 'top' | 'left' | 'right' | 'center';
  element?: string; // CSS selector for the target element
  image?: string;
  emoji?: React.ReactNode;
  action?: () => void;
  emojiSet?: string;
  highlight?: boolean;
  featuredVehicle?: {
    name: string;
    image: string;
    features: string[];
    animation?: 'slide' | 'fade' | 'zoom' | 'rotate';
  };
}

interface PremiumVehicleTourProps {
  onComplete?: () => void;
  onClose?: () => void;
  onStepChange?: (stepIndex: number) => void;
  className?: string;
  startAtStep?: number;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

const PremiumVehicleTour: React.FC<PremiumVehicleTourProps> = ({
  onComplete,
  onClose,
  onStepChange,
  className = '',
  startAtStep = 0,
  autoAdvance = false,
  autoAdvanceDelay = 5000,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(startAtStep);
  const [isVisible, setIsVisible] = useState(true);
  const [hasSeenPremiumVehicle, setHasSeenPremiumVehicle] = useState(false);
  
  // Define the tour steps
  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to FixPoint!',
      description: 'Discover the ultimate vehicle management experience tailored just for you.',
      position: 'center',
      emoji: <Sparkles className="h-5 w-5 text-yellow-400" />,
      emojiSet: 'luxury',
      highlight: true,
    },
    {
      id: 'vehicle-vault',
      title: 'The VehicleVault',
      description: 'Your vehicles are stored securely in the VehicleVault. Add, edit, and manage your fleet easily.',
      position: 'bottom',
      element: '[data-tour="vehicle-vault"]',
      emoji: <Car className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 'testbeforebuy',
      title: 'TestBeforeBuy Experience',
      description: 'Virtually test drive and explore new vehicles before making a purchase decision.',
      position: 'right',
      element: '[data-tour="testbeforebuy"]',
      emojiSet: 'performance',
    },
    {
      id: 'premium-vehicles',
      title: 'Discover Premium Vehicles',
      description: 'Explore high-end vehicles with detailed features, specifications, and virtual experiences.',
      position: 'center',
      highlight: true,
      featuredVehicle: {
        name: 'Mercedes-Benz S-Class',
        image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741',
        features: ['Advanced Driving Assistance', 'Luxurious Interior', 'Powerful Performance'],
        animation: 'slide',
      },
    },
    {
      id: 'vehicle-comparison',
      title: 'Side-by-Side Comparison',
      description: 'Compare vehicles directly to make informed decisions about your next purchase.',
      position: 'left',
      element: '[data-tour="comparison"]',
    },
    {
      id: 'personalized-recommendations',
      title: 'Personalized Recommendations',
      description: 'Get vehicle suggestions based on your preferences and driving habits.',
      position: 'bottom',
      element: '[data-tour="recommendations"]',
      emojiSet: 'sporty',
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Start exploring the platform and make the most of your vehicle management experience.',
      position: 'center',
      emoji: <Check className="h-5 w-5 text-green-500" />,
      action: () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      },
    },
  ];
  
  const currentStep = tourSteps[currentStepIndex];
  
  // Auto-advance logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoAdvance && isVisible) {
      timer = setTimeout(() => {
        if (currentStepIndex < tourSteps.length - 1) {
          handleNext();
        } else {
          handleComplete();
        }
      }, autoAdvanceDelay);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentStepIndex, autoAdvance, isVisible]);
  
  // Execute any action defined for the current step
  useEffect(() => {
    if (currentStep?.action) {
      currentStep.action();
    }
    
    onStepChange?.(currentStepIndex);
    
    // Special case for premium vehicles step
    if (currentStep.id === 'premium-vehicles' && !hasSeenPremiumVehicle) {
      setHasSeenPremiumVehicle(true);
    }
  }, [currentStepIndex, currentStep]);
  
  // Handle navigation
  const handleNext = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const handleComplete = () => {
    setIsVisible(false);
    onComplete?.();
  };
  
  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };
  
  // Position the tooltip relative to the target element
  const getStepPosition = (step: TourStep) => {
    if (step.position === 'center' || !step.element) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }
    
    // In a real implementation, we would calculate this based on the element's position
    // For now, we'll just return fixed positions
    switch (step.position) {
      case 'top':
        return {
          position: 'fixed',
          bottom: '70%',
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          position: 'fixed',
          top: '70%',
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          position: 'fixed',
          top: '50%',
          right: '70%',
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          position: 'fixed',
          top: '50%',
          left: '70%',
          transform: 'translateY(-50%)',
        };
      default:
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }
  };
  
  // Get featured vehicle animation variants
  const getVehicleAnimationVariants = (animationType?: string) => {
    switch (animationType) {
      case 'slide':
        return {
          initial: { x: 300, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 },
        };
      case 'zoom':
        return {
          initial: { scale: 0.5, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.5, opacity: 0 },
        };
      case 'rotate':
        return {
          initial: { rotate: 45, scale: 0.5, opacity: 0 },
          animate: { rotate: 0, scale: 1, opacity: 1 },
          exit: { rotate: -45, scale: 0.5, opacity: 0 },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`fixed z-50 ${className}`}
        style={{
          ...getStepPosition(currentStep),
          maxWidth: currentStep.featuredVehicle ? '500px' : '350px',
        }}
      >
        <Card className={`shadow-lg ${currentStep.highlight ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
          {/* Close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6 text-neutral-400 hover:text-neutral-700"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Premium Vehicle Showcase */}
          {currentStep.featuredVehicle && (
            <motion.div 
              className="relative w-full h-48 overflow-hidden rounded-t-lg"
              variants={getVehicleAnimationVariants(currentStep.featuredVehicle.animation)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div 
                className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${currentStep.featuredVehicle.image})` }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <Badge variant="default" className="bg-primary mb-1">Premium</Badge>
                <h3 className="text-white font-bold text-lg">
                  {currentStep.featuredVehicle.name}
                </h3>
              </div>
              
              {/* Premium feature bullets */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg p-2 max-w-[70%]">
                <ul className="space-y-1">
                  {currentStep.featuredVehicle.features.map((feature, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.2) }}
                      className="flex items-center text-xs text-white"
                    >
                      <Check className="h-3 w-3 text-primary mr-1.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Floating emojis on premium vehicle */}
              <div className="absolute bottom-20 left-4">
                <AutoEmojiHover emoji="trophy" size="lg" animationType="bounce" />
              </div>
              <div className="absolute top-4 left-4">
                <AutoEmojiHover emoji="sparkle" size="lg" animationType="pulse" />
              </div>
            </motion.div>
          )}
          
          {/* Content */}
          <div className="p-4">
            <div className="flex items-start mb-3">
              {currentStep.emoji && (
                <div className="mr-2 mt-1">{currentStep.emoji}</div>
              )}
              <div>
                <h3 className="font-bold text-lg">{currentStep.title}</h3>
                <p className="text-neutral-600">{currentStep.description}</p>
              </div>
            </div>
            
            {/* Emoji set if provided */}
            {currentStep.emojiSet && (
              <div className="my-3 flex justify-center">
                <AutoEmojiSet setKey={currentStep.emojiSet as any} size="md" />
              </div>
            )}
            
            {/* Controls */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-1">
                {tourSteps.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`h-1.5 rounded-full ${
                      idx === currentStepIndex ? 'w-4 bg-primary' : 'w-1.5 bg-neutral-200'
                    }`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                {currentStepIndex > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePrevious}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleNext}
                  className="flex items-center"
                >
                  {currentStepIndex < tourSteps.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    'Finish Tour'
                  )}
                </Button>
              </div>
            </div>
            
            {/* Feedback button */}
            {currentStepIndex > 2 && (
              <div className="mt-3 flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-neutral-500 flex items-center gap-1 hover:text-neutral-700"
                >
                  <MessageSquare className="h-3 w-3" />
                  Was this helpful?
                </Button>
              </div>
            )}
          </div>
        </Card>
        
        {/* Overlay if needed */}
        {currentStep.highlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 -z-10"
            onClick={handleClose}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PremiumVehicleTour;