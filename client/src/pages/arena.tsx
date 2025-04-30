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
        {/* Page header */}
        <motion.div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Launch Arena</h1>
            <p className="text-muted-foreground mt-1">
              Your immersive, gamified vehicle customization platform with interactive 3D models
            </p>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Vehicle Customization Card */}
          <Card className="overflow-hidden group">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center">
                <Car className="h-5 w-5 mr-2 text-blue-600" />
                Vehicle Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Design your dream vehicle with our 360° interactive customization tool.
              </p>
              <div className="h-40 bg-blue-50 dark:bg-blue-950/30 rounded-md flex items-center justify-center mb-4">
                <Car className="h-16 w-16 text-blue-600/60" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setLocation('/arena-studio')}
              >
                Explore
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Features Card */}
          <Card className="overflow-hidden group relative">
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                NEW
              </Badge>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-amber-600" />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Experience our enhanced customization tools with personalized recommendations.
              </p>
              <div className="h-40 bg-amber-50 dark:bg-amber-950/30 rounded-md flex items-center justify-center mb-4">
                <Sparkles className="h-16 w-16 text-amber-600/60" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setLocation('/enhanced-arena-features')}
              >
                Explore
              </Button>
            </CardFooter>
          </Card>

          {/* Custom Wraps Card */}
          <Card className="overflow-hidden group">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center">
                <Paintbrush className="h-5 w-5 mr-2 text-purple-600" />
                Custom Wraps
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Upload your own designs and apply them to your vehicle.
              </p>
              <div className="h-40 bg-purple-50 dark:bg-purple-950/30 rounded-md flex items-center justify-center mb-4">
                <Paintbrush className="h-16 w-16 text-purple-600/60" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">
                Explore
              </Button>
            </CardFooter>
          </Card>

          {/* Parts Marketplace Card */}
          <Card className="overflow-hidden group">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
                Parts Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Browse and shop for compatible parts with real-time visualization.
              </p>
              <div className="h-40 bg-green-50 dark:bg-green-950/30 rounded-md flex items-center justify-center mb-4">
                <ShoppingCart className="h-16 w-16 text-green-600/60" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">
                Explore
              </Button>
            </CardFooter>
          </Card>

          {/* Community Showcase Card */}
          <Card className="overflow-hidden group">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center">
                <Share2 className="h-5 w-5 mr-2 text-indigo-600" />
                Community Showcase
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Share your creations and get inspired by others.
              </p>
              <div className="h-40 bg-indigo-50 dark:bg-indigo-950/30 rounded-md flex items-center justify-center mb-4">
                <Share2 className="h-16 w-16 text-indigo-600/60" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">
                Explore
              </Button>
            </CardFooter>
          </Card>

          {/* Rewards System Card */}
          <Card className="overflow-hidden group">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-orange-600" />
                Rewards System
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Earn points and unlock achievements through customization.
              </p>
              <div className="h-40 bg-orange-50 dark:bg-orange-950/30 rounded-md flex items-center justify-center mb-4">
                <Award className="h-16 w-16 text-orange-600/60" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">
                Explore
              </Button>
            </CardFooter>
          </Card>

          {/* Voice Controls Card */}
          <Card className="overflow-hidden group">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center">
                <Mic className="h-5 w-5 mr-2 text-red-600" />
                Voice Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Control the customization interface using voice commands.
              </p>
              <div className="h-40 bg-red-50 dark:bg-red-950/30 rounded-md flex items-center justify-center mb-4">
                <Mic className="h-16 w-16 text-red-600/60" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">
                Explore
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ArenaWrapper>
  );
};

export default Arena;