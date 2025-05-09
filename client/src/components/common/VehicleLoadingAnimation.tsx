import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

interface VehicleLoadingAnimationProps {
  loading: boolean;
  onComplete?: () => void;
  message?: string;
  successMessage?: string;
  variant?: 'car' | 'document' | 'service' | 'default';
  className?: string;
}

export function VehicleLoadingAnimation({
  loading,
  onComplete,
  message,
  successMessage = "Completed!",
  variant = 'default',
  className
}: VehicleLoadingAnimationProps) {
  const { t } = useTranslation(['common']);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showAnimation, setShowAnimation] = useState(loading);
  
  useEffect(() => {
    if (loading) {
      setShowAnimation(true);
      setIsComplete(false);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          // Simulate varying progress speeds
          const increment = Math.random() * 3 + 1;
          const newProgress = Math.min(prev + increment, 100);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsComplete(true);
            setTimeout(() => {
              if (onComplete) {
                onComplete();
              }
              
              // Hide animation after completion
              setTimeout(() => {
                setShowAnimation(false);
              }, 1500);
            }, 1000);
          }
          
          return newProgress;
        });
      }, 150);
      
      return () => clearInterval(interval);
    } else {
      setShowAnimation(false);
    }
  }, [loading, onComplete]);
  
  // Don't render if not showing
  if (!showAnimation) return null;
  
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="w-full max-w-md p-6 rounded-lg bg-card shadow-xl">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="loading"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {variant === 'car' && (
                <CarAnimation progress={progress} />
              )}
              
              {variant === 'document' && (
                <DocumentAnimation progress={progress} />
              )}
              
              {variant === 'service' && (
                <ServiceAnimation progress={progress} />
              )}
              
              {variant === 'default' && (
                <DefaultAnimation progress={progress} />
              )}
              
              <div className="w-full mt-4 bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              
              <p className="mt-3 text-center text-muted-foreground">
                {message || t('common:loading', 'Loading...')} ({Math.round(progress)}%)
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <div className="h-24 w-24 flex items-center justify-center bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-center">
                {successMessage}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CarAnimation({ progress }: { progress: number }) {
  // Calculate position based on progress
  const roadPosition = Math.min(progress / 100 * 200, 200);
  
  return (
    <div className="relative w-full h-32 mb-4 overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 rounded-lg">
      {/* Road */}
      <div className="absolute bottom-0 w-full h-8 bg-gray-800" />
      <div className="absolute bottom-3 w-full h-1">
        <div className="flex space-x-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="h-1 w-8 bg-white"
              style={{
                transform: `translateX(${-roadPosition * 2 + i * 50}px)`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Clouds */}
      <div 
        className="absolute top-4 left-10 w-16 h-6 bg-white rounded-full opacity-80"
        style={{
          transform: `translateX(${-roadPosition / 2}px)`
        }}
      />
      <div 
        className="absolute top-8 left-40 w-20 h-8 bg-white rounded-full opacity-80"
        style={{
          transform: `translateX(${-roadPosition / 3}px)`
        }}
      />
      
      {/* Car */}
      <motion.div
        className="absolute bottom-8 left-12 h-14 w-28"
        animate={{
          x: roadPosition,
          rotate: Math.sin(roadPosition / 5) * 2,
        }}
        transition={{ type: "spring", stiffness: 60 }}
      >
        {/* Car body */}
        <div className="absolute bottom-0 w-28 h-8 bg-red-500 rounded-md" />
        <div className="absolute bottom-4 left-4 w-18 h-8 bg-red-600 rounded-t-lg" />
        
        {/* Windows */}
        <div className="absolute bottom-6 left-6 w-6 h-4 bg-blue-300" />
        <div className="absolute bottom-6 left-14 w-6 h-4 bg-blue-300" />
        
        {/* Wheels */}
        <div className="absolute bottom-0 left-4 w-6 h-6 bg-black rounded-full border-2 border-gray-300">
          <div className="absolute top-1 left-1 w-3 h-3 bg-gray-400 rounded-full" />
        </div>
        <div className="absolute bottom-0 right-4 w-6 h-6 bg-black rounded-full border-2 border-gray-300">
          <div className="absolute top-1 left-1 w-3 h-3 bg-gray-400 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}

function DocumentAnimation({ progress }: { progress: number }) {
  return (
    <div className="h-32 w-full overflow-hidden flex items-center justify-center mb-4">
      <motion.div
        className="relative w-24 h-32 bg-white shadow-lg rounded"
        initial={{ rotateY: 0 }}
        animate={{
          rotateY: progress >= 100 ? 1080 : progress * 3.6,
          scale: progress >= 100 ? 1.1 : 1 + Math.sin(progress / 10) * 0.1
        }}
        transition={{ type: "spring" }}
      >
        {/* Document header */}
        <div className="absolute top-4 left-3 right-3 h-2 bg-blue-500 rounded-full" />
        <div className="absolute top-8 left-3 right-3 h-1 bg-gray-300 rounded-full" />
        <div className="absolute top-11 left-3 right-3 h-1 bg-gray-300 rounded-full" />
        <div className="absolute top-14 left-3 right-3 h-1 bg-gray-300 rounded-full" />
        
        {/* Document stamp */}
        <motion.div
          className="absolute bottom-4 right-2 w-8 h-8 rounded-full"
          animate={{
            scale: progress > 70 ? 1 : 0,
            rotate: progress > 70 ? 0 : -90,
            opacity: progress > 70 ? 1 : 0
          }}
        >
          <div className="w-full h-full rounded-full border-2 border-green-500 flex items-center justify-center">
            <div className="text-[8px] text-green-600 font-bold">OK</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ServiceAnimation({ progress }: { progress: number }) {
  return (
    <div className="relative h-32 w-full overflow-hidden flex items-center justify-center mb-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
      {/* Garage */}
      <div className="absolute top-0 left-0 w-full h-14 bg-blue-800 flex items-center justify-center">
        <div className="text-white font-bold text-sm">SERVICE CENTER</div>
      </div>
      
      {/* Car lift */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gray-700" />
      <motion.div
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-2 bg-gray-600"
        animate={{ y: progress < 30 ? 0 : -15 }}
      />
      
      {/* Car */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 h-10 w-24"
        animate={{ 
          y: progress < 30 ? 0 : -15,
          rotateZ: progress > 60 ? Math.sin(progress / 4) * 5 : 0
        }}
        transition={{ type: "spring" }}
      >
        {/* Car body */}
        <div className="absolute bottom-0 w-24 h-6 bg-green-500 rounded-sm" />
        <div className="absolute bottom-3 left-3 w-16 h-6 bg-green-600 rounded-t-md" />
        
        {/* Wheels */}
        <motion.div
          className="absolute bottom-0 left-3 w-4 h-4 bg-black rounded-full"
          animate={{ 
            rotateZ: progress > 60 ? progress * 5 : 0,
            opacity: progress > 80 ? 0 : 1
          }}
        />
        <motion.div
          className="absolute bottom-0 right-3 w-4 h-4 bg-black rounded-full"
          animate={{ 
            rotateZ: progress > 60 ? progress * 5 : 0,
            opacity: progress > 80 ? 0 : 1
          }}
        />
      </motion.div>
      
      {/* Tools */}
      <motion.div
        className="absolute left-1/4 bottom-10 w-4 h-6 bg-gray-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: progress > 50 ? 1 : 0,
          y: progress > 50 ? 0 : 20,
          x: progress > 70 ? -10 : 0,
          rotate: progress > 70 ? -30 : 0
        }}
      >
        <div className="absolute top-0 left-0 w-4 h-1 bg-red-500" />
      </motion.div>
    </div>
  );
}

function DefaultAnimation({ progress }: { progress: number }) {
  return (
    <div className="h-32 w-full overflow-hidden flex items-center justify-center mb-4">
      <motion.div
        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: progress * 5 }}
      />
    </div>
  );
}

export default VehicleLoadingAnimation;