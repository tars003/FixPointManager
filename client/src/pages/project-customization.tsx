import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { ArrowLeft, ChevronRight, Settings, Lightbulb, Palette, Gauge, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Import our customization studios
import ExteriorFinishStudio from '@/components/arena/ExteriorFinishStudio';
import PerformanceEnhancementStudio from '@/components/arena/PerformanceEnhancementStudio';
import LightingCustomizationStudio from '@/components/arena/LightingCustomizationStudio';
import WheelCustomizationStudio from '@/components/arena/WheelCustomizationStudio';
import InteriorCustomizationStudio from '@/components/arena/InteriorCustomizationStudio';

// Type for demo project data
interface Project {
  id: number;
  name: string;
  description: string;
  vehicleId: number;
  thumbnail: string;
  customizations?: any[];
}

// Demo vehicle data
const demoVehicles = [
  {
    id: 1,
    make: 'Honda',
    model: 'City',
    year: 2022,
    type: 'sedan',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/41406/city-exterior-right-front-three-quarter-2.jpeg'
  },
  {
    id: 2,
    make: 'Hyundai',
    model: 'Verna',
    year: 2020,
    type: 'sedan',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141383/verna-exterior-right-front-three-quarter.jpeg'
  },
  {
    id: 3,
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2022,
    type: 'hatchback',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/swift-exterior-right-front-three-quarter-2.jpeg'
  }
];

// Demo projects data
const demoProjects: Project[] = [
  {
    id: 1,
    name: 'City Sport Edition',
    description: 'Racing inspired design with matte black wrap and red accents',
    vehicleId: 1,
    thumbnail: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a',
    customizations: []
  },
  {
    id: 2,
    name: 'Elegant White Verna',
    description: 'Minimalist design with premium wheels and subtle accents',
    vehicleId: 2,
    thumbnail: 'https://images.unsplash.com/photo-1566274360959-5b4411569afe',
    customizations: []
  },
  {
    id: 3,
    name: 'ABCD',
    description: 'Brand new project',
    vehicleId: 3,
    thumbnail: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/swift-exterior-right-front-three-quarter-2.jpeg',
    customizations: []
  }
];

const ProjectCustomization: React.FC = () => {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/project/:projectId/:studio?');
  
  const projectId = params?.projectId ? parseInt(params.projectId) : null;
  const initialStudio = params?.studio || 'overview';
  
  const [activeStudio, setActiveStudio] = useState<string>(initialStudio);
  const [project, setProject] = useState<Project | null>(null);
  const [vehicle, setVehicle] = useState<any | null>(null);
  const [customizationHistory, setCustomizationHistory] = useState<any[]>([]);
  
  // Load project data
  useEffect(() => {
    if (projectId) {
      const foundProject = demoProjects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        
        // Load associated vehicle
        const foundVehicle = demoVehicles.find(v => v.id === foundProject.vehicleId);
        if (foundVehicle) {
          setVehicle(foundVehicle);
        }
      }
    }
  }, [projectId]);
  
  // Handle navigation back to main arena
  const handleBackToArena = () => {
    setLocation('/arena-main');
  };
  
  // Handle saving customizations
  const handleSaveCustomization = (studioType: string, customizationData: any) => {
    const newCustomization = {
      id: Date.now(),
      type: studioType,
      data: customizationData,
      timestamp: new Date().toISOString()
    };
    
    setCustomizationHistory(prev => [newCustomization, ...prev]);
    
    // Navigate back to overview
    setActiveStudio('overview');
  };
  
  if (!project || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-card p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBackToArena}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{project.name}</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{vehicle.make} {vehicle.model} ({vehicle.year})</span>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span>Project #{project.id}</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleBackToArena}>
            Exit Studio
          </Button>
        </div>
      </header>
      
      {/* Main Content with Tabs */}
      <div className="flex-1 container mx-auto py-6">
        <Tabs value={activeStudio} onValueChange={setActiveStudio}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="exterior">Exterior Paint & Wrap</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="lighting">Lighting</TabsTrigger>
            <TabsTrigger value="wheels">Wheels & Suspension</TabsTrigger>
            <TabsTrigger value="interior">Interior</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle>Vehicle Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={project.thumbnail || vehicle.image} 
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                        <p>{project.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Vehicle</h3>
                        <p>{vehicle.make} {vehicle.model} {vehicle.year}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Customizations</h3>
                        <p>{customizationHistory.length > 0 ? `${customizationHistory.length} modifications` : 'No customizations yet'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle>Customization Studios</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveStudio('exterior')}
                      >
                        <Palette className="h-4 w-4" />
                        <span>Exterior Finish</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveStudio('performance')}
                      >
                        <Gauge className="h-4 w-4" />
                        <span>Performance Upgrades</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveStudio('lighting')}
                      >
                        <Lightbulb className="h-4 w-4" />
                        <span>Lighting Customization</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveStudio('wheels')}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Wheels & Suspension</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveStudio('interior')}
                      >
                        <Star className="h-4 w-4" />
                        <span>Interior Customization</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Customization History */}
            {customizationHistory.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Customization History</h2>
                <div className="space-y-4">
                  {customizationHistory.map((customization) => (
                    <Card key={customization.id}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">
                            {customization.type === 'exterior' && 'Exterior Finish Customization'}
                            {customization.type === 'performance' && 'Performance Enhancement'}
                            {customization.type === 'lighting' && 'Lighting Customization'}
                            {customization.type === 'wheels' && 'Wheels & Suspension'}
                            {customization.type === 'interior' && 'Interior Customization'}
                          </CardTitle>
                          <Badge variant="outline">{new Date(customization.timestamp).toLocaleDateString()}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="text-sm space-y-2">
                          {customization.type === 'exterior' && (
                            <p>
                              {customization.data.finishType === 'paint' && 'Paint finish applied'}
                              {customization.data.finishType === 'vinyl-wrap' && 'Vinyl wrap applied'}
                              {customization.data.finishType === 'graphics' && 'Graphics applied'}
                              {customization.data.finishType === 'protection' && 'Protection applied'}
                            </p>
                          )}
                          
                          {customization.type === 'performance' && (
                            <p>
                              {customization.data.engineUpgrades && 'Engine upgrades applied'}
                              {customization.data.suspensionUpgrades && 'Suspension upgrades applied'}
                              {customization.data.brakeUpgrades && 'Brake upgrades applied'}
                            </p>
                          )}
                          
                          {customization.type === 'lighting' && (
                            <p>
                              {customization.data.headlights.headlightId && 'Headlight upgrades applied'}
                              {customization.data.taillights.taillightId && 'Taillight upgrades applied'}
                              {customization.data.accentLighting.selectedIds.length > 0 && 'Accent lighting applied'}
                            </p>
                          )}
                          
                          <div className="mt-2">
                            <Badge variant="secondary">₹{customization.data.pricing.totalCost.toLocaleString()}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Exterior Studio Tab */}
          <TabsContent value="exterior">
            <ExteriorFinishStudio 
              vehicleId={vehicle.id}
              vehicleType={vehicle.type}
              onBack={() => setActiveStudio('overview')}
              onSave={(data) => handleSaveCustomization('exterior', data)}
            />
          </TabsContent>
          
          {/* Performance Upgrades Tab */}
          <TabsContent value="performance">
            <PerformanceEnhancementStudio 
              vehicleId={vehicle.id}
              vehicleType={vehicle.type}
              onBack={() => setActiveStudio('overview')}
              onSave={(data) => handleSaveCustomization('performance', data)}
            />
          </TabsContent>
          
          {/* Lighting Studio Tab */}
          <TabsContent value="lighting">
            <LightingCustomizationStudio 
              vehicleId={vehicle.id}
              vehicleType={vehicle.type}
              onBack={() => setActiveStudio('overview')}
              onSave={(data) => handleSaveCustomization('lighting', data)}
            />
          </TabsContent>
          
          {/* Wheels & Suspension Tab */}
          <TabsContent value="wheels">
            {vehicle && (
              <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-2xl font-bold mb-4">Wheel Customization Studio</h2>
                <p className="text-muted-foreground mb-6">Wheel and suspension customization studio is under development</p>
                <Button onClick={() => setActiveStudio('overview')}>Return to Overview</Button>
              </div>
            )}
          </TabsContent>
          
          {/* Interior Tab */}
          <TabsContent value="interior">
            {vehicle && (
              <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-2xl font-bold mb-4">Interior Customization Studio</h2>
                <p className="text-muted-foreground mb-6">Interior customization studio is under development</p>
                <Button onClick={() => setActiveStudio('overview')}>Return to Overview</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectCustomization;