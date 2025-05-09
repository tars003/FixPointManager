import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Info, HelpCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

// Define tutorial step interfaces
interface TutorialStep {
  id: string;
  title: string;
  content: string;
  targetElementId?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  mascotState?: 'happy' | 'thinking' | 'pointing' | 'celebrating';
  emoji?: string;
}

interface TutorialFeedback {
  helpful: boolean | null;
  comment?: string;
}

interface InteractiveMascotGuideProps {
  tutorialId: string;
  steps: TutorialStep[];
  onComplete?: (feedback: TutorialFeedback) => void;
  autoStart?: boolean;
  delay?: number;
  showOnlyOnce?: boolean;
  mascotName?: string;
}

const InteractiveMascotGuide: React.FC<InteractiveMascotGuideProps> = ({
  tutorialId,
  steps,
  onComplete,
  autoStart = false,
  delay = 1000,
  showOnlyOnce = true,
  mascotName = 'Fixi'
}) => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<TutorialFeedback>({ helpful: null });
  const [isMascotMinimized, setIsMascotMinimized] = useState(false);
  const [hasTutorialRun, setHasTutorialRun] = useState(false);
  
  const currentStep = steps[currentStepIndex];
  
  // Check if tutorial has been completed before
  useEffect(() => {
    const completedTutorials = JSON.parse(localStorage.getItem('completedTutorials') || '{}');
    const hasCompleted = completedTutorials[tutorialId];
    
    if (autoStart && !hasCompleted) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
    
    if (hasCompleted && showOnlyOnce) {
      setHasTutorialRun(true);
    }
  }, [autoStart, delay, tutorialId, showOnlyOnce]);
  
  // Handle completing the tutorial
  const handleCompleteTutorial = () => {
    if (showOnlyOnce) {
      const completedTutorials = JSON.parse(localStorage.getItem('completedTutorials') || '{}');
      completedTutorials[tutorialId] = true;
      localStorage.setItem('completedTutorials', JSON.stringify(completedTutorials));
      setHasTutorialRun(true);
    }
    
    setIsVisible(false);
    
    if (onComplete) {
      onComplete(feedback);
    }
    
    toast({
      title: 'Tutorial Completed',
      description: `You've completed the ${tutorialId} tutorial!`,
    });
    
    // Show feedback modal
    setIsModalOpen(true);
  };
  
  const handleStartTutorial = () => {
    setCurrentStepIndex(0);
    setIsVisible(true);
    setIsMascotMinimized(false);
  };
  
  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleCompleteTutorial();
    }
  };
  
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const handleSkipTutorial = () => {
    setIsVisible(false);
    toast({
      title: 'Tutorial Skipped',
      description: `You can restart the tutorial anytime by clicking the help icon.`,
    });
  };
  
  const handleMinimize = () => {
    setIsMascotMinimized(!isMascotMinimized);
  };
  
  // Generate mascot facial expression based on state
  const getMascotFace = (state: string = 'happy') => {
    switch (state) {
      case 'happy':
        return '😊';
      case 'thinking':
        return '🤔';
      case 'pointing':
        return '👉';
      case 'celebrating':
        return '🎉';
      default:
        return '😊';
    }
  };
  
  // If tutorial has already run and showOnlyOnce is true, render just the help button
  if (hasTutorialRun && showOnlyOnce) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="h-10 w-10 rounded-full p-0 bg-blue-600 hover:bg-blue-700">
              <HelpCircle className="h-5 w-5 text-white" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-3" align="end">
            <div className="space-y-2">
              <h4 className="font-medium">Need help?</h4>
              <p className="text-sm text-gray-500">You've already completed this tutorial. Would you like to view it again?</p>
              <Button 
                className="w-full" 
                size="sm"
                onClick={() => {
                  setHasTutorialRun(false);
                  handleStartTutorial();
                }}
              >
                Restart Tutorial
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
  
  return (
    <>
      {/* Mascot and Tutorial Content */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`fixed z-50 ${
              isMascotMinimized ? 'bottom-4 right-4' : 'bottom-4 right-4 md:right-8'
            }`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Minimized State */}
            {isMascotMinimized ? (
              <Button
                className="h-14 w-14 rounded-full p-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600"
                onClick={handleMinimize}
              >
                <span className="text-2xl">{getMascotFace(currentStep.mascotState)}</span>
              </Button>
            ) : (
              /* Full Mascot Tutorial Display */
              <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-xs md:max-w-sm">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMascotFace(currentStep.mascotState)}</span>
                      <h3 className="font-medium">{mascotName} - Your Guide</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 text-white"
                        onClick={handleMinimize}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 text-white"
                        onClick={handleSkipTutorial}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Body */}
                <div className="p-4">
                  <h4 className="font-semibold mb-2">{currentStep.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{currentStep.content}</p>
                  
                  {/* Step progress bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Step {currentStepIndex + 1} of {steps.length}</span>
                      <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete</span>
                    </div>
                    <Progress value={((currentStepIndex + 1) / steps.length) * 100} className="h-1" />
                  </div>
                  
                  {/* Navigation buttons */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevStep}
                      disabled={currentStepIndex === 0}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Back
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={handleNextStep}
                    >
                      {currentStepIndex === steps.length - 1 ? (
                        <>
                          Finish
                          <Check className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tutorial Completion Feedback Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>How was your experience?</DialogTitle>
            <DialogDescription>
              Your feedback helps us improve our tutorials
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex justify-center gap-4">
              <Button
                variant={feedback.helpful === true ? "default" : "outline"}
                className={`flex-1 ${
                  feedback.helpful === true ? "bg-green-600 hover:bg-green-700" : ""
                }`}
                onClick={() => setFeedback({ ...feedback, helpful: true })}
              >
                👍 Helpful
              </Button>
              <Button
                variant={feedback.helpful === false ? "default" : "outline"}
                className={`flex-1 ${
                  feedback.helpful === false ? "bg-red-600 hover:bg-red-700" : ""
                }`}
                onClick={() => setFeedback({ ...feedback, helpful: false })}
              >
                👎 Not Helpful
              </Button>
            </div>
            
            <div className="pt-2">
              <label className="block text-sm font-medium mb-1">Any additional comments?</label>
              <textarea
                className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background resize-none"
                placeholder="Share your thoughts (optional)"
                value={feedback.comment || ''}
                onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Help Button to Start Tutorial */}
      {!isVisible && !hasTutorialRun && (
        <div className="fixed bottom-4 right-4 z-50">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="h-10 w-10 rounded-full p-0 bg-blue-600 hover:bg-blue-700">
                <HelpCircle className="h-5 w-5 text-white" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-3" align="end">
              <div className="space-y-2">
                <h4 className="font-medium">New to FixPoint?</h4>
                <p className="text-sm text-gray-500">Let {mascotName} guide you through the platform features</p>
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={handleStartTutorial}
                >
                  Start Tutorial
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
};

export default InteractiveMascotGuide;