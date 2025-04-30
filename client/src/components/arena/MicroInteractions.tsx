import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Heart, ThumbsUp, Star, Award, Sparkles, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

// Animations for various elements
const hoverScale = {
  scale: 1.05,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  transition: { duration: 0.3 }
};

const tapScale = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.8, 1, 0.8],
  transition: { duration: 3, repeat: Infinity }
};

interface MicroInteractionsProps {
  onItemLike?: (id: string) => void;
  onItemAddToCart?: (id: string) => void;
}

const MicroInteractions: React.FC<MicroInteractionsProps> = ({
  onItemLike,
  onItemAddToCart
}) => {
  const { toast } = useToast();
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [favoriteItems, setFavoriteItems] = useState<Record<string, boolean>>({});
  const [savingItem, setSavingItem] = useState<string | null>(null);
  const interactionContainerRef = useRef<HTMLDivElement | null>(null);
  const buttonControls = useAnimation();
  
  // Demo items that respond to interactions
  const interactiveItems = [
    { id: 'item-1', name: 'Premium Sport Alloy Wheels', price: 24999 },
    { id: 'item-2', name: 'Aerodynamic Carbon Fiber Spoiler', price: 15800 },
    { id: 'item-3', name: 'LED Ambient Interior Lighting Kit', price: 6499 }
  ];

  // Trigger achievements when certain interactions occur
  useEffect(() => {
    const likedCount = Object.values(likedItems).filter(liked => liked).length;
    
    if (likedCount === 1) {
      triggerAchievement('First Like', 'You liked your first customization item!');
    } else if (likedCount === 3) {
      triggerAchievement('Like Master', 'You liked all customization items!', true);
    }
  }, [likedItems]);

  const handleLike = (itemId: string) => {
    setLikedItems(prev => {
      const isLiked = !prev[itemId];
      
      if (isLiked && onItemLike) {
        onItemLike(itemId);
      }
      
      toast({
        title: isLiked ? "Added to Favorites" : "Removed from Favorites",
        description: isLiked ? "This item has been added to your favorites." : "This item has been removed from your favorites."
      });
      
      return { ...prev, [itemId]: isLiked };
    });
  };

  const handleFavorite = (itemId: string) => {
    setFavoriteItems(prev => {
      const isFavorite = !prev[itemId];
      
      toast({
        title: isFavorite ? "Added to Collection" : "Removed from Collection",
        description: isFavorite ? "This item has been added to your collection." : "This item has been removed from your collection."
      });
      
      return { ...prev, [itemId]: isFavorite };
    });
  };

  const triggerAchievement = (title: string, description: string, showConfetti: boolean = false) => {
    if (showConfetti && interactionContainerRef.current) {
      const rect = interactionContainerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { 
          x: centerX / window.innerWidth, 
          y: centerY / window.innerHeight 
        }
      });
    }
    
    toast({
      title: `🏆 Achievement Unlocked: ${title}`,
      description: description,
      variant: "default"
    });
  };

  const handleAddToCart = (itemId: string, itemName: string) => {
    // Animate the button
    buttonControls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.3 }
    });
    
    // Set saving state to show loading animation
    setSavingItem(itemId);
    
    // Simulate network request
    setTimeout(() => {
      setSavingItem(null);
      
      if (onItemAddToCart) {
        onItemAddToCart(itemId);
      }
      
      toast({
        title: "Added to Cart",
        description: `${itemName} has been added to your cart.`
      });
    }, 800);
  };

  // Format price to Indian Rupee
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div ref={interactionContainerRef} className="space-y-4">
      <h3 className="text-lg font-semibold">Interactive Elements</h3>
      <p className="text-sm text-muted-foreground">
        Interact with these customization items to experience micro-interactions.
      </p>
      
      <div className="space-y-4 mt-4">
        {interactiveItems.map((item) => (
          <motion.div
            key={item.id}
            className="border rounded-lg p-4 bg-card relative overflow-hidden"
            whileHover={hoverScale}
            whileTap={tapScale}
            layoutId={item.id}
          >
            <AnimatePresence>
              {favoriteItems[item.id] && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-3 right-3"
                >
                  <Award className="h-6 w-6 text-amber-500 fill-amber-500" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center justify-between">
              <motion.h4 
                className="font-medium text-base"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {item.name}
              </motion.h4>
              
              <motion.div
                animate={pulseAnimation}
                className="text-lg font-bold text-primary"
              >
                {formatPrice(item.price)}
              </motion.div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleLike(item.id)}
                        className="relative"
                      >
                        <AnimatePresence>
                          {likedItems[item.id] ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Heart className="h-5 w-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{likedItems[item.id] ? 'Remove from favorites' : 'Add to favorites'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleFavorite(item.id)}
                      >
                        <AnimatePresence>
                          {favoriteItems[item.id] ? (
                            <motion.div
                              initial={{ rotate: -30, scale: 0 }}
                              animate={{ rotate: 0, scale: 1 }}
                              exit={{ rotate: 30, scale: 0 }}
                            >
                              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Star className="h-5 w-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{favoriteItems[item.id] ? 'Remove from collection' : 'Add to collection'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <motion.div animate={buttonControls}>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleAddToCart(item.id, item.name)}
                  disabled={savingItem === item.id}
                  className="relative overflow-hidden"
                >
                  {savingItem === item.id ? (
                    <div className="flex items-center space-x-1">
                      <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </div>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Add to Cart
                    </>
                  )}
                  
                  <AnimatePresence>
                    {!savingItem && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: '100%', opacity: 0.3 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                      />
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="border rounded-lg p-4 mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 flex items-center justify-between"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        <div className="flex items-center">
          <Sparkles className="h-6 w-6 text-amber-500 mr-3" />
          <div>
            <h4 className="font-medium">Interact with Items</h4>
            <p className="text-sm text-muted-foreground">Like and collect items to unlock achievements!</p>
          </div>
        </div>
        
        <ThumbsUp className="h-5 w-5 text-blue-500" />
      </motion.div>
    </div>
  );
};

export default MicroInteractions;