import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CalendarIcon, 
  Camera, 
  Car, 
  ChevronLeft, 
  ChevronRight, 
  CircleCheck, 
  ClipboardCheck,
  CreditCard, 
  FileBox, 
  Upload 
} from 'lucide-react';

type AddVehicleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
};

// Define validation schema for Vehicle Registration
const vehicleRegistrationSchema = z.object({
  registrationNumber: z.string()
    .min(5, { message: "Registration number must be at least 5 characters" })
    .max(15, { message: "Registration number must be at most 15 characters" }),
  registrationDate: z.date({
    required_error: "Registration date is required",
  }),
  registrationDocument: z.any().optional(),
});

// Define validation schema for Vehicle Specifications
const vehicleSpecificationsSchema = z.object({
  vehicleType: z.string({ required_error: "Vehicle type is required" }),
  make: z.string({ required_error: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z.string()
    .regex(/^\d{4}$/, { message: "Year must be a 4-digit number" }),
  chassisNumber: z.string()
    .min(3, { message: "Chassis number is required" })
    .max(30, { message: "Chassis number is too long" }),
  engineNumber: z.string()
    .min(3, { message: "Engine number is required" }),
  seatingCapacity: z.string()
    .regex(/^\d+$/, { message: "Seating capacity must be a number" }),
  loadCapacity: z.string()
    .regex(/^\d+$/, { message: "Load capacity must be a number" })
    .optional(),
  fuelType: z.string({ required_error: "Fuel type is required" }),
  color: z.string().min(1, { message: "Color is required" }),
});

// Define validation schema for Ownership Information
const ownershipInformationSchema = z.object({
  purchaseDate: z.date({
    required_error: "Purchase date is required",
  }),
  purchasePrice: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Price must be a valid amount" }),
  dealer: z.string().min(1, { message: "Dealer information is required" }),
  purchaseDocument: z.any().optional(),
  financingType: z.enum(["none", "loan", "lease"], {
    required_error: "Please select financing type",
  }),
  loanDetails: z.object({
    lender: z.string().optional(),
    amount: z.string().optional(),
    term: z.string().optional(),
    interestRate: z.string().optional(),
  }).optional(),
  insuranceProvider: z.string({ required_error: "Insurance provider is required" }),
  policyNumber: z.string().min(1, { message: "Policy number is required" }),
  coverageType: z.string({ required_error: "Coverage type is required" }),
  premium: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Premium must be a valid amount" }),
  policyStartDate: z.date({
    required_error: "Policy start date is required",
  }),
  policyEndDate: z.date({
    required_error: "Policy end date is required",
  }),
  policyDocument: z.any().optional(),
});

// Define validation schema for Additional Information
const additionalInformationSchema = z.object({
  hasCommercialPermit: z.boolean().default(false),
  permitType: z.string().optional(),
  permitStartDate: z.date().optional(),
  permitEndDate: z.date().optional(),
  permitDocument: z.any().optional(),
  roadTaxPaid: z.boolean().default(false),
  roadTaxDetails: z.string().optional(),
  hasFitnessCertificate: z.boolean().default(false),
  fitnessCertificateExpiry: z.date().optional(),
  hasGpsDevice: z.boolean().default(false),
  gpsDeviceId: z.string().optional(),
  gpsInstallationDate: z.date().optional(),
  gpsProvider: z.string().optional(),
  gpsTrackingUrl: z.string().optional(),
});

// Combine all schemas for the complete vehicle form
const fullVehicleSchema = z.object({
  registration: vehicleRegistrationSchema,
  specifications: vehicleSpecificationsSchema,
  ownership: ownershipInformationSchema,
  additional: additionalInformationSchema,
});

// Extract type from schema
type VehicleFormValues = z.infer<typeof fullVehicleSchema>;

export function AddVehicleDialog({ open, onOpenChange, theme }: AddVehicleDialogProps) {
  // Entry method - start with entry method selection
  const [entryMethod, setEntryMethod] = useState<'select' | 'plateNumber' | null>(null);
  // Current step in the multi-step form
  const [currentStep, setCurrentStep] = useState(0);
  // OTP verification
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  // Manufacturer selection for manual entry
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  
  // Vehicle manufacturers with logos
  const manufacturers = [
    { id: 'audi', name: 'Audi', logo: '🇩🇪' },
    { id: 'bmw', name: 'BMW', logo: '🇩🇪' },
    { id: 'honda', name: 'Honda', logo: '🇯🇵' },
    { id: 'hyundai', name: 'Hyundai', logo: '🇰🇷' },
    { id: 'mahindra', name: 'Mahindra', logo: '🇮🇳' },
    { id: 'maruti', name: 'Maruti Suzuki', logo: '🇮🇳' },
    { id: 'mercedes', name: 'Mercedes-Benz', logo: '🇩🇪' },
    { id: 'tata', name: 'Tata Motors', logo: '🇮🇳' },
    { id: 'toyota', name: 'Toyota', logo: '🇯🇵' },
    { id: 'volkswagen', name: 'Volkswagen', logo: '🇩🇪' },
  ];
  
  // Step titles for the progress indicator
  const steps = [
    "Vehicle Registration",
    "Vehicle Specifications",
    "Ownership Information",
    "Additional Information",
    "Review & Submit"
  ];
  
  // Form initialization
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(fullVehicleSchema),
    defaultValues: {
      registration: {
        registrationNumber: '',
        registrationDate: undefined,
        registrationDocument: undefined,
      },
      specifications: {
        vehicleType: '',
        make: '',
        model: '',
        year: '',
        chassisNumber: '',
        engineNumber: '',
        seatingCapacity: '',
        loadCapacity: '',
        fuelType: '',
        color: '',
      },
      ownership: {
        purchaseDate: undefined,
        purchasePrice: '',
        dealer: '',
        purchaseDocument: undefined,
        financingType: 'none',
        loanDetails: {
          lender: '',
          amount: '',
          term: '',
          interestRate: ''
        },
        insuranceProvider: '',
        policyNumber: '',
        coverageType: '',
        premium: '',
        policyStartDate: undefined,
        policyEndDate: undefined,
        policyDocument: undefined,
      },
      additional: {
        hasCommercialPermit: false,
        permitType: '',
        permitStartDate: undefined,
        permitEndDate: undefined,
        permitDocument: undefined,
        roadTaxPaid: false,
        roadTaxDetails: '',
        hasFitnessCertificate: false,
        fitnessCertificateExpiry: undefined,
        hasGpsDevice: false,
        gpsDeviceId: '',
        gpsInstallationDate: undefined,
        gpsProvider: '',
        gpsTrackingUrl: '',
      }
    }
  });
  
  // Navigation between steps
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };
  
  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };
  
  // Form submission handler
  const onSubmit = (data: VehicleFormValues) => {
    console.log("Form submitted with data:", data);
    // Here we would typically send this to an API endpoint
    alert("Vehicle added successfully!");
    onOpenChange(false);
  };
  
  // Scan registration plate function (mock)
  const scanRegistrationPlate = () => {
    // In a real scenario, this would activate the camera and do OCR
    // For demo purposes, we're just setting a mock plate number
    form.setValue('registration.registrationNumber', 'KA05 MG4321');
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  
  // Function to handle plate verification and OTP
  const verifyPlateNumber = () => {
    // This would normally call an API to send OTP to the registered phone number
    setShowOtpInput(true);
  };
  
  const verifyOtp = () => {
    setIsVerifying(true);
    // Mock OTP verification delay
    setTimeout(() => {
      setIsVerifying(false);
      // Set form values based on the verified plate number
      form.setValue('specifications.make', 'Toyota');
      form.setValue('specifications.model', 'Innova');
      form.setValue('specifications.year', '2022');
      form.setValue('specifications.fuelType', 'diesel');
      form.setValue('specifications.color', 'White');
      // Move to the registration step after verification
      setEntryMethod('plateNumber');
      setCurrentStep(0);
    }, 1500);
  };
  
  // Function to reset entry method selection
  const resetEntryMethod = () => {
    setEntryMethod(null);
    setShowOtpInput(false);
    setOtpValue("");
    setSelectedManufacturer("");
    setCurrentStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-screen overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>Add New Vehicle</DialogTitle>
          <DialogDescription>
            {entryMethod === null 
              ? "Select a method to add your vehicle"
              : "Please fill in the vehicle details to add it to your fleet."}
          </DialogDescription>
        </DialogHeader>
        
        {/* Entry Method Selection */}
        {entryMethod === null && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative border rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md"
                onClick={() => setShowOtpInput(true)}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Car className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-center text-lg font-medium mb-2">Add by Number Plate</h3>
                <p className="text-center text-sm text-gray-500">
                  Enter or scan your vehicle's registration number for quick setup with OTP verification
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative border rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-md"
                onClick={() => setEntryMethod('select')}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <ClipboardCheck className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-center text-lg font-medium mb-2">Manual Selection</h3>
                <p className="text-center text-sm text-gray-500">
                  Choose your vehicle's make, model, and enter details manually
                </p>
              </motion.div>
            </div>
            
            {/* OTP Verification Section */}
            {showOtpInput && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-xl p-6 mt-4"
              >
                <h3 className="text-lg font-medium mb-4">Number Plate Verification</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="plate-number">Registration Number</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        id="plate-number"
                        placeholder="e.g., KA01MG5678" 
                        value={form.getValues('registration.registrationNumber')}
                        onChange={(e) => form.setValue('registration.registrationNumber', e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={scanRegistrationPlate}>
                        <Camera className="h-4 w-4 mr-2" />
                        Scan
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Enter your vehicle's registration number exactly as it appears on your RC
                    </p>
                  </div>
                  
                  {form.getValues('registration.registrationNumber') && (
                    <div>
                      <Button 
                        type="button" 
                        onClick={verifyPlateNumber}
                        className="w-full"
                      >
                        Verify Number Plate
                      </Button>
                    </div>
                  )}
                  
                  {otpValue.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      <Input 
                        placeholder="Enter OTP sent to registered phone" 
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={verifyOtp}
                        disabled={otpValue.length < 4 || isVerifying}
                      >
                        {isVerifying ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying
                          </div>
                        ) : (
                          'Verify OTP'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Manufacturer Selection for Manual Method */}
            {entryMethod === 'select' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-xl p-6 mt-4"
              >
                <h3 className="text-lg font-medium mb-4">Select Manufacturer</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {manufacturers.map((manufacturer) => (
                    <motion.div 
                      key={manufacturer.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer ${
                        selectedManufacturer === manufacturer.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedManufacturer(manufacturer.id);
                        form.setValue('specifications.make', manufacturer.name);
                      }}
                    >
                      <div className="text-3xl mb-2">{manufacturer.logo}</div>
                      <span className="text-sm font-medium">{manufacturer.name}</span>
                    </motion.div>
                  ))}
                </div>
                
                {selectedManufacturer && (
                  <Button 
                    type="button" 
                    className="w-full mt-6"
                    onClick={() => {
                      setCurrentStep(0);
                      // Keep the entry method as 'select'
                    }}
                  >
                    Continue
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        )}
        
        {/* Progress bar - only show when an entry method is selected */}
        {entryMethod !== null && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`text-xs font-medium ${
                    index <= currentStep 
                      ? (theme === 'dark' ? 'text-primary' : 'text-primary') 
                      : (theme === 'dark' ? 'text-gray-600' : 'text-gray-400')
                  } ${index === 0 ? 'text-left' : index === steps.length - 1 ? 'text-right' : 'text-center'}`}
                  style={{ width: `${100 / steps.length}%` }}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Form - only show when an entry method is selected */}
        {entryMethod !== null && (
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Vehicle Registration */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                      Registration Information
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="registration.registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input 
                                placeholder="e.g., KA01 MG5678" 
                                {...field} 
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </FormControl>
                            <Button type="button" variant="outline" onClick={scanRegistrationPlate}>
                              <Camera className="h-4 w-4 mr-2" />
                              Scan
                            </Button>
                          </div>
                          <FormDescription>
                            Enter the vehicle registration number as it appears on the registration certificate.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="registration.registrationDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Registration Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""} ${
                                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''
                                  }`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select registration date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className={`w-auto p-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            The date when the vehicle was registered with the RTO.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormLabel>Registration Document</FormLabel>
                      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                        theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300'
                      }`}>
                        <div className="space-y-1 text-center">
                          <FileBox className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="registration-document"
                              className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                            >
                              <span>Upload a file</span>
                              <input
                                id="registration-document"
                                name="registration-document"
                                type="file"
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  {currentStep > 0 ? (
                    <Button type="button" variant="outline" onClick={previousStep}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" onClick={resetEntryMethod}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back to Entry Methods
                    </Button>
                  )}
                  
                  <div className="ml-auto">
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}