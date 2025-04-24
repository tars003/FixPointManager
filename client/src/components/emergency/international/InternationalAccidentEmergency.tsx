import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Car, 
  Check, 
  Phone, 
  AlertTriangle,
  MapPin,
  Languages,
  Building,
  Camera,
  Mic,
  Video,
  FileText,
  ShieldAlert,
  Wrench
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface InternationalAccidentEmergencyProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  theme: 'light' | 'dark';
  onGoBack: () => void;
}

type AccidentEmergencyStep = 'type' | 'local' | 'actions' | 'document' | 'assistance';

export default function InternationalAccidentEmergency({ location, theme, onGoBack }: InternationalAccidentEmergencyProps) {
  const [currentStep, setCurrentStep] = useState<AccidentEmergencyStep>('type');
  const [accidentType, setAccidentType] = useState<string>('');
  const [country, setCountry] = useState<string>('default');
  const [safetyChecked, setSafetyChecked] = useState(false);
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
  const handleContinue = (nextStep: AccidentEmergencyStep) => {
    setCurrentStep(nextStep);
  };

  // Calculate total progress for the progress bar
  const getTotalProgress = (): number => {
    const steps = ['type', 'local', 'actions', 'document', 'assistance'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  // Handle accident type selection
  const handleTypeSelect = (type: string) => {
    setAccidentType(type);
  };

  // Handle continue to documentation step
  const handleContinueToDocumentation = () => {
    setCurrentStep('document');
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
        return renderAccidentType();
      case 'local':
        return renderLocalProtocol();
      case 'actions':
        return renderQuickActions();
      case 'document':
        return renderDocumentation();
      case 'assistance':
        return renderPostAccidentAssistance();
      default:
        return renderAccidentType();
    }
  };

  // Step 1: Select accident type
  const renderAccidentType = () => {
    const accidentTypes = [
      {
        id: 'collision',
        name: 'Vehicle Collision',
        icon: <Car className="h-8 w-8 mb-2" />,
        description: 'Collision with another vehicle on international roads'
      },
      {
        id: 'damage',
        name: 'Vehicle Damage',
        icon: <ShieldAlert className="h-8 w-8 mb-2" />,
        description: 'Damage to your vehicle while traveling abroad'
      },
      {
        id: 'breakdown',
        name: 'Serious Breakdown',
        icon: <Wrench className="h-8 w-8 mb-2" />,
        description: 'Major mechanical failure requiring assistance'
      },
      {
        id: 'injury',
        name: 'Accident with Injury',
        icon: <AlertTriangle className="h-8 w-8 mb-2" />,
        description: 'Accident involving injuries to any party'
      }
    ];

    const countries = [
      { code: 'default', name: 'Select Country' },
      { code: 'usa', name: 'United States' },
      { code: 'uk', name: 'United Kingdom' },
      { code: 'france', name: 'France' },
      { code: 'germany', name: 'Germany' },
      { code: 'italy', name: 'Italy' },
      { code: 'spain', name: 'Spain' },
      { code: 'japan', name: 'Japan' },
      { code: 'australia', name: 'Australia' },
      { code: 'uae', name: 'United Arab Emirates' },
      { code: 'singapore', name: 'Singapore' },
      { code: 'thailand', name: 'Thailand' },
      { code: 'malaysia', name: 'Malaysia' }
    ];

    return (
      <div className="space-y-6">
        <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          International Accident Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="country" className="block mb-2">Current Country</Label>
            <select 
              id="country"
              className={`w-full rounded-md ${
                theme === 'light' 
                  ? 'border-gray-300 bg-white text-gray-900' 
                  : 'border-gray-700 bg-gray-800 text-gray-100'
              } px-3 py-2`}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
            <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Select the country where the accident occurred to get local protocols
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {accidentTypes.map((type) => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                accidentType === type.id 
                  ? theme === 'light' 
                    ? 'border-2 border-red-500 bg-red-50' 
                    : 'border-2 border-red-500 bg-red-900/20' 
                  : theme === 'light'
                    ? 'border border-gray-200'
                    : 'bg-gray-800 border-gray-700'
              }`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`rounded-full p-3 ${
                  theme === 'light' 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-red-900/30 text-red-400'
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
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-red-700 hover:bg-red-800'
            }`}
            disabled={!accidentType || country === 'default'}
            onClick={() => handleContinue('local')}
          >
            Continue to Local Protocol
          </Button>
        </div>
      </div>
    );
  };

  // Step 2: Country-specific accident protocol
  const renderLocalProtocol = () => {
    // Different protocols based on selected country
    const protocols: Record<string, {title: string, steps: string[]}> = {
      'usa': {
        title: 'United States Protocol',
        steps: [
          'Call 911 for emergency assistance',
          'Exchange insurance information with all parties',
          'Take photos of all vehicles, damage, and the scene',
          'Report to police if damage exceeds $500 or there are injuries',
          'Contact your insurance company immediately',
          'Do not admit fault or discuss details with other parties'
        ]
      },
      'uk': {
        title: 'United Kingdom Protocol',
        steps: [
          'Call 999 for emergency assistance',
          'Exchange insurance and contact details with all involved parties',
          'Report the accident to police within 24 hours if anyone is injured',
          'Take photos of the scene, vehicle positions, and damage',
          'Do not move vehicles if there are injuries until police arrive',
          'Contact your insurance company as soon as possible'
        ]
      },
      'france': {
        title: 'France Protocol',
        steps: [
          'Call 112 for emergency assistance',
          'Complete the European Accident Statement form (Constat Amiable)',
          'Exchange details with all parties and get witness information',
          'Take photos of all vehicles, damage, and the scene',
          'Do not admit fault - just document facts',
          'Contact your insurance company within 5 days'
        ]
      },
      'default': {
        title: 'General International Protocol',
        steps: [
          'Call the local emergency number (usually 112 works in most countries)',
          'Document the accident scene with photos',
          'Exchange information with other parties (license, insurance, contact)',
          'Contact your insurance company immediately',
          'Contact the Indian Embassy or Consulate if needed',
          'Request an official accident report from local police'
        ]
      }
    };

    // Get protocol based on selected country or use default
    const protocol = protocols[country] || protocols.default;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            {protocol.title}
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
                ? 'bg-amber-50 border border-amber-100' 
                : 'bg-amber-900/20 border border-amber-900/30'
            }`}>
              <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                Local Legal Requirements
              </h4>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                Follow these required steps according to local laws:
              </p>
              <ol className={`space-y-2 text-sm ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                {protocol.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-blue-50 border border-blue-100' 
                : 'bg-blue-900/20 border border-blue-900/30'
            }`}>
              <h4 className={`font-bold mb-2 flex items-center ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                <Building className="h-5 w-5 mr-2" />
                Indian Embassy Assistance
              </h4>
              <p className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                The Indian Embassy or Consulate can provide:
              </p>
              <ul className={`mt-2 space-y-1 text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                <li>• Translation assistance with local authorities</li>
                <li>• Emergency contacts with local legal representatives</li>
                <li>• Coordination with your insurance provider in India</li>
                <li>• Emergency document verification or replacement</li>
              </ul>
              <Button 
                className={`w-full mt-3 ${
                  theme === 'light' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
                onClick={() => window.open('tel:+911800113090', '_self')}
              >
                <Building className="h-4 w-4 mr-2" />
                Contact Indian Embassy
              </Button>
            </div>
            
            <div>
              <h4 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Safety Confirmation
              </h4>
              <div className="flex items-center">
                <Checkbox 
                  id="safetyConfirm" 
                  checked={safetyChecked}
                  onCheckedChange={(checked) => setSafetyChecked(checked === true)}
                />
                <label
                  htmlFor="safetyConfirm"
                  className={`ml-2 text-sm font-medium ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                  }`}
                >
                  I confirm that everyone is safe and emergency services have been contacted if needed
                </label>
              </div>
            </div>
            
            <Button 
              className={`w-full mt-4 ${
                theme === 'light' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-red-700 hover:bg-red-800'
              }`}
              disabled={!safetyChecked}
              onClick={() => handleContinue('actions')}
            >
              Continue to Quick Actions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Step 3: Quick actions
  const renderQuickActions = () => {
    // Different emergency numbers based on country
    const emergencyNumbers: Record<string, string> = {
      'usa': '911',
      'uk': '999',
      'france': '112',
      'germany': '112',
      'italy': '112',
      'spain': '112',
      'japan': '110',
      'australia': '000',
      'uae': '999',
      'singapore': '999',
      'thailand': '191',
      'malaysia': '999',
      'default': '112'  // International emergency number
    };

    const emergencyNumber = emergencyNumbers[country] || emergencyNumbers.default;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Quick Actions
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('local')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-6 space-y-5">
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-red-50 border border-red-100' 
                : 'bg-red-900/20 border border-red-900/30'
            }`}>
              <h4 className={`font-bold text-lg mb-1 flex items-center ${
                theme === 'light' ? 'text-red-600' : 'text-red-400'
              }`}>
                <AlertTriangle className="h-5 w-5 mr-2" />
                Emergency Services
              </h4>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-red-500' : 'text-red-300'}`}>
                Call local emergency if you haven't already:
              </p>
              <Button 
                className={`w-full py-4 text-lg ${
                  theme === 'light' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-red-700 hover:bg-red-800'
                }`}
                onClick={() => window.open(`tel:${emergencyNumber}`, '_self')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Emergency ({emergencyNumber})
              </Button>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-blue-50 border border-blue-100' 
                : 'bg-blue-900/20 border border-blue-900/30'
            }`}>
              <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                <Languages className="h-5 w-5 inline-block mr-2" />
                Language Assistance
              </h4>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                Need help communicating with local authorities?
              </p>
              <Button 
                className={`w-full ${
                  theme === 'light' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                <Languages className="h-4 w-4 mr-2" />
                Translation Assistance
              </Button>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-green-50 border border-green-100' 
                : 'bg-green-900/20 border border-green-900/30'
            }`}>
              <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>
                <MapPin className="h-5 w-5 inline-block mr-2" />
                Share Your Location
              </h4>
              <p className={`text-sm mb-2 ${theme === 'light' ? 'text-green-600' : 'text-green-300'}`}>
                Share your exact location with emergency services or contacts:
              </p>
              <div className={`p-3 rounded ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}>
                <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {location.address}
                </p>
                <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Coordinates: {location.latitude}, {location.longitude}
                </p>
              </div>
              <Button 
                className={`w-full mt-3 ${
                  theme === 'light' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-green-700 hover:bg-green-800'
                }`}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Share My Location
              </Button>
            </div>
            
            <Button 
              className={`w-full ${
                theme === 'light' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-red-700 hover:bg-red-800'
              }`}
              onClick={handleContinueToDocumentation}
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
            International Accident Documentation
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
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Multimedia</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Verification</span>
              </div>
            </div>
            
            <Tabs defaultValue="photos" className="w-full" onValueChange={(value) => {
              switch(value) {
                case 'photos':
                  setDocumentProgress(25);
                  break;
                case 'ids':
                  setDocumentProgress(50);
                  break;
                case 'multimedia':
                  setDocumentProgress(75);
                  break;
                case 'verify':
                  setDocumentProgress(100);
                  break;
              }
            }}>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="ids">IDs & Docs</TabsTrigger>
                <TabsTrigger value="multimedia">Multimedia</TabsTrigger>
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
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Vehicle Damage</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Accident Scene</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Number Plates</span>
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
              
              <TabsContent value="ids" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Important Documents & Identification
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Capture all necessary documentation and identification for international incidents.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Passport/Visa</span>
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
                      <span>Driver's License</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Intl. Driving Permit</span>
                    </div>
                  </Button>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <Label htmlFor="insuranceInfo">Insurance Information</Label>
                    <Input type="text" id="insuranceInfo" placeholder="Insurance company name and policy number" />
                  </div>
                  <div>
                    <Label htmlFor="passportInfo">Passport Details</Label>
                    <Input type="text" id="passportInfo" placeholder="Passport number" />
                  </div>
                  <div>
                    <Label htmlFor="vehicleInfo">Rental/Vehicle Info</Label>
                    <Input type="text" id="vehicleInfo" placeholder="Rental company or vehicle registration details" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="multimedia" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Capture Multimedia Documentation
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Record additional information about the accident through text, audio, or video.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="textNote">Text Note</Label>
                    <div className="flex space-x-2">
                      <Textarea 
                        id="textNote" 
                        placeholder="Add a descriptive note about the accident..."
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
              
              <TabsContent value="verify" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Verification & Submission
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
                    <Check className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                    <span className={`font-medium ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                      Documentation Complete
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${theme === 'light' ? 'text-green-500' : 'text-green-300'}`}>
                    All necessary accident information has been collected
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg ${
                    theme === 'light' 
                      ? 'bg-gray-50 border border-gray-100' 
                      : 'bg-gray-800 border border-gray-700'
                  }`}>
                    <h5 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Documentation Summary:
                    </h5>
                    <ul className={`list-disc pl-5 mt-1 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      <li>{mediaCaptures.photos.length} photos captured</li>
                      <li>Vehicle & identification information recorded</li>
                      <li>{mediaCaptures.audio.length} audio recordings</li>
                      <li>{mediaCaptures.video.length} video clips</li>
                      <li>{mediaCaptures.notes.length} text notes</li>
                    </ul>
                  </div>
                </div>
                
                <Button 
                  className={`w-full ${
                    theme === 'light' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-red-700 hover:bg-red-800'
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

  // Step 5: Post-accident assistance
  const renderPostAccidentAssistance = () => {
    const services = [
      {
        name: "International SOS",
        type: "Emergency",
        distance: "Global",
        rating: 4.8,
        phone: "+12125551234"
      },
      {
        name: "Indian Embassy Assistance",
        type: "Consular",
        distance: "Country-wide",
        rating: 4.5,
        phone: "+911800113090"
      },
      {
        name: "Global Insurance Helpline",
        type: "Insurance",
        distance: "Global",
        rating: 4.3,
        phone: "+918001234567"
      },
      {
        name: "Translation Assistance",
        type: "Language",
        distance: "On-demand",
        rating: 4.7,
        phone: "+914567890123"
      }
    ];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            International Assistance
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('document')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <h4 className={`font-bold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              International Support Services
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
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-blue-900/30 text-blue-400'
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
                        ? 'border-blue-200 text-blue-600 hover:bg-blue-50' 
                        : 'border-blue-800 text-blue-400 hover:bg-blue-900/20'
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
                ? 'bg-amber-50 border border-amber-100' 
                : 'bg-amber-900/20 border border-amber-900/30'
            }`}>
              <h5 className={`font-medium mb-1 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                International Insurance Claim
              </h5>
              <p className={`text-sm ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                Remember to initiate your international travel insurance claim within 24 hours
              </p>
              <Button 
                className={`mt-2 w-full ${
                  theme === 'light' 
                    ? 'bg-amber-600 hover:bg-amber-700' 
                    : 'bg-amber-700 hover:bg-amber-800'
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
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-700 hover:bg-blue-800'
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
            International Vehicle Emergency
          </h2>
          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Step {['type', 'local', 'actions', 'document', 'assistance'].indexOf(currentStep) + 1} of 5
          </span>
        </div>
        <Progress value={getTotalProgress()} className="h-2" />
      </div>
      
      {renderStepContent()}
    </div>
  );
}