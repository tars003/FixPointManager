import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  PaintBucket, 
  Sparkles, 
  Droplets,
  Palette
} from 'lucide-react';

// Color types
type ColorFinish = 'gloss' | 'matte' | 'metallic' | 'pearlescent' | 'satin';

interface ColorOption {
  id: string;
  name: string;
  hex: string;
  finish?: ColorFinish;
  premium?: boolean;
  new?: boolean;
}

// Color finish descriptions
const finishDescriptions: Record<ColorFinish, string> = {
  gloss: 'Bright and reflective, traditional glossy appearance',
  matte: 'Non-reflective with a smooth, flat appearance',
  metallic: 'Contains metal flakes for a sparkling effect in sunlight',
  pearlescent: 'Contains ceramic crystals for a color-shifting iridescent effect',
  satin: 'Semi-gloss with a subtle sheen and smooth texture'
};

interface EnhancedColorSelectorProps {
  onSelectColor: (hex: string, finish?: ColorFinish) => void;
  defaultColor?: string;
  defaultFinish?: ColorFinish;
}

const EnhancedColorSelector: React.FC<EnhancedColorSelectorProps> = ({
  onSelectColor,
  defaultColor = '#1E40AF',
  defaultFinish = 'gloss'
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  const [selectedFinish, setSelectedFinish] = useState<ColorFinish>(defaultFinish);
  
  // Standard colors
  const standardColors: ColorOption[] = [
    { id: 'white', name: 'White', hex: '#FFFFFF' },
    { id: 'black', name: 'Black', hex: '#000000' },
    { id: 'silver', name: 'Silver', hex: '#C0C0C0' },
    { id: 'gray', name: 'Gray', hex: '#808080' },
    { id: 'red', name: 'Racing Red', hex: '#FF0000' },
    { id: 'blue', name: 'Royal Blue', hex: '#1E40AF' },
    { id: 'green', name: 'Emerald Green', hex: '#10B981' },
    { id: 'yellow', name: 'Canary Yellow', hex: '#FFDD00' }
  ];
  
  // Premium colors
  const premiumColors: ColorOption[] = [
    { id: 'midnight-purple', name: 'Midnight Purple', hex: '#5B21B6', premium: true },
    { id: 'british-racing-green', name: 'British Racing Green', hex: '#004225', premium: true },
    { id: 'sunset-orange', name: 'Sunset Orange', hex: '#FF5E3A', premium: true, new: true },
    { id: 'ice-silver', name: 'Ice Silver', hex: '#E5E7EB', premium: true, finish: 'metallic' },
    { id: 'burgundy', name: 'Burgundy', hex: '#800020', premium: true },
    { id: 'teal', name: 'Teal Blue', hex: '#0D9488', premium: true, new: true },
    { id: 'bronze', name: 'Bronze', hex: '#CD7F32', premium: true, finish: 'metallic' },
    { id: 'rose-gold', name: 'Rose Gold', hex: '#B76E79', premium: true, finish: 'pearlescent' }
  ];
  
  // Special colors
  const specialColors: ColorOption[] = [
    { id: 'galaxy-black', name: 'Galaxy Black', hex: '#0A0A0A', finish: 'pearlescent', premium: true },
    { id: 'northern-lights', name: 'Northern Lights', hex: '#3A506B', finish: 'pearlescent', premium: true, new: true },
    { id: 'chameleon', name: 'Chameleon', hex: '#5E8B7E', finish: 'pearlescent', premium: true },
    { id: 'carbon-fiber', name: 'Carbon Fiber', hex: '#1A1A1A', finish: 'satin', premium: true }
  ];
  
  // Combines standard, premium, and special colors
  const allColors = [...standardColors, ...premiumColors, ...specialColors];
  
  // Handle color selection
  const handleColorSelect = (colorHex: string, finish?: ColorFinish) => {
    setSelectedColor(colorHex);
    if (finish) {
      setSelectedFinish(finish);
    }
    onSelectColor(colorHex, finish || selectedFinish);
  };
  
  // Handle finish selection
  const handleFinishSelect = (finish: ColorFinish) => {
    setSelectedFinish(finish);
    onSelectColor(selectedColor, finish);
  };
  
  // Define variants for motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standard">
            <PaintBucket className="h-4 w-4 mr-2" />
            Standard
          </TabsTrigger>
          <TabsTrigger value="premium">
            <Sparkles className="h-4 w-4 mr-2" />
            Premium
          </TabsTrigger>
          <TabsTrigger value="special">
            <Palette className="h-4 w-4 mr-2" />
            Special
          </TabsTrigger>
        </TabsList>
        
        {/* Standard Colors */}
        <TabsContent value="standard">
          <motion.div 
            className="grid grid-cols-4 gap-3 py-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {standardColors.map((color) => (
              <motion.div
                key={color.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  type="button"
                  onClick={() => handleColorSelect(color.hex, color.finish)}
                  className={`
                    w-full aspect-square rounded-md transition-all duration-200 relative 
                    ${selectedColor === color.hex ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-inset ring-border hover:ring-primary/50'}
                  `}
                  style={{ 
                    backgroundColor: color.hex,
                    boxShadow: color.hex === '#FFFFFF' ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : ''
                  }}
                  aria-label={color.name}
                >
                  {selectedColor === color.hex && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`h-2 w-2 rounded-full ${color.hex === '#FFFFFF' ? 'bg-black' : 'bg-white'}`}></span>
                    </span>
                  )}
                </button>
                <p className="text-center text-xs mt-1">{color.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        
        {/* Premium Colors */}
        <TabsContent value="premium">
          <motion.div 
            className="grid grid-cols-4 gap-3 py-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {premiumColors.map((color) => (
              <motion.div
                key={color.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  type="button"
                  onClick={() => handleColorSelect(color.hex, color.finish)}
                  className={`
                    w-full aspect-square rounded-md transition-all duration-200 relative 
                    ${selectedColor === color.hex ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-inset ring-border hover:ring-primary/50'}
                  `}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                >
                  {selectedColor === color.hex && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-white"></span>
                    </span>
                  )}
                  
                  {color.premium && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">₹</span>
                    </span>
                  )}
                  
                  {color.new && (
                    <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">N</span>
                    </span>
                  )}
                </button>
                <p className="text-center text-xs mt-1">{color.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        
        {/* Special Colors */}
        <TabsContent value="special">
          <motion.div 
            className="grid grid-cols-4 gap-3 py-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {specialColors.map((color) => (
              <motion.div
                key={color.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  type="button"
                  onClick={() => handleColorSelect(color.hex, color.finish)}
                  className={`
                    w-full aspect-square rounded-md transition-all duration-200 relative 
                    ${selectedColor === color.hex ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-inset ring-border hover:ring-primary/50'}
                  `}
                  style={{ backgroundColor: color.hex }}
                  aria-label={color.name}
                >
                  {selectedColor === color.hex && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-white"></span>
                    </span>
                  )}
                  
                  {color.premium && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">₹</span>
                    </span>
                  )}
                  
                  {color.new && (
                    <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">N</span>
                    </span>
                  )}
                </button>
                <div className="text-center text-xs mt-1">
                  {color.name}
                  {color.finish && (
                    <span className="block text-[10px] text-muted-foreground">
                      {color.finish.charAt(0).toUpperCase() + color.finish.slice(1)}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
      
      {/* Finish selector */}
      <div>
        <h4 className="text-sm font-medium mb-3">Finish Type</h4>
        <RadioGroup 
          value={selectedFinish} 
          onValueChange={(value) => handleFinishSelect(value as ColorFinish)}
          className="flex flex-wrap gap-2"
        >
          {(Object.keys(finishDescriptions) as ColorFinish[]).map((finish) => (
            <div key={finish} className="flex items-center space-x-2">
              <RadioGroupItem value={finish} id={finish} className="sr-only" />
              <Label
                htmlFor={finish}
                className={`
                  px-3 py-1.5 rounded-md text-xs cursor-pointer transition-all
                  ${selectedFinish === finish 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary hover:bg-secondary/80'
                  }
                `}
              >
                {finish === 'gloss' && <Droplets className="h-3 w-3 inline-block mr-1" />}
                {finish === 'metallic' && <Sparkles className="h-3 w-3 inline-block mr-1" />}
                {finish === 'pearlescent' && <Palette className="h-3 w-3 inline-block mr-1" />}
                {finish.charAt(0).toUpperCase() + finish.slice(1)}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {/* Finish description */}
        <p className="text-xs text-muted-foreground mt-2">
          {finishDescriptions[selectedFinish]}
        </p>
      </div>
    </div>
  );
};

export default EnhancedColorSelector;