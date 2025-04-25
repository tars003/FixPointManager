import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Image, 
  RefreshCw, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  SaveAll,
  Camera,
  DollarSign,
  Info,
  Star,
  Palette,
  FileImage,
  Brush,
  Shapes,
  Clock,
  FolderOpen,
  Download,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Define wrap design interface
interface WrapDesign {
  id: string;
  name: string;
  category: 'solid' | 'pattern' | 'custom' | 'template';
  previewImage: string;
  colors: string[];
  price: number;
  rating: number;
  popularity: number;
}

// Define wrap application area
interface WrapArea {
  id: string;
  name: string;
  partSize: number; // in square meters
  price: number; // per square meter
  selected: boolean;
}

interface VehicleWrappingSystemProps {
  vehicleId: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleImage: string;
  onSaveDesign: (designData: any) => void;
}

const VehicleWrappingSystem: React.FC<VehicleWrappingSystemProps> = ({
  vehicleId,
  vehicleMake,
  vehicleModel,
  vehicleYear,
  vehicleImage,
  onSaveDesign
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for the wrap design
  const [designType, setDesignType] = useState<'solid' | 'pattern' | 'custom' | 'template'>('solid');
  const [selectedDesign, setSelectedDesign] = useState<WrapDesign | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6'); // Default to blue
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(100);
  const [opacity, setOpacity] = useState<number>(100);
  
  // State for the wrap application areas
  const [wrapAreas, setWrapAreas] = useState<WrapArea[]>([
    { id: 'hood', name: 'Hood', partSize: 1.8, price: 2500, selected: true },
    { id: 'roof', name: 'Roof', partSize: 2.2, price: 2500, selected: true },
    { id: 'doors', name: 'Doors (all)', partSize: 3.5, price: 2500, selected: true },
    { id: 'trunk', name: 'Trunk', partSize: 1.4, price: 2500, selected: false },
    { id: 'bumpers', name: 'Bumpers', partSize: 1.5, price: 2800, selected: false },
    { id: 'fenders', name: 'Fenders', partSize: 1.0, price: 2800, selected: false },
    { id: 'pillars', name: 'Pillars', partSize: 0.8, price: 3000, selected: false },
    { id: 'mirrors', name: 'Side Mirrors', partSize: 0.3, price: 3000, selected: false },
  ]);
  
  // Sample wrap design templates
  const designTemplates: WrapDesign[] = [
    {
      id: 'solid-black',
      name: 'Matte Black',
      category: 'solid',
      previewImage: 'https://m.media-amazon.com/images/I/71nH0v6MbUL._AC_UF894,1000_QL80_.jpg',
      colors: ['#000000', '#333333', '#666666'],
      price: 2500,
      rating: 4.8,
      popularity: 98
    },
    {
      id: 'solid-white',
      name: 'Gloss White',
      category: 'solid',
      previewImage: 'https://m.media-amazon.com/images/I/71KqptCAtZL._AC_UF894,1000_QL80_.jpg',
      colors: ['#FFFFFF', '#F8F8F8', '#EFEFEF'],
      price: 2500,
      rating: 4.7,
      popularity: 92
    },
    {
      id: 'pattern-carbon',
      name: 'Carbon Fiber',
      category: 'pattern',
      previewImage: 'https://m.media-amazon.com/images/I/817T+YD+BbL._AC_UF894,1000_QL80_.jpg',
      colors: ['#333333', '#111111'],
      price: 3000,
      rating: 4.9,
      popularity: 95
    },
    {
      id: 'pattern-camo',
      name: 'Urban Camo',
      category: 'pattern',
      previewImage: 'https://m.media-amazon.com/images/I/81K6uxdQOuL._AC_UF894,1000_QL80_.jpg',
      colors: ['#333333', '#555555', '#777777', '#999999'],
      price: 3500,
      rating: 4.6,
      popularity: 85
    },
    {
      id: 'template-racing',
      name: 'Racing Stripes',
      category: 'template',
      previewImage: 'https://i.pinimg.com/originals/fe/65/de/fe65deaf74dfd77f7afe4f872e4d249d.jpg',
      colors: ['#FF0000', '#0000FF', '#000000', '#FFFFFF'],
      price: 4000,
      rating: 4.8,
      popularity: 90
    },
    {
      id: 'template-gradient',
      name: 'Sunset Gradient',
      category: 'template',
      previewImage: 'https://i.pinimg.com/originals/1a/df/5b/1adf5b7f5da127a9b5539f7018686cea.jpg',
      colors: ['#FF5E62', '#FF9966'],
      price: 4500,
      rating: 4.7,
      popularity: 88
    }
  ];
  
  // Filter designs based on current selection
  const filteredDesigns = designTemplates.filter(design => design.category === designType);
  
  // Handle custom image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (loadEvent) => {
        setCustomImage(loadEvent.target?.result as string);
      };
      
      reader.readAsDataURL(file);
      
      toast({
        title: "Image uploaded",
        description: "Your custom design has been uploaded successfully.",
      });
    }
  };
  
  // Handle wrap area toggle
  const toggleWrapArea = (areaId: string) => {
    setWrapAreas(areas => 
      areas.map(area => 
        area.id === areaId 
          ? { ...area, selected: !area.selected } 
          : area
      )
    );
  };
  
  // Calculate total cost
  const calculateTotalCost = () => {
    // Base price from selected design
    const designPrice = selectedDesign?.price || 0;
    
    // Add cost of selected areas
    const areasCost = wrapAreas
      .filter(area => area.selected)
      .reduce((total, area) => total + (area.partSize * area.price), 0);
    
    return designPrice + areasCost;
  };
  
  // Calculate total surface area
  const calculateTotalArea = () => {
    return wrapAreas
      .filter(area => area.selected)
      .reduce((total, area) => total + area.partSize, 0);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle save design
  const handleSaveDesign = () => {
    const designData = {
      vehicleId,
      designType,
      selectedDesignId: selectedDesign?.id,
      selectedColor,
      customImage,
      rotation,
      scale,
      opacity,
      selectedAreas: wrapAreas.filter(area => area.selected).map(area => area.id),
      totalCost: calculateTotalCost(),
      totalArea: calculateTotalArea(),
      timestamp: new Date().toISOString()
    };
    
    onSaveDesign(designData);
    
    toast({
      title: "Design saved",
      description: "Your vehicle wrap design has been saved successfully.",
    });
  };
  
  // Reset design
  const resetDesign = () => {
    setSelectedDesign(null);
    setSelectedColor('#3B82F6');
    setCustomImage(null);
    setRotation(0);
    setScale(100);
    setOpacity(100);
    
    toast({
      title: "Design reset",
      description: "Your vehicle wrap design has been reset.",
    });
  };
  
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <CardHeader>
        <CardTitle>Vehicle Wrapping System</CardTitle>
        <CardDescription>
          Customize your {vehicleYear} {vehicleMake} {vehicleModel} with premium vinyl wraps
        </CardDescription>
      </CardHeader>
      
      <div className="flex flex-col lg:flex-row">
        {/* Left panel - Preview */}
        <div className="w-full lg:w-2/3 p-4 border-r">
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
              {/* Vehicle image with wrap preview overlay */}
              <div className="relative h-[400px] bg-neutral-100">
                <img 
                  src={vehicleImage} 
                  alt={`${vehicleYear} ${vehicleMake} ${vehicleModel}`}
                  className="w-full h-full object-contain"
                />
                
                {/* Wrap overlay simulation */}
                {(selectedDesign || customImage) && (
                  <div 
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: customImage 
                        ? `url(${customImage})` 
                        : selectedDesign?.previewImage 
                          ? `url(${selectedDesign.previewImage})` 
                          : 'none',
                      backgroundColor: designType === 'solid' ? selectedColor : 'transparent',
                      backgroundBlendMode: 'multiply',
                      transform: `rotate(${rotation}deg) scale(${scale / 100})`,
                      opacity: opacity / 100,
                      backgroundSize: 'cover'
                    }}
                  />
                )}
                
                {/* Highlighted areas */}
                {wrapAreas.map(area => area.selected && (
                  <div 
                    key={area.id}
                    className="absolute border-2 border-primary animate-pulse rounded-md"
                    style={{
                      // Rough positions for demonstration, would be precise in real implementation
                      ...(area.id === 'hood' ? { top: '20%', left: '20%', right: '20%', height: '10%' } : {}),
                      ...(area.id === 'roof' ? { top: '10%', left: '20%', right: '20%', height: '8%' } : {}),
                      ...(area.id === 'doors' ? { top: '35%', left: '15%', right: '15%', height: '20%' } : {}),
                      ...(area.id === 'trunk' ? { bottom: '25%', left: '30%', right: '30%', height: '10%' } : {}),
                      ...(area.id === 'bumpers' ? { bottom: '15%', left: '20%', right: '20%', height: '8%' } : {})
                    }}
                  />
                ))}
              </div>
              
              {/* Controls overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-card/90 p-2 rounded-md border shadow-md flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setRotation(prev => prev - 15)}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setRotation(prev => prev + 15)}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setScale(prev => Math.min(prev + 10, 150))}>
                  <Layers className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setScale(prev => Math.max(prev - 10, 50))}>
                  <Layers className="h-4 w-4 transform rotate-180" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setOpacity(prev => Math.min(prev + 10, 100))}>
                  <Palette className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setOpacity(prev => Math.max(prev - 10, 30))}>
                  <Palette className="h-4 w-4 opacity-50" />
                </Button>
                <Button variant="outline" size="sm" onClick={resetDesign}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  // Would take screenshot in real implementation
                  toast({
                    title: "Screenshot taken",
                    description: "Screenshot saved to your gallery.",
                  });
                }}>
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Rotation: {rotation}°</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 p-1" 
                  onClick={() => setRotation(0)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[rotation]}
                min={-180}
                max={180}
                step={5}
                onValueChange={(values) => setRotation(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Scale: {scale}%</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 p-1" 
                  onClick={() => setScale(100)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[scale]}
                min={50}
                max={150}
                step={5}
                onValueChange={(values) => setScale(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Opacity: {opacity}%</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 p-1" 
                  onClick={() => setOpacity(100)}
                >
                  Reset
                </Button>
              </div>
              <Slider
                value={[opacity]}
                min={30}
                max={100}
                step={5}
                onValueChange={(values) => setOpacity(values[0])}
              />
            </div>
          </div>
        </div>
        
        {/* Right panel - Design options */}
        <div className="w-full lg:w-1/3 p-4">
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="design" className="flex-1">Design</TabsTrigger>
              <TabsTrigger value="areas" className="flex-1">Areas</TabsTrigger>
              <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
            </TabsList>
            
            {/* Design tab */}
            <TabsContent value="design" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Select Wrap Type</h3>
                <RadioGroup 
                  value={designType}
                  onValueChange={(value) => setDesignType(value as any)}
                  className="grid grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solid" id="solid" />
                    <Label htmlFor="solid" className="flex items-center">
                      <Palette className="h-4 w-4 mr-1" />
                      Solid Color
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pattern" id="pattern" />
                    <Label htmlFor="pattern" className="flex items-center">
                      <Shapes className="h-4 w-4 mr-1" />
                      Pattern
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="flex items-center">
                      <FileImage className="h-4 w-4 mr-1" />
                      Custom Image
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="template" id="template" />
                    <Label htmlFor="template" className="flex items-center">
                      <Brush className="h-4 w-4 mr-1" />
                      Templates
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Solid color picker */}
              {designType === 'solid' && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Select Color</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
                     '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#808080'].map(color => (
                      <div 
                        key={color}
                        className={`h-8 w-full rounded-md cursor-pointer transition-all ${
                          selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm mr-2">Custom:</span>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}
              
              {/* Pattern/Template selection */}
              {(designType === 'pattern' || designType === 'template') && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Select Design</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                    {filteredDesigns.map(design => (
                      <Card 
                        key={design.id}
                        className={`cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                          selectedDesign?.id === design.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedDesign(design)}
                      >
                        <div className="h-24 overflow-hidden">
                          <img 
                            src={design.previewImage} 
                            alt={design.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-2">
                          <p className="text-xs font-medium">{design.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs ml-1">{design.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{formatCurrency(design.price)}/m²</span>
                          </div>
                          
                          {/* Color options if applicable */}
                          {design.colors.length > 0 && (
                            <div className="flex mt-1 space-x-1">
                              {design.colors.slice(0, 4).map(color => (
                                <div 
                                  key={color}
                                  className={`h-3 w-3 rounded-full cursor-pointer ${
                                    selectedColor === color ? 'ring-1 ring-primary' : ''
                                  }`}
                                  style={{ backgroundColor: color }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedColor(color);
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Custom image upload */}
              {designType === 'custom' && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Upload Custom Image</h3>
                  <Card>
                    <CardContent className="p-4">
                      {customImage ? (
                        <div className="space-y-4">
                          <div className="relative h-40 overflow-hidden rounded-md">
                            <img 
                              src={customImage} 
                              alt="Custom design" 
                              className="w-full h-full object-cover"
                            />
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="absolute top-2 right-2" 
                              onClick={() => setCustomImage(null)}
                            >
                              Remove
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            You can adjust position, scale, and rotation using the controls below the preview.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-40 space-y-4 border-2 border-dashed rounded-md">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <div className="text-center">
                            <p className="text-sm font-medium">Click to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              SVG, PNG, JPG (max. 10MB)
                            </p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <Button 
                            variant="outline" 
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Browse Files
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            {/* Areas tab */}
            <TabsContent value="areas" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Select Wrap Areas</h3>
                <p className="text-sm text-muted-foreground">
                  Choose which parts of your vehicle you want to apply the wrap to.
                </p>
                
                <div className="grid gap-2 max-h-[350px] overflow-y-auto pr-2">
                  {wrapAreas.map(area => (
                    <Card 
                      key={area.id}
                      className={`cursor-pointer ${area.selected ? 'border-primary' : ''}`}
                      onClick={() => toggleWrapArea(area.id)}
                    >
                      <CardContent className="p-3 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-sm">{area.name}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                            <Layers className="h-3 w-3 mr-1" />
                            <span>{area.partSize} m²</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(area.price)}</p>
                          <p className="text-xs text-muted-foreground">per m²</p>
                        </div>
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          area.selected ? 'bg-primary text-white' : 'bg-muted'
                        }`}>
                          {area.selected && <CheckCircle2 className="h-4 w-4" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Surface Area:</span>
                  <span className="font-semibold">{calculateTotalArea().toFixed(1)} m²</span>
                </div>
              </div>
            </TabsContent>
            
            {/* Summary tab */}
            <TabsContent value="summary" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Design Summary</h3>
                
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Vehicle:</span>
                        <span className="text-sm font-medium">{vehicleYear} {vehicleMake} {vehicleModel}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Design Type:</span>
                        <span className="text-sm font-medium capitalize">{designType}</span>
                      </div>
                      
                      {selectedDesign && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Design Name:</span>
                          <span className="text-sm font-medium">{selectedDesign.name}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Areas Selected:</span>
                        <span className="text-sm font-medium">{wrapAreas.filter(a => a.selected).length}/{wrapAreas.length}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Surface Area:</span>
                        <span className="text-sm font-medium">{calculateTotalArea().toFixed(1)} m²</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Cost Breakdown</h4>
                      
                      {selectedDesign && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Design Price:</span>
                          <span className="text-sm">{formatCurrency(selectedDesign.price)}</span>
                        </div>
                      )}
                      
                      {wrapAreas.filter(a => a.selected).map(area => (
                        <div key={area.id} className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{area.name} ({area.partSize} m²):</span>
                          <span className="text-sm">{formatCurrency(area.partSize * area.price)}</span>
                        </div>
                      ))}
                      
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total Estimated Cost:</span>
                        <span>{formatCurrency(calculateTotalCost())}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Installation Details</h4>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">Estimated completion time: 2-3 days</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Info className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">Professional installation recommended</span>
                      </div>
                      
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">3-year warranty on materials and installation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" onClick={resetDesign}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Design
                  </Button>
                  <Button className="flex-1" onClick={handleSaveDesign}>
                    <SaveAll className="h-4 w-4 mr-2" />
                    Save Design
                  </Button>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Design
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VehicleWrappingSystem;