import React, { ReactNode, memo } from 'react';
import { motion } from 'framer-motion';

interface AdvancedPageTransitionProps {
  children: ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'flip' | 'rotate' | 'skew';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  className?: string;
}

// Using simplified transition variants to improve performance
const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    up: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { opacity: 0 },
    },
    down: {
      initial: { y: -20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { opacity: 0 },
    },
    left: {
      initial: { x: 20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { opacity: 0 },
    },
    right: {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { opacity: 0 },
  },
  // Simplified the more computationally intensive animations
  flip: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  rotate: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  skew: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

// Memoize the component to prevent unnecessary re-renders
const AdvancedPageTransition: React.FC<AdvancedPageTransitionProps> = memo(({
  children,
  type = 'fade',
  direction = 'up',
  duration = 0.3, // Slightly shorter duration for better performance
  delay = 0,
  className,
}) => {
  let variants;

  // Select the appropriate variant based on type and direction
  if (type === 'slide') {
    variants = transitionVariants.slide[direction];
  } else {
    variants = transitionVariants[type];
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{
        type: 'tween', // Using tween for all transitions as it's less CPU intensive
        duration: duration,
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

AdvancedPageTransition.displayName = 'AdvancedPageTransition';

export default AdvancedPageTransition;