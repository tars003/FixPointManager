import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Vehicle, ServiceProvider, insertServiceBookingSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Check } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import AvailabilitySelector from './availability-selector';
import { cn } from '@/lib/utils';

const bookingSchema = insertServiceBookingSchema.extend({
  serviceName: z.string().min(1, 'Select a service'),
  date: z.date(),
  time: z.string().min(1, 'Select a time slot'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingFlow = () => {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<number | undefined>(
    params.vehicleId ? parseInt(params.vehicleId) : undefined
  );
  const [selectedProvider, setSelectedProvider] = useState<number | undefined>(undefined);
  
  // Fetch vehicles
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles', { userId: 1 }],
  });
  
  // Fetch service providers
  const { data: providers, isLoading: isLoadingProviders } = useQuery<ServiceProvider[]>({
    queryKey: ['/api/service-providers'],
  });
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      userId: 1,
      vehicleId: selectedVehicle,
      providerId: undefined,
      serviceType: '',
      serviceName: '',
      scheduledDate: undefined,
      notes: '',
      status: 'pending',
      date: undefined,
      time: '',
    },
  });
  
  // Update form when selectedVehicle or selectedProvider changes
  useEffect(() => {
    if (selectedVehicle) {
      form.setValue('vehicleId', selectedVehicle);
    }
    if (selectedProvider) {
      form.setValue('providerId', selectedProvider);
    }
  }, [selectedVehicle, selectedProvider, form]);
  
  const onSubmit = async (data: BookingFormData) => {
    try {
      // Combine date and time for scheduledDate
      const [hours, minutes] = data.time.split(':').map(Number);
      const scheduledDate = new Date(data.date);
      scheduledDate.setHours(hours, minutes);
      
      const bookingData = {
        userId: data.userId,
        vehicleId: data.vehicleId,
        providerId: data.providerId,
        serviceType: data.serviceName,
        scheduledDate,
        notes: data.notes,
        status: data.status,
      };
      
      await apiRequest('POST', '/api/bookings', bookingData);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      
      toast({
        title: 'Booking confirmed',
        description: 'Your service booking has been successfully created.',
      });
      
      // Navigate to vehicle list
      navigate('/vehicles');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1 && !selectedVehicle) {
      toast({
        title: 'Select a vehicle',
        description: 'Please select a vehicle to continue.',
        variant: 'destructive',
      });
      return;
    }
    
    if (step === 2 && !selectedProvider) {
      toast({
        title: 'Select a service provider',
        description: 'Please select a service provider to continue.',
        variant: 'destructive',
      });
      return;
    }
    
    if (step === 3) {
      const serviceType = form.getValues('serviceName');
      if (!serviceType) {
        toast({
          title: 'Select a service',
          description: 'Please select a service type to continue.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    if (step === 4) {
      const date = form.getValues('date');
      const time = form.getValues('time');
      if (!date || !time) {
        toast({
          title: 'Select date and time',
          description: 'Please select both date and time to continue.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    setStep(step + 1);
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/vehicles');
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Select your vehicle</h2>
            
            {isLoadingVehicles ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse h-20 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <RadioGroup 
                value={selectedVehicle?.toString() || ''}
                onValueChange={(value) => setSelectedVehicle(parseInt(value))}
                className="space-y-3"
              >
                {vehicles?.map((vehicle) => (
                  <div key={vehicle.id} className={`border rounded-lg p-4 transition-colors ${
                    selectedVehicle === vehicle.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}>
                    <RadioGroupItem value={vehicle.id.toString()} id={`vehicle-${vehicle.id}`} className="sr-only" />
                    <Label htmlFor={`vehicle-${vehicle.id}`} className="flex items-center cursor-pointer">
                      <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center mr-3">
                        {selectedVehicle === vehicle.id && <Check className="h-3 w-3 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{vehicle.name}</p>
                        <p className="text-sm text-neutral-light">{vehicle.licensePlate}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {vehicles?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-light">You don't have any vehicles yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/vehicles')}
                >
                  Add a Vehicle
                </Button>
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Select service provider</h2>
            
            {isLoadingProviders ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <RadioGroup 
                value={selectedProvider?.toString() || ''}
                onValueChange={(value) => setSelectedProvider(parseInt(value))}
                className="space-y-3"
              >
                {providers?.map((provider) => (
                  <div key={provider.id} className={`border rounded-lg p-4 transition-colors ${
                    selectedProvider === provider.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}>
                    <RadioGroupItem value={provider.id.toString()} id={`provider-${provider.id}`} className="sr-only" />
                    <Label htmlFor={`provider-${provider.id}`} className="flex items-start cursor-pointer">
                      <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center mr-3 mt-1">
                        {selectedProvider === provider.id && <Check className="h-3 w-3 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-neutral-light">{provider.address}, {provider.city}</p>
                        
                        <div className="mt-2 flex flex-wrap gap-1">
                          {provider.services.slice(0, 3).map((service, i) => (
                            <span key={i} className="text-xs bg-neutral-lightest px-2 py-1 rounded-full">
                              {service}
                            </span>
                          ))}
                          {provider.services.length > 3 && (
                            <span className="text-xs bg-neutral-lightest px-2 py-1 rounded-full">
                              +{provider.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{provider.rating}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        );
        
      case 3:
        const selectedProviderData = providers?.find(p => p.id === selectedProvider);
        
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Select service</h2>
            
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="serviceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedProviderData?.services.map((service, i) => (
                              <SelectItem key={i} value={service}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any specific instructions or issues to mention"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Select date & time</h2>
            
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < new Date() || 
                              date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                            }
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
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="12:00">12:00 PM</SelectItem>
                            <SelectItem value="13:00">1:00 PM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                            <SelectItem value="16:00">4:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        );
        
      case 5:
        const vehicle = vehicles?.find(v => v.id === selectedVehicle);
        const provider = providers?.find(p => p.id === selectedProvider);
        const serviceType = form.getValues('serviceName');
        const date = form.getValues('date');
        const time = form.getValues('time');
        const formattedDate = date ? format(date, 'PPP') : '';
        const formattedTime = time ? format(new Date(`2000-01-01T${time}`), 'h:mm a') : '';
        
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Confirm booking</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-neutral-light">Vehicle</p>
                <p className="font-medium">{vehicle?.name} ({vehicle?.licensePlate})</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-neutral-light">Service Provider</p>
                <p className="font-medium">{provider?.name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-neutral-light">Service Type</p>
                <p className="font-medium">{serviceType}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-neutral-light">Scheduled Date & Time</p>
                <p className="font-medium">{formattedDate} at {formattedTime}</p>
              </div>
              
              {form.getValues('notes') && (
                <div className="space-y-1">
                  <p className="text-sm text-neutral-light">Additional Notes</p>
                  <p>{form.getValues('notes')}</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };
  
  const renderButtons = () => {
    if (step === 5) {
      return (
        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            Confirm Booking
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>
          Continue
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button onClick={prevStep} className="text-neutral hover:text-primary transition flex items-center">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <p className="text-neutral-light text-sm">Step {step} of 5</p>
          <div className="w-5"></div> {/* Spacer for alignment */}
        </div>
        
        <div className="flex w-full gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s}
              className={`step-indicator flex-1 h-1 ${
                s <= step 
                  ? 'bg-primary' 
                  : 'bg-gray-200'
              } ${
                s === 1 ? 'rounded-l-full' : ''
              } ${
                s === 5 ? 'rounded-r-full' : ''
              }`}
            />
          ))}
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
          {renderButtons()}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingFlow;
