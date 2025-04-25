import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Plus,
  Users,
  Home,
  Star,
  BookOpen,
  Settings,
  Bell,
  ChevronDown,
  MessageSquare,
  Coffee,
  Car,
  Brush,
  Sparkles,
  PaintBucket,
  RotateCcw,
  Lightbulb,
  Layers,
  Zap,
  CircleEllipsis,
  Share2
} from 'lucide-react';

// Import components
import NewProjectWizard from '@/components/arena/NewProjectWizard';
import VehicleSelector from '@/components/arena/VehicleSelector';
import Vehicle3DViewer from '@/components/arena/Vehicle3DViewer';
import CustomizationCategories from '@/components/arena/CustomizationCategories';
import VehicleWrappingSystem from '@/components/arena/VehicleWrappingSystem';
import MultiVehicleComparison from '@/components/arena/MultiVehicleComparison';
import ArenaWrapper from '@/components/arena/ArenaWrapper';
import VoiceControl from '@/components/arena/VoiceControl';
import AchievementSystem from '@/components/arena/AchievementSystem';
import CollaborationMarkers from '@/components/arena/CollaborationMarkers';
import InspirationCarousel from '@/components/arena/InspirationCarousel';
import LoadingSkeleton from '@/components/arena/LoadingSkeleton';
import EnhancedBackground from '@/components/arena/EnhancedBackground';

import { useToast } from '@/hooks/use-toast';
import { useArenaWebsocket } from '@/hooks/use-arena-websocket';

// Demo data
const demoVehicles = [
  {
    id: 1,
    make: 'Honda',
    model: 'City',
    year: 2021,
    licensePlate: 'KA01MJ8234',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/41406/city-exterior-right-front-three-quarter-2.jpeg',
    specs: {
      engine: '1.5L i-VTEC',
      horsepower: 121,
      torque: 145,
      transmission: '7-speed CVT',
      drivetrain: 'FWD',
      fuelType: 'Petrol',
      weight: 1153,
      dimensions: {
        length: 4549,
        width: 1748,
        height: 1489,
        wheelbase: 2600
      }
    },
    modifications: []
  },
  {
    id: 2,
    make: 'Hyundai',
    model: 'Verna',
    year: 2020,
    licensePlate: 'MH02AB5678',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141383/verna-exterior-right-front-three-quarter.jpeg',
    specs: {
      engine: '1.5L MPI',
      horsepower: 115,
      torque: 144,
      transmission: '6-speed Manual',
      drivetrain: 'FWD',
      fuelType: 'Petrol',
      weight: 1170,
      dimensions: {
        length: 4440,
        width: 1729,
        height: 1475,
        wheelbase: 2580
      }
    },
    modifications: []
  },
  {
    id: 3,
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2022,
    licensePlate: 'DL7CX5544',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/swift-exterior-right-front-three-quarter-2.jpeg',
    specs: {
      engine: '1.2L DualJet',
      horsepower: 89,
      torque: 113,
      transmission: '5-speed AMT',
      drivetrain: 'FWD',
      fuelType: 'Petrol',
      weight: 905,
      dimensions: {
        length: 3845,
        width: 1735,
        height: 1530,
        wheelbase: 2450
      }
    },
    modifications: []
  }
];

const ArenaDashboardEnhanced: React.FC = () => {
  const { toast } = useToast();
  const { 
    connect, 
    disconnect, 
    sendMessage, 
    lastMessage, 
    readyState 
  } = useArenaWebsocket();
  
  const [activeTab, setActiveTab] = useState<'my-studio' | 'discover' | 'learn'>('my-studio');
  const [showNewProjectWizard, setShowNewProjectWizard] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(320);
  const [activeSection, setActiveSection] = useState<string>('overview');
  
  // Demo project data
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'City Sport Edition',
      description: 'Racing inspired design with matte black wrap and red accents',
      vehicleId: 1,
      thumbnail: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a',
      createdAt: '2025-04-10',
      lastModified: '2025-04-23',
      collaborators: 2,
      status: 'in-progress'
    },
    {
      id: 2,
      name: 'Elegant White Verna',
      description: 'Minimalist design with premium wheels and subtle accents',
      vehicleId: 2,
      thumbnail: 'https://images.unsplash.com/photo-1566274360959-5b4411569afe',
      createdAt: '2025-03-25',
      lastModified: '2025-04-18',
      collaborators: 0,
      status: 'completed'
    }
  ]);

  // Connect to WebSocket on component mount
  useEffect(() => {
    connect();
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      disconnect();
    };
  }, [connect, disconnect]);
  
  // Handle WebSocket messages for collaboration
  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      
      if (data.type === 'USER_JOINED') {
        toast({
          title: "Collaborator joined",
          description: `${data.payload.username} has joined the design session`,
        });
      } else if (data.type === 'USER_LEFT') {
        toast({
          title: "Collaborator left",
          description: `${data.payload.username} has left the design session`,
        });
      } else if (data.type === 'CURSOR_POSITION') {
        // Handle cursor position updates
        console.log('Cursor position update:', data.payload);
      }
    }
  }, [lastMessage, toast]);
  
  // Handle new project creation
  const handleCreateProject = (projectData: any) => {
    // In a real app, this would be an API call
    const newProject = {
      id: projects.length + 1,
      name: projectData.name,
      description: projectData.description,
      vehicleId: projectData.vehicleId,
      thumbnail: demoVehicles.find(v => v.id === projectData.vehicleId)?.image || '',
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      collaborators: 0,
      status: 'in-progress'
    };
    
    setProjects([newProject, ...projects]);
    setShowNewProjectWizard(false);
    
    toast({
      title: "Project created",
      description: `Your project "${projectData.name}" has been created successfully.`,
    });
    
    // Award points for creating a new project
    setUserPoints(prev => prev + 50);
    
    // Simulate a WebSocket message about the new project
    sendMessage(JSON.stringify({
      type: 'PROJECT_CREATED',
      payload: {
        projectId: newProject.id,
        projectName: newProject.name,
        timestamp: new Date().toISOString()
      }
    }));
  };
  
  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    
    toast({
      title: "Voice Command",
      description: `Executing: ${command}`,
    });
  };
  
  // List of available voice commands
  const voiceCommands = [
    {
      name: 'New Project',
      description: 'Start creating a new design project',
      keywords: ['new project', 'create project', 'start new design'],
      action: () => setShowNewProjectWizard(true)
    },
    {
      name: 'Switch to Discover',
      description: 'Go to the Discover tab',
      keywords: ['switch to discover', 'go to discover', 'show discover'],
      action: () => setActiveTab('discover')
    },
    {
      name: 'Switch to Studio',
      description: 'Go to My Studio tab',
      keywords: ['switch to studio', 'go to studio', 'show studio', 'my studio'],
      action: () => setActiveTab('my-studio')
    },
    {
      name: 'Switch to Learn',
      description: 'Go to the Learn tab',
      keywords: ['switch to learn', 'go to learn', 'show learn'],
      action: () => setActiveTab('learn')
    },
    {
      name: 'Select First Vehicle',
      description: 'Select the first vehicle in your list',
      keywords: ['select first vehicle', 'choose first vehicle'],
      action: () => setSelectedVehicle(demoVehicles[0])
    }
  ];
  
  // Handle achievement completion
  const handleAchievementComplete = (achievementId: string) => {
    console.log('Achievement completed:', achievementId);
    
    // Send a message to other collaborators
    sendMessage(JSON.stringify({
      type: 'ACHIEVEMENT_UNLOCKED',
      payload: {
        achievementId,
        timestamp: new Date().toISOString()
      }
    }));
  };
  
  // Handle sending collaboration markers
  const handleSendMarker = (position: { x: number; y: number }, action: string) => {
    sendMessage(JSON.stringify({
      type: 'CURSOR_POSITION',
      payload: {
        position,
        action,
        timestamp: new Date().toISOString()
      }
    }));
  };
  
  return (
    <ArenaWrapper>
      {isLoading ? (
        <LoadingSkeleton type="full-page" />
      ) : (
        <div className="flex flex-col h-full relative">
          {/* Enhanced background */}
          <div className="absolute inset-0 -z-10">
            <EnhancedBackground 
              type="gradient" 
              primaryColor="#1E3A8A" 
              secondaryColor="#0D9488"
              animated
              interactive
            />
          </div>
          
          {/* Header */}
          <div className="border-b bg-background/95 backdrop-blur-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Arena
              </h1>
              
              <Tabs 
                value={activeTab} 
                onValueChange={(value) => setActiveTab(value as any)}
                className="w-auto"
              >
                <TabsList>
                  <TabsTrigger value="my-studio" className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">My Studio</span>
                  </TabsTrigger>
                  <TabsTrigger value="discover" className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Discover</span>
                  </TabsTrigger>
                  <TabsTrigger value="learn" className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Learn</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Voice Control */}
              <VoiceControl 
                onCommand={handleVoiceCommand}
                commands={voiceCommands}
              />
              
              {/* Achievement System */}
              <AchievementSystem 
                userPoints={userPoints}
                onPointsEarned={(points) => setUserPoints(prev => prev + points)}
                onAchievementComplete={handleAchievementComplete}
              />
              
              {/* Collaboration markers */}
              <CollaborationMarkers 
                projectId="demo-project-1"
                onSendMarker={handleSendMarker}
              />
              
              <Button
                variant="default"
                size="sm"
                className="hidden sm:flex items-center gap-1"
                onClick={() => setShowNewProjectWizard(true)}
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              </Button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} className="h-full">
              {/* MY STUDIO TAB */}
              <TabsContent value="my-studio" className="h-full m-0 outline-none">
                <div className="flex flex-col h-full">
                  {/* Secondary tab navigation */}
                  <div className="border-b bg-muted/50 px-4">
                    <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar">
                      <Button 
                        variant={activeSection === 'overview' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-10"
                        data-state={activeSection === 'overview' ? "active" : undefined}
                        onClick={() => setActiveSection('overview')}
                      >
                        Overview
                      </Button>
                      <Button 
                        variant={activeSection === 'projects' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-10"
                        data-state={activeSection === 'projects' ? "active" : undefined}
                        onClick={() => setActiveSection('projects')}
                      >
                        Projects
                      </Button>
                      <Button 
                        variant={activeSection === 'vehicles' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-10"
                        data-state={activeSection === 'vehicles' ? "active" : undefined}
                        onClick={() => setActiveSection('vehicles')}
                      >
                        Vehicles
                      </Button>
                      <Button 
                        variant={activeSection === 'designs' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-10"
                        data-state={activeSection === 'designs' ? "active" : undefined}
                        onClick={() => setActiveSection('designs')}
                      >
                        Saved Designs
                      </Button>
                      <Button 
                        variant={activeSection === 'appointment' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-10"
                        data-state={activeSection === 'appointment' ? "active" : undefined}
                        onClick={() => setActiveSection('appointment')}
                      >
                        Appointments
                      </Button>
                    </div>
                  </div>
                  
                  {/* Main content area */}
                  <div className="flex-1 overflow-auto">
                    <div className="container mx-auto p-4 space-y-6">
                      {/* Featured project or 3D preview */}
                      <div className="relative rounded-lg overflow-hidden bg-card border h-[400px] shadow-sm">
                        {selectedVehicle ? (
                          <div className="h-full">
                            <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
                              <div>
                                <h2 className="text-xl font-bold text-white">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</h2>
                                <p className="text-white/80 text-sm">{selectedVehicle.specs?.engine} • {selectedVehicle.licensePlate}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/10 hover:bg-white/30">
                                  <Share2 className="h-4 w-4 mr-1" /> Share
                                </Button>
                                <Button size="sm" variant="default">
                                  <Brush className="h-4 w-4 mr-1" /> Customize
                                </Button>
                              </div>
                            </div>
                            <Vehicle3DViewer 
                              vehicleId={selectedVehicle.id}
                              vehicleMake={selectedVehicle.make}
                              vehicleModel={selectedVehicle.model}
                              vehicleYear={selectedVehicle.year}
                            />
                          </div>
                        ) : projects.length > 0 ? (
                          <div 
                            className="h-full w-full bg-cover bg-center relative"
                            style={{ backgroundImage: `url(${projects[0].thumbnail})` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
                              <Badge className="w-fit mb-2">Latest Project</Badge>
                              <h2 className="text-2xl font-bold text-white mb-1">{projects[0].name}</h2>
                              <p className="text-white/80 mb-4 max-w-xl">{projects[0].description}</p>
                              
                              <div className="flex space-x-3">
                                <Button>
                                  <Layers className="h-4 w-4 mr-2" /> Continue Design
                                </Button>
                                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                  <Share2 className="h-4 w-4 mr-2" /> Share
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full flex-col">
                            <div className="bg-primary/10 p-6 rounded-full mb-4">
                              <Car className="h-12 w-12 text-primary" />
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-center">No Projects Yet</h3>
                            <p className="text-muted-foreground mb-4 text-center max-w-md">
                              Create your first design project to start customizing your vehicle
                            </p>
                            <Button onClick={() => setShowNewProjectWizard(true)}>
                              <Plus className="h-4 w-4 mr-2" /> Create Project
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {/* Recent projects */}
                      {projects.length > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-bold">Recent Projects</h2>
                            <Button variant="ghost" size="sm">
                              View All
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projects.map(project => (
                              <motion.div 
                                key={project.id}
                                whileHover={{ y: -5 }}
                                className="bg-card rounded-lg border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                              >
                                <div 
                                  className="h-40 bg-cover bg-center" 
                                  style={{ backgroundImage: `url(${project.thumbnail})` }}
                                />
                                <div className="p-4">
                                  <h3 className="font-medium">{project.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{project.description}</p>
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <RotateCcw className="h-3 w-3 mr-1" />
                                      <span>Updated {project.lastModified}</span>
                                    </div>
                                    {project.collaborators > 0 && (
                                      <Badge variant="outline" className="flex items-center">
                                        <Users className="h-3 w-3 mr-1" />
                                        <span>{project.collaborators}</span>
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                            
                            {/* Add new project card */}
                            <motion.div 
                              whileHover={{ y: -5 }}
                              className="bg-card rounded-lg border overflow-hidden cursor-pointer border-dashed flex items-center justify-center h-[186px]"
                              onClick={() => setShowNewProjectWizard(true)}
                            >
                              <div className="flex flex-col items-center p-4">
                                <div className="bg-primary/10 p-3 rounded-full mb-3">
                                  <Plus className="h-6 w-6 text-primary" />
                                </div>
                                <p className="font-medium">New Project</p>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      )}
                      
                      {/* Inspiration Carousel */}
                      <div className="mt-6">
                        <InspirationCarousel />
                      </div>
                      
                      {/* Your Vehicles section */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h2 className="text-xl font-bold">Your Vehicles</h2>
                          <Button variant="ghost" size="sm">
                            Add Vehicle
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {demoVehicles.map(vehicle => (
                            <motion.div 
                              key={vehicle.id}
                              whileHover={{ scale: 1.02 }}
                              className="bg-card rounded-lg border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                              onClick={() => setSelectedVehicle(vehicle)}
                            >
                              <div 
                                className="h-32 bg-cover bg-center" 
                                style={{ backgroundImage: `url(${vehicle.image})` }}
                              />
                              <div className="p-4">
                                <h3 className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                                <p className="text-sm text-muted-foreground mb-1">{vehicle.licensePlate}</p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                                  <div className="flex items-center">
                                    <span>Engine:</span>
                                    <span className="ml-1 font-medium text-foreground">{vehicle.specs?.engine}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span>HP:</span>
                                    <span className="ml-1 font-medium text-foreground">{vehicle.specs?.horsepower}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span>Fuel:</span>
                                    <span className="ml-1 font-medium text-foreground">{vehicle.specs?.fuelType}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span>Transmission:</span>
                                    <span className="ml-1 font-medium text-foreground">{vehicle.specs?.transmission.split(' ')[0]}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* DISCOVER TAB */}
              <TabsContent value="discover" className="h-full m-0 outline-none">
                <div className="flex flex-col h-full">
                  {/* Secondary tab navigation */}
                  <div className="border-b bg-muted/50 px-4">
                    <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-none border-b-2 border-primary h-10"
                      >
                        Trending
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent h-10"
                      >
                        Community Showcase
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent h-10"
                      >
                        Staff Picks
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent h-10"
                      >
                        Seasonal Collections
                      </Button>
                    </div>
                  </div>
                  
                  {/* Main discover content area */}
                  <div className="flex-1 overflow-auto">
                    <div className="container mx-auto p-4">
                      <div className="mb-6 relative rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-primary/60 text-white p-6 md:p-8 rounded-lg relative z-10">
                          <div className="max-w-3xl">
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/10 mb-2">Featured</Badge>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">Trending Design Challenges</h2>
                            <p className="mb-4 text-white/80">Participate in weekly design challenges, get feedback from professionals, and win exclusive badges.</p>
                            <div className="flex flex-wrap gap-3">
                              <Button className="bg-white text-primary hover:bg-white/90">
                                <Zap className="h-4 w-4 mr-2" /> Enter Challenge
                              </Button>
                              <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                                <Star className="h-4 w-4 mr-2" /> View Winners
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Animated background */}
                        <div className="absolute inset-0 z-0 opacity-20">
                          <EnhancedBackground 
                            type="animated-shapes" 
                            primaryColor="#ffffff" 
                            secondaryColor="#ffffff"
                            density="medium"
                            animated
                          />
                        </div>
                      </div>
                      
                      {/* Popular designs grid */}
                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold">Popular Designs</h2>
                          <div className="flex items-center">
                            <Button variant="ghost" size="sm">
                              <Filter className="h-4 w-4 mr-2" /> Filter
                            </Button>
                            <Button variant="ghost" size="sm">
                              View All
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Loading skeletons when loading state is true */}
                          {isLoading ? (
                            <LoadingSkeleton type="gallery" count={3} />
                          ) : (
                            <>
                              {/* Popular design items would be mapped here */}
                              {Array.from({ length: 6 }).map((_, index) => (
                                <motion.div 
                                  key={index}
                                  whileHover={{ y: -5 }}
                                  className="bg-card rounded-lg border overflow-hidden cursor-pointer"
                                >
                                  <div className="relative">
                                    <div 
                                      className="h-48 bg-cover bg-center" 
                                      style={{ backgroundImage: `url(https://source.unsplash.com/random/600x400?car,${index})` }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                      <div className="flex justify-between items-end">
                                        <div>
                                          <Badge variant="secondary" className="mb-1 bg-white/20 text-white border-0">
                                            {index % 2 === 0 ? 'Wrap Design' : 'Performance Mod'}
                                          </Badge>
                                          <h3 className="font-medium text-white">Design Project Title {index + 1}</h3>
                                        </div>
                                        <div className="flex">
                                          <Badge className="bg-primary/90 mr-1">{100 + index * 25} ⭐</Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="p-3 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <div className="h-7 w-7 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(https://randomuser.me/api/portraits/${index % 2 ? 'women' : 'men'}/${index + 20}.jpg)` }} />
                                      <span className="text-sm">User Name {index + 1}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <Heart className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <Bookmark className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* LEARN TAB */}
              <TabsContent value="learn" className="h-full m-0 outline-none">
                <div className="flex flex-col h-full">
                  {/* Secondary tab navigation */}
                  <div className="border-b bg-muted/50 px-4">
                    <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-none border-b-2 border-primary h-10"
                      >
                        Tutorials
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent h-10"
                      >
                        DIY Guides
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent h-10"
                      >
                        Expert Tips
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent h-10"
                      >
                        Installation Walkthroughs
                      </Button>
                    </div>
                  </div>
                  
                  {/* Learn content area */}
                  <div className="flex-1 overflow-auto">
                    <div className="container mx-auto p-4">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Featured Tutorials</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="bg-card rounded-lg overflow-hidden border">
                              <div 
                                className="h-40 bg-cover bg-center" 
                                style={{ backgroundImage: `url(https://source.unsplash.com/random/600x400?tutorial,${index})` }}
                              />
                              <div className="p-4">
                                <Badge className="mb-2">
                                  {index === 0 ? 'Beginner' : index === 1 ? 'Intermediate' : 'Advanced'}
                                </Badge>
                                <h3 className="font-medium mb-1">Tutorial Title {index + 1}</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Short description about this tutorial and what you'll learn from it.
                                </p>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{10 + index * 5} min</span>
                                  </div>
                                  <Button variant="ghost" size="sm">Watch Now</Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="rounded-lg bg-muted/30 p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold mb-2">Want to become a design expert?</h3>
                            <p className="text-muted-foreground mb-4 max-w-md">
                              Take our advanced design certification course and learn from industry professionals.
                            </p>
                            <Button>
                              <Lightbulb className="h-4 w-4 mr-2" /> Explore Courses
                            </Button>
                          </div>
                          <div className="flex-1 hidden md:block">
                            <img 
                              src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                              alt="Learning Illustration" 
                              className="rounded-lg w-full h-40 object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-bold mb-4">Recent DIY Guides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="bg-card rounded-lg overflow-hidden border">
                              <div 
                                className="h-32 bg-cover bg-center" 
                                style={{ backgroundImage: `url(https://source.unsplash.com/random/600x400?DIY,${index})` }}
                              />
                              <div className="p-3">
                                <h3 className="font-medium mb-1 line-clamp-1">DIY Guide Title {index + 1}</h3>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  Step-by-step instructions for your vehicle customization project.
                                </p>
                                <div className="flex justify-between items-center">
                                  <Badge variant="outline" className="text-xs">
                                    {['Wrapping', 'Interior', 'Lighting', 'Audio'][index]}
                                  </Badge>
                                  <Button variant="ghost" size="sm" className="h-7">Read</Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* New Project Wizard */}
          <AnimatePresence>
            {showNewProjectWizard && (
              <NewProjectWizard 
                onClose={() => setShowNewProjectWizard(false)}
                onCreateProject={handleCreateProject}
                availableVehicles={demoVehicles}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </ArenaWrapper>
  );
};

// For TypeScript errors in the demo
const Filter = CircleEllipsis;
const Users = Users;
const Heart = Star;
const Bookmark = Star;

export default ArenaDashboardEnhanced;