import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Video, 
  ArrowRight, 
  Award, 
  Clock, 
  Star, 
  Flag,
  Lightbulb,
  Users,
  MessageCircle,
  Layers,
  Radio,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Trophy,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const EducationalPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('courses');
  const [showHelp, setShowHelp] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [showLess, setShowLess] = useState(false);
  const [achievements, setAchievements] = useState({
    coursesStarted: 2,
    coursesCompleted: 1,
    videosWatched: 5,
    articlesRead: 3,
    quizzesPassed: 1,
    totalPoints: 850
  });
  const [animatePoints, setAnimatePoints] = useState(false);

  // Use ref to track if the component is mounted
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Set up cleanup when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleFeatureClick = () => {
    toast({
      title: "Coming Soon!",
      description: "This feature will be available in the next update.",
      variant: "default"
    });
  };
  
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };
  
  const startQuiz = () => {
    setQuizActive(true);
    setCurrentQuizQuestion(0);
    setQuizAnswers([]);
  };
  
  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    
    if (currentQuizQuestion < 2) {
      // Move to next question
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      // Quiz completed
      const correctAnswers = newAnswers.filter((ans, index) => 
        ans === sampleQuiz.questions[index].correctAnswer
      ).length;
      
      if (correctAnswers >= 2) {
        // User passed the quiz
        setAchievements({
          ...achievements,
          quizzesPassed: achievements.quizzesPassed + 1,
          totalPoints: achievements.totalPoints + 50
        });
        setAnimatePoints(true);
        setTimeout(() => {
          if (isMounted.current) {
            setAnimatePoints(false);
          }
        }, 3000);
        
        toast({
          title: "Quiz Completed!",
          description: `You got ${correctAnswers} out of 3 questions correct! +50 points`,
          variant: "default"
        });
      } else {
        toast({
          title: "Quiz Completed",
          description: `You got ${correctAnswers} out of 3 questions correct. Try again!`,
          variant: "destructive"
        });
      }
      
      // Reset quiz
      setQuizActive(false);
    }
  };

  // Sample quiz data
  const sampleQuiz = {
    title: "Road Safety Quiz",
    description: "Test your knowledge about road safety rules and regulations",
    questions: [
      {
        question: "What should you do when you see a yellow traffic light?",
        options: [
          "Speed up to get through the intersection",
          "Prepare to stop if it's safe to do so", 
          "Always stop immediately",
          "Honk your horn to alert other drivers"
        ],
        correctAnswer: "Prepare to stop if it's safe to do so"
      },
      {
        question: "What does a solid white line between lanes mean?",
        options: [
          "Lane changing is prohibited",
          "Lane changing is allowed with caution",
          "The lane is reserved for emergency vehicles",
          "The lane is for overtaking only"
        ],
        correctAnswer: "Lane changing is prohibited"
      },
      {
        question: "When driving in foggy conditions, you should use:",
        options: [
          "High beam headlights",
          "Hazard lights while driving",
          "Low beam headlights",
          "No lights to avoid reflection"
        ],
        correctAnswer: "Low beam headlights"
      }
    ]
  };

  // List of interactive enhancements as shown in the screenshot
  const interactiveFeatures = [
    {
      title: "Micro-interactions for educational content engagement",
      icon: Sparkles
    },
    {
      title: "Contextual help bubbles with playful animations",
      icon: HelpCircle
    },
    {
      title: "Interactive quiz preview thumbnails",
      icon: FileText
    },
    {
      title: "Gamified achievement system for learning progress",
      icon: Trophy
    },
    {
      title: "Animated route transitions between educational pages",
      icon: ArrowRight
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Achievements badge in top corner */}
      <div className="fixed top-20 right-6 z-30">
        <motion.div 
          className="bg-primary text-primary-foreground shadow-lg rounded-full py-1 px-3 flex items-center font-medium"
          animate={animatePoints ? { 
            scale: [1, 1.2, 1],
            backgroundColor: ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--primary))']
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <Trophy className="w-4 h-4 mr-1" />
          <span>{achievements.totalPoints} pts</span>
        </motion.div>
      </div>

      {/* Help button in corner */}
      <motion.button 
        className="fixed bottom-20 right-20 z-30 bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleHelp}
      >
        <HelpCircle className="h-5 w-5" />
      </motion.button>

      {/* Contextual help overlay */}
      <AnimatePresence>
        {showHelp && (
          <motion.div 
            className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleHelp}
          >
            <motion.div 
              className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full p-6"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">Learning Features</h2>
                <Button variant="ghost" size="icon" onClick={toggleHelp}>
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {interactiveFeatures.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-md bg-slate-50 dark:bg-slate-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="bg-primary/10 text-primary rounded-full p-2">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <span>{feature.title}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button onClick={toggleHelp}>
                  Got It
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz modal */}
      <AnimatePresence>
        {quizActive && (
          <motion.div 
            className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full p-6"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold">{sampleQuiz.title} - Question {currentQuizQuestion + 1}/3</h2>
                <Progress value={(currentQuizQuestion / 3) * 100} className="mt-2" />
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">{sampleQuiz.questions[currentQuizQuestion].question}</h3>
                <div className="space-y-3">
                  {sampleQuiz.questions[currentQuizQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      className="w-full text-left p-4 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuizAnswer(option)}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Educational Resources</h1>
            <p className="text-muted-foreground mt-1">Explore courses, videos, and resources to enhance your knowledge</p>
          </div>
          
          {/* Learning progress card */}
          <motion.div
            className="hidden md:block bg-white dark:bg-slate-900 shadow-md rounded-lg p-3 border min-w-60"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-medium flex items-center gap-1 mb-3">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Learning Progress
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Courses Started</span>
                <span className="font-medium">{achievements.coursesStarted}</span>
              </div>
              <div className="flex justify-between">
                <span>Courses Completed</span>
                <span className="font-medium">{achievements.coursesCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span>Videos Watched</span>
                <span className="font-medium">{achievements.videosWatched}</span>
              </div>
              <div className="flex justify-between">
                <span>Articles Read</span>
                <span className="font-medium">{achievements.articlesRead}</span>
              </div>
              <div className="flex justify-between">
                <span>Quizzes Passed</span>
                <span className="font-medium">{achievements.quizzesPassed}</span>
              </div>
            </div>
          </motion.div>
        </div>
        

        
        {/* Quiz Banner */}
        <motion.div 
          className="mb-6 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-lg p-5 flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          <div>
            <h3 className="text-lg font-bold">Test Your Knowledge</h3>
            <p className="text-muted-foreground">Take a quick quiz to check your understanding of road safety</p>
          </div>
          <Button onClick={startQuiz}>
            Start Quiz
          </Button>
        </motion.div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <CourseCard 
                  key={index}
                  title={course.title}
                  description={course.description}
                  lessons={course.lessons}
                  duration={course.duration}
                  level={course.level}
                  onClick={handleFeatureClick}
                />
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <VideoCard 
                  key={index}
                  title={video.title}
                  thumbnailUrl={video.thumbnailUrl}
                  duration={video.duration}
                  author={video.author}
                  views={video.views}
                  onClick={handleFeatureClick}
                />
              ))}
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <ArticleCard 
                  key={index}
                  title={article.title}
                  description={article.description}
                  readTime={article.readTime}
                  author={article.author}
                  date={article.date}
                  onClick={handleFeatureClick}
                />
              ))}
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ForumCard 
                title="General Discussion"
                description="Discuss general topics about vehicles, driving, and maintenance"
                posts={258}
                lastActive="2 hours ago"
                onClick={handleFeatureClick}
              />
              <ForumCard 
                title="Technical Help"
                description="Get technical help for your vehicle issues from experts"
                posts={152}
                lastActive="30 minutes ago"
                onClick={handleFeatureClick}
              />
              <ForumCard 
                title="New Driver Corner"
                description="A safe space for new drivers to ask questions"
                posts={87}
                lastActive="1 day ago"
                onClick={handleFeatureClick}
              />
              <ForumCard 
                title="Safety Discussions"
                description="Share and learn about road safety tips and best practices"
                posts={124}
                lastActive="4 hours ago"
                onClick={handleFeatureClick}
              />
              <ForumCard 
                title="Vehicle Modifications"
                description="Discuss legal modifications and customizations for your vehicle"
                posts={198}
                lastActive="12 hours ago"
                onClick={handleFeatureClick}
              />
              <ForumCard 
                title="RTO Updates"
                description="Stay updated on the latest RTO rules and policies"
                posts={63}
                lastActive="3 days ago"
                onClick={handleFeatureClick}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Featured Section - Only show for courses tab */}
        {activeTab === 'courses' && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Programs</h2>
              <Button variant="link" onClick={handleFeatureClick}>
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-blue-600 text-white p-6 md:w-2/5 flex flex-col justify-center">
                    <Award className="h-10 w-10 mb-3" />
                    <h3 className="text-xl font-bold mb-2">Certified Defensive Driver</h3>
                    <p className="text-blue-100 text-sm">Get officially certified as a defensive driver and improve your safety on the road</p>
                    <Button variant="outline" className="mt-6 bg-white/10 text-white hover:bg-white/20 border-white/20" onClick={handleFeatureClick}>
                      Enroll Now
                    </Button>
                  </div>
                  <div className="p-6 md:w-3/5">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded mr-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Comprehensive Curriculum</h4>
                          <p className="text-sm text-muted-foreground">12 modules covering all aspects of defensive driving</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded mr-3">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Self-Paced Learning</h4>
                          <p className="text-sm text-muted-foreground">Complete at your own pace within 60 days</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded mr-3">
                          <Award className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Official Certification</h4>
                          <p className="text-sm text-muted-foreground">Recognized certification upon successful completion</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-green-600 text-white p-6 md:w-2/5 flex flex-col justify-center">
                    <Lightbulb className="h-10 w-10 mb-3" />
                    <h3 className="text-xl font-bold mb-2">Vehicle Maintenance Masterclass</h3>
                    <p className="text-green-100 text-sm">Learn essential maintenance skills to keep your vehicle in top condition</p>
                    <Button variant="outline" className="mt-6 bg-white/10 text-white hover:bg-white/20 border-white/20" onClick={handleFeatureClick}>
                      Learn More
                    </Button>
                  </div>
                  <div className="p-6 md:w-3/5">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded mr-3">
                          <Video className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Hands-on Tutorials</h4>
                          <p className="text-sm text-muted-foreground">45+ video tutorials with step-by-step instructions</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded mr-3">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Expert Instructors</h4>
                          <p className="text-sm text-muted-foreground">Learn from certified mechanics and automotive experts</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded mr-3">
                          <Layers className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">All Vehicle Types</h4>
                          <p className="text-sm text-muted-foreground">Covers maintenance for cars, bikes, and commercial vehicles</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Podcast Section - Only show for videos tab */}
        {activeTab === 'videos' && (
          <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6">
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">NEW PODCAST</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Road Masters Podcast</h2>
                <p className="text-muted-foreground mb-4 max-w-xl">
                  Weekly discussions with driving experts, automotive engineers, and safety specialists sharing insights on all things related to vehicles and driving.
                </p>
                <div className="flex gap-3">
                  <Button onClick={handleFeatureClick}>
                    Listen Now
                  </Button>
                  <Button variant="outline" onClick={handleFeatureClick}>
                    See Episodes
                  </Button>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-60 h-60 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Radio className="h-20 w-20 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Section - Only show for articles tab */}
        {activeTab === 'articles' && (
          <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
                <p className="text-muted-foreground mb-4">
                  Get the latest articles, tutorials, and educational resources delivered straight to your inbox.
                </p>
                <div className="flex gap-3">
                  <Button onClick={handleFeatureClick}>
                    Subscribe Now
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <FileText className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Course Card Component
interface CourseCardProps {
  title: string;
  description: string;
  lessons: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, description, lessons, duration, level, onClick }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{lessons} lessons</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <div className={cn(
          "text-xs px-2 py-1 rounded-full",
          level === 'Beginner' && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
          level === 'Intermediate' && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
          level === 'Advanced' && "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
        )}>
          {level}
        </div>
        <Button variant="ghost" size="sm">
          Start Learning
        </Button>
      </CardFooter>
    </Card>
  );
};

// Video Card Component
interface VideoCardProps {
  title: string;
  thumbnailUrl: string;
  duration: string;
  author: string;
  views: string;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, thumbnailUrl, duration, author, views, onClick }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden" onClick={onClick}>
      <div className="relative">
        <div className="aspect-video bg-muted flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
          <Video className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
          {duration}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{author}</span>
          <span>{views} views</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Article Card Component
interface ArticleCardProps {
  title: string;
  description: string;
  readTime: string;
  author: string;
  date: string;
  onClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, description, readTime, author, date, onClick }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex items-center text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {readTime} read • {date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm">By {author}</div>
        <Button variant="ghost" size="sm">
          Read Article
        </Button>
      </CardFooter>
    </Card>
  );
};

// Forum Card Component
interface ForumCardProps {
  title: string;
  description: string;
  posts: number;
  lastActive: string;
  onClick: () => void;
}

const ForumCard: React.FC<ForumCardProps> = ({ title, description, posts, lastActive, onClick }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{title}</CardTitle>
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{posts} posts</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>Active {lastActive}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full">
          Join Discussion
        </Button>
      </CardFooter>
    </Card>
  );
};

// Sample data for courses
const courses = [
  {
    title: 'Defensive Driving Essentials',
    description: 'Learn techniques to prevent accidents and stay safe on the road',
    lessons: 8,
    duration: '4 hours',
    level: 'Beginner' as const
  },
  {
    title: 'Advanced Vehicle Control',
    description: 'Master vehicle handling in various road and weather conditions',
    lessons: 12,
    duration: '6 hours',
    level: 'Intermediate' as const
  },
  {
    title: 'Traffic Rules Masterclass',
    description: 'Comprehensive guide to traffic laws and regulations',
    lessons: 10,
    duration: '5 hours',
    level: 'Beginner' as const
  },
  {
    title: 'DIY Vehicle Maintenance',
    description: 'Learn essential maintenance tasks to keep your vehicle in top condition',
    lessons: 15,
    duration: '8 hours',
    level: 'Intermediate' as const
  },
  {
    title: 'Fuel Efficiency Techniques',
    description: 'Save money and reduce emissions with efficient driving techniques',
    lessons: 6,
    duration: '3 hours',
    level: 'Beginner' as const
  },
  {
    title: 'Emergency Response Training',
    description: 'Know what to do in case of accidents or vehicle emergencies',
    lessons: 9,
    duration: '4.5 hours',
    level: 'Intermediate' as const
  }
];

// Sample data for videos
const videos = [
  {
    title: 'How to Change Your Engine Oil',
    thumbnailUrl: '/video-thumbnail-1.jpg',
    duration: '12:45',
    author: 'MechanicPro',
    views: '45K'
  },
  {
    title: 'Parallel Parking Made Easy',
    thumbnailUrl: '/video-thumbnail-2.jpg',
    duration: '8:20',
    author: 'DrivingTips',
    views: '78K'
  },
  {
    title: 'Understanding Dashboard Warning Lights',
    thumbnailUrl: '/video-thumbnail-3.jpg',
    duration: '15:30',
    author: 'AutoExpert',
    views: '32K'
  },
  {
    title: 'Highway Driving Safety Tips',
    thumbnailUrl: '/video-thumbnail-4.jpg',
    duration: '18:15',
    author: 'SafetyFirst',
    views: '62K'
  },
  {
    title: 'How to Fix a Flat Tire',
    thumbnailUrl: '/video-thumbnail-5.jpg',
    duration: '10:50',
    author: 'RoadHelp',
    views: '94K'
  },
  {
    title: 'Motorcycle Safety Essentials',
    thumbnailUrl: '/video-thumbnail-6.jpg',
    duration: '22:05',
    author: 'BikeRider',
    views: '56K'
  }
];

// Sample data for articles
const articles = [
  {
    title: 'The Future of Electric Vehicles in India',
    description: 'Explore the growing electric vehicle market in India, government initiatives, charging infrastructure development, and predictions for the next decade.',
    readTime: '8 min',
    author: 'Rahul Sharma',
    date: 'Apr 22, 2025'
  },
  {
    title: 'Understanding New Emission Standards',
    description: 'A comprehensive guide to the latest BS-VI emission standards, how they affect vehicle performance, and what you need to know as a vehicle owner.',
    readTime: '6 min',
    author: 'Priya Singh',
    date: 'Apr 18, 2025'
  },
  {
    title: 'Top 10 Fuel-Saving Habits',
    description: 'Simple yet effective habits that can significantly improve your vehicle\'s fuel efficiency and save you money at the pump.',
    readTime: '5 min',
    author: 'Vikram Patel',
    date: 'Apr 15, 2025'
  },
  {
    title: 'Safety Features Every New Car Should Have',
    description: 'Essential safety features to look for when purchasing a new vehicle, from advanced driver assistance systems to passive safety technologies.',
    readTime: '7 min',
    author: 'Anjali Desai',
    date: 'Apr 10, 2025'
  },
  {
    title: 'Monsoon Driving Guide',
    description: 'Expert tips on preparing your vehicle for monsoon season, handling waterlogged roads, and avoiding common monsoon driving hazards.',
    readTime: '6 min',
    author: 'Arjun Reddy',
    date: 'Apr 5, 2025'
  },
  {
    title: 'The Art of Defensive Driving',
    description: 'Learn the principles of defensive driving that can help prevent accidents and keep you and your passengers safe on Indian roads.',
    readTime: '9 min',
    author: 'Neha Kapoor',
    date: 'Apr 1, 2025'
  }
];

export default EducationalPage;