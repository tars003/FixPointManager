import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, differenceInYears } from 'date-fns';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Utility function to safely format dates
const safeFormat = (date: any, formatString: string): string => {
  try {
    // Ensure we have a valid Date object
    return format(date instanceof Date ? date : new Date(date), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
import { 
  Calendar as CalendarIcon, 
  ChevronLeft,
  ChevronRight,
  Upload,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Briefcase,
  Shield,
  CreditCard,
  Camera,
  UserCheck,
  Star as StarIcon,
  Truck,
  Languages,
  Award,
  BadgeCheck,
  Clock,
  DollarSign,
  ClipboardList,
  UserPlus
} from 'lucide-react';

type AddDriverDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
};

// Validation schemas for each step
const personalInfoSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  emergencyContact: z.string().min(10, { message: "Emergency contact must be at least 10 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  pincode: z.string().min(6, { message: "Valid PIN code is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  profilePhoto: z.string().optional(),
});

const licenseInfoSchema = z.object({
  licenseNumber: z.string().min(8, { message: "License number is required" }),
  licenseType: z.enum(["light", "medium", "heavy", "commercial", "specializedCommercial"], {
    required_error: "Please select license type",
  }),
  categories: z.array(z.string()).min(1, { message: "Select at least one category" }),
  issuingAuthority: z.string().min(2, { message: "Issuing authority is required" }),
  issueDate: z.date({
    required_error: "Issue date is required",
  }),
  expiryDate: z.date({
    required_error: "Expiry date is required",
  }).refine((date) => {
    return date > new Date();
  }, {
    message: "License must not be expired",
  }),
  licenseScanFront: z.string().optional(),
  licenseScanBack: z.string().optional(),
});

const experienceSkillsSchema = z.object({
  yearsOfExperience: z.number().min(0, { message: "Years of experience is required" }),
  vehicleTypes: z.array(z.string()).min(1, { message: "Select at least one vehicle type" }),
  previousEmployers: z.array(z.object({
    name: z.string(),
    duration: z.string(),
    role: z.string(),
  })).optional(),
  expertise: z.array(z.string()).min(1, { message: "Select at least one area of expertise" }),
  languages: z.array(z.string()).min(1, { message: "Select at least one language" }),
  certifications: z.array(z.string()).optional(),
});

const backgroundVerificationSchema = z.object({
  identityProof: z.enum(["aadhar", "passport", "voterID", "drivingLicense"], {
    required_error: "Please select identity proof type",
  }),
  identityNumber: z.string().min(4, { message: "Identity number is required" }),
  identityProofUpload: z.string().optional(),
  addressProof: z.enum(["aadhar", "passport", "utilityBill", "bankStatement"], {
    required_error: "Please select address proof type",
  }),
  addressProofUpload: z.string().optional(),
  policeVerification: z.boolean().default(false),
  policeVerificationUpload: z.string().optional(),
  trafficViolations: z.boolean().default(false),
  trafficViolationDetails: z.string().optional(),
  medicalFitness: z.boolean().default(false),
  medicalCertificateUpload: z.string().optional(),
  backgroundCheckConsent: z.boolean().refine(value => value === true, {
    message: "You must consent to background verification",
  }),
});

const employmentTermsSchema = z.object({
  employmentType: z.enum(["fullTime", "partTime", "contract"], {
    required_error: "Please select employment type",
  }),
  compensationType: z.enum(["fixed", "hourly", "commission", "mixed"], {
    required_error: "Please select compensation type",
  }),
  salary: z.number().min(1, { message: "Salary amount is required" }),
  workingHours: z.object({
    startTime: z.string(),
    endTime: z.string(),
    daysPerWeek: z.number().min(1).max(7),
  }),
  availabilityPattern: z.enum(["weekdays", "weekends", "rotating", "flexible"], {
    required_error: "Please select availability pattern",
  }),
  benefits: z.array(z.string()).optional(),
  reportingManager: z.string().min(3, { message: "Reporting manager is required" }),
  performanceMetrics: z.array(z.string()).min(1, { message: "Select at least one performance metric" }),
  termsAccepted: z.boolean().refine(value => value === true, {
    message: "You must accept the employment terms",
  }),
});

// Define license categories
const licenseCategories = [
  { value: "motorcycle", label: "Motorcycle (M)" },
  { value: "car", label: "Car (LMV)" },
  { value: "transport", label: "Transport Vehicle (TV)" },
  { value: "heavyGoods", label: "Heavy Goods Vehicle (HGV)" },
  { value: "busCoach", label: "Bus/Coach (PSV)" },
  { value: "hazardousMaterials", label: "Hazardous Materials" },
  { value: "specialVehicles", label: "Special Vehicles" },
];

// Define vehicle types
const vehicleTypes = [
  { value: "motorcycle", label: "Motorcycle" },
  { value: "car", label: "Car" },
  { value: "suv", label: "SUV" },
  { value: "van", label: "Van" },
  { value: "miniTruck", label: "Mini Truck" },
  { value: "truck", label: "Truck" },
  { value: "bus", label: "Bus" },
  { value: "specializedVehicle", label: "Specialized Vehicle" },
];

// Define expertise areas
const expertiseAreas = [
  { value: "cityDriving", label: "City Driving" },
  { value: "highwayDriving", label: "Highway Driving" },
  { value: "mountainDriving", label: "Mountain/Hill Driving" },
  { value: "nightDriving", label: "Night Driving" },
  { value: "defensiveDriving", label: "Defensive Driving" },
  { value: "passengerTransport", label: "Passenger Transport" },
  { value: "cargoTransport", label: "Cargo Transport" },
  { value: "hazardousMaterials", label: "Hazardous Materials Transport" },
  { value: "offRoadDriving", label: "Off-Road Driving" },
  { value: "internationalDriving", label: "International Driving" },
];

// Define languages
const languageOptions = [
  { value: "hindi", label: "Hindi" },
  { value: "english", label: "English" },
  { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
  { value: "kannada", label: "Kannada" },
  { value: "malayalam", label: "Malayalam" },
  { value: "marathi", label: "Marathi" },
  { value: "bengali", label: "Bengali" },
  { value: "gujarati", label: "Gujarati" },
  { value: "punjabi", label: "Punjabi" },
  { value: "urdu", label: "Urdu" },
];

// Define employment benefits
const benefitOptions = [
  { value: "healthInsurance", label: "Health Insurance" },
  { value: "accidentInsurance", label: "Accident Insurance" },
  { value: "pf", label: "Provident Fund" },
  { value: "gratuity", label: "Gratuity" },
  { value: "paidLeave", label: "Paid Leave" },
  { value: "accommodation", label: "Accommodation" },
  { value: "meals", label: "Meals" },
  { value: "uniformAllowance", label: "Uniform Allowance" },
  { value: "mobileAllowance", label: "Mobile Allowance" },
  { value: "fuelAllowance", label: "Fuel Allowance" },
  { value: "overtimePay", label: "Overtime Pay" },
];

// Define performance metrics
const performanceMetrics = [
  { value: "punctuality", label: "Punctuality" },
  { value: "safetyRecord", label: "Safety Record" },
  { value: "customerFeedback", label: "Customer Feedback" },
  { value: "vehicleMaintenance", label: "Vehicle Maintenance" },
  { value: "fuelEfficiency", label: "Fuel Efficiency" },
  { value: "tripCompletion", label: "Trip Completion Rate" },
  { value: "documentationAccuracy", label: "Documentation Accuracy" },
  { value: "complianceWithRules", label: "Compliance With Rules" },
  { value: "teamwork", label: "Teamwork" },
  { value: "problemSolving", label: "Problem Solving" },
];

export function AddDriverDialog({ open, onOpenChange, theme }: AddDriverDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // For file uploads (simulated in this prototype)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [licenseFrontPreview, setLicenseFrontPreview] = useState<string | null>(null);
  const [licenseBackPreview, setLicenseBackPreview] = useState<string | null>(null);
  const [identityProofPreview, setIdentityProofPreview] = useState<string | null>(null);
  const [addressProofPreview, setAddressProofPreview] = useState<string | null>(null);
  const [policeVerificationPreview, setPoliceVerificationPreview] = useState<string | null>(null);
  const [medicalCertificatePreview, setMedicalCertificatePreview] = useState<string | null>(null);
  
  // Previous employers
  const [previousEmployers, setPreviousEmployers] = useState<Array<{name: string, duration: string, role: string}>>([]);
  
  // Initialize forms for each step
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: '',
      gender: 'male',
      phone: '',
      email: '',
      emergencyContact: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
    }
  });
  
  const licenseInfoForm = useForm<z.infer<typeof licenseInfoSchema>>({
    resolver: zodResolver(licenseInfoSchema),
    defaultValues: {
      licenseNumber: '',
      licenseType: 'commercial',
      categories: [],
      issuingAuthority: '',
      issueDate: new Date(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
    }
  });
  
  const experienceSkillsForm = useForm<z.infer<typeof experienceSkillsSchema>>({
    resolver: zodResolver(experienceSkillsSchema),
    defaultValues: {
      yearsOfExperience: 0,
      vehicleTypes: [],
      previousEmployers: [],
      expertise: [],
      languages: [],
      certifications: [],
    }
  });
  
  const backgroundVerificationForm = useForm<z.infer<typeof backgroundVerificationSchema>>({
    resolver: zodResolver(backgroundVerificationSchema),
    defaultValues: {
      identityProof: 'aadhar',
      identityNumber: '',
      addressProof: 'aadhar',
      policeVerification: false,
      trafficViolations: false,
      medicalFitness: false,
      backgroundCheckConsent: false,
    }
  });
  
  const employmentTermsForm = useForm<z.infer<typeof employmentTermsSchema>>({
    resolver: zodResolver(employmentTermsSchema),
    defaultValues: {
      employmentType: 'fullTime',
      compensationType: 'fixed',
      salary: 0,
      workingHours: {
        startTime: '09:00',
        endTime: '18:00',
        daysPerWeek: 6,
      },
      availabilityPattern: 'weekdays',
      benefits: [],
      reportingManager: '',
      performanceMetrics: [],
      termsAccepted: false,
    }
  });
  
  // Handle file uploads (simulated)
  const handleFileUpload = (file: File, setPreview: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Add previous employer
  const addPreviousEmployer = () => {
    const newEmployer = { name: '', duration: '', role: '' };
    setPreviousEmployers([...previousEmployers, newEmployer]);
  };
  
  // Update previous employer details
  const updatePreviousEmployer = (index: number, field: keyof {name: string, duration: string, role: string}, value: string) => {
    const updatedEmployers = [...previousEmployers];
    updatedEmployers[index][field] = value;
    setPreviousEmployers(updatedEmployers);
    
    // Update the form value
    experienceSkillsForm.setValue('previousEmployers', updatedEmployers);
  };
  
  // Remove previous employer
  const removePreviousEmployer = (index: number) => {
    const updatedEmployers = previousEmployers.filter((_, i) => i !== index);
    setPreviousEmployers(updatedEmployers);
    
    // Update the form value
    experienceSkillsForm.setValue('previousEmployers', updatedEmployers);
  };
  
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: Date): number => {
    // Ensure we're working with a Date object
    const birthDate = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
    return differenceInYears(new Date(), birthDate);
  };
  
  // Handle form submissions for each step
  const onPersonalInfoSubmit = (data: z.infer<typeof personalInfoSchema>) => {
    console.log("Personal Info:", data);
    setCurrentStep(2);
  };
  
  const onLicenseInfoSubmit = (data: z.infer<typeof licenseInfoSchema>) => {
    console.log("License Info:", data);
    setCurrentStep(3);
  };
  
  const onExperienceSkillsSubmit = (data: z.infer<typeof experienceSkillsSchema>) => {
    // Ensure we include the previous employers
    data.previousEmployers = previousEmployers;
    console.log("Experience & Skills:", data);
    setCurrentStep(4);
  };
  
  const onBackgroundVerificationSubmit = (data: z.infer<typeof backgroundVerificationSchema>) => {
    console.log("Background Verification:", data);
    setCurrentStep(5);
  };
  
  const onEmploymentTermsSubmit = (data: z.infer<typeof employmentTermsSchema>) => {
    console.log("Employment Terms:", data);
    
    // Combine all form data
    const completeDriverData = {
      personalInfo: personalInfoForm.getValues(),
      licenseInfo: licenseInfoForm.getValues(),
      experienceSkills: experienceSkillsForm.getValues(),
      backgroundVerification: backgroundVerificationForm.getValues(),
      employmentTerms: data,
    };
    
    console.log("Complete Driver Data:", completeDriverData);
    
    // Save driver or make API call here
    // In a real application, this would send the data to the server
    
    // Close the dialog
    onOpenChange(false);
    
    // Show success message
    alert("Driver added successfully!");
  };
  
  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Render functions for each step
  const renderPersonalInfo = () => {
    return (
      <Form {...personalInfoForm}>
        <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Personal Information
            </h3>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Profile Photo Upload */}
              <div className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'} w-full md:w-1/3`}>
                {profilePhotoPreview ? (
                  <div className="relative">
                    <img 
                      src={profilePhotoPreview} 
                      alt="Profile preview" 
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-1 h-6 w-6"
                      onClick={() => setProfilePhotoPreview(null)}
                    >
                      &times;
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <User className={`h-8 w-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Upload profile photo
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="profile-photo-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, setProfilePhotoPreview);
                          personalInfoForm.setValue('profilePhoto', 'uploaded');
                        }
                      }}
                    />
                    <label htmlFor="profile-photo-upload">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Browse...
                      </Button>
                    </label>
                  </>
                )}
              </div>
              
              <div className="space-y-4 w-full md:w-2/3">
                {/* Full Name */}
                <FormField
                  control={personalInfoForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Rajesh Kumar Singh" 
                          {...field} 
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Date of Birth and Gender row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date of Birth */}
                  <FormField
                    control={personalInfoForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal flex justify-between items-center ${
                                  !field.value ? "text-muted-foreground" : ""
                                } ${
                                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''
                                }`}
                              >
                                {field.value ? (
                                  <>
                                    {format(new Date(field.value), "PPP")}
                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                      (Age: {calculateAge(field.value)})
                                    </span>
                                  </>
                                ) : (
                                  <span>Pick a date</span>
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
                                // Can't select future dates or dates more than 70 years in the past
                                const today = new Date();
                                const seventyYearsAgo = new Date();
                                seventyYearsAgo.setFullYear(today.getFullYear() - 70);
                                return date > today || date < seventyYearsAgo;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Gender */}
                  <FormField
                    control={personalInfoForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Information Section */}
            <div>
              <h4 className={`text-md font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Contact Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <FormField
                  control={personalInfoForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className={`flex items-center px-3 rounded-l-md border border-r-0 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                            +91
                          </div>
                          <Input 
                            placeholder="9876543210" 
                            {...field} 
                            className={`rounded-l-none ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Email */}
                <FormField
                  control={personalInfoForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="e.g., rajesh.kumar@gmail.com" 
                          {...field} 
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Emergency Contact */}
                <FormField
                  control={personalInfoForm.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <div className={`flex items-center px-3 rounded-l-md border border-r-0 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                            +91
                          </div>
                          <Input 
                            placeholder="Emergency contact number" 
                            {...field} 
                            className={`rounded-l-none ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Person to contact in case of emergency
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Address Section */}
            <div>
              <h4 className={`text-md font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Residential Address
              </h4>
              
              {/* Address */}
              <FormField
                control={personalInfoForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter complete address" 
                        {...field} 
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Pincode */}
                <FormField
                  control={personalInfoForm.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PIN Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 600001" 
                          {...field} 
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* City */}
                <FormField
                  control={personalInfoForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Chennai" 
                          {...field} 
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* State */}
                <FormField
                  control={personalInfoForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Tamil Nadu" 
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
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };
  
  const renderLicenseInfo = () => {
    return (
      <Form {...licenseInfoForm}>
        <form onSubmit={licenseInfoForm.handleSubmit(onLicenseInfoSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              License Information
            </h3>
            
            {/* License Number */}
            <FormField
              control={licenseInfoForm.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., TN10 20210012345" 
                      {...field} 
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the driving license number as shown on the document
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* License Type */}
              <FormField
                control={licenseInfoForm.control}
                name="licenseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                        <SelectItem value="light">Light Motor Vehicle</SelectItem>
                        <SelectItem value="medium">Medium Motor Vehicle</SelectItem>
                        <SelectItem value="heavy">Heavy Motor Vehicle</SelectItem>
                        <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                        <SelectItem value="specializedCommercial">Specialized Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Issuing Authority */}
              <FormField
                control={licenseInfoForm.control}
                name="issuingAuthority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuing Authority</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., RTO Chennai West" 
                        {...field} 
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Issue Date */}
              <FormField
                control={licenseInfoForm.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Issue Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            } ${
                              theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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
                            // Can't select future dates
                            return date > new Date();
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Expiry Date */}
              <FormField
                control={licenseInfoForm.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            } ${
                              theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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
                            // Can't select dates in the past
                            return date < new Date();
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
            
            {/* License Categories */}
            <FormField
              control={licenseInfoForm.control}
              name="categories"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">License Categories</FormLabel>
                    <FormDescription>
                      Select all categories that appear on the license
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {licenseCategories.map((item) => (
                      <FormField
                        key={item.value}
                        control={licenseInfoForm.control}
                        name="categories"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.value}
                              className={`flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 ${
                                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                              }`}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.value
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Document Uploads */}
            <div className="space-y-4">
              <h4 className={`text-md font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                License Document
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Front of License */}
                <div className={`p-4 border-2 border-dashed rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                  <h5 className="text-sm font-medium mb-2">Front Side of License</h5>
                  
                  {licenseFrontPreview ? (
                    <div className="relative">
                      <img 
                        src={licenseFrontPreview} 
                        alt="License front preview" 
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 h-6 w-6"
                        onClick={() => setLicenseFrontPreview(null)}
                      >
                        &times;
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <FileText className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="license-front-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, setLicenseFrontPreview);
                            licenseInfoForm.setValue('licenseScanFront', 'uploaded');
                          }
                        }}
                      />
                      <label htmlFor="license-front-upload">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={theme === 'dark' ? 'border-gray-600' : ''}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Front
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
                
                {/* Back of License */}
                <div className={`p-4 border-2 border-dashed rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                  <h5 className="text-sm font-medium mb-2">Back Side of License</h5>
                  
                  {licenseBackPreview ? (
                    <div className="relative">
                      <img 
                        src={licenseBackPreview} 
                        alt="License back preview" 
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 h-6 w-6"
                        onClick={() => setLicenseBackPreview(null)}
                      >
                        &times;
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <FileText className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="license-back-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, setLicenseBackPreview);
                            licenseInfoForm.setValue('licenseScanBack', 'uploaded');
                          }
                        }}
                      />
                      <label htmlFor="license-back-upload">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={theme === 'dark' ? 'border-gray-600' : ''}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Back
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevStep}
              className={theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              type="submit"
              className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };
  
  const renderExperienceSkills = () => {
    return (
      <Form {...experienceSkillsForm}>
        <form onSubmit={experienceSkillsForm.handleSubmit(onExperienceSkillsSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Experience & Skills
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Years of Experience */}
              <FormField
                control={experienceSkillsForm.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Driving Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        max="50"
                        placeholder="e.g., 5" 
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Vehicle Types */}
            <FormField
              control={experienceSkillsForm.control}
              name="vehicleTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Vehicle Types Experience</FormLabel>
                    <FormDescription>
                      Select all vehicle types you have experience driving
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {vehicleTypes.map((item) => (
                      <FormField
                        key={item.value}
                        control={experienceSkillsForm.control}
                        name="vehicleTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.value}
                              className={`flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 ${
                                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                              }`}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.value
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Previous Employers */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className={`text-md font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Previous Employment
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPreviousEmployer}
                  className={theme === 'dark' ? 'border-gray-600' : ''}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employer
                </Button>
              </div>
              
              {previousEmployers.length === 0 && (
                <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                  No previous employment records added
                </div>
              )}
              
              {previousEmployers.map((employer, index) => (
                <div 
                  key={index} 
                  className={`p-4 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium">Employer #{index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePreviousEmployer(index)}
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      &times;
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Employer
                      </label>
                      <Input
                        placeholder="Company name"
                        value={employer.name}
                        onChange={(e) => updatePreviousEmployer(index, 'name', e.target.value)}
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Duration
                      </label>
                      <Input
                        placeholder="e.g., 2018-2021"
                        value={employer.duration}
                        onChange={(e) => updatePreviousEmployer(index, 'duration', e.target.value)}
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Role
                      </label>
                      <Input
                        placeholder="e.g., Driver"
                        value={employer.role}
                        onChange={(e) => updatePreviousEmployer(index, 'role', e.target.value)}
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Areas of Expertise */}
            <FormField
              control={experienceSkillsForm.control}
              name="expertise"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Areas of Expertise</FormLabel>
                    <FormDescription>
                      Select your driving specialties and expertise
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {expertiseAreas.map((item) => (
                      <FormField
                        key={item.value}
                        control={experienceSkillsForm.control}
                        name="expertise"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.value}
                              className={`flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 ${
                                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                              }`}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.value
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Languages */}
            <FormField
              control={experienceSkillsForm.control}
              name="languages"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Languages Spoken</FormLabel>
                    <FormDescription>
                      Select all languages you can communicate in
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {languageOptions.map((item) => (
                      <FormField
                        key={item.value}
                        control={experienceSkillsForm.control}
                        name="languages"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.value}
                              className={`flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 ${
                                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                              }`}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.value
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Certifications */}
            <div>
              <h4 className={`text-md font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Special Certifications (Optional)
              </h4>
              <FormField
                control={experienceSkillsForm.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="List any special driving or safety certifications, one per line" 
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                        onChange={(e) => {
                          const certifications = e.target.value.split('\n').filter(cert => cert.trim() !== '');
                          field.onChange(certifications);
                        }}
                        value={field.value?.join('\n') || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Examples: Defensive Driving, Hazardous Materials Handling, First Aid, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevStep}
              className={theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              type="submit"
              className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };
  
  const renderBackgroundVerification = () => {
    return (
      <Form {...backgroundVerificationForm}>
        <form onSubmit={backgroundVerificationForm.handleSubmit(onBackgroundVerificationSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Background Verification
            </h3>
            
            {/* Identity Proof */}
            <div className="space-y-4">
              <h4 className={`text-md font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Identity Verification
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={backgroundVerificationForm.control}
                  name="identityProof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identity Proof Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                            <SelectValue placeholder="Select identity proof" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                          <SelectItem value="aadhar">Aadhar Card</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="voterID">Voter ID</SelectItem>
                          <SelectItem value="drivingLicense">Driving License</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={backgroundVerificationForm.control}
                  name="identityNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identity Document Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter document number" 
                          {...field} 
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Identity Document Upload */}
              <div className={`p-4 border-2 border-dashed rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                <h5 className="text-sm font-medium mb-2">Identity Document Scan</h5>
                
                {identityProofPreview ? (
                  <div className="relative">
                    <img 
                      src={identityProofPreview} 
                      alt="Identity proof preview" 
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 h-6 w-6"
                      onClick={() => setIdentityProofPreview(null)}
                    >
                      &times;
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <FileText className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="identity-proof-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, setIdentityProofPreview);
                          backgroundVerificationForm.setValue('identityProofUpload', 'uploaded');
                        }
                      }}
                    />
                    <label htmlFor="identity-proof-upload">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={theme === 'dark' ? 'border-gray-600' : ''}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            {/* Address Proof */}
            <div className="space-y-4">
              <h4 className={`text-md font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Address Verification
              </h4>
              
              <FormField
                control={backgroundVerificationForm.control}
                name="addressProof"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Proof Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                          <SelectValue placeholder="Select address proof" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="utilityBill">Utility Bill</SelectItem>
                        <SelectItem value="bankStatement">Bank Statement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Address Document Upload */}
              <div className={`p-4 border-2 border-dashed rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                <h5 className="text-sm font-medium mb-2">Address Proof Document</h5>
                
                {addressProofPreview ? (
                  <div className="relative">
                    <img 
                      src={addressProofPreview} 
                      alt="Address proof preview" 
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 h-6 w-6"
                      onClick={() => setAddressProofPreview(null)}
                    >
                      &times;
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <FileText className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="address-proof-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, setAddressProofPreview);
                          backgroundVerificationForm.setValue('addressProofUpload', 'uploaded');
                        }
                      }}
                    />
                    <label htmlFor="address-proof-upload">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={theme === 'dark' ? 'border-gray-600' : ''}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            {/* Verification Items */}
            <div className="space-y-4">
              <h4 className={`text-md font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Additional Verification
              </h4>
              
              <FormField
                control={backgroundVerificationForm.control}
                name="policeVerification"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Police Verification Available
                      </FormLabel>
                      <FormDescription>
                        Check if you have police verification document
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {backgroundVerificationForm.watch('policeVerification') && (
                <div className={`p-4 border-2 border-dashed rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                  <h5 className="text-sm font-medium mb-2">Police Verification Document</h5>
                  
                  {policeVerificationPreview ? (
                    <div className="relative">
                      <img 
                        src={policeVerificationPreview} 
                        alt="Police verification preview" 
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 h-6 w-6"
                        onClick={() => setPoliceVerificationPreview(null)}
                      >
                        &times;
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <FileText className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="police-verification-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, setPoliceVerificationPreview);
                            backgroundVerificationForm.setValue('policeVerificationUpload', 'uploaded');
                          }
                        }}
                      />
                      <label htmlFor="police-verification-upload">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={theme === 'dark' ? 'border-gray-600' : ''}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              )}
              
              <FormField
                control={backgroundVerificationForm.control}
                name="trafficViolations"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Traffic Violations History
                      </FormLabel>
                      <FormDescription>
                        Check if you have any traffic violations in the past 3 years
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {backgroundVerificationForm.watch('trafficViolations') && (
                <FormField
                  control={backgroundVerificationForm.control}
                  name="trafficViolationDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Traffic Violation Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please provide details of all traffic violations in the past 3 years" 
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
                control={backgroundVerificationForm.control}
                name="medicalFitness"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Medical Fitness Certificate
                      </FormLabel>
                      <FormDescription>
                        Check if you have a valid medical fitness certificate
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              {backgroundVerificationForm.watch('medicalFitness') && (
                <div className={`p-4 border-2 border-dashed rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                  <h5 className="text-sm font-medium mb-2">Medical Fitness Certificate</h5>
                  
                  {medicalCertificatePreview ? (
                    <div className="relative">
                      <img 
                        src={medicalCertificatePreview} 
                        alt="Medical certificate preview" 
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 h-6 w-6"
                        onClick={() => setMedicalCertificatePreview(null)}
                      >
                        &times;
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <FileText className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="medical-certificate-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, setMedicalCertificatePreview);
                            backgroundVerificationForm.setValue('medicalCertificateUpload', 'uploaded');
                          }
                        }}
                      />
                      <label htmlFor="medical-certificate-upload">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={theme === 'dark' ? 'border-gray-600' : ''}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Consent */}
            <FormField
              control={backgroundVerificationForm.control}
              name="backgroundCheckConsent"
              render={({ field }) => (
                <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : ''}`}>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Background Check Consent
                    </FormLabel>
                    <FormDescription>
                      I hereby authorize FixPoint to conduct background verification checks including criminal history, driving records, employment history, and education verification. I understand that this information will be used for employment purposes only.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevStep}
              className={theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              type="submit"
              disabled={!backgroundVerificationForm.watch('backgroundCheckConsent')}
              className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };
  
  const renderEmploymentTerms = () => {
    return (
      <Form {...employmentTermsForm}>
        <form onSubmit={employmentTermsForm.handleSubmit(onEmploymentTermsSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Employment Terms
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employment Type */}
              <FormField
                control={employmentTermsForm.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                        <SelectItem value="fullTime">Full-Time</SelectItem>
                        <SelectItem value="partTime">Part-Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Compensation Type */}
              <FormField
                control={employmentTermsForm.control}
                name="compensationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compensation Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                          <SelectValue placeholder="Select compensation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                        <SelectItem value="fixed">Fixed Salary</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                        <SelectItem value="commission">Commission-Based</SelectItem>
                        <SelectItem value="mixed">Mixed (Base + Commission)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Salary */}
            <FormField
              control={employmentTermsForm.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {employmentTermsForm.watch('compensationType') === 'hourly' 
                      ? 'Hourly Rate (₹)' 
                      : 'Monthly Salary (₹)'}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="Enter amount" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Working Hours */}
            <div className="space-y-4">
              <h4 className={`text-md font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Working Hours
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={employmentTermsForm.control}
                  name="workingHours.startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={employmentTermsForm.control}
                  name="workingHours.endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={employmentTermsForm.control}
                  name="workingHours.daysPerWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days Per Week</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                          <SelectItem value="5">5 days</SelectItem>
                          <SelectItem value="6">6 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={employmentTermsForm.control}
                name="availabilityPattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability Pattern</FormLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className={`flex items-center space-x-2 rounded-md border p-3 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                            <RadioGroupItem value="weekdays" id="weekdays" />
                            <label htmlFor="weekdays" className="cursor-pointer">Weekdays only</label>
                          </div>
                          <div className={`flex items-center space-x-2 rounded-md border p-3 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                            <RadioGroupItem value="weekends" id="weekends" />
                            <label htmlFor="weekends" className="cursor-pointer">Weekends only</label>
                          </div>
                          <div className={`flex items-center space-x-2 rounded-md border p-3 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                            <RadioGroupItem value="rotating" id="rotating" />
                            <label htmlFor="rotating" className="cursor-pointer">Rotating shifts</label>
                          </div>
                          <div className={`flex items-center space-x-2 rounded-md border p-3 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                            <RadioGroupItem value="flexible" id="flexible" />
                            <label htmlFor="flexible" className="cursor-pointer">Flexible hours</label>
                          </div>
                        </div>
                      </FormControl>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Benefits */}
            <FormField
              control={employmentTermsForm.control}
              name="benefits"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Benefits Eligibility</FormLabel>
                    <FormDescription>
                      Select applicable benefits for this driver
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {benefitOptions.map((item) => (
                      <FormField
                        key={item.value}
                        control={employmentTermsForm.control}
                        name="benefits"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.value}
                              className={`flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 ${
                                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                              }`}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value || [], item.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.value
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Reporting Manager */}
            <FormField
              control={employmentTermsForm.control}
              name="reportingManager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reporting Manager</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter name of supervisor" 
                      {...field} 
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Who will supervise and evaluate this driver
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Performance Metrics */}
            <FormField
              control={employmentTermsForm.control}
              name="performanceMetrics"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Performance Evaluation Metrics</FormLabel>
                    <FormDescription>
                      Select metrics that will be used to evaluate performance
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {performanceMetrics.map((item) => (
                      <FormField
                        key={item.value}
                        control={employmentTermsForm.control}
                        name="performanceMetrics"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.value}
                              className={`flex flex-row items-start space-x-3 space-y-0 rounded-md p-3 ${
                                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                              }`}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value || [], item.value])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.value
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Terms Acceptance */}
            <FormField
              control={employmentTermsForm.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : ''}`}>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Accept Employment Terms
                    </FormLabel>
                    <FormDescription>
                      I accept the employment terms and conditions as outlined above. I understand that my employment is subject to successful completion of all background verification checks and a probationary period. I agree to abide by all company policies, rules, and regulations.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevStep}
              className={theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              type="submit"
              disabled={!employmentTermsForm.watch('termsAccepted')}
              className={theme === 'light' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
            >
              Complete & Add Driver
              <UserCheck className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };
  
  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderLicenseInfo();
      case 3:
        return renderExperienceSkills();
      case 4:
        return renderBackgroundVerification();
      case 5:
        return renderEmploymentTerms();
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-screen overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`text-xl ${theme === 'dark' ? 'text-white' : ''}`}>
            Add New Driver
          </DialogTitle>
          <DialogDescription>
            Complete all required information to add a new driver
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="w-full pt-2">
          <div className="flex justify-between mb-2">
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Step {currentStep} of {totalSteps}
            </span>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {currentStep === 1 ? 'Personal Information' : 
               currentStep === 2 ? 'License Information' :
               currentStep === 3 ? 'Experience & Skills' : 
               currentStep === 4 ? 'Background Verification' :
               'Employment Terms'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className={`h-2.5 rounded-full ${theme === 'light' ? 'bg-blue-600' : 'bg-primary'}`} 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Step content */}
        <div className="mt-4">
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}