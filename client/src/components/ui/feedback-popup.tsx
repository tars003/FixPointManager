import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import EmojiReaction from '@/components/ui/emoji-reaction';

interface FeedbackPopupProps {
  onClose: () => void;
  title?: string;
  contentId?: string;
  contentType?: 'vehicle' | 'feature' | 'comparison' | 'article';
  position?: 'bottom-right' | 'center' | 'bottom-center';
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({
  onClose,
  title = "We'd love your feedback!",
  contentId = 'general',
  contentType = 'feature',
  position = 'bottom-right',
}) => {
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState<'emoji' | 'text' | 'thanks'>('emoji');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Position classes based on position prop
  const positionClasses = {
    'bottom-right': 'fixed bottom-8 right-8',
    'center': 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'bottom-center': 'fixed bottom-8 left-1/2 -translate-x-1/2',
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    // If it's a negative reaction, prompt for text feedback
    if (emoji === '👎' || emoji === '🤔') {
      setTimeout(() => setStep('text'), 500);
    } else {
      // For positive reactions, skip to thank you
      setTimeout(() => setStep('thanks'), 500);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call to send feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('thanks');
      
      // In a real implementation, you would send the feedback to your backend
      console.log('Feedback submitted:', {
        emoji: selectedEmoji,
        text: feedback,
        contentId,
        contentType,
        timestamp: new Date().toISOString(),
      });
    }, 1000);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`${positionClasses[position]} z-50`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border min-w-[320px] max-w-md">
          <div className="flex items-center justify-between p-4 border-b bg-primary/5">
            <div className="flex items-center gap-2">
              {step === 'emoji' && <MessageSquare className="h-5 w-5 text-primary" />}
              {step === 'text' && <MessageSquare className="h-5 w-5 text-primary" />}
              {step === 'thanks' && <ThumbsUp className="h-5 w-5 text-green-500" />}
              <h3 className="font-medium text-sm">
                {step === 'thanks' ? 'Thank you for your feedback!' : title}
              </h3>
            </div>
            <button 
              onClick={onClose} 
              className="rounded-full p-1 hover:bg-neutral-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-4">
            <AnimatePresence mode="wait">
              {step === 'emoji' && (
                <motion.div
                  key="emoji-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm text-neutral-600 mb-4">
                    How would you rate your experience with this feature?
                  </p>
                  <div className="flex justify-center mb-4">
                    <EmojiReaction 
                      size="lg"
                      showCounts={false}
                      title=""
                      onReactionSelect={(emoji) => handleEmojiSelect(emoji)}
                      emojis={["❤️", "👍", "😊", "🤔", "👎"]}
                    />
                  </div>
                </motion.div>
              )}
              
              {step === 'text' && (
                <motion.div
                  key="text-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm text-neutral-600 mb-3">
                    We'd love to hear more about your experience. What could we improve?
                  </p>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts with us..."
                    className="mb-3 min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setStep('emoji')}
                    >
                      Back
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="gap-1"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Feedback'}
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {step === 'thanks' && (
                <motion.div
                  key="thanks-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="mx-auto bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-3"
                  >
                    <ThumbsUp className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <h4 className="font-medium mb-2">Thank you for your feedback!</h4>
                  <p className="text-sm text-neutral-500 mb-3">
                    Your input helps us improve our platform for everyone.
                  </p>
                  <Button size="sm" onClick={onClose}>Close</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackPopup;