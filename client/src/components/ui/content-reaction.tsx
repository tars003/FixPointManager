import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ThumbsUp, ThumbsDown, Flame, XCircle } from 'lucide-react';
import { useFeedback } from '@/hooks/use-feedback';
import { cn } from '@/lib/utils';

interface ContentReactionProps {
  contentId: string;
  contentType?: string;
  variant?: 'minimal' | 'standard' | 'text';
  showCount?: boolean;
  className?: string;
  enableComments?: boolean;
}

const ContentReaction: React.FC<ContentReactionProps> = ({
  contentId,
  contentType = 'article',
  variant = 'standard',
  showCount = true,
  className,
  enableComments = false,
}) => {
  const { submitReaction, getReactions, getUserReaction, openFeedbackPopup } = useFeedback();
  const [reactions, setReactions] = useState<{[emoji: string]: number}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [reactionSent, setReactionSent] = useState(false);
  const [userEmoji, setUserEmoji] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const data = await getReactions(contentId);
        setReactions(data);
        
        // Check if user already reacted
        const userReaction = getUserReaction(contentId);
        setUserEmoji(userReaction);
      } catch (error) {
        console.error('Failed to fetch reactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReactions();
  }, [contentId, getReactions, getUserReaction]);
  
  const handleReaction = async (emoji: string) => {
    try {
      const updatedReactions = await submitReaction(contentId, emoji, contentType);
      setReactions(updatedReactions);
      
      // Toggle user's reaction
      if (userEmoji === emoji) {
        setUserEmoji(null);
      } else {
        setUserEmoji(emoji);
      }
      
      // Show confirmation animation
      setReactionSent(true);
      setTimeout(() => setReactionSent(false), 1500);
    } catch (error) {
      console.error('Failed to submit reaction:', error);
    }
  };
  
  const handleCommentClick = () => {
    openFeedbackPopup(contentId, contentType);
  };
  
  // Get the total reactions count
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
  
  // Different UI based on variant prop
  const renderReactions = () => {
    const reactionButtons = [
      { emoji: '👍', icon: ThumbsUp, label: 'Like', color: 'text-blue-500' },
      { emoji: '❤️', icon: Heart, label: 'Love', color: 'text-rose-500' },
      { emoji: '🔥', icon: Flame, label: 'Fire', color: 'text-orange-500' },
      variant === 'standard' ? { emoji: '👎', icon: ThumbsDown, label: 'Dislike', color: 'text-neutral-500' } : null,
    ].filter(Boolean);
    
    // Minimal variant - just icons
    if (variant === 'minimal') {
      return (
        <div className="flex items-center gap-1">
          {reactionButtons.map((button) => (
            button && (
              <motion.button
                key={button.emoji}
                className={cn(
                  "p-1 rounded-full",
                  userEmoji === button.emoji ? button.color : "text-neutral-400 hover:text-neutral-500"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReaction(button.emoji)}
              >
                <button.icon className="h-4 w-4" />
              </motion.button>
            )
          ))}
          
          {showCount && totalReactions > 0 && (
            <span className="text-xs text-neutral-500 ml-1">
              {totalReactions}
            </span>
          )}
        </div>
      );
    }
    
    // Text variant - text buttons
    if (variant === 'text') {
      return (
        <div className="flex items-center gap-3">
          {reactionButtons.map((button) => (
            button && (
              <motion.button
                key={button.emoji}
                className={cn(
                  "flex items-center gap-1 text-sm",
                  userEmoji === button.emoji 
                    ? cn("font-medium", button.color) 
                    : "text-neutral-500 hover:text-neutral-700"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReaction(button.emoji)}
              >
                <button.icon className="h-3.5 w-3.5" />
                <span>{button.label}</span>
                {showCount && reactions[button.emoji] > 0 && (
                  <span className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded-full">
                    {reactions[button.emoji]}
                  </span>
                )}
              </motion.button>
            )
          ))}
        </div>
      );
    }
    
    // Standard variant - buttons with counts
    return (
      <div className="flex items-center gap-2">
        {reactionButtons.map((button) => (
          button && (
            <motion.button
              key={button.emoji}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full border",
                userEmoji === button.emoji 
                  ? cn("border-primary/30 bg-primary/5", button.color) 
                  : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleReaction(button.emoji)}
            >
              <button.icon className="h-3.5 w-3.5" />
              <span className="text-xs">{button.label}</span>
              {showCount && reactions[button.emoji] > 0 && (
                <span className="text-xs bg-white px-1 py-0.5 rounded-full">
                  {reactions[button.emoji]}
                </span>
              )}
            </motion.button>
          )
        ))}
        
        {enableComments && (
          <motion.button
            className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-neutral-200 hover:border-neutral-300 text-neutral-600"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCommentClick}
          >
            <XCircle className="h-3.5 w-3.5" />
            <span className="text-xs">Feedback</span>
          </motion.button>
        )}
      </div>
    );
  };

  return (
    <div className={cn("relative", className)}>
      {isLoading ? (
        <div className="h-8 w-24 bg-neutral-100 animate-pulse rounded-full"></div>
      ) : (
        renderReactions()
      )}
      
      {/* Reaction sent animation */}
      <AnimatePresence>
        {reactionSent && (
          <motion.div
            className="absolute -top-10 left-0 right-0 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              Thanks for your feedback!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentReaction;