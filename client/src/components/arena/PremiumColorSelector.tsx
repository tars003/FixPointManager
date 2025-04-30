import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, Info, Sparkles, Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  type: 'standard' | 'metallic' | 'matte' | 'special';
  price: number;
  description?: string;
  new?: boolean;
  popular?: boolean;
}

interface PremiumColorSelectorProps {
  options: ColorOption[];
  selectedColor: string;
  onSelectColor: (id: string) => void;
  likedColors: string[];
  onToggleLike: (id: string) => void;
  onAddToCart: (color: ColorOption) => void;
}

const PremiumColorSelector: React.FC<PremiumColorSelectorProps> = ({
  options,
  selectedColor,
  onSelectColor,
  likedColors,
  onToggleLike,
  onAddToCart
}) => {
  const [activeCategory, setActiveCategory] = useState<'standard' | 'metallic' | 'matte' | 'special'>('standard');
  
  // Get the selected color details
  const selectedColorDetails = options.find(option => option.id === selectedColor);
  
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Filter colors by category
  const filteredColors = options.filter(color => color.type === activeCategory);
  
  // Category info
  const categories = [
    { id: 'standard', label: 'Standard', description: 'Non-metallic paint with a glossy finish' },
    { id: 'metallic', label: 'Metallic', description: 'Contains aluminum flakes that create a sparkling effect' },
    { id: 'matte', label: 'Matte', description: 'Low-gloss finish with a smooth, non-reflective appearance' },
    { id: 'special', label: 'Special', description: 'Premium finishes with unique visual effects' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Color type selection */}
      <div className="border rounded-md p-3 bg-slate-50">
        <RadioGroup 
          defaultValue={activeCategory} 
          onValueChange={(value) => setActiveCategory(value as any)}
          className="flex flex-wrap gap-2"
        >
          {categories.map(category => (
            <div key={category.id} className="flex-1 min-w-[100px]">
              <RadioGroupItem 
                value={category.id} 
                id={`color-type-${category.id}`} 
                className="sr-only peer" 
              />
              <Label 
                htmlFor={`color-type-${category.id}`}
                className="flex flex-col items-center px-3 py-2 rounded-md border peer-data-[state=checked]:border-primary/70 peer-data-[state=checked]:bg-primary/5 transition-colors cursor-pointer hover:bg-slate-100 text-center h-full"
              >
                <span className="font-medium text-sm mb-1">{category.label}</span>
                <span className="text-xs text-muted-foreground">{category.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {/* Color grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredColors.map((color) => (
          <motion.div
            key={color.id}
            whileHover={{ scale: 1.03 }}
            className={`rounded-md overflow-hidden border ${
              selectedColor === color.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => onSelectColor(color.id)}
                className="w-full aspect-square rounded-t-md"
                style={{ backgroundColor: color.hex }}
              ></button>
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike(color.id);
                  }}
                  className="bg-white/80 hover:bg-white rounded-full h-7 w-7 flex items-center justify-center transition-colors"
                >
                  <Heart className={`h-4 w-4 ${
                    likedColors.includes(color.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`} />
                </button>
                {color.price > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(color);
                    }}
                    className="bg-white/80 hover:bg-white rounded-full h-7 w-7 flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>
              {color.new && (
                <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-semibold px-2 py-1">
                  NEW
                </div>
              )}
              {color.popular && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs font-medium py-1 text-center">
                  POPULAR
                </div>
              )}
            </div>
            
            <div className="p-3 bg-white">
              <div className="flex justify-between items-start mb-1">
                <p className="font-medium text-sm">{color.name}</p>
                {color.price > 0 ? (
                  <Badge variant="outline" className="text-xs font-medium">
                    {formatPrice(color.price)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs font-medium bg-green-50 text-green-700 border-green-200">
                    Included
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground capitalize">{color.type}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Selected color details */}
      {selectedColorDetails && (
        <div className="bg-slate-50 rounded-md border p-4">
          <div className="flex items-center gap-4">
            <div 
              className="h-16 w-16 rounded-md shadow-md" 
              style={{ backgroundColor: selectedColorDetails.hex }}
            ></div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{selectedColorDetails.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="capitalize">{selectedColorDetails.type}</span>
                    {selectedColorDetails.new && (
                      <Badge className="text-[10px] bg-blue-600 text-white py-0 px-1">NEW</Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  {selectedColorDetails.price > 0 ? (
                    <>
                      <div className="font-semibold">{formatPrice(selectedColorDetails.price)}</div>
                      <div className="text-xs text-muted-foreground">Additional cost</div>
                    </>
                  ) : (
                    <div className="text-green-600 font-medium">No additional cost</div>
                  )}
                </div>
              </div>
              
              {selectedColorDetails.description && (
                <p className="text-sm mt-2 text-muted-foreground">{selectedColorDetails.description}</p>
              )}
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="flex justify-between items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground cursor-help">
                    <Info className="h-3.5 w-3.5 mr-1" />
                    <span>Color availability depends on production schedule</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Color options may vary based on manufacturing location and current production schedules. Your dealer can provide the most up-to-date information.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onToggleLike(selectedColorDetails.id)}
              >
                <Heart className={`h-4 w-4 mr-2 ${
                  likedColors.includes(selectedColorDetails.id) ? 'fill-red-500 text-red-500' : ''
                }`} />
                {likedColors.includes(selectedColorDetails.id) ? 'Saved' : 'Save'}
              </Button>
              
              {selectedColorDetails.price > 0 && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onAddToCart(selectedColorDetails)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Configuration
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumColorSelector;