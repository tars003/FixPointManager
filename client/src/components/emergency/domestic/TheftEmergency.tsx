import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  LockKeyhole, 
  FileText, 
  Phone, 
  AlertTriangle,
  Car,
  ShieldCheck,
  Workflow,
  Key,
  Mic,
  Video,
  Camera,
  UserRoundSearch
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface TheftEmergencyProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  theme: 'light' | 'dark';
  onGoBack: () => void;
}

type TheftEmergencyStep = 'type' | 'police' | 'document' | 'trace' | 'assistance';

export default function TheftEmergency({ location, theme, onGoBack }: TheftEmergencyProps) {
  const [currentStep, setCurrentStep] = useState<TheftEmergencyStep>('type');
  const [theftType, setTheftType] = useState<string>('');
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
  const handleContinue = (nextStep: TheftEmergencyStep) => {
    setCurrentStep(nextStep);
  };

  // Calculate total progress for the progress bar
  const getTotalProgress = (): number => {
    const steps = ['type', 'police', 'document', 'trace', 'assistance'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  // Handle theft type selection
  const handleTypeSelect = (type: string) => {
    setTheftType(type);
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
        return renderTheftType();
      case 'police':
        return renderPoliceReport();
      case 'document':
        return renderDocumentation();
      case 'trace':
        return renderTraceOptions();
      case 'assistance':
        return renderTheftAssistance();
      default:
        return renderTheftType();
    }
  };

  // Step 1: Select theft emergency type
  const renderTheftType = () => {
    const theftTypes = [
      {
        id: 'vehicle',
        name: 'Vehicle Theft',
        icon: <Car className="h-8 w-8 mb-2" />,
        description: 'Complete vehicle stolen or missing'
      },
      {
        id: 'parts',
        name: 'Vehicle Parts Theft',
        icon: <Key className="h-8 w-8 mb-2" />,
        description: 'Components, wheels, catalytic converter, etc. stolen'
      },
      {
        id: 'breakin',
        name: 'Vehicle Break-in',
        icon: <LockKeyhole className="h-8 w-8 mb-2" />,
        description: 'Vehicle broken into, items stolen from inside'
      },
      {
        id: 'carjacking',
        name: 'Carjacking Incident',
        icon: <AlertTriangle className="h-8 w-8 mb-2" />,
        description: 'Vehicle taken through force or threat'
      }
    ];

    return (
      <div className="space-y-6">
        <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Select Theft Type
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {theftTypes.map((type) => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                theftType === type.id 
                  ? theme === 'light' 
                    ? 'border-2 border-purple-500 bg-purple-50' 
                    : 'border-2 border-purple-500 bg-purple-900/20' 
                  : theme === 'light'
                    ? 'border border-gray-200'
                    : 'bg-gray-800 border-gray-700'
              }`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`rounded-full p-3 ${
                  theme === 'light' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-purple-900/30 text-purple-400'
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
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-purple-700 hover:bg-purple-800'
            }`}
            disabled={!theftType}
            onClick={() => handleContinue('police')}
          >
            Continue to Police Report
          </Button>
        </div>
      </div>
    );
  };

  // Step 2: Police report
  const renderPoliceReport = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Police Report
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('type')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-6 space-y-4">
            <div className={`p-4 rounded-lg mb-4 ${
              theme === 'light' 
                ? 'bg-red-50 border border-red-100' 
                : 'bg-red-900/20 border border-red-900/30'
            }`}>
              <h4 className={`font-bold text-lg mb-1 flex items-center ${
                theme === 'light' ? 'text-red-600' : 'text-red-400'
              }`}>
                <AlertTriangle className="h-5 w-5 mr-2" />
                Report to Police Immediately
              </h4>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-red-500' : 'text-red-300'}`}>
                For any vehicle theft, file a police report as soon as possible:
              </p>
              <Button 
                className={`w-full py-6 text-lg ${
                  theme === 'light' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-red-700 hover:bg-red-800'
                }`}
                onClick={() => window.open('tel:100', '_self')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Police (100)
              </Button>
            </div>
            
            <div className="space-y-4">
              <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                File FIR Online
              </h4>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                You can also file an FIR (First Information Report) online through the official police portal:
              </p>
              <Button 
                className={`w-full ${
                  theme === 'light' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                File Online FIR
              </Button>
              
              <div className={`p-4 rounded-lg mt-4 ${
                theme === 'light' 
                  ? 'bg-amber-50 border border-amber-100' 
                  : 'bg-amber-900/20 border border-amber-900/30'
              }`}>
                <h5 className={`font-medium ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                  Information to Include in Police Report:
                </h5>
                <ul className={`list-disc pl-5 mt-2 text-sm space-y-1 ${
                  theme === 'light' ? 'text-amber-600' : 'text-amber-300'
                }`}>
                  <li>Vehicle details (make, model, color, year)</li>
                  <li>Registration number and VIN/chassis number</li>
                  <li>Time and location of the theft</li>
                  <li>Any identifying features or modifications</li>
                  <li>Whether the keys were with the vehicle</li>
                  <li>Details of any witnesses or CCTV cameras nearby</li>
                </ul>
              </div>
            </div>
            
            <Button 
              className={`w-full mt-4 ${
                theme === 'light' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-purple-700 hover:bg-purple-800'
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

  // Step 3: Documentation
  const renderDocumentation = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Theft Documentation
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('police')}>
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
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Documents</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Photos</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Multimedia</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Summary</span>
              </div>
            </div>
            
            <Tabs defaultValue="documents" className="w-full" onValueChange={(value) => {
              switch(value) {
                case 'documents':
                  setDocumentProgress(25);
                  break;
                case 'photos':
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
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="multimedia">Multimedia</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Vehicle Documentation
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Fill in important vehicle details for the police report and insurance claim.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input type="text" id="registrationNumber" placeholder="e.g., MH02AB1234" />
                  </div>
                  
                  <div>
                    <Label htmlFor="vinNumber">VIN/Chassis Number</Label>
                    <Input type="text" id="vinNumber" placeholder="17-character VIN" />
                  </div>
                  
                  <div>
                    <Label htmlFor="insurancePolicy">Insurance Policy Number</Label>
                    <Input type="text" id="insurancePolicy" placeholder="e.g., POL123456789" />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastSeen">Last Seen Date & Time</Label>
                    <Input type="datetime-local" id="lastSeen" />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastLocation">Last Known Location</Label>
                    <Input type="text" id="lastLocation" value={location.address} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="photos" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Capture Photos
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Take photos of relevant documents, the theft location, and any evidence.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>RC Book</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Insurance Papers</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Theft Location</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Evidence</span>
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
              
              <TabsContent value="multimedia" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Capture Multimedia Documentation
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Record additional information about the theft through text, audio, or video.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="textNote">Text Note</Label>
                    <div className="flex space-x-2">
                      <Textarea 
                        id="textNote" 
                        placeholder="Add notes about the theft (e.g., suspicious activity noticed, etc.)"
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
                  Review your documentation before proceeding to tracing options.
                </p>
                
                <div className={`p-3 rounded-lg mb-3 ${
                  theme === 'light' 
                    ? 'bg-green-50 border border-green-100' 
                    : 'bg-green-900/20 border border-green-900/30'
                }`}>
                  <div className="flex items-center">
                    <ShieldCheck className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                    <span className={`font-medium ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                      Theft Documentation Complete
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${theme === 'light' ? 'text-green-500' : 'text-green-300'}`}>
                    All necessary theft information has been collected
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
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-purple-700 hover:bg-purple-800'
                  }`}
                  onClick={() => handleContinue('trace')}
                >
                  Continue to Tracing Options
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Step 4: Trace options
  const renderTraceOptions = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Vehicle Tracing Options
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('document')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-6 space-y-5">
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-purple-50 border border-purple-100' 
                : 'bg-purple-900/20 border border-purple-900/30'
            }`}>
              <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>
                <UserRoundSearch className="h-5 w-5 inline-block mr-2" />
                Report to Vehicle Theft Database
              </h4>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-purple-500' : 'text-purple-300'}`}>
                Register your stolen vehicle with national theft databases to improve recovery chances:
              </p>
              <Button 
                className={`w-full ${
                  theme === 'light' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-purple-700 hover:bg-purple-800'
                }`}
              >
                Register in National Database
              </Button>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-blue-50 border border-blue-100' 
                : 'bg-blue-900/20 border border-blue-900/30'
            }`}>
              <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                <Workflow className="h-5 w-5 inline-block mr-2" />
                GPS Tracking Recovery
              </h4>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-blue-500' : 'text-blue-300'}`}>
                If your vehicle has a GPS tracker installed, activate emergency tracking:
              </p>
              <RadioGroup defaultValue="none">
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="internal" id="internal" />
                  <Label htmlFor="internal" className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    Use Built-in Vehicle Tracker
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="fastad" id="fastad" />
                  <Label htmlFor="fastad" className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    Use FASTag Tracking
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external" className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    Use Aftermarket GPS Device
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    No GPS Device Installed
                  </Label>
                </div>
              </RadioGroup>
              <Button 
                className={`w-full mt-3 ${
                  theme === 'light' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                Activate Vehicle Tracking
              </Button>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-amber-50 border border-amber-100' 
                : 'bg-amber-900/20 border border-amber-900/30'
            }`}>
              <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`}>
                <AlertTriangle className="h-5 w-5 inline-block mr-2" />
                Important Steps
              </h4>
              <div className={`space-y-2 text-sm ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                <div className="flex items-start">
                  <Checkbox id="blockFastag" className="mt-1" />
                  <Label htmlFor="blockFastag" className="ml-2">
                    Block your FASTag account to prevent unauthorized toll payments
                  </Label>
                </div>
                <div className="flex items-start">
                  <Checkbox id="informInsurance" className="mt-1" />
                  <Label htmlFor="informInsurance" className="ml-2">
                    Inform your insurance company about the theft
                  </Label>
                </div>
                <div className="flex items-start">
                  <Checkbox id="rtoInform" className="mt-1" />
                  <Label htmlFor="rtoInform" className="ml-2">
                    Inform RTO about the vehicle theft to prevent misuse
                  </Label>
                </div>
                <div className="flex items-start">
                  <Checkbox id="socialMedia" className="mt-1" />
                  <Label htmlFor="socialMedia" className="ml-2">
                    Share information on community watch groups and social media
                  </Label>
                </div>
              </div>
            </div>
            
            <Button 
              className={`w-full ${
                theme === 'light' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-purple-700 hover:bg-purple-800'
              }`}
              onClick={handleContinueToAssistance}
            >
              Continue to Assistance
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Step 5: Theft assistance
  const renderTheftAssistance = () => {
    const services = [
      {
        name: "Theft Investigation Cell",
        type: "Police",
        distance: "Central",
        rating: 4.2,
        phone: "+911800110011"
      },
      {
        name: "Vehicle Identification Unit",
        type: "Govt Agency",
        distance: "District",
        rating: 4.1,
        phone: "+911800220022"
      },
      {
        name: "Insurance Claim Assistance",
        type: "Service",
        distance: "On-call",
        rating: 4.4,
        phone: "+919876543210"
      },
      {
        name: "Legal Aid for Vehicle Theft",
        type: "Legal",
        distance: "3.5 km",
        rating: 4.3,
        phone: "+917654321098"
      }
    ];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Theft Assistance
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('trace')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <h4 className={`font-bold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Helpful Services
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
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-purple-900/30 text-purple-400'
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
                        ? 'border-purple-200 text-purple-600 hover:bg-purple-50' 
                        : 'border-purple-800 text-purple-400 hover:bg-purple-900/20'
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
                Insurance Claim Status
              </h5>
              <p className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                Remember to initiate your insurance claim within 24 hours of filing the police report
              </p>
              <Button 
                className={`mt-2 w-full ${
                  theme === 'light' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
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
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-purple-700 hover:bg-purple-800'
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
            Theft Emergency
          </h2>
          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Step {['type', 'police', 'document', 'trace', 'assistance'].indexOf(currentStep) + 1} of 5
          </span>
        </div>
        <Progress value={getTotalProgress()} className="h-2" />
      </div>
      
      {renderStepContent()}
    </div>
  );
}