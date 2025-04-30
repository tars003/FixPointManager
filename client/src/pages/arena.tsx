import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  Sofa,
  BadgePercent,
  StopCircle,
  CircleDot,
  ShieldCheck
} from 'lucide-react';

// Available vehicle models
const vehicleModels = [
  { id: 1, name: 'City Roadster', type: 'Sedan', brand: 'AutoLux', thumbnail: '🚗' },
  { id: 2, name: 'Urban Explorer', type: 'SUV', brand: 'TrekStar', thumbnail: '🚙' },
  { id: 3, name: 'Thunder Bolt', type: 'Sports', brand: 'Velocity', thumbnail: '🏎️' },
  { id: 4, name: 'Cruiser 250', type: 'Motorcycle', brand: 'Road King', thumbnail: '🏍️' }
];

// Simplified Arena Studio Page with expanded Customization
const Arena: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vehicle-selection');
  const [selectedVehicle, setSelectedVehicle] = useState<null | typeof vehicleModels[0]>(null);
  const [customizationCategory, setCustomizationCategory] = useState('exterior');
  
  // Function to handle vehicle selection
  const handleSelectVehicle = (vehicle: typeof vehicleModels[0]) => {
    setSelectedVehicle(vehicle);
    setActiveTab('customization');
  };
  
  // Function to handle customization category change
  const handleCategoryChange = (category: string) => {
    setCustomizationCategory(category);
  };
  
  // Function to reset selections and go back to vehicle selection
  const handleReset = () => {
    setSelectedVehicle(null);
    setActiveTab('vehicle-selection');
  };
  
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
          <Button variant="outline" onClick={handleReset}>New Project</Button>
          <Button>Save Project</Button>
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-6">
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
        
        {/* Vehicle Selection Tab */}
        <TabsContent value="vehicle-selection">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicleModels.map(vehicle => (
              <Card key={vehicle.id} className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <span className="text-4xl mr-2">{vehicle.thumbnail}</span>
                    {vehicle.name}
                  </CardTitle>
                  <CardDescription>{vehicle.brand} {vehicle.type}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    onClick={() => handleSelectVehicle(vehicle)} 
                    className="w-full"
                  >
                    Select Vehicle
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Change Vehicle
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Customization Categories Menu */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Customization Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      <Button 
                        variant={customizationCategory === 'exterior' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange('exterior')}
                      >
                        <PaintBucket className="h-4 w-4 mr-2" />
                        Exterior
                      </Button>
                      <Button 
                        variant={customizationCategory === 'interior' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange('interior')}
                      >
                        <Sofa className="h-4 w-4 mr-2" />
                        Interior
                      </Button>
                      <Button 
                        variant={customizationCategory === 'performance' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange('performance')}
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Performance
                      </Button>
                      <Button 
                        variant={customizationCategory === 'wheels' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange('wheels')}
                      >
                        <CircleDot className="h-4 w-4 mr-2" />
                        Wheels & Tires
                      </Button>
                      <Button 
                        variant={customizationCategory === 'visualization' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange('visualization')}
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        Visualization
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Customization Options */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>
                      {customizationCategory === 'exterior' && 'Exterior Customization'}
                      {customizationCategory === 'interior' && 'Interior Customization'}
                      {customizationCategory === 'performance' && 'Performance Components'}
                      {customizationCategory === 'wheels' && 'Wheel & Tire Customization'}
                      {customizationCategory === 'visualization' && 'Visualization Options'}
                    </CardTitle>
                    <CardDescription>
                      {customizationCategory === 'exterior' && 'Modify the exterior appearance of your vehicle'}
                      {customizationCategory === 'interior' && 'Customize your vehicle\'s interior space'}
                      {customizationCategory === 'performance' && 'Upgrade performance components'}
                      {customizationCategory === 'wheels' && 'Select wheels and tires to match your style'}
                      {customizationCategory === 'visualization' && 'Choose how to view your customized vehicle'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {customizationCategory === 'exterior' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Body Modifications</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                              <div className="bg-muted rounded-lg p-4 mb-2">
                                <Car className="h-10 w-10 text-primary" />
                              </div>
                              <span>Standard Bumper</span>
                            </Button>
                            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                              <div className="bg-muted rounded-lg p-4 mb-2">
                                <Car className="h-10 w-10 text-primary" />
                              </div>
                              <span>Sport Bumper</span>
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Paint Options</h3>
                          <div className="flex flex-wrap gap-2">
                            <Button className="w-10 h-10 rounded-full p-0" style={{ backgroundColor: '#FF0000' }}></Button>
                            <Button className="w-10 h-10 rounded-full p-0" style={{ backgroundColor: '#0000FF' }}></Button>
                            <Button className="w-10 h-10 rounded-full p-0" style={{ backgroundColor: '#00FF00' }}></Button>
                            <Button className="w-10 h-10 rounded-full p-0" style={{ backgroundColor: '#FFFF00' }}></Button>
                            <Button className="w-10 h-10 rounded-full p-0" style={{ backgroundColor: '#000000' }}></Button>
                            <Button className="w-10 h-10 rounded-full p-0" style={{ backgroundColor: '#FFFFFF', border: '1px solid #e2e8f0' }}></Button>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Lighting Customization</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button variant="outline" className="justify-start">
                              <span className="bg-muted p-2 rounded mr-2">💡</span>
                              Standard Lights
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <span className="bg-muted p-2 rounded mr-2">💡</span>
                              LED Lights
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <span className="bg-muted p-2 rounded mr-2">💡</span>
                              RGB Underglow
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {customizationCategory === 'interior' && (
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
                    
                    {customizationCategory === 'performance' && (
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
                    
                    {customizationCategory === 'wheels' && (
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
                    
                    {customizationCategory === 'visualization' && (
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
                  
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleReset}>
                      Cancel
                    </Button>
                    <Button onClick={() => setActiveTab('summary')}>
                      Continue to Summary
                    </Button>
                  </CardFooter>
                </Card>
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
                <p>Performance customization options coming soon</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab('summary')}>
                  Continue to Summary
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        {/* Summary Tab */}
        <TabsContent value="summary">
          {selectedVehicle && (
            <Card>
              <CardHeader>
                <CardTitle>Customization Summary</CardTitle>
                <CardDescription>
                  Review your customized {selectedVehicle.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium">Vehicle</h3>
                    <p>{selectedVehicle.brand} {selectedVehicle.name} ({selectedVehicle.type})</p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium">Selected Customizations</h3>
                    <p>Standard configuration with no modifications</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('customization')}>
                  Back to Customization
                </Button>
                <Button>
                  Save Configuration
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Arena;