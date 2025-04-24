import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import {
  Car,
  CarCrash,
  CircleAlert, 
  FilePlus,
  Phone,
  Camera, 
  ArrowRight, 
  Check,
  Ambulance,
  BadgeAlert,
  ReceiptText,
  ArrowLeft
} from 'lucide-react';

interface AccidentEmergencyProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  theme: 'light' | 'dark';
  onGoBack: () => void;
}

type AccidentType = 'vehicle-vehicle' | 'single-vehicle' | 'pedestrian' | 'property' | '';
type AccidentStep = 'type' | 'safety' | 'actions' | 'document' | 'assistance';

export default function AccidentEmergency({ 
  location, 
  theme,
  onGoBack
}: AccidentEmergencyProps) {
  const [accidentType, setAccidentType] = useState<AccidentType>('');
  const [currentStep, setCurrentStep] = useState<AccidentStep>('type');
  const [safetyChecklist, setSafetyChecklist] = useState({
    isInSafePosition: false,
    hazardLightsOn: false,
    engineOff: false,
    warningTrianglePlaced: false
  });
  const [hasInjuries, setHasInjuries] = useState<boolean | null>(null);
  const [documentProgress, setDocumentProgress] = useState(0);
  
  // Progress calculation
  const getTotalProgress = () => {
    const stepValues = {
      type: 20,
      safety: 40,
      actions: 60,
      document: 80,
      assistance: 100
    };
    
    return stepValues[currentStep] || 0;
  };
  
  const handleAccidentTypeSelect = (type: AccidentType) => {
    setAccidentType(type);
    setCurrentStep('safety');
  };
  
  const handleSafetyChecked = (field: keyof typeof safetyChecklist) => {
    setSafetyChecklist(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  const handleSafetyContinue = () => {
    // Check if all safety items are checked
    const allChecked = Object.values(safetyChecklist).every(value => value);
    if (allChecked) {
      setCurrentStep('actions');
    } else {
      alert('Please complete all safety checks before continuing');
    }
  };
  
  const handleContinueToDocument = () => {
    setCurrentStep('document');
    // Simulate document upload progress
    setDocumentProgress(0);
    const interval = setInterval(() => {
      setDocumentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 600);
  };
  
  const handleContinueToAssistance = () => {
    setCurrentStep('assistance');
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return renderAccidentTypeSelection();
      case 'safety':
        return renderSafetyChecklist();
      case 'actions':
        return renderQuickActions();
      case 'document':
        return renderDocumentation();
      case 'assistance':
        return renderPostAccidentAssistance();
      default:
        return renderAccidentTypeSelection();
    }
  };
  
  // Step 1: Accident Type Selection
  const renderAccidentTypeSelection = () => {
    const types = [
      { 
        id: 'vehicle-vehicle', 
        name: 'Vehicle-Vehicle Collision', 
        description: 'Accident involving your vehicle and another vehicle',
        icon: <CarCrash className="h-8 w-8" />
      },
      { 
        id: 'single-vehicle', 
        name: 'Single Vehicle Accident', 
        description: 'Accident involving only your vehicle',
        icon: <Car className="h-8 w-8" />
      },
      { 
        id: 'pedestrian', 
        name: 'Pedestrian Involved', 
        description: 'Accident involving a pedestrian',
        icon: <CircleAlert className="h-8 w-8" />
      },
      { 
        id: 'property', 
        name: 'Property Damage Only', 
        description: 'Damage to property with no injuries',
        icon: <FilePlus className="h-8 w-8" />
      }
    ];
    
    return (
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Select Accident Type
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map(type => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all ${
                theme === 'light' 
                ? 'hover:border-red-200 hover:shadow-md' 
                : 'bg-gray-800 border-gray-700 hover:border-red-900'
              }`}
              onClick={() => handleAccidentTypeSelect(type.id as AccidentType)}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-red-100' : 'bg-red-900/30'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
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
  
  // Step 2: Safety Checklist
  const renderSafetyChecklist = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Safety First
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('type')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <div className={`p-3 rounded-lg mb-4 ${theme === 'light' ? 'bg-amber-50 border border-amber-100' : 'bg-amber-900/20 border border-amber-900/30'}`}>
              <h4 className={`font-bold mb-1 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                Important Safety Checklist
              </h4>
              <p className={`text-sm ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                Complete these safety steps to ensure your wellbeing and comply with legal requirements.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="safe-position" 
                  checked={safetyChecklist.isInSafePosition}
                  onCheckedChange={() => handleSafetyChecked('isInSafePosition')}
                  className={theme === 'light' ? 'data-[state=checked]:bg-green-600' : 'data-[state=checked]:bg-green-700'}
                />
                <div>
                  <Label 
                    htmlFor="safe-position" 
                    className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
                  >
                    Vehicle in safe position
                  </Label>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Move your vehicle to a safe area off the road if possible
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="hazard-lights" 
                  checked={safetyChecklist.hazardLightsOn}
                  onCheckedChange={() => handleSafetyChecked('hazardLightsOn')}
                  className={theme === 'light' ? 'data-[state=checked]:bg-green-600' : 'data-[state=checked]:bg-green-700'}
                />
                <div>
                  <Label 
                    htmlFor="hazard-lights" 
                    className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
                  >
                    Hazard lights turned on
                  </Label>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Turn on your hazard lights to alert other drivers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="engine-off" 
                  checked={safetyChecklist.engineOff}
                  onCheckedChange={() => handleSafetyChecked('engineOff')}
                  className={theme === 'light' ? 'data-[state=checked]:bg-green-600' : 'data-[state=checked]:bg-green-700'}
                />
                <div>
                  <Label 
                    htmlFor="engine-off" 
                    className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
                  >
                    Engine turned off
                  </Label>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Turn off the engine to prevent fire hazards
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="warning-triangle" 
                  checked={safetyChecklist.warningTrianglePlaced}
                  onCheckedChange={() => handleSafetyChecked('warningTrianglePlaced')}
                  className={theme === 'light' ? 'data-[state=checked]:bg-green-600' : 'data-[state=checked]:bg-green-700'}
                />
                <div>
                  <Label 
                    htmlFor="warning-triangle" 
                    className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
                  >
                    Warning triangle placed (if available)
                  </Label>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Place warning triangle 50m behind your vehicle on highways
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Injury Assessment
              </h4>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                Are there any injuries to you, passengers, or other parties?
              </p>
              
              <RadioGroup 
                value={hasInjuries === null ? undefined : hasInjuries ? 'yes' : 'no'}
                onValueChange={(value) => setHasInjuries(value === 'yes')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="yes" 
                    id="injuries-yes" 
                    className={theme === 'light' ? 'border-gray-300' : 'border-gray-600'}
                  />
                  <Label 
                    htmlFor="injuries-yes"
                    className={`font-medium ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}
                  >
                    Yes, there are injuries
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="no" 
                    id="injuries-no"
                    className={theme === 'light' ? 'border-gray-300' : 'border-gray-600'}
                  />
                  <Label 
                    htmlFor="injuries-no"
                    className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
                  >
                    No injuries
                  </Label>
                </div>
              </RadioGroup>
              
              {hasInjuries && (
                <div className={`mt-4 p-3 rounded-lg ${theme === 'light' ? 'bg-red-50 border border-red-100' : 'bg-red-900/20 border border-red-900/30'}`}>
                  <p className={`font-bold text-sm ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
                    Priority: Attend to injuries immediately
                  </p>
                  <p className={`text-sm mt-1 ${theme === 'light' ? 'text-red-500' : 'text-red-300'}`}>
                    Call emergency services (102 for ambulance) immediately for medical assistance.
                  </p>
                  <Button 
                    variant="destructive" 
                    className="mt-2 w-full"
                    onClick={() => window.open('tel:102', '_self')}
                  >
                    <Ambulance className="h-4 w-4 mr-2" />
                    Call Ambulance (102)
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSafetyContinue}
            className={`${
              theme === 'light' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-green-700 hover:bg-green-800'
            }`}
            disabled={!Object.values(safetyChecklist).every(value => value) || hasInjuries === null}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Step 3: Quick Actions
  const renderQuickActions = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Quick Actions
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('safety')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Call Police */}
          <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'} mb-3`}>
                  <BadgeAlert className={`h-8 w-8 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                </div>
                <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Call Police
                </h4>
                <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  For accidents with significant damage or injuries, police report is required
                </p>
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'}`}
                  onClick={() => window.open('tel:100', '_self')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Police (100)
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Document Accident */}
          <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-amber-100' : 'bg-amber-900/30'} mb-3`}>
                  <Camera className={`h-8 w-8 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                </div>
                <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Document Accident
                </h4>
                <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Take photos and collect information from all parties involved
                </p>
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-700 hover:bg-amber-800'}`}
                  onClick={handleContinueToDocument}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Notify Insurance */}
          <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-green-100' : 'bg-green-900/30'} mb-3`}>
                  <ReceiptText className={`h-8 w-8 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                </div>
                <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Notify Insurance
                </h4>
                <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Alert your insurance company about the accident
                </p>
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-700 hover:bg-green-800'}`}
                  onClick={() => window.open('tel:+911800226226', '_self')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Insurance
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Post-Accident Help */}
          <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-purple-100' : 'bg-purple-900/30'} mb-3`}>
                  <Car className={`h-8 w-8 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                </div>
                <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Post-Accident Help
                </h4>
                <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Get towing, repairs, and other post-accident assistance
                </p>
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-700 hover:bg-purple-800'}`}
                  onClick={handleContinueToAssistance}
                >
                  <Car className="h-4 w-4 mr-2" />
                  Find Assistance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  // Step 4: Documentation
  const renderDocumentation = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Accident Documentation
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('actions')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <div className="mb-6">
              <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Documentation Progress
              </h4>
              <Progress value={documentProgress} className="h-2" />
              <div className="flex justify-between mt-1 text-xs">
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Photos</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>IDs</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Vehicle Info</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Verification</span>
              </div>
            </div>
            
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="parties">Parties</TabsTrigger>
                <TabsTrigger value="damage">Damage</TabsTrigger>
                <TabsTrigger value="verify">Verify</TabsTrigger>
              </TabsList>
              
              <TabsContent value="photos" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Capture Photos of the Accident
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Take clear photos of all vehicles involved, the accident scene, and any damage.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Vehicle Damage</span>
                    </div>
                  </Button>
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Accident Scene</span>
                    </div>
                  </Button>
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Number Plates</span>
                    </div>
                  </Button>
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Road Conditions</span>
                    </div>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="parties" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Exchange Information with Other Parties
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Scan or take photos of documents from all parties involved in the accident.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Driving License</span>
                    </div>
                  </Button>
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Insurance Card</span>
                    </div>
                  </Button>
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Vehicle Registration</span>
                    </div>
                  </Button>
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Other Party Contact</span>
                    </div>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="damage" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Document Vehicle Damage
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Document specific damage to all vehicles involved in the accident.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Front Damage</span>
                    </div>
                  </Button>
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Rear Damage</span>
                    </div>
                  </Button>
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Side Damage</span>
                    </div>
                  </Button>
                  <Button className="h-24" variant="outline">
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Close-up Details</span>
                    </div>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="verify" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Verification and Submission
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Verify all collected information and submit the accident report.
                </p>
                
                <div className={`p-3 rounded-lg mb-3 ${theme === 'light' ? 'bg-green-50 border border-green-100' : 'bg-green-900/20 border border-green-900/30'}`}>
                  <div className="flex items-center">
                    <Check className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                    <span className={`font-medium ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                      Documentation Complete
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${theme === 'light' ? 'text-green-500' : 'text-green-300'}`}>
                    All necessary accident information has been collected
                  </p>
                </div>
                
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-700 hover:bg-green-800'}`}
                  onClick={handleContinueToAssistance}
                >
                  Submit and Continue to Assistance
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Step 5: Post-Accident Assistance
  const renderPostAccidentAssistance = () => {
    const services = [
      {
        name: "Bajaj Allianz Towing",
        type: "Towing",
        distance: "1.2 km",
        rating: 4.5,
        phone: "+911800226226"
      },
      {
        name: "ICICI Authorized Workshop",
        type: "Service Center",
        distance: "3.5 km",
        rating: 4.2,
        phone: "+911800209090"
      },
      {
        name: "QuickFix Mobile Repair",
        type: "Mobile Repair",
        distance: "On-demand",
        rating: 4.7,
        phone: "+919876543210"
      },
      {
        name: "City Car Rental",
        type: "Rental",
        distance: "5.3 km",
        rating: 4.3,
        phone: "+919988776655"
      }
    ];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Post-Accident Assistance
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('actions')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <h4 className={`font-bold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Nearby Services
            </h4>
            <div className="space-y-3">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg flex justify-between items-center border ${theme === 'light' ? 'border-gray-200 hover:bg-gray-50' : 'border-gray-700 hover:bg-gray-700/50'} transition-colors`}
                >
                  <div>
                    <h5 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      {service.name}
                    </h5>
                    <div className="flex items-center text-xs mt-1">
                      <span className={`px-2 py-0.5 rounded ${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400'}`}>
                        {service.type}
                      </span>
                      <span className={`ml-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {service.distance}
                      </span>
                      <span className={`ml-2 ${theme === 'light' ? 'text-amber-500' : 'text-amber-400'}`}>
                        ★ {service.rating}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`h-8 ${theme === 'light' ? 'border-blue-200 text-blue-600 hover:bg-blue-50' : 'border-blue-800 text-blue-400 hover:bg-blue-900/20'}`}
                    onClick={() => window.open(`tel:${service.phone}`, '_self')}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
              ))}
            </div>
            
            <div className={`p-3 rounded-lg mt-4 ${theme === 'light' ? 'bg-amber-50 border border-amber-100' : 'bg-amber-900/20 border border-amber-900/30'}`}>
              <h5 className={`font-medium mb-1 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                Insurance Claim Status
              </h5>
              <p className={`text-sm ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                Remember to initiate your insurance claim within 24 hours of the accident
              </p>
              <Button 
                className={`mt-2 w-full ${theme === 'light' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-700 hover:bg-amber-800'}`}
              >
                <ReceiptText className="h-4 w-4 mr-2" />
                Start Insurance Claim
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
            Accident Emergency
          </h2>
          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Step {['type', 'safety', 'actions', 'document', 'assistance'].indexOf(currentStep) + 1} of 5
          </span>
        </div>
        <Progress value={getTotalProgress()} className="h-2" />
      </div>
      
      {renderStepContent()}
    </div>
  );
}