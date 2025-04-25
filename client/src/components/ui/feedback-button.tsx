import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import useFeedback from '@/hooks/use-feedback';
import FeedbackPopup from './feedback-popup';

interface FeedbackButtonProps {
  contentId?: string;
  contentType?: string;
  position?: 'bottom-right' | 'bottom-left';
  variant?: 'icon' | 'text' | 'pill';
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  contentId = 'general',
  contentType = 'feature',
  position = 'bottom-right',
  variant = 'pill',
}) => {
  const { showFeedbackPopup, openFeedbackPopup, closeFeedbackPopup } = useFeedback();
  
  const positionClasses = {
    'bottom-right': 'fixed bottom-8 right-8',
    'bottom-left': 'fixed bottom-8 left-8',
  };
  
  const handleOpenFeedback = () => {
    openFeedbackPopup(contentId, contentType);
  };
  
  // Different button variants
  const renderButton = () => {
    switch (variant) {
      case 'icon':
        return (
          <motion.button
            className="bg-primary text-white rounded-full p-3 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenFeedback}
          >
            <MessageSquare className="h-5 w-5" />
          </motion.button>
        );
      
      case 'text':
        return (
          <motion.button
            className="bg-primary text-white rounded-md px-4 py-2 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenFeedback}
          >
            Send Feedback
          </motion.button>
        );
      
      case 'pill':
      default:
        return (
          <motion.button
            className="bg-white border border-neutral-200 hover:border-primary/30 text-primary rounded-full px-4 py-2 shadow-md hover:shadow-lg flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenFeedback}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium text-sm">Feedback</span>
          </motion.button>
        );
    }
  };

  return (
    <>
      <div className={positionClasses[position]}>
        {renderButton()}
      </div>
      
      {/* Feedback Popup Portal */}
      <AnimatePresence>
        {showFeedbackPopup && (
          <FeedbackPopup 
            onClose={closeFeedbackPopup}
            contentId={contentId}
            contentType={contentType as any}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackButton;