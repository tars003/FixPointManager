import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Settings,
  Wrench,
  Palette,
  Activity,
  Component,
  PanelLeft,
  Gauge,
  ChevronRight,
  PaintBucket,
  Sparkles,
  Zap,
  Award,
  AreaChart,
  Sofa,
  BadgePercent,
  StopCircle,
  CircleDot,
  ShieldCheck,
  DollarSign,
  Share2,
  Download,
  Heart,
  Send,
  CheckSquare,
  ShoppingCart,
  Lightbulb,
  Paintbrush,
  Plus,
  Mic
} from 'lucide-react';
import ArenaWrapper from '@/components/arena/ArenaWrapper';
import PreviewCard from '@/components/arena/PreviewCard';
import EnhancedColorSelector from '@/components/arena/EnhancedColorSelector';
import CustomizationPackage from '@/components/arena/CustomizationPackage';
import CartPanel, { CartItem as CartPanelItem } from '@/components/arena/CartPanel';
import ProjectControls from '@/components/arena/ProjectControls';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Available vehicle models
const vehicleModels = [
  { id: 1, name: 'City Roadster', type: 'Sedan', brand: 'AutoLux', thumbnail: '🚗' },
  { id: 2, name: 'Urban Explorer', type: 'SUV', brand: 'TrekStar', thumbnail: '🚙' },
  { id: 3, name: 'Thunder Bolt', type: 'Sports', brand: 'Velocity', thumbnail: '🏎️' },
  { id: 4, name: 'Cruiser 250', type: 'Motorcycle', brand: 'Road King', thumbnail: '🏍️' }
];

// Example body kit options
const bodyKitOptions = [
  {
    id: 'stock',
    name: 'Factory Standard',
    description: 'Original manufacturer body kit',
    price: 0,
    stock: 'in-stock',
    installTime: '0 hrs'
  },
  {
    id: 'sport',
    name: 'Sport Package',
    description: 'Enhanced sporty appearance with side skirts',
    price: 45000,
    popular: true,
    stock: 'in-stock',
    installTime: '4-6 hrs'
  },
  {
    id: 'premium',
    name: 'Premium Aero',
    description: 'Full body aerodynamic kit with carbon fiber accents',
    price: 85000,
    recommended: true,
    stock: 'in-stock',
    rating: 4.8,
    installTime: '6-8 hrs'
  },
  {
    id: 'widebody',
    name: 'Widebody Kit',
    description: 'Aggressive widebody fenders and bumpers',
    price: 125000,
    discount: 10,
    stock: 'limited',
    installTime: '16-20 hrs'
  },
  {
    id: 'carbon',
    name: 'Full Carbon Fiber',
    description: 'Complete carbon fiber body panels for maximum weight reduction',
    price: 220000,
    stock: 'limited',
    installTime: '20+ hrs'
  }
];

// Example spoiler options
const spoilerOptions = [
  {
    id: 'none',
    name: 'No Spoiler',
    description: 'Clean look without a rear spoiler',
    price: 0,
    stock: 'in-stock',
    installTime: '0 hrs'
  },
  {
    id: 'lip',
    name: 'Lip Spoiler',
    description: 'Subtle trunk lip spoiler for a sleek look',
    price: 12000,
    popular: true,
    stock: 'in-stock',
    installTime: '1-2 hrs'
  },
  {
    id: 'mid',
    name: 'Mid-Rise Wing',
    description: 'Balanced mid-height wing for style and function',
    price: 28000,
    stock: 'in-stock',
    rating: 4.6,
    installTime: '2-3 hrs'
  },
  {
    id: 'performance',
    name: 'Performance Wing',
    description: 'Adjustable high-performance wing for maximum downforce',
    price: 45000,
    recommended: true,
    stock: 'in-stock',
    installTime: '3-4 hrs',
    discount: 5
  }
];

// Exterior submenu items
const exteriorCategoryItems = [
  { id: 'body-kits', label: 'Body Kits', icon: Car },
  { id: 'spoilers', label: 'Spoilers', icon: Component },
  { id: 'paint-wraps', label: 'Paint & Wraps', icon: Paintbrush },
  { id: 'lighting', label: 'Lighting', icon: Lightbulb },
];

// Vehicle Categories
type CustomizationCategory = 'exterior' | 'interior' | 'performance' | 'wheels-tires' | 'visualization';

// Enhanced Arena Studio Page
const Arena = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  return (
    <ArenaWrapper>
      <div className="container max-w-7xl mx-auto py-6 px-4">
        {/* Empty arena studio page with no text or cards */}
        <div className="flex items-center justify-center min-h-[80vh]">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setLocation('/arena-studio')}
          >
            Start Customizing
          </Button>
        </div>
      </div>
    </ArenaWrapper>
  );
};

export default Arena;