import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  Environment, 
  PresentationControls, 
  Stage, 
  OrbitControls, 
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  useGLTF,
  useTexture,
  Html,
  CameraShake
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import * as THREE from 'three';
import { Vector3, Quaternion } from 'three';
import { CustomizationPartInstance, VehicleConfiguration } from '@shared/arena-schema';

// Environment options - using built-in presets instead of external HDRs for reliability
const environments = [
  { id: 'studio', name: 'Studio', preset: 'studio' as const },
  { id: 'sunset', name: 'Sunset', preset: 'sunset' as const },
  { id: 'warehouse', name: 'Warehouse', preset: 'warehouse' as const },
  { id: 'city', name: 'City', preset: 'city' as const },
  { id: 'night', name: 'Night', preset: 'night' as const },
];

// Placeholder Vehicle Mesh - would be replaced with actual loaded models
const VehicleBaseMesh = ({ 
  color = '#1E3A8A',
  modelUrl = '',
  scale = 1
}: { 
  color: string, 
  modelUrl?: string,
  scale?: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Rotate slowly for demo purposes
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  // If modelUrl is provided, we would load the actual 3D model
  // For now using a basic shape as placeholder
  return (
    <mesh 
      ref={meshRef} 
      scale={scale} 
      castShadow
      receiveShadow
      position={[0, 0, 0]}
    >
      <capsuleGeometry args={[1, 2, 8, 16]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.3} 
        metalness={0.8} 
      />
    </mesh>
  );
};

// Custom Part Component 
const CustomizationPart = ({ 
  part, 
  onClick 
}: { 
  part: CustomizationPartInstance,
  onClick?: (part: CustomizationPartInstance) => void
}) => {
  const [hovered, setHovered] = useState(false);
  const [glbMesh, setGlbMesh] = useState<THREE.Group | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Would load actual model in production version
  // For now using a basic shape that corresponds to the part type
  const getGeometry = () => {
    const partId = part.partId.toString();
    
    if (partId.includes('spoiler')) {
      return <boxGeometry args={[2, 0.1, 0.5]} />;
    } else if (partId.includes('wheel')) {
      return <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />; // Rotation applied at mesh level
    } else if (partId.includes('exhaust')) {
      return <cylinderGeometry args={[0.1, 0.1, 1, 16]} />; // Rotation applied at mesh level
    } else if (partId.includes('light')) {
      return <sphereGeometry args={[0.3, 16, 16]} />;
    } else {
      return <boxGeometry args={[0.5, 0.5, 0.5]} />;
    }
  };

  // Position the part according to its transform data
  const position = new Vector3(
    part.transform.position.x,
    part.transform.position.y,
    part.transform.position.z
  );

  // Convert quaternion to Euler for Three.js rotation
  const quaternion = new Quaternion(
    part.transform.rotation.x,
    part.transform.rotation.y,
    part.transform.rotation.z,
    part.transform.rotation.w || 1
  );

  return (
    <mesh
      ref={meshRef}
      position={position}
      quaternion={quaternion}
      scale={[
        part.transform.scale.x || 1,
        part.transform.scale.y || 1,
        part.transform.scale.z || 1
      ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(part);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={part.color || '#888888'} 
        roughness={0.4}
        metalness={0.6}
        emissive={hovered ? '#ffffff' : '#000000'}
        emissiveIntensity={hovered ? 0.2 : 0}
      />
      
      {hovered && (
        <Html position={[0, 0.5, 0]} center distanceFactor={10}>
          <div className="bg-black/80 text-white px-2 py-1 text-xs rounded whitespace-nowrap">
            {part.metadata?.name || `Part #${part.partId}`}
          </div>
        </Html>
      )}
    </mesh>
  );
};

// Camera and Controls
const SceneCamera = ({ 
  enableShake = false,
  cameraPosition = [0, 0, 5]
}) => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    camera.lookAt(0, 0, 0);
  }, [camera, cameraPosition]);
  
  return (
    <>
      <OrbitControls 
        enableDamping 
        dampingFactor={0.1} 
        rotateSpeed={0.5}
        minDistance={3}
        maxDistance={20}
        autoRotate={false}
      />
      {enableShake && (
        <CameraShake 
          maxYaw={0.01} 
          maxPitch={0.01} 
          maxRoll={0.01} 
          yawFrequency={0.5} 
          pitchFrequency={0.5} 
          rollFrequency={0.4} 
        />
      )}
    </>
  );
};

interface PremiumThreeDVisualizerProps {
  vehicleConfiguration: VehicleConfiguration;
  environmentId?: string;
  enableShadows?: boolean;
  enableCameraShake?: boolean;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  width?: string;
  height?: string;
  className?: string;
  onPartClick?: (part: CustomizationPartInstance) => void;
  showTurntable?: boolean;
  controlMode?: 'orbit' | 'present' | 'first-person';
  backgroundColor?: string;
}

const PremiumThreeDVisualizer: React.FC<PremiumThreeDVisualizerProps> = ({
  vehicleConfiguration,
  environmentId = 'studio',
  enableShadows = true,
  enableCameraShake = false,
  quality = 'high',
  width = '100%',
  height = '500px',
  className = '',
  onPartClick,
  showTurntable = true,
  controlMode = 'orbit',
  backgroundColor = 'transparent'
}) => {
  // Select environment based on ID
  const selectedEnv = environments.find(env => env.id === environmentId) || environments[0];
  
  // Performance settings based on quality level
  const performanceSettings = {
    low: { shadows: false, pixelRatio: 1 },
    medium: { shadows: true, pixelRatio: 1.5 },
    high: { shadows: true, pixelRatio: 2 },
    ultra: { shadows: true, pixelRatio: window.devicePixelRatio }
  }[quality];
  
  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`} 
      style={{ width, height, backgroundColor }}
    >
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            <p className="mt-3 text-blue-800 text-sm font-medium">Loading 3D Scene...</p>
          </div>
        </div>
      }>
        <Canvas
          shadows={performanceSettings.shadows}
          dpr={performanceSettings.pixelRatio}
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: quality !== 'low' }}
        >
          {/* Lights */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 10]} 
            intensity={1} 
            castShadow={enableShadows}
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-10, -10, -5]} intensity={0.2} />
          
          {/* Environment */}
          <Environment preset="studio" background={false} />
          
          {/* Vehicle Base Model */}
          <VehicleBaseMesh color={vehicleConfiguration.baseColor} />
          
          {/* Custom Parts */}
          {vehicleConfiguration.parts.map((part) => (
            <CustomizationPart 
              key={part.id} 
              part={part}
              onClick={onPartClick}
            />
          ))}
          
          {/* Floor with shadows */}
          {enableShadows && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <shadowMaterial opacity={0.2} />
            </mesh>
          )}
          
          {/* Camera Controls based on mode */}
          {controlMode === 'orbit' && (
            <SceneCamera 
              enableShake={enableCameraShake} 
              cameraPosition={[4, 2, 5]} 
            />
          )}
          
          {controlMode === 'present' && (
            <PresentationControls
              global
              zoom={1.2}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 2]}
            >
              <group position={[0, -1, 0]} />
            </PresentationControls>
          )}
          
          {/* Contact shadows for better realism */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
        </Canvas>
      </Suspense>

      {/* Environment switcher UI */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
        {environments.map((env) => (
          <motion.button
            key={env.id}
            className={`px-3 py-1.5 text-xs font-medium rounded-full ${
              env.id === environmentId
                ? 'bg-blue-600 text-white'
                : 'bg-white/80 text-gray-700 hover:bg-blue-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Would change environment to:', env.id)}
          >
            {env.name}
          </motion.button>
        ))}
      </div>
      
      {/* Quality setting UI */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-white/80 rounded-lg p-1.5 flex items-center gap-1.5">
          <span className="text-xs text-gray-700">Quality:</span>
          <select 
            className="text-xs bg-transparent border-none font-medium focus:ring-0 text-blue-700"
            value={quality}
            onChange={(e) => console.log('Would change quality to:', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="ultra">Ultra</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PremiumThreeDVisualizer;