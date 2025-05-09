import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: 'raise' | 'glow' | 'scale' | 'none';
  clickable?: boolean;
  onClick?: () => void;
  interactive?: boolean;
  variant?: 'default' | 'premium' | 'outline' | 'subtle';
  isNew?: boolean;
}

/**
 * Enhanced card component with interactive hover effects and animations
 */
const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className,
  hoverEffect = 'raise',
  clickable = false,
  onClick,
  interactive = true,
  variant = 'default',
  isNew = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getHoverAnimation = () => {
    if (!interactive) return {};
    
    switch (hoverEffect) {
      case 'raise':
        return { y: -5, boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.2)' };
      case 'glow':
        return { boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' };
      case 'scale':
        return { scale: 1.02 };
      case 'none':
        return {};
    }
  };
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 text-white';
      case 'outline':
        return 'bg-white border-gray-200 hover:border-blue-200';
      case 'subtle':
        return 'bg-gray-50 border-gray-100 hover:border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl overflow-hidden border relative transition-all duration-300',
        'shadow-sm hover:shadow-md',
        getVariantStyles(),
        clickable && 'cursor-pointer',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={getHoverAnimation()}
      onClick={clickable ? onClick : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Optional "New" badge */}
      {isNew && (
        <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full z-10">
          New
        </div>
      )}
      
      {/* Card content */}
      {children}
      
      {/* Hover effect overlay */}
      {interactive && hoverEffect === 'glow' && (
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-xl"></div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnhancedCard;