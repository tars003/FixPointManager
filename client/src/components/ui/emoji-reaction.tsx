import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmojiReactionProps {
  emojis?: string[];
  onReactionSelect?: (emoji: string) => void;
  selectedEmoji?: string | null;
  showCounts?: boolean;
  counts?: { [key: string]: number };
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const EmojiReaction: React.FC<EmojiReactionProps> = ({
  emojis = ["👍", "❤️", "🎉", "🔥", "👏", "🤔"],
  onReactionSelect,
  selectedEmoji = null,
  showCounts = true,
  counts = {},
  title = "React to this content",
  size = 'md',
  className,
}) => {
  const [selected, setSelected] = useState<string | null>(selectedEmoji);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    setSelected(selectedEmoji);
  }, [selectedEmoji]);
  
  const handleEmojiClick = (emoji: string) => {
    if (selected === emoji) {
      setSelected(null);
    } else {
      setSelected(emoji);
    }
    
    if (onReactionSelect) {
      onReactionSelect(emoji);
    }
    
    setIsOpen(false);
  };
  
  // Dynamic sizing
  const sizeClasses = {
    emoji: {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-4xl',
    },
    container: {
      sm: 'gap-1 p-1',
      md: 'gap-2 p-2',
      lg: 'gap-3 p-3',
    },
    counter: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    tooltip: {
      sm: '-top-6 text-xs py-0.5 px-1.5',
      md: '-top-7 text-sm py-1 px-2',
      lg: '-top-9 text-base py-1.5 px-3',
    }
  };
  
  return (
    <div className={cn("relative", className)}>
      {title && (
        <h4 className="text-sm font-medium mb-2 text-neutral-700">{title}</h4>
      )}
      
      <div className={cn(
        "flex items-center rounded-full",
        sizeClasses.container[size]
      )}>
        {emojis.map((emoji) => (
          <div
            key={emoji}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.button
              className={cn(
                "transition-all duration-200 rounded-full flex items-center justify-center overflow-hidden",
                selected === emoji ? "scale-110 z-10" : "hover:scale-105",
                sizeClasses.emoji[size]
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
              {selected === emoji && (
                <motion.div
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
            
            {showCounts && counts[emoji] && counts[emoji] > 0 && (
              <div className={cn(
                "absolute -bottom-1 -right-1 bg-primary/10 text-primary rounded-full px-1 min-w-[20px] text-center",
                sizeClasses.counter[size]
              )}>
                {counts[emoji]}
              </div>
            )}
            
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 bg-neutral-800 text-white rounded whitespace-nowrap z-50",
                    sizeClasses.tooltip[size]
                  )}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {emoji === "👍" ? "Like" : 
                   emoji === "❤️" ? "Love" :
                   emoji === "🎉" ? "Celebrate" :
                   emoji === "🔥" ? "Fire" :
                   emoji === "👏" ? "Applause" :
                   emoji === "🤔" ? "Thinking" :
                   emoji === "👎" ? "Dislike" :
                   emoji === "😊" ? "Happy" : emoji}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiReaction;