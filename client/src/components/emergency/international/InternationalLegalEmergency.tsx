import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Scale, 
  Phone, 
  AlertTriangle,
  FileText,
  Languages,
  Building,
  Camera,
  Mic,
  Video,
  Shield,
  UserRoundSearch
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface InternationalLegalEmergencyProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  theme: 'light' | 'dark';
  onGoBack: () => void;
}

type LegalEmergencyStep = 'situation' | 'rights' | 'translation' | 'document' | 'assistance';

export default function InternationalLegalEmergency({ location, theme, onGoBack }: InternationalLegalEmergencyProps) {
  const [currentStep, setCurrentStep] = useState<LegalEmergencyStep>('situation');
  const [situationType, setSituationType] = useState<string>('');
  const [country, setCountry] = useState<string>('default');
  const [documentProgress, setDocumentProgress] = useState(25);
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
  const handleContinue = (nextStep: LegalEmergencyStep) => {
    setCurrentStep(nextStep);
  };

  // Calculate total progress for the progress bar
  const getTotalProgress = (): number => {
    const steps = ['situation', 'rights', 'translation', 'document', 'assistance'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  // Handle situation type selection
  const handleSituationSelect = (type: string) => {
    setSituationType(type);
  };

  // Handle continue to documentation step
  const handleContinueToDocument = () => {
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
      case 'situation':
        return renderSituationType();
      case 'rights':
        return renderRights();
      case 'translation':
        return renderTranslation();
      case 'document':
        return renderDocumentation();
      case 'assistance':
        return renderLegalAssistance();
      default:
        return renderSituationType();
    }
  };

  // Step 1: Select legal situation type
  const renderSituationType = () => {
    const situationTypes = [
      {
        id: 'police',
        name: 'Police Interaction',
        icon: <Shield className="h-8 w-8 mb-2" />,
        description: 'Dealing with local police or authorities'
      },
      {
        id: 'checkpoint',
        name: 'Border/Checkpoint Issue',
        icon: <UserRoundSearch className="h-8 w-8 mb-2" />,
        description: 'Problems at checkpoints or borders'
      },
      {
        id: 'violation',
        name: 'Traffic Violation',
        icon: <AlertTriangle className="h-8 w-8 mb-2" />,
        description: 'Ticketing or violations in foreign countries'
      },
      {
        id: 'paperwork',
        name: 'Document Problem',
        icon: <FileText className="h-8 w-8 mb-2" />,
        description: 'Issues with vehicle or personal documentation'
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
          International Legal Situation
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
              Select the country where the legal issue is occurring
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {situationTypes.map((type) => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                situationType === type.id 
                  ? theme === 'light' 
                    ? 'border-2 border-blue-500 bg-blue-50' 
                    : 'border-2 border-blue-500 bg-blue-900/20' 
                  : theme === 'light'
                    ? 'border border-gray-200'
                    : 'bg-gray-800 border-gray-700'
              }`}
              onClick={() => handleSituationSelect(type.id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`rounded-full p-3 ${
                  theme === 'light' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-blue-900/30 text-blue-400'
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
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-700 hover:bg-blue-800'
            }`}
            disabled={!situationType || country === 'default'}
            onClick={() => handleContinue('rights')}
          >
            Continue to Rights Information
          </Button>
        </div>
      </div>
    );
  };

  // Step 2: Know your rights
  const renderRights = () => {
    // Different rights info based on selected country
    const rightsInfo: Record<string, {title: string, rights: string[]}> = {
      'usa': {
        title: "Your Rights in the United States",
        rights: [
          "Right to remain silent and not answer questions",
          "Right to refuse consent to a search of yourself or your vehicle",
          "Right to consult with an attorney before speaking to police",
          "Right to consular assistance as a foreign national",
          "Right to be told why you're being detained or arrested",
          "Right to an interpreter if you don't speak English fluently"
        ]
      },
      'uk': {
        title: "Your Rights in the United Kingdom",
        rights: [
          "Right to know why you're being stopped or questioned",
          "Right to legal advice before answering questions",
          "Right to consular notification and access",
          "Right to an interpreter if needed",
          "Right to refuse personal searches unless police have reasonable grounds",
          "Right to be informed of any offenses you're suspected of committing"
        ]
      },
      'france': {
        title: "Your Rights in France",
        rights: [
          "Right to consular notification and assistance",
          "Right to an interpreter during questioning",
          "Right to medical assistance if needed",
          "Right to have a lawyer present during questioning",
          "Right to make telephone calls to notify family",
          "Right to know the charges against you"
        ]
      },
      'default': {
        title: "Universal Traveler Rights",
        rights: [
          "Right to consular notification and assistance",
          "Right to be treated with respect and dignity",
          "Right to know why you are being detained or questioned",
          "Right to an interpreter if you don't speak the local language",
          "Right to contact your embassy or consulate",
          "Right to essential medical care if needed"
        ]
      }
    };

    // Get rights based on selected country or use default
    const rights = rightsInfo[country] || rightsInfo.default;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            {rights.title}
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('situation')}>
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
              <h4 className={`font-bold mb-2 flex items-center ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                <Scale className="h-5 w-5 mr-2" />
                Know Your Rights
              </h4>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                As an Indian citizen traveling abroad, you have certain rights:
              </p>
              <ul className={`space-y-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                {rights.rights.map((right, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="mr-2">•</span>
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-amber-50 border border-amber-100' 
                : 'bg-amber-900/20 border border-amber-900/30'
            }`}>
              <h4 className={`font-bold mb-2 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                Important Advice
              </h4>
              <ul className={`space-y-2 text-sm ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Always be polite and cooperative, but know your rights</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Do not sign any documents you don't understand</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Ask for an interpreter if you need one</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Request contact with the Indian Embassy/Consulate</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Take notes on officer names, badge numbers, and details</span>
                </li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-indigo-50 border border-indigo-100' 
                : 'bg-indigo-900/20 border border-indigo-900/30'
            }`}>
              <h4 className={`font-bold mb-2 flex items-center ${theme === 'light' ? 'text-indigo-700' : 'text-indigo-400'}`}>
                <Building className="h-5 w-5 mr-2" />
                Embassy Contact Information
              </h4>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}>
                Indian Embassy Emergency Hotline: +91 1800-11-3090
              </p>
              <Button 
                className={`w-full ${
                  theme === 'light' 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-indigo-700 hover:bg-indigo-800'
                }`}
                onClick={() => window.open('tel:+911800113090', '_self')}
              >
                <Building className="h-4 w-4 mr-2" />
                Contact Indian Embassy
              </Button>
            </div>
            
            <Button 
              className={`w-full mt-4 ${
                theme === 'light' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
              onClick={() => handleContinue('translation')}
            >
              Continue to Translation Assistance
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Step 3: Translation assistance
  const renderTranslation = () => {
    // Common phrases in different languages
    const phrases = [
      {
        category: "Basic",
        translations: [
          { phrase: "I need help", translations: { english: "I need help", spanish: "Necesito ayuda", french: "J'ai besoin d'aide", german: "Ich brauche Hilfe" } },
          { phrase: "I am a tourist", translations: { english: "I am a tourist", spanish: "Soy turista", french: "Je suis touriste", german: "Ich bin Tourist" } },
          { phrase: "I don't understand", translations: { english: "I don't understand", spanish: "No entiendo", french: "Je ne comprends pas", german: "Ich verstehe nicht" } }
        ]
      },
      {
        category: "Legal",
        translations: [
          { phrase: "I want to contact my embassy", translations: { english: "I want to contact my embassy", spanish: "Quiero contactar a mi embajada", french: "Je veux contacter mon ambassade", german: "Ich möchte meine Botschaft kontaktieren" } },
          { phrase: "I need an interpreter", translations: { english: "I need an interpreter", spanish: "Necesito un intérprete", french: "J'ai besoin d'un interprète", german: "Ich brauche einen Dolmetscher" } },
          { phrase: "I don't consent to a search", translations: { english: "I don't consent to a search", spanish: "No doy mi consentimiento para un registro", french: "Je ne consens pas à une fouille", german: "Ich stimme keiner Durchsuchung zu" } }
        ]
      },
      {
        category: "Vehicle",
        translations: [
          { phrase: "This is my driver's license", translations: { english: "This is my driver's license", spanish: "Este es mi permiso de conducir", french: "Voici mon permis de conduire", german: "Dies ist mein Führerschein" } },
          { phrase: "This is my car registration", translations: { english: "This is my car registration", spanish: "Este es el registro de mi coche", french: "Voici la carte grise de ma voiture", german: "Dies ist meine Fahrzeugschein" } },
          { phrase: "I have international insurance", translations: { english: "I have international insurance", spanish: "Tengo seguro internacional", french: "J'ai une assurance internationale", german: "Ich habe eine internationale Versicherung" } }
        ]
      }
    ];
    
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Translation Assistance
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('rights')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Languages className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                <h4 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Key Phrases
                </h4>
              </div>
              <select 
                className={`text-sm px-2 py-1 rounded ${
                  theme === 'light' 
                    ? 'bg-white border border-gray-200' 
                    : 'bg-gray-800 border border-gray-700 text-gray-200'
                }`}
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>
            
            {phrases.map((category, index) => (
              <div key={index} className="mb-4">
                <h5 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {category.category} Phrases
                </h5>
                <div className="space-y-2">
                  {category.translations.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className={`p-3 rounded-lg border ${
                        theme === 'light' 
                          ? 'border-gray-200 bg-gray-50' 
                          : 'border-gray-700 bg-gray-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            {item.phrase}
                          </p>
                          <p className={`mt-1 text-sm font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                            {item.translations[selectedLanguage as keyof typeof item.translations]}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-8 px-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
                          onClick={() => {
                            navigator.clipboard.writeText(item.translations[selectedLanguage as keyof typeof item.translations]);
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className={`p-4 rounded-lg ${
              theme === 'light' 
                ? 'bg-green-50 border border-green-100' 
                : 'bg-green-900/20 border border-green-900/30'
            }`}>
              <h5 className={`font-medium mb-2 ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>
                Live Translation Support
              </h5>
              <p className={`text-sm mb-3 ${theme === 'light' ? 'text-green-600' : 'text-green-300'}`}>
                Need real-time language assistance for complex situations?
              </p>
              <Button 
                className={`w-full ${
                  theme === 'light' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-green-700 hover:bg-green-800'
                }`}
              >
                <Languages className="h-4 w-4 mr-2" />
                Connect to Live Translator
              </Button>
            </div>
            
            <Button 
              className={`w-full mt-4 ${
                theme === 'light' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
              onClick={handleContinueToDocument}
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
            Legal Documentation
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('translation')}>
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
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Documents</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Multimedia</span>
                <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Verification</span>
              </div>
            </div>
            
            <Tabs defaultValue="photos" className="w-full" onValueChange={(value) => {
              switch(value) {
                case 'photos':
                  setDocumentProgress(25);
                  break;
                case 'documents':
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
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="multimedia">Multimedia</TabsTrigger>
                <TabsTrigger value="verify">Verify</TabsTrigger>
              </TabsList>
              
              <TabsContent value="photos" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Capture Photos of the Situation
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Take clear photos of any relevant details of your legal situation.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Badge/ID of Officer</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Legal Documents</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Location/Scene</span>
                    </div>
                  </Button>
                  <Button 
                    className="h-24" 
                    variant="outline"
                    onClick={handleCapturePhoto}
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-6 w-6 mb-2" />
                      <span>Other Evidence</span>
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
              
              <TabsContent value="documents" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Legal Document Information
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Record details of official documents or citations issued.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="officerInfo">Officer Information</Label>
                    <Input type="text" id="officerInfo" placeholder="Name, badge number, department, etc." />
                  </div>
                  <div>
                    <Label htmlFor="documentType">Document Type</Label>
                    <select 
                      id="documentType" 
                      className={`w-full rounded-md ${
                        theme === 'light' 
                          ? 'border-gray-300 bg-white text-gray-900' 
                          : 'border-gray-700 bg-gray-800 text-gray-100'
                      } px-3 py-2`}
                    >
                      <option value="">Select Document Type</option>
                      <option value="citation">Traffic Citation/Ticket</option>
                      <option value="warning">Written Warning</option>
                      <option value="notice">Court Notice/Summons</option>
                      <option value="report">Police Report</option>
                      <option value="fine">Fine/Penalty Notice</option>
                      <option value="other">Other Official Document</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="referenceNum">Reference/Case Number</Label>
                    <Input type="text" id="referenceNum" placeholder="Reference or case number on document" />
                  </div>
                  <div>
                    <Label htmlFor="issueDate">Issue Date & Time</Label>
                    <Input type="datetime-local" id="issueDate" />
                  </div>
                  <div>
                    <Label htmlFor="documentDetails">Document Details</Label>
                    <Textarea id="documentDetails" placeholder="Details of the charges, violations, or information contained in the document" className="min-h-[100px]" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="multimedia" className="mt-4 space-y-4">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Capture Multimedia Documentation
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Record additional information through text, audio, or video.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="textNote">Text Note</Label>
                    <div className="flex space-x-2">
                      <Textarea 
                        id="textNote" 
                        placeholder="Add a descriptive note about the legal situation..."
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
                  Verification & Next Steps
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Review your documentation and determine next legal steps.
                </p>
                
                <div className={`p-3 rounded-lg mb-3 ${
                  theme === 'light' 
                    ? 'bg-green-50 border border-green-100' 
                    : 'bg-green-900/20 border border-green-900/30'
                }`}>
                  <div className="flex items-start">
                    <Scale className={`h-5 w-5 mt-0.5 mr-2 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                    <div>
                      <span className={`font-medium ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                        Documentation Complete
                      </span>
                      <p className={`text-sm ${theme === 'light' ? 'text-green-500' : 'text-green-300'}`}>
                        All necessary legal information has been collected
                      </p>
                    </div>
                  </div>
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
                      <li>Legal document information recorded</li>
                      <li>{mediaCaptures.audio.length} audio recordings</li>
                      <li>{mediaCaptures.video.length} video clips</li>
                      <li>{mediaCaptures.notes.length} text notes</li>
                    </ul>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${
                    theme === 'light' 
                      ? 'bg-blue-50 border border-blue-100' 
                      : 'bg-blue-900/20 border border-blue-900/30'
                  }`}>
                    <h5 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
                      Next Steps Recommendations:
                    </h5>
                    <RadioGroup defaultValue="embassy">
                      <div className="flex items-start space-x-2 mb-2">
                        <RadioGroupItem id="embassy" value="embassy" className="mt-1" />
                        <div>
                          <Label htmlFor="embassy" className={`font-medium ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
                            Contact Indian Embassy
                          </Label>
                          <p className={`text-xs ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                            Get consular assistance for your specific situation
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 mb-2">
                        <RadioGroupItem id="lawyer" value="lawyer" className="mt-1" />
                        <div>
                          <Label htmlFor="lawyer" className={`font-medium ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
                            Find Local Legal Help
                          </Label>
                          <p className={`text-xs ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                            Connect with a lawyer familiar with local laws
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem id="pay" value="pay" className="mt-1" />
                        <div>
                          <Label htmlFor="pay" className={`font-medium ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
                            Pay Fine/Resolve Issue
                          </Label>
                          <p className={`text-xs ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                            For minor violations where admitting fault is appropriate
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <Button 
                  className={`w-full ${
                    theme === 'light' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-700 hover:bg-blue-800'
                  }`}
                  onClick={handleContinueToAssistance}
                >
                  Continue to Legal Assistance
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Step 5: Legal assistance
  const renderLegalAssistance = () => {
    const services = [
      {
        name: "Indian Embassy Legal Cell",
        type: "Consular",
        distance: "Country-wide",
        rating: 4.6,
        phone: "+911800113090"
      },
      {
        name: "International Legal Association",
        type: "Legal Aid",
        distance: "Global",
        rating: 4.3,
        phone: "+12223334444"
      },
      {
        name: "Traveler Legal Assistance",
        type: "Legal Support",
        distance: "Global",
        rating: 4.5,
        phone: "+18001234567"
      },
      {
        name: "Insurance Legal Helpline",
        type: "Insurance",
        distance: "Global",
        rating: 4.2,
        phone: "+918889990000"
      }
    ];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Legal Assistance
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('document')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <h4 className={`font-bold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Legal Support Services
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
                ? 'bg-indigo-50 border border-indigo-100' 
                : 'bg-indigo-900/20 border border-indigo-900/30'
            }`}>
              <h5 className={`font-medium mb-1 ${theme === 'light' ? 'text-indigo-700' : 'text-indigo-400'}`}>
                Important Reminder
              </h5>
              <p className={`text-sm ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}>
                Keep all documentation safe and follow up with the appropriate authorities as advised.
              </p>
              <Button 
                className={`mt-2 w-full ${
                  theme === 'light' 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-indigo-700 hover:bg-indigo-800'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Download Documentation Summary
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
            International Legal Assistance
          </h2>
          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Step {['situation', 'rights', 'translation', 'document', 'assistance'].indexOf(currentStep) + 1} of 5
          </span>
        </div>
        <Progress value={getTotalProgress()} className="h-2" />
      </div>
      
      {renderStepContent()}
    </div>
  );
}