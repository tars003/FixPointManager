import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import {
  IndianRupee,
  Clock,
  CheckCircle,
  UserCircle,
  MapPin,
  Calendar,
  CalendarIcon,
  CreditCard,
  Car,
  Building,
  AlertCircle
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/format';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

// Define the schema for the form
const bookingFormSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit mobile number (without +91)' }),
  vehicleType: z.string().min(1, { message: 'Please select a vehicle type' }),
  useExistingVehicle: z.boolean().default(false),
  existingVehicleId: z.string().optional(),
  vehicleRegistration: z.string().regex(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/, {
    message: 'Please enter a valid vehicle registration number (e.g., MH12AB1234)'
  }).optional(),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters' }),
  state: z.string().min(2, { message: 'Please select a state' }),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, { message: 'Please enter a valid 6-digit pincode' }),
  nearbyRto: z.string().optional(),
  preferredDate: z.date({ required_error: 'Please select a preferred date' }),
  paymentMethod: z.enum(['online', 'cash'], { required_error: 'Please select a payment method' }),
  additionalNotes: z.string().optional(),
}).refine(data => {
  // If using existing vehicle, existingVehicleId must be provided
  if (data.useExistingVehicle) {
    return !!data.existingVehicleId;
  }
  // If not using existing vehicle, vehicleRegistration must be provided
  return !!data.vehicleRegistration;
}, {
  message: "Please select a vehicle from your garage or enter a registration number",
  path: ["existingVehicleId"]
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface ServiceBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: number;
    name: string;
    description: string;
    price: number;
    averageTime: string;
    rating: number;
    categories: string[];
    stateSpecific: boolean;
  } | null;
}

// Indian states for dropdown
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// Define RTO office type
type RtoOffice = {
  id: string;
  name: string;
  address: string;
};

// Sample nearby RTO offices (in real app, would be based on pincode/city)
const nearbyRtoOffices: Record<string, RtoOffice[]> = {
  "400001": [
    { id: "rto-mum-1", name: "Mumbai Central RTO", address: "Mumbai Central, Mumbai, Maharashtra" },
    { id: "rto-mum-2", name: "Tardeo RTO", address: "Tardeo, Mumbai, Maharashtra" },
    { id: "rto-mum-3", name: "Andheri RTO", address: "Andheri, Mumbai, Maharashtra" }
  ],
  "110001": [
    { id: "rto-del-1", name: "Delhi Central RTO", address: "Sarai Kale Khan, New Delhi, Delhi" },
    { id: "rto-del-2", name: "Lajpat Nagar RTO", address: "Lajpat Nagar, New Delhi, Delhi" },
  ],
  "default": [
    { id: "rto-def-1", name: "Local RTO Office", address: "Please contact for exact address" },
  ]
};

const ServiceBookingDialog: React.FC<ServiceBookingDialogProps> = ({
  open,
  onOpenChange,
  service
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [showExistingVehicles, setShowExistingVehicles] = useState(false);
  const [availableRtoOffices, setAvailableRtoOffices] = useState<typeof nearbyRtoOffices['default']>([]);
  
  // Define vehicle type
type Vehicle = {
  id: number;
  name: string;
  make: string;
  model: string;
  licensePlate: string;
  year: number;
  status: string;
};

// Fetch user's vehicles
const { data: userVehicles, isLoading: isLoadingVehicles } = useQuery<Vehicle[]>({
  queryKey: ['/api/vehicles'],
  queryFn: async () => {
    const res = await apiRequest('GET', '/api/vehicles');
    const data = await res.json();
    return data;
  },
});
  
  // Initialize form
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      vehicleType: '',
      vehicleRegistration: '',
      useExistingVehicle: false,
      existingVehicleId: undefined,
      address: '',
      city: '',
      state: '',
      pincode: '',
      preferredDate: undefined,
      nearbyRto: '',
      paymentMethod: 'online',
      additionalNotes: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this data to the server
      // For demo, we'll simulate a network request with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random booking ID
      const generatedBookingId = 'RTO' + Date.now().toString().slice(-5);
      setBookingId(generatedBookingId);
      
      // Create booking object for API (in a real app this would be sent to server)
      const bookingData = {
        id: generatedBookingId,
        serviceId: service?.id,
        serviceName: service?.name,
        price: service?.price,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        vehicleInfo: data.useExistingVehicle && userVehicles 
          ? userVehicles.find((v: Vehicle) => v.id.toString() === data.existingVehicleId)
          : { licensePlate: data.vehicleRegistration },
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        rtoOffice: availableRtoOffices.find(office => office.id === data.nearbyRto),
        preferredDate: data.preferredDate,
        paymentMethod: data.paymentMethod,
        additionalNotes: data.additionalNotes,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      console.log('Booking created:', bookingData);
      
      // Show success message and set booking as complete
      setBookingComplete(true);
      
      toast({
        title: 'Booking Successful',
        description: `Your RTO service booking (ID: ${generatedBookingId}) has been confirmed.`,
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: 'There was an error processing your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle next step
  const handleNextStep = () => {
    // For step 1, validate the personal information fields
    if (currentStep === 1) {
      // Fields to validate depend on whether user is using an existing vehicle
      let personalInfoFields = ['fullName', 'email', 'phone', 'vehicleType'];
      
      if (form.getValues('useExistingVehicle')) {
        personalInfoFields.push('existingVehicleId');
      } else {
        personalInfoFields.push('vehicleRegistration');
      }
      
      const validateFields = async () => {
        const result = await form.trigger(personalInfoFields as any);
        if (result) setCurrentStep(2);
      };
      validateFields();
    }
    // For step 2, validate address and date fields before moving to payment
    else if (currentStep === 2) {
      const addressDateFields = ['address', 'city', 'state', 'pincode', 'preferredDate', 'nearbyRto'];
      const validateFields = async () => {
        const result = await form.trigger(addressDateFields as any);
        if (result) setCurrentStep(3);
      };
      validateFields();
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Reset the form and dialog state when closing
  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setCurrentStep(1);
      setBookingComplete(false);
      setBookingId('');
      onOpenChange(false);
    }
  };

  // Generate the tracking ID when booking is complete
  React.useEffect(() => {
    if (bookingComplete && !bookingId) {
      setBookingId('RTO' + Date.now().toString().slice(-5));
    }
  }, [bookingComplete, bookingId]);
  
  // Update nearby RTO offices based on pincode
  useEffect(() => {
    const pincode = form.watch('pincode');
    if (pincode && pincode.length === 6) {
      if (pincode in nearbyRtoOffices) {
        setAvailableRtoOffices(nearbyRtoOffices[pincode]);
      } else {
        // If pincode not found, use default
        setAvailableRtoOffices(nearbyRtoOffices['default']);
      }
    } else {
      setAvailableRtoOffices(nearbyRtoOffices['default']);
    }
  }, [form.watch('pincode')]);

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!bookingComplete ? (
          <>
            <DialogHeader>
              <DialogTitle>Book RTO Service</DialogTitle>
              <DialogDescription>
                Fill in the details to book {service.name}
              </DialogDescription>
            </DialogHeader>

            <div className="relative mb-8 mt-4">
              <div className="flex justify-between">
                <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-1">Personal Info</span>
                </div>

                <div className={`flex-1 border-t-2 self-start mt-5 ${currentStep >= 2 ? 'border-primary' : 'border-gray-300'}`} />

                <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-1">Address & Date</span>
                </div>

                <div className={`flex-1 border-t-2 self-start mt-5 ${currentStep >= 3 ? 'border-primary' : 'border-gray-300'}`} />

                <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-1">Payment</span>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 1 && (
                  <>
                    {/* Service Summary */}
                    <div className="bg-muted p-4 rounded-lg mb-6">
                      <h3 className="font-medium text-lg mb-2">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{formatCurrency(service.price)}</span>
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Processing: {service.averageTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Personal Information</h3>

                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="johndoe@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                                    +91
                                  </div>
                                  <Input 
                                    className="rounded-l-none" 
                                    placeholder="10-digit mobile number" 
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <h3 className="font-medium text-lg mt-6">Vehicle Information</h3>

                      <FormField
                        control={form.control}
                        name="vehicleType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select vehicle type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="2-wheeler">Two Wheeler</SelectItem>
                                <SelectItem value="4-wheeler">Four Wheeler</SelectItem>
                                <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {userVehicles && userVehicles.length > 0 && (
                        <FormField
                          control={form.control}
                          name="useExistingVehicle"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                      setShowExistingVehicles(e.target.checked);
                                      if (!e.target.checked) {
                                        form.setValue('existingVehicleId', undefined);
                                      }
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                </FormControl>
                                <FormLabel className="text-base font-medium">
                                  Use vehicle from my garage
                                </FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {showExistingVehicles && userVehicles && userVehicles.length > 0 ? (
                        <FormField
                          control={form.control}
                          name="existingVehicleId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select a Vehicle</FormLabel>
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  const selectedVehicle = userVehicles?.find((v: Vehicle) => v.id.toString() === value);
                                  if (selectedVehicle) {
                                    form.setValue('vehicleType', selectedVehicle.make.toLowerCase().includes('bike') ? '2-wheeler' : '4-wheeler');
                                  }
                                }} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a vehicle from your garage" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {userVehicles.map((vehicle: Vehicle) => (
                                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                      {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : !showExistingVehicles && (
                        <FormField
                          control={form.control}
                          name="vehicleRegistration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Registration Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., MH12AB1234" {...field} />
                              </FormControl>
                              <div className="text-sm text-muted-foreground">
                                Enter your vehicle registration number in the format like MH12AB1234
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Address Information</h3>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter your full address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PIN Code</FormLabel>
                              <FormControl>
                                <Input placeholder="6-digit PIN code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {indianStates.map((state) => (
                                  <SelectItem key={state} value={state.toLowerCase()}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <h3 className="font-medium text-lg mt-6">Preferred Date</h3>

                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
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
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => 
                                    date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                                    date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <div className="text-sm text-muted-foreground">
                              Choose a preferred date for your RTO service (up to 2 months in advance)
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {availableRtoOffices.length > 0 && (
                        <FormField
                          control={form.control}
                          name="nearbyRto"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Nearby RTO Office</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select RTO office" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableRtoOffices.map((office) => (
                                    <SelectItem key={office.id} value={office.id}>
                                      <div className="flex flex-col">
                                        <span>{office.name}</span>
                                        <span className="text-xs text-muted-foreground">{office.address}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="text-sm text-muted-foreground">
                                Choose your preferred RTO office based on your location
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any additional information or special requirements" 
                                className="resize-none h-20"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="space-y-6">
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Booking Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Service:</span>
                            <span className="font-medium">{service.name}</span>
                            
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-medium">{formatCurrency(service.price)}</span>
                            
                            <span className="text-muted-foreground">Name:</span>
                            <span>{form.getValues('fullName')}</span>
                            
                            <span className="text-muted-foreground">Email:</span>
                            <span>{form.getValues('email')}</span>
                            
                            <span className="text-muted-foreground">Phone:</span>
                            <span>{form.getValues('phone')}</span>
                            
                            <span className="text-muted-foreground">Vehicle:</span>
                            <span>
                              {form.getValues('useExistingVehicle') && userVehicles ? (
                                (() => {
                                  const selectedVehicle = userVehicles.find(
                                    (v: Vehicle) => v.id.toString() === form.getValues('existingVehicleId')
                                  );
                                  return selectedVehicle ? 
                                    `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.licensePlate})` : 
                                    form.getValues('vehicleRegistration');
                                })()
                              ) : form.getValues('vehicleRegistration')}
                            </span>
                            
                            <span className="text-muted-foreground">Location:</span>
                            <span>{form.getValues('city')}, {form.getValues('state')}</span>
                            
                            <span className="text-muted-foreground">RTO Office:</span>
                            <span>
                              {(() => {
                                const rtoId = form.getValues('nearbyRto');
                                if (rtoId) {
                                  const selectedOffice = availableRtoOffices.find(o => o.id === rtoId);
                                  return selectedOffice ? selectedOffice.name : 'Not selected';
                                }
                                return 'Not selected';
                              })()}
                            </span>
                            
                            <span className="text-muted-foreground">Preferred Date:</span>
                            <span>
                              {form.getValues('preferredDate') ? 
                                format(form.getValues('preferredDate'), 'PPP') : 
                                'Not selected'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <h3 className="font-medium text-lg">Payment Method</h3>
                      
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2 border rounded-md p-3">
                                  <RadioGroupItem value="online" id="online" />
                                  <Label htmlFor="online" className="flex-1">
                                    <div className="font-medium">Online Payment</div>
                                    <div className="text-sm text-muted-foreground">Pay now using Credit/Debit card, UPI, or Net Banking</div>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md p-3">
                                  <RadioGroupItem value="cash" id="cash" />
                                  <Label htmlFor="cash" className="flex-1">
                                    <div className="font-medium">Pay at RTO Office</div>
                                    <div className="text-sm text-muted-foreground">Pay in cash when visiting the RTO office</div>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center p-4 border border-amber-200 bg-amber-50 rounded-md text-amber-700 text-sm">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <div>
                          By proceeding with this booking, you agree to our terms of service and acknowledge that additional document verification may be required at the RTO office.
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <DialogFooter className="flex justify-between mt-6">
                  {currentStep > 1 ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handlePreviousStep}
                      disabled={isSubmitting}
                    >
                      Previous
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  )}

                  {currentStep < 3 ? (
                    <Button 
                      type="button" 
                      onClick={handleNextStep}
                      disabled={isSubmitting}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-32"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing
                        </span>
                      ) : (
                        'Book & Pay'
                      )}
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <div className="py-10">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Booking Successful!</h2>
              <p className="text-gray-500 mb-6">
                Your RTO service has been booked successfully.
              </p>

              <div className="bg-muted p-4 rounded-lg w-full max-w-sm mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Booking ID:</span>
                  <span className="font-medium">{bookingId}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Service:</span>
                  <span>{service.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Amount:</span>
                  <span>{formatCurrency(service.price)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{format(form.getValues('preferredDate') || new Date(), 'PPP')}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Vehicle:</span>
                  <span>
                    {form.getValues('useExistingVehicle') && userVehicles ? (
                      (() => {
                        const selectedVehicle = userVehicles.find(
                          (v: Vehicle) => v.id.toString() === form.getValues('existingVehicleId')
                        );
                        return selectedVehicle ? 
                          `${selectedVehicle.make} ${selectedVehicle.model}` : 
                          form.getValues('vehicleRegistration');
                      })()
                    ) : form.getValues('vehicleRegistration')}
                  </span>
                </div>
                {form.getValues('nearbyRto') && (
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">RTO Office:</span>
                    <span>
                      {(() => {
                        const rtoId = form.getValues('nearbyRto');
                        const selectedOffice = availableRtoOffices.find(o => o.id === rtoId);
                        return selectedOffice ? selectedOffice.name : 'Not specified';
                      })()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Payment:</span>
                  <span>{form.getValues('paymentMethod') === 'online' ? 'Online Payment' : 'Pay at RTO Office'}</span>
                </div>
              </div>

              <div className="space-y-2 w-full max-w-xs mb-6">
                <Button className="w-full" variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button className="w-full" onClick={() => {
                  handleClose();
                  // Navigate to track page
                  // In a real app, you would navigate to the tracking page with the booking ID
                }}>
                  Track Application
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to {form.getValues('email')}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingDialog;