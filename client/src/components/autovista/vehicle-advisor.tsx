import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, User, Bot, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample questions for the advisor
const advisorQuestions = [
  {
    id: 'usage',
    question: 'How do you plan to use this vehicle primarily?',
    options: ['Daily commute', 'Family trips', 'Business', 'Adventure travel'],
    type: 'selection'
  },
  {
    id: 'budget',
    question: 'What is your approximate budget?',
    options: ['Under ₹5 lakhs', '₹5-10 lakhs', '₹10-20 lakhs', 'Above ₹20 lakhs'],
    type: 'selection'
  },
  {
    id: 'fuel',
    question: 'Which fuel type do you prefer?',
    options: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'No preference'],
    type: 'selection'
  },
  {
    id: 'features',
    question: 'Select top 3 features important to you',
    options: ['Fuel efficiency', 'Performance', 'Safety', 'Technology', 'Comfort', 'Luggage space', 'Off-road capability'],
    type: 'multiple',
    max: 3
  },
  {
    id: 'seating',
    question: 'How many seats do you need?',
    options: ['2 seats', '5 seats', '7 seats', 'More than 7 seats'],
    type: 'selection'
  }
];

// Types for message bubbles
interface Message {
  id: number;
  sender: 'user' | 'advisor';
  content: string | React.ReactNode;
}

// Main Vehicle Advisor component
const VehicleAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add the initial greeting when the advisor is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: Date.now(),
            sender: 'advisor',
            content: "Hi there! I'm your AutoVista Vehicle Advisor. I'll help you find the perfect vehicle based on your needs. Let's start with a few questions to understand your requirements better."
          }
        ]);
        setIsTyping(false);
        // Add a delay before asking the first question
        setTimeout(() => askNextQuestion(), 1000);
      }, 1000);
    }
  }, [isOpen]);
  
  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Reset the conversation when closed
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setCurrentQuestionIndex(0);
      setSelections({});
    }
  }, [isOpen]);
  
  // Ask the next question in the sequence
  const askNextQuestion = () => {
    if (currentQuestionIndex < advisorQuestions.length) {
      setIsTyping(true);
      setTimeout(() => {
        const question = advisorQuestions[currentQuestionIndex];
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'advisor',
          content: renderQuestion(question)
        }]);
        setIsTyping(false);
      }, 1000);
    } else {
      // All questions answered, provide recommendations
      provideRecommendations();
    }
  };
  
  // Render a question with its options
  const renderQuestion = (question: any) => (
    <div>
      <p className="mb-3">{question.question}</p>
      <div className={`grid ${question.type === 'multiple' ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
        {question.options.map((option: string) => (
          <Button
            key={option}
            variant="outline"
            size="sm"
            className={`justify-start px-3 ${
              Array.isArray(selections[question.id]) && (selections[question.id] as string[]).includes(option)
                ? 'bg-primary/10 border-primary text-primary'
                : selections[question.id] === option
                ? 'bg-primary/10 border-primary text-primary'
                : ''
            }`}
            onClick={() => handleOptionSelect(question, option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
  
  // Handle option selection
  const handleOptionSelect = (question: any, option: string) => {
    if (question.type === 'multiple') {
      setSelections(prev => {
        const current = prev[question.id] as string[] || [];
        if (current.includes(option)) {
          return {
            ...prev,
            [question.id]: current.filter(item => item !== option)
          };
        } else if (current.length < (question.max || 1)) {
          return {
            ...prev,
            [question.id]: [...current, option]
          };
        }
        return prev;
      });
    } else {
      setSelections(prev => ({
        ...prev,
        [question.id]: option
      }));
      
      // Add user's response as a message
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'user',
        content: option
      }]);
      
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Ask the next question
      setTimeout(() => askNextQuestion(), 500);
    }
  };
  
  // Handle multiple selection confirmation
  const handleMultipleConfirm = (question: any) => {
    const selected = selections[question.id] as string[];
    if (selected && selected.length > 0) {
      // Add user's response as a message
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'user',
        content: selected.join(', ')
      }]);
      
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Ask the next question
      setTimeout(() => askNextQuestion(), 500);
    }
  };
  
  // Provide recommendations based on selections
  const provideRecommendations = () => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'advisor',
        content: (
          <div>
            <p className="mb-3">Based on your preferences, here are some vehicles I recommend:</p>
            <div className="space-y-2">
              <RecommendationCard
                name="Maruti Suzuki Baleno"
                description="Perfect for daily commutes with great fuel efficiency and compact size."
                match={92}
              />
              <RecommendationCard
                name="Hyundai Creta"
                description="Ideal for family trips with spacious interiors and modern features."
                match={87}
              />
              <RecommendationCard
                name="Tata Nexon EV"
                description="Electric SUV with excellent range and performance for city driving."
                match={84}
              />
            </div>
            <div className="mt-4">
              <Button className="w-full" variant="default">
                View Detailed Comparison
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      }]);
      setIsTyping(false);
    }, 2000);
  };
  
  // Handle manual input send
  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'user',
        content: userInput
      }]);
      setUserInput('');
      
      // Simulate AI response
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'advisor',
          content: "I understand you have a specific question. Let me first understand your requirements through these questions, and then I can provide more personalized recommendations."
        }]);
        setIsTyping(false);
        setTimeout(() => askNextQuestion(), 1000);
      }, 1500);
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = (currentQuestionIndex / advisorQuestions.length) * 100;
  
  return (
    <>
      {/* Floating button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 p-3 shadow-lg"
          variant={isOpen ? "outline" : "default"}
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </motion.div>
      
      {/* Advisor dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-8 right-8 w-full max-w-md z-50"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Card className="border shadow-xl">
              <CardHeader className="bg-primary text-white relative pb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="absolute right-2 top-2 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Vehicle Advisor
                </CardTitle>
                <Progress value={progressPercentage} className="h-1 mt-2" />
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="h-96 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div 
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`rounded-lg p-3 max-w-[80%] ${
                            message.sender === 'user' 
                              ? 'bg-primary text-white' 
                              : 'bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.sender === 'advisor' && (
                              <div className="bg-white p-1 rounded-full mt-0.5">
                                <Bot className="h-3 w-3 text-primary" />
                              </div>
                            )}
                            <div>{message.content}</div>
                            {message.sender === 'user' && (
                              <div className="bg-white p-1 rounded-full mt-0.5">
                                <User className="h-3 w-3 text-primary" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-neutral-100 rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <div className="bg-white p-1 rounded-full">
                              <Bot className="h-3 w-3 text-primary" />
                            </div>
                            <div className="flex space-x-1">
                              <motion.div
                                className="w-2 h-2 bg-neutral-400 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-neutral-400 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-neutral-400 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* For multiple selection questions with current question */}
                    {currentQuestionIndex < advisorQuestions.length && 
                     advisorQuestions[currentQuestionIndex].type === 'multiple' &&
                     messages.length > 0 && 
                     messages[messages.length - 1].sender === 'advisor' && (
                      <div className="flex justify-end">
                        <Button 
                          size="sm"
                          onClick={() => handleMultipleConfirm(advisorQuestions[currentQuestionIndex])}
                          disabled={!selections[advisorQuestions[currentQuestionIndex].id] || 
                                  (selections[advisorQuestions[currentQuestionIndex].id] as string[]).length === 0}
                        >
                          Confirm Selection
                        </Button>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-3 border-t">
                <div className="flex items-center w-full gap-2">
                  <input
                    type="text"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Ask a question..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Recommendation card subcomponent
const RecommendationCard: React.FC<{
  name: string;
  description: string;
  match: number;
}> = ({ name, description, match }) => (
  <div className="border rounded-lg p-3 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
    <div className="flex justify-between items-center mb-1">
      <h4 className="font-medium">{name}</h4>
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent">
        {match}% Match
      </Badge>
    </div>
    <p className="text-xs text-neutral-600">{description}</p>
  </div>
);

export default VehicleAdvisor;