import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  CircleOff, 
  Clock, 
  Cloud, 
  Droplets, 
  Info, 
  Layers, 
  Moon, 
  PaintBucket, 
  Palette, 
  RotateCcw, 
  Shield, 
  Sparkles, 
  Star, 
  Sun, 
  Zap
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExteriorFinishStudioProps {
  vehicleId: number;
  vehicleType: string;
  onBack: () => void;
  onSave: (customizationData: any) => void;
}

type FinishType = 'paint' | 'vinyl-wrap' | 'graphics' | 'protection';
type PaintType = 'factory' | 'custom';
type PaintFinish = 'gloss' | 'matte' | 'satin' | 'metallic' | 'pearl';
type WrapType = 'full' | 'partial';
type WrapFinish = 'solid' | 'carbon' | 'metallic' | 'matte' | 'chrome';
type ViewingCondition = 'daylight' | 'night' | 'rain' | 'showroom' | 'sunlight';

interface ColorOption {
  id: string;
  name: string;
  hexColor: string;
  type: 'factory' | 'custom';
  finish: PaintFinish;
  price: number;
}

interface WrapOption {
  id: string;
  name: string;
  type: WrapType;
  finish: WrapFinish;
  image: string;
  price: number;
}

interface GraphicOption {
  id: string;
  name: string;
  category: 'racing' | 'geometric' | 'artistic' | 'corporate';
  image: string;
  price: number;
}

interface ProtectionOption {
  id: string;
  name: string;
  type: 'ceramic' | 'film';
  durability: number; // years
  features: string[];
  price: number;
}

interface ApplicationCenter {
  id: string;
  name: string;
  distance: number;
  rating: number;
  reviewCount: number;
  price: number;
  earliestAvailable: string;
  warranty: number; // months
  certified: boolean;
  image: string;
}

const ExteriorFinishStudio: React.FC<ExteriorFinishStudioProps> = ({
  vehicleId,
  vehicleType,
  onBack,
  onSave
}) => {
  // Main selection state
  const [finishType, setFinishType] = useState<FinishType>('paint');
  
  // Paint options state
  const [paintType, setPaintType] = useState<PaintType>('factory');
  const [selectedPaintId, setSelectedPaintId] = useState<string | null>(null);
  const [paintFinish, setPaintFinish] = useState<PaintFinish>('gloss');
  const [customColor, setCustomColor] = useState<string>('#1E3A8A');
  
  // Wrap options state
  const [wrapType, setWrapType] = useState<WrapType>('full');
  const [selectedWrapId, setSelectedWrapId] = useState<string | null>(null);
  const [wrapFinish, setWrapFinish] = useState<WrapFinish>('solid');
  
  // Graphics options state
  const [graphicCategory, setGraphicCategory] = useState<'racing' | 'geometric' | 'artistic' | 'corporate'>('racing');
  const [selectedGraphicId, setSelectedGraphicId] = useState<string | null>(null);
  
  // Protection options state
  const [protectionType, setProtectionType] = useState<'ceramic' | 'film'>('ceramic');
  const [selectedProtectionId, setSelectedProtectionId] = useState<string | null>(null);
  
  // Visualization options
  const [viewingCondition, setViewingCondition] = useState<ViewingCondition>('daylight');
  const [showBeforeAfter, setShowBeforeAfter] = useState<boolean>(false);
  
  // Installation options
  const [selectedApplicationCenterId, setSelectedApplicationCenterId] = useState<string | null>(null);
  const [applicationDate, setApplicationDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  
  // Sample color options (factory)
  const factoryColors: ColorOption[] = [
    { id: 'c1', name: 'Arctic White', hexColor: '#FFFFFF', type: 'factory', finish: 'gloss', price: 0 },
    { id: 'c2', name: 'Phantom Black', hexColor: '#111111', type: 'factory', finish: 'gloss', price: 0 },
    { id: 'c3', name: 'Racing Blue', hexColor: '#1E3A8A', type: 'factory', finish: 'metallic', price: 5000 },
    { id: 'c4', name: 'Radiant Red', hexColor: '#D70000', type: 'factory', finish: 'metallic', price: 5000 },
    { id: 'c5', name: 'Lunar Silver', hexColor: '#C0C0C0', type: 'factory', finish: 'metallic', price: 5000 },
    { id: 'c6', name: 'Electric Yellow', hexColor: '#F7DE32', type: 'factory', finish: 'gloss', price: 8000 },
    { id: 'c7', name: 'Midnight Purple', hexColor: '#301934', type: 'factory', finish: 'pearl', price: 12000 },
    { id: 'c8', name: 'Desert Khaki', hexColor: '#C2B280', type: 'factory', finish: 'matte', price: 10000 },
  ];
  
  // Sample wrap options
  const wrapOptions: WrapOption[] = [
    { 
      id: 'w1', 
      name: 'Glossy Black', 
      type: 'full', 
      finish: 'solid', 
      image: 'https://images.unsplash.com/photo-1559149247-c7832d28902d', 
      price: 45000 
    },
    { 
      id: 'w2', 
      name: 'Satin White', 
      type: 'full', 
      finish: 'matte', 
      image: 'https://images.unsplash.com/photo-1555626906-fcf10d6851b4', 
      price: 48000 
    },
    { 
      id: 'w3', 
      name: 'Carbon Fiber', 
      type: 'full', 
      finish: 'carbon', 
      image: 'https://images.unsplash.com/photo-1563289258-419a2ef4bead', 
      price: 65000 
    },
    { 
      id: 'w4', 
      name: 'Brushed Metal Silver', 
      type: 'full', 
      finish: 'metallic', 
      image: 'https://images.unsplash.com/photo-1574626349197-a3b15c938bbe', 
      price: 55000 
    },
    { 
      id: 'w5', 
      name: 'Chrome Gold', 
      type: 'full', 
      finish: 'chrome', 
      image: 'https://images.unsplash.com/photo-1549062565-ee42ba96a4f2', 
      price: 60000 
    },
    { 
      id: 'w6', 
      name: 'Matte Black Hood', 
      type: 'partial', 
      finish: 'matte', 
      image: 'https://images.unsplash.com/photo-1596554817011-c0fc6ede67c1', 
      price: 15000 
    },
    { 
      id: 'w7', 
      name: 'Carbon Fiber Roof', 
      type: 'partial', 
      finish: 'carbon', 
      image: 'https://images.unsplash.com/photo-1563289258-419a2ef4bead', 
      price: 18000 
    },
    { 
      id: 'w8', 
      name: 'Racing Stripes', 
      type: 'partial', 
      finish: 'solid', 
      image: 'https://images.unsplash.com/photo-1603384699671-2cfd6572f810', 
      price: 12000 
    },
  ];
  
  // Sample graphic options
  const graphicOptions: GraphicOption[] = [
    {
      id: 'g1',
      name: 'Racing Stripes - Classic',
      category: 'racing',
      image: 'https://images.unsplash.com/photo-1603384699671-2cfd6572f810',
      price: 12000
    },
    {
      id: 'g2',
      name: 'Racing Stripes - Rally',
      category: 'racing',
      image: 'https://images.unsplash.com/photo-1533473859217-e9538d9920f0',
      price: 15000
    },
    {
      id: 'g3',
      name: 'Geometric Triangles',
      category: 'geometric',
      image: 'https://images.unsplash.com/photo-1541316262387-458451e81392',
      price: 18000
    },
    {
      id: 'g4',
      name: 'Abstract Flow',
      category: 'artistic',
      image: 'https://images.unsplash.com/photo-1541316262387-458451e81392',
      price: 25000
    },
    {
      id: 'g5',
      name: 'Company Logo Package',
      category: 'corporate',
      image: 'https://images.unsplash.com/photo-1522836924445-4478bdeb860c',
      price: 18000
    },
  ];
  
  // Sample protection options
  const protectionOptions: ProtectionOption[] = [
    {
      id: 'p1',
      name: 'CeramicPro 9H',
      type: 'ceramic',
      durability: 5,
      features: ['Hydrophobic', 'UV Protection', 'Scratch Resistant'],
      price: 25000
    },
    {
      id: 'p2',
      name: 'CeramicPro Light',
      type: 'ceramic',
      durability: 2,
      features: ['Hydrophobic', 'UV Protection'],
      price: 15000
    },
    {
      id: 'p3',
      name: 'Ultimate PPF',
      type: 'film',
      durability: 7,
      features: ['Self-Healing', 'Stain Resistant', 'Impact Protection'],
      price: 30000
    },
    {
      id: 'p4',
      name: 'Clear Bra - Front Package',
      type: 'film',
      durability: 5,
      features: ['Self-Healing', 'Impact Protection'],
      price: 20000
    },
  ];
  
  // Sample application centers
  const applicationCenters: ApplicationCenter[] = [
    {
      id: 'a1',
      name: 'Extreme Wraps',
      distance: 5.8,
      rating: 4.9,
      reviewCount: 187,
      price: 15000,
      earliestAvailable: '2025-04-30',
      warranty: 12,
      certified: true,
      image: 'https://images.unsplash.com/photo-1617550694897-5aea2dbb143c'
    },
    {
      id: 'a2',
      name: 'Precision Auto Styling',
      distance: 8.2,
      rating: 4.7,
      reviewCount: 123,
      price: 12000,
      earliestAvailable: '2025-05-03',
      warranty: 6,
      certified: true,
      image: 'https://images.unsplash.com/photo-1609081922031-1f76e18c3896'
    },
    {
      id: 'a3',
      name: 'Elite Auto Detailing',
      distance: 12.5,
      rating: 4.8,
      reviewCount: 215,
      price: 18000,
      earliestAvailable: '2025-04-28',
      warranty: 24,
      certified: true,
      image: 'https://images.unsplash.com/photo-1637531347055-4fa8aa80c333'
    },
    {
      id: 'a4',
      name: 'AutoWrap Express',
      distance: 6.3,
      rating: 4.4,
      reviewCount: 78,
      price: 10000,
      earliestAvailable: '2025-05-05',
      warranty: 6,
      certified: false,
      image: 'https://images.unsplash.com/photo-1599282481361-1a8631a9f175'
    },
  ];
  
  // Filter options based on selection
  const filteredWraps = wrapOptions.filter(wrap => {
    return (wrapType === 'full') 
      ? wrap.type === 'full' 
      : wrap.type === 'partial';
  });
  
  const filteredGraphics = graphicOptions.filter(graphic => {
    return graphic.category === graphicCategory;
  });
  
  const filteredProtections = protectionOptions.filter(protection => {
    return protection.type === protectionType;
  });
  
  // Get selected options
  const selectedPaint = factoryColors.find(color => color.id === selectedPaintId);
  const selectedWrap = wrapOptions.find(wrap => wrap.id === selectedWrapId);
  const selectedGraphic = graphicOptions.find(graphic => graphic.id === selectedGraphicId);
  const selectedProtection = protectionOptions.find(protection => protection.id === selectedProtectionId);
  const selectedCenter = applicationCenters.find(center => center.id === selectedApplicationCenterId);
  
  // Calculate total cost
  const calculateTotal = () => {
    let total = 0;
    
    // Add base cost based on finish type
    switch (finishType) {
      case 'paint':
        total += selectedPaint ? selectedPaint.price : (paintType === 'custom' ? 85000 : 0);
        break;
      case 'vinyl-wrap':
        total += selectedWrap ? selectedWrap.price : 0;
        break;
      case 'graphics':
        total += selectedGraphic ? selectedGraphic.price : 0;
        break;
      case 'protection':
        total += selectedProtection ? selectedProtection.price : 0;
        break;
    }
    
    // Add application cost
    if (selectedCenter) {
      total += selectedCenter.price;
    }
    
    // Add prep cost (only for paint and full wrap)
    if (finishType === 'paint' || (finishType === 'vinyl-wrap' && wrapType === 'full')) {
      total += 15000; // Paint correction and prep
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
      type: 'exteriorFinish',
      finishType,
      paintSelection: finishType === 'paint' ? {
        paintType,
        paintId: selectedPaintId,
        paintFinish,
        customColor: paintType === 'custom' ? customColor : null
      } : null,
      wrapSelection: finishType === 'vinyl-wrap' ? {
        wrapType,
        wrapId: selectedWrapId,
        wrapFinish
      } : null,
      graphicSelection: finishType === 'graphics' ? {
        graphicCategory,
        graphicId: selectedGraphicId
      } : null,
      protectionSelection: finishType === 'protection' ? {
        protectionType,
        protectionId: selectedProtectionId
      } : null,
      application: {
        centerId: selectedApplicationCenterId,
        date: applicationDate
      },
      pricing: {
        baseCost: calculateTotal() - (selectedCenter ? selectedCenter.price : 0),
        applicationCost: selectedCenter ? selectedCenter.price : 0,
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
            <h1 className="text-xl font-bold">Exterior Finish Studio</h1>
            <p className="text-sm text-muted-foreground">Customize your vehicle's appearance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!((finishType === 'paint' && (selectedPaintId || paintType === 'custom')) || 
                     (finishType === 'vinyl-wrap' && selectedWrapId) ||
                     (finishType === 'graphics' && selectedGraphicId) ||
                     (finishType === 'protection' && selectedProtectionId)) ||
                     !selectedApplicationCenterId}
          >
            Save Configuration
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* Left sidebar - Controls */}
        <div className="border-r p-4 overflow-y-auto">
          <Tabs defaultValue="finish-type">
            <TabsList className="w-full">
              <TabsTrigger value="finish-type">Type</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
            </TabsList>
            
            {/* Finish Type Tab */}
            <TabsContent value="finish-type" className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Finish Type</h3>
                <RadioGroup 
                  value={finishType} 
                  onValueChange={(value) => setFinishType(value as FinishType)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paint" id="paint" />
                    <Label htmlFor="paint" className="flex items-center gap-2 cursor-pointer">
                      <PaintBucket className="h-4 w-4 text-primary" />
                      <span>Paint</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vinyl-wrap" id="vinyl-wrap" />
                    <Label htmlFor="vinyl-wrap" className="flex items-center gap-2 cursor-pointer">
                      <Layers className="h-4 w-4 text-primary" />
                      <span>Vinyl Wrap</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="graphics" id="graphics" />
                    <Label htmlFor="graphics" className="flex items-center gap-2 cursor-pointer">
                      <Palette className="h-4 w-4 text-primary" />
                      <span>Custom Graphics</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="protection" id="protection" />
                    <Label htmlFor="protection" className="flex items-center gap-2 cursor-pointer">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Paint Protection</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Paint Type Options */}
              {finishType === 'paint' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Paint Options</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="factory" 
                        id="factory" 
                        checked={paintType === 'factory'} 
                        onClick={() => setPaintType('factory')}
                      />
                      <Label htmlFor="factory" className="cursor-pointer">Factory Colors</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="custom" 
                        id="custom" 
                        checked={paintType === 'custom'} 
                        onClick={() => setPaintType('custom')}
                      />
                      <Label htmlFor="custom" className="cursor-pointer">Custom Paint</Label>
                    </div>
                  </div>
                  
                  {paintType === 'factory' ? (
                    <>
                      <div>
                        <Label className="block mb-2">Factory Color</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {factoryColors.map((color) => (
                            <Tooltip key={color.id}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={`w-10 h-10 rounded-full p-0 relative ${selectedPaintId === color.id ? 'ring-2 ring-primary' : ''}`}
                                  style={{ backgroundColor: color.hexColor, border: color.hexColor === '#FFFFFF' ? '1px solid #e2e8f0' : 'none' }}
                                  onClick={() => setSelectedPaintId(color.id)}
                                >
                                  {selectedPaintId === color.id && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <Check className={`h-4 w-4 ${color.hexColor === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                                    </div>
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  <p>{color.name}</p>
                                  <p>{color.finish}</p>
                                  <p>₹{color.price.toLocaleString()}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="custom-color">Custom Color</Label>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div 
                            className="w-10 h-10 rounded-full border"
                            style={{ backgroundColor: customColor }}
                          />
                          <Input 
                            id="custom-color" 
                            type="color" 
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="finish">Paint Finish</Label>
                        <Select value={paintFinish} onValueChange={(value) => setPaintFinish(value as PaintFinish)}>
                          <SelectTrigger id="finish">
                            <SelectValue placeholder="Select finish" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gloss">Gloss</SelectItem>
                            <SelectItem value="matte">Matte</SelectItem>
                            <SelectItem value="satin">Satin</SelectItem>
                            <SelectItem value="metallic">Metallic</SelectItem>
                            <SelectItem value="pearl">Pearl</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {/* Vinyl Wrap Options */}
              {finishType === 'vinyl-wrap' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Vinyl Wrap Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="full" 
                        id="full" 
                        checked={wrapType === 'full'} 
                        onClick={() => setWrapType('full')}
                      />
                      <Label htmlFor="full" className="cursor-pointer">Full Wrap</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="partial" 
                        id="partial" 
                        checked={wrapType === 'partial'} 
                        onClick={() => setWrapType('partial')}
                      />
                      <Label htmlFor="partial" className="cursor-pointer">Partial Wrap</Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="wrap-finish">Wrap Finish</Label>
                    <Select value={wrapFinish} onValueChange={(value) => setWrapFinish(value as WrapFinish)}>
                      <SelectTrigger id="wrap-finish">
                        <SelectValue placeholder="Select finish" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid Color</SelectItem>
                        <SelectItem value="carbon">Carbon Fiber</SelectItem>
                        <SelectItem value="metallic">Metallic</SelectItem>
                        <SelectItem value="matte">Matte</SelectItem>
                        <SelectItem value="chrome">Chrome</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Graphics Options */}
              {finishType === 'graphics' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Graphics Options</h3>
                  <div>
                    <Label htmlFor="graphic-category">Category</Label>
                    <Select 
                      value={graphicCategory} 
                      onValueChange={(value) => setGraphicCategory(value as 'racing' | 'geometric' | 'artistic' | 'corporate')}
                    >
                      <SelectTrigger id="graphic-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="racing">Racing Stripes</SelectItem>
                        <SelectItem value="geometric">Geometric Patterns</SelectItem>
                        <SelectItem value="artistic">Artistic Designs</SelectItem>
                        <SelectItem value="corporate">Corporate/Promotional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Protection Options */}
              {finishType === 'protection' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Protection Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="ceramic" 
                        id="ceramic" 
                        checked={protectionType === 'ceramic'} 
                        onClick={() => setProtectionType('ceramic')}
                      />
                      <Label htmlFor="ceramic" className="cursor-pointer">Ceramic Coating</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="film" 
                        id="film" 
                        checked={protectionType === 'film'} 
                        onClick={() => setProtectionType('film')}
                      />
                      <Label htmlFor="film" className="cursor-pointer">Protection Film</Label>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Options Tab */}
            <TabsContent value="options" className="space-y-6 pt-4">
              <ScrollArea className="h-[400px] pr-4">
                {/* Paint Options */}
                {finishType === 'paint' && paintType === 'factory' && (
                  <div className="grid grid-cols-1 gap-4">
                    {factoryColors.map((color) => (
                      <Card 
                        key={color.id} 
                        className={`cursor-pointer transition-all ${selectedPaintId === color.id ? 'border-primary ring-1 ring-primary' : ''}`}
                        onClick={() => setSelectedPaintId(color.id)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="flex justify-between items-center">
                            <span>{color.name}</span>
                            {color.price > 0 && <Badge>+₹{color.price.toLocaleString()}</Badge>}
                          </CardTitle>
                          <CardDescription>
                            {color.finish} finish
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="w-full h-20 rounded-md" style={{ backgroundColor: color.hexColor, border: color.hexColor === '#FFFFFF' ? '1px solid #e2e8f0' : 'none' }} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                {/* Wrap Options */}
                {finishType === 'vinyl-wrap' && (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredWraps.map((wrap) => (
                      <Card 
                        key={wrap.id} 
                        className={`cursor-pointer transition-all ${selectedWrapId === wrap.id ? 'border-primary ring-1 ring-primary' : ''}`}
                        onClick={() => setSelectedWrapId(wrap.id)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="flex justify-between items-center">
                            <span>{wrap.name}</span>
                            <Badge>₹{wrap.price.toLocaleString()}</Badge>
                          </CardTitle>
                          <CardDescription>
                            {wrap.finish} finish
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="w-full h-36 rounded-md overflow-hidden">
                            <img 
                              src={wrap.image} 
                              alt={wrap.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                {/* Graphics Options */}
                {finishType === 'graphics' && (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredGraphics.map((graphic) => (
                      <Card 
                        key={graphic.id} 
                        className={`cursor-pointer transition-all ${selectedGraphicId === graphic.id ? 'border-primary ring-1 ring-primary' : ''}`}
                        onClick={() => setSelectedGraphicId(graphic.id)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="flex justify-between items-center">
                            <span>{graphic.name}</span>
                            <Badge>₹{graphic.price.toLocaleString()}</Badge>
                          </CardTitle>
                          <CardDescription>
                            {graphic.category} style
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="w-full h-36 rounded-md overflow-hidden">
                            <img 
                              src={graphic.image} 
                              alt={graphic.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                {/* Protection Options */}
                {finishType === 'protection' && (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredProtections.map((protection) => (
                      <Card 
                        key={protection.id} 
                        className={`cursor-pointer transition-all ${selectedProtectionId === protection.id ? 'border-primary ring-1 ring-primary' : ''}`}
                        onClick={() => setSelectedProtectionId(protection.id)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="flex justify-between items-center">
                            <span>{protection.name}</span>
                            <Badge>₹{protection.price.toLocaleString()}</Badge>
                          </CardTitle>
                          <CardDescription>
                            {protection.durability} years durability
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="flex flex-wrap gap-2">
                            {protection.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="py-1">
                                <Check className="h-3 w-3 mr-1" /> {feature}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            {/* Application Tab */}
            <TabsContent value="application" className="space-y-6 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Application Centers</h3>
                <div className="space-y-4">
                  {applicationCenters.map((center) => (
                    <Card 
                      key={center.id} 
                      className={`cursor-pointer transition-all ${selectedApplicationCenterId === center.id ? 'border-primary ring-1 ring-primary' : ''}`}
                      onClick={() => setSelectedApplicationCenterId(center.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-md overflow-hidden">
                            <img 
                              src={center.image} 
                              alt={center.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{center.name}</h4>
                              <Badge variant={center.certified ? "default" : "outline"}>
                                {center.certified ? 'Certified' : 'Standard'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{center.distance} km</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                {renderRating(center.rating)}
                                <span className="text-muted-foreground">({center.reviewCount})</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Earliest: {center.earliestAvailable}</span>
                              </div>
                              <Badge variant="outline">₹{center.price.toLocaleString()}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {selectedApplicationCenterId && (
                <div>
                  <Label htmlFor="application-date">Appointment Date</Label>
                  <Input 
                    id="application-date" 
                    type="date"
                    className="mt-1"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    min={selectedCenter?.earliestAvailable}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Center - Visualization */}
        <div className="col-span-1 lg:col-span-1 border-r flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium mb-2">3D Visualization</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={viewingCondition === 'daylight' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewingCondition('daylight')}
              >
                <Sun className="h-4 w-4 mr-1" />
                Daylight
              </Button>
              <Button 
                variant={viewingCondition === 'night' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewingCondition('night')}
              >
                <Moon className="h-4 w-4 mr-1" />
                Night
              </Button>
              <Button 
                variant={viewingCondition === 'rain' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewingCondition('rain')}
              >
                <Cloud className="h-4 w-4 mr-1" />
                Rain
              </Button>
              <Button 
                variant={viewingCondition === 'showroom' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewingCondition('showroom')}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Showroom
              </Button>
              <Button 
                variant={viewingCondition === 'sunlight' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewingCondition('sunlight')}
              >
                <Zap className="h-4 w-4 mr-1" />
                Sunlight
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
            {/* Placeholder for 3D model */}
            <div 
              className={`w-full h-[300px] rounded-lg flex items-center justify-center transition-all duration-500
                ${viewingCondition === 'daylight' ? 'bg-sky-100 dark:bg-sky-950' : 
                  viewingCondition === 'night' ? 'bg-slate-900 dark:bg-slate-950' : 
                  viewingCondition === 'rain' ? 'bg-slate-300 dark:bg-slate-800' : 
                  viewingCondition === 'showroom' ? 'bg-neutral-100 dark:bg-neutral-900' : 
                  'bg-amber-100 dark:bg-amber-950'}`}
            >
              <div className="text-center">
                <div className="text-muted-foreground mb-2">3D Model Placeholder</div>
                {finishType === 'paint' && paintType === 'factory' && selectedPaint && (
                  <div 
                    className="w-32 h-32 mx-auto rounded-full border"
                    style={{ backgroundColor: selectedPaint.hexColor }}
                  ></div>
                )}
                {finishType === 'paint' && paintType === 'custom' && (
                  <div 
                    className="w-32 h-32 mx-auto rounded-full border"
                    style={{ backgroundColor: customColor }}
                  ></div>
                )}
                {finishType === 'vinyl-wrap' && selectedWrap && (
                  <div className="w-40 h-32 mx-auto rounded overflow-hidden">
                    <img 
                      src={selectedWrap.image} 
                      alt={selectedWrap.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {finishType === 'graphics' && selectedGraphic && (
                  <div className="w-40 h-32 mx-auto rounded overflow-hidden">
                    <img 
                      src={selectedGraphic.image} 
                      alt={selectedGraphic.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {finishType === 'protection' && selectedProtection && (
                  <div className="flex flex-col items-center">
                    <Shield className="h-12 w-12 mb-2 text-primary" />
                    <Badge className="mb-1">{selectedProtection.name}</Badge>
                    <div className="text-xs text-muted-foreground">
                      {selectedProtection.durability} years protection
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                Rotate
              </Button>
              <Button variant="outline" size="sm">
                <Droplets className="h-4 w-4 mr-1" />
                Water Effect
              </Button>
              {showBeforeAfter ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowBeforeAfter(false)}
                >
                  <CircleOff className="h-4 w-4 mr-1" />
                  Hide Comparison
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowBeforeAfter(true)}
                >
                  <Layers className="h-4 w-4 mr-1" />
                  Before/After
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Right sidebar - Summary */}
        <div className="p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">Configuration Summary</h3>
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Selected Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div>
                <Label className="text-sm text-muted-foreground">Type</Label>
                <div className="font-medium">{
                  finishType === 'paint' ? 'Paint' :
                  finishType === 'vinyl-wrap' ? 'Vinyl Wrap' :
                  finishType === 'graphics' ? 'Custom Graphics' : 'Paint Protection'
                }</div>
              </div>
              
              {finishType === 'paint' && (
                <>
                  <div>
                    <Label className="text-sm text-muted-foreground">Paint Type</Label>
                    <div className="font-medium">{paintType === 'factory' ? 'Factory Color' : 'Custom Paint'}</div>
                  </div>
                  
                  {paintType === 'factory' && selectedPaint && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Color</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: selectedPaint.hexColor, border: selectedPaint.hexColor === '#FFFFFF' ? '1px solid #e2e8f0' : 'none' }}
                        />
                        <span className="font-medium">{selectedPaint.name}</span>
                        <Badge variant="outline" className="ml-auto">{selectedPaint.finish}</Badge>
                      </div>
                    </div>
                  )}
                  
                  {paintType === 'custom' && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Custom Color</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: customColor }}
                        />
                        <span className="font-medium">{customColor}</span>
                        <Badge variant="outline" className="ml-auto">{paintFinish}</Badge>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {finishType === 'vinyl-wrap' && (
                <>
                  <div>
                    <Label className="text-sm text-muted-foreground">Wrap Type</Label>
                    <div className="font-medium">{wrapType === 'full' ? 'Full Wrap' : 'Partial Wrap'}</div>
                  </div>
                  
                  {selectedWrap && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Selected Wrap</Label>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedWrap.name}</span>
                        <Badge variant="outline" className="ml-auto">{selectedWrap.finish}</Badge>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {finishType === 'graphics' && (
                <>
                  <div>
                    <Label className="text-sm text-muted-foreground">Graphic Style</Label>
                    <div className="font-medium capitalize">{graphicCategory}</div>
                  </div>
                  
                  {selectedGraphic && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Selected Graphic</Label>
                      <div className="font-medium">{selectedGraphic.name}</div>
                    </div>
                  )}
                </>
              )}
              
              {finishType === 'protection' && (
                <>
                  <div>
                    <Label className="text-sm text-muted-foreground">Protection Type</Label>
                    <div className="font-medium">{protectionType === 'ceramic' ? 'Ceramic Coating' : 'Protection Film'}</div>
                  </div>
                  
                  {selectedProtection && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Selected Product</Label>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedProtection.name}</span>
                        <Badge variant="outline" className="ml-auto">{selectedProtection.durability} years</Badge>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {selectedCenter && (
                <div>
                  <Label className="text-sm text-muted-foreground">Application Center</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedCenter.name}</span>
                    <Badge variant="outline" className="ml-auto">{renderRating(selectedCenter.rating)}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Appointment: {applicationDate}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {finishType === 'paint' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{paintType === 'custom' ? 'Custom Paint' : 'Factory Color'}</span>
                  <span className="font-medium">
                    ₹{(selectedPaint ? selectedPaint.price : (paintType === 'custom' ? 85000 : 0)).toLocaleString()}
                  </span>
                </div>
              )}
              
              {finishType === 'vinyl-wrap' && selectedWrap && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{wrapType === 'full' ? 'Full Wrap' : 'Partial Wrap'}</span>
                  <span className="font-medium">₹{selectedWrap.price.toLocaleString()}</span>
                </div>
              )}
              
              {finishType === 'graphics' && selectedGraphic && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Custom Graphics</span>
                  <span className="font-medium">₹{selectedGraphic.price.toLocaleString()}</span>
                </div>
              )}
              
              {finishType === 'protection' && selectedProtection && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{protectionType === 'ceramic' ? 'Ceramic Coating' : 'Protection Film'}</span>
                  <span className="font-medium">₹{selectedProtection.price.toLocaleString()}</span>
                </div>
              )}
              
              {(finishType === 'paint' || (finishType === 'vinyl-wrap' && wrapType === 'full')) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paint Correction & Prep</span>
                  <span className="font-medium">₹15,000</span>
                </div>
              )}
              
              {selectedCenter && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Application</span>
                  <span className="font-medium">₹{selectedCenter.price.toLocaleString()}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">EMI Option (24 months)</Label>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Payment</span>
                  <span className="font-medium">₹{getEmiAmount().toLocaleString()}/month</span>
                </div>
              </div>
              
              <div className="rounded-md bg-muted p-3 text-sm">
                <div className="font-medium mb-1 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Expected Timeline</span>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Preparation</span>
                    <span>1-2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Application</span>
                    <span>2-3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Curing</span>
                    <span>1-2 days</span>
                  </div>
                  <div className="flex justify-between font-medium text-foreground">
                    <span>Total Duration</span>
                    <span>4-7 days</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleSave}
                disabled={!((finishType === 'paint' && (selectedPaintId || paintType === 'custom')) || 
                         (finishType === 'vinyl-wrap' && selectedWrapId) ||
                         (finishType === 'graphics' && selectedGraphicId) ||
                         (finishType === 'protection' && selectedProtectionId)) ||
                         !selectedApplicationCenterId}
              >
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExteriorFinishStudio;