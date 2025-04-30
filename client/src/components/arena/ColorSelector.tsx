import React, { useState } from 'react';
import { Check, Pipette } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Available color types
type ColorFinish = 'gloss' | 'matte' | 'metallic' | 'pearlescent' | 'satin';

// Types for the component
interface ColorSelectorProps {
  onSelectColor?: (color: string, finish: ColorFinish) => void;
  defaultColor?: string;
  defaultFinish?: ColorFinish;
}

// Material finishes with descriptions
const colorFinishes: {value: ColorFinish, label: string, description: string}[] = [
  { 
    value: 'gloss', 
    label: 'Gloss', 
    description: 'Shiny, reflective finish with high shine'
  },
  { 
    value: 'matte', 
    label: 'Matte', 
    description: 'Non-reflective finish with a flat appearance'
  },
  { 
    value: 'metallic', 
    label: 'Metallic', 
    description: 'Contains metal flakes that create a sparkling effect'
  },
  { 
    value: 'pearlescent', 
    label: 'Pearl', 
    description: 'Creates a color-shifting effect with depth'
  },
  { 
    value: 'satin', 
    label: 'Satin', 
    description: 'Semi-gloss finish between matte and gloss' 
  }
];

// Predefined color palettes
const standardColors = [
  { name: 'Arctic White', value: '#F5F5F5', finish: 'gloss' as ColorFinish },
  { name: 'Phantom Black', value: '#0A0A0A', finish: 'gloss' as ColorFinish },
  { name: 'Royal Blue', value: '#1E40AF', finish: 'metallic' as ColorFinish },
  { name: 'Racing Red', value: '#DC2626', finish: 'gloss' as ColorFinish },
  { name: 'Emerald Green', value: '#047857', finish: 'metallic' as ColorFinish },
  { name: 'Sunburst Orange', value: '#EA580C', finish: 'gloss' as ColorFinish },
  { name: 'Silver Grey', value: '#94A3B8', finish: 'metallic' as ColorFinish },
  { name: 'Matte Black', value: '#171717', finish: 'matte' as ColorFinish },
  { name: 'Midnight Blue', value: '#1E3A8A', finish: 'matte' as ColorFinish },
  { name: 'Racing Yellow', value: '#FBBF24', finish: 'gloss' as ColorFinish },
  { name: 'Deep Purple', value: '#7E22CE', finish: 'pearlescent' as ColorFinish },
  { name: 'Bronze', value: '#92400E', finish: 'metallic' as ColorFinish },
];

const premiumColors = [
  { name: 'Chameleon Green/Purple', value: '#42966F', finish: 'pearlescent' as ColorFinish },
  { name: 'Cherry Red Pearl', value: '#9F1239', finish: 'pearlescent' as ColorFinish },
  { name: 'Frozen Blue', value: '#93C5FD', finish: 'matte' as ColorFinish },
  { name: 'Gold Rush', value: '#B45309', finish: 'metallic' as ColorFinish },
  { name: 'Deep Teal Pearl', value: '#0F766E', finish: 'pearlescent' as ColorFinish },
  { name: 'Galaxy Black', value: '#0F172A', finish: 'pearlescent' as ColorFinish },
  { name: 'Satin Gunmetal', value: '#4B5563', finish: 'satin' as ColorFinish },
  { name: 'Ruby Red', value: '#BE123C', finish: 'metallic' as ColorFinish }
];

const ColorSelector: React.FC<ColorSelectorProps> = ({
  onSelectColor,
  defaultColor = '#1E40AF',
  defaultFinish = 'metallic'
}) => {
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedFinish, setSelectedFinish] = useState<ColorFinish>(defaultFinish);
  const [customColor, setCustomColor] = useState(defaultColor);
  const [activeTab, setActiveTab] = useState<string>('standard');
  
  // Handle color selection
  const handleSelectColor = (color: string, finish: ColorFinish) => {
    setSelectedColor(color);
    setSelectedFinish(finish);
    
    if (onSelectColor) {
      onSelectColor(color, finish);
    }
  };
  
  // Handle custom color input
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };
  
  // Apply custom color
  const applyCustomColor = () => {
    handleSelectColor(customColor, selectedFinish);
  };
  
  return (
    <div className="space-y-3">
      {/* Color palette tabs */}
      <Tabs defaultValue="standard" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        {/* Standard Colors */}
        <TabsContent value="standard" className="pt-3">
          <div className="grid grid-cols-4 gap-2">
            {standardColors.map(color => (
              <TooltipProvider key={color.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`
                        w-full aspect-square rounded-md flex items-center justify-center
                        ${selectedColor === color.value ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-border'}
                      `}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleSelectColor(color.value, color.finish)}
                    >
                      {selectedColor === color.value && (
                        <Check className={`h-4 w-4 ${parseInt(color.value.slice(1), 16) > 0x888888 ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs font-medium">{color.name}</p>
                    <p className="text-xs text-muted-foreground">{color.finish.charAt(0).toUpperCase() + color.finish.slice(1)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </TabsContent>
        
        {/* Premium Colors */}
        <TabsContent value="premium" className="pt-3">
          <div className="grid grid-cols-4 gap-2">
            {premiumColors.map(color => (
              <TooltipProvider key={color.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`
                        w-full aspect-square rounded-md flex items-center justify-center
                        ${selectedColor === color.value ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-border'}
                      `}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleSelectColor(color.value, color.finish)}
                    >
                      {selectedColor === color.value && (
                        <Check className={`h-4 w-4 ${parseInt(color.value.slice(1), 16) > 0x888888 ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs font-medium">{color.name}</p>
                    <p className="text-xs text-muted-foreground">{color.finish.charAt(0).toUpperCase() + color.finish.slice(1)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </TabsContent>
        
        {/* Custom Color */}
        <TabsContent value="custom" className="pt-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-md ring-1 ring-border"
                style={{ backgroundColor: customColor }} 
              />
              <div className="flex-1 flex items-center gap-2">
                <Pipette className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="h-8 px-2 w-full"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs mb-1.5 block">Color Finish</Label>
              <RadioGroup 
                value={selectedFinish}
                onValueChange={(value) => setSelectedFinish(value as ColorFinish)}
                className="grid grid-cols-2 gap-2"
              >
                {colorFinishes.map(finish => (
                  <div 
                    key={finish.value} 
                    className="flex items-center space-x-2 rounded-md border p-2"
                  >
                    <RadioGroupItem value={finish.value} id={finish.value} />
                    <Label 
                      htmlFor={finish.value} 
                      className="flex-1 cursor-pointer text-xs"
                    >
                      {finish.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <Button 
              onClick={applyCustomColor} 
              className="w-full"
              size="sm"
            >
              Apply Color
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Currently selected color info */}
      <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full ring-1 ring-border"
            style={{ backgroundColor: selectedColor }} 
          />
          <span className="text-xs font-medium">{selectedColor}</span>
        </div>
        <span className="text-xs text-muted-foreground capitalize">
          {selectedFinish} finish
        </span>
      </div>
    </div>
  );
};

export default ColorSelector;