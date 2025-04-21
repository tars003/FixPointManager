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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CalendarIcon, 
  CreditCard, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  DollarSign,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  FilePlus,
  Truck,
  UserCheck,
  Calculator,
  Percent,
  Clock,
  Check,
  Trash2,
  Download,
  Send,
  Printer,
  Copy,
  AlertCircle
} from 'lucide-react';

type NewInvoiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
};

// Define validation schemas for each step
const clientDetailsSchema = z.object({
  clientType: z.enum(["individual", "corporate"], { required_error: "Please select client type" }),
  clientId: z.string().optional(),
  newClient: z.object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    contactPerson: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }).optional(),
    address: z.string().optional(),
    taxId: z.string().optional(),
  }).optional(),
});

const serviceDetailsSchema = z.object({
  serviceItems: z.array(z.object({
    serviceType: z.string({ required_error: "Service type is required" }),
    vehicleId: z.string().optional(),
    description: z.string().min(3, { message: "Description is required" }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
    unitPrice: z.number().min(1, { message: "Price must be greater than 0" }),
    taxable: z.boolean().default(true),
  })).min(1, { message: "At least one service item is required" }),
  notes: z.string().optional(),
});

const additionalItemsSchema = z.object({
  additionalItems: z.array(z.object({
    itemType: z.string({ required_error: "Item type is required" }),
    description: z.string().min(3, { message: "Description is required" }),
    amount: z.number(),
    isDiscount: z.boolean().default(false),
  })).optional(),
  subtotal: z.number().min(0, { message: "Subtotal must be non-negative" }),
  taxRate: z.number().min(0, { message: "Tax rate must be non-negative" }),
  taxAmount: z.number().min(0, { message: "Tax amount must be non-negative" }),
  totalAmount: z.number().min(0, { message: "Total amount must be non-negative" }),
});

const paymentTermsSchema = z.object({
  dueDate: z.date({ required_error: "Due date is required" }),
  paymentMethod: z.enum(["bank-transfer", "credit-card", "cash", "online", "cheque"], { 
    required_error: "Payment method is required" 
  }),
  earlyPaymentDiscount: z.number().min(0).max(100).default(0),
  latePaymentFee: z.number().min(0).max(100).default(0),
  allowPartialPayment: z.boolean().default(false),
  termsAndConditions: z.string().optional(),
});

const distributionOptionsSchema = z.object({
  invoiceNumber: z.string(),
  distribution: z.array(z.enum(["email", "sms", "print", "download", "portal"])).min(1, {
    message: "Select at least one distribution method"
  }),
  emailRecipients: z.string().optional(),
  sendCopy: z.boolean().default(false),
  reminderSettings: z.object({
    enableReminders: z.boolean().default(true),
    firstReminder: z.number().min(1).default(3),
    secondReminder: z.number().min(1).default(7),
    finalReminder: z.number().min(1).default(14),
  }).optional(),
});

// Define mock data for the form
const clients = [
  { id: "1", name: "ABC Travels", type: "corporate", contactPerson: "Rajiv Sharma", phone: "+91 98765 43210", email: "info@abctravels.com", address: "123 Main St, Chennai, 600001", taxId: "GSTIN123456789" },
  { id: "2", name: "XYZ Tours", type: "corporate", contactPerson: "Mehul Patel", phone: "+91 98765 12345", email: "mehul@xyztours.com", address: "456 Park Avenue, Mumbai, 400001", taxId: "GSTIN987654321" },
  { id: "3", name: "Fast Logistics", type: "corporate", contactPerson: "Anand Kumar", phone: "+91 87654 32109", email: "anand@fastlogistics.com", address: "789 Business Park, Delhi, 110001", taxId: "GSTIN567891234" },
  { id: "4", name: "Ravi Shankar", type: "individual", phone: "+91 76543 21098", email: "ravi.shankar@gmail.com", address: "234 Residence Colony, Bangalore, 560001", taxId: "PAN123456789" },
  { id: "5", name: "Priya Mehta", type: "individual", phone: "+91 65432 10987", email: "priya.mehta@yahoo.com", address: "567 Apartments, Hyderabad, 500001", taxId: "PAN987654321" },
];

const vehicles = [
  { id: "1", name: "Toyota Innova Crysta", registration: "TN01-3456" },
  { id: "2", name: "Mahindra Bolero", registration: "DL01-8794" },
  { id: "3", name: "Tata Ace", registration: "MH02-4532" },
  { id: "4", name: "Ashok Leyland Dost", registration: "KA01-9834" },
  { id: "5", name: "Bajaj RE Auto", registration: "GJ05-2143" },
];

const serviceTypes = [
  { id: "rental", name: "Vehicle Rental" },
  { id: "maintenance", name: "Maintenance Service" },
  { id: "repair", name: "Repair Service" },
  { id: "parts", name: "Spare Parts" },
  { id: "driver", name: "Driver Service" },
  { id: "insurance", name: "Insurance" },
  { id: "other", name: "Other Service" },
];

const additionalItemTypes = [
  { id: "discount", name: "Discount", isDiscount: true },
  { id: "damage", name: "Damage Charges", isDiscount: false },
  { id: "cleaning", name: "Cleaning Fee", isDiscount: false },
  { id: "late", name: "Late Return Fee", isDiscount: false },
  { id: "delivery", name: "Delivery Charges", isDiscount: false },
  { id: "addon", name: "Add-on Service", isDiscount: false },
  { id: "custom", name: "Custom Item", isDiscount: false },
];

export function NewInvoiceDialog({ open, onOpenChange, theme }: NewInvoiceDialogProps) {
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Selected client state
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState<'individual' | 'corporate'>('individual');
  
  // Invoice items and calculation state
  const [serviceItems, setServiceItems] = useState<any[]>([
    {
      id: 1,
      serviceType: "",
      vehicleId: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxable: true,
    },
  ]);
  
  const [additionalItems, setAdditionalItems] = useState<any[]>([]);
  
  // Invoice total calculation state
  const [invoiceTotals, setInvoiceTotals] = useState({
    subtotal: 0,
    taxRate: 18, // Default GST rate
    taxAmount: 0,
    totalAmount: 0,
  });
  
  // Invoice preview state
  const [invoicePreview, setInvoicePreview] = useState<any>(null);
  
  // Generate invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };
  
  // Calculate invoice totals
  const calculateTotals = () => {
    // Calculate service items total
    const serviceTotal = serviceItems.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
    
    // Calculate additional items total
    const additionalTotal = additionalItems.reduce((total, item) => {
      return item.isDiscount ? total - item.amount : total + item.amount;
    }, 0);
    
    // Calculate subtotal
    const subtotal = serviceTotal + additionalTotal;
    
    // Calculate taxable amount - only items marked as taxable
    const taxableAmount = serviceItems.reduce((total, item) => {
      return item.taxable ? total + (item.quantity * item.unitPrice) : total;
    }, 0);
    
    // Calculate tax amount
    const taxAmount = (taxableAmount * invoiceTotals.taxRate) / 100;
    
    // Calculate total
    const totalAmount = subtotal + taxAmount;
    
    setInvoiceTotals({
      ...invoiceTotals,
      subtotal,
      taxAmount,
      totalAmount,
    });
  };
  
  // Step 1 form - Client Details
  const clientForm = useForm<z.infer<typeof clientDetailsSchema>>({
    resolver: zodResolver(clientDetailsSchema),
    defaultValues: {
      clientType: 'individual',
      clientId: '',
      newClient: {
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        taxId: '',
      }
    }
  });
  
  // Step 2 form - Service Details
  const serviceForm = useForm<z.infer<typeof serviceDetailsSchema>>({
    resolver: zodResolver(serviceDetailsSchema),
    defaultValues: {
      serviceItems: [
        {
          serviceType: '',
          vehicleId: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          taxable: true,
        }
      ],
      notes: '',
    }
  });
  
  // Step 3 form - Additional Items
  const additionalItemsForm = useForm<z.infer<typeof additionalItemsSchema>>({
    resolver: zodResolver(additionalItemsSchema),
    defaultValues: {
      additionalItems: [],
      subtotal: 0,
      taxRate: 18,
      taxAmount: 0,
      totalAmount: 0,
    }
  });
  
  // Step 4 form - Payment Terms
  const paymentTermsForm = useForm<z.infer<typeof paymentTermsSchema>>({
    resolver: zodResolver(paymentTermsSchema),
    defaultValues: {
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      paymentMethod: 'bank-transfer',
      earlyPaymentDiscount: 0,
      latePaymentFee: 2,
      allowPartialPayment: false,
      termsAndConditions: 'Standard terms and conditions apply.',
    }
  });
  
  // Step 5 form - Distribution Options
  const distributionForm = useForm<z.infer<typeof distributionOptionsSchema>>({
    resolver: zodResolver(distributionOptionsSchema),
    defaultValues: {
      invoiceNumber: generateInvoiceNumber(),
      distribution: ['email'],
      emailRecipients: '',
      sendCopy: false,
      reminderSettings: {
        enableReminders: true,
        firstReminder: 3,
        secondReminder: 7,
        finalReminder: 14,
      }
    }
  });
  
  // Get client by ID
  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };
  
  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
    clientForm.setValue('clientId', clientId);
    
    const client = getClientById(clientId);
    if (client) {
      setSelectedClientType(client.type as 'individual' | 'corporate');
      clientForm.setValue('clientType', client.type as 'individual' | 'corporate');
      
      // Set email recipients for distribution
      distributionForm.setValue('emailRecipients', client.email);
    }
  };
  
  // Handle client type change
  const handleClientTypeChange = (type: 'individual' | 'corporate') => {
    setSelectedClientType(type);
    clientForm.setValue('clientType', type);
  };
  
  // Add service item
  const addServiceItem = () => {
    const newServiceItems = [...serviceItems, {
      id: serviceItems.length + 1,
      serviceType: "",
      vehicleId: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxable: true,
    }];
    
    setServiceItems(newServiceItems);
    serviceForm.setValue('serviceItems', newServiceItems);
  };
  
  // Remove service item
  const removeServiceItem = (index: number) => {
    if (serviceItems.length <= 1) return; // Keep at least one item
    
    const newServiceItems = [...serviceItems];
    newServiceItems.splice(index, 1);
    
    setServiceItems(newServiceItems);
    serviceForm.setValue('serviceItems', newServiceItems);
    calculateTotals();
  };
  
  // Update service item
  const updateServiceItem = (index: number, field: string, value: any) => {
    const newServiceItems = [...serviceItems];
    newServiceItems[index] = { ...newServiceItems[index], [field]: value };
    
    setServiceItems(newServiceItems);
    serviceForm.setValue('serviceItems', newServiceItems);
    calculateTotals();
  };
  
  // Add additional item
  const addAdditionalItem = () => {
    const newItem = {
      id: additionalItems.length + 1,
      itemType: "",
      description: "",
      amount: 0,
      isDiscount: false,
    };
    
    setAdditionalItems([...additionalItems, newItem]);
    additionalItemsForm.setValue('additionalItems', [...additionalItems, newItem]);
  };
  
  // Remove additional item
  const removeAdditionalItem = (index: number) => {
    const newItems = [...additionalItems];
    newItems.splice(index, 1);
    
    setAdditionalItems(newItems);
    additionalItemsForm.setValue('additionalItems', newItems);
    calculateTotals();
  };
  
  // Update additional item
  const updateAdditionalItem = (index: number, field: string, value: any) => {
    const newItems = [...additionalItems];
    
    if (field === 'itemType') {
      const itemType = additionalItemTypes.find(type => type.id === value);
      newItems[index] = { 
        ...newItems[index], 
        [field]: value,
        isDiscount: itemType?.isDiscount || false,
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    
    setAdditionalItems(newItems);
    additionalItemsForm.setValue('additionalItems', newItems);
    calculateTotals();
  };
  
  // Update tax rate
  const updateTaxRate = (value: number) => {
    setInvoiceTotals({
      ...invoiceTotals,
      taxRate: value,
    });
    additionalItemsForm.setValue('taxRate', value);
    calculateTotals();
  };
  
  // Form submissions for each step
  const onClientSubmit = (data: z.infer<typeof clientDetailsSchema>) => {
    console.log("Client details data:", data);
    goToNextStep();
  };
  
  const onServiceSubmit = (data: z.infer<typeof serviceDetailsSchema>) => {
    console.log("Service details data:", data);
    
    // Update service items and calculate totals
    setServiceItems(data.serviceItems);
    calculateTotals();
    
    // Update additional items form values
    additionalItemsForm.setValue('subtotal', invoiceTotals.subtotal);
    additionalItemsForm.setValue('taxAmount', invoiceTotals.taxAmount);
    additionalItemsForm.setValue('totalAmount', invoiceTotals.totalAmount);
    
    goToNextStep();
  };
  
  const onAdditionalItemsSubmit = (data: z.infer<typeof additionalItemsSchema>) => {
    console.log("Additional items data:", data);
    
    // Update invoice totals in the form
    additionalItemsForm.setValue('subtotal', invoiceTotals.subtotal);
    additionalItemsForm.setValue('taxAmount', invoiceTotals.taxAmount);
    additionalItemsForm.setValue('totalAmount', invoiceTotals.totalAmount);
    
    goToNextStep();
  };
  
  const onPaymentTermsSubmit = (data: z.infer<typeof paymentTermsSchema>) => {
    console.log("Payment terms data:", data);
    goToNextStep();
  };
  
  const onDistributionSubmit = (data: z.infer<typeof distributionOptionsSchema>) => {
    console.log("Distribution options data:", data);
    
    // In a real application, we would save the invoice to the database here
    
    // Generate invoice preview
    const client = selectedClient ? getClientById(selectedClient) : null;
    
    setInvoicePreview({
      invoiceNumber: data.invoiceNumber,
      issueDate: new Date().toLocaleDateString(),
      dueDate: format(paymentTermsForm.getValues().dueDate, 'PPP'),
      client: client || clientForm.getValues().newClient,
      serviceItems,
      additionalItems,
      totals: invoiceTotals,
      paymentTerms: paymentTermsForm.getValues(),
      distribution: data,
    });
    
    // Close dialog after submission
    onOpenChange(false);
    
    // Show success message or redirect to invoice list
    alert("Invoice created successfully!");
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
  const renderClientDetails = () => {
    return (
      <Form {...clientForm}>
        <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Client Information
            </h3>
            
            {/* Client Type Selection */}
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
                      <UserCheck className="h-4 w-4 mr-2" />
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
                  
                  {clients
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
                            <FormLabel>Billing Address</FormLabel>
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
                      
                      <FormField
                        control={clientForm.control}
                        name="newClient.taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PAN Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., ABCDE1234F" 
                                {...field} 
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                              <FormLabel>Billing Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="e.g., accounts@abclogistics.com" 
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
                            <FormLabel>Billing Address</FormLabel>
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
                      
                      <FormField
                        control={clientForm.control}
                        name="newClient.taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GSTIN</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 22AAAAA0000A1Z5" 
                                {...field} 
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
              onClick={() => onOpenChange(false)}
              className={theme === 'dark' ? 'border-gray-600 text-gray-300' : ''}
            >
              Cancel
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
  
  const renderServiceDetails = () => {
    return (
      <Form {...serviceForm}>
        <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Service/Items Details
            </h3>
            
            {/* Service items */}
            {serviceItems.map((item, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Item #{index + 1}</h4>
                  {serviceItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeServiceItem(index)}
                      className="text-red-500 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Service Type
                    </label>
                    <Select 
                      value={item.serviceType}
                      onValueChange={(value) => updateServiceItem(index, 'serviceType', value)}
                    >
                      <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                        {serviceTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {item.serviceType === 'rental' && (
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Vehicle
                      </label>
                      <Select 
                        value={item.vehicleId}
                        onValueChange={(value) => updateServiceItem(index, 'vehicleId', value)}
                      >
                        <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                          {vehicles.map(vehicle => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.name} ({vehicle.registration})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <Textarea
                    placeholder="Enter description of the service or item"
                    value={item.description}
                    onChange={(e) => updateServiceItem(index, 'description', e.target.value)}
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Quantity
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateServiceItem(index, 'quantity', parseInt(e.target.value))}
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Unit Price (₹)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateServiceItem(index, 'unitPrice', parseFloat(e.target.value))}
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`taxable-${index}`}
                        checked={item.taxable}
                        onCheckedChange={(checked) => updateServiceItem(index, 'taxable', checked)}
                      />
                      <label 
                        htmlFor={`taxable-${index}`}
                        className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Taxable
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className={`mt-3 pt-3 border-t text-right ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Item Total: ₹{(item.quantity * item.unitPrice).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addServiceItem}
              className={`w-full ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Item
            </Button>
            
            {/* Notes */}
            <FormField
              control={serviceForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes or instructions..." 
                      {...field} 
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </FormControl>
                  <FormDescription>
                    These notes will appear on the invoice.
                  </FormDescription>
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
  
  const renderAdditionalItems = () => {
    return (
      <Form {...additionalItemsForm}>
        <form onSubmit={additionalItemsForm.handleSubmit(onAdditionalItemsSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Additional Items & Adjustments
            </h3>
            
            {/* Additional items */}
            {additionalItems.length > 0 && (
              <div className="space-y-3">
                {additionalItems.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-lg flex items-center ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <Select 
                          value={item.itemType}
                          onValueChange={(value) => updateAdditionalItem(index, 'itemType', value)}
                        >
                          <SelectTrigger className={`w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                            {additionalItemTypes.map(type => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateAdditionalItem(index, 'description', e.target.value)}
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.isDiscount ? '-' : '+'}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Amount"
                          value={item.amount}
                          onChange={(e) => updateAdditionalItem(index, 'amount', parseFloat(e.target.value))}
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                        />
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAdditionalItem(index)}
                      className="ml-2 text-red-500 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Button
              type="button"
              variant="outline"
              onClick={addAdditionalItem}
              className={`w-full ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Adjustment Item
            </Button>
            
            {/* Tax Rate */}
            <div className={`mt-6 p-4 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-3 ${theme === 'dark' ? 'text-white' : ''}`}>
                Tax Rate
              </h4>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={invoiceTotals.taxRate}
                    onChange={(e) => updateTaxRate(parseFloat(e.target.value))}
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>
                <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>%</div>
                <div className="flex-1">
                  <Select
                    value={invoiceTotals.taxRate.toString()}
                    onValueChange={(value) => updateTaxRate(parseFloat(value))}
                  >
                    <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                      <SelectValue placeholder="GST Rate" />
                    </SelectTrigger>
                    <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                      <SelectItem value="0">No Tax (0%)</SelectItem>
                      <SelectItem value="5">GST (5%)</SelectItem>
                      <SelectItem value="12">GST (12%)</SelectItem>
                      <SelectItem value="18">GST (18%)</SelectItem>
                      <SelectItem value="28">GST (28%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Invoice Summary */}
            <div className={`mt-6 p-4 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-3 ${theme === 'dark' ? 'text-white' : ''}`}>
                Invoice Summary
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Subtotal:</span>
                  <span className="font-medium">₹{invoiceTotals.subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    GST ({invoiceTotals.taxRate}%):
                  </span>
                  <span className="font-medium">₹{invoiceTotals.taxAmount.toLocaleString()}</span>
                </div>
                
                <Separator className={theme === 'dark' ? 'bg-gray-700' : ''} />
                
                <div className="flex justify-between text-lg">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">₹{invoiceTotals.totalAmount.toLocaleString()}</span>
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
  
  const renderPaymentTerms = () => {
    return (
      <Form {...paymentTermsForm}>
        <form onSubmit={paymentTermsForm.handleSubmit(onPaymentTermsSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Payment Terms
            </h3>
            
            {/* Due Date */}
            <FormField
              control={paymentTermsForm.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
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
                          // Can't select dates in the past
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When the payment is due from the client.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Payment Method */}
            <FormField
              control={paymentTermsForm.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accepted Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit-card">Credit/Debit Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Preferred payment method for this invoice.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Payment Incentives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={paymentTermsForm.control}
                name="earlyPaymentDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Early Payment Discount (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        max="100"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Discount if paid before due date.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={paymentTermsForm.control}
                name="latePaymentFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Late Payment Fee (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        max="100"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional fee for late payments.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Payment Options */}
            <FormField
              control={paymentTermsForm.control}
              name="allowPartialPayment"
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
                      Allow Partial Payments
                    </FormLabel>
                    <FormDescription>
                      Enable client to make installment payments.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {/* Terms and Conditions */}
            <FormField
              control={paymentTermsForm.control}
              name="termsAndConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms and Conditions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter terms and conditions..." 
                      {...field} 
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Legal terms that will appear on the invoice.
                  </FormDescription>
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
  
  const renderDistributionOptions = () => {
    return (
      <Form {...distributionForm}>
        <form onSubmit={distributionForm.handleSubmit(onDistributionSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              Finalize & Send Invoice
            </h3>
            
            {/* Invoice Number */}
            <FormField
              control={distributionForm.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </FormControl>
                  <FormDescription>
                    System-generated unique invoice identifier.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Distribution Methods */}
            <FormField
              control={distributionForm.control}
              name="distribution"
              render={() => (
                <FormItem>
                  <FormLabel>Distribution Methods</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <FormField
                      control={distributionForm.control}
                      name="distribution"
                      render={({ field }) => (
                        <FormItem className={`flex items-center justify-between rounded-md border p-3 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                          <div className="space-y-0.5">
                            <FormLabel className="font-normal cursor-pointer">
                              Email
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Send to client's email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("email")}
                              onCheckedChange={(checked) => {
                                const newValue = field.value || [];
                                return checked
                                  ? field.onChange([...newValue, "email"])
                                  : field.onChange(newValue.filter(v => v !== "email"));
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={distributionForm.control}
                      name="distribution"
                      render={({ field }) => (
                        <FormItem className={`flex items-center justify-between rounded-md border p-3 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                          <div className="space-y-0.5">
                            <FormLabel className="font-normal cursor-pointer">
                              SMS
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Send link via text
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("sms")}
                              onCheckedChange={(checked) => {
                                const newValue = field.value || [];
                                return checked
                                  ? field.onChange([...newValue, "sms"])
                                  : field.onChange(newValue.filter(v => v !== "sms"));
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={distributionForm.control}
                      name="distribution"
                      render={({ field }) => (
                        <FormItem className={`flex items-center justify-between rounded-md border p-3 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                          <div className="space-y-0.5">
                            <FormLabel className="font-normal cursor-pointer">
                              Print
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Print physical copy
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("print")}
                              onCheckedChange={(checked) => {
                                const newValue = field.value || [];
                                return checked
                                  ? field.onChange([...newValue, "print"])
                                  : field.onChange(newValue.filter(v => v !== "print"));
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={distributionForm.control}
                      name="distribution"
                      render={({ field }) => (
                        <FormItem className={`flex items-center justify-between rounded-md border p-3 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                          <div className="space-y-0.5">
                            <FormLabel className="font-normal cursor-pointer">
                              Download
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Save PDF locally
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("download")}
                              onCheckedChange={(checked) => {
                                const newValue = field.value || [];
                                return checked
                                  ? field.onChange([...newValue, "download"])
                                  : field.onChange(newValue.filter(v => v !== "download"));
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={distributionForm.control}
                      name="distribution"
                      render={({ field }) => (
                        <FormItem className={`flex items-center justify-between rounded-md border p-3 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
                          <div className="space-y-0.5">
                            <FormLabel className="font-normal cursor-pointer">
                              Client Portal
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Add to client's portal
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes("portal")}
                              onCheckedChange={(checked) => {
                                const newValue = field.value || [];
                                return checked
                                  ? field.onChange([...newValue, "portal"])
                                  : field.onChange(newValue.filter(v => v !== "portal"));
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Email Recipients */}
            {distributionForm.watch('distribution')?.includes('email') && (
              <FormField
                control={distributionForm.control}
                name="emailRecipients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Recipients</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Comma-separated email addresses" 
                        {...field} 
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Send to multiple email addresses separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {/* Send Copy Option */}
            <FormField
              control={distributionForm.control}
              name="sendCopy"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Send Me a Copy
                    </FormLabel>
                    <FormDescription>
                      Send a copy of this invoice to your email.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {/* Reminder Settings */}
            <div className={`p-4 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Payment Reminder Settings</h4>
                <FormField
                  control={distributionForm.control}
                  name="reminderSettings.enableReminders"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormLabel>Enable</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {distributionForm.watch('reminderSettings.enableReminders') && (
                <div className="space-y-3">
                  <FormField
                    control={distributionForm.control}
                    name="reminderSettings.firstReminder"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>First Reminder</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input 
                                type="number" 
                                className={`w-16 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>days before due date</span>
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={distributionForm.control}
                    name="reminderSettings.secondReminder"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Second Reminder</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input 
                                type="number" 
                                className={`w-16 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>days after due date</span>
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={distributionForm.control}
                    name="reminderSettings.finalReminder"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Final Reminder</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input 
                                type="number" 
                                className={`w-16 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>days after due date</span>
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            
            {/* Invoice Summary */}
            <div className={`mt-6 p-4 border rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-3 ${theme === 'dark' ? 'text-white' : ''}`}>
                Invoice Summary
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Invoice Number:</span>
                  <span className="font-medium">{distributionForm.getValues().invoiceNumber}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Issue Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Due Date:</span>
                  <span className="font-medium">{format(paymentTermsForm.getValues().dueDate, 'PPP')}</span>
                </div>
                
                <Separator className={theme === 'dark' ? 'bg-gray-700' : ''} />
                
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Client:</span>
                  <span className="font-medium">
                    {selectedClient 
                      ? getClientById(selectedClient)?.name 
                      : clientForm.getValues().newClient?.name || 'New Client'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Total Amount:</span>
                  <span className="font-bold">₹{invoiceTotals.totalAmount.toLocaleString()}</span>
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
              className={theme === 'light' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}
            >
              Create & Send Invoice
              <Send className="h-4 w-4 ml-2" />
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
        return renderClientDetails();
      case 2:
        return renderServiceDetails();
      case 3:
        return renderAdditionalItems();
      case 4:
        return renderPaymentTerms();
      case 5:
        return renderDistributionOptions();
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-screen overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`text-xl ${theme === 'dark' ? 'text-white' : ''}`}>
            Create New Invoice
          </DialogTitle>
          <DialogDescription>
            Complete all details to create and send an invoice
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress indicator */}
        <div className="w-full pt-2">
          <div className="flex justify-between mb-2">
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Step {currentStep} of {totalSteps}
            </span>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {currentStep === 1 ? 'Client Details' : 
               currentStep === 2 ? 'Service Details' :
               currentStep === 3 ? 'Additional Items' : 
               currentStep === 4 ? 'Payment Terms' :
               'Distribution Options'}
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