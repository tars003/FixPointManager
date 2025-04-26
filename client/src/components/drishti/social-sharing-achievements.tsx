import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Share2, 
  Trophy, 
  Zap, 
  Users, 
  Leaf, 
  Award, 
  TrendingUp, 
  Heart, 
  Flag, 
  MapPin,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  Calendar,
  Flame,
  Globe,
  PlusCircle,
  Filter,
  Settings,
  Droplet,
  Clock
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isUnlocked: boolean;
  date?: string;
  progress?: number;
  maxProgress?: number;
  category: 'eco' | 'safe' | 'skill' | 'endurance' | 'maintenance';
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  reward: string;
  endDate: string;
  participants: number;
  progress: number;
  isActive: boolean;
  sponsorLogo?: string;
  sponsorName?: string;
  category: 'eco' | 'safe' | 'skill' | 'endurance' | 'maintenance';
}

interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
    title?: string;
    location?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  achievements?: {
    icon: React.ReactNode;
    name: string;
    color: string;
  }[];
  media?: {
    type: 'image' | 'chart';
    url: string;
  };
  stats?: {
    name: string;
    value: string;
    icon: React.ReactNode;
    color: string;
  }[];
}

const SocialSharingAchievements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('achievements');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#F59E0B]" />
              Driver Achievement Network
            </CardTitle>
            <CardDescription>
              Social platform for sharing and comparing driving achievements
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
              <Users className="h-3.5 w-3.5" />
              <span>328 Connected Drivers</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Profile Highlight */}
        <div className="bg-gradient-to-r from-amber-50 to-transparent p-4 rounded-lg border border-amber-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-amber-200">
                  <AvatarImage src="/avatars/01.png" alt="Profile" />
                  <AvatarFallback>SV</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-amber-100 rounded-full p-1 border-2 border-white">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <h3 className="font-medium mt-2">Sanjay Verma</h3>
              <Badge variant="outline" className="mt-1">Eco Master</Badge>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {socialStatistics.map((stat, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-lg border shadow-sm flex items-center gap-2 min-w-[120px]">
                    <div className={`p-1.5 rounded-full ${stat.bgColor}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.name}</p>
                      <p className="font-medium">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2 items-center">
                <Button variant="default" className="w-full gap-1 bg-amber-500 hover:bg-amber-600">
                  <Share2 className="h-4 w-4" />
                  Share Progress
                </Button>
                <Button variant="outline" className="w-full gap-1">
                  <Trophy className="h-4 w-4" />
                  View All Badges
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Tabs */}
        <Tabs defaultValue="achievements" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap items-center gap-2">
                {achievementCategories.map(category => (
                  <Badge 
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    className={`cursor-pointer ${
                      selectedCategory === category.id 
                        ? category.bgColor 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.icon}
                    <span className="ml-1">{category.name}</span>
                  </Badge>
                ))}
              </div>
              
              <Button variant="outline" size="sm" className="gap-1 h-8">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {achievements
                .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
                .map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))
              }
            </div>
          </TabsContent>
          
          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Active Challenges</h3>
              <Button size="sm" className="gap-1 h-8">
                <PlusCircle className="h-3.5 w-3.5" />
                Join New Challenge
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {challenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </TabsContent>
          
          {/* Community Tab */}
          <TabsContent value="community" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Recent Activity</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1 h-8">
                  <Globe className="h-3.5 w-3.5" />
                  Global
                </Button>
                <Button variant="outline" size="sm" className="gap-1 h-8">
                  <Users className="h-3.5 w-3.5" />
                  Following
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {communityPosts.map(post => (
                <CommunityPostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Privacy controlled - you choose what to share
        </div>
        <Button variant="outline" className="gap-1">
          <Settings className="h-4 w-4" />
          Privacy Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

// Component: Achievement Card
interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${achievement.isUnlocked ? `border-${achievement.color}-200` : 'border-gray-200 opacity-70'}`}>
      <div className={`h-1.5 ${achievement.isUnlocked ? achievement.color : 'bg-gray-200'}`}></div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className={`p-2 rounded-full ${achievement.isUnlocked ? `bg-${achievement.color}-50` : 'bg-gray-100'}`}>
            {achievement.icon}
          </div>
          {achievement.isUnlocked && (
            <Badge className={achievement.color}>Unlocked</Badge>
          )}
        </div>
        
        <h3 className={`font-medium mb-1 ${achievement.isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
          {achievement.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
        
        {achievement.progress !== undefined && (
          <div className="space-y-1 mt-2">
            <div className="flex justify-between text-xs">
              <span>{achievement.progress}/{achievement.maxProgress}</span>
              {achievement.isUnlocked && achievement.date && (
                <span>Achieved: {achievement.date}</span>
              )}
            </div>
            <Progress 
              value={achievement.maxProgress ? (achievement.progress / achievement.maxProgress) * 100 : 0} 
              className="h-1.5" 
              indicatorClassName={achievement.isUnlocked ? achievement.color : 'bg-gray-300'} 
            />
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs px-2 h-7"
          >
            <Users className="h-3 w-3 mr-1" />
            42 drivers
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs px-2 h-7"
          >
            <Share2 className="h-3 w-3 mr-1" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

// Component: Challenge Card
interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  return (
    <div className={`border rounded-lg overflow-hidden ${challenge.isActive ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="p-4">
        <div className="flex flex-wrap md:flex-nowrap gap-3 items-start">
          <div className="flex-shrink-0">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              challenge.category === 'eco' ? 'bg-green-100' :
              challenge.category === 'safe' ? 'bg-blue-100' :
              challenge.category === 'skill' ? 'bg-amber-100' :
              challenge.category === 'endurance' ? 'bg-purple-100' :
              'bg-cyan-100'
            }`}>
              {challenge.category === 'eco' && <Leaf className="h-6 w-6 text-green-600" />}
              {challenge.category === 'safe' && <Shield className="h-6 w-6 text-blue-600" />}
              {challenge.category === 'skill' && <Zap className="h-6 w-6 text-amber-600" />}
              {challenge.category === 'endurance' && <Flag className="h-6 w-6 text-purple-600" />}
              {challenge.category === 'maintenance' && <Wrench className="h-6 w-6 text-cyan-600" />}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {challenge.name}
                  {challenge.isActive && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </div>
              
              {challenge.sponsorName && (
                <div className="flex items-center text-xs text-muted-foreground">
                  Sponsored by {challenge.sponsorName}
                </div>
              )}
            </div>
            
            <div className="space-y-2 mt-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{challenge.progress}% complete</span>
              </div>
              <Progress value={challenge.progress} className="h-2" />
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{challenge.endDate}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{challenge.participants} participants</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-sm font-medium">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <span>Reward: {challenge.reward}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component: Community Post Card
interface CommunityPostCardProps {
  post: CommunityPost;
}

const CommunityPostCard: React.FC<CommunityPostCardProps> = ({ post }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-wrap justify-between">
              <div>
                <p className="font-medium">{post.user.name}</p>
                {post.user.title && (
                  <p className="text-xs text-muted-foreground">{post.user.title}</p>
                )}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.timestamp}
              </div>
            </div>
            
            <p className="mt-2 text-sm">{post.content}</p>
            
            {post.achievements && post.achievements.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {post.achievements.map((achievement, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className={`${achievement.color} flex items-center gap-1`}
                  >
                    {achievement.icon}
                    {achievement.name}
                  </Badge>
                ))}
              </div>
            )}
            
            {post.media && (
              <div className="mt-3 rounded-md overflow-hidden border bg-muted/20">
                <img 
                  src={post.media.url} 
                  alt="Post Media" 
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}
            
            {post.stats && post.stats.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                {post.stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-md">
                    <div className={`p-1 rounded-full ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.name}</p>
                      <p className="text-sm font-medium">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Separator className="my-3" />
            
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" className="gap-1 text-xs px-2 h-8">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Like ({post.likes})
                </Button>
                <Button variant="ghost" size="sm" className="gap-1 text-xs px-2 h-8">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Comment ({post.comments})
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-xs px-2 h-8">
                <Share2 className="h-3.5 w-3.5" />
                Share ({post.shares})
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for Shield icon (missing from import)
const Shield = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

// Helper component for Wrench icon (missing from import)
const Wrench = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

// Sample data
const socialStatistics = [
  {
    name: 'Eco Score',
    value: '94/100',
    icon: <Leaf className="h-4 w-4 text-green-500" />,
    bgColor: 'bg-green-50'
  },
  {
    name: 'Achievements',
    value: '12/28',
    icon: <Trophy className="h-4 w-4 text-amber-500" />,
    bgColor: 'bg-amber-50'
  },
  {
    name: 'Followers',
    value: '157',
    icon: <Users className="h-4 w-4 text-blue-500" />,
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Challenges',
    value: '3 Active',
    icon: <Flag className="h-4 w-4 text-purple-500" />,
    bgColor: 'bg-purple-50'
  },
];

// Achievement Categories
const achievementCategories = [
  { 
    id: 'all', 
    name: 'All', 
    icon: <Trophy className="h-3.5 w-3.5" />,
    bgColor: 'bg-gray-900 text-white'
  },
  { 
    id: 'eco', 
    name: 'Eco', 
    icon: <Leaf className="h-3.5 w-3.5" />,
    bgColor: 'bg-green-600 text-white'
  },
  { 
    id: 'safe', 
    name: 'Safety', 
    icon: <Shield className="h-3.5 w-3.5" />,
    bgColor: 'bg-blue-600 text-white'
  },
  { 
    id: 'skill', 
    name: 'Skill', 
    icon: <Zap className="h-3.5 w-3.5" />,
    bgColor: 'bg-amber-600 text-white'
  },
  { 
    id: 'endurance', 
    name: 'Endurance', 
    icon: <Flag className="h-3.5 w-3.5" />,
    bgColor: 'bg-purple-600 text-white'
  }
];

// Sample Achievements
const achievements: Achievement[] = [
  {
    id: 'eco-master',
    name: 'Eco-Driving Master',
    description: 'Maintain 90%+ efficiency for 30 consecutive days',
    icon: <Leaf className="h-5 w-5 text-green-600" />,
    color: 'bg-green-600',
    isUnlocked: true,
    date: 'Apr 15, 2025',
    progress: 30,
    maxProgress: 30,
    category: 'eco'
  },
  {
    id: 'battery-optimizer',
    name: 'Battery Optimizer',
    description: 'Achieve maximum battery life through efficient energy usage',
    icon: <Zap className="h-5 w-5 text-amber-600" />,
    color: 'bg-amber-600',
    isUnlocked: true,
    date: 'Mar 22, 2025',
    progress: 100,
    maxProgress: 100,
    category: 'skill'
  },
  {
    id: 'safe-driver',
    name: 'Safety Champion',
    description: 'Complete 50 trips with zero safety violations',
    icon: <Shield className="h-5 w-5 text-blue-600" />,
    color: 'bg-blue-600',
    isUnlocked: true,
    date: 'Feb 28, 2025',
    progress: 50,
    maxProgress: 50,
    category: 'safe'
  },
  {
    id: 'roadtrip-warrior',
    name: 'Road Trip Warrior',
    description: 'Complete a journey of over 500km in a single day',
    icon: <Flag className="h-5 w-5 text-purple-600" />,
    color: 'bg-purple-600',
    isUnlocked: false,
    progress: 342,
    maxProgress: 500,
    category: 'endurance'
  },
  {
    id: 'maintenance-guru',
    name: 'Maintenance Guru',
    description: 'Follow all maintenance recommendations for 6 months',
    icon: <Wrench className="h-5 w-5 text-cyan-600" />,
    color: 'bg-cyan-600',
    isUnlocked: false,
    progress: 4,
    maxProgress: 6,
    category: 'maintenance'
  },
  {
    id: 'smooth-operator',
    name: 'Smooth Operator',
    description: 'Achieve top-tier smoothness score for 20 consecutive trips',
    icon: <Zap className="h-5 w-5 text-amber-600" />,
    color: 'bg-amber-600',
    isUnlocked: false,
    progress: 12,
    maxProgress: 20,
    category: 'skill'
  }
];

// Sample Challenges
const challenges: Challenge[] = [
  {
    id: 'challenge1',
    name: 'Spring Eco Challenge',
    description: 'Maintain 90%+ efficiency score for all trips this month',
    reward: '500 Green Points + Digital Badge',
    endDate: 'May 31, 2025',
    participants: 1248,
    progress: 72,
    isActive: true,
    sponsorName: 'GreenDrive Initiative',
    category: 'eco'
  },
  {
    id: 'challenge2',
    name: 'Smooth Braking Marathon',
    description: 'Complete 30 trips with minimal harsh braking events',
    reward: 'Premium Driver Status for 3 months',
    endDate: 'May 15, 2025',
    participants: 856,
    progress: 40,
    isActive: true,
    sponsorName: 'SafeRoads Association',
    category: 'safe'
  },
  {
    id: 'challenge3',
    name: 'Battery Health Optimizer',
    description: 'Improve your EV battery health score by 5% in one month',
    reward: 'Free Battery Analysis Session',
    endDate: 'May 20, 2025',
    participants: 423,
    progress: 60,
    isActive: true,
    category: 'maintenance'
  }
];

// Sample Community Posts
const communityPosts: CommunityPost[] = [
  {
    id: 'post1',
    user: {
      name: 'Rajesh Kumar',
      avatar: '/avatars/02.png',
      initials: 'RK',
      title: 'EV Enthusiast',
      location: 'Delhi'
    },
    content: 'Just unlocked the Eco-Driving Master badge after 30 days of consistent efficient driving. The Drishti OBD2 device helped me optimize my route and driving style!',
    timestamp: '2 hours ago',
    likes: 48,
    comments: 12,
    shares: 5,
    achievements: [
      {
        icon: <Leaf className="h-3 w-3" />,
        name: 'Eco-Driving Master',
        color: 'bg-green-50 text-green-700 border-green-200'
      }
    ],
    stats: [
      {
        name: 'Efficiency',
        value: '92%',
        icon: <Leaf className="h-3.5 w-3.5 text-green-600" />,
        color: 'bg-green-50'
      },
      {
        name: 'Fuel Saved',
        value: '12.4L',
        icon: <Droplet className="h-3.5 w-3.5 text-blue-600" />,
        color: 'bg-blue-50'
      },
      {
        name: 'CO₂ Reduced',
        value: '32kg',
        icon: <Globe className="h-3.5 w-3.5 text-cyan-600" />,
        color: 'bg-cyan-50'
      },
      {
        name: 'Streak',
        value: '30 days',
        icon: <Flame className="h-3.5 w-3.5 text-orange-600" />,
        color: 'bg-orange-50'
      }
    ]
  },
  {
    id: 'post2',
    user: {
      name: 'Priya Sharma',
      avatar: '/avatars/04.png',
      initials: 'PS',
      title: 'City Commuter',
      location: 'Mumbai'
    },
    content: 'The AI route recommendation engine suggested a new path to work that saved me 15 minutes and was much easier on my car\'s brakes. Loving the vehicle health insights!',
    timestamp: 'Yesterday',
    likes: 33,
    comments: 7,
    shares: 2,
    media: {
      type: 'image',
      url: 'https://maps.googleapis.com/maps/api/staticmap?center=19.076090,72.877426&zoom=12&size=600x300&maptype=roadmap&path=color:0x0000ff|weight:5|19.076090,72.877426|19.096685,72.858030|19.118685,72.830791|19.128943,72.818345&key=YOUR_KEY'
    },
    stats: [
      {
        name: 'Time Saved',
        value: '15 mins',
        icon: <Clock className="h-3.5 w-3.5 text-purple-600" />,
        color: 'bg-purple-50'
      },
      {
        name: 'Brake Wear',
        value: '-27%',
        icon: <TrendingUp className="h-3.5 w-3.5 text-green-600" />,
        color: 'bg-green-50'
      }
    ]
  }
];

export default SocialSharingAchievements;