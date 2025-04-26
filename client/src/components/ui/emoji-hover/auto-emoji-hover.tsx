import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define automotive emoji types
export type AutoEmojiType = 
  | 'car' 
  | 'racing' 
  | 'truck' 
  | 'motorcycle' 
  | 'fuel' 
  | 'mechanic' 
  | 'steering' 
  | 'key' 
  | 'oil' 
  | 'wash'
  | 'trophy'
  | 'money'
  | 'sparkle';

interface AutoEmojiConfig {
  emoji: string;
  label: string;
  color: string;
}

// Mapping of emoji types to actual emojis and colors
const autoEmojiMap: Record<AutoEmojiType, AutoEmojiConfig> = {
  car: { emoji: '🚗', label: 'Car', color: '#3b82f6' },
  racing: { emoji: '🏎️', label: 'Racing', color: '#ef4444' },
  truck: { emoji: '🚚', label: 'Truck', color: '#f59e0b' },
  motorcycle: { emoji: '🏍️', label: 'Motorcycle', color: '#6366f1' },
  fuel: { emoji: '⛽', label: 'Fuel', color: '#10b981' },
  mechanic: { emoji: '🔧', label: 'Mechanic', color: '#6b7280' },
  steering: { emoji: '🎮', label: 'Steering', color: '#8b5cf6' },
  key: { emoji: '🔑', label: 'Key', color: '#f97316' },
  oil: { emoji: '🛢️', label: 'Oil', color: '#4b5563' },
  wash: { emoji: '🧼', label: 'Wash', color: '#06b6d4' },
  trophy: { emoji: '🏆', label: 'Trophy', color: '#eab308' },
  money: { emoji: '💰', label: 'Money', color: '#65a30d' },
  sparkle: { emoji: '✨', label: 'Sparkle', color: '#d946ef' },
};

// Animation variants for different hover effects
const hoverAnimations = {
  bounce: {
    initial: { y: 0, scale: 1 },
    hover: { 
      y: [-5, 0, -3, 0], 
      scale: [1.2, 1.1, 1.15, 1.1],
      transition: { duration: 0.6, repeat: Infinity, repeatType: 'loop' } 
    }
  },
  rotate: {
    initial: { rotate: 0, scale: 1 },
    hover: { 
      rotate: [0, 15, -15, 0], 
      scale: [1.1, 1.2, 1.1, 1.2],
      transition: { duration: 0.8, repeat: Infinity, repeatType: 'loop' } 
    }
  },
  pulse: {
    initial: { scale: 1 },
    hover: { 
      scale: [1, 1.25, 1, 1.25], 
      transition: { duration: 0.7, repeat: Infinity, repeatType: 'loop' } 
    }
  },
  wiggle: {
    initial: { x: 0, scale: 1 },
    hover: { 
      x: [-2, 2, -2, 0], 
      scale: [1.1, 1.15, 1.1, 1.15],
      transition: { duration: 0.5, repeat: Infinity, repeatType: 'loop' } 
    }
  },
  tada: {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: [1, 1.1, 1.1, 1.1, 1.1, 1.1],
      rotate: [0, -3, 3, -3, 3, 0],
      transition: { duration: 0.7, repeat: Infinity, repeatType: 'loop' }
    }
  }
};

type AnimationType = keyof typeof hoverAnimations;

interface AutoEmojiHoverProps {
  emoji: AutoEmojiType;
  animationType?: AnimationType;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
  hoverText?: string;
}

const AutoEmojiHover: React.FC<AutoEmojiHoverProps> = ({ 
  emoji, 
  animationType = 'bounce',
  showLabel = false,
  size = 'md',
  onClick,
  className = '',
  hoverText
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!autoEmojiMap[emoji]) {
    console.warn(`Emoji type "${emoji}" not found`);
    return null;
  }
  
  const emojiConfig = autoEmojiMap[emoji];
  const animation = hoverAnimations[animationType];
  
  // Size classes
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };
  
  return (
    <div 
      className={`relative inline-flex flex-col items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={animation.initial}
        whileHover={animation.hover}
        className={`cursor-pointer ${sizeClasses[size]}`}
        style={{ WebkitTextStroke: '1px rgba(0,0,0,0.1)' }}
        onClick={onClick}
      >
        {emojiConfig.emoji}
      </motion.div>
      
      {showLabel && (
        <span 
          className="text-xs mt-1 font-medium" 
          style={{ color: emojiConfig.color }}
        >
          {emojiConfig.label}
        </span>
      )}
      
      {hoverText && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10"
            >
              {hoverText}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-neutral-800 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default AutoEmojiHover;