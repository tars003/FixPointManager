import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  IndianRupee, 
  Search, 
  ArrowRight, 
  CheckCircle,
  XCircle, 
  Clock, 
  FileText,
  MapPin, 
  Filter, 
  Truck, 
  CreditCard,
  CheckSquare,
  Settings,
  Info
} from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/format';
import AdvancedPageTransition from '@/components/transitions/advanced-page-transition';
import PersonalizedDashboardWidgets from '@/components/dashboard/PersonalizedDashboardWidgets';
import DocumentHoverCard from '@/components/documents/DocumentHoverCard';
import InteractiveMascotGuide from '@/components/tutorial/InteractiveMascotGuide';

// Sample RTO service data
const rtoServices = [
  {
    id: 1,
    name: 'Driving License Application',
    description: 'Apply for a new driving license',
    price: 450,
    averageTime: '15-20 days',
    rating: 4.5,
    categories: ['license'],
    stateSpecific: false
  },
  {
    id: 2,
    name: 'License Renewal',
    description: 'Renew your existing driving license',
    price: 350,
    averageTime: '7-10 days',
    rating: 4.7,
    categories: ['license'],
    stateSpecific: false
  },
  {
    id: 3,
    name: 'Vehicle Registration',
    description: 'Register your new vehicle with RTO',
    price: 1200,
    averageTime: '7-14 days',
    rating: 4.2,
    categories: ['registration'],
    stateSpecific: true
  },
  {
    id: 4,
    name: 'Transfer of Ownership',
    description: 'Transfer vehicle registration to a new owner',
    price: 1500,
    averageTime: '14-21 days',
    rating: 4.0,
    categories: ['registration'],
    stateSpecific: true
  },
  {
    id: 5,
    name: 'NOC for Registration',
    description: 'No Objection Certificate for vehicle registration',
    price: 850,
    averageTime: '10-15 days',
    rating: 4.3,
    categories: ['certificates'],
    stateSpecific: true
  },
  {
    id: 6,
    name: 'Vehicle Fitness Certificate',
    description: 'Get fitness certificate for commercial vehicles',
    price: 1100,
    averageTime: '5-7 days',
    rating: 4.6,
    categories: ['certificates'],
    stateSpecific: false
  },
  {
    id: 7,
    name: 'International Driving Permit',
    description: 'Get permit for driving in foreign countries',
    price: 2200,
    averageTime: '7-10 days',
    rating: 4.8,
    categories: ['license', 'permits'],
    stateSpecific: false
  },
  {
    id: 8,
    name: 'Duplicate RC Certificate',
    description: 'Get a duplicate registration certificate',
    price: 750,
    averageTime: '10-15 days',
    rating: 4.1,
    categories: ['certificates'],
    stateSpecific: true
  }
];

// Indian states and union territories
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

// Sample tracking data
const trackingData = [
  {
    id: 'RTO24051',
    service: 'Driving License Renewal',
    status: 'completed',
    submittedOn: '2025-04-28',
    estimatedCompletion: '2025-05-07',
    actualCompletion: '2025-05-05',
    paymentStatus: 'paid',
    amount: 450,
    steps: [
      { name: 'Application Submitted', status: 'completed', date: '2025-04-28' },
      { name: 'Document Verification', status: 'completed', date: '2025-04-30' },
      { name: 'Payment Verified', status: 'completed', date: '2025-05-01' },
      { name: 'Processing at RTO', status: 'completed', date: '2025-05-03' },
      { name: 'Service Completed', status: 'completed', date: '2025-05-05' }
    ]
  },
  {
    id: 'RTO24072',
    service: 'Vehicle Registration',
    status: 'processing',
    submittedOn: '2025-05-02',
    estimatedCompletion: '2025-05-16',
    actualCompletion: null,
    paymentStatus: 'paid',
    amount: 1200,
    steps: [
      { name: 'Application Submitted', status: 'completed', date: '2025-05-02' },
      { name: 'Document Verification', status: 'completed', date: '2025-05-05' },
      { name: 'Payment Verified', status: 'completed', date: '2025-05-05' },
      { name: 'Processing at RTO', status: 'in-progress', date: '2025-05-07' },
      { name: 'Service Completed', status: 'pending', date: null }
    ]
  },
  {
    id: 'RTO24036',
    service: 'International Driving Permit',
    status: 'pending',
    submittedOn: '2025-05-08',
    estimatedCompletion: '2025-05-18',
    actualCompletion: null,
    paymentStatus: 'pending',
    amount: 2200,
    steps: [
      { name: 'Application Submitted', status: 'completed', date: '2025-05-08' },
      { name: 'Document Verification', status: 'pending', date: null },
      { name: 'Payment Verified', status: 'pending', date: null },
      { name: 'Processing at RTO', status: 'pending', date: null },
      { name: 'Service Completed', status: 'pending', date: null }
    ]
  }
];

// Sample documents with hover preview
const sampleDocuments = [
  {
    id: 'doc-1',
    title: 'Driving License',
    type: 'Identity Document',
    category: 'License',
    dateAdded: '2024-06-15',
    expiryDate: '2029-06-14',
    status: 'valid' as 'valid',
    fileSize: '1.2 MB',
    fileType: 'PDF'
  },
  {
    id: 'doc-2',
    title: 'Vehicle Registration Certificate',
    type: 'Vehicle Document',
    category: 'Registration',
    dateAdded: '2024-02-10',
    expiryDate: '2025-02-09',
    status: 'valid' as 'valid',
    fileSize: '3.5 MB',
    fileType: 'PDF'
  },
  {
    id: 'doc-3',
    title: 'Insurance Policy',
    type: 'Insurance Document',
    category: 'Insurance',
    dateAdded: '2024-01-05',
    expiryDate: '2025-06-15',
    status: 'expiring' as 'expiring',
    fileSize: '2.8 MB',
    fileType: 'PDF'
  }
];

// Tutorial steps for Interactive Mascot Guide
const tutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome to RTO Services!',
    content: 'Hi there! I\'m Fixi, your guide to the new RTO Services module. Let me show you around the new features we\'ve added.',
    mascotState: 'happy' as 'happy'
  },
  {
    id: 'browse',
    title: 'Browse RTO Services',
    content: 'In the Browse tab, you can search for various RTO services available across India. Filter by state or category to find what you need.',
    mascotState: 'pointing' as 'pointing'
  },
  {
    id: 'compare',
    title: 'Compare Services',
    content: 'Found multiple services that interest you? Click the "Compare" button to add them to your comparison list, and compare up to 3 services side by side.',
    mascotState: 'thinking' as 'thinking'
  },
  {
    id: 'track',
    title: 'Track Your Applications',
    content: 'Use the Track tab to monitor the status of your RTO service applications. Enter your tracking ID or select from your recent services.',
    mascotState: 'pointing' as 'pointing'
  },
  {
    id: 'widgets',
    title: 'Personalized Dashboard',
    content: 'You can now customize your dashboard with widgets! Click "Customize" to add, remove, or rearrange widgets based on what\'s important to you.',
    mascotState: 'happy' as 'happy'
  },
  {
    id: 'preview',
    title: 'Document Hover Preview',
    content: 'Hover over documents to quickly preview their details without opening them. Try it out on the documents in the Related Documents section.',
    mascotState: 'pointing' as 'pointing'
  },
  {
    id: 'completed',
    title: 'You\'re All Set!',
    content: 'Great job! You now know how to use all the new features in the RTO Services module. Feel free to explore on your own!',
    mascotState: 'celebrating' as 'celebrating'
  }
];

const EnhancedRTOServices: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all-states');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [compareList, setCompareList] = useState<number[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  
  // Filter services based on search, state and category
  const filteredServices = rtoServices.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      service.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Add service to compare list
  const toggleCompare = (serviceId: number) => {
    if (compareList.includes(serviceId)) {
      setCompareList(compareList.filter(id => id !== serviceId));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, serviceId]);
      } else {
        toast({
          title: 'Compare limit reached',
          description: 'You can compare up to 3 services at a time',
          variant: 'destructive'
        });
      }
    }
  };

  // Track service by ID
  const trackService = () => {
    if (!trackingId.trim()) {
      toast({
        title: 'Tracking ID required',
        description: 'Please enter a valid tracking ID',
        variant: 'destructive'
      });
      return;
    }

    const result = trackingData.find(item => item.id === trackingId);
    
    if (result) {
      setTrackingResult(result);
      toast({
        title: 'Service found',
        description: `Found tracking details for ${result.service}`,
      });
    } else {
      setTrackingResult(null);
      toast({
        title: 'Not found',
        description: 'No service found with the provided tracking ID',
        variant: 'destructive'
      });
    }
  };

  // Book a service - In real app would navigate to form page or show modal
  const bookService = (serviceId: number) => {
    const service = rtoServices.find(s => s.id === serviceId);
    toast({
      title: 'Service booking initiated',
      description: `You are booking ${service?.name}. Please fill in required details.`,
    });
  };

  // Get status icon based on status string
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'processing':
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <XCircle className="h-5 w-5 text-rose-500" />;
    }
  };

  return (
    <AdvancedPageTransition>
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title="RTO Services" 
          description="Check, compare, book and track RTO services across India" 
          icon={<FileText />} 
        />

        {/* NEW: Personalized Dashboard Widgets */}
        <PersonalizedDashboardWidgets />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="track">Track</TabsTrigger>
          </TabsList>
          
          {/* Browse Services Tab */}
          <TabsContent value="browse" className="mt-6">
            <div className="flex flex-col space-y-6">
              {/* Search & Filter Section */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search for RTO services..."
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State/UT" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-states">All States/UTs</SelectItem>
                          {indianStates.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="license">Licenses</SelectItem>
                          <SelectItem value="registration">Registration</SelectItem>
                          <SelectItem value="certificates">Certificates</SelectItem>
                          <SelectItem value="permits">Permits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map(service => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <Badge variant={service.stateSpecific ? "outline" : "secondary"}>
                            {service.stateSpecific ? "State Specific" : "Pan India"}
                          </Badge>
                        </div>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-gray-500" />
                            <span>{formatCurrency(service.price)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{service.averageTime}</span>
                          </div>
                          <div className="flex items-center gap-2 col-span-2">
                            <div className="flex space-x-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < Math.floor(service.rating) ? "text-amber-500" : "text-gray-300"}>★</span>
                              ))}
                            </div>
                            <span className="text-gray-500">{service.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex justify-between w-full">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleCompare(service.id)}
                            className={compareList.includes(service.id) ? "bg-blue-50" : ""}
                          >
                            {compareList.includes(service.id) ? "Added to Compare" : "Compare"}
                          </Button>
                          <Button size="sm" onClick={() => bookService(service.id)}>
                            Book Now
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-blue-50 inline-flex p-3 rounded-full mb-4">
                    <Search className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium">No services found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
                </div>
              )}

              {compareList.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed bottom-6 right-6"
                >
                  <Button 
                    className="shadow-lg"
                    onClick={() => {
                      setIsComparing(true);
                      setActiveTab('compare');
                    }}
                  >
                    Compare {compareList.length} Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </TabsContent>
          
          {/* Compare Services Tab */}
          <TabsContent value="compare" className="mt-6">
            {compareList.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Services Comparison</CardTitle>
                  <CardDescription>Compare details of selected RTO services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Service</th>
                          {compareList.map(id => {
                            const service = rtoServices.find(s => s.id === id);
                            return (
                              <th key={id} className="text-left p-2">
                                {service?.name}
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="ml-2" 
                                  onClick={() => toggleCompare(id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="font-medium p-2">Description</td>
                          {compareList.map(id => {
                            const service = rtoServices.find(s => s.id === id);
                            return (
                              <td key={id} className="p-2">{service?.description}</td>
                            );
                          })}
                        </tr>
                        <tr className="border-b">
                          <td className="font-medium p-2">Price</td>
                          {compareList.map(id => {
                            const service = rtoServices.find(s => s.id === id);
                            return (
                              <td key={id} className="p-2">
                                {service ? formatCurrency(service.price) : ''}
                              </td>
                            );
                          })}
                        </tr>
                        <tr className="border-b">
                          <td className="font-medium p-2">Processing Time</td>
                          {compareList.map(id => {
                            const service = rtoServices.find(s => s.id === id);
                            return (
                              <td key={id} className="p-2">{service?.averageTime}</td>
                            );
                          })}
                        </tr>
                        <tr className="border-b">
                          <td className="font-medium p-2">Rating</td>
                          {compareList.map(id => {
                            const service = rtoServices.find(s => s.id === id);
                            return (
                              <td key={id} className="p-2">
                                {service && (
                                  <div className="flex items-center">
                                    <div className="flex space-x-0.5 mr-1">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < Math.floor(service.rating) ? "text-amber-500" : "text-gray-300"}>★</span>
                                      ))}
                                    </div>
                                    <span>{service.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                        <tr className="border-b">
                          <td className="font-medium p-2">Coverage</td>
                          {compareList.map(id => {
                            const service = rtoServices.find(s => s.id === id);
                            return (
                              <td key={id} className="p-2">
                                <Badge variant={service?.stateSpecific ? "outline" : "secondary"}>
                                  {service?.stateSpecific ? "State Specific" : "Pan India"}
                                </Badge>
                              </td>
                            );
                          })}
                        </tr>
                        <tr>
                          <td className="font-medium p-2">Action</td>
                          {compareList.map(id => {
                            return (
                              <td key={id} className="p-2">
                                <Button size="sm" onClick={() => bookService(id)}>
                                  Book Now
                                </Button>
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-16">
                <div className="bg-blue-50 inline-flex p-4 rounded-full mb-4">
                  <CheckSquare className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium">No services to compare</h3>
                <p className="text-gray-500 mt-2">Please select services to compare from the Browse tab</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('browse')}
                >
                  Browse Services
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Track Services Tab */}
          <TabsContent value="track" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Track Your RTO Service</CardTitle>
                <CardDescription>Enter your tracking ID to check the status of your service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter tracking ID (e.g., RTO24051)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="w-full md:w-2/3 lg:w-1/2"
                  />
                  <Button onClick={trackService}>Track</Button>
                </div>

                {trackingResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle>Tracking ID: {trackingResult.id}</CardTitle>
                            <CardDescription>{trackingResult.service}</CardDescription>
                          </div>
                          <div>
                            <Badge variant={
                              trackingResult.status === 'completed' ? 'secondary' :
                              trackingResult.status === 'processing' ? 'default' : 'outline'
                            }>
                              {trackingResult.status.charAt(0).toUpperCase() + trackingResult.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div>
                            <p className="text-sm text-gray-500">Submitted On</p>
                            <p className="font-medium">{new Date(trackingResult.submittedOn).toLocaleDateString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Estimated Completion</p>
                            <p className="font-medium">{new Date(trackingResult.estimatedCompletion).toLocaleDateString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payment Status</p>
                            <p className="font-medium capitalize">{trackingResult.paymentStatus}</p>
                          </div>
                        </div>

                        <h3 className="font-medium mb-4">Service Progress</h3>
                        <div className="space-y-4">
                          {trackingResult.steps.map((step: any, index: number) => (
                            <div key={index} className="flex items-start">
                              <div className="mr-3 mt-0.5">
                                {getStatusIcon(step.status)}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{step.name}</p>
                                <p className="text-sm text-gray-500">
                                  {step.date ? new Date(step.date).toLocaleDateString('en-IN') : 'Pending'}
                                </p>
                                {index < trackingResult.steps.length - 1 && (
                                  <div className="border-l-2 border-gray-200 h-6 ml-2 mt-1"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 rounded-b-lg">
                        <div className="w-full flex justify-between">
                          <p className="font-medium">Total Amount</p>
                          <p className="font-semibold">{formatCurrency(trackingResult.amount)}</p>
                        </div>
                      </CardFooter>
                    </Card>
                    
                    <div className="mt-4 text-right">
                      <Button variant="outline" className="mr-2">
                        Download Receipt
                      </Button>
                      <Button>
                        Need Help
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent RTO Services</CardTitle>
                <CardDescription>Track your recently accessed RTO services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.map(item => (
                    <div key={item.id} className="flex items-center border p-3 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => {
                      setTrackingId(item.id);
                      setTrackingResult(item);
                    }}>
                      <div className="mr-3">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.service}</p>
                        <p className="text-sm text-gray-500">Tracking ID: {item.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Submitted: {new Date(item.submittedOn).toLocaleDateString('en-IN')}
                        </p>
                        <Badge variant={
                          item.status === 'completed' ? 'secondary' :
                          item.status === 'processing' ? 'default' : 'outline'
                        } className="mt-1">
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-2 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* NEW: Related Documents with Hover Preview */}
        <div className="mt-10">
          <h3 className="text-lg font-medium mb-4">Related Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleDocuments.map((document) => (
              <DocumentHoverCard key={document.id} document={document}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">{document.title}</CardTitle>
                    <CardDescription className="text-xs">{document.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1 text-blue-500" />
                        <span>{document.category}</span>
                      </div>
                      <Badge variant="outline" className="text-xs h-5">
                        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </DocumentHoverCard>
            ))}
          </div>
        </div>

        {/* NEW: Interactive Mascot Tutorial Guide */}
        <InteractiveMascotGuide 
          tutorialId="rto-services-intro"
          steps={tutorialSteps}
          autoStart={true}
          mascotName="Fixi"
          delay={1500}
        />
      </div>
    </AdvancedPageTransition>
  );
};

export default EnhancedRTOServices;