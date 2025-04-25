import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

type TransitionType = 'fade' | 'slide' | 'scale' | 'complex';

interface PageTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  duration?: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  type = 'fade',
  duration = 0.4
}) => {
  // Different animation variants based on transition type
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.1 }
    },
    complex: {
      initial: { 
        opacity: 0, 
        y: 20,
        filter: 'blur(10px)',
        scale: 0.95
      },
      animate: { 
        opacity: 1, 
        y: 0,
        filter: 'blur(0px)',
        scale: 1
      },
      exit: { 
        opacity: 0, 
        y: -20,
        filter: 'blur(10px)',
        scale: 0.95
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants[type]}
      transition={{ 
        duration: duration,
        ease: type === 'complex' ? [0.19, 1.0, 0.22, 1.0] : 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;