import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Car, 
  Award, 
  Clipboard, 
  Bike
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';

// Define types for courses, services, and tests
type CourseType = {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  icon: React.ElementType;
  color: string;
};

type RTOServiceType = {
  id: string;
  title: string;
  description: string;
  price: number;
  timeline: string;
  requirements: string[];
  icon: React.ElementType;
  color: string;
};

type TestType = {
  id: string;
  title: string;
  description: string;
  questions: number;
  duration: string;
  icon: React.ElementType;
  color: string;
};

const LearningServiceCards = () => {
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showRTODialog, setShowRTODialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState('car');
  const [selectedRTOTab, setSelectedRTOTab] = useState('new');
  const [selectedTestTab, setSelectedTestTab] = useState('practice');
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [selectedService, setSelectedService] = useState<RTOServiceType | null>(null);
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Available driving courses
  const drivingCourses: Record<string, CourseType[]> = {
    car: [
      {
        id: 'car-basic',
        title: 'Car Driving - Basic',
        description: 'Perfect for beginners with no prior experience. Learn car controls, traffic rules, and basic driving skills.',
        price: 6999,
        duration: '15 days (15 sessions)',
        icon: Car,
        color: 'blue'
      },
      {
        id: 'car-advanced',
        title: 'Car Driving - Advanced',
        description: 'For those with basic experience. Master advanced techniques, highway driving, and difficult traffic situations.',
        price: 8999,
        duration: '10 days (10 sessions)',
        icon: Car,
        color: 'blue'
      }
    ],
    two: [
      {
        id: 'two-basic',
        title: 'Two-Wheeler Basics',
        description: 'Learn balance, control, and safe riding practices for scooters and motorcycles in city traffic.',
        price: 3999,
        duration: '10 days (10 sessions)',
        icon: Bike,
        color: 'indigo'
      },
      {
        id: 'two-advanced',
        title: 'Two-Wheeler Advanced',
        description: 'Master advanced riding techniques, defensive riding, and handling various road conditions.',
        price: 5999,
        duration: '7 days (7 sessions)',
        icon: Bike,
        color: 'indigo'
      }
    ]
  };

  // RTO Services
  const rtoServices: Record<string, RTOServiceType[]> = {
    new: [
      {
        id: 'learner',
        title: 'Learner License',
        description: 'Get your learner license with end-to-end assistance from document preparation to test passing.',
        price: 1499,
        timeline: '3-5 working days',
        requirements: [
          'Age proof (Aadhar/PAN/Passport)',
          'Address proof',
          'Passport size photographs',
          'Form 1 filled and signed'
        ],
        icon: FileText,
        color: 'amber'
      },
      {
        id: 'permanent',
        title: 'Permanent Driving License',
        description: 'Complete assistance for obtaining permanent driving license after learner license period.',
        price: 2499,
        timeline: '7-10 working days',
        requirements: [
          'Learner license (completed 30 days period)',
          'Age proof',
          'Address proof',
          'Passport size photographs',
          'Form 2 filled and signed'
        ],
        icon: FileText,
        color: 'amber'
      }
    ],
    renew: [
      {
        id: 'renewal',
        title: 'License Renewal',
        description: 'Hassle-free renewal of expired or about-to-expire driving license with minimal paperwork.',
        price: 1999,
        timeline: '5-7 working days',
        requirements: [
          'Existing driving license',
          'Address proof',
          'Passport size photographs',
          'Form 9 filled and signed',
          'Medical certificate (for 55+ age)'
        ],
        icon: FileText,
        color: 'amber'
      },
      {
        id: 'duplicate',
        title: 'Duplicate License',
        description: 'Get a replacement for lost, stolen, or damaged driving license quickly.',
        price: 1499,
        timeline: '3-5 working days',
        requirements: [
          'FIR copy (for lost license)',
          'Address proof',
          'Passport size photographs',
          'Damaged license (if applicable)'
        ],
        icon: FileText,
        color: 'amber'
      }
    ]
  };

  // Test preparation options
  const testOptions: Record<string, TestType[]> = {
    practice: [
      {
        id: 'signs',
        title: 'Traffic Signs Practice',
        description: 'Practice tests focused on traffic signs and symbols with detailed explanations.',
        questions: 25,
        duration: 'Unlimited time',
        icon: Clipboard,
        color: 'green'
      },
      {
        id: 'rules',
        title: 'Traffic Rules Practice',
        description: 'Test your knowledge of road rules, regulations, and safe driving practices.',
        questions: 30,
        duration: 'Unlimited time',
        icon: Clipboard,
        color: 'green'
      }
    ],
    mock: [
      {
        id: 'mock-test',
        title: 'Full Mock Test',
        description: 'Simulated RTO test environment with timed questions and passing score requirement.',
        questions: 40,
        duration: '30 minutes',
        icon: Clipboard,
        color: 'purple'
      },
      {
        id: 'mock-advanced',
        title: 'Advanced Mock Test',
        description: 'Challenging mock test with difficult questions for thorough preparation.',
        questions: 50,
        duration: '40 minutes',
        icon: Clipboard,
        color: 'purple'
      }
    ]
  };

  // Form schema for course enquiry
  const enquirySchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    phone: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit mobile number' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    preferredDate: z.string().min(1, { message: 'Please select a preferred date' }),
    preferredLocation: z.string().min(1, { message: 'Please select a preferred location' })
  });

  // Form schema for RTO application
  const applicationSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    phone: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit mobile number' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    address: z.string().min(10, { message: 'Please enter your complete address' }),
    idProof: z.string().min(1, { message: 'Please select an ID proof type' }),
    rtoLocation: z.string().min(1, { message: 'Please select an RTO location' })
  });

  // Form schema for test registration
  const testRegistrationSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    phone: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit mobile number' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    licenseStatus: z.string().min(1, { message: 'Please select your license status' })
  });

  // Course enquiry form
  const enquiryForm = useForm<z.infer<typeof enquirySchema>>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      preferredDate: '',
      preferredLocation: ''
    }
  });

  // RTO application form
  const applicationForm = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      idProof: '',
      rtoLocation: ''
    }
  });

  // Test registration form
  const testRegistrationForm = useForm<z.infer<typeof testRegistrationSchema>>({
    resolver: zodResolver(testRegistrationSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      licenseStatus: ''
    }
  });

  // Submit handling for course enquiry
  const handleEnquirySubmit = (values: z.infer<typeof enquirySchema>) => {
    console.log('Course enquiry values:', values);
    // Simulate API call
    setTimeout(() => {
      setFormSuccess(true);
      toast({
        title: 'Enquiry submitted successfully!',
        description: 'Our team will contact you shortly.',
      });
    }, 1000);
  };

  // Submit handling for RTO application
  const handleApplicationSubmit = (values: z.infer<typeof applicationSchema>) => {
    console.log('RTO application values:', values);
    // Simulate API call
    setTimeout(() => {
      setFormSuccess(true);
      toast({
        title: 'Application submitted successfully!',
        description: 'Your application has been received. We will contact you soon.',
      });
    }, 1000);
  };

  // Submit handling for test registration
  const handleTestRegistrationSubmit = (values: z.infer<typeof testRegistrationSchema>) => {
    console.log('Test registration values:', values);
    // Simulate API call
    setTimeout(() => {
      setFormSuccess(true);
      toast({
        title: 'Registration successful!',
        description: 'You have been registered for the test preparation.',
      });
    }, 1000);
  };

  // Handle course selection
  const handleCourseSelect = (course: CourseType) => {
    setSelectedCourse(course);
    setShowEnquiryForm(true);
  };

  // Handle service selection
  const handleServiceSelect = (service: RTOServiceType) => {
    setSelectedService(service);
    setShowApplicationForm(true);
  };

  // Handle test selection
  const handleTestSelect = (test: TestType) => {
    setSelectedTest(test);
    setShowTestForm(true);
  };

  // Reset states when dialog closes
  const handleDialogClose = () => {
    setSelectedCourse(null);
    setSelectedService(null);
    setSelectedTest(null);
    setShowEnquiryForm(false);
    setShowApplicationForm(false);
    setShowTestForm(false);
    setFormSuccess(false);
    enquiryForm.reset();
    applicationForm.reset();
    testRegistrationForm.reset();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Driving Courses */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
          onClick={() => setShowCourseDialog(true)}
        >
          <CardContent className="p-4">
            <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center mb-3">
              <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Driving Courses</h3>
            <p className="text-indigo-600 dark:text-indigo-400 text-sm mb-4">
              Learn driving from certified experts with personalized courses for your needs
            </p>
            <Button variant="outline" className="w-full">Browse Courses</Button>
          </CardContent>
        </Card>
        
        {/* RTO Services */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
          onClick={() => setShowRTODialog(true)}
        >
          <CardContent className="p-4">
            <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/30 w-12 h-12 flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">RTO Services</h3>
            <p className="text-amber-600 dark:text-amber-400 text-sm mb-4">
              Get assistance with license applications, renewals, and other RTO services
            </p>
            <Button variant="outline" className="w-full">View Services</Button>
          </CardContent>
        </Card>
        
        {/* Driving Test Prep */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
          onClick={() => setShowTestDialog(true)}
        >
          <CardContent className="p-4">
            <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/30 w-12 h-12 flex items-center justify-center mb-3">
              <Clipboard className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Driving Test Prep</h3>
            <p className="text-green-600 dark:text-green-400 text-sm mb-4">
              Practice tests, tips, and resources to help you pass your driving test easily
            </p>
            <Button variant="outline" className="w-full">Start Preparation</Button>
          </CardContent>
        </Card>
      </div>

      {/* Driving Courses Dialog */}
      <Dialog open={showCourseDialog} onOpenChange={(open) => {
        if (!open) handleDialogClose();
        setShowCourseDialog(open);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Driving Courses</DialogTitle>
            <DialogDescription>
              Select a course type to browse available options
            </DialogDescription>
          </DialogHeader>

          {!selectedCourse && !showEnquiryForm && !formSuccess && (
            <div className="p-6">
              <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="car">Car Driving</TabsTrigger>
                  <TabsTrigger value="two">Two-Wheeler</TabsTrigger>
                </TabsList>

                {['car', 'two'].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="mt-0">
                    <div className="grid gap-4">
                      {drivingCourses[tabValue].map((course) => (
                        <Card key={course.id} className="cursor-pointer hover:shadow-md" onClick={() => handleCourseSelect(course)}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold">{course.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                                <div className="flex gap-3 mt-3 text-sm">
                                  <span className="flex items-center gap-1 text-gray-600">
                                    <FileText className="h-4 w-4" />
                                    {course.duration}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-xl text-primary">₹{course.price}</span>
                                <p className="text-xs text-gray-500">inclusive of all taxes</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          {/* Course Enquiry Form */}
          {selectedCourse && showEnquiryForm && !formSuccess && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold">{selectedCourse.title}</h3>
                <p className="text-sm text-gray-500">{selectedCourse.description}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <FileText className="h-4 w-4" />
                    {selectedCourse.duration}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <span className="font-bold text-primary">₹{selectedCourse.price}</span>
                  </span>
                </div>
              </div>

              <Form {...enquiryForm}>
                <form onSubmit={enquiryForm.handleSubmit(handleEnquirySubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={enquiryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={enquiryForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="10-digit mobile number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={enquiryForm.control}
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
                      control={enquiryForm.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Start Date</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Select preferred start date</option>
                              <option value="immediate">Immediately</option>
                              <option value="1week">Within a week</option>
                              <option value="2weeks">In 2 weeks</option>
                              <option value="month">Next month</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={enquiryForm.control}
                      name="preferredLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Location</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Select preferred location</option>
                              <option value="andheri">Andheri, Mumbai</option>
                              <option value="bandra">Bandra, Mumbai</option>
                              <option value="dadar">Dadar, Mumbai</option>
                              <option value="thane">Thane</option>
                              <option value="navi">Navi Mumbai</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <a 
                        href="https://example.com/download/brochure" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Download Course Brochure
                      </a>
                      <a 
                        href="https://example.com/download/demo" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Watch Course Demo
                      </a>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button type="button" variant="outline" onClick={() => {
                        setSelectedCourse(null);
                        setShowEnquiryForm(false);
                      }}>
                        Back
                      </Button>
                      <Button type="submit">Submit Enquiry</Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Success Message */}
          {formSuccess && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Enquiry Submitted Successfully!</h3>
              <p className="text-gray-500 mb-6">
                Thank you for your interest in our driving course. Our team will contact you shortly to confirm your booking.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Reference Number:</span>
                  <span className="font-bold">{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
                {selectedCourse && (
                  <>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Course:</span>
                      <span>{selectedCourse.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fee:</span>
                      <span>₹{selectedCourse.price}</span>
                    </div>
                  </>
                )}
              </div>
              <Button onClick={() => setShowCourseDialog(false)} className="w-full">Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* RTO Services Dialog */}
      <Dialog open={showRTODialog} onOpenChange={(open) => {
        if (!open) handleDialogClose();
        setShowRTODialog(open);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>RTO Services</DialogTitle>
            <DialogDescription>
              Select a service type to view available options
            </DialogDescription>
          </DialogHeader>

          {!selectedService && !showApplicationForm && !formSuccess && (
            <div className="p-6">
              <Tabs defaultValue={selectedRTOTab} onValueChange={setSelectedRTOTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="new">New License</TabsTrigger>
                  <TabsTrigger value="renew">Renewal & Others</TabsTrigger>
                </TabsList>

                {['new', 'renew'].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="mt-0">
                    <div className="grid gap-4">
                      {rtoServices[tabValue].map((service) => (
                        <Card key={service.id} className="cursor-pointer hover:shadow-md" onClick={() => handleServiceSelect(service)}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold">{service.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                                <div className="flex gap-3 mt-3 text-sm">
                                  <span className="flex items-center gap-1 text-gray-600">
                                    <FileText className="h-4 w-4" />
                                    {service.timeline}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-xl text-primary">₹{service.price}</span>
                                <p className="text-xs text-gray-500">service fee</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          {/* RTO Application Form */}
          {selectedService && showApplicationForm && !formSuccess && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold">{selectedService.title}</h3>
                <p className="text-sm text-gray-500">{selectedService.description}</p>
                
                <div className="mt-4 bg-amber-50 p-3 rounded-md">
                  <h4 className="font-medium text-amber-800 mb-2">Required Documents</h4>
                  <ul className="list-disc list-inside text-sm text-amber-700">
                    {selectedService.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3 mt-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <FileText className="h-4 w-4" />
                    {selectedService.timeline}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <span className="font-bold text-primary">₹{selectedService.price}</span>
                  </span>
                </div>
              </div>

              <Form {...applicationForm}>
                <form onSubmit={applicationForm.handleSubmit(handleApplicationSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={applicationForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
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
                            <Input placeholder="10-digit mobile number" {...field} />
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
                      name="idProof"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Proof Type</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Select ID proof type</option>
                              <option value="aadhar">Aadhar Card</option>
                              <option value="pan">PAN Card</option>
                              <option value="passport">Passport</option>
                              <option value="voter">Voter ID</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Complete Address</FormLabel>
                          <FormControl>
                            <textarea 
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                              placeholder="Enter your complete address" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={applicationForm.control}
                      name="rtoLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred RTO Location</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Select RTO location</option>
                              <option value="andheri">Andheri RTO, Mumbai</option>
                              <option value="wadala">Wadala RTO, Mumbai</option>
                              <option value="tardeo">Tardeo RTO, Mumbai</option>
                              <option value="thane">Thane RTO</option>
                              <option value="vashi">Vashi RTO, Navi Mumbai</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => {
                      setSelectedService(null);
                      setShowApplicationForm(false);
                    }}>
                      Back
                    </Button>
                    <Button type="submit">Submit Application</Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Success Message */}
          {formSuccess && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Application Submitted Successfully!</h3>
              <p className="text-gray-500 mb-6">
                Your application has been received. Our RTO expert will contact you within 24 hours to collect necessary documents and guide you through the process.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Application ID:</span>
                  <span className="font-bold">RTO-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
                {selectedService && (
                  <>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Service:</span>
                      <span>{selectedService.title}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Fee:</span>
                      <span>₹{selectedService.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Timeline:</span>
                      <span>{selectedService.timeline}</span>
                    </div>
                  </>
                )}
              </div>
              <Button onClick={() => setShowRTODialog(false)} className="w-full">Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Test Preparation Dialog */}
      <Dialog open={showTestDialog} onOpenChange={(open) => {
        if (!open) handleDialogClose();
        setShowTestDialog(open);
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Driving Test Preparation</DialogTitle>
            <DialogDescription>
              Select a test type to begin your preparation
            </DialogDescription>
          </DialogHeader>

          {!selectedTest && !showTestForm && !formSuccess && (
            <div className="p-6">
              <Tabs defaultValue={selectedTestTab} onValueChange={setSelectedTestTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="practice">Practice Tests</TabsTrigger>
                  <TabsTrigger value="mock">Mock Exams</TabsTrigger>
                </TabsList>

                {['practice', 'mock'].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="mt-0">
                    <div className="grid gap-4">
                      {testOptions[tabValue].map((test) => (
                        <Card key={test.id} className="cursor-pointer hover:shadow-md" onClick={() => handleTestSelect(test)}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold">{test.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{test.description}</p>
                                <div className="flex gap-3 mt-3 text-sm">
                                  <span className="flex items-center gap-1 text-gray-600">
                                    <Clipboard className="h-4 w-4" />
                                    {test.questions} questions
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-600">
                                    <FileText className="h-4 w-4" />
                                    {test.duration}
                                  </span>
                                </div>
                              </div>
                              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                {tabValue === 'practice' ? 'Free' : 'Premium'}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          {/* Test Registration Form */}
          {selectedTest && showTestForm && !formSuccess && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold">{selectedTest.title}</h3>
                <p className="text-sm text-gray-500">{selectedTest.description}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Clipboard className="h-4 w-4" />
                    {selectedTest.questions} questions
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <FileText className="h-4 w-4" />
                    {selectedTest.duration}
                  </span>
                </div>
              </div>

              <Form {...testRegistrationForm}>
                <form onSubmit={testRegistrationForm.handleSubmit(handleTestRegistrationSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={testRegistrationForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={testRegistrationForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="10-digit mobile number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={testRegistrationForm.control}
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
                      control={testRegistrationForm.control}
                      name="licenseStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Status</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Select your license status</option>
                              <option value="none">No license yet</option>
                              <option value="learner">Have learner's license</option>
                              <option value="permanent">Have permanent license</option>
                              <option value="expired">Expired license</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => {
                      setSelectedTest(null);
                      setShowTestForm(false);
                    }}>
                      Back
                    </Button>
                    <Button type="submit">Start Test Preparation</Button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Success Message */}
          {formSuccess && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
              <p className="text-gray-500 mb-6">
                You have been registered for the test preparation. You can now access the tests and start practicing.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Registration ID:</span>
                  <span className="font-bold">TP-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
                {selectedTest && (
                  <>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Test Type:</span>
                      <span>{selectedTest.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Questions:</span>
                      <span>{selectedTest.questions}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button variant="outline" onClick={() => setShowTestDialog(false)}>Close</Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Start Practice Now
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LearningServiceCards;