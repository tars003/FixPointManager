import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Car, Palette, Zap, Award, BookOpen, Sparkles, Puzzle, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ArenaWrapper from '@/components/arena/ArenaWrapper';
import EnhancedBackground from '@/components/arena/EnhancedBackground';

const ArenaHome = () => {
  const [_, setLocation] = useLocation();

  const features = [
    {
      title: 'Vehicle Customization',
      description: 'Design your dream vehicle with our 360° interactive customization tool',
      icon: <Car className="h-10 w-10 text-blue-500" />,
      color: 'bg-blue-500/10',
      path: '/arena/vehicle-selection'
    },
    {
      title: 'Custom Wraps',
      description: 'Upload your own designs and apply them to your vehicle',
      icon: <Palette className="h-10 w-10 text-purple-500" />,
      color: 'bg-purple-500/10',
      path: '/arena/vehicle-selection?tab=wraps'
    },
    {
      title: 'Parts Marketplace',
      description: 'Browse and shop for compatible parts with real-time visualization',
      icon: <Puzzle className="h-10 w-10 text-emerald-500" />,
      color: 'bg-emerald-500/10',
      path: '/arena/vehicle-selection?tab=parts'
    },
    {
      title: 'Community Showcase',
      description: 'Share your creations and get inspired by others',
      icon: <Share className="h-10 w-10 text-pink-500" />,
      color: 'bg-pink-500/10',
      path: '/arena/showcase'
    },
    {
      title: 'Rewards System',
      description: 'Earn points and unlock achievements through customization',
      icon: <Award className="h-10 w-10 text-yellow-500" />,
      color: 'bg-yellow-500/10',
      path: '/arena/rewards'
    },
    {
      title: 'Voice Controls',
      description: 'Control the customization interface using voice commands',
      icon: <Zap className="h-10 w-10 text-orange-500" />,
      color: 'bg-orange-500/10',
      path: '/arena/vehicle-selection'
    }
  ];

  return (
    <ArenaWrapper>
      <div className="relative min-h-screen flex flex-col">
        {/* Enhanced background */}
        <div className="absolute inset-0 -z-10">
          <EnhancedBackground 
            type="gradient" 
            primaryColor="#1E40AF" 
            secondaryColor="#0EA5E9"
            animated
            interactive
          />
        </div>
        
        <div className="container mx-auto px-4 py-12 flex-1 flex flex-col">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Arena
            </motion.h1>
            <motion.p 
              className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your immersive, gamified vehicle customization platform with interactive 3D models, custom wraps, and real-time parts marketplace
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)"
                }}
                className="flex"
              >
                <Card className="flex flex-col border border-blue-100 dark:border-blue-900 w-full hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <CardHeader>
                    <div className={`p-3 rounded-md w-fit ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button 
                      onClick={() => setLocation(feature.path)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="text-center mt-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              size="lg" 
              onClick={() => setLocation('/arena/vehicle-selection')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Launch Arena
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Experience the next generation of gamified vehicle customization
            </p>
          </motion.div>
        </div>
      </div>
    </ArenaWrapper>
  );
};

export default ArenaHome;