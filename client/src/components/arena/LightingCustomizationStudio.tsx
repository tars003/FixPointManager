import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  CircleOff, 
  Clock, 
  Compass, 
  ExternalLink,
  Lightbulb, 
  Info, 
  LucideIcon,
  MapPin, 
  Moon, 
  Search, 
  Settings,
  Sparkles, 
  Star, 
  Sun, 
  Truck, 
  X,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface LightingCustomizationStudioProps {
  vehicleId: number;
  vehicleType: string;
  onBack: () => void;
  onSave: (customizationData: any) => void;
}

type LightingCategory = 'headlights' | 'taillights' | 'accent' | 'auxiliary';
type HeadlightType = 'led' | 'hid' | 'projector' | 'halo';
type TaillightType = 'led' | 'smoked' | 'sequential' | 'lightbar';
type AccentType = 'underglow' | 'wheel' | 'grille' | 'door';
type AuxiliaryType = 'fog' | 'driving' | 'offroad' | 'utility';
type KelvinRating = '3000K' | '4300K' | '5000K' | '6000K' | '8000K';
type ViewingMode = 'night' | 'day' | 'rain' | 'street' | 'offroad';

interface Headlight {
  id: string;
  name: string;
  type: HeadlightType;
  kelvinOptions: KelvinRating[];
  compatibleVehicles: string[];
  description: string;
  features: string[];
  price: number;
  installationTime: number; // hours
  image: string;
}

interface Taillight {
  id: string;
  name: string;
  type: TaillightType;
  compatibleVehicles: string[];
  description: string;
  features: string[];
  animations: string[];
  price: number;
  installationTime: number; // hours
  image: string;
}

interface AccentLighting {
  id: string;
  name: string;
  type: AccentType;
  compatibleVehicles: string[];
  description: string;
  features: string[];
  colorOptions: boolean; // RGB or fixed
  appControl: boolean;
  price: number;
  installationTime: number; // hours
  image: string;
}

interface AuxiliaryLighting {
  id: string;
  name: string;
  type: AuxiliaryType;
  compatibleVehicles: string[];
  description: string;
  features: string[];
  lumens: number;
  price: number;
  installationTime: number; // hours
  image: string;
}

interface LightingSpecialist {
  id: string;
  name: string;
  distance: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  certifications: string[];
  price: number;
  earliestAvailable: string;
  address: string;
  waterproofing: boolean;
  image: string;
}

const LightingCustomizationStudio: React.FC<LightingCustomizationStudioProps> = ({
  vehicleId,
  vehicleType,
  onBack,
  onSave
}) => {
  // Selected category
  const [category, setCategory] = useState<LightingCategory>('headlights');
  
  // Headlight options state
  const [selectedHeadlightId, setSelectedHeadlightId] = useState<string | null>(null);
  const [selectedKelvin, setSelectedKelvin] = useState<KelvinRating>('5000K');
  
  // Taillight options state
  const [selectedTaillightId, setSelectedTaillightId] = useState<string | null>(null);
  
  // Accent lighting state
  const [selectedAccentIds, setSelectedAccentIds] = useState<string[]>([]);
  const [accentColor, setAccentColor] = useState<string>('#00a3ff');
  
  // Auxiliary lighting state
  const [selectedAuxiliaryIds, setSelectedAuxiliaryIds] = useState<string[]>([]);
  
  // Visualization options
  const [viewingMode, setViewingMode] = useState<ViewingMode>('night');
  const [animateLights, setAnimateLights] = useState<boolean>(false);
  
  // Installation options
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string | null>(null);
  const [installationDate, setInstallationDate] = useState<string>(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  
  // Sample headlight options
  const headlightOptions: Headlight[] = [
    {
      id: 'h1',
      name: 'Premium LED Conversion Kit',
      type: 'led',
      kelvinOptions: ['5000K', '6000K'],
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Complete LED conversion kit that replaces halogen bulbs with brighter, more efficient LEDs for improved visibility.',
      features: ['3x brighter than halogen', 'Plug-and-play installation', 'CAN-bus compatible', '50,000 hour lifespan'],
      price: 18000,
      installationTime: 1,
      image: 'https://images.unsplash.com/photo-1552557204-cd37864f3f6c'
    },
    {
      id: 'h2',
      name: 'HID Xenon Conversion System',
      type: 'hid',
      kelvinOptions: ['4300K', '5000K', '6000K', '8000K'],
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'High-intensity discharge lighting system that produces a brighter, more focused beam for superior nighttime visibility.',
      features: ['4x brighter than halogen', 'Advanced ballasts', 'German-engineered bulbs', '3000 hour lifespan'],
      price: 22000,
      installationTime: 2,
      image: 'https://images.unsplash.com/photo-1571843439991-dd2b8e051966'
    },
    {
      id: 'h3',
      name: 'Bi-Xenon Projector Retrofit',
      type: 'projector',
      kelvinOptions: ['4300K', '5000K', '6000K'],
      compatibleVehicles: ['honda', 'toyota', 'subaru'],
      description: 'Complete headlight conversion with precision projector lenses for improved light output and beam pattern cutoff.',
      features: ['Sharp cutoff pattern', 'Improved beam focus', 'Reduced glare for oncoming traffic', 'Modern appearance'],
      price: 35000,
      installationTime: 5,
      image: 'https://images.unsplash.com/photo-1616455546586-887ca62d5ef6'
    },
    {
      id: 'h4',
      name: 'LED Halo Angel Eye Headlights',
      type: 'halo',
      kelvinOptions: ['5000K', '6000K', '8000K'],
      compatibleVehicles: ['honda', 'mazda', 'subaru'],
      description: 'Custom headlight assembly with LED halo rings that serve as daytime running lights and provide a distinctive appearance.',
      features: ['Switchable halo colors', 'Plug-and-play', 'App control options', 'Dramatic styling'],
      price: 45000,
      installationTime: 4,
      image: 'https://images.unsplash.com/photo-1543800071-82e52debb566'
    }
  ];
  
  // Sample taillight options
  const taillightOptions: Taillight[] = [
    {
      id: 't1',
      name: 'LED Tail Light Conversion',
      type: 'led',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Replace standard tail lights with bright, responsive LED lights for improved visibility and modern styling.',
      features: ['Instant on/off', 'Brighter output', 'Lower power consumption', 'Modern appearance'],
      animations: ['Standard', 'Pulsing Brake'],
      price: 12000,
      installationTime: 2,
      image: 'https://images.unsplash.com/photo-1621883224051-05929702ef5d'
    },
    {
      id: 't2',
      name: 'Smoked LED Tail Lights',
      type: 'smoked',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Stylish smoked lens tail lights with bright LEDs that maintain visibility while providing a premium dark appearance.',
      features: ['Dark tinted lens', 'Super-bright LEDs', 'OEM replacement', 'Sleek appearance'],
      animations: ['Standard', 'Dynamic Turn'],
      price: 16000,
      installationTime: 2,
      image: 'https://images.unsplash.com/photo-1543377430-d9d9cbb22e7e'
    },
    {
      id: 't3',
      name: 'Sequential LED Tail Lights',
      type: 'sequential',
      compatibleVehicles: ['honda', 'mazda', 'subaru'],
      description: 'Modern sequential turn signal tail lights for a premium, attention-grabbing lighting effect.',
      features: ['Multiple animation modes', 'Enhanced visibility', 'Customizable patterns', 'Eye-catching design'],
      animations: ['Sequential Turn', 'Welcome Sequence', 'Goodbye Sequence'],
      price: 24000,
      installationTime: 3,
      image: 'https://images.unsplash.com/photo-1591168120766-2c5a4bb01ec9'
    },
    {
      id: 't4',
      name: 'Full LED Light Bar Tails',
      type: 'lightbar',
      compatibleVehicles: ['honda', 'mazda'],
      description: 'Premium full-width LED light bar tail lights that create a distinctive signature look inspired by luxury vehicles.',
      features: ['Full width design', 'Multiple animation patterns', 'Dramatic styling', 'High-end appearance'],
      animations: ['Sequential Turn', 'Pulse Brake', 'Animation Startup', 'Knight Rider Effect'],
      price: 28000,
      installationTime: 4,
      image: 'https://images.unsplash.com/photo-1591361796028-9bd68ce51490'
    }
  ];
  
  // Sample accent lighting options
  const accentLightingOptions: AccentLighting[] = [
    {
      id: 'a1',
      name: 'Underglow LED Kit',
      type: 'underglow',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Weatherproof LED underglow kit that illuminates the ground beneath your vehicle for a dramatic effect.',
      features: ['App controlled', 'Music sync', 'Multiple patterns', 'Weatherproof IP67'],
      colorOptions: true,
      appControl: true,
      price: 15000,
      installationTime: 3,
      image: 'https://images.unsplash.com/photo-1594100365342-d15e986a9cfb'
    },
    {
      id: 'a2',
      name: 'Wheel Well Lighting Kit',
      type: 'wheel',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Flexible LED strips that install in wheel wells to create an eye-catching glow around each wheel.',
      features: ['Single or multi-color', 'Waterproof design', 'Simple installation', 'Dramatic night effect'],
      colorOptions: true,
      appControl: true,
      price: 12000,
      installationTime: 2,
      image: 'https://images.unsplash.com/photo-1571578539122-c77cd5ca0188'
    },
    {
      id: 'a3',
      name: 'Illuminated Grille Kit',
      type: 'grille',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Custom LED lighting system that integrates with your vehicle\'s grille for a distinctive front-end appearance.',
      features: ['Front-end enhancement', 'Multiple modes', 'Automatic activation', 'Unique brand identity'],
      colorOptions: true,
      appControl: false,
      price: 18000,
      installationTime: 4,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d'
    },
    {
      id: 'a4',
      name: 'Door Puddle Lights',
      type: 'door',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'LED door lights that project a logo or pattern onto the ground when doors are opened.',
      features: ['Custom logo option', 'Easy installation', 'Automatic activation', 'Premium welcome effect'],
      colorOptions: false,
      appControl: false,
      price: 8000,
      installationTime: 1.5,
      image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333'
    }
  ];
  
  // Sample auxiliary lighting options
  const auxiliaryLightingOptions: AuxiliaryLighting[] = [
    {
      id: 'aux1',
      name: 'LED Fog Light Upgrade',
      type: 'fog',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'High-output LED fog lights designed to improve visibility in poor weather conditions.',
      features: ['Yellow or white options', 'Wide beam pattern', 'Weather resistant', 'Improved visibility'],
      lumens: 2000,
      price: 12000,
      installationTime: 2,
      image: 'https://images.unsplash.com/photo-1565689876697-e467b6c54da2'
    },
    {
      id: 'aux2',
      name: 'Auxiliary Driving Lights',
      type: 'driving',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Long-range driving lights that extend visibility for safer highway and rural driving.',
      features: ['Spot beam pattern', 'Up to 1km visibility', 'Aircraft-grade aluminum', 'Integrated thermal management'],
      lumens: 5000,
      price: 18000,
      installationTime: 3,
      image: 'https://images.unsplash.com/photo-1603384699671-2cfd6572f810'
    },
    {
      id: 'aux3',
      name: 'Off-Road Light Bar',
      type: 'offroad',
      compatibleVehicles: ['subaru'],
      description: 'High-output LED light bar designed for off-road use with combination beam pattern for maximum visibility.',
      features: ['Combo flood/spot beam', 'Military-grade construction', 'IP69K waterproof rating', 'Over 50,000 hour lifespan'],
      lumens: 15000,
      price: 25000,
      installationTime: 4,
      image: 'https://images.unsplash.com/photo-1563473213013-de2a0133c100'
    },
    {
      id: 'aux4',
      name: 'Rock Lights Kit',
      type: 'utility',
      compatibleVehicles: ['subaru'],
      description: 'Compact, durable lights designed to illuminate the terrain beneath your vehicle for extreme off-road driving.',
      features: ['Full underbody coverage', 'Military-grade construction', 'Aluminum housing', 'RGB color options'],
      lumens: 1000,
      price: 12000,
      installationTime: 4,
      image: 'https://images.unsplash.com/photo-1626353538917-ad6e82b3ddf4'
    }
  ];
  
  // Sample lighting specialists
  const lightingSpecialists: LightingSpecialist[] = [
    {
      id: 'ls1',
      name: 'LightTech Customs',
      distance: 5.2,
      rating: 4.8,
      reviewCount: 146,
      specialties: ['Headlight Retrofits', 'Custom Light Bars', 'RGB Systems'],
      certifications: ['Certified Installer'],
      price: 8000,
      earliestAvailable: '2025-04-28',
      address: '123 Lighting Blvd, Delhi',
      waterproofing: true,
      image: 'https://images.unsplash.com/photo-1617550694897-5aea2dbb143c'
    },
    {
      id: 'ls2',
      name: 'Illumination Experts',
      distance: 7.8,
      rating: 4.9,
      reviewCount: 179,
      specialties: ['LED Conversions', 'Accent Lighting', 'App Integration'],
      certifications: ['Master Installer', 'Electrical Specialist'],
      price: 12000,
      earliestAvailable: '2025-04-29',
      address: '456 Bright Street, Delhi',
      waterproofing: true,
      image: 'https://images.unsplash.com/photo-1536364127590-1594e3161294'
    },
    {
      id: 'ls3',
      name: 'Auto Illumination Pro',
      distance: 9.5,
      rating: 4.6,
      reviewCount: 98,
      specialties: ['HID Systems', 'Sequential Tails', 'Underglow'],
      certifications: ['Certified Installer'],
      price: 7000,
      earliestAvailable: '2025-04-30',
      address: '789 Glow Avenue, Gurgaon',
      waterproofing: false,
      image: 'https://images.unsplash.com/photo-1613214187999-ac6ad28a1aad'
    },
    {
      id: 'ls4',
      name: 'Nightlight Customs',
      distance: 3.7,
      rating: 4.7,
      reviewCount: 112,
      specialties: ['Full LED Conversions', 'Custom Programming', 'Show Lighting'],
      certifications: ['Master Installer', 'Electrical Specialist', 'Competition Grade'],
      price: 15000,
      earliestAvailable: '2025-05-02',
      address: '321 Beam Path, Delhi',
      waterproofing: true,
      image: 'https://images.unsplash.com/photo-1596554817011-c0fc6ede67c1'
    }
  ];
  
  // Toggle accent lighting selection
  const toggleAccentLighting = (id: string) => {
    setSelectedAccentIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Toggle auxiliary lighting selection
  const toggleAuxiliaryLighting = (id: string) => {
    setSelectedAuxiliaryIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Calculate total cost
  const calculateTotal = () => {
    let total = 0;
    
    // Add headlight cost
    if (selectedHeadlightId) {
      const headlight = headlightOptions.find(item => item.id === selectedHeadlightId);
      if (headlight) total += headlight.price;
    }
    
    // Add taillight cost
    if (selectedTaillightId) {
      const taillight = taillightOptions.find(item => item.id === selectedTaillightId);
      if (taillight) total += taillight.price;
    }
    
    // Add accent lighting costs
    selectedAccentIds.forEach(id => {
      const accentLight = accentLightingOptions.find(item => item.id === id);
      if (accentLight) total += accentLight.price;
    });
    
    // Add auxiliary lighting costs
    selectedAuxiliaryIds.forEach(id => {
      const auxLight = auxiliaryLightingOptions.find(item => item.id === id);
      if (auxLight) total += auxLight.price;
    });
    
    // Add installation cost
    if (selectedSpecialistId) {
      const specialist = lightingSpecialists.find(item => item.id === selectedSpecialistId);
      if (specialist) total += specialist.price;
    }
    
    // Add programming cost if needed (for sequential or app-controlled systems)
    if (selectedTaillightId) {
      const taillight = taillightOptions.find(item => item.id === selectedTaillightId);
      if (taillight && taillight.type === 'sequential') {
        total += 5000; // Programming fee
      }
    }
    
    if (selectedAccentIds.some(id => {
      const accentLight = accentLightingOptions.find(item => item.id === id);
      return accentLight && accentLight.appControl;
    })) {
      total += 3000; // App setup fee
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
  
  // Calculate total installation time
  const calculateInstallationTime = () => {
    let hours = 0;
    
    // Add headlight installation time
    if (selectedHeadlightId) {
      const headlight = headlightOptions.find(item => item.id === selectedHeadlightId);
      if (headlight) hours += headlight.installationTime;
    }
    
    // Add taillight installation time
    if (selectedTaillightId) {
      const taillight = taillightOptions.find(item => item.id === selectedTaillightId);
      if (taillight) hours += taillight.installationTime;
    }
    
    // Add accent lighting installation times
    selectedAccentIds.forEach(id => {
      const accentLight = accentLightingOptions.find(item => item.id === id);
      if (accentLight) hours += accentLight.installationTime;
    });
    
    // Add auxiliary lighting installation times
    selectedAuxiliaryIds.forEach(id => {
      const auxLight = auxiliaryLightingOptions.find(item => item.id === id);
      if (auxLight) hours += auxLight.installationTime;
    });
    
    // Add programming time if needed
    if (selectedTaillightId && taillightOptions.find(item => item.id === selectedTaillightId)?.type === 'sequential') {
      hours += 1; // Programming time
    }
    
    if (selectedAccentIds.some(id => {
      const accentLight = accentLightingOptions.find(item => item.id === id);
      return accentLight && accentLight.appControl;
    })) {
      hours += 1; // App setup time
    }
    
    return hours;
  };
  
  // Handle saving customization
  const handleSave = () => {
    const totalInstallationHours = calculateInstallationTime();
    
    const customizationData = {
      type: 'lightingCustomization',
      headlights: {
        headlightId: selectedHeadlightId,
        kelvinRating: selectedKelvin
      },
      taillights: {
        taillightId: selectedTaillightId
      },
      accentLighting: {
        selectedIds: selectedAccentIds,
        rgbColor: accentColor
      },
      auxiliaryLighting: {
        selectedIds: selectedAuxiliaryIds
      },
      installation: {
        specialistId: selectedSpecialistId,
        date: installationDate,
        estimatedHours: totalInstallationHours
      },
      pricing: {
        partsCost: calculateTotal() - (selectedSpecialistId ? lightingSpecialists.find(s => s.id === selectedSpecialistId)?.price || 0 : 0),
        laborCost: selectedSpecialistId ? lightingSpecialists.find(s => s.id === selectedSpecialistId)?.price || 0 : 0,
        programmingCost: (selectedTaillightId && taillightOptions.find(t => t.id === selectedTaillightId)?.type === 'sequential' ? 5000 : 0) +
                         (selectedAccentIds.some(id => accentLightingOptions.find(a => a.id === id)?.appControl) ? 3000 : 0),
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
  
  // Render kelvin temperature visual representation
  const renderKelvinColor = (kelvin: string) => {
    const kelvinColors: Record<string, string> = {
      '3000K': '#FFB868', // Warm yellow
      '4300K': '#FFF1C0', // Natural yellow
      '5000K': '#FFF9E8', // Natural white
      '6000K': '#F5FAFF', // Cool white
      '8000K': '#DFF1FF', // Cool blue
    };
    
    return (
      <div 
        className="w-6 h-6 rounded-full" 
        style={{
          backgroundColor: kelvinColors[kelvin] || '#FFFFFF',
          border: '1px solid #e2e8f0'
        }}
      />
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
            <h1 className="text-xl font-bold">Illuminate Your Ride</h1>
            <p className="text-sm text-muted-foreground">Lighting customization studio</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!(selectedHeadlightId || selectedTaillightId || selectedAccentIds.length > 0 || selectedAuxiliaryIds.length > 0) ||
                     !selectedSpecialistId}
          >
            Save Configuration
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* Left sidebar - Categories */}
        <div className="border-r p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Lighting Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={category === 'headlights' ? 'default' : 'outline'}
                className="justify-start h-auto py-3"
                onClick={() => setCategory('headlights')}
              >
                <div className="flex flex-col items-center mr-3">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Headlights</div>
                  <div className="text-xs text-muted-foreground">LED, HID, Projectors</div>
                </div>
              </Button>
              
              <Button
                variant={category === 'taillights' ? 'default' : 'outline'}
                className="justify-start h-auto py-3"
                onClick={() => setCategory('taillights')}
              >
                <div className="flex flex-col items-center mr-3">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Taillights</div>
                  <div className="text-xs text-muted-foreground">LED, Sequential, Light Bars</div>
                </div>
              </Button>
              
              <Button
                variant={category === 'accent' ? 'default' : 'outline'}
                className="justify-start h-auto py-3"
                onClick={() => setCategory('accent')}
              >
                <div className="flex flex-col items-center mr-3">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Accent Lighting</div>
                  <div className="text-xs text-muted-foreground">Underglow, Wheel, Interior</div>
                </div>
              </Button>
              
              <Button
                variant={category === 'auxiliary' ? 'default' : 'outline'}
                className="justify-start h-auto py-3"
                onClick={() => setCategory('auxiliary')}
              >
                <div className="flex flex-col items-center mr-3">
                  <Compass className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Auxiliary</div>
                  <div className="text-xs text-muted-foreground">Fog, Driving, Off-road</div>
                </div>
              </Button>
            </div>
          </div>
          
          <ScrollArea className="h-[550px]">
            <Tabs value={category}>
              {/* Headlights Tab */}
              <TabsContent value="headlights" className="space-y-6 mt-0">
                <div className="space-y-4">
                  {headlightOptions.map((headlight) => (
                    <Card 
                      key={headlight.id} 
                      className={`cursor-pointer transition-all ${selectedHeadlightId === headlight.id ? 'border-primary ring-1 ring-primary' : ''}`}
                      onClick={() => setSelectedHeadlightId(headlight.id === selectedHeadlightId ? null : headlight.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                            <img 
                              src={headlight.image} 
                              alt={headlight.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{headlight.name}</h4>
                              <Badge>₹{headlight.price.toLocaleString()}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{headlight.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {headlight.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {selectedHeadlightId === headlight.id && (
                          <div className="mt-4 pt-4 border-t">
                            <Label className="text-sm">Color Temperature</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {headlight.kelvinOptions.map((kelvin) => (
                                <Button
                                  key={kelvin}
                                  variant={selectedKelvin === kelvin ? 'default' : 'outline'}
                                  size="sm"
                                  className="flex items-center gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedKelvin(kelvin);
                                  }}
                                >
                                  {renderKelvinColor(kelvin)}
                                  <span>{kelvin}</span>
                                </Button>
                              ))}
                            </div>
                            <div className="mt-3 text-xs text-muted-foreground">
                              <p className="flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                {selectedKelvin === '3000K' ? 'Warm yellow light, similar to halogen' :
                                 selectedKelvin === '4300K' ? 'Natural yellow-white, optimal visibility' :
                                 selectedKelvin === '5000K' ? 'Pure white light, similar to daylight' :
                                 selectedKelvin === '6000K' ? 'Cool white with slight blue tint' :
                                 'Deep blue-white light, distinctive appearance'}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Taillights Tab */}
              <TabsContent value="taillights" className="space-y-6 mt-0">
                <div className="space-y-4">
                  {taillightOptions.map((taillight) => (
                    <Card 
                      key={taillight.id} 
                      className={`cursor-pointer transition-all ${selectedTaillightId === taillight.id ? 'border-primary ring-1 ring-primary' : ''}`}
                      onClick={() => setSelectedTaillightId(taillight.id === selectedTaillightId ? null : taillight.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                            <img 
                              src={taillight.image} 
                              alt={taillight.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{taillight.name}</h4>
                              <Badge>₹{taillight.price.toLocaleString()}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{taillight.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {taillight.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {selectedTaillightId === taillight.id && taillight.animations.length > 1 && (
                          <div className="mt-4 pt-4 border-t">
                            <Label className="text-sm">Animation Patterns</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {taillight.animations.map((animation) => (
                                <Badge key={animation} variant="secondary" className="justify-start">
                                  {animation}
                                </Badge>
                              ))}
                            </div>
                            
                            {taillight.type === 'sequential' && (
                              <div className="mt-3 bg-muted rounded-md p-2 text-xs text-muted-foreground">
                                <p className="flex items-center gap-1">
                                  <Info className="h-3 w-3" />
                                  Sequential patterns require additional programming (+₹5,000)
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Accent Lighting Tab */}
              <TabsContent value="accent" className="space-y-6 mt-0">
                <div className="space-y-4">
                  {accentLightingOptions.map((accent) => (
                    <Card 
                      key={accent.id} 
                      className={`cursor-pointer transition-all ${selectedAccentIds.includes(accent.id) ? 'border-primary ring-1 ring-primary' : ''}`}
                      onClick={() => toggleAccentLighting(accent.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                            <img 
                              src={accent.image} 
                              alt={accent.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{accent.name}</h4>
                              <Badge>₹{accent.price.toLocaleString()}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{accent.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {accent.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {selectedAccentIds.includes(accent.id) && accent.colorOptions && (
                          <div className="mt-4 pt-4 border-t">
                            <Label className="text-sm">RGB Color Selection</Label>
                            <div className="flex items-center gap-3 mt-2">
                              <div 
                                className="w-10 h-10 rounded-full border"
                                style={{ backgroundColor: accentColor }}
                              />
                              <Input 
                                type="color" 
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            
                            {accent.appControl && (
                              <div className="mt-3 bg-muted rounded-md p-2 text-xs text-muted-foreground">
                                <p className="flex items-center gap-1">
                                  <Info className="h-3 w-3" />
                                  App control setup requires additional programming (+₹3,000)
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Auxiliary Lighting Tab */}
              <TabsContent value="auxiliary" className="space-y-6 mt-0">
                <div className="space-y-4">
                  {auxiliaryLightingOptions.map((aux) => (
                    <Card 
                      key={aux.id} 
                      className={`cursor-pointer transition-all ${selectedAuxiliaryIds.includes(aux.id) ? 'border-primary ring-1 ring-primary' : ''}`}
                      onClick={() => toggleAuxiliaryLighting(aux.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                            <img 
                              src={aux.image} 
                              alt={aux.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{aux.name}</h4>
                              <Badge>₹{aux.price.toLocaleString()}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{aux.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Lightbulb className="h-3 w-3" />
                                {aux.lumens.toLocaleString()} lumens
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {aux.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {selectedAuxiliaryIds.includes(aux.id) && aux.type === 'offroad' && (
                          <div className="mt-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-2 text-xs text-amber-700 dark:text-amber-400">
                            <p className="flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              Off-road lights are not legal for use on public roads. Use only in appropriate off-road environments.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
        
        {/* Center - Visualization */}
        <div className="col-span-1 lg:col-span-1 border-r flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium mb-2">Visualization Mode</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={viewingMode === 'night' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewingMode('night')}
              >
                <Moon className="h-4 w-4 mr-1" />
                Night
              </Button>
              <Button 
                variant={viewingMode === 'day' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewingMode('day')}
              >
                <Sun className="h-4 w-4 mr-1" />
                Day
              </Button>
              <Button 
                variant={viewingMode === 'rain' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewingMode('rain')}
              >
                <Droplets className="h-4 w-4 mr-1" />
                Rain
              </Button>
              <Button 
                variant={viewingMode === 'street' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewingMode('street')}
              >
                <Compass className="h-4 w-4 mr-1" />
                Street
              </Button>
              <Button 
                variant={viewingMode === 'offroad' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewingMode('offroad')}
              >
                <Truck className="h-4 w-4 mr-1" />
                Off-road
              </Button>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <Label htmlFor="animate-toggle" className="text-sm cursor-pointer flex items-center gap-2">
                <Settings className="h-3.5 w-3.5" />
                Animate Lighting Effects
              </Label>
              <Button 
                variant={animateLights ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAnimateLights(!animateLights)}
              >
                {animateLights ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
            {/* Placeholder for 3D model */}
            <div 
              className={`w-full h-[300px] rounded-lg flex items-center justify-center transition-all duration-500
                ${viewingMode === 'night' ? 'bg-slate-900 dark:bg-slate-950' : 
                  viewingMode === 'day' ? 'bg-sky-100 dark:bg-sky-950' : 
                  viewingMode === 'rain' ? 'bg-slate-300 dark:bg-slate-800' : 
                  viewingMode === 'street' ? 'bg-neutral-300 dark:bg-neutral-800' : 
                  'bg-amber-200 dark:bg-amber-950'}`}
            >
              <div className="text-center">
                <div className="text-muted-foreground mb-4">3D Lighting Preview</div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {/* Front visualization */}
                  {selectedHeadlightId && (
                    <div className="flex flex-col items-center">
                      <div className="flex justify-center gap-4 mb-2">
                        <div 
                          className={`h-4 w-4 rounded-full ${
                            viewingMode === 'night' || viewingMode === 'rain' ? 'animate-pulse' : ''
                          }`}
                          style={{ 
                            backgroundColor: 
                              selectedKelvin === '3000K' ? '#FFB868' : 
                              selectedKelvin === '4300K' ? '#FFF1C0' : 
                              selectedKelvin === '5000K' ? '#FFF9E8' : 
                              selectedKelvin === '6000K' ? '#F5FAFF' : 
                              '#DFF1FF',
                            boxShadow: `0 0 15px 5px ${
                              selectedKelvin === '3000K' ? 'rgba(255, 184, 104, 0.7)' : 
                              selectedKelvin === '4300K' ? 'rgba(255, 241, 192, 0.7)' : 
                              selectedKelvin === '5000K' ? 'rgba(255, 249, 232, 0.7)' : 
                              selectedKelvin === '6000K' ? 'rgba(245, 250, 255, 0.7)' : 
                              'rgba(223, 241, 255, 0.7)'
                            }`
                          }}
                        />
                        <div 
                          className={`h-4 w-4 rounded-full ${
                            viewingMode === 'night' || viewingMode === 'rain' ? 'animate-pulse' : ''
                          }`}
                          style={{ 
                            backgroundColor: 
                              selectedKelvin === '3000K' ? '#FFB868' : 
                              selectedKelvin === '4300K' ? '#FFF1C0' : 
                              selectedKelvin === '5000K' ? '#FFF9E8' : 
                              selectedKelvin === '6000K' ? '#F5FAFF' : 
                              '#DFF1FF',
                            boxShadow: `0 0 15px 5px ${
                              selectedKelvin === '3000K' ? 'rgba(255, 184, 104, 0.7)' : 
                              selectedKelvin === '4300K' ? 'rgba(255, 241, 192, 0.7)' : 
                              selectedKelvin === '5000K' ? 'rgba(255, 249, 232, 0.7)' : 
                              selectedKelvin === '6000K' ? 'rgba(245, 250, 255, 0.7)' : 
                              'rgba(223, 241, 255, 0.7)'
                            }`
                          }}
                        />
                      </div>
                      <Badge variant="outline">Headlights</Badge>
                    </div>
                  )}
                  
                  {/* Side visualization - Accent lighting */}
                  {selectedAccentIds.length > 0 && (
                    <div className="flex flex-col items-center">
                      <div 
                        className={`h-8 w-16 rounded-sm mb-2 ${
                          animateLights ? 'animate-pulse' : ''
                        }`}
                        style={{ 
                          backgroundColor: accentColor,
                          boxShadow: `0 0 15px 5px ${accentColor}80`
                        }}
                      />
                      <Badge variant="outline">Accent Lighting</Badge>
                    </div>
                  )}
                  
                  {/* Rear visualization */}
                  {selectedTaillightId && (
                    <div className="flex flex-col items-center">
                      <div className="flex justify-center gap-4 mb-2">
                        <div 
                          className={`h-4 w-4 rounded-full bg-red-500 ${
                            animateLights && selectedTaillightId && taillightOptions.find(t => t.id === selectedTaillightId)?.type === 'sequential'
                              ? 'animate-ping' 
                              : viewingMode === 'night' || viewingMode === 'rain' ? 'animate-pulse' : ''
                          }`}
                          style={{ 
                            boxShadow: '0 0 15px 5px rgba(239, 68, 68, 0.7)'
                          }}
                        />
                        <div 
                          className={`h-4 w-4 rounded-full bg-red-500 ${
                            animateLights && selectedTaillightId && taillightOptions.find(t => t.id === selectedTaillightId)?.type === 'sequential'
                              ? 'animate-ping' 
                              : viewingMode === 'night' || viewingMode === 'rain' ? 'animate-pulse' : ''
                          }`}
                          style={{ 
                            boxShadow: '0 0 15px 5px rgba(239, 68, 68, 0.7)'
                          }}
                        />
                      </div>
                      <Badge variant="outline">Taillights</Badge>
                    </div>
                  )}
                </div>
                
                {/* Auxiliary visualization */}
                {selectedAuxiliaryIds.length > 0 && (
                  <div className="flex flex-col items-center mt-4">
                    <div className="flex justify-center gap-2 mb-2">
                      {selectedAuxiliaryIds.map((id) => {
                        const auxLight = auxiliaryLightingOptions.find(a => a.id === id);
                        return (
                          <div 
                            key={id}
                            className={`h-3 w-3 rounded-full bg-yellow-300 ${
                              viewingMode === 'night' || viewingMode === 'rain' || viewingMode === 'offroad' ? 'animate-pulse' : ''
                            }`}
                            style={{ 
                              boxShadow: '0 0 10px 3px rgba(253, 224, 71, 0.7)'
                            }}
                          />
                        );
                      })}
                    </div>
                    <Badge variant="outline">Auxiliary Lights</Badge>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 w-full text-sm border rounded-md p-3 bg-muted/30">
              <h4 className="font-medium mb-2">Visibility Improvement</h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Night Visibility</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 w-2 rounded-full mx-0.5 ${
                          (selectedHeadlightId && i < 3) || 
                          (selectedHeadlightId && 
                           headlightOptions.find(h => h.id === selectedHeadlightId)?.type !== 'led' && 
                           i < 4) ||
                          (selectedAuxiliaryIds.length > 0 && 
                           auxiliaryLightingOptions.some(a => 
                             selectedAuxiliaryIds.includes(a.id) && 
                             (a.type === 'driving' || a.type === 'offroad')
                           ) && 
                           i < 5)
                            ? 'bg-primary' 
                            : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Adverse Weather</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 w-2 rounded-full mx-0.5 ${
                          (selectedHeadlightId && i < 2) || 
                          (selectedHeadlightId && 
                           headlightOptions.find(h => h.id === selectedHeadlightId)?.type === 'led' && 
                           selectedKelvin === '3000K' && 
                           i < 3) ||
                          (selectedAuxiliaryIds.some(id => 
                            auxiliaryLightingOptions.find(a => a.id === id)?.type === 'fog'
                          ) && 
                           i < 4)
                            ? 'bg-primary' 
                            : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Visibility to Others</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 w-2 rounded-full mx-0.5 ${
                          (selectedTaillightId && i < 3) || 
                          (selectedTaillightId && 
                           taillightOptions.find(t => t.id === selectedTaillightId)?.type === 'sequential' && 
                           i < 4) ||
                          (selectedAccentIds.length > 0 && i < 5)
                            ? 'bg-primary' 
                            : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Style Factor</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 w-2 rounded-full mx-0.5 ${
                          (selectedHeadlightId && i < 2) || 
                          (selectedTaillightId && i < 3) ||
                          ((selectedHeadlightId && 
                            headlightOptions.find(h => h.id === selectedHeadlightId)?.type === 'halo') && 
                           i < 4) ||
                          (selectedAccentIds.length > 0 && i < 5)
                            ? 'bg-primary' 
                            : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right sidebar - Installation and Summary */}
        <div className="p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">Lighting Specialists</h3>
          
          <div className="space-y-4 mb-6">
            {lightingSpecialists.map((specialist) => (
              <Card 
                key={specialist.id} 
                className={`cursor-pointer transition-all ${selectedSpecialistId === specialist.id ? 'border-primary ring-1 ring-primary' : ''}`}
                onClick={() => setSelectedSpecialistId(specialist.id === selectedSpecialistId ? null : specialist.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img 
                        src={specialist.image} 
                        alt={specialist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{specialist.name}</h4>
                        <Badge variant={specialist.waterproofing ? "default" : "outline"}>
                          {specialist.waterproofing ? 'Waterproofing' : 'Standard Install'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{specialist.distance} km</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          {renderRating(specialist.rating)}
                          <span className="text-muted-foreground">({specialist.reviewCount})</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {specialist.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{specialty}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Earliest: {specialist.earliestAvailable}</span>
                        </div>
                        <Badge variant="outline">₹{specialist.price.toLocaleString()}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {selectedSpecialistId === specialist.id && (
                    <>
                      <Separator className="my-3" />
                      <div>
                        <Label htmlFor="installation-date">Appointment Date</Label>
                        <Input 
                          id="installation-date" 
                          type="date"
                          className="mt-1"
                          value={installationDate}
                          onChange={(e) => setInstallationDate(e.target.value)}
                          min={specialist.earliestAvailable}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <h3 className="text-lg font-medium mb-4">Configuration Summary</h3>
          
          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Selected Items */}
              <div className="space-y-3">
                {selectedHeadlightId && (
                  <div className="flex justify-between text-sm">
                    <span>{headlightOptions.find(h => h.id === selectedHeadlightId)?.name} ({selectedKelvin})</span>
                    <span className="font-medium">₹{headlightOptions.find(h => h.id === selectedHeadlightId)?.price.toLocaleString()}</span>
                  </div>
                )}
                
                {selectedTaillightId && (
                  <div className="flex justify-between text-sm">
                    <span>{taillightOptions.find(t => t.id === selectedTaillightId)?.name}</span>
                    <span className="font-medium">₹{taillightOptions.find(t => t.id === selectedTaillightId)?.price.toLocaleString()}</span>
                  </div>
                )}
                
                {selectedAccentIds.map(id => {
                  const accent = accentLightingOptions.find(a => a.id === id);
                  return accent && (
                    <div key={id} className="flex justify-between text-sm">
                      <span>{accent.name}</span>
                      <span className="font-medium">₹{accent.price.toLocaleString()}</span>
                    </div>
                  );
                })}
                
                {selectedAuxiliaryIds.map(id => {
                  const aux = auxiliaryLightingOptions.find(a => a.id === id);
                  return aux && (
                    <div key={id} className="flex justify-between text-sm">
                      <span>{aux.name}</span>
                      <span className="font-medium">₹{aux.price.toLocaleString()}</span>
                    </div>
                  );
                })}
                
                {/* Additional fees */}
                {selectedTaillightId && taillightOptions.find(t => t.id === selectedTaillightId)?.type === 'sequential' && (
                  <div className="flex justify-between text-sm">
                    <span>Sequential Programming</span>
                    <span className="font-medium">₹5,000</span>
                  </div>
                )}
                
                {selectedAccentIds.some(id => {
                  const accent = accentLightingOptions.find(a => a.id === id);
                  return accent && accent.appControl;
                }) && (
                  <div className="flex justify-between text-sm">
                    <span>App Control Setup</span>
                    <span className="font-medium">₹3,000</span>
                  </div>
                )}
                
                {/* Installation */}
                {selectedSpecialistId && (
                  <div className="flex justify-between text-sm">
                    <span>Installation ({lightingSpecialists.find(s => s.id === selectedSpecialistId)?.name})</span>
                    <span className="font-medium">₹{lightingSpecialists.find(s => s.id === selectedSpecialistId)?.price.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Total */}
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
                  <span>Estimated Timeline</span>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Installation Time</span>
                    <span>{calculateInstallationTime()} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Testing & Calibration</span>
                    <span>1-2 hours</span>
                  </div>
                  <div className="flex justify-between font-medium text-foreground">
                    <span>Total Duration</span>
                    <span>1-{Math.ceil(calculateInstallationTime() / 6)} days</span>
                  </div>
                </div>
              </div>
              
              {/* Legal Information */}
              <div className="text-xs text-muted-foreground space-y-2">
                <div className="flex items-start gap-2">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <p>All lighting modifications comply with local regulations when properly installed and maintained.</p>
                </div>
                
                {(selectedHeadlightId || selectedAuxiliaryIds.some(id => 
                  auxiliaryLightingOptions.find(a => a.id === id)?.type === 'offroad'
                )) && (
                  <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <p>
                      Some lighting modifications may require proper adjustment to prevent glaring other drivers. 
                      {selectedAuxiliaryIds.some(id => 
                        auxiliaryLightingOptions.find(a => a.id === id)?.type === 'offroad'
                      ) && ' Off-road lighting is not approved for on-road use.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleSave}
                disabled={!(selectedHeadlightId || selectedTaillightId || selectedAccentIds.length > 0 || selectedAuxiliaryIds.length > 0) ||
                         !selectedSpecialistId}
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

export default LightingCustomizationStudio;