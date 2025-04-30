import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ShieldCheck,
  Award,
  DollarSign,
  Share2,
  Download,
  Heart,
  Send,
  CheckSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import ArenaWrapper from '@/components/arena/ArenaWrapper';
import PreviewCard from '@/components/arena/PreviewCard';
import EnhancedColorSelector from '@/components/arena/EnhancedColorSelector';
import CustomizationPackage from '@/components/arena/CustomizationPackage';

// Available vehicle models
const vehicleModels = [
  { id: 1, name: 'City Roadster', type: 'Sedan', brand: 'AutoLux', thumbnail: '🚗' },
  { id: 2, name: 'Urban Explorer', type: 'SUV', brand: 'TrekStar', thumbnail: '🚙' },
  { id: 3, name: 'Thunder Bolt', type: 'Sports', brand: 'Velocity', thumbnail: '🏎️' },
  { id: 4, name: 'Cruiser 250', type: 'Motorcycle', brand: 'Road King', thumbnail: '🏍️' }
];

// Example body kit options
const bodyKitOptions = [
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
const spoilerOptions = [
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
    installTime: '3-4 hrs'
  }
];

// Simplified Arena Studio Page with expanded Customization
const Arena: React.FC = () => {
  // State for navigation and selections
  const [activeTab, setActiveTab] = useState('vehicle-selection');
  const [selectedVehicle, setSelectedVehicle] = useState<null | typeof vehicleModels[0]>(null);
  const [customizationCategory, setCustomizationCategory] = useState('exterior');
  const [selectedBodyKit, setSelectedBodyKit] = useState('stock');
  const [selectedSpoiler, setSelectedSpoiler] = useState('none');
  const [vehicleColor, setVehicleColor] = useState('#1E40AF');
  const [colorFinish, setColorFinish] = useState<'gloss' | 'matte' | 'metallic' | 'pearlescent' | 'satin'>('gloss');
  
  // Calculate total price
  const getTotalPrice = () => {
    let total = 0;
    
    // Add body kit price
    const bodyKit = bodyKitOptions.find(option => option.id === selectedBodyKit);
    if (bodyKit) {
      if (bodyKit.discount) {
        total += bodyKit.price - (bodyKit.price * bodyKit.discount / 100);
      } else {
        total += bodyKit.price;
      }
    }
    
    // Add spoiler price
    const spoiler = spoilerOptions.find(option => option.id === selectedSpoiler);
    if (spoiler) {
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
    
    return total;
  };
  
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Function to handle vehicle selection
  const handleSelectVehicle = (vehicle: typeof vehicleModels[0]) => {
    setSelectedVehicle(vehicle);
    setActiveTab('customization');
  };
  
  // Function to handle customization category change
  const handleCategoryChange = (category: string) => {
    setCustomizationCategory(category);
  };
  
  // Function to handle color selection
  const handleColorSelection = (color: string, finish?: 'gloss' | 'matte' | 'metallic' | 'pearlescent' | 'satin') => {
    setVehicleColor(color);
    if (finish) {
      setColorFinish(finish);
    }
  };
  
  // Function to reset selections and go back to vehicle selection
  const handleReset = () => {
    setSelectedVehicle(null);
    setActiveTab('vehicle-selection');
    setSelectedBodyKit('stock');
    setSelectedSpoiler('none');
    setVehicleColor('#1E40AF');
    setColorFinish('gloss');
  };
  
  return (
    <ArenaWrapper>
      <div className="container max-w-7xl mx-auto py-6">
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
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Save Project
            </Button>
          </div>
        </motion.div>
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-6 sticky top-0 z-10 bg-background py-2">
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
                >
                  <Card className="cursor-pointer hover:border-primary transition-colors h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <span className="text-4xl mr-2">{vehicle.thumbnail}</span>
                        {vehicle.name}
                      </CardTitle>
                      <CardDescription>{vehicle.brand} {vehicle.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex flex-wrap gap-1 mb-4">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {vehicle.type}
                        </Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Customizable
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground text-xs">Engine</div>
                          <div>2.0L Turbo</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">Power</div>
                          <div>250 bhp</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">Top Speed</div>
                          <div>220 km/h</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">Year</div>
                          <div>2023</div>
                        </div>
                      </div>
                    </CardContent>
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
                </motion.div>
              ))}
            </motion.div>
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
                  {/* Customization Categories Menu */}
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
                    <Card className="h-fit sticky top-24">
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
                  </div>
                  
                  {/* Customization Options */}
                  <div className="lg:col-span-9">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
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
                          </div>
                          
                          <div className="flex items-center gap-2">
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
                      
                      <CardContent>
                        {customizationCategory === 'exterior' && (
                          <div className="space-y-8">
                            {/* Body Kits */}
                            <CustomizationPackage 
                              title="Body Kits"
                              options={bodyKitOptions}
                              selectedOption={selectedBodyKit}
                              onSelectOption={setSelectedBodyKit}
                            />
                            
                            {/* Spoilers */}
                            <CustomizationPackage 
                              title="Spoilers"
                              options={spoilerOptions}
                              selectedOption={selectedSpoiler}
                              onSelectOption={setSelectedSpoiler}
                            />
                            
                            {/* Colors */}
                            <div>
                              <h3 className="text-lg font-medium mb-4">Paint Options</h3>
                              <EnhancedColorSelector 
                                onSelectColor={handleColorSelection}
                                defaultColor={vehicleColor}
                                defaultFinish={colorFinish}
                              />
                            </div>
                            
                            <Separator />
                            
                            {/* Cost Summary */}
                            <div className="bg-muted p-4 rounded-md">
                              <h3 className="font-medium text-lg mb-4">Customization Summary</h3>
                              
                              <div className="space-y-2 mb-4">
                                {selectedBodyKit !== 'stock' && (
                                  <div className="flex justify-between">
                                    <span>Body Kit: {bodyKitOptions.find(o => o.id === selectedBodyKit)?.name}</span>
                                    <span>{formatPrice(bodyKitOptions.find(o => o.id === selectedBodyKit)?.price || 0)}</span>
                                  </div>
                                )}
                                
                                {selectedSpoiler !== 'none' && (
                                  <div className="flex justify-between">
                                    <span>Spoiler: {spoilerOptions.find(o => o.id === selectedSpoiler)?.name}</span>
                                    <span>{formatPrice(spoilerOptions.find(o => o.id === selectedSpoiler)?.price || 0)}</span>
                                  </div>
                                )}
                                
                                {colorFinish !== 'gloss' && (
                                  <div className="flex justify-between">
                                    <span>Premium {colorFinish} Paint Finish</span>
                                    <span>₹25,000</span>
                                  </div>
                                )}
                              </div>
                              
                              <Separator className="my-2" />
                              
                              <div className="flex justify-between font-bold">
                                <span>Total Customization Cost</span>
                                <span>{formatPrice(getTotalPrice())}</span>
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