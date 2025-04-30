import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCw, Maximize, Camera, RefreshCw, Lightbulb, Sun, SunDim } from 'lucide-react';

interface VehicleVisualizerProps {
  vehicleImage?: string;
  vehicleEmoji: string;
  vehicleColor: string;
  onViewChange?: (view: string) => void;
  showControls?: boolean;
}

const VehicleVisualizer: React.FC<VehicleVisualizerProps> = ({
  vehicleImage,
  vehicleEmoji,
  vehicleColor,
  onViewChange,
  showControls = true
}) => {
  const [currentView, setCurrentView] = useState('front');
  const [environment, setEnvironment] = useState('studio');
  const [lighting, setLighting] = useState('daylight');
  
  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (onViewChange) {
      onViewChange(view);
    }
  };
  
  return (
    <div className="relative group">
      <Card className="w-full overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200">
        <div className="relative aspect-[16/9] flex items-center justify-center">
          {/* Vehicle display area */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, bounce: 0.3, type: 'spring' }}
            className="relative"
          >
            {vehicleImage ? (
              <img 
                src={vehicleImage} 
                alt="Vehicle" 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="relative">
                <span className="text-[15rem] flex items-center justify-center">
                  {vehicleEmoji}
                </span>
                <div 
                  className="absolute inset-0 mix-blend-color opacity-70"
                  style={{ backgroundColor: vehicleColor }}
                ></div>
              </div>
            )}
          </motion.div>
          
          {/* Environment backdrop */}
          {environment === 'mountain' && (
            <div className="absolute inset-0 z-[-1] bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] bg-cover bg-center opacity-50"></div>
          )}
          {environment === 'urban' && (
            <div className="absolute inset-0 z-[-1] bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df')] bg-cover bg-center opacity-50"></div>
          )}
          {environment === 'studio' && (
            <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-gray-100 to-gray-200"></div>
          )}
          
          {/* Lighting effects */}
          {lighting === 'dramatic' && (
            <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
          )}
          {lighting === 'night' && (
            <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-slate-800 to-slate-900"></div>
          )}
          
          {/* Mercedes logo watermark */}
          <div className="absolute top-4 left-4 opacity-40">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" />
              <path d="M12 6l-4 6h8l-4-6zM8 14l4 4 4-4H8z" fill="currentColor" />
            </svg>
          </div>
          
          {/* 360 badge */}
          <div className="absolute bottom-4 right-4 flex items-center justify-center bg-black/70 text-white rounded-full w-12 h-12">
            <span className="text-xs font-bold">360°</span>
          </div>
        </div>
      </Card>
      
      {showControls && (
        <div className="absolute left-0 right-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
          <div className="bg-black/70 backdrop-blur-sm rounded-full p-1 flex gap-1">
            <Button 
              variant={currentView === 'front' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-white"
              onClick={() => handleViewChange('front')}
            >
              <span className="text-xs">F</span>
            </Button>
            <Button 
              variant={currentView === 'side' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-white"
              onClick={() => handleViewChange('side')}
            >
              <span className="text-xs">S</span>
            </Button>
            <Button 
              variant={currentView === 'rear' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-white"
              onClick={() => handleViewChange('rear')}
            >
              <span className="text-xs">R</span>
            </Button>
            <Button 
              variant={currentView === 'top' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-white"
              onClick={() => handleViewChange('top')}
            >
              <span className="text-xs">T</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-white"
              onClick={() => handleViewChange('360')}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-black/70 backdrop-blur-sm rounded-full p-1 flex gap-1">
            <Button 
              variant={environment === 'studio' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-white"
              onClick={() => setEnvironment('studio')}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button 
              variant={environment === 'mountain' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-white"
              onClick={() => setEnvironment('mountain')}
            >
              <span className="text-xs">🏔️</span>
            </Button>
            <Button 
              variant={environment === 'urban' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-white"
              onClick={() => setEnvironment('urban')}
            >
              <span className="text-xs">🏙️</span>
            </Button>
          </div>
          
          <div className="bg-black/70 backdrop-blur-sm rounded-full p-1 flex gap-1">
            <Button 
              variant={lighting === 'daylight' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-white"
              onClick={() => setLighting('daylight')}
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button 
              variant={lighting === 'dramatic' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-white"
              onClick={() => setLighting('dramatic')}
            >
              <Lightbulb className="h-4 w-4" />
            </Button>
            <Button 
              variant={lighting === 'night' ? 'secondary' : 'ghost'} 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full text-white"
              onClick={() => setLighting('night')}
            >
              <SunDim className="h-4 w-4" />
            </Button>
          </div>
        </div>  
      )}
    </div>
  );
};

export default VehicleVisualizer;