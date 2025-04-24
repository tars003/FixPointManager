import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Heart, 
  Ambulance, 
  Phone, 
  AlertTriangle,
  Stethoscope,
  CalendarClock,
  Car,
  Mic,
  Video,
  FileText,
  Camera,
  Pill
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface MedicalEmergencyProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  theme: 'light' | 'dark';
  onGoBack: () => void;
}

type MedicalEmergencyStep = 'type' | 'assessment' | 'contact' | 'document' | 'assistance';

export default function MedicalEmergency({ location, theme, onGoBack }: MedicalEmergencyProps) {
  const [currentStep, setCurrentStep] = useState<MedicalEmergencyStep>('type');
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [documentProgress, setDocumentProgress] = useState(25); // Start with photos tab selected
  const [textNote, setTextNote] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [mediaCaptures, setMediaCaptures] = useState<{
    photos: string[];
    audio: string[];
    video: string[];
    notes: string[];
  }>({
    photos: [],
    audio: [],
    video: [],
    notes: []
  });

  // Handle continue to next step
  const handleContinue = (nextStep: MedicalEmergencyStep) => {
    setCurrentStep(nextStep);
  };

  // Calculate total progress for the progress bar
  const getTotalProgress = (): number => {
    const steps = ['type', 'assessment', 'contact', 'document', 'assistance'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  // Handle emergency type selection
  const handleTypeSelect = (type: string) => {
    setEmergencyType(type);
  };

  // Handle continue to assistance step
  const handleContinueToAssistance = () => {
    setCurrentStep('assistance');
  };

  // Handle adding a text note
  const handleAddTextNote = () => {
    if (textNote.trim()) {
      setMediaCaptures(prev => ({
        ...prev,
        notes: [...prev.notes, textNote]
      }));
      setTextNote('');
    }
  };

  // Toggle audio recording state
  const handleToggleAudioRecording = () => {
    setIsRecordingAudio(!isRecordingAudio);
    if (isRecordingAudio) {
      // Simulate saving an audio recording
      setMediaCaptures(prev => ({
        ...prev,
        audio: [...prev.audio, `audio_recording_${Date.now()}.mp3`]
      }));
    }
  };

  // Toggle video recording state
  const handleToggleVideoRecording = () => {
    setIsRecordingVideo(!isRecordingVideo);
    if (isRecordingVideo) {
      // Simulate saving a video recording
      setMediaCaptures(prev => ({
        ...prev,
        video: [...prev.video, `video_recording_${Date.now()}.mp4`]
      }));
    }
  };

  // Handle fake photo capture
  const handleCapturePhoto = () => {
    // Simulate taking a photo
    setMediaCaptures(prev => ({
      ...prev,
      photos: [...prev.photos, `photo_${Date.now()}.jpg`]
    }));
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return renderEmergencyType();
      case 'assessment':
        return renderInitialAssessment();
      case 'contact':
        return renderEmergencyContact();
      case 'document':
        return renderDocumentation();
      case 'assistance':
        return renderMedicalAssistance();
      default:
        return renderEmergencyType();
    }
  };

  // Step 1: Select medical emergency type
  const renderEmergencyType = () => {
    const emergencyTypes = [
      {
        id: 'injury',
        name: 'Injury / Accident',
        icon: <AlertTriangle className="h-8 w-8 mb-2" />,
        description: 'Physical injury from vehicle collision or accident'
      },
      {
        id: 'illness',
        name: 'Sudden Illness',
        icon: <Stethoscope className="h-8 w-8 mb-2" />,
        description: 'Sudden medical condition while driving or traveling'
      },
      {
        id: 'chronic',
        name: 'Chronic Condition',
        icon: <CalendarClock className="h-8 w-8 mb-2" />,
        description: 'Flare-up of existing medical condition requiring assistance'
      },
      {
        id: 'passenger',
        name: 'Passenger Emergency',
        icon: <Car className="h-8 w-8 mb-2" />,
        description: 'Medical emergency affecting a vehicle passenger'
      }
    ];

    return (
      <div className="space-y-6">
        <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Select Medical Emergency Type
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyTypes.map((type) => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                emergencyType === type.id 
                  ? theme === 'light' 
                    ? 'border-2 border-pink-500 bg-pink-50' 
                    : 'border-2 border-pink-500 bg-pink-900/20' 
                  : theme === 'light'
                    ? 'border border-gray-200'
                    : 'bg-gray-800 border-gray-700'
              }`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`rounded-full p-3 ${
                  theme === 'light' 
                    ? 'bg-pink-100 text-pink-600' 
                    : 'bg-pink-900/30 text-pink-400'
                }`}>
                  {type.icon}
                </div>
                <h4 className={`font-bold mt-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  {type.name}
                </h4>
                <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  {type.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onGoBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Categories
          </Button>
          
          <Button 
            className={`${
              theme === 'light' 
                ? 'bg-pink-600 hover:bg-pink-700' 
                : 'bg-pink-700 hover:bg-pink-800'
            }`}
            disabled={!emergencyType}
            onClick={() => handleContinue('assessment')}
          >
            Continue to Assessment
          </Button>
        </div>
      </div>
    );
  };

  // Step 2: Initial medical assessment
  const renderInitialAssessment = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Initial Medical Assessment
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('type')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-6 space-y-4">
            <div>
              <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Condition Severity
              </h4>
              <RadioGroup defaultValue="moderate" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="critical" id="critical" />
                  <Label htmlFor="critical" className={`font-medium ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
                    Critical (Life-threatening)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="severe" />
                  <Label htmlFor="severe" className={`font-medium ${theme === 'light' ? 'text-orange-600' : 'text-orange-400'}`}>
                    Severe (Urgent medical attention)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate" className={`font-medium ${theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                    Moderate (Needs medical attention)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mild" id="mild" />
                  <Label htmlFor="mild" className={`font-medium ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                    Mild (Non-urgent attention)
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="pt-2">
              <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Primary Symptoms
              </h4>
              <div className="space-y-2">
                {['Pain', 'Bleeding', 'Difficulty breathing', 'Unconsciousness', 'Dizziness', 'Nausea', 'Confusion', 'Other'].map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox id={`symptom-${symptom}`} />
                    <label
                      htmlFor={`symptom-${symptom}`}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                      }`}
                    >
                      {symptom}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Additional Notes
              </h4>
              <Textarea 
                placeholder="Describe any additional symptoms or important medical information"
                className="min-h-[100px]"
              />
            </div>
            
            <Button 
              className={`w-full mt-4 ${
                theme === 'light' 
                  ? 'bg-pink-600 hover:bg-pink-700' 
                  : 'bg-pink-700 hover:bg-pink-800'
              }`}
              onClick={() => {
                setAssessmentCompleted(true);
                handleContinue('contact');
              }}
            >
              Complete Assessment & Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Step 3: Emergency contact
  const renderEmergencyContact = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Contact Emergency Services
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('assessment')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-6">
            <div className={`p-4 rounded-lg mb-4 ${
              theme === 'light' 
                ? 'bg-red-50 border border-red-100' 
                : 'bg-red-900/20 border border-red-900/30'
            }`}>
              <h4 className={`font-bold text-lg mb-1 flex items-center ${
                theme === 'light' ? 'text-red-600' : 'text-red-400'
              }`}>
                <AlertTriangle className="h-5 w-5 mr-2" />
                For Life-Threatening Emergencies
              </h4>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-red-500' : 'text-red-300'}`}>
                If this is a critical emergency, call for an ambulance immediately:
              </p>
              <Button 
                className={`w-full py-6 text-lg ${
                  theme === 'light' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-red-700 hover:bg-red-800'
                }`}
                onClick={() => window.open('tel:102', '_self')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Ambulance (102)
              </Button>
            </div>
            
            <div className="space-y-4 mt-6">
              <h4 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Other Medical Services
              </h4>
              
              <div className={`p-3 rounded-lg flex justify-between items-center border ${
                theme === 'light' 
                  ? 'border-gray-200 hover:bg-gray-50' 
                  : 'border-gray-700 hover:bg-gray-700/50'
              } transition-colors`}>
                <div>
                  <h5 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    National Health Helpline
                  </h5>
                  <div className="text-xs mt-1">
                    <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>
                      Health advice and guidance
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${
                    theme === 'light' 
                      ? 'border-pink-200 text-pink-600 hover:bg-pink-50' 
                      : 'border-pink-800 text-pink-400 hover:bg-pink-900/20'
                  }`}
                  onClick={() => window.open('tel:1800180511', '_self')}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
              </div>
              
              <div className={`p-3 rounded-lg flex justify-between items-center border ${
                theme === 'light' 
                  ? 'border-gray-200 hover:bg-gray-50' 
                  : 'border-gray-700 hover:bg-gray-700/50'
              } transition-colors`}>
                <div>
                  <h5 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Roadside Medical Assistance
                  </h5>
                  <div className="text-xs mt-1">
                    <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>
                      Medical help specifically for travelers
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${
                    theme === 'light' 
                      ? 'border-pink-200 text-pink-600 hover:bg-pink-50' 
                      : 'border-pink-800 text-pink-400 hover:bg-pink-900/20'
                  }`}
                  onClick={() => window.open('tel:108', '_self')}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
              </div>
              
              <div className={`p-3 rounded-lg flex justify-between items-center border ${
                theme === 'light' 
                  ? 'border-gray-200 hover:bg-gray-50' 
                  : 'border-gray-700 hover:bg-gray-700/50'
              } transition-colors`}>
                <div>
                  <h5 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Poison Control Center
                  </h5>
                  <div className="text-xs mt-1">
                    <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>
                      For poisoning or substance exposure
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${
                    theme === 'light' 
                      ? 'border-pink-200 text-pink-600 hover:bg-pink-50' 
                      : 'border-pink-800 text-pink-400 hover:bg-pink-900/20'
                  }`}
                  onClick={() => window.open('tel:18004119900', '_self')}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
              </div>
            </div>
            
            <Button 
              className={`w-full mt-6 ${
                theme === 'light' 
                  ? 'bg-pink-600 hover:bg-pink-700' 
                  : 'bg-pink-700 hover:bg-pink-800'
              }`}
              onClick={() => handleContinue('document')}
            >
              Continue to Documentation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Step 4: Documentation
  const renderDocumentation = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Medical Documentation
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('contact')}>
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
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Records</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Multimedia</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Summary</span>
              </div>
            </div>
            
            <Tabs defaultValue="photos" className="w-full" onValueChange={(value) => {
              switch(value) {
                case 'photos':
                  setDocumentProgress(25);
                  break;
                case 'records':
                  setDocumentProgress(50);
                  break;
                case 'multimedia':
                  setDocumentProgress(75);
                  break;
                case 'summary':
                  setDocumentProgress(100);
                  break;
              }
            }}>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="records">Records</TabsTrigger>
                <TabsTrigger value="multimedia">Multimedia</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="photos" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Capture Photos of the Medical Situation
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Take clear photos of any visible injuries, medical ID cards, or relevant medical information.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Medical ID</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Insurance Card</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Visible Injuries</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Medication</span>
                    </div>
                  </Button>
                </div>
                
                {mediaCaptures.photos.length > 0 && (
                  <div className="mt-4">
                    <h5 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Captured Photos ({mediaCaptures.photos.length})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {mediaCaptures.photos.map((photo, index) => (
                        <div 
                          key={index}
                          className={`p-2 rounded text-xs ${
                            theme === 'light' 
                              ? 'bg-gray-100 text-gray-700' 
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          Photo {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="records" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Medical Records & Information
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Fill in any relevant medical information to share with emergency services.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Input type="text" id="allergies" placeholder="List any allergies..." />
                  </div>
                  
                  <div>
                    <Label htmlFor="medications">Current Medications</Label>
                    <Input type="text" id="medications" placeholder="List medications..." />
                  </div>
                  
                  <div>
                    <Label htmlFor="conditions">Pre-existing Conditions</Label>
                    <Input type="text" id="conditions" placeholder="List medical conditions..." />
                  </div>
                  
                  <div>
                    <Label htmlFor="bloodType">Blood Type (if known)</Label>
                    <select id="bloodType" className={`w-full rounded-md border ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-gray-700 bg-gray-800 text-gray-100'
                    } px-3 py-2 text-sm`}>
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="multimedia" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Capture Multimedia Documentation
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Record additional information about the medical emergency through text, audio, or video.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="textNote">Text Note</Label>
                    <div className="flex space-x-2">
                      <Textarea 
                        id="textNote" 
                        placeholder="Add a descriptive note about the situation..."
                        value={textNote}
                        onChange={(e) => setTextNote(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleAddTextNote}
                        disabled={!textNote.trim()}
                        className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label>Audio Recording</Label>
                    <Button 
                      variant={isRecordingAudio ? "destructive" : "default"}
                      onClick={handleToggleAudioRecording}
                      className={isRecordingAudio 
                        ? "" 
                        : theme === 'light' 
                          ? 'bg-amber-600 hover:bg-amber-700' 
                          : 'bg-amber-700 hover:bg-amber-800'
                      }
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      {isRecordingAudio ? "Stop Recording" : "Start Audio Recording"}
                    </Button>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label>Video Recording</Label>
                    <Button 
                      variant={isRecordingVideo ? "destructive" : "default"}
                      onClick={handleToggleVideoRecording}
                      className={isRecordingVideo 
                        ? "" 
                        : theme === 'light' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-green-700 hover:bg-green-800'
                      }
                    >
                      <Video className="h-4 w-4 mr-2" />
                      {isRecordingVideo ? "Stop Recording" : "Start Video Recording"}
                    </Button>
                  </div>
                  
                  {/* Captured media display */}
                  <div className="space-y-3 mt-4">
                    {mediaCaptures.notes.length > 0 && (
                      <div>
                        <h5 className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          Text Notes ({mediaCaptures.notes.length})
                        </h5>
                        <div className={`p-3 rounded ${
                          theme === 'light' 
                            ? 'bg-gray-100' 
                            : 'bg-gray-700'
                        }`}>
                          {mediaCaptures.notes.map((note, index) => (
                            <div 
                              key={index}
                              className={`mb-2 pb-2 ${
                                index < mediaCaptures.notes.length - 1 
                                  ? theme === 'light' 
                                    ? 'border-b border-gray-200' 
                                    : 'border-b border-gray-600'
                                  : ''
                              }`}
                            >
                              <p className={`text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                                {note}
                              </p>
                              <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                Note {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {mediaCaptures.audio.length > 0 && (
                      <div>
                        <h5 className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          Audio Recordings ({mediaCaptures.audio.length})
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {mediaCaptures.audio.map((audio, index) => (
                            <div 
                              key={index}
                              className={`p-2 rounded flex items-center ${
                                theme === 'light' 
                                  ? 'bg-amber-100 text-amber-700' 
                                  : 'bg-amber-900/30 text-amber-400'
                              }`}
                            >
                              <Mic className="h-3 w-3 mr-1" />
                              <span className="text-xs">Recording {index + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {mediaCaptures.video.length > 0 && (
                      <div>
                        <h5 className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          Video Recordings ({mediaCaptures.video.length})
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {mediaCaptures.video.map((video, index) => (
                            <div 
                              key={index}
                              className={`p-2 rounded flex items-center ${
                                theme === 'light' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-green-900/30 text-green-400'
                              }`}
                            >
                              <Video className="h-3 w-3 mr-1" />
                              <span className="text-xs">Video {index + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="summary" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Documentation Summary
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Review your documentation before proceeding to medical assistance options.
                </p>
                
                <div className={`p-3 rounded-lg mb-3 ${
                  theme === 'light' 
                    ? 'bg-green-50 border border-green-100' 
                    : 'bg-green-900/20 border border-green-900/30'
                }`}>
                  <div className="flex items-center">
                    <Heart className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                    <span className={`font-medium ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                      Medical Documentation Complete
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${theme === 'light' ? 'text-green-500' : 'text-green-300'}`}>
                    All necessary medical information has been collected
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg ${
                    theme === 'light' 
                      ? 'bg-gray-50 border border-gray-100' 
                      : 'bg-gray-800 border border-gray-700'
                  }`}>
                    <h5 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Media Items Captured:
                    </h5>
                    <ul className={`list-disc pl-5 mt-1 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      <li>{mediaCaptures.photos.length} photos</li>
                      <li>{mediaCaptures.audio.length} audio recordings</li>
                      <li>{mediaCaptures.video.length} video clips</li>
                      <li>{mediaCaptures.notes.length} text notes</li>
                    </ul>
                  </div>
                </div>
                
                <Button 
                  className={`w-full ${
                    theme === 'light' 
                      ? 'bg-pink-600 hover:bg-pink-700' 
                      : 'bg-pink-700 hover:bg-pink-800'
                  }`}
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

  // Step 5: Medical assistance
  const renderMedicalAssistance = () => {
    const services = [
      {
        name: "Apollo Emergency Care",
        type: "Hospital",
        distance: "2.3 km",
        rating: 4.7,
        phone: "+911234567890"
      },
      {
        name: "Fortis Ambulance Service",
        type: "Ambulance",
        distance: "On-call",
        rating: 4.8,
        phone: "+919876543210"
      },
      {
        name: "MedExpress Mobile Clinic",
        type: "Mobile Clinic",
        distance: "On-demand",
        rating: 4.5,
        phone: "+918765432109"
      },
      {
        name: "City Heart & Trauma Center",
        type: "Specialty Care",
        distance: "4.1 km",
        rating: 4.6,
        phone: "+917654321098"
      }
    ];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Medical Assistance
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('document')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <h4 className={`font-bold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Nearby Medical Services
            </h4>
            <div className="space-y-3">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg flex justify-between items-center border ${
                    theme === 'light' 
                      ? 'border-gray-200 hover:bg-gray-50' 
                      : 'border-gray-700 hover:bg-gray-700/50'
                  } transition-colors`}
                >
                  <div>
                    <h5 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      {service.name}
                    </h5>
                    <div className="flex items-center text-xs mt-1">
                      <span className={`px-2 py-0.5 rounded ${
                        theme === 'light' 
                          ? 'bg-pink-100 text-pink-700' 
                          : 'bg-pink-900/30 text-pink-400'
                      }`}>
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
                    className={`h-8 ${
                      theme === 'light' 
                        ? 'border-pink-200 text-pink-600 hover:bg-pink-50' 
                        : 'border-pink-800 text-pink-400 hover:bg-pink-900/20'
                    }`}
                    onClick={() => window.open(`tel:${service.phone}`, '_self')}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
              ))}
            </div>
            
            <div className={`p-3 rounded-lg mt-4 ${
              theme === 'light' 
                ? 'bg-blue-50 border border-blue-100' 
                : 'bg-blue-900/20 border border-blue-900/30'
            }`}>
              <h5 className={`font-medium mb-1 ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                Medical Insurance Claim
              </h5>
              <p className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                Remember to initiate your medical insurance claim as soon as possible
              </p>
              <Button 
                className={`mt-2 w-full ${
                  theme === 'light' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                <Heart className="h-4 w-4 mr-2" />
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
            className={`${
              theme === 'light' 
                ? 'bg-pink-600 hover:bg-pink-700' 
                : 'bg-pink-700 hover:bg-pink-800'
            }`}
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
            Medical Emergency
          </h2>
          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Step {['type', 'assessment', 'contact', 'document', 'assistance'].indexOf(currentStep) + 1} of 5
          </span>
        </div>
        <Progress value={getTotalProgress()} className="h-2" />
      </div>
      
      {renderStepContent()}
    </div>
  );
}