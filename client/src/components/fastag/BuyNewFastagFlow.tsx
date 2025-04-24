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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreditCard,
  Upload,
  ChevronRight,
  MapPin,
  CheckCircle,
  ArrowLeft,
  X,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Application form schema
const applicationSchema = z.object({
  ownerName: z.string().min(3, { message: 'Name is required' }),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, { message: 'Enter a valid Indian mobile number' }),
  vehicleNumber: z.string().regex(/^[A-Z]{2}\s?[0-9]{2}\s?[A-Z]{2}\s?[0-9]{4}$/, { message: 'Enter a valid vehicle number' }),
  vehicleClass: z.string().min(1, { message: 'Vehicle class is required' }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

// Bank selection schema
const bankSchema = z.object({
  bank: z.string().min(1, { message: 'Please select a bank' }),
});

type BankFormValues = z.infer<typeof bankSchema>;

// Delivery schema
const deliverySchema = z.object({
  deliveryMethod: z.enum(['home', 'pickup']),
  address: z.string().optional(),
  paymentMethod: z.enum(['upi', 'card', 'netbanking', 'wallet']),
});

type DeliveryFormValues = z.infer<typeof deliverySchema>;

// Available vehicle classes
const vehicleClasses = [
  { value: 'car', label: 'Car/Jeep/Van' },
  { value: 'lcv', label: 'Light Commercial Vehicle' },
  { value: 'bus', label: 'Bus/Truck' },
  { value: 'heavy', label: 'Heavy Vehicle' },
  { value: 'multi', label: 'Multi-Axle Vehicle' },
];

// Bank options
const bankOptions = [
  { 
    id: 'hdfc', 
    name: 'HDFC Bank', 
    logo: 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/577a5886-2597-4b7d-a9d0-2592c6108fa5/common/logo/img/logo.png',
    deposit: 200,
    fee: 100,
    special: 'No issuance fee for HDFC account holders'
  },
  { 
    id: 'sbi', 
    name: 'State Bank of India', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/2048px-SBI-logo.svg.png',
    deposit: 200,
    fee: 100,
    special: 'Additional 5% cashback on first recharge'
  },
  { 
    id: 'icici', 
    name: 'ICICI Bank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/ICICI_Bank_Logo.svg/2560px-ICICI_Bank_Logo.svg.png',
    deposit: 200,
    fee: 150,
    special: 'Free roadside assistance for 1 year'
  },
  { 
    id: 'axis', 
    name: 'Axis Bank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Axis_Bank_logo.svg/2560px-Axis_Bank_logo.svg.png',
    deposit: 200,
    fee: 100,
    special: 'Free tag replacement policy'
  },
  { 
    id: 'paytm', 
    name: 'Paytm Payments Bank', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%282018%29.svg/2560px-Paytm_Logo_%282018%29.svg.png',
    deposit: 200,
    fee: 75,
    special: 'Paytm cashback offers on recharges'
  }
];

// Payment methods
const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: CreditCard },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'netbanking', name: 'Net Banking', icon: CreditCard },
  { id: 'wallet', name: 'Wallet', icon: CreditCard },
];

interface BuyNewFastagFlowProps {
  onClose: () => void;
}

const BuyNewFastagFlow: React.FC<BuyNewFastagFlowProps> = ({ onClose }) => {
  const [step, setStep] = useState<'application' | 'bank' | 'delivery' | 'success'>('application');
  const [formData, setFormData] = useState<{
    application?: ApplicationFormValues;
    bank?: BankFormValues;
    delivery?: DeliveryFormValues;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  // Application form
  const applicationForm = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      ownerName: '',
      mobileNumber: '',
      vehicleNumber: '',
      vehicleClass: '',
    },
  });

  // Bank selection form
  const bankForm = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bank: '',
    },
  });

  // Delivery form
  const deliveryForm = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      deliveryMethod: 'home',
      address: '',
      paymentMethod: 'upi',
    },
  });

  // Handle application form submission
  const onApplicationSubmit = (values: ApplicationFormValues) => {
    setFormData({ ...formData, application: values });
    setStep('bank');
  };

  // Handle bank selection form submission
  const onBankSubmit = (values: BankFormValues) => {
    setFormData({ ...formData, bank: values });
    setStep('delivery');
  };

  // Handle delivery form submission
  const onDeliverySubmit = (values: DeliveryFormValues) => {
    setIsSubmitting(true);
    setFormData({ ...formData, delivery: values });
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Generate a random reference number
      const refNum = 'FT' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      setReferenceNumber(refNum);
      setStep('success');
      
      toast({
        title: 'FASTag application successful!',
        description: `Your reference number is ${refNum}`,
      });
    }, 2000);
  };

  // Format mobile number as user types
  const formatMobileNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  // Format vehicle number as user types
  const formatVehicleNumber = (input: string) => {
    // Remove any existing spaces
    let value = input.replace(/\s/g, '').toUpperCase();
    
    // Apply formatting: XX 00 XX 0000
    if (value.length <= 2) {
      return value;
    } else if (value.length <= 4) {
      return value.slice(0, 2) + ' ' + value.slice(2);
    } else if (value.length <= 6) {
      return value.slice(0, 2) + ' ' + value.slice(2, 4) + ' ' + value.slice(4);
    } else {
      return value.slice(0, 2) + ' ' + value.slice(2, 4) + ' ' + value.slice(4, 6) + ' ' + value.slice(6, Math.min(value.length, 10));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              {step !== 'application' && (
                <Button variant="ghost" size="icon" onClick={() => setStep(
                  step === 'bank' ? 'application' : 
                  step === 'delivery' ? 'bank' : 
                  step === 'success' ? 'delivery' : 'application'
                )}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-bold">
                {step === 'application' && 'Buy New FASTag'}
                {step === 'bank' && 'Select Issuing Bank'}
                {step === 'delivery' && 'Delivery & Payment'}
                {step === 'success' && 'Application Successful'}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-4">
              {['application', 'bank', 'delivery', 'success'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s === step || 
                    (step === 'bank' && s === 'application') ||
                    (step === 'delivery' && (s === 'application' || s === 'bank')) ||
                    (step === 'success') ? 
                    'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {(s === 'application' && step === 'bank') || 
                     (s === 'application' && step === 'delivery') || 
                     (s === 'application' && step === 'success') || 
                     (s === 'bank' && step === 'delivery') || 
                     (s === 'bank' && step === 'success') ||
                     (s === 'delivery' && step === 'success') ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 3 && (
                    <div className={`w-full h-1 ${
                      (i === 0 && (step === 'bank' || step === 'delivery' || step === 'success')) ||
                      (i === 1 && (step === 'delivery' || step === 'success')) ||
                      (i === 2 && step === 'success') ? 
                      'bg-primary' : 'bg-gray-200'
                    }`} style={{ width: '50px' }}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs mb-6">
              <span className={step === 'application' ? 'text-primary font-medium' : ''}>Application</span>
              <span className={step === 'bank' ? 'text-primary font-medium' : ''}>Bank</span>
              <span className={step === 'delivery' ? 'text-primary font-medium' : ''}>Delivery</span>
              <span className={step === 'success' ? 'text-primary font-medium' : ''}>Complete</span>
            </div>
          </div>

          {/* Application Form */}
          {step === 'application' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <Form {...applicationForm}>
                <form onSubmit={applicationForm.handleSubmit(onApplicationSubmit)} className="space-y-6">
                  <FormField
                    control={applicationForm.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Owner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={applicationForm.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="10-digit mobile number" 
                            value={field.value}
                            onChange={(e) => field.onChange(formatMobileNumber(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={applicationForm.control}
                    name="vehicleNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Registration Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="E.g., MH 01 AB 1234" 
                            value={field.value}
                            onChange={(e) => field.onChange(formatVehicleNumber(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={applicationForm.control}
                    name="vehicleClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Class</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicleClasses.map((vehicleClass) => (
                              <SelectItem key={vehicleClass.value} value={vehicleClass.value}>
                                {vehicleClass.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Document Upload</p>
                    <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-center">
                        Upload RC, ID proof, and address proof <br />
                        <span className="text-xs text-gray-500">
                          Supported formats: JPG, PNG, PDF (Max 5MB each)
                        </span>
                      </p>
                      <Button type="button" variant="outline" size="sm">
                        Select Files
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Continue to Bank Selection
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
          
          {/* Bank Selection */}
          {step === 'bank' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <Form {...bankForm}>
                <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Choose your preferred bank to issue your FASTag. Different banks may offer varying benefits and fees.
                  </p>
                  
                  <FormField
                    control={bankForm.control}
                    name="bank"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        {bankOptions.map((bank) => (
                          <div 
                            key={bank.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              field.value === bank.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-400'
                            }`}
                            onClick={() => field.onChange(bank.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 flex-shrink-0 bg-white rounded-md p-1 flex items-center justify-center">
                                <img 
                                  src={bank.logo} 
                                  alt={bank.name} 
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{bank.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    Security Deposit: ₹{bank.deposit}
                                  </span>
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    Issuance Fee: ₹{bank.fee}
                                  </span>
                                </div>
                                {bank.special && (
                                  <p className="text-xs text-green-600 mt-1">{bank.special}</p>
                                )}
                              </div>
                              <div className={`w-5 h-5 rounded-full border flex-shrink-0 ${
                                field.value === bank.id ? 
                                'border-primary bg-primary' : 'border-gray-300'
                              }`}>
                                {field.value === bank.id && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    Continue to Delivery & Payment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
          
          {/* Delivery & Payment */}
          {step === 'delivery' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <Form {...deliveryForm}>
                <form onSubmit={deliveryForm.handleSubmit(onDeliverySubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Delivery Method</h3>
                    
                    <FormField
                      control={deliveryForm.control}
                      name="deliveryMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <div className="flex gap-3">
                            <div 
                              className={`flex-1 border rounded-lg p-4 cursor-pointer transition-all ${
                                field.value === 'home' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-400'
                              }`}
                              onClick={() => field.onChange('home')}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full border flex-shrink-0 ${
                                  field.value === 'home' ? 
                                  'border-primary bg-primary' : 'border-gray-300'
                                }`}>
                                  {field.value === 'home' && (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <div className="w-2 h-2 rounded-full bg-white"></div>
                                    </div>
                                  )}
                                </div>
                                <span className="font-medium">Home Delivery</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Get your FASTag delivered to your doorstep within 3-5 business days.
                              </p>
                            </div>
                            
                            <div 
                              className={`flex-1 border rounded-lg p-4 cursor-pointer transition-all ${
                                field.value === 'pickup' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-400'
                              }`}
                              onClick={() => field.onChange('pickup')}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full border flex-shrink-0 ${
                                  field.value === 'pickup' ? 
                                  'border-primary bg-primary' : 'border-gray-300'
                                }`}>
                                  {field.value === 'pickup' && (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <div className="w-2 h-2 rounded-full bg-white"></div>
                                    </div>
                                  )}
                                </div>
                                <span className="font-medium">Pickup Point</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Collect from a nearby authorized point for faster processing.
                              </p>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {deliveryForm.watch('deliveryMethod') === 'home' && (
                      <FormField
                        control={deliveryForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {deliveryForm.watch('deliveryMethod') === 'pickup' && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <h4 className="font-medium">Select Pickup Location</h4>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          Choose from available pickup points near you:
                        </p>
                        <div className="space-y-2">
                          {[
                            { id: 'p1', name: 'RTO Office, Andheri East', distance: '2.5 km' },
                            { id: 'p2', name: 'HDFC Bank, Bandra West', distance: '5.1 km' },
                            { id: 'p3', name: 'Petrol Pump, Worli', distance: '8.3 km' },
                          ].map((point) => (
                            <div key={point.id} className="border rounded p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                              <div>
                                <p className="font-medium text-sm">{point.name}</p>
                                <p className="text-xs text-gray-500">Distance: {point.distance}</p>
                              </div>
                              <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Payment Method</h3>
                    
                    <FormField
                      control={deliveryForm.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <div className="grid grid-cols-2 gap-3">
                            {paymentMethods.map((method) => (
                              <div 
                                key={method.id}
                                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                  field.value === method.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-gray-400'
                                }`}
                                onClick={() => field.onChange(method.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-5 h-5 rounded-full border flex-shrink-0 ${
                                    field.value === method.id ? 
                                    'border-primary bg-primary' : 'border-gray-300'
                                  }`}>
                                    {field.value === method.id && (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                      </div>
                                    )}
                                  </div>
                                  <span className="font-medium text-sm">{method.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium mb-2">Payment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Security deposit</span>
                        <span>₹200.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Issuance fee</span>
                        <span>₹100.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (18%)</span>
                        <span>₹18.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery charge</span>
                        <span>₹50.00</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total Amount</span>
                        <span>₹368.00</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm and Pay'}
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
          
          {/* Success */}
          {step === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">FASTag Application Successful!</h3>
              
              <p className="text-gray-600 mb-6">
                Your FASTag application has been successfully submitted and payment received.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg w-full mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Reference Number:</span>
                  <span className="font-bold">{referenceNumber}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Vehicle Number:</span>
                  <span className="font-medium">{formData.application?.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-green-600 font-medium">Processing</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                Your FASTag will be {formData.delivery?.deliveryMethod === 'home' ? 'delivered to your address' : 'ready for pickup'} within 3-5 business days. You'll receive updates via SMS on your registered mobile number.
              </p>
              
              <div className="space-y-3 w-full">
                <Button variant="outline" className="w-full" onClick={onClose}>
                  Back to Home
                </Button>
                <Button className="w-full">
                  Track Application
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyNewFastagFlow;