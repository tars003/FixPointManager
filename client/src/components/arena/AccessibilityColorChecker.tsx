import React, { useState } from 'react';
import { Eye, Check } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const AccessibilityColorChecker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [contrastRatio, setContrastRatio] = useState<number | null>(null);
  const [contrastLevel, setContrastLevel] = useState<'AA' | 'AAA' | 'Fail' | null>(null);

  // Calculate contrast ratio between two colors
  const calculateContrastRatio = (color1: string, color2: string): number => {
    // Convert hex to RGB
    const hexToRgb = (hex: string): number[] => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const formattedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
      return result 
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
          ]
        : [0, 0, 0];
    };

    // Calculate luminance
    const luminance = (r: number, g: number, b: number): number => {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const l1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    const l2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    
    const ratio = l1 > l2 
      ? (l1 + 0.05) / (l2 + 0.05)
      : (l2 + 0.05) / (l1 + 0.05);
      
    return Math.round(ratio * 100) / 100;
  };

  // Check contrast level based on WCAG 2.0 guidelines
  const getContrastLevel = (ratio: number): 'AA' | 'AAA' | 'Fail' => {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'Fail';
  };

  // Check contrast when both colors are set
  const checkContrast = () => {
    const ratio = calculateContrastRatio(backgroundColor, textColor);
    setContrastRatio(ratio);
    setContrastLevel(getContrastLevel(ratio));
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => setIsOpen(true)}
            >
              <Eye className="h-4 w-4" />
              Accessibility
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Check color accessibility</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Color Accessibility Checker</DialogTitle>
            <DialogDescription>
              Check if your chosen colors meet WCAG 2.0 accessibility guidelines.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="background" className="text-right">
                Background
              </Label>
              <Input
                id="background"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="col-span-2 h-10"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="text" className="text-right">
                Text
              </Label>
              <Input
                id="text"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="col-span-2 h-10"
              />
            </div>
            
            <div 
              className="p-4 rounded-md border flex items-center justify-center" 
              style={{ backgroundColor, color: textColor }}
            >
              <span className="font-medium">Sample Text</span>
            </div>
            
            {contrastRatio !== null && (
              <div className="p-3 rounded-md bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Contrast Ratio:</span>
                  <span>{contrastRatio}:1</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">WCAG 2.0 Level:</span>
                  <div className={`flex items-center ${
                    contrastLevel === 'Fail' 
                      ? 'text-red-500' 
                      : contrastLevel === 'AA' 
                        ? 'text-amber-500' 
                        : 'text-green-500'
                  }`}>
                    {contrastLevel === 'Fail' ? (
                      <span>Failed</span>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        <span>Passed {contrastLevel}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  <p>AA requires a contrast ratio of at least 4.5:1</p>
                  <p>AAA requires a contrast ratio of at least 7:1</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button type="button" onClick={checkContrast}>
              Check Contrast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccessibilityColorChecker;