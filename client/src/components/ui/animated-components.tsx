import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AnimatedComponentProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  variants?: Variants;
}

export const FadeIn: React.FC<AnimatedComponentProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const SlideUp: React.FC<AnimatedComponentProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const SlideRight: React.FC<AnimatedComponentProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const SlideLeft: React.FC<AnimatedComponentProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const Scale: React.FC<AnimatedComponentProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedButton: React.FC<AnimatedComponentProps & { onClick?: () => void }> = ({
  children,
  onClick,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Stagger: React.FC<AnimatedComponentProps & { staggerChildren?: number }> = ({
  children,
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  staggerChildren = 0.1,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={container}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return (
            <motion.div variants={item}>
              {child}
            </motion.div>
          );
        }
        return child;
      })}
    </motion.div>
  );
};

export const Pulse: React.FC<AnimatedComponentProps> = ({
  children,
  duration = 2,
  ...props
}) => {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'loop',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const Rotate: React.FC<AnimatedComponentProps> = ({
  children,
  duration = 20,
  ...props
}) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const FadeInStaggered: React.FC<AnimatedComponentProps & { index?: number }> = ({
  children,
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  index = 0,
  ...props
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const customDelay = delay + index * 0.1;

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration, delay: customDelay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};