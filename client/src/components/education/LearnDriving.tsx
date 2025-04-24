import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  LocateFixed,
  MapPin,
  User,
  Users,
  Motorcycle,
  HardHat,
  Truck
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';

interface LearnDrivingProps {
  theme: 'light' | 'dark';
}

export default function LearnDriving({ theme }: LearnDrivingProps) {
  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState('');
  const [learningLevel, setLearningLevel] = useState('');
  const [scheduleType, setScheduleType] = useState('');
  const [instructorPreference, setInstructorPreference] = useState('');
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  const getStepProgress = () => {
    return (step / 4) * 100;
  };
  
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return renderVehicleTypeSelection();
      case 2:
        return renderLearningLevelSelection();
      case 3:
        return renderScheduleSelection();
      case 4:
        return renderInstructorPreferences();
      default:
        return renderVehicleTypeSelection();
    }
  };
  
  const renderVehicleTypeSelection = () => {
    const vehicleTypes = [
      {
        id: 'two-wheeler',
        name: 'Two-Wheeler',
        icon: <Motorcycle className="h-8 w-8 mb-2" />,
        description: 'Motorcycle/Scooter training',
        license: 'M License / Non-Transport',
        fee: '₹1,500 - ₹3,000'
      },
      {
        id: 'three-wheeler',
        name: 'Three-Wheeler',
        icon: <HardHat className="h-8 w-8 mb-2" />,
        description: 'Auto-rickshaw training',
        license: 'A License / Transport',
        fee: '₹2,500 - ₹4,000'
      },
      {
        id: 'four-wheeler',
        name: 'Four-Wheeler',
        icon: <Car className="h-8 w-8 mb-2" />,
        description: 'Car driving training',
        license: 'LMV License / Non-Transport',
        fee: '₹4,000 - ₹8,000'
      },
      {
        id: 'commercial',
        name: 'Commercial Vehicle',
        icon: <Truck className="h-8 w-8 mb-2" />,
        description: 'Truck/Bus driving training',
        license: 'HMV License / Transport',
        fee: '₹8,000 - ₹15,000'
      }
    ];
    
    return (
      <div className="space-y-6">
        <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Select Vehicle Type
        </h2>
        <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          Choose the type of vehicle you want to learn to drive
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {vehicleTypes.map((type) => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                vehicleType === type.id 
                  ? theme === 'light' 
                    ? 'border-2 border-blue-500 bg-blue-50' 
                    : 'border-2 border-blue-500 bg-blue-900/20' 
                  : theme === 'light'
                    ? 'border border-gray-200'
                    : 'bg-gray-800 border-gray-700'
              }`}
              onClick={() => setVehicleType(type.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className={`rounded-full p-3 ${
                    theme === 'light' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-blue-900/30 text-blue-400'
                  }`}>
                    {type.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      {type.name}
                    </h3>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                      {type.description}
                    </p>
                    <div className={`mt-4 p-2 rounded ${
                      theme === 'light' 
                        ? 'bg-gray-50' 
                        : 'bg-gray-700'
                    }`}>
                      <div className="flex justify-between text-xs">
                        <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>License Type:</span>
                        <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{type.license}</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Training Fee:</span>
                        <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{type.fee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {vehicleType && (
          <div className="mt-4">
            <RadioGroup defaultValue="geared" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="geared" id="geared" />
                <Label htmlFor="geared">Geared Vehicle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-geared" id="non-geared" />
                <Label htmlFor="non-geared">Non-Geared Vehicle</Label>
              </div>
            </RadioGroup>
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button 
            className={`${
              theme === 'light' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-700 hover:bg-blue-800'
            }`}
            disabled={!vehicleType}
            onClick={handleNext}
          >
            Continue to Learning Level
          </Button>
        </div>
      </div>
    );
  };
  
  const renderLearningLevelSelection = () => {
    const learningLevels = [
      {
        id: 'beginner',
        name: 'Beginner',
        description: 'For first-time drivers with no prior experience',
        details: 'Comprehensive basics, vehicle controls, road rules, and safety practices',
        duration: '15-20 Sessions',
        price: '₹5,000'
      },
      {
        id: 'refresh',
        name: 'Refresh',
        description: 'For those who know basics but need practice',
        details: 'Refine driving skills, build confidence, and practice specific scenarios',
        duration: '5-10 Sessions',
        price: '₹3,000'
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Advanced training for commercial drivers',
        details: 'Advanced maneuvers, defensive driving, traffic management, and professional standards',
        duration: '20-25 Sessions',
        price: '₹8,000'
      },
      {
        id: 'special',
        name: 'Special Skills',
        description: 'Focused training for specific driving challenges',
        details: 'Hill driving, highway driving, night driving, or other specialized skills',
        duration: '3-5 Sessions',
        price: '₹2,500'
      }
    ];
    
    return (
      <div className="space-y-6">
        <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Select Learning Level
        </h2>
        <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          Choose the learning level that matches your current driving experience
        </p>
        
        <div className="space-y-4 mt-6">
          {learningLevels.map((level) => (
            <Card 
              key={level.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                learningLevel === level.id 
                  ? theme === 'light' 
                    ? 'border-2 border-blue-500 bg-blue-50' 
                    : 'border-2 border-blue-500 bg-blue-900/20' 
                  : theme === 'light'
                    ? 'border border-gray-200'
                    : 'bg-gray-800 border-gray-700'
              }`}
              onClick={() => setLearningLevel(level.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      {level.name}
                    </h3>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                      {level.description}
                    </p>
                    <p className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {level.details}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      theme === 'light' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-blue-900/30 text-blue-400'
                    }`}>
                      {level.duration}
                    </div>
                    <div className={`mt-2 text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      {level.price}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack}>
            Back to Vehicle Type
          </Button>
          <Button 
            className={`${
              theme === 'light' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-700 hover:bg-blue-800'
            }`}
            disabled={!learningLevel}
            onClick={handleNext}
          >
            Continue to Schedule
          </Button>
        </div>
      </div>
    );
  };
  
  const renderScheduleSelection = () => {
    return (
      <div className="space-y-6">
        <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Select Your Schedule
        </h2>
        <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          Choose your preferred training schedule and timing
        </p>
        
        <div className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Schedule Preference
            </h3>
            <RadioGroup 
              defaultValue="flexible" 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              onValueChange={(value) => setScheduleType(value)}
            >
              <div>
                <RadioGroupItem value="weekday" id="weekday" className="sr-only" />
                <Label
                  htmlFor="weekday"
                  className={`flex flex-col items-center justify-between rounded-md border p-4 cursor-pointer ${
                    scheduleType === 'weekday'
                      ? theme === 'light'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-blue-500 bg-blue-900/20'
                      : theme === 'light'
                        ? 'border-gray-200'
                        : 'border-gray-700'
                  }`}
                >
                  <div className={`mb-3 rounded-full p-2 ${
                    theme === 'light' 
                      ? 'bg-blue-100' 
                      : 'bg-blue-900/30'
                  }`}>
                    <Calendar className={`h-5 w-5 ${
                      theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Weekday
                    </div>
                    <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Monday - Friday
                    </div>
                  </div>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="weekend" id="weekend" className="sr-only" />
                <Label
                  htmlFor="weekend"
                  className={`flex flex-col items-center justify-between rounded-md border p-4 cursor-pointer ${
                    scheduleType === 'weekend'
                      ? theme === 'light'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-blue-500 bg-blue-900/20'
                      : theme === 'light'
                        ? 'border-gray-200'
                        : 'border-gray-700'
                  }`}
                >
                  <div className={`mb-3 rounded-full p-2 ${
                    theme === 'light' 
                      ? 'bg-blue-100' 
                      : 'bg-blue-900/30'
                  }`}>
                    <Calendar className={`h-5 w-5 ${
                      theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Weekend
                    </div>
                    <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Saturday & Sunday
                    </div>
                  </div>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="flexible" id="flexible" className="sr-only" />
                <Label
                  htmlFor="flexible"
                  className={`flex flex-col items-center justify-between rounded-md border p-4 cursor-pointer ${
                    scheduleType === 'flexible' || scheduleType === ''
                      ? theme === 'light'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-blue-500 bg-blue-900/20'
                      : theme === 'light'
                        ? 'border-gray-200'
                        : 'border-gray-700'
                  }`}
                >
                  <div className={`mb-3 rounded-full p-2 ${
                    theme === 'light' 
                      ? 'bg-blue-100' 
                      : 'bg-blue-900/30'
                  }`}>
                    <Calendar className={`h-5 w-5 ${
                      theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Flexible
                    </div>
                    <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Any day of the week
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <h3 className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Preferred Time
            </h3>
            <RadioGroup defaultValue="flexible" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <RadioGroupItem value="morning" id="morning" className="sr-only" />
                <Label
                  htmlFor="morning"
                  className={`flex flex-col items-center justify-between rounded-md border p-4 cursor-pointer ${
                    theme === 'light' ? 'border-gray-200' : 'border-gray-700'
                  }`}
                >
                  <div className={`mb-3 rounded-full p-2 ${
                    theme === 'light' 
                      ? 'bg-amber-100' 
                      : 'bg-amber-900/30'
                  }`}>
                    <Clock className={`h-5 w-5 ${
                      theme === 'light' ? 'text-amber-600' : 'text-amber-400'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Morning
                    </div>
                    <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      6:00 AM - 11:00 AM
                    </div>
                  </div>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="afternoon" id="afternoon" className="sr-only" />
                <Label
                  htmlFor="afternoon"
                  className={`flex flex-col items-center justify-between rounded-md border p-4 cursor-pointer ${
                    theme === 'light' ? 'border-gray-200' : 'border-gray-700'
                  }`}
                >
                  <div className={`mb-3 rounded-full p-2 ${
                    theme === 'light' 
                      ? 'bg-amber-100' 
                      : 'bg-amber-900/30'
                  }`}>
                    <Clock className={`h-5 w-5 ${
                      theme === 'light' ? 'text-amber-600' : 'text-amber-400'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Afternoon
                    </div>
                    <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      12:00 PM - 4:00 PM
                    </div>
                  </div>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="evening" id="evening" className="sr-only" />
                <Label
                  htmlFor="evening"
                  className={`flex flex-col items-center justify-between rounded-md border p-4 cursor-pointer ${
                    theme === 'light' ? 'border-gray-200' : 'border-gray-700'
                  }`}
                >
                  <div className={`mb-3 rounded-full p-2 ${
                    theme === 'light' 
                      ? 'bg-amber-100' 
                      : 'bg-amber-900/30'
                  }`}>
                    <Clock className={`h-5 w-5 ${
                      theme === 'light' ? 'text-amber-600' : 'text-amber-400'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Evening
                    </div>
                    <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      4:00 PM - 8:00 PM
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <h3 className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Location Preference
            </h3>
            <div className="flex flex-col gap-2">
              <Label
                className="flex items-center space-x-3 rounded-md border p-4 cursor-pointer"
                htmlFor="pickup"
              >
                <div className="flex items-center">
                  <Checkbox id="pickup" />
                  <div className="ml-2">
                    <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Instructor pickup from my location
                    </span>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Additional pickup charges may apply based on distance
                    </p>
                  </div>
                </div>
              </Label>
              <Label
                className="flex items-center space-x-3 rounded-md border p-4 cursor-pointer"
                htmlFor="center"
              >
                <div className="flex items-center">
                  <Checkbox id="center" defaultChecked />
                  <div className="ml-2">
                    <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Train at nearest driving center
                    </span>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Our centers have dedicated practice areas and tracks
                    </p>
                  </div>
                </div>
              </Label>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            theme === 'light' 
              ? 'bg-green-50 border border-green-100' 
              : 'bg-green-900/20 border border-green-900/30'
          }`}>
            <div className="flex items-start">
              <LocateFixed className={`h-5 w-5 mt-0.5 ${
                theme === 'light' ? 'text-green-600' : 'text-green-400'
              }`} />
              <div className="ml-3">
                <h4 className={`font-medium ${theme === 'light' ? 'text-green-700' : 'text-green-500'}`}>
                  Nearest Training Center
                </h4>
                <p className={`text-sm ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                  FixPoint Driving Center - Andheri East
                </p>
                <p className={`text-xs mt-1 ${theme === 'light' ? 'text-green-500' : 'text-green-400'}`}>
                  2.3 km from your location • Open 6:00 AM - 10:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack}>
            Back to Learning Level
          </Button>
          <Button 
            className={`${
              theme === 'light' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-700 hover:bg-blue-800'
            }`}
            onClick={handleNext}
          >
            Continue to Instructor Preferences
          </Button>
        </div>
      </div>
    );
  };
  
  const renderInstructorPreferences = () => {
    return (
      <div className="space-y-6">
        <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Instructor Preferences
        </h2>
        <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          Choose your preferences for instructor assignment
        </p>
        
        <div className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Instructor Gender Preference
            </h3>
            <RadioGroup 
              defaultValue="any" 
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              onValueChange={(value) => setInstructorPreference(value)}
            >
              <div>
                <RadioGroupItem value="male" id="male" className="sr-only" />
                <Label
                  htmlFor="male"
                  className={`flex flex-col items-center justify-between rounded-md border p-4 cursor-pointer ${
                    instructorPreference === 'male'
                      ? theme === 'light'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-blue-500 bg-blue-900/20'
                      : theme === 'light'
                        ? 'border-gray-200'
                        : 'border-gray-700'
                  }`}
                >
                  <div className={`mb-3 rounded-full p-2 ${
                    theme === 'light' 
                      ? 'bg-blue-100' 
                      : 'bg-blue-900/30'
                  }`}>
                    <User className={`h-5 w-5 ${
                      theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Male Instructor
                    </div>
                  </div>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="female" id="female" className="sr-only" />
                <Label
                  htmlFor="female"
                  className={`flex flex-col items-center justify-between rounded-md border p-4 cursor-pointer ${
                    instructorPreference === 'female'
                      ? theme === 'light'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-blue-500 bg-blue-900/20'
                      : theme === 'light'
                        ? 'border-gray-200'
                        : 'border-gray-700'
                  }`}
                >
                  <div className={`mb-3 rounded-full p-2 ${
                    theme === 'light' 
                      ? 'bg-blue-100' 
                      : 'bg-blue-900/30'
                  }`}>
                    <User className={`h-5 w-5 ${
                      theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Female Instructor
                    </div>
                  </div>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem value="any" id="any" className="sr-only" />
                <Label
                  htmlFor="any"
                  className={`flex flex-col items-center justify-between rounded-md border p-4 cursor-pointer ${
                    instructorPreference === 'any' || instructorPreference === ''
                      ? theme === 'light'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-blue-500 bg-blue-900/20'
                      : theme === 'light'
                        ? 'border-gray-200'
                        : 'border-gray-700'
                  }`}
                >
                  <div className={`mb-3 rounded-full p-2 ${
                    theme === 'light' 
                      ? 'bg-blue-100' 
                      : 'bg-blue-900/30'
                  }`}>
                    <Users className={`h-5 w-5 ${
                      theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Any Instructor
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <h3 className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Additional Preferences
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="same-instructor" />
                <Label htmlFor="same-instructor">Request same instructor for all sessions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="language" />
                <Label htmlFor="language">Hindi-speaking instructor preferred</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="certified" defaultChecked />
                <Label htmlFor="certified">RTO-certified instructor</Label>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            theme === 'light' 
              ? 'bg-blue-50 border border-blue-100' 
              : 'bg-blue-900/20 border border-blue-900/30'
          }`}>
            <h3 className={`font-medium ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
              Summary
            </h3>
            <div className={`mt-3 space-y-2 text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
              <div className="flex justify-between">
                <span>Vehicle Type:</span>
                <span className="font-medium">Four-Wheeler (Car)</span>
              </div>
              <div className="flex justify-between">
                <span>Learning Level:</span>
                <span className="font-medium">Beginner</span>
              </div>
              <div className="flex justify-between">
                <span>Schedule:</span>
                <span className="font-medium">Weekends, Morning</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium">Training Center</span>
              </div>
              <div className="flex justify-between">
                <span>Instructor:</span>
                <span className="font-medium">Any Instructor</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-blue-200 dark:border-blue-800">
                <span>Total:</span>
                <span>₹5,000</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack}>
            Back to Schedule
          </Button>
          <Button 
            className={`${
              theme === 'light' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-green-700 hover:bg-green-800'
            }`}
          >
            Book Now
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            Step {step} of 4
          </span>
          <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            {step === 1 ? 'Vehicle Type' : 
             step === 2 ? 'Learning Level' :
             step === 3 ? 'Schedule' : 'Instructor Preferences'}
          </span>
        </div>
        <Progress value={getStepProgress()} className="h-2" />
      </div>
      
      {renderStepContent()}
    </div>
  );
}