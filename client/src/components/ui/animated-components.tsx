import React, { ReactNode } from 'react';
import { motion, Variants, HTMLMotionProps } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation variants with proper TypeScript typing
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const menuItemVariants: Variants = {
  closed: { opacity: 0, x: -10 },
  open: { opacity: 1, x: 0 }
};

export const cardHoverVariants: Variants = {
  hover: { y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }
};

// Animated components
interface MotionProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "variants"> {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  variants?: Variants;
}

export const FadeIn: React.FC<MotionProps> = ({
  children,
  className = "",
  delay = 0,
  once = true,
  threshold = 0.2,
  variants = fadeIn,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const transitionProps = typeof variants.visible === 'object' && 'transition' in variants.visible 
    ? variants.visible.transition 
    : { duration: 0.5 };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      transition={{
        delay,
        ...transitionProps,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const SlideUp: React.FC<MotionProps> = (props) => {
  return <FadeIn variants={slideUp} {...props} />;
};

export const SlideInLeft: React.FC<MotionProps> = (props) => {
  return <FadeIn variants={slideInLeft} {...props} />;
};

export const SlideInRight: React.FC<MotionProps> = (props) => {
  return <FadeIn variants={slideInRight} {...props} />;
};

export const ScaleUp: React.FC<MotionProps> = (props) => {
  return <FadeIn variants={scaleUp} {...props} />;
};

export const PopIn: React.FC<MotionProps> = (props) => {
  return <FadeIn variants={popIn} {...props} />;
};

export const StaggerContainer: React.FC<MotionProps> = ({
  children,
  className = "",
  once = true,
  threshold = 0.1,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<MotionProps> = ({
  children,
  className = "",
  variants = fadeIn,
  ...props
}) => {
  return (
    <motion.div
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedCard: React.FC<MotionProps> = ({
  children,
  className = "",
  once = true,
  threshold = 0.2,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.5,
            ease: "easeOut"
          }
        },
        hover: { 
          y: -5, 
          transition: { 
            duration: 0.2 
          } 
        }
      }}
      className={`fx-card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedButtonProps extends MotionProps {
  onClick?: () => void;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = "",
  onClick,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Animated page transition component
export const PageTransition: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};