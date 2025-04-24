import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  FileCheck,
  Car,
  AlertTriangle,
  CheckSquare,
  Phone,
  ArrowLeft,
  ArrowRight,
  Camera, 
  Mic,
  FileText,
  HelpCircle,
  Scale
} from 'lucide-react';

interface PoliceEmergencyProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  theme: 'light' | 'dark';
  onGoBack: () => void;
}

type PoliceIssueType = 'violation' | 'document' | 'detention' | 'bribe' | 'checkpoint' | '';
type PoliceStep = 'type' | 'rights' | 'documentation' | 'escalation';

export default function PoliceEmergency({ 
  location, 
  theme,
  onGoBack
}: PoliceEmergencyProps) {
  const [issueType, setIssueType] = useState<PoliceIssueType>('');
  const [currentStep, setCurrentStep] = useState<PoliceStep>('type');
  const [isRecording, setIsRecording] = useState(false);
  
  // Progress calculation
  const getTotalProgress = () => {
    const stepValues = {
      type: 25,
      rights: 50,
      documentation: 75,
      escalation: 100
    };
    
    return stepValues[currentStep] || 0;
  };
  
  const handleIssueTypeSelect = (type: PoliceIssueType) => {
    setIssueType(type);
    setCurrentStep('rights');
  };
  
  const handleContinueToDocumentation = () => {
    setCurrentStep('documentation');
  };
  
  const handleContinueToEscalation = () => {
    setCurrentStep('escalation');
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return renderIssueTypeSelection();
      case 'rights':
        return renderRightsInformation();
      case 'documentation':
        return renderInteractionDocumentation();
      case 'escalation':
        return renderEscalationAssistance();
      default:
        return renderIssueTypeSelection();
    }
  };
  
  // Step 1: Police Issue Type Selection
  const renderIssueTypeSelection = () => {
    const types = [
      { 
        id: 'violation', 
        name: 'Traffic Violation Charge', 
        description: 'Being charged with a traffic violation',
        icon: <Car className="h-8 w-8" />
      },
      { 
        id: 'document', 
        name: 'Document Verification', 
        description: 'License, RC, insurance check',
        icon: <FileCheck className="h-8 w-8" />
      },
      { 
        id: 'detention', 
        name: 'Vehicle Detention', 
        description: 'Vehicle being detained by police',
        icon: <AlertTriangle className="h-8 w-8" />
      },
      { 
        id: 'bribe', 
        name: 'Bribe Demand', 
        description: 'Improper payment request',
        icon: <Shield className="h-8 w-8" />
      },
      { 
        id: 'checkpoint', 
        name: 'Checkpoint Issue', 
        description: 'Problem at police checkpoint',
        icon: <CheckSquare className="h-8 w-8" />
      }
    ];
    
    return (
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Select Police Issue Type
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map(type => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all ${
                theme === 'light' 
                ? 'hover:border-blue-200 hover:shadow-md' 
                : 'bg-gray-800 border-gray-700 hover:border-blue-900'
              }`}
              onClick={() => handleIssueTypeSelect(type.id as PoliceIssueType)}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                    {type.icon}
                  </div>
                </div>
                <div>
                  <h4 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    {type.name}
                  </h4>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {type.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  // Step 2: Rights Information Screen
  const renderRightsInformation = () => {
    const getIssueSpecificRights = () => {
      switch (issueType) {
        case 'violation':
          return (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-900/30'}`}>
                <h5 className={`font-medium ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                  Traffic Violation Rights
                </h5>
                <ul className={`text-sm mt-2 space-y-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                  <li>• Right to know the specific violation you're being charged with</li>
                  <li>• Right to see the traffic police officer's identification</li>
                  <li>• Right to request an official receipt for any fine paid</li>
                  <li>• Right to contest the violation in traffic court</li>
                </ul>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-amber-50 border border-amber-100' : 'bg-amber-900/20 border border-amber-900/30'}`}>
                <h5 className={`font-medium ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                  Official Fine Rates
                </h5>
                <ul className={`text-sm mt-2 space-y-1 ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                  <li>• Speeding: ₹1,000 - ₹2,000</li>
                  <li>• Red light jumping: ₹1,000 - ₹5,000</li>
                  <li>• Driving without license: ₹5,000</li>
                  <li>• Driving without insurance: ₹2,000</li>
                  <li>• Not wearing seatbelt/helmet: ₹1,000</li>
                </ul>
              </div>
            </div>
          );
        case 'bribe':
          return (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-red-50 border border-red-100' : 'bg-red-900/20 border border-red-900/30'}`}>
                <h5 className={`font-medium ${theme === 'light' ? 'text-red-700' : 'text-red-400'}`}>
                  Anti-Corruption Rights
                </h5>
                <ul className={`text-sm mt-2 space-y-1 ${theme === 'light' ? 'text-red-600' : 'text-red-300'}`}>
                  <li>• Right to refuse any unofficial payment requests</li>
                  <li>• Right to record interactions with officials (in most states)</li>
                  <li>• Right to ask for official receipt for any legitimate fine</li>
                  <li>• Right to request supervisor or senior officer presence</li>
                  <li>• Right to file a complaint with anti-corruption bureau</li>
                </ul>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-green-50 border border-green-100' : 'bg-green-900/20 border border-green-900/30'}`}>
                <h5 className={`font-medium ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>
                  Recommended Actions
                </h5>
                <ul className={`text-sm mt-2 space-y-1 ${theme === 'light' ? 'text-green-600' : 'text-green-300'}`}>
                  <li>• Remain calm and polite throughout the interaction</li>
                  <li>• Ask for official citation and payment process</li>
                  <li>• Document the interaction if possible</li>
                  <li>• Note officer name, badge number, and location</li>
                  <li>• Report incident to anti-corruption helpline: 1064</li>
                </ul>
              </div>
            </div>
          );
        default:
          return (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-900/30'}`}>
                <h5 className={`font-medium ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                  General Rights During Police Interactions
                </h5>
                <ul className={`text-sm mt-2 space-y-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                  <li>• Right to be treated with dignity and respect</li>
                  <li>• Right to see officer's identification</li>
                  <li>• Right to know why you've been stopped</li>
                  <li>• Right to display digital copies of documents</li>
                  <li>• Right to not incriminate yourself</li>
                </ul>
              </div>
            </div>
          );
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Your Rights Information
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('type')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <div className={`p-3 rounded-lg mb-4 ${theme === 'light' ? 'bg-indigo-50 border border-indigo-100' : 'bg-indigo-900/20 border border-indigo-900/30'}`}>
              <div className="flex items-center mb-2">
                <Scale className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />
                <h4 className={`font-bold ${theme === 'light' ? 'text-indigo-700' : 'text-indigo-400'}`}>
                  Know Your Rights
                </h4>
              </div>
              <p className={`text-sm ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}>
                Understanding your legal rights can help you navigate police interactions effectively
                and protect yourself from potential issues.
              </p>
            </div>
            
            {getIssueSpecificRights()}
            
            <div className="mt-6">
              <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Digital Document Display
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <FileText className={`h-6 w-6 mb-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                  <span className="text-sm">Driving License</span>
                </Button>
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Car className={`h-6 w-6 mb-1 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                  <span className="text-sm">Vehicle Registration</span>
                </Button>
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Shield className={`h-6 w-6 mb-1 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                  <span className="text-sm">Insurance Certificate</span>
                </Button>
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <CheckSquare className={`h-6 w-6 mb-1 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                  <span className="text-sm">PUC Certificate</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleContinueToDocumentation}
            className={`${
              theme === 'light' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            Continue to Documentation
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Step 3: Interaction Documentation
  const renderInteractionDocumentation = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Document the Interaction
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('rights')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <div className={`p-3 rounded-lg mb-4 ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-900/30'}`}>
          <p className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
            Recording your interaction can help resolve disputes and provide evidence if needed.
            <strong> In most states, you are legally allowed to record police interactions.</strong>
          </p>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <Tabs defaultValue="record" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="record">Record</TabsTrigger>
                <TabsTrigger value="identify">Identify</TabsTrigger>
                <TabsTrigger value="report">Report</TabsTrigger>
              </TabsList>
              
              <TabsContent value="record" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Record the Interaction
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Audio/video recording with timestamp and location data.
                </p>
                
                <div className="flex flex-col items-center space-y-4">
                  <div 
                    className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer ${
                      isRecording
                      ? theme === 'light' ? 'bg-red-100 text-red-600' : 'bg-red-900/30 text-red-400'
                      : theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-700 text-gray-300'
                    }`}
                    onClick={toggleRecording}
                  >
                    <Mic className={`h-8 w-8 ${isRecording ? 'animate-pulse' : ''}`} />
                  </div>
                  <p className={`text-sm font-medium ${
                    isRecording
                    ? theme === 'light' ? 'text-red-600' : 'text-red-400'
                    : theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    {isRecording ? 'Recording... (Tap to stop)' : 'Tap to start recording'}
                  </p>
                  
                  {isRecording && (
                    <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Recording will be saved to your device
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button 
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center"
                  >
                    <Camera className={`h-5 w-5 mb-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                    <span className="text-xs">Take Photos</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center"
                  >
                    <FileText className={`h-5 w-5 mb-1 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                    <span className="text-xs">Note Details</span>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="identify" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Officer Identification
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Politely request and record officer information.
                </p>
                
                <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-900/30'}`}>
                  <h5 className={`font-medium ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                    Information to Request
                  </h5>
                  <ul className={`text-sm mt-2 space-y-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                    <li>• Officer's full name</li>
                    <li>• Badge/ID number</li>
                    <li>• Police station/jurisdiction</li>
                    <li>• Reason for the stop/detention</li>
                    <li>• Supervising officer's contact (if relevant)</li>
                  </ul>
                </div>
                
                <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-amber-50 border border-amber-100' : 'bg-amber-900/20 border border-amber-900/30'}`}>
                  <h5 className={`font-medium ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                    Suggested Phrasing
                  </h5>
                  <p className={`text-sm mt-1 ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                    "Officer, could I please have your name and badge number for my records?"
                  </p>
                  <p className={`text-sm mt-1 ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                    "May I know which police station you are from?"
                  </p>
                  <p className={`text-sm mt-1 ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                    "Could you please explain the specific reason I've been stopped?"
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="report" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Filing a Report
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  If necessary, document the interaction officially.
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    className={`h-14 justify-start ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'}`}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Create Detailed Report
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-14 justify-start"
                    onClick={handleContinueToEscalation}
                  >
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Get Escalation Assistance
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-14 justify-start"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    File Official Complaint
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleContinueToEscalation}
            className={`${
              theme === 'light' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            Continue to Escalation
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Step 4: Escalation Assistance
  const renderEscalationAssistance = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Escalation Assistance
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('documentation')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <h4 className={`font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Helpful Contacts
            </h4>
            
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-700/50 border border-gray-700'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Traffic Police Helpline
                    </h5>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      For traffic-related issues and complaints
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => window.open('tel:1095', '_self')}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    1095
                  </Button>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-700/50 border border-gray-700'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Police Control Room
                    </h5>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      For immediate police assistance
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => window.open('tel:100', '_self')}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    100
                  </Button>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-700/50 border border-gray-700'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Anti-Corruption Helpline
                    </h5>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      For reporting bribery and corruption
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => window.open('tel:1064', '_self')}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    1064
                  </Button>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-700/50 border border-gray-700'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Legal Aid Helpline
                    </h5>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      For free legal assistance
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => window.open('tel:15100', '_self')}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    15100
                  </Button>
                </div>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg mt-4 ${theme === 'light' ? 'bg-amber-50 border border-amber-100' : 'bg-amber-900/20 border border-amber-900/30'}`}>
              <h5 className={`font-medium ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                Witness Documentation
              </h5>
              <p className={`text-sm mt-1 ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                If there are witnesses to your interaction, politely ask for their contact information.
                Witnesses can provide valuable testimony if needed.
              </p>
              <Button 
                variant="outline"
                className={`mt-2 w-full ${theme === 'light' ? 'border-amber-200 text-amber-700' : 'border-amber-900 text-amber-400'}`}
              >
                Add Witness Information
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onGoBack}
          >
            Return to Emergency Categories
          </Button>
          
          <Button 
            className={`${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'}`}
            onClick={onGoBack}
          >
            Done
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Police Issue Assistance
          </h2>
          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Step {['type', 'rights', 'documentation', 'escalation'].indexOf(currentStep) + 1} of 4
          </span>
        </div>
        <Progress value={getTotalProgress()} className="h-2" />
      </div>
      
      {renderStepContent()}
    </div>
  );
}