import { apiRequest } from "@/lib/queryClient";

// Types for feedback and reactions
export interface Reaction {
  emoji: string;
  count: number;
}

export interface FeedbackData {
  contentId: string;
  contentType: 'vehicle' | 'feature' | 'comparison' | 'article' | string;
  emoji?: string;
  text?: string;
  rating?: number;
}

export interface ContentReactions {
  contentId: string;
  reactions: {[emoji: string]: number};
}

// In a real implementation, this would be fetched from the backend
const sampleReactionsData: {[contentId: string]: {[emoji: string]: number}} = {
  'vehicle-12345': {
    '👍': 24,
    '🔥': 12,
    '😊': 8,
    '🤔': 4,
    '👎': 2
  },
  'comparison-123-456': {
    '👍': 15,
    '🔥': 7,
    '😊': 5,
    '🤔': 3,
    '👎': 1
  }
};

// Mock cache for client-side storage
let reactionCache = { ...sampleReactionsData };
let userReactions: {[contentId: string]: string} = {};

/**
 * Fetches reactions for specific content
 */
export const getReactions = async (contentId: string): Promise<{[emoji: string]: number}> => {
  // In a real implementation, this would be an API call
  try {
    // For demo purposes, simulating API call with timeout
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return from cache if available, or empty reactions object
    return reactionCache[contentId] || { "👍": 0, "🔥": 0, "😊": 0, "🤔": 0, "👎": 0 };
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return { "👍": 0, "🔥": 0, "😊": 0, "🤔": 0, "👎": 0 };
  }
};

/**
 * Submits a reaction for specific content
 */
export const submitReaction = async (
  contentId: string, 
  emoji: string,
  contentType: string = 'feature'
): Promise<{[emoji: string]: number}> => {
  try {
    // In a real implementation, this would be an API call
    // await apiRequest('POST', '/api/reactions', { contentId, emoji, contentType });
    
    // Simulate server-side update
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if user already reacted to this content
    const previousEmoji = userReactions[contentId];
    
    // Initialize content in cache if it doesn't exist
    if (!reactionCache[contentId]) {
      reactionCache[contentId] = { "👍": 0, "🔥": 0, "😊": 0, "🤔": 0, "👎": 0 };
    }
    
    // Update reaction counts
    if (previousEmoji && previousEmoji !== emoji) {
      // Decrement previous reaction if there was one
      reactionCache[contentId][previousEmoji] = Math.max(0, (reactionCache[contentId][previousEmoji] || 0) - 1);
    }
    
    if (previousEmoji === emoji) {
      // Toggle reaction off if clicking the same one
      reactionCache[contentId][emoji] = Math.max(0, (reactionCache[contentId][emoji] || 0) - 1);
      delete userReactions[contentId]; // Remove user's reaction
    } else {
      // Add new reaction
      reactionCache[contentId][emoji] = (reactionCache[contentId][emoji] || 0) + 1;
      userReactions[contentId] = emoji; // Track user's reaction
    }
    
    return reactionCache[contentId];
  } catch (error) {
    console.error('Error submitting reaction:', error);
    throw error;
  }
};

/**
 * Submits detailed feedback
 */
export const submitFeedback = async (feedback: FeedbackData): Promise<void> => {
  try {
    // In a real implementation, this would be an API call
    // await apiRequest('POST', '/api/feedback', feedback);
    
    // Simulate server-side processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log('Feedback submitted:', feedback);
    
    // If there's an emoji, also update the reactions
    if (feedback.emoji) {
      await submitReaction(feedback.contentId, feedback.emoji, feedback.contentType);
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

/**
 * Checks if user has already reacted to content
 */
export const getUserReaction = (contentId: string): string | null => {
  return userReactions[contentId] || null;
};

/**
 * Clears user's reaction to specific content
 */
export const clearUserReaction = async (contentId: string): Promise<void> => {
  const previousEmoji = userReactions[contentId];
  
  if (previousEmoji && reactionCache[contentId]) {
    reactionCache[contentId][previousEmoji] = Math.max(0, reactionCache[contentId][previousEmoji] - 1);
    delete userReactions[contentId];
  }
};