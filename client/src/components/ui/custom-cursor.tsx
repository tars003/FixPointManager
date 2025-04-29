import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles } from 'lucide-react';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isOverLink, setIsOverLink] = useState(false);
  
  useEffect(() => {
    // Hide the default cursor
    document.body.style.cursor = 'none';
    
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    // Check if the mouse is over a clickable element
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLink = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null || 
        target.closest('button') !== null ||
        target.getAttribute('role') === 'button' ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      setIsOverLink(isLink);
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousemove', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      // Restore the default cursor when component unmounts
      document.body.style.cursor = 'auto';
      
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousemove', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Generate spiral particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    offset: i * (Math.PI / 6), // Distribute particles evenly around the circle
    distance: 15 + (i % 3) * 5, // Vary the distance from center
    size: 1.5 + (i % 3), // Vary the size
    opacity: 0.3 + (i % 5) * 0.12, // Vary the opacity
    hue: i * 30, // Color variation
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Magical trail effect */}
      <motion.div 
        className="absolute w-12 h-12 flex items-center justify-center"
        style={{ 
          left: mousePosition.x - 24, 
          top: mousePosition.y - 24,
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
        }}
        animate={{
          scale: isClicking ? [1.2, 0.8] : isOverLink ? 1.2 : 1,
          transition: { duration: 0.15 }
        }}
      >
        {/* Magical glow effect */}
        <motion.div 
          className="absolute w-10 h-10 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(29, 78, 216, 0) 70%)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0.2, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        {/* Magic wand */}
        <motion.div
          className="relative z-10"
          animate={{
            rotate: isClicking ? [0, -45, 0] : isOverLink ? [0, 15, -15, 0] : 0,
            scale: isOverLink ? 1.1 : 1
          }}
          transition={{
            rotate: { 
              duration: isClicking ? 0.3 : 1.5, 
              repeat: isClicking ? 0 : isOverLink ? Infinity : 0,
              repeatType: "mirror" 
            },
            scale: { duration: 0.2 }
          }}
        >
          <Wand2 
            size={isOverLink ? 28 : 24} 
            className="text-indigo-600 drop-shadow-md"
            strokeWidth={1.5}
          />
        </motion.div>
        
        {/* Spiral particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              backgroundColor: isOverLink 
                ? `hsla(${particle.hue}, 80%, 70%, ${particle.opacity})` 
                : `hsla(${210 + particle.hue % 60}, 70%, 60%, ${particle.opacity})`,
              boxShadow: `0 0 2px hsla(${particle.hue}, 80%, 70%, 0.6)`,
            }}
            animate={{
              x: Array.from({ length: 12 }, (_, i) => 
                Math.cos(particle.offset + (i * Math.PI / 6)) * (particle.distance + i * 2)
              ),
              y: Array.from({ length: 12 }, (_, i) => 
                Math.sin(particle.offset + (i * Math.PI / 6)) * (particle.distance + i * 2)
              ),
              scale: isOverLink ? [1, 1.5, 1] : [1, 1.2, 1],
              opacity: isOverLink 
                ? [particle.opacity, particle.opacity * 2, particle.opacity] 
                : [particle.opacity, particle.opacity * 1.5, particle.opacity],
            }}
            transition={{
              duration: isOverLink ? 1.5 : 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              times: Array.from({ length: 12 }, (_, i) => i / 11),
            }}
          />
        ))}
        
        {/* Sparkle effect on click */}
        {isClicking && (
          <motion.div
            className="absolute"
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Sparkles className="text-yellow-400" size={30} />
          </motion.div>
        )}
      </motion.div>
      
      {/* Small dot cursor for precise pointing */}
      <motion.div 
        className="absolute w-2 h-2 bg-indigo-600 rounded-full"
        style={{ 
          left: mousePosition.x - 1, 
          top: mousePosition.y - 1,
        }}
        animate={{
          scale: isClicking ? 1.8 : isOverLink ? 1.5 : 1,
          opacity: isOverLink ? 0.7 : 1,
          transition: { duration: 0.15 }
        }}
      />
    </div>
  );
};

export default CustomCursor;