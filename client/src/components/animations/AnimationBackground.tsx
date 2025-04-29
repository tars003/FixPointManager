import React from 'react';
import * as Animations from './automotive-animations';

interface AnimationBackgroundProps {
  page: 'vehicleVault' | 'bookService' | 'fastag' | 'emergency' | 'nearby' | 
        'drishti' | 'testBeforeBuy' | 'marketplace' | 'verifyParts' | 
        'fixpoint' | 'learnDriving' | 'educational' | 'arena' | 'commercialFleet';
  className?: string;
  opacity?: number;
}

/**
 * A background component that displays page-specific automotive animations
 * Each page has its own set of at least 10 animations
 */
const AnimationBackground: React.FC<AnimationBackgroundProps> = ({ 
  page, 
  className = "",
  opacity = 0.1
}) => {
  // Map page names to their animation arrays
  const animationMap = {
    vehicleVault: Animations.vehicleVaultAnimations,
    bookService: Animations.bookServiceAnimations,
    fastag: Animations.fastagAnimations,
    emergency: Animations.emergencyAnimations,
    nearby: Animations.nearbyAnimations,
    drishti: Animations.drishtiAnimations,
    testBeforeBuy: Animations.testBeforeBuyAnimations,
    marketplace: Animations.marketplaceAnimations,
    verifyParts: Animations.verifyPartsAnimations,
    fixpoint: Animations.fixpointAnimations,
    learnDriving: Animations.learnDrivingAnimations,
    educational: Animations.educationalAnimations,
    arena: Animations.arenaAnimations,
    commercialFleet: Animations.commercialFleetAnimations
  };

  // Get the animations for the specified page
  const animations = animationMap[page];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`} style={{ opacity }}>
      {animations.map((animation, index) => {
        // Calculate random positions for each animation
        const top = Math.floor(Math.random() * 80) + 10;
        const left = Math.floor(Math.random() * 80) + 10;
        
        return (
          <div 
            key={index} 
            className="absolute" 
            style={{ 
              top: `${top}%`, 
              left: `${left}%`,
              transform: `translate(-50%, -50%)`
            }}
          >
            {animation}
          </div>
        );
      })}
    </div>
  );
};

export default AnimationBackground;