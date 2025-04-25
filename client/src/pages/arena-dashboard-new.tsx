import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Car, 
  Wrench, 
  ChevronRight, 
  Rotate3d, 
  ZoomIn,
  PanelRight,
  Paintbrush,
  Gauge,
  Lightbulb,
  Cog, 
  Package,
  Save,
  Share2,
  ShoppingCart,
  Plus,
  CheckCircle2,
  UserRound,
  Clock,
  Calendar,
  Video,
  Book,
  FileText,
  MessageSquare,
  ThumbsUp,
  Eye,
  Sparkles,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useArenaWebSocket } from '@/hooks/use-arena-websocket';
import { formatDistanceToNow } from 'date-fns';

// Import Arena components
import ArenaWrapper from '@/components/arena/ArenaWrapper';
import NewProjectWizard from '@/components/arena/NewProjectWizard';
import VehicleSelector from '@/components/arena/VehicleSelector';
import Vehicle3DViewer from '@/components/arena/Vehicle3DViewer';
import CustomizationCategories from '@/components/arena/CustomizationCategories';
import VehicleWrappingSystem from '@/components/arena/VehicleWrappingSystem';
import MultiVehicleComparison from '@/components/arena/MultiVehicleComparison';

// Type definitions
interface Project {
  id: number;
  title: string;
  vehicleId: number;
  userId: number;
  progress: number;
  lastEdited: string;
  totalCost: number;
  isPublic: boolean;
  status: 'in-progress' | 'completed' | 'saved';
  image?: string;
}

interface VehicleProfile {
  id: number;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  image: string;
  modificationStatus: string;
}

interface Appointment {
  id: number;
  serviceProvider: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  vehicleId: number;
  serviceType: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  compatibility: string[];
  image?: string;
}

interface CommunityProject {
  id: number;
  title: string;
  userId: number;
  user: {
    name: string;
    isVerified: boolean;
    image?: string;
  };
  vehicle: string;
  likes: number;
  comments: number;
  totalCost: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image?: string;
}

interface Tutorial {
  id: number;
  title: string;
  type: 'Video' | 'Article';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  views: number;
  category: string;
  image?: string;
}

interface DIYGuide {
  id: number;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeRequired: string;
  toolsRequired: string[];
  views: number;
  image?: string;
}

const ArenaDashboardNew: React.FC = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'my-studio' | 'discover' | 'learn'>('my-studio');
  const { isConnected, activeUsers } = useArenaWebSocket();

  // Example data
  const projects: Project[] = [
    {
      id: 1,
      title: "Honda City Sport Package",
      vehicleId: 1,
      userId: 1,
      progress: 65,
      lastEdited: new Date().toISOString(),
      totalCost: 85000,
      isPublic: true,
      status: "in-progress",
      image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75"
    },
    {
      id: 2,
      title: "Royal Enfield Classic Overhaul",
      vehicleId: 2,
      userId: 1,
      progress: 30,
      lastEdited: new Date(Date.now() - 86400000).toISOString(),
      totalCost: 42000,
      isPublic: false,
      status: "in-progress",
      image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/royal-enfield-classic-350-right-front-three-quarter-2.jpeg?isig=0&q=75"
    }
  ];

  const vehicles: VehicleProfile[] = [
    {
      id: 1,
      make: "Honda",
      model: "City",
      year: 2022,
      registrationNumber: "MH01AB****",
      image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75",
      modificationStatus: "In Progress"
    },
    {
      id: 2,
      make: "Royal Enfield",
      model: "Classic 350",
      year: 2021,
      registrationNumber: "MH02CD****",
      image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/royal-enfield-classic-350-right-front-three-quarter-2.jpeg?isig=0&q=75",
      modificationStatus: "Stock"
    }
  ];

  const appointments: Appointment[] = [
    {
      id: 1,
      serviceProvider: "QuickFix Auto Service",
      date: "2025-05-15",
      time: "10:00 AM",
      status: "scheduled",
      vehicleId: 1,
      serviceType: "Body Kit Installation"
    },
    {
      id: 2,
      serviceProvider: "Premium Auto Works",
      date: "2025-05-20",
      time: "2:30 PM",
      status: "scheduled",
      vehicleId: 2,
      serviceType: "Custom Exhaust Installation"
    }
  ];

  const trendingProducts: Product[] = [
    {
      id: 1,
      name: "Borla Performance Exhaust System",
      category: "Performance",
      price: 45000,
      rating: 4.9,
      reviewCount: 328,
      compatibility: ["Honda City", "Honda Civic"],
      image: "https://www.carid.com/images/borla/items/140307.jpg"
    },
    {
      id: 2,
      name: "Momo Revenge Alloy Wheels 17\"",
      category: "Exterior",
      price: 32000,
      rating: 4.8,
      reviewCount: 215,
      compatibility: ["Most Sedans and SUVs"],
      image: "https://www.tyresales.com.au/images/alloy-wheels/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled/hero/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled-wheel-380.jpg"
    }
  ];

  const communityProjects: CommunityProject[] = [
    {
      id: 1,
      title: "Ultimate City Transformation",
      userId: 2,
      user: {
        name: "RacingLegend",
        isVerified: true,
        image: "https://i.pravatar.cc/150?img=1"
      },
      vehicle: "2022 Honda City ZX",
      likes: 342,
      comments: 56,
      totalCost: 215000,
      difficulty: "Advanced",
      image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75"
    },
    {
      id: 2,
      title: "Vintage Revival Project",
      userId: 3,
      user: {
        name: "CruiserFan",
        isVerified: false,
        image: "https://i.pravatar.cc/150?img=2"
      },
      vehicle: "2021 Royal Enfield Classic 350",
      likes: 285,
      comments: 42,
      totalCost: 78000,
      difficulty: "Intermediate",
      image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/royal-enfield-classic-350-right-front-three-quarter-2.jpeg?isig=0&q=75"
    }
  ];

  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: "Complete Guide to Wheel Selection",
      type: "Video",
      duration: "25:45",
      level: "Beginner",
      instructor: "Alex Chen",
      views: 12584,
      category: "Exterior",
      image: "https://www.tyresales.com.au/images/alloy-wheels/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled/hero/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled-wheel-380.jpg"
    },
    {
      id: 2,
      title: "Professional Vinyl Wrap Techniques",
      type: "Video",
      duration: "38:12",
      level: "Intermediate",
      instructor: "Samantha Wright",
      views: 8456,
      category: "Exterior",
      image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/2022-x1-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75"
    }
  ];

  const diyGuides: DIYGuide[] = [
    {
      id: 1,
      title: "LED Interior Lighting Installation",
      category: "Interior",
      difficulty: "Beginner",
      timeRequired: "1-2 hours",
      toolsRequired: ["Screwdriver", "Wire stripper", "Electrical tape"],
      views: 5628,
      image: "https://content.instructables.com/FQ3/EQLN/JCKQVWIP/FQ3EQLNJCKQVWIP.jpg"
    },
    {
      id: 2,
      title: "Performance Air Filter Replacement",
      category: "Performance",
      difficulty: "Beginner",
      timeRequired: "30 minutes",
      toolsRequired: ["Screwdriver", "Pliers"],
      views: 4271,
      image: "https://m.media-amazon.com/images/I/91pddkZhbOL._AC_UF1000,1000_QL80_.jpg"
    }
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Format relative time using date-fns
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "recently";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // State for new project wizard
  const [showNewProjectWizard, setShowNewProjectWizard] = useState(false);

  // Handle creating a new project
  const handleNewProject = () => {
    setShowNewProjectWizard(true);
  };
  
  // Handle project creation
  const handleProjectComplete = (projectData: any) => {
    toast({
      title: "Project Created",
      description: `Your project "${projectData.projectName}" has been created.`,
    });
    
    // In a real app, we would save the project data to the server
    console.log("New project data:", projectData);
    
    // Close the wizard
    setShowNewProjectWizard(false);
  };

  // Render MY STUDIO section
  const renderMyStudio = () => {
    return (
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="projects">Active Projects</TabsTrigger>
          <TabsTrigger value="designs">Saved Designs</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle Profiles</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Active Projects</h2>
            <Button onClick={handleNewProject}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  {project.image && (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="text-white font-semibold">{project.title}</h3>
                      <p className="text-white/80 text-sm">Last edited {formatRelativeTime(project.lastEdited)}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-medium">Total Cost</span>
                      <span className="text-sm font-semibold">{formatCurrency(project.totalCost)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm">
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="designs" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Saved Designs</h2>
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {projects.filter(p => p.status === 'completed' || p.status === 'saved').map((design) => (
              <Card key={design.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-40 overflow-hidden">
                    {design.image && (
                      <img 
                        src={design.image} 
                        alt={design.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">{design.title}</h3>
                      <Badge>{design.status === 'completed' ? 'Completed' : 'Saved'}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Created on {formatDate(design.lastEdited)}</p>
                    <Separator className="my-3" />
                    <div className="flex justify-between text-sm">
                      <span>Total Cost</span>
                      <span className="font-semibold">{formatCurrency(design.totalCost)}</span>
                    </div>
                    <div className="mt-4 flex gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button size="sm">
                        Edit Design
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="vehicles" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Vehicle Profiles</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.make} ${vehicle.model}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="text-white font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                      <p className="text-white/80 text-sm">{vehicle.registrationNumber}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Modification Status</span>
                    <Badge variant={vehicle.modificationStatus === "Stock" ? "outline" : "default"}>
                      {vehicle.modificationStatus}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">
                    <Wrench className="h-4 w-4 mr-2" />
                    Maintenance
                  </Button>
                  <Button size="sm">
                    Customize
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="appointments" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Installation
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{appointment.serviceType}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.serviceProvider}</p>
                    </div>
                    <Badge variant={
                      appointment.status === 'scheduled' ? 'outline' : 
                      appointment.status === 'in-progress' ? 'secondary' : 
                      'default'
                    }>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2 justify-end">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  // Render DISCOVER section
  const renderDiscover = () => {
    return (
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="trending">Trending Products</TabsTrigger>
          <TabsTrigger value="community">Community Showcase</TabsTrigger>
          <TabsTrigger value="staff-picks">Staff Picks</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Collections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Trending Products</h2>
            <Button variant="outline">
              <Gauge className="h-4 w-4 mr-2" />
              Filter by Vehicle
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                {product.image && (
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge>{product.category}</Badge>
                  </div>
                  <CardDescription>{product.compatibility.join(', ')}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-1">({product.reviewCount})</span>
                    </div>
                    <span className="font-bold">{formatCurrency(product.price)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="community" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Community Showcase</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Recent</Button>
              <Button variant="outline" size="sm">Popular</Button>
              <Button variant="outline" size="sm">Featured</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {communityProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                {project.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.vehicle}</CardDescription>
                    </div>
                    <Badge>{project.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={project.user.image} />
                      <AvatarFallback>{project.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{project.user.name}</span>
                    {project.user.isVerified && (
                      <CheckCircle2 className="h-4 w-4 ml-1 text-blue-500" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{project.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{project.comments}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{(project.likes * 8).toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="font-bold">{formatCurrency(project.totalCost)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm">
                    View Project
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="staff-picks" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Staff Picks</h2>
            <div>
              <Button variant="outline">
                <Paintbrush className="h-4 w-4 mr-2" />
                Browse All
              </Button>
            </div>
          </div>
          
          <Card className="w-full overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img 
                  src="https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75" 
                  alt="Staff Pick" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-yellow-500">Staff Pick</Badge>
                  <Badge variant="outline">Premium</Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2">Ultimate Urban Commuter Package</h3>
                <p className="text-muted-foreground mb-4">
                  The perfect combination of style, comfort, and performance for city driving. Our experts have curated this package for the modern urban commuter.
                </p>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold">Exterior</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Premium Matte Black Wrap</li>
                      <li>• Sporty Alloy Wheels (17")</li>
                      <li>• LED Headlight Kit</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Performance</h4>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Air Intake System</li>
                      <li>• Performance Exhaust</li>
                      <li>• Sport Suspension</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-muted-foreground">Complete Package Price</span>
                    <div className="text-2xl font-bold">{formatCurrency(120000)}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">View Details</Button>
                    <Button>Start Customizing</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="seasonal" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Summer 2025 Collection</h2>
            <div>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View All Seasons
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-3 overflow-hidden">
              <div className="h-60 relative overflow-hidden">
                <img 
                  src="https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/2022-x1-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75" 
                  alt="Summer Collection" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-transparent flex flex-col justify-center p-8">
                  <Badge className="w-fit mb-4 bg-orange-500">Limited Time</Badge>
                  <h3 className="text-3xl font-bold text-white">Summer Ready. Road Ready.</h3>
                  <p className="text-white/80 mt-2 max-w-lg">Prepare your vehicle for summer adventures with our curated collection of performance upgrades and style enhancements.</p>
                  <div className="mt-6">
                    <Button>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Explore Collection
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Summer Performance Package</h3>
                <p className="text-sm text-muted-foreground mb-4">Keep your engine cool and efficient during hot summer days.</p>
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>High-flow air filter system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Enhanced cooling system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Performance-grade coolant</span>
                  </li>
                </ul>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{formatCurrency(22000)}</span>
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Summer Road Trip Kit</h3>
                <p className="text-sm text-muted-foreground mb-4">Essential accessories for your summer adventures.</p>
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Premium roof cargo box</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Bike carrier system (2 bikes)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>All-weather floor mats</span>
                  </li>
                </ul>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{formatCurrency(35000)}</span>
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Summer Style Refresh</h3>
                <p className="text-sm text-muted-foreground mb-4">Give your vehicle a fresh summer look.</p>
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Premium ceramic window tint</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>High-gloss exterior detailing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Interior fabric protection coating</span>
                  </li>
                </ul>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{formatCurrency(28000)}</span>
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  // Render LEARN section
  const renderLearn = () => {
    return (
      <Tabs defaultValue="tutorials" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="diy-guides">DIY Guides</TabsTrigger>
          <TabsTrigger value="expert-tips">Expert Tips</TabsTrigger>
          <TabsTrigger value="installations">Installation Walkthroughs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tutorials" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Video Tutorials</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Beginner</Button>
              <Button variant="outline" size="sm">Intermediate</Button>
              <Button variant="outline" size="sm">Advanced</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id} className="overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  {tutorial.image ? (
                    <img 
                      src={tutorial.image} 
                      alt={tutorial.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <div className="w-full">
                      <div className="flex justify-between items-center w-full mb-1">
                        <Badge variant="outline" className="bg-black/30 text-white border-none">
                          {tutorial.type}
                        </Badge>
                        <Badge variant="outline" className="bg-black/30 text-white border-none">
                          {tutorial.duration}
                        </Badge>
                      </div>
                      <h3 className="text-white font-semibold">{tutorial.title}</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant={
                      tutorial.level === 'Beginner' ? 'outline' : 
                      tutorial.level === 'Intermediate' ? 'secondary' : 
                      'default'
                    }>
                      {tutorial.level}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{tutorial.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>{tutorial.instructor.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{tutorial.instructor}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm">
                    Watch Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="diy-guides" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">DIY Guides</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Sort by Time
              </Button>
              <Button variant="outline" size="sm">
                <Gauge className="h-4 w-4 mr-2" />
                Sort by Difficulty
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diyGuides.map((guide) => (
              <Card key={guide.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-40 h-32 md:h-auto overflow-hidden">
                    {guide.image ? (
                      <img 
                        src={guide.image} 
                        alt={guide.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Book className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{guide.title}</h3>
                      <Badge variant={
                        guide.difficulty === 'Beginner' ? 'outline' : 
                        guide.difficulty === 'Intermediate' ? 'secondary' : 
                        'default'
                      }>
                        {guide.difficulty}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-4 text-sm mb-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{guide.timeRequired}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{guide.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className="text-sm font-medium">Required Tools:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {guide.toolsRequired.map((tool, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button size="sm">
                        Read Guide
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="expert-tips" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Expert Tips & Insights</h2>
            <Button variant="outline">
              <Lightbulb className="h-4 w-4 mr-2" />
              All Categories
            </Button>
          </div>
          
          <Card className="w-full overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 h-64 md:h-auto overflow-hidden">
                <div className="w-full h-full bg-primary/20 flex items-center justify-center p-8">
                  <Lightbulb className="h-24 w-24 text-primary" />
                </div>
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-500">Featured Expert</Badge>
                  <Badge variant="outline">Performance</Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2">Maximizing Fuel Efficiency: Pro Tips</h3>
                <div className="flex items-center mb-4">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Rahul Kumar</div>
                    <div className="text-sm text-muted-foreground">Automotive Engineer, 15+ years experience</div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Learn proven techniques to maximize your vehicle's fuel efficiency without sacrificing performance. These expert-tested methods can help you save up to 15% on fuel costs while maintaining optimal engine health.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Proper Tire Maintenance</h4>
                      <p className="text-sm text-muted-foreground">Keep tires at optimal pressure for 3-5% fuel savings</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Quality Fuel Selection</h4>
                      <p className="text-sm text-muted-foreground">The right fuel grade can improve efficiency by 2-3%</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Driving Techniques</h4>
                      <p className="text-sm text-muted-foreground">Smooth acceleration/braking can save 10-15% fuel</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Regular Maintenance</h4>
                      <p className="text-sm text-muted-foreground">Clean filters and tuned engines use 4-8% less fuel</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save for Later
                  </Button>
                  <Button>
                    Read Full Article
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>Choosing the Right Oil</span>
                  <Badge variant="outline">Maintenance</Badge>
                </CardTitle>
                <CardDescription>Why oil viscosity matters for your engine</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Understand how different oil specifications affect performance, longevity, and efficiency in various driving conditions.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button size="sm">Read More</Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>Wheel Alignment Guide</span>
                  <Badge variant="outline">Handling</Badge>
                </CardTitle>
                <CardDescription>Perfect alignment for better handling</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how proper wheel alignment affects steering, tire wear, and fuel economy, with professional alignment recommendations.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button size="sm">Read More</Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>Battery Care Essentials</span>
                  <Badge variant="outline">Electrical</Badge>
                </CardTitle>
                <CardDescription>Maximize your battery life</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Expert advice on extending battery life, troubleshooting common issues, and preparing for extreme weather conditions.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button size="sm">Read More</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="installations" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Installation Walkthroughs</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Recent
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Popular
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 h-64 md:h-auto overflow-hidden">
                  <div className="w-full h-full bg-muted flex items-center justify-center p-8">
                    <Rotate3d className="h-24 w-24 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-purple-500">Interactive 3D</Badge>
                    <Badge variant="outline">Exterior</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Professional Spoiler Installation</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete step-by-step walkthrough for installing a rear spoiler on your vehicle. This interactive guide includes 3D visualizations and detailed instructions for every step of the process.
                  </p>
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="col-span-1 p-4 border rounded-md flex flex-col items-center justify-center">
                      <span className="font-bold text-lg">45-60</span>
                      <span className="text-xs text-muted-foreground">minutes</span>
                    </div>
                    <div className="col-span-1 p-4 border rounded-md flex flex-col items-center justify-center">
                      <span className="font-bold text-lg">Basic</span>
                      <span className="text-xs text-muted-foreground">skill level</span>
                    </div>
                    <div className="col-span-1 p-4 border rounded-md flex flex-col items-center justify-center">
                      <span className="font-bold text-lg">4</span>
                      <span className="text-xs text-muted-foreground">tools needed</span>
                    </div>
                    <div className="col-span-1 p-4 border rounded-md flex flex-col items-center justify-center">
                      <span className="font-bold text-lg">1-2</span>
                      <span className="text-xs text-muted-foreground">people</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Checklist
                    </Button>
                    <Button>
                      Start Walkthrough
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 h-64 md:h-auto overflow-hidden">
                  <div className="w-full h-full bg-muted flex items-center justify-center p-8">
                    <img
                      src="https://m.media-amazon.com/images/I/71Najs0QpkL._AC_UF894,1000_QL80_.jpg"
                      alt="LED Headlight Kit Installation"
                      className="h-full object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-500">Video Guide</Badge>
                    <Badge variant="outline">Lighting</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">LED Headlight Kit Installation</h3>
                  <p className="text-muted-foreground mb-6">
                    Follow along as we guide you through the complete process of upgrading your factory headlights to a modern LED system with improved visibility and style.
                  </p>
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="col-span-1 p-4 border rounded-md flex flex-col items-center justify-center">
                      <span className="font-bold text-lg">60-90</span>
                      <span className="text-xs text-muted-foreground">minutes</span>
                    </div>
                    <div className="col-span-1 p-4 border rounded-md flex flex-col items-center justify-center">
                      <span className="font-bold text-lg">Intermediate</span>
                      <span className="text-xs text-muted-foreground">skill level</span>
                    </div>
                    <div className="col-span-1 p-4 border rounded-md flex flex-col items-center justify-center">
                      <span className="font-bold text-lg">7</span>
                      <span className="text-xs text-muted-foreground">tools needed</span>
                    </div>
                    <div className="col-span-1 p-4 border rounded-md flex flex-col items-center justify-center">
                      <span className="font-bold text-lg">2</span>
                      <span className="text-xs text-muted-foreground">people</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Parts List
                    </Button>
                    <Button>
                      Start Walkthrough
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  // Main render
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-4">
        {/* Header with navigation and status */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Arena Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center mr-2">
              <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {activeUsers.length > 0 && (
              <div className="hidden md:flex -space-x-2 mr-2">
                {activeUsers.slice(0, 3).map((user, index) => (
                  <Avatar key={index} className="h-8 w-8 border-2 border-background">
                    <AvatarFallback>{user.username?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                ))}
                {activeUsers.length > 3 && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                    +{activeUsers.length - 3}
                  </div>
                )}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => handleNewProject()}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
        
        {/* Main navigation */}
        <div className="flex rounded-lg overflow-hidden border">
          <Button
            variant={activeSection === 'my-studio' ? 'default' : 'ghost'}
            className={`flex-1 rounded-none h-12 ${activeSection === 'my-studio' ? '' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection('my-studio')}
          >
            MY STUDIO
          </Button>
          <Button
            variant={activeSection === 'discover' ? 'default' : 'ghost'}
            className={`flex-1 rounded-none h-12 ${activeSection === 'discover' ? '' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection('discover')}
          >
            DISCOVER
          </Button>
          <Button
            variant={activeSection === 'learn' ? 'default' : 'ghost'}
            className={`flex-1 rounded-none h-12 ${activeSection === 'learn' ? '' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection('learn')}
          >
            LEARN
          </Button>
        </div>
        
        {/* Content section */}
        <div className="mt-4">
          {activeSection === 'my-studio' && renderMyStudio()}
          {activeSection === 'discover' && renderDiscover()}
          {activeSection === 'learn' && renderLearn()}
        </div>
      </div>
    </div>
  );
};

export default ArenaDashboardNew;