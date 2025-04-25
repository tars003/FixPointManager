import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Bookmark, 
  Share2, 
  Lightbulb, 
  ExternalLink,
  Info,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface InspirationItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  author?: string;
  authorAvatar?: string;
  createdAt: string;
}

interface InspirationCarouselProps {
  onSelectInspiration?: (item: InspirationItem) => void;
  onLike?: (id: string, isLiked: boolean) => void;
  onSave?: (id: string, isSaved: boolean) => void;
}

const InspirationCarousel: React.FC<InspirationCarouselProps> = ({
  onSelectInspiration,
  onLike,
  onSave
}) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Example inspiration data
  const [inspirationItems, setInspirationItems] = useState<InspirationItem[]>([
    {
      id: 'insp1',
      title: 'Matte Black Sport Edition',
      description: 'Sleek matte black wrap with red accent lines for a sporty, aggressive look. Great for modern sports cars and sedans.',
      image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWF0dGUlMjBibGFjayUyMGNhcnxlbnwwfHwwfHx8MA%3D%3D',
      category: 'Wraps & Paint',
      tags: ['matte', 'sports', 'black', 'urban'],
      likes: 234,
      isLiked: false,
      isSaved: false,
      author: 'CarDesign Pro',
      authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      createdAt: '2025-03-15'
    },
    {
      id: 'insp2',
      title: 'Sunset Gradient Wrap',
      description: 'Stunning gradient effect transitioning from orange to purple. Inspired by sunset colors - makes your vehicle stand out dramatically.',
      image: 'https://images.unsplash.com/photo-1600259828526-77f8617cebd7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'Wraps & Paint',
      tags: ['gradient', 'colorful', 'premium', 'artistic'],
      likes: 189,
      isLiked: true,
      isSaved: true,
      author: 'ColorMaster',
      authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      createdAt: '2025-03-22'
    },
    {
      id: 'insp3',
      title: 'Carbon Fiber Accents',
      description: 'Carbon fiber hood, mirrors, and spoiler with metallic blue body. Creates a premium sports look with practical weight benefits.',
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcmJvbiUyMGZpYmVyJTIwY2FyfGVufDB8fDB8fHww',
      category: 'Parts & Accessories',
      tags: ['carbon fiber', 'performance', 'racing', 'lightweight'],
      likes: 152,
      isLiked: false,
      isSaved: false,
      author: 'RacingEdge',
      authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      createdAt: '2025-04-01'
    },
    {
      id: 'insp4',
      title: 'Minimalist White with Custom Rims',
      description: 'Clean pearl white finish with custom black and gold rims. The epitome of elegant simplicity with a touch of luxury.',
      image: 'https://images.unsplash.com/photo-1547245324-d777fcce7174?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'Full Custom',
      tags: ['white', 'minimal', 'luxury', 'rims'],
      likes: 210,
      isLiked: false,
      isSaved: true,
      author: 'MinimalistMods',
      authorAvatar: 'https://randomuser.me/api/portraits/women/29.jpg',
      createdAt: '2025-04-10'
    },
    {
      id: 'insp5',
      title: 'Rally-Inspired Off-Road Package',
      description: 'Complete off-road transformation with lifted suspension, all-terrain tires, and protective underbody. Rally inspired custom paint job.',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'Off-Road',
      tags: ['rally', 'off-road', 'lifted', 'adventure'],
      likes: 178,
      isLiked: false,
      isSaved: false,
      author: 'OffroadKing',
      authorAvatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      createdAt: '2025-04-18'
    }
  ]);
  
  // Auto-advance carousel
  useEffect(() => {
    // Start auto-advancing
    if (!isExpanded) {
      intervalRef.current = setInterval(() => {
        setDirection('right');
        setCurrentIndex((prevIndex) => (prevIndex + 1) % inspirationItems.length);
      }, 6000);
    }
    
    // Cleanup interval
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [inspirationItems.length, isExpanded]);
  
  // Reset interval when manually changing slides
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      
      if (!isExpanded) {
        intervalRef.current = setInterval(() => {
          setDirection('right');
          setCurrentIndex((prevIndex) => (prevIndex + 1) % inspirationItems.length);
        }, 6000);
      }
    }
  };
  
  // Go to previous slide
  const prevSlide = () => {
    setDirection('left');
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? inspirationItems.length - 1 : prevIndex - 1
    );
    resetInterval();
  };
  
  // Go to next slide
  const nextSlide = () => {
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % inspirationItems.length);
    resetInterval();
  };
  
  // Go to specific slide
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
    resetInterval();
  };
  
  // Toggle like status
  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    setInspirationItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 } 
          : item
      )
    );
    
    const item = inspirationItems.find(item => item.id === id);
    if (item && onLike) {
      onLike(id, !item.isLiked);
    }
    
    toast({
      title: `Design ${!item?.isLiked ? 'liked' : 'unliked'}`,
      description: !item?.isLiked 
        ? "This design has been added to your likes"
        : "This design has been removed from your likes",
    });
  };
  
  // Toggle save status
  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    setInspirationItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, isSaved: !item.isSaved } 
          : item
      )
    );
    
    const item = inspirationItems.find(item => item.id === id);
    if (item && onSave) {
      onSave(id, !item.isSaved);
    }
    
    toast({
      title: `Design ${!item?.isSaved ? 'saved' : 'unsaved'}`,
      description: !item?.isSaved 
        ? "This design has been saved to your collection"
        : "This design has been removed from your collection",
    });
  };
  
  // View inspiration details
  const viewInspiration = (item: InspirationItem) => {
    if (onSelectInspiration) {
      onSelectInspiration(item);
    }
    
    toast({
      title: "Inspiration selected",
      description: `You've selected "${item.title}" as inspiration`,
    });
  };
  
  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Animation variants for slides
  const slideVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -500 : 500,
      opacity: 0
    })
  };
  
  // Current item
  const currentItem = inspirationItems[currentIndex];
  
  return (
    <div 
      ref={carouselRef} 
      className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
        isExpanded ? 'h-[500px]' : 'h-[280px]'
      }`}
    >
      {/* Title bar */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          <h3 className="font-medium text-white">Design Inspiration</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 bg-black/20 text-white hover:bg-black/40 hover:text-white"
            onClick={toggleExpanded}
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <Info className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Main carousel */}
      <div className="h-full w-full relative">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div 
              className="h-full w-full bg-cover bg-center cursor-pointer"
              style={{ backgroundImage: `url(${currentItem.image})` }}
              onClick={() => viewInspiration(currentItem)}
            >
              {/* Content overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent px-4 py-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">{currentItem.title}</h3>
                      <Badge variant="outline" className="mt-1 bg-primary/20 text-white border-primary/30 text-xs">
                        {currentItem.category}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${currentItem.isLiked ? 'text-red-500 hover:text-red-600' : 'text-white hover:text-white/80'}`}
                        onClick={(e) => toggleLike(e, currentItem.id)}
                      >
                        <Heart className={`h-5 w-5 ${currentItem.isLiked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${currentItem.isSaved ? 'text-yellow-500 hover:text-yellow-600' : 'text-white hover:text-white/80'}`}
                        onClick={(e) => toggleSave(e, currentItem.id)}
                      >
                        <Bookmark className={`h-5 w-5 ${currentItem.isSaved ? 'fill-current' : ''}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-white hover:text-white/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast({
                            title: "Design shared",
                            description: "Link copied to clipboard"
                          });
                        }}
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Description - only visible when expanded */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                      >
                        <p className="text-white/90 text-sm">{currentItem.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {currentItem.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-white/70 border-white/20">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-2">
                            {currentItem.authorAvatar && (
                              <div className="h-6 w-6 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${currentItem.authorAvatar})` }} />
                            )}
                            <span className="text-xs text-white/70">
                              By {currentItem.author || 'Unknown'} • {currentItem.createdAt}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5 text-red-500" />
                            <span className="text-xs text-white/70">{currentItem.likes}</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => viewInspiration(currentItem)}
                        >
                          <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                          <span>Use This Design</span>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation arrows */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 z-10"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 z-10"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        
        {/* Dots indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
          {inspirationItems.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-6 bg-white' 
                  : 'w-1.5 bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspirationCarousel;