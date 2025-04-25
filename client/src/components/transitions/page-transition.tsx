import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  type?: 'fade' | 'slide' | 'scale' | 'flip' | 'rotate' | 'complex' | 'stagger';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  type = 'fade',
  direction = 'up',
  duration = 0.5,
  delay = 0
}) => {
  // Basic fade transition
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Slide transition based on direction
  const slideVariants = {
    initial: {
      opacity: 0,
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0 
    },
    exit: {
      opacity: 0,
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0
    }
  };

  // Scale transition
  const scaleVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }
  };

  // Flip transition
  const flipVariants = {
    initial: { opacity: 0, rotateX: 90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: -90 }
  };

  // Rotate transition
  const rotateVariants = {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 10 }
  };

  // Complex transition
  const complexVariants = {
    initial: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      filter: 'blur(8px)'
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -30, 
      scale: 0.98,
      filter: 'blur(8px)',
      transition: {
        duration: duration * 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  // Select the appropriate variants based on type
  const selectVariants = () => {
    switch (type) {
      case 'fade':
        return fadeVariants;
      case 'slide':
        return slideVariants;
      case 'scale':
        return scaleVariants;
      case 'flip':
        return flipVariants;
      case 'rotate':
        return rotateVariants;
      case 'complex':
      default:
        return complexVariants;
    }
  };

  const variants = selectVariants();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;