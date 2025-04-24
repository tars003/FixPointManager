import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  UserCheck, 
  Car, 
  Calendar, 
  ClipboardCheck, 
  MapPin, 
  Search,
  CreditCard,
  ChevronRight,
  Clock,
  AlertCircle,
  Check
} from 'lucide-react';

const RTOServices = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [selectedRTO, setSelectedRTO] = useState<string | null>(null);
  
  const services = [
    {
      id: 'learners-license',
      title: "New Learner's License",
      description: "Apply for a new learner's license to begin your driving journey",
      icon: <UserCheck className="h-10 w-10" />,
      fee: "₹350",
      processingTime: "7-10 working days",
      documents: ["Aadhaar Card", "Passport Size Photos", "Address Proof", "Age Proof"]
    },
    {
      id: 'driving-test',
      title: "Driving License Test",
      description: "Book your driving test to obtain a permanent driving license",
      icon: <Car className="h-10 w-10" />,
      fee: "₹650",
      processingTime: "15-20 working days",
      documents: ["Learner's License", "Aadhaar Card", "Passport Size Photos", "Medical Certificate"]
    },
    {
      id: 'license-renewal',
      title: "License Renewal",
      description: "Renew your existing driving license before or after expiry",
      icon: <Calendar className="h-10 w-10" />,
      fee: "₹500",
      processingTime: "10-15 working days",
      documents: ["Existing License", "Aadhaar Card", "Passport Size Photos", "Medical Certificate (if above 40 years)"]
    },
    {
      id: 'vehicle-registration',
      title: "Vehicle Registration",
      description: "Register your new vehicle with the RTO",
      icon: <ClipboardCheck className="h-10 w-10" />,
      fee: "₹2,500 - ₹5,000",
      processingTime: "7-14 working days",
      documents: ["Vehicle Invoice", "Insurance Certificate", "Pollution Certificate", "Address Proof"]
    },
    {
      id: 'ownership-transfer',
      title: "Ownership Transfer",
      description: "Transfer vehicle ownership to your name",
      icon: <FileText className="h-10 w-10" />,
      fee: "₹1,500 - ₹3,000",
      processingTime: "15-30 working days",
      documents: ["Sale Agreement", "Original RC", "Insurance Certificate", "Seller's NOC", "PUC Certificate"]
    },
    {
      id: 'international-permit',
      title: "International Driving Permit",
      description: "Get authorized to drive internationally with valid permit",
      icon: <Car className="h-10 w-10" />,
      fee: "₹1,200",
      processingTime: "7-10 working days",
      documents: ["Valid Indian Driving License", "Passport", "Visa (if available)", "Application Form"]
    }
  ];
  
  const rtoOffices = [
    {
      id: 'rto-andheri',
      name: 'Andheri RTO Office',
      address: 'Andheri East, Mumbai, Maharashtra 400069',
      distance: '3.2 km',
      crowdStatus: 'Moderate',
      waitTime: '~45 minutes',
      phone: '022-26670407'
    },
    {
      id: 'rto-borivali',
      name: 'Borivali RTO Office',
      address: 'Western Express Highway, Borivali East, Mumbai, Maharashtra 400066',
      distance: '8.5 km',
      crowdStatus: 'Low',
      waitTime: '~20 minutes',
      phone: '022-28772516'
    },
    {
      id: 'rto-thane',
      name: 'Thane RTO Office',
      address: 'Wagle Industrial Estate, Thane West, Maharashtra 400604',
      distance: '12.7 km',
      crowdStatus: 'High',
      waitTime: '~90 minutes',
      phone: '022-25821404'
    }
  ];
  
  const renderServiceSelection = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-dark">Select RTO Service</h2>
          <p className="text-neutral-light mt-1">Choose the service you need assistance with</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card 
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedService === service.id ? 'border-2 border-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <div className="text-primary">
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-base mb-2">{service.title}</h3>
                  <p className="text-neutral-light text-sm mb-4">{service.description}</p>
                  
                  <div className="w-full p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-light">Fee:</span>
                      <span className="font-medium">{service.fee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-light">Processing Time:</span>
                      <span className="font-medium">{service.processingTime}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full"
                    onClick={() => {
                      setSelectedService(service.id);
                      setStep(2);
                    }}
                  >
                    Select Service
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  const renderLocationSelection = () => {
    const selectedServiceData = services.find(s => s.id === selectedService);
    
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-dark">Select RTO Office</h2>
            <p className="text-neutral-light mt-1">Choose the RTO office location for your {selectedServiceData?.title}</p>
          </div>
          <Button variant="outline" onClick={() => setStep(1)}>
            Back to Services
          </Button>
        </div>
        
        {/* Location search */}
        <div className="rounded-lg bg-gray-50 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Enter your PIN code or city..." 
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm text-neutral-light">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Showing RTO offices near: Mumbai</span>
            </div>
            <Button variant="outline" size="sm">
              Use Current Location
            </Button>
          </div>
        </div>
        
        {/* RTO offices list */}
        <div className="space-y-4">
          {rtoOffices.map((office) => (
            <Card 
              key={office.id}
              className={`cursor-pointer transition-all hover:shadow-sm ${
                selectedRTO === office.id ? 'border-2 border-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedRTO(office.id)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{office.name}</h3>
                    <p className="text-sm text-neutral-light">{office.address}</p>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className="mr-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {office.distance}
                      </Badge>
                      <Badge variant={
                        office.crowdStatus === 'Low' 
                          ? 'outline' 
                          : office.crowdStatus === 'Moderate' 
                            ? 'secondary' 
                            : 'destructive'
                      } className="mr-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {office.waitTime}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`py-2 px-3 rounded-full text-xs font-medium ${
                      office.crowdStatus === 'Low' 
                        ? 'bg-green-100 text-green-700' 
                        : office.crowdStatus === 'Moderate' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-red-100 text-red-700'
                    }`}>
                      {office.crowdStatus} Crowd
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedRTO(office.id);
                        setStep(3);
                      }}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {selectedRTO && (
          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => setStep(3)}
            >
              Continue with Selected RTO
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  const renderDocumentGuide = () => {
    const selectedServiceData = services.find(s => s.id === selectedService);
    const selectedRTOData = rtoOffices.find(r => r.id === selectedRTO);
    
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-dark">Document Checklist</h2>
            <p className="text-neutral-light mt-1">Required documents for {selectedServiceData?.title}</p>
          </div>
          <Button variant="outline" onClick={() => setStep(2)}>
            Back to RTO Selection
          </Button>
        </div>
        
        {/* Selected service and RTO summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-semibold">{selectedServiceData?.title}</h3>
                <p className="text-sm text-neutral-light">at {selectedRTOData?.name}</p>
              </div>
              <div className="text-sm">
                <div className="flex justify-between md:justify-start md:space-x-6">
                  <div>
                    <span className="text-neutral-light">Fee:</span>
                    <span className="font-medium ml-1">{selectedServiceData?.fee}</span>
                  </div>
                  <div>
                    <span className="text-neutral-light">Processing:</span>
                    <span className="font-medium ml-1">{selectedServiceData?.processingTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Document checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Required Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedServiceData?.documents.map((document, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-lg border"
              >
                <div>
                  <FileText className="h-6 w-6 text-neutral-light" />
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="font-medium">{document}</h4>
                  <p className="text-sm text-neutral-light">Original document required for verification</p>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Upload
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Aadhar integration notice */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
          <div className="mr-3 mt-1">
            <Check className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h4 className="font-medium text-green-700">Aadhaar DigiLocker Integration Available</h4>
            <p className="text-sm text-green-600 mt-1">
              You can directly verify your identity and address documents through your Aadhaar-linked DigiLocker account.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 mt-3">
              Connect DigiLocker
            </Button>
          </div>
        </div>
        
        {/* Document photography guide */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Document Photography Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="border rounded-lg p-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-medium mb-1">Good Lighting</h4>
                <p className="text-sm text-neutral-light">Ensure documents are photographed in well-lit conditions</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-medium mb-1">Full Document</h4>
                <p className="text-sm text-neutral-light">Capture all corners and edges of the document</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-medium mb-1">Clear & Sharp</h4>
                <p className="text-sm text-neutral-light">Ensure text is readable without blur</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setStep(2)}>
            Back
          </Button>
          <Button onClick={() => setStep(4)}>
            Continue to Appointment
          </Button>
        </div>
      </div>
    );
  };
  
  const renderAppointmentBooking = () => {
    const selectedServiceData = services.find(s => s.id === selectedService);
    const selectedRTOData = rtoOffices.find(r => r.id === selectedRTO);
    
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-dark">Book RTO Appointment</h2>
            <p className="text-neutral-light mt-1">Select your preferred date and time</p>
          </div>
          <Button variant="outline" onClick={() => setStep(3)}>
            Back to Documents
          </Button>
        </div>
        
        {/* Calendar for date selection - simplified version */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {/* Sample calendar cells - this would be dynamic in a real implementation */}
              {Array.from({ length: 31 }, (_, i) => (
                <div 
                  key={i}
                  className={`h-12 flex items-center justify-center rounded-md cursor-pointer ${
                    i === 15 
                      ? 'bg-primary text-white font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Time slot selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Select Time Slot</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="10am">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="9am" id="9am" />
                  <Label htmlFor="9am">9:00 AM - 10:00 AM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10am" id="10am" />
                  <Label htmlFor="10am">10:00 AM - 11:00 AM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="11am" id="11am" />
                  <Label htmlFor="11am">11:00 AM - 12:00 PM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12pm" id="12pm" />
                  <Label htmlFor="12pm">12:00 PM - 1:00 PM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2pm" id="2pm" />
                  <Label htmlFor="2pm">2:00 PM - 3:00 PM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3pm" id="3pm" />
                  <Label htmlFor="3pm">3:00 PM - 4:00 PM</Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        {/* Premium service options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Service Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Standard Process</h4>
                    <p className="text-sm text-neutral-light">Regular queue number</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-medium mr-3">Free</span>
                  <RadioGroup defaultValue="standard">
                    <RadioGroupItem value="standard" id="standard" checked />
                  </RadioGroup>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg border-primary bg-primary/5">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Premium Skip-the-Line</h4>
                    <p className="text-sm text-neutral-light">Priority handling with minimal waiting</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-medium mr-3">+₹500</span>
                  <RadioGroup defaultValue="premium">
                    <RadioGroupItem value="premium" id="premium" checked />
                  </RadioGroup>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Document Assistance</h4>
                    <p className="text-sm text-neutral-light">Help with form filling and document preparation</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-medium mr-3">+₹300</span>
                  <RadioGroup defaultValue="assistance">
                    <RadioGroupItem value="assistance" id="assistance" />
                  </RadioGroup>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Summary and payment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Appointment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-light">Service:</span>
                <span className="font-medium">{selectedServiceData?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-light">Location:</span>
                <span className="font-medium">{selectedRTOData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-light">Date & Time:</span>
                <span className="font-medium">15 May 2023, 10:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-light">Service Type:</span>
                <span className="font-medium">Premium Skip-the-Line</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-medium">
                <span>Base Fee:</span>
                <span>{selectedServiceData?.fee}</span>
              </div>
              <div className="flex justify-between text-neutral-light mt-1">
                <span>Premium Service:</span>
                <span>₹500</span>
              </div>
              <div className="flex justify-between font-medium text-lg mt-3 pt-3 border-t">
                <span>Total:</span>
                <span className="text-primary">₹1,150</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Proceed to Payment
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return renderServiceSelection();
      case 2:
        return renderLocationSelection();
      case 3:
        return renderDocumentGuide();
      case 4:
        return renderAppointmentBooking();
      default:
        return renderServiceSelection();
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-dark lg:block hidden">RTO Services</h2>
        <p className="text-neutral-light mt-1">Hassle-free assistance with RTO processes and documentation</p>
      </div>
      
      {/* Progress indicator for multi-step process */}
      {selectedService && (
        <div className="mb-8 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-light">Step {step} of 4</span>
            <span className="text-sm text-neutral-light">
              {step === 1 ? 'Service Selection' : 
              step === 2 ? 'RTO Location' : 
              step === 3 ? 'Documents' : 'Appointment'}
            </span>
          </div>
          <Progress value={(step / 4) * 100} />
        </div>
      )}
      
      <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="services" className="flex items-center justify-center">
            <FileText className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center justify-center">
            <Clock className="h-4 w-4 mr-2" />
            Track Status
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center justify-center">
            <MapPin className="h-4 w-4 mr-2" />
            RTO Offices
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            FAQs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="services">
          {renderStepContent()}
        </TabsContent>
        
        <TabsContent value="status">
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-neutral-dark">Track Application Status</h2>
              <p className="text-neutral-light mt-1">Check the current status of your RTO application</p>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="application-number">Application Number</Label>
                    <Input id="application-number" placeholder="Enter your application number" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="mobile-number">Mobile Number</Label>
                    <Input id="mobile-number" placeholder="Enter registered mobile number" className="mt-1" />
                  </div>
                  <Button className="w-full">
                    Track Status
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-center p-6 border border-dashed rounded-lg">
              <p className="text-neutral-light text-center">
                Enter your application details above to check the status
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="locations">
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-neutral-dark">RTO Office Locations</h2>
              <p className="text-neutral-light mt-1">Find RTO offices near you with real-time crowd information</p>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search by city, state or PIN code..." 
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {rtoOffices.map((office) => (
                <Card key={office.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{office.name}</h3>
                        <p className="text-sm text-neutral-light">{office.address}</p>
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className="mr-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {office.distance}
                          </Badge>
                          <Badge variant={
                            office.crowdStatus === 'Low' 
                              ? 'outline' 
                              : office.crowdStatus === 'Moderate' 
                                ? 'secondary' 
                                : 'destructive'
                          } className="mr-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {office.waitTime}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-center">
                        <div className={`py-2 px-3 rounded-full text-xs font-medium mb-2 ${
                          office.crowdStatus === 'Low' 
                            ? 'bg-green-100 text-green-700' 
                            : office.crowdStatus === 'Moderate' 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-red-100 text-red-700'
                        }`}>
                          {office.crowdStatus} Crowd
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Navigate
                          </Button>
                          <Button size="sm">
                            Book Appointment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="faqs">
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-neutral-dark">Frequently Asked Questions</h2>
              <p className="text-neutral-light mt-1">Common questions about RTO services and processes</p>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold">What documents are required for a new learner's license?</h3>
                  <p className="text-neutral-light mt-2">
                    For a new learner's license, you typically need your Aadhaar card, passport-sized photographs, address proof, age proof, and a filled application form. Medical certificates may be required for specific license categories.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold">How long does it take to get a permanent driving license?</h3>
                  <p className="text-neutral-light mt-2">
                    After passing your driving test, it typically takes 15-20 working days to receive your permanent driving license. With premium processing, this can be expedited to 7-10 working days.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Can I transfer my vehicle registration from one state to another?</h3>
                  <p className="text-neutral-light mt-2">
                    Yes, you can transfer your vehicle registration to another state. You'll need to obtain an NOC from your current RTO, apply for registration in the new state, and pay the applicable road tax differences. We offer complete assistance with this process.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold">What is the validity period of a driving license in India?</h3>
                  <p className="text-neutral-light mt-2">
                    A driving license in India is generally valid for 20 years from the date of issue or until the holder reaches the age of 40, whichever is earlier. After 40, the license is renewed for 5-year periods.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold">How many attempts are allowed for the driving test?</h3>
                  <p className="text-neutral-light mt-2">
                    If you fail the driving test, you can apply for a retest after 7 days. There is no specific limit on the number of attempts, but each attempt requires a separate fee payment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-primary/5 rounded-xl p-6 mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-4">
            <h3 className="text-xl font-semibold mb-2">Need personalized assistance?</h3>
            <p className="text-neutral-light">Our experts can guide you through any RTO process step by step.</p>
          </div>
          <Button size="lg">
            Speak with an RTO Expert
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RTOServices;