import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Clock, 
  Award, 
  Lock, 
  CheckCircle, 
  Sparkles, 
  X,
  ChevronRight,
  Medal,
  Zap,
  Crown,
  BellRing,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredPoints: number;
  currentPoints: number;
  category: 'design' | 'community' | 'technical' | 'innovation';
  isComplete: boolean;
  rewardPoints: number;
  rewardBadge?: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface AchievementSystemProps {
  userPoints: number;
  onPointsEarned?: (points: number) => void;
  onAchievementComplete?: (achievementId: string) => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  userPoints = 0,
  onPointsEarned,
  onAchievementComplete
}) => {
  const { toast } = useToast();
  const [showAchievements, setShowAchievements] = useState(false);
  const [recentlyCompletedId, setRecentlyCompletedId] = useState<string | null>(null);
  const [achievementCategories, setAchievementCategories] = useState<
    'all' | 'design' | 'community' | 'technical' | 'innovation'
  >('all');
  
  // Example achievements data
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-design',
      title: 'Design Novice',
      description: 'Create your first vehicle design',
      icon: <Sparkles className="h-5 w-5 text-yellow-500" />,
      requiredPoints: 10,
      currentPoints: 10,
      category: 'design',
      isComplete: true,
      rewardPoints: 50,
      rewardBadge: 'Beginner Designer',
      level: 'bronze'
    },
    {
      id: 'design-master',
      title: 'Design Master',
      description: 'Create 10 unique vehicle designs',
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      requiredPoints: 100,
      currentPoints: 30,
      category: 'design',
      isComplete: false,
      rewardPoints: 200,
      rewardBadge: 'Master Designer',
      level: 'gold'
    },
    {
      id: 'quick-learner',
      title: 'Quick Learner',
      description: 'Complete a design in under 5 minutes',
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      requiredPoints: 20,
      currentPoints: 20,
      category: 'technical',
      isComplete: true,
      rewardPoints: 100,
      level: 'silver'
    },
    {
      id: 'team-player',
      title: 'Team Player',
      description: 'Collaborate on a design with 3 other users',
      icon: <Users className="h-5 w-5 text-green-500" />,
      requiredPoints: 50,
      currentPoints: 0,
      category: 'community',
      isComplete: false,
      rewardPoints: 150,
      level: 'silver'
    },
    {
      id: 'innovation-guru',
      title: 'Innovation Guru',
      description: 'Use 5 different modification categories in one design',
      icon: <Zap className="h-5 w-5 text-purple-500" />,
      requiredPoints: 75,
      currentPoints: 45,
      category: 'innovation',
      isComplete: false,
      rewardPoints: 300,
      level: 'platinum'
    },
  ]);
  
  // Function to trigger confetti effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };
  
  // Update achievement progress (would connect to backend in production)
  const updateAchievementProgress = (id: string, pointsToAdd: number) => {
    setAchievements(prevAchievements => 
      prevAchievements.map(achievement => {
        if (achievement.id === id && !achievement.isComplete) {
          const newPoints = Math.min(achievement.requiredPoints, achievement.currentPoints + pointsToAdd);
          const newIsComplete = newPoints >= achievement.requiredPoints;
          
          // If newly completed, trigger confetti and handle rewards
          if (newIsComplete && !achievement.isComplete) {
            setRecentlyCompletedId(id);
            
            // Display a toast notification
            toast({
              title: "Achievement Unlocked!",
              description: `You've completed "${achievement.title}" and earned ${achievement.rewardPoints} points!`,
            });
            
            // Trigger confetti effect
            triggerConfetti();
            
            // Add reward points to user
            if (onPointsEarned) {
              onPointsEarned(achievement.rewardPoints);
            }
            
            // Notify parent about achievement completion
            if (onAchievementComplete) {
              onAchievementComplete(id);
            }
            
            // Hide the completion notice after 5 seconds
            setTimeout(() => {
              setRecentlyCompletedId(null);
            }, 5000);
          }
          
          return {
            ...achievement,
            currentPoints: newPoints,
            isComplete: newIsComplete
          };
        }
        return achievement;
      })
    );
  };
  
  // Get badge color based on level
  const getBadgeColor = (level: Achievement['level']) => {
    switch (level) {
      case 'bronze':
        return 'bg-amber-700/10 text-amber-700 hover:bg-amber-700/20';
      case 'silver':
        return 'bg-slate-400/10 text-slate-400 hover:bg-slate-400/20';
      case 'gold':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'platinum':
        return 'bg-indigo-400/10 text-indigo-400 hover:bg-indigo-400/20';
      default:
        return '';
    }
  };
  
  // Get filtered achievements based on selected category
  const filteredAchievements = achievements.filter(
    achievement => achievementCategories === 'all' || achievement.category === achievementCategories
  );
  
  // Rank tiers and progress
  const userLevel = Math.floor(userPoints / 500) + 1;
  const pointsToNextLevel = 500 * userLevel - userPoints;
  const progressToNextLevel = (userPoints % 500) / 500 * 100;
  
  return (
    <div className="relative">
      {/* Rank badge */}
      <div 
        className="relative flex items-center cursor-pointer" 
        onClick={() => setShowAchievements(!showAchievements)}
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-1 pr-3 pl-2.5 h-8 border-dashed relative"
        >
          <div className="relative">
            <Medal className="h-4 w-4 text-yellow-500" />
            {/* Notification dot for new achievements */}
            {achievements.some(a => a.isComplete && a.id === recentlyCompletedId) && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </div>
          <span className="text-xs font-medium">Rank {userLevel}</span>
          <span className="text-xs text-muted-foreground">{userPoints} pts</span>
          <ChevronRight className={`h-3 w-3 transition-transform ${showAchievements ? 'rotate-90' : ''}`} />
        </Button>
      </div>
      
      {/* Achievement panel */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 bg-card border rounded-lg shadow-lg z-40 w-80 sm:w-96 overflow-hidden"
          >
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-medium">Achievement System</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowAchievements(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* User level progress */}
            <div className="p-4 bg-muted/50">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    {userLevel < 10 && (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    )}
                    {userLevel >= 10 && userLevel < 20 && (
                      <Award className="h-5 w-5 text-indigo-500" />
                    )}
                    {userLevel >= 20 && (
                      <Crown className="h-5 w-5 text-purple-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      Level {userLevel}
                      <span className="text-xs text-muted-foreground ml-1">({userPoints} Points)</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pointsToNextLevel} points to Level {userLevel + 1}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Rank: {
                    userLevel < 5 ? 'Beginner' : 
                    userLevel < 10 ? 'Intermediate' : 
                    userLevel < 20 ? 'Advanced' : 
                    'Expert'
                  }
                </Badge>
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
            </div>
            
            {/* Category tabs */}
            <div className="flex p-2 gap-1 overflow-x-auto scrollbar-hide bg-muted/30">
              <Badge 
                variant={achievementCategories === 'all' ? 'default' : 'outline'} 
                className="cursor-pointer hover:bg-muted text-xs py-0"
                onClick={() => setAchievementCategories('all')}
              >
                All
              </Badge>
              <Badge 
                variant={achievementCategories === 'design' ? 'default' : 'outline'} 
                className="cursor-pointer hover:bg-muted text-xs py-0"
                onClick={() => setAchievementCategories('design')}
              >
                Design
              </Badge>
              <Badge 
                variant={achievementCategories === 'community' ? 'default' : 'outline'} 
                className="cursor-pointer hover:bg-muted text-xs py-0"
                onClick={() => setAchievementCategories('community')}
              >
                Community
              </Badge>
              <Badge 
                variant={achievementCategories === 'technical' ? 'default' : 'outline'} 
                className="cursor-pointer hover:bg-muted text-xs py-0"
                onClick={() => setAchievementCategories('technical')}
              >
                Technical
              </Badge>
              <Badge 
                variant={achievementCategories === 'innovation' ? 'default' : 'outline'} 
                className="cursor-pointer hover:bg-muted text-xs py-0"
                onClick={() => setAchievementCategories('innovation')}
              >
                Innovation
              </Badge>
            </div>
            
            {/* Achievements list */}
            <div className="max-h-80 overflow-y-auto p-3 space-y-3">
              {filteredAchievements.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No achievements found in this category
                </div>
              )}
              
              {filteredAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={achievement.id === recentlyCompletedId ? { scale: 0.95 } : { scale: 1 }}
                  animate={achievement.id === recentlyCompletedId 
                    ? { scale: [0.95, 1.05, 1], backgroundColor: ['#ffffff', '#f7f9fc', '#ffffff'] } 
                    : {}
                  }
                  transition={{ duration: 0.5 }}
                  className={`relative rounded-lg border p-3 ${achievement.id === recentlyCompletedId ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`h-10 w-10 rounded-md flex items-center justify-center ${getBadgeColor(achievement.level)}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">{achievement.title}</h4>
                        <Badge variant="outline" className={`text-xs ${getBadgeColor(achievement.level)}`}>
                          {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{achievement.description}</p>
                      
                      {/* Progress bar */}
                      {!achievement.isComplete ? (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{achievement.currentPoints} / {achievement.requiredPoints} points</span>
                            <span>{((achievement.currentPoints / achievement.requiredPoints) * 100).toFixed(0)}%</span>
                          </div>
                          <Progress 
                            value={(achievement.currentPoints / achievement.requiredPoints) * 100} 
                            className="h-1.5" 
                          />
                          
                          {/* For demonstration - allows clicking to add progress */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full mt-2 h-7 text-xs"
                            onClick={() => updateAchievementProgress(achievement.id, 10)}
                          >
                            + Progress (Demo)
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 text-xs gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </Badge>
                          <span className="text-xs text-muted-foreground">+{achievement.rewardPoints} points</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* New badge indicator */}
                  {achievement.id === recentlyCompletedId && (
                    <div className="absolute -top-2 -right-2">
                      <motion.div
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: [0, 10, 0], scale: 1 }}
                        transition={{ repeat: 3, duration: 0.3 }}
                      >
                        <BellRing className="h-5 w-5 text-yellow-500" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Call to action */}
            <div className="p-3 border-t">
              <Button variant="outline" size="sm" className="w-full text-xs">
                View All Achievements
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementSystem;