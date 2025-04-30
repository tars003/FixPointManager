import React from 'react';
import { Award, Trophy, Star, Lock, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AchievementSystemProps {
  userPoints: number;
  onPointsEarned?: (points: number) => void;
  onAchievementComplete?: (achievementId: number) => void;
}

// Mock achievement data
interface Achievement {
  id: number;
  name: string;
  description: string;
  iconType: 'award' | 'trophy' | 'star';
  pointsRequired: number;
  unlocked: boolean;
  category: 'beginner' | 'intermediate' | 'advanced';
}

const mockAchievements: Achievement[] = [
  {
    id: 1,
    name: 'First Customization',
    description: 'Customize your first vehicle',
    iconType: 'star',
    pointsRequired: 0,
    unlocked: true,
    category: 'beginner'
  },
  {
    id: 2,
    name: 'Paint Master',
    description: 'Try 5 different paint colors',
    iconType: 'award',
    pointsRequired: 50,
    unlocked: true,
    category: 'beginner'
  },
  {
    id: 3,
    name: 'Performance Tuner',
    description: 'Install your first performance upgrade',
    iconType: 'trophy',
    pointsRequired: 100,
    unlocked: true,
    category: 'beginner'
  },
  {
    id: 4,
    name: 'Wheel Expert',
    description: 'Try 10 different wheel combinations',
    iconType: 'award',
    pointsRequired: 150,
    unlocked: true,
    category: 'intermediate'
  },
  {
    id: 5,
    name: 'Custom Wrap Designer',
    description: 'Create and apply a custom wrap',
    iconType: 'trophy',
    pointsRequired: 200,
    unlocked: true,
    category: 'intermediate'
  },
  {
    id: 6,
    name: 'Showroom Ready',
    description: 'Complete a full vehicle customization',
    iconType: 'trophy',
    pointsRequired: 250,
    unlocked: true,
    category: 'intermediate'
  },
  {
    id: 7,
    name: 'Customization Guru',
    description: 'Unlock all premium parts in one category',
    iconType: 'award',
    pointsRequired: 300,
    unlocked: false,
    category: 'advanced'
  },
  {
    id: 8,
    name: 'Legendary Builder',
    description: 'Complete customizations for 5 different vehicles',
    iconType: 'trophy',
    pointsRequired: 500,
    unlocked: false,
    category: 'advanced'
  }
];

// Find the next achievement based on user points
const findNextAchievement = (points: number) => {
  const nextAchievement = mockAchievements
    .filter(a => a.pointsRequired > points)
    .sort((a, b) => a.pointsRequired - b.pointsRequired)[0];
  
  return nextAchievement || null;
};

// Calculate progress to the next achievement
const calculateProgress = (points: number, nextAchievement: Achievement | null) => {
  if (!nextAchievement) return 100;
  
  // Find the previous unlocked achievement
  const previousAchievements = mockAchievements
    .filter(a => a.pointsRequired <= points)
    .sort((a, b) => b.pointsRequired - a.pointsRequired);
  
  const previousPoints = previousAchievements.length > 0 
    ? previousAchievements[0].pointsRequired
    : 0;
  
  const totalPointsNeeded = nextAchievement.pointsRequired - previousPoints;
  const pointsEarned = points - previousPoints;
  
  return Math.min(100, Math.floor((pointsEarned / totalPointsNeeded) * 100));
};

// Get achievement icon based on type
const getAchievementIcon = (type: Achievement['iconType']) => {
  switch (type) {
    case 'award':
      return <Award className="h-4 w-4" />;
    case 'trophy':
      return <Trophy className="h-4 w-4" />;
    case 'star':
      return <Star className="h-4 w-4" />;
    default:
      return <Award className="h-4 w-4" />;
  }
};

const AchievementSystem: React.FC<AchievementSystemProps> = ({ userPoints }) => {
  // Update achievement unlocked status based on userPoints
  const achievements = mockAchievements.map(achievement => ({
    ...achievement,
    unlocked: userPoints >= achievement.pointsRequired
  }));
  
  // Find the next achievement
  const nextAchievement = findNextAchievement(userPoints);
  
  // Calculate progress
  const progressToNextAchievement = calculateProgress(userPoints, nextAchievement);
  
  // Count unlocked achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Achievements</CardTitle>
        <CardDescription>
          {unlockedCount}/{totalCount} achievements unlocked
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3 space-y-3">
        {/* Points summary */}
        <div className="p-3 rounded-md bg-muted/50">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>{userPoints} points</span>
            </h4>
            {nextAchievement && (
              <span className="text-xs text-muted-foreground">
                Next: {nextAchievement.pointsRequired}
              </span>
            )}
          </div>
          <Progress value={progressToNextAchievement} className="h-1.5" />
          {nextAchievement && (
            <p className="text-xs text-muted-foreground mt-1.5">
              <span className="font-medium text-foreground">
                {nextAchievement.name}:
              </span> {nextAchievement.description}
            </p>
          )}
        </div>
        
        {/* Recent achievements */}
        <div>
          <h4 className="text-xs font-medium mb-2">Recently Unlocked</h4>
          
          <div className="space-y-2">
            {achievements
              .filter(a => a.unlocked)
              .sort((a, b) => b.pointsRequired - a.pointsRequired)
              .slice(0, 3)
              .map(achievement => (
                <div 
                  key={achievement.id}
                  className="flex items-center gap-2 p-2 rounded-md bg-background border"
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${achievement.category === 'beginner' ? 'bg-green-50 text-green-500' : 
                      achievement.category === 'intermediate' ? 'bg-blue-50 text-blue-500' : 
                      'bg-purple-50 text-purple-500'}
                  `}>
                    {getAchievementIcon(achievement.iconType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-medium truncate">
                      {achievement.name}
                    </h5>
                    <p className="text-xs text-muted-foreground truncate">
                      {achievement.description}
                    </p>
                  </div>
                  
                  <Badge variant="outline" className="shrink-0">
                    {achievement.pointsRequired} pts
                  </Badge>
                </div>
              ))}
          </div>
        </div>
        
        {/* Locked achievements */}
        <div>
          <h4 className="text-xs font-medium mb-2">Next Challenges</h4>
          
          <div className="space-y-2">
            {achievements
              .filter(a => !a.unlocked)
              .sort((a, b) => a.pointsRequired - b.pointsRequired)
              .slice(0, 2)
              .map(achievement => (
                <div 
                  key={achievement.id}
                  className="flex items-center gap-2 p-2 rounded-md bg-muted/30 border border-dashed opacity-80"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-medium truncate">
                      {achievement.name}
                    </h5>
                    <p className="text-xs text-muted-foreground truncate">
                      {achievement.description}
                    </p>
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="shrink-0">
                          {achievement.pointsRequired} pts
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">
                          You need {achievement.pointsRequired - userPoints} more points
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t">
        <Button variant="outline" size="sm" className="w-full">
          View All Achievements
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AchievementSystem;