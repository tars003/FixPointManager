import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  CloudRain,
  Waves,
  Mountain,
  Flame,
  Wind,
  MapIcon,
  Car,
  Mic,
  Video,
  FileText,
  Camera,
  Route
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface NaturalDisasterEmergencyProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  theme: 'light' | 'dark';
  onGoBack: () => void;
}

type DisasterEmergencyStep = 'type' | 'safety' | 'routes' | 'document' | 'assistance';

export default function NaturalDisasterEmergency({ location, theme, onGoBack }: NaturalDisasterEmergencyProps) {
  const [currentStep, setCurrentStep] = useState<DisasterEmergencyStep>('type');
  const [disasterType, setDisasterType] = useState<string>('');
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
  const handleContinue = (nextStep: DisasterEmergencyStep) => {
    setCurrentStep(nextStep);
  };

  // Calculate total progress for the progress bar
  const getTotalProgress = (): number => {
    const steps = ['type', 'safety', 'routes', 'document', 'assistance'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  // Handle disaster type selection
  const handleTypeSelect = (type: string) => {
    setDisasterType(type);
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
        return renderDisasterType();
      case 'safety':
        return renderSafetyInstructions();
      case 'routes':
        return renderEvacuationRoutes();
      case 'document':
        return renderDocumentation();
      case 'assistance':
        return renderDisasterAssistance();
      default:
        return renderDisasterType();
    }
  };

  // Step 1: Select natural disaster type
  const renderDisasterType = () => {
    const disasterTypes = [
      {
        id: 'flood',
        name: 'Flood / Heavy Rain',
        icon: <CloudRain className="h-8 w-8 mb-2" />,
        description: 'Heavy rainfall, waterlogging, or flooding'
      },
      {
        id: 'landslide',
        name: 'Landslide',
        icon: <Mountain className="h-8 w-8 mb-2" />,
        description: 'Landslides or mudslides blocking roads'
      },
      {
        id: 'fire',
        name: 'Wildfire / Forest Fire',
        icon: <Flame className="h-8 w-8 mb-2" />,
        description: 'Forest fires or wildfires affecting roads'
      },
      {
        id: 'cyclone',
        name: 'Cyclone / Strong Winds',
        icon: <Wind className="h-8 w-8 mb-2" />,
        description: 'Cyclonic storms, high winds, or visibility issues'
      }
    ];

    return (
      <div className="space-y-6">
        <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Select Natural Disaster Type
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {disasterTypes.map((type) => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                disasterType === type.id 
                  ? theme === 'light' 
                    ? 'border-2 border-amber-500 bg-amber-50' 
                    : 'border-2 border-amber-500 bg-amber-900/20' 
                  : theme === 'light'
                    ? 'border border-gray-200'
                    : 'bg-gray-800 border-gray-700'
              }`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`rounded-full p-3 ${
                  theme === 'light' 
                    ? 'bg-amber-100 text-amber-600' 
                    : 'bg-amber-900/30 text-amber-400'
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
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-amber-700 hover:bg-amber-800'
            }`}
            disabled={!disasterType}
            onClick={() => handleContinue('safety')}
          >
            Continue to Safety Instructions
          </Button>
        </div>
      </div>
    );
  };

  // Step 2: Safety instructions
  const renderSafetyInstructions = () => {
    const floodInstructions = [
      "Move to higher ground immediately if water levels are rising",
      "Don't drive through flooded roads - 6 inches of water can cause loss of control",
      "Switch off electrical equipment if water is entering the vehicle",
      "If trapped in a vehicle during flash flood, abandon if possible and move uphill",
      "Follow evacuation routes and ignore 'shortcuts' through unfamiliar areas"
    ];
    
    const landslideInstructions = [
      "Watch for falling rocks or debris on roadways, especially around hills",
      "Listen for unusual sounds like trees cracking or boulders knocking together",
      "If driving when a landslide occurs, watch for collapsed pavement, mud, fallen rocks",
      "Be alert for any sudden increase or decrease in water flow across roads",
      "If trapped, stay in your vehicle if possible - it provides shelter from debris"
    ];
    
    const fireInstructions = [
      "Keep windows and vents closed to prevent smoke from entering your vehicle",
      "Turn on headlights and hazard lights to improve visibility in smoke",
      "If trapped by fire, park in an area clear of vegetation, close all windows",
      "Stay low to the ground if smoke is dense to breathe cleaner air",
      "Follow emergency vehicle directions and evacuate early if authorities advise"
    ];
    
    const cycloneInstructions = [
      "Avoid driving during high winds - vehicles can be easily toppled",
      "Be cautious around trees, power lines, and unsecured objects that may fall",
      "Maintain a safe distance from other vehicles as strong winds can push them",
      "If caught in a severe storm, park away from trees and power lines",
      "Listen to emergency broadcasts for road closures and evacuation orders"
    ];
    
    let safetyInstructions = floodInstructions;
    let disasterTitle = "Flood Safety";
    let disasterIcon = <CloudRain className="h-5 w-5 mr-2" />;
    
    switch (disasterType) {
      case 'flood':
        safetyInstructions = floodInstructions;
        disasterTitle = "Flood Safety";
        disasterIcon = <CloudRain className="h-5 w-5 mr-2" />;
        break;
      case 'landslide':
        safetyInstructions = landslideInstructions;
        disasterTitle = "Landslide Safety";
        disasterIcon = <Mountain className="h-5 w-5 mr-2" />;
        break;
      case 'fire':
        safetyInstructions = fireInstructions;
        disasterTitle = "Wildfire Safety";
        disasterIcon = <Flame className="h-5 w-5 mr-2" />;
        break;
      case 'cyclone':
        safetyInstructions = cycloneInstructions;
        disasterTitle = "Cyclone Safety";
        disasterIcon = <Wind className="h-5 w-5 mr-2" />;
        break;
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Safety Instructions
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('type')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-6 space-y-4">
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-red-50 border border-red-100' 
                : 'bg-red-900/20 border border-red-900/30'
            }`}>
              <h4 className={`font-bold text-lg mb-3 flex items-center ${
                theme === 'light' ? 'text-red-600' : 'text-red-400'
              }`}>
                <AlertTriangle className="h-5 w-5 mr-2" />
                Emergency Hotline
              </h4>
              <Button 
                className={`w-full py-4 text-lg ${
                  theme === 'light' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-red-700 hover:bg-red-800'
                }`}
                onClick={() => window.open('tel:1078', '_self')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Disaster Management (1078)
              </Button>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-amber-50 border border-amber-100' 
                : 'bg-amber-900/20 border border-amber-900/30'
            }`}>
              <h4 className={`font-bold flex items-center ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                {disasterIcon}
                {disasterTitle}
              </h4>
              <p className={`text-sm mt-1 mb-3 ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                Follow these critical safety instructions for your current situation:
              </p>
              <ul className={`space-y-3 ${theme === 'light' ? 'text-amber-700' : 'text-amber-300'}`}>
                {safetyInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Safety Checklist
              </h4>
              {["I'm in a safe location", "Vehicle is secure", "I've informed family/friends of my situation", "I'm following official guidance"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox id={`safety-${item}`} />
                  <label
                    htmlFor={`safety-${item}`}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                    }`}
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
            
            <Button 
              className={`w-full mt-4 ${
                theme === 'light' 
                  ? 'bg-amber-600 hover:bg-amber-700' 
                  : 'bg-amber-700 hover:bg-amber-800'
              }`}
              onClick={() => handleContinue('routes')}
            >
              Continue to Evacuation Routes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Step 3: Evacuation routes
  const renderEvacuationRoutes = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Evacuation Routes
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('safety')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-6 space-y-4">
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-blue-50 border border-blue-100' 
                : 'bg-blue-900/20 border border-blue-900/30'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className={`font-bold ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                  <MapIcon className="h-5 w-5 inline-block mr-2" />
                  Current Location
                </h4>
                <Button 
                  size="sm" 
                  variant="outline"
                  className={`h-8 ${
                    theme === 'light' 
                      ? 'border-blue-200 text-blue-600 hover:bg-blue-50' 
                      : 'border-blue-800 text-blue-400 hover:bg-blue-900/20'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  Refresh
                </Button>
              </div>
              <p className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                {location.address}
              </p>
              <div className={`w-full h-40 rounded-lg mt-3 flex items-center justify-center ${
                theme === 'light' 
                  ? 'bg-gray-100 text-gray-500' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                <MapIcon className="h-8 w-8 mr-2 opacity-50" />
                <span>Map View</span>
              </div>
            </div>
            
            <div>
              <h4 className={`font-medium mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Safe Routes Available
              </h4>
              
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border ${
                  theme === 'light' 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-green-900/30 bg-green-900/10'
                }`}>
                  <div className="flex items-start">
                    <div className={`rounded-full p-2 mt-1 ${
                      theme === 'light' 
                        ? 'bg-green-100' 
                        : 'bg-green-900/30'
                    }`}>
                      <Route className={`h-4 w-4 ${
                        theme === 'light' ? 'text-green-600' : 'text-green-400'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <h5 className={`font-medium text-sm ${
                        theme === 'light' ? 'text-green-700' : 'text-green-400'
                      }`}>
                        Primary Evacuation Route
                      </h5>
                      <p className={`text-xs mt-1 ${
                        theme === 'light' ? 'text-green-600' : 'text-green-300'
                      }`}>
                        Via NH-48, towards Mysore Road - 12 km to safe zone
                      </p>
                      <div className="flex mt-2">
                        <Button 
                          size="sm"
                          className={`h-7 text-xs mr-2 ${
                            theme === 'light' 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-green-700 hover:bg-green-800'
                          }`}
                        >
                          Navigate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`h-7 text-xs ${
                            theme === 'light' 
                              ? 'border-green-200 text-green-600' 
                              : 'border-green-800 text-green-400'
                          }`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg border ${
                  theme === 'light' 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-blue-900/30 bg-blue-900/10'
                }`}>
                  <div className="flex items-start">
                    <div className={`rounded-full p-2 mt-1 ${
                      theme === 'light' 
                        ? 'bg-blue-100' 
                        : 'bg-blue-900/30'
                    }`}>
                      <Route className={`h-4 w-4 ${
                        theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <h5 className={`font-medium text-sm ${
                        theme === 'light' ? 'text-blue-700' : 'text-blue-400'
                      }`}>
                        Alternative Route
                      </h5>
                      <p className={`text-xs mt-1 ${
                        theme === 'light' ? 'text-blue-600' : 'text-blue-300'
                      }`}>
                        Via SH-17, towards Tumkur Road - 15 km to safe zone
                      </p>
                      <div className="flex mt-2">
                        <Button 
                          size="sm"
                          className={`h-7 text-xs mr-2 ${
                            theme === 'light' 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'bg-blue-700 hover:bg-blue-800'
                          }`}
                        >
                          Navigate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`h-7 text-xs ${
                            theme === 'light' 
                              ? 'border-blue-200 text-blue-600' 
                              : 'border-blue-800 text-blue-400'
                          }`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg border ${
                  theme === 'light' 
                    ? 'border-amber-200 bg-amber-50' 
                    : 'border-amber-900/30 bg-amber-900/10'
                }`}>
                  <div className="flex items-start">
                    <div className={`rounded-full p-2 mt-1 ${
                      theme === 'light' 
                        ? 'bg-amber-100' 
                        : 'bg-amber-900/30'
                    }`}>
                      <Route className={`h-4 w-4 ${
                        theme === 'light' ? 'text-amber-600' : 'text-amber-400'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <h5 className={`font-medium text-sm ${
                        theme === 'light' ? 'text-amber-700' : 'text-amber-400'
                      }`}>
                        Emergency Backup Route
                      </h5>
                      <p className={`text-xs mt-1 ${
                        theme === 'light' ? 'text-amber-600' : 'text-amber-300'
                      }`}>
                        Via local roads to nearest shelter - 5 km
                      </p>
                      <div className="flex mt-2">
                        <Button 
                          size="sm"
                          className={`h-7 text-xs mr-2 ${
                            theme === 'light' 
                              ? 'bg-amber-600 hover:bg-amber-700' 
                              : 'bg-amber-700 hover:bg-amber-800'
                          }`}
                        >
                          Navigate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`h-7 text-xs ${
                            theme === 'light' 
                              ? 'border-amber-200 text-amber-600' 
                              : 'border-amber-800 text-amber-400'
                          }`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              className={`w-full mt-2 ${
                theme === 'light' 
                  ? 'bg-amber-600 hover:bg-amber-700' 
                  : 'bg-amber-700 hover:bg-amber-800'
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
            Disaster Documentation
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('routes')}>
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
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Details</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Multimedia</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Summary</span>
              </div>
            </div>
            
            <Tabs defaultValue="photos" className="w-full" onValueChange={(value) => {
              switch(value) {
                case 'photos':
                  setDocumentProgress(25);
                  break;
                case 'details':
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
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="multimedia">Multimedia</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="photos" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Capture Photos of the Situation
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Take clear photos of the natural disaster conditions for insurance and reporting.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Weather Conditions</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Road Conditions</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Vehicle Status</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Surroundings</span>
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
              
              <TabsContent value="details" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Disaster & Vehicle Details
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Provide information about the disaster situation and your vehicle.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="disasterIntensity">Disaster Intensity</Label>
                    <select id="disasterIntensity" className={`w-full rounded-md border ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-gray-700 bg-gray-800 text-gray-100'
                    } px-3 py-2 text-sm`}>
                      <option value="">Select Intensity</option>
                      <option value="mild">Mild - Caution Needed</option>
                      <option value="moderate">Moderate - Limited Mobility</option>
                      <option value="severe">Severe - Significant Risk</option>
                      <option value="extreme">Extreme - Immediate Danger</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="vehicleStatus">Current Vehicle Status</Label>
                    <select id="vehicleStatus" className={`w-full rounded-md border ${
                      theme === 'light'
                        ? 'border-gray-300 bg-white text-gray-900'
                        : 'border-gray-700 bg-gray-800 text-gray-100'
                    } px-3 py-2 text-sm`}>
                      <option value="">Select Status</option>
                      <option value="operational">Fully Operational</option>
                      <option value="limited">Limited Mobility</option>
                      <option value="stuck">Stuck but Undamaged</option>
                      <option value="damaged">Damaged</option>
                      <option value="immobile">Completely Immobile</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="occupants">Number of Occupants</Label>
                    <Input 
                      type="number" 
                      id="occupants" 
                      placeholder="How many people in the vehicle?"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="resources">Available Resources</Label>
                    <div className="space-y-2 mt-1">
                      {['Food and water', 'First aid kit', 'Emergency tools', 'Extra fuel', 'Communication device'].map((resource) => (
                        <div key={resource} className="flex items-center space-x-2">
                          <Checkbox id={`resource-${resource}`} />
                          <label
                            htmlFor={`resource-${resource}`}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                            }`}
                          >
                            {resource}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="situationNote">Situation Notes</Label>
                    <Textarea 
                      id="situationNote" 
                      placeholder="Describe the current situation in detail..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="multimedia" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Capture Multimedia Documentation
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Record additional information about the disaster situation through text, audio, or video.
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
                  Review your documentation before proceeding to assistance options.
                </p>
                
                <div className={`p-3 rounded-lg mb-3 ${
                  theme === 'light' 
                    ? 'bg-green-50 border border-green-100' 
                    : 'bg-green-900/20 border border-green-900/30'
                }`}>
                  <div className="flex items-center">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                    <span className={`font-medium ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                      Disaster Documentation Complete
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${theme === 'light' ? 'text-green-500' : 'text-green-300'}`}>
                    All necessary disaster information has been collected
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
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'bg-amber-700 hover:bg-amber-800'
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

  // Step 5: Disaster assistance
  const renderDisasterAssistance = () => {
    const services = [
      {
        name: "District Disaster Management",
        type: "Govt Agency",
        distance: "Central",
        rating: 4.5,
        phone: "+911070"
      },
      {
        name: "Emergency Rescue Team",
        type: "Rescue",
        distance: "On-call",
        rating: 4.9,
        phone: "+911078"
      },
      {
        name: "Highway Patrol & Response",
        type: "Police",
        distance: "Mobile",
        rating: 4.3,
        phone: "+91100"
      },
      {
        name: "Nearest Relief Camp",
        type: "Shelter",
        distance: "7.5 km",
        rating: 4.4,
        phone: "+919876543210"
      }
    ];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Disaster Assistance
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('document')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <h4 className={`font-bold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Emergency Services
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
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-amber-900/30 text-amber-400'
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
                        ? 'border-amber-200 text-amber-600 hover:bg-amber-50' 
                        : 'border-amber-800 text-amber-400 hover:bg-amber-900/20'
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
                Initiate an insurance claim for any damage caused by the natural disaster
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
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-amber-700 hover:bg-amber-800'
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
            Natural Disaster Emergency
          </h2>
          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Step {['type', 'safety', 'routes', 'document', 'assistance'].indexOf(currentStep) + 1} of 5
          </span>
        </div>
        <Progress value={getTotalProgress()} className="h-2" />
      </div>
      
      {renderStepContent()}
    </div>
  );
}