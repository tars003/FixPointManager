import React, { useState, useEffect } from 'react';
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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Layers, 
  PanelLeft, 
  Plus, 
  Save, 
  Share2, 
  ChevronDown, 
  Settings2, 
  Car,
  Award,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import Arena components
import Vehicle3DViewer from '@/components/arena/3d-viewer/Vehicle3DViewer';
import ArenaVehicleSelector from '@/components/arena/ArenaVehicleSelector';
import CustomizationPanel from '@/components/arena/CustomizationPanel';
import EnvironmentSelector from '@/components/arena/EnvironmentSelector';
import AchievementSystem from '@/components/arena/AchievementSystem';
import NewProjectModal from '@/components/arena/NewProjectModal';
import VehicleSpecifications from '@/components/arena/VehicleSpecifications';
import SaveProjectPanel from '@/components/arena/SaveProjectPanel';
import ColorSelector from '@/components/arena/ColorSelector';

export type CustomizationCategory = 'exterior' | 'interior' | 'performance' | 'wheels' | 'lighting';
export type CustomizationSubcategory = 
  // Exterior
  'body-kits' | 'spoilers' | 'hoods' | 'mirrors' | 'wraps' | 
  // Interior
  'seats' | 'dashboard' | 'steering' | 'trim' | 'audio' | 
  // Performance
  'engine' | 'suspension' | 'exhaust' | 'intake' | 'brakes' | 
  // Wheels
  'rims' | 'tires' | 'spacers' | 
  // Lighting
  'headlights' | 'taillights' | 'underglow' | 'interior-lighting';

// Type for customization data
type CustomizationMenuCategory = {
  id: CustomizationCategory;
  name: string;
  icon: React.FC<{ className?: string }>;
  subcategories: {
    id: CustomizationSubcategory;
    name: string;
  }[];
};

// Customization menu categories
const customizationMenu: CustomizationMenuCategory[] = [
  {
    id: 'exterior',
    name: 'Exterior',
    icon: Car,
    subcategories: [
      { id: 'body-kits', name: 'Body Kits' },
      { id: 'spoilers', name: 'Spoilers' },
      { id: 'hoods', name: 'Hoods' },
      { id: 'mirrors', name: 'Mirrors' },
      { id: 'wraps', name: 'Wraps' }
    ]
  },
  {
    id: 'interior',
    name: 'Interior',
    icon: Layers,
    subcategories: [
      { id: 'seats', name: 'Seats' },
      { id: 'dashboard', name: 'Dashboard' },
      { id: 'steering', name: 'Steering Wheel' },
      { id: 'trim', name: 'Trim' },
      { id: 'audio', name: 'Audio System' }
    ]
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: Zap,
    subcategories: [
      { id: 'engine', name: 'Engine' },
      { id: 'suspension', name: 'Suspension' },
      { id: 'exhaust', name: 'Exhaust' },
      { id: 'intake', name: 'Intake' },
      { id: 'brakes', name: 'Brakes' }
    ]
  },
  {
    id: 'wheels',
    name: 'Wheels',
    icon: Settings2,
    subcategories: [
      { id: 'rims', name: 'Rims' },
      { id: 'tires', name: 'Tires' },
      { id: 'spacers', name: 'Spacers' }
    ]
  },
  {
    id: 'lighting',
    name: 'Lighting',
    icon: Palette,
    subcategories: [
      { id: 'headlights', name: 'Headlights' },
      { id: 'taillights', name: 'Taillights' },
      { id: 'underglow', name: 'Underglow' },
      { id: 'interior-lighting', name: 'Interior Lighting' }
    ]
  }
];

// Arena Studio Page
const Arena: React.FC = () => {
  // State variables
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CustomizationCategory>('exterior');
  const [selectedSubcategory, setSelectedSubcategory] = useState<CustomizationSubcategory>('body-kits');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('showroom');
  const [vehicleColor, setVehicleColor] = useState<string>('#1E40AF');
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('My Custom Vehicle');
  const [userPoints, setUserPoints] = useState<number>(250);
  const [activeTab, setActiveTab] = useState<string>('vehicle');
  
  // Set default subcategory when category changes
  useEffect(() => {
    const category = customizationMenu.find(cat => cat.id === selectedCategory);
    if (category && category.subcategories.length > 0) {
      setSelectedSubcategory(category.subcategories[0].id);
    }
  }, [selectedCategory]);
  
  // Handle vehicle selection
  const handleSelectVehicle = (id: number) => {
    setSelectedVehicleId(id);
    // Award points for selecting a vehicle
    if (selectedVehicleId === null) {
      setUserPoints(prev => prev + 10);
    }
  };
  
  // Handle color selection
  const handleColorChange = (color: string, finish?: string) => {
    setVehicleColor(color);
    // Award points for changing color
    setUserPoints(prev => prev + 5);
  };
  
  // Handle new project creation
  const handleCreateProject = (name: string, vehicleType: VehicleCategory) => {
    setProjectName(name);
    setShowNewProjectModal(false);
    // Award points for creating a project
    setUserPoints(prev => prev + 25);
  };
  
  // Handle project save
  const handleSaveProject = () => {
    // In a real app, this would save to a database
    console.log('Saving project:', projectName);
    // Award points for saving project
    setUserPoints(prev => prev + 15);
  };
  
  // Handle subcategory selection
  const handleSelectSubcategory = (subcategory: CustomizationSubcategory) => {
    setSelectedSubcategory(subcategory);
  };
  
  // Find active subcategories based on selected category
  const activeSubcategories = 
    customizationMenu.find(cat => cat.id === selectedCategory)?.subcategories || [];
  
  return (
    <div className="container max-w-7xl mx-auto py-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Arena Studio</h1>
          <p className="text-muted-foreground mt-1">
            Transform your vehicle with advanced customization tools
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowNewProjectModal(true)}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Project</span>
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tabs for vehicle selection or achievement tracking */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="vehicle" className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                Vehicle
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                Achievements
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="vehicle" className="space-y-4 mt-0">
              <ArenaVehicleSelector
                onSelectVehicle={handleSelectVehicle}
                selectedVehicleId={selectedVehicleId}
              />
              
              {selectedVehicleId && (
                <VehicleSpecifications vehicleId={selectedVehicleId} />
              )}
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-0">
              <AchievementSystem userPoints={userPoints} />
            </TabsContent>
          </Tabs>
          
          {/* Save project panel */}
          <SaveProjectPanel 
            projectName={projectName}
            onChangeProjectName={setProjectName}
            onSave={handleSaveProject}
          />
        </div>
        
        {/* Main visualization and customization area */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3D Viewer */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Vehicle Preview</CardTitle>
              <CardDescription>
                Explore your vehicle in 3D
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Vehicle3DViewer 
                vehicleId={selectedVehicleId} 
                vehicleColor={vehicleColor}
                environmentPreset={selectedEnvironment}
              />
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <div className="w-full">
                <h4 className="text-sm font-medium mb-2">Environment</h4>
                <EnvironmentSelector 
                  selectedEnvironment={selectedEnvironment}
                  onSelectEnvironment={setSelectedEnvironment}
                />
              </div>
              
              <div className="w-full">
                <h4 className="text-sm font-medium mb-2">Body Color</h4>
                <ColorSelector
                  onSelectColor={(color) => handleColorChange(color)}
                  defaultColor={vehicleColor}
                />
              </div>
            </CardFooter>
          </Card>
          
          {/* Customization options */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Customization Options</CardTitle>
                
                <div className="flex items-center gap-2">
                  {/* Category dropdown for mobile */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1 lg:hidden"
                      >
                        Category
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {customizationMenu.map((category) => (
                        <DropdownMenuItem 
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className="flex items-center gap-2"
                        >
                          <category.icon className="h-4 w-4" />
                          {category.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {/* Subcategory dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        {activeSubcategories.find(sub => sub.id === selectedSubcategory)?.name || 'Options'}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {activeSubcategories.map((subcategory) => (
                        <DropdownMenuItem 
                          key={subcategory.id}
                          onClick={() => handleSelectSubcategory(subcategory.id)}
                        >
                          {subcategory.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Category tabs - desktop only */}
              <div className="hidden lg:flex mt-2 space-x-1">
                {customizationMenu.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                ))}
              </div>
              
              {/* Subcategory pills - desktop only */}
              <div className="hidden lg:flex flex-wrap gap-2 mt-3">
                {activeSubcategories.map((subcategory) => (
                  <Button
                    key={subcategory.id}
                    variant={selectedSubcategory === subcategory.id ? 'secondary' : 'outline'}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleSelectSubcategory(subcategory.id)}
                  >
                    {subcategory.name}
                  </Button>
                ))}
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="pt-4">
              {selectedVehicleId ? (
                <CustomizationPanel
                  category={selectedCategory}
                  subcategory={selectedSubcategory}
                  vehicleId={selectedVehicleId}
                />
              ) : (
                <div className="text-center py-12">
                  <PanelLeft className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-lg font-medium">Select a Vehicle</h3>
                  <p className="text-muted-foreground mt-1">
                    Choose a vehicle from the sidebar to start customizing
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* New project modal */}
      {showNewProjectModal && (
        <NewProjectModal 
          onClose={() => setShowNewProjectModal(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
};

export default Arena;