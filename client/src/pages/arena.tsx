import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/formatters';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Settings,
  Wrench,
  Palette,
  Activity,
  Component,
  PanelLeft,
  Gauge,
  ChevronRight,
  PaintBucket,
  Sparkles,
  Zap,
  Award,
  AreaChart,
  Sofa,
  BadgePercent,
  StopCircle,
  CircleDot,
  ShieldCheck,
  DollarSign,
  Share2,
  Download,
  Heart,
  Send,
  CheckSquare,
  ShoppingCart,
  Lightbulb,
  Paintbrush,
  Plus
} from 'lucide-react';
import ArenaWrapper from '@/components/arena/ArenaWrapper';
import PreviewCard from '@/components/arena/PreviewCard';
import EnhancedColorSelector from '@/components/arena/EnhancedColorSelector';
import CustomizationPackage from '@/components/arena/CustomizationPackage';
import CartPanel from '@/components/arena/CartPanel';
import ProjectControls from '@/components/arena/ProjectControls';

// Define CartPanelItem interface if not exported from CartPanel
interface CartPanelItem {
  id: string;
  name: string;
  price: number;
  category: string;
}
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Available vehicle models
const vehicleModels = [
  { id: 1, name: 'City Roadster', type: 'Sedan', brand: 'AutoLux', thumbnail: '🚗' },
  { id: 2, name: 'Urban Explorer', type: 'SUV', brand: 'TrekStar', thumbnail: '🚙' },
  { id: 3, name: 'Thunder Bolt', type: 'Sports', brand: 'Velocity', thumbnail: '🏎️' },
  { id: 4, name: 'Cruiser 250', type: 'Motorcycle', brand: 'Road King', thumbnail: '🏍️' }
];

// Example body kit options
const bodyKitOptions: CustomizationItem[] = [
  {
    id: 'stock',
    name: 'Factory Standard',
    description: 'Original manufacturer body kit',
    price: 0,
    stock: 'in-stock' as const,
    installTime: '0 hrs'
  },
  {
    id: 'sport',
    name: 'Sport Package',
    description: 'Enhanced sporty appearance with side skirts',
    price: 45000,
    popular: true,
    stock: 'in-stock' as const,
    installTime: '4-6 hrs'
  },
  {
    id: 'premium',
    name: 'Premium Aero',
    description: 'Full body aerodynamic kit with carbon fiber accents',
    price: 85000,
    recommended: true,
    stock: 'in-stock' as const,
    rating: 4.8,
    installTime: '6-8 hrs'
  },
  {
    id: 'widebody',
    name: 'Widebody Kit',
    description: 'Aggressive widebody fenders and bumpers',
    price: 125000,
    discount: 10,
    stock: 'limited' as const,
    installTime: '16-20 hrs'
  },
  {
    id: 'carbon',
    name: 'Full Carbon Fiber',
    description: 'Complete carbon fiber body panels for maximum weight reduction',
    price: 220000,
    stock: 'limited' as const,
    installTime: '20+ hrs'
  }
];

// Example spoiler options
const spoilerOptions: CustomizationItem[] = [
  {
    id: 'none',
    name: 'No Spoiler',
    description: 'Clean look without a rear spoiler',
    price: 0,
    stock: 'in-stock' as const,
    installTime: '0 hrs'
  },
  {
    id: 'lip',
    name: 'Lip Spoiler',
    description: 'Subtle trunk lip spoiler for a sleek look',
    price: 12000,
    popular: true,
    stock: 'in-stock' as const,
    installTime: '1-2 hrs'
  },
  {
    id: 'mid',
    name: 'Mid-Rise Wing',
    description: 'Balanced mid-height wing for style and function',
    price: 28000,
    stock: 'in-stock' as const,
    rating: 4.6,
    installTime: '2-3 hrs'
  },
  {
    id: 'performance',
    name: 'Performance Wing',
    description: 'Adjustable high-performance wing for maximum downforce',
    price: 45000,
    recommended: true,
    stock: 'in-stock' as const,
    installTime: '3-4 hrs',
    discount: 5
  }
];

// Exterior submenu items
const exteriorCategoryItems = [
  { id: 'body-kits', label: 'Body Kits', icon: Car },
  { id: 'spoilers', label: 'Spoilers', icon: Component },
  { id: 'paint-wraps', label: 'Paint & Wraps', icon: Paintbrush },
  { id: 'lighting', label: 'Lighting', icon: Lightbulb },
];

// Vehicle Categories
// Define types
type CustomizationCategory = 'exterior' | 'interior' | 'performance' | 'wheels-tires' | 'visualization';

interface CustomizationItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: 'in-stock' | 'limited' | 'out-of-stock';
  installTime: string;
  discount?: number;
  popular?: boolean;
  rating?: number;
  recommended?: boolean;
}

interface CustomizationProject {
  id: number;
  name: string;
  description?: string | null;
  vehicleId: number;
  customizations?: Record<string, any>;
  status?: string;
  updatedAt?: string;
  visibility?: string | null;
  userId?: number;
}

// Moved to @/components/arena/CartPanel.tsx

// Enhanced Arena Studio Page
const Arena: React.FC = () => {
  // Location and navigation hooks
  const [, setLocation] = useLocation();
  
  // State for navigation and selections
  const [activeTab, setActiveTab] = useState('vehicle-selection');
  const [selectedVehicle, setSelectedVehicle] = useState<null | typeof vehicleModels[0]>(null);
  const [mainCategory, setMainCategory] = useState<CustomizationCategory>('exterior');
  const [exteriorSubcategory, setExteriorSubcategory] = useState('body-kits');
  const [selectedBodyKit, setSelectedBodyKit] = useState('stock');
  const [selectedSpoiler, setSelectedSpoiler] = useState('none');
  const [vehicleColor, setVehicleColor] = useState('#1E40AF');
  const [colorFinish, setColorFinish] = useState<'gloss' | 'matte' | 'metallic' | 'pearlescent' | 'satin'>('gloss');
  const [cartItems, setCartItems] = useState<CartPanelItem[]>([]);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [isUpperTabsSticky, setIsUpperTabsSticky] = useState(false);
  
  // Project related state
  const [projectId, setProjectId] = useState<number | undefined>(undefined);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const { toast } = useToast();

  // Effect to handle scroll and make upper tabs sticky
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsUpperTabsSticky(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    
    // Add body kit price
    const bodyKit = bodyKitOptions.find(option => option.id === selectedBodyKit);
    if (bodyKit && bodyKit.id !== 'stock') {
      if (bodyKit.discount) {
        total += bodyKit.price - (bodyKit.price * bodyKit.discount / 100);
      } else {
        total += bodyKit.price;
      }
    }
    
    // Add spoiler price
    const spoiler = spoilerOptions.find(option => option.id === selectedSpoiler);
    if (spoiler && spoiler.id !== 'none') {
      if (spoiler.discount) {
        total += spoiler.price - (spoiler.price * spoiler.discount / 100);
      } else {
        total += spoiler.price;
      }
    }
    
    // Add premium finish cost if applicable
    if (colorFinish !== 'gloss') {
      total += 25000; // Premium finish cost
    }
    
    // Add cart items
    total += cartItems.reduce((sum, item) => sum + item.price, 0);
    
    return total;
  };
  
  // formatPrice is imported at the top of the file
  
  // Function to handle vehicle selection
  const handleSelectVehicle = (vehicle: typeof vehicleModels[0]) => {
    setSelectedVehicle(vehicle);
    setActiveTab('customization');
  };
  
  // Function to handle customization category change
  const handleCategoryChange = (category: CustomizationCategory) => {
    setMainCategory(category);
    
    // Reset subcategory when changing main category
    if (category === 'exterior') {
      setExteriorSubcategory('body-kits');
    }
  };
  
  // Function to handle exterior subcategory change
  const handleExteriorSubcategoryChange = (subcategory: string) => {
    setExteriorSubcategory(subcategory);
  };
  
  // Function to handle color selection
  const handleColorSelection = (color: string, finish?: 'gloss' | 'matte' | 'metallic' | 'pearlescent' | 'satin') => {
    setVehicleColor(color);
    if (finish) {
      setColorFinish(finish);
    }
  };
  
  // Function to add item to cart
  const handleAddToCart = (item: CartPanelItem) => {
    // Check if the item is already in the cart
    if (!cartItems.some(cartItem => cartItem.id === item.id)) {
      setCartItems([...cartItems, item]);
    }
  };
  
  // Function to remove item from cart
  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  // Function to toggle like status
  const handleToggleLike = (id: string) => {
    if (likedItems.includes(id)) {
      setLikedItems(likedItems.filter(item => item !== id));
    } else {
      setLikedItems([...likedItems, id]);
    }
  };
  
  // Function to handle checkout
  const handleCheckout = () => {
    setActiveTab('summary');
  };
  
  // Function to reset selections and go back to vehicle selection
  const handleReset = () => {
    setSelectedVehicle(null);
    setActiveTab('vehicle-selection');
    setMainCategory('exterior');
    setExteriorSubcategory('body-kits');
    setSelectedBodyKit('stock');
    setSelectedSpoiler('none');
    setVehicleColor('#1E40AF');
    setColorFinish('gloss');
    setCartItems([]);
    setLikedItems([]);
  };
  
  // Function to add body kit to cart
  const handleAddBodyKitToCart = () => {
    if (selectedBodyKit !== 'stock') {
      const bodyKit = bodyKitOptions.find(option => option.id === selectedBodyKit);
      if (bodyKit) {
        handleAddToCart({
          id: `bodykit-${bodyKit.id}`,
          name: bodyKit.name,
          price: bodyKit.discount 
            ? bodyKit.price - (bodyKit.price * bodyKit.discount / 100) 
            : bodyKit.price,
          category: 'Body Kit'
        });
      }
    }
  };
  
  // Function to add spoiler to cart
  const handleAddSpoilerToCart = () => {
    if (selectedSpoiler !== 'none') {
      const spoiler = spoilerOptions.find(option => option.id === selectedSpoiler);
      if (spoiler) {
        handleAddToCart({
          id: `spoiler-${spoiler.id}`,
          name: spoiler.name,
          price: spoiler.discount 
            ? spoiler.price - (spoiler.price * spoiler.discount / 100) 
            : spoiler.price,
          category: 'Spoiler'
        });
      }
    }
  };
  
  // Get customization projects for the user
  const { data: projectsData } = useQuery({
    queryKey: ['/api/customization-projects'],
    queryFn: async () => {
      const res = await fetch('/api/customization-projects');
      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }
      return res.json();
    },
    enabled: true, // Only fetch when component mounts
  });
  
  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (projectData: { 
      name: string; 
      description: string; 
      vehicleId: number;
      customizations: any;
    }) => {
      const res = await apiRequest('POST', '/api/customization-projects', projectData);
      return res.json();
    },
    onSuccess: (data) => {
      setProjectId(data.id);
      toast({
        title: 'Project Saved',
        description: 'Your customization project has been saved successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/customization-projects'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Saving Project',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (projectData: { 
      id: number;
      name: string; 
      description: string; 
      customizations: any;
    }) => {
      const res = await apiRequest('PUT', `/api/customization-projects/${projectData.id}`, {
        name: projectData.name,
        description: projectData.description,
        customizations: projectData.customizations
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Project Updated',
        description: 'Your customization project has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/customization-projects'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Updating Project',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Handle save project
  const handleSaveProject = (name: string, description: string) => {
    if (!selectedVehicle) {
      toast({
        title: 'No Vehicle Selected',
        description: 'Please select a vehicle before saving your project.',
        variant: 'destructive',
      });
      return;
    }
    
    const customizations = {
      vehicleColor,
      colorFinish,
      selectedBodyKit,
      selectedSpoiler,
      cartItems,
      mainCategory,
      exteriorSubcategory,
    };
    
    if (projectId) {
      // Update existing project
      updateProjectMutation.mutate({
        id: projectId,
        name,
        description,
        customizations
      });
    } else {
      // Create new project
      saveProjectMutation.mutate({
        name,
        description,
        vehicleId: selectedVehicle.id,
        customizations
      });
    }
  };
  
  // Handle resume project
  const handleResumeProject = (project: CustomizationProject) => {
    setProjectId(project.id);
    setProjectName(project.name);
    setProjectDesc(project.description || '');
    
    // Find the vehicle by ID
    const vehicle = vehicleModels.find(v => v.id === project.vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
    }
    
    // Restore customizations if available
    if (project.customizations) {
      const customizations = project.customizations;
      
      if (customizations.vehicleColor) {
        setVehicleColor(customizations.vehicleColor);
      }
      
      if (customizations.colorFinish) {
        setColorFinish(customizations.colorFinish);
      }
      
      if (customizations.selectedBodyKit) {
        setSelectedBodyKit(customizations.selectedBodyKit);
      }
      
      if (customizations.selectedSpoiler) {
        setSelectedSpoiler(customizations.selectedSpoiler);
      }
      
      if (customizations.cartItems) {
        setCartItems(customizations.cartItems);
      }
      
      if (customizations.mainCategory) {
        setMainCategory(customizations.mainCategory);
      }
      
      if (customizations.exteriorSubcategory) {
        setExteriorSubcategory(customizations.exteriorSubcategory);
      }
    }
    
    // Navigate to customization tab
    setActiveTab('customization');
    
    toast({
      title: 'Project Loaded',
      description: 'Your customization project has been loaded successfully.',
    });
  };
  
  return (
    <ArenaWrapper>
      <div className="container max-w-7xl mx-auto py-6 px-4">
        {/* Page header */}
        <motion.div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Arena Studio</h1>
            <p className="text-muted-foreground mt-1">
              Transform your vehicle with advanced customization tools
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleReset}>New Project</Button>
            <Button variant="outline" onClick={() => setLocation("/arena-studio/premium")}>
              <Sparkles className="h-4 w-4 mr-2" />
              Premium Studio
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <ProjectControls
              onSave={() => {
                const projectNameVal = (typeof projectName === 'string' ? projectName : '') || 'My Custom Project';
                const projectDescVal = (typeof projectDesc === 'string' ? projectDesc : '') || 'Personal customization project';
                handleSaveProject(projectNameVal, projectDescVal);
              }}
              onShare={() => {
                toast({
                  title: 'Share Feature',
                  description: 'Share functionality will be implemented soon.',
                });
              }}
              onExport={() => {
                toast({
                  title: 'Export Feature',
                  description: 'Export functionality will be implemented soon.',
                });
              }}
              totalPrice={calculateTotal()}
            />
          </div>
        </motion.div>
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className={`sticky ${isUpperTabsSticky ? 'top-0' : 'top-0'} z-20 bg-background py-2 border-b mb-6 -mx-4 px-4`}>
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
              <TabsTrigger value="vehicle-selection" disabled={activeTab !== 'vehicle-selection' && !selectedVehicle}>
                <Car className="h-4 w-4 mr-2" />
                Vehicle
              </TabsTrigger>
              <TabsTrigger value="customization" disabled={!selectedVehicle}>
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </TabsTrigger>
              <TabsTrigger value="performance" disabled={!selectedVehicle}>
                <Gauge className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="summary" disabled={!selectedVehicle}>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Summary
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Vehicle Selection Tab */}
          <TabsContent value="vehicle-selection">
            {/* Hero section */}
            <motion.div 
              className="relative rounded-lg overflow-hidden mb-12 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
              <div className="absolute h-full w-full bg-gradient-to-r from-blue-500/20 via-purple-500/5 to-transparent"></div>
              
              <div className="relative px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between">
                <div className="md:max-w-md z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                      Your Dream Vehicle <br/>
                      <span className="text-blue-200">Begins Here</span>
                    </h2>
                    <p className="text-blue-100 mb-6">
                      Choose your vehicle below and transform it with our advanced customization tools.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Badge className="bg-blue-700/40 hover:bg-blue-700/60 text-blue-100 border-blue-500/20 px-3 py-1 flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Premium Customization
                      </Badge>
                      <Badge className="bg-purple-700/40 hover:bg-purple-700/60 text-purple-100 border-purple-500/20 px-3 py-1 flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        Performance Tuning
                      </Badge>
                      <Badge className="bg-indigo-700/40 hover:bg-indigo-700/60 text-indigo-100 border-indigo-500/20 px-3 py-1 flex items-center">
                        <AreaChart className="h-3 w-3 mr-1" />
                        Real-time Preview
                      </Badge>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="relative mt-8 md:mt-0 z-10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="text-[180px] md:text-[220px] leading-none filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)]">🏎️</div>
                  <div className="absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-t from-blue-900 to-transparent"></div>
                </motion.div>
                
                {/* Animated elements */}
                <motion.div
                  className="absolute top-8 right-8 text-white/20 text-6xl"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 4, 
                    ease: "easeInOut" 
                  }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute bottom-12 left-12 text-white/20 text-4xl"
                  animate={{ 
                    y: [0, 8, 0],
                    opacity: [0.1, 0.15, 0.1],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  🛠️
                </motion.div>
              </div>
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Car className="h-5 w-5 mr-2 text-blue-600" />
              Select Your Vehicle
            </h3>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.5,
                staggerChildren: 0.1
              }}
            >
              {vehicleModels.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.3
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card className="cursor-pointer hover:border-primary hover:shadow-md transition-all h-full flex flex-col overflow-hidden">
                    <div className="absolute right-3 top-3 z-10">
                      <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border-blue-200">
                        {vehicle.type}
                      </Badge>
                    </div>
                    
                    <div className="pt-6 px-6 bg-gradient-to-b from-slate-50 to-white relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full absolute left-2 top-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLike(`vehicle-${vehicle.id}`);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${
                          likedItems.includes(`vehicle-${vehicle.id}`) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-muted-foreground'
                        }`} />
                      </Button>
                      
                      <motion.div 
                        className="flex items-center justify-center py-8"
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-8xl filter drop-shadow-md">
                          {vehicle.thumbnail}
                        </div>
                      </motion.div>
                    </div>
                    
                    <CardContent className="pt-4">
                      <h4 className="text-xl font-bold">{vehicle.name}</h4>
                      <p className="text-muted-foreground">{vehicle.brand}</p>
                      
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-md">
                          <Gauge className="h-4 w-4 mb-1 text-blue-500" />
                          <span>Performance</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-md">
                          <PaintBucket className="h-4 w-4 mb-1 text-blue-500" />
                          <span>12 Colors</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-md">
                          <Component className="h-4 w-4 mb-1 text-blue-500" />
                          <span>25+ Parts</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t mt-auto pt-4 flex gap-2">
                      <Button 
                        variant="outline"
                        size="icon"
                        className="flex-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          const price = vehicle.id * 1000000; // Example price based on ID
                          handleAddToCart({
                            id: `vehicle-${vehicle.id}`,
                            name: `${vehicle.brand} ${vehicle.name}`,
                            price: price,
                            category: 'Vehicle'
                          });
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        onClick={() => handleSelectVehicle(vehicle)}
                      >
                        Select Vehicle
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Additional Features Section */}
            <div className="mt-16 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-center">Premium Features</h3>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Card className="border-blue-100 bg-gradient-to-b from-white to-blue-50">
                  <CardHeader>
                    <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-2">
                      <PanelLeft className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle>Drag & Drop Editor</CardTitle>
                    <CardDescription>
                      Intuitive interface for positioning and adjusting vehicle parts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Our advanced editor allows you to precisely position, scale, and rotate components in real-time.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-indigo-100 bg-gradient-to-b from-white to-indigo-50">
                  <CardHeader>
                    <div className="rounded-full w-12 h-12 bg-indigo-100 flex items-center justify-center mb-2">
                      <Activity className="h-6 w-6 text-indigo-600" />
                    </div>
                    <CardTitle>3D Visualization</CardTitle>
                    <CardDescription>
                      Interactive 3D models with realistic lighting and animations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Experience your vehicle in full 3D with controls for lighting, environment, and camera animations.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-purple-100 bg-gradient-to-b from-white to-purple-50">
                  <CardHeader>
                    <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-2">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle>Smart Recommendations</CardTitle>
                    <CardDescription>
                      Personalized vehicle and part suggestions based on your preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Our recommendation engine analyzes your style and needs to suggest perfect matches.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
          
          {/* Customization Tab */}
          <TabsContent value="customization">
            {selectedVehicle && (
              <div>
                <div className="bg-muted p-4 rounded-md mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold flex items-center">
                      <span className="text-2xl mr-2">{selectedVehicle.thumbnail}</span>
                      {selectedVehicle.name}
                    </h2>
                    <p className="text-muted-foreground">{selectedVehicle.brand} {selectedVehicle.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-muted border-none">
                      <DollarSign className="h-3.5 w-3.5 mr-1" />
                      {formatPrice(getTotalPrice())}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      Change Vehicle
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Sidebar */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Preview card */}
                    <PreviewCard
                      vehicleName={selectedVehicle.name}
                      vehicleBrand={selectedVehicle.brand}
                      vehicleType={selectedVehicle.type}
                      vehicleEmoji={selectedVehicle.thumbnail}
                      vehicleColor={vehicleColor}
                      onShare={() => {}}
                    />
                    
                    {/* Categories */}
                    <div className="sticky top-24 space-y-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Customization Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="space-y-1">
                            <Button 
                              variant={mainCategory === 'exterior' ? 'default' : 'ghost'}
                              className="w-full justify-start"
                              onClick={() => handleCategoryChange('exterior')}
                            >
                              <PaintBucket className="h-4 w-4 mr-2" />
                              Exterior
                            </Button>
                            <Button 
                              variant={mainCategory === 'interior' ? 'default' : 'ghost'}
                              className="w-full justify-start"
                              onClick={() => handleCategoryChange('interior')}
                            >
                              <Sofa className="h-4 w-4 mr-2" />
                              Interior
                            </Button>
                            <Button 
                              variant={mainCategory === 'performance' ? 'default' : 'ghost'}
                              className="w-full justify-start"
                              onClick={() => handleCategoryChange('performance')}
                            >
                              <Activity className="h-4 w-4 mr-2" />
                              Performance
                            </Button>
                            <Button 
                              variant={mainCategory === 'wheels-tires' ? 'default' : 'ghost'}
                              className="w-full justify-start"
                              onClick={() => handleCategoryChange('wheels-tires')}
                            >
                              <CircleDot className="h-4 w-4 mr-2" />
                              Wheels & Tires
                            </Button>
                            <Button 
                              variant={mainCategory === 'visualization' ? 'default' : 'ghost'}
                              className="w-full justify-start"
                              onClick={() => handleCategoryChange('visualization')}
                            >
                              <StopCircle className="h-4 w-4 mr-2" />
                              Visualization
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Exterior subcategories */}
                      {mainCategory === 'exterior' && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Exterior Customizations</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="space-y-1">
                              {exteriorCategoryItems.map((item) => (
                                <Button 
                                  key={item.id}
                                  variant={exteriorSubcategory === item.id ? 'default' : 'ghost'}
                                  className="w-full justify-start"
                                  onClick={() => handleExteriorSubcategoryChange(item.id)}
                                >
                                  <item.icon className="h-4 w-4 mr-2" />
                                  {item.label}
                                </Button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Cart panel */}
                      <CartPanel 
                        items={cartItems}
                        onRemoveItem={handleRemoveFromCart}
                        onCheckout={handleCheckout}
                        likedItems={likedItems}
                        onToggleLike={handleToggleLike}
                      />
                    </div>
                  </div>
                  
                  {/* Customization Options */}
                  <div className="lg:col-span-9">
                    <Card>
                      <CardHeader className="border-b">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <CardTitle>
                              {mainCategory === 'exterior' && (
                                <>
                                  {exteriorSubcategory === 'body-kits' && 'Body Kits'}
                                  {exteriorSubcategory === 'spoilers' && 'Spoilers'}
                                  {exteriorSubcategory === 'paint-wraps' && 'Paint & Wraps'}
                                  {exteriorSubcategory === 'lighting' && 'Lighting Customization'}
                                </>
                              )}
                              {mainCategory === 'interior' && 'Interior Customization'}
                              {mainCategory === 'performance' && 'Performance Components'}
                              {mainCategory === 'wheels-tires' && 'Wheel & Tire Customization'}
                              {mainCategory === 'visualization' && 'Visualization Options'}
                            </CardTitle>
                            <CardDescription>
                              {mainCategory === 'exterior' && (
                                <>
                                  {exteriorSubcategory === 'body-kits' && 'Customize the look of your vehicle with body kits'}
                                  {exteriorSubcategory === 'spoilers' && 'Add a spoiler to enhance style and aerodynamics'}
                                  {exteriorSubcategory === 'paint-wraps' && 'Choose from premium paints and custom wraps'}
                                  {exteriorSubcategory === 'lighting' && 'Upgrade your vehicle lighting for style and visibility'}
                                </>
                              )}
                              {mainCategory === 'interior' && 'Customize your vehicle\'s interior space'}
                              {mainCategory === 'performance' && 'Upgrade performance components'}
                              {mainCategory === 'wheels-tires' && 'Select wheels and tires to match your style'}
                              {mainCategory === 'visualization' && 'Choose how to view your customized vehicle'}
                            </CardDescription>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {(mainCategory === 'exterior' && exteriorSubcategory === 'body-kits' && selectedBodyKit !== 'stock') && (
                              <Button variant="outline" size="sm" onClick={handleAddBodyKitToCart}>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            )}
                            {(mainCategory === 'exterior' && exteriorSubcategory === 'spoilers' && selectedSpoiler !== 'none') && (
                              <Button variant="outline" size="sm" onClick={handleAddSpoilerToCart}>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4 mr-2" />
                              Save Options
                            </Button>
                            <Button size="sm" onClick={() => setActiveTab('summary')}>
                              Continue
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-6">
                        {/* Exterior - Body Kits */}
                        {mainCategory === 'exterior' && exteriorSubcategory === 'body-kits' && (
                          <div className="space-y-8">
                            <CustomizationPackage 
                              title="Body Kits"
                              options={bodyKitOptions}
                              selectedOption={selectedBodyKit}
                              onSelectOption={setSelectedBodyKit}
                            />
                            
                            {selectedBodyKit !== 'stock' && (
                              <div className="p-4 bg-muted/50 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                  <h3 className="font-medium">Selected: {bodyKitOptions.find(o => o.id === selectedBodyKit)?.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Price: {formatPrice(bodyKitOptions.find(o => o.id === selectedBodyKit)?.price || 0)}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleToggleLike(`bodykit-${selectedBodyKit}`)}
                                  >
                                    <Heart className={`h-4 w-4 mr-2 ${
                                      likedItems.includes(`bodykit-${selectedBodyKit}`) 
                                        ? 'fill-red-500 text-red-500' 
                                        : ''
                                    }`} />
                                    {likedItems.includes(`bodykit-${selectedBodyKit}`) ? 'Liked' : 'Like'}
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={handleAddBodyKitToCart}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add to Cart
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Exterior - Spoilers */}
                        {mainCategory === 'exterior' && exteriorSubcategory === 'spoilers' && (
                          <div className="space-y-8">
                            <CustomizationPackage 
                              title="Spoilers"
                              options={spoilerOptions}
                              selectedOption={selectedSpoiler}
                              onSelectOption={setSelectedSpoiler}
                            />
                            
                            {selectedSpoiler !== 'none' && (
                              <div className="p-4 bg-muted/50 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                  <h3 className="font-medium">Selected: {spoilerOptions.find(o => o.id === selectedSpoiler)?.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Price: {formatPrice(spoilerOptions.find(o => o.id === selectedSpoiler)?.price || 0)}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleToggleLike(`spoiler-${selectedSpoiler}`)}
                                  >
                                    <Heart className={`h-4 w-4 mr-2 ${
                                      likedItems.includes(`spoiler-${selectedSpoiler}`) 
                                        ? 'fill-red-500 text-red-500' 
                                        : ''
                                    }`} />
                                    {likedItems.includes(`spoiler-${selectedSpoiler}`) ? 'Liked' : 'Like'}
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={handleAddSpoilerToCart}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add to Cart
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Exterior - Paint & Wraps */}
                        {mainCategory === 'exterior' && exteriorSubcategory === 'paint-wraps' && (
                          <div className="space-y-8">
                            <div>
                              <h3 className="text-lg font-medium mb-4">Paint Options</h3>
                              <EnhancedColorSelector 
                                onSelectColor={handleColorSelection}
                                defaultColor={vehicleColor}
                                defaultFinish={colorFinish}
                              />
                            </div>
                            
                            <div className="p-4 bg-muted/50 rounded-lg">
                              <h3 className="text-lg font-medium mb-2">Custom Vinyl Wraps</h3>
                              <p className="text-muted-foreground mb-4">
                                Upload your own design or choose from our premium wrap patterns 
                                for a unique look.
                              </p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <Paintbrush className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Upload Custom Design</span>
                                  <span className="text-xs text-muted-foreground mt-1">JPG, PNG formats</span>
                                </Button>
                                
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <Sparkles className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Premium Wrap Patterns</span>
                                  <span className="text-xs text-muted-foreground mt-1">100+ designs</span>
                                </Button>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            {/* Paint Cost Summary */}
                            <div className="bg-muted p-4 rounded-md">
                              <h3 className="font-medium text-lg mb-3">Paint Selection</h3>
                              
                              <div className="flex items-center gap-3 mb-3">
                                <div 
                                  className="w-8 h-8 rounded-full border"
                                  style={{ backgroundColor: vehicleColor }}
                                ></div>
                                <div>
                                  <div className="font-medium">Custom Color</div>
                                  <div className="text-sm text-muted-foreground capitalize">{colorFinish} Finish</div>
                                </div>
                              </div>
                              
                              {colorFinish !== 'gloss' && (
                                <div className="flex justify-between text-sm mb-2">
                                  <span>Premium {colorFinish} Paint Finish</span>
                                  <span>₹25,000</span>
                                </div>
                              )}
                              
                              <div className="flex gap-2 mt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleToggleLike(`paint-${vehicleColor}-${colorFinish}`)}
                                >
                                  <Heart className={`h-4 w-4 mr-2 ${
                                    likedItems.includes(`paint-${vehicleColor}-${colorFinish}`) 
                                      ? 'fill-red-500 text-red-500' 
                                      : ''
                                  }`} />
                                  {likedItems.includes(`paint-${vehicleColor}-${colorFinish}`) ? 'Liked' : 'Like'}
                                </Button>
                                
                                {colorFinish !== 'gloss' && (
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => handleAddToCart({
                                      id: `paint-${vehicleColor}-${colorFinish}`,
                                      name: `Premium ${colorFinish} Paint`,
                                      price: 25000,
                                      category: 'Paint'
                                    })}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add to Cart
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Exterior - Lighting */}
                        {mainCategory === 'exterior' && exteriorSubcategory === 'lighting' && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium mb-2">Headlight Options</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <Lightbulb className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Standard Halogen</span>
                                  <span className="text-xs text-muted-foreground mt-1">₹0</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <Lightbulb className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Premium LED</span>
                                  <span className="text-xs text-muted-foreground mt-1">₹25,000</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <Lightbulb className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Adaptive Matrix</span>
                                  <span className="text-xs text-muted-foreground mt-1">₹45,000</span>
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Taillight Options</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">💡</span>
                                  Standard
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">💡</span>
                                  LED Lights
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">💡</span>
                                  Sequential
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Ambient Lighting</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">💡</span>
                                  None
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">💡</span>
                                  RGB Underglow
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">💡</span>
                                  Full Ambient Kit
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Interior Customization */}
                        {mainCategory === 'interior' && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium mb-2">Seat Options</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <Sofa className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Comfort Seats</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <Sofa className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Sport Seats</span>
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Dashboard Style</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🔳</span>
                                  Standard
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🔳</span>
                                  Carbon Fiber
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🔳</span>
                                  Wood Trim
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Performance Customization */}
                        {mainCategory === 'performance' && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium mb-2">Engine Modifications</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <Activity className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Standard Engine</span>
                                  <span className="text-xs text-muted-foreground mt-1">Stock Performance</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <Activity className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Turbo Engine</span>
                                  <span className="text-xs text-muted-foreground mt-1">+15% Performance</span>
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Exhaust Systems</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🔊</span>
                                  Standard
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🔊</span>
                                  Sport
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🔊</span>
                                  Performance
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Wheels & Tires Customization */}
                        {mainCategory === 'wheels-tires' && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium mb-2">Rim Selection</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <CircleDot className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Standard Alloy</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <CircleDot className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Sport Alloy</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                                  <div className="bg-muted rounded-lg p-4 mb-2">
                                    <CircleDot className="h-10 w-10 text-primary" />
                                  </div>
                                  <span>Premium Alloy</span>
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Tire Options</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🛞</span>
                                  All-Season
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🛞</span>
                                  Performance
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🛞</span>
                                  All-Terrain
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Visualization Options */}
                        {mainCategory === 'visualization' && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium mb-2">Environment Settings</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🏙️</span>
                                  Showroom
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🌆</span>
                                  Urban
                                </Button>
                                <Button variant="outline" className="justify-start">
                                  <span className="bg-muted p-2 rounded mr-2">🛣️</span>
                                  Highway
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Visualization Coming Soon</h3>
                              <p className="text-muted-foreground">
                                Our 3D visualization engine is being upgraded to provide 
                                photorealistic rendering, ray-tracing, and interactive 360° views.
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="flex justify-between border-t pt-6">
                        <Button variant="outline" onClick={handleReset}>
                          Cancel
                        </Button>
                        <Button onClick={() => setActiveTab('summary')}>
                          Continue to Summary
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance">
            {selectedVehicle && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Configuration</CardTitle>
                  <CardDescription>
                    Enhance your {selectedVehicle.name}'s performance with these upgrades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Activity className="h-16 w-16 text-muted-foreground" />
                    <h3 className="text-xl font-medium">Performance Module Coming Soon</h3>
                    <p className="text-center text-muted-foreground max-w-md">
                      Our advanced performance customization module is currently being upgraded with
                      dyno simulations, power curves, and realistic performance metrics.
                    </p>
                    <Button className="mt-6" onClick={() => setActiveTab('summary')}>
                      Continue to Summary
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Summary Tab */}
          <TabsContent value="summary">
            {selectedVehicle && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customization Summary</CardTitle>
                    <CardDescription>
                      Review your customized {selectedVehicle.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-muted p-4 rounded-md">
                        <h3 className="font-medium">Vehicle Details</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Brand</div>
                            <div>{selectedVehicle.brand}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Model</div>
                            <div>{selectedVehicle.name}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Type</div>
                            <div>{selectedVehicle.type}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Year</div>
                            <div>2023</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-md">
                        <h3 className="font-medium">Exterior Customizations</h3>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Body Kit</span>
                            <span>{bodyKitOptions.find(o => o.id === selectedBodyKit)?.name || 'Standard'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Spoiler</span>
                            <span>{spoilerOptions.find(o => o.id === selectedSpoiler)?.name || 'None'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Paint</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: vehicleColor }}
                              ></div>
                              <span className="capitalize">{colorFinish}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {cartItems.length > 0 && (
                        <div className="bg-muted p-4 rounded-md">
                          <h3 className="font-medium">Cart Items</h3>
                          <div className="space-y-2 mt-2">
                            {cartItems.map((item) => (
                              <div key={item.id} className="flex justify-between">
                                <span className="text-sm">{item.name}</span>
                                <span>{formatPrice(item.price)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-muted p-4 rounded-md">
                        <h3 className="font-medium">Cost Breakdown</h3>
                        <div className="space-y-2 mt-2">
                          {selectedBodyKit !== 'stock' && (
                            <div className="flex justify-between">
                              <span className="text-sm">Body Kit: {bodyKitOptions.find(o => o.id === selectedBodyKit)?.name}</span>
                              <span>{formatPrice(bodyKitOptions.find(o => o.id === selectedBodyKit)?.price || 0)}</span>
                            </div>
                          )}
                          
                          {selectedSpoiler !== 'none' && (
                            <div className="flex justify-between">
                              <span className="text-sm">Spoiler: {spoilerOptions.find(o => o.id === selectedSpoiler)?.name}</span>
                              <span>{formatPrice(spoilerOptions.find(o => o.id === selectedSpoiler)?.price || 0)}</span>
                            </div>
                          )}
                          
                          {colorFinish !== 'gloss' && (
                            <div className="flex justify-between">
                              <span className="text-sm">Premium {colorFinish} Paint Finish</span>
                              <span>₹25,000</span>
                            </div>
                          )}
                          
                          {cartItems.length > 0 && (
                            <>
                              <Separator className="my-2" />
                              
                              {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                  <span className="text-sm">{item.name}</span>
                                  <span>{formatPrice(item.price)}</span>
                                </div>
                              ))}
                            </>
                          )}
                          
                          <Separator className="my-2" />
                          
                          <div className="flex justify-between font-bold">
                            <span>Total Customization Cost</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('customization')}>
                      Back to Customization
                    </Button>
                    <Button>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Finalize Design
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="space-y-6">
                  <PreviewCard
                    vehicleName={selectedVehicle.name}
                    vehicleBrand={selectedVehicle.brand}
                    vehicleType={selectedVehicle.type}
                    vehicleEmoji={selectedVehicle.thumbnail}
                    vehicleColor={vehicleColor}
                    onShare={() => {}}
                  />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Share Your Design</CardTitle>
                      <CardDescription>
                        Show off your custom creation with others
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Link
                          </Button>
                        </div>
                        
                        <div className="w-full bg-muted p-4 rounded-md text-center">
                          <p className="text-sm text-muted-foreground">Project ID</p>
                          <p className="font-mono">ARS-{selectedVehicle.id}-{Math.floor(Math.random() * 10000)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ArenaWrapper>
  );
};

export default Arena;