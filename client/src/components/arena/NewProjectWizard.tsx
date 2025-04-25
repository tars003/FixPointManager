import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Palette, 
  Settings, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  X,
  Plus,
  Bike,
  TruckIcon,
  Droplets,
  Fuel,
  Zap,
  FlaskConical,
  Combine,
  ScanLine,
  ListFilter,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  image: string;
  licensePlate?: string;
}

interface NewProjectWizardProps {
  onComplete?: (projectData: any) => void;
  onCreateProject?: (projectData: any) => void;
  onClose?: () => void;
  availableVehicles?: Vehicle[];
  isOpen?: boolean;
}

// Mock vehicle data
const demoVehicles: Vehicle[] = [
  {
    id: 1,
    make: 'Honda',
    model: 'City',
    year: 2021,
    licensePlate: 'KA01MJ8234',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/41406/city-exterior-right-front-three-quarter-2.jpeg'
  },
  {
    id: 2,
    make: 'Hyundai',
    model: 'Verna',
    year: 2020,
    licensePlate: 'MH02AB5678',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141383/verna-exterior-right-front-three-quarter.jpeg'
  },
  {
    id: 3,
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2022,
    licensePlate: 'DL7CX5544',
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/swift-exterior-right-front-three-quarter-2.jpeg'
  }
];

// Mock popular vehicle options
const popularVehicles: Vehicle[] = [
  {
    id: 101,
    make: 'Tata',
    model: 'Nexon',
    year: 2023,
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-70.jpeg'
  },
  {
    id: 102,
    make: 'Kia',
    model: 'Seltos',
    year: 2023,
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130583/seltos-exterior-right-front-three-quarter-2.jpeg'
  },
  {
    id: 103,
    make: 'Mahindra',
    model: 'XUV700',
    year: 2023,
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter.jpeg'
  },
  {
    id: 104,
    make: 'MG',
    model: 'Hector',
    year: 2023,
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130583/hector-exterior-right-front-three-quarter-2.jpeg'
  }
];

// Design types
const designTypes = [
  {
    id: 'exterior',
    name: 'Exterior Design',
    description: 'Customize exterior elements like paint, wraps, wheels, and accessories',
    icon: <Palette className="h-5 w-5" />
  },
  {
    id: 'interior',
    name: 'Interior Design',
    description: 'Customize interior elements like upholstery, dashboard, and lighting',
    icon: <Settings className="h-5 w-5" />
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Design',
    description: 'Complete customization of both exterior and interior',
    icon: <Car className="h-5 w-5" />
  }
];

const NewProjectWizard: React.FC<NewProjectWizardProps> = ({ 
  onComplete, 
  onCreateProject, 
  onClose, 
  availableVehicles,
  isOpen: propIsOpen
}) => {
  const [isOpen, setIsOpen] = useState(propIsOpen || false);
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicleSource, setVehicleSource] = useState<'existing' | 'new'>('existing');
  const [vehicleType, setVehicleType] = useState<'two-wheeler' | 'three-wheeler' | 'four-wheeler' | ''>('');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng-lpg' | ''>('');
  const [registrationVerified, setRegistrationVerified] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vehicleId: 0,
    manufacturer: '',
    model: '',
    year: '',
    variant: '',
    plateNumber: '',
    designType: '',
    visibility: 'private',
    collaborate: false
  });
  
  // Selected vehicle data
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Reset wizard state
  const resetWizard = () => {
    setCurrentStep(1);
    setVehicleSource('existing');
    setVehicleType('');
    setFuelType('');
    setRegistrationVerified(false);
    setFormData({
      name: '',
      description: '',
      vehicleId: 0,
      manufacturer: '',
      model: '',
      year: '',
      variant: '',
      plateNumber: '',
      designType: '',
      visibility: 'private',
      collaborate: false
    });
    setSelectedVehicle(null);
  };
  
  // Handle opening the wizard
  const handleOpen = () => {
    resetWizard();
    setIsOpen(true);
  };
  
  // Handle closing the wizard
  const handleClose = () => {
    setIsOpen(false);
    resetWizard();
  };
  
  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Select a vehicle
  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    handleChange('vehicleId', vehicle.id);
  };
  
  // Move to the next step
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };
  
  // Move to the previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Complete the wizard
  const handleFinish = () => {
    const projectData = {
      ...formData,
      vehicleDetails: selectedVehicle
    };
    
    if (onComplete) {
      onComplete(projectData);
    }
    
    if (onCreateProject) {
      onCreateProject(projectData);
    }
    
    if (onClose) {
      onClose();
    } else {
      handleClose();
    }
  };
  
  // Check if current step is valid to proceed
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        if (!vehicleType) return false;
        if (!fuelType) return false;
        if (vehicleSource === 'existing' && !selectedVehicle) return false;
        if (vehicleSource === 'new' && !selectedVehicle) return false;
        return true;
      case 2:
        return formData.designType !== '';
      case 3:
        return formData.name.trim() !== '';
      case 4:
        return true; // Always valid
      default:
        return false;
    }
  };
  
  // Render step indicator
  const renderSteps = () => {
    return (
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={`
                h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium border-2
                ${currentStep === step 
                  ? 'border-primary bg-primary text-white' 
                  : currentStep > step
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground'
                }
              `}
            >
              {currentStep > step ? <Check className="h-5 w-5" /> : step}
            </div>
            <span className={`text-xs mt-2 ${currentStep === step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {step === 1 ? 'Vehicle' : 
                step === 2 ? 'Type' : 
                  step === 3 ? 'Details' : 'Review'}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  // Step 1: Vehicle Selection
  const renderVehicleSelection = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">Start Your Customization Journey</h2>
          <p className="text-sm text-muted-foreground">Select vehicle details or import existing vehicle</p>
        </div>
        
        {/* Vehicle Type Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Vehicle Type</p>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={vehicleType === 'two-wheeler' ? 'default' : 'outline'}
              className="h-auto py-4 flex flex-col items-center"
              onClick={() => setVehicleType('two-wheeler')}
              title="Motorcycles, scooters"
            >
              <Bike className="h-8 w-8 mb-2" />
              <span className="font-medium">Two-Wheeler</span>
              <span className="text-xs mt-1 text-muted-foreground">Motorcycles, scooters</span>
            </Button>
            
            <Button
              variant={vehicleType === 'three-wheeler' ? 'default' : 'outline'}
              className="h-auto py-4 flex flex-col items-center"
              onClick={() => setVehicleType('three-wheeler')}
              title="Auto rickshaws, commercial carriers"
            >
              <TruckIcon className="h-8 w-8 mb-2" />
              <span className="font-medium">Three-Wheeler</span>
              <span className="text-xs mt-1 text-muted-foreground">Auto rickshaws, carriers</span>
            </Button>
            
            <Button
              variant={vehicleType === 'four-wheeler' ? 'default' : 'outline'}
              className="h-auto py-4 flex flex-col items-center"
              onClick={() => setVehicleType('four-wheeler')}
              title="Cars, SUVs, trucks"
            >
              <Car className="h-8 w-8 mb-2" />
              <span className="font-medium">Four-Wheeler</span>
              <span className="text-xs mt-1 text-muted-foreground">Cars, SUVs, trucks</span>
            </Button>
          </div>
        </div>
        
        {/* Fuel Type Selection */}
        {vehicleType && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Fuel Type</p>
            <div className="grid grid-cols-5 gap-2">
              <Button
                variant={fuelType === 'petrol' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFuelType('petrol')}
                className="h-auto py-2 flex flex-col items-center"
              >
                <Droplets className="h-4 w-4 mb-1" />
                <span className="text-xs">Petrol</span>
              </Button>
              
              <Button
                variant={fuelType === 'diesel' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFuelType('diesel')}
                className="h-auto py-2 flex flex-col items-center"
              >
                <Fuel className="h-4 w-4 mb-1" />
                <span className="text-xs">Diesel</span>
              </Button>
              
              <Button
                variant={fuelType === 'electric' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFuelType('electric')}
                className="h-auto py-2 flex flex-col items-center"
              >
                <Zap className="h-4 w-4 mb-1" />
                <span className="text-xs">Electric</span>
              </Button>
              
              <Button
                variant={fuelType === 'hybrid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFuelType('hybrid')}
                className="h-auto py-2 flex flex-col items-center"
              >
                <Combine className="h-4 w-4 mb-1" />
                <span className="text-xs">Hybrid</span>
              </Button>
              
              <Button
                variant={fuelType === 'cng-lpg' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFuelType('cng-lpg')}
                className="h-auto py-2 flex flex-col items-center"
              >
                <FlaskConical className="h-4 w-4 mb-1" />
                <span className="text-xs">CNG/LPG</span>
              </Button>
            </div>
          </div>
        )}
        
        {/* Vehicle Identification Methods */}
        {fuelType && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              variant={vehicleSource === 'existing' ? 'default' : 'outline'}
              className="h-auto py-3 flex flex-col items-center"
              onClick={() => setVehicleSource('existing')}
            >
              <ScanLine className="h-8 w-8 mb-2" />
              <span className="font-medium">Add by Registration</span>
              <span className="text-xs mt-1">Import using license plate</span>
            </Button>
            
            <Button
              variant={vehicleSource === 'new' ? 'default' : 'outline'}
              className="h-auto py-3 flex flex-col items-center"
              onClick={() => setVehicleSource('new')}
            >
              <ListFilter className="h-8 w-8 mb-2" />
              <span className="font-medium">Manual Selection</span>
              <span className="text-xs mt-1">Choose make, model and year</span>
            </Button>
          </div>
        )}
        
        {/* Registration or Manual Selection */}
        {vehicleSource === 'existing' && fuelType ? (
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-medium">Add by Registration</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="license-plate">License Plate Number</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    id="license-plate" 
                    placeholder="Enter license plate" 
                    className="flex-1"
                    value={formData.plateNumber}
                    onChange={(e) => handleChange('plateNumber', e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setRegistrationVerified(true)}
                  >
                    Verify
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">We'll send an OTP to the registered mobile number</p>
              </div>
              
              {registrationVerified && (
                <div>
                  <Label htmlFor="otp">OTP Verification</Label>
                  <div className="flex gap-2 mt-1">
                    <Input id="otp" placeholder="Enter OTP" className="flex-1" />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Simulate vehicle found by registration
                        const foundVehicle = demoVehicles[0];
                        if (foundVehicle) {
                          handleSelectVehicle(foundVehicle);
                        }
                      }}
                    >
                      Verify OTP
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : vehicleSource === 'new' && fuelType ? (
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-medium">Manual Selection</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Select 
                  value={formData.manufacturer}
                  onValueChange={(value) => handleChange('manufacturer', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="honda">Honda</SelectItem>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="maruti">Maruti Suzuki</SelectItem>
                    <SelectItem value="tata">Tata Motors</SelectItem>
                    <SelectItem value="mahindra">Mahindra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select 
                  disabled={!formData.manufacturer}
                  value={formData.model}
                  onValueChange={(value) => handleChange('model', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="civic">Civic</SelectItem>
                    <SelectItem value="nexon">Nexon</SelectItem>
                    <SelectItem value="xuv700">XUV700</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select 
                  disabled={!formData.model}
                  value={formData.year}
                  onValueChange={(value) => handleChange('year', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="variant">Variant</Label>
                <Select 
                  disabled={!formData.year}
                  value={formData.variant}
                  onValueChange={(value) => {
                    handleChange('variant', value);
                    
                    // Simulate vehicle selection when all fields are filled
                    if (formData.manufacturer && formData.model && formData.year && value) {
                      // Find a matching vehicle from our demo data
                      const matchingVehicle = popularVehicles.find(v => 
                        v.make.toLowerCase().includes(formData.manufacturer) ||
                        v.model.toLowerCase().includes(formData.model)
                      );
                      
                      if (matchingVehicle) {
                        handleSelectVehicle(matchingVehicle);
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Vehicle Preview and Stats */}
        {selectedVehicle && (
          <div className="rounded-lg border p-4 mt-4">
            <div className="flex items-center">
              <div className="w-24 h-20 rounded overflow-hidden mr-4">
                <img 
                  src={selectedVehicle.image} 
                  alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</h3>
                <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-3 mt-1">
                  <span>{selectedVehicle.year}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                  <span>{fuelType || 'Petrol'}</span>
                  {selectedVehicle.licensePlate && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                      <span>{selectedVehicle.licensePlate}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <div className="rounded bg-muted p-2">
                <p className="text-xs text-muted-foreground">Compatibility</p>
                <p className="font-medium">95%</p>
              </div>
              <div className="rounded bg-muted p-2">
                <p className="text-xs text-muted-foreground">Budget Range</p>
                <p className="font-medium">₹45K-120K</p>
              </div>
              <div className="rounded bg-muted p-2">
                <p className="text-xs text-muted-foreground">Est. Time</p>
                <p className="font-medium">3-7 days</p>
              </div>
              <div className="rounded bg-muted p-2">
                <p className="text-xs text-muted-foreground">Parts</p>
                <p className="font-medium">Available</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Step 2: Design Type Selection
  const renderDesignTypeSelection = () => {
    return (
      <div className="space-y-6">
        <ScrollArea className="h-[350px]">
          <RadioGroup 
            value={formData.designType} 
            onValueChange={(value) => handleChange('designType', value)}
            className="space-y-4"
          >
            {designTypes.map((type) => (
              <div key={type.id} className="flex items-start space-x-3">
                <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                <div className="grid gap-1.5">
                  <Label 
                    htmlFor={type.id} 
                    className="font-medium cursor-pointer flex items-center gap-2"
                  >
                    {type.icon}
                    {type.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
          
          <div className="mt-8 border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Customization Areas
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your selection, you'll be able to customize these areas:
            </p>
            
            {formData.designType === 'exterior' && (
              <div className="grid grid-cols-2 gap-3">
                <Badge variant="outline" className="justify-start">Paint & Wrap</Badge>
                <Badge variant="outline" className="justify-start">Wheels & Tires</Badge>
                <Badge variant="outline" className="justify-start">Body Kits</Badge>
                <Badge variant="outline" className="justify-start">Lighting</Badge>
                <Badge variant="outline" className="justify-start">Accessories</Badge>
                <Badge variant="outline" className="justify-start">Window Tint</Badge>
              </div>
            )}
            
            {formData.designType === 'interior' && (
              <div className="grid grid-cols-2 gap-3">
                <Badge variant="outline" className="justify-start">Upholstery</Badge>
                <Badge variant="outline" className="justify-start">Dashboard</Badge>
                <Badge variant="outline" className="justify-start">Center Console</Badge>
                <Badge variant="outline" className="justify-start">Interior Lighting</Badge>
                <Badge variant="outline" className="justify-start">Audio System</Badge>
                <Badge variant="outline" className="justify-start">Floor Mats</Badge>
              </div>
            )}
            
            {formData.designType === 'comprehensive' && (
              <div className="grid grid-cols-2 gap-3">
                <Badge variant="outline" className="justify-start">Paint & Wrap</Badge>
                <Badge variant="outline" className="justify-start">Wheels & Tires</Badge>
                <Badge variant="outline" className="justify-start">Body Kits</Badge>
                <Badge variant="outline" className="justify-start">Upholstery</Badge>
                <Badge variant="outline" className="justify-start">Dashboard</Badge>
                <Badge variant="outline" className="justify-start">Interior Lighting</Badge>
                <Badge variant="outline" className="justify-start">Audio System</Badge>
                <Badge variant="outline" className="justify-start">Accessories</Badge>
              </div>
            )}
            
            {!formData.designType && (
              <p className="text-sm italic text-muted-foreground">
                Please select a design type to see available customization areas
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };
  
  // Step 3: Project Details
  const renderProjectDetails = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input 
              id="name" 
              placeholder="Enter a name for your project" 
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea 
              id="description" 
              placeholder="Enter a description for your project" 
              className="min-h-[100px] resize-none"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="visibility">Project Visibility</Label>
            <Select 
              value={formData.visibility}
              onValueChange={(value) => handleChange('visibility', value)}
            >
              <SelectTrigger id="visibility">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.visibility === 'private' 
                ? 'Only you can see this project' 
                : formData.visibility === 'friends'
                  ? 'Only your friends can see this project'
                  : 'Everyone can see this project'}
            </p>
          </div>
          
          <div className="pt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="collaborate"
              className="rounded border-gray-300"
              checked={formData.collaborate}
              onChange={(e) => handleChange('collaborate', e.target.checked)}
            />
            <Label 
              htmlFor="collaborate"
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable collaboration (allow others to suggest changes)
            </Label>
          </div>
        </div>
      </div>
    );
  };
  
  // Step 4: Review Project
  const renderReviewProject = () => {
    if (!selectedVehicle) return null;
    
    const designTypeObj = designTypes.find(t => t.id === formData.designType);
    
    return (
      <div className="space-y-6">
        <div className="rounded-lg overflow-hidden border">
          <div className="h-44 bg-muted">
            <img 
              src={selectedVehicle.image} 
              alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-xl font-bold">{formData.name}</h3>
              <p className="text-sm text-muted-foreground">{formData.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Vehicle</p>
                <p className="font-medium">{selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</p>
              </div>
              
              <div>
                <p className="text-muted-foreground">Design Type</p>
                <p className="font-medium">{designTypeObj?.name}</p>
              </div>
              
              <div>
                <p className="text-muted-foreground">Visibility</p>
                <p className="font-medium capitalize">{formData.visibility}</p>
              </div>
              
              <div>
                <p className="text-muted-foreground">Collaboration</p>
                <p className="font-medium">{formData.collaborate ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">
                {selectedVehicle.make}
              </Badge>
              <Badge variant="secondary">
                {selectedVehicle.model}
              </Badge>
              <Badge variant="secondary">
                {formData.designType}
              </Badge>
              {formData.visibility === 'public' && (
                <Badge variant="secondary">
                  Public
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4 text-sm">
          <h4 className="font-medium mb-2">What's Next?</h4>
          <p className="text-muted-foreground">
            After creating this project, you'll be taken to the customization studio where you can
            start designing your vehicle based on the options you've selected.
          </p>
        </div>
      </div>
    );
  };
  
  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderVehicleSelection();
      case 2:
        return renderDesignTypeSelection();
      case 3:
        return renderProjectDetails();
      case 4:
        return renderReviewProject();
      default:
        return null;
    }
  };
  
  // Animation variants for step transitions
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };
  
  return (
    <>
      <Button
        onClick={handleOpen}
        variant="default"
        className="flex items-center gap-1 bg-[#25D366] hover:bg-[#22bf5b]"
      >
        <Plus className="h-4 w-4" />
        <span>New Project</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new vehicle customization project
            </DialogDescription>
          </DialogHeader>
          
          <Tabs 
            defaultValue="vehicle" 
            value={
              currentStep === 1 ? "vehicle" :
              currentStep === 2 ? "type" :
              currentStep === 3 ? "details" : "review"
            }
            onValueChange={(value) => {
              switch(value) {
                case "vehicle": setCurrentStep(1); break;
                case "type": setCurrentStep(2); break;
                case "details": setCurrentStep(3); break;
                case "review": setCurrentStep(4); break;
              }
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 h-auto p-1 mb-6">
              <TabsTrigger
                value="vehicle"
                className="flex flex-col items-center py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= 1 ? "bg-primary text-white" : "bg-muted-foreground/20"}`}>
                  {currentStep > 1 ? <Check className="h-4 w-4" /> : "1"}
                </div>
                <span className="mt-1 text-xs">Vehicle</span>
              </TabsTrigger>
              
              <TabsTrigger
                value="type"
                className="flex flex-col items-center py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
                disabled={!selectedVehicle}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= 2 ? "bg-primary text-white" : "bg-muted-foreground/20"}`}>
                  {currentStep > 2 ? <Check className="h-4 w-4" /> : "2"}
                </div>
                <span className="mt-1 text-xs">Type</span>
              </TabsTrigger>
              
              <TabsTrigger
                value="details"
                className="flex flex-col items-center py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
                disabled={formData.designType === ''}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= 3 ? "bg-primary text-white" : "bg-muted-foreground/20"}`}>
                  {currentStep > 3 ? <Check className="h-4 w-4" /> : "3"}
                </div>
                <span className="mt-1 text-xs">Details</span>
              </TabsTrigger>
              
              <TabsTrigger
                value="review"
                className="flex flex-col items-center py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
                disabled={formData.name.trim() === ''}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= 4 ? "bg-primary text-white" : "bg-muted-foreground/20"}`}>
                  4
                </div>
                <span className="mt-1 text-xs">Review</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="max-h-[400px] overflow-y-auto">
              <TabsContent value="vehicle" className="mt-0 border-0 p-0">
                <motion.div
                  key="vehicle-step"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={stepVariants}
                  transition={{ duration: 0.3 }}
                >
                  {renderVehicleSelection()}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="type" className="mt-0 border-0 p-0">
                <motion.div
                  key="type-step"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={stepVariants}
                  transition={{ duration: 0.3 }}
                >
                  {renderDesignTypeSelection()}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-0 border-0 p-0">
                <motion.div
                  key="details-step"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={stepVariants}
                  transition={{ duration: 0.3 }}
                >
                  {renderProjectDetails()}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="review" className="mt-0 border-0 p-0">
                <motion.div
                  key="review-step"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={stepVariants}
                  transition={{ duration: 0.3 }}
                >
                  {renderReviewProject()}
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
          
          <DialogFooter className="flex justify-between gap-2 sm:justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? handleClose : handlePrevStep}
            >
              {currentStep === 1 ? (
                <X className="h-4 w-4 mr-2" />
              ) : (
                <ChevronLeft className="h-4 w-4 mr-2" />
              )}
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            <Button
              onClick={handleNextStep}
              disabled={!isStepValid()}
            >
              {currentStep < 4 ? 'Continue' : 'Create Project'}
              {currentStep < 4 ? (
                <ChevronRight className="h-4 w-4 ml-2" />
              ) : (
                <Check className="h-4 w-4 ml-2" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewProjectWizard;