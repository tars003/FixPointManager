import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Lightbulb, 
  ArrowRight, 
  Heart,
  Settings,
  Users,
  Download,
  Share2,
  Save,
  RotateCw,
  Camera,
  Palette,
  Clock,
  Check,
  Car,
  Layers,
  Sparkles,
  CornerUpRight,
  MessageSquare,
  MicrophoneIcon,
  Mic
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';

// Arena components
import ArenaWrapper from '@/components/arena/ArenaWrapper';
import LoadingSkeleton from '@/components/arena/LoadingSkeleton';
import ConfiguratorHeader from '@/components/arena/ConfiguratorHeader';
import Vehicle3DViewer from '@/components/arena/3d-viewer/Vehicle3DViewer';
import VehicleVisualizer from '@/components/arena/VehicleVisualizer';
import ProjectControls from '@/components/arena/ProjectControls';
import CartPanel from '@/components/arena/CartPanel';
import PremiumColorSelector from '@/components/arena/PremiumColorSelector';
import CustomizationCategories from '@/components/arena/CustomizationCategories';
import EnvironmentSelector from '@/components/arena/EnvironmentSelector';
import CollaborationMarkers from '@/components/arena/CollaborationMarkers';
import VoiceControl from '@/components/arena/VoiceControl';
import SaveProjectPanel from '@/components/arena/SaveProjectPanel';
import EnhancedColorSelector from '@/components/arena/EnhancedColorSelector';
import ExteriorFinishStudio from '@/components/arena/ExteriorFinishStudio';
import InteriorCustomizationStudio from '@/components/arena/InteriorCustomizationStudio';
import WheelCustomizationStudio from '@/components/arena/WheelCustomizationStudio';
import PerformanceEnhancementStudio from '@/components/arena/PerformanceEnhancementStudio';
import LightingCustomizationStudio from '@/components/arena/LightingCustomizationStudio';

// Define types for the Premium Arena
interface VehicleModel {
  id: number;
  name: string;
  brand: string;
  year: number;
  category: string;
  basePrice: number;
  thumbnailUrl: string;
  modelUrl: string;
  popularity: number;
}

interface CustomizationCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories: string[];
}

interface CustomizationOption {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  thumbnailUrl: string;
  modelUrl?: string;
  specifications?: Record<string, string>;
  compatibility?: string[];
  installationTime?: number;
  popular?: boolean;
  new?: boolean;
  discount?: number;
}

interface Environment {
  id: string;
  name: string;
  thumbnailUrl: string;
  hdriUrl: string;
}

interface ConfigurationItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  vehicleId: number;
  configurations: Record<string, string>;
  totalPrice: number;
  thumbnailUrl?: string;
  status: 'draft' | 'saved' | 'shared';
  createdAt: Date;
  updatedAt: Date;
}

interface Collaborator {
  id: number;
  name: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  lastActive?: Date;
  cursor?: { x: number; y: number };
}

// Premium vehicle data
const premiumVehicles: VehicleModel[] = [
  { 
    id: 1, 
    name: 'AMG SL 43 Roadster', 
    brand: 'Mercedes-Benz', 
    year: 2025,
    category: 'Convertible', 
    basePrice: 12500000,
    thumbnailUrl: 'https://www.mercedes-benz.co.in/content/india/en/passengercars/models/roadster/amg-sl/_jcr_content/root/responsivegrid/tabs/tabitem/hotspot_module/hotspot_simple_image.component.damq6.3373896264084.jpg/mercedes-amg-sl-exterior-front-side.jpg',
    modelUrl: '/models/amg-sl.glb',
    popularity: 92
  },
  { 
    id: 2, 
    name: 'i7 eDrive50 Sedan', 
    brand: 'BMW', 
    year: 2025,
    category: 'Electric Sedan', 
    basePrice: 13700000,
    thumbnailUrl: 'https://www.bmw.in/content/dam/bmw/marketIN/bmw_in/all-models/7-series/lci-i7/bmw-7-series-i7-front-view.png.asset.1686123094192.png',
    modelUrl: '/models/i7.glb',
    popularity: 88
  },
  { 
    id: 3, 
    name: 'Spectre', 
    brand: 'Rolls-Royce', 
    year: 2025,
    category: 'Luxury Coupe', 
    basePrice: 52000000,
    thumbnailUrl: 'https://www.rolls-roycemotorcars.com/content/dam/rrmc/marketUK/rollsroycemotorcars_com/spectre/page-properties/Spectre-single-Card.jpg',
    modelUrl: '/models/spectre.glb',
    popularity: 95
  },
  { 
    id: 4, 
    name: 'Huracan STO', 
    brand: 'Lamborghini', 
    year: 2025,
    category: 'Sports Car', 
    basePrice: 49900000,
    thumbnailUrl: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/huracan/sto/2022/09_21_sto/sto_m.png',
    modelUrl: '/models/huracan.glb',
    popularity: 97
  }
];

// Customization categories
const categories: CustomizationCategory[] = [
  {
    id: 'exterior',
    name: 'Exterior Design',
    icon: <Car className="w-5 h-5" />,
    subcategories: ['Paint & Wrap', 'Body Kits', 'Aerodynamics', 'Decals & Graphics']
  },
  {
    id: 'interior',
    name: 'Interior',
    icon: <Layers className="w-5 h-5" />,
    subcategories: ['Upholstery', 'Dashboard', 'Accessories', 'Ambient Lighting']
  },
  {
    id: 'wheels',
    name: 'Wheels & Tires',
    icon: <RotateCw className="w-5 h-5" />,
    subcategories: ['Rims', 'Tires', 'Brake Systems', 'Customization']
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: <Zap className="w-5 h-5" />,
    subcategories: ['Engine', 'Exhaust', 'Suspension', 'Tuning']
  },
  {
    id: 'lighting',
    name: 'Lighting',
    icon: <Lightbulb className="w-5 h-5" />,
    subcategories: ['Headlights', 'Taillights', 'Underglow', 'Interior Lighting']
  }
];

// Environment options
const environments: Environment[] = [
  {
    id: 'studio',
    name: 'Studio',
    thumbnailUrl: '/environments/studio-thumb.jpg',
    hdriUrl: '/environments/studio.hdr'
  },
  {
    id: 'showroom',
    name: 'Showroom',
    thumbnailUrl: '/environments/showroom-thumb.jpg',
    hdriUrl: '/environments/showroom.hdr'
  },
  {
    id: 'city',
    name: 'Urban',
    thumbnailUrl: '/environments/city-thumb.jpg',
    hdriUrl: '/environments/city.hdr'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    thumbnailUrl: '/environments/sunset-thumb.jpg',
    hdriUrl: '/environments/sunset.hdr'
  },
  {
    id: 'mountain',
    name: 'Mountain',
    thumbnailUrl: '/environments/mountain-thumb.jpg',
    hdriUrl: '/environments/mountain.hdr'
  }
];

// Mock collaborators
const collaborators: Collaborator[] = [
  {
    id: 1,
    name: 'You',
    avatar: '/avatars/user-1.jpg',
    role: 'owner',
    lastActive: new Date(),
    cursor: { x: 0, y: 0 }
  },
  {
    id: 2,
    name: 'Rahul',
    avatar: '/avatars/user-2.jpg',
    role: 'editor',
    lastActive: new Date(Date.now() - 5 * 60000),
    cursor: { x: 250, y: 350 }
  },
  {
    id: 3,
    name: 'Priya',
    avatar: '/avatars/user-3.jpg',
    role: 'viewer',
    lastActive: new Date(Date.now() - 15 * 60000)
  }
];

// Premium Arena Component
const ArenaPremium: React.FC = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Reference for scrolling sections
  const viewerRef = useRef<HTMLDivElement>(null);
  const isViewerInView = useInView(viewerRef);
  const viewerControls = useAnimation();
  
  // Key state variables
  const [activeCategory, setActiveCategory] = useState('exterior');
  const [selectedVehicle, setSelectedVehicle] = useState(premiumVehicles[0]);
  const [selectedEnvironment, setSelectedEnvironment] = useState(environments[0]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeCollaborators, setActiveCollaborators] = useState<Collaborator[]>(collaborators);
  
  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isVoiceControlActive, setIsVoiceControlActive] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [cameraView, setCameraView] = useState<'orbit' | 'first-person' | 'cinematic'>('orbit');
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [selectedItems, setSelectedItems] = useState<ConfigurationItem[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  
  // Timer for tracking time spent in configurator
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  // Simulated loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation for viewer section
  useEffect(() => {
    if (isViewerInView) {
      viewerControls.start({ opacity: 1, y: 0 });
    }
  }, [isViewerInView, viewerControls]);
  
  // Format price in Indian Rupees
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Calculate total price
  const calculateTotalPrice = (): number => {
    const basePrice = selectedVehicle.basePrice;
    const optionsPrice = selectedItems.reduce((total, item) => total + item.price, 0);
    return basePrice + optionsPrice;
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  // Handle adding item to configuration
  const handleAddItem = (item: ConfigurationItem) => {
    // Check if item from same category already exists
    const existingIndex = selectedItems.findIndex(
      existing => existing.category === item.category
    );
    
    if (existingIndex !== -1) {
      // Replace item in same category
      const newItems = [...selectedItems];
      newItems[existingIndex] = item;
      setSelectedItems(newItems);
    } else {
      // Add new item
      setSelectedItems([...selectedItems, item]);
    }
    
    toast({
      title: "Item added",
      description: `${item.name} added to your configuration`,
    });
  };
  
  // Handle removing item from configuration
  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
    
    toast({
      title: "Item removed",
      description: "Item removed from your configuration",
    });
  };
  
  // Handle saving project
  const handleSaveProject = (name: string, description?: string) => {
    const newProject: Project = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      description,
      vehicleId: selectedVehicle.id,
      configurations: {},
      totalPrice: calculateTotalPrice(),
      status: 'saved',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCurrentProject(newProject);
    setIsSaveModalOpen(false);
    
    toast({
      title: "Project saved",
      description: `${name} has been saved successfully`,
    });
  };
  
  // Handle sharing project
  const handleShareProject = () => {
    // Generate share link or show share modal
    const shareLink = `https://fixpoint.app/arena/shared/${currentProject?.id || 'preview'}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareLink);
    
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };
  
  // Handle export configuration
  const handleExportConfiguration = () => {
    toast({
      title: "Exporting configuration",
      description: "Your configuration is being prepared for download",
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Configuration exported successfully",
      });
    }, 2000);
  };
  
  // Handle environment change
  const handleEnvironmentChange = (env: Environment) => {
    setSelectedEnvironment(env);
    
    toast({
      title: "Environment changed",
      description: `View changed to ${env.name}`,
    });
  };
  
  // Handle voice command
  const handleVoiceCommand = (command: string) => {
    toast({
      title: "Voice command received",
      description: `Processing: "${command}"`,
    });
    
    // Process voice command
    if (command.includes('paint') || command.includes('color')) {
      setActiveCategory('exterior');
    } else if (command.includes('wheel') || command.includes('tire')) {
      setActiveCategory('wheels');
    } else if (command.includes('performance') || command.includes('engine')) {
      setActiveCategory('performance');
    } else if (command.includes('interior')) {
      setActiveCategory('interior');
    } else if (command.includes('light')) {
      setActiveCategory('lighting');
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <ArenaWrapper>
        <LoadingSkeleton type="arena" />
      </ArenaWrapper>
    );
  }
  
  // Render main UI
  return (
    <ArenaWrapper>
      {/* Configurator Header */}
      <ConfiguratorHeader 
        activeTab={activeCategory}
        onTabChange={handleCategoryChange}
        vehicleName={selectedVehicle.name}
        vehicleYear={selectedVehicle.year.toString()}
        brand={selectedVehicle.brand}
      />
      
      <div className="container max-w-7xl mx-auto py-4 px-4 lg:py-6">
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Categories */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Customization
              </h2>
              
              <CustomizationCategories 
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={handleCategoryChange}
              />
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Actions</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setIsVoiceControlActive(true)}
                        >
                          <Mic className="h-4 w-4 mr-1" />
                          Voice
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Control with voice commands</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setCameraView(cameraView === 'orbit' ? 'first-person' : 'orbit')}
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Change camera view</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setIsSaveModalOpen(true)}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Project
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleShareProject}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
              
              {/* Environment selector */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Environment</h3>
                <EnvironmentSelector 
                  environments={environments}
                  selectedEnvironment={selectedEnvironment.id}
                  onSelectEnvironment={(envId) => {
                    const env = environments.find(e => e.id === envId);
                    if (env) handleEnvironmentChange(env);
                  }}
                />
              </div>
              
              {/* Collaborators */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Collaborators</h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {activeCollaborators.map(collaborator => (
                    <div 
                      key={collaborator.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="relative">
                        <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden">
                          {/* This would be an actual image in production */}
                          <div className="absolute inset-0 flex items-center justify-center text-xs">
                            {collaborator.name.charAt(0)}
                          </div>
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ${
                          collaborator.lastActive && 
                          (new Date().getTime() - collaborator.lastActive.getTime()) < 10 * 60 * 1000 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                        }`} />
                      </div>
                      <span className="flex-1 truncate">{collaborator.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {collaborator.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Middle column - 3D Viewer */}
          <div 
            ref={viewerRef}
            className="lg:col-span-7 space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={viewerControls}
              className="relative h-[500px] rounded-xl overflow-hidden border border-blue-100 shadow-lg"
            >
              {/* 3D Vehicle Viewer */}
              <Suspense fallback={<LoadingSkeleton type="viewer" />}>
                <Vehicle3DViewer 
                  modelUrl={selectedVehicle.modelUrl}
                  environmentUrl={selectedEnvironment.hdriUrl}
                  cameraView={cameraView}
                  rotationSpeed={rotationSpeed}
                  selectedParts={selectedItems.map(item => item.id)}
                />
              </Suspense>
              
              {/* Camera controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/80 backdrop-blur-sm shadow-md border border-gray-200"
                        onClick={() => setCameraView('orbit')}
                      >
                        <RotateCw className={`h-4 w-4 ${cameraView === 'orbit' ? 'text-blue-600' : 'text-gray-700'}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Orbit View</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/80 backdrop-blur-sm shadow-md border border-gray-200"
                        onClick={() => setCameraView('first-person')}
                      >
                        <Car className={`h-4 w-4 ${cameraView === 'first-person' ? 'text-blue-600' : 'text-gray-700'}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Driver View</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/80 backdrop-blur-sm shadow-md border border-gray-200"
                        onClick={() => setCameraView('cinematic')}
                      >
                        <Sparkles className={`h-4 w-4 ${cameraView === 'cinematic' ? 'text-blue-600' : 'text-gray-700'}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cinematic View</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Collaboration markers */}
              <CollaborationMarkers collaborators={activeCollaborators} />
            </motion.div>
            
            {/* Current category studio */}
            <div className="bg-white rounded-xl p-6 border border-blue-50 shadow-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeCategory === 'exterior' && (
                    <ExteriorFinishStudio 
                      onAddItem={handleAddItem}
                      vehicleType={selectedVehicle.category}
                      formatPrice={formatPrice}
                    />
                  )}
                  
                  {activeCategory === 'interior' && (
                    <InteriorCustomizationStudio 
                      onAddItem={handleAddItem}
                      vehicleType={selectedVehicle.category}
                      formatPrice={formatPrice}
                    />
                  )}
                  
                  {activeCategory === 'wheels' && (
                    <WheelCustomizationStudio 
                      onAddItem={handleAddItem}
                      vehicleType={selectedVehicle.category}
                      formatPrice={formatPrice}
                    />
                  )}
                  
                  {activeCategory === 'performance' && (
                    <PerformanceEnhancementStudio 
                      onAddItem={handleAddItem}
                      vehicleType={selectedVehicle.category}
                      formatPrice={formatPrice}
                    />
                  )}
                  
                  {activeCategory === 'lighting' && (
                    <LightingCustomizationStudio 
                      onAddItem={handleAddItem}
                      vehicleType={selectedVehicle.category}
                      formatPrice={formatPrice}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Right column - Configuration summary */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-50 shadow-md sticky top-24">
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-4">
                Configuration Summary
              </h2>
              
              <div className="space-y-4">
                {/* Vehicle info */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Car className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedVehicle.brand}</h3>
                    <p className="text-sm text-gray-600">{selectedVehicle.name}</p>
                    <p className="text-sm font-semibold">{formatPrice(selectedVehicle.basePrice)}</p>
                  </div>
                </div>
                
                {/* Selected items */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Selected Options</h3>
                  
                  {selectedItems.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No options selected yet</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {selectedItems.map(item => (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between text-sm border-b border-gray-100 pb-2"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{formatPrice(item.price)}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-red-500"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Price breakdown */}
                <div className="space-y-2 pb-3 border-b border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Price:</span>
                    <span>{formatPrice(selectedVehicle.basePrice)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Options:</span>
                    <span>{formatPrice(selectedItems.reduce((total, item) => total + item.price, 0))}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                      {formatPrice(calculateTotalPrice())}
                    </span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => setIsCartOpen(true)}
                  >
                    Review & Checkout
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="text-blue-700 border-blue-200"
                      onClick={() => setIsSaveModalOpen(true)}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="text-blue-700 border-blue-200"
                      onClick={handleExportConfiguration}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
                
                {/* Session info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Session: {timeSpent} min</span>
                  </div>
                  
                  {currentProject && (
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span>Project: {currentProject.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Project controls */}
      <ProjectControls
        onSave={() => setIsSaveModalOpen(true)}
        onShare={handleShareProject}
        onExport={handleExportConfiguration}
        totalPrice={calculateTotalPrice()}
        formatPrice={formatPrice}
      />
      
      {/* Cart panel */}
      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={[
          {
            id: 'vehicle',
            name: `${selectedVehicle.year} ${selectedVehicle.brand} ${selectedVehicle.name}`,
            price: selectedVehicle.basePrice,
            category: 'Base Vehicle'
          },
          ...selectedItems
        ]}
        onRemoveItem={handleRemoveItem}
        formatPrice={formatPrice}
      />
      
      {/* Save project modal */}
      <SaveProjectPanel
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveProject}
        currentProject={currentProject}
      />
      
      {/* Voice control overlay */}
      <VoiceControl
        isActive={isVoiceControlActive}
        onClose={() => setIsVoiceControlActive(false)}
        onCommand={handleVoiceCommand}
      />
    </ArenaWrapper>
  );
};

export default ArenaPremium;