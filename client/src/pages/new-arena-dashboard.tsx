import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useArenaWebSocket } from '@/hooks/use-arena-websocket';
import { useQuery } from '@tanstack/react-query';
import { 
  Car, 
  Heart, 
  Calendar, 
  ThumbsUp, 
  ChevronRight, 
  Plus,
  Clock,
  Award,
  Settings,
  Wrench,
  BookOpen,
  Video,
  Lightbulb,
  Package,
  Users,
  Star,
  Edit,
  Share2,
  Trash2,
  FileText,
  Code,
  BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

// Helper function
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Helper function for relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
};

// Define interfaces for our data structures
interface Project {
  id: number;
  title: string;
  vehicle?: string;
  vehicleId?: number;
  userId?: number;
  image?: string;
  progress: number;
  lastEdited: string;
  totalCost: number;
  isPublic?: boolean;
  status?: string;
}

interface VehicleProfile {
  id: number;
  make: string;
  model: string;
  year: number;
  trim: string;
  color: string;
  image: string;
  modifications: number;
}

interface Appointment {
  id: number;
  service: string;
  vehicle: string;
  date: string;
  provider: string;
  status: string;
  cost: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  compatibility: string[];
}

interface CommunityProject {
  id: number;
  title: string;
  user: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  vehicle: string;
  image: string;
  likes: number;
  comments: number;
  totalCost: number;
  difficulty: string;
}

interface Tutorial {
  id: number;
  title: string;
  type: string;
  image: string;
  duration: string;
  level: string;
  instructor: string;
  views: number;
  category: string;
}

interface DIYGuide {
  id: number;
  title: string;
  image: string;
  difficulty: string;
  time: string;
  tools: number;
  steps: number;
  category: string;
}

const NewArenaDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("studio");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [collaborators, setCollaborators] = useState<{ userId: number; username: string; isActive: boolean }[]>([]);
  
  // Set up WebSocket connection
  const { 
    isConnected, 
    activeUsers, 
    projectUpdates,
    sendMessage,
    updateProject,
    updatePresence
  } = useArenaWebSocket();
  
  // Initialize connection status display
  useEffect(() => {
    if (isConnected) {
      toast({
        title: "Connected to Arena Server",
        description: "Real-time collaboration is now active",
        variant: "default"
      });
      
      // Authenticate with demo user ID (1)
      sendMessage('AUTHENTICATE', { userId: 1 });
    }
  }, [isConnected, sendMessage]);
  
  // Monitor active project users
  useEffect(() => {
    if (activeUsers.length > 0) {
      setCollaborators(activeUsers);
    }
  }, [activeUsers]);
  
  // Monitor project updates
  useEffect(() => {
    if (projectUpdates.length > 0) {
      const latestUpdate = projectUpdates[projectUpdates.length - 1];
      
      toast({
        title: "Project Update",
        description: `Changes made to project ${latestUpdate.projectId} by User ${latestUpdate.userId}`,
        variant: "default"
      });
    }
  }, [projectUpdates]);
  
  // Fetch projects from API
  const { data: apiProjects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['/api/arena/projects'],
    queryFn: async () => {
      const res = await fetch('/api/arena/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
    enabled: activeTab === 'studio'
  });
  
  // Fetch trending products from API
  const { data: apiTrendingProducts, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['/api/arena/trending'],
    queryFn: async () => {
      const res = await fetch('/api/arena/trending');
      if (!res.ok) throw new Error('Failed to fetch trending products');
      return res.json();
    },
    enabled: activeTab === 'discover'
  });
  
  // Handle joining a project collaboration
  const handleJoinProject = (projectId: number) => {
    if (selectedProject !== projectId) {
      // Leave previous project if any
      if (selectedProject) {
        sendMessage('LEAVE_PROJECT', { projectId: selectedProject });
      }
      
      // Join new project
      sendMessage('JOIN_PROJECT', { projectId });
      setSelectedProject(projectId);
      
      toast({
        title: "Collaboration Started",
        description: `You've joined the collaboration for Project #${projectId}`,
        variant: "default"
      });
    }
  };
  
  // Handle project update
  const handleUpdateProject = (projectId: number, updates: Record<string, unknown>) => {
    updateProject(projectId, updates);
  };
  
  // Active Projects data - use API data if available
  const activeProjects = apiProjects || [
    {
      id: 1,
      title: 'Honda City Sport Package',
      vehicle: 'Honda City 2023',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75',
      progress: 65,
      lastEdited: '2025-04-24T14:30:00',
      totalCost: 85000
    },
    {
      id: 2,
      title: 'Royal Enfield Classic Overhaul',
      vehicle: 'Royal Enfield Classic 350',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/royal-enfield-classic-350-right-front-three-quarter-2.jpeg?isig=0&q=75',
      progress: 30,
      lastEdited: '2025-04-23T09:15:00',
      totalCost: 42000
    },
    {
      id: 3,
      title: 'Tata Nexon Premium Interior',
      vehicle: 'Tata Nexon EV 2023',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-71.jpeg?isig=0&q=75',
      progress: 85,
      lastEdited: '2025-04-25T08:45:00',
      totalCost: 65000
    }
  ];

  // Saved Designs data
  const savedDesigns = [
    {
      id: 1,
      title: 'City Street Racing Setup',
      vehicle: 'Honda City ZX',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/133517/endeavour-sport-exterior-right-front-three-quarter-3.jpeg?isig=0&q=75',
      date: '2025-04-10',
      modifications: ['Performance Exhaust', 'Racing Wheels', 'Body Kit'],
      totalCost: 120000
    },
    {
      id: 2,
      title: 'Off-Road Adventure Package',
      vehicle: 'Mahindra Thar',
      image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mahindra/Thar/10745/1690359819096/front-left-side-47.jpg',
      date: '2025-04-05',
      modifications: ['Lift Kit', 'All-Terrain Tires', 'Roof Rack'],
      totalCost: 85000
    }
  ];

  // Vehicle Profiles
  const vehicles = [
    {
      id: 1,
      make: 'Honda',
      model: 'City',
      year: 2023,
      trim: 'ZX',
      color: 'Platinum White Pearl',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75',
      modifications: 7
    },
    {
      id: 2,
      make: 'Royal Enfield',
      model: 'Classic',
      year: 2022,
      trim: '350',
      color: 'Gunmetal Grey',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/royal-enfield-classic-350-right-front-three-quarter-2.jpeg?isig=0&q=75',
      modifications: 4
    },
    {
      id: 3,
      make: 'Tata',
      model: 'Nexon',
      year: 2023,
      trim: 'EV',
      color: 'Pristine White',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-71.jpeg?isig=0&q=75',
      modifications: 3
    }
  ];

  // Upcoming Appointments
  const appointments = [
    {
      id: 1,
      service: 'Performance Exhaust Installation',
      vehicle: 'Honda City ZX',
      date: '2025-05-05T10:30:00',
      provider: 'SuperSport Garage',
      status: 'Scheduled',
      cost: 15000
    },
    {
      id: 2,
      service: 'Vinyl Wrap Application',
      vehicle: 'Tata Nexon EV',
      date: '2025-05-12T14:00:00',
      provider: 'Custom Wraps Pro',
      status: 'Confirmed',
      cost: 35000
    }
  ];

  // Trending Products
  const trendingProducts = [
    {
      id: 1,
      name: 'Borla Performance Exhaust System',
      category: 'Performance',
      price: 45000,
      image: 'https://www.carid.com/images/borla/items/140307.jpg',
      rating: 4.9,
      reviewCount: 328,
      compatibility: ['Honda City', 'Honda Civic']
    },
    {
      id: 2,
      name: 'Momo Revenge Alloy Wheels 17"',
      category: 'Exterior',
      price: 32000,
      image: 'https://www.tyresales.com.au/images/alloy-wheels/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled/hero/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled-wheel-380.jpg',
      rating: 4.8,
      reviewCount: 215,
      compatibility: ['Most Sedans and SUVs']
    },
    {
      id: 3,
      name: 'Premium Leather Seat Covers',
      category: 'Interior',
      price: 18500,
      image: 'https://icdn.digitaltrends.com/image/digitaltrends/2020-bentley-continental-gt-v8-coupe-interior-500x500.jpg',
      rating: 4.7,
      reviewCount: 195,
      compatibility: ['Universal Fit']
    },
    {
      id: 4,
      name: 'Premium Vinyl Wrap - Matte Black',
      category: 'Exterior',
      price: 55000,
      image: 'https://images.squarespace-cdn.com/content/v1/5cf89255dc34db0001a4da0e/1584647207580-QVNC5T8P0Z9K9AQ1PBEH/GT-R-Geometric-Wrap.jpg',
      rating: 4.8,
      reviewCount: 168,
      compatibility: ['Full Vehicle Wrap']
    }
  ];

  // Community Projects
  const communityProjects = [
    {
      id: 1,
      title: 'Ultimate City Transformation',
      user: {
        name: 'RacingLegend',
        avatar: 'R',
        isVerified: true
      },
      vehicle: '2022 Honda City ZX',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/133517/endeavour-sport-exterior-right-front-three-quarter-3.jpeg?isig=0&q=75',
      likes: 342,
      comments: 56,
      totalCost: 215000,
      difficulty: 'Advanced'
    },
    {
      id: 2,
      title: 'Vintage Revival Project',
      user: {
        name: 'CruiserFan',
        avatar: 'C',
        isVerified: false
      },
      vehicle: '2021 Royal Enfield Classic 350',
      image: 'https://static.toiimg.com/thumb/msid-81065102,width-1070,height-580,imgsize-1301683,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg',
      likes: 285,
      comments: 42,
      totalCost: 78000,
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      title: 'Electric Green Machine',
      user: {
        name: 'UrbanRider',
        avatar: 'U',
        isVerified: true
      },
      vehicle: '2023 Tata Nexon EV',
      image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/2022-x1-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75',
      likes: 198,
      comments: 27,
      totalCost: 135000,
      difficulty: 'Intermediate'
    }
  ];

  // Tutorials
  const tutorials = [
    {
      id: 1,
      title: 'Complete Guide to Wheel Selection',
      type: 'Video',
      image: 'https://www.tyresales.com.au/images/alloy-wheels/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled/hero/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled-wheel-380.jpg',
      duration: '25:45',
      level: 'Beginner',
      instructor: 'Alex Chen',
      views: 12584,
      category: 'Exterior'
    },
    {
      id: 2,
      title: 'Professional Vinyl Wrap Techniques',
      type: 'Video',
      image: 'https://images.squarespace-cdn.com/content/v1/5cf89255dc34db0001a4da0e/1584647207580-QVNC5T8P0Z9K9AQ1PBEH/GT-R-Geometric-Wrap.jpg',
      duration: '38:12',
      level: 'Intermediate',
      instructor: 'Samantha Wright',
      views: 8456,
      category: 'Exterior'
    },
    {
      id: 3,
      title: 'Engine Performance Tuning Basics',
      type: 'Article',
      image: 'https://hips.hearstapps.com/hmg-prod/images/car-engine-1628113752.jpeg',
      duration: '15 min read',
      level: 'Advanced',
      instructor: 'Michael Rodriguez',
      views: 6289,
      category: 'Performance'
    }
  ];

  // DIY Guides
  const diyGuides = [
    {
      id: 1,
      title: 'Weekend Wheel Replacement',
      image: 'https://www.tyresales.com.au/images/alloy-wheels/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled/hero/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled-wheel-380.jpg',
      difficulty: 'Easy',
      time: '2-3 hours',
      tools: 8,
      steps: 12,
      category: 'Exterior'
    },
    {
      id: 2,
      title: 'Interior LED Lighting Installation',
      image: 'https://m.media-amazon.com/images/I/71+-wQFrHRL._AC_UF894,1000_QL80_.jpg',
      difficulty: 'Easy',
      time: '1-2 hours',
      tools: 5,
      steps: 8,
      category: 'Interior'
    },
    {
      id: 3,
      title: 'Exhaust System Upgrade Guide',
      image: 'https://www.carid.com/images/borla/items/140307.jpg',
      difficulty: 'Intermediate',
      time: '3-4 hours',
      tools: 12,
      steps: 18,
      category: 'Performance'
    }
  ];

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Show toast notification for each tab switch
    toast({
      title: `${value.charAt(0).toUpperCase() + value.slice(1)} Section`,
      description: `Viewing ${value} content`,
      variant: "default"
    });
  };

  // Handle starting new project
  const handleStartNewProject = () => {
    window.location.href = '/arena?step=vehicleSource';
  };

  // Generate month/day from date
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
  };

  return (
    <div className="container mx-auto py-4 space-y-8">
      {/* Main Navigation */}
      <div className="sticky top-16 z-10 bg-background pt-2 pb-2 border-b">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full overflow-auto justify-start">
            <TabsTrigger value="studio" className="font-medium text-md">MY STUDIO</TabsTrigger>
            <TabsTrigger value="discover" className="font-medium text-md">DISCOVER</TabsTrigger>
            <TabsTrigger value="learn" className="font-medium text-md">LEARN</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* MY STUDIO Tab */}
        <TabsContent value="studio" className="space-y-8">
          {/* Sub-navigation for Studio */}
          <div className="flex overflow-x-auto pb-2 gap-2">
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <Edit size={14} /> Active Projects
            </Button>
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <Heart size={14} /> Saved Designs
            </Button>
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <Car size={14} /> Vehicle Profiles
            </Button>
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <Calendar size={14} /> Appointments
            </Button>
          </div>

          {/* Welcome Banner */}
          <motion.div 
            className="h-64 relative rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/2022-x1-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75)', 
                filter: 'brightness(0.4)' 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/30" />
            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome to Your Studio</h1>
              <p className="text-lg text-white/80 mb-6 max-w-xl">
                Create, manage, and track all your vehicle customization projects in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
                  onClick={handleStartNewProject}
                >
                  START NEW PROJECT
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/20"
                >
                  EXPLORE TEMPLATES
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Active Projects Section */}
          <motion.section
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Active Projects</h2>
              <Button variant="ghost" className="gap-1" onClick={handleStartNewProject}>
                New Project <Plus size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProjects.map((project: Project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="flex justify-between">
                        <span className="text-white text-sm">{project.vehicle}</span>
                        <Badge variant="outline" className="bg-black/50 text-white border-none">
                          {formatPrice(project.totalCost)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{project.title}</CardTitle>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock size={14} />
                        <span>Edited {formatRelativeTime(project.lastEdited)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Progress value={project.progress} className="h-2" />
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3">
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                        <Share2 size={14} />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleJoinProject(project.id)}
                      className={selectedProject === project.id ? "bg-green-700 hover:bg-green-800" : ""}
                    >
                      {selectedProject === project.id ? "Collaborating" : "Continue Editing"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.section>
          
          {/* Collaboration Panel - Only show when a project is selected */}
          {selectedProject && collaborators.length > 0 && (
            <motion.section
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card className="bg-[#1E3A8A]/5 border-[#1E3A8A]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users size={18} /> Real-time Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {collaborators.map((collaborator) => (
                      <div 
                        key={collaborator.userId} 
                        className="flex items-center gap-2 bg-background p-2 rounded-lg"
                      >
                        <div className={`h-2 w-2 rounded-full ${collaborator.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-[#1E3A8A] text-white">
                            {collaborator.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{collaborator.username}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}
          
          {/* Vehicle Profiles */}
          <motion.section
            className="pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Vehicles</h2>
              <Button variant="ghost" className="gap-1">
                Add Vehicle <Plus size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicles.map((vehicle: VehicleProfile) => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="h-36 overflow-hidden">
                    <img 
                      src={vehicle.image} 
                      alt={`${vehicle.make} ${vehicle.model}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-3 pb-3">
                    <h3 className="font-bold text-lg">{vehicle.make} {vehicle.model} {vehicle.year}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.trim} • {vehicle.color}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="secondary">{vehicle.modifications} Modifications</Badge>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Upcoming Appointments */}
          <motion.section
            className="pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
              <Button variant="ghost" className="gap-1">
                Schedule New <Calendar size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((appointment: Appointment) => (
                <Card key={appointment.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="flex">
                    <div className="bg-[#1E3A8A] text-white p-4 flex flex-col items-center justify-center min-w-[80px]">
                      <span className="text-2xl font-bold">{formatAppointmentDate(appointment.date).split(' ')[1]}</span>
                      <span className="text-sm">{formatAppointmentDate(appointment.date).split(' ')[0]}</span>
                    </div>
                    <CardContent className="p-4 flex-1">
                      <h3 className="font-bold">{appointment.service}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.vehicle} • {appointment.provider}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant={appointment.status === 'Scheduled' ? 'outline' : 'default'}>
                          {appointment.status}
                        </Badge>
                        <span className="font-medium">{formatPrice(appointment.cost)}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>
        </TabsContent>

        {/* DISCOVER Tab */}
        <TabsContent value="discover" className="space-y-8">
          {/* Sub-navigation for Discover */}
          <div className="flex overflow-x-auto pb-2 gap-2">
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <Package size={14} /> Trending Products
            </Button>
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <Users size={14} /> Community Showcase
            </Button>
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <Award size={14} /> Staff Picks
            </Button>
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <Star size={14} /> Seasonal Collections
            </Button>
          </div>

          {/* Discover Banner */}
          <motion.div 
            className="h-64 relative rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(https://images.squarespace-cdn.com/content/v1/5cf89255dc34db0001a4da0e/1584647207580-QVNC5T8P0Z9K9AQ1PBEH/GT-R-Geometric-Wrap.jpg)', 
                filter: 'brightness(0.4)' 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/30" />
            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Discover Possibilities</h1>
              <p className="text-lg text-white/80 mb-6 max-w-xl">
                Explore trending products, community creations, and expert recommendations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white">
                  EXPLORE PRODUCTS
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  VIEW COMMUNITY
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Trending Products */}
          <motion.section
            className="pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Trending Products</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="ghost" className="gap-1">
                  View All <ChevronRight size={16} />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingProducts.map((product: Product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2">{product.category}</Badge>
                    <h3 className="font-bold text-md line-clamp-2">{product.name}</h3>
                    <div className="flex justify-between mt-2 items-center">
                      <span className="font-medium">{formatPrice(product.price)}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm">{product.rating} ({product.reviewCount})</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full">View Product</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Community Showcase */}
          <motion.section
            className="pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Community Showcase</h2>
              <Button variant="ghost" className="gap-1">
                View All <ChevronRight size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {communityProjects.map((project: CommunityProject) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border border-white">
                            <AvatarImage alt={project.user.name} />
                            <AvatarFallback className="bg-[#1E3A8A] text-white">{project.user.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center">
                            <span className="text-white text-sm font-medium">{project.user.name}</span>
                            {project.user.isVerified && (
                              <Badge className="ml-1 h-4 bg-[#0D9488] text-white">Expert</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#1E3A8A]">{project.difficulty}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.vehicle}</p>
                    <div className="flex justify-between mt-2 items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <ThumbsUp size={14} />
                          <span className="text-sm">{project.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">💬</span>
                          <span className="text-sm">{project.comments}</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(project.totalCost)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Seasonal Collections Section */}
          <motion.section
            className="pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="h-60 relative rounded-xl overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: 'url(https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/2022-x1-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75)', 
                  filter: 'brightness(0.4)' 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F97316]/80 to-[#F97316]/30" />
              <div className="absolute inset-0 flex flex-col justify-center px-8">
                <Badge className="w-fit mb-2 bg-white text-[#F97316]">NEW COLLECTION</Badge>
                <h2 className="text-3xl font-bold text-white mb-2">Summer 2025 Edition</h2>
                <p className="text-lg text-white/90 mb-4 max-w-md">
                  Exclusive summer upgrades and limited time offers on premium packages.
                </p>
                <Button 
                  className="w-fit bg-white text-[#F97316] hover:bg-white/90"
                >
                  EXPLORE COLLECTION
                </Button>
              </div>
            </div>
          </motion.section>
        </TabsContent>

        {/* LEARN Tab */}
        <TabsContent value="learn" className="space-y-8">
          {/* Sub-navigation for Learn */}
          <div className="flex overflow-x-auto pb-2 gap-2">
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <Video size={14} /> Tutorials
            </Button>
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <FileText size={14} /> DIY Guides
            </Button>
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <Lightbulb size={14} /> Expert Tips
            </Button>
            <Button variant="outline" className="rounded-full flex items-center gap-2" size="sm">
              <Wrench size={14} /> Installation Walkthroughs
            </Button>
          </div>

          {/* Learn Banner */}
          <motion.div 
            className="h-64 relative rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(https://www.carid.com/images/borla/items/140307.jpg)', 
                filter: 'brightness(0.4)' 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/30" />
            <div className="absolute inset-0 flex flex-col justify-center px-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Learn & Master</h1>
              <p className="text-lg text-white/80 mb-6 max-w-xl">
                Tutorials, guides, and expert tips to help you customize with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white">
                  EXPLORE TUTORIALS
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  BROWSE DIY GUIDES
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tutorials */}
          <motion.section
            className="pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Popular Tutorials</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Filter By Level
                </Button>
                <Button variant="ghost" className="gap-1">
                  View All <ChevronRight size={16} />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tutorials.map((tutorial: Tutorial) => (
                <Card key={tutorial.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={tutorial.image} 
                      alt={tutorial.title} 
                      className="w-full h-full object-cover"
                    />
                    {tutorial.type === 'Video' && (
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm">
                        {tutorial.duration}
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge 
                        className={
                          tutorial.level === 'Beginner' ? 'bg-green-600' : 
                          tutorial.level === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-600'
                        }
                      >
                        {tutorial.level}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-black/50 text-white border-none">
                        {tutorial.type}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{tutorial.title}</h3>
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>By {tutorial.instructor}</span>
                      <span>{tutorial.views.toLocaleString()} views</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full">Watch Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* DIY Guides */}
          <motion.section
            className="pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">DIY Guides</h2>
              <Button variant="ghost" className="gap-1">
                View All <ChevronRight size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {diyGuides.map((guide: DIYGuide) => (
                <Card key={guide.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={guide.image} 
                      alt={guide.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge 
                        className={
                          guide.difficulty === 'Easy' ? 'bg-green-600' : 
                          guide.difficulty === 'Intermediate' ? 'bg-yellow-600' : 'bg-red-600'
                        }
                      >
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-[#1E3A8A]">{guide.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{guide.title}</h3>
                    <div className="flex justify-between mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{guide.time}</span>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                          <Wrench size={14} />
                          <span>{guide.tools} tools</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText size={14} />
                          <span>{guide.steps} steps</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full">Read Guide</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Expert Tips Section */}
          <motion.section
            className="pt-6 pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] rounded-xl p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <Badge className="bg-white text-[#1E3A8A] mb-3">EXPERT INSIGHT</Badge>
                  <h2 className="text-2xl font-bold text-white mb-3">Performance Tuning Masterclass</h2>
                  <p className="text-white/90 mb-4">
                    Join our 3-part masterclass on engine performance tuning taught by professional mechanics and automotive engineers. Learn the fundamentals of ECU tuning, intake/exhaust optimization, and dyno testing.
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-white text-[#1E3A8A] hover:bg-white/90">
                      Register Now
                    </Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white/10">
                      Learn More
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/3 flex items-center justify-center">
                  <div className="bg-white/10 p-4 rounded-lg text-white text-center">
                    <CalendarIcon size={48} className="mx-auto mb-2" />
                    <h3 className="font-bold">Next Session</h3>
                    <p>May 15, 2025</p>
                    <p className="text-sm">2:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Calendar Icon Component
const CalendarIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </svg>
);

export default NewArenaDashboard;