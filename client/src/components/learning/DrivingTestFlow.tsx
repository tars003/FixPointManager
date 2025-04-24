import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  X,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Check,
  XCircle,
  CheckCircle,
  Pencil,
  Trophy,
  Timer,
  Clipboard,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Test categories
const testCategories = [
  {
    id: 'traffic-signs',
    title: 'Traffic Signs & Symbols',
    description: 'Test your knowledge of road signs and symbols',
    icon: Clipboard,
  },
  {
    id: 'traffic-rules',
    title: 'Traffic Rules & Regulations',
    description: 'Practice questions on driving rules and regulations',
    icon: Clipboard,
  },
  {
    id: 'mock-test',
    title: 'Full Mock Test',
    description: 'Complete RTO test simulation with time limit',
    icon: Timer,
  },
];

// Sample traffic sign questions
const trafficSignQuestions = [
  {
    id: 1,
    question: 'What does a red octagonal sign indicate?',
    options: [
      { id: 'a', text: 'Yield' },
      { id: 'b', text: 'Stop' },
      { id: 'c', text: 'No entry' },
      { id: 'd', text: 'Speed limit' },
    ],
    correctAnswer: 'b',
    explanation: 'A red octagonal sign always means STOP. You must come to a complete halt at such signs.',
  },
  {
    id: 2,
    question: 'What does a triangular sign with red border indicate?',
    options: [
      { id: 'a', text: 'Warning/Caution' },
      { id: 'b', text: 'Stop' },
      { id: 'c', text: 'Speed limit' },
      { id: 'd', text: 'No parking' },
    ],
    correctAnswer: 'a',
    explanation: 'Triangular signs with red borders are warning signs, alerting drivers to potential hazards ahead.',
  },
  {
    id: 3,
    question: 'What does a circular sign with a red border indicate?',
    options: [
      { id: 'a', text: 'Warning' },
      { id: 'b', text: 'Information' },
      { id: 'c', text: 'Prohibition/Restriction' },
      { id: 'd', text: 'Direction' },
    ],
    correctAnswer: 'c',
    explanation: 'Circular signs with red borders indicate prohibitions or restrictions, such as "No Entry", "No U-Turn", etc.',
  },
  {
    id: 4,
    question: 'What does a blue circular sign typically indicate?',
    options: [
      { id: 'a', text: 'Warning' },
      { id: 'b', text: 'Mandatory instruction' },
      { id: 'c', text: 'Prohibition' },
      { id: 'd', text: 'Speed limit' },
    ],
    correctAnswer: 'b',
    explanation: 'Blue circular signs typically provide mandatory instructions that must be followed, such as "Turn left", "Keep right", etc.',
  },
  {
    id: 5,
    question: 'What does a yellow diamond-shaped sign indicate?',
    options: [
      { id: 'a', text: 'School zone ahead' },
      { id: 'b', text: 'Road work ahead' },
      { id: 'c', text: 'Warning about road condition' },
      { id: 'd', text: 'Speed limit' },
    ],
    correctAnswer: 'c',
    explanation: 'Yellow diamond-shaped signs are warning signs that alert drivers about upcoming road conditions or hazards.',
  },
];

// Sample traffic rules questions
const trafficRuleQuestions = [
  {
    id: 1,
    question: 'What is the default speed limit in city/municipal areas unless otherwise specified?',
    options: [
      { id: 'a', text: '40 km/h' },
      { id: 'b', text: '50 km/h' },
      { id: 'c', text: '60 km/h' },
      { id: 'd', text: '70 km/h' },
    ],
    correctAnswer: 'b',
    explanation: 'The default speed limit in city or municipal areas is typically 50 km/h unless otherwise specified by signs.',
  },
  {
    id: 2,
    question: 'When turning right at an intersection, you should:',
    options: [
      { id: 'a', text: 'Signal right, move to the rightmost lane, yield to pedestrians and oncoming traffic' },
      { id: 'b', text: 'Signal right, move to the leftmost lane, yield to pedestrians' },
      { id: 'c', text: 'Signal left, move to the rightmost lane, yield to pedestrians' },
      { id: 'd', text: 'No need to signal, just turn when it is clear' },
    ],
    correctAnswer: 'a',
    explanation: 'When turning right, you should signal right, position your vehicle in the rightmost lane, and yield to pedestrians and oncoming traffic before making the turn.',
  },
  {
    id: 3,
    question: 'What does a solid yellow line in the center of the road indicate?',
    options: [
      { id: 'a', text: 'Overtaking is permitted from both sides' },
      { id: 'b', text: 'Overtaking is not permitted from either side' },
      { id: 'c', text: 'Overtaking is permitted only from the left side' },
      { id: 'd', text: 'Overtaking is permitted only from the right side' },
    ],
    correctAnswer: 'b',
    explanation: 'A solid yellow line in the center of the road indicates that overtaking or passing is not permitted from either side of the line.',
  },
  {
    id: 4,
    question: 'When should you use hazard lights (all four indicators)?',
    options: [
      { id: 'a', text: 'When parking illegally for a short time' },
      { id: 'b', text: 'When driving in heavy rain' },
      { id: 'c', text: 'When your vehicle has broken down or in an emergency situation' },
      { id: 'd', text: 'When you want to park in a no-parking zone temporarily' },
    ],
    correctAnswer: 'c',
    explanation: 'Hazard lights should be used when your vehicle has broken down, when you are in an emergency situation, or when your vehicle is a temporary hazard to other drivers.',
  },
  {
    id: 5,
    question: 'At an uncontrolled intersection (no traffic signals or signs), who has the right of way?',
    options: [
      { id: 'a', text: 'Vehicles coming from the right' },
      { id: 'b', text: 'Vehicles coming from the left' },
      { id: 'c', text: 'Larger vehicles' },
      { id: 'd', text: 'Whoever arrives first' },
    ],
    correctAnswer: 'a',
    explanation: 'At an uncontrolled intersection, vehicles coming from the right have the right of way. This is the "yield to the right" rule.',
  },
];

// Mock test questions (combination of both categories)
const mockTestQuestions = [
  ...trafficSignQuestions,
  ...trafficRuleQuestions,
].sort(() => Math.random() - 0.5).slice(0, 10); // Randomly pick 10 questions

interface DrivingTestFlowProps {
  onClose: () => void;
}

const DrivingTestFlow: React.FC<DrivingTestFlowProps> = ({ onClose }) => {
  const [testCategory, setTestCategory] = useState<string | null>(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes for mock test
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Get questions based on selected category
  const getQuestions = () => {
    switch(testCategory) {
      case 'traffic-signs':
        return trafficSignQuestions;
      case 'traffic-rules':
        return trafficRuleQuestions;
      case 'mock-test':
        return mockTestQuestions;
      default:
        return [];
    }
  };

  const questions = getQuestions();
  const currentQuestion = questions[currentQuestionIndex];

  // Start test
  const startTest = () => {
    setIsTestStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setTestEnded(false);
    
    // Start timer for mock test
    if (testCategory === 'mock-test') {
      const id = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(id);
            setTestEnded(true);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setIntervalId(id);
    }
  };

  // Reset test
  const resetTest = () => {
    setIsTestStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setTestEnded(false);
    setTimeLeft(300);
    
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  // Handle answer selection
  const selectAnswer = (questionId: number, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setTestEnded(true);
      setShowResults(true);
      
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const score = calculateScore();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              {(testCategory && !isTestStarted) && (
                <Button variant="ghost" size="icon" onClick={() => setTestCategory(null)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {(isTestStarted && !showResults) && (
                <Button variant="ghost" size="icon" onClick={() => {
                  if (window.confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
                    resetTest();
                    if (testCategory) setIsTestStarted(false);
                    else setTestCategory(null);
                  }
                }}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {showResults && (
                <Button variant="ghost" size="icon" onClick={resetTest}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-bold">
                {!testCategory && 'Driving Test Preparation'}
                {testCategory && !isTestStarted && testCategories.find(c => c.id === testCategory)?.title}
                {isTestStarted && !showResults && 'Question ' + (currentQuestionIndex + 1) + ' of ' + questions.length}
                {showResults && 'Test Results'}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              {testCategory === 'mock-test' && isTestStarted && !showResults && (
                <div className="mr-2 font-medium text-orange-600">
                  <Timer className="h-4 w-4 inline-block mr-1" />
                  {formatTime(timeLeft)}
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Category Selection */}
          {!testCategory && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <p className="text-sm text-gray-500 mb-6">
                Practice for your driving test with our comprehensive question bank. Choose a category to start practicing.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {testCategories.map((category) => (
                  <Card
                    key={category.id}
                    className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                    onClick={() => setTestCategory(category.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <category.icon className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-bold mb-1">{category.title}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-700">Study Tips</h3>
                    <ul className="text-sm text-blue-600 mt-1 space-y-1 list-disc pl-4">
                      <li>Take multiple practice tests to familiarize yourself with different question types.</li>
                      <li>Review your wrong answers to understand the correct choices.</li>
                      <li>In the mock test, manage your time carefully as you would in the real test.</li>
                      <li>Focus on understanding traffic signs and rules rather than memorizing answers.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Test Introduction */}
          {testCategory && !isTestStarted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-lg mb-2">{testCategories.find(c => c.id === testCategory)?.title}</h3>
                <p className="text-gray-600 mb-4">{testCategories.find(c => c.id === testCategory)?.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Test Format:</h4>
                  <ul className="space-y-1 pl-5 list-disc text-sm">
                    <li>Number of questions: {questions.length}</li>
                    <li>Passing score: 70% or higher</li>
                    {testCategory === 'mock-test' && <li>Time limit: 5 minutes</li>}
                    <li>You can review and change your answers before submitting</li>
                  </ul>
                </div>
                
                <Button className="w-full" onClick={startTest}>
                  Start Test
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Tips for {testCategories.find(c => c.id === testCategory)?.title}</h3>
                <div className="space-y-2">
                  {testCategory === 'traffic-signs' && (
                    <>
                      <p className="text-sm text-gray-600">
                        Traffic signs are divided into different categories based on their shape and color:
                      </p>
                      <ul className="space-y-1 pl-5 list-disc text-sm text-gray-600">
                        <li><span className="font-medium">Red octagonal signs</span> mean STOP</li>
                        <li><span className="font-medium">Red triangular signs</span> indicate warnings</li>
                        <li><span className="font-medium">Red circular signs</span> show prohibitions</li>
                        <li><span className="font-medium">Blue circular signs</span> give mandatory instructions</li>
                        <li><span className="font-medium">Brown/Yellow signs</span> provide information about locations</li>
                      </ul>
                    </>
                  )}
                  
                  {testCategory === 'traffic-rules' && (
                    <>
                      <p className="text-sm text-gray-600">
                        Key areas to focus on for traffic rules questions:
                      </p>
                      <ul className="space-y-1 pl-5 list-disc text-sm text-gray-600">
                        <li>Right of way rules at intersections and junctions</li>
                        <li>Speed limits for different road types and vehicles</li>
                        <li>Lane discipline and overtaking rules</li>
                        <li>Requirements for using indicators and hazard lights</li>
                        <li>Rules for parking and stopping</li>
                      </ul>
                    </>
                  )}
                  
                  {testCategory === 'mock-test' && (
                    <>
                      <p className="text-sm text-gray-600">
                        Strategies for the actual RTO test:
                      </p>
                      <ul className="space-y-1 pl-5 list-disc text-sm text-gray-600">
                        <li>Read each question carefully before answering</li>
                        <li>Manage your time - don't spend too long on any single question</li>
                        <li>If unsure, eliminate obviously wrong answers first</li>
                        <li>Review your answers before submitting if time permits</li>
                        <li>Stay calm and focused throughout the test</li>
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Test Questions */}
          {isTestStarted && !showResults && currentQuestion && (
            <motion.div 
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6"
            >
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span>
                    {Object.keys(selectedAnswers).length} of {questions.length} answered
                  </span>
                </div>
                <Progress value={(currentQuestionIndex + 1) / questions.length * 100} className="h-2" />
              </div>
              
              {/* Question */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">
                  {currentQuestion.question}
                </h3>
                
                <RadioGroup 
                  value={selectedAnswers[currentQuestion.id] || ''}
                  onValueChange={(value) => selectAnswer(currentQuestion.id, value)}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-start space-x-2">
                      <RadioGroupItem value={option.id} id={`option-${option.id}`} className="mt-1" />
                      <Label htmlFor={`option-${option.id}`} className="cursor-pointer flex-1">
                        <div className="font-medium">{option.id.toUpperCase()}.</div>
                        <div>{option.text}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button 
                      onClick={nextQuestion}
                      disabled={!selectedAnswers[currentQuestion.id]}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => {
                        setTestEnded(true);
                        setShowResults(true);
                        if (intervalId) {
                          clearInterval(intervalId);
                          setIntervalId(null);
                        }
                      }}
                      disabled={!selectedAnswers[currentQuestion.id]}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Submit Test
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Test Results */}
          {showResults && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              {/* Score Summary */}
              <div className="text-center mb-6">
                <div className="inline-block rounded-full p-4 bg-gray-100 mb-4">
                  {score.percentage >= 70 ? (
                    <Trophy className="h-12 w-12 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="h-12 w-12 text-orange-500" />
                  )}
                </div>
                
                <h3 className="text-2xl font-bold mb-1">
                  {score.percentage >= 70 ? 'Congratulations!' : 'Keep Practicing!'}
                </h3>
                
                <p className="text-gray-600 mb-3">
                  {score.percentage >= 70 
                    ? 'You passed the test with a great score!' 
                    : 'You need to score at least 70% to pass. Try again after reviewing your answers.'}
                </p>
                
                <div className="inline-block bg-gray-100 px-4 py-2 rounded-full font-bold text-lg">
                  Score: {score.correct}/{score.total} ({score.percentage}%)
                </div>
                
                {testCategory === 'mock-test' && (
                  <div className="mt-2 text-sm text-gray-500">
                    Time taken: {5 - Math.floor(timeLeft / 60)}:{(60 - (timeLeft % 60)).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
              
              {/* Answer Review */}
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Review Your Answers</h3>
                
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Question {index + 1}</span>
                        {selectedAnswers[question.id] === question.correctAnswer ? (
                          <span className="flex items-center text-green-600 font-medium">
                            <Check className="h-4 w-4 mr-1" />
                            Correct
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600 font-medium">
                            <X className="h-4 w-4 mr-1" />
                            Incorrect
                          </span>
                        )}
                      </div>
                      
                      <p className="mb-2">{question.question}</p>
                      
                      <div className="space-y-1">
                        {question.options.map((option) => (
                          <div 
                            key={option.id} 
                            className={`p-2 rounded-md flex justify-between ${
                              option.id === question.correctAnswer && option.id === selectedAnswers[question.id]
                                ? 'bg-green-100'
                                : option.id === question.correctAnswer
                                ? 'bg-green-50'
                                : option.id === selectedAnswers[question.id]
                                ? 'bg-red-50'
                                : 'bg-gray-50'
                            }`}
                          >
                            <span>{option.id.toUpperCase()}. {option.text}</span>
                            {option.id === question.correctAnswer && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {option.id === selectedAnswers[question.id] && option.id !== question.correctAnswer && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-2 text-sm bg-blue-50 p-2 rounded">
                        <span className="font-medium">Explanation:</span> {question.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => {
                    setIsTestStarted(true);
                    setShowResults(false);
                    setTestEnded(false);
                    setSelectedAnswers({});
                    setCurrentQuestionIndex(0);
                    
                    if (testCategory === 'mock-test') {
                      setTimeLeft(300);
                      const id = setInterval(() => {
                        setTimeLeft(prev => {
                          if (prev <= 1) {
                            clearInterval(id);
                            setTestEnded(true);
                            setShowResults(true);
                            return 0;
                          }
                          return prev - 1;
                        });
                      }, 1000);
                      
                      setIntervalId(id);
                    }
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retake Test
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    resetTest();
                    setTestCategory(null);
                  }}
                >
                  Back to Test Categories
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DrivingTestFlow;