import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  Car, 
  Bike, 
  RotateCw, 
  Clock, 
  Heart, 
  Calendar, 
  Camera, 
  Award, 
  ThumbsUp, 
  MapPin, 
  Wrench, 
  BookOpen, 
  Settings, 
  ChevronRight, 
  ArrowRight,
  Plus,
  History,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Types
interface FeaturedProject {
  id: number;
  title: string;
  beforeImage: string;
  afterImage: string;
  modificationsCount: number;
  totalCost: number;
}

interface TrendingCategory {
  id: number;
  name: string;
  startingPrice: number;
  optionsCount: number;
  image: string;
}

interface CommunityProject {
  id: number;
  image: string;
  username: string;
  vehicleDetails: string;
  likeCount: number;
  userAvatar: string;
}

interface RecentActivity {
  id: number;
  type: 'saved' | 'viewed' | 'completed' | 'appointment';
  title: string;
  timestamp: string;
  icon: React.ReactNode;
}

// Sample data
const featuredProjects: FeaturedProject[] = [
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

const trendingCategories: TrendingCategory[] = [
  {
    id: 1,
    name: 'Alloy Wheels',
    startingPrice: 12000,
    optionsCount: 300,
    image: 'https://www.tyresales.com.au/images/alloy-wheels/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled/hero/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled-wheel-380.jpg'
  },
  {
    id: 2,
    name: 'Body Wraps',
    startingPrice: 18000,
    optionsCount: 150,
    image: 'https://images.squarespace-cdn.com/content/v1/5cf89255dc34db0001a4da0e/1584647207580-QVNC5T8P0Z9K9AQ1PBEH/GT-R-Geometric-Wrap.jpg'
  },
  {
    id: 3,
    name: 'Performance Upgrades',
    startingPrice: 8000,
    optionsCount: 200,
    image: 'https://www.carid.com/images/borla/items/140307.jpg'
  },
  {
    id: 4,
    name: 'Interior Customization',
    startingPrice: 5000,
    optionsCount: 250,
    image: 'https://icdn.digitaltrends.com/image/digitaltrends/2020-bentley-continental-gt-v8-coupe-interior-500x500.jpg'
  }
];

const communityProjects: CommunityProject[] = [
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
  },
  {
    id: 4,
    image: 'https://www.91wheels.com/assets/uploads/slideshow/f5ed607b4f172b10f7fc32adaef36ac5.webp',
    username: 'SpeedDemon',
    vehicleDetails: '2022 Maruti Swift Custom',
    likeCount: 176,
    userAvatar: 'S'
  },
  {
    id: 5,
    image: 'https://stat.overdrive.in/wp-content/uploads/2022/06/RE-Hunter-350-Spy-Shot.jpg',
    username: 'HillClimber',
    vehicleDetails: '2022 Royal Enfield Hunter',
    likeCount: 154,
    userAvatar: 'H'
  },
  {
    id: 6,
    image: 'https://cdni.autocarindia.com/Utils/ImageResizer.ashx?n=https://cdni.autocarindia.com/ExtraImages/20220222030708_New-Range-Rover-front.jpg',
    username: 'LuxuryVibes',
    vehicleDetails: '2022 Range Rover Sport',
    likeCount: 421,
    userAvatar: 'L'
  }
];

const recentActivities: RecentActivity[] = [
  {
    id: 1,
    type: 'saved',
    title: 'Saved Matte Black Wrap to favorites',
    timestamp: '3 hours ago',
    icon: <Heart size={16} />
  },
  {
    id: 2,
    type: 'viewed',
    title: 'Viewed 18-inch Alloy Wheels',
    timestamp: 'Yesterday',
    icon: <Search size={16} />
  },
  {
    id: 3,
    type: 'completed',
    title: 'Completed LED Headlight installation',
    timestamp: '3 days ago',
    icon: <Award size={16} />
  },
  {
    id: 4,
    type: 'appointment',
    title: 'Booked installation appointment',
    timestamp: '1 week ago',
    icon: <Calendar size={16} />
  }
];

// Brand logos
const brandLogos = [
  { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/1200px-Honda.svg.png' },
  { name: 'Royal Enfield', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/11/Royal_Enfield_logo.svg/1200px-Royal_Enfield_logo.svg.png' },
  { name: 'Bajaj', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bajaj_Auto_Logo.svg/1280px-Bajaj_Auto_Logo.svg.png' },
  { name: 'Maruti Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Maruti_Suzuki_Logo.svg/1200px-Maruti_Suzuki_Logo.svg.png' },
  { name: 'Tata', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/1200px-Tata_logo.svg.png' },
  { name: 'Mahindra', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Mahindra_Rise_Logo.svg/1200px-Mahindra_Rise_Logo.svg.png' }
];

// Helper function
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const ArenaDashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-4 space-y-8">
      {/* Secondary Navigation */}
      <div className="sticky top-16 z-10 bg-background pt-2 pb-2 border-b">
        <Tabs defaultValue="dashboard" className="w-full">
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
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-black">
              START NEW PROJECT
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
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
        
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center cursor-pointer hover:shadow-md transition-all border">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
            <RotateCw size={24} />
          </div>
          <h3 className="font-medium">Recent Designs</h3>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center cursor-pointer hover:shadow-md transition-all border">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
            <Heart size={24} />
          </div>
          <h3 className="font-medium">Saved Favorites</h3>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center cursor-pointer hover:shadow-md transition-all border">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
            <Calendar size={24} />
          </div>
          <h3 className="font-medium">Installation Appointments</h3>
        </div>
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
      
      {/* Trending Categories */}
      <motion.section
        className="pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">POPULAR RIGHT NOW</h2>
          <Link href="/arena/categories">
            <Button variant="ghost" className="gap-1">
              All Categories <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingCategories.map(category => (
            <Card key={category.id} className="overflow-hidden hover:shadow-md transition-all group cursor-pointer">
              <div className="h-40 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{category.name}</h3>
                <div className="flex justify-between mt-1 text-sm">
                  <span>Starting at {formatPrice(category.startingPrice)}</span>
                  <span>{category.optionsCount}+ Options</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
      
      {/* Vehicle Type Shortcuts */}
      <motion.section
        className="pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">SELECT YOUR VEHICLE TYPE</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Customize any vehicle with our extensive catalog of parts and accessories
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/arena?step=vehicleType&type=two-wheeler">
            <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Bike size={40} className="text-primary" />
                </div>
                <h3 className="font-bold text-xl">Two-Wheelers</h3>
                <p className="text-center text-muted-foreground mt-2">
                  Motorcycles, scooters, and mopeds
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/arena?step=vehicleType&type=three-wheeler">
            <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary">
                    <circle cx="6" cy="17" r="3" />
                    <circle cx="18" cy="17" r="3" />
                    <circle cx="12" cy="6" r="3" />
                    <path d="M6 17v-4h12v4" />
                    <path d="M12 6v7" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl">Three-Wheelers</h3>
                <p className="text-center text-muted-foreground mt-2">
                  Auto-rickshaws and cargo three-wheelers
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/arena?step=vehicleType&type=four-wheeler">
            <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Car size={40} className="text-primary" />
                </div>
                <h3 className="font-bold text-xl">Four-Wheelers</h3>
                <p className="text-center text-muted-foreground mt-2">
                  Cars, SUVs, and commercial vehicles
                </p>
              </CardContent>
            </Card>
          </Link>
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
                <p className="text-sm">{project.vehicleDetails}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Join 25,000+ vehicle enthusiasts sharing their custom builds
          </p>
          <Button className="gap-1">
            JOIN COMMUNITY
            <ArrowRight size={16} />
          </Button>
        </div>
      </motion.section>
      
      {/* Recent Activity & Service Integration in two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">YOUR RECENT ACTIVITY</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              View Full History <History size={16} />
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={activity.id} className="relative pl-6 pb-4">
                    {index < recentActivities.length - 1 && (
                      <div className="absolute left-2.5 top-3 bottom-0 w-px bg-border"></div>
                    )}
                    <div className="absolute left-0 top-1 rounded-full w-5 h-5 bg-primary/10 flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
        
        {/* Service Integration */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">COMPLETE YOUR CUSTOMIZATION</h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 justify-start items-center text-center">
                  <MapPin size={24} />
                  <div>
                    <p className="font-medium">Find Nearby Installation Centers</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 justify-start items-center text-center">
                  <Wrench size={24} />
                  <div>
                    <p className="font-medium">Book Professional Installation</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 justify-start items-center text-center">
                  <BookOpen size={24} />
                  <div>
                    <p className="font-medium">DIY Installation Guides</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 justify-start items-center text-center">
                  <Settings size={24} />
                  <div>
                    <p className="font-medium">Maintenance Tips</p>
                  </div>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground text-center mt-4">
                We partner with 200+ certified installation centers nationwide
              </p>
            </CardContent>
          </Card>
        </motion.section>
      </div>
      
      {/* Featured Brands */}
      <motion.section
        className="pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">TOP BRANDS</h2>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border">
          <div className="flex overflow-auto pb-4 gap-8">
            {brandLogos.map((brand, index) => (
              <div key={index} className="flex-shrink-0 w-24 h-24 flex items-center justify-center p-2">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground text-center mt-4">
            All parts come with manufacturer warranty and quality assurance
          </p>
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