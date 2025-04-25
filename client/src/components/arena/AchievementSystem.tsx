import React, { useState, useEffect } from 'react';
import { Trophy, Star, BadgeCheck, Award, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

interface AchievementSystemProps {
  userPoints: number;
  onPointsEarned: (points: number) => void;
  onAchievementComplete: (achievementId: string) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  progress: number;
  maxProgress: number;
  category: 'design' | 'community' | 'learning' | 'milestone';
  completed: boolean;
  unlocked: boolean;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  userPoints,
  onPointsEarned,
  onAchievementComplete
}) => {
  const [showAchievements, setShowAchievements] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-project',
      title: 'Project Pioneer',
      description: 'Create your first customization project',
      icon: <Star className="text-yellow-500" />,
      points: 50,
      progress: 1,
      maxProgress: 1,
      category: 'design',
      completed: true,
      unlocked: true
    },
    {
      id: 'wheel-master',
      title: 'Wheel Master',
      description: 'Complete a wheel customization design',
      icon: <Award className="text-blue-500" />,
      points: 75,
      progress: 0,
      maxProgress: 1,
      category: 'design',
      completed: false,
      unlocked: true
    },
    {
      id: 'interior-artisan',
      title: 'Interior Artisan',
      description: 'Create an interior customization design',
      icon: <BadgeCheck className="text-green-500" />,
      points: 75,
      progress: 0,
      maxProgress: 1,
      category: 'design',
      completed: false,
      unlocked: true
    },
    {
      id: 'project-collector',
      title: 'Project Collector',
      description: 'Create 5 different customization projects',
      icon: <Trophy className="text-orange-500" />,
      points: 150,
      progress: 1,
      maxProgress: 5,
      category: 'milestone',
      completed: false,
      unlocked: true
    },
    {
      id: 'community-contributor',
      title: 'Community Contributor',
      description: 'Share a project with the community',
      icon: <Star className="text-purple-500" />,
      points: 100,
      progress: 0,
      maxProgress: 1,
      category: 'community',
      completed: false,
      unlocked: true
    },
    {
      id: 'knowledge-seeker',
      title: 'Knowledge Seeker',
      description: 'View 3 DIY guides in the Learn section',
      icon: <BadgeCheck className="text-indigo-500" />,
      points: 60,
      progress: 0,
      maxProgress: 3,
      category: 'learning',
      completed: false,
      unlocked: true
    },
    {
      id: 'voice-commander',
      title: 'Voice Commander',
      description: 'Use voice control to navigate the platform',
      icon: <Star className="text-cyan-500" />,
      points: 50,
      progress: 0,
      maxProgress: 1,
      category: 'milestone',
      completed: false,
      unlocked: true
    },
    {
      id: 'master-customizer',
      title: 'Master Customizer',
      description: 'Complete all types of customizations',
      icon: <Trophy className="text-red-500" />,
      points: 250,
      progress: 0,
      maxProgress: 4,
      category: 'milestone',
      completed: false,
      unlocked: false
    }
  ]);
  
  const userRank = getUserRank(userPoints);
  
  // Get user rank based on points
  function getUserRank(points: number): { name: string; level: number; nextLevel: number; } {
    if (points < 100) {
      return { name: 'Beginner', level: 1, nextLevel: 100 };
    } else if (points < 300) {
      return { name: 'Enthusiast', level: 2, nextLevel: 300 };
    } else if (points < 700) {
      return { name: 'Designer', level: 3, nextLevel: 700 };
    } else if (points < 1500) {
      return { name: 'Expert', level: 4, nextLevel: 1500 };
    } else {
      return { name: 'Master', level: 5, nextLevel: -1 }; // Max level
    }
  }
  
  // Calculate progress percentage to next level
  const getProgressPercentage = (): number => {
    if (userRank.level === 5) return 100; // Max level
    
    const prevLevelThreshold = userRank.level === 1 ? 0 : 
                             userRank.level === 2 ? 100 :
                             userRank.level === 3 ? 300 :
                             userRank.level === 4 ? 700 : 0;
    
    const pointsInCurrentLevel = userPoints - prevLevelThreshold;
    const pointsRequiredForNextLevel = userRank.nextLevel - prevLevelThreshold;
    
    return Math.min(100, Math.round((pointsInCurrentLevel / pointsRequiredForNextLevel) * 100));
  };
  
  // Simulate achievement progress update
  const progressAchievement = (achievementId: string, amount: number = 1) => {
    setAchievements(prev => {
      return prev.map(achievement => {
        if (achievement.id === achievementId) {
          const newProgress = Math.min(achievement.maxProgress, achievement.progress + amount);
          const newlyCompleted = newProgress === achievement.maxProgress && !achievement.completed;
          
          // If newly completed, trigger notification
          if (newlyCompleted) {
            setRecentAchievement({
              ...achievement,
              progress: newProgress,
              completed: true
            });
            
            // Call the callback
            onAchievementComplete(achievementId);
          }
          
          return {
            ...achievement,
            progress: newProgress,
            completed: newlyCompleted ? true : achievement.completed
          };
        }
        return achievement;
      });
    });
  };
  
  // Filter achievements by category
  const filteredAchievements = filterCategory === 'all' 
    ? achievements
    : achievements.filter(a => a.category === filterCategory);
  
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>Rank {userRank.level}</span>
            <Badge className="ml-1 bg-primary/20 text-primary text-xs hover:bg-primary/30">
              {userPoints} pts
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{userRank.name}</h4>
                <p className="text-sm text-muted-foreground">Rank {userRank.level}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span>{userPoints} points</span>
                {userRank.nextLevel > 0 && (
                  <span>{userRank.nextLevel} points needed for next rank</span>
                )}
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
            
            <div className="pt-2">
              <h4 className="font-medium mb-2">Recent Achievements</h4>
              <div className="space-y-2">
                {achievements.filter(a => a.completed).slice(0, 3).map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {achievement.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">+{achievement.points} pts</p>
                    </div>
                  </div>
                ))}
                
                {achievements.filter(a => a.completed).length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No achievements unlocked yet</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAchievements(true)}
            >
              View All Achievements
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Achievement notification popup */}
      <AnimatePresence>
        {recentAchievement && (
          <motion.div 
            className="fixed top-20 right-4 bg-card border shadow-lg rounded-lg p-4 z-50 w-80"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                {recentAchievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">Achievement Unlocked!</h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => setRecentAchievement(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm">{recentAchievement.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{recentAchievement.description}</p>
                <Badge className="bg-primary/20 text-primary">
                  +{recentAchievement.points} pts
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Full achievements dialog */}
      <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Achievements</DialogTitle>
            <DialogDescription>
              Complete achievements to earn points and increase your rank
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4 overflow-y-auto">
            <div className="flex border rounded-lg overflow-hidden">
              <Button 
                variant={filterCategory === 'all' ? "default" : "ghost"}
                className="flex-1 rounded-none"
                onClick={() => setFilterCategory('all')}
              >
                All
              </Button>
              <Button 
                variant={filterCategory === 'design' ? "default" : "ghost"}
                className="flex-1 rounded-none"
                onClick={() => setFilterCategory('design')}
              >
                Design
              </Button>
              <Button 
                variant={filterCategory === 'community' ? "default" : "ghost"}
                className="flex-1 rounded-none"
                onClick={() => setFilterCategory('community')}
              >
                Community
              </Button>
              <Button 
                variant={filterCategory === 'learning' ? "default" : "ghost"}
                className="flex-1 rounded-none"
                onClick={() => setFilterCategory('learning')}
              >
                Learning
              </Button>
              <Button 
                variant={filterCategory === 'milestone' ? "default" : "ghost"}
                className="flex-1 rounded-none"
                onClick={() => setFilterCategory('milestone')}
              >
                Milestones
              </Button>
            </div>
            
            <div className="space-y-4">
              {filteredAchievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`border rounded-lg p-4 ${!achievement.unlocked ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center 
                      ${achievement.completed ? 'bg-primary/20' : 'bg-muted'}`}
                    >
                      {achievement.completed || achievement.unlocked 
                        ? achievement.icon 
                        : <Lock className="h-5 w-5 text-muted-foreground" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.unlocked 
                              ? achievement.description 
                              : 'Complete previous achievements to unlock'
                            }
                          </p>
                        </div>
                        <Badge>+{achievement.points} pts</Badge>
                      </div>
                      
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress: {achievement.progress}/{achievement.maxProgress}</span>
                          <span>
                            {achievement.completed 
                              ? 'Completed' 
                              : `${Math.round((achievement.progress / achievement.maxProgress) * 100)}%`
                            }
                          </span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-1.5" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredAchievements.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No achievements in this category
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <div className="flex items-center gap-2 mr-auto">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Total: {userPoints} points</span>
            </div>
            <Button onClick={() => setShowAchievements(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AchievementSystem;