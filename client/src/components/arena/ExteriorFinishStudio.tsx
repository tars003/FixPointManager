import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Heart, Plus, Check, ArrowRight, Sparkles, Palette, Droplet, ShoppingCart } from 'lucide-react';
import AccessibilityColorChecker from './AccessibilityColorChecker';

interface ColorOption {
  id: string;
  name: string;
  hex: string;
  type: 'standard' | 'metallic' | 'matte' | 'special' | 'wrap';
  price: number;
  popular?: boolean;
  new?: boolean;
  adjustments?: {
    metallic?: number;
    roughness?: number;
    clearcoat?: number;
  };
}

interface WrapOption {
  id: string;
  name: string;
  type: 'wrap';
  textureUrl: string;
  thumbnailUrl: string;
  price: number;
  popular?: boolean;
  new?: boolean;
  categories?: string[];
}

interface GraphicsOption {
  id: string;
  name: string;
  type: 'graphics';
  decalUrl: string;
  thumbnailUrl: string;
  price: number;
  position?: 'hood' | 'side' | 'roof' | 'rear';
  popular?: boolean;
  new?: boolean;
}

interface CustomizationItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface ExteriorFinishStudioProps {
  onAddItem: (item: CustomizationItem) => void;
  vehicleType: string;
  formatPrice: (price: number) => string;
}

// Sample paint colors
const paintColors: ColorOption[] = [
  // Standard colors
  { id: 'white', name: 'Alpine White', hex: '#FFFFFF', type: 'standard', price: 0 },
  { id: 'black', name: 'Jet Black', hex: '#000000', type: 'standard', price: 0 },
  { id: 'red', name: 'Melbourne Red', hex: '#C80815', type: 'standard', price: 0, popular: true },
  { id: 'blue', name: 'Portimao Blue', hex: '#1E3A8A', type: 'standard', price: 0 },
  
  // Metallic colors
  { id: 'silver-metallic', name: 'Glacier Silver', hex: '#C8C8C8', type: 'metallic', price: 75000, adjustments: { metallic: 0.8, roughness: 0.2, clearcoat: 0.9 } },
  { id: 'gray-metallic', name: 'Brooklyn Grey', hex: '#5A5A5A', type: 'metallic', price: 75000, popular: true, adjustments: { metallic: 0.7, roughness: 0.2, clearcoat: 0.85 } },
  { id: 'blue-metallic', name: 'Tanzanite Blue', hex: '#18346E', type: 'metallic', price: 95000, adjustments: { metallic: 0.75, roughness: 0.15, clearcoat: 0.9 } },
  { id: 'green-metallic', name: 'Aventurine Green', hex: '#1F3935', type: 'metallic', price: 95000, new: true, adjustments: { metallic: 0.7, roughness: 0.25, clearcoat: 0.8 } },
  
  // Matte colors
  { id: 'black-matte', name: 'Frozen Black', hex: '#1A1A1A', type: 'matte', price: 185000, adjustments: { metallic: 0, roughness: 0.8, clearcoat: 0.1 } },
  { id: 'gray-matte', name: 'Frozen Deep Grey', hex: '#3C3C3C', type: 'matte', price: 185000, new: true, popular: true, adjustments: { metallic: 0, roughness: 0.85, clearcoat: 0.1 } },
  { id: 'blue-matte', name: 'Frozen Marina Bay', hex: '#2B4F6A', type: 'matte', price: 215000, new: true, adjustments: { metallic: 0, roughness: 0.8, clearcoat: 0.15 } },
  
  // Special colors
  { id: 'gold-special', name: 'Vegas Gold', hex: '#C5B358', type: 'special', price: 315000, adjustments: { metallic: 0.9, roughness: 0.1, clearcoat: 1 } },
  { id: 'purple-special', name: 'Twilight Purple', hex: '#4E2A84', type: 'special', price: 335000, new: true, adjustments: { metallic: 0.85, roughness: 0.15, clearcoat: 0.95 } },
  { id: 'green-special', name: 'British Racing Green', hex: '#004225', type: 'special', price: 315000, adjustments: { metallic: 0.75, roughness: 0.2, clearcoat: 0.9 } },
];

// Vehicle wraps
const vehicleWraps: WrapOption[] = [
  { id: 'carbon-fiber', name: 'Carbon Fiber', type: 'wrap', textureUrl: '/textures/carbon-fiber.jpg', thumbnailUrl: '/textures/thumbs/carbon-fiber.jpg', price: 145000, popular: true, categories: ['performance'] },
  { id: 'matte-black', name: 'Matte Black', type: 'wrap', textureUrl: '/textures/matte-black.jpg', thumbnailUrl: '/textures/thumbs/matte-black.jpg', price: 120000, categories: ['stealth'] },
  { id: 'brushed-metal', name: 'Brushed Aluminum', type: 'wrap', textureUrl: '/textures/brushed-metal.jpg', thumbnailUrl: '/textures/thumbs/brushed-metal.jpg', price: 165000, categories: ['luxury'] },
  { id: 'chrome-silver', name: 'Chrome Silver', type: 'wrap', textureUrl: '/textures/chrome.jpg', thumbnailUrl: '/textures/thumbs/chrome.jpg', price: 195000, categories: ['premium'] },
  { id: 'satin-pearl', name: 'Satin Pearl', type: 'wrap', textureUrl: '/textures/satin-pearl.jpg', thumbnailUrl: '/textures/thumbs/satin-pearl.jpg', price: 185000, new: true, categories: ['luxury'] },
  { id: 'color-shift', name: 'Color Shift Galaxy', type: 'wrap', textureUrl: '/textures/color-shift.jpg', thumbnailUrl: '/textures/thumbs/color-shift.jpg', price: 225000, new: true, popular: true, categories: ['premium'] },
];

// Racing graphics
const racingGraphics: GraphicsOption[] = [
  { id: 'racing-stripe-black', name: 'Racing Stripe - Black', type: 'graphics', decalUrl: '/graphics/racing-stripe-black.png', thumbnailUrl: '/graphics/thumbs/racing-stripe-black.jpg', price: 45000, position: 'hood', popular: true },
  { id: 'racing-stripe-white', name: 'Racing Stripe - White', type: 'graphics', decalUrl: '/graphics/racing-stripe-white.png', thumbnailUrl: '/graphics/thumbs/racing-stripe-white.jpg', price: 45000, position: 'hood' },
  { id: 'side-stripe', name: 'Side Sport Stripe', type: 'graphics', decalUrl: '/graphics/side-stripe.png', thumbnailUrl: '/graphics/thumbs/side-stripe.jpg', price: 55000, position: 'side' },
  { id: 'checkered-flag', name: 'Checkered Flag', type: 'graphics', decalUrl: '/graphics/checkered-flag.png', thumbnailUrl: '/graphics/thumbs/checkered-flag.jpg', price: 65000, position: 'roof', new: true },
  { id: 'heritage-livery', name: 'Heritage Livery', type: 'graphics', decalUrl: '/graphics/heritage-livery.png', thumbnailUrl: '/graphics/thumbs/heritage-livery.jpg', price: 125000, position: 'side', new: true, popular: true },
];

const ExteriorFinishStudio: React.FC<ExteriorFinishStudioProps> = ({ 
  onAddItem, 
  vehicleType,
  formatPrice 
}) => {
  const [activeTab, setActiveTab] = useState('paint');
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedWrap, setSelectedWrap] = useState<WrapOption | null>(null);
  const [selectedGraphics, setSelectedGraphics] = useState<GraphicsOption | null>(null);
  const [likedColors, setLikedColors] = useState<string[]>([]);
  const [likedWraps, setLikedWraps] = useState<string[]>([]);
  const [likedGraphics, setLikedGraphics] = useState<string[]>([]);
  
  // PBR material adjustments
  const [metallicValue, setMetallicValue] = useState(0.5);
  const [roughnessValue, setRoughnessValue] = useState(0.2);
  const [clearcoatValue, setClearcoatValue] = useState(0.8);
  
  // Update material values when a color is selected
  useEffect(() => {
    if (selectedColor && selectedColor.adjustments) {
      const { metallic, roughness, clearcoat } = selectedColor.adjustments;
      if (metallic !== undefined) setMetallicValue(metallic);
      if (roughness !== undefined) setRoughnessValue(roughness);
      if (clearcoat !== undefined) setClearcoatValue(clearcoat);
    }
  }, [selectedColor]);
  
  // Handle color selection
  const handleSelectColor = (color: ColorOption) => {
    setSelectedColor(color);
    
    if (activeTab === 'paint') {
      setSelectedWrap(null);
      
      onAddItem({
        id: `color-${color.id}`,
        name: color.name,
        category: `Paint (${color.type})`,
        price: color.price
      });
    }
  };
  
  // Handle wrap selection
  const handleSelectWrap = (wrap: WrapOption) => {
    setSelectedWrap(wrap);
    setSelectedColor(null);
    
    onAddItem({
      id: `wrap-${wrap.id}`,
      name: wrap.name,
      category: 'Vehicle Wrap',
      price: wrap.price
    });
  };
  
  // Handle graphics selection
  const handleSelectGraphics = (graphics: GraphicsOption) => {
    setSelectedGraphics(graphics);
    
    onAddItem({
      id: `graphics-${graphics.id}`,
      name: graphics.name,
      category: 'Racing Graphics',
      price: graphics.price
    });
  };
  
  // Toggle color likes
  const handleToggleColorLike = (colorId: string) => {
    if (likedColors.includes(colorId)) {
      setLikedColors(likedColors.filter(id => id !== colorId));
    } else {
      setLikedColors([...likedColors, colorId]);
    }
  };
  
  // Toggle wrap likes
  const handleToggleWrapLike = (wrapId: string) => {
    if (likedWraps.includes(wrapId)) {
      setLikedWraps(likedWraps.filter(id => id !== wrapId));
    } else {
      setLikedWraps([...likedWraps, wrapId]);
    }
  };
  
  // Toggle graphics likes
  const handleToggleGraphicsLike = (graphicsId: string) => {
    if (likedGraphics.includes(graphicsId)) {
      setLikedGraphics(likedGraphics.filter(id => id !== graphicsId));
    } else {
      setLikedGraphics([...likedGraphics, graphicsId]);
    }
  };
  
  // Get colors filtered by type
  const getFilteredColors = (type: 'standard' | 'metallic' | 'matte' | 'special') => {
    return paintColors.filter(color => color.type === type);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          Exterior Finish Studio
        </h2>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Palette className="h-4 w-4" />
                  Advanced
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Advanced color customization</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <AccessibilityColorChecker />
        </div>
      </div>
      
      <Tabs defaultValue="paint" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="paint" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Droplet className="h-4 w-4 mr-2" />
            Paint
          </TabsTrigger>
          <TabsTrigger value="wraps" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Layers className="h-4 w-4 mr-2" />
            Vehicle Wraps
          </TabsTrigger>
          <TabsTrigger value="graphics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Sparkles className="h-4 w-4 mr-2" />
            Graphics & Decals
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="paint" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Color Groups */}
            <div className="space-y-6">
              {/* Standard Colors */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Standard Colors</h3>
                  <Badge variant="outline" className="text-blue-600">Included</Badge>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {getFilteredColors('standard').map(color => (
                    <button
                      key={color.id}
                      className={`relative rounded-lg overflow-hidden h-16 transition-all ${
                        selectedColor?.id === color.id ? 'ring-2 ring-blue-500 shadow-lg scale-105' : 'hover:scale-105'
                      }`}
                      onClick={() => handleSelectColor(color)}
                    >
                      <div 
                        className="absolute inset-0" 
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.popular && (
                        <Badge className="absolute top-1 right-1 bg-blue-500 text-[10px] py-0 px-1.5">Popular</Badge>
                      )}
                      {color.new && (
                        <Badge className="absolute top-1 right-1 bg-orange-500 text-[10px] py-0 px-1.5">New</Badge>
                      )}
                      {selectedColor?.id === color.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/70 backdrop-blur-sm rounded-full p-1">
                            <Check className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute bottom-1 right-1 h-6 w-6 ${
                          likedColors.includes(color.id) ? 'text-red-500' : 'text-gray-100 hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleColorLike(color.id);
                        }}
                      >
                        <Heart className={`h-3 w-3 ${likedColors.includes(color.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Metallic Colors */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Metallic Finishes</h3>
                  <Badge variant="outline" className="text-indigo-600">Premium</Badge>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {getFilteredColors('metallic').map(color => (
                    <button
                      key={color.id}
                      className={`relative rounded-lg overflow-hidden h-16 transition-all ${
                        selectedColor?.id === color.id ? 'ring-2 ring-blue-500 shadow-lg scale-105' : 'hover:scale-105'
                      }`}
                      onClick={() => handleSelectColor(color)}
                    >
                      <div 
                        className="absolute inset-0" 
                        style={{ 
                          backgroundColor: color.hex,
                          backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)',
                          backgroundSize: '4px 4px'
                        }}
                      />
                      <Badge className="absolute bottom-1 left-1 bg-white/70 backdrop-blur-sm text-gray-800 text-[10px] py-0 px-1.5">
                        {formatPrice(color.price)}
                      </Badge>
                      {color.popular && (
                        <Badge className="absolute top-1 right-1 bg-blue-500 text-[10px] py-0 px-1.5">Popular</Badge>
                      )}
                      {color.new && (
                        <Badge className="absolute top-1 right-1 bg-orange-500 text-[10px] py-0 px-1.5">New</Badge>
                      )}
                      {selectedColor?.id === color.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/70 backdrop-blur-sm rounded-full p-1">
                            <Check className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute bottom-1 right-1 h-6 w-6 ${
                          likedColors.includes(color.id) ? 'text-red-500' : 'text-gray-100 hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleColorLike(color.id);
                        }}
                      >
                        <Heart className={`h-3 w-3 ${likedColors.includes(color.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Matte Colors */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Matte Finishes</h3>
                  <Badge variant="outline" className="text-purple-600">Exclusive</Badge>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {getFilteredColors('matte').map(color => (
                    <button
                      key={color.id}
                      className={`relative rounded-lg overflow-hidden h-16 transition-all ${
                        selectedColor?.id === color.id ? 'ring-2 ring-blue-500 shadow-lg scale-105' : 'hover:scale-105'
                      }`}
                      onClick={() => handleSelectColor(color)}
                    >
                      <div 
                        className="absolute inset-0" 
                        style={{ 
                          backgroundColor: color.hex,
                          backgroundImage: 'none'
                        }}
                      />
                      <Badge className="absolute bottom-1 left-1 bg-white/70 backdrop-blur-sm text-gray-800 text-[10px] py-0 px-1.5">
                        {formatPrice(color.price)}
                      </Badge>
                      {color.popular && (
                        <Badge className="absolute top-1 right-1 bg-blue-500 text-[10px] py-0 px-1.5">Popular</Badge>
                      )}
                      {color.new && (
                        <Badge className="absolute top-1 right-1 bg-orange-500 text-[10px] py-0 px-1.5">New</Badge>
                      )}
                      {selectedColor?.id === color.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/70 backdrop-blur-sm rounded-full p-1">
                            <Check className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute bottom-1 right-1 h-6 w-6 ${
                          likedColors.includes(color.id) ? 'text-red-500' : 'text-gray-100 hover:text-white'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleColorLike(color.id);
                        }}
                      >
                        <Heart className={`h-3 w-3 ${likedColors.includes(color.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Selected Color Details */}
            <div className="border border-blue-100 rounded-xl overflow-hidden">
              {selectedColor ? (
                <div className="h-full flex flex-col">
                  <div 
                    className="h-1/3 w-full" 
                    style={{ 
                      backgroundColor: selectedColor.hex,
                      backgroundImage: selectedColor.type === 'metallic' 
                        ? 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)'
                        : 'none',
                      backgroundSize: '4px 4px'
                    }}
                  />
                  <div className="flex-1 p-6 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{selectedColor.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{selectedColor.type} Finish</p>
                      </div>
                      <Badge variant={selectedColor.price > 0 ? 'default' : 'outline'} className="text-sm">
                        {selectedColor.price > 0 ? formatPrice(selectedColor.price) : 'Included'}
                      </Badge>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium mb-2">Finish Settings</h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Metallic</label>
                          <span className="text-xs bg-gray-100 rounded px-2 py-0.5">{Math.round(metallicValue * 100)}%</span>
                        </div>
                        <Slider
                          value={[metallicValue * 100]}
                          max={100}
                          step={1}
                          onValueChange={(value) => setMetallicValue(value[0] / 100)}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Roughness</label>
                          <span className="text-xs bg-gray-100 rounded px-2 py-0.5">{Math.round(roughnessValue * 100)}%</span>
                        </div>
                        <Slider
                          value={[roughnessValue * 100]}
                          max={100}
                          step={1}
                          onValueChange={(value) => setRoughnessValue(value[0] / 100)}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Clearcoat</label>
                          <span className="text-xs bg-gray-100 rounded px-2 py-0.5">{Math.round(clearcoatValue * 100)}%</span>
                        </div>
                        <Slider
                          value={[clearcoatValue * 100]}
                          max={100}
                          step={1}
                          onValueChange={(value) => setClearcoatValue(value[0] / 100)}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        onClick={() => onAddItem({
                          id: `color-${selectedColor.id}`,
                          name: selectedColor.name,
                          category: `Paint (${selectedColor.type})`,
                          price: selectedColor.price
                        })}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Apply Selection
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Palette className="h-12 w-12 text-blue-200 mb-4" />
                  <h3 className="font-medium text-lg mb-1">No Color Selected</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Select a color from the left panel to see details
                  </p>
                  <Button variant="outline" className="text-blue-600" onClick={() => handleSelectColor(paintColors[0])}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Try Alpine White
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="wraps" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Wraps List */}
            <div className="space-y-4">
              <h3 className="font-medium">Premium Vehicle Wraps</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {vehicleWraps.map(wrap => (
                  <div
                    key={wrap.id}
                    className={`relative rounded-lg overflow-hidden border transition-all ${
                      selectedWrap?.id === wrap.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-video bg-gray-100">
                      {/* This would be an actual texture preview image in production */}
                      <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                        Texture Preview
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{wrap.name}</h4>
                          <p className="text-gray-500 text-xs">{formatPrice(wrap.price)}</p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 ${
                            likedWraps.includes(wrap.id) ? 'text-red-500' : 'text-gray-400 hover:text-gray-500'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWrapLike(wrap.id);
                          }}
                        >
                          <Heart className={`h-3 w-3 ${likedWraps.includes(wrap.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-2">
                        {wrap.categories?.map(category => (
                          <Badge
                            key={category}
                            variant="outline"
                            className="text-[10px] py-0 px-1.5 bg-gray-50"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 text-xs"
                        onClick={() => handleSelectWrap(wrap)}
                      >
                        {selectedWrap?.id === wrap.id ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Selected
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Select
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {wrap.popular && (
                      <Badge className="absolute top-2 left-2 bg-blue-500 text-[10px] py-0 px-1.5">Popular</Badge>
                    )}
                    {wrap.new && (
                      <Badge className="absolute top-2 left-2 bg-orange-500 text-[10px] py-0 px-1.5">New</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Selected Wrap Details */}
            <div className="border border-blue-100 rounded-xl overflow-hidden">
              {selectedWrap ? (
                <div className="h-full flex flex-col">
                  <div className="h-1/3 w-full flex items-center justify-center bg-gray-100">
                    {/* This would be an actual wrap preview in production */}
                    <div className="text-lg font-medium text-gray-400">
                      {selectedWrap.name} Preview
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{selectedWrap.name}</h3>
                        <p className="text-sm text-gray-500">Premium Vehicle Wrap</p>
                      </div>
                      <Badge variant="default" className="text-sm">
                        {formatPrice(selectedWrap.price)}
                      </Badge>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedWrap.categories?.map(category => (
                          <Badge
                            key={category}
                            variant="outline"
                            className="bg-gray-50 capitalize"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-700 mb-2">Premium Wrap Benefits</h4>
                        <ul className="text-sm space-y-1 text-blue-900">
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            Protected original paint
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            5 year warranty
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            UV and scratch resistant
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            Fully reversible
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        onClick={() => onAddItem({
                          id: `wrap-${selectedWrap.id}`,
                          name: selectedWrap.name,
                          category: 'Vehicle Wrap',
                          price: selectedWrap.price
                        })}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Apply Wrap
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Layers className="h-12 w-12 text-blue-200 mb-4" />
                  <h3 className="font-medium text-lg mb-1">No Wrap Selected</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Choose a premium vehicle wrap from the left panel
                  </p>
                  <Button variant="outline" className="text-blue-600" onClick={() => handleSelectWrap(vehicleWraps[0])}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Try Carbon Fiber
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="graphics" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Graphics List */}
            <div className="space-y-4">
              <h3 className="font-medium">Racing & Sport Graphics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {racingGraphics.map(graphic => (
                  <div
                    key={graphic.id}
                    className={`relative rounded-lg overflow-hidden border transition-all ${
                      selectedGraphics?.id === graphic.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-video bg-gray-100">
                      {/* This would be an actual graphic preview image in production */}
                      <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                        {graphic.position} graphic
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{graphic.name}</h4>
                          <p className="text-gray-500 text-xs">{formatPrice(graphic.price)}</p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 ${
                            likedGraphics.includes(graphic.id) ? 'text-red-500' : 'text-gray-400 hover:text-gray-500'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleGraphicsLike(graphic.id);
                          }}
                        >
                          <Heart className={`h-3 w-3 ${likedGraphics.includes(graphic.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 px-1.5 bg-gray-50 mt-2 capitalize"
                      >
                        {graphic.position}
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 text-xs"
                        onClick={() => handleSelectGraphics(graphic)}
                      >
                        {selectedGraphics?.id === graphic.id ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Selected
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Select
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {graphic.popular && (
                      <Badge className="absolute top-2 left-2 bg-blue-500 text-[10px] py-0 px-1.5">Popular</Badge>
                    )}
                    {graphic.new && (
                      <Badge className="absolute top-2 left-2 bg-orange-500 text-[10px] py-0 px-1.5">New</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Selected Graphics Details */}
            <div className="border border-blue-100 rounded-xl overflow-hidden">
              {selectedGraphics ? (
                <div className="h-full flex flex-col">
                  <div className="h-1/3 w-full flex items-center justify-center bg-gray-100">
                    {/* This would be an actual graphics preview in production */}
                    <div className="text-lg font-medium text-gray-400">
                      {selectedGraphics.name} Preview
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{selectedGraphics.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{selectedGraphics.position} Racing Graphic</p>
                      </div>
                      <Badge variant="default" className="text-sm">
                        {formatPrice(selectedGraphics.price)}
                      </Badge>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-gray-50 capitalize">
                          {selectedGraphics.position} placement
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50">
                          Premium material
                        </Badge>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-700 mb-2">Installation Details</h4>
                        <ul className="text-sm space-y-1 text-blue-900">
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            Professional application included
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            UV and weather resistant
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            Custom sizing available
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-3 w-3" />
                            3 year warranty
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        onClick={() => onAddItem({
                          id: `graphics-${selectedGraphics.id}`,
                          name: selectedGraphics.name,
                          category: 'Racing Graphics',
                          price: selectedGraphics.price
                        })}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Apply Graphics
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Sparkles className="h-12 w-12 text-blue-200 mb-4" />
                  <h3 className="font-medium text-lg mb-1">No Graphics Selected</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Choose racing graphics from the left panel
                  </p>
                  <Button variant="outline" className="text-blue-600" onClick={() => handleSelectGraphics(racingGraphics[0])}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Try Racing Stripes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExteriorFinishStudio;