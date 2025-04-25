import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface BackgroundParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

interface BackgroundSvgShape {
  id: number;
  path: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  color: string;
}

interface EnhancedBackgroundProps {
  type?: 'particles' | 'gradient' | 'animated-shapes' | 'grid' | 'waves';
  primaryColor?: string;
  secondaryColor?: string;
  density?: 'low' | 'medium' | 'high';
  animated?: boolean;
  interactive?: boolean;
  className?: string;
}

const EnhancedBackground: React.FC<EnhancedBackgroundProps> = ({
  type = 'particles',
  primaryColor = '#1E3A8A',
  secondaryColor = '#0D9488',
  density = 'medium',
  animated = true,
  interactive = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [particles, setParticles] = useState<BackgroundParticle[]>([]);
  const [shapes, setShapes] = useState<BackgroundSvgShape[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const animationFrameRef = useRef<number>(0);
  
  // Generate random particles based on density
  const generateParticles = (width: number, height: number) => {
    const particleCounts = {
      low: 20,
      medium: 40,
      high: 80,
    };
    
    const count = particleCounts[density];
    const newParticles: BackgroundParticle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? primaryColor : secondaryColor,
      });
    }
    
    setParticles(newParticles);
  };
  
  // Generate SVG shapes
  const generateShapes = (width: number, height: number) => {
    const shapeCounts = {
      low: 5,
      medium: 10,
      high: 15,
    };
    
    const count = shapeCounts[density];
    const newShapes: BackgroundSvgShape[] = [];
    
    const shapePaths = [
      "M10 0 L20 20 L0 20 Z", // Triangle
      "M0 0 L20 0 L20 20 L0 20 Z", // Square
      "M10 0 Q20 10 10 20 Q0 10 10 0", // Circle-ish
      "M0 10 Q10 0 20 10 Q10 20 0 10", // Circle-ish flipped
      "M0 0 L20 0 L15 20 L5 20 Z", // Trapezoid
    ];
    
    for (let i = 0; i < count; i++) {
      newShapes.push({
        id: i,
        path: shapePaths[Math.floor(Math.random() * shapePaths.length)],
        x: Math.random() * width,
        y: Math.random() * height,
        scale: Math.random() * 2 + 0.5,
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.2 + 0.05,
        color: Math.random() > 0.5 ? primaryColor : secondaryColor,
      });
    }
    
    setShapes(newShapes);
  };
  
  // Update dimensions when window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        
        if (type === 'particles') {
          generateParticles(width, height);
        } else if (type === 'animated-shapes') {
          generateShapes(width, height);
        }
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [type, density, primaryColor, secondaryColor]);
  
  // Handle mouse movement for interactive backgrounds
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    
    const handleMouseEnter = () => {
      setIsHovering(true);
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
    };
    
    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('mouseenter', handleMouseEnter);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive]);
  
  // Animation loop for particles
  useEffect(() => {
    if (type !== 'particles' || !animated) return;
    
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let newY = particle.y + particle.speed;
          
          // Loop particles from bottom to top
          if (newY > dimensions.height + particle.size) {
            newY = -particle.size;
          }
          
          // Interactive behavior - particles move toward the mouse
          let newX = particle.x;
          if (interactive && isHovering) {
            const distance = Math.sqrt(
              Math.pow(mousePosition.x - particle.x, 2) + 
              Math.pow(mousePosition.y - particle.y, 2)
            );
            
            if (distance < 100) {
              const angle = Math.atan2(mousePosition.y - particle.y, mousePosition.x - particle.x);
              newX += Math.cos(angle) * (1 - distance / 100) * 2;
            }
          }
          
          return {
            ...particle,
            y: newY,
            x: newX,
          };
        })
      );
      
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    };
    
    animationFrameRef.current = requestAnimationFrame(animateParticles);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [type, animated, dimensions, interactive, isHovering, mousePosition]);
  
  // Animation loop for shapes
  useEffect(() => {
    if (type !== 'animated-shapes' || !animated) return;
    
    const animateShapes = () => {
      setShapes(prevShapes => 
        prevShapes.map(shape => {
          let newRotation = shape.rotation + 0.05;
          if (newRotation > 360) newRotation = 0;
          
          // Interactive behavior - shapes rotate toward the mouse
          let newScale = shape.scale;
          if (interactive && isHovering) {
            const distance = Math.sqrt(
              Math.pow(mousePosition.x - shape.x, 2) + 
              Math.pow(mousePosition.y - shape.y, 2)
            );
            
            if (distance < 150) {
              newScale = shape.scale * (1 + (1 - distance / 150) * 0.2);
            }
          }
          
          return {
            ...shape,
            rotation: newRotation,
            scale: newScale,
          };
        })
      );
      
      animationFrameRef.current = requestAnimationFrame(animateShapes);
    };
    
    animationFrameRef.current = requestAnimationFrame(animateShapes);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [type, animated, interactive, isHovering, mousePosition]);
  
  // Draw particles on canvas
  useEffect(() => {
    if (type !== 'particles' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    // Draw each particle
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.fill();
    });
  }, [particles, dimensions, type]);
  
  // Render different background types
  const renderBackground = () => {
    switch (type) {
      case 'particles':
        return (
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0"
          />
        );
        
      case 'gradient':
        return (
          <div 
            className="absolute inset-0 bg-gradient-to-br"
            style={{ 
              backgroundImage: `linear-gradient(to bottom right, ${primaryColor}40, ${secondaryColor}30)` 
            }}
          >
            {animated && (
              <motion.div 
                className="absolute inset-0 opacity-30"
                animate={{ 
                  background: [
                    `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}10)`,
                    `linear-gradient(to bottom left, ${primaryColor}10, ${secondaryColor}20)`,
                    `linear-gradient(to top right, ${primaryColor}20, ${secondaryColor}10)`,
                    `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}10)`,
                  ]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
            )}
            
            {interactive && isHovering && (
              <motion.div 
                className="absolute rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ 
                  left: mousePosition.x - 100,
                  top: mousePosition.y - 100,
                  width: 200,
                  height: 200,
                  background: `radial-gradient(circle, ${primaryColor}30, transparent 70%)`,
                }}
              />
            )}
          </div>
        );
        
      case 'animated-shapes':
        return (
          <svg 
            width={dimensions.width} 
            height={dimensions.height}
            className="absolute inset-0"
          >
            {shapes.map(shape => (
              <g 
                key={shape.id}
                transform={`translate(${shape.x}, ${shape.y}) scale(${shape.scale}) rotate(${shape.rotation})`}
              >
                <motion.path
                  d={shape.path}
                  fill={`${shape.color}${Math.floor(shape.opacity * 255).toString(16).padStart(2, '0')}`}
                  animate={animated ? { 
                    scale: [1, 1.1, 1],
                    opacity: [shape.opacity, shape.opacity * 1.5, shape.opacity]
                  } : {}}
                  transition={{ 
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </g>
            ))}
          </svg>
        );
        
      case 'grid':
        // Calculate grid size based on density
        const gridSizes = {
          low: 80,
          medium: 50,
          high: 30,
        };
        const gridSize = gridSizes[density];
        const horizontalLines = Math.ceil(dimensions.height / gridSize);
        const verticalLines = Math.ceil(dimensions.width / gridSize);
        
        return (
          <svg 
            width={dimensions.width} 
            height={dimensions.height}
            className="absolute inset-0"
          >
            <defs>
              <pattern 
                id="grid-pattern" 
                width={gridSize} 
                height={gridSize} 
                patternUnits="userSpaceOnUse"
              >
                <path 
                  d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} 
                  fill="none" 
                  stroke={`${primaryColor}20`} 
                  strokeWidth="0.5" 
                />
              </pattern>
            </defs>
            <rect 
              width={dimensions.width} 
              height={dimensions.height} 
              fill="url(#grid-pattern)" 
            />
            
            {/* Draw horizontal highlight at mouse position */}
            {interactive && isHovering && (
              <motion.line
                x1="0"
                y1={mousePosition.y}
                x2={dimensions.width}
                y2={mousePosition.y}
                stroke={primaryColor}
                strokeWidth="1"
                strokeOpacity="0.3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            
            {/* Draw vertical highlight at mouse position */}
            {interactive && isHovering && (
              <motion.line
                x1={mousePosition.x}
                y1="0"
                x2={mousePosition.x}
                y2={dimensions.height}
                stroke={primaryColor}
                strokeWidth="1"
                strokeOpacity="0.3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            
            {/* Animated horizontal waves */}
            {animated && Array.from({ length: 3 }).map((_, i) => (
              <motion.path
                key={`h-wave-${i}`}
                d={`M 0 ${dimensions.height * (0.3 + i * 0.2)} Q ${dimensions.width / 4} ${dimensions.height * (0.25 + i * 0.2)}, ${dimensions.width / 2} ${dimensions.height * (0.3 + i * 0.2)} T ${dimensions.width} ${dimensions.height * (0.3 + i * 0.2)}`}
                stroke={i % 2 ? primaryColor : secondaryColor}
                strokeWidth="1"
                strokeOpacity="0.1"
                fill="transparent"
                animate={{
                  d: [
                    `M 0 ${dimensions.height * (0.3 + i * 0.2)} Q ${dimensions.width / 4} ${dimensions.height * (0.25 + i * 0.2)}, ${dimensions.width / 2} ${dimensions.height * (0.3 + i * 0.2)} T ${dimensions.width} ${dimensions.height * (0.3 + i * 0.2)}`,
                    `M 0 ${dimensions.height * (0.3 + i * 0.2)} Q ${dimensions.width / 4} ${dimensions.height * (0.35 + i * 0.2)}, ${dimensions.width / 2} ${dimensions.height * (0.3 + i * 0.2)} T ${dimensions.width} ${dimensions.height * (0.3 + i * 0.2)}`,
                    `M 0 ${dimensions.height * (0.3 + i * 0.2)} Q ${dimensions.width / 4} ${dimensions.height * (0.25 + i * 0.2)}, ${dimensions.width / 2} ${dimensions.height * (0.3 + i * 0.2)} T ${dimensions.width} ${dimensions.height * (0.3 + i * 0.2)}`,
                  ]
                }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </svg>
        );
        
      case 'waves':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`wave-${i}`}
                className="absolute bottom-0 left-0 right-0 h-[50px] opacity-10"
                style={{ 
                  backgroundColor: i % 2 ? primaryColor : secondaryColor,
                  bottom: `${i * 40}px`,
                }}
                animate={animated ? {
                  y: [0, -20, 0],
                } : {}}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
                custom={i}
              >
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-full w-full h-[25px]">
                  <path
                    d="M0,0 C150,40 350,0 500,30 C650,60 800,40 1000,20 L1200,0 L0,0 Z"
                    fill={i % 2 ? primaryColor : secondaryColor}
                    className="opacity-80"
                  ></path>
                </svg>
              </motion.div>
            ))}
            
            {/* Interactive ripple effect */}
            {interactive && isHovering && (
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: mousePosition.x - 50,
                  top: mousePosition.y - 50,
                  width: 100,
                  height: 100,
                  border: `2px solid ${primaryColor}40`,
                  backgroundColor: 'transparent',
                }}
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                key={`ripple-${Date.now()}`} // Force re-render on each mouse movement
              />
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      {renderBackground()}
    </div>
  );
};

export default EnhancedBackground;