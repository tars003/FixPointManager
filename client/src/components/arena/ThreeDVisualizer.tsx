import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, Play, Pause, Camera, CameraOff, Sun, Sunrise } from 'lucide-react';
import { motion } from 'framer-motion';

// We're using the placeholder car model for development
// In production, this would be replaced with actual car models
const CarModel = ({ color = '#1E40AF', rotate = false, animateCamera = false }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [initialCameraPosition] = useState({ x: 5, y: 2, z: 5 });
  
  // Simple animation to rotate the car
  useFrame((state, delta) => {
    if (rotate && mesh.current) {
      mesh.current.rotation.y += delta * 0.5;
    }
    
    if (animateCamera) {
      // Create a circular camera animation path
      const time = state.clock.getElapsedTime() * 0.5;
      camera.position.x = Math.sin(time) * 5;
      camera.position.z = Math.cos(time) * 5;
      camera.position.y = 2 + Math.sin(time * 0.5) * 0.5;
      camera.lookAt(0, 0, 0);
    }
  });
  
  // Reset camera position
  const resetCameraPosition = () => {
    camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
    camera.lookAt(0, 0, 0);
  };

  // Create a simple car shape for the visualization
  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={[1, 1, 1]}>
      {/* Car body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.5, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Car top */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1.5, 0.4, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Car wheels */}
      <mesh position={[0.8, 0, 1]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.8, 0, 1]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.8, 0, -1]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.8, 0, -1]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 0.9, -0.7]} rotation={[Math.PI / 5, 0, 0]}>
        <planeGeometry args={[1.4, 0.8]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.6} />
      </mesh>
    </mesh>
  );
};

interface ThreeDVisualizerProps {
  vehicleColor: string;
  parts?: Array<{
    id: string;
    type: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
    color: string;
  }>;
}

const ThreeDVisualizer: React.FC<ThreeDVisualizerProps> = ({
  vehicleColor,
  parts = []
}) => {
  const [autoRotate, setAutoRotate] = useState(false);
  const [cameraAnimation, setCameraAnimation] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [bgEnvironment, setBgEnvironment] = useState<'studio' | 'sunset' | 'warehouse'>('studio');
  
  const handleToggleRotation = () => {
    setAutoRotate(!autoRotate);
  };
  
  const handleToggleCamera = () => {
    setCameraAnimation(!cameraAnimation);
  };
  
  const handleToggleCameraControls = () => {
    setCameraEnabled(!cameraEnabled);
  };
  
  const handleLightChange = (value: number[]) => {
    setLightIntensity(value[0]);
  };
  
  const environments = {
    studio: 'studio',
    sunset: 'sunset',
    warehouse: 'warehouse'
  };
  
  return (
    <div className="w-full">
      <motion.div 
        className="relative w-full aspect-[16/9] rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[5, 2, 5]} fov={50} />
          {cameraEnabled && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />}
          
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={lightIntensity} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024} 
          />
          
          <Environment preset={environments[bgEnvironment] as any} />
          
          <CarModel 
            color={vehicleColor} 
            rotate={autoRotate} 
            animateCamera={cameraAnimation} 
          />
          
          {/* Render custom parts */}
          {parts.map(part => (
            <mesh 
              key={part.id}
              position={part.position}
              rotation={part.rotation}
              scale={[part.scale, part.scale, part.scale]}
            >
              {part.type === 'spoiler' && (
                <boxGeometry args={[1.7, 0.1, 0.3]} />
              )}
              {part.type === 'wheel' && (
                <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} />
              )}
              {part.type === 'bodkit' && (
                <boxGeometry args={[2.2, 0.2, 4.2]} />
              )}
              <meshStandardMaterial color={part.color} transparent opacity={0.8} />
            </mesh>
          ))}
          
          <gridHelper args={[20, 20, '#777777', '#cccccc']} position={[0, -0.01, 0]} />
        </Canvas>
      </motion.div>
      
      {/* Controls */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        <Button
          variant={autoRotate ? "default" : "outline"}
          onClick={handleToggleRotation}
          className="flex gap-2 items-center"
        >
          <RotateCcw className="h-4 w-4" />
          {autoRotate ? "Stop Rotation" : "Auto Rotate"}
        </Button>
        
        <Button
          variant={cameraAnimation ? "default" : "outline"}
          onClick={handleToggleCamera}
          className="flex gap-2 items-center"
        >
          {cameraAnimation ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {cameraAnimation ? "Stop Camera" : "Animate Camera"}
        </Button>
        
        <Button
          variant={cameraEnabled ? "default" : "outline"}
          onClick={handleToggleCameraControls}
          className="flex gap-2 items-center"
        >
          {cameraEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
          {cameraEnabled ? "Controls On" : "Controls Off"}
        </Button>
        
        <div className="flex flex-col">
          <span className="text-xs mb-1 font-medium flex items-center">
            <Sun className="h-3 w-3 mr-1" /> Light Intensity
          </span>
          <Slider
            defaultValue={[1]}
            max={3}
            step={0.1}
            value={[lightIntensity]}
            onValueChange={handleLightChange}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium flex items-center">
            <Sunrise className="h-3 w-3 mr-1" /> Environment
          </span>
          <select
            className="p-1 text-xs border rounded"
            value={bgEnvironment}
            onChange={(e) => setBgEnvironment(e.target.value as any)}
          >
            <option value="studio">Studio</option>
            <option value="sunset">Sunset</option>
            <option value="warehouse">Warehouse</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ThreeDVisualizer;