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

// Premium luxury vehicles data (would be fetched from API)
const mockVehicles: VehicleModelData[] = [
  {
    id: 1,
    name: 'BMW 7 Series',
    manufacturer: 'BMW',
    category: 'four-wheeler',
    subcategory: 'Luxury Sedan',
    year: 2023,
    modelCode: 'BMW7-2023',
    thumbnailUrl: 'https://www.bmw.in/content/dam/bmw/marketIN/bmw_in/all-models/7-series/lci-i7/bmw-7-series-i7-front-view.png.asset.1686123094192.png',
    description: 'The flagship BMW 7 Series luxury sedan with cutting-edge technology and supreme comfort.',
    basePrice: 15700000,
    popularity: 9,
    colors: [
      { id: 'black', name: 'Black Sapphire', hex: '#0A0A0A', type: 'metallic', price: 0 },
      { id: 'silver', name: 'Mineral White', hex: '#E8E8E8', type: 'metallic', price: 0 },
      { id: 'blue', name: 'Tanzanite Blue', hex: '#0F2852', type: 'metallic', price: 125000 },
    ]
  },
  {
    id: 2,
    name: 'Mercedes-Benz S-Class',
    manufacturer: 'Mercedes-Benz',
    category: 'four-wheeler',
    subcategory: 'Luxury Sedan',
    year: 2023,
    modelCode: 'SCLASS2023',
    thumbnailUrl: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mercedes-Benz/S-Class/10851/1685003970346/front-left-side-47.jpg',
    description: 'The epitome of luxury and technology, the Mercedes-Benz S-Class redefines premium motoring.',
    basePrice: 17500000,
    popularity: 9,
    colors: [
      { id: 'silver', name: 'High-Tech Silver', hex: '#C0C0C0', type: 'metallic', price: 0 },
      { id: 'black', name: 'Obsidian Black', hex: '#1A1A1A', type: 'metallic', price: 0 },
      { id: 'blue', name: 'Anthracite Blue', hex: '#1E2940', type: 'metallic', price: 150000 },
    ]
  },
  {
    id: 3,
    name: 'Audi A8 L',
    manufacturer: 'Audi',
    category: 'four-wheeler',
    subcategory: 'Luxury Sedan',
    year: 2023,
    modelCode: 'A8L-2023',
    thumbnailUrl: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/141375/a8-l-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
    description: 'The Audi A8 L delivers sophisticated design, innovative technology and exhilarating driving dynamics.',
    basePrice: 13200000,
    popularity: 8,
    colors: [
      { id: 'white', name: 'Glacier White', hex: '#F0F0F0', type: 'metallic', price: 0 },
      { id: 'black', name: 'Mythos Black', hex: '#0A0A0A', type: 'metallic', price: 0 },
      { id: 'silver', name: 'Floret Silver', hex: '#C5C5C5', type: 'metallic', price: 0 },
    ]
  },
  {
    id: 4,
    name: 'Rolls-Royce Phantom',
    manufacturer: 'Rolls-Royce',
    category: 'four-wheeler',
    subcategory: 'Ultra Luxury',
    year: 2023,
    modelCode: 'PHANTOM2023',
    thumbnailUrl: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/132143/phantom-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
    description: 'The pinnacle of luxury motoring, handcrafted to perfection with unparalleled attention to detail.',
    basePrice: 89900000,
    popularity: 10,
    colors: [
      { id: 'white', name: 'Arctic White', hex: '#FFFFFF', type: 'standard', price: 0 },
      { id: 'black', name: 'Diamond Black', hex: '#000000', type: 'standard', price: 0 },
      { id: 'silver', name: 'Silver Haze', hex: '#D0D0D0', type: 'metallic', price: 250000 },
      { id: 'blue', name: 'Bespoke Blue', hex: '#1A3C6E', type: 'metallic', price: 500000 },
    ]
  },
  {
    id: 5,
    name: 'Lamborghini Urus',
    manufacturer: 'Lamborghini',
    category: 'four-wheeler',
    subcategory: 'Super SUV',
    year: 2023,
    modelCode: 'URUS2023',
    thumbnailUrl: 'https://cdni.autocarindia.com/Utils/ImageResizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/Lamborghini-Urus-300920221708.jpg',
    description: 'The world\'s first Super SUV combining Lamborghini DNA with versatility and everyday usability.',
    basePrice: 43000000,
    popularity: 9,
    colors: [
      { id: 'yellow', name: 'Giallo Auge', hex: '#F7CF10', type: 'metallic', price: 350000 },
      { id: 'green', name: 'Verde Mantis', hex: '#72B82A', type: 'metallic', price: 350000 },
      { id: 'black', name: 'Nero Noctis', hex: '#0A0A0A', type: 'metallic', price: 0 },
    ]
  }
];

// Mock customization parts (would be fetched from API)
const mockParts: CustomizationPartData[] = [
  // Exterior - Paint subcategory
  {
    id: 101,
    name: 'Premium Pearl Finish',
    category: 'exterior',
    subcategory: 'paint',
    vehicleCategories: ['four-wheeler'],
    thumbnailUrl: 'https://cdn11.bigcommerce.com/s-64pb9uhn5u/images/stencil/1280x1280/products/1173/1862/91D0oC4ZJzL._AC_SL1500___50979.1618433797.jpg?c=1',
    price: 45000,
    currency: 'INR',
    description: 'High-end pearl finish paint that changes hue based on viewing angle and lighting conditions.',
    popularity: 8,
    installationDifficulty: 3,
    material: 'Premium Acrylic Urethane'
  },
  {
    id: 102,
    name: 'Matte Military Wrap',
    category: 'exterior',
    subcategory: 'wrap',
    vehicleCategories: ['four-wheeler'],
    thumbnailUrl: 'https://m.media-amazon.com/images/I/717iuZXKUzL._AC_UF894,1000_QL80_.jpg',
    price: 65000,
    currency: 'INR',
    description: 'Full vehicle matte military green wrap with scratch-resistant coating.',
    popularity: 7,
    installationDifficulty: 4,
    material: 'High-Grade Vinyl'
  },
  // Exterior - Body subcategory
  {
    id: 201,
    name: 'Carbon Fiber Hood',
    category: 'exterior',
    subcategory: 'body',
    vehicleCategories: ['four-wheeler'],
    thumbnailUrl: 'https://cdn11.bigcommerce.com/s-90c2lk0iz7/images/stencil/1280x1280/products/198/6043/Thar-Carbon-2__92333.1671611256.jpg?c=1',
    price: 75000,
    currency: 'INR',
    description: 'Lightweight carbon fiber hood replacement with air scoop for better cooling.',
    popularity: 9,
    installationDifficulty: 2,
    material: 'Carbon Fiber',
    manufacturerWarranty: 24
  },
  // Exterior - Spoiler subcategory
  {
    id: 301,
    name: 'Aerodynamic Rear Spoiler',
    category: 'exterior',
    subcategory: 'spoiler',
    vehicleCategories: ['four-wheeler'],
    thumbnailUrl: 'https://m.media-amazon.com/images/I/61OoMRxJOjL._AC_UF894,1000_QL80_.jpg',
    price: 28000,
    currency: 'INR',
    description: 'Performance rear spoiler that improves downforce and stability at high speeds.',
    popularity: 8,
    installationDifficulty: 2,
    material: 'ABS Polymer with Carbon Fiber Finish',
    manufacturerWarranty: 12,
    dimensions: {
      width: 120,
      height: 15,
      depth: 30
    }
  },
  // Interior - Seats subcategory
  {
    id: 401,
    name: 'Premium Leather Seat Covers',
    category: 'interior',
    subcategory: 'seats',
    vehicleCategories: ['four-wheeler'],
    thumbnailUrl: 'https://www.cars24.com/blog/wp-content/uploads/2023/05/premium-seat-cover-1024x630.jpg',
    price: 35000,
    currency: 'INR',
    description: 'Handcrafted premium leather seat covers with custom stitching and embossing.',
    popularity: 9,
    installationDifficulty: 1,
    material: 'Premium Italian Leather',
    manufacturerWarranty: 36
  },
  // Interior - Dashboard subcategory
  {
    id: 501,
    name: 'Carbon Fiber Dashboard Kit',
    category: 'interior',
    subcategory: 'dashboard',
    vehicleCategories: ['four-wheeler'],
    thumbnailUrl: 'https://cdn.shopify.com/s/files/1/0645/1503/1672/products/real-carbon-fiber-ac-vents-trim-for-mahindra-thar-2020-arshia-motorsport.jpg?v=1676293553',
    price: 22000,
    currency: 'INR',
    description: 'Premium carbon fiber dashboard inserts and trim pieces for a sporty look.',
    popularity: 7,
    installationDifficulty: 2,
    material: 'Real Carbon Fiber'
  },
  // Performance - Engine subcategory
  {
    id: 601,
    name: 'Performance ECU Tune',
    category: 'performance',
    subcategory: 'engine',
    vehicleCategories: ['four-wheeler'],
    thumbnailUrl: 'https://m.media-amazon.com/images/I/61KPX11tKhL._AC_UF894,1000_QL80_.jpg',
    price: 45000,
    currency: 'INR',
    description: 'Professional ECU remapping to optimize power, torque, and fuel efficiency.',
    popularity: 9,
    installationDifficulty: 3
  },
  // Performance - Exhaust subcategory
  {
    id: 701,
    name: 'Sport Performance Exhaust System',
    category: 'performance',
    subcategory: 'exhaust',
    vehicleCategories: ['four-wheeler'],
    thumbnailUrl: 'https://5.imimg.com/data5/SELLER/Default/2023/10/349685021/RF/ZB/TL/148072370/straight-pipe-performance-exhaust-system.jpg',
    price: 60000,
    currency: 'INR',
    description: 'Full stainless steel performance exhaust system with improved flow and aggressive sound.',
    popularity: 8,
    installationDifficulty: 4,
    material: 'Stainless Steel',
    manufacturerWarranty: 24
  },
  // Wheels - Rims subcategory
  {
    id: 801,
    name: 'Off-Road Alloy Wheels Set',
    category: 'wheels',
    subcategory: 'rims',
    vehicleCategories: ['four-wheeler'],
    thumbnailUrl: 'https://i0.wp.com/gomechanic.in/blog/wp-content/uploads/2023/02/image-123-1.jpg?w=800&ssl=1',
    price: 85000,
    currency: 'INR',
    description: 'Set of 4 premium alloy wheels designed for off-road performance and style.',
    popularity: 9,
    installationDifficulty: 2,
    material: 'Forged Aluminum Alloy',
    dimensions: {
      width: 22,
      height: 22,
      depth: 12
    }
  },
  // Lighting - Headlights subcategory
  {
    id: 901,
    name: 'LED Projector Headlights',
    category: 'lighting',
    subcategory: 'headlights',
    vehicleCategories: ['four-wheeler'],
    thumbnailUrl: 'https://www.team-bhp.com/forum/attachments/modifications-accessories/1469805d1468850304-mahindra-thar-gets-maini-led-projector-headlights-led-bar-img_7428.jpg',
    price: 36000,
    currency: 'INR',
    description: 'Advanced LED projector headlights with integrated DRLs for better visibility and modern look.',
    popularity: 9,
    installationDifficulty: 3,
    manufacturerWarranty: 24
  },
];

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

  // Filtered parts based on selected category and subcategory
  const filteredParts = mockParts.filter(
    part => part.category === selectedCategory && 
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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
    if (projectData) {
      setCurrentProject(projectData);
      
      // If we have a vehicle ID, find that vehicle from our mockVehicles
      if (projectData.vehicleId) {
        const vehicle = mockVehicles.find(v => v.id === projectData.vehicleId);
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
            .map(selectedPart => {
              return mockParts.find(part => part.id === selectedPart.partId);
            })
            .filter(part => part !== undefined) as CustomizationPartData[];
          
          setSelectedParts(loadedParts);
          
          // Update vehicle configuration
          const parts: CustomizationPartInstance[] = projectData.selectedParts.map(selectedPart => {
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
  }, [projectData, currentStep]);

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
      baseVehicleId: vehicle.id as number
    }));
  };

  // Handle continuing to next step
  const handleContinue = () => {
    const currentIndex = CUSTOMIZATION_STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex < CUSTOMIZATION_STEPS.length - 1) {
      setCurrentStep(CUSTOMIZATION_STEPS[currentIndex + 1].id);
      
      // If going to a category step, update selected category
      const nextStep = CUSTOMIZATION_STEPS[currentIndex + 1].id;
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
        // Other properties like rotation, etc.
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
                      
                      <Button className="w-full">
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
                
                <VehicleSelector
                  vehicles={mockVehicles}
                  selectedVehicle={selectedVehicle?.id as number}
                  onSelectVehicle={handleVehicleSelect}
                  onContinue={handleContinue}
                />
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
                          
                          <PartSelector
                            category={selectedCategory}
                            subcategory={selectedSubcategory}
                            parts={filteredParts}
                            selectedParts={selectedParts.map(p => p.id as number)}
                            onSelectPart={handlePartSelect}
                          />
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
                            updatedAt: new Date()
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