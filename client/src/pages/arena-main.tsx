import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Car, 
  PaintBucket, 
  Hammer, 
  Award, 
  Mic, 
  Upload, 
  Play 
} from 'lucide-react';
import ArenaWrapper from '@/components/arena/ArenaWrapper';

// Feature cards for Arena home page
const featureCards = [
  {
    id: 'vehicle-customization',
    title: 'Vehicle Customization',
    description: 'Design your dream vehicle with our 360° interactive customization tool.',
    icon: <Car className="h-8 w-8 text-blue-500" />,
    color: 'bg-blue-50',
    borderColor: 'border-blue-100',
    iconBg: 'bg-blue-100',
    route: '/arena-studio'
  },
  {
    id: 'premium-features',
    title: 'Premium Features',
    description: 'Experience our enhanced customization tools with personalized recommendations.',
    icon: <Award className="h-8 w-8 text-amber-500" />,
    color: 'bg-amber-50',
    borderColor: 'border-amber-100',
    iconBg: 'bg-amber-100',
    route: '/enhanced-arena-features',
    badge: 'NEW'
  },
  {
    id: 'custom-wraps',
    title: 'Custom Wraps',
    description: 'Upload your own designs and apply them to your vehicle.',
    icon: <PaintBucket className="h-8 w-8 text-purple-500" />,
    color: 'bg-purple-50',
    borderColor: 'border-purple-100',
    iconBg: 'bg-purple-100',
    route: '/arena-studio'
  },
  {
    id: 'parts-marketplace',
    title: 'Parts Marketplace',
    description: 'Browse and shop for compatible parts with real-time visualization.',
    icon: <Hammer className="h-8 w-8 text-green-500" />,
    color: 'bg-green-50',
    borderColor: 'border-green-100',
    iconBg: 'bg-green-100',
    route: '/arena-studio'
  },
  {
    id: 'community-showcase',
    title: 'Community Showcase',
    description: 'Share your creations and get inspired by others.',
    icon: <Upload className="h-8 w-8 text-pink-500" />,
    color: 'bg-pink-50',
    borderColor: 'border-pink-100',
    iconBg: 'bg-pink-100',
    route: '/arena-studio'
  },
  {
    id: 'rewards-system',
    title: 'Rewards System',
    description: 'Earn points and unlock achievements through customization.',
    icon: <Award className="h-8 w-8 text-amber-500" />,
    color: 'bg-amber-50',
    borderColor: 'border-amber-100',
    iconBg: 'bg-amber-100',
    route: '/arena-studio'
  },
  {
    id: 'voice-controls',
    title: 'Voice Controls',
    description: 'Control the customization interface using voice commands.',
    icon: <Mic className="h-8 w-8 text-orange-500" />,
    color: 'bg-orange-50',
    borderColor: 'border-orange-100',
    iconBg: 'bg-orange-100',
    route: '/arena-studio'
  }
];

const ArenaMain: React.FC = () => {
  const [, setLocation] = useLocation();

  const handleExploreClick = (route: string) => {
    setLocation(route);
  };
  
  const handleLaunchArena = () => {
    setLocation('/arena-studio');
  };

  return (
    <ArenaWrapper>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">Arena</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your immersive, gamified vehicle customization platform with interactive 3D
            models, custom wraps, and real-time parts marketplace
          </p>
        </motion.div>
        
        {/* Feature Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.5,
            staggerChildren: 0.1,
            delayChildren: 0.2
          }}
        >
          {featureCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.3
              }}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
            >
              <Card className={`border ${card.borderColor} h-full flex flex-col relative`}>
                {card.badge && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {card.badge}
                  </div>
                )}
                <CardContent className="pt-6 flex-grow">
                  <div className={`rounded-full ${card.iconBg} p-3 w-16 h-16 flex items-center justify-center mb-4`}>
                    {card.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{card.title}</CardTitle>
                  <p className="text-muted-foreground">{card.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleExploreClick(card.route)}
                  >
                    Explore
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Launch Arena Button */}
        <div className="flex justify-center">
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 font-bold text-lg px-8"
            onClick={handleLaunchArena}
          >
            <Play className="mr-2 h-5 w-5" /> Launch Arena
          </Button>
        </div>
      </div>
    </ArenaWrapper>
  );
};

export default ArenaMain;