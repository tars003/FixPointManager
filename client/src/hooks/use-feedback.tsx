import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FeedbackData, submitFeedback, submitReaction, getReactions, getUserReaction } from '@/lib/feedback-service';

interface FeedbackContextType {
  // For the floating feedback button and popup
  showFeedbackPopup: boolean;
  openFeedbackPopup: (contentId?: string, contentType?: string) => void;
  closeFeedbackPopup: () => void;
  
  // For inline emoji reactions
  submitReaction: (contentId: string, emoji: string, contentType?: string) => Promise<{[emoji: string]: number}>;
  getReactions: (contentId: string) => Promise<{[emoji: string]: number}>;
  getUserReaction: (contentId: string) => string | null;
  
  // For detailed feedback
  submitFeedback: (feedback: FeedbackData) => Promise<void>;
  
  // Current feedback context
  currentContentId: string;
  currentContentType: string;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [currentContentId, setCurrentContentId] = useState('general');
  const [currentContentType, setCurrentContentType] = useState('feature');

  const openFeedbackPopup = (contentId: string = 'general', contentType: string = 'feature') => {
    setCurrentContentId(contentId);
    setCurrentContentType(contentType);
    setShowFeedbackPopup(true);
  };

  const closeFeedbackPopup = () => {
    setShowFeedbackPopup(false);
  };

  return (
    <FeedbackContext.Provider
      value={{
        showFeedbackPopup,
        openFeedbackPopup,
        closeFeedbackPopup,
        submitReaction,
        getReactions,
        getUserReaction,
        submitFeedback,
        currentContentId,
        currentContentType,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  
  return context;
};

export default useFeedback;