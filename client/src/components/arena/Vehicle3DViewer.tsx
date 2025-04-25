import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Slider,
  Card,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Layers,
  Plus,
  Minus,
  RefreshCw,
  Maximize,
  Camera,
  Lightbulb,
  Sun,
  Moon,
  Download
} from 'lucide-react';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'exterior' | 'interior' | 'performance';
  description: string;
}

interface Vehicle3DViewerProps {
  vehicleId: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  onPartSelect?: (partId: string) => void;
}

const Vehicle3DViewer: React.FC<Vehicle3DViewerProps> = ({
  vehicleId,
  vehicleMake,
  vehicleModel,
  vehicleYear,
  onPartSelect
}) => {
  // In a real implementation, we would use a WebGL library like Three.js
  // For this prototype, we'll simulate the 3D view with a rotating image
  
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [lightingMode, setLightingMode] = useState<'day' | 'night'>('day');
  const [viewMode, setViewMode] = useState<'exterior' | 'interior'>('exterior');
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<number | null>(null);
  
  // Sample hotspots for the 3D model
  const hotspots: Hotspot[] = [
    {
      id: 'front-bumper',
      x: 50,
      y: 85,
      label: 'Front Bumper',
      type: 'exterior',
      description: 'Customizable front bumper with multiple style options.'
    },
    {
      id: 'headlights',
      x: 30,
      y: 70,
      label: 'Headlights',
      type: 'exterior',
      description: 'LED or projector headlights with DRL options.'
    },
    {
      id: 'wheels',
      x: 20,
      y: 90,
      label: 'Wheels',
      type: 'exterior',
      description: 'Alloy wheels in various sizes from 15" to 18".'
    },
    {
      id: 'engine',
      x: 70,
      y: 70,
      label: 'Engine',
      type: 'performance',
      description: 'Engine performance upgrades and tuning options.'
    },
    {
      id: 'seats',
      x: 60,
      y: 60,
      label: 'Seats',
      type: 'interior',
      description: 'Leather or sport bucket seat options with custom upholstery.'
    }
  ];
  
  // Get filtered hotspots based on current view mode
  const visibleHotspots = hotspots.filter(hotspot => {
    if (viewMode === 'exterior') return hotspot.type === 'exterior' || hotspot.type === 'performance';
    return hotspot.type === 'interior';
  });
  
  // Auto-rotate effect
  useEffect(() => {
    if (isAutoRotating) {
      autoRotateRef.current = window.setInterval(() => {
        setRotation(prev => (prev + 5) % 360);
      }, 100);
    } else if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }
    
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [isAutoRotating]);
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // Handle manual rotation
  const handleRotationChange = (value: number[]) => {
    setRotation(value[0]);
  };
  
  // Toggle auto-rotation
  const toggleAutoRotate = () => {
    setIsAutoRotating(prev => !prev);
  };
  
  // Reset view
  const resetView = () => {
    setRotation(0);
    setZoom(1);
    setIsAutoRotating(false);
  };
  
  // Toggle lighting mode
  const toggleLightingMode = () => {
    setLightingMode(prev => prev === 'day' ? 'night' : 'day');
  };
  
  // Handle hotspot click
  const handleHotspotClick = (hotspotId: string) => {
    setSelectedHotspot(prev => prev === hotspotId ? null : hotspotId);
    if (onPartSelect) {
      onPartSelect(hotspotId);
    }
  };
  
  // Choose vehicle image based on rotation (in real app, would use 3D model)
  const getVehicleImageUrl = () => {
    // For demo purposes, we'll use a fixed image
    let imageUrl = "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75";
    
    // Honda City
    if (vehicleMake === 'Honda' && vehicleModel === 'City') {
      if (rotation <= 90) {
        return "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75";
      } else if (rotation <= 180) {
        return "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75";
      } else if (rotation <= 270) {
        return "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75";
      } else {
        return "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75";
      }
    }
    
    return imageUrl;
  };
  
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">3D Customization Studio</h3>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetView}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLightingMode}
          >
            {lightingMode === 'day' ? (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Night Mode
              </>
            ) : (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Day Mode
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // In a real app, this would capture and save the current view
              alert('Screenshot saved to your gallery!');
            }}
          >
            <Camera className="h-4 w-4 mr-2" />
            Screenshot
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row h-[600px]">
        <div className="flex-1 relative overflow-hidden" ref={containerRef}>
          {/* Main 3D view area */}
          <div 
            className={`w-full h-full flex items-center justify-center relative ${
              lightingMode === 'night' ? 'bg-neutral-900' : 'bg-neutral-100'
            }`}
            style={{
              perspective: '1000px'
            }}
          >
            {/* The vehicle image (would be a 3D model in production) */}
            <motion.div
              animate={{
                rotateY: rotation, 
                scale: zoom
              }}
              transition={{ type: 'spring', stiffness: 100 }}
              style={{
                transformStyle: 'preserve-3d'
              }}
              className="relative"
            >
              <img 
                src={getVehicleImageUrl()} 
                alt={`${vehicleYear} ${vehicleMake} ${vehicleModel}`}
                className="max-w-full max-h-full object-contain"
                style={{ 
                  filter: lightingMode === 'night' ? 'brightness(0.7) saturate(0.8)' : 'none',
                  maxHeight: '400px'
                }}
              />
              
              {/* Hotspots */}
              {viewMode === 'exterior' && visibleHotspots.map((hotspot) => (
                <TooltipProvider key={hotspot.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`absolute rounded-full flex items-center justify-center ${
                          selectedHotspot === hotspot.id 
                            ? 'bg-primary text-white h-8 w-8 z-10' 
                            : 'bg-primary/80 text-white h-6 w-6'
                        } transition-all duration-200`}
                        style={{
                          left: `${hotspot.x}%`,
                          top: `${hotspot.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => handleHotspotClick(hotspot.id)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{hotspot.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </motion.div>
            
            {/* Selected hotspot info card */}
            {selectedHotspot && (
              <div className="absolute bottom-4 left-4 right-4 bg-card bg-opacity-90 p-3 rounded-lg shadow-lg border">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      {hotspots.find(h => h.id === selectedHotspot)?.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {hotspots.find(h => h.id === selectedHotspot)?.description}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {hotspots.find(h => h.id === selectedHotspot)?.type}
                  </Badge>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button size="sm" onClick={() => window.location.href = '/arena/parts'}>
                    View Options
                  </Button>
                </div>
              </div>
            )}
            
            {/* Zoom controls */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-card rounded-full p-1 shadow-md border">
              <div className="flex flex-col gap-1">
                <Button size="icon" variant="ghost" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Rotation slider */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 max-w-md">
            <Card>
              <CardContent className="p-2">
                <div className="flex items-center gap-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleAutoRotate}
                    className={isAutoRotating ? 'text-primary' : ''}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Slider
                    defaultValue={[0]}
                    value={[rotation]}
                    max={360}
                    step={1}
                    onValueChange={handleRotationChange}
                    className="flex-1"
                  />
                  <span className="text-xs w-8 text-right">{rotation}°</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Right sidebar for customization options */}
        <div className="w-full md:w-64 border-l bg-card">
          <div className="p-4 border-b">
            <h3 className="font-semibold">View Options</h3>
          </div>
          
          <Tabs defaultValue="exterior" className="w-full" onValueChange={(value) => setViewMode(value as 'exterior' | 'interior')}>
            <div className="px-4 pt-4">
              <TabsList className="w-full">
                <TabsTrigger value="exterior" className="flex-1">Exterior</TabsTrigger>
                <TabsTrigger value="interior" className="flex-1">Interior</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Click on the indicators to learn more about customizable areas
              </p>
              
              <h4 className="font-medium text-sm mb-2">Available Customizations:</h4>
              <div className="space-y-1">
                {visibleHotspots.map(hotspot => (
                  <div 
                    key={hotspot.id}
                    className={`p-2 rounded-md text-sm cursor-pointer transition-colors ${
                      selectedHotspot === hotspot.id 
                        ? 'bg-primary/10 font-medium' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleHotspotClick(hotspot.id)}
                  >
                    {hotspot.label}
                  </div>
                ))}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Vehicle3DViewer;