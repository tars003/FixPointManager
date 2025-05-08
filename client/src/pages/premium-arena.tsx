import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useRoute, Link } from 'wouter';
import { 
  Car, 
  Gauge, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  ShoppingCart, 
  Settings, 
  Loader2,
  Camera,
  HelpCircle,
  ChevronLeft
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatIndianPrice } from "@/lib/formatters";
import { 
  VehicleModelData, 
  CustomizationPartData, 
  CustomizationProject,
  VehicleConfiguration, 
  CustomizationCategory,
  CustomizationSubcategory,
  ProjectHistoryEntry,
  ProjectCollaborationStatus,
  CustomizationPartInstance,
} from '@shared/arena-schema';

// Import premium components
import PremiumThreeDVisualizer from '@/components/arena/premium/PremiumThreeDVisualizer';
import CustomizationCategories from '@/components/arena/premium/CustomizationCategories';
import PartSelector from '@/components/arena/premium/PartSelector';
import VehicleSelector from '@/components/arena/premium/VehicleSelector';
import ProjectManager from '@/components/arena/premium/ProjectManager';

// Import UI components
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Define customization steps
const CUSTOMIZATION_STEPS = [
  { id: 'vehicle', label: 'Vehicle Selection', icon: <Car size={18} /> },
  { id: 'exterior', label: 'Exterior', icon: <Car size={18} /> },
  { id: 'interior', label: 'Interior', icon: <Car size={18} /> },
  { id: 'performance', label: 'Performance', icon: <Gauge size={18} /> },
  { id: 'wheels', label: 'Wheels & Tires', icon: <Car size={18} /> },
  { id: 'lighting', label: 'Lighting', icon: <Car size={18} /> },
  { id: 'review', label: 'Review & Checkout', icon: <ShoppingCart size={18} /> }
];

// No mockVehicles - we'll fetch from API

// No mockParts - we'll fetch from API

// Component to render cartItems
interface CartItemProps {
  part: CustomizationPartData;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ part, onRemove }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {part.thumbnailUrl && (
          <div className="h-12 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={part.thumbnailUrl} 
              alt={part.name} 
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div>
          <h4 className="text-sm font-medium">{part.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {part.category} - {part.subcategory}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="font-medium">
          ₹{part.price?.toLocaleString('en-IN')}
        </p>
        <button 
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Default vehicle configuration
const defaultVehicleConfig: VehicleConfiguration = {
  baseVehicleId: 1,
  baseColor: '#1E3A8A',
  parts: [],
};

// Main Premium Arena Component
const PremiumArena: React.FC = () => {
  // State
  const [currentStep, setCurrentStep] = useState<string>('vehicle');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModelData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CustomizationCategory>('exterior');
  const [selectedSubcategory, setSelectedSubcategory] = useState<CustomizationSubcategory | undefined>('paint');
  const [selectedParts, setSelectedParts] = useState<CustomizationPartData[]>([]);
  const [vehicleConfig, setVehicleConfig] = useState<VehicleConfiguration>(defaultVehicleConfig);
  const [cartItems, setCartItems] = useState<CustomizationPartData[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentProject, setCurrentProject] = useState<CustomizationProject | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Match project ID from URL if present
  const [, params] = useRoute<{ id: string }>('/arena/premium/:id');
  const projectId = params?.id ? parseInt(params.id) : undefined;

  // Query to fetch vehicle models
  const { 
    data: vehicleModels = [],
    isLoading: isVehiclesLoading
  } = useQuery({
    queryKey: ['/api/vehicle-models'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/vehicle-models');
      return await res.json();
    }
  });

  // Query to fetch customization parts
  const {
    data: customizationParts = [],
    isLoading: isPartsLoading
  } = useQuery({
    queryKey: ['/api/customization-parts'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/customization-parts');
      return await res.json();
    }
  });

  // Filtered parts based on selected category and subcategory
  const filteredParts = customizationParts.filter(
    (part: CustomizationPartData) => part.category === selectedCategory && 
           (!selectedSubcategory || part.subcategory === selectedSubcategory)
  );

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = selectedVehicle?.basePrice || 0;
    const partsPrice = selectedParts.reduce((sum, part) => sum + (part.price || 0), 0);
    return basePrice + partsPrice;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return formatIndianPrice(amount);
  };

  // Progress percentage calculation
  const getProgressPercentage = () => {
    const stepIndex = CUSTOMIZATION_STEPS.findIndex(step => step.id === currentStep);
    return Math.round((stepIndex / (CUSTOMIZATION_STEPS.length - 1)) * 100);
  };

  // Query to fetch project data if projectId is available
  const {
    data: projectData,
    isLoading: isProjectLoading,
    error: projectError
  } = useQuery({
    queryKey: ['/api/customization-projects', projectId],
    queryFn: projectId ? async () => {
      const res = await apiRequest('GET', `/api/customization-projects/${projectId}`);
      return await res.json();
    } : () => null,
    enabled: !!projectId
  });

  // Load project data when available
  useEffect(() => {
    if (projectData && vehicleModels.length > 0 && customizationParts.length > 0) {
      setCurrentProject(projectData);
      
      // If we have a vehicle ID, find that vehicle from our API data
      if (projectData.vehicleId) {
        const vehicle = vehicleModels.find((v: VehicleModelData) => v.id === projectData.vehicleId);
        if (vehicle) {
          setSelectedVehicle(vehicle);
          
          // Move to exterior step if on vehicle selection
          if (currentStep === 'vehicle') {
            setCurrentStep('exterior');
          }
        }
      }
      
      // Load selected parts if customizations data is available
      if (projectData.customizations && projectData.selectedParts) {
        try {
          // Find the actual part data for each selected part
          const loadedParts = projectData.selectedParts
            .map((selectedPart: {partId: number}) => {
              return customizationParts.find((part: CustomizationPartData) => part.id === selectedPart.partId);
            })
            .filter((part: CustomizationPartData | undefined) => part !== undefined) as CustomizationPartData[];
          
          setSelectedParts(loadedParts);
          
          // Update vehicle configuration
          const parts: CustomizationPartInstance[] = projectData.selectedParts.map((selectedPart: {
            partId: number, 
            position?: { x: number; y: number; z: number },
            color?: string
          }) => {
            return {
              id: `part-${selectedPart.partId}`,
              partId: selectedPart.partId,
              transform: {
                position: selectedPart.position || { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0, w: 1 },
                scale: { x: 1, y: 1, z: 1 }
              },
              color: selectedPart.color
            };
          });
          
          setVehicleConfig({
            baseVehicleId: projectData.vehicleId,
            baseColor: '#1E3A8A', // Would come from project data in real app
            parts
          });
        } catch (error) {
          console.error('Error parsing customizations data:', error);
        }
      }
    }
  }, [projectData, currentStep, vehicleModels, customizationParts]);

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (projectData: Partial<CustomizationProject>) => {
      if (currentProject && currentProject.id) {
        const res = await apiRequest(
          'PUT',
          `/api/customization-projects/${currentProject.id}`,
          projectData
        );
        return await res.json();
      } else {
        const res = await apiRequest(
          'POST',
          '/api/customization-projects',
          projectData
        );
        return await res.json();
      }
    },
    onSuccess: (data) => {
      setCurrentProject(data);
      queryClient.invalidateQueries({ queryKey: ['/api/customization-projects'] });
      
      if (!currentProject?.id) {
        // If this was a new project, redirect to the project URL
        setLocation(`/arena/premium/${data.id}`);
      }
    }
  });

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle: VehicleModelData) => {
    setSelectedVehicle(vehicle);
    
    // Update vehicle configuration
    setVehicleConfig(prev => ({
      ...prev,
      baseVehicleId: vehicle.id as number,
      baseColor: '#1E3A8A' // Default blue color
    }));
    
    // Automatically create a default project for the selected vehicle
    if (!currentProject) {
      setCurrentProject({
        id: 0,
        name: `${vehicle.manufacturer} ${vehicle.name} Customization`,
        description: 'Premium customization project',
        userId: 1,
        vehicleId: vehicle.id as number,
        status: 'in-progress',
        visibility: 'private',
        basePrice: vehicle.basePrice,
        totalPrice: vehicle.basePrice || 0,
        customizations: {
          baseVehicleId: vehicle.id as number,
          baseColor: '#1E3A8A', // Default blue color
          parts: []
        },
        selectedParts: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  };

  // Handle continuing to next step
  const handleContinue = () => {
    try {
      // If no vehicle is selected and we're on vehicle step, show an error
      if (currentStep === 'vehicle' && !selectedVehicle) {
        toast({
          title: "Vehicle Required",
          description: "Please select a vehicle to continue",
          variant: "destructive"
        });
        return;
      }
      
      // On vehicle selection step with a vehicle selected, go directly to exterior
      if (currentStep === 'vehicle' && selectedVehicle) {
        // Make sure the vehicle data is fully loaded
        if (!selectedVehicle.id) {
          toast({
            title: "Loading Vehicle Data",
            description: "Please wait while we finish loading your vehicle data",
            variant: "default"
          });
          return;
        }
        
        // Save initial vehicle selection and create a new project if needed
        if (!projectId) {
          const projectName = `${selectedVehicle.manufacturer} ${selectedVehicle.name} Customization`;
          console.log(`Creating new project: ${projectName}`);
        }
        
        // Update step with animation
        setCurrentStep('exterior');
        
        // Update category to match
        setSelectedCategory('exterior');
        setSelectedSubcategory('paint');
        
        // Show success message
        toast({
          title: "Exterior Customization",
          description: "Now you can customize the exterior of your vehicle"
        });
        
        // Scroll to top of page to see new content
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
  
      // For other steps, find the current index and move to next step
      const currentIndex = CUSTOMIZATION_STEPS.findIndex(step => step.id === currentStep);
      if (currentIndex < CUSTOMIZATION_STEPS.length - 1) {
        const nextStep = CUSTOMIZATION_STEPS[currentIndex + 1].id;
        
        // Update step with animation
        setCurrentStep(nextStep);
        
        // If going to a category step, update selected category
        if (['exterior', 'interior', 'performance', 'wheels', 'lighting'].includes(nextStep)) {
          setSelectedCategory(nextStep as CustomizationCategory);
          
          // Set default subcategory for each category
          switch(nextStep) {
            case 'exterior':
              setSelectedSubcategory('paint');
              break;
            case 'interior':
              setSelectedSubcategory('seats');
              break;
            case 'performance':
              setSelectedSubcategory('engine');
              break;
            case 'wheels':
              setSelectedSubcategory('rims');
              break;
            case 'lighting':
              setSelectedSubcategory('headlights');
              break;
          }
        }
        
        // When reaching review step, make sure to save the project state
        if (nextStep === 'review') {
          // Auto-save the project when reaching review page
          handleSaveProject();
        }
        
        // Show a success message to guide the user
        toast({
          title: `Step: ${CUSTOMIZATION_STEPS[currentIndex + 1].label}`,
          description: `You can now ${nextStep === 'review' ? 'review your selections' : 'customize your vehicle'}`
        });
        
        // Scroll to top of page to see new content
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        title: "Navigation Error",
        description: "There was an error navigating to the next step. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle going back to previous step
  const handleBack = () => {
    const currentIndex = CUSTOMIZATION_STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(CUSTOMIZATION_STEPS[currentIndex - 1].id);
    }
  };

  // Handle part selection
  const handlePartSelect = (part: CustomizationPartData) => {
    // Check if the part is already selected
    const isSelected = selectedParts.some(p => p.id === part.id);
    
    if (isSelected) {
      // Remove part
      setSelectedParts(prev => prev.filter(p => p.id !== part.id));
      setVehicleConfig(prev => ({
        ...prev,
        parts: prev.parts.filter(p => p.partId !== part.id)
      }));
    } else {
      // Add part
      setSelectedParts(prev => [...prev, part]);
      
      // Add to vehicle configuration with default placement
      setVehicleConfig(prev => {
        const newPart: CustomizationPartInstance = {
          id: `part-${part.id}`,
          partId: part.id as number,
          transform: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0, w: 1 },
            scale: { x: 1, y: 1, z: 1 }
          },
          color: part.category === 'exterior' && part.subcategory === 'paint' 
            ? '#1E3A8A'  // Default color for paint
            : undefined
        };
        
        return {
          ...prev,
          parts: [...prev.parts, newPart]
        };
      });
    }
  };

  // Handle adding all parts to cart
  const handleAddToCart = () => {
    setCartItems(prev => {
      // Add only parts that aren't already in the cart
      const newItems = selectedParts.filter(
        part => !prev.some(item => item.id === part.id)
      );
      return [...prev, ...newItems];
    });
    
    toast({
      title: 'Parts Added to Cart',
      description: `${selectedParts.length} parts have been added to your cart`
    });
    
    setIsCartOpen(true);
  };

  // Handle removing an item from cart
  const handleRemoveFromCart = (partId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== partId));
  };

  // Handle saving the current project
  const handleSaveProject = async () => {
    if (!selectedVehicle) {
      toast({
        title: 'Cannot Save Project',
        description: 'Please select a vehicle first',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSaving(true);
    
    // Prepare selected parts data
    const formattedSelectedParts = vehicleConfig.parts.map(part => {
      return {
        partId: part.partId,
        position: part.transform.position,
        color: part.color,
        rotation: part.transform.rotation,
        scale: part.transform.scale?.x // Single scale value for simplicity
      };
    });
    
    try {
      const projectData: Partial<CustomizationProject> = {
        name: currentProject?.name || `${selectedVehicle.manufacturer} ${selectedVehicle.name} Customization`,
        description: currentProject?.description || 'Custom build project',
        vehicleId: selectedVehicle.id as number,
        customizations: vehicleConfig,
        selectedParts: formattedSelectedParts,
        status: 'in-progress',
        visibility: 'private',
        basePrice: selectedVehicle.basePrice,
        totalPrice: calculateTotalPrice()
      };
      
      await saveProjectMutation.mutateAsync(projectData);
      
      toast({
        title: 'Project Saved',
        description: 'Your customization project has been saved successfully'
      });
    } catch (error) {
      console.error('Failed to save project:', error);
      toast({
        title: 'Save Failed',
        description: 'There was an error saving your project',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: CustomizationCategory) => {
    setSelectedCategory(category);
    
    // Set default subcategory for selected category
    switch(category) {
      case 'exterior':
        setSelectedSubcategory('paint');
        break;
      case 'interior':
        setSelectedSubcategory('seats');
        break;
      case 'performance':
        setSelectedSubcategory('engine');
        break;
      case 'wheels':
        setSelectedSubcategory('rims');
        break;
      case 'lighting':
        setSelectedSubcategory('headlights');
        break;
    }
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (category: CustomizationCategory, subcategory: CustomizationSubcategory) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  };

  // Simulate project history for demo
  const mockProjectHistory: ProjectHistoryEntry[] = currentProject ? [
    {
      id: 'hist-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      userId: 1,
      userName: 'Current User',
      action: 'add',
      partId: 101,
      partName: 'Premium Pearl Finish',
    },
    {
      id: 'hist-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      userId: 1,
      userName: 'Current User',
      action: 'add',
      partId: 801,
      partName: 'Off-Road Alloy Wheels Set',
    },
    {
      id: 'hist-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      userId: 1,
      userName: 'Current User',
      action: 'remove',
      partId: 101,
      partName: 'Premium Pearl Finish',
    },
    {
      id: 'hist-4',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      userId: 1,
      userName: 'Current User',
      action: 'add',
      partId: 301,
      partName: 'Aerodynamic Rear Spoiler',
    },
    {
      id: 'hist-5',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      userId: 1,
      userName: 'Current User',
      action: 'add',
      partId: 701,
      partName: 'Sport Performance Exhaust System',
    }
  ] : [];

  // Simulate collaboration status for demo
  const mockCollaborationStatus: ProjectCollaborationStatus = {
    projectId: currentProject?.id || 0,
    activeUsers: [
      {
        userId: 1,
        userName: 'Current User',
        lastActive: new Date(),
        role: 'owner'
      }
    ],
    lastSaved: currentProject?.updatedAt ? new Date(currentProject.updatedAt) : undefined
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard-enhanced" className="text-gray-500 hover:text-gray-700">
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Premium Arena™ Vehicle Customizer</h1>
            {selectedVehicle && (
              <div className="hidden md:flex items-center">
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-600 font-medium">
                  {selectedVehicle.manufacturer} {selectedVehicle.name}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mr-2"
                    onClick={() => setIsPickerOpen(true)}
                  >
                    <Settings size={16} className="mr-2" />
                    <span className="hidden md:inline">Settings</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Customize your Arena experience</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveProject}
                    disabled={isSaving || !selectedVehicle}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <Save size={16} className="mr-2" />
                    )}
                    <span className="hidden md:inline">
                      {isSaving ? 'Saving...' : 'Save Project'}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save your customization project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  <span className="hidden md:inline">Cart</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                  <SheetDescription>
                    Review and checkout the customization parts you've selected
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">Your cart is empty</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add customization parts to your cart as you customize your vehicle
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[calc(100vh-220px)]">
                      <div className="space-y-3 pr-4">
                        {cartItems.map((item) => (
                          <CartItem 
                            key={item.id} 
                            part={item} 
                            onRemove={() => handleRemoveFromCart(item.id as number)} 
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
                
                {cartItems.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium">
                          {formatCurrency(cartItems.reduce((sum, item) => sum + (item.price || 0), 0))}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-blue-700">
                          {formatCurrency(cartItems.reduce((sum, item) => sum + (item.price || 0), 0))}
                        </span>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          // Close cart sheet and navigate to checkout
                          setCartOpen(false);
                          window.location.href = '/arena-checkout';
                        }}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" onClick={() => window.open('/help', '_blank')}>
                    <HelpCircle size={16} className="mr-2" />
                    <span className="hidden md:inline">Help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get help using Arena</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-200">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>

      {/* Steps navigation */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex items-center min-w-max px-4 py-2 gap-1">
          {CUSTOMIZATION_STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <div className="h-px w-4 bg-gray-300" />
              )}
              <button
                className={`flex items-center rounded-full px-3 py-1.5 text-sm ${
                  currentStep === step.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : index < CUSTOMIZATION_STEPS.findIndex(s => s.id === currentStep)
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  // Only allow navigation to steps that have been "unlocked"
                  if (
                    index <= CUSTOMIZATION_STEPS.findIndex(s => s.id === currentStep) ||
                    (step.id === 'vehicle' && selectedVehicle) ||
                    (step.id !== 'vehicle' && selectedVehicle)
                  ) {
                    setCurrentStep(step.id);
                    if (['exterior', 'interior', 'performance', 'wheels', 'lighting'].includes(step.id)) {
                      setSelectedCategory(step.id as CustomizationCategory);
                    }
                  }
                }}
              >
                <span className="mr-1.5">{step.icon}</span>
                <span>{step.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {isProjectLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-3 text-gray-600">Loading your project...</p>
            </div>
          </div>
        ) : projectError ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-2">Error loading project</p>
              <Button 
                variant="outline" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/customization-projects', projectId] })}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Vehicle Selection Step */}
            {currentStep === 'vehicle' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Select Your Vehicle</h2>
                </div>
                
                {/* Premium Features Section */}
                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Premium Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-md text-blue-700">
                            <Settings size={18} />
                          </div>
                          <h4 className="font-medium text-blue-900">Drag & Drop Editor</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Intuitive interface for positioning and adjusting vehicle parts with real-time updates.
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-md text-blue-700">
                            <Camera size={18} />
                          </div>
                          <h4 className="font-medium text-blue-900">3D Visualization</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Interactive 3D models with realistic lighting and environmental controls.
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-md text-blue-700">
                            <HelpCircle size={18} />
                          </div>
                          <h4 className="font-medium text-blue-900">Smart Recommendations</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Personalized vehicle and part suggestions based on your preferences and style.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {isVehiclesLoading ? (
                  <div className="flex justify-center items-center h-96">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading vehicles...</span>
                  </div>
                ) : (
                  <VehicleSelector
                    vehicles={vehicleModels}
                    selectedVehicle={selectedVehicle?.id as number}
                    onSelectVehicle={handleVehicleSelect}
                    onContinue={handleContinue}
                  />
                )}
              </div>
            )}

            {/* Customization Steps (Exterior, Interior, Performance, Wheels, Lighting) */}
            {['exterior', 'interior', 'performance', 'wheels', 'lighting'].includes(currentStep) && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 3D Visualization */}
                <div className="lg:col-span-7 h-96 lg:h-auto">
                  <PremiumThreeDVisualizer
                    vehicleConfiguration={vehicleConfig}
                    height="100%"
                    className="rounded-lg shadow-sm border border-gray-200"
                  />
                </div>
                
                {/* Parts selector and customization options */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="sticky top-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {selectedVehicle?.name} Customization
                        </CardTitle>
                        <CardDescription>
                          Select parts to customize your vehicle
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <CustomizationCategories
                            selectedCategory={selectedCategory}
                            selectedSubcategory={selectedSubcategory}
                            onCategorySelect={handleCategorySelect}
                            onSubcategorySelect={handleSubcategorySelect}
                            layout="accordion"
                          />
                          
                          {isPartsLoading ? (
                            <div className="flex justify-center items-center h-40">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                              <span className="ml-2 text-sm text-muted-foreground">Loading parts...</span>
                            </div>
                          ) : (
                            <PartSelector
                              category={selectedCategory}
                              subcategory={selectedSubcategory}
                              parts={filteredParts}
                              selectedParts={selectedParts.map(p => p.id as number)}
                              onSelectPart={handlePartSelect}
                            />
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div>
                          <p className="text-sm text-gray-500">Total Price</p>
                          <p className="text-xl font-bold text-blue-700 mt-1">
                            {formatCurrency(calculateTotalPrice())}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            onClick={handleBack}
                          >
                            <ArrowLeft size={16} className="mr-2" />
                            Back
                          </Button>
                          <Button onClick={handleContinue}>
                            Continue
                            <ArrowRight size={16} className="ml-2" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Review & Checkout Step */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Review Your Customization</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* 3D Visualization */}
                  <div className="lg:col-span-7 space-y-4">
                    <PremiumThreeDVisualizer
                      vehicleConfiguration={vehicleConfig}
                      height="400px"
                      className="rounded-lg shadow-sm border border-gray-200"
                    />
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Project Management
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ProjectManager
                          project={currentProject || {
                            id: 0,
                            name: selectedVehicle ? `${selectedVehicle.manufacturer} ${selectedVehicle.name} Customization` : 'New Project',
                            description: 'Premium customization project',
                            userId: 1,
                            vehicleId: selectedVehicle?.id as number || 0,
                            status: 'in-progress',
                            visibility: 'private',
                            basePrice: selectedVehicle?.basePrice,
                            totalPrice: calculateTotalPrice(),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            customizations: vehicleConfig,
                            selectedParts: []
                          }}
                          onSave={async (data) => {
                            await handleSaveProject();
                            return;
                          }}
                          onSaveAs={async () => {
                            await handleSaveProject();
                            return;
                          }}
                          onDelete={async () => {
                            toast({
                              title: 'Project Deleted',
                              description: 'Your project has been deleted'
                            });
                            setLocation('/arena');
                            return;
                          }}
                          onExport={() => {
                            toast({
                              title: 'Export Complete',
                              description: 'Your project has been exported'
                            });
                          }}
                          onAddToCart={handleAddToCart}
                          history={mockProjectHistory}
                          collaborationStatus={mockCollaborationStatus}
                          canUndo={true}
                          canRedo={false}
                          onUndo={() => {
                            toast({
                              title: 'Undo',
                              description: 'Last action has been undone'
                            });
                          }}
                          onRedo={() => {
                            toast({
                              title: 'Redo',
                              description: 'Action has been redone'
                            });
                          }}
                          isSaving={isSaving}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Summary and Checkout */}
                  <div className="lg:col-span-5">
                    <div className="sticky top-4 space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Customization Summary</CardTitle>
                          <CardDescription>
                            Review your selected vehicle and parts
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {/* Vehicle Summary */}
                          <div className="mb-4">
                            <h3 className="font-medium text-gray-900 mb-2">Vehicle</h3>
                            {selectedVehicle ? (
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                {selectedVehicle.thumbnailUrl && (
                                  <div className="h-16 w-24 bg-gray-200 rounded-md overflow-hidden">
                                    <img 
                                      src={selectedVehicle.thumbnailUrl} 
                                      alt={selectedVehicle.name} 
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-medium">{selectedVehicle.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {selectedVehicle.manufacturer} {selectedVehicle.year}
                                  </p>
                                  <p className="text-sm font-medium text-blue-700 mt-1">
                                    {formatCurrency(selectedVehicle.basePrice || 0)}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-500">No vehicle selected</p>
                            )}
                          </div>
                          
                          {/* Parts Summary */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900">Selected Parts</h3>
                              <span className="text-sm text-gray-500">
                                {selectedParts.length} item{selectedParts.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            
                            {selectedParts.length === 0 ? (
                              <p className="text-gray-500 text-sm">No parts selected</p>
                            ) : (
                              <ScrollArea className="h-64 rounded-md border border-gray-200 p-2">
                                <div className="space-y-3">
                                  {selectedParts.map((part) => (
                                    <div 
                                      key={part.id}
                                      className="flex items-start justify-between py-2 px-3 rounded-md hover:bg-gray-50"
                                    >
                                      <div className="flex items-center gap-3">
                                        {part.thumbnailUrl && (
                                          <div className="h-10 w-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <img 
                                              src={part.thumbnailUrl} 
                                              alt={part.name} 
                                              className="h-full w-full object-cover"
                                            />
                                          </div>
                                        )}
                                        <div>
                                          <h4 className="text-sm font-medium">{part.name}</h4>
                                          <p className="text-xs text-gray-500">
                                            {part.category} - {part.subcategory}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-sm font-medium">
                                        {formatCurrency(part.price || 0)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex-col border-t pt-4">
                          {/* Price Summary */}
                          <div className="w-full space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Base Vehicle</span>
                              <span>{formatCurrency(selectedVehicle?.basePrice || 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Customization Parts</span>
                              <span>{formatCurrency(selectedParts.reduce((sum, part) => sum + (part.price || 0), 0))}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between">
                              <span className="font-medium">Total Price</span>
                              <span className="font-bold text-blue-700">{formatCurrency(calculateTotalPrice())}</span>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex w-full justify-between mt-4 pt-3 border-t">
                            <Button 
                              variant="outline" 
                              onClick={handleBack}
                            >
                              <ArrowLeft size={16} className="mr-2" />
                              Back
                            </Button>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                onClick={handleSaveProject}
                                disabled={isSaving}
                              >
                                {isSaving ? (
                                  <Loader2 size={16} className="mr-2 animate-spin" />
                                ) : (
                                  <Save size={16} className="mr-2" />
                                )}
                                Save Project
                              </Button>
                              
                              <Button 
                                onClick={handleAddToCart}
                                className="gap-2"
                              >
                                <ShoppingCart size={16} />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumArena;