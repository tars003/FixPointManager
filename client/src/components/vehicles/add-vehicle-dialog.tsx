import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertVehicleSchema } from '@shared/schema';
import { 
  Activity,
  ActivitySquare,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Award,
  Ban,
  Brain,
  Calendar as CalendarIcon, 
  Camera, 
  Car, 
  CarFront,
  CheckCircle,
  ChevronLeft, 
  ChevronRight, 
  Circle,
  CircleCheck, 
  CircleDollarSign,
  CircleDot,
  Clock,
  Clock3,
  ClipboardCheck,
  CreditCard, 
  Download,
  Droplets,
  FileBox,
  FileText,
  Filter,
  GitBranch,
  KeySquare,
  Leaf,
  ListFilter,
  MoreHorizontal,
  Plus,
  Search,
  Share,
  Shield,
  ShieldOff,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  Upload,
  Users,
  Warehouse,
  X
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

// Status categories with icons for vehicle status selection
const statusCategories = [
  { 
    id: 'active', 
    label: 'Active', 
    icon: <Activity className="h-4 w-4 text-emerald-600" />,
    bgClass: 'bg-emerald-50 border-emerald-200'
  },
  { 
    id: 'recently-purchased', 
    label: 'Recently Purchased', 
    icon: <ShoppingBag className="h-4 w-4 text-blue-600" />,
    bgClass: 'bg-blue-50 border-blue-200'
  },
  { 
    id: 'pre-owned', 
    label: 'Pre-owned', 
    icon: <Clock3 className="h-4 w-4 text-indigo-600" />,
    bgClass: 'bg-indigo-50 border-indigo-200'
  },
  { 
    id: 'in-maintenance', 
    label: 'In Maintenance', 
    icon: <Clock className="h-4 w-4 text-amber-600" />,
    bgClass: 'bg-amber-50 border-amber-200'
  },
  { 
    id: 'garage-stored', 
    label: 'Garage Stored', 
    icon: <Warehouse className="h-4 w-4 text-cyan-600" />,
    bgClass: 'bg-cyan-50 border-cyan-200'
  },
  { 
    id: 'out-of-service', 
    label: 'Out of Service', 
    icon: <AlertOctagon className="h-4 w-4 text-gray-600" />,
    bgClass: 'bg-gray-50 border-gray-200'
  },
  { 
    id: 'commercial-fleet', 
    label: 'Commercial Fleet', 
    icon: <Truck className="h-4 w-4 text-violet-600" />,
    bgClass: 'bg-violet-50 border-violet-200'
  },
  { 
    id: 'leased-out', 
    label: 'Leased Out', 
    icon: <KeySquare className="h-4 w-4 text-green-600" />,
    bgClass: 'bg-green-50 border-green-200'
  },
  { 
    id: 'for-sale', 
    label: 'For Sale', 
    icon: <Tag className="h-4 w-4 text-rose-600" />,
    bgClass: 'bg-rose-50 border-rose-200'
  },
  { 
    id: 'sold', 
    label: 'Sold', 
    icon: <CheckCircle className="h-4 w-4 text-blue-600" />,
    bgClass: 'bg-blue-50 border-blue-200'
  },
  { 
    id: 'impounded', 
    label: 'Impounded', 
    icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
    bgClass: 'bg-red-50 border-red-200'
  },
  { 
    id: 'under-legal-hold', 
    label: 'Under Legal Hold', 
    icon: <Shield className="h-4 w-4 text-amber-600" />,
    bgClass: 'bg-amber-50 border-amber-200'
  },
  { 
    id: 'stolen', 
    label: 'Stolen', 
    icon: <ShieldOff className="h-4 w-4 text-red-600" />,
    bgClass: 'bg-red-50 border-red-200'
  },
  { 
    id: 'scrapped', 
    label: 'Scrapped', 
    icon: <Trash2 className="h-4 w-4 text-gray-600" />,
    bgClass: 'bg-gray-50 border-gray-200'
  },
  { 
    id: 'totaled', 
    label: 'Totaled', 
    icon: <Ban className="h-4 w-4 text-gray-600" />,
    bgClass: 'bg-gray-50 border-gray-200'
  },
];

export function AddVehicleDialog({ open, onOpenChange, theme }: AddVehicleDialogProps) {
  // Current step in the multi-step form
  const [currentStep, setCurrentStep] = useState(0);
  
  // Main selection method (number plate or manual selection)
  const [addMethod, setAddMethod] = useState<'selection' | 'number-plate' | 'form'>('selection');
  
  // OTP verification
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Track the selected vehicle status
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  
  // For toast notifications
  const { toast } = useToast();
  
  // Access query client for cache invalidation
  const queryClient = useQueryClient();
  
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
  
  // Mutation for adding a vehicle
  const addVehicleMutation = useMutation({
    mutationFn: async (data: any) => {
      // Validate required fields before submission
      if (!data.registration.registrationNumber) {
        throw new Error("Registration number is required");
      }
      
      if (!data.specifications.make || !data.specifications.model || !data.specifications.year) {
        throw new Error("Vehicle make, model, and year are required");
      }
      
      // Format the data according to the API requirements
      const formattedData = {
        userId: 1, // Example user ID
        name: `${data.specifications.make} ${data.specifications.model}`,
        make: data.specifications.make,
        model: data.specifications.model,
        year: parseInt(data.specifications.year),
        licensePlate: data.registration.registrationNumber,
        mileage: 0, // Default to 0 for new entries
        fuelType: data.specifications.fuelType,
        vehicleType: data.specifications.vehicleType,
        status: selectedStatus, // Use the selected status instead of default
        // Include other optional fields if present
        vin: data.specifications.chassisNumber || null,
        purchaseDate: data.ownership.purchaseDate || null,
      };
      
      const response = await apiRequest('POST', '/api/vehicles', formattedData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      toast({
        title: "Vehicle added successfully",
        description: "Your vehicle has been added to your fleet.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error adding vehicle",
        description: error.message || "Failed to add vehicle. Please try again.",
        variant: "destructive"
      });
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
    addVehicleMutation.mutate(data);
  };
  
  // Scan registration plate function
  const scanRegistrationPlate = () => {
    // In a real scenario, this would activate the camera and do OCR
    // For demo purposes, we're just setting a mock plate number
    form.setValue('registration.registrationNumber', 'KA05 MG4321');
  };
  
  // Send OTP handler
  const handleSendOtp = () => {
    const registrationNumber = form.getValues('registration.registrationNumber');
    if (!registrationNumber) {
      toast({
        title: "Registration number required",
        description: "Please enter a valid registration number.",
        variant: "destructive"
      });
      return;
    }
    
    setIsOtpSent(true);
    toast({
      title: "OTP Sent",
      description: "A verification code has been sent to your registered mobile number.",
    });
  };
  
  // Verify OTP handler
  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid verification code.",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      setAddMethod('form');
      // Pre-fill the form with data "fetched" from RTO records
      form.setValue('specifications.make', 'Honda');
      form.setValue('specifications.model', 'City');
      form.setValue('specifications.year', '2022');
      form.setValue('specifications.fuelType', 'petrol');
      form.setValue('specifications.vehicleType', 'four-wheeler');
      form.setValue('specifications.chassisNumber', 'MRHFM56492P150125');
      form.setValue('specifications.engineNumber', 'L15A71234567');
      form.setValue('specifications.seatingCapacity', '5');
      form.setValue('specifications.color', 'White');
      
      toast({
        title: "Verification Successful",
        description: "Vehicle information retrieved from RTO records.",
      });
    }, 2000);
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-screen overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>Add New Vehicle</DialogTitle>
          <DialogDescription>
            {addMethod === 'selection' 
              ? 'Select a method to add your vehicle'
              : addMethod === 'number-plate'
                ? 'Enter or scan your vehicle\'s registration number for quick setup with OTP verification'
                : 'Please fill in the vehicle details to add it to your fleet.'
            }
          </DialogDescription>
        </DialogHeader>
        
        {addMethod === 'selection' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <motion.div 
              className="border rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
              onClick={() => setAddMethod('number-plate')}
              whileHover={{ y: -5 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <Car className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Add by Number Plate</h3>
                <p className="text-gray-500 text-sm">
                  Enter or scan your vehicle's registration number for quick setup with OTP verification
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="border rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
              onClick={() => {
                setAddMethod('form');
                setCurrentStep(0);
              }}
              whileHover={{ y: -5 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <ClipboardCheck className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Manual Selection</h3>
                <p className="text-gray-500 text-sm">
                  Choose your vehicle's make, model, and enter details manually
                </p>
              </div>
            </motion.div>
          </div>
        )}
        
        {addMethod === 'number-plate' && (
          <div className="py-4">
            <div className="border rounded-lg p-6 mb-4">
              <h3 className="text-lg font-medium mb-4">Number Plate Verification</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="registration-number">Registration Number</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="registration-number" 
                      placeholder="e.g., KA01MG5678" 
                      value={form.getValues('registration.registrationNumber')}
                      onChange={(e) => form.setValue('registration.registrationNumber', e.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={scanRegistrationPlate}>
                      <Camera className="h-4 w-4 mr-2" />
                      Scan
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Enter your vehicle's registration number exactly as it appears on your RC</p>
                </div>
                
                {isOtpSent ? (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code (OTP)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="otp" 
                        placeholder="Enter OTP" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        onClick={handleVerifyOtp}
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Circle className="h-4 w-4" />
                            </motion.div>
                            Verifying...
                          </>
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">A 6-digit verification code was sent to your registered mobile number</p>
                  </div>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleSendOtp}
                    className="w-full"
                  >
                    Send OTP for Verification
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {addMethod === 'form' && (
          <>
            {/* Progress bar */}
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Vehicle Registration */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                  Registration Information
                </h3>
                
                {/* Vehicle Status Selection */}
                <div className="mb-4">
                  <Label htmlFor="vehicle-status" className="mb-2 block">Vehicle Status</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {statusCategories.map((category) => (
                      <motion.div
                        key={category.id}
                        className={`flex items-center p-2 border rounded-md cursor-pointer ${selectedStatus === category.id ? 'ring-2 ring-primary' : ''} ${category.bgClass}`}
                        onClick={() => {
                          setSelectedStatus(category.id);
                          toast({
                            title: "Status Selected",
                            description: `Vehicle status set to ${category.label}`,
                          });
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="mr-2">
                          {category.icon}
                        </div>
                        <span className="text-sm font-medium">{category.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
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
            
            {/* Step 2: Vehicle Specifications */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                  Vehicle Specifications
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="specifications.vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            <SelectItem value="two-wheeler">Two-wheeler</SelectItem>
                            <SelectItem value="three-wheeler">Three-wheeler</SelectItem>
                            <SelectItem value="four-wheeler">Four-wheeler</SelectItem>
                            <SelectItem value="heavy-vehicle">Heavy vehicle</SelectItem>
                            <SelectItem value="construction-equipment">Construction equipment</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specifications.make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                              <SelectValue placeholder="Select manufacturer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            <SelectItem value="maruti">Maruti Suzuki</SelectItem>
                            <SelectItem value="tata">Tata Motors</SelectItem>
                            <SelectItem value="mahindra">Mahindra</SelectItem>
                            <SelectItem value="hyundai">Hyundai</SelectItem>
                            <SelectItem value="honda">Honda</SelectItem>
                            <SelectItem value="toyota">Toyota</SelectItem>
                            <SelectItem value="ashok-leyland">Ashok Leyland</SelectItem>
                            <SelectItem value="bajaj">Bajaj</SelectItem>
                            <SelectItem value="tvs">TVS</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specifications.model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Swift, Bolero" 
                            {...field} 
                            className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specifications.year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturing Year</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 2023" 
                            {...field} 
                            className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specifications.chassisNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VIN/Chassis Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., MALAM51BLBM123456" 
                            {...field} 
                            className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specifications.engineNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., K12MN1234567" 
                            {...field} 
                            className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specifications.seatingCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seating Capacity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 5" 
                            {...field} 
                            className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specifications.loadCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Load Capacity (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="For commercial vehicles" 
                            {...field} 
                            className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specifications.fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            <SelectItem value="petrol">Petrol</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="cng">CNG</SelectItem>
                            <SelectItem value="electric">Electric</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="lpg">LPG</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specifications.color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., White, Red" 
                            {...field} 
                            className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            {/* Step 3: Ownership Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                  Ownership Information
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className={`text-base font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Purchase Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ownership.purchaseDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Purchase Date</FormLabel>
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
                                      <span>Select purchase date</span>
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ownership.purchasePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purchase Price (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g., 950000" 
                                {...field} 
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ownership.dealer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dealer/Seller</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Name of dealer or seller" 
                                {...field} 
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <FormLabel>Purchase Document</FormLabel>
                      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                        theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300'
                      }`}>
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="purchase-document"
                              className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                            >
                              <span>Upload a file</span>
                              <input
                                id="purchase-document"
                                name="purchase-document"
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
                  
                  <div>
                    <h4 className={`text-base font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Financing Information
                    </h4>
                    <FormField
                      control={form.control}
                      name="ownership.financingType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Financing Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="none" />
                                <Label htmlFor="none">None (Full Payment)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="loan" id="loan" />
                                <Label htmlFor="loan">Loan</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="lease" id="lease" />
                                <Label htmlFor="lease">Lease</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("ownership.financingType") !== "none" && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md border-gray-200 dark:border-gray-700">
                        <FormField
                          control={form.control}
                          name="ownership.loanDetails.lender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lender/Bank</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Bank or financing company" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="ownership.loanDetails.amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loan Amount (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 750000" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="ownership.loanDetails.term"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loan Term (months)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 60" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="ownership.loanDetails.interestRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Interest Rate (%)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 9.5" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className={`text-base font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Insurance Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ownership.insuranceProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Provider</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                                  <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                                <SelectItem value="bajaj-allianz">Bajaj Allianz</SelectItem>
                                <SelectItem value="hdfc-ergo">HDFC ERGO</SelectItem>
                                <SelectItem value="icici-lombard">ICICI Lombard</SelectItem>
                                <SelectItem value="new-india">New India Assurance</SelectItem>
                                <SelectItem value="tata-aig">Tata AIG</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ownership.policyNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Policy Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Insurance policy number" 
                                {...field} 
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ownership.coverageType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coverage Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                                  <SelectValue placeholder="Select coverage" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                                <SelectItem value="third-party">Third Party Only</SelectItem>
                                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                                <SelectItem value="zero-dep">Zero Depreciation</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ownership.premium"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Premium Amount (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Annual premium amount" 
                                {...field} 
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ownership.policyStartDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Policy Start Date</FormLabel>
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
                                      <span>Select start date</span>
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
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ownership.policyEndDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Policy End Date</FormLabel>
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
                                      <span>Select end date</span>
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
                                  disabled={(date) => {
                                    const startDate = form.watch("ownership.policyStartDate");
                                    return date < new Date() || (startDate && date < startDate);
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <FormLabel>Insurance Policy Document</FormLabel>
                      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                        theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300'
                      }`}>
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="policy-document"
                              className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                            >
                              <span>Upload a file</span>
                              <input
                                id="policy-document"
                                name="policy-document"
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
                </div>
              </div>
            )}
            
            {/* Step 4: Additional Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                  Additional Information
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className={`text-base font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Permits and Taxes
                    </h4>
                    
                    <FormField
                      control={form.control}
                      name="additional.hasCommercialPermit"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Commercial Permit
                            </FormLabel>
                            <FormDescription>
                              Vehicle has a commercial permit
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("additional.hasCommercialPermit") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md border-gray-200 dark:border-gray-700 mb-4">
                        <FormField
                          control={form.control}
                          name="additional.permitType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Permit Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                                    <SelectValue placeholder="Select permit type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                                  <SelectItem value="all-india">All India Permit</SelectItem>
                                  <SelectItem value="state">State Permit</SelectItem>
                                  <SelectItem value="national">National Permit</SelectItem>
                                  <SelectItem value="tourist">Tourist Permit</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="additional.permitStartDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Permit Start Date</FormLabel>
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
                                        <span>Select start date</span>
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
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="additional.permitEndDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Permit End Date</FormLabel>
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
                                        <span>Select end date</span>
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
                                    disabled={(date) => {
                                      const permitStartDate = form.watch("additional.permitStartDate");
                                      return permitStartDate ? date < permitStartDate : false;
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="col-span-2">
                          <FormLabel>Permit Document</FormLabel>
                          <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                            theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300'
                          }`}>
                            <div className="space-y-1 text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                <label
                                  htmlFor="permit-document"
                                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="permit-document"
                                    name="permit-document"
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
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="additional.roadTaxPaid"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Road Tax Paid
                              </FormLabel>
                              <FormDescription>
                                Road tax has been paid for the vehicle
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("additional.roadTaxPaid") && (
                        <FormField
                          control={form.control}
                          name="additional.roadTaxDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Road Tax Details</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Receipt number, amount, validity, etc." 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <FormField
                        control={form.control}
                        name="additional.hasFitnessCertificate"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Fitness Certificate
                              </FormLabel>
                              <FormDescription>
                                Vehicle has valid fitness certificate
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("additional.hasFitnessCertificate") && (
                        <FormField
                          control={form.control}
                          name="additional.fitnessCertificateExpiry"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Fitness Certificate Expiry</FormLabel>
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
                                        <span>Select expiry date</span>
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
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={`text-base font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      GPS/Telematics
                    </h4>
                    
                    <FormField
                      control={form.control}
                      name="additional.hasGpsDevice"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              GPS/Telematics Device
                            </FormLabel>
                            <FormDescription>
                              Vehicle has GPS/Telematics device installed
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("additional.hasGpsDevice") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md border-gray-200 dark:border-gray-700">
                        <FormField
                          control={form.control}
                          name="additional.gpsDeviceId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Device ID/IMEI</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Device identifier" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="additional.gpsInstallationDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Installation Date</FormLabel>
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
                                        <span>Select installation date</span>
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="additional.gpsProvider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Provider</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="GPS service provider" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="additional.gpsTrackingUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tracking URL (optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="URL for tracking portal" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 5: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                  Review & Submit
                </h3>
                
                <div className={`p-6 rounded-lg border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800/50 border-gray-700'}`}>
                  <div className="space-y-6">
                    <div>
                      <h4 className={`text-base font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                        Registration Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Registration Number</p>
                          <p className="font-medium">{form.watch("registration.registrationNumber") || "Not provided"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Registration Date</p>
                          <p className="font-medium">
                            {form.watch("registration.registrationDate") 
                              ? format(form.watch("registration.registrationDate"), "PPP") 
                              : "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`text-base font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                        Vehicle Specifications
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Vehicle Type</p>
                          <p className="font-medium">{form.watch("specifications.vehicleType") || "Not provided"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Make & Model</p>
                          <p className="font-medium">
                            {form.watch("specifications.make") && form.watch("specifications.model")
                              ? `${form.watch("specifications.make")} ${form.watch("specifications.model")}`
                              : "Not provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Year</p>
                          <p className="font-medium">{form.watch("specifications.year") || "Not provided"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Fuel Type</p>
                          <p className="font-medium">{form.watch("specifications.fuelType") || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`text-base font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                        Ownership Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Purchase Date</p>
                          <p className="font-medium">
                            {form.watch("ownership.purchaseDate") 
                              ? format(form.watch("ownership.purchaseDate"), "PPP") 
                              : "Not provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Purchase Price</p>
                          <p className="font-medium">
                            {form.watch("ownership.purchasePrice") 
                              ? `₹${form.watch("ownership.purchasePrice")}` 
                              : "Not provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Financing</p>
                          <p className="font-medium">
                            {form.watch("ownership.financingType") === "none" 
                              ? "None (Full Payment)" 
                              : form.watch("ownership.financingType") === "loan" 
                                ? "Loan" 
                                : form.watch("ownership.financingType") === "lease"
                                  ? "Lease"
                                  : "Not provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Insurance</p>
                          <p className="font-medium">
                            {form.watch("ownership.insuranceProvider") && form.watch("ownership.coverageType")
                              ? `${form.watch("ownership.insuranceProvider")} (${form.watch("ownership.coverageType")})`
                              : "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`text-base font-medium mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                        Additional Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Commercial Permit</p>
                          <p className="font-medium">
                            {form.watch("additional.hasCommercialPermit") 
                              ? `Yes (${form.watch("additional.permitType") || "Type not specified"})` 
                              : "No"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Road Tax</p>
                          <p className="font-medium">
                            {form.watch("additional.roadTaxPaid") 
                              ? "Paid" 
                              : "Not paid/Not provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Fitness Certificate</p>
                          <p className="font-medium">
                            {form.watch("additional.hasFitnessCertificate") 
                              ? (() => {
                                  const expiryDate = form.watch("additional.fitnessCertificateExpiry");
                                  return expiryDate ? `Valid until ${format(expiryDate, "PPP")}` : "Valid (expiry not specified)";
                                })()
                              : "No/Not provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>GPS/Telematics</p>
                          <p className="font-medium">
                            {form.watch("additional.hasGpsDevice") 
                              ? `Installed (${form.watch("additional.gpsProvider") || "Provider not specified"})` 
                              : "Not installed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      variant="outline"
                      className={`${theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}`}
                    >
                      <CircleCheck className="h-5 w-5 mr-2 text-primary" />
                      Edit Information
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter className="flex justify-between mt-6">
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={previousStep}
                  variant="outline"
                  className={theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              
              <div className="ml-auto flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className={theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}
                >
                  Cancel
                </Button>
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                  >
                    Add Vehicle
                    <Car className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}