import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface VehicleModelProps {
  modelId: string;
  vehicleMake?: string;
  vehicleModel?: string;
  showLabels?: boolean;
  autoRotate?: boolean;
  modelColor?: string;
  onLoadComplete?: () => void;
  onViewAngleChange?: (angle: number) => void;
  applyCustomization?: {
    type: 'paint' | 'wheels' | 'bodykit' | 'wrap' | 'interior' | 'lighting';
    itemId: string;
    color?: string;
    texture?: string;
  }[];
}

/**
 * Simulated 3D Vehicle Model component that renders a 360-degree view of a vehicle
 * In a real implementation, this would use a 3D rendering library like Three.js
 */
const VehicleModel: React.FC<VehicleModelProps> = ({
  modelId,
  vehicleMake = 'Generic',
  vehicleModel = 'Car',
  showLabels = true,
  autoRotate = false,
  modelColor = '#3B82F6',
  onLoadComplete,
  onViewAngleChange,
  applyCustomization = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [customizations, setCustomizations] = useState<any[]>([]);

  // Simulated loading of 3D model
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onLoadComplete) {
        onLoadComplete();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  // Apply customizations when they change
  useEffect(() => {
    if (applyCustomization.length > 0) {
      setCustomizations(applyCustomization);
    }
  }, [applyCustomization]);

  // Handle auto-rotation
  useEffect(() => {
    if (!autoRotate || isDragging) return;

    const interval = setInterval(() => {
      setCurrentAngle((prev) => {
        const newAngle = (prev + 1) % 360;
        if (onViewAngleChange) {
          onViewAngleChange(newAngle);
        }
        return newAngle;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [autoRotate, isDragging, onViewAngleChange]);

  // Mouse and touch event handlers for 360 rotation
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;

    const delta = (clientX - startX) / 4; // Adjust sensitivity
    setCurrentAngle((prev) => {
      const newAngle = (prev + delta) % 360;
      if (onViewAngleChange) {
        onViewAngleChange(newAngle);
      }
      return newAngle;
    });
    setStartX(clientX);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Render vehicle model (this is a placeholder, in a real app would use a 3D library)
  const renderModel = () => {
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm font-medium text-muted-foreground">
              Loading vehicle model...
            </p>
          </div>
        </div>
      );
    }

    // In a real implementation, this would be a 3D model
    // For now, we'll use a simple car SVG that rotates based on the current angle
    return (
      <div
        className="w-full h-full flex items-center justify-center relative"
        style={{ transform: `rotateY(${currentAngle}deg)`, transformStyle: 'preserve-3d' }}
      >
        {/* This is a placeholder. In a real implementation, this would be a 3D model */}
        <svg
          width="300"
          height="150"
          viewBox="0 0 300 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transform-gpu"
          style={{ perspective: '1000px' }}
        >
          {/* Basic car shape */}
          <rect x="50" y="80" width="200" height="40" rx="10" fill={modelColor} />
          <rect x="90" y="40" width="120" height="40" rx="15" fill={modelColor} />
          <circle cx="80" cy="120" r="20" fill="#333" />
          <circle cx="220" cy="120" r="20" fill="#333" />
          <circle cx="80" cy="120" r="10" fill="#666" />
          <circle cx="220" cy="120" r="10" fill="#666" />
          
          {/* Added customizations */}
          {customizations.map((custom, i) => {
            // In a real app, you would apply different modifications based on type
            if (custom.type === 'wheels') {
              return (
                <React.Fragment key={`wheel-${i}`}>
                  <circle cx="80" cy="120" r="22" stroke="#FFD700" strokeWidth="4" fill="transparent" />
                  <circle cx="220" cy="120" r="22" stroke="#FFD700" strokeWidth="4" fill="transparent" />
                </React.Fragment>
              );
            } else if (custom.type === 'bodykit') {
              return (
                <React.Fragment key={`bodykit-${i}`}>
                  <rect x="45" y="75" width="210" height="5" rx="2" fill="#222" />
                  <rect x="45" y="120" width="210" height="5" rx="2" fill="#222" />
                </React.Fragment>
              );
            } else if (custom.type === 'paint' && custom.color) {
              // This would modify the actual color, but for demonstration we'll add a tint layer
              return (
                <rect 
                  key={`paint-${i}`}
                  x="50" 
                  y="40" 
                  width="200" 
                  height="80" 
                  rx="15" 
                  fill={custom.color} 
                  opacity="0.6" 
                />
              );
            } else if (custom.type === 'wrap' && custom.texture) {
              // This would apply a pattern to the vehicle
              return (
                <rect 
                  key={`wrap-${i}`}
                  x="50" 
                  y="40" 
                  width="200" 
                  height="80" 
                  rx="15" 
                  fill="url(#pattern)" 
                  opacity="0.8" 
                />
              );
            } else if (custom.type === 'lighting') {
              return (
                <React.Fragment key={`lighting-${i}`}>
                  <circle cx="60" cy="60" r="10" fill="#FFFF99" opacity="0.8" />
                  <circle cx="240" cy="60" r="10" fill="#FFFF99" opacity="0.8" />
                </React.Fragment>
              );
            }
            return null;
          })}
          
          {/* Define patterns for wraps */}
          <defs>
            <pattern id="pattern" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="#999" />
            </pattern>
          </defs>
        </svg>
        
        {/* Interactive hotspots would go here in a real implementation */}
      </div>
    );
  };

  // Vehicle info display
  const renderVehicleInfo = () => {
    if (!showLabels || isLoading) return null;

    return (
      <div className="absolute bottom-4 left-4 bg-black/50 text-white p-2 rounded">
        <div className="text-sm font-semibold">{vehicleMake} {vehicleModel}</div>
        <div className="text-xs">View angle: {Math.round(currentAngle)}°</div>
      </div>
    );
  };

  // Custom drag handler for mouse interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Custom drag handler for touch interactions
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-full relative rounded-lg overflow-hidden bg-black/5 dark:bg-white/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {renderModel()}
      {renderVehicleInfo()}
      
      {/* Drag instructions */}
      {!isLoading && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
          Drag to rotate
        </div>
      )}
    </motion.div>
  );
};

export default VehicleModel;