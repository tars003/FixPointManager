import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  Car, 
  Bike, 
  Heart, 
  Calendar, 
  Award, 
  ThumbsUp, 
  Settings, 
  ChevronRight, 
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

// Helper function
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const ArenaDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Featured Projects
  const featuredProjects = [
    {
      id: 1,
      title: 'Urban Sport Transformation',
      beforeImage: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75',
      afterImage: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/133517/endeavour-sport-exterior-right-front-three-quarter-3.jpeg?isig=0&q=75',
      modificationsCount: 12,
      totalCost: 185000
    },
    {
      id: 2,
      title: 'Vintage Royal Enfield Remake',
      beforeImage: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/royal-enfield-classic-350-right-front-three-quarter-2.jpeg?isig=0&q=75',
      afterImage: 'https://static.toiimg.com/thumb/msid-81065102,width-1070,height-580,imgsize-1301683,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg',
      modificationsCount: 8,
      totalCost: 75000
    },
    {
      id: 3,
      title: 'Premium Interior Upgrade',
      beforeImage: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-71.jpeg?isig=0&q=75',
      afterImage: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/2022-x1-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75',
      modificationsCount: 6,
      totalCost: 125000
    }
  ];

  // Community Projects
  const communityProjects = [
    {
      id: 1,
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/133517/endeavour-sport-exterior-right-front-three-quarter-3.jpeg?isig=0&q=75',
      username: 'RacingLegend',
      vehicleDetails: '2022 Honda City ZX',
      likeCount: 342,
      userAvatar: 'R'
    },
    {
      id: 2,
      image: 'https://static.toiimg.com/thumb/msid-81065102,width-1070,height-580,imgsize-1301683,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg',
      username: 'CruiserFan',
      vehicleDetails: '2021 Royal Enfield Classic 350',
      likeCount: 285,
      userAvatar: 'C'
    },
    {
      id: 3,
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/2022-x1-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75',
      username: 'UrbanRider',
      vehicleDetails: '2023 Tata Nexon EV',
      likeCount: 198,
      userAvatar: 'U'
    }
  ];

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Show toast notification for each tab (except dashboard)
    if (value !== "dashboard") {
      toast({
        title: `${value.charAt(0).toUpperCase() + value.slice(1)} Section`,
        description: `Viewing ${value} content`,
        variant: "default"
      });
    }
  };

  // Handle starting new project
  const handleStartNewProject = () => {
    window.location.href = '/arena?step=vehicleSource';
  };

  // Handle continuing a saved project
  const handleContinueSavedProject = () => {
    // For demo purposes, just redirect
    window.location.href = '/arena?step=customization';
  };

  return (
    <div className="container mx-auto py-4 space-y-8">
      {/* Secondary Navigation */}
      <div className="sticky top-16 z-10 bg-background pt-2 pb-2 border-b">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full overflow-auto justify-start">
            <TabsTrigger value="dashboard" className="font-medium">MY DASHBOARD</TabsTrigger>
            <TabsTrigger value="saved" className="font-medium">SAVED DESIGNS</TabsTrigger>
            <TabsTrigger value="trending" className="font-medium">TRENDING</TabsTrigger>
            <TabsTrigger value="community" className="font-medium">COMMUNITY</TabsTrigger>
            <TabsTrigger value="tutorials" className="font-medium">TUTORIALS</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Hero Section */}
      <motion.div 
        className="h-80 relative rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/2022-x1-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75)', 
            filter: 'brightness(0.5)' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">CUSTOMIZE YOUR RIDE</h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Transform your vehicle with professional-grade customizations
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-black"
              onClick={handleStartNewProject}
            >
              START NEW PROJECT
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/20"
              onClick={handleContinueSavedProject}
            >
              CONTINUE SAVED PROJECT
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Quick Actions Panel */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Link href="/arena?step=vehicleSource">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center cursor-pointer hover:shadow-md transition-all border">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
              <Car size={24} />
            </div>
            <h3 className="font-medium">My Vehicles</h3>
          </div>
        </Link>
        
        <Link href="/arena?tab=recent">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center cursor-pointer hover:shadow-md transition-all border">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
              <Plus size={24} />
            </div>
            <h3 className="font-medium">Recent Designs</h3>
          </div>
        </Link>
        
        <Link href="/arena?tab=favorites">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center cursor-pointer hover:shadow-md transition-all border">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
              <Heart size={24} />
            </div>
            <h3 className="font-medium">Saved Favorites</h3>
          </div>
        </Link>
        
        <Link href="/arena?tab=appointments">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center cursor-pointer hover:shadow-md transition-all border">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
              <Calendar size={24} />
            </div>
            <h3 className="font-medium">Installation Appointments</h3>
          </div>
        </Link>
      </motion.div>
      
      {/* Featured Projects */}
      <motion.section
        className="pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">INSPIRATION GALLERY</h2>
          <Link href="/arena/inspiration">
            <Button variant="ghost" className="gap-1">
              View All <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map(project => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-all">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full overflow-hidden">
                    <img 
                      src={project.beforeImage} 
                      alt={`${project.title} Before`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">BEFORE</div>
                  </div>
                  <div className="w-1/2 h-full overflow-hidden">
                    <img 
                      src={project.afterImage} 
                      alt={`${project.title} After`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">AFTER</div>
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between text-sm">
                  <span>{project.modificationsCount} modifications</span>
                  <span className="font-medium">{formatPrice(project.totalCost)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">View Project</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.section>
      
      {/* Community Showcase */}
      <motion.section
        className="pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">COMMUNITY HIGHLIGHTS</h2>
          <Link href="/arena/community">
            <Button variant="ghost" className="gap-1">
              View All <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {communityProjects.map(project => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-all">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.vehicleDetails} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-white">
                        <AvatarImage src={project.userAvatar} alt={project.username} />
                        <AvatarFallback>{project.userAvatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-white text-sm font-medium">{project.username}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={14} className="text-white" />
                      <span className="text-white text-sm">{project.likeCount}</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="font-medium">{project.vehicleDetails}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
      
      {/* Promotional Banner */}
      <motion.section
        className="pt-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="bg-primary/10 rounded-xl p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-primary/20 -skew-x-12 transform-gpu" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">FIRST-TIME CUSTOMIZER?</h2>
            <p className="text-xl mb-4">Get 10% off on your first customization project</p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="lg">
                CLAIM OFFER
              </Button>
              <span className="text-sm text-muted-foreground">Valid until May 31, 2025</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ArenaDashboard;