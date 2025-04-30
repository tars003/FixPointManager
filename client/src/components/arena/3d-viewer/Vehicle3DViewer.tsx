import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  useGLTF, 
  Stage, 
  ContactShadows 
} from '@react-three/drei';
import * as THREE from 'three';

// Define the props type
interface Vehicle3DViewerProps {
  vehicleId: number | null;
  environment?: string;
  cameraAngle?: string;
  className?: string;
  customizations?: any;
}

// Define the vehicle model component
const VehicleModel: React.FC<{ 
  vehicleId: number | null, 
  customizations?: any
}> = ({ vehicleId, customizations }) => {
  const modelRef = useRef<THREE.Group>(null);
  
  // Default car placeholder when no vehicle is selected
  const defaultCarPath = '/models/default-car.glb';

  // This would typically come from an API based on vehicleId
  const modelPath = vehicleId ? `/models/vehicle-${vehicleId}.glb` : defaultCarPath;
  
  // For demo purposes, we'll use the default model
  // In a real implementation, you would load different models based on vehicleId
  const { scene } = useGLTF(defaultCarPath, true);
  
  // Clone the scene to avoid modifying the cached original
  const model = scene.clone();
  
  // Apply customizations if provided
  useEffect(() => {
    if (modelRef.current && customizations) {
      // Example: change material colors based on customizations
      if (customizations.paintColor) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            // Find body parts and change their color
            if (child.name.includes('body') || child.name.includes('Body')) {
              const material = child.material as THREE.MeshStandardMaterial;
              material.color.set(customizations.paintColor);
            }
          }
        });
      }
      
      // Other customizations would go here
    }
  }, [customizations]);
  
  // Animate the model
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Simple idle animation
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });
  
  return (
    <primitive
      ref={modelRef}
      object={model}
      scale={1.5}
      position={[0, -1, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
};

// Camera controller component to handle camera angle changes
const CameraController: React.FC<{ cameraAngle: string }> = ({ cameraAngle }) => {
  const { camera } = useThree();
  const controls = useRef<any>();
  
  useEffect(() => {
    // Set camera position based on angle
    switch (cameraAngle) {
      case 'front':
        camera.position.set(0, 0, 5);
        break;
      case 'side':
        camera.position.set(5, 0, 0);
        break;
      case 'rear':
        camera.position.set(0, 0, -5);
        break;
      case 'top':
        camera.position.set(0, 5, 0);
        camera.lookAt(0, 0, 0);
        break;
      case 'orbit':
        // Reset to default orbital position
        camera.position.set(3, 2, 3);
        break;
      default:
        camera.position.set(3, 2, 3);
    }
    
    // Update controls
    if (controls.current) {
      controls.current.update();
    }
  }, [camera, cameraAngle]);
  
  return (
    <OrbitControls 
      ref={controls}
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.5}
      minDistance={3}
      maxDistance={10}
      enablePan={false}
    />
  );
};

// Environment component to handle different background environments
const EnvironmentWrapper: React.FC<{ environment: string }> = ({ environment }) => {
  // Map environment names to HDR files or presets
  const getEnvironmentPreset = () => {
    switch (environment) {
      case 'showroom':
        return 'studio';
      case 'city':
        return 'city';
      case 'sunset':
        return 'sunset';
      case 'dawn':
        return 'dawn';
      case 'night':
        return 'night';
      default:
        return 'studio';
    }
  };
  
  return (
    <Environment preset={getEnvironmentPreset() as any} />
  );
};

// Main 3D viewer component
const Vehicle3DViewer: React.FC<Vehicle3DViewerProps> = ({ 
  vehicleId, 
  environment = 'showroom', 
  cameraAngle = 'front',
  className = '',
  customizations
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [vehicleId]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Stage environment={false} intensity={0.5} shadows={false}>
          <VehicleModel vehicleId={vehicleId} customizations={customizations} />
        </Stage>
        
        <ContactShadows 
          position={[0, -1.5, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={5}
        />
        
        <CameraController cameraAngle={cameraAngle} />
        <EnvironmentWrapper environment={environment} />
      </Canvas>
    </div>
  );
};

export default Vehicle3DViewer;