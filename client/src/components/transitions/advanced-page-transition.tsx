import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedPageTransitionProps {
  children: ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'flip' | 'rotate' | 'skew';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  className?: string;
}

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    up: {
      initial: { y: 50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -50, opacity: 0 },
    },
    down: {
      initial: { y: -50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 50, opacity: 0 },
    },
    left: {
      initial: { x: 50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -50, opacity: 0 },
    },
    right: {
      initial: { x: -50, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 50, opacity: 0 },
    },
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
  rotate: {
    initial: { rotate: -5, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 5, opacity: 0 },
  },
  skew: {
    initial: { skew: 5, opacity: 0 },
    animate: { skew: 0, opacity: 1 },
    exit: { skew: -5, opacity: 0 },
  },
};

const AdvancedPageTransition: React.FC<AdvancedPageTransitionProps> = ({
  children,
  type = 'fade',
  direction = 'up',
  duration = 0.4,
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
        type: type === 'scale' || type === 'fade' ? 'tween' : 'spring',
        duration: duration,
        delay: delay,
        stiffness: 260,
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AdvancedPageTransition;