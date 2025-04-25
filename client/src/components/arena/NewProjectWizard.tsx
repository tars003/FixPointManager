import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Car, Check, Truck, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Type definitions
export interface NewProjectWizardProps {
  onClose: () => void;
  onCreateProject: (projectData: any) => void;
  availableVehicles: Array<{
    id: number;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    image: string;
  }>;
}

// Component definition
const NewProjectWizard: React.FC<NewProjectWizardProps> = ({
  onClose,
  onCreateProject,
  availableVehicles
}) => {
  // State to track current step
  const [step, setStep] = useState<number>(1);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<string | null>(null);
  const [identificationMethod, setIdentificationMethod] = useState<'registration' | 'manual'>('registration');
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');

  // Mock manufacturers list
  const manufacturers = [
    'Honda', 'Hyundai', 'Maruti Suzuki', 'Tata', 'Toyota', 'Mahindra',
    'Kia', 'MG', 'Ford', 'Volkswagen', 'Renault', 'Nissan'
  ];

  // Mock models based on manufacturer
  const getModels = (manufacturer: string) => {
    const modelsByManufacturer: Record<string, string[]> = {
      'Honda': ['City', 'Amaze', 'Jazz', 'WR-V', 'Civic'],
      'Hyundai': ['i10', 'i20', 'Venue', 'Creta', 'Verna', 'Tucson'],
      'Maruti Suzuki': ['Swift', 'Baleno', 'Dzire', 'Ertiga', 'Brezza', 'Alto'],
      'Tata': ['Tiago', 'Nexon', 'Harrier', 'Safari', 'Punch', 'Altroz'],
      'Toyota': ['Innova', 'Fortuner', 'Glanza', 'Urban Cruiser', 'Camry'],
      'Mahindra': ['XUV700', 'Thar', 'Scorpio', 'XUV300', 'Bolero'],
      'Kia': ['Seltos', 'Sonet', 'Carnival', 'Carens'],
      'MG': ['Hector', 'Astor', 'ZS EV', 'Gloster']
    };
    
    return modelsByManufacturer[manufacturer] || [];
  };

  // Get years (last 20 years)
  const years = Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() - i).toString());

  // Mock variants based on model
  const getVariants = (model: string) => {
    const variantsByModel: Record<string, string[]> = {
      'City': ['V MT', 'V CVT', 'VX MT', 'VX CVT', 'ZX MT', 'ZX CVT'],
      'Creta': ['E', 'EX', 'S', 'S+', 'SX', 'SX(O)'],
      'Swift': ['LXi', 'VXi', 'ZXi', 'ZXi+', 'LXi(O)', 'VXi(O)'],
      'Nexon': ['XE', 'XM', 'XZ', 'XZ+', 'XZ+ Lux', 'XZ+ Dark Edition'],
    };
    
    // Return default variants if specific ones aren't defined
    return variantsByModel[model] || ['Base', 'Mid', 'High', 'Premium', 'Top'];
  };

  // Customization categories
  const customizationCategories = [
    {
      id: 'exterior',
      name: 'Exterior Modifications',
      description: 'Body kits, wraps, paint customization',
      icon: Car,
      compatibility: 98
    },
    {
      id: 'interior',
      name: 'Interior Customization',
      description: 'Seats, dashboard, lighting, upholstery',
      icon: Car,
      compatibility: 95
    },
    {
      id: 'performance',
      name: 'Performance Upgrades',
      description: 'Engine mods, exhaust, intake, ECU tuning',
      icon: Car,
      compatibility: 85
    },
    {
      id: 'wheels',
      name: 'Wheels & Suspension',
      description: 'Rims, tires, lowering, coilovers',
      icon: Car,
      compatibility: 90
    },
    {
      id: 'lighting',
      name: 'Lighting Systems',
      description: 'Headlights, taillights, accent lighting',
      icon: Car,
      compatibility: 95
    },
    {
      id: 'audio',
      name: 'Audio & Electronics',
      description: 'Sound systems, displays, gadgets',
      icon: Car,
      compatibility: 88
    }
  ];

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  // Get the total estimated budget based on selected categories
  const getEstimatedBudget = () => {
    const baseCosts: Record<string, number[]> = {
      'exterior': [25000, 150000],
      'interior': [20000, 100000],
      'performance': [35000, 200000],
      'wheels': [40000, 120000],
      'lighting': [15000, 60000],
      'audio': [20000, 80000]
    };
    
    if (selectedCategories.length === 0) return [0, 0];
    
    return selectedCategories.reduce(
      (acc, category) => {
        const [min, max] = baseCosts[category] || [0, 0];
        return [acc[0] + min, acc[1] + max];
      },
      [0, 0]
    );
  };

  // Get the total estimated time based on selected categories
  const getEstimatedTime = () => {
    const baseTimes: Record<string, number> = {
      'exterior': 5,
      'interior': 3,
      'performance': 4,
      'wheels': 2,
      'lighting': 2,
      'audio': 3
    };
    
    if (selectedCategories.length === 0) return 0;
    
    // Calculate total days (with some overlap for concurrent work)
    const totalDays = selectedCategories.reduce(
      (acc, category) => acc + (baseTimes[category] || 0),
      0
    );
    
    return Math.ceil(totalDays * 0.7); // Apply a 30% overlap factor
  };

  // Handle OTP verification
  const handleVerifyOTP = () => {
    // In a real app, this would verify with backend
    if (otpValue.length === 6) {
      setOtpVerified(true);
      
      // Auto select the first vehicle for demo
      if (availableVehicles.length > 0) {
        setSelectedVehicleId(availableVehicles[0].id);
      }
    }
  };

  // Handle OTP sending
  const handleSendOTP = () => {
    // In a real app, this would send OTP via API
    if (registrationNumber.length >= 8) {
      setOtpSent(true);
    }
  };

  // Handle final submission
  const handleCreateProject = () => {
    const selectedVehicle = availableVehicles.find(v => v.id === selectedVehicleId);
    
    // Create project data from form
    const projectData = {
      name: projectName,
      description: projectDescription,
      vehicleId: selectedVehicleId,
      vehicleType: selectedVehicleType,
      fuelType: selectedFuelType,
      registrationNumber: identificationMethod === 'registration' ? registrationNumber : null,
      manufacturer: selectedManufacturer,
      model: selectedModel,
      year: selectedYear,
      variant: selectedVariant,
      customizationCategories: selectedCategories,
      estimatedBudget: getEstimatedBudget(),
      estimatedTime: getEstimatedTime(),
      created: new Date().toISOString()
    };
    
    onCreateProject(projectData);
  };

  // Go to next step
  const goToNextStep = () => {
    setStep(step + 1);
  };

  // Go to previous step
  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  // Render OTP input fields
  const renderOTPFields = () => {
    return (
      <div className="flex gap-2 mt-4">
        <Input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otpValue}
          onChange={(e) => setOtpValue(e.target.value)}
          maxLength={6}
          className="text-center"
        />
        <Button onClick={handleVerifyOTP} disabled={otpValue.length !== 6}>
          Verify
        </Button>
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-card border rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">Start Your Customization Journey</h2>
            <p className="text-muted-foreground text-sm">Step {step} of 4</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Vehicle Type and Fuel Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Select Vehicle Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all ${selectedVehicleType === 'four-wheeler' ? 'border-primary ring-2 ring-primary/20' : ''}`}
                    onClick={() => setSelectedVehicleType('four-wheeler')}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Four Wheeler</CardTitle>
                        {selectedVehicleType === 'four-wheeler' && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center py-4">
                        <Car className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <CardDescription>Cars, SUVs, Trucks</CardDescription>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all ${selectedVehicleType === 'two-wheeler' ? 'border-primary ring-2 ring-primary/20' : ''}`}
                    onClick={() => setSelectedVehicleType('two-wheeler')}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Two Wheeler</CardTitle>
                        {selectedVehicleType === 'two-wheeler' && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center py-4">
                        <Bike className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <CardDescription>Motorcycles, Scooters</CardDescription>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all ${selectedVehicleType === 'commercial' ? 'border-primary ring-2 ring-primary/20' : ''}`}
                    onClick={() => setSelectedVehicleType('commercial')}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Commercial</CardTitle>
                        {selectedVehicleType === 'commercial' && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center py-4">
                        <Truck className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <CardDescription>Trucks, Vans, Utility Vehicles</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {selectedVehicleType && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Select Fuel Type</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG/LPG'].map((fuel) => (
                      <Button
                        key={fuel}
                        variant={selectedFuelType === fuel.toLowerCase() ? "default" : "outline"}
                        onClick={() => setSelectedFuelType(fuel.toLowerCase())}
                        className="h-auto py-2 px-4"
                      >
                        {fuel}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Step 2: Vehicle Identification */}
          {step === 2 && (
            <div className="space-y-6">
              <Tabs
                defaultValue={identificationMethod}
                onValueChange={(value) => setIdentificationMethod(value as 'registration' | 'manual')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="registration">Add by Registration</TabsTrigger>
                  <TabsTrigger value="manual">Manual Selection</TabsTrigger>
                </TabsList>
                
                <TabsContent value="registration" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="registration">Vehicle Registration Number</Label>
                      <div className="flex mt-1.5">
                        <Input
                          id="registration"
                          placeholder="e.g., KA01MJ8234"
                          value={registrationNumber}
                          onChange={(e) => setRegistrationNumber(e.target.value)}
                          className="rounded-r-none"
                          disabled={otpSent}
                        />
                        <Button 
                          onClick={handleSendOTP} 
                          disabled={registrationNumber.length < 8 || otpSent}
                          className="rounded-l-none"
                        >
                          Verify
                        </Button>
                      </div>
                    </div>
                    
                    {otpSent && (
                      <div>
                        <Label>Enter OTP sent to registered mobile</Label>
                        {renderOTPFields()}
                      </div>
                    )}
                    
                    {otpVerified && (
                      <div className="bg-muted p-4 rounded-lg mt-4">
                        <h4 className="font-medium mb-2">Verified Vehicle Details</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Make:</span>
                            <span className="ml-2 font-medium">Honda</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Model:</span>
                            <span className="ml-2 font-medium">City</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Year:</span>
                            <span className="ml-2 font-medium">2021</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Variant:</span>
                            <span className="ml-2 font-medium">ZX CVT</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Engine:</span>
                            <span className="ml-2 font-medium">1.5L i-VTEC</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Transmission:</span>
                            <span className="ml-2 font-medium">CVT</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="manual" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="manufacturer">Manufacturer</Label>
                      <Select 
                        value={selectedManufacturer} 
                        onValueChange={setSelectedManufacturer}
                      >
                        <SelectTrigger id="manufacturer">
                          <SelectValue placeholder="Select manufacturer" />
                        </SelectTrigger>
                        <SelectContent>
                          {manufacturers.map(manufacturer => (
                            <SelectItem key={manufacturer} value={manufacturer}>
                              {manufacturer}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Select 
                        value={selectedModel} 
                        onValueChange={setSelectedModel}
                        disabled={!selectedManufacturer}
                      >
                        <SelectTrigger id="model">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {getModels(selectedManufacturer).map(model => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Select 
                        value={selectedYear} 
                        onValueChange={setSelectedYear}
                      >
                        <SelectTrigger id="year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="variant">Variant</Label>
                      <Select 
                        value={selectedVariant} 
                        onValueChange={setSelectedVariant}
                        disabled={!selectedModel}
                      >
                        <SelectTrigger id="variant">
                          <SelectValue placeholder="Select variant" />
                        </SelectTrigger>
                        <SelectContent>
                          {getVariants(selectedModel).map(variant => (
                            <SelectItem key={variant} value={variant}>
                              {variant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {selectedManufacturer && selectedModel && selectedYear && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Select Your Vehicle</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {availableVehicles.filter(v => 
                          v.make === selectedManufacturer || 
                          v.model === selectedModel
                        ).map(vehicle => (
                          <Card 
                            key={vehicle.id}
                            className={`cursor-pointer transition-all ${selectedVehicleId === vehicle.id ? 'border-primary ring-2 ring-primary/20' : ''}`}
                            onClick={() => setSelectedVehicleId(vehicle.id)}
                          >
                            <div className="aspect-video w-full overflow-hidden">
                              <img 
                                src={vehicle.image} 
                                alt={`${vehicle.make} ${vehicle.model}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">{vehicle.make} {vehicle.model}</h4>
                                  <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                                </div>
                                {selectedVehicleId === vehicle.id && (
                                  <Check className="h-5 w-5 text-primary" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {/* Step 3: Customization Categories */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Select Customization Categories</h3>
              <p className="text-muted-foreground">
                Choose the areas you want to customize for your vehicle
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customizationCategories.map(category => (
                  <Card 
                    key={category.id}
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedCategories.includes(category.id) ? 'border-primary ring-2 ring-primary/20' : ''
                    }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        {selectedCategories.includes(category.id) && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between w-full">
                        <span>Compatibility: {category.compatibility}%</span>
                        <span className={
                          category.compatibility > 90 ? 'text-green-500' : 
                          category.compatibility > 80 ? 'text-yellow-500' : 'text-red-500'
                        }>
                          {category.compatibility > 90 ? 'Excellent' : 
                           category.compatibility > 80 ? 'Good' : 'Limited'}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {selectedCategories.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">Estimated Budget</h4>
                        <p className="text-lg font-semibold">
                          ₹{getEstimatedBudget()[0].toLocaleString()} - ₹{getEstimatedBudget()[1].toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">Estimated Time</h4>
                        <p className="text-lg font-semibold">{getEstimatedTime()} days</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">Parts Availability</h4>
                        <p className="text-lg font-semibold text-green-500">In Stock</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {/* Step 4: Project Details */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Project Details</h3>
              <p className="text-muted-foreground">
                Give your project a name and description
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    placeholder="e.g., City Sport Edition"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <textarea
                    id="projectDescription"
                    placeholder="Describe your customization vision..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                  />
                </div>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Project Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Vehicle Type:</span>
                        <span className="ml-2 capitalize">
                          {selectedVehicleType || 'Not selected'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Fuel Type:</span>
                        <span className="ml-2 capitalize">
                          {selectedFuelType || 'Not selected'}
                        </span>
                      </div>
                      
                      {(identificationMethod === 'registration' && otpVerified) ? (
                        <>
                          <div>
                            <span className="text-sm text-muted-foreground">Registration:</span>
                            <span className="ml-2">{registrationNumber}</span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Vehicle:</span>
                            <span className="ml-2">Honda City (2021)</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-sm text-muted-foreground">Make & Model:</span>
                            <span className="ml-2">
                              {selectedManufacturer} {selectedModel}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Year & Variant:</span>
                            <span className="ml-2">
                              {selectedYear} {selectedVariant}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Customization Categories:</span>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {selectedCategories.length > 0 ? (
                          selectedCategories.map(categoryId => {
                            const category = customizationCategories.find(c => c.id === categoryId);
                            return (
                              <span key={categoryId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                {category?.name}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-muted-foreground">No categories selected</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4 mt-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">Estimated Budget</h4>
                        <p className="text-lg font-semibold">
                          ₹{getEstimatedBudget()[0].toLocaleString()} - ₹{getEstimatedBudget()[1].toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">Estimated Time</h4>
                        <p className="text-lg font-semibold">{getEstimatedTime()} days</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
                        <p className="text-lg font-semibold">
                          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={goToPreviousStep}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < 4 ? (
            <Button onClick={goToNextStep} disabled={
              (step === 1 && (!selectedVehicleType || !selectedFuelType)) ||
              (step === 2 && (
                (identificationMethod === 'registration' && !otpVerified) ||
                (identificationMethod === 'manual' && !selectedVehicleId)
              )) ||
              (step === 3 && selectedCategories.length === 0)
            }>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleCreateProject} disabled={!projectName}>
              Create Project <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewProjectWizard;