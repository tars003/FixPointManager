import React from 'react';
import { motion } from 'framer-motion';
import AutoEmojiHover, { AutoEmojiType } from './auto-emoji-hover';

interface EmojiSetItem {
  type: AutoEmojiType;
  animationType?: 'bounce' | 'rotate' | 'pulse' | 'wiggle' | 'tada';
  hoverText?: string;
  onClick?: () => void;
}

// Predefined emoji sets for different contexts
export const emojiSets: Record<string, EmojiSetItem[]> = {
  performance: [
    { type: 'racing', hoverText: 'Fast Acceleration', animationType: 'pulse' },
    { type: 'steering', hoverText: 'Precise Handling', animationType: 'rotate' },
    { type: 'trophy', hoverText: 'Award-Winning', animationType: 'bounce' },
  ],
  luxury: [
    { type: 'car', hoverText: 'Premium Sedan', animationType: 'wiggle' },
    { type: 'sparkle', hoverText: 'Luxury Features', animationType: 'pulse' },
    { type: 'money', hoverText: 'High Value', animationType: 'tada' },
  ],
  economy: [
    { type: 'fuel', hoverText: 'Fuel Efficient', animationType: 'pulse' },
    { type: 'money', hoverText: 'Budget-Friendly', animationType: 'bounce' },
    { type: 'key', hoverText: 'Easy Ownership', animationType: 'wiggle' },
  ],
  maintenance: [
    { type: 'mechanic', hoverText: 'Low Maintenance', animationType: 'rotate' },
    { type: 'oil', hoverText: 'Service Intervals', animationType: 'wiggle' },
    { type: 'wash', hoverText: 'Easy Care', animationType: 'pulse' },
  ],
  utility: [
    { type: 'truck', hoverText: 'High Capacity', animationType: 'bounce' },
    { type: 'key', hoverText: 'Versatile Usage', animationType: 'wiggle' },
    { type: 'fuel', hoverText: 'Efficient Operations', animationType: 'pulse' },
  ],
  sporty: [
    { type: 'motorcycle', hoverText: 'Thrilling Ride', animationType: 'pulse' },
    { type: 'racing', hoverText: 'Sports Performance', animationType: 'wiggle' },
    { type: 'trophy', hoverText: 'Award-Winning', animationType: 'tada' },
  ],
};

interface AutoEmojiSetProps {
  setKey: keyof typeof emojiSets | EmojiSetItem[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabels?: boolean;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AutoEmojiSet: React.FC<AutoEmojiSetProps> = ({ 
  setKey, 
  size = 'md',
  showLabels = false,
  spacing = 'md',
  className = '' 
}) => {
  const emojiItems = Array.isArray(setKey) ? setKey : emojiSets[setKey] || [];
  
  // Spacing between emojis
  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };
  
  return (
    <motion.div 
      className={`flex items-center ${spacingClasses[spacing]} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
    >
      {emojiItems.map((item, index) => (
        <AutoEmojiHover
          key={`${item.type}-${index}`}
          emoji={item.type}
          animationType={item.animationType}
          showLabel={showLabels}
          size={size}
          hoverText={item.hoverText}
          onClick={item.onClick}
        />
      ))}
    </motion.div>
  );
};

export default AutoEmojiSet;