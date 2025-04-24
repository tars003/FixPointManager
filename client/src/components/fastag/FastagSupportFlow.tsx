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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  X,
  ArrowLeft,
  Phone,
  MessageSquare,
  Mail,
  HelpCircle,
  AlertCircle,
  Wallet,
  Tag,
  UserCog,
  FileText,
  Repeat,
  CheckCircle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Support categories
const supportCategories = [
  { 
    id: 'balance', 
    icon: Wallet, 
    label: 'Balance/Payment Issues',
    description: 'Problems with FASTag balance, recharge, or payment failures',
  },
  { 
    id: 'tag', 
    icon: Tag, 
    label: 'Tag Not Working',
    description: 'FASTag not being detected at toll plazas or not functioning properly',
  },
  { 
    id: 'account', 
    icon: UserCog, 
    label: 'Account Management',
    description: 'Update vehicle details, mobile number, or any account-related queries',
  },
  { 
    id: 'refund', 
    icon: Repeat, 
    label: 'Refunds and Disputes',
    description: 'Request refunds for failed transactions or dispute incorrect charges',
  },
  { 
    id: 'replacement', 
    icon: FileText, 
    label: 'Tag Replacement',
    description: 'Replace damaged or lost FASTag or request additional tags',
  },
  { 
    id: 'general', 
    icon: HelpCircle, 
    label: 'General Inquiries',
    description: 'Other queries related to your FASTag or toll collection',
  },
];

// Support issue form schema
const supportFormSchema = z.object({
  fastagId: z.string().min(6, { message: 'Please enter a valid FASTag ID' }).optional(),
  vehicleNumber: z.string().regex(/^[A-Z]{2}\s?[0-9]{2}\s?[A-Z]{2}\s?[0-9]{4}$/, { message: 'Enter a valid vehicle number' }).optional(),
  subject: z.string().min(5, { message: 'Please enter a subject' }),
  message: z.string().min(10, { message: 'Please provide more details about your issue' }),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

// FAQs by category
const faqsByCategory: Record<string, Array<{ question: string; answer: string }>> = {
  balance: [
    {
      question: 'How do I check my FASTag balance?',
      answer: 'You can check your FASTag balance through your issuer bank's mobile app, website, by calling customer care, or by sending an SMS as per your bank's format.',
    },
    {
      question: 'Why is my FASTag recharge failing?',
      answer: 'Recharge failures can occur due to bank server issues, payment gateway problems, or insufficient funds in your account. Try using a different payment method or contact your bank for assistance.',
    },
    {
      question: 'How long does it take for a recharge to reflect?',
      answer: 'Typically, FASTag recharges reflect immediately. However, during high traffic or server issues, it might take up to 4 hours. If not credited after 4 hours, contact customer support.',
    },
    {
      question: 'Is there a minimum recharge amount?',
      answer: 'Yes, most banks require a minimum recharge of ₹100 for your FASTag account. Some banks might have different minimums, so check with your issuer bank.',
    },
  ],
  tag: [
    {
      question: 'Why is my FASTag not being detected at toll plazas?',
      answer: 'Your FASTag might not be detected if it's not properly affixed to the windshield, if it's damaged, or if there's insufficient balance. Ensure it's placed correctly and has adequate balance.',
    },
    {
      question: 'Do I need to stop at toll plazas if I have a FASTag?',
      answer: 'No, with a valid FASTag having sufficient balance, you can drive through the FASTag lane without stopping. The toll amount is automatically deducted.',
    },
    {
      question: 'What should I do if my FASTag is damaged?',
      answer: 'If your FASTag is damaged, you should apply for a replacement through your issuer bank. Do not attempt to remove or modify the damaged tag as it might void its functionality.',
    },
  ],
  account: [
    {
      question: 'How do I update my mobile number linked to FASTag?',
      answer: 'To update your mobile number, visit your issuer bank's website or app, navigate to FASTag management, and follow the steps to update your profile. Alternatively, visit the nearest branch with your ID proof.',
    },
    {
      question: 'Can I transfer my FASTag to another vehicle?',
      answer: 'No, FASTags are linked to specific vehicles and cannot be transferred. You need to obtain a new FASTag for a different vehicle.',
    },
    {
      question: 'How do I check my FASTag transaction history?',
      answer: 'You can view your transaction history through your issuer bank's mobile app, website, or by requesting a statement via customer care.',
    },
  ],
  refund: [
    {
      question: 'I was charged twice for a single toll crossing. How do I get a refund?',
      answer: 'Contact your issuer bank's customer care with details of the transaction including date, time, toll plaza name, and transaction ID. They will investigate and process the refund if validated.',
    },
    {
      question: 'How long does a refund take to process?',
      answer: 'Refunds typically take 7-14 working days to process after verification. The timeframe may vary depending on your issuer bank.',
    },
    {
      question: 'I was charged despite taking a different route. What should I do?',
      answer: 'Report the incorrect charge to your issuer bank with details of your actual travel route and the date/time of the charge. Include any proof like GPS data or receipts if available.',
    },
  ],
  replacement: [
    {
      question: 'How do I get a replacement for a damaged FASTag?',
      answer: 'Contact your issuer bank's customer care or visit their website to apply for a replacement. You may need to provide your current FASTag ID and vehicle details.',
    },
    {
      question: 'Is there a fee for FASTag replacement?',
      answer: 'Yes, most banks charge a replacement fee ranging from ₹100 to ₹150. The exact amount depends on your issuer bank.',
    },
    {
      question: 'What happens to my balance when I replace my FASTag?',
      answer: 'Your existing balance is transferred to the new FASTag after verification. There might be a processing time of 2-3 business days for the transfer.',
    },
  ],
  general: [
    {
      question: 'Does FASTag have an expiry date?',
      answer: 'Yes, FASTag has a validity of 5 years from the date of issuance. The expiry date is mentioned on the tag itself.',
    },
    {
      question: 'Can I have multiple FASTags for the same vehicle?',
      answer: 'No, only one active FASTag is allowed per vehicle as per NHAI regulations. Having multiple tags may lead to double deduction or blacklisting.',
    },
    {
      question: 'Is FASTag mandatory for all vehicles?',
      answer: 'Yes, as per the Ministry of Road Transport & Highways notification, FASTag is mandatory for all four-wheeler vehicles in India.',
    },
  ],
};

interface FastagSupportFlowProps {
  onClose: () => void;
}

const FastagSupportFlow: React.FC<FastagSupportFlowProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [supportTab, setSupportTab] = useState<'faqs' | 'contact' | 'ticket'>('faqs');
  const [ticketCreated, setTicketCreated] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Support form
  const supportForm = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      fastagId: '',
      vehicleNumber: '',
      subject: '',
      message: '',
    },
  });

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSupportTab('faqs');
  };

  // Handle back button click
  const handleBack = () => {
    if (ticketCreated) {
      setTicketCreated(false);
    } else {
      setSelectedCategory(null);
    }
  };

  // Handle support form submission
  const onSupportFormSubmit = (values: SupportFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      const ticketNum = 'TKT' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
      setTicketNumber(ticketNum);
      setTicketCreated(true);
      
      toast({
        title: 'Support ticket created',
        description: `Your ticket number is ${ticketNum}`,
      });
    }, 2000);
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
              {selectedCategory && (
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-bold">
                {!selectedCategory && 'FASTag Support'}
                {selectedCategory && !ticketCreated && supportCategories.find(c => c.id === selectedCategory)?.label}
                {ticketCreated && 'Ticket Created'}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Category Selection */}
          {!selectedCategory && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <p className="text-sm text-gray-500 mb-6">
                Select the category that best describes your issue to get quick help or create a support ticket.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {supportCategories.map((category) => (
                  <div 
                    key={category.id}
                    className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <category.icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.label}</h3>
                        <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-700">Need Immediate Help?</h3>
                    <p className="text-sm text-blue-600 mt-1">
                      Call our 24/7 customer care at <span className="font-medium">1800-123-4567</span> for urgent assistance.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Category Specific Support */}
          {selectedCategory && !ticketCreated && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  {supportCategories.find(c => c.id === selectedCategory)?.description}
                </p>
              </div>
              
              <Tabs value={supportTab} onValueChange={(value) => setSupportTab(value as any)} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="faqs" className="flex items-center gap-1">
                    <HelpCircle className="h-4 w-4" />
                    <span>FAQs</span>
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>Contact</span>
                  </TabsTrigger>
                  <TabsTrigger value="ticket" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Create Ticket</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* FAQs Tab */}
                <TabsContent value="faqs">
                  <div className="space-y-4">
                    {selectedCategory && faqsByCategory[selectedCategory]?.map((faq, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <details className="group">
                          <summary className="flex cursor-pointer items-center justify-between p-4 text-left font-medium">
                            <span>{faq.question}</span>
                            <span className="transition group-open:rotate-180">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-4 w-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                            </span>
                          </summary>
                          <div className="border-t p-4 text-sm text-gray-600 bg-gray-50">
                            {faq.answer}
                          </div>
                        </details>
                      </div>
                    ))}

                    <div className="border border-dashed rounded-lg p-4 text-center text-sm text-gray-500">
                      <p>
                        Didn't find what you're looking for? <br />
                        <button className="text-primary font-medium mt-1" onClick={() => setSupportTab('ticket')}>Create a Support Ticket</button>
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Contact Tab */}
                <TabsContent value="contact">
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Phone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">24/7 Helpline</h3>
                          <p className="text-xs text-gray-500 mt-1">Available round the clock for all FASTag related queries</p>
                          <div className="mt-2">
                            <a href="tel:1800-123-4567" className="text-primary font-medium">1800-123-4567</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Live Chat Support</h3>
                          <p className="text-xs text-gray-500 mt-1">Chat with our support team (9 AM - 9 PM)</p>
                          <div className="mt-2">
                            <Button size="sm">Start Chat</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Mail className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Email Support</h3>
                          <p className="text-xs text-gray-500 mt-1">Send us an email for complex issues (24-48 hour response time)</p>
                          <div className="mt-2">
                            <a href="mailto:support@fastag.com" className="text-primary font-medium">support@fastag.com</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-dashed rounded-lg p-4 text-center text-sm text-gray-500">
                      <p>
                        Want to create a formal support request? <br />
                        <button className="text-primary font-medium mt-1" onClick={() => setSupportTab('ticket')}>Create a Support Ticket</button>
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Create Ticket Tab */}
                <TabsContent value="ticket">
                  <Form {...supportForm}>
                    <form onSubmit={supportForm.handleSubmit(onSupportFormSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={supportForm.control}
                          name="fastagId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>FASTag ID (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., FT1234567890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={supportForm.control}
                          name="vehicleNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Number (Optional)</FormLabel>
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
                      </div>
                      
                      <FormField
                        control={supportForm.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Brief description of your issue" 
                                {...field} 
                                defaultValue={supportCategories.find(c => c.id === selectedCategory)?.label}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={supportForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide details about your issue" 
                                {...field} 
                                rows={5}
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
                          {isSubmitting ? 'Creating Ticket...' : 'Submit Support Ticket'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
          
          {/* Ticket Created Confirmation */}
          {ticketCreated && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">Support Ticket Created</h3>
              
              <p className="text-gray-600 mb-6">
                Your support request has been successfully submitted. Our team will get back to you shortly.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg w-full mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Ticket Number:</span>
                  <span className="font-bold">{ticketNumber}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium">{supportCategories.find(c => c.id === selectedCategory)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-yellow-600 font-medium">Open</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                You'll receive updates on your ticket via SMS and email. You can also check the status using your ticket number.
              </p>
              
              <div className="space-y-3 w-full">
                <Button variant="outline" className="w-full" onClick={onClose}>
                  Back to Home
                </Button>
                <Button className="w-full">
                  Track Ticket Status
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FastagSupportFlow;