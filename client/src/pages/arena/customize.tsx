import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight,
  ChevronRight,
  Save,
  Share,
  Camera,
  Upload,
  Palette,
  Car,
  Cog,
  ShoppingCart,
  Lightbulb,
  Home,
  Check,
  Map,
  X,
  DollarSign,
  RefreshCw,
  Info,
  Undo,
  Wrench,
  Store,
  Users,
  Trophy,
  Sparkles,
  Search,
  Clock,
  Link,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent,
  TabsList,
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import ArenaWrapper from '@/components/arena/ArenaWrapper';
import VehicleModel from '@/components/arena/vehicle-models/VehicleModel';

// Mock data for a selected vehicle
const selectedVehicleData = {
  id: 3,
  name: 'Maruti Suzuki Swift',
  type: 'four-wheeler',
  make: 'Maruti Suzuki',
  model: 'Swift',
  year: 2023,
  fuelType: 'petrol',
  modelId: 'swift2023',
  description: 'The iconic hatchback with sporty styling and efficient performance.',
  popularity: 95,
  specifications: {
    engine: '1.2L K-Series Dual Jet',
    power: '89 bhp @ 6000 rpm',
    torque: '113 Nm @ 4400 rpm',
    transmission: '5-Speed Manual/AMT',
    dimensions: 'L: 3845mm x W: 1735mm x H: 1530mm',
    groundClearance: '163 mm'
  },
  customizationOptions: {
    exterior: true,
    interior: true,
    performance: true,
    wheels: true,
    lighting: true,
    wraps: true
  }
};

// Types for customization items
interface CustomizationItem {
  id: string;
  name: string;
  description: string;
  price: number;
  installationTime: string;
  category: string;
  subcategory: string;
  popularity: number;
  image?: string;
  compatible: boolean;
  preview?: string;
}

// Types for customization categories
interface CustomizationCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories: {
    id: string;
    name: string;
  }[];
}

// Mock data for customization categories
const customizationCategories: CustomizationCategory[] = [
  {
    id: 'exterior',
    name: 'Exterior',
    icon: <Car />,
    subcategories: [
      { id: 'body-kits', name: 'Body Kits' },
      { id: 'spoilers', name: 'Spoilers' },
      { id: 'mirrors', name: 'Mirrors' },
      { id: 'grills', name: 'Grills' }
    ]
  },
  {
    id: 'paint',
    name: 'Paint & Wraps',
    icon: <Palette />,
    subcategories: [
      { id: 'colors', name: 'Colors' },
      { id: 'wraps', name: 'Wraps' },
      { id: 'custom-wraps', name: 'Custom Designs' },
      { id: 'decals', name: 'Decals' }
    ]
  },
  {
    id: 'wheels',
    name: 'Wheels & Tires',
    icon: <RefreshCw />,
    subcategories: [
      { id: 'alloys', name: 'Alloy Wheels' },
      { id: 'tires', name: 'Tires' },
      { id: 'wheel-accessories', name: 'Wheel Accessories' }
    ]
  },
  {
    id: 'lighting',
    name: 'Lighting',
    icon: <Lightbulb />,
    subcategories: [
      { id: 'headlights', name: 'Headlights' },
      { id: 'taillights', name: 'Taillights' },
      { id: 'fog-lights', name: 'Fog Lights' },
      { id: 'interior-lights', name: 'Interior Lights' },
      { id: 'light-strips', name: 'Light Strips' }
    ]
  },
  {
    id: 'interior',
    name: 'Interior',
    icon: <Home />,
    subcategories: [
      { id: 'seats', name: 'Seats' },
      { id: 'dashboard', name: 'Dashboard' },
      { id: 'steering', name: 'Steering' },
      { id: 'audio', name: 'Audio System' },
      { id: 'floor-mats', name: 'Floor Mats' }
    ]
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: <Cog />,
    subcategories: [
      { id: 'engine', name: 'Engine' },
      { id: 'exhaust', name: 'Exhaust' },
      { id: 'suspension', name: 'Suspension' },
      { id: 'brakes', name: 'Brakes' },
      { id: 'turbo', name: 'Turbochargers' }
    ]
  }
];

// Mock data for customization items
const mockCustomizationItems: CustomizationItem[] = [
  // Exterior - Body Kits
  {
    id: 'bk-001',
    name: 'Swift Sport Body Kit',
    description: 'Complete body kit inspired by Swift Sport with front bumper, side skirts, and rear diffuser.',
    price: 32000,
    installationTime: '4-5 hours',
    category: 'exterior',
    subcategory: 'body-kits',
    popularity: 92,
    compatible: true
  },
  {
    id: 'bk-002',
    name: 'RS Urban Aero Kit',
    description: 'Urban style aerodynamic kit with aggressive stance and improved airflow.',
    price: 28000,
    installationTime: '3-4 hours',
    category: 'exterior',
    subcategory: 'body-kits',
    popularity: 86,
    compatible: true
  },
  
  // Exterior - Spoilers
  {
    id: 'sp-001',
    name: 'GT Rear Spoiler',
    description: 'High-performance GT style rear spoiler for enhanced stability and sporty look.',
    price: 8500,
    installationTime: '1-2 hours',
    category: 'exterior',
    subcategory: 'spoilers',
    popularity: 90,
    compatible: true
  },
  
  // Paint & Wraps - Colors
  {
    id: 'pc-001',
    name: 'Premium Metallic Blue',
    description: 'Deep metallic blue finish with enhanced depth and gloss.',
    price: 45000,
    installationTime: '3-4 days',
    category: 'paint',
    subcategory: 'colors',
    popularity: 88,
    compatible: true
  },
  {
    id: 'pc-002',
    name: 'Matte Black',
    description: 'Sophisticated matte black finish with satin clear coat for durability.',
    price: 50000,
    installationTime: '3-4 days',
    category: 'paint',
    subcategory: 'colors',
    popularity: 94,
    compatible: true
  },
  {
    id: 'pc-003',
    name: 'Pearl White',
    description: 'Brilliant pearl white with light-shifting characteristics.',
    price: 48000,
    installationTime: '3-4 days',
    category: 'paint',
    subcategory: 'colors',
    popularity: 85,
    compatible: true
  },
  
  // Paint & Wraps - Wraps
  {
    id: 'pw-001',
    name: 'Carbon Fiber Wrap',
    description: 'Premium carbon fiber texture vinyl wrap, UV resistant and durable.',
    price: 35000,
    installationTime: '2-3 days',
    category: 'paint',
    subcategory: 'wraps',
    popularity: 91,
    compatible: true
  },
  {
    id: 'pw-002',
    name: 'Racing Stripes Kit',
    description: 'Classic dual racing stripes from front to rear with custom color options.',
    price: 12000,
    installationTime: '1 day',
    category: 'paint',
    subcategory: 'wraps',
    popularity: 87,
    compatible: true
  },
  
  // Wheels & Tires - Alloy Wheels
  {
    id: 'wh-001',
    name: '16" BBS-Style Alloys',
    description: 'Lightweight BBS-inspired alloy wheels with black and machined finish.',
    price: 48000,
    installationTime: '1-2 hours',
    category: 'wheels',
    subcategory: 'alloys',
    popularity: 93,
    compatible: true
  },
  {
    id: 'wh-002',
    name: '15" OZ Racing Alloys',
    description: 'Performance OZ Racing inspired alloy wheels with gunmetal finish.',
    price: 42000,
    installationTime: '1-2 hours',
    category: 'wheels',
    subcategory: 'alloys',
    popularity: 89,
    compatible: true
  },
  
  // Wheels & Tires - Tires
  {
    id: 'tr-001',
    name: 'Michelin Pilot Sport 4',
    description: 'High-performance summer tires with excellent wet and dry grip.',
    price: 28000,
    installationTime: '1 hour',
    category: 'wheels',
    subcategory: 'tires',
    popularity: 95,
    compatible: true
  },
  
  // Lighting - Headlights
  {
    id: 'lt-001',
    name: 'LED Projector Headlights',
    description: 'Advanced LED projector headlights with integrated DRLs and sequential indicators.',
    price: 22000,
    installationTime: '2-3 hours',
    category: 'lighting',
    subcategory: 'headlights',
    popularity: 92,
    compatible: true
  },
  
  // Interior - Seats
  {
    id: 'in-001',
    name: 'Sports Bucket Seats',
    description: 'Racing-inspired bucket seats with enhanced side bolstering and premium fabrics.',
    price: 45000,
    installationTime: '3-4 hours',
    category: 'interior',
    subcategory: 'seats',
    popularity: 82,
    compatible: true
  },
  
  // Performance - Exhaust
  {
    id: 'pe-001',
    name: 'Performance Exhaust System',
    description: 'Stainless steel performance exhaust with enhanced flow and sporty sound.',
    price: 32000,
    installationTime: '2-3 hours',
    category: 'performance',
    subcategory: 'exhaust',
    popularity: 90,
    compatible: true
  }
];

// Types for Service Centers
interface ServiceCenter {
  id: string;
  name: string;
  distance: string;
  rating: number;
  address: string;
  specialty: string[];
  workingHours: string;
  pricing: 'budget' | 'standard' | 'premium';
}

// Mock Service Centers
const nearbyServiceCenters: ServiceCenter[] = [
  {
    id: 'sc001',
    name: 'Apex Auto Studio',
    distance: '3.2 km',
    rating: 4.8,
    address: '123 Workshop Street, Bangalore',
    specialty: ['exterior', 'paint', 'wheels'],
    workingHours: 'Mon-Sat: 9AM-7PM',
    pricing: 'premium'
  },
  {
    id: 'sc002',
    name: 'Velocity Customs',
    distance: '4.7 km',
    rating: 4.6,
    address: '45 Mechanic Avenue, Bangalore',
    specialty: ['performance', 'wheels', 'lighting'],
    workingHours: 'Mon-Sun: 8AM-8PM',
    pricing: 'standard'
  },
  {
    id: 'sc003',
    name: 'EcoDrive Mods',
    distance: '6.1 km',
    rating: 4.5,
    address: '78 Motors Road, Bangalore',
    specialty: ['interior', 'lighting', 'paint'],
    workingHours: 'Mon-Fri: 10AM-6PM',
    pricing: 'budget'
  },
  {
    id: 'sc004',
    name: 'Swift Customs',
    distance: '5.3 km',
    rating: 4.7,
    address: '22 Auto Lane, Bangalore',
    specialty: ['wheels', 'performance', 'exterior'],
    workingHours: 'Mon-Sat: 9AM-8PM',
    pricing: 'standard'
  }
];

const Customize: React.FC = () => {
  const [_, params] = useRoute<{ id: string }>('/arena/customize/:id');
  const [__, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for the customization interface
  const [customizationStep, setCustomizationStep] = useState<'overview' | 'customize' | 'marketplace' | 'installation' | 'share'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('exterior');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('body-kits');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<CustomizationItem[]>(mockCustomizationItems);
  const [cartItems, setCartItems] = useState<CustomizationItem[]>([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [appliedCustomizations, setAppliedCustomizations] = useState<{
    type: 'paint' | 'wheels' | 'bodykit' | 'wrap' | 'interior' | 'lighting';
    itemId: string;
    color?: string;
    texture?: string;
  }[]>([]);
  const [selectedServiceCenter, setSelectedServiceCenter] = useState<ServiceCenter | null>(null);
  const [showCustomWrapModal, setShowCustomWrapModal] = useState(false);
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [gamificationPoints, setGamificationPoints] = useState(150);
  const [customizationProjectName, setCustomizationProjectName] = useState('My Swift Custom Project');
  const [projectSaved, setProjectSaved] = useState(false);
  
  // Calculate total prices and installation times
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const installationTimeEstimate = calculateInstallationTime(cartItems);
  
  // Filter items based on category, subcategory, and search
  useEffect(() => {
    let filtered = mockCustomizationItems;
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
      
      // Filter by subcategory if one is selected
      if (selectedSubcategory) {
        filtered = filtered.filter(item => item.subcategory === selectedSubcategory);
      }
    }
    
    // Apply search filter if query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(filtered);
  }, [selectedCategory, selectedSubcategory, searchQuery]);
  
  // Function to add item to cart
  const addToCart = (item: CustomizationItem) => {
    // Check if item is already in cart
    if (!cartItems.some(cartItem => cartItem.id === item.id)) {
      setCartItems([...cartItems, item]);
      
      // Apply customization immediately for visual feedback
      const customizationType = mapCategoryToCustomizationType(item.category);
      if (customizationType) {
        setAppliedCustomizations([
          ...appliedCustomizations, 
          { 
            type: customizationType, 
            itemId: item.id
          }
        ]);
      }
      
      // Award points for adding items
      setGamificationPoints(prev => prev + 10);
      
      toast({
        title: "Item added to cart",
        description: `${item.name} has been added to your customization cart.`,
      });
    } else {
      toast({
        title: "Item already in cart",
        description: `${item.name} is already in your customization cart.`,
        variant: "destructive",
      });
    }
  };
  
  // Function to remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    
    // Remove from applied customizations
    setAppliedCustomizations(appliedCustomizations.filter(cust => cust.itemId !== itemId));
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your customization cart.",
    });
  };
  
  // Function to handle custom wrap image upload
  const handleCustomWrapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setCustomImageFile(file);
        
        // In a real app, you would upload this file and process it
        // For now, we'll simulate applying the wrap
        toast({
          title: "Custom wrap uploaded",
          description: "Your custom design has been uploaded and applied to the vehicle.",
        });
        
        // Apply a custom wrap
        setAppliedCustomizations([
          ...appliedCustomizations,
          {
            type: 'wrap',
            itemId: 'custom-wrap-' + Date.now(),
            texture: 'custom'
          }
        ]);
        
        // Award bonus points for creativity
        setGamificationPoints(prev => prev + 25);
        
        // Close the modal after uploading
        setShowCustomWrapModal(false);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };
  
  // Function to save project
  const saveProject = () => {
    // In a real app, this would save to a database
    setProjectSaved(true);
    
    toast({
      title: "Project saved",
      description: `Your project "${customizationProjectName}" has been saved successfully.`,
    });
    
    // Award points for saving a project
    setGamificationPoints(prev => prev + 20);
  };
  
  // Function to share project
  const shareProject = () => {
    // In a real app, this would generate a shareable link or social media share
    toast({
      title: "Project shared",
      description: "Your customization project has been shared!",
    });
    
    // Award points for sharing
    setGamificationPoints(prev => prev + 30);
    
    // Show custom achievement
    setTimeout(() => {
      toast({
        title: "Achievement Unlocked!",
        description: "Social Butterfly: Share your first vehicle design",
        variant: "default",
      });
    }, 1500);
  };
  
  // Function to calculate installation time
  function calculateInstallationTime(items: CustomizationItem[]): string {
    if (items.length === 0) return "0 hours";
    
    // Extract time ranges and convert to hours
    const timeRanges = items.map(item => {
      const timeStr = item.installationTime;
      if (timeStr.includes('day')) {
        // Convert days to hours (8 hours per day)
        const days = parseInt(timeStr.match(/\d+/)?.[0] || "1");
        return days * 8;
      } else {
        // Extract hour range (e.g., "2-3 hours" -> [2, 3])
        const matches = timeStr.match(/(\d+)(?:-(\d+))?\s*hours?/);
        if (matches) {
          if (matches[2]) {
            return (parseInt(matches[1]) + parseInt(matches[2])) / 2; // Average of range
          } else {
            return parseInt(matches[1]);
          }
        }
        return 1; // Default if parsing fails
      }
    });
    
    // Sum up all times
    const totalHours = timeRanges.reduce((sum, hours) => sum + hours, 0);
    
    // Format the result
    if (totalHours >= 24) {
      const days = Math.floor(totalHours / 8); // Assuming 8-hour workdays
      const remainingHours = totalHours % 8;
      return `${days} day${days > 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours} hour${remainingHours > 1 ? 's' : ''}` : ''}`;
    } else {
      return `${totalHours} hour${totalHours !== 1 ? 's' : ''}`;
    }
  }
  
  // Helper function to map category to customization type
  function mapCategoryToCustomizationType(category: string): 'paint' | 'wheels' | 'bodykit' | 'wrap' | 'interior' | 'lighting' | undefined {
    switch (category) {
      case 'exterior': return 'bodykit';
      case 'paint': return 'paint';
      case 'wheels': return 'wheels';
      case 'lighting': return 'lighting';
      case 'interior': return 'interior';
      default: return undefined;
    }
  }
  
  // Function to get current category
  const getCurrentCategory = () => {
    return customizationCategories.find(cat => cat.id === selectedCategory);
  };
  
  // Function to get rewards tier based on points
  const getRewardsTier = () => {
    if (gamificationPoints >= 500) return "Platinum Customizer";
    if (gamificationPoints >= 300) return "Gold Customizer";
    if (gamificationPoints >= 150) return "Silver Customizer";
    return "Bronze Customizer";
  };
  
  // Progress to next step
  const goToNextStep = () => {
    switch (customizationStep) {
      case 'overview':
        setCustomizationStep('customize');
        break;
      case 'customize':
        setCustomizationStep('marketplace');
        break;
      case 'marketplace':
        setCustomizationStep('installation');
        break;
      case 'installation':
        setCustomizationStep('share');
        break;
      case 'share':
        // Complete the process
        toast({
          title: "Customization Complete!",
          description: "You've successfully completed your vehicle customization.",
        });
        setLocation('/arena');
        break;
    }
    
    // Award points for progression
    setGamificationPoints(prev => prev + 15);
  };
  
  // Go to previous step
  const goToPreviousStep = () => {
    switch (customizationStep) {
      case 'customize':
        setCustomizationStep('overview');
        break;
      case 'marketplace':
        setCustomizationStep('customize');
        break;
      case 'installation':
        setCustomizationStep('marketplace');
        break;
      case 'share':
        setCustomizationStep('installation');
        break;
    }
  };
  
  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { id: 'overview', name: 'Overview' },
      { id: 'customize', name: 'Customize' },
      { id: 'marketplace', name: 'Parts' },
      { id: 'installation', name: 'Installation' },
      { id: 'share', name: 'Share' }
    ];
    
    return (
      <div className="flex items-center justify-between w-full mb-6 px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  customizationStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : steps.indexOf({ id: customizationStep, name: '' }) > index
                      ? 'bg-primary/80 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {steps.indexOf({ id: customizationStep, name: '' }) > index ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`text-xs mt-1 ${customizationStep === step.id ? 'font-medium' : 'text-muted-foreground'}`}>
                {step.name}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`h-0.5 w-full max-w-[60px] ${
                steps.indexOf({ id: customizationStep, name: '' }) > index
                  ? 'bg-primary/60'
                  : 'bg-muted'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  // Render different steps
  const renderStepContent = () => {
    switch (customizationStep) {
      case 'overview':
        return renderOverviewStep();
      case 'customize':
        return renderCustomizeStep();
      case 'marketplace':
        return renderMarketplaceStep();
      case 'installation':
        return renderInstallationStep();
      case 'share':
        return renderShareStep();
      default:
        return null;
    }
  };
  
  // Overview Step Content
  const renderOverviewStep = () => {
    return (
      <div className="flex flex-col lg:flex-row h-full">
        {/* Vehicle preview section */}
        <div className="lg:w-2/3 p-4">
          <div className="bg-muted/20 rounded-lg h-[400px] mb-4 overflow-hidden">
            <VehicleModel
              modelId={selectedVehicleData.modelId}
              vehicleMake={selectedVehicleData.make}
              vehicleModel={selectedVehicleData.model}
              showLabels={true}
              autoRotate={true}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(selectedVehicleData.specifications).map(([key, value]) => (
                  value && (
                    <div key={key} className="bg-muted/30 p-2 rounded">
                      <div className="text-xs text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm font-medium truncate">
                        {value}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Available Customization Options</h3>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(selectedVehicleData.customizationOptions).map(([option, available]) => (
                  <div 
                    key={option} 
                    className={`p-2 rounded text-center ${
                      available 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="capitalize">{option}</div>
                    <div className="text-xs mt-0.5">
                      {available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Project information section */}
        <div className="lg:w-1/3 border-l p-4">
          <div className="mb-4">
            <Label htmlFor="project-name" className="text-sm font-medium mb-1 block">
              Project Name
            </Label>
            <Input
              id="project-name"
              value={customizationProjectName}
              onChange={(e) => setCustomizationProjectName(e.target.value)}
              className="mb-2"
            />
            <p className="text-sm text-muted-foreground">
              Give your customization project a unique name to save and share it later.
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Customization Process</h3>
              <ol className="space-y-2">
                {[
                  'Start by selecting customization categories',
                  'Browse and select from available parts and modifications',
                  'Add items to your customization cart',
                  'View real-time cost updates and 360° visualization',
                  'Find and select nearby installation service centers',
                  'Save and share your custom creation'
                ].map((step, index) => (
                  <li key={index} className="text-sm flex">
                    <span className="bg-primary/10 text-primary h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                <h4 className="font-medium">Rewards Program</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Earn points as you design and customize. Unlock achievements and special rewards.
              </p>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">{gamificationPoints} points</span>
                <span className="text-xs font-medium">{getRewardsTier()}</span>
              </div>
              <Progress value={(gamificationPoints % 100) / 100 * 100} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-1">
                {100 - (gamificationPoints % 100)} points to next reward
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Customize Step Content
  const renderCustomizeStep = () => {
    return (
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left panel - Categories */}
        <div className="w-full lg:w-64 border-r">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="p-4 space-y-1">
              {customizationCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedSubcategory(category.subcategories[0]?.id || '');
                  }}
                >
                  <div className="mr-2">{category.icon}</div>
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Middle panel - Vehicle preview and subcategories */}
        <div className="flex-1 flex flex-col">
          {/* Vehicle 3D preview */}
          <div className="p-4 border-b">
            <div className="bg-muted/20 rounded-lg h-[350px] overflow-hidden">
              <VehicleModel
                modelId={selectedVehicleData.modelId}
                vehicleMake={selectedVehicleData.make}
                vehicleModel={selectedVehicleData.model}
                showLabels={true}
                applyCustomization={appliedCustomizations}
              />
            </div>
          </div>
          
          {/* Subcategories */}
          <div className="border-b p-2">
            <div className="w-full overflow-auto">
              <div className="flex space-x-1 p-1 min-w-max">
                {getCurrentCategory()?.subcategories.map((subcategory) => (
                  <Button
                    key={subcategory.id}
                    variant={selectedSubcategory === subcategory.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubcategory(subcategory.id)}
                  >
                    {subcategory.name}
                  </Button>
                ))}
                
                {/* Custom Wrap option for Paint & Wraps category */}
                {selectedCategory === 'paint' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomWrapModal(true)}
                    className="bg-primary/10"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1" />
                    Upload Custom Design
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Parts selection */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{item.name}</CardTitle>
                          <Badge>{item.popularity}% Popular</Badge>
                        </div>
                        <CardDescription className="text-xs truncate">
                          {item.subcategory.replace(/-/g, ' ')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="aspect-video bg-muted rounded flex items-center justify-center mb-2">
                          {/* This would be an actual product image in a real app */}
                          <div className="text-xl font-bold text-muted-foreground">
                            {item.category.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <p className="text-sm">{item.description}</p>
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <div className="font-semibold">₹{item.price.toLocaleString()}</div>
                          <div className="text-muted-foreground">{item.installationTime}</div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={() => addToCart(item)}
                          disabled={cartItems.some(cartItem => cartItem.id === item.id)}
                        >
                          {cartItems.some(cartItem => cartItem.id === item.id) ? (
                            <Check className="mr-2 h-4 w-4" />
                          ) : (
                            <ShoppingCart className="mr-2 h-4 w-4" />
                          )}
                          {cartItems.some(cartItem => cartItem.id === item.id) ? 'Added' : 'Add to Cart'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-8">
                    <div className="bg-muted/50 p-4 rounded-full mb-4">
                      <Info className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No items found</h3>
                    <p className="text-muted-foreground mt-1 text-center max-w-sm">
                      No customization options found for this selection. Try a different category or subcategory.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {/* Right panel - Cart */}
        <div className={`w-full lg:w-72 border-l transition-all duration-300 ${cartVisible ? 'translate-x-0' : 'translate-x-full hidden lg:block'}`}>
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-1.5" />
              Cart ({cartItems.length})
            </h3>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setCartVisible(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className="p-4 space-y-3">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col p-2 border rounded-md">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">{item.name}</div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {item.category} · {item.subcategory.replace(/-/g, ' ')}
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <div>₹{item.price.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{item.installationTime}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <div className="bg-muted/30 p-3 rounded-full inline-block mb-2">
                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your cart is empty
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add items from the catalog
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span>Total Parts Cost:</span>
                  <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated Installation:</span>
                  <span>{installationTimeEstimate}</span>
                </div>
              </div>
              
              <Button className="w-full" onClick={saveProject}>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          )}
        </div>
        
        {/* Mobile cart toggle */}
        <div className="lg:hidden fixed bottom-20 right-4 z-10">
          <Button 
            variant="default" 
            className="rounded-full h-12 w-12 shadow-lg"
            onClick={() => setCartVisible(!cartVisible)}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
      </div>
    );
  };
  
  // Marketplace Step Content
  const renderMarketplaceStep = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Parts Marketplace</h2>
          <p className="text-sm text-muted-foreground">
            Find compatible parts for your vehicle from our marketplace
          </p>
        </div>
        
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Filters */}
          <div className="w-full lg:w-64 border-r p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Search Parts</h3>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search parts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="category">
                <AccordionTrigger className="text-sm">Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {customizationCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`cat-${category.id}`} 
                          checked={selectedCategory === category.id}
                          onCheckedChange={() => setSelectedCategory(category.id)}
                        />
                        <Label htmlFor={`cat-${category.id}`} className="text-sm cursor-pointer">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="price">
                <AccordionTrigger className="text-sm">Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Price Range</Label>
                      <Slider 
                        defaultValue={[0, 50000]} 
                        max={50000}
                        step={1000}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₹0</span>
                        <span>₹50,000</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="brand">
                <AccordionTrigger className="text-sm">Brands</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {['OEM Parts', 'Performance Brands', 'Aftermarket'].map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`brand-${brand}`} 
                        />
                        <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Parts catalog */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4">
                <h3 className="font-medium mb-3">Compatible Parts for {selectedVehicleData.name}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{item.name}</CardTitle>
                          <Badge variant="outline">
                            <Store className="h-3 w-3 mr-1" />
                            In Stock
                          </Badge>
                        </div>
                        <CardDescription className="text-xs truncate">
                          {item.subcategory.replace(/-/g, ' ')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="aspect-video bg-muted rounded flex items-center justify-center mb-2">
                          {/* This would be an actual product image in a real app */}
                          <div className="text-xl font-bold text-muted-foreground">
                            {item.category.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <p className="text-sm">{item.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <div className="font-semibold">₹{item.price.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                            100% Compatible
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => addToCart(item)}
                          disabled={cartItems.some(cartItem => cartItem.id === item.id)}
                        >
                          {cartItems.some(cartItem => cartItem.id === item.id) ? 'Added' : 'Add to Cart'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    );
  };
  
  // Installation Step Content
  const renderInstallationStep = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Installation Service Centers</h2>
          <p className="text-sm text-muted-foreground">
            Choose from nearby service centers to install your customizations
          </p>
        </div>
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Service centers list */}
          <div className="w-full lg:w-1/2 border-r">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4 space-y-4">
                {nearbyServiceCenters.map((center) => (
                  <Card 
                    key={center.id} 
                    className={`cursor-pointer overflow-hidden hover:border-primary transition-all ${
                      selectedServiceCenter?.id === center.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedServiceCenter(center)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">{center.name}</CardTitle>
                        <div className="flex items-center">
                          <Badge variant="outline">
                            <Map className="h-3 w-3 mr-1" />
                            {center.distance}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-xs">
                        {center.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {center.specialty.map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs capitalize">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg 
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(center.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1">{center.rating}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {center.workingHours}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                      <div className="w-full flex justify-between items-center">
                        <div className="text-xs">
                          Pricing: 
                          <span className={`ml-1 font-medium ${
                            center.pricing === 'premium' 
                              ? 'text-purple-600' 
                              : center.pricing === 'standard'
                                ? 'text-blue-600'
                                : 'text-green-600'
                          }`}>
                            {center.pricing.charAt(0).toUpperCase() + center.pricing.slice(1)}
                          </span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs"
                        >
                          View Services
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Installation details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {selectedServiceCenter ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{selectedServiceCenter.name}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedServiceCenter(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 p-4 overflow-auto">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    {/* This would be an actual map or service center image in a real app */}
                    <Map className="h-12 w-12 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Installation Summary</h4>
                      <div className="space-y-2">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Parts Cost</span>
                            <span className="text-sm">₹{totalPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Installation</span>
                            <span className="text-sm">₹{Math.round(totalPrice * 0.15).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Taxes</span>
                            <span className="text-sm">₹{Math.round(totalPrice * 0.18).toLocaleString()}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>₹{Math.round(totalPrice * 1.33).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Installation Timeline</h4>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-medium">Estimated Completion</div>
                          <Badge variant="outline">{installationTimeEstimate}</Badge>
                        </div>
                        
                        <div className="space-y-3">
                          {cartItems.map((item, index) => (
                            <div key={item.id} className="flex items-start">
                              <div className="bg-primary/10 text-primary h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </div>
                              <div>
                                <div className="text-sm font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {item.installationTime} installation time
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Service Center Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <Map className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                          <div className="text-sm">{selectedServiceCenter.address}</div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                          <div className="text-sm">{selectedServiceCenter.workingHours}</div>
                        </div>
                        <div className="flex items-start">
                          <Wrench className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                          <div className="text-sm">
                            Specializes in: {selectedServiceCenter.specialty.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <Button className="w-full">Book Installation Appointment</Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-xs">
                  <div className="bg-muted/30 p-4 rounded-full inline-block mb-4">
                    <Map className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Select a Service Center</h3>
                  <p className="text-muted-foreground mt-1">
                    Choose a service center from the list to view installation details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Share Step Content
  const renderShareStep = () => {
    return (
      <div className="flex flex-col lg:flex-row h-full">
        {/* Preview section */}
        <div className="lg:w-2/3 p-4">
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="aspect-video bg-black/70 rounded-lg overflow-hidden mb-4">
              <VehicleModel
                modelId={selectedVehicleData.modelId}
                vehicleMake={selectedVehicleData.make}
                vehicleModel={selectedVehicleData.model}
                showLabels={false}
                applyCustomization={appliedCustomizations}
                autoRotate={true}
              />
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{customizationProjectName}</h2>
                  <p className="text-sm text-muted-foreground">
                    By You • {new Date().toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Badge variant="outline" className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    Public
                  </Badge>
                  <Badge variant="secondary" className="flex items-center">
                    <Car className="h-3 w-3 mr-1" />
                    {selectedVehicleData.make}
                  </Badge>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Vehicle Information</h3>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Make & Model:</span>{' '}
                      {selectedVehicleData.make} {selectedVehicleData.model}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Year:</span>{' '}
                      {selectedVehicleData.year}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Fuel Type:</span>{' '}
                      {selectedVehicleData.fuelType.charAt(0).toUpperCase() + selectedVehicleData.fuelType.slice(1)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Customization Summary</h3>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Parts Added:</span>{' '}
                      {cartItems.length}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total Value:</span>{' '}
                      ₹{totalPrice.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Categories Modified:</span>{' '}
                      {Array.from(new Set(cartItems.map(item => item.category))).length}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Customization Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {cartItems.map((item) => (
                    <Badge key={item.id} variant="outline" className="bg-primary/5">
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sharing options */}
        <div className="lg:w-1/3 border-l p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Share Your Creation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Showcase your unique vehicle customization with the community
              </p>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Project Visibility</CardTitle>
                  <CardDescription>Control who can view your project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="public" defaultChecked />
                      <Label htmlFor="public" className="text-sm cursor-pointer">
                        Public (Everyone can view)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="friends" />
                      <Label htmlFor="friends" className="text-sm cursor-pointer">
                        Friends Only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="private" />
                      <Label htmlFor="private" className="text-sm cursor-pointer">
                        Private (Only you)
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-2">Sharing Options</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Community Feed', icon: <Users className="h-5 w-5" />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
                  { name: 'Social Media', icon: <Share className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
                  { name: 'Download', icon: <Camera className="h-5 w-5" />, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
                  { name: 'Share Link', icon: <Link className="h-5 w-5" />, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
                ].map((option) => (
                  <Button
                    key={option.name}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                    onClick={shareProject}
                  >
                    <div className={`p-2 rounded-full ${option.color}`}>
                      {option.icon}
                    </div>
                    <span className="text-sm">{option.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-2">Community Competitions</h3>
              <Card className="border-dashed border-primary/50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base flex items-center">
                        <Trophy className="h-4 w-4 text-amber-500 mr-1.5" />
                        Summer Custom Contest
                      </CardTitle>
                      <CardDescription>Win prizes for your design</CardDescription>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">
                    Submit your custom design to the Summer Contest and win exclusive rewards!
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => {
                    toast({
                      title: "Design Submitted",
                      description: "Your design has been submitted to the Summer Custom Contest!",
                    });
                    setGamificationPoints(prev => prev + 50);
                  }}>Submit Entry</Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
                <h4 className="font-medium">Rewards Earned</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                You've earned {gamificationPoints} points for this customization!
              </p>
              <p className="text-xs text-muted-foreground">
                Share your design to earn bonus points and unlock special achievements.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Custom wrap upload modal
  const renderCustomWrapModal = () => {
    return (
      <Dialog open={showCustomWrapModal} onOpenChange={setShowCustomWrapModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Custom Design</DialogTitle>
            <DialogDescription>
              Upload your own design to be applied as a custom wrap on your vehicle
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Click to upload design</p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG or SVG (max. 5MB)
              </p>
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleCustomWrapUpload}
              />
            </div>
            
            {customImageFile && (
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center mr-2">
                    <FileImage className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {customImageFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(customImageFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCustomImageFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomWrapModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (customImageFile) {
                  // In a real app, process the image here
                  // For now, simulate applying the wrap
                  setAppliedCustomizations([
                    ...appliedCustomizations,
                    {
                      type: 'wrap',
                      itemId: 'custom-wrap-' + Date.now(),
                      texture: 'custom'
                    }
                  ]);
                  
                  // Award bonus points for creativity
                  setGamificationPoints(prev => prev + 25);
                  
                  setShowCustomWrapModal(false);
                  
                  toast({
                    title: "Custom wrap applied",
                    description: "Your design has been successfully applied to the vehicle.",
                  });
                } else {
                  toast({
                    title: "No file selected",
                    description: "Please upload an image file first.",
                    variant: "destructive",
                  });
                }
              }}
              disabled={!customImageFile}
            >
              Apply Design
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // File icon component
  const FileImage = (props: any) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <circle cx="10" cy="13" r="2" />
      <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22" />
    </svg>
  );
  
  return (
    <ArenaWrapper>
      <div className="flex flex-col min-h-screen overflow-hidden bg-background">
        {/* Header */}
        <header className="bg-background border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Arena Customization Studio
              </h1>
              <p className="text-muted-foreground">
                Vehicle: {selectedVehicleData.make} {selectedVehicleData.model}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setLocation('/arena/vehicle-selection')}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Selection
              </Button>
              
              {/* Gamification reward counter */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="gap-1">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <span>{gamificationPoints}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{getRewardsTier()}</p>
                    <p className="text-xs">{100 - (gamificationPoints % 100)} points to next reward</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>My Projects</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Step indicator */}
        <div className="bg-background border-b">
          {renderStepIndicator()}
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderStepContent()}
        </div>
        
        {/* Bottom action bar */}
        <div className="bg-background border-t px-6 py-4">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={goToPreviousStep}
              disabled={customizationStep === 'overview'}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Step
            </Button>
            
            <Button onClick={goToNextStep}>
              {customizationStep === 'share' ? 'Finish' : 'Next Step'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {renderCustomWrapModal()}
    </ArenaWrapper>
  );
};

export default Customize;