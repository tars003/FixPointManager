import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Info, 
  Maximize2, 
  Minimize2,
  ChevronRight, 
  ChevronLeft, 
  ArrowUpRight,
  X,
  Zap, 
  Lightbulb,
  Gauge,
  ThumbsUp
} from 'lucide-react';

interface VehicleComponent {
  id: string;
  name: string;
  description: string;
  detailImage: string;
  upgradeOptions: {
    standard: string;
    premium: string;
    performance: string;
  };
  stats: {
    performance: number;
    durability: number;
    value: number;
  };
  position: { x: number; y: number };
}

interface AnimatedHoverEffectsProps {
  onComponentSelect?: (componentId: string) => void;
}

const vehicleComponents: VehicleComponent[] = [
  {
    id: 'engine',
    name: 'Engine',
    description: 'High-performance power unit with precision engineering.',
    detailImage: '#', // In a real app, these would be actual image paths
    upgradeOptions: {
      standard: 'Stock 1.5L Turbo',
      premium: 'Enhanced 2.0L Turbo',
      performance: 'Sport 2.5L VTEC'
    },
    stats: {
      performance: 85,
      durability: 75,
      value: 90
    },
    position: { x: 30, y: 40 }
  },
  {
    id: 'wheels',
    name: 'Wheels',
    description: 'Lightweight alloy wheels with performance tires.',
    detailImage: '#',
    upgradeOptions: {
      standard: 'Stock 17" Alloy',
      premium: 'Premium 18" Alloy',
      performance: 'Sport 19" Forged'
    },
    stats: {
      performance: 70,
      durability: 85,
      value: 75
    },
    position: { x: 70, y: 75 }
  },
  {
    id: 'suspension',
    name: 'Suspension',
    description: 'Adaptive suspension system for optimal handling.',
    detailImage: '#',
    upgradeOptions: {
      standard: 'Stock Coil Springs',
      premium: 'Sport-Tuned Shocks',
      performance: 'Adaptive Dampers'
    },
    stats: {
      performance: 80,
      durability: 70,
      value: 65
    },
    position: { x: 60, y: 55 }
  },
  {
    id: 'exhaust',
    name: 'Exhaust System',
    description: 'Performance exhaust with optimal flow and acoustics.',
    detailImage: '#',
    upgradeOptions: {
      standard: 'Stock Exhaust',
      premium: 'Sports Exhaust',
      performance: 'Custom Titanium'
    },
    stats: {
      performance: 60,
      durability: 90,
      value: 70
    },
    position: { x: 25, y: 70 }
  },
  {
    id: 'bodykit',
    name: 'Body Kit',
    description: 'Aerodynamic body kit for improved downforce and style.',
    detailImage: '#',
    upgradeOptions: {
      standard: 'Stock Body',
      premium: 'Aero Package',
      performance: 'Carbon Fiber Kit'
    },
    stats: {
      performance: 65,
      durability: 85,
      value: 95
    },
    position: { x: 50, y: 20 }
  }
];

const AnimatedHoverEffects: React.FC<AnimatedHoverEffectsProps> = ({
  onComponentSelect
}) => {
  const { toast } = useToast();
  const [expandedView, setExpandedView] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<VehicleComponent | null>(null);
  const [selectedUpgradeType, setSelectedUpgradeType] = useState<'standard' | 'premium' | 'performance'>('standard');
  const [visibleComponents, setVisibleComponents] = useState<string[]>([]);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);

  const handleToggleExpand = () => {
    setExpandedView(prev => !prev);
    
    // If collapsing view, also clear selection
    if (expandedView) {
      setSelectedComponent(null);
    }
  };

  const handleHoverComponent = (component: VehicleComponent) => {
    // Track which components have been viewed
    if (!visibleComponents.includes(component.id)) {
      setVisibleComponents(prev => [...prev, component.id]);
    }
  };

  const handleSelectComponent = (component: VehicleComponent) => {
    setSelectedComponent(component);
    
    if (onComponentSelect) {
      onComponentSelect(component.id);
    }
    
    toast({
      title: `${component.name} Selected`,
      description: "Explore upgrade options for this component.",
    });
  };

  const handleSelectUpgrade = (type: 'standard' | 'premium' | 'performance') => {
    if (!selectedComponent) return;
    
    setSelectedUpgradeType(type);
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Upgrade Selected`,
      description: `${selectedComponent.upgradeOptions[type]} has been selected.`,
    });
  };

  const handleCloseDetail = () => {
    setSelectedComponent(null);
  };

  const handleNextComponent = () => {
    setCurrentComponentIndex(prev => 
      prev === vehicleComponents.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevComponent = () => {
    setCurrentComponentIndex(prev => 
      prev === 0 ? vehicleComponents.length - 1 : prev - 1
    );
  };

  // Carousel mode shows one component at a time for mobile friendliness
  const activeComponent = vehicleComponents[currentComponentIndex];

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Interactive Vehicle Components</h3>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleToggleExpand}
        >
          {expandedView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className={`rounded-lg border bg-card overflow-hidden transition-all duration-300 ${expandedView ? 'h-[500px]' : 'h-[300px]'}`}>
        {/* Vehicle Visualization Area */}
        <div className="relative w-full h-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
          {/* Main interactive area - in a real app this would be a vehicle image with hotspots */}
          {expandedView ? (
            // Expanded view shows all component hotspots
            vehicleComponents.map((component) => (
              <motion.div
                key={component.id}
                className="absolute"
                style={{ 
                  top: `${component.position.y}%`, 
                  left: `${component.position.x}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                whileHover={{ scale: 1.2 }}
                onHoverStart={() => handleHoverComponent(component)}
                onClick={() => handleSelectComponent(component)}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center cursor-pointer
                  ${selectedComponent?.id === component.id ? 
                    'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 
                    'bg-white dark:bg-slate-800 shadow-md hover:shadow-lg'}
                  transition-all duration-300
                `}>
                  {component.id === 'engine' && <Zap className="h-6 w-6" />}
                  {component.id === 'wheels' && <Settings className="h-6 w-6" />}
                  {component.id === 'suspension' && <Gauge className="h-6 w-6" />}
                  {component.id === 'exhaust' && <ThumbsUp className="h-6 w-6" />}
                  {component.id === 'bodykit' && <Lightbulb className="h-6 w-6" />}
                </div>
                
                <motion.div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-slate-800 px-2 py-1 rounded text-sm font-medium shadow-md whitespace-nowrap"
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {component.name}
                </motion.div>
              </motion.div>
            ))
          ) : (
            // Carousel view for compact display
            <div className="relative w-full h-full flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute left-2 z-10 bg-white/80 dark:bg-slate-800/80 rounded-full"
                onClick={handlePrevComponent}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <motion.div
                key={activeComponent.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => handleSelectComponent(activeComponent)}
              >
                <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center mb-4">
                  {activeComponent.id === 'engine' && <Zap className="h-10 w-10 text-blue-500" />}
                  {activeComponent.id === 'wheels' && <Settings className="h-10 w-10 text-blue-500" />}
                  {activeComponent.id === 'suspension' && <Gauge className="h-10 w-10 text-blue-500" />}
                  {activeComponent.id === 'exhaust' && <ThumbsUp className="h-10 w-10 text-blue-500" />}
                  {activeComponent.id === 'bodykit' && <Lightbulb className="h-10 w-10 text-blue-500" />}
                </div>
                
                <h4 className="font-bold text-lg">{activeComponent.name}</h4>
                <p className="text-sm text-center text-muted-foreground max-w-xs px-6 mt-1">
                  {activeComponent.description}
                </p>
                
                <Button 
                  variant="default" 
                  size="sm" 
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectComponent(activeComponent);
                  }}
                >
                  <Info className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </motion.div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 z-10 bg-white/80 dark:bg-slate-800/80 rounded-full"
                onClick={handleNextComponent}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              
              <div className="absolute bottom-4 flex space-x-1">
                {vehicleComponents.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentComponentIndex ? 
                        'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Component Detail Panel */}
          <AnimatePresence>
            {selectedComponent && (
              <motion.div
                className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-10 p-5 overflow-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedComponent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedComponent.description}</p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleCloseDetail}
                    className="hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Upgrade Options</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(['standard', 'premium', 'performance'] as const).map((type) => (
                      <div
                        key={type}
                        onClick={() => handleSelectUpgrade(type)}
                        className={`
                          border rounded-lg p-3 cursor-pointer transition-all
                          ${selectedUpgradeType === type ? 
                            'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800' : 
                            'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                        `}
                      >
                        <Badge variant={type === 'standard' ? 'outline' : type === 'premium' ? 'secondary' : 'default'} className="mb-2">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Badge>
                        <p className="text-sm">{selectedComponent.upgradeOptions[type]}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Performance Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Performance</span>
                        <span>{selectedComponent.stats.performance}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                        <motion.div 
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedComponent.stats.performance}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Durability</span>
                        <span>{selectedComponent.stats.durability}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                        <motion.div 
                          className="bg-green-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedComponent.stats.durability}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Value</span>
                        <span>{selectedComponent.stats.value}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                        <motion.div 
                          className="bg-amber-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedComponent.stats.value}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Component Added",
                        description: `${selectedComponent.name} upgrade has been added to your design.`,
                      });
                      handleCloseDetail();
                    }}
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Apply Selected Upgrade
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {visibleComponents.length > 0 && (
        <div className="mt-3 text-sm text-muted-foreground flex items-center">
          <Info className="h-4 w-4 mr-1" />
          <span>Explored: {visibleComponents.length} of {vehicleComponents.length} components</span>
        </div>
      )}
    </div>
  );
};

export default AnimatedHoverEffects;