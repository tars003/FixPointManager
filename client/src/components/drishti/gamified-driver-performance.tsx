import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Award, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Medal, 
  Share2, 
  Zap, 
  Leaf, 
  Shield, 
  Clock, 
  ThumbsUp,
  Target,
  Flame,
  Calendar,
  ArrowRight,
  Lightbulb
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  level: number;
  maxLevel: number;
  unlocked: boolean;
  category: 'eco' | 'safety' | 'skill' | 'consistent';
  date?: string;
}

interface DriverRanking {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  position: number;
  badges: string[];
}

interface WeeklyChallenge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  goal: number;
  reward: string;
  daysLeft: number;
}

const GamifiedDriverPerformance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('achievements');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#FFC107]" />
              Driver Performance Dashboard
            </CardTitle>
            <CardDescription>
              Gamified metrics and achievements for driving improvement
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 gap-1">
              <Share2 className="h-3.5 w-3.5" />
              Share Results
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Driver Score Overview */}
        <div className="p-4 bg-gradient-to-r from-[#0056B3]/10 to-[#0056B3]/5 rounded-lg border">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-[#0056B3] p-1.5 bg-white">
                <div className="h-full w-full rounded-full bg-[#0056B3]/10 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-[#0056B3]">87</span>
                    <span className="block text-xs text-[#0056B3]/90">DRIVE SCORE</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-[#FFC107] h-8 w-8 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Eco Driving</span>
                  </div>
                  <span className="text-sm">92/100</span>
                </div>
                <Progress value={92} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Safety</span>
                  </div>
                  <span className="text-sm">85/100</span>
                </div>
                <Progress value={85} className="h-2 bg-gray-100" indicatorClassName="bg-blue-500" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Smoothness</span>
                  </div>
                  <span className="text-sm">78/100</span>
                </div>
                <Progress value={78} className="h-2 bg-gray-100" indicatorClassName="bg-amber-500" />
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border">
              <div className="flex items-center gap-1.5 mb-2">
                <Medal className="h-5 w-5 text-[#FFC107]" />
                <span className="font-semibold">Current Rank</span>
              </div>
              
              <div className="text-center">
                <span className="block text-3xl font-bold">#3</span>
                <span className="text-sm text-muted-foreground">of 28 Drivers</span>
              </div>
              
              <div className="flex items-center mt-2 text-green-500 text-sm">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                <span>Up 2 places</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="achievements" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements" className="space-y-4 pt-4">
            {/* Achievement Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Filter:</span>
              <CategoryFilter 
                categories={achievementCategories} 
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
            
            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements
                .filter(a => selectedCategory === 'all' || a.category === selectedCategory)
                .map(achievement => (
                  <AchievementCard 
                    key={achievement.id} 
                    achievement={achievement} 
                  />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="pt-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Driver Rankings</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 px-3 gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    This Month
                  </Button>
                </div>
              </div>
              
              {/* Top 3 Drivers */}
              <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                {/* 2nd Place */}
                <div className="order-2 md:order-1 flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-[#94A3B8]">
                      <AvatarImage src="/avatars/02.png" alt="Second Place" />
                      <AvatarFallback>RK</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#94A3B8] h-7 w-7 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-medium">Rajesh Kumar</p>
                    <p className="text-sm text-muted-foreground">Score: 82</p>
                  </div>
                </div>
                
                {/* 1st Place */}
                <div className="order-1 md:order-2 flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-[#FFC107]">
                      <AvatarImage src="/avatars/01.png" alt="First Place" />
                      <AvatarFallback>VP</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#FFC107] h-8 w-8 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-medium">Vikram Patel</p>
                    <p className="text-sm text-muted-foreground">Score: 94</p>
                    <div className="flex justify-center mt-1 gap-1">
                      <Badge className="bg-green-100 text-green-800 text-xs">4 Week Streak</Badge>
                    </div>
                  </div>
                </div>
                
                {/* 3rd Place - Current User */}
                <div className="order-3 flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-[#CD7F32]">
                      <AvatarImage src="/avatars/03.png" alt="Third Place" />
                      <AvatarFallback>SV</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#CD7F32] h-7 w-7 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-medium">Sanjay Verma</p>
                    <p className="text-sm text-muted-foreground">Score: 87</p>
                    <Badge variant="outline" className="mt-1 border-green-500 text-green-600 bg-green-50 text-xs gap-1">
                      <TrendingUp className="h-3 w-3" />
                      You
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Leaderboard Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-3 text-sm font-medium">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-5">Driver</div>
                    <div className="col-span-2 text-center">Score</div>
                    <div className="col-span-2 text-center">Badges</div>
                    <div className="col-span-2 text-center">Trend</div>
                  </div>
                </div>
                
                <div className="divide-y">
                  {driverRankings.map((driver) => (
                    <div 
                      key={driver.id} 
                      className={`p-3 text-sm ${driver.id === 'driver3' ? 'bg-blue-50' : 'hover:bg-muted/50'}`}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 text-center font-medium">{driver.position}</div>
                        <div className="col-span-5">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={driver.avatar} alt={driver.name} />
                              <AvatarFallback>{driver.initials}</AvatarFallback>
                            </Avatar>
                            <span>{driver.name}</span>
                          </div>
                        </div>
                        <div className="col-span-2 text-center font-medium">{driver.score}</div>
                        <div className="col-span-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {driver.badges.includes('eco') && <Leaf className="h-4 w-4 text-green-500" />}
                            {driver.badges.includes('safety') && <Shield className="h-4 w-4 text-blue-500" />}
                            {driver.badges.includes('skill') && <Zap className="h-4 w-4 text-amber-500" />}
                            {driver.badges.includes('streak') && <Flame className="h-4 w-4 text-red-500" />}
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className={`
                            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                            ${driver.trend === 'up' 
                              ? 'bg-green-100 text-green-800' 
                              : driver.trend === 'down' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-gray-100 text-gray-800'
                            }
                          `}>
                            {driver.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                            {driver.trend === 'down' && <TrendingUp className="h-3 w-3 rotate-180" />}
                            {driver.trend === 'stable' && <ArrowRight className="h-3 w-3" />}
                            {driver.trend === 'up' ? 'Improving' : driver.trend === 'down' ? 'Declining' : 'Stable'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="challenges" className="pt-4">
            <div className="space-y-4">
              {/* Active Challenge */}
              <div className="p-4 border rounded-lg bg-gradient-to-r from-amber-50 to-transparent">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center bg-amber-100 rounded-lg p-4 h-20 w-20">
                    <Flame className="h-10 w-10 text-amber-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="bg-amber-100 border-0 text-amber-800 mb-1">FEATURED CHALLENGE</Badge>
                        <h3 className="text-lg font-medium">Eco-Driving Master</h3>
                        <p className="text-sm text-muted-foreground mt-1">Maintain fuel efficiency above 90% for 7 consecutive days.</p>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress: 5/7 days</span>
                        <span className="font-medium">71%</span>
                      </div>
                      <Progress value={71} className="h-2" indicatorClassName="bg-amber-500" />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          2 days remaining
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium text-amber-700">
                          <Trophy className="h-3.5 w-3.5" />
                          500 Drive Points
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Weekly Challenges */}
              <h3 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Weekly Challenges
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weeklyChallenges.map(challenge => (
                  <Card key={challenge.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex gap-3 items-start">
                        <div className="p-2 bg-muted rounded-md">{challenge.icon}</div>
                        <div>
                          <CardTitle className="text-base">{challenge.name}</CardTitle>
                          <CardDescription>{challenge.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(challenge.progress / challenge.goal * 100)}%</span>
                        </div>
                        <Progress 
                          value={challenge.progress / challenge.goal * 100} 
                          className="h-2" 
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{challenge.progress} of {challenge.goal}</span>
                          <span>{challenge.daysLeft} days left</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-4 py-2 bg-muted/30 flex justify-between items-center">
                      <div className="flex items-center gap-1 text-sm">
                        <Trophy className="h-3.5 w-3.5 text-amber-500" />
                        <span>Reward: {challenge.reward}</span>
                      </div>
                      <Button variant="outline" size="sm">Join</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Lightbulb className="h-4 w-4" />
          Improve your score by avoiding harsh braking and maintaining consistent speed
        </div>
        <Button className="gap-1">
          <Zap className="h-4 w-4" />
          View Improvement Tips
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper Components
interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { name, description, icon, progress, maxProgress, level, maxLevel, unlocked, category, date } = achievement;
  
  const categoryColorMap = {
    eco: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      accent: 'text-green-600',
      progress: 'bg-green-500'
    },
    safety: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      accent: 'text-blue-600',
      progress: 'bg-blue-500'
    },
    skill: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      accent: 'text-amber-600',
      progress: 'bg-amber-500'
    },
    consistent: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      accent: 'text-purple-600',
      progress: 'bg-purple-500'
    }
  };
  
  const colors = categoryColorMap[category];
  
  return (
    <div 
      className={`border rounded-lg overflow-hidden ${unlocked ? colors.border : 'border-gray-200'} 
      ${unlocked ? colors.bg : 'bg-gray-50'}`}
    >
      <div className="p-4">
        <div className="flex gap-3">
          <div 
            className={`p-2 rounded-md ${unlocked ? '' : 'bg-gray-100'} flex-shrink-0`}
          >
            {icon}
          </div>
          <div>
            <h3 className={`font-medium ${unlocked ? colors.accent : 'text-gray-500'}`}>{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className={unlocked ? colors.text : 'text-gray-500'}>
              Level {level}/{maxLevel}
            </span>
            <span className={unlocked ? colors.text : 'text-gray-500'}>
              {progress}/{maxProgress}
            </span>
          </div>
          
          <Progress 
            value={progress / maxProgress * 100} 
            className="h-1.5 bg-gray-100" 
            indicatorClassName={unlocked ? colors.progress : 'bg-gray-300'} 
          />
        </div>
        
        {unlocked && date && (
          <div className="flex justify-end mt-2 text-xs text-muted-foreground">
            Unlocked: {date}
          </div>
        )}
      </div>
    </div>
  );
};

interface CategoryFilterProps {
  categories: {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
  }[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="flex flex-wrap gap-1">
      {categories.map(category => (
        <Badge 
          key={category.id} 
          variant={selectedCategory === category.id ? "default" : "outline"}
          className="cursor-pointer gap-1"
          style={
            selectedCategory === category.id 
              ? { backgroundColor: category.color, color: 'white' }
              : { borderColor: category.color + '40', color: category.color }
          }
          onClick={() => onSelectCategory(category.id)}
        >
          {category.icon}
          {category.name}
        </Badge>
      ))}
    </div>
  );
};

// Sample Data
const achievementCategories = [
  { id: 'all', name: 'All', icon: <Trophy className="h-3 w-3" />, color: '#6C757D' },
  { id: 'eco', name: 'Eco', icon: <Leaf className="h-3 w-3" />, color: '#28A745' },
  { id: 'safety', name: 'Safety', icon: <Shield className="h-3 w-3" />, color: '#0056B3' },
  { id: 'skill', name: 'Skill', icon: <Zap className="h-3 w-3" />, color: '#FFC107' },
  { id: 'consistent', name: 'Consistency', icon: <Clock className="h-3 w-3" />, color: '#9333EA' }
];

const achievements: Achievement[] = [
  {
    id: 'eco-master',
    name: 'Eco Driving Master',
    description: 'Maintain excellent fuel efficiency for extended periods',
    icon: <Leaf className="h-4 w-4 text-green-600" />,
    progress: 78,
    maxProgress: 100,
    level: 3,
    maxLevel: 5,
    unlocked: true,
    category: 'eco',
    date: 'Mar 10, 2025'
  },
  {
    id: 'smooth-operator',
    name: 'Smooth Operator',
    description: 'Consistently achieve smooth acceleration and braking',
    icon: <Zap className="h-4 w-4 text-amber-600" />,
    progress: 45,
    maxProgress: 50,
    level: 2,
    maxLevel: 3,
    unlocked: true,
    category: 'skill',
    date: 'Feb 28, 2025'
  },
  {
    id: 'safety-first',
    name: 'Safety First',
    description: 'Drive safely without incidents for 30 days',
    icon: <Shield className="h-4 w-4 text-blue-600" />,
    progress: 22,
    maxProgress: 30,
    level: 1,
    maxLevel: 3,
    unlocked: true,
    category: 'safety',
    date: 'Mar 5, 2025'
  },
  {
    id: 'consistency',
    name: 'Consistency King',
    description: 'Maintain high performance scores for 15 consecutive days',
    icon: <Clock className="h-4 w-4 text-purple-600" />,
    progress: 8,
    maxProgress: 15,
    level: 1,
    maxLevel: 3,
    unlocked: true,
    category: 'consistent'
  },
  {
    id: 'night-driver',
    name: 'Night Owl',
    description: 'Master night driving with excellent safety scores',
    icon: <Shield className="h-4 w-4 text-gray-500" />,
    progress: 3,
    maxProgress: 10,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    category: 'safety'
  },
  {
    id: 'efficiency-expert',
    name: 'Efficiency Expert',
    description: 'Achieve 95%+ fuel efficiency on 10 trips',
    icon: <Leaf className="h-4 w-4 text-gray-500" />,
    progress: 4,
    maxProgress: 10,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    category: 'eco'
  }
];

const driverRankings: DriverRanking[] = [
  {
    id: 'driver1',
    name: 'Vikram Patel',
    avatar: '/avatars/01.png',
    initials: 'VP',
    score: 94,
    trend: 'up',
    position: 1,
    badges: ['eco', 'safety', 'skill', 'streak']
  },
  {
    id: 'driver2',
    name: 'Rajesh Kumar',
    avatar: '/avatars/02.png',
    initials: 'RK',
    score: 82,
    trend: 'down',
    position: 2,
    badges: ['eco', 'safety']
  },
  {
    id: 'driver3',
    name: 'Sanjay Verma',
    avatar: '/avatars/03.png',
    initials: 'SV',
    score: 87,
    trend: 'up',
    position: 3,
    badges: ['eco', 'skill']
  },
  {
    id: 'driver4',
    name: 'Priya Sharma',
    avatar: '/avatars/04.png',
    initials: 'PS',
    score: 79,
    trend: 'stable',
    position: 4,
    badges: ['safety']
  },
  {
    id: 'driver5',
    name: 'Ankit Gupta',
    avatar: '/avatars/05.png',
    initials: 'AG',
    score: 76,
    trend: 'down',
    position: 5,
    badges: ['skill']
  }
];

const weeklyChallenges: WeeklyChallenge[] = [
  {
    id: 'challenge1',
    name: 'Smooth Operator',
    description: 'Achieve smooth driving with minimal harsh braking events',
    icon: <Zap className="h-5 w-5 text-amber-500" />,
    progress: 8,
    goal: 10,
    reward: '200 Drive Points',
    daysLeft: 4
  },
  {
    id: 'challenge2',
    name: 'Green Mile',
    description: 'Complete 100km with high fuel efficiency rating',
    icon: <Leaf className="h-5 w-5 text-green-500" />,
    progress: 65,
    goal: 100,
    reward: '250 Drive Points',
    daysLeft: 5
  },
  {
    id: 'challenge3',
    name: 'Safety Champion',
    description: 'No speeding incidents for 7 days',
    icon: <Shield className="h-5 w-5 text-blue-500" />,
    progress: 3,
    goal: 7,
    reward: '150 Drive Points + Badge',
    daysLeft: 4
  },
  {
    id: 'challenge4',
    name: 'Morning Rush Expert',
    description: 'Maintain high scores during peak traffic hours',
    icon: <Clock className="h-5 w-5 text-purple-500" />,
    progress: 2,
    goal: 5,
    reward: '300 Drive Points',
    daysLeft: 3
  },
];

export default GamifiedDriverPerformance;