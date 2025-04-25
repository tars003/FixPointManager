import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface EnhancedBackgroundProps {
  type: 'gradient' | 'image' | 'pattern';
  primaryColor?: string;
  secondaryColor?: string;
  backgroundImage?: string;
  animated?: boolean;
  interactive?: boolean;
}

/**
 * Enhanced background component for Arena that supports gradients, images, and interactive elements
 */
const EnhancedBackground: React.FC<EnhancedBackgroundProps> = ({
  type = 'gradient',
  primaryColor = '#1E40AF', // default blue
  secondaryColor = '#0EA5E9', // default light blue
  backgroundImage,
  animated = false,
  interactive = false
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (interactive) {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY
        });
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [interactive]);
  
  // Render a gradient background
  const renderGradient = () => {
    const gradientStyle = {
      background: animated 
        ? `linear-gradient(120deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
        : `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
    };
    
    if (animated) {
      return (
        <motion.div
          className="absolute inset-0"
          style={gradientStyle}
          animate={{
            background: [
              `linear-gradient(120deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              `linear-gradient(240deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              `linear-gradient(360deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              `linear-gradient(120deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {interactive && (
            <div 
              className="absolute inset-0" 
              style={{
                background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 70%)`
              }}
            />
          )}
        </motion.div>
      );
    }
    
    return (
      <div className="absolute inset-0" style={gradientStyle}>
        {interactive && (
          <div 
            className="absolute inset-0" 
            style={{
              background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 70%)`
            }}
          />
        )}
      </div>
    );
  };
  
  // Render an image background
  const renderImage = () => {
    if (!backgroundImage) return null;
    
    return (
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        
        {interactive && (
          <div 
            className="absolute inset-0" 
            style={{
              background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0,0,0,0.5) 70%)`
            }}
          />
        )}
      </div>
    );
  };
  
  // Render a pattern background
  const renderPattern = () => {
    return (
      <div className="absolute inset-0">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="smallGrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke={primaryColor}
                strokeOpacity="0.2"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke={primaryColor}
                strokeOpacity="0.4"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`${secondaryColor}10`} />
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {interactive && (
          <div 
            className="absolute inset-0" 
            style={{
              background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, ${primaryColor}20 0%, transparent 70%)`
            }}
          />
        )}
      </div>
    );
  };
  
  // Render the appropriate background based on type
  switch (type) {
    case 'image':
      return renderImage();
    case 'pattern':
      return renderPattern();
    case 'gradient':
    default:
      return renderGradient();
  }
};

export default EnhancedBackground;