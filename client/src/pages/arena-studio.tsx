import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  RotateCw,
  Save,
  Sliders,
  Play,
  Camera,
  Share2,
  Plus,
  Info,
  ShoppingCart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define simple types for our immersive Arena experience
interface Vehicle {
  id: number;
  name: string;
  type: string;
  brand: string;
  image: string;
}

// Available vehicles
const vehicles: Vehicle[] = [
  { 
    id: 1, 
    name: 'City Roadster', 
    type: 'Sedan', 
    brand: 'AutoLux', 
    image: 'https://firebasestorage.googleapis.com/v0/b/nextjs-demo-c0e29.appspot.com/o/sedan-blue.png?alt=media'
  },
  { 
    id: 2, 
    name: 'Urban Explorer', 
    type: 'SUV', 
    brand: 'TrekStar', 
    image: 'https://firebasestorage.googleapis.com/v0/b/nextjs-demo-c0e29.appspot.com/o/suv-red.png?alt=media'
  },
  { 
    id: 3, 
    name: 'Thunder Bolt', 
    type: 'Sports', 
    brand: 'Velocity', 
    image: 'https://firebasestorage.googleapis.com/v0/b/nextjs-demo-c0e29.appspot.com/o/sports-yellow.png?alt=media' 
  }
];

// Available colors
const availableColors = [
  { name: 'Racing Red', hex: '#D90429' },
  { name: 'Electric Blue', hex: '#1E3A8A' },
  { name: 'Phantom Black', hex: '#0F172A' },
  { name: 'Arctic White', hex: '#F8FAFC' },
  { name: 'Solar Orange', hex: '#EA580C' },
  { name: 'Velocity Green', hex: '#15803D' }
];

// Immersive Arena Studio Experience
const ArenaStudio: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // State for the vehicle editor
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedColor, setSelectedColor] = useState(availableColors[1]); // Default to blue
  const [viewMode, setViewMode] = useState<'front' | 'side' | 'rear' | 'interior'>('side');
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // References for animation and interactive elements
  const vehicleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setShowControls(!isFullscreen); // Show controls when exiting fullscreen
  };
  
  // Function to handle vehicle selection
  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    
    toast({
      title: "Vehicle Selected",
      description: `Now customizing ${vehicle.brand} ${vehicle.name}`,
    });
  };
  
  // Function to handle color selection
  const handleSelectColor = (color: typeof availableColors[0]) => {
    setSelectedColor(color);
    
    toast({
      title: "Color Changed",
      description: `Vehicle color updated to ${color.name}`,
    });
  };
  
  // Function to handle view mode change
  const handleViewChange = (mode: 'front' | 'side' | 'rear' | 'interior') => {
    setViewMode(mode);
  };
  
  // Function to save current design
  const handleSaveDesign = () => {
    if (!selectedVehicle) {
      toast({
        title: "No Vehicle Selected",
        description: "Please select a vehicle before saving your design",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Design Saved",
      description: "Your vehicle design has been saved successfully",
    });
  };
  
  // Function to reset the design
  const handleResetDesign = () => {
    setSelectedVehicle(null);
    setSelectedColor(availableColors[1]);
    setViewMode('side');
    
    toast({
      title: "Design Reset",
      description: "Start fresh with a new design",
    });
  };
  
  // Function to take a screenshot
  const handleTakeScreenshot = () => {
    toast({
      title: "Screenshot Captured",
      description: "Your vehicle design has been captured",
    });
  };
  
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Full page dynamic background with video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          className="absolute w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-traveling-through-a-canyon-road-and-the-horizon-42763-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80"></div>
      </div>
      
      {/* Minimal header with controls */}
      <motion.header 
        className="relative z-10 flex items-center justify-between p-5 bg-black/50 backdrop-blur-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setLocation('/arena')}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-white">Launch Arena</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent border-white/30 text-white hover:bg-white/10"
            onClick={handleResetDesign}
          >
            <RotateCw size={16} className="mr-2" /> Reset
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-transparent border-white/30 text-white hover:bg-white/10"
            onClick={() => setLocation('/enhanced-arena-features')}
          >
            Premium Features
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSaveDesign}
          >
            <Save size={16} className="mr-2" /> Save Project
          </Button>
        </div>
      </motion.header>
      
      {/* Main content area */}
      <div className="relative z-10 flex-1 flex flex-row overflow-hidden">
        {/* Left sidebar with color options and controls (visible when showControls is true) */}
        {showControls && (
          <motion.div 
            className="w-64 bg-black/70 backdrop-blur-md p-4 text-white overflow-y-auto"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Vehicle Selection</h3>
              <div className="space-y-2">
                {vehicles.map((vehicle) => (
                  <div 
                    key={vehicle.id}
                    className={`p-2 rounded-md cursor-pointer transition-colors ${selectedVehicle?.id === vehicle.id ? 'bg-blue-600/60' : 'hover:bg-white/10'}`}
                    onClick={() => handleSelectVehicle(vehicle)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {/* Vehicle emoji or small image */}
                        <div className="w-10 h-10 bg-blue-900/30 rounded-md flex items-center justify-center">
                          {vehicle.type === 'Sedan' ? '🚗' : 
                           vehicle.type === 'SUV' ? '🚙' : '🏎️'}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{vehicle.name}</p>
                        <p className="text-xs text-gray-400">{vehicle.brand} {vehicle.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Color Selection</h3>
              <div className="grid grid-cols-3 gap-2">
                {availableColors.map((color) => (
                  <div 
                    key={color.name}
                    className={`w-full aspect-square rounded-md cursor-pointer transition-all ${selectedColor.hex === color.hex ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleSelectColor(color)}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="text-sm mt-2 text-center text-gray-300">{selectedColor.name}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">View Angle</h3>
              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`${viewMode === 'front' ? 'bg-blue-600/60' : 'bg-white/10'} text-white`}
                  onClick={() => handleViewChange('front')}
                >
                  Front
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`${viewMode === 'side' ? 'bg-blue-600/60' : 'bg-white/10'} text-white`}
                  onClick={() => handleViewChange('side')}
                >
                  Side
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`${viewMode === 'rear' ? 'bg-blue-600/60' : 'bg-white/10'} text-white`}
                  onClick={() => handleViewChange('rear')}
                >
                  Rear
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`${viewMode === 'interior' ? 'bg-blue-600/60' : 'bg-white/10'} text-white`}
                  onClick={() => handleViewChange('interior')}
                >
                  Interior
                </Button>
              </div>
            </div>
            
            <div className="mt-auto">
              <p className="text-sm text-gray-400 mb-2">Advanced Controls</p>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10"
                  onClick={handleTakeScreenshot}
                >
                  <Camera size={16} className="mr-2" /> Capture
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? 'Exit Full' : 'Fullscreen'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Main vehicle display area */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden flex items-center justify-center"
        >
          {/* Vehicle visualization */}
          <motion.div 
            ref={vehicleRef}
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {selectedVehicle ? (
              <div className="relative">
                {/* Show selected vehicle image with selected color overlay */}
                <div 
                  className="relative w-[600px] h-auto transition-all duration-300"
                  style={{ 
                    filter: `drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))`,
                    transform: `
                      ${viewMode === 'front' ? 'rotateY(25deg)' : ''}
                      ${viewMode === 'rear' ? 'rotateY(-25deg)' : ''}
                      ${viewMode === 'interior' ? 'scale(1.2)' : ''}
                    `
                  }}
                >
                  <img 
                    src={selectedVehicle.image} 
                    alt={selectedVehicle.name} 
                    className="w-full h-auto"
                  />
                  <div 
                    className="absolute inset-0 mix-blend-multiply"
                    style={{ backgroundColor: selectedColor.hex }}
                  ></div>
                </div>
                
                {/* Vehicle info overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{selectedVehicle.brand} {selectedVehicle.name}</h3>
                      <p className="text-sm text-gray-300">{selectedVehicle.type} • {selectedColor.name}</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{formatPrice(1250000)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-white">
                <p className="text-xl mb-4">Select a vehicle to begin customization</p>
                <div className="flex gap-3 justify-center">
                  {vehicles.map((vehicle) => (
                    <Button 
                      key={vehicle.id}
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
                      onClick={() => handleSelectVehicle(vehicle)}
                    >
                      {vehicle.type === 'Sedan' ? '🚗' : 
                       vehicle.type === 'SUV' ? '🚙' : '🏎️'} {vehicle.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Toggle controls button (small tab on the side) */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-r-md"
            onClick={() => setShowControls(!showControls)}
            aria-label={showControls ? "Hide controls" : "Show controls"}
          >
            <ChevronRight 
              size={20} 
              className={`transition-transform ${showControls ? 'rotate-180' : ''}`} 
            />
          </button>
          
          {/* Floating action buttons (bottom right) */}
          {selectedVehicle && (
            <div className="absolute bottom-6 right-6 flex gap-3">
              <Button
                variant="secondary"
                className="backdrop-blur-md bg-black/60 text-white border-white/20 hover:bg-white/20"
                size="icon"
                onClick={() => {
                  toast({
                    title: "Info Panel",
                    description: "Vehicle specifications and details",
                  });
                }}
              >
                <Info size={20} />
              </Button>
              <Button
                variant="secondary"
                className="backdrop-blur-md bg-black/60 text-white border-white/20 hover:bg-white/20"
                size="icon"
                onClick={() => {
                  toast({
                    title: "Share Design",
                    description: "Share your customized vehicle with others",
                  });
                }}
              >
                <Share2 size={20} />
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  toast({
                    title: "Added to Cart",
                    description: `${selectedVehicle.brand} ${selectedVehicle.name} in ${selectedColor.name}`,
                  });
                }}
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </Button>
            </div>
          )}
          
          {/* Animated speed lines overlay */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 speed-lines-horizontal opacity-30"></div>
            <div className="absolute inset-0 speed-lines-diagonal opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaStudio;