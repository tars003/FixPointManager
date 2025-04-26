import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Star, ThumbsUp, ThumbsDown, Car, Zap, Banknote, Award } from 'lucide-react';

// Define the vehicle recommendation type
interface VehicleRecommendation {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  image: string;
  price: string;
  rating: number;
  highlights: string[];
  matchScore: number;
  category: 'budget' | 'value' | 'luxury' | 'performance';
  features: {
    key: string;
    value: string;
    icon: React.ReactNode;
  }[];
}

interface VehicleRecommendationWidgetProps {
  recommendations: VehicleRecommendation[];
  userPreferences?: {
    budget?: number;
    bodyType?: string;
    fuelType?: string;
    seatingCapacity?: number;
  };
  onViewDetails?: (vehicleId: number) => void;
  className?: string;
}

const VehicleRecommendationWidget: React.FC<VehicleRecommendationWidgetProps> = ({ 
  recommendations, 
  userPreferences,
  onViewDetails,
  className 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [disliked, setDisliked] = useState<Record<number, boolean>>({});
  
  const currentRecommendation = recommendations[currentIndex];
  
  const handleNext = () => {
    if (currentIndex < recommendations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to first
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(recommendations.length - 1); // Loop to last
    }
  };
  
  const handleLike = (id: number) => {
    setLiked(prev => ({ ...prev, [id]: true }));
    setDisliked(prev => ({ ...prev, [id]: false }));
  };
  
  const handleDislike = (id: number) => {
    setLiked(prev => ({ ...prev, [id]: false }));
    setDisliked(prev => ({ ...prev, [id]: true }));
  };
  
  // Get the category icon
  const getCategoryIcon = (category: VehicleRecommendation['category']) => {
    switch (category) {
      case 'budget': return <Banknote className="h-4 w-4" />;
      case 'value': return <ThumbsUp className="h-4 w-4" />;
      case 'luxury': return <Award className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };
  
  // Get the category text
  const getCategoryText = (category: VehicleRecommendation['category']) => {
    switch (category) {
      case 'budget': return 'Budget-Friendly';
      case 'value': return 'Best Value';
      case 'luxury': return 'Luxury Pick';
      case 'performance': return 'Performance';
      default: return '';
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl md:text-2xl">Personalized For You</CardTitle>
            <CardDescription>
              Recommendations based on your preferences and driving habits
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border-primary/20">
            {getCategoryIcon(currentRecommendation.category)}
            <span>{getCategoryText(currentRecommendation.category)}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative overflow-hidden rounded-md mb-4">
          {/* Navigation Controls */}
          <div className="absolute left-2 top-1/2 z-10 transform -translate-y-1/2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md" 
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute right-2 top-1/2 z-10 transform -translate-y-1/2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md" 
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Image with match score */}
          <div className="relative aspect-[16/9] bg-neutral-100 rounded-md overflow-hidden">
            <div 
              className="absolute inset-0 bg-center bg-no-repeat bg-cover"
              style={{ backgroundImage: `url(${currentRecommendation.image})` }}
            />
            
            <div className="absolute top-2 right-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                <span className="text-sm font-medium">Match Score:</span>
                <span className="text-primary font-bold">{currentRecommendation.matchScore}%</span>
              </div>
            </div>
            
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-white font-bold text-xl">{currentRecommendation.name}</h3>
              <p className="text-white/90 text-sm">
                {currentRecommendation.make} {currentRecommendation.model} {currentRecommendation.year}
              </p>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(currentRecommendation.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : i < currentRecommendation.rating
                        ? 'text-yellow-400 fill-yellow-400 opacity-50'
                        : 'text-white/40'
                    }`}
                  />
                ))}
                <span className="ml-1 text-white text-xs">{currentRecommendation.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {/* Vehicle features */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {currentRecommendation.features.map((feature, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 bg-neutral-50 p-3 rounded-md"
              >
                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                  {feature.icon}
                </div>
                <div>
                  <p className="text-xs text-neutral-500">{feature.key}</p>
                  <p className="font-medium text-sm">{feature.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Highlights */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Why this matches you:</h4>
            <ul className="space-y-1">
              {currentRecommendation.highlights.map((highlight, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start text-sm"
                >
                  <span className="text-primary mr-2">•</span>
                  <span>{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-1.5 ${liked[currentRecommendation.id] ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
            onClick={() => handleLike(currentRecommendation.id)}
          >
            <ThumbsUp className="h-4 w-4" />
            Like
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-1.5 ${disliked[currentRecommendation.id] ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
            onClick={() => handleDislike(currentRecommendation.id)}
          >
            <ThumbsDown className="h-4 w-4" />
            Not for me
          </Button>
        </div>
        <Button 
          variant="default" 
          size="sm"
          className="flex items-center gap-1.5"
          onClick={() => onViewDetails?.(currentRecommendation.id)}
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleRecommendationWidget;