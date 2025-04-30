import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Car, 
  Wrench, 
  PaintBucket, 
  Palette, 
  Gauge, 
  Share2, 
  Zap, 
  Award, 
  Plus, 
  UserPlus, 
  Save,
  ChevronRight,
  Sparkles,
  Image,
  RotateCw,
  Download
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Arena Components
import Vehicle3DViewer from '@/components/arena/3d-viewer/Vehicle3DViewer';
import ArenaVehicleSelector from '@/components/arena/ArenaVehicleSelector';
import CustomizationPanel from '@/components/arena/CustomizationPanel';
import EnvironmentSelector from '@/components/arena/EnvironmentSelector';
import AchievementSystem from '@/components/arena/AchievementSystem';
import NewProjectModal from '@/components/arena/NewProjectModal';
import VehicleSpecifications from '@/components/arena/VehicleSpecifications';
import SaveProjectPanel from '@/components/arena/SaveProjectPanel';
import ColorSelector from '@/components/arena/ColorSelector';

// Types
import { VehicleCategory } from '@shared/schema';

// Demo data for initial development
const demoVehicleCategories: VehicleCategory[] = [
  'two-wheeler',
  'three-wheeler',
  'four-wheeler',
  'heavy-vehicle'
];

const ArenaPage: React.FC = () => {
  const [, setLocation] = useLocation();
  
  // State for vehicle customization
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<VehicleCategory>('four-wheeler');
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [activeCustomizationTab, setActiveCustomizationTab] = useState<string>('exterior');
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [currentProjectName, setCurrentProjectName] = useState<string>('My Custom Vehicle');
  const [viewMode, setViewMode] = useState<'3d' | 'showcase'>('3d');
  const [cameraAngle, setCameraAngle] = useState<string>('front');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('showroom');
  const [userPoints, setUserPoints] = useState<number>(250);

  // Create new project
  const handleNewProject = () => {
    setShowNewProjectModal(true);
  };

  // Save current project
  const handleSaveProject = () => {
    // Implementation for saving project
    console.log('Saving project:', currentProjectName);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Arena header with points and actions */}
      <div className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/')}
            >
              <Car className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Arena
              </span> Studio
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 border border-amber-100 rounded-full px-4 py-1 flex items-center">
              <Sparkles className="h-4 w-4 text-amber-500 mr-2" />
              <span className="font-semibold text-amber-700">{userPoints} points</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveProject}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button
              size="sm"
              onClick={handleNewProject}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="container mx-auto flex flex-1 gap-6 py-6">
        {/* Left sidebar - Vehicle selector & options */}
        <div className="w-64 shrink-0">
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle>Vehicle Type</CardTitle>
              <CardDescription>Select vehicle category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {demoVehicleCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedVehicleCategory === category ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setSelectedVehicleCategory(category)}
                  >
                    <Car className="h-4 w-4 mr-2" />
                    {category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <ArenaVehicleSelector
            category={selectedVehicleCategory}
            onSelectVehicle={(id) => setSelectedVehicleId(id)}
            selectedVehicleId={selectedVehicleId}
          />
          
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle>Environment</CardTitle>
              <CardDescription>Background setting</CardDescription>
            </CardHeader>
            <CardContent>
              <EnvironmentSelector
                selectedEnvironment={selectedEnvironment}
                onSelectEnvironment={setSelectedEnvironment}
              />
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle>Project</CardTitle>
              <CardDescription>Save or share your work</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <SaveProjectPanel
                projectName={currentProjectName}
                onChangeProjectName={setCurrentProjectName}
                onSave={handleSaveProject}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Center - Main 3D viewer */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 mb-4">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle>{currentProjectName}</CardTitle>
                <CardDescription>360° interactive vehicle designer</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCameraAngle('front')}>
                  Front
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCameraAngle('side')}>
                  Side
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCameraAngle('rear')}>
                  Rear
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCameraAngle('top')}>
                  Top
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCameraAngle('orbit')}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 min-h-[500px] relative">
              <Vehicle3DViewer
                vehicleId={selectedVehicleId}
                environment={selectedEnvironment}
                cameraAngle={cameraAngle}
                className="w-full h-full"
              />
            </CardContent>
          </Card>
          
          {/* Vehicle Specifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Specifications</CardTitle>
              <CardDescription>Technical details and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <VehicleSpecifications vehicleId={selectedVehicleId} />
            </CardContent>
          </Card>
        </div>
        
        {/* Right sidebar - Customization options */}
        <div className="w-80 shrink-0">
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle>Customization</CardTitle>
              <CardDescription>Modify your vehicle design</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="exterior" onValueChange={setActiveCustomizationTab}>
                <TabsList className="grid grid-cols-5 h-auto p-0">
                  <TabsTrigger value="exterior" className="h-10 rounded-none rounded-tl-md data-[state=active]:bg-slate-50">
                    <PaintBucket className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="interior" className="h-10 rounded-none data-[state=active]:bg-slate-50">
                    <Palette className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="h-10 rounded-none data-[state=active]:bg-slate-50">
                    <Gauge className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="wheels" className="h-10 rounded-none data-[state=active]:bg-slate-50">
                    <RotateCw className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="wraps" className="h-10 rounded-none rounded-tr-md data-[state=active]:bg-slate-50">
                    <Image className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="exterior" className="p-4 border-t-0 border-slate-200 bg-slate-50">
                  <ScrollArea className="h-[450px] pr-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Paint Color</h4>
                        <ColorSelector />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Body Kits</h4>
                        <CustomizationPanel
                          category="exterior"
                          subcategory="body-kits"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Spoilers</h4>
                        <CustomizationPanel
                          category="exterior"
                          subcategory="spoilers"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Headlights</h4>
                        <CustomizationPanel
                          category="exterior"
                          subcategory="headlights"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="interior" className="p-4 border-t-0 border-slate-200 bg-slate-50">
                  <ScrollArea className="h-[450px] pr-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Seat Material</h4>
                        <CustomizationPanel
                          category="interior"
                          subcategory="seats"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Dashboard</h4>
                        <CustomizationPanel
                          category="interior"
                          subcategory="dashboard"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Steering Wheel</h4>
                        <CustomizationPanel
                          category="interior"
                          subcategory="steering"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="performance" className="p-4 border-t-0 border-slate-200 bg-slate-50">
                  <ScrollArea className="h-[450px] pr-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Engine</h4>
                        <CustomizationPanel
                          category="performance"
                          subcategory="engine"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Suspension</h4>
                        <CustomizationPanel
                          category="performance"
                          subcategory="suspension"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Exhaust</h4>
                        <CustomizationPanel
                          category="performance"
                          subcategory="exhaust"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="wheels" className="p-4 border-t-0 border-slate-200 bg-slate-50">
                  <ScrollArea className="h-[450px] pr-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Rim Style</h4>
                        <CustomizationPanel
                          category="wheels"
                          subcategory="rims"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Tire Type</h4>
                        <CustomizationPanel
                          category="wheels"
                          subcategory="tires"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Brake Calipers</h4>
                        <CustomizationPanel
                          category="wheels"
                          subcategory="brakes"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="wraps" className="p-4 border-t-0 border-slate-200 bg-slate-50">
                  <ScrollArea className="h-[450px] pr-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Custom Wraps</h4>
                        <div className="space-y-2">
                          <Button className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Upload Custom Wrap
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Upload your own design to apply as a vehicle wrap
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Preset Designs</h4>
                        <CustomizationPanel
                          category="wraps"
                          subcategory="presets"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Decals</h4>
                        <CustomizationPanel
                          category="wraps"
                          subcategory="decals"
                          vehicleId={selectedVehicleId}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <AchievementSystem userPoints={userPoints} />
        </div>
      </div>
      
      {/* New Project Modal */}
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onCreate={(name, vehicleType) => {
            setCurrentProjectName(name);
            setSelectedVehicleCategory(vehicleType as VehicleCategory);
            setShowNewProjectModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ArenaPage;