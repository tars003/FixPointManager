import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Car, 
  Bike, 
  Truck, 
  Droplet, 
  Zap, 
  CloudLightning, 
  Fuel, 
  Wind, 
  Upload, 
  MapPin,
  ArrowLeft,
  ArrowRight,
  Check
} from 'lucide-react';

// Define step types
type Step = 'vehicle-type' | 'vehicle-details' | 'location-finalization';

// Fuel types
const fuelTypes = [
  { id: 'petrol', label: 'Petrol', icon: Droplet },
  { id: 'diesel', label: 'Diesel', icon: Fuel },
  { id: 'electric', label: 'Electric', icon: Zap },
  { id: 'hydrogen', label: 'Hydrogen', icon: CloudLightning },
  { id: 'cng', label: 'CNG', icon: Droplet },
  { id: 'solar', label: 'Solar', icon: Wind },
];

// Purpose types
const purposeTypes = [
  { id: 'personal', label: 'Personal' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'off-road', label: 'Off-road' },
  { id: 'racing', label: 'Racing' },
];

// Popular vehicle makes with logos (would use actual logos in production)
const vehicleMakes = [
  { id: 'honda', name: 'Honda', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Honda-Logo-700x394.png' },
  { id: 'toyota', name: 'Toyota', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Toyota-Logo-700x394.png' },
  { id: 'maruti-suzuki', name: 'Maruti Suzuki', logo: 'https://logos-world.net/wp-content/uploads/2020/05/Suzuki-Logo-700x394.png' },
  { id: 'tata', name: 'Tata Motors', logo: 'https://logos-world.net/wp-content/uploads/2021/03/Tata-Logo-700x394.png' },
  { id: 'royal-enfield', name: 'Royal Enfield', logo: 'https://www.bikedekho.com/royal-enfield-bikes/images/royal-enfield.jpg' },
  { id: 'mahindra', name: 'Mahindra', logo: 'https://logos-world.net/wp-content/uploads/2021/09/Mahindra-Logo-700x394.png' },
  { id: 'hyundai', name: 'Hyundai', logo: 'https://logos-world.net/wp-content/uploads/2020/05/Hyundai-Logo-700x394.png' },
  { id: 'hero', name: 'Hero', logo: 'https://logos-world.net/wp-content/uploads/2021/08/Hero-Logo-700x394.png' },
  { id: 'tvs', name: 'TVS', logo: 'https://www.bikedekho.com/tvs-bikes/images/tvs.jpg' },
  { id: 'bajaj', name: 'Bajaj', logo: 'https://www.bikedekho.com/bajaj-bikes/images/bajaj.jpg' },
];

// Example models (would be fetched based on selected make in production)
const hondaModels = [
  { id: 'city', name: 'City', thumbnail: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75' },
  { id: 'amaze', name: 'Amaze', thumbnail: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/45951/amaze-exterior-right-front-three-quarter-2.jpeg?q=75' },
  { id: 'civic', name: 'Civic', thumbnail: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/27074/civic-exterior-right-front-three-quarter-2.jpeg?q=75' },
];

interface NewProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (projectData: any) => void;
}

const NewProjectWizard: React.FC<NewProjectWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('vehicle-type');
  const [formData, setFormData] = useState({
    vehicleType: '',
    fuelType: '',
    purpose: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '#000000',
    licensePlate: '',
    pincode: '',
    address: '',
    projectName: '',
    photos: [] as File[],
  });

  // Calculate progress percentage
  const getProgress = () => {
    const steps = ['vehicle-type', 'vehicle-details', 'location-finalization'];
    const currentIndex = steps.indexOf(currentStep);
    return Math.round(((currentIndex + 1) / steps.length) * 100);
  };

  // Check if current step is complete
  const isCurrentStepComplete = () => {
    switch (currentStep) {
      case 'vehicle-type':
        return formData.vehicleType !== '' && formData.fuelType !== '' && formData.purpose !== '';
      case 'vehicle-details':
        return formData.make !== '' && formData.model !== '' && formData.color !== '';
      case 'location-finalization':
        return formData.pincode !== '' && formData.projectName !== '';
      default:
        return false;
    }
  };

  // Handle form input changes
  const handleChange = (name: string, value: string | number | File[]) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData({
        ...formData,
        photos: filesArray,
      });
    }
  };

  // Navigate to next step
  const handleNext = () => {
    if (currentStep === 'vehicle-type') {
      setCurrentStep('vehicle-details');
    } else if (currentStep === 'vehicle-details') {
      setCurrentStep('location-finalization');
    } else {
      // Complete wizard
      handleComplete();
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep === 'vehicle-details') {
      setCurrentStep('vehicle-type');
    } else if (currentStep === 'location-finalization') {
      setCurrentStep('vehicle-details');
    }
  };

  // Auto-detect location (would connect to geolocation API in production)
  const handleAutoDetectLocation = () => {
    // Simulate location detection
    setTimeout(() => {
      setFormData({
        ...formData,
        pincode: '400001',
        address: 'Mumbai, Maharashtra, India',
      });
      
      toast({
        title: "Location detected",
        description: "Your location has been automatically detected.",
      });
    }, 1000);
  };

  // Handle project creation
  const handleComplete = () => {
    toast({
      title: "Project Created",
      description: "Your new project has been created successfully!",
    });
    
    onComplete(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Project</DialogTitle>
          <div className="mt-2">
            <Progress value={getProgress()} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Step {currentStep === 'vehicle-type' ? '1' : currentStep === 'vehicle-details' ? '2' : '3'} of 3</span>
              <span>{getProgress()}% Complete</span>
            </div>
          </div>
        </DialogHeader>

        {/* Step 1: Vehicle Type Selection */}
        {currentStep === 'vehicle-type' && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Vehicle Type</h3>
              <div className="grid grid-cols-3 gap-4">
                <Card 
                  className={`cursor-pointer ${formData.vehicleType === '2-wheeler' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleChange('vehicleType', '2-wheeler')}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Bike className="h-12 w-12 mb-2" />
                    <span>2-wheeler</span>
                  </CardContent>
                </Card>
                <Card 
                  className={`cursor-pointer ${formData.vehicleType === '3-wheeler' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleChange('vehicleType', '3-wheeler')}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Truck className="h-12 w-12 mb-2" />
                    <span>3-wheeler</span>
                  </CardContent>
                </Card>
                <Card 
                  className={`cursor-pointer ${formData.vehicleType === '4-wheeler' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleChange('vehicleType', '4-wheeler')}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Car className="h-12 w-12 mb-2" />
                    <span>4-wheeler</span>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Fuel Type</h3>
              <div className="grid grid-cols-3 gap-4">
                {fuelTypes.map((fuel) => (
                  <Card 
                    key={fuel.id}
                    className={`cursor-pointer ${formData.fuelType === fuel.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleChange('fuelType', fuel.id)}
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <fuel.icon className="h-8 w-8 mb-2" />
                      <span>{fuel.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Purpose</h3>
              <RadioGroup 
                value={formData.purpose} 
                onValueChange={(value) => handleChange('purpose', value)}
                className="grid grid-cols-2 gap-4"
              >
                {purposeTypes.map((purpose) => (
                  <div key={purpose.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={purpose.id} id={purpose.id} />
                    <Label htmlFor={purpose.id}>{purpose.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle Details */}
        {currentStep === 'vehicle-details' && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Make Selection</h3>
              <div className="grid grid-cols-5 gap-2">
                {vehicleMakes.slice(0, 5).map((make) => (
                  <div
                    key={make.id}
                    className={`border p-2 rounded-md cursor-pointer flex flex-col items-center justify-center h-24 ${
                      formData.make === make.id ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                    onClick={() => handleChange('make', make.id)}
                  >
                    <div className="h-10 w-10 relative flex items-center justify-center">
                      <img 
                        src={make.logo} 
                        alt={make.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-xs text-center mt-2">{make.name}</span>
                  </div>
                ))}
              </div>
              <Select
                value={formData.make}
                onValueChange={(value) => handleChange('make', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a make" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleMakes.map((make) => (
                    <SelectItem key={make.id} value={make.id}>
                      {make.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Model Selection</h3>
              {formData.make === 'honda' && (
                <div className="grid grid-cols-3 gap-4">
                  {hondaModels.map((model) => (
                    <Card 
                      key={model.id}
                      className={`cursor-pointer overflow-hidden ${formData.model === model.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => handleChange('model', model.id)}
                    >
                      <div className="h-24 bg-neutral-100">
                        <img 
                          src={model.thumbnail} 
                          alt={model.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-2 text-center">
                        <span className="text-sm">{model.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {formData.make !== 'honda' && (
                <Select
                  value={formData.model}
                  onValueChange={(value) => handleChange('model', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="model1">Model 1</SelectItem>
                    <SelectItem value="model2">Model 2</SelectItem>
                    <SelectItem value="model3">Model 3</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Year</h3>
                <Select
                  value={formData.year.toString()}
                  onValueChange={(value) => handleChange('year', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 25 }, (_, i) => (
                      <SelectItem key={i} value={(new Date().getFullYear() - i).toString()}>
                        {new Date().getFullYear() - i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Color</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="h-10 w-10 rounded-md border p-0"
                  />
                  <div 
                    className="w-8 h-8 rounded-full border" 
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">License Plate Number</h3>
              <Input
                value={formData.licensePlate}
                onChange={(e) => handleChange('licensePlate', e.target.value)}
                placeholder="Enter license plate (e.g., MH01AB1234)"
              />
            </div>
          </div>
        )}

        {/* Step 3: Location & Finalization */}
        {currentStep === 'location-finalization' && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <h3 className="text-lg font-semibold">Pincode</h3>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={handleAutoDetectLocation}
                  className="p-0 h-auto"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Auto-detect location
                </Button>
              </div>
              <Input
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                placeholder="Enter your pincode"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Address</h3>
              <Input
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Your address will appear here after pincode verification"
                readOnly={!formData.pincode}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Project Name</h3>
              <Input
                value={formData.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
                placeholder="Give your project a name"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Current Vehicle Photos (Optional)</h3>
              <div className="border-2 border-dashed rounded-md p-4 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  id="photo-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  Select Files
                </Button>
                {formData.photos.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {formData.photos.length} file(s) selected
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          {currentStep !== 'vehicle-type' ? (
            <Button
              variant="outline"
              onClick={handlePrevious}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={handleNext}
            disabled={!isCurrentStepComplete()}
          >
            {currentStep === 'location-finalization' ? (
              <>
                Create Project
                <Check className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectWizard;