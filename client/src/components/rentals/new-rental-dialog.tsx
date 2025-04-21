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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CalendarIcon, 
  Car, 
  Clock,
  User,
  FileText,
  CreditCard,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  DollarSign,
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  UploadCloud,
  Check,
  AlertCircle
} from 'lucide-react';

type NewRentalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
};

// Define validation schemas for each step
const vehicleSelectionSchema = z.object({
  vehicleId: z.string({ required_error: "Please select a vehicle" }),
});

const clientSelectionSchema = z.object({
  clientType: z.enum(["individual", "corporate"], { required_error: "Please select client type" }),
  clientId: z.string().optional(),
  newClient: z.object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    contactPerson: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }).optional(),
    address: z.string().optional(),
    idType: z.string().optional(),
    idNumber: z.string().optional(),
  }).optional(),
});

const rentalDetailsSchema = z.object({
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string({ required_error: "Start time is required" }),
  endTime: z.string({ required_error: "End time is required" }),
  rentalPeriod: z.enum(["hourly", "daily", "weekly", "monthly"], { required_error: "Please select rental period" }),
  insuranceOption: z.enum(["basic", "standard", "premium"], { required_error: "Please select insurance option" }),
  fuelOption: z.enum(["prepaid", "return-full"], { required_error: "Please select fuel option" }),
  additionalOptions: z.array(z.string()).optional(),
});

const driverAssignmentSchema = z.object({
  driverType: z.enum(["self", "company"], { required_error: "Please select driver type" }),
  driverId: z.string().optional(),
  driverRequirements: z.object({
    licenseVerified: z.boolean().optional(),
    experienceLevel: z.string().optional(),
    preferredLanguages: z.array(z.string()).optional(),
  }).optional(),
});

const paymentDocumentationSchema = z.object({
  paymentMethod: z.enum(["credit-card", "bank-transfer", "digital-wallet", "cash", "corporate-account"], { required_error: "Please select payment method" }),
  securityDeposit: z.number().min(1000, { message: "Security deposit must be at least ₹1000" }),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions" }),
  receiveUpdates: z.boolean().optional(),
});

// Define mock data for the form
const availableVehicles = [
  { 
    id: "1", 
    name: "Toyota Innova Crysta", 
    registration: "TN01-3456", 
    type: "SUV", 
    seatingCapacity: 7,
    fuelType: "Diesel",
    location: "Chennai Central",
    image: "https://example.com/innova.jpg",
    dailyRate: 2500,
    weeklyRate: 15000,
    monthlyRate: 60000,
    features: ["AC", "Power Steering", "Central Locking", "Power Windows"],
    status: "Available" 
  },
  { 
    id: "2", 
    name: "Mahindra Bolero", 
    registration: "DL01-8794", 
    type: "SUV", 
    seatingCapacity: 7,
    fuelType: "Diesel",
    location: "Delhi Airport",
    image: "https://example.com/bolero.jpg",
    dailyRate: 1800,
    weeklyRate: 11000,
    monthlyRate: 45000,
    features: ["AC", "Power Steering", "FM Radio"],
    status: "On Rent" 
  },
  { 
    id: "3", 
    name: "Tata Ace", 
    registration: "MH02-4532", 
    type: "Mini Truck", 
    seatingCapacity: 2,
    fuelType: "Diesel",
    location: "Mumbai Service Center",
    image: "https://example.com/ace.jpg",
    dailyRate: 1200,
    weeklyRate: 7000,
    monthlyRate: 28000,
    features: ["Power Steering", "FM Radio"],
    status: "In Maintenance" 
  },
  { 
    id: "4", 
    name: "Ashok Leyland Dost", 
    registration: "KA01-9834", 
    type: "Light Truck", 
    seatingCapacity: 3,
    fuelType: "Diesel",
    location: "Bangalore City",
    image: "https://example.com/dost.jpg",
    dailyRate: 1500,
    weeklyRate: 9000,
    monthlyRate: 36000,
    features: ["AC", "Power Steering", "Bluetooth Audio"],
    status: "On Rent" 
  },
  { 
    id: "5", 
    name: "Bajaj RE Auto", 
    registration: "GJ05-2143", 
    type: "3-Wheeler", 
    seatingCapacity: 4,
    fuelType: "CNG",
    location: "Ahmedabad Depot",
    image: "https://example.com/auto.jpg",
    dailyRate: 800,
    weeklyRate: 4800,
    monthlyRate: 19000,
    features: ["CNG Kit", "FM Radio"],
    status: "Available" 
  },
];

const recentClients = [
  { id: "1", name: "ABC Travels", type: "corporate", contactPerson: "Rajiv Sharma", phone: "+91 98765 43210", email: "info@abctravels.com" },
  { id: "2", name: "XYZ Tours", type: "corporate", contactPerson: "Mehul Patel", phone: "+91 98765 12345", email: "mehul@xyztours.com" },
  { id: "3", name: "Fast Logistics", type: "corporate", contactPerson: "Anand Kumar", phone: "+91 87654 32109", email: "anand@fastlogistics.com" },
  { id: "4", name: "Ravi Shankar", type: "individual", phone: "+91 76543 21098", email: "ravi.shankar@gmail.com" },
  { id: "5", name: "Priya Mehta", type: "individual", phone: "+91 65432 10987", email: "priya.mehta@yahoo.com" },
];

const availableDrivers = [
  { 
    id: "1", 
    name: "Rajesh Kumar", 
    age: 32,
    experience: "8 years",
    languages: ["Hindi", "Tamil", "English"],
    rating: 4.8,
    licenseVerified: true,
    phone: "+91 9876543210",
    status: "Available" 
  },
  { 
    id: "2", 
    name: "Suresh Singh", 
    age: 29,
    experience: "5 years",
    languages: ["Hindi", "English"],
    rating: 4.5,
    licenseVerified: true,
    phone: "+91 9765432109",
    status: "On Duty" 
  },
  { 
    id: "3", 
    name: "Venkatesh Rao", 
    age: 34,
    experience: "6 years",
    languages: ["Telugu", "Tamil", "English"],
    rating: 4.7,
    licenseVerified: true,
    phone: "+91 9654321098",
    status: "On Duty" 
  },
  { 
    id: "4", 
    name: "Mukesh Patel", 
    age: 27,
    experience: "4 years",
    languages: ["Gujarati", "Hindi", "English"],
    rating: 4.3,
    licenseVerified: true,
    phone: "+91 9543210987",
    status: "Available" 
  },
];

const additionalOptions = [
  { id: "gps", name: "GPS Device", dailyRate: 100, description: "Navigation system for route guidance" },
  { id: "child-seat", name: "Child Seat", dailyRate: 200, description: "Safety seat for children" },
  { id: "roof-rack", name: "Roof Rack", dailyRate: 150, description: "Additional storage for luggage" },
  { id: "bluetooth", name: "Bluetooth Car Kit", dailyRate: 50, description: "Hands-free calling setup" },
  { id: "driver-kit", name: "Driver Amenity Kit", dailyRate: 120, description: "Water, snacks and essentials" },
];

export function NewRentalDialog({ open, onOpenChange, theme }: NewRentalDialogProps) {
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  // Selected vehicle/client/etc. states
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedDriverType, setSelectedDriverType] = useState<'self' | 'company'>('self');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState<'individual' | 'corporate'>('individual');
  const [rentalSummary, setRentalSummary] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  // Rate calculation state
  const [calculatedRates, setCalculatedRates] = useState({
    baseRate: 0,
    additionalOptionsRate: 0,
    insuranceRate: 0,
    fuelRate: 0,
    totalRate: 0,
    securityDeposit: 5000
  });
  
  // Step 1 form - Vehicle Selection
  const vehicleForm = useForm<z.infer<typeof vehicleSelectionSchema>>({
    resolver: zodResolver(vehicleSelectionSchema),
    defaultValues: {
      vehicleId: '',
    }
  });
  
  // Step 2 form - Client Selection
  const clientForm = useForm<z.infer<typeof clientSelectionSchema>>({
    resolver: zodResolver(clientSelectionSchema),
    defaultValues: {
      clientType: 'individual',
      clientId: '',
      newClient: {
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        idType: '',
        idNumber: '',
      }
    }
  });
  
  // Step 3 form - Rental Details
  const rentalDetailsForm = useForm<z.infer<typeof rentalDetailsSchema>>({
    resolver: zodResolver(rentalDetailsSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      startTime: '',
      endTime: '',
      rentalPeriod: 'daily',
      insuranceOption: 'standard',
      fuelOption: 'return-full',
      additionalOptions: [],
    }
  });
  
  // Step 4 form - Driver Assignment
  const driverForm = useForm<z.infer<typeof driverAssignmentSchema>>({
    resolver: zodResolver(driverAssignmentSchema),
    defaultValues: {
      driverType: 'self',
      driverId: '',
      driverRequirements: {
        licenseVerified: false,
        experienceLevel: '',
        preferredLanguages: [],
      }
    }
  });
  
  // Step 5 form - Payment and Documentation
  const paymentForm = useForm<z.infer<typeof paymentDocumentationSchema>>({
    resolver: zodResolver(paymentDocumentationSchema),
    defaultValues: {
      paymentMethod: 'credit-card',
      securityDeposit: 5000,
      agreeToTerms: false,
      receiveUpdates: true,
    }
  });
  
  // Get vehicle by ID
  const getVehicleById = (id: string) => {
    return availableVehicles.find(v => v.id === id);
  };
  
  // Get client by ID
  const getClientById = (id: string) => {
    return recentClients.find(c => c.id === id);
  };
  
  // Get driver by ID
  const getDriverById = (id: string) => {
    return availableDrivers.find(d => d.id === id);
  };
  
  // Calculate rental rates based on selected options and duration
  const calculateRates = (data: z.infer<typeof rentalDetailsSchema>) => {
    const vehicle = getVehicleById(vehicleForm.getValues().vehicleId);
    if (!vehicle) return;
    
    // Base rate calculation based on rental period
    let baseRate = 0;
    if (data.rentalPeriod === 'daily') {
      baseRate = vehicle.dailyRate;
    } else if (data.rentalPeriod === 'weekly') {
      baseRate = vehicle.weeklyRate;
    } else if (data.rentalPeriod === 'monthly') {
      baseRate = vehicle.monthlyRate;
    } else {
      // Hourly rate (daily rate / 8)
      baseRate = Math.round(vehicle.dailyRate / 8);
    }
    
    // Calculate duration in days (simplified for demo)
    const startDate = data.startDate;
    const endDate = data.endDate;
    const durationDays = endDate && startDate ? 
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 1;
    
    // Insurance rate based on option
    let insuranceRate = 0;
    if (data.insuranceOption === 'basic') {
      insuranceRate = 200 * durationDays;
    } else if (data.insuranceOption === 'standard') {
      insuranceRate = 350 * durationDays;
    } else {
      insuranceRate = 500 * durationDays;
    }
    
    // Fuel option
    const fuelRate = data.fuelOption === 'prepaid' ? 1000 : 0;
    
    // Additional options
    const additionalOptionsRate = selectedOptions.reduce((total, optionId) => {
      const option = additionalOptions.find(o => o.id === optionId);
      return total + (option ? option.dailyRate * durationDays : 0);
    }, 0);
    
    // Total rate
    let totalRate = 0;
    if (data.rentalPeriod === 'daily') {
      totalRate = baseRate * durationDays;
    } else if (data.rentalPeriod === 'weekly') {
      totalRate = baseRate * Math.ceil(durationDays / 7);
    } else if (data.rentalPeriod === 'monthly') {
      totalRate = baseRate * Math.ceil(durationDays / 30);
    } else {
      // Hourly rate calculation for demo
      totalRate = baseRate * 8; // Assuming 8 hours
    }
    
    totalRate += insuranceRate + fuelRate + additionalOptionsRate;
    
    // Security deposit is usually a fixed amount or percentage of total
    const securityDeposit = 5000;
    
    setCalculatedRates({
      baseRate: data.rentalPeriod === 'daily' ? baseRate : (data.rentalPeriod === 'hourly' ? baseRate : baseRate / durationDays),
      additionalOptionsRate,
      insuranceRate,
      fuelRate,
      totalRate,
      securityDeposit
    });
  };
  
  // Handle vehicle selection
  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    vehicleForm.setValue('vehicleId', vehicleId);
  };
  
  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    clientForm.setValue('clientId', clientId);
    
    const client = getClientById(clientId);
    if (client) {
      setSelectedClientType(client.type as 'individual' | 'corporate');
      clientForm.setValue('clientType', client.type as 'individual' | 'corporate');
    }
  };
  
  // Handle driver selection
  const handleDriverSelect = (driverId: string) => {
    setSelectedDriver(driverId);
    driverForm.setValue('driverId', driverId);
  };
  
  // Handle client type change
  const handleClientTypeChange = (type: 'individual' | 'corporate') => {
    setSelectedClientType(type);
    clientForm.setValue('clientType', type);
  };
  
  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
    
    // Update form value
    rentalDetailsForm.setValue('additionalOptions', 
      selectedOptions.includes(optionId) ? 
        selectedOptions.filter(id => id !== optionId) : 
        [...selectedOptions, optionId]
    );
    
    // Recalculate rates
    calculateRates(rentalDetailsForm.getValues());
  };
  
  // Handle form submissions for each step
  const onVehicleSubmit = (data: z.infer<typeof vehicleSelectionSchema>) => {
    console.log("Vehicle selection data:", data);
    goToNextStep();
  };
  
  const onClientSubmit = (data: z.infer<typeof clientSelectionSchema>) => {
    console.log("Client selection data:", data);
    goToNextStep();
  };
  
  const onRentalDetailsSubmit = (data: z.infer<typeof rentalDetailsSchema>) => {
    console.log("Rental details data:", data);
    // Calculate rates on submission
    calculateRates(data);
    goToNextStep();
  };
  
  const onDriverSubmit = (data: z.infer<typeof driverAssignmentSchema>) => {
    console.log("Driver assignment data:", data);
    goToNextStep();
  };
  
  const onPaymentSubmit = (data: z.infer<typeof paymentDocumentationSchema>) => {
    console.log("Payment and documentation data:", data);
    
    // Generate rental summary for confirmation
    const vehicle = getVehicleById(vehicleForm.getValues().vehicleId);
    const clientData = clientForm.getValues();
    const client = clientData.clientId ? getClientById(clientData.clientId) : null;
    const rentalData = rentalDetailsForm.getValues();
    const driverData = driverForm.getValues();
    const driver = driverData.driverId ? getDriverById(driverData.driverId) : null;
    
    setRentalSummary({
      vehicle,
      client: client || clientData.newClient,
      rental: {
        ...rentalData,
        startDate: rentalData.startDate ? format(rentalData.startDate, 'PPP') : '',
        endDate: rentalData.endDate ? format(rentalData.endDate, 'PPP') : '',
      },
      driver: driver || driverData.driverRequirements,
      payment: data,
      rates: calculatedRates
    });
    
    goToNextStep();
  };
  
  const onConfirmRental = () => {
    // In a real application, this would save the rental to the database
    console.log("Rental confirmed with data:", {
      vehicle: vehicleForm.getValues(),
      client: clientForm.getValues(),
      rental: rentalDetailsForm.getValues(),
      driver: driverForm.getValues(),
      payment: paymentForm.getValues(),
      rates: calculatedRates
    });
    
    // Close dialog after confirmation
    onOpenChange(false);
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
  const renderVehicleSelection = () => {
    return (
      <Form {...vehicleForm}>
        <form onSubmit={vehicleForm.handleSubmit(onVehicleSubmit)} className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Select a Vehicle
            </h3>
            
            <div className="flex space-x-2">
              <Select onValueChange={(value) => console.log("Filter by type:", value)}>
                <SelectTrigger className={`w-[140px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}>
                  <SelectValue placeholder="Vehicle Type" />
                </SelectTrigger>
                <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="3-wheeler">3-Wheeler</SelectItem>
                </SelectContent>
              </Select>
              
              <Select onValueChange={(value) => console.log("Filter by location:", value)}>
                <SelectTrigger className={`w-[140px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableVehicles.map(vehicle => (
              <div 
                key={vehicle.id}
                className={`border rounded-lg overflow-hidden transition-all ${
                  selectedVehicle === vehicle.id 
                    ? `ring-2 ${theme === 'light' ? 'ring-blue-500' : 'ring-primary'}` 
                    : ''
                } ${
                  vehicle.status !== 'Available'
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-md'
                } ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''
                }`}
                onClick={() => vehicle.status === 'Available' && handleVehicleSelect(vehicle.id)}
              >
                <div className="flex">
                  {/* Vehicle image placeholder */}
                  <div className={`w-1/3 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'} flex items-center justify-center`}>
                    <Car className={`h-12 w-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  
                  <div className="w-2/3 p-4">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{vehicle.name}</h4>
                      <Badge className={
                        vehicle.status === 'Available' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : vehicle.status === 'On Rent'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {vehicle.registration}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {vehicle.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {vehicle.seatingCapacity} Seats
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {vehicle.fuelType}
                      </Badge>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <p className="font-medium">₹{vehicle.dailyRate}/day</p>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {vehicle.location}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Features section */}
                <div className={`px-4 py-2 text-xs flex flex-wrap gap-2 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                  {vehicle.features.map((feature, index) => (
                    <span key={index} className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                      {index > 0 && '•'} {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Hidden field for vehicle ID */}
          <FormField
            control={vehicleForm.control}
            name="vehicleId"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
              disabled={!selectedVehicle}
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
  
  const renderClientSelection = () => {
    return (
      <Form {...clientForm}>
        <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Client Information
            </h3>
            
            <FormField
              control={clientForm.control}
              name="clientType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Type</FormLabel>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={field.value === 'individual' ? 'default' : 'outline'}
                      onClick={() => handleClientTypeChange('individual')}
                      className={`flex-1 ${theme === 'light' ? (field.value === 'individual' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '') : ''}`}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Individual
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'corporate' ? 'default' : 'outline'}
                      onClick={() => handleClientTypeChange('corporate')}
                      className={`flex-1 ${theme === 'light' ? (field.value === 'corporate' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '') : ''}`}
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Corporate
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!showNewClientForm && (
              <>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Search clients..." 
                    className={`pl-9 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                
                <div className={`border rounded-lg divide-y ${theme === 'dark' ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'divide-gray-200'}`}>
                  <div className="p-3 flex justify-between items-center">
                    <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Recent Clients
                    </h4>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowNewClientForm(true)}
                      className="h-8 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      New Client
                    </Button>
                  </div>
                  
                  {recentClients
                    .filter(client => {
                      // Filter by selected client type
                      return client.type === selectedClientType;
                    })
                    .map(client => (
                    <div 
                      key={client.id}
                      className={`p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selectedClient === client.id ? `bg-blue-50 dark:bg-blue-900/20` : ''
                      }`}
                      onClick={() => handleClientSelect(client.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h5 className="font-medium">{client.name}</h5>
                          <Badge className="ml-2 px-1 py-0 text-xs" variant="outline">
                            {client.type === 'individual' ? 'Individual' : 'Corporate'}
                          </Badge>
                        </div>
                        
                        {client.type === 'corporate' && client.contactPerson && (
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Contact: {client.contactPerson}
                          </p>
                        )}
                        
                        <div className={`flex mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          <p className="flex items-center mr-3">
                            <Phone className="h-3 w-3 mr-1" />
                            {client.phone}
                          </p>
                          <p className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {client.email}
                          </p>
                        </div>
                      </div>
                      
                      {selectedClient === client.id && (
                        <Check className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-primary'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {showNewClientForm && (
              <div className={`border rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">New {selectedClientType === 'individual' ? 'Individual' : 'Corporate'} Client</h4>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowNewClientForm(false)}
                    className="h-8"
                  >
                    Back to List
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {selectedClientType === 'individual' ? (
                    // Individual client form
                    <>
                      <FormField
                        control={clientForm.control}
                        name="newClient.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Anil Kumar" 
                                {...field} 
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={clientForm.control}
                          name="newClient.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="e.g., anil.kumar@gmail.com" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clientForm.control}
                          name="newClient.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., +91 98765 43210" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={clientForm.control}
                        name="newClient.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={clientForm.control}
                          name="newClient.idType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                                    <SelectValue placeholder="Select ID type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                                  <SelectItem value="aadhar">Aadhar Card</SelectItem>
                                  <SelectItem value="pan">PAN Card</SelectItem>
                                  <SelectItem value="driving-license">Driving License</SelectItem>
                                  <SelectItem value="passport">Passport</SelectItem>
                                  <SelectItem value="voter-id">Voter ID</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clientForm.control}
                          name="newClient.idNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter ID number" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-blue-50 text-blue-800' : 'bg-blue-900/20 text-blue-400'}`}>
                        <div className="flex">
                          <UploadCloud className="h-5 w-5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Upload ID Document</p>
                            <p className="text-xs mt-1">Please upload a scanned copy or clear photo of the selected ID</p>
                          </div>
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="mt-2 w-full h-8"
                        >
                          Choose File
                        </Button>
                      </div>
                    </>
                  ) : (
                    // Corporate client form
                    <>
                      <FormField
                        control={clientForm.control}
                        name="newClient.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., ABC Logistics Pvt. Ltd." 
                                {...field} 
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={clientForm.control}
                        name="newClient.contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Rajesh Sharma" 
                                {...field} 
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={clientForm.control}
                          name="newClient.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="e.g., info@abclogistics.com" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clientForm.control}
                          name="newClient.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., +91 98765 43210" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={clientForm.control}
                        name="newClient.address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Address</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter complete business address" 
                                {...field} 
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={clientForm.control}
                          name="newClient.idType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business ID Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                                    <SelectValue placeholder="Select ID type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                                  <SelectItem value="gst">GST Certificate</SelectItem>
                                  <SelectItem value="cin">CIN Number</SelectItem>
                                  <SelectItem value="pan">PAN Card</SelectItem>
                                  <SelectItem value="incorporation">Certificate of Incorporation</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clientForm.control}
                          name="newClient.idNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter business ID number" 
                                  {...field} 
                                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-blue-50 text-blue-800' : 'bg-blue-900/20 text-blue-400'}`}>
                        <div className="flex">
                          <UploadCloud className="h-5 w-5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Upload Business Documents</p>
                            <p className="text-xs mt-1">Please upload relevant business registration documents</p>
                          </div>
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="mt-2 w-full h-8"
                        >
                          Choose Files
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
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
              disabled={!showNewClientForm && !selectedClient}
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
  
  const renderRentalDetails = () => {
    return (
      <Form {...rentalDetailsForm}>
        <form onSubmit={rentalDetailsForm.handleSubmit(onRentalDetailsSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Rental Details
            </h3>
            
            {/* Rental period selection */}
            <FormField
              control={rentalDetailsForm.control}
              name="rentalPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rental Period</FormLabel>
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      type="button"
                      variant={field.value === 'hourly' ? 'default' : 'outline'}
                      onClick={() => rentalDetailsForm.setValue('rentalPeriod', 'hourly')}
                      className={`${theme === 'light' ? (field.value === 'hourly' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '') : ''}`}
                    >
                      Hourly
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'daily' ? 'default' : 'outline'}
                      onClick={() => rentalDetailsForm.setValue('rentalPeriod', 'daily')}
                      className={`${theme === 'light' ? (field.value === 'daily' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '') : ''}`}
                    >
                      Daily
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'weekly' ? 'default' : 'outline'}
                      onClick={() => rentalDetailsForm.setValue('rentalPeriod', 'weekly')}
                      className={`${theme === 'light' ? (field.value === 'weekly' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '') : ''}`}
                    >
                      Weekly
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'monthly' ? 'default' : 'outline'}
                      onClick={() => rentalDetailsForm.setValue('rentalPeriod', 'monthly')}
                      className={`${theme === 'light' ? (field.value === 'monthly' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '') : ''}`}
                    >
                      Monthly
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Date and time selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={rentalDetailsForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
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
                              // Can't pick dates in the past
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={rentalDetailsForm.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                          <SelectItem value="0800">08:00 AM</SelectItem>
                          <SelectItem value="0900">09:00 AM</SelectItem>
                          <SelectItem value="1000">10:00 AM</SelectItem>
                          <SelectItem value="1100">11:00 AM</SelectItem>
                          <SelectItem value="1200">12:00 PM</SelectItem>
                          <SelectItem value="1300">01:00 PM</SelectItem>
                          <SelectItem value="1400">02:00 PM</SelectItem>
                          <SelectItem value="1500">03:00 PM</SelectItem>
                          <SelectItem value="1600">04:00 PM</SelectItem>
                          <SelectItem value="1700">05:00 PM</SelectItem>
                          <SelectItem value="1800">06:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={rentalDetailsForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
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
                              // Can't pick dates before start date
                              const startDate = rentalDetailsForm.getValues().startDate;
                              if (!startDate) return false;
                              startDate.setHours(0, 0, 0, 0);
                              return date < startDate;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={rentalDetailsForm.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                          <SelectItem value="0800">08:00 AM</SelectItem>
                          <SelectItem value="0900">09:00 AM</SelectItem>
                          <SelectItem value="1000">10:00 AM</SelectItem>
                          <SelectItem value="1100">11:00 AM</SelectItem>
                          <SelectItem value="1200">12:00 PM</SelectItem>
                          <SelectItem value="1300">01:00 PM</SelectItem>
                          <SelectItem value="1400">02:00 PM</SelectItem>
                          <SelectItem value="1500">03:00 PM</SelectItem>
                          <SelectItem value="1600">04:00 PM</SelectItem>
                          <SelectItem value="1700">05:00 PM</SelectItem>
                          <SelectItem value="1800">06:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Insurance options */}
            <FormField
              control={rentalDetailsForm.control}
              name="insuranceOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insurance Coverage</FormLabel>
                  <div className={`grid grid-cols-3 gap-3 mt-1 ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        field.value === 'basic' 
                          ? `ring-2 ${theme === 'light' ? 'ring-blue-500 border-blue-200 bg-blue-50' : 'ring-primary border-gray-600 bg-gray-700'}`
                          : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'hover:border-gray-300'
                      }`}
                      onClick={() => rentalDetailsForm.setValue('insuranceOption', 'basic')}
                    >
                      <h4 className="font-medium mb-1">Basic</h4>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Covers third-party liability only
                      </p>
                      <p className="mt-2 font-medium">₹200/day</p>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        field.value === 'standard' 
                          ? `ring-2 ${theme === 'light' ? 'ring-blue-500 border-blue-200 bg-blue-50' : 'ring-primary border-gray-600 bg-gray-700'}`
                          : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'hover:border-gray-300'
                      }`}
                      onClick={() => rentalDetailsForm.setValue('insuranceOption', 'standard')}
                    >
                      <h4 className="font-medium mb-1">Standard</h4>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Adds vehicle damage coverage
                      </p>
                      <p className="mt-2 font-medium">₹350/day</p>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        field.value === 'premium' 
                          ? `ring-2 ${theme === 'light' ? 'ring-blue-500 border-blue-200 bg-blue-50' : 'ring-primary border-gray-600 bg-gray-700'}`
                          : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'hover:border-gray-300'
                      }`}
                      onClick={() => rentalDetailsForm.setValue('insuranceOption', 'premium')}
                    >
                      <h4 className="font-medium mb-1">Premium</h4>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Complete coverage with zero liability
                      </p>
                      <p className="mt-2 font-medium">₹500/day</p>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Fuel options */}
            <FormField
              control={rentalDetailsForm.control}
              name="fuelOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Option</FormLabel>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        field.value === 'prepaid' 
                          ? `ring-2 ${theme === 'light' ? 'ring-blue-500 border-blue-200 bg-blue-50' : 'ring-primary border-gray-600 bg-gray-700'}`
                          : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'hover:border-gray-300'
                      }`}
                      onClick={() => rentalDetailsForm.setValue('fuelOption', 'prepaid')}
                    >
                      <h4 className="font-medium mb-1">Pre-paid Fuel</h4>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Pay upfront for a full tank and return at any level
                      </p>
                      <p className="mt-2 font-medium">₹1,000 one-time</p>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        field.value === 'return-full' 
                          ? `ring-2 ${theme === 'light' ? 'ring-blue-500 border-blue-200 bg-blue-50' : 'ring-primary border-gray-600 bg-gray-700'}`
                          : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'hover:border-gray-300'
                      }`}
                      onClick={() => rentalDetailsForm.setValue('fuelOption', 'return-full')}
                    >
                      <h4 className="font-medium mb-1">Return Full</h4>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Vehicle provided with full tank, must return with full tank
                      </p>
                      <p className="mt-2 font-medium">No additional cost</p>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Additional options */}
            <div>
              <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : ''}`}>
                Additional Options
              </h4>
              
              <div className="space-y-2">
                {additionalOptions.map(option => (
                  <div 
                    key={option.id}
                    className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer ${
                      selectedOptions.includes(option.id)
                        ? `ring-2 ${theme === 'light' ? 'ring-blue-500 border-blue-200 bg-blue-50' : 'ring-primary border-gray-600 bg-gray-700'}`
                        : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <div className="flex items-center">
                      <Checkbox 
                        id={`option-${option.id}`}
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={() => handleOptionSelect(option.id)}
                        className="mr-3"
                      />
                      <div>
                        <label 
                          htmlFor={`option-${option.id}`} 
                          className="font-medium cursor-pointer"
                        >
                          {option.name}
                        </label>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-sm">₹{option.dailyRate}/day</p>
                  </div>
                ))}
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
  
  const renderDriverAssignment = () => {
    return (
      <Form {...driverForm}>
        <form onSubmit={driverForm.handleSubmit(onDriverSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Driver Assignment
            </h3>
            
            <FormField
              control={driverForm.control}
              name="driverType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Requirement</FormLabel>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={field.value === 'self' ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedDriverType('self');
                        driverForm.setValue('driverType', 'self');
                      }}
                      className={`flex-1 ${theme === 'light' ? (field.value === 'self' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '') : ''}`}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Self-Drive
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'company' ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedDriverType('company');
                        driverForm.setValue('driverType', 'company');
                      }}
                      className={`flex-1 ${theme === 'light' ? (field.value === 'company' ? 'bg-blue-600 hover:bg-blue-700 text-white' : '') : ''}`}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Company Driver
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedDriverType === 'self' ? (
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <h4 className="font-medium">Self-Drive Requirements</h4>
                
                <div className="mt-4 space-y-4">
                  <FormField
                    control={driverForm.control}
                    name="driverRequirements.licenseVerified"
                    render={({ field }) => (
                      <FormItem className="flex space-x-3 space-y-0 items-start">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Driving License Verification
                          </FormLabel>
                          <FormDescription>
                            Required for all self-drive rentals
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className={`p-3 rounded-md text-sm ${theme === 'light' ? 'bg-yellow-50 text-yellow-800' : 'bg-yellow-900/20 text-yellow-400'}`}>
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">License Verification Required</p>
                        <p className="text-xs mt-1">Please bring your original driving license for verification at the time of pick-up</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-blue-50 text-blue-800' : 'bg-blue-900/20 text-blue-400'}`}>
                    <div className="flex">
                      <UploadCloud className="h-5 w-5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Upload Driving License</p>
                        <p className="text-xs mt-1">Please upload front and back of your driving license</p>
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="mt-2 w-full h-8"
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Input 
                  type="text" 
                  placeholder="Search for a driver..." 
                  className={`mb-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                />
                
                <div className={`border rounded-lg divide-y ${theme === 'dark' ? 'bg-gray-800 border-gray-700 divide-gray-700' : 'divide-gray-200'}`}>
                  <div className="p-3">
                    <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Available Drivers
                    </h4>
                  </div>
                  
                  {availableDrivers.map(driver => (
                    <div 
                      key={driver.id}
                      className={`p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selectedDriver === driver.id ? `bg-blue-50 dark:bg-blue-900/20` : ''
                      } ${
                        driver.status !== 'Available' ? 'opacity-60' : ''
                      }`}
                      onClick={() => driver.status === 'Available' && handleDriverSelect(driver.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h5 className="font-medium">{driver.name}</h5>
                          <Badge className={`ml-2 px-1 py-0 text-xs ${
                            driver.status === 'Available' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {driver.status}
                          </Badge>
                        </div>
                        
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {driver.experience} experience • Rating: {driver.rating}/5
                        </p>
                        
                        <div className={`flex mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          <p className="flex items-center mr-3">
                            <Phone className="h-3 w-3 mr-1" />
                            {driver.phone}
                          </p>
                          <p className="flex items-center">
                            Languages: {driver.languages.join(', ')}
                          </p>
                        </div>
                      </div>
                      
                      {selectedDriver === driver.id && (
                        <Check className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-primary'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Hidden field for driver ID */}
            <FormField
              control={driverForm.control}
              name="driverId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
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
              disabled={selectedDriverType === 'company' && !selectedDriver}
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
  
  const renderPaymentDocumentation = () => {
    // Calculate rates based on current rental details form data
    calculateRates(rentalDetailsForm.getValues());
    
    return (
      <Form {...paymentForm}>
        <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Payment & Documentation
            </h3>
            
            {/* Rate Summary */}
            <div className={`border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
              <div className={`p-3 font-medium ${theme === 'light' ? 'bg-gray-50 border-b' : 'bg-gray-700 border-b border-gray-600'}`}>
                Rental Summary
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <p className={theme === 'dark' ? 'text-gray-300' : ''}>Base Rate:</p>
                  <p className="font-medium">₹{calculatedRates.baseRate.toLocaleString()}/{rentalDetailsForm.getValues().rentalPeriod.slice(0, -2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className={theme === 'dark' ? 'text-gray-300' : ''}>Insurance:</p>
                  <p className="font-medium">₹{calculatedRates.insuranceRate.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className={theme === 'dark' ? 'text-gray-300' : ''}>Fuel Option:</p>
                  <p className="font-medium">₹{calculatedRates.fuelRate.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className={theme === 'dark' ? 'text-gray-300' : ''}>Additional Options:</p>
                  <p className="font-medium">₹{calculatedRates.additionalOptionsRate.toLocaleString()}</p>
                </div>
                <Separator className={theme === 'dark' ? 'bg-gray-700' : ''} />
                <div className="flex justify-between font-medium">
                  <p className={theme === 'dark' ? 'text-gray-300' : ''}>Total Rental Cost:</p>
                  <p className="text-lg">₹{calculatedRates.totalRate.toLocaleString()}</p>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <p className={theme === 'dark' ? 'text-gray-300' : ''}>Security Deposit:</p>
                  <p className="font-medium">₹{calculatedRates.securityDeposit.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <FormField
              control={paymentForm.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1">
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        field.value === 'credit-card' 
                          ? `ring-2 ${theme === 'light' ? 'ring-blue-500 border-blue-200 bg-blue-50' : 'ring-primary border-gray-600 bg-gray-700'}`
                          : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'hover:border-gray-300'
                      }`}
                      onClick={() => paymentForm.setValue('paymentMethod', 'credit-card')}
                    >
                      <CreditCard className={`h-5 w-5 mb-1 ${field.value === 'credit-card' ? (theme === 'light' ? 'text-blue-600' : 'text-primary') : ''}`} />
                      <p className="font-medium">Credit/Debit Card</p>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        field.value === 'bank-transfer' 
                          ? `ring-2 ${theme === 'light' ? 'ring-blue-500 border-blue-200 bg-blue-50' : 'ring-primary border-gray-600 bg-gray-700'}`
                          : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'hover:border-gray-300'
                      }`}
                      onClick={() => paymentForm.setValue('paymentMethod', 'bank-transfer')}
                    >
                      <Building className={`h-5 w-5 mb-1 ${field.value === 'bank-transfer' ? (theme === 'light' ? 'text-blue-600' : 'text-primary') : ''}`} />
                      <p className="font-medium">Bank Transfer</p>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        field.value === 'digital-wallet' 
                          ? `ring-2 ${theme === 'light' ? 'ring-blue-500 border-blue-200 bg-blue-50' : 'ring-primary border-gray-600 bg-gray-700'}`
                          : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'hover:border-gray-300'
                      }`}
                      onClick={() => paymentForm.setValue('paymentMethod', 'digital-wallet')}
                    >
                      <Phone className={`h-5 w-5 mb-1 ${field.value === 'digital-wallet' ? (theme === 'light' ? 'text-blue-600' : 'text-primary') : ''}`} />
                      <p className="font-medium">Digital Wallet</p>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        field.value === 'cash' 
                          ? `ring-2 ${theme === 'light' ? 'ring-blue-500 border-blue-200 bg-blue-50' : 'ring-primary border-gray-600 bg-gray-700'}`
                          : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'hover:border-gray-300'
                      }`}
                      onClick={() => paymentForm.setValue('paymentMethod', 'cash')}
                    >
                      <DollarSign className={`h-5 w-5 mb-1 ${field.value === 'cash' ? (theme === 'light' ? 'text-blue-600' : 'text-primary') : ''}`} />
                      <p className="font-medium">Cash</p>
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        field.value === 'corporate-account' 
                          ? `ring-2 ${theme === 'light' ? 'ring-blue-500 border-blue-200 bg-blue-50' : 'ring-primary border-gray-600 bg-gray-700'}`
                          : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'hover:border-gray-300'
                      }`}
                      onClick={() => paymentForm.setValue('paymentMethod', 'corporate-account')}
                    >
                      <FileText className={`h-5 w-5 mb-1 ${field.value === 'corporate-account' ? (theme === 'light' ? 'text-blue-600' : 'text-primary') : ''}`} />
                      <p className="font-medium">Corporate Account</p>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Security Deposit */}
            <FormField
              control={paymentForm.control}
              name="securityDeposit"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Security Deposit (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      value={value}
                      onChange={(e) => onChange(parseInt(e.target.value))}
                      {...field} 
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Refundable deposit required for all rentals
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Terms and conditions */}
            <FormField
              control={paymentForm.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className={`flex space-x-3 space-y-0 items-start p-4 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the Terms and Conditions
                    </FormLabel>
                    <FormDescription>
                      I have read and agree to the <a href="#" className={theme === 'light' ? 'text-blue-600 hover:underline' : 'text-primary hover:underline'}>Rental Agreement</a>, <a href="#" className={theme === 'light' ? 'text-blue-600 hover:underline' : 'text-primary hover:underline'}>Vehicle Usage Policy</a>, and <a href="#" className={theme === 'light' ? 'text-blue-600 hover:underline' : 'text-primary hover:underline'}>Cancelation Policy</a>.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {/* Communication preferences */}
            <FormField
              control={paymentForm.control}
              name="receiveUpdates"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-4 space-y-0">
                  <FormLabel>Receive Rental Updates</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Get SMS and email notifications about rental status
                  </FormDescription>
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
  
  const renderConfirmation = () => {
    if (!rentalSummary) return null;
    
    const vehicle = getVehicleById(vehicleForm.getValues().vehicleId);
    
    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-lg border ${theme === 'light' ? 'bg-green-50 border-green-100' : 'bg-green-900/20 border-green-900/30'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-green-100' : 'bg-green-900/30'}`}>
              <CheckCircle className={`h-6 w-6 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
            </div>
            <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-green-800' : 'text-green-400'}`}>
              Rental Ready for Confirmation
            </h3>
          </div>
          <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
            Please review the rental details below and confirm to create the rental.
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Vehicle Details */}
          <div className={`border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-gray-700' : ''}`}>
            <div className={`p-3 font-medium ${theme === 'light' ? 'bg-gray-50 border-b' : 'bg-gray-700 border-b border-gray-600'}`}>
              Vehicle Details
            </div>
            <div className="p-4 flex">
              {/* Vehicle image placeholder */}
              <div className={`w-1/4 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'} flex items-center justify-center rounded`}>
                <Car className={`h-12 w-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              
              <div className="w-3/4 pl-4">
                <h4 className="font-medium text-lg">{vehicle?.name}</h4>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {vehicle?.registration}
                </p>
                
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <p className={theme === 'dark' ? 'text-gray-300' : ''}>Vehicle Type:</p>
                    <p className="font-medium">{vehicle?.type}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className={theme === 'dark' ? 'text-gray-300' : ''}>Fuel Type:</p>
                    <p className="font-medium">{vehicle?.fuelType}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className={theme === 'dark' ? 'text-gray-300' : ''}>Location:</p>
                    <p className="font-medium">{vehicle?.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rental Details */}
          <div className={`border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-gray-700' : ''}`}>
            <div className={`p-3 font-medium ${theme === 'light' ? 'bg-gray-50 border-b' : 'bg-gray-700 border-b border-gray-600'}`}>
              Rental Period
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <p className={theme === 'dark' ? 'text-gray-300' : ''}>Start Date & Time:</p>
                <p className="font-medium">
                  {rentalSummary.rental.startDate}, {
                    rentalSummary.rental.startTime === '0800' ? '08:00 AM' :
                    rentalSummary.rental.startTime === '0900' ? '09:00 AM' :
                    rentalSummary.rental.startTime === '1000' ? '10:00 AM' :
                    rentalSummary.rental.startTime === '1100' ? '11:00 AM' :
                    rentalSummary.rental.startTime === '1200' ? '12:00 PM' :
                    rentalSummary.rental.startTime === '1300' ? '01:00 PM' :
                    rentalSummary.rental.startTime === '1400' ? '02:00 PM' :
                    rentalSummary.rental.startTime === '1500' ? '03:00 PM' :
                    rentalSummary.rental.startTime === '1600' ? '04:00 PM' :
                    rentalSummary.rental.startTime === '1700' ? '05:00 PM' :
                    rentalSummary.rental.startTime === '1800' ? '06:00 PM' : ''
                  }
                </p>
              </div>
              <div className="flex justify-between">
                <p className={theme === 'dark' ? 'text-gray-300' : ''}>End Date & Time:</p>
                <p className="font-medium">
                  {rentalSummary.rental.endDate}, {
                    rentalSummary.rental.endTime === '0800' ? '08:00 AM' :
                    rentalSummary.rental.endTime === '0900' ? '09:00 AM' :
                    rentalSummary.rental.endTime === '1000' ? '10:00 AM' :
                    rentalSummary.rental.endTime === '1100' ? '11:00 AM' :
                    rentalSummary.rental.endTime === '1200' ? '12:00 PM' :
                    rentalSummary.rental.endTime === '1300' ? '01:00 PM' :
                    rentalSummary.rental.endTime === '1400' ? '02:00 PM' :
                    rentalSummary.rental.endTime === '1500' ? '03:00 PM' :
                    rentalSummary.rental.endTime === '1600' ? '04:00 PM' :
                    rentalSummary.rental.endTime === '1700' ? '05:00 PM' :
                    rentalSummary.rental.endTime === '1800' ? '06:00 PM' : ''
                  }
                </p>
              </div>
              <div className="flex justify-between">
                <p className={theme === 'dark' ? 'text-gray-300' : ''}>Rental Type:</p>
                <p className="font-medium">
                  {rentalSummary.rental.rentalPeriod === 'hourly' ? 'Hourly' :
                   rentalSummary.rental.rentalPeriod === 'daily' ? 'Daily' :
                   rentalSummary.rental.rentalPeriod === 'weekly' ? 'Weekly' : 'Monthly'} Rental
                </p>
              </div>
              <div className="flex justify-between">
                <p className={theme === 'dark' ? 'text-gray-300' : ''}>Insurance Package:</p>
                <p className="font-medium">
                  {rentalSummary.rental.insuranceOption === 'basic' ? 'Basic' :
                   rentalSummary.rental.insuranceOption === 'standard' ? 'Standard' : 'Premium'} Coverage
                </p>
              </div>
              <div className="flex justify-between">
                <p className={theme === 'dark' ? 'text-gray-300' : ''}>Fuel Option:</p>
                <p className="font-medium">
                  {rentalSummary.rental.fuelOption === 'prepaid' ? 'Pre-paid Fuel' : 'Return with Full Tank'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Payment Summary */}
          <div className={`border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-gray-700' : ''}`}>
            <div className={`p-3 font-medium ${theme === 'light' ? 'bg-gray-50 border-b' : 'bg-gray-700 border-b border-gray-600'}`}>
              Payment Summary
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <p className={theme === 'dark' ? 'text-gray-300' : ''}>Total Rental Cost:</p>
                <p className="font-medium">₹{calculatedRates.totalRate.toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p className={theme === 'dark' ? 'text-gray-300' : ''}>Security Deposit:</p>
                <p className="font-medium">₹{calculatedRates.securityDeposit.toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p className={theme === 'dark' ? 'text-gray-300' : ''}>Payment Method:</p>
                <p className="font-medium">
                  {rentalSummary.payment.paymentMethod === 'credit-card' ? 'Credit/Debit Card' :
                   rentalSummary.payment.paymentMethod === 'bank-transfer' ? 'Bank Transfer' :
                   rentalSummary.payment.paymentMethod === 'digital-wallet' ? 'Digital Wallet' :
                   rentalSummary.payment.paymentMethod === 'cash' ? 'Cash' : 'Corporate Account'}
                </p>
              </div>
              <div className="pt-2 mt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                <div className="flex justify-between font-medium">
                  <p className={theme === 'dark' ? 'text-gray-300' : ''}>Amount Due Now:</p>
                  <p className="text-lg">₹{(calculatedRates.securityDeposit).toLocaleString()}</p>
                </div>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Initial payment includes security deposit only. Rental cost will be charged at pickup.
                </p>
              </div>
            </div>
          </div>
          
          {/* Driver Information */}
          <div className={`border rounded-lg overflow-hidden ${theme === 'dark' ? 'border-gray-700' : ''}`}>
            <div className={`p-3 font-medium ${theme === 'light' ? 'bg-gray-50 border-b' : 'bg-gray-700 border-b border-gray-600'}`}>
              Driver Information
            </div>
            <div className="p-4">
              {driverForm.getValues().driverType === 'self' ? (
                <div className="flex items-center">
                  <User className={`h-8 w-8 mr-3 ${theme === 'light' ? 'text-blue-600' : 'text-primary'}`} />
                  <div>
                    <h4 className="font-medium">Self-Drive</h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Customer will drive the vehicle
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <Users className={`h-8 w-8 mr-3 ${theme === 'light' ? 'text-blue-600' : 'text-primary'}`} />
                  <div>
                    <h4 className="font-medium">
                      {getDriverById(driverForm.getValues().driverId || '')?.name}
                    </h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Company driver assigned to this rental
                    </p>
                  </div>
                </div>
              )}
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
            type="button"
            onClick={onConfirmRental}
            className={theme === 'light' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}
          >
            Confirm Rental
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </div>
    );
  };
  
  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderVehicleSelection();
      case 2:
        return renderClientSelection();
      case 3:
        return renderRentalDetails();
      case 4:
        return renderDriverAssignment();
      case 5:
        return renderPaymentDocumentation();
      case 6:
        return renderConfirmation();
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-screen overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`text-xl ${theme === 'dark' ? 'text-white' : ''}`}>
            {currentStep < 6 ? 'Create New Rental' : 'Rental Confirmation'}
          </DialogTitle>
          {currentStep < 6 && (
            <DialogDescription>
              Complete all details to create a new vehicle rental
            </DialogDescription>
          )}
        </DialogHeader>
        
        {/* Progress indicator */}
        {currentStep < 6 && (
          <div className="w-full pt-2">
            <div className="flex justify-between mb-2">
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Step {currentStep} of {totalSteps - 1}
              </span>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentStep === 1 ? 'Vehicle Selection' : 
                 currentStep === 2 ? 'Client Selection' :
                 currentStep === 3 ? 'Rental Details' : 
                 currentStep === 4 ? 'Driver Assignment' :
                 'Payment & Documentation'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className={`h-2.5 rounded-full ${theme === 'light' ? 'bg-blue-600' : 'bg-primary'}`} 
                style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Step content */}
        <div className="mt-4">
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}