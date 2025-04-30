import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { CheckCircle, XCircle, Eye, EyeOff, Sun, Moon, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface AccessibilityColorCheckerProps {
  vehicleColor: string;
  onColorChange: (color: string) => void;
}

// Helper function to calculate contrast ratio between two colors
const getContrastRatio = (color1: string, color2: string): number => {
  // Convert hex to RGB
  const hexToRgb = (hex: string): number[] => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  };

  // Calculate luminance
  const getLuminance = (rgb: number[]): number => {
    const [r, g, b] = rgb.map(c => {
      const channel = c / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const luminance1 = getLuminance(rgb1);
  const luminance2 = getLuminance(rgb2);

  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Helper function to get rating from contrast ratio
const getRatingFromContrast = (ratio: number): { 
  rating: 'poor' | 'fair' | 'good' | 'excellent'; 
  passes: { normal: boolean; large: boolean; graphical: boolean };
} => {
  return {
    rating: 
      ratio >= 7 ? 'excellent' :
      ratio >= 4.5 ? 'good' :
      ratio >= 3 ? 'fair' : 'poor',
    passes: {
      normal: ratio >= 4.5, // AA level for normal text
      large: ratio >= 3,    // AA level for large text
      graphical: ratio >= 3 // AA level for graphical elements
    }
  };
};

// Color combinations list - common environments the car might be seen in
const environmentColors = [
  { name: 'Sunny Day', background: '#87CEEB', icon: <Sun className="h-4 w-4" /> }, // Sky blue
  { name: 'Cloudy Day', background: '#E6E6E6', icon: <Sun className="h-4 w-4 text-yellow-500" /> }, // Light grey
  { name: 'Night Time', background: '#1A1A2E', icon: <Moon className="h-4 w-4" /> }, // Dark blue/black
  { name: 'Parking Lot', background: '#8D99AE', icon: <Eye className="h-4 w-4" /> }, // Asphalt grey
  { name: 'Forest Drive', background: '#2D4B2A', icon: <Eye className="h-4 w-4" /> }, // Forest green
  { name: 'Snowy Road', background: '#F0F0F0', icon: <Eye className="h-4 w-4" /> }, // Off-white
  { name: 'Rain/Fog', background: '#A9B8C9', icon: <EyeOff className="h-4 w-4" /> }, // Foggy blue-grey
  { name: 'Desert', background: '#D2B48C', icon: <Sun className="h-4 w-4 text-orange-500" /> } // Sand tan
];

// Safety vehicle colors - high visibility options
const safetyColors = [
  { name: 'Safety Yellow', hex: '#FFCC00' },
  { name: 'Visibility Orange', hex: '#FF7900' },
  { name: 'Emergency Red', hex: '#CC0000' },
  { name: 'Safety White', hex: '#FFFFFF' },
  { name: 'High-Viz Green', hex: '#5EFC8D' },
  { name: 'Silver Reflective', hex: '#C0C0C0' }
];

const AccessibilityColorChecker: React.FC<AccessibilityColorCheckerProps> = ({ 
  vehicleColor, 
  onColorChange 
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('visibility');
  const [selectedEnvironment, setSelectedEnvironment] = useState(environmentColors[0]);
  const [contrastRatio, setContrastRatio] = useState(0);
  const [contrastRating, setContrastRating] = useState<'poor' | 'fair' | 'good' | 'excellent'>('poor');
  const [contrastPasses, setContrastPasses] = useState({ normal: false, large: false, graphical: false });

  // Calculate contrast whenever vehicle color or environment changes
  useEffect(() => {
    const ratio = getContrastRatio(vehicleColor, selectedEnvironment.background);
    setContrastRatio(ratio);
    
    const { rating, passes } = getRatingFromContrast(ratio);
    setContrastRating(rating);
    setContrastPasses(passes);
  }, [vehicleColor, selectedEnvironment]);

  const handleEnvironmentSelect = (environment: typeof environmentColors[0]) => {
    setSelectedEnvironment(environment);
  };

  const handleSafetyColorSelect = (color: string) => {
    onColorChange(color);
    
    toast({
      title: "High Visibility Color Applied",
      description: "This color offers better visibility in most environments.",
    });
  };

  const getContrastBadge = () => {
    switch(contrastRating) {
      case 'excellent':
        return <Badge className="bg-green-600">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-600">Good</Badge>;
      case 'fair':
        return <Badge className="bg-yellow-500">Fair</Badge>;
      case 'poor':
        return <Badge className="bg-red-500">Poor</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full border-t-4 border-t-green-600 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Accessibility Color Checker</CardTitle>
            <CardDescription>
              Evaluate your vehicle's color visibility in different environments
            </CardDescription>
          </div>
          <Eye className="h-8 w-8 text-green-600" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visibility">
              <Eye className="mr-2 h-4 w-4" />
              Visibility Check
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <CheckCircle className="mr-2 h-4 w-4" />
              Safe Colors
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visibility" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Current Vehicle Color</h3>
                  <div className="flex items-center mt-1">
                    <div 
                      className="w-8 h-8 rounded-full border mr-2" 
                      style={{ backgroundColor: vehicleColor }}
                    />
                    <span className="text-sm">{vehicleColor}</span>
                  </div>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(vehicleColor);
                          toast({
                            title: "Color Code Copied",
                            description: `${vehicleColor} has been copied to clipboard.`
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy color hex code</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Test Environment</h3>
                <div className="grid grid-cols-2 gap-2">
                  {environmentColors.map((env) => (
                    <div
                      key={env.name}
                      onClick={() => handleEnvironmentSelect(env)}
                      className={`
                        flex items-center p-2 rounded-md border cursor-pointer transition-colors hover:bg-muted/50
                        ${selectedEnvironment.name === env.name ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : ''}
                      `}
                    >
                      <div 
                        className="w-6 h-6 rounded-full mr-2 flex items-center justify-center"
                        style={{ backgroundColor: env.background }}
                      >
                        {env.icon}
                      </div>
                      <span className="text-sm">{env.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 rounded-xl" style={{ backgroundColor: selectedEnvironment.background }}>
                <div 
                  className="w-full h-24 rounded-md flex items-center justify-center border"
                  style={{ backgroundColor: vehicleColor }}
                >
                  <span 
                    className="text-lg font-bold px-3 py-1 rounded"
                    style={{ 
                      color: selectedEnvironment.background,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    Vehicle Color
                  </span>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Contrast Analysis</h3>
                  {getContrastBadge()}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Contrast Ratio:</span>
                    <span className="font-medium">{contrastRatio.toFixed(2)}:1</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-2 rounded-md border bg-card">
                      <span className="text-xs text-muted-foreground mb-1">Normal Text</span>
                      {contrastPasses.normal ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex flex-col items-center p-2 rounded-md border bg-card">
                      <span className="text-xs text-muted-foreground mb-1">Large Text</span>
                      {contrastPasses.large ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex flex-col items-center p-2 rounded-md border bg-card">
                      <span className="text-xs text-muted-foreground mb-1">Visibility</span>
                      {contrastPasses.graphical ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-3 bg-muted/50">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Visibility Analysis</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {contrastRating === 'poor' && 'Your current vehicle color has poor visibility in this environment, which may present safety concerns.'}
                      {contrastRating === 'fair' && 'Your current vehicle color has fair visibility in this environment. Consider higher contrast colors for better safety.'}
                      {contrastRating === 'good' && 'Your current vehicle color has good visibility in this environment, meeting accessibility standards.'}
                      {contrastRating === 'excellent' && 'Your current vehicle color has excellent visibility in this environment, exceeding accessibility standards.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="pt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                These high-visibility colors are optimized for safety and maximum visibility across different environments:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {safetyColors.map((color) => (
                  <HoverCard key={color.name}>
                    <HoverCardTrigger asChild>
                      <div
                        className="flex flex-col items-center p-3 rounded-md border cursor-pointer hover:border-green-300 transition-colors"
                        onClick={() => handleSafetyColorSelect(color.hex)}
                      >
                        <div 
                          className="w-12 h-12 rounded-full mb-2 border" 
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm font-medium">{color.name}</span>
                        <span className="text-xs text-muted-foreground">{color.hex}</span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">{color.name}</h4>
                        <div className="flex space-x-2">
                          <div 
                            className="w-8 h-8 rounded border" 
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <div>
                            <p className="text-sm">Hex: {color.hex}</p>
                            <div className="flex space-x-1 mt-1">
                              {environmentColors.slice(0, 4).map((env) => {
                                const ratio = getContrastRatio(color.hex, env.background);
                                const { rating } = getRatingFromContrast(ratio);
                                return (
                                  <Tooltip key={env.name}>
                                    <TooltipTrigger>
                                      <div 
                                        className={`w-5 h-5 rounded-full border`}
                                        style={{
                                          backgroundColor: env.background,
                                          borderColor: rating === 'poor' ? 'red' : 
                                                      rating === 'fair' ? 'orange' :
                                                      rating === 'good' ? 'green' : 'blue'
                                        }}
                                      ></div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">{env.name}: {ratio.toFixed(1)}:1 ({rating})</p>
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm">
                          This color is optimized for visibility in {
                            color.name === 'Safety Yellow' ? 'foggy and overcast conditions' :
                            color.name === 'Visibility Orange' ? 'various lighting conditions' :
                            color.name === 'Emergency Red' ? 'daylight and urban environments' :
                            color.name === 'Safety White' ? 'low-light and nighttime conditions' :
                            color.name === 'High-Viz Green' ? 'rural and forested areas' :
                            'all lighting conditions with reflective properties'
                          }.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
              
              <div className="flex items-start mt-6 p-3 rounded-md border bg-muted/50">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Safety Considerations</p>
                  <p className="text-muted-foreground mt-1">
                    Vehicle color can impact visibility by up to 12% in certain conditions. 
                    High-visibility colors may reduce accident risks, especially in low-light conditions
                    and adverse weather.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t bg-muted/50 pt-4">
        <div className="w-full flex items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-2" />
                About Color Contrast
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Understanding Contrast Ratios</h4>
                <p className="text-sm text-muted-foreground">
                  Contrast ratio measures the difference in brightness between two colors.
                  Higher ratios mean better visibility and safety.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 3:1 - Minimum for large text & graphical elements</li>
                  <li>• 4.5:1 - Minimum for standard text</li>
                  <li>• 7:1 and above - Enhanced visibility in all conditions</li>
                </ul>
              </div>
            </PopoverContent>
          </Popover>
          
          {activeTab === 'visibility' && contrastRating !== 'good' && contrastRating !== 'excellent' && (
            <Button onClick={() => setActiveTab('recommendations')}>
              View Safer Color Options
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AccessibilityColorChecker;