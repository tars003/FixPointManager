import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Gauge, Fuel, Car, Settings, Cog, CircleDashed } from 'lucide-react';

// Custom tire/wheel icon component
const TireIcon = ({ size = 24, className = "", strokeWidth = 2 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    stroke="currentColor" 
    strokeWidth={strokeWidth}
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="3" x2="12" y2="9" />
    <line x1="12" y1="15" x2="12" y2="21" />
    <line x1="3" y1="12" x2="9" y2="12" />
    <line x1="15" y1="12" x2="21" y2="12" />
    <line x1="5.6" y1="5.6" x2="8.5" y2="8.5" />
    <line x1="15.5" y1="15.5" x2="18.4" y2="18.4" />
    <line x1="5.6" y1="18.4" x2="8.5" y2="15.5" />
    <line x1="15.5" y1="8.5" x2="18.4" y2="5.6" />
  </svg>
);

// Custom oil change icon
const OilIcon = ({ size = 24, className = "", strokeWidth = 2 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    stroke="currentColor" 
    strokeWidth={strokeWidth}
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14 4L10 4L9 2L15 2L14 4Z" />
    <path d="M2 6H22" />
    <rect x="4" y="8" width="16" height="12" rx="2" />
    <path d="M7 8L7 17.5" strokeDasharray="3 2" />
    <path d="M17 8L17 17.5" strokeDasharray="3 2" />
    <path d="M12 8L12 17.5" strokeDasharray="3 2" />
  </svg>
);

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isOverLink, setIsOverLink] = useState(false);
  const [activeTool, setActiveTool] = useState(0);
  
  // Automotive tools rotation
  const autoTools = [
    { icon: Wrench, label: "Wrench" },
    { icon: Car, label: "Car" },
    { icon: TireIcon, label: "Tire" },
    { icon: Gauge, label: "Gauge" },
    { icon: Fuel, label: "Fuel" },
    { icon: OilIcon, label: "Oil Change" },
    { icon: Cog, label: "Mechanic" }
  ];
  
  useEffect(() => {
    // Hide the default cursor
    document.body.style.cursor = 'none';
    
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => {
      setIsClicking(false);
      // Change tool on click
      setActiveTool((prev) => (prev + 1) % autoTools.length);
    };
    
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
  }, [autoTools.length]);

  // Automotive-themed particles (screws, bolts, etc.)
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    offset: i * (Math.PI / 5), // Distribute particles evenly around the circle
    distance: 15 + (i % 4) * 3, // Vary the distance from center
    size: 2 + (i % 3), // Vary the size
    opacity: 0.4 + (i % 4) * 0.12, // Vary the opacity
    type: i % 4, // Different particle types
    speed: 2.5 + (i % 3), // Animation speed variation
    delay: i * 0.1, // Staggered animation
  }));

  // Get colored parts for current tool effect
  const getToolColor = () => {
    switch (activeTool) {
      case 0: return "text-yellow-500"; // Wrench - yellow/gold
      case 1: return "text-blue-600"; // Car - blue
      case 2: return "text-gray-700"; // Tire - dark gray
      case 3: return "text-red-500"; // Gauge - red
      case 4: return "text-green-500"; // Fuel - green
      case 5: return "text-amber-600"; // Oil - amber
      case 6: return "text-slate-400"; // Cog - slate
      default: return "text-orange-500";
    }
  };

  // Current tool
  const ToolIcon = autoTools[activeTool].icon;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Tool cursor */}
      <motion.div 
        className="absolute w-12 h-12 flex items-center justify-center"
        style={{ 
          left: mousePosition.x - 24, 
          top: mousePosition.y - 24,
        }}
        animate={{
          scale: isClicking ? 0.8 : isOverLink ? 1.2 : 1,
          rotate: isClicking ? [0, 45] : isOverLink ? [0, 15, -15, 0] : 0,
          transition: { duration: 0.2 }
        }}
      >
        {/* Tool glow effect */}
        <motion.div 
          className="absolute w-10 h-10 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              activeTool === 0 ? "rgba(234, 179, 8, 0.15)" :  // Yellow for wrench
              activeTool === 1 ? "rgba(37, 99, 235, 0.15)" :  // Blue for car
              activeTool === 2 ? "rgba(75, 85, 99, 0.15)" :   // Gray for tire
              activeTool === 3 ? "rgba(239, 68, 68, 0.15)" :  // Red for gauge
              activeTool === 4 ? "rgba(34, 197, 94, 0.15)" :  // Green for fuel
              activeTool === 5 ? "rgba(217, 119, 6, 0.15)" :  // Amber for oil
              "rgba(148, 163, 184, 0.15)"                     // Slate for cog
            } 0%, rgba(29, 78, 216, 0) 70%)`,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.7, 0.3, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        {/* Main tool */}
        <motion.div
          className="relative z-10"
          initial={{ rotate: -90 }}
          animate={{
            rotate: isClicking ? [-90, 0] : -90,
            scale: isOverLink ? 1.1 : 1
          }}
          transition={{
            rotate: { 
              duration: 0.3, 
              type: "spring",
              stiffness: 200,
            },
            scale: { duration: 0.2 }
          }}
        >
          <ToolIcon 
            size={isOverLink ? 28 : 24} 
            className={getToolColor() + " drop-shadow-md"}
            strokeWidth={1.5}
          />
        </motion.div>
        
        {/* Automotive particles (nuts, bolts, etc.) */}
        {particles.map(particle => {
          // Different particle styles for different tools
          let particleStyle;
          if (activeTool === 0) { // Wrench - screws
            particleStyle = particle.type === 0 ? "rounded-full bg-yellow-400" : 
                          particle.type === 1 ? "rounded-sm bg-yellow-500" : 
                          particle.type === 2 ? "rounded-full ring-1 ring-yellow-400 bg-transparent" : 
                          "w-1 h-2 bg-yellow-600";
          } else if (activeTool === 1) { // Car - blue parts
            particleStyle = particle.type === 0 ? "rounded-full bg-blue-400" : 
                          particle.type === 1 ? "h-1 bg-blue-600" : 
                          particle.type === 2 ? "rounded-full border border-blue-500 bg-transparent" : 
                          "rounded-sm transform rotate-45 bg-blue-500";
          } else if (activeTool === 2) { // Tire - rubber bits
            particleStyle = particle.type === 0 ? "rounded-full bg-gray-800" : 
                          particle.type === 1 ? "rounded-sm bg-gray-700" : 
                          particle.type === 2 ? "w-1 h-1 bg-gray-600" : 
                          "rounded-sm bg-gray-900";
          } else if (activeTool === 3) { // Gauge - meter parts
            particleStyle = particle.type === 0 ? "rounded-full bg-red-500" : 
                          particle.type === 1 ? "w-1 h-2 bg-red-400" : 
                          particle.type === 2 ? "w-2 h-1 rounded-sm bg-red-600" : 
                          "rounded-sm bg-red-300";
          } else if (activeTool === 4) { // Fuel - droplets
            particleStyle = particle.type === 0 ? "rounded-full bg-green-500" : 
                          particle.type === 1 ? "rounded-b-full bg-green-600 w-1.5 h-2.5" : 
                          particle.type === 2 ? "rounded-full bg-green-400" : 
                          "rounded-t-none rounded-b-full bg-green-500";
          } else if (activeTool === 5) { // Oil - drips
            particleStyle = particle.type === 0 ? "rounded-full bg-amber-600" : 
                          particle.type === 1 ? "rounded-b-full bg-amber-700 w-1.5 h-2.5" : 
                          particle.type === 2 ? "rounded-full bg-amber-500" : 
                          "rounded-t-none rounded-b-full bg-amber-600";
          } else { // Cog - metal bits
            particleStyle = particle.type === 0 ? "rounded-full bg-slate-400" : 
                          particle.type === 1 ? "rounded-sm bg-slate-500" : 
                          particle.type === 2 ? "w-1 h-2 bg-slate-300" : 
                          "w-2 h-1 bg-slate-400";
          }
          
          return (
            <motion.div
              key={particle.id}
              className={`absolute ${particleStyle}`}
              style={{
                width: particle.type === 1 || particle.type === 2 ? particle.size + 1 : particle.size,
                height: particle.type === 1 || particle.type === 3 ? particle.size + 1 : particle.size,
                opacity: particle.opacity,
              }}
              initial={{
                x: 0,
                y: 0,
                rotate: 0,
                scale: 0
              }}
              animate={{
                x: Math.cos(particle.offset) * particle.distance,
                y: Math.sin(particle.offset) * particle.distance,
                rotate: [0, 360],
                scale: isClicking ? [0, 1, 0] : 1
              }}
              transition={{
                x: { 
                  duration: particle.speed, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  delay: particle.delay 
                },
                y: { 
                  duration: particle.speed, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  delay: particle.delay 
                },
                rotate: { 
                  duration: particle.speed * 1.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                },
                scale: {
                  duration: isClicking ? 0.4 : 0.3,
                  delay: isClicking ? 0 : particle.delay
                }
              }}
            />
          );
        })}
        
        {/* Tool info label on hover */}
        {isOverLink && (
          <motion.div
            className="absolute -bottom-6 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {autoTools[activeTool].label}
          </motion.div>
        )}
        
        {/* Tool-specific effect on click */}
        {isClicking && (
          <>
            {/* Spark effect for mechanical tools */}
            {(activeTool === 0 || activeTool === 2 || activeTool === 6) && (
              <motion.div
                className="absolute"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={activeTool === 0 ? "text-yellow-500" : activeTool === 2 ? "text-gray-600" : "text-slate-400"}>
                  <path d="M8 4L5 14M19 4L16 14M5 14H16L19 20M5 14L2 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
            
            {/* Speed lines for car */}
            {activeTool === 1 && (
              <motion.div
                className="absolute left-0 top-0 w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.4, times: [0, 0.3, 1] }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-blue-500 absolute -left-4 -top-4">
                  <path d="M30 10L18 22M25 5L16 14M35 15L22 28M10 20L2 28M15 25L5 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.div>
            )}
            
            {/* Gauge animation */}
            {activeTool === 3 && (
              <motion.div 
                className="absolute w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent"
                initial={{ rotate: 0, opacity: 1 }}
                animate={{ rotate: 270, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            )}
            
            {/* Fuel or oil droplets */}
            {(activeTool === 4 || activeTool === 5) && (
              <motion.div className="absolute">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute rounded-b-full ${activeTool === 4 ? 'bg-green-500' : 'bg-amber-600'}`}
                    style={{
                      width: 3 + (i % 2),
                      height: 4 + (i % 3),
                      left: (i - 2) * 4,
                      top: (i % 2) * -3
                    }}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: 15 + (i * 3), opacity: 0 }}
                    transition={{ 
                      duration: 0.5 + (i * 0.1),
                      ease: "easeIn"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </>
        )}
      </motion.div>
      
      {/* Small dot cursor for precise pointing */}
      <motion.div 
        className={`absolute w-2 h-2 rounded-full ${
          activeTool === 0 ? "bg-yellow-500" : 
          activeTool === 1 ? "bg-blue-600" : 
          activeTool === 2 ? "bg-gray-700" : 
          activeTool === 3 ? "bg-red-500" : 
          activeTool === 4 ? "bg-green-500" : 
          activeTool === 5 ? "bg-amber-600" : 
          "bg-slate-400"
        }`}
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