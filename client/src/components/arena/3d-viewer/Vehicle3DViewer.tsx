import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
  Bounds,
  useBounds,
  Stage,
} from '@react-three/drei';
import { Suspense } from 'react';
import { Vector3 } from 'three';
import { motion } from 'framer-motion';
import { RefreshCw, ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface Vehicle3DViewerProps {
  vehicleId: number | null;
  vehicleColor?: string;
  environmentPreset?: string;
}

// Basic car mesh as fallback when no 3D model is available
function BasicCarMesh({ color }: { color: string }) {
  return (
    <group>
      {/* Car body - main body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Car cabin - top part */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[2, 0.7, 1.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[1.5, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[1.5, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-1.5, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-1.5, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}

// Vehicle 3D model loader component
function VehicleModel({ vehicleId, vehicleColor }: { vehicleId: number | null, vehicleColor?: string }) {
  const bounds = useBounds();
  
  // Fallback to basic car shape when no vehicle is selected
  if (vehicleId === null) {
    return <BasicCarMesh color={vehicleColor || '#1E40AF'} />;
  }
  
  // For now, use our basic car shape since we don't have real models
  // In a real implementation, this would load a model based on vehicleId
  return (
    <BasicCarMesh color={vehicleColor || '#1E40AF'} />
  );
}

// Camera controls with auto-rotation
function CameraController({ autoRotate }: { autoRotate: boolean }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    if (controlsRef.current) {
      // Set initial camera position
      camera.position.set(5, 2, 5);
      
      // Update controls
      controlsRef.current.update();
    }
  }, [camera]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      minDistance={2}
      maxDistance={10}
      enablePan={false}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      target={new Vector3(0, 0, 0)}
    />
  );
}

// Main 3D Viewer component
const Vehicle3DViewer: React.FC<Vehicle3DViewerProps> = ({
  vehicleId,
  vehicleColor = '#1E40AF',
  environmentPreset = 'city', // Not used since we simplified the scene
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(5);
  
  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle zoom change
  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };
  
  // Controls for camera adjustments
  const Controls = () => (
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 bg-background/80 backdrop-blur-sm shadow-md"
                onClick={() => setAutoRotate(!autoRotate)}
              >
                <RotateCcw className={`h-4 w-4 ${autoRotate ? 'text-primary' : 'text-muted-foreground'}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">{autoRotate ? 'Stop' : 'Start'} Auto-Rotation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="hidden sm:flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 shadow-md">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Slider
            value={[zoomLevel]}
            min={1}
            max={10}
            step={0.1}
            onValueChange={handleZoomChange}
            className="w-24 h-4"
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setZoomLevel(Math.min(10, zoomLevel + 1))}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Zoom In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm rounded-md px-2 py-1 shadow-md flex items-center">
        <Move className="h-3.5 w-3.5 mr-1.5" />
        <span>Drag to rotate, scroll to zoom</span>
      </div>
    </div>
  );
  
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg border">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-6 w-6 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading 3D model...</p>
          </div>
        </div>
      )}
      
      {/* Canvas container */}
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <Canvas shadows>
          <Suspense fallback={null}>
            <Bounds fit clip observe>
              <ambientLight intensity={0.5} />
              <spotLight 
                position={[10, 10, 10]} 
                angle={0.3} 
                penumbra={1} 
                castShadow 
                intensity={1} 
              />
              <VehicleModel 
                vehicleId={vehicleId} 
                vehicleColor={vehicleColor} 
              />
            </Bounds>
            <CameraController autoRotate={autoRotate} />
          </Suspense>
        </Canvas>
      </motion.div>
      
      {/* Controls overlay */}
      <Controls />
    </div>
  );
};

export default Vehicle3DViewer;