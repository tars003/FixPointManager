import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Zap,
  Lightbulb,
  Volume2,
  Eye,
  Sparkles,
  MousePointer,
  Heart,
  User,
  Car
} from 'lucide-react';

import ArenaWrapper from '@/components/arena/ArenaWrapper';
import PersonalizedVehicle from '@/components/arena/PersonalizedVehicle';
import SoundSimulator from '@/components/arena/SoundSimulator';
import AccessibilityColorChecker from '@/components/arena/AccessibilityColorChecker';
import MicroInteractions from '@/components/arena/MicroInteractions';
import AnimatedHoverEffects from '@/components/arena/AnimatedHoverEffects';
import { useToast } from '@/hooks/use-toast';

// Enhanced Arena Features Page - showcases all new premium features
const EnhancedArenaFeatures: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('personalized');
  const [vehicleColor, setVehicleColor] = useState<string>('#1E3A8A'); // Default blue color
  
  // Handle color change
  const handleColorChange = (color: string) => {
    setVehicleColor(color);
    
    toast({
      title: "Color Updated",
      description: "Your vehicle color has been updated.",
    });
  };
  
  // Handle save customization
  const handleSaveCustomization = () => {
    toast({
      title: "Customization Saved",
      description: "Your vehicle customization has been saved.",
    });
  };
  
  // Handle add to cart
  const handleAddToCart = (itemId: string) => {
    toast({
      title: "Item Added to Cart",
      description: "The item has been added to your cart.",
    });
  };
  
  // Go back to main arena
  const goBack = () => {
    setLocation('/arena');
  };

  return (
    <ArenaWrapper>
      <div className="container max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <Button 
              variant="ghost" 
              className="mb-2 pl-0 flex items-center text-muted-foreground" 
              onClick={goBack}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Arena Studio
            </Button>
            
            <h1 className="text-3xl font-bold">Enhanced Arena Features</h1>
            <p className="text-muted-foreground mt-1">
              Explore premium features that enhance your vehicle customization experience
            </p>
          </div>
          
          <Card className="md:w-64 mt-4 md:mt-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
            <CardContent className="py-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Current Color</p>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full border mr-2" 
                      style={{ backgroundColor: vehicleColor }}
                    />
                    <p className="text-xs text-muted-foreground">{vehicleColor}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Feature Navigation */}
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-1">
            <TabsTrigger value="personalized">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Personalized</span>
              <span className="inline md:hidden">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="sound">
              <Volume2 className="h-4 w-4 mr-2" />
              Sound
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <Eye className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Accessibility</span>
              <span className="inline md:hidden">Access</span>
            </TabsTrigger>
            <TabsTrigger value="micro">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Micro-Interactions</span>
              <span className="inline md:hidden">Micro</span>
            </TabsTrigger>
            <TabsTrigger value="hover">
              <MousePointer className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Hover Effects</span>
              <span className="inline md:hidden">Hover</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feature Area - 8 columns on large screens */}
          <div className="lg:col-span-8 space-y-6">
            <TabsContent value="personalized" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-bold">Personalized Vehicle</h2>
                </div>
                <p className="text-muted-foreground">
                  Create a personal driver profile to receive tailored customization recommendations based on your preferences and driving style.
                </p>
                <Separator />
                <PersonalizedVehicle 
                  vehicleColor={vehicleColor}
                  onColorChange={handleColorChange}
                  onSaveCustomization={handleSaveCustomization}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="sound" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Volume2 className="h-5 w-5 text-violet-600 mr-2" />
                  <h2 className="text-2xl font-bold">Sound Simulator</h2>
                </div>
                <p className="text-muted-foreground">
                  Preview the auditory experience of your vehicle with different engine and exhaust configurations.
                </p>
                <Separator />
                <SoundSimulator 
                  vehicleType="sedan"
                  engineType="standard"
                  exhaustType="standard"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="accessibility" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-green-600 mr-2" />
                  <h2 className="text-2xl font-bold">Accessibility Color Checker</h2>
                </div>
                <p className="text-muted-foreground">
                  Evaluate how visible your vehicle's color will be in different environments and lighting conditions.
                </p>
                <Separator />
                <AccessibilityColorChecker 
                  vehicleColor={vehicleColor}
                  onColorChange={handleColorChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="micro" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
                  <h2 className="text-2xl font-bold">Micro-Interactions</h2>
                </div>
                <p className="text-muted-foreground">
                  Enjoy delightful micro-interactions when configuring your vehicle for a more engaging experience.
                </p>
                <Separator />
                <MicroInteractions 
                  onItemLike={(id) => {
                    console.log('Liked item:', id);
                  }}
                  onItemAddToCart={handleAddToCart}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="hover" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center">
                  <MousePointer className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-bold">Animated Hover Effects</h2>
                </div>
                <p className="text-muted-foreground">
                  Intuitive and responsive hover effects that highlight vehicle components and options.
                </p>
                <Separator />
                <AnimatedHoverEffects 
                  onComponentSelect={(componentId) => {
                    console.log('Selected component:', componentId);
                  }}
                />
              </div>
            </TabsContent>
          </div>
          
          {/* Side panel - 4 columns on large screens */}
          <div className="lg:col-span-4 space-y-6">
            {/* Feature Benefits Card */}
            <Card className="border-t-4 border-t-blue-600">
              <CardHeader>
                <CardTitle>Premium Features</CardTitle>
                <CardDescription>
                  Benefits of enhanced Arena features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex">
                    <User className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Personalized Vehicle</p>
                      <p className="text-sm text-muted-foreground">
                        Get AI-driven recommendations based on your driving preferences and style.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <Volume2 className="h-5 w-5 text-violet-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Sound Simulator</p>
                      <p className="text-sm text-muted-foreground">
                        Preview the actual sound of your vehicle with different modifications.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <Eye className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Accessibility Checker</p>
                      <p className="text-sm text-muted-foreground">
                        Choose colors that ensure visibility and safety in all conditions.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <Sparkles className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Micro-Interactions</p>
                      <p className="text-sm text-muted-foreground">
                        Enjoy responsive feedback that makes customization fun and engaging.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <MousePointer className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Animated Hover Effects</p>
                      <p className="text-sm text-muted-foreground">
                        Intuitively explore vehicle components with interactive visual cues.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Technology behind the features */}
            <Card>
              <CardHeader>
                <CardTitle>Technology</CardTitle>
                <CardDescription>
                  Advanced tools powering your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4">
                    <div className="flex items-center mb-2">
                      <Zap className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-semibold">Intelligent Response</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI-powered recommendation system that learns your preferences and suggests optimal configurations.
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 p-4">
                    <div className="flex items-center mb-2">
                      <Lightbulb className="h-5 w-5 text-violet-600 mr-2" />
                      <h3 className="font-semibold">Real-time Rendering</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Advanced 3D visualization technology that renders vehicle customizations with photorealistic quality.
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4">
                    <div className="flex items-center mb-2">
                      <Heart className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-semibold">User Experience Design</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Crafted with attention to detail for a seamless, intuitive, and enjoyable customization journey.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ArenaWrapper>
  );
};

export default EnhancedArenaFeatures;