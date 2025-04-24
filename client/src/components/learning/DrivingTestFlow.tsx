import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  X,
  ArrowLeft,
  AlertTriangle,
  Clipboard,
  Timer,
  FileText,
  BookOpen,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import DrivingTestQuestions, { TestResults } from './DrivingTestQuestions';

// Test categories
const testCategories = [
  {
    id: 'signs',
    title: 'Traffic Signs & Symbols',
    description: 'Test your knowledge of road signs and symbols',
    icon: Clipboard,
    testType: 'signs'
  },
  {
    id: 'rules',
    title: 'Traffic Rules & Regulations',
    description: 'Practice questions on driving rules and regulations',
    icon: FileText,
    testType: 'rules'
  },
  {
    id: 'mock-test',
    title: 'Full Mock Test',
    description: 'Complete RTO test simulation with time limit',
    icon: Timer,
    testType: 'mock-test'
  },
  {
    id: 'mock-advanced',
    title: 'Advanced Mock Test',
    description: 'Challenging comprehensive test with all question types',
    icon: BookOpen,
    testType: 'mock-advanced'
  },
];

interface DrivingTestFlowProps {
  onClose: () => void;
  testType?: 'signs' | 'rules' | 'mock-test' | 'mock-advanced';
}

const DrivingTestFlow: React.FC<DrivingTestFlowProps> = ({ onClose, testType }) => {
  // Auto-select the category based on the testType prop (if provided)
  const initialCategory = testType ? testCategories.find(c => c.testType === testType)?.id || null : null;
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [testInProgress, setTestInProgress] = useState(testType ? true : false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testScore, setTestScore] = useState({ score: 0, total: 0 });
  const [selectedTestType, setSelectedTestType] = useState<'signs' | 'rules' | 'mock-test' | 'mock-advanced'>(testType || 'signs');

  const handleTestComplete = (score: number, total: number) => {
    setTestCompleted(true);
    setTestScore({ score, total });
  };

  const handleStartTest = (category: string) => {
    const testCategory = testCategories.find(c => c.id === category);
    if (testCategory) {
      setSelectedCategory(category);
      setSelectedTestType(testCategory.testType as 'signs' | 'rules' | 'mock-test' | 'mock-advanced');
      setTestInProgress(true);
    }
  };

  const handleResetTest = () => {
    setTestInProgress(false);
    setTestCompleted(false);
    setSelectedCategory(null);
  };

  return (
    <div className="w-full">
      <Card className="w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-card z-10">
            <div className="flex items-center gap-2">
              {selectedCategory && !testInProgress && (
                <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {testInProgress && !testCompleted && (
                <Button variant="ghost" size="icon" onClick={() => {
                  if (window.confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
                    handleResetTest();
                  }
                }}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {testCompleted && (
                <Button variant="ghost" size="icon" onClick={handleResetTest}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-bold">
                {!selectedCategory && 'Driving Test Preparation'}
                {selectedCategory && !testInProgress && 
                  testCategories.find(c => c.id === selectedCategory)?.title}
                {testInProgress && !testCompleted && 'Test in Progress'}
                {testCompleted && 'Test Results'}
              </h2>
            </div>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Category Selection */}
          {!selectedCategory && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <p className="text-sm text-muted-foreground mb-6">
                Practice for your driving test with our comprehensive question bank. Choose a category to start practicing.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testCategories.map((category) => (
                  <Card
                    key={category.id}
                    className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <category.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-bold mb-1">{category.title}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg dark:bg-blue-950">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-700 dark:text-blue-300">Study Tips</h3>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 mt-1 space-y-1 list-disc pl-4">
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
          {selectedCategory && !testInProgress && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-lg mb-2">
                  {testCategories.find(c => c.id === selectedCategory)?.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {testCategories.find(c => c.id === selectedCategory)?.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Test Format:</h4>
                  <ul className="space-y-1 pl-5 list-disc text-sm text-muted-foreground">
                    <li>Answer all questions to complete the test</li>
                    <li>Passing score: 70% or higher</li>
                    {selectedCategory.includes('mock') && <li>Time limit applies</li>}
                    <li>You can review your answers after completing the test</li>
                  </ul>
                </div>
                
                <Button className="w-full" onClick={() => handleStartTest(selectedCategory)}>
                  Start Test
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Tips for this test</h3>
                <div className="space-y-2">
                  {selectedCategory === 'signs' && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Traffic signs are divided into different categories based on their shape and color:
                      </p>
                      <ul className="space-y-1 pl-5 list-disc text-sm text-muted-foreground">
                        <li><span className="font-medium">Red octagonal signs</span> mean STOP</li>
                        <li><span className="font-medium">Red triangular signs</span> indicate warnings</li>
                        <li><span className="font-medium">Red circular signs</span> show prohibitions</li>
                        <li><span className="font-medium">Blue circular signs</span> give mandatory instructions</li>
                        <li><span className="font-medium">Brown/Yellow signs</span> provide information about locations</li>
                      </ul>
                    </>
                  )}
                  
                  {selectedCategory === 'rules' && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Key areas to focus on for traffic rules questions:
                      </p>
                      <ul className="space-y-1 pl-5 list-disc text-sm text-muted-foreground">
                        <li>Right of way rules at intersections and junctions</li>
                        <li>Speed limits for different road types and vehicles</li>
                        <li>Lane discipline and overtaking rules</li>
                        <li>Requirements for using indicators and hazard lights</li>
                        <li>Rules for parking and stopping</li>
                      </ul>
                    </>
                  )}
                  
                  {selectedCategory.includes('mock') && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Strategies for the actual RTO test:
                      </p>
                      <ul className="space-y-1 pl-5 list-disc text-sm text-muted-foreground">
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
          
          {/* Test Questions Component */}
          {testInProgress && !testCompleted && (
            <DrivingTestQuestions 
              testType={selectedTestType}
              onClose={() => handleResetTest()}
              onComplete={handleTestComplete}
            />
          )}
          
          {/* Test Results Component */}
          {testCompleted && (
            <TestResults
              score={testScore.score}
              total={testScore.total}
              testType={testCategories.find(c => c.id === selectedCategory)?.title || ''}
              onRetake={() => {
                setTestCompleted(false);
                handleStartTest(selectedCategory!);
              }}
              onClose={handleResetTest}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DrivingTestFlow;