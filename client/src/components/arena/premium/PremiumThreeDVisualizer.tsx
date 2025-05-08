import React from 'react';
import { motion } from 'framer-motion';
import { CustomizationPartInstance, VehicleConfiguration } from '@shared/arena-schema';

// Simplified static component that doesn't use any 3D rendering libraries
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
  width = '100%',
  height = '500px',
  className = '',
  backgroundColor = '#f5f7fa'
}) => {
  // Count selected parts for display
  const partsCount = vehicleConfiguration.parts?.length || 0;
  
  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className} flex items-center justify-center`} 
      style={{ width, height, backgroundColor }}
    >
      <div className="flex flex-col items-center justify-center text-center p-4">
        <img
          src={vehicleConfiguration.previewImageUrl || "https://via.placeholder.com/400x230?text=Vehicle+Preview"} 
          alt="Vehicle Preview" 
          className="mb-4 rounded-lg shadow-md max-w-full h-auto"
          style={{ maxHeight: '60%' }}
        />
        
        <h3 className="text-xl font-semibold text-blue-900 mb-2">
          {vehicleConfiguration.vehicleName || "Vehicle Customization"}
        </h3>
        
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {partsCount > 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {partsCount} part{partsCount !== 1 ? 's' : ''} selected
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
            >
              No parts selected yet
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
          >
            {environmentId} view
          </motion.div>
        </div>
        
        <p className="text-gray-500 text-sm">
          3D visualization is currently disabled. Continue customizing your vehicle.
        </p>
      </div>
    </div>
  );
};

export default PremiumThreeDVisualizer;