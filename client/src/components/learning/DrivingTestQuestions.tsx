import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Flag,
  Timer
} from 'lucide-react';
import { motion } from 'framer-motion';

// Types
interface TrafficQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  imageUrl?: string;
}

interface TestProps {
  testType: 'signs' | 'rules' | 'mock-test' | 'mock-advanced';
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
}

// Traffic sign test questions
const trafficSignQuestions: TrafficQuestion[] = [
  {
    id: 1,
    question: 'What does this traffic sign indicate?',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097144.png',
    options: [
      'No entry for vehicles',
      'Stop and give way',
      'No parking',
      'Speed limit'
    ],
    correctAnswer: 0,
    explanation: 'This circular sign with a red border and a white horizontal bar in the center indicates "No Entry" for all vehicles.'
  },
  {
    id: 2,
    question: 'What does this traffic sign indicate?',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097457.png',
    options: [
      'Speed limit 50 km/h',
      'Maximum weight 50 tons',
      'Minimum speed 50 km/h',
      'Road width 50 meters'
    ],
    correctAnswer: 0,
    explanation: 'This sign indicates a maximum speed limit of 50 kilometers per hour. Vehicles must not exceed this speed on the stretch of road where this sign is displayed.'
  },
  {
    id: 3,
    question: 'What does this sign indicate?',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097143.png',
    options: [
      'No U-turn allowed',
      'No right turn',
      'No left turn',
      'Compulsory U-turn'
    ],
    correctAnswer: 0,
    explanation: 'This sign indicates that U-turns are prohibited. Drivers must not make a 180-degree turn to go back in the opposite direction at this location.'
  },
  {
    id: 4,
    question: 'What does this sign indicate?',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097390.png',
    options: [
      'Pedestrian crossing ahead',
      'School zone ahead',
      'Children crossing',
      'Pedestrians prohibited'
    ],
    correctAnswer: 2,
    explanation: 'This sign warns drivers that there may be children crossing the road ahead, typically near schools or playgrounds. Drivers should slow down and be prepared to stop.'
  },
  {
    id: 5,
    question: 'What does this sign indicate?',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097249.png',
    options: [
      'No parking',
      'No stopping or waiting',
      'No entry',
      'No overtaking'
    ],
    correctAnswer: 0,
    explanation: 'The "No Parking" sign indicates that vehicles must not be parked in this area. Stopping briefly to drop off or pick up passengers may be allowed, but leaving the vehicle unattended is prohibited.'
  }
];

// Traffic rules test questions
const trafficRulesQuestions: TrafficQuestion[] = [
  {
    id: 1,
    question: 'When approaching a zebra crossing with pedestrians waiting to cross, you should:',
    options: [
      'Speed up to cross before the pedestrians start walking',
      'Stop and wave the pedestrians across',
      'Slow down, prepare to stop and give way to pedestrians',
      'Sound your horn to warn pedestrians'
    ],
    correctAnswer: 2,
    explanation: 'You must slow down and be prepared to stop for pedestrians waiting at a zebra crossing. Pedestrians have the right of way at zebra crossings.'
  },
  {
    id: 2,
    question: 'What does a solid white line in the center of the road mean?',
    options: [
      'You may cross it to overtake if it is safe',
      'You must not cross or straddle it unless safe and necessary',
      'It separates traffic moving in opposite directions',
      'It indicates the edge of the road'
    ],
    correctAnswer: 1,
    explanation: 'A solid white line in the center of the road means you must not cross or straddle it unless it is necessary and safe to do so, such as to enter premises or pass a stationary vehicle or obstruction.'
  },
  {
    id: 3,
    question: 'When driving in heavy rain, you should:',
    options: [
      'Increase your speed to get through the rain quickly',
      'Maintain the same speed as in dry conditions',
      'Turn on hazard warning lights',
      'Reduce your speed and increase your following distance'
    ],
    correctAnswer: 3,
    explanation: 'When driving in heavy rain, visibility is reduced and stopping distances increase. You should reduce your speed and increase the distance between you and the vehicle in front to allow for safer braking.'
  },
  {
    id: 4,
    question: 'If you see an ambulance with flashing lights behind you, you should:',
    options: [
      'Speed up to get out of the way',
      'Stop immediately where you are',
      'Pull over safely as soon as possible to let it pass',
      'Ignore it if you are obeying the speed limit'
    ],
    correctAnswer: 2,
    explanation: 'When you see an emergency vehicle with flashing lights, you should find a safe place to pull over and stop to allow it to pass. Don't panic or brake suddenly.'
  },
  {
    id: 5,
    question: 'What is the purpose of an Antilock Braking System (ABS)?',
    options: [
      'To increase a vehicle\'s top speed',
      'To prevent wheel lock during braking, allowing you to maintain steering control',
      'To assist with hill starts',
      'To reduce fuel consumption'
    ],
    correctAnswer: 1,
    explanation: 'ABS prevents the wheels from locking up during hard braking. This helps you maintain steering control during emergency stops, particularly on slippery surfaces.'
  }
];

// Mock test questions (combine both sets and add more)
const mockTestQuestions: TrafficQuestion[] = [
  ...trafficSignQuestions.slice(0, 3),
  ...trafficRulesQuestions.slice(0, 3),
  {
    id: 7,
    question: 'What is the minimum legal tread depth for car tires?',
    options: [
      '1 mm',
      '1.5 mm',
      '1.6 mm',
      '2 mm'
    ],
    correctAnswer: 2,
    explanation: 'The legal minimum tread depth for car tires is 1.6 mm across the central three-quarters of the tread width and around the entire circumference.'
  },
  {
    id: 8,
    question: 'What should you do at a flashing amber traffic light?',
    options: [
      'Stop and wait for the green light',
      'Proceed with caution, giving way to pedestrians and traffic',
      'Treat it the same as a red light',
      'Accelerate to clear the junction quickly'
    ],
    correctAnswer: 1,
    explanation: 'A flashing amber traffic light means proceed with caution. You should give way to pedestrians crossing the road and to any traffic on the main road.'
  },
  {
    id: 9,
    question: 'Who has priority at an unmarked crossroads?',
    options: [
      'Vehicles approaching from the right',
      'Vehicles approaching from the left',
      'Vehicles traveling on the wider road',
      'No one has automatic priority; motorists should approach with caution'
    ],
    correctAnswer: 3,
    explanation: 'At an unmarked crossroads, no driver has automatic priority. All drivers should approach with caution and be prepared to give way. Establish eye contact with other drivers and proceed when it is safe.'
  },
  {
    id: 10,
    question: 'What does this hand signal from a cyclist indicate?',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Hand_signal_-_stop_or_slow_down_in_the_US.svg/1200px-Hand_signal_-_stop_or_slow_down_in_the_US.svg.png',
    options: [
      'Turning left',
      'Turning right',
      'Slowing down or stopping',
      'Changing lanes'
    ],
    correctAnswer: 2,
    explanation: 'When a cyclist extends their arm downward with the palm facing backward, it indicates they are slowing down or stopping. This signal helps other road users anticipate the cyclist\'s actions.'
  }
];

const DrivingTestQuestions: React.FC<TestProps> = ({ testType, onClose, onComplete }) => {
  const [questions, setQuestions] = useState<TrafficQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    // Set questions based on test type
    switch (testType) {
      case 'signs':
        setQuestions(trafficSignQuestions);
        setTimeLeft(null); // No time limit for practice
        break;
      case 'rules':
        setQuestions(trafficRulesQuestions);
        setTimeLeft(null); // No time limit for practice
        break;
      case 'mock-test':
        setQuestions(mockTestQuestions);
        setTimeLeft(30 * 60); // 30 minutes
        break;
      case 'mock-advanced':
        // Mix all questions and add more difficulty
        const allQuestions = [...trafficSignQuestions, ...trafficRulesQuestions, ...mockTestQuestions];
        // Remove duplicates by id
        const uniqueQuestions = Array.from(new Map(allQuestions.map(q => [q.id, q])).values());
        setQuestions(uniqueQuestions);
        setTimeLeft(40 * 60); // 40 minutes
        break;
      default:
        setQuestions(trafficSignQuestions);
        setTimeLeft(null);
    }

    // Initialize selected answers array with -1 (no selection)
    setSelectedAnswers(Array(questions.length).fill(-1));
  }, [testType]);

  useEffect(() => {
    // Timer countdown
    if (testStarted && timeLeft !== null && timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmitTest();
    }
  }, [timeLeft, testStarted, isSubmitted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    
    // Calculate score
    let score = 0;
    selectedAnswers.forEach((answer, index) => {
      if (index < questions.length && answer === questions[index].correctAnswer) {
        score++;
      }
    });
    
    onComplete(score, questions.length);
  };

  const isAnswered = (questionIndex: number): boolean => {
    return selectedAnswers[questionIndex] !== undefined && selectedAnswers[questionIndex] !== -1;
  };

  const allQuestionsAnswered = (): boolean => {
    return selectedAnswers.every((answer, index) => index >= questions.length || answer !== -1);
  };

  const getTestTitle = (): string => {
    switch(testType) {
      case 'signs': return 'Traffic Signs Practice Test';
      case 'rules': return 'Traffic Rules Practice Test';
      case 'mock-test': return 'Full Mock Test';
      case 'mock-advanced': return 'Advanced Mock Test';
      default: return 'Practice Test';
    }
  };

  const renderProgressIndicators = () => {
    return (
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-6">
        {questions.map((_, index) => (
          <div 
            key={index}
            className={`h-2 rounded ${
              index === currentQuestionIndex 
                ? 'bg-primary' 
                : isAnswered(index) 
                  ? 'bg-green-500' 
                  : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderCurrentQuestion = () => {
    if (questions.length === 0) return null;
    const question = questions[currentQuestionIndex];

    return (
      <div>
        <div className="mb-6">
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <h3 className="text-lg font-bold mt-1">{question.question}</h3>
          
          {question.imageUrl && (
            <div className="my-4 flex justify-center">
              <img 
                src={question.imageUrl} 
                alt="Traffic sign" 
                className="max-h-48 object-contain"
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div 
              key={index}
              onClick={() => !isSubmitted && handleAnswerSelect(currentQuestionIndex, index)}
              className={`p-4 border rounded-md cursor-pointer transition-colors ${
                selectedAnswers[currentQuestionIndex] === index 
                  ? isSubmitted 
                    ? index === question.correctAnswer 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                    : 'border-primary bg-primary/10'
                  : isSubmitted && index === question.correctAnswer 
                    ? 'border-green-500 bg-green-50'
                    : 'hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                  selectedAnswers[currentQuestionIndex] === index 
                    ? isSubmitted 
                      ? index === question.correctAnswer 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                      : 'bg-primary text-white'
                    : isSubmitted && index === question.correctAnswer 
                      ? 'bg-green-500 text-white'
                      : 'border border-gray-300'
                }`}>
                  {isSubmitted ? (
                    selectedAnswers[currentQuestionIndex] === index ? (
                      index === question.correctAnswer ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )
                    ) : index === question.correctAnswer ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : null
                  ) : (
                    <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                  )}
                </div>
                <span>{option}</span>
              </div>
            </div>
          ))}
        </div>

        {isSubmitted && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md border">
            <div className="flex items-start">
              <div className="mr-2 mt-1">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Explanation</h4>
                <p className="text-sm text-gray-600 mt-1">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTestControls = () => {
    const questionCount = questions.length;
    const answeredCount = selectedAnswers.filter(answer => answer !== -1).length;
    const progress = questionCount > 0 ? (answeredCount / questionCount) * 100 : 0;
    
    return (
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {answeredCount} of {questionCount} answered ({Math.round(progress)}%)
          </div>
          {timeLeft !== null && (
            <div className={`flex items-center text-sm font-medium ${
              timeLeft < 300 ? 'text-red-500' : 'text-gray-500'
            }`}>
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
        
        <Progress value={progress} className="h-1 mb-4" />
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevQuestion} 
            disabled={currentQuestionIndex === 0}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button 
              onClick={handleNextQuestion}
              className="flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitTest}
              disabled={isSubmitted || !allQuestionsAnswered()}
              className="bg-green-600 hover:bg-green-700 flex items-center"
            >
              <Flag className="w-4 h-4 mr-1" />
              Submit Test
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderStartScreen = () => {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">{getTestTitle()}</h2>
        <p className="text-gray-500 mb-6">
          {testType.includes('mock') 
            ? `This is a timed test with ${timeLeft && Math.floor(timeLeft / 60)} minutes to complete.`
            : 'Take your time to answer all questions. There is no time limit for this practice test.'}
        </p>
        
        <div className="max-w-md mx-auto bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="font-bold text-sm mb-2">Test Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2 text-gray-500" />
              <span>Questions: <strong>{questions.length}</strong></span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
              <span>Passing: <strong>70%</strong></span>
            </div>
            {timeLeft !== null && (
              <div className="flex items-center">
                <Timer className="w-4 h-4 mr-2 text-gray-500" />
                <span>Time: <strong>{Math.floor(timeLeft / 60)} minutes</strong></span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleStartTest}>Start Test</Button>
        </div>
      </div>
    );
  };

  const renderTestContent = () => {
    if (!testStarted) {
      return renderStartScreen();
    }
    
    return (
      <div className="p-6">
        {renderProgressIndicators()}
        {renderCurrentQuestion()}
        {renderTestControls()}
      </div>
    );
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-0">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold">{getTestTitle()}</h2>
          {testStarted && !isSubmitted && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSubmitTest}
              className="text-xs"
            >
              End Test Early
            </Button>
          )}
        </div>
        
        {renderTestContent()}
      </CardContent>
    </Card>
  );
};

// Results Component
interface TestResultsProps {
  score: number;
  total: number;
  testType: string;
  onRetake: () => void;
  onClose: () => void;
}

export const TestResults: React.FC<TestResultsProps> = ({ score, total, testType, onRetake, onClose }) => {
  const percentage = Math.round((score / total) * 100);
  const isPassed = percentage >= 70;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardContent className="p-0">
          <div className="p-6 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isPassed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {isPassed ? (
                <CheckCircle className="w-10 h-10" />
              ) : (
                <AlertCircle className="w-10 h-10" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-1">
              {isPassed ? 'Test Passed!' : 'Test Incomplete'}
            </h2>
            <p className="text-gray-500 mb-6">
              {isPassed 
                ? 'Congratulations! You have successfully passed the test.'
                : 'You did not achieve the passing score. Keep practicing and try again.'}
            </p>
            
            <div className="flex justify-center mb-8">
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold">{percentage}%</span>
                  <span className="text-sm text-gray-500">Your Score</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={isPassed ? "#22c55e" : "#f59e0b"}
                    strokeWidth="3"
                    strokeDasharray={`${percentage}, 100`}
                  />
                </svg>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
              <h3 className="font-bold text-sm mb-3">Test Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Test Type:</span>
                  <p className="font-medium">{testType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Registration ID:</span>
                  <p className="font-medium">TP-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Questions:</span>
                  <p className="font-medium">{total}</p>
                </div>
                <div>
                  <span className="text-gray-500">Correct Answers:</span>
                  <p className="font-medium">{score}</p>
                </div>
                <div>
                  <span className="text-gray-500">Pass Criteria:</span>
                  <p className="font-medium">70% or higher</p>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" onClick={onClose} className="flex items-center gap-1">
                Close
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                Download Results
              </Button>
              <Button onClick={onRetake} className="flex items-center gap-1">
                Take Test Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DrivingTestQuestions;