import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CircleOff, 
  Gauge, 
  Info, 
  MapPin, 
  Rotate3D, 
  Settings, 
  Star, 
  Truck, 
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

interface WheelCustomizationStudioProps {
  vehicleId: number;
  vehicleType: string;
  onBack: () => void;
  onSave: (customizationData: any) => void;
}

type WheelType = 'alloy' | 'forged' | 'carbon' | 'steel';
type WheelFinish = 'matte' | 'gloss' | 'brushed' | 'polished' | 'chrome';
type TireType = 'all-season' | 'performance' | 'off-road' | 'winter';

interface WheelOption {
  id: string;
  name: string;
  type: WheelType;
  size: number;
  width: string;
  offset: number;
  weight: number;
  price: number;
  image: string;
  finishOptions: WheelFinish[];
}

interface TireOption {
  id: string;
  brand: string;
  name: string;
  type: TireType;
  size: string;
  loadRating: string;
  speedRating: string;
  treadPattern: string;
  noiseLevel: number;
  fuelEfficiency: 'A' | 'B' | 'C' | 'D' | 'E';
  wetGrip: 'A' | 'B' | 'C' | 'D' | 'E';
  price: number;
  image: string;
}

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
}

const WheelCustomizationStudio: React.FC<WheelCustomizationStudioProps> = ({
  vehicleId,
  vehicleType,
  onBack,
  onSave
}) => {
  // State for wheel selection
  const [wheelType, setWheelType] = useState<WheelType>('alloy');
  const [selectedWheelId, setSelectedWheelId] = useState<string | null>(null);
  const [wheelSize, setWheelSize] = useState<number>(17);
  const [wheelWidth, setWheelWidth] = useState<string>('7.5J');
  const [wheelOffset, setWheelOffset] = useState<number>(35);
  const [wheelFinish, setWheelFinish] = useState<WheelFinish>('gloss');
  const [wheelColor, setWheelColor] = useState<string>('#1f1f1f');
  
  // State for tire selection
  const [tireType, setTireType] = useState<TireType>('all-season');
  const [selectedTireId, setSelectedTireId] = useState<string | null>(null);
  const [tireBrand, setTireBrand] = useState<string>('all');
  
  // State for viewing options
  const [viewMode, setViewMode] = useState<'normal' | 'closeup' | 'rotating'>('normal');
  const [viewingAngle, setViewingAngle] = useState<'front' | 'side' | 'rear'>('front');
  
  // State for installation options
  const [selectedInstallerId, setSelectedInstallerId] = useState<string | null>(null);
  const [installationDate, setInstallationDate] = useState<string>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  
  // Sample wheel options
  const wheelOptions: WheelOption[] = [
    {
      id: 'w1',
      name: 'Vortex VT-390',
      type: 'alloy',
      size: 17,
      width: '7.5J',
      offset: 40,
      weight: 9.5,
      price: 15000,
      image: 'https://images.unsplash.com/photo-1626058246749-2772df564664',
      finishOptions: ['matte', 'gloss', 'brushed']
    },
    {
      id: 'w2',
      name: 'Enkei TS-10',
      type: 'alloy',
      size: 18,
      width: '8J',
      offset: 35,
      weight: 10.2,
      price: 18500,
      image: 'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0',
      finishOptions: ['matte', 'gloss', 'polished']
    },
    {
      id: 'w3',
      name: 'BBS CH-R',
      type: 'forged',
      size: 19,
      width: '8.5J',
      offset: 45,
      weight: 8.9,
      price: 28000,
      image: 'https://images.unsplash.com/photo-1577020092572-8cae661bc0de',
      finishOptions: ['gloss', 'polished', 'chrome']
    },
    {
      id: 'w4',
      name: 'Rays G-Games 57CR',
      type: 'forged',
      size: 18,
      width: '8J',
      offset: 38,
      weight: 8.2,
      price: 25000,
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87',
      finishOptions: ['matte', 'gloss', 'brushed']
    },
    {
      id: 'w5',
      name: 'Carbon Revolution CR-9',
      type: 'carbon',
      size: 19,
      width: '9J',
      offset: 42,
      weight: 6.5,
      price: 35000,
      image: 'https://images.unsplash.com/photo-1566211218909-67b25c96167f',
      finishOptions: ['matte', 'gloss']
    },
    {
      id: 'w6',
      name: 'OZ Racing Ultraleggera',
      type: 'forged',
      size: 17,
      width: '7.5J',
      offset: 35,
      weight: 7.8,
      price: 22000,
      image: 'https://images.unsplash.com/photo-1579100519125-4265f071c990',
      finishOptions: ['matte', 'gloss', 'polished']
    }
  ];
  
  // Sample tire options
  const tireOptions: TireOption[] = [
    {
      id: 't1',
      brand: 'Michelin',
      name: 'Pilot Sport 4',
      type: 'performance',
      size: '225/45R17',
      loadRating: '94',
      speedRating: 'Y',
      treadPattern: 'Asymmetric',
      noiseLevel: 2,
      fuelEfficiency: 'B',
      wetGrip: 'A',
      price: 12500,
      image: 'https://images.unsplash.com/photo-1621844504120-97cc936d674c'
    },
    {
      id: 't2',
      brand: 'Bridgestone',
      name: 'Potenza S007',
      type: 'performance',
      size: '235/45R18',
      loadRating: '96',
      speedRating: 'Y',
      treadPattern: 'Asymmetric',
      noiseLevel: 3,
      fuelEfficiency: 'C',
      wetGrip: 'A',
      price: 14000,
      image: 'https://images.unsplash.com/photo-1658139175178-4a11fdf5d8e5'
    },
    {
      id: 't3',
      brand: 'Continental',
      name: 'ExtremeContact DWS06 Plus',
      type: 'all-season',
      size: '225/45R17',
      loadRating: '94',
      speedRating: 'W',
      treadPattern: 'Asymmetric',
      noiseLevel: 2,
      fuelEfficiency: 'B',
      wetGrip: 'B',
      price: 11000,
      image: 'https://images.unsplash.com/photo-1621844504120-97cc936d674c'
    },
    {
      id: 't4',
      brand: 'Pirelli',
      name: 'P Zero',
      type: 'performance',
      size: '235/35R19',
      loadRating: '91',
      speedRating: 'Y',
      treadPattern: 'Asymmetric',
      noiseLevel: 3,
      fuelEfficiency: 'C',
      wetGrip: 'A',
      price: 16500,
      image: 'https://images.unsplash.com/photo-1658139175178-4a11fdf5d8e5'
    },
    {
      id: 't5',
      brand: 'Goodyear',
      name: 'Eagle F1 Asymmetric 5',
      type: 'performance',
      size: '225/45R17',
      loadRating: '94',
      speedRating: 'Y',
      treadPattern: 'Asymmetric',
      noiseLevel: 2,
      fuelEfficiency: 'B',
      wetGrip: 'A',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1621844504120-97cc936d674c'
    },
    {
      id: 't6',
      brand: 'Michelin',
      name: 'CrossClimate 2',
      type: 'all-season',
      size: '225/45R17',
      loadRating: '94',
      speedRating: 'V',
      treadPattern: 'Directional',
      noiseLevel: 1,
      fuelEfficiency: 'A',
      wetGrip: 'A',
      price: 13500,
      image: 'https://images.unsplash.com/photo-1658139175178-4a11fdf5d8e5'
    }
  ];
  
  // Sample installer options
  const installerOptions: InstallerOption[] = [
    {
      id: 'i1',
      name: 'Apex Wheel & Tire',
      distance: 3.2,
      rating: 4.8,
      reviewCount: 124,
      price: 2000,
      earliestAvailable: '2025-04-28',
      address: '123 Automotive Lane, Delhi',
      certified: true
    },
    {
      id: 'i2',
      name: 'PitStop Performance',
      distance: 5.7,
      rating: 4.6,
      reviewCount: 87,
      price: 1800,
      earliestAvailable: '2025-04-26',
      address: '456 Motor Avenue, Delhi',
      certified: true
    },
    {
      id: 'i3',
      name: 'SpeedWorks Garage',
      distance: 8.1,
      rating: 4.4,
      reviewCount: 63,
      price: 1650,
      earliestAvailable: '2025-04-29',
      address: '789 Wheel Street, Delhi',
      certified: false
    },
    {
      id: 'i4',
      name: 'Torque Masters',
      distance: 11.3,
      rating: 4.9,
      reviewCount: 216,
      price: 2200,
      earliestAvailable: '2025-04-27',
      address: '321 Performance Blvd, Gurgaon',
      certified: true
    }
  ];
  
  // Filter wheel options based on selection
  const filteredWheels = wheelOptions.filter(wheel => {
    return (wheelType === 'alloy' || wheel.type === wheelType);
  });
  
  // Filter tire options based on selection
  const filteredTires = tireOptions.filter(tire => {
    if (tireType !== 'all-season' && tire.type !== tireType) return false;
    if (tireBrand !== 'all' && tire.brand !== tireBrand) return false;
    return true;
  });
  
  // Get selected wheel details
  const selectedWheel = wheelOptions.find(wheel => wheel.id === selectedWheelId);
  
  // Get selected tire details
  const selectedTire = tireOptions.find(tire => tire.id === selectedTireId);
  
  // Get selected installer details
  const selectedInstaller = installerOptions.find(installer => installer.id === selectedInstallerId);
  
  // Calculate total cost
  const calculateTotal = () => {
    let total = 0;
    
    // Add wheel cost (4 wheels)
    if (selectedWheel) {
      total += selectedWheel.price * 4;
    }
    
    // Add tire cost (4 tires)
    if (selectedTire) {
      total += selectedTire.price * 4;
    }
    
    // Add installation cost
    if (selectedInstaller) {
      total += selectedInstaller.price;
    }
    
    // Add alignment cost
    total += 1500;
    
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
      type: 'wheels',
      wheelSelection: {
        wheelId: selectedWheelId,
        wheelType,
        wheelSize,
        wheelWidth,
        wheelOffset,
        wheelFinish,
        wheelColor
      },
      tireSelection: {
        tireId: selectedTireId,
        tireType,
        tireBrand
      },
      installation: {
        installerId: selectedInstallerId,
        date: installationDate
      },
      pricing: {
        wheelCost: selectedWheel ? selectedWheel.price * 4 : 0,
        tireCost: selectedTire ? selectedTire.price * 4 : 0,
        installationCost: selectedInstaller ? selectedInstaller.price : 0,
        alignmentCost: 1500,
        totalCost: calculateTotal()
      }
    };
    
    onSave(customizationData);
  };
  
  // Render noise level indicators
  const renderNoiseLevel = (level: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div 
            key={index}
            className={`h-1.5 w-1.5 rounded-full ${index < level ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
    );
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
            <h1 className="text-xl font-bold">Wheel Customization Studio</h1>
            <p className="text-sm text-muted-foreground">Design your perfect wheel and tire package</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedWheelId || !selectedTireId || !selectedInstallerId}>
            Save Configuration
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* Left sidebar - Controls */}
        <div className="border-r p-4 overflow-y-auto">
          <Tabs defaultValue="wheel">
            <TabsList className="w-full">
              <TabsTrigger value="wheel">Wheel</TabsTrigger>
              <TabsTrigger value="tire">Tire</TabsTrigger>
              <TabsTrigger value="install">Installation</TabsTrigger>
            </TabsList>
            
            {/* Wheel Tab */}
            <TabsContent value="wheel" className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Wheel Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={wheelType === 'alloy' ? "default" : "outline"}
                    onClick={() => setWheelType('alloy')}
                    className="justify-start"
                  >
                    Alloy Wheels
                  </Button>
                  <Button
                    variant={wheelType === 'forged' ? "default" : "outline"}
                    onClick={() => setWheelType('forged')}
                    className="justify-start"
                  >
                    Forged Wheels
                  </Button>
                  <Button
                    variant={wheelType === 'carbon' ? "default" : "outline"}
                    onClick={() => setWheelType('carbon')}
                    className="justify-start"
                  >
                    Carbon Fiber
                  </Button>
                  <Button
                    variant={wheelType === 'steel' ? "default" : "outline"}
                    onClick={() => setWheelType('steel')}
                    className="justify-start"
                  >
                    Steel Wheels
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Wheel Size</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Diameter</Label>
                      <span className="text-sm font-medium">{wheelSize}"</span>
                    </div>
                    <Slider
                      value={[wheelSize]}
                      min={15}
                      max={22}
                      step={1}
                      onValueChange={(value) => setWheelSize(value[0])}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Width</Label>
                      <span className="text-sm font-medium">{wheelWidth}</span>
                    </div>
                    <Select
                      value={wheelWidth}
                      onValueChange={setWheelWidth}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select width" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6.5J">6.5J</SelectItem>
                        <SelectItem value="7J">7J</SelectItem>
                        <SelectItem value="7.5J">7.5J</SelectItem>
                        <SelectItem value="8J">8J</SelectItem>
                        <SelectItem value="8.5J">8.5J</SelectItem>
                        <SelectItem value="9J">9J</SelectItem>
                        <SelectItem value="9.5J">9.5J</SelectItem>
                        <SelectItem value="10J">10J</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Offset (ET)</Label>
                      <span className="text-sm font-medium">ET{wheelOffset}</span>
                    </div>
                    <Slider
                      value={[wheelOffset]}
                      min={0}
                      max={60}
                      step={5}
                      onValueChange={(value) => setWheelOffset(value[0])}
                    />
                  </div>
                </div>
              </div>
              
              {selectedWheel && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Finish Options</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Finish Type</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {selectedWheel.finishOptions.map((finish) => (
                          <Button
                            key={finish}
                            variant={wheelFinish === finish ? "default" : "outline"}
                            onClick={() => setWheelFinish(finish)}
                            className="justify-start capitalize"
                            size="sm"
                          >
                            {finish}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Color</Label>
                      <div className="grid grid-cols-6 gap-2 mt-2">
                        {['#1f1f1f', '#ffffff', '#c0c0c0', '#787878', '#4a2511', '#b87333'].map(color => (
                          <button
                            key={color}
                            onClick={() => setWheelColor(color)}
                            className={`h-8 w-8 rounded-full ${wheelColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium mb-4">Select Wheel Design</h3>
                <div className="grid grid-cols-2 gap-3">
                  {filteredWheels.map(wheel => (
                    <Card
                      key={wheel.id}
                      className={`cursor-pointer transition-all ${
                        selectedWheelId === wheel.id ? 'border-primary ring-2 ring-primary/20' : ''
                      }`}
                      onClick={() => setSelectedWheelId(wheel.id)}
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={wheel.image}
                          alt={wheel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{wheel.name}</h4>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>{wheel.size}"</span>
                          <span>₹{wheel.price.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {selectedWheel && (
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base">Selected Wheel Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="capitalize">{selectedWheel.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Size:</span>
                        <span>{selectedWheel.size}"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Width:</span>
                        <span>{selectedWheel.width}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Offset:</span>
                        <span>ET{selectedWheel.offset}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Weight:</span>
                        <span>{selectedWheel.weight} kg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">₹{selectedWheel.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Tire Tab */}
            <TabsContent value="tire" className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Tire Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={tireType === 'all-season' ? "default" : "outline"}
                    onClick={() => setTireType('all-season')}
                    className="justify-start"
                  >
                    All-Season
                  </Button>
                  <Button
                    variant={tireType === 'performance' ? "default" : "outline"}
                    onClick={() => setTireType('performance')}
                    className="justify-start"
                  >
                    Performance
                  </Button>
                  <Button
                    variant={tireType === 'off-road' ? "default" : "outline"}
                    onClick={() => setTireType('off-road')}
                    className="justify-start"
                  >
                    Off-Road
                  </Button>
                  <Button
                    variant={tireType === 'winter' ? "default" : "outline"}
                    onClick={() => setTireType('winter')}
                    className="justify-start"
                  >
                    Winter
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Filter by Brand</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={tireBrand === 'all' ? "default" : "outline"}
                    onClick={() => setTireBrand('all')}
                    className="justify-start"
                    size="sm"
                  >
                    All Brands
                  </Button>
                  <Button
                    variant={tireBrand === 'Michelin' ? "default" : "outline"}
                    onClick={() => setTireBrand('Michelin')}
                    className="justify-start"
                    size="sm"
                  >
                    Michelin
                  </Button>
                  <Button
                    variant={tireBrand === 'Bridgestone' ? "default" : "outline"}
                    onClick={() => setTireBrand('Bridgestone')}
                    className="justify-start"
                    size="sm"
                  >
                    Bridgestone
                  </Button>
                  <Button
                    variant={tireBrand === 'Continental' ? "default" : "outline"}
                    onClick={() => setTireBrand('Continental')}
                    className="justify-start"
                    size="sm"
                  >
                    Continental
                  </Button>
                  <Button
                    variant={tireBrand === 'Pirelli' ? "default" : "outline"}
                    onClick={() => setTireBrand('Pirelli')}
                    className="justify-start"
                    size="sm"
                  >
                    Pirelli
                  </Button>
                  <Button
                    variant={tireBrand === 'Goodyear' ? "default" : "outline"}
                    onClick={() => setTireBrand('Goodyear')}
                    className="justify-start"
                    size="sm"
                  >
                    Goodyear
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Select Tires</h3>
                <div className="space-y-3">
                  {filteredTires.map(tire => (
                    <Card
                      key={tire.id}
                      className={`cursor-pointer transition-all ${
                        selectedTireId === tire.id ? 'border-primary ring-2 ring-primary/20' : ''
                      }`}
                      onClick={() => setSelectedTireId(tire.id)}
                    >
                      <div className="flex p-3">
                        <div className="w-24 h-24 overflow-hidden rounded">
                          <img
                            src={tire.image}
                            alt={tire.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{tire.brand} {tire.name}</h4>
                              <p className="text-sm text-muted-foreground">{tire.size}</p>
                            </div>
                            <Badge>{tire.type}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-y-1 mt-2 text-xs">
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-1">Noise:</span>
                              {renderNoiseLevel(tire.noiseLevel)}
                            </div>
                            <div>
                              <span className="text-muted-foreground mr-1">Fuel:</span>
                              <Badge variant="outline" className="ml-1 text-xs h-5 px-1.5">
                                {tire.fuelEfficiency}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground mr-1">Wet Grip:</span>
                              <Badge variant="outline" className="ml-1 text-xs h-5 px-1.5">
                                {tire.wetGrip}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground mr-1">Price:</span>
                              <span className="font-medium">₹{tire.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              {selectedTire && (
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base">Selected Tire Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Brand:</span>
                        <span>{selectedTire.brand}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Model:</span>
                        <span>{selectedTire.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Size:</span>
                        <span>{selectedTire.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="capitalize">{selectedTire.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Load/Speed:</span>
                        <span>{selectedTire.loadRating}{selectedTire.speedRating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Pattern:</span>
                        <span>{selectedTire.treadPattern}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Installation Tab */}
            <TabsContent value="install" className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Installation Information</h3>
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <span>DIY Difficulty Rating: <Badge>3/5</Badge></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-muted-foreground" />
                        <span>Professional Installation Time: 1-2 hours</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <h4 className="font-medium mb-2">Required Tools (DIY)</h4>
                      <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Jack and jack stands</li>
                        <li>Lug wrench</li>
                        <li>Torque wrench</li>
                        <li>Tire pressure gauge</li>
                        <li>Valve stem tool</li>
                      </ul>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <h4 className="font-medium mb-2">Special Considerations</h4>
                      <p className="text-sm text-muted-foreground">
                        Your vehicle requires proper torque settings of 100-120 Nm for 
                        wheel nuts. Wheel balancing and alignment are strongly recommended 
                        after installation.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Select Installer</h3>
                <div className="space-y-3">
                  {installerOptions.map(installer => (
                    <Card
                      key={installer.id}
                      className={`cursor-pointer transition-all ${
                        selectedInstallerId === installer.id ? 'border-primary ring-2 ring-primary/20' : ''
                      }`}
                      onClick={() => setSelectedInstallerId(installer.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium flex items-center">
                              {installer.name}
                              {installer.certified && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="ml-2 text-xs">Certified</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Factory authorized installer</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-sm">
                              {renderRating(installer.rating)}
                              <span className="text-xs text-muted-foreground">
                                ({installer.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm">
                              <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{installer.distance} km</span>
                            </div>
                            <p className="text-sm font-medium mt-1">₹{installer.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <p>{installer.address}</p>
                          <p className="mt-1">Earliest available: {new Date(installer.earliestAvailable).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {selectedInstallerId && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Select Installation Date</h3>
                  <div>
                    <Label htmlFor="installation-date">Preferred Date</Label>
                    <Input
                      id="installation-date"
                      type="date"
                      value={installationDate}
                      onChange={(e) => setInstallationDate(e.target.value)}
                      min={selectedInstaller?.earliestAvailable}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Center - Visualization */}
        <div className="col-span-1 lg:col-span-1 border-r flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium text-lg mb-3">Real-Time Visualization</h3>
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
                Rotating
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                variant={viewingAngle === 'front' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewingAngle('front')}
              >
                Front Wheel
              </Button>
              <Button 
                variant={viewingAngle === 'side' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewingAngle('side')}
              >
                Side Profile
              </Button>
              <Button 
                variant={viewingAngle === 'rear' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewingAngle('rear')}
              >
                Rear Wheel
              </Button>
            </div>
          </div>
          
          <div className="flex-1 bg-muted/30 flex items-center justify-center p-4">
            {selectedWheelId ? (
              <div className="relative w-full h-full">
                <img
                  src={selectedWheel?.image}
                  alt="Wheel preview"
                  className={`object-contain max-h-full max-w-full mx-auto ${
                    viewMode === 'rotating' ? 'animate-spin-slow' : ''
                  }`}
                />
                {viewMode === 'closeup' && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">Close-Up View</Badge>
                  </div>
                )}
                {viewMode === 'rotating' && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">Rotating View</Badge>
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                  <Badge className="capitalize">
                    {viewingAngle} View
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <CircleOff className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="mt-4 text-muted-foreground">
                  Select a wheel to see visualization
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right sidebar - Summary */}
        <div className="p-4 overflow-y-auto">
          <h3 className="font-medium text-lg mb-4">Customization Summary</h3>
          
          <div className="space-y-4">
            {/* Wheel Summary */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Wheel Selection</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                {selectedWheel ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Model:</span>
                      <span className="text-sm font-medium">{selectedWheel.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Size:</span>
                      <span className="text-sm font-medium">{wheelSize}" x {wheelWidth}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Finish:</span>
                      <span className="text-sm font-medium capitalize">{wheelFinish}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Color:</span>
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: wheelColor }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Price (x4):</span>
                      <span className="text-sm font-medium">
                        ₹{(selectedWheel.price * 4).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No wheel selected</p>
                )}
              </CardContent>
            </Card>
            
            {/* Tire Summary */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Tire Selection</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                {selectedTire ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Brand:</span>
                      <span className="text-sm font-medium">{selectedTire.brand}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Model:</span>
                      <span className="text-sm font-medium">{selectedTire.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Size:</span>
                      <span className="text-sm font-medium">{selectedTire.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Type:</span>
                      <span className="text-sm font-medium capitalize">{selectedTire.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Price (x4):</span>
                      <span className="text-sm font-medium">
                        ₹{(selectedTire.price * 4).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tire selected</p>
                )}
              </CardContent>
            </Card>
            
            {/* Installation Summary */}
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Installation</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                {selectedInstaller ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Service Center:</span>
                      <span className="text-sm font-medium">{selectedInstaller.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Distance:</span>
                      <span className="text-sm font-medium">{selectedInstaller.distance} km</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rating:</span>
                      <div className="flex items-center">
                        {renderRating(selectedInstaller.rating)}
                        <span className="text-xs ml-1">({selectedInstaller.rating})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Date:</span>
                      <span className="text-sm font-medium">
                        {new Date(installationDate).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Installation Fee:</span>
                      <span className="text-sm font-medium">
                        ₹{selectedInstaller.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No installer selected</p>
                )}
              </CardContent>
            </Card>
            
            {/* Pricing Breakdown */}
            <Card className={`${
              selectedWheel && selectedTire && selectedInstaller ? 'border-primary' : ''
            }`}>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-base">Pricing Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wheels (x4):</span>
                    <span className="text-sm font-medium">
                      ₹{selectedWheel ? (selectedWheel.price * 4).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tires (x4):</span>
                    <span className="text-sm font-medium">
                      ₹{selectedTire ? (selectedTire.price * 4).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Installation:</span>
                    <span className="text-sm font-medium">
                      ₹{selectedInstaller ? selectedInstaller.price.toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Balancing & Alignment:</span>
                    <span className="text-sm font-medium">₹1,500</span>
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
                    <div className="flex items-center mt-2">
                      <Info className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-xs text-muted-foreground">
                        2 years manufacturer + 1 year extended warranty available
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 bg-muted/30">
                <Button 
                  className="w-full" 
                  onClick={handleSave}
                  disabled={!selectedWheelId || !selectedTireId || !selectedInstallerId}
                >
                  Save Configuration
                </Button>
              </CardFooter>
            </Card>
            
            {/* Related Products */}
            {selectedWheel && selectedTire && (
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">Complementary Products</CardTitle>
                  <CardDescription className="text-xs">
                    Users who selected these wheels also added:
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded border p-2 text-xs hover:bg-muted/50 cursor-pointer">
                      <h4 className="font-medium">Lowering Springs</h4>
                      <p className="text-muted-foreground mt-1">₹12,500</p>
                    </div>
                    <div className="rounded border p-2 text-xs hover:bg-muted/50 cursor-pointer">
                      <h4 className="font-medium">Wheel Spacers</h4>
                      <p className="text-muted-foreground mt-1">₹3,600</p>
                    </div>
                    <div className="rounded border p-2 text-xs hover:bg-muted/50 cursor-pointer">
                      <h4 className="font-medium">Brake Caliper Color Kit</h4>
                      <p className="text-muted-foreground mt-1">₹2,800</p>
                    </div>
                    <div className="rounded border p-2 text-xs hover:bg-muted/50 cursor-pointer">
                      <h4 className="font-medium">Locking Wheel Nuts</h4>
                      <p className="text-muted-foreground mt-1">₹1,200</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WheelCustomizationStudio;