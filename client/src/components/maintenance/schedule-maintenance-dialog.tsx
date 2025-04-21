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
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CalendarIcon, 
  Car, 
  WrenchIcon,
  Clock,
  PencilRuler,
  MapPin,
  ShieldCheck, 
  DollarSign,
  Truck,
  UserCheck,
  Bell,
  Printer,
  Mail
} from 'lucide-react';

type ScheduleMaintenanceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
};

// Define validation schema for maintenance scheduling
const maintenanceSchedulingSchema = z.object({
  // Vehicle selection section
  vehicleInfo: z.object({
    vehicleId: z.string({ required_error: "Please select a vehicle" }),
    odometerReading: z.string()
      .min(1, { message: "Odometer reading is required" })
      .regex(/^\d+$/, { message: "Odometer reading must be a number" }),
  }),
  
  // Service details section
  serviceDetails: z.object({
    serviceType: z.enum(["regular", "repair", "emergency", "preventive"], { 
      required_error: "Service type is required" 
    }),
    serviceCategory: z.string({ required_error: "Service category is required" }),
    description: z.string()
      .min(10, { message: "Description should be at least 10 characters" })
      .max(500, { message: "Description should not exceed 500 characters" }),
    severityLevel: z.enum(["low", "medium", "high", "critical"], { 
      required_error: "Severity level is required" 
    }),
    expectedDuration: z.string().regex(/^\d+$/, { message: "Expected duration must be a number" }),
  }),
  
  // Service provider section
  serviceProvider: z.object({
    providerId: z.string({ required_error: "Service provider is required" }),
    serviceLocation: z.string({ required_error: "Service location is required" }),
    contactPerson: z.string().min(1, { message: "Contact person is required" }),
    contactNumber: z.string()
      .min(10, { message: "Contact number must be at least 10 characters" })
      .max(15, { message: "Contact number must not exceed 15 characters" }),
    servicePackage: z.string().optional(),
    estimatedCost: z.string()
      .regex(/^\d+(\.\d{1,2})?$/, { message: "Estimated cost must be a valid amount" }),
  }),
  
  // Scheduling section
  scheduling: z.object({
    scheduledDate: z.date({ required_error: "Scheduled date is required" }),
    timeSlot: z.string({ required_error: "Time slot is required" }),
    pickupService: z.boolean().default(false),
    driverAssignment: z.string().optional(),
    notifications: z.boolean().default(true),
  }),
});

// Extract type from schema
type MaintenanceFormValues = z.infer<typeof maintenanceSchedulingSchema>;

// Mock data for dropdowns
const vehicles = [
  { id: "1", name: "Toyota Innova Crysta (TN01-3456)", lastService: "2023-10-15", status: "Available" },
  { id: "2", name: "Mahindra Bolero (DL01-8794)", lastService: "2023-11-20", status: "On Rent" },
  { id: "3", name: "Tata Ace (MH02-4532)", lastService: "2023-12-05", status: "In Maintenance" },
  { id: "4", name: "Ashok Leyland Dost (KA01-9834)", lastService: "2023-09-25", status: "On Rent" },
  { id: "5", name: "Bajaj RE Auto (GJ05-2143)", lastService: "2023-12-10", status: "Available" },
];

const serviceCategories = [
  { value: "engine", label: "Engine" },
  { value: "transmission", label: "Transmission" },
  { value: "electrical", label: "Electrical" },
  { value: "brakes", label: "Brakes" },
  { value: "suspension", label: "Suspension" },
  { value: "ac", label: "Air Conditioning" },
  { value: "body", label: "Body Work" },
  { value: "tires", label: "Tires & Wheels" },
  { value: "fuel", label: "Fuel System" },
  { value: "cooling", label: "Cooling System" },
  { value: "exhaust", label: "Exhaust System" },
  { value: "other", label: "Other" },
];

const serviceProviders = [
  { id: "1", name: "FixPoint Authorized Service", locations: ["Chennai Central", "Chennai West"] },
  { id: "2", name: "QuickFix Auto Care", locations: ["Delhi Main", "Delhi Airport"] },
  { id: "3", name: "Reliable Motors", locations: ["Mumbai Service Center", "Mumbai Andheri"] },
  { id: "4", name: "SpeedTech Service", locations: ["Bangalore City", "Bangalore Electronic City"] },
  { id: "5", name: "TrustMech Auto", locations: ["Ahmedabad Depot", "Ahmedabad Highway"] },
];

const timeSlots = [
  { value: "0900", label: "09:00 AM" },
  { value: "1000", label: "10:00 AM" },
  { value: "1100", label: "11:00 AM" },
  { value: "1200", label: "12:00 PM" },
  { value: "1300", label: "01:00 PM" },
  { value: "1400", label: "02:00 PM" },
  { value: "1500", label: "03:00 PM" },
  { value: "1600", label: "04:00 PM" },
  { value: "1700", label: "05:00 PM" },
];

const drivers = [
  { id: "1", name: "Rajesh Kumar" },
  { id: "2", name: "Suresh Singh" },
  { id: "3", name: "Venkatesh Rao" },
  { id: "4", name: "Mukesh Patel" },
];

export function ScheduleMaintenanceDialog({ open, onOpenChange, theme }: ScheduleMaintenanceDialogProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  
  // Get vehicle info by ID
  const getVehicleById = (id: string) => {
    return vehicles.find(v => v.id === id);
  };
  
  // Get provider info by ID
  const getProviderById = (id: string) => {
    return serviceProviders.find(p => p.id === id);
  };
  
  // Form initialization
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchedulingSchema),
    defaultValues: {
      vehicleInfo: {
        vehicleId: '',
        odometerReading: '',
      },
      serviceDetails: {
        serviceType: "regular",
        serviceCategory: '',
        description: '',
        severityLevel: "medium",
        expectedDuration: '2',
      },
      serviceProvider: {
        providerId: '',
        serviceLocation: '',
        contactPerson: '',
        contactNumber: '',
        servicePackage: '',
        estimatedCost: '',
      },
      scheduling: {
        scheduledDate: undefined,
        timeSlot: '',
        pickupService: false,
        driverAssignment: '',
        notifications: true,
      },
    }
  });
  
  // Handle vehicle selection
  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    form.setValue('vehicleInfo.vehicleId', vehicleId);
  };
  
  // Handle provider selection
  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    form.setValue('serviceProvider.providerId', providerId);
    
    // Reset location when provider changes
    form.setValue('serviceProvider.serviceLocation', '');
  };
  
  // Form submission handler
  const onSubmit = (data: MaintenanceFormValues) => {
    console.log("Maintenance scheduled with data:", data);
    
    // Show print options after successful submission
    setShowPrintOptions(true);
  };
  
  // Print service request
  const printServiceRequest = () => {
    console.log("Printing service request...");
    // In a real app, this would generate a printable document
    alert("Service request printed successfully!");
    onOpenChange(false);
  };
  
  // Send to provider
  const sendToProvider = () => {
    console.log("Sending service request to provider...");
    // In a real app, this would send the request to the provider
    alert("Service request sent to provider successfully!");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-screen overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>Schedule Maintenance</DialogTitle>
          <DialogDescription>
            Complete this form to schedule maintenance for a fleet vehicle.
          </DialogDescription>
        </DialogHeader>
        
        {!showPrintOptions ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Vehicle selection section */}
              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                  Vehicle Information
                </h3>
                
                <FormField
                  control={form.control}
                  name="vehicleInfo.vehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Vehicle</FormLabel>
                      <Select 
                        onValueChange={(value) => handleVehicleSelect(value)} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                            <SelectValue placeholder="Select a vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                          {vehicles.map(vehicle => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the vehicle that requires maintenance.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedVehicle && (
                  <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Last Service Date:
                        </p>
                        <p className="font-medium">
                          {getVehicleById(selectedVehicle)?.lastService}
                        </p>
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Current Status:
                        </p>
                        <p className="font-medium">
                          {getVehicleById(selectedVehicle)?.status}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="vehicleInfo.odometerReading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Odometer Reading (km)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 45000" 
                          {...field} 
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the current odometer reading of the vehicle.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Service details section */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                  Service Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceDetails.serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            <SelectItem value="regular">Regular Service</SelectItem>
                            <SelectItem value="repair">Repair</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="preventive">Preventive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="serviceDetails.serviceCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            {serviceCategories.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="serviceDetails.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the issue or service needed in detail..." 
                          {...field} 
                          className={`min-h-[100px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide detailed information to help the service provider.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceDetails.severityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                              <SelectValue placeholder="Select severity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="serviceDetails.expectedDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Duration (hours)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
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
              
              {/* Service provider section */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                  Service Provider
                </h3>
                
                <FormField
                  control={form.control}
                  name="serviceProvider.providerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Provider</FormLabel>
                      <Select 
                        onValueChange={(value) => handleProviderSelect(value)} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                            <SelectValue placeholder="Select a service provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                          {serviceProviders.map(provider => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedProvider && (
                  <FormField
                    control={form.control}
                    name="serviceProvider.serviceLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Location</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            {getProviderById(selectedProvider)?.locations.map(location => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceProvider.contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Rahul Sharma" 
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
                    name="serviceProvider.contactNumber"
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceProvider.servicePackage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Package (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Premium Service Package" 
                            {...field} 
                            className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                          />
                        </FormControl>
                        <FormDescription>
                          If applicable, enter the service package name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="serviceProvider.estimatedCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Cost (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 5000" 
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
              
              {/* Scheduling section */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                  Scheduling
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduling.scheduledDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Scheduled Date</FormLabel>
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
                                  <span>Select date</span>
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
                                // Can't schedule for today or past days
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
                    control={form.control}
                    name="scheduling.timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Slot</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                              <SelectValue placeholder="Select time slot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            {timeSlots.map(slot => (
                              <SelectItem key={slot.value} value={slot.value}>
                                {slot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="scheduling.pickupService"
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
                          Pickup/Drop Service
                        </FormLabel>
                        <FormDescription>
                          Request pickup and drop service for the vehicle
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {form.watch("scheduling.pickupService") && (
                  <FormField
                    control={form.control}
                    name="scheduling.driverAssignment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign Driver for Transport</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                              <SelectValue placeholder="Select driver" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            {drivers.map(driver => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Assign a driver to transport the vehicle to the service center.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="scheduling.notifications"
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
                          Receive Status Updates
                        </FormLabel>
                        <FormDescription>
                          Get notifications about maintenance status changes
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
                  onClick={() => onOpenChange(false)}
                  className={theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                >
                  Schedule Maintenance
                  <WrenchIcon className="h-4 w-4 ml-2" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div className={`p-6 rounded-lg border ${theme === 'light' ? 'bg-green-50 border-green-100' : 'bg-green-900/20 border-green-900/30'}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-green-100' : 'bg-green-900/30'}`}>
                  <ShieldCheck className={`h-6 w-6 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                </div>
                <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-green-800' : 'text-green-400'}`}>
                  Maintenance Scheduled Successfully
                </h3>
              </div>
              <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                The maintenance has been scheduled and the vehicle status has been updated. 
                Notifications have been sent to the assigned personnel.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                What would you like to do next?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={printServiceRequest}
                  className={`h-auto py-4 ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <Printer className="h-6 w-6 mb-2" />
                    <span>Print Service Request</span>
                    <span className={`text-xs ${theme === 'light' ? 'text-blue-200' : 'text-gray-400'}`}>Create a printable document</span>
                  </div>
                </Button>
                
                <Button
                  onClick={sendToProvider}
                  className={`h-auto py-4 ${theme === 'light' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <Mail className="h-6 w-6 mb-2" />
                    <span>Send to Service Provider</span>
                    <span className={`text-xs ${theme === 'light' ? 'text-green-200' : 'text-gray-400'}`}>Email request to the provider</span>
                  </div>
                </Button>
              </div>
              
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className={`w-full mt-4 ${theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}`}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}