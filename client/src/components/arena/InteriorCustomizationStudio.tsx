import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  CircleOff, 
  Clock, 
  Grid2X2, 
  Info, 
  Layers, 
  Lightbulb, 
  MapPin, 
  PaintBucket, 
  Rotate3D, 
  RotateCcw, 
  Settings, 
  Star, 
  User, 
  ZoomIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InteriorCustomizationStudioProps {
  vehicleId: number;
  vehicleType: string;
  onBack: () => void;
  onSave: (customizationData: any) => void;
}

// Material types
type UpholsteryMaterial = 'leather' | 'alcantara' | 'fabric' | 'eco';
type DashboardMaterial = 'carbon' | 'wood' | 'aluminum' | 'soft-touch';
type SteeringWheelMaterial = 'leather' | 'alcantara' | 'wood' | 'carbon';
type FloorMatMaterial = 'carpet' | 'rubber' | 'all-weather';

// Pattern types
type StitchingPattern = 'diamond' | 'horizontal' | 'vertical' | 'custom';
type TrimPattern = 'glossy' | 'matte' | 'brushed' | 'textured';

// Color scheme
interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  stitching: string;
}

// Ambient lighting
interface AmbientLighting {
  enabled: boolean;
  color: string;
  brightness: number;
  animation: 'static' | 'pulse' | 'flow' | 'rainbow';
}

// Installer option
interface InstallerOption {
  id: string;
  name: string;
  distance: number;
  rating: number;
  reviewCount: number;
  price: number;
  earliestAvailable: string;
  address: string;
  certified: boolean;
  portfolio: string[];
}

const InteriorCustomizationStudio: React.FC<InteriorCustomizationStudioProps> = ({
  vehicleId,
  vehicleType,
  onBack,
  onSave
}) => {
  // State for seat upholstery
  const [upholsteryMaterial, setUpholsteryMaterial] = useState<UpholsteryMaterial>('leather');
  const [upholsteryColor, setUpholsteryColor] = useState<string>('#1f1f1f');
  const [secondaryColor, setSecondaryColor] = useState<string>('#787878');
  const [stitchingColor, setStitchingColor] = useState<string>('#e63946');
  const [stitchingPattern, setStitchingPattern] = useState<StitchingPattern>('diamond');
  
  // State for dashboard & trim
  const [dashboardMaterial, setDashboardMaterial] = useState<DashboardMaterial>('carbon');
  const [trimColor, setTrimColor] = useState<string>('#1f1f1f');
  const [trimPattern, setTrimPattern] = useState<TrimPattern>('glossy');
  
  // State for ambient lighting
  const [ambientLighting, setAmbientLighting] = useState<AmbientLighting>({
    enabled: true,
    color: '#3a86ff',
    brightness: 70,
    animation: 'static'
  });
  
  // State for steering wheel
  const [steeringWheelMaterial, setSteeringWheelMaterial] = useState<SteeringWheelMaterial>('leather');
  const [steeringWheelColor, setSteeringWheelColor] = useState<string>('#1f1f1f');
  const [steeringAccentColor, setSteeringAccentColor] = useState<string>('#787878');
  
  // State for floor mats
  const [floorMatMaterial, setFloorMatMaterial] = useState<FloorMatMaterial>('carpet');
  const [floorMatColor, setFloorMatColor] = useState<string>('#1f1f1f');
  const [customText, setCustomText] = useState<string>('');
  
  // State for viewing options
  const [viewMode, setViewMode] = useState<'normal' | 'closeup' | 'rotating'>('normal');
  const [viewingAngle, setViewingAngle] = useState<'driver' | 'passenger' | 'rear'>('driver');
  const [focusArea, setFocusArea] = useState<'all' | 'seats' | 'dashboard' | 'steering' | 'floor'>('all');
  
  // State for installation options
  const [selectedInstallerId, setSelectedInstallerId] = useState<string | null>(null);
  const [installationDate, setInstallationDate] = useState<string>(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  
  // Sample interior visualization images
  const getInteriorImage = () => {
    const baseImages = {
      'all': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888',
      'seats': 'https://images.unsplash.com/photo-1552251924-b18ada11e0f1',
      'dashboard': 'https://images.unsplash.com/photo-1514596731697-921c16781696',
      'steering': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce',
      'floor': 'https://images.unsplash.com/photo-1546545817-27d09baae8c4'
    };
    
    return baseImages[focusArea] || baseImages.all;
  };
  
  // Sample installer options
  const installerOptions: InstallerOption[] = [
    {
      id: 'i1',
      name: 'Luxury Auto Interiors',
      distance: 5.7,
      rating: 4.9,
      reviewCount: 187,
      price: 45000,
      earliestAvailable: '2025-04-29',
      address: '123 Upholstery Lane, Delhi',
      certified: true,
      portfolio: [
        'https://images.unsplash.com/photo-1552251992-0f9a9565e407',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70'
      ]
    },
    {
      id: 'i2',
      name: 'Supreme Customs',
      distance: 8.2,
      rating: 4.8,
      reviewCount: 156,
      price: 42000,
      earliestAvailable: '2025-05-02',
      address: '456 Stitch Avenue, Delhi',
      certified: true,
      portfolio: [
        'https://images.unsplash.com/photo-1562911791-c7a97b729ec5',
        'https://images.unsplash.com/photo-1609081144289-e5830886dc92'
      ]
    },
    {
      id: 'i3',
      name: 'Plush Interiors',
      distance: 10.5,
      rating: 4.6,
      reviewCount: 92,
      price: 38000,
      earliestAvailable: '2025-04-28',
      address: '789 Leather Road, Gurgaon',
      certified: false,
      portfolio: [
        'https://images.unsplash.com/photo-1601926131797-64be69d42075',
        'https://images.unsplash.com/photo-1577840879285-1cfde4418613'
      ]
    }
  ];
  
  // Get selected installer details
  const selectedInstaller = installerOptions.find(installer => installer.id === selectedInstallerId);
  
  // Calculate total cost
  const calculateTotal = () => {
    let total = 0;
    
    // Base cost for materials
    const materialCosts = {
      leather: 35000,
      alcantara: 45000,
      fabric: 25000,
      eco: 30000,
      carbon: 28000,
      wood: 22000,
      aluminum: 18000,
      'soft-touch': 15000
    };
    
    // Add seat upholstery cost
    total += materialCosts[upholsteryMaterial] || 0;
    
    // Add dashboard cost
    total += materialCosts[dashboardMaterial] || 0;
    
    // Add steering wheel cost
    total += (materialCosts[steeringWheelMaterial] || 0) / 3; // Smaller component
    
    // Add floor mat cost
    const floorMatCosts = {
      carpet: 8000,
      rubber: 10000,
      'all-weather': 12000
    };
    total += floorMatCosts[floorMatMaterial] || 0;
    
    // Add ambient lighting cost if enabled
    if (ambientLighting.enabled) {
      total += 18000;
    }
    
    // Add installation cost
    if (selectedInstaller) {
      total += selectedInstaller.price;
    }
    
    return total;
  };
  
  // Get EMI amount (for 24 months at 10% interest)
  const getEmiAmount = () => {
    const total = calculateTotal();
    const interestRate = 0.1 / 12; // 10% annual interest
    const months = 24;
    
    const emi = total * interestRate * Math.pow(1 + interestRate, months) / 
                (Math.pow(1 + interestRate, months) - 1);
    
    return Math.round(emi);
  };
  
  // Handle saving customization
  const handleSave = () => {
    const customizationData = {
      type: 'interior',
      seatUpholstery: {
        material: upholsteryMaterial,
        primaryColor: upholsteryColor,
        secondaryColor: secondaryColor,
        stitchingColor: stitchingColor,
        stitchingPattern: stitchingPattern
      },
      dashboard: {
        material: dashboardMaterial,
        color: trimColor,
        pattern: trimPattern
      },
      ambientLighting: ambientLighting,
      steeringWheel: {
        material: steeringWheelMaterial,
        mainColor: steeringWheelColor,
        accentColor: steeringAccentColor
      },
      floorMats: {
        material: floorMatMaterial,
        color: floorMatColor,
        customText: customText
      },
      installation: {
        installerId: selectedInstallerId,
        date: installationDate
      },
      pricing: {
        totalCost: calculateTotal()
      }
    };
    
    onSave(customizationData);
  };
  
  // Render rating stars
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-3.5 w-3.5 ${
              index < Math.floor(rating) 
                ? 'text-yellow-500 fill-yellow-500' 
                : index < rating 
                  ? 'text-yellow-500 fill-yellow-500 opacity-50' 
                  : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Interior Customization Studio</h1>
            <p className="text-sm text-muted-foreground">Design your perfect cabin interior</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedInstallerId}>
            Save Configuration
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* Left sidebar - Controls */}
        <div className="border-r p-4 overflow-y-auto">
          <Tabs defaultValue="seats">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="seats">Seats</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="steering">Steering</TabsTrigger>
              <TabsTrigger value="floor">Floor</TabsTrigger>
            </TabsList>
            
            {/* Seats Tab */}
            <TabsContent value="seats" className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Upholstery Material</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={upholsteryMaterial === 'leather' ? "default" : "outline"}
                    onClick={() => setUpholsteryMaterial('leather')}
                    className="justify-start"
                  >
                    Premium Leather
                  </Button>
                  <Button
                    variant={upholsteryMaterial === 'alcantara' ? "default" : "outline"}
                    onClick={() => setUpholsteryMaterial('alcantara')}
                    className="justify-start"
                  >
                    Alcantara/Suede
                  </Button>
                  <Button
                    variant={upholsteryMaterial === 'fabric' ? "default" : "outline"}
                    onClick={() => setUpholsteryMaterial('fabric')}
                    className="justify-start"
                  >
                    Sports Fabric
                  </Button>
                  <Button
                    variant={upholsteryMaterial === 'eco' ? "default" : "outline"}
                    onClick={() => setUpholsteryMaterial('eco')}
                    className="justify-start"
                  >
                    Eco-Friendly
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Color Palette</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {['#1f1f1f', '#f8f9fa', '#495057', '#6c757d', '#702632', '#264653'].map(color => (
                        <button
                          key={color}
                          onClick={() => setUpholsteryColor(color)}
                          className={`h-8 w-8 rounded-full ${upholsteryColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Secondary Color (for two-tone)</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {['#787878', '#e9ecef', '#ced4da', '#adb5bd', '#b8c0ff', '#caf0f8'].map(color => (
                        <button
                          key={color}
                          onClick={() => setSecondaryColor(color)}
                          className={`h-8 w-8 rounded-full ${secondaryColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Stitching Color</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {['#e63946', '#ffffff', '#fb8500', '#2a9d8f', '#3a86ff', '#8338ec'].map(color => (
                        <button
                          key={color}
                          onClick={() => setStitchingColor(color)}
                          className={`h-8 w-8 rounded-full ${stitchingColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Stitching Pattern</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={stitchingPattern === 'diamond' ? "default" : "outline"}
                    onClick={() => setStitchingPattern('diamond')}
                    className="justify-start"
                    size="sm"
                  >
                    Diamond Stitching
                  </Button>
                  <Button
                    variant={stitchingPattern === 'horizontal' ? "default" : "outline"}
                    onClick={() => setStitchingPattern('horizontal')}
                    className="justify-start"
                    size="sm"
                  >
                    Horizontal Channels
                  </Button>
                  <Button
                    variant={stitchingPattern === 'vertical' ? "default" : "outline"}
                    onClick={() => setStitchingPattern('vertical')}
                    className="justify-start"
                    size="sm"
                  >
                    Vertical Channels
                  </Button>
                  <Button
                    variant={stitchingPattern === 'custom' ? "default" : "outline"}
                    onClick={() => setStitchingPattern('custom')}
                    className="justify-start"
                    size="sm"
                  >
                    Custom Embroidery
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">Seat Specifications</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Material:</span>
                      <span className="capitalize">{upholsteryMaterial}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Color Scheme:</span>
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: upholsteryColor }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: secondaryColor }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Stitching:</span>
                      <div className="flex gap-2 items-center">
                        <span className="capitalize">{stitchingPattern}</span>
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: stitchingColor }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Dashboard Materials</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={dashboardMaterial === 'carbon' ? "default" : "outline"}
                    onClick={() => setDashboardMaterial('carbon')}
                    className="justify-start"
                  >
                    Carbon Fiber
                  </Button>
                  <Button
                    variant={dashboardMaterial === 'wood' ? "default" : "outline"}
                    onClick={() => setDashboardMaterial('wood')}
                    className="justify-start"
                  >
                    Wood Veneer
                  </Button>
                  <Button
                    variant={dashboardMaterial === 'aluminum' ? "default" : "outline"}
                    onClick={() => setDashboardMaterial('aluminum')}
                    className="justify-start"
                  >
                    Brushed Aluminum
                  </Button>
                  <Button
                    variant={dashboardMaterial === 'soft-touch' ? "default" : "outline"}
                    onClick={() => setDashboardMaterial('soft-touch')}
                    className="justify-start"
                  >
                    Soft-Touch Materials
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Trim Options</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Trim Color</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {['#1f1f1f', '#343a40', '#495057', '#6c757d', '#212529', '#264653'].map(color => (
                        <button
                          key={color}
                          onClick={() => setTrimColor(color)}
                          className={`h-8 w-8 rounded-full ${trimColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Finish Type</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        variant={trimPattern === 'glossy' ? "default" : "outline"}
                        onClick={() => setTrimPattern('glossy')}
                        className="justify-start"
                        size="sm"
                      >
                        Glossy Finish
                      </Button>
                      <Button
                        variant={trimPattern === 'matte' ? "default" : "outline"}
                        onClick={() => setTrimPattern('matte')}
                        className="justify-start"
                        size="sm"
                      >
                        Matte Finish
                      </Button>
                      <Button
                        variant={trimPattern === 'brushed' ? "default" : "outline"}
                        onClick={() => setTrimPattern('brushed')}
                        className="justify-start"
                        size="sm"
                      >
                        Brushed Finish
                      </Button>
                      <Button
                        variant={trimPattern === 'textured' ? "default" : "outline"}
                        onClick={() => setTrimPattern('textured')}
                        className="justify-start"
                        size="sm"
                      >
                        Textured Finish
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Ambient Lighting</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ambient-toggle">Enable Ambient Lighting</Label>
                    <button 
                      onClick={() => setAmbientLighting({
                        ...ambientLighting,
                        enabled: !ambientLighting.enabled
                      })}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                        ambientLighting.enabled ? 'bg-primary justify-end' : 'bg-muted justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-background shadow-sm transform mx-0.5"></div>
                    </button>
                  </div>
                  
                  {ambientLighting.enabled && (
                    <>
                      <div>
                        <Label>Light Color</Label>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {['#3a86ff', '#ff006e', '#8338ec', '#ff006e', '#fb5607', '#80ffdb'].map(color => (
                            <button
                              key={color}
                              onClick={() => setAmbientLighting({
                                ...ambientLighting,
                                color
                              })}
                              className={`h-8 w-8 rounded-full ${ambientLighting.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label>Brightness</Label>
                          <span className="text-sm font-medium">{ambientLighting.brightness}%</span>
                        </div>
                        <Slider
                          value={[ambientLighting.brightness]}
                          min={10}
                          max={100}
                          step={10}
                          onValueChange={(value) => setAmbientLighting({
                            ...ambientLighting,
                            brightness: value[0]
                          })}
                        />
                      </div>
                      
                      <div>
                        <Label>Animation Pattern</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Button
                            variant={ambientLighting.animation === 'static' ? "default" : "outline"}
                            onClick={() => setAmbientLighting({
                              ...ambientLighting,
                              animation: 'static'
                            })}
                            className="justify-start"
                            size="sm"
                          >
                            Static
                          </Button>
                          <Button
                            variant={ambientLighting.animation === 'pulse' ? "default" : "outline"}
                            onClick={() => setAmbientLighting({
                              ...ambientLighting,
                              animation: 'pulse'
                            })}
                            className="justify-start"
                            size="sm"
                          >
                            Pulse
                          </Button>
                          <Button
                            variant={ambientLighting.animation === 'flow' ? "default" : "outline"}
                            onClick={() => setAmbientLighting({
                              ...ambientLighting,
                              animation: 'flow'
                            })}
                            className="justify-start"
                            size="sm"
                          >
                            Flow
                          </Button>
                          <Button
                            variant={ambientLighting.animation === 'rainbow' ? "default" : "outline"}
                            onClick={() => setAmbientLighting({
                              ...ambientLighting,
                              animation: 'rainbow'
                            })}
                            className="justify-start"
                            size="sm"
                          >
                            Rainbow
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Steering Tab */}
            <TabsContent value="steering" className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Grip Material</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={steeringWheelMaterial === 'leather' ? "default" : "outline"}
                    onClick={() => setSteeringWheelMaterial('leather')}
                    className="justify-start"
                  >
                    Perforated Leather
                  </Button>
                  <Button
                    variant={steeringWheelMaterial === 'alcantara' ? "default" : "outline"}
                    onClick={() => setSteeringWheelMaterial('alcantara')}
                    className="justify-start"
                  >
                    Alcantara
                  </Button>
                  <Button
                    variant={steeringWheelMaterial === 'wood' ? "default" : "outline"}
                    onClick={() => setSteeringWheelMaterial('wood')}
                    className="justify-start"
                  >
                    Wood Accents
                  </Button>
                  <Button
                    variant={steeringWheelMaterial === 'carbon' ? "default" : "outline"}
                    onClick={() => setSteeringWheelMaterial('carbon')}
                    className="justify-start"
                  >
                    Carbon Fiber Elements
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Steering Wheel Colors</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Main Color</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {['#1f1f1f', '#343a40', '#495057', '#6c757d', '#702632', '#264653'].map(color => (
                        <button
                          key={color}
                          onClick={() => setSteeringWheelColor(color)}
                          className={`h-8 w-8 rounded-full ${steeringWheelColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Accent Color</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {['#e63946', '#ffffff', '#fb8500', '#2a9d8f', '#3a86ff', '#8338ec'].map(color => (
                        <button
                          key={color}
                          onClick={() => setSteeringAccentColor(color)}
                          className={`h-8 w-8 rounded-full ${steeringAccentColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Button Customization</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm">Customize Control Buttons</span>
                      <Badge>Premium Feature</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose from multiple button layouts, backlight colors, and extended control functions.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" disabled>
                        <Layers className="mr-2 h-4 w-4" />
                        Configure Button Layout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">Steering Wheel Specifications</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Material:</span>
                      <span className="capitalize">{steeringWheelMaterial}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Color Scheme:</span>
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: steeringWheelColor }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: steeringAccentColor }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Heating:</span>
                      <Badge variant="outline" className="text-xs">Included</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Floor Tab */}
            <TabsContent value="floor" className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Floor Mat Material</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={floorMatMaterial === 'carpet' ? "default" : "outline"}
                    onClick={() => setFloorMatMaterial('carpet')}
                    className="justify-start"
                  >
                    Premium Carpet Mats
                  </Button>
                  <Button
                    variant={floorMatMaterial === 'rubber' ? "default" : "outline"}
                    onClick={() => setFloorMatMaterial('rubber')}
                    className="justify-start"
                  >
                    Rubber Mats
                  </Button>
                  <Button
                    variant={floorMatMaterial === 'all-weather' ? "default" : "outline"}
                    onClick={() => setFloorMatMaterial('all-weather')}
                    className="justify-start"
                  >
                    All-Weather Floor Liners
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Color Options</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Floor Mat Color</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {['#1f1f1f', '#2b2d42', '#343a40', '#495057', '#6c757d', '#577590'].map(color => (
                        <button
                          key={color}
                          onClick={() => setFloorMatColor(color)}
                          className={`h-8 w-8 rounded-full ${floorMatColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Custom Text/Logo</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="custom-text">Custom Text (Optional)</Label>
                    <Input
                      id="custom-text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="e.g., Your Name or Logo Text"
                      className="mt-2"
                      maxLength={15}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Max 15 characters. Will be embroidered on driver's side mat.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Cargo Area Options</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                      <Check className="text-primary mr-2 h-5 w-5" />
                      <span className="font-medium">Weather Protection Liner</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col items-center">
                        <Layers className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-center">Spill Protection</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Settings className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-center">Custom Fit</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <RotateCcw className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-center">Easy Clean</span>
                      </div>
                    </div>
                    <div className="flex justify-center mt-2">
                      <Badge variant="outline">Included in Package</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Center - Visualization */}
        <div className="col-span-1 lg:col-span-1 border-r flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium text-lg mb-3">Interior Visualization</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={viewMode === 'normal' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode('normal')}
              >
                <ZoomIn className="h-4 w-4 mr-2" />
                Normal View
              </Button>
              <Button 
                variant={viewMode === 'closeup' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode('closeup')}
              >
                <ZoomIn className="h-4 w-4 mr-2" />
                Close-Up
              </Button>
              <Button 
                variant={viewMode === 'rotating' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode('rotating')}
              >
                <Rotate3D className="h-4 w-4 mr-2" />
                3D View
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                variant={viewingAngle === 'driver' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewingAngle('driver')}
              >
                Driver's View
              </Button>
              <Button 
                variant={viewingAngle === 'passenger' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewingAngle('passenger')}
              >
                Passenger View
              </Button>
              <Button 
                variant={viewingAngle === 'rear' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewingAngle('rear')}
              >
                Rear Seats
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                variant={focusArea === 'all' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFocusArea('all')}
              >
                All Interior
              </Button>
              <Button 
                variant={focusArea === 'seats' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFocusArea('seats')}
              >
                Seats
              </Button>
              <Button 
                variant={focusArea === 'dashboard' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFocusArea('dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                variant={focusArea === 'steering' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFocusArea('steering')}
              >
                Steering Wheel
              </Button>
              <Button 
                variant={focusArea === 'floor' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFocusArea('floor')}
              >
                Floor Mats
              </Button>
            </div>
          </div>
          
          <div className="flex-1 bg-muted/30 flex items-center justify-center p-4">
            <div className="relative w-full h-full">
              <img
                src={getInteriorImage()}
                alt="Interior preview"
                className={`object-contain max-h-full max-w-full mx-auto ${
                  viewMode === 'rotating' ? 'animate-pulse' : ''
                }`}
              />
              {viewMode === 'closeup' && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">Close-Up View</Badge>
                </div>
              )}
              {viewMode === 'rotating' && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">3D View</Badge>
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <Badge className="capitalize">
                  {viewingAngle} View - {focusArea === 'all' ? 'Full Interior' : focusArea}
                </Badge>
              </div>
              
              {/* Color overlay to simulate customization */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{ 
                  backgroundColor: 
                    focusArea === 'seats' ? upholsteryColor : 
                    focusArea === 'dashboard' ? trimColor :
                    focusArea === 'steering' ? steeringWheelColor : 
                    focusArea === 'floor' ? floorMatColor : 'transparent'
                }}
              />
              
              {/* Ambient lighting overlay */}
              {ambientLighting.enabled && (
                <div 
                  className={`absolute inset-0 pointer-events-none mix-blend-soft-light opacity-${Math.round(ambientLighting.brightness / 10)} ${
                    ambientLighting.animation === 'pulse' ? 'animate-pulse' : 
                    ambientLighting.animation === 'flow' ? 'animate-breathe' : 
                    ambientLighting.animation === 'rainbow' ? 'animate-rainbow-shift' : ''
                  }`}
                  style={{ backgroundColor: ambientLighting.color }}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Right sidebar - Summary */}
        <div className="p-4 overflow-y-auto">
          <h3 className="font-medium text-lg mb-4">Interior Customization Summary</h3>
          
          <div className="space-y-4">
            {/* Upholstery Summary */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Seat Upholstery</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Material:</span>
                    <span className="text-sm font-medium capitalize">{upholsteryMaterial}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Color Scheme:</span>
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: upholsteryColor }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: secondaryColor }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Stitching:</span>
                    <div className="flex gap-2 items-center">
                      <span className="capitalize">{stitchingPattern}</span>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: stitchingColor }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Price:</span>
                    <span className="text-sm font-medium">
                      ₹{(upholsteryMaterial === 'leather' ? 35000 : 
                         upholsteryMaterial === 'alcantara' ? 45000 : 
                         upholsteryMaterial === 'fabric' ? 25000 : 30000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Dashboard Summary */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Dashboard & Trim</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Material:</span>
                    <span className="text-sm font-medium capitalize">{dashboardMaterial}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Finish:</span>
                    <span className="text-sm font-medium capitalize">{trimPattern}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Color:</span>
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: trimColor }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ambient Lighting:</span>
                    <span className="text-sm font-medium">
                      {ambientLighting.enabled ? (
                        <Badge variant="outline" className="text-xs">
                          Enabled ({ambientLighting.animation})
                        </Badge>
                      ) : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Price:</span>
                    <span className="text-sm font-medium">
                      ₹{((dashboardMaterial === 'carbon' ? 28000 : 
                          dashboardMaterial === 'wood' ? 22000 : 
                          dashboardMaterial === 'aluminum' ? 18000 : 15000) + 
                          (ambientLighting.enabled ? 18000 : 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Steering Wheel Summary */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Steering Wheel</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Material:</span>
                    <span className="text-sm font-medium capitalize">{steeringWheelMaterial}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Colors:</span>
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: steeringWheelColor }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: steeringAccentColor }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Price:</span>
                    <span className="text-sm font-medium">
                      ₹{((steeringWheelMaterial === 'leather' ? 35000 : 
                          steeringWheelMaterial === 'alcantara' ? 45000 : 
                          steeringWheelMaterial === 'wood' ? 22000 : 28000) / 3).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Floor Mats Summary */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Floor & Cargo Area</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Floor Mat Type:</span>
                    <span className="text-sm font-medium capitalize">{floorMatMaterial}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Color:</span>
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: floorMatColor }}
                    />
                  </div>
                  {customText && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Custom Text:</span>
                      <span className="text-sm font-medium">{customText}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cargo Liner:</span>
                    <Badge variant="outline" className="text-xs">Included</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Price:</span>
                    <span className="text-sm font-medium">
                      ₹{(floorMatMaterial === 'carpet' ? 8000 : 
                         floorMatMaterial === 'rubber' ? 10000 : 12000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Installation Options */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Installation Options</CardTitle>
              </CardHeader>
              <CardContent className="py-0 px-4">
                <div className="space-y-3 py-2">
                  <div>
                    <Label className="text-sm font-medium">Select Installation Specialist</Label>
                    <div className="space-y-2 mt-2">
                      {installerOptions.map(installer => (
                        <Card
                          key={installer.id}
                          className={`cursor-pointer transition-all ${
                            selectedInstallerId === installer.id ? 'border-primary ring-1 ring-primary/20' : ''
                          }`}
                          onClick={() => setSelectedInstallerId(installer.id)}
                        >
                          <CardContent className="p-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium flex items-center">
                                  {installer.name}
                                  {installer.certified && (
                                    <Badge variant="outline" className="ml-2 text-xs h-5">Certified</Badge>
                                  )}
                                </h4>
                                <div className="flex items-center gap-1 mt-1">
                                  {renderRating(installer.rating)}
                                  <span className="text-xs text-muted-foreground">
                                    ({installer.reviewCount})
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center text-xs">
                                  <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span>{installer.distance} km</span>
                                </div>
                                <p className="text-sm font-medium mt-1">₹{installer.price.toLocaleString()}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  {selectedInstallerId && (
                    <div>
                      <Label htmlFor="installation-date" className="text-sm font-medium">Installation Date</Label>
                      <Input
                        id="installation-date"
                        type="date"
                        value={installationDate}
                        onChange={(e) => setInstallationDate(e.target.value)}
                        min={selectedInstaller?.earliestAvailable}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Pricing Breakdown */}
            <Card className={`${
              selectedInstallerId ? 'border-primary' : ''
            }`}>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">Pricing Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Seat Upholstery:</span>
                    <span className="text-sm font-medium">
                      ₹{(upholsteryMaterial === 'leather' ? 35000 : 
                         upholsteryMaterial === 'alcantara' ? 45000 : 
                         upholsteryMaterial === 'fabric' ? 25000 : 30000).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dashboard & Trim:</span>
                    <span className="text-sm font-medium">
                      ₹{(dashboardMaterial === 'carbon' ? 28000 : 
                         dashboardMaterial === 'wood' ? 22000 : 
                         dashboardMaterial === 'aluminum' ? 18000 : 15000).toLocaleString()}
                    </span>
                  </div>
                  {ambientLighting.enabled && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ambient Lighting:</span>
                      <span className="text-sm font-medium">₹18,000</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Steering Wheel:</span>
                    <span className="text-sm font-medium">
                      ₹{Math.round((steeringWheelMaterial === 'leather' ? 35000 : 
                                    steeringWheelMaterial === 'alcantara' ? 45000 : 
                                    steeringWheelMaterial === 'wood' ? 22000 : 28000) / 3).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Floor & Cargo:</span>
                    <span className="text-sm font-medium">
                      ₹{(floorMatMaterial === 'carpet' ? 8000 : 
                         floorMatMaterial === 'rubber' ? 10000 : 12000).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Installation:</span>
                    <span className="text-sm font-medium">
                      ₹{selectedInstaller ? selectedInstaller.price.toLocaleString() : '0'}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between font-medium">
                    <span>Total:</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-4 bg-muted/30 p-3 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Financing Options</h4>
                    <p className="text-xs text-muted-foreground">
                      EMI starting at ₹{getEmiAmount().toLocaleString()}/month for 24 months
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        2 years manufacturer warranty on all materials
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 bg-muted/30">
                <Button 
                  className="w-full" 
                  onClick={handleSave}
                  disabled={!selectedInstallerId}
                >
                  Save Configuration
                </Button>
              </CardFooter>
            </Card>
            
            {/* Customer Gallery */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Customer Inspiration Gallery</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="grid grid-cols-2 gap-2">
                  {['https://images.unsplash.com/photo-1503376780353-7e6692767b70',
                    'https://images.unsplash.com/photo-1546545817-27d09baae8c4',
                    'https://images.unsplash.com/photo-1552251992-0f9a9565e407',
                    'https://images.unsplash.com/photo-1503377872590-7baf5d824cf7'].map((img, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-md">
                      <img 
                        src={img} 
                        alt={`Customer example ${i+1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-center text-muted-foreground">
                  Get inspired by others' customizations
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteriorCustomizationStudio;