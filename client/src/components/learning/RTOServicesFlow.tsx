import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
  X,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  MapPin,
  CreditCard,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// RTO service types
const rtoServices = [
  { 
    id: 'learner', 
    title: 'Learner\'s License',
    description: 'First step to getting a driving license, valid for 6 months',
    price: 799,
    processingTime: '3-5 days',
    requirements: [
      'Age proof (Aadhar/PAN/Passport)',
      'Address proof',
      'Passport size photographs',
      'Form 1 filled and signed',
      'Medical certificate (Form 1A)',
    ],
    steps: [
      'Document verification',
      'Application submission',
      'Fee payment',
      'Written test appointment',
      'Written test',
      'License issuance',
    ]
  },
  { 
    id: 'permanent', 
    title: 'Permanent Driving License',
    description: 'Full license after completing learner\'s license period',
    price: 1299,
    processingTime: '7-10 days',
    requirements: [
      'Learner\'s license (completed 30 days period)',
      'Age proof (Aadhar/PAN/Passport)',
      'Address proof',
      'Passport size photographs',
      'Form 2 filled and signed',
    ],
    steps: [
      'Document verification',
      'Application submission',
      'Fee payment',
      'Driving test appointment',
      'Driving test',
      'License issuance',
    ]
  },
  { 
    id: 'renewal', 
    title: 'License Renewal',
    description: 'Renew your expired or about-to-expire driving license',
    price: 999,
    processingTime: '5-7 days',
    requirements: [
      'Existing driving license',
      'Age proof (Aadhar/PAN/Passport)',
      'Address proof',
      'Passport size photographs',
      'Form 9 filled and signed',
      'Medical certificate (for 55+ age)',
    ],
    steps: [
      'Document verification',
      'Application submission',
      'Fee payment',
      'Biometric capture',
      'License issuance',
    ]
  },
  { 
    id: 'international', 
    title: 'International Driving Permit',
    description: 'For driving abroad, valid in countries that recognize IDP',
    price: 1999,
    processingTime: '7-10 days',
    requirements: [
      'Valid Indian driving license',
      'Passport with valid visa',
      'Passport size photographs',
      'Form 4-A filled and signed',
      'Travel itinerary proof',
    ],
    steps: [
      'Document verification',
      'Application submission',
      'Fee payment',
      'Permit issuance',
    ]
  },
  { 
    id: 'duplicate', 
    title: 'Duplicate License',
    description: 'Replacement for lost, stolen, or damaged driving license',
    price: 699,
    processingTime: '3-5 days',
    requirements: [
      'FIR copy (for lost license)',
      'Age proof (Aadhar/PAN/Passport)',
      'Address proof',
      'Passport size photographs',
      'Form 1 filled and signed',
      'Damaged license (if applicable)',
    ],
    steps: [
      'Document verification',
      'Application submission',
      'Fee payment',
      'License issuance',
    ]
  },
  { 
    id: 'address', 
    title: 'Address Change',
    description: 'Update your address on existing driving license',
    price: 599,
    processingTime: '3-5 days',
    requirements: [
      'Existing driving license',
      'New address proof',
      'Passport size photographs',
      'Form 2 filled and signed',
    ],
    steps: [
      'Document verification',
      'Application submission',
      'Fee payment',
      'License issuance',
    ]
  },
];

// Application form schema
const applicationSchema = z.object({
  name: z.string().min(3, { message: 'Please enter your full name' }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit mobile number' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  location: z.string().min(1, { message: 'Please select your RTO location' }),
  preferredDate: z.string().min(1, { message: 'Please choose your preferred date' }),
  additionalInfo: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface RTOServicesFlowProps {
  onClose: () => void;
}

const RTOServicesFlow: React.FC<RTOServicesFlowProps> = ({ onClose }) => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  // Application form
  const applicationForm = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      location: '',
      preferredDate: '',
      additionalInfo: '',
    },
  });

  // Handle application form submission
  const onApplicationSubmit = (values: ApplicationFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Generate a random reference number
      const refNum = 'RTO' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      setBookingReference(refNum);
      setIsApplicationSubmitted(true);
      
      toast({
        title: 'Application submitted successfully',
        description: `Your booking reference is ${refNum}`,
      });
    }, 2000);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              {selectedService && !isApplicationSubmitted && (
                <Button variant="ghost" size="icon" onClick={() => setSelectedService(null)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-bold">
                {!selectedService ? 'RTO Services' : selectedService.title}
                {isApplicationSubmitted && ' - Application Submitted'}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Service Listing */}
          {!selectedService && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <p className="text-sm text-gray-500 mb-6">
                Select the RTO service you need assistance with. We provide end-to-end support for all your driving license and vehicle registration needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rtoServices.map((service) => (
                  <Card
                    key={service.id}
                    className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                    onClick={() => setSelectedService(service)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold">{service.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>{service.processingTime}</span>
                            </div>
                            <div className="font-bold text-primary">₹{service.price}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-700">Need a Custom Service?</h3>
                    <p className="text-sm text-blue-600 mt-1">
                      If you don't see the RTO service you need, contact our customer support at <span className="font-medium">1800-123-4567</span> for personalized assistance.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Service Detail and Application */}
          {selectedService && !isApplicationSubmitted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedService.title}</h3>
                    <p className="text-gray-600">{selectedService.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">₹{selectedService.price}</div>
                    <div className="text-sm text-gray-500">inclusive of all charges</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Required Documents</h4>
                    <ul className="space-y-2">
                      {selectedService.requirements.map((requirement: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Process Steps</h4>
                    <ol className="space-y-3">
                      {selectedService.steps.map((step: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Apply for {selectedService.title}</h3>
                
                <Form {...applicationForm}>
                  <form onSubmit={applicationForm.handleSubmit(onApplicationSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={applicationForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={applicationForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="10-digit mobile number" 
                                value={field.value}
                                onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={applicationForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={applicationForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>RTO Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select RTO location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="andheri">Andheri RTO, Mumbai</SelectItem>
                                <SelectItem value="wadala">Wadala RTO, Mumbai</SelectItem>
                                <SelectItem value="tardeo">Tardeo RTO, Mumbai</SelectItem>
                                <SelectItem value="thane">Thane RTO</SelectItem>
                                <SelectItem value="vashi">Vashi RTO, Navi Mumbai</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={applicationForm.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Date</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select date" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                                <SelectItem value="2days">In 2 days</SelectItem>
                                <SelectItem value="3days">In 3 days</SelectItem>
                                <SelectItem value="week">Next week</SelectItem>
                                <SelectItem value="flexible">Flexible (to be discussed)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={applicationForm.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any specific requirements or questions?" 
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : `Apply for ${selectedService.title}`}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          )}
          
          {/* Application Success */}
          {isApplicationSubmitted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">Application Submitted Successfully!</h3>
              
              <p className="text-gray-600 mb-6">
                Your application for {selectedService.title} has been received. Our team will verify your details and contact you shortly.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg w-full mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Booking Reference:</span>
                  <span className="font-bold">{bookingReference}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Service Type:</span>
                  <span className="font-medium">{selectedService.title}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium">₹{selectedService.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Processing Time:</span>
                  <span className="font-medium">{selectedService.processingTime}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg w-full mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-medium text-blue-700">Next Steps</h4>
                    <ol className="text-sm text-blue-600 mt-1 space-y-1 list-decimal pl-4">
                      <li>Our representative will call you within 24 hours to confirm your appointment.</li>
                      <li>Keep your documents ready as per the requirements list.</li>
                      <li>Visit the selected RTO on your confirmed appointment date.</li>
                      <li>Our agent will meet you at the RTO to assist with the process.</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 w-full">
                <Button variant="outline" className="w-full" onClick={onClose}>
                  Back to Services
                </Button>
                <Button className="w-full">
                  Track Application Status
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RTOServicesFlow;