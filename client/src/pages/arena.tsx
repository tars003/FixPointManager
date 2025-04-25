import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Car, Palette, Zap, Award, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ArenaWrapper from '@/components/arena/ArenaWrapper';
import EnhancedBackground from '@/components/arena/EnhancedBackground';

const Arena = () => {
  const [_, setLocation] = useLocation();

  const features = [
    {
      title: 'Vehicle Customization',
      description: 'Personalize your vehicles with advanced 3D customization',
      icon: <Car className="h-10 w-10 text-blue-500" />,
      color: 'bg-blue-500/10',
      path: '/arena-main'
    },
    {
      title: 'Real-time Collaboration',
      description: 'Work together with friends on design projects',
      icon: <Palette className="h-10 w-10 text-purple-500" />,
      color: 'bg-purple-500/10',
      path: '/arena-dashboard-enhanced'
    },
    {
      title: 'Achievement System',
      description: 'Earn points and unlock achievements as you create',
      icon: <Award className="h-10 w-10 text-yellow-500" />,
      color: 'bg-yellow-500/10',
      path: '/arena-dashboard-new'
    },
    {
      title: 'Learning Resources',
      description: 'Access tutorials and guides to improve your skills',
      icon: <BookOpen className="h-10 w-10 text-green-500" />,
      color: 'bg-green-500/10',
      path: '/arena-main?tab=learn'
    },
    {
      title: 'Voice Commands',
      description: 'Control the interface using your voice',
      icon: <Zap className="h-10 w-10 text-orange-500" />,
      color: 'bg-orange-500/10',
      path: '/arena-main'
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
              Your comprehensive vehicle customization platform with interactive 3D models, collaborative design tools, and gamification
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
              onClick={() => setLocation('/arena-main')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8"
            >
              Launch Arena
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Experience the next generation of vehicle customization
            </p>
          </motion.div>
        </div>
      </div>
    </ArenaWrapper>
  );
};

export default Arena;