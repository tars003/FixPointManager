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
  Plus,
  Star,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  
  // Saved Designs data
  const savedDesignsData = [
    {
      id: 1,
      title: 'My Honda City Makeover',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75',
      date: '2025-04-20',
      modifications: ['Alloy Wheels', 'LED Headlights', 'Body Kit'],
      totalCost: 45000
    },
    {
      id: 2,
      title: 'Royal Enfield Custom',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/royal-enfield-classic-350-right-front-three-quarter-2.jpeg?isig=0&q=75',
      date: '2025-04-15',
      modifications: ['Saddle Bags', 'Exhaust Upgrade', 'Custom Paint'],
      totalCost: 35000
    },
    {
      id: 3,
      title: 'Family SUV Upgrade',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/2022-x1-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75',
      date: '2025-04-10',
      modifications: ['Leather Seats', 'Roof Rack', 'Window Tint'],
      totalCost: 55000
    }
  ];

  // Trending Products
  const trendingProducts = [
    {
      id: 1,
      name: 'Sporty Alloy Wheels',
      price: 12500,
      image: 'https://www.tyresales.com.au/images/alloy-wheels/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled/hero/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled-wheel-380.jpg',
      rating: 4.8,
      reviewCount: 245
    },
    {
      id: 2,
      name: 'Premium Vinyl Wrap',
      price: 22000,
      image: 'https://images.squarespace-cdn.com/content/v1/5cf89255dc34db0001a4da0e/1584647207580-QVNC5T8P0Z9K9AQ1PBEH/GT-R-Geometric-Wrap.jpg',
      rating: 4.7,
      reviewCount: 182
    },
    {
      id: 3,
      name: 'Performance Exhaust',
      price: 18500,
      image: 'https://www.carid.com/images/borla/items/140307.jpg',
      rating: 4.9,
      reviewCount: 312
    },
    {
      id: 4,
      name: 'LED Lighting Kit',
      price: 8500,
      image: 'https://m.media-amazon.com/images/I/71+-wQFrHRL._AC_UF894,1000_QL80_.jpg',
      rating: 4.6,
      reviewCount: 165
    }
  ];

  // Tutorials
  const tutorials = [
    {
      id: 1,
      title: 'How to Choose the Right Wheels',
      image: 'https://www.tyresales.com.au/images/alloy-wheels/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled/hero/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled-wheel-380.jpg',
      duration: '10:25',
      level: 'Beginner',
      views: 12584
    },
    {
      id: 2,
      title: 'DIY Vinyl Wrap Installation',
      image: 'https://images.squarespace-cdn.com/content/v1/5cf89255dc34db0001a4da0e/1584647207580-QVNC5T8P0Z9K9AQ1PBEH/GT-R-Geometric-Wrap.jpg',
      duration: '25:12',
      level: 'Intermediate',
      views: 8456
    },
    {
      id: 3,
      title: 'Advanced Interior Customization',
      image: 'https://icdn.digitaltrends.com/image/digitaltrends/2020-bentley-continental-gt-v8-coupe-interior-500x500.jpg',
      duration: '18:45',
      level: 'Advanced',
      views: 6289
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

      {/* Tab Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          {/* Hero Section */}
          <motion.div 
            className="h-80 relative rounded-xl overflow-hidden mt-4"
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
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8"
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
            className="pt-8"
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
            className="pt-8"
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
        </TabsContent>

        {/* Saved Designs Tab */}
        <TabsContent value="saved">
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Your Saved Designs</h2>
              <Button onClick={handleStartNewProject}>
                Create New Design
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDesignsData.map(design => (
                <Card key={design.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={design.image} 
                      alt={design.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{design.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">Created on {new Date(design.date).toLocaleDateString()}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {design.modifications.map((mod, index) => (
                        <Badge key={index} variant="secondary">{mod}</Badge>
                      ))}
                    </div>
                    <p className="text-lg font-semibold">{formatPrice(design.totalCost)}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button className="flex-1">Edit Design</Button>
                    <Button variant="outline" className="flex-1">Share</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending">
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Popular Products & Trends</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Sort By: Popular
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map(product => (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <div className="flex justify-between mt-2 items-center">
                      <span className="font-medium">{formatPrice(product.price)}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm">{product.rating} ({product.reviewCount})</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community">
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Community Showcase</h2>
              <Button>
                Share Your Build
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityProjects.map(project => (
                <Card key={project.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="h-60 overflow-hidden relative">
                    <img 
                      src={project.image} 
                      alt={project.vehicleDetails} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border border-white">
                            <AvatarImage src={project.userAvatar} alt={project.username} />
                            <AvatarFallback>{project.userAvatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-white font-medium">{project.username}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{project.vehicleDetails}</h3>
                    <div className="flex justify-between mt-2 items-center">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="p-1 h-8">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {project.likeCount}
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-8">
                          <span className="mr-1">💬</span>
                          12
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials">
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Learn Customization</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Filter By Level
                </Button>
                <Button variant="outline" size="sm">
                  Sort By: Newest
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map(tutorial => (
                <Card key={tutorial.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={tutorial.image} 
                      alt={tutorial.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {tutorial.duration}
                    </div>
                    <div className="absolute top-4 left-4 bg-primary text-white px-2 py-1 rounded text-sm">
                      {tutorial.level}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{tutorial.title}</h3>
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>{tutorial.views.toLocaleString()} views</span>
                      <span>2 months ago</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Watch Tutorial</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArenaDashboard;