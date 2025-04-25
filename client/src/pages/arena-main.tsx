import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Sparkles, 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Car, 
  Users, 
  Star, 
  Award, 
  Calendar, 
  Settings,
  Bell,
  Info,
  MessageSquare,
  Zap,
  Bookmark,
  Clock,
  User,
  Wrench,
  ChevronRight,
  Share,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// Custom Components
import NewProjectWizard from '@/components/arena/NewProjectWizard';
import ArenaWrapper from '@/components/arena/ArenaWrapper';
import VoiceControl from '@/components/arena/VoiceControl';
import AchievementSystem from '@/components/arena/AchievementSystem';
import LoadingSkeleton from '@/components/arena/LoadingSkeleton';
import EnhancedBackground from '@/components/arena/EnhancedBackground';

// Hooks
import { useToast } from '@/hooks/use-toast';
import { useArenaWebSocketMock } from '@/hooks/use-arena-websocket-mock';

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
      serviceStatus: 'up-to-date',
      customized: true
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
      serviceStatus: 'due',
      customized: false
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
      serviceStatus: 'overdue',
      customized: false
    },
    modifications: []
  }
];

// Demo project data
const demoProjects = [
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
];

// Demo community showcase data
const demoCommunityShowcase = [
  {
    id: 1,
    title: 'Midnight Racer R8',
    description: 'Stealth design with carbon fiber accents and custom rims',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a',
    creator: 'Speed Demon',
    likes: 432,
    comments: 56,
    tags: ['Performance', 'Custom Wrap', 'Wheels']
  },
  {
    id: 2,
    title: 'Sunset Cruiser',
    description: 'Elegant metallic orange wrap with chrome details',
    image: 'https://images.unsplash.com/photo-1592853598064-a566c3a93a6a',
    creator: 'DesignMaster',
    likes: 285,
    comments: 32,
    tags: ['Luxury', 'Wrap', 'Interior']
  },
  {
    id: 3,
    title: 'Urban Explorer',
    description: 'Rugged offroad package with matte finish',
    image: 'https://images.unsplash.com/photo-1601362840469-91286af97a8e',
    creator: 'OffRoadKing',
    likes: 198,
    comments: 23,
    tags: ['Offroad', 'Suspension', 'Lighting']
  },
  {
    id: 4,
    title: 'Electric Dream',
    description: 'Futuristic design for Tesla with ambient lighting',
    image: 'https://images.unsplash.com/photo-1617704548623-340376564e68',
    creator: 'FutureTech',
    likes: 367,
    comments: 41,
    tags: ['Electric', 'Lighting', 'Interior']
  }
];

// Demo appointments
const demoAppointments = [
  {
    id: 1,
    date: '2025-05-02',
    time: '10:00 AM',
    serviceCenter: 'Premium Auto Works',
    serviceType: 'Wheel & Tire Installation',
    vehicle: 'Honda City',
    status: 'confirmed',
    estimatedCompletion: '4 hours'
  },
  {
    id: 2,
    date: '2025-05-10',
    time: '2:30 PM',
    serviceCenter: 'Luxury Interiors',
    serviceType: 'Interior Customization',
    vehicle: 'Hyundai Verna',
    status: 'pending',
    estimatedCompletion: '3 days'
  }
];

// Demo staff picks
const demoStaffPicks = [
  {
    id: 1,
    title: 'Vintage Revival',
    description: 'Classic car restoration with modern touches',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
    creator: 'ClassicMod',
    staffComment: 'Perfect blend of vintage aesthetics with contemporary performance upgrades',
    highlights: ['Period-correct color scheme', 'Modern performance parts', 'Authentic details']
  },
  {
    id: 2,
    title: 'Neon Nights',
    description: 'Vibrant wrap with custom lighting installation',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f',
    creator: 'NightRider',
    staffComment: 'Innovative use of lighting that transforms the vehicle after dark',
    highlights: ['Reactive lighting system', 'Sound-responsive elements', 'High-quality materials']
  }
];

// Demo DIY guides
const demoDiyGuides = [
  {
    id: 1,
    title: 'Install LED Interior Lighting',
    difficulty: 'Easy',
    timeEstimate: '1-2 hours',
    tools: ['Wire stripper', 'Screwdriver set', 'Zip ties'],
    image: 'https://images.unsplash.com/photo-1574224683145-fbe465bdc1c4'
  },
  {
    id: 2,
    title: 'Apply Carbon Fiber Vinyl Wraps',
    difficulty: 'Medium',
    timeEstimate: '3-6 hours',
    tools: ['Heat gun', 'Vinyl toolkit', 'Precision knife'],
    image: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd'
  },
  {
    id: 3,
    title: 'Upgrade Your Speaker System',
    difficulty: 'Medium',
    timeEstimate: '4-5 hours',
    tools: ['Wire crimping tool', 'Panel removal tools', 'Digital multimeter'],
    image: 'https://images.unsplash.com/photo-1492891651366-a5c8259b9c90'
  }
];

const ArenaMain: React.FC = () => {
  const { toast } = useToast();
  const { 
    isConnected, 
    sendMessage, 
    lastMessage
  } = useArenaWebSocketMock();
  
  // Primary navigation state
  const [mainTab, setMainTab] = useState<'my-studio' | 'discover' | 'learn'>('my-studio');
  
  // My Studio secondary navigation
  const [studioSection, setStudioSection] = useState<string>('overview');
  
  // Discover secondary navigation
  const [discoverSection, setDiscoverSection] = useState<string>('trending');
  
  // Learn secondary navigation
  const [learnSection, setLearnSection] = useState<string>('diy-guides');
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(320);
  const [showNewProjectWizard, setShowNewProjectWizard] = useState(false);

  // User data state
  const [projects, setProjects] = useState(demoProjects);
  const [vehicles, setVehicles] = useState(demoVehicles);
  const [appointments, setAppointments] = useState(demoAppointments);
  
  // Connect to WebSocket on component mount
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        
        if (data.type === 'USER_JOINED') {
          toast({
            title: "Collaborator joined",
            description: `${data.payload.username} has joined the session`,
          });
        } else if (data.type === 'USER_LEFT') {
          toast({
            title: "Collaborator left",
            description: `${data.payload.username} has left the session`,
          });
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    }
  }, [lastMessage, toast]);
  
  // Handle new project creation
  const handleCreateProject = (projectData: any) => {
    // Create a new project from form data
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
    
    // Announce project creation
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
  
  // Available voice commands
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
      action: () => setMainTab('discover')
    },
    {
      name: 'Switch to Studio',
      description: 'Go to My Studio tab',
      keywords: ['switch to studio', 'go to studio', 'show studio', 'my studio'],
      action: () => setMainTab('my-studio')
    },
    {
      name: 'Switch to Learn',
      description: 'Go to the Learn tab',
      keywords: ['switch to learn', 'go to learn', 'show learn'],
      action: () => setMainTab('learn')
    },
    {
      name: 'Select First Vehicle',
      description: 'Select the first vehicle in your list',
      keywords: ['select first vehicle', 'choose first vehicle'],
      action: () => setStudioSection('vehicles')
    }
  ];
  
  // Handle achievement completion
  const handleAchievementComplete = (achievementId: string) => {
    // Award points for completing achievement
    setUserPoints(prev => prev + 20);
    
    toast({
      title: "Achievement Unlocked!",
      description: `You've earned 20 points`,
    });
  };
  
  // Render project status badge
  const renderProjectStatus = (status: string) => {
    switch (status) {
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Render vehicle service status badge
  const renderServiceStatus = (status: string) => {
    switch (status) {
      case 'up-to-date':
        return <Badge className="bg-green-500">Up to Date</Badge>;
      case 'due':
        return <Badge className="bg-yellow-500">Service Due</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Render appointment status badge
  const renderAppointmentStatus = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  // Render DIY difficulty badge
  const renderDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return <Badge className="bg-green-500">Easy</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'Hard':
        return <Badge className="bg-red-500">Hard</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
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
              primaryColor="#25D366" // Using the green color from docs
              secondaryColor="#1877F2" // Blue secondary from docs
              animated
              interactive
            />
          </div>
          
          {/* Header */}
          <header className="border-b bg-white/90 backdrop-blur-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-[#25D366]">
                Arena
              </h1>
              
              <Tabs 
                value={mainTab} 
                onValueChange={(value) => setMainTab(value as any)}
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
              
              <div className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full">
                <Users className="h-4 w-4 text-gray-500" />
                <span>3 Active</span>
              </div>
              
              <Button
                variant="default"
                size="sm"
                className="hidden sm:flex items-center gap-1 bg-[#25D366] hover:bg-[#22bf5b]"
                onClick={() => setShowNewProjectWizard(true)}
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]"></span>
                </span>
              </Button>

              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                AS
              </div>
            </div>
          </header>
          
          {/* Main content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={mainTab} className="h-full">
              {/* MY STUDIO TAB */}
              <TabsContent value="my-studio" className="h-full m-0 outline-none">
                <div className="flex flex-col h-full">
                  {/* Secondary tab navigation */}
                  <div className="border-b bg-gray-50 px-4">
                    <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar">
                      <Button 
                        variant={studioSection === 'overview' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={studioSection === 'overview' ? "active" : undefined}
                        onClick={() => setStudioSection('overview')}
                      >
                        Overview
                      </Button>
                      <Button 
                        variant={studioSection === 'projects' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={studioSection === 'projects' ? "active" : undefined}
                        onClick={() => setStudioSection('projects')}
                      >
                        Projects
                      </Button>
                      <Button 
                        variant={studioSection === 'vehicles' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={studioSection === 'vehicles' ? "active" : undefined}
                        onClick={() => setStudioSection('vehicles')}
                      >
                        Vehicles
                      </Button>
                      <Button 
                        variant={studioSection === 'designs' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={studioSection === 'designs' ? "active" : undefined}
                        onClick={() => setStudioSection('designs')}
                      >
                        Saved Designs
                      </Button>
                      <Button 
                        variant={studioSection === 'appointments' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={studioSection === 'appointments' ? "active" : undefined}
                        onClick={() => setStudioSection('appointments')}
                      >
                        Appointments
                      </Button>
                    </div>
                  </div>
                  
                  {/* Content area */}
                  <ScrollArea className="flex-1 p-6">
                    {/* OVERVIEW SECTION */}
                    {studioSection === 'overview' && (
                      <div className="space-y-6">
                        {/* Latest Project */}
                        <div className="relative overflow-hidden rounded-xl aspect-[21/9] mb-8">
                          <img 
                            src={projects[0]?.thumbnail || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a'} 
                            alt="Latest project" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                            <Badge className="mb-2 bg-[#25D366] self-start">Latest Project</Badge>
                            <h2 className="text-3xl font-bold text-white mb-2">{projects[0]?.name || 'City Sport Edition'}</h2>
                            <p className="text-white/90 max-w-2xl">{projects[0]?.description || 'Racing inspired design with matte black wrap and red accents'}</p>
                            <div className="flex gap-3 mt-4">
                              <Button size="sm">
                                Continue Design
                              </Button>
                              <Button size="sm" variant="outline" className="bg-white/20 text-white border-white/30">
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="flex items-center gap-2">
                                <Car className="h-5 w-5 text-[#25D366]" />
                                <span>Vehicles</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">{vehicles.length}</div>
                              <p className="text-sm text-muted-foreground">Registered vehicles</p>
                            </CardContent>
                            <CardFooter className="pt-0">
                              <Button variant="outline" size="sm" className="w-full" onClick={() => setStudioSection('vehicles')}>
                                Manage Vehicles
                              </Button>
                            </CardFooter>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-[#25D366]" />
                                <span>Projects</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">{projects.length}</div>
                              <p className="text-sm text-muted-foreground">Active customization projects</p>
                            </CardContent>
                            <CardFooter className="pt-0">
                              <Button variant="outline" size="sm" className="w-full" onClick={() => setStudioSection('projects')}>
                                View Projects
                              </Button>
                            </CardFooter>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-[#25D366]" />
                                <span>Appointments</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">{appointments.length}</div>
                              <p className="text-sm text-muted-foreground">Upcoming service appointments</p>
                            </CardContent>
                            <CardFooter className="pt-0">
                              <Button variant="outline" size="sm" className="w-full" onClick={() => setStudioSection('appointments')}>
                                Manage Schedule
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                        
                        {/* Recent Projects */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Recent Projects</h2>
                            <Button 
                              variant="link" 
                              className="text-[#25D366]"
                              onClick={() => setStudioSection('projects')}
                            >
                              View All
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                              <Card key={project.id} className="overflow-hidden">
                                <div className="aspect-[16/9] w-full">
                                  <img 
                                    src={project.thumbnail}
                                    alt={project.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <CardHeader className="p-4 pb-2">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">{project.name}</CardTitle>
                                    {renderProjectStatus(project.status)}
                                  </div>
                                  <CardDescription className="line-clamp-2">
                                    {project.description}
                                  </CardDescription>
                                </CardHeader>
                                <CardFooter className="p-4 pt-2 flex justify-between">
                                  <div className="text-xs text-muted-foreground">
                                    Last modified: {project.lastModified}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                      <Share className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardFooter>
                              </Card>
                            ))}
                            
                            <Card className="border-dashed flex flex-col items-center justify-center p-6 h-full">
                              <div className="rounded-full bg-gray-100 p-3 mb-3">
                                <Plus className="h-6 w-6 text-[#25D366]" />
                              </div>
                              <h3 className="font-medium mb-1">Start New Project</h3>
                              <p className="text-sm text-muted-foreground text-center mb-4">
                                Create a new customization project
                              </p>
                              <Button 
                                size="sm"
                                variant="default"
                                className="bg-[#25D366] hover:bg-[#22bf5b]"
                                onClick={() => setShowNewProjectWizard(true)}
                              >
                                New Project
                              </Button>
                            </Card>
                          </div>
                        </div>
                        
                        {/* Upcoming Appointments */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Upcoming Appointments</h2>
                            <Button 
                              variant="link" 
                              className="text-[#25D366]"
                              onClick={() => setStudioSection('appointments')}
                            >
                              View All
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            {appointments.map(appointment => (
                              <Card key={appointment.id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-medium">{appointment.serviceType}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {appointment.serviceCenter}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="text-xs">
                                          {appointment.vehicle}
                                        </Badge>
                                        {renderAppointmentStatus(appointment.status)}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium">
                                        {appointment.date} at {appointment.time}
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        Est. completion: {appointment.estimatedCompletion}
                                      </p>
                                      <div className="flex gap-2 justify-end mt-2">
                                        <Button variant="outline" size="sm">
                                          Reschedule
                                        </Button>
                                        <Button variant="outline" size="sm">
                                          Details
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* PROJECTS SECTION */}
                    {studioSection === 'projects' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">Your Customization Projects</h2>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Filter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="bg-[#25D366] hover:bg-[#22bf5b]"
                              onClick={() => setShowNewProjectWizard(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              New Project
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {projects.map(project => (
                            <Card key={project.id} className="overflow-hidden">
                              <div className="aspect-video w-full">
                                <img 
                                  src={project.thumbnail}
                                  alt={project.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">{project.name}</CardTitle>
                                  {renderProjectStatus(project.status)}
                                </div>
                                <CardDescription className="line-clamp-2">
                                  {project.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-4 pt-0 pb-2">
                                <div className="flex justify-between text-sm">
                                  <div className="flex items-center text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>
                                      {new Date(project.lastModified).toLocaleDateString('en-US', { 
                                        day: 'numeric', 
                                        month: 'short', 
                                        year: 'numeric' 
                                      })}
                                    </span>
                                  </div>
                                  {project.collaborators > 0 && (
                                    <div className="flex items-center text-muted-foreground">
                                      <Users className="h-4 w-4 mr-1" />
                                      <span>{project.collaborators} collaborators</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                              <CardFooter className="p-4 pt-2">
                                <div className="flex w-full gap-2">
                                  <Button variant="default" size="sm" className="flex-1">
                                    Continue
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Share
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Duplicate
                                  </Button>
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                          
                          <Card className="border-dashed flex flex-col items-center justify-center p-6 h-full">
                            <div className="rounded-full bg-gray-100 p-3 mb-3">
                              <Plus className="h-6 w-6 text-[#25D366]" />
                            </div>
                            <h3 className="font-medium mb-1">Start New Project</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                              Create a new customization project
                            </p>
                            <Button 
                              size="sm"
                              variant="default"
                              className="bg-[#25D366] hover:bg-[#22bf5b]"
                              onClick={() => setShowNewProjectWizard(true)}
                            >
                              New Project
                            </Button>
                          </Card>
                        </div>
                      </div>
                    )}
                    
                    {/* VEHICLES SECTION */}
                    {studioSection === 'vehicles' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">Your Vehicle Garage</h2>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Filter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="bg-[#25D366] hover:bg-[#22bf5b]"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Vehicle
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {vehicles.map(vehicle => (
                            <Card key={vehicle.id} className="overflow-hidden">
                              <div className="flex flex-col sm:flex-row">
                                <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto">
                                  <img 
                                    src={vehicle.image}
                                    alt={`${vehicle.make} ${vehicle.model}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="sm:w-3/5 p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-medium">{vehicle.make} {vehicle.model}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {vehicle.year} • {vehicle.licensePlate}
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                      {renderServiceStatus(vehicle.specs.serviceStatus)}
                                      {vehicle.specs.customized && (
                                        <Badge className="mt-1 bg-blue-500">Customized</Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Engine:</span>
                                      <span className="ml-1">{vehicle.specs.engine}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Fuel:</span>
                                      <span className="ml-1">{vehicle.specs.fuelType}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Transmission:</span>
                                      <span className="ml-1">{vehicle.specs.transmission}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Power:</span>
                                      <span className="ml-1">{vehicle.specs.horsepower} HP</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2 mt-3">
                                    <Button variant="default" size="sm" className="flex-1">
                                      Customize
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Service History
                                    </Button>
                                    <Button variant="outline" size="icon" size-sm>
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                          
                          <Card className="border-dashed flex flex-col items-center justify-center p-6 h-full">
                            <div className="rounded-full bg-gray-100 p-3 mb-3">
                              <Plus className="h-6 w-6 text-[#25D366]" />
                            </div>
                            <h3 className="font-medium mb-1">Add New Vehicle</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                              Register a new vehicle to your garage
                            </p>
                            <Button 
                              size="sm"
                              variant="default"
                              className="bg-[#25D366] hover:bg-[#22bf5b]"
                            >
                              Add Vehicle
                            </Button>
                          </Card>
                        </div>
                      </div>
                    )}
                    
                    {/* SAVED DESIGNS SECTION */}
                    {studioSection === 'designs' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">Your Saved Inspirations</h2>
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {demoCommunityShowcase.map(item => (
                            <Card key={item.id} className="overflow-hidden">
                              <div className="aspect-video w-full">
                                <img 
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">{item.title}</CardTitle>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Bookmark className="h-4 w-4" />
                                  </Button>
                                </div>
                                <CardDescription className="line-clamp-2">
                                  {item.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-4 pt-0 pb-2">
                                <div className="flex flex-wrap gap-1">
                                  {item.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                              <CardFooter className="p-4 pt-2">
                                <div className="flex w-full gap-2">
                                  <Button variant="default" size="sm" className="flex-1">
                                    Create Similar
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* APPOINTMENTS SECTION */}
                    {studioSection === 'appointments' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">Your Service Schedule</h2>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-[#25D366] hover:bg-[#22bf5b]"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Book Appointment
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium mb-2">Upcoming Appointments</h3>
                          {appointments.map(appointment => (
                            <Card key={appointment.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{appointment.serviceType}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {appointment.serviceCenter}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        {appointment.vehicle}
                                      </Badge>
                                      {renderAppointmentStatus(appointment.status)}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">
                                      {appointment.date} at {appointment.time}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Est. completion: {appointment.estimatedCompletion}
                                    </p>
                                    <div className="flex gap-2 justify-end mt-2">
                                      <Button variant="outline" size="sm">
                                        Reschedule
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        Cancel
                                      </Button>
                                      <Button variant="default" size="sm">
                                        Details
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          
                          <div className="mt-8">
                            <h3 className="text-lg font-medium mb-2">Past Appointments</h3>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-center text-muted-foreground py-6">
                                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                  <p>No past appointments to display</p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>
              
              {/* DISCOVER TAB */}
              <TabsContent value="discover" className="h-full m-0 outline-none">
                <div className="flex flex-col h-full">
                  {/* Secondary tab navigation */}
                  <div className="border-b bg-gray-50 px-4">
                    <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar">
                      <Button 
                        variant={discoverSection === 'trending' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={discoverSection === 'trending' ? "active" : undefined}
                        onClick={() => setDiscoverSection('trending')}
                      >
                        Trending
                      </Button>
                      <Button 
                        variant={discoverSection === 'community' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={discoverSection === 'community' ? "active" : undefined}
                        onClick={() => setDiscoverSection('community')}
                      >
                        Community Showcase
                      </Button>
                      <Button 
                        variant={discoverSection === 'staff-picks' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={discoverSection === 'staff-picks' ? "active" : undefined}
                        onClick={() => setDiscoverSection('staff-picks')}
                      >
                        Staff Picks
                      </Button>
                      <Button 
                        variant={discoverSection === 'seasonal' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={discoverSection === 'seasonal' ? "active" : undefined}
                        onClick={() => setDiscoverSection('seasonal')}
                      >
                        Seasonal Collections
                      </Button>
                    </div>
                  </div>
                  
                  {/* Content area */}
                  <ScrollArea className="flex-1 p-6">
                    {/* TRENDING SECTION */}
                    {discoverSection === 'trending' && (
                      <div className="space-y-8">
                        {/* Featured Challenge */}
                        <div className="bg-[#25D366] rounded-xl overflow-hidden">
                          <div className="p-8 text-white">
                            <Badge className="bg-white text-[#25D366] mb-2">Featured</Badge>
                            <h2 className="text-3xl font-bold mb-2">Trending Design Challenges</h2>
                            <p className="text-white/90 max-w-2xl mb-6">
                              Participate in weekly design challenges, get feedback from professionals, and win exclusive badges.
                            </p>
                            <div className="flex gap-3">
                              <Button size="sm" className="bg-white text-[#25D366] hover:bg-gray-100">
                                <Zap className="h-4 w-4 mr-2" />
                                Enter Challenge
                              </Button>
                              <Button size="sm" variant="outline" className="text-white border-white/50 hover:bg-white/10">
                                <Star className="h-4 w-4 mr-2" />
                                View Winners
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Popular Designs */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Popular Designs</h2>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                              </Button>
                              <Button variant="link" className="text-[#25D366]">
                                View All
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {demoCommunityShowcase.map(item => (
                              <Card key={item.id} className="overflow-hidden">
                                <div className="aspect-video w-full">
                                  <img 
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <CardHeader className="p-4 pb-2">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">{item.title}</CardTitle>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Bookmark className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <CardDescription>
                                    By {item.creator}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 pb-2">
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {item.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {item.tags.map(tag => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-2 flex justify-between">
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                                      <Star className="h-4 w-4" />
                                      <span>{item.likes}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                                      <MessageSquare className="h-4 w-4" />
                                      <span>{item.comments}</span>
                                    </Button>
                                  </div>
                                  <Button size="sm">Get Inspired</Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* COMMUNITY SHOWCASE SECTION */}
                    {discoverSection === 'community' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">Community Masterpieces</h2>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Filter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="bg-[#25D366] hover:bg-[#22bf5b]"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Submit Your Project
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {demoCommunityShowcase.map(item => (
                            <Card key={item.id} className="overflow-hidden">
                              <div className="aspect-[4/3] w-full">
                                <img 
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                                      {item.creator.charAt(0)}
                                    </div>
                                    <div>
                                      <CardTitle className="text-base">{item.title}</CardTitle>
                                      <CardDescription>
                                        By {item.creator}
                                      </CardDescription>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Bookmark className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0 pb-2">
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {item.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {item.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                              <CardFooter className="p-4 pt-2 flex justify-between">
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                                    <Star className="h-4 w-4" />
                                    <span>{item.likes}</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{item.comments}</span>
                                  </Button>
                                </div>
                                <Button size="sm">Get Inspired</Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* STAFF PICKS SECTION */}
                    {discoverSection === 'staff-picks' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Staff Favorites</h2>
                        <p className="text-muted-foreground">
                          Exceptional customization projects selected by our design experts
                        </p>
                        
                        <div className="space-y-6">
                          {demoStaffPicks.map(pick => (
                            <Card key={pick.id} className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-2/5 aspect-video md:aspect-auto">
                                  <img 
                                    src={pick.image}
                                    alt={pick.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="md:w-3/5 p-6">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Award className="h-5 w-5 text-[#25D366]" />
                                    <h3 className="font-medium text-lg">{pick.title}</h3>
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground mb-3">
                                    By {pick.creator}
                                  </p>
                                  
                                  <div className="bg-muted p-3 rounded-lg mb-4 text-sm italic">
                                    "{pick.staffComment}"
                                  </div>
                                  
                                  <div className="mb-4">
                                    <h4 className="text-sm font-medium mb-2">Highlights:</h4>
                                    <ul className="space-y-1">
                                      {pick.highlights.map((highlight, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                          <CheckCircle className="h-4 w-4 text-[#25D366] mt-0.5" />
                                          <span>{highlight}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="flex gap-3">
                                    <Button className="bg-[#25D366] hover:bg-[#22bf5b]">
                                      Get Inspired
                                    </Button>
                                    <Button variant="outline">
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* SEASONAL COLLECTIONS SECTION */}
                    {discoverSection === 'seasonal' && (
                      <div className="space-y-8">
                        {/* Featured Seasonal Collection */}
                        <div className="relative overflow-hidden rounded-xl aspect-[21/9]">
                          <img 
                            src="https://images.unsplash.com/photo-1525160354320-d8e92641c563"
                            alt="Summer Collection" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
                            <Badge className="mb-2 bg-[#25D366] self-start">Current Season</Badge>
                            <h2 className="text-3xl font-bold text-white mb-2">Summer 2025 Collection</h2>
                            <p className="text-white/90 max-w-2xl mb-4">
                              Bright colors, reflective wraps, and convertible-ready customizations perfect for the summer season.
                            </p>
                            <Button className="self-start bg-white text-[#25D366] hover:bg-gray-100">
                              Explore Collection
                            </Button>
                          </div>
                        </div>
                        
                        {/* Past Seasonal Collections */}
                        <div>
                          <h2 className="text-xl font-bold mb-4">Past Seasonal Collections</h2>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {['Spring Refresh', 'Winter Wonderland', 'Fall Colors'].map((season, index) => (
                              <Card key={index} className="overflow-hidden">
                                <div className="aspect-[4/3] w-full">
                                  <img 
                                    src={`https://source.unsplash.com/random/600x400?car,season,${index}`}
                                    alt={season}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <CardHeader className="p-4">
                                  <CardTitle className="text-base">{season}</CardTitle>
                                  <CardDescription>
                                    {['2025', '2024/2025', '2024'][index]} Collection
                                  </CardDescription>
                                </CardHeader>
                                <CardFooter className="p-4 pt-0">
                                  <Button variant="outline" className="w-full">
                                    View Collection
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>
              
              {/* LEARN TAB */}
              <TabsContent value="learn" className="h-full m-0 outline-none">
                <div className="flex flex-col h-full">
                  {/* Secondary tab navigation */}
                  <div className="border-b bg-gray-50 px-4">
                    <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar">
                      <Button 
                        variant={learnSection === 'diy-guides' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={learnSection === 'diy-guides' ? "active" : undefined}
                        onClick={() => setLearnSection('diy-guides')}
                      >
                        DIY Guides
                      </Button>
                      <Button 
                        variant={learnSection === 'expert-tips' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={learnSection === 'expert-tips' ? "active" : undefined}
                        onClick={() => setLearnSection('expert-tips')}
                      >
                        Expert Tips
                      </Button>
                      <Button 
                        variant={learnSection === 'installation' ? "default" : "ghost"} 
                        size="sm" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#25D366] h-10"
                        data-state={learnSection === 'installation' ? "active" : undefined}
                        onClick={() => setLearnSection('installation')}
                      >
                        Installation Walkthroughs
                      </Button>
                    </div>
                  </div>
                  
                  {/* Content area */}
                  <ScrollArea className="flex-1 p-6">
                    {/* DIY GUIDES SECTION */}
                    {learnSection === 'diy-guides' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">Do It Yourself</h2>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Filter className="h-4 w-4 mr-2" />
                              Filter
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {demoDiyGuides.map(guide => (
                            <Card key={guide.id} className="overflow-hidden">
                              <div className="aspect-video w-full">
                                <img 
                                  src={guide.image}
                                  alt={guide.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">{guide.title}</CardTitle>
                                  {renderDifficulty(guide.difficulty)}
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0 pb-2">
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{guide.timeEstimate}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Wrench className="h-4 w-4 mr-1" />
                                    <span>Tools: {guide.tools.join(', ')}</span>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="p-4 pt-2">
                                <Button className="w-full">View Guide</Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                        
                        {/* Subscription promotion */}
                        <Card className="bg-muted/30 mt-8">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                              <div className="text-center md:text-left">
                                <h3 className="text-xl font-bold mb-2">Want to become a customization expert?</h3>
                                <p className="text-muted-foreground mb-4 max-w-md">
                                  Join our premium workshops and learn directly from industry professionals.
                                </p>
                                <Button className="bg-[#25D366] hover:bg-[#22bf5b]">
                                  <Lightbulb className="h-4 w-4 mr-2" /> Explore Courses
                                </Button>
                              </div>
                              <div className="flex-1 hidden md:block">
                                <img 
                                  src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a" 
                                  alt="Learning" 
                                  className="rounded-lg w-full h-40 object-cover"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    
                    {/* EXPERT TIPS SECTION */}
                    {learnSection === 'expert-tips' && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Pro Insights</h2>
                        <p className="text-muted-foreground">
                          Professional advice from automotive customization experts
                        </p>
                        
                        <div className="space-y-6">
                          {['Paint Protection', 'Sound System Setup', 'Interior Restoration'].map((topic, index) => (
                            <Card key={index} className="overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/3 aspect-video md:aspect-auto">
                                  <img 
                                    src={`https://source.unsplash.com/random/600x400?car,expert,${index}`}
                                    alt={topic}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="md:w-2/3 p-6">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-medium text-lg">{topic} Tips from the Pros</h3>
                                      <div className="flex items-center gap-2 mt-1 mb-3">
                                        <div className="h-6 w-6 rounded-full bg-gray-300" />
                                        <span className="text-sm text-muted-foreground">
                                          By Expert Name #{index + 1} • {15 + index * 5} min read
                                        </span>
                                      </div>
                                    </div>
                                    <Badge className="bg-blue-500">Featured</Badge>
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground mb-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                    Ut enim ad minim veniam, quis nostrud exercitation.
                                  </p>
                                  
                                  <div className="flex flex-wrap gap-1 mb-4">
                                    {['Professional', 'Advanced', 'Maintenance'].map(tag => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  
                                  <Button className="bg-[#25D366] hover:bg-[#22bf5b]">
                                    Read Full Article
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* INSTALLATION WALKTHROUGHS SECTION */}
                    {learnSection === 'installation' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">Installation Guides</h2>
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter by Part
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {['Wheels & Tires', 'Audio System', 'LED Headlights', 'Performance Exhaust'].map((part, index) => (
                            <Card key={index} className="overflow-hidden">
                              <div className="flex flex-col sm:flex-row">
                                <div className="sm:w-1/3 aspect-square sm:aspect-auto">
                                  <img 
                                    src={`https://source.unsplash.com/random/400x400?car,part,${index}`}
                                    alt={part}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="sm:w-2/3 p-4">
                                  <h3 className="font-medium">{part} Installation</h3>
                                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-xs">
                                    <div className="flex items-center">
                                      <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                      <span>{(index + 1) * 2} hours</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Wrench className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                      <span>{['Easy', 'Medium', 'Hard', 'Medium'][index]}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Settings className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                      <span>{3 + index} tools needed</span>
                                    </div>
                                    <div className="flex items-center">
                                      <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                      <span>{index < 2 ? '1 person' : '2 people'}</span>
                                    </div>
                                  </div>
                                  
                                  <Separator className="my-3" />
                                  
                                  <div className="space-y-2 mb-3">
                                    <div className="flex items-center gap-1 text-xs">
                                      <CheckCircle className="h-3.5 w-3.5 text-[#25D366]" />
                                      <span>Step-by-step visual guide</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                      <CheckCircle className="h-3.5 w-3.5 text-[#25D366]" />
                                      <span>Troubleshooting tips included</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button variant="default" size="sm" className="flex-1">
                                      View Guide
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Book Pro Install
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* New Project Wizard Dialog */}
          <AnimatePresence>
            {showNewProjectWizard && (
              <NewProjectWizard 
                onClose={() => setShowNewProjectWizard(false)}
                onCreateProject={handleCreateProject}
                availableVehicles={vehicles}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </ArenaWrapper>
  );
};

export default ArenaMain;