import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, ThumbsUp, MessageSquare, Award, Heart, ChevronRight, PlayCircle,
  Star, Bookmark, PlusCircle, Calendar, Share2, Sparkles, Medal, BarChart3, BarChart2,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types
type VehicleType = 'two-wheeler' | 'three-wheeler' | 'four-wheeler' | 'heavy-vehicle';

type UserVehicleHealth = {
  score: number;
  rank: number;
  totalUsers: number;
  lastService: string;
  nextServiceDue: string;
  servicesToDate: number;
  onTimePercentage: number;
  scoreBreakdown: {
    regularity: number;
    timeliness: number;
    maintenance: number;
    care: number;
  };
};

type Testimonial = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userVehicle: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  rating: number;
  review: string;
  createdAt: string;
  likes: number;
  hasVideo?: boolean;
  verified: boolean;
};

type CommunityTip = {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  vehicle: {
    make: string;
    model: string;
    type: VehicleType;
  };
  likes: number;
  createdAt: string;
  category: string;
  upvotes: number;
  saved: boolean;
};

type ServiceTimeline = {
  id: string;
  serviceName: string;
  serviceDate: string;
  providerName: string;
  connectionCount: number;
  recentConnections: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  totalCompletions: number;
};

// Mock data
const mockVehicleHealth: UserVehicleHealth = {
  score: 87,
  rank: 142,
  totalUsers: 5840,
  lastService: '2025-03-15',
  nextServiceDue: '2025-06-15',
  servicesToDate: 8,
  onTimePercentage: 92,
  scoreBreakdown: {
    regularity: 90,
    timeliness: 85,
    maintenance: 95,
    care: 78
  }
};

const mockTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    userId: 'user-123',
    userName: 'Priya Sharma',
    userAvatar: '',
    userVehicle: 'Honda City 2022',
    serviceId: 'serv-1',
    serviceName: 'Premium Service Package',
    providerId: 'prov-1',
    providerName: 'FixPoint Authorized',
    rating: 4.8,
    review: 'Amazing service! The technician was very professional and explained everything clearly. My car runs so much smoother now.',
    createdAt: '2025-04-20',
    likes: 34,
    hasVideo: true,
    verified: true
  },
  {
    id: 'test-2',
    userId: 'user-456',
    userName: 'Rahul Patel',
    userVehicle: 'Maruti Swift 2021',
    serviceId: 'serv-2',
    serviceName: 'Basic Service Package',
    providerId: 'prov-1',
    providerName: 'FixPoint Authorized',
    rating: 4.5,
    review: 'Good service at a reasonable price. Technicians were on time and did the job well. Would recommend!',
    createdAt: '2025-04-15',
    likes: 22,
    verified: true
  },
  {
    id: 'test-3',
    userId: 'user-789',
    userName: 'Ananya Desai',
    userAvatar: '',
    userVehicle: 'Hyundai i10 2023',
    serviceId: 'serv-1',
    serviceName: 'Premium Service Package',
    providerId: 'prov-2',
    providerName: 'QuickMech',
    rating: 5.0,
    review: 'Outstanding! The service was completed faster than expected and my car has never felt better. The app tracking was very helpful.',
    createdAt: '2025-04-18',
    likes: 45,
    hasVideo: true,
    verified: true
  }
];

const mockCommunityTips: CommunityTip[] = [
  {
    id: 'tip-1',
    title: 'How to extend your battery life in extreme summers',
    content: 'Keep your car in shade when parked for long periods. Use a sunshade for windshield. Check battery fluid levels regularly...',
    author: {
      id: 'user-234',
      name: 'Vikram Mehta',
      role: 'Automotive Expert'
    },
    vehicle: {
      make: 'All',
      model: 'All',
      type: 'four-wheeler'
    },
    likes: 256,
    createdAt: '2025-03-28',
    category: 'Battery Care',
    upvotes: 342,
    saved: false
  },
  {
    id: 'tip-2',
    title: 'Fuel efficiency tips for city driving',
    content: 'Avoid rapid acceleration and braking. Keep tires properly inflated. Use AC wisely. Remove unnecessary weight...',
    author: {
      id: 'user-567',
      name: 'Meera Kapoor',
      role: 'Community Contributor'
    },
    vehicle: {
      make: 'Honda',
      model: 'City',
      type: 'four-wheeler'
    },
    likes: 189,
    createdAt: '2025-04-05',
    category: 'Fuel Efficiency',
    upvotes: 211,
    saved: true
  },
  {
    id: 'tip-3',
    title: 'Best way to maintain your bike chain',
    content: 'Clean the chain regularly with a proper degreaser. Lubricate with quality chain lube. Adjust tension properly...',
    author: {
      id: 'user-890',
      name: 'Arjun Singh',
      role: 'Bike Enthusiast'
    },
    vehicle: {
      make: 'All',
      model: 'All',
      type: 'two-wheeler'
    },
    likes: 312,
    createdAt: '2025-04-12',
    category: 'Maintenance',
    upvotes: 289,
    saved: false
  }
];

const mockServiceTimeline: ServiceTimeline[] = [
  {
    id: 'timeline-1',
    serviceName: 'Premium Service Package',
    serviceDate: '2025-04-20',
    providerName: 'FixPoint Authorized',
    connectionCount: 15,
    recentConnections: [
      { id: 'conn-1', name: 'Aditya Verma' },
      { id: 'conn-2', name: 'Neha Gupta' },
      { id: 'conn-3', name: 'Rajat Sharma' },
    ],
    totalCompletions: 1243
  },
  {
    id: 'timeline-2',
    serviceName: 'Battery Replacement (Amaron)',
    serviceDate: '2025-04-18',
    providerName: 'Amaron Official',
    connectionCount: 8,
    recentConnections: [
      { id: 'conn-4', name: 'Priya Sharma' },
      { id: 'conn-5', name: 'Vikram Mehta' },
    ],
    totalCompletions: 876
  }
];

// Community Integration Component
const CommunityIntegration: React.FC = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null);
  const [showingVideo, setShowingVideo] = useState<boolean>(false);
  const [activeTip, setActiveTip] = useState<string | null>(null);
  
  // Helper to render star ratings
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  // Get color for score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Get progress color for score
  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 75) return 'bg-emerald-600';
    if (score >= 60) return 'bg-amber-600';
    return 'bg-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Vehicle Health Score Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
            Vehicle Health Score
          </CardTitle>
          <CardDescription>
            Compare your maintenance habits with the community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 bg-slate-50 rounded-lg p-4 text-center">
              <div className="mb-3">
                <span className={`text-4xl font-bold ${getScoreColor(mockVehicleHealth.score)}`}>
                  {mockVehicleHealth.score}
                </span>
                <span className="text-lg ml-1">/ 100</span>
              </div>
              <Progress 
                value={mockVehicleHealth.score} 
                className={`h-2 mb-3 ${getProgressColor(mockVehicleHealth.score)}`}
              />
              <div className="text-sm text-gray-600 mb-2">
                You're ranked <span className="font-medium">{mockVehicleHealth.rank}</span> out of{' '}
                <span className="font-medium">{mockVehicleHealth.totalUsers.toLocaleString()}</span> users
              </div>
              <Badge variant="outline" className="mt-1">
                <Medal className="h-3 w-3 mr-1 text-amber-500" />
                Top 3% in your area
              </Badge>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Last service</span>
                  <span>Next service due</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">
                    {new Date(mockVehicleHealth.lastService).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <Badge variant="outline" className="font-medium">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(mockVehicleHealth.nextServiceDue).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Services to date</div>
                  <div className="text-xl font-bold">{mockVehicleHealth.servicesToDate}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">On-time servicing</div>
                  <div className="text-xl font-bold">{mockVehicleHealth.onTimePercentage}%</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Score breakdown</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Service Regularity</span>
                      <span className="font-medium">{mockVehicleHealth.scoreBreakdown.regularity}%</span>
                    </div>
                    <Progress value={mockVehicleHealth.scoreBreakdown.regularity} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Service Timeliness</span>
                      <span className="font-medium">{mockVehicleHealth.scoreBreakdown.timeliness}%</span>
                    </div>
                    <Progress value={mockVehicleHealth.scoreBreakdown.timeliness} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Maintenance Quality</span>
                      <span className="font-medium">{mockVehicleHealth.scoreBreakdown.maintenance}%</span>
                    </div>
                    <Progress value={mockVehicleHealth.scoreBreakdown.maintenance} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Vehicle Care</span>
                      <span className="font-medium">{mockVehicleHealth.scoreBreakdown.care}%</span>
                    </div>
                    <Progress value={mockVehicleHealth.scoreBreakdown.care} className="h-1.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between pt-0">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Detailed Analysis
          </Button>
          <Button variant="default" size="sm">
            <BarChart2 className="h-4 w-4 mr-2" />
            Compare with Similar Vehicles
          </Button>
        </CardFooter>
      </Card>
      
      {/* Tabs Section for different community features */}
      <Tabs defaultValue="testimonials">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="testimonials">
            <MessageSquare className="h-4 w-4 mr-2" />
            Reviews & Testimonials
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Users className="h-4 w-4 mr-2" />
            Service Timeline
          </TabsTrigger>
          <TabsTrigger value="tips">
            <Star className="h-4 w-4 mr-2" />
            Community Tips
          </TabsTrigger>
        </TabsList>
        
        {/* Video Testimonials Section */}
        <TabsContent value="testimonials" className="m-0 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Customer Testimonials</h3>
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <AnimatePresence>
            {showingVideo && selectedTestimonial && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                onClick={() => setShowingVideo(false)}
              >
                <div className="bg-white rounded-lg overflow-hidden max-w-2xl w-full">
                  <div className="bg-slate-100 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <PlayCircle className="h-12 w-12 text-primary mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-gray-600">Video testimonial would play here</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <Button variant="outline" onClick={() => setShowingVideo(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockTestimonials.map(testimonial => (
              <Card key={testimonial.id} className={`border ${
                selectedTestimonial === testimonial.id ? 'border-primary' : ''
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>
                          {testimonial.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                        {testimonial.userAvatar && <AvatarImage src={testimonial.userAvatar} />}
                      </Avatar>
                      <div>
                        <div className="font-medium leading-none">{testimonial.userName}</div>
                        <div className="text-xs text-gray-500">{testimonial.userVehicle}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {testimonial.verified && <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />}
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-sm font-medium">{testimonial.serviceName}</div>
                      <div className="text-xs text-gray-500">{new Date(testimonial.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <span>Provider: {testimonial.providerName}</span>
                      <span className="mx-2">•</span>
                      {renderStarRating(testimonial.rating)}
                    </div>
                  </div>
                  
                  <p className="text-sm line-clamp-3">{testimonial.review}</p>
                  
                  {testimonial.hasVideo && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 text-primary"
                      onClick={() => {
                        setSelectedTestimonial(testimonial.id);
                        setShowingVideo(true);
                      }}
                    >
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Watch Video
                    </Button>
                  )}
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {testimonial.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Service Timeline Section */}
        <TabsContent value="timeline" className="m-0 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Service Timeline</h3>
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              {mockServiceTimeline.reduce((acc, curr) => acc + curr.connectionCount, 0)} connections
            </Badge>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {mockServiceTimeline.map((timeline, index) => (
                  <div 
                    key={timeline.id} 
                    className={`relative ${
                      index < mockServiceTimeline.length - 1 ? 'pb-6 border-l-2 border-gray-100 ml-3' : ''
                    }`}
                  >
                    <div className="flex">
                      <div className="absolute -left-3 bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                      
                      <div className="ml-6 flex-grow">
                        <div className="bg-slate-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{timeline.serviceName}</h4>
                              <div className="text-sm text-gray-600">{timeline.providerName}</div>
                            </div>
                            <Badge variant="outline">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(timeline.serviceDate).toLocaleDateString()}
                            </Badge>
                          </div>
                          
                          <div className="mt-3 bg-white rounded-md p-3 border">
                            <h5 className="text-sm font-medium mb-2 flex items-center">
                              <Users className="h-4 w-4 mr-1 text-blue-500" />
                              {timeline.connectionCount} connections used this service
                            </h5>
                            
                            <div className="flex items-center">
                              <div className="flex -space-x-2 mr-3">
                                {timeline.recentConnections.map((conn, i) => (
                                  <Avatar key={conn.id} className="border-2 border-white h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {conn.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                    {conn.avatar && <AvatarImage src={conn.avatar} />}
                                  </Avatar>
                                ))}
                                {timeline.connectionCount > timeline.recentConnections.length && (
                                  <div className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                    +{timeline.connectionCount - timeline.recentConnections.length}
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-gray-600">
                                {timeline.recentConnections[0]?.name} 
                                {timeline.recentConnections.length > 1 ? ` and ${timeline.connectionCount - 1} others` : ''}
                              </div>
                            </div>
                            
                            <div className="mt-2 pt-2 border-t text-xs text-gray-500 flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 mr-1" />
                              <span>
                                {timeline.totalCompletions.toLocaleString()} people completed this service
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center">
                  <Button variant="outline">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    View More History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Community Tips Section */}
        <TabsContent value="tips" className="m-0 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Service Knowledge Base</h3>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-1" />
              Share Your Tip
            </Button>
          </div>
          
          <ScrollArea className="h-[450px] rounded-md border p-4">
            <div className="space-y-4">
              {mockCommunityTips.map((tip) => (
                <Card 
                  key={tip.id} 
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                    activeTip === tip.id ? 'border-primary' : ''
                  }`}
                  onClick={() => setActiveTip(activeTip === tip.id ? null : tip.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{tip.title}</CardTitle>
                      <Badge variant="outline">
                        {tip.category}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center">
                      <span>For {tip.vehicle.make} {tip.vehicle.model !== 'All' ? tip.vehicle.model : 'vehicles'}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(tip.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence>
                      {activeTip === tip.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm mb-3"
                        >
                          <p>{tip.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="flex items-center text-sm">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="text-xs">
                          {tip.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                        {tip.author.avatar && <AvatarImage src={tip.author.avatar} />}
                      </Avatar>
                      <span className="font-medium">{tip.author.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs h-5">
                        {tip.author.role}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex gap-3">
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        <ThumbsUp className={`h-4 w-4 mr-1 ${
                          activeTip === tip.id ? 'text-primary fill-primary' : ''
                        }`} />
                        {tip.upvotes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comments
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`text-gray-600 ${tip.saved ? 'text-amber-500' : ''}`}
                    >
                      <Bookmark className={`h-4 w-4 ${tip.saved ? 'text-amber-500 fill-amber-500' : ''}`} />
                      {tip.saved ? 'Saved' : 'Save'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityIntegration;