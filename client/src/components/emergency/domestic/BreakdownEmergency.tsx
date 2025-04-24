import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Wrench as Engine,
  Gauge,
  Battery,
  Key,
  Fuel,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Phone,
  ArrowLeft,
  ArrowRight,
  Timer,
  CheckCircle,
  MapPin,
  Car
} from 'lucide-react';

interface BreakdownEmergencyProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  theme: 'light' | 'dark';
  onGoBack: () => void;
}

type BreakdownType = 'engine' | 'tire' | 'battery' | 'keys' | 'fuel' | 'unknown' | '';
type BreakdownStep = 'type' | 'safety' | 'troubleshoot' | 'assistance';

export default function BreakdownEmergency({ 
  location, 
  theme,
  onGoBack
}: BreakdownEmergencyProps) {
  const [breakdownType, setBreakdownType] = useState<BreakdownType>('');
  const [currentStep, setCurrentStep] = useState<BreakdownStep>('type');
  const [safetyChecklist, setSafetyChecklist] = useState({
    hazardLightsOn: false,
    warningTrianglePlaced: false,
    vehicleInSafeLocation: false,
    passengersInSafeLocation: false
  });
  
  // Progress calculation
  const getTotalProgress = () => {
    const stepValues = {
      type: 25,
      safety: 50,
      troubleshoot: 75,
      assistance: 100
    };
    
    return stepValues[currentStep] || 0;
  };
  
  const handleBreakdownTypeSelect = (type: BreakdownType) => {
    setBreakdownType(type);
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
      setCurrentStep('troubleshoot');
    } else {
      alert('Please complete all safety checks before continuing');
    }
  };
  
  const handleContinueToAssistance = () => {
    setCurrentStep('assistance');
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return renderBreakdownTypeSelection();
      case 'safety':
        return renderSafetyPositioning();
      case 'troubleshoot':
        return renderTroubleshooting();
      case 'assistance':
        return renderRoadsideAssistance();
      default:
        return renderBreakdownTypeSelection();
    }
  };
  
  // Step 1: Breakdown Type Selection
  const renderBreakdownTypeSelection = () => {
    const types = [
      { 
        id: 'engine', 
        name: 'Engine Problem', 
        description: 'Engine not starting or running poorly',
        icon: <Engine className="h-8 w-8" />
      },
      { 
        id: 'tire', 
        name: 'Tire/Wheel Issue', 
        description: 'Flat tire, puncture, or wheel problem',
        icon: <Gauge className="h-8 w-8" />
      },
      { 
        id: 'battery', 
        name: 'Battery/Electrical', 
        description: 'Battery dead or electrical system failure',
        icon: <Battery className="h-8 w-8" />
      },
      { 
        id: 'keys', 
        name: 'Keys/Lockout', 
        description: 'Locked out or key problems',
        icon: <Key className="h-8 w-8" />
      },
      { 
        id: 'fuel', 
        name: 'Fuel Issue', 
        description: 'Out of fuel or fuel system problem',
        icon: <Fuel className="h-8 w-8" />
      },
      { 
        id: 'unknown', 
        name: 'Unknown Problem', 
        description: 'Not sure what the problem is',
        icon: <HelpCircle className="h-8 w-8" />
      }
    ];
    
    return (
      <div className="space-y-4">
        <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Select Breakdown Type
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map(type => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all ${
                theme === 'light' 
                ? 'hover:border-orange-200 hover:shadow-md' 
                : 'bg-gray-800 border-gray-700 hover:border-orange-900'
              }`}
              onClick={() => handleBreakdownTypeSelect(type.id as BreakdownType)}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-orange-100' : 'bg-orange-900/30'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center ${theme === 'light' ? 'text-orange-600' : 'text-orange-400'}`}>
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
  
  // Step 2: Safety Positioning Guide
  const renderSafetyPositioning = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Safety Positioning
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('type')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <div className={`p-3 rounded-lg mb-4 ${theme === 'light' ? 'bg-amber-50 border border-amber-100' : 'bg-amber-900/20 border border-amber-900/30'}`}>
              <h4 className={`font-bold mb-1 flex items-center ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                <AlertTriangle className="h-4 w-4 mr-1" />
                Safety First
              </h4>
              <p className={`text-sm ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                Follow these safety steps before attempting any troubleshooting or repair.
              </p>
            </div>
            
            {/* Safety Checklist */}
            <div className="space-y-3 mb-6">
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
                    Turn on hazard lights
                  </Label>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Make your vehicle visible to other road users
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
                    Place warning triangle (if available)
                  </Label>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Place 50-100m behind your vehicle on highways
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="safe-location-vehicle" 
                  checked={safetyChecklist.vehicleInSafeLocation}
                  onCheckedChange={() => handleSafetyChecked('vehicleInSafeLocation')}
                  className={theme === 'light' ? 'data-[state=checked]:bg-green-600' : 'data-[state=checked]:bg-green-700'}
                />
                <div>
                  <Label 
                    htmlFor="safe-location-vehicle" 
                    className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
                  >
                    Move vehicle to safe location if possible
                  </Label>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Pull over to the side of the road, away from traffic
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="safe-location-passengers" 
                  checked={safetyChecklist.passengersInSafeLocation}
                  onCheckedChange={() => handleSafetyChecked('passengersInSafeLocation')}
                  className={theme === 'light' ? 'data-[state=checked]:bg-green-600' : 'data-[state=checked]:bg-green-700'}
                />
                <div>
                  <Label 
                    htmlFor="safe-location-passengers" 
                    className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
                  >
                    Ensure all passengers are in a safe location
                  </Label>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Exit the vehicle from the side away from traffic if needed
                  </p>
                </div>
              </div>
            </div>
            
            {/* Safety Animation */}
            <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-700/50 border-gray-700'}`}>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-24">
                  {/* This would be a real animation in production */}
                  <div className={`absolute left-0 top-0 w-12 h-6 rounded-md ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'}`}>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Car className={`h-4 w-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
                    </div>
                  </div>
                  
                  {safetyChecklist.hazardLightsOn && (
                    <div className="absolute left-0 top-0 w-12 h-6 animate-pulse">
                      <div className={`absolute top-0 left-0 w-2 h-2 rounded-full ${theme === 'light' ? 'bg-red-500' : 'bg-red-600'}`}></div>
                      <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${theme === 'light' ? 'bg-red-500' : 'bg-red-600'}`}></div>
                    </div>
                  )}
                  
                  {safetyChecklist.warningTrianglePlaced && (
                    <div className="absolute top-3 right-0">
                      <div className={`w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent ${theme === 'light' ? 'border-b-red-500' : 'border-b-red-600'}`}></div>
                    </div>
                  )}
                </div>
              </div>
              <p className={`text-xs text-center mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                Safety positioning guide
              </p>
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
            disabled={!Object.values(safetyChecklist).every(value => value)}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Step 3: Troubleshooting Assistant
  const renderTroubleshooting = () => {
    // Render different troubleshooting guides based on breakdown type
    const renderTroubleshootingGuide = () => {
      switch (breakdownType) {
        case 'engine':
          return (
            <div className="space-y-4">
              <h4 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Engine Troubleshooting
              </h4>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-700/50 border border-gray-700'}`}>
                <h5 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Does the engine make any sound when you try to start it?
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    No sound at all
                  </Button>
                  <Button variant="outline">
                    Clicking sound
                  </Button>
                  <Button variant="outline">
                    Grinding sound
                  </Button>
                  <Button variant="outline">
                    It cranks but won't start
                  </Button>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-900/30'}`}>
                <h5 className={`font-medium flex items-center ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Quick Check: Battery
                </h5>
                <p className={`text-sm mt-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                  If there's no sound when turning the key, it could be a dead battery. Check if headlights work.
                </p>
              </div>
            </div>
          );
          
        case 'battery':
          return (
            <div className="space-y-4">
              <h4 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Battery/Electrical Troubleshooting
              </h4>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-900/30'}`}>
                <h5 className={`font-medium flex items-center ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Dead Battery Signs
                </h5>
                <ul className={`text-sm mt-2 space-y-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                  <li>• No interior lights when door is open</li>
                  <li>• No sound when turning key</li>
                  <li>• Headlights dim or don't work</li>
                  <li>• Dashboard lights don't illuminate</li>
                </ul>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-700/50 border border-gray-700'}`}>
                <h5 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Do you have jumper cables or a jump starter?
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    Yes, I have jumper cables
                  </Button>
                  <Button variant="outline">
                    Yes, I have a jump starter
                  </Button>
                  <Button variant="outline">
                    No, I need assistance
                  </Button>
                </div>
              </div>
            </div>
          );
          
        case 'tire':
          return (
            <div className="space-y-4">
              <h4 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Tire/Wheel Troubleshooting
              </h4>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-700/50 border border-gray-700'}`}>
                <h5 className={`font-medium mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Tire Issue Type
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    Flat tire/puncture
                  </Button>
                  <Button variant="outline">
                    Tire completely blown out
                  </Button>
                  <Button variant="outline">
                    Slow leak/low pressure
                  </Button>
                  <Button variant="outline">
                    Wheel damage
                  </Button>
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-900/30'}`}>
                <h5 className={`font-medium flex items-center ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Spare Tire Check
                </h5>
                <p className={`text-sm mt-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                  Check if you have a spare tire, jack, and wheel spanner in your vehicle.
                </p>
              </div>
            </div>
          );
          
        default:
          return (
            <div className="space-y-4">
              <h4 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                General Troubleshooting
              </h4>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-amber-50 border border-amber-100' : 'bg-amber-900/20 border border-amber-900/30'}`}>
                <h5 className={`font-medium flex items-center ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Assessment
                </h5>
                <p className={`text-sm mt-1 ${theme === 'light' ? 'text-amber-600' : 'text-amber-300'}`}>
                  Based on your selection, your breakdown may require professional assistance.
                </p>
              </div>
              
              <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-900/30'}`}>
                <h5 className={`font-medium ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                  Safety Tips While Waiting
                </h5>
                <ul className={`text-sm mt-2 space-y-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                  <li>• Stay inside your vehicle if it's safe to do so</li>
                  <li>• Keep hazard lights on</li>
                  <li>• If you exit, stay away from traffic</li>
                  <li>• Keep your seatbelt on if staying in vehicle</li>
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
            Troubleshooting Assistant
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('safety')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            {renderTroubleshootingGuide()}
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Need Professional Help?
                  </h5>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    If you can't fix the issue, call for roadside assistance
                  </p>
                </div>
                <Button 
                  className={`${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'}`}
                  onClick={handleContinueToAssistance}
                >
                  Get Help
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Step 4: Roadside Assistance Dispatcher
  const renderRoadsideAssistance = () => {
    const providers = [
      {
        name: "FixPoint Roadside Assistance",
        type: "Premium",
        eta: "15-20 min",
        distance: "3.2 km",
        services: ["Towing", "Battery Jump", "Tire Change", "Fuel Delivery"],
        rating: 4.8,
        phone: "+911800123567"
      },
      {
        name: "ICICI RSA Service",
        type: "Insurance Provider",
        eta: "25-30 min",
        distance: "5.1 km",
        services: ["Towing", "Battery Jump", "Minor Repairs"],
        rating: 4.5,
        phone: "+911800209090"
      },
      {
        name: "Local Mechanic Service",
        type: "On-demand",
        eta: "10-15 min",
        distance: "1.8 km",
        services: ["Battery Jump", "Tire Change", "Minor Repairs"],
        rating: 4.2,
        phone: "+919876543210"
      },
      {
        name: "Highway Assistance",
        type: "Government",
        eta: "30-40 min",
        distance: "Highway Patrol",
        services: ["Traffic Management", "Basic Assistance", "Towing"],
        rating: 4.0,
        phone: "1073"
      }
    ];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Roadside Assistance
          </h3>
          <Button variant="outline" size="sm" onClick={() => setCurrentStep('troubleshoot')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Nearby Service Providers
              </h4>
              <div className={`text-xs px-2 py-1 rounded-full flex items-center ${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400'}`}>
                <MapPin className="h-3 w-3 mr-1" />
                {location.address.split(',')[0]}
              </div>
            </div>
            
            <div className="space-y-4">
              {providers.map((provider, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                        {provider.name}
                      </h5>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'}`}>
                          {provider.type}
                        </span>
                        <span className={`ml-2 text-xs ${theme === 'light' ? 'text-amber-500' : 'text-amber-400'}`}>
                          ★ {provider.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center text-xs font-medium ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                        <Timer className="h-3 w-3 mr-1" />
                        ETA: {provider.eta}
                      </div>
                      <div className={`text-xs mt-0.5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {provider.distance}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {provider.services.map((service, i) => (
                      <span 
                        key={i}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          theme === 'light' 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'bg-blue-900/20 text-blue-400'
                        }`}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <Button 
                      size="sm"
                      className={`${theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-700 hover:bg-green-800'}`}
                      onClick={() => window.open(`tel:${provider.phone}`, '_self')}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`mt-4 p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-900/30'}`}>
              <h5 className={`font-medium flex items-center ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Secure Waiting Location
              </h5>
              <p className={`text-sm mt-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'}`}>
                While waiting for assistance, remain in your vehicle with doors locked if it's safe to do so.
                If on a highway, wait behind the safety barrier if possible.
              </p>
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
            Vehicle Breakdown
          </h2>
          <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Step {['type', 'safety', 'troubleshoot', 'assistance'].indexOf(currentStep) + 1} of 4
          </span>
        </div>
        <Progress value={getTotalProgress()} className="h-2" />
      </div>
      
      {renderStepContent()}
    </div>
  );
}