import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Calculator, Shield, Check, 
  FileCheck, History, Award, ShieldCheck, Car, Calendar,
  Gauge
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

// CertifiedPreowned Component
const CertifiedPreowned: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-amber-50 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 p-1.5 rounded-md">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
          </div>
          <CardTitle className="text-lg">Certified Pre-owned</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="font-medium text-base mb-2">AutoVista Certification Process</h3>
          <p className="text-sm text-neutral-600 mb-4">
            Every certified pre-owned vehicle undergoes a rigorous 150+ point inspection process.
          </p>
          
          <div className="space-y-3">
            {[
              { 
                title: 'Mechanical Inspection',
                description: 'Engine, transmission, steering, brakes, and suspension systems thoroughly tested',
                icon: <Gauge className="h-4 w-4 text-amber-600" />
              },
              { 
                title: 'Interior & Exterior',
                description: 'Comprehensive assessment of body condition, paint quality, and interior components',
                icon: <Car className="h-4 w-4 text-amber-600" />
              },
              { 
                title: 'History Verification',
                description: 'Detailed accident history, ownership records, and service documentation verified',
                icon: <FileCheck className="h-4 w-4 text-amber-600" />
              },
              { 
                title: 'Road Test Performance',
                description: 'Extensive road testing under various conditions to ensure reliability',
                icon: <Calendar className="h-4 w-4 text-amber-600" />
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="bg-amber-50 rounded-full p-1.5 h-fit">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-neutral-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-amber-600" />
            <h3 className="font-medium">AutoVista Certification Benefits</h3>
          </div>
          
          <ul className="space-y-2 mb-4">
            {[
              '12-month/20,000 km comprehensive warranty',
              '7-day money-back guarantee',
              'Free 3 maintenance services within 1 year',
              '24/7 roadside assistance for 12 months',
              'Verified service history documentation',
            ].map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Certified Vehicles</Button>
      </CardFooter>
    </Card>
  );
};

// VehicleHistory Component
const VehicleHistory: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-blue-50 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-1.5 rounded-md">
            <History className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-lg">Vehicle History Report</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="bg-neutral-50 border rounded-lg p-4">
          <h3 className="font-medium mb-3">Comprehensive History Analysis</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border">
                <div className="text-xs text-neutral-500">Accident Records</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Clean Record</span>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <div className="text-xs text-neutral-500">Ownership</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span className="font-medium">Single Owner</span>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <div className="text-xs text-neutral-500">Service Records</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <FileCheck className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Complete</span>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <div className="text-xs text-neutral-500">Odometer</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Gauge className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <div className="text-sm font-medium mb-2">Timeline Visualization</div>
              <div className="relative">
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-neutral-200"></div>
                
                {[
                  { date: 'Jan 2020', event: 'Original Purchase', description: 'First registration with manufacturer warranty' },
                  { date: 'Jul 2020', event: 'Service at 10,000 km', description: 'Regular maintenance at authorized service center' },
                  { date: 'Feb 2021', event: 'Service at 20,000 km', description: 'Regular maintenance + brake pads replacement' },
                  { date: 'Dec 2021', event: 'Service at 30,000 km', description: 'Regular maintenance + air filter replacement' },
                  { date: 'Jul 2022', event: 'Service at 40,000 km', description: 'Major service including timing belt' },
                ].map((item, index) => (
                  <div key={index} className="flex mb-4 relative">
                    <div className="w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500 z-10 mt-1 mr-3"></div>
                    <div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-semibold bg-neutral-100 px-1.5 py-0.5 rounded">
                          {item.date}
                        </span>
                        <span className="text-sm font-medium">{item.event}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Download Full Report</Button>
      </CardFooter>
    </Card>
  );
};

// Dealership Connect Component
const DealershipConnect: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-blue-50 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-1.5 rounded-md">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-lg">Dealership Connect</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-0">
        <div className="relative h-44 rounded-lg bg-neutral-100 overflow-hidden mb-4">
          {/* Simple map visualization */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?q=80&w=2831&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover opacity-50"></div>
          
          {/* Animated path showing distance calculation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-3 h-3 rounded-full bg-blue-600 absolute"
              style={{ top: '60%', left: '30%' }}
            />
            <motion.div
              className="absolute top-[60%] left-[30%] w-[40%] h-0.5 bg-blue-600 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-red-500 absolute"
              style={{ top: '60%', left: '70%' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, duration: 0.3 }}
            />
          </div>
          
          <div className="absolute bottom-2 right-2 bg-white rounded-md px-2 py-1 text-xs font-medium shadow-sm">
            Distance: 5.7 km
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-0">
              AutoVista Exclusive
            </Badge>
            <span className="text-sm text-neutral-600">Special platform discounts</span>
          </div>
          
          <div className="bg-neutral-50 p-3 rounded-lg border">
            <h4 className="font-medium text-sm mb-1">Book test drive without phone calls</h4>
            <p className="text-xs text-neutral-500 mb-2">
              Schedule directly through our platform and receive immediate confirmation.
            </p>
            <Button size="sm" variant="outline" className="w-full">Find Nearest Dealership</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Button className="w-full">Book Appointment</Button>
      </CardFooter>
    </Card>
  );
};

// Limited Time Offers Component
const LimitedTimeOffers: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45
  });
  
  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        
        if (hours < 0) {
          hours = 23;
          days--;
        }
        
        if (days < 0) {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-amber-50 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 p-1.5 rounded-md">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <CardTitle className="text-lg">Limited Time Offers</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Countdown timer */}
        <div className="flex justify-between gap-2 mb-2">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="bg-neutral-100 rounded-lg p-2 text-center flex-1">
              <div className="text-xl font-bold">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-xs text-neutral-500">{item.label}</div>
            </div>
          ))}
        </div>
        
        {/* Offers */}
        <div className="space-y-3">
          {[
            { 
              model: 'Maruti Suzuki Swift', 
              discount: '₹35,000 Cash Discount',
              additionalOffer: 'Free 3-Year Service Package',
              isExclusive: true
            },
            { 
              model: 'Hyundai Venue', 
              discount: '₹50,000 Exchange Bonus',
              additionalOffer: 'First Year Insurance Free',
              isExclusive: false
            },
            { 
              model: 'Tata Punch', 
              discount: '₹25,000 Corporate Discount',
              additionalOffer: 'Accessories Worth ₹15,000',
              isExclusive: true
            },
          ].map((offer, index) => (
            <motion.div 
              key={index}
              className="bg-white border rounded-lg p-3 relative overflow-hidden"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              {offer.isExclusive && (
                <Badge 
                  className="absolute top-0 right-0 rounded-tl-none rounded-br-none bg-amber-500"
                >
                  Exclusive
                </Badge>
              )}
              <h4 className="font-medium">{offer.model}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-0">
                  {offer.discount}
                </Badge>
              </div>
              <p className="text-xs text-neutral-600 mt-2">{offer.additionalOffer}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View All Offers</Button>
      </CardFooter>
    </Card>
  );
};

// Financial Calculator Component
const FinancialCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number[]>([1000000]);
  const [tenure, setTenure] = useState<number[]>([60]);
  const [interestRate, setInterestRate] = useState<number[]>([8.5]);
  const [downPayment, setDownPayment] = useState<number[]>([200000]);
  
  // Calculate EMI
  const calculateEMI = () => {
    const P = loanAmount[0] - downPayment[0]; // Principal
    const r = interestRate[0] / 12 / 100; // Monthly interest rate
    const n = tenure[0]; // Tenure in months
    
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-purple-50 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 p-1.5 rounded-md">
            <Calculator className="h-5 w-5 text-purple-600" />
          </div>
          <CardTitle className="text-lg">Financial Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <Tabs defaultValue="emi" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
            <TabsTrigger value="affordability">Affordability</TabsTrigger>
          </TabsList>
          <TabsContent value="emi" className="space-y-4 pt-3">
            {/* Loan Amount */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Vehicle Cost</label>
                <span className="text-sm">{formatCurrency(loanAmount[0])}</span>
              </div>
              <Slider
                value={loanAmount}
                min={100000}
                max={5000000}
                step={10000}
                onValueChange={setLoanAmount}
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>₹1L</span>
                <span>₹50L</span>
              </div>
            </div>
            
            {/* Down Payment */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Down Payment</label>
                <span className="text-sm">{formatCurrency(downPayment[0])}</span>
              </div>
              <Slider
                value={downPayment}
                min={0}
                max={loanAmount[0] * 0.5}
                step={10000}
                onValueChange={setDownPayment}
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>₹0</span>
                <span>{formatCurrency(loanAmount[0] * 0.5)}</span>
              </div>
            </div>
            
            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Interest Rate</label>
                <span className="text-sm">{interestRate[0]}%</span>
              </div>
              <Slider
                value={interestRate}
                min={5}
                max={15}
                step={0.1}
                onValueChange={setInterestRate}
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>5%</span>
                <span>15%</span>
              </div>
            </div>
            
            {/* Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Loan Tenure</label>
                <span className="text-sm">{tenure[0]} months</span>
              </div>
              <Slider
                value={tenure}
                min={12}
                max={84}
                step={12}
                onValueChange={setTenure}
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>1 Year</span>
                <span>7 Years</span>
              </div>
            </div>
            
            {/* EMI Result */}
            <div className="bg-neutral-50 p-3 rounded-lg border text-center">
              <div className="text-sm text-neutral-500 mb-1">Your Monthly EMI</div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(calculateEMI())}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                Total amount: {formatCurrency(calculateEMI() * tenure[0])}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="affordability" className="space-y-4 pt-3">
            <div className="bg-neutral-50 p-3 rounded-lg border mb-4">
              <h4 className="text-sm font-medium mb-2">How much car can you afford?</h4>
              <p className="text-xs text-neutral-500 mb-3">
                Based on your monthly budget, we'll calculate an ideal vehicle price range
              </p>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Monthly Budget</label>
                    <span className="text-sm">₹15,000</span>
                  </div>
                  <Slider
                    value={[15000]}
                    min={5000}
                    max={50000}
                    step={1000}
                    onValueChange={() => {}}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Down Payment</label>
                    <span className="text-sm">₹2,00,000</span>
                  </div>
                  <Slider
                    value={[200000]}
                    min={50000}
                    max={1000000}
                    step={10000}
                    onValueChange={() => {}}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Loan Tenure</label>
                    <span className="text-sm">60 months</span>
                  </div>
                  <Slider
                    value={[60]}
                    min={12}
                    max={84}
                    step={12}
                    onValueChange={() => {}}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-green-600" />
                <h4 className="font-medium">You can afford vehicles priced up to:</h4>
              </div>
              <div className="text-2xl font-bold text-green-700 text-center my-2">
                ₹10,50,000
              </div>
              <Button variant="outline" className="w-full mt-2">
                View vehicles in this range
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get personalized loan offers</Button>
      </CardFooter>
    </Card>
  );
};

// Extended Warranty Component
const ExtendedWarranty: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-emerald-50 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 p-1.5 rounded-md">
            <Shield className="h-5 w-5 text-emerald-600" />
          </div>
          <CardTitle className="text-lg">Extended Warranty</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="bg-neutral-50 p-3 rounded-lg border mb-4">
          <div className="flex items-center justify-center">
            <motion.div
              className="relative w-32 h-32"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Shield animation */}
              <motion.div
                className="absolute inset-0 bg-emerald-500 rounded-full opacity-10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div
                className="absolute inset-2 bg-emerald-500 rounded-full opacity-20"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
              />
              <motion.div
                className="absolute inset-4 bg-emerald-500 rounded-full opacity-30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <Shield className="h-10 w-10 text-emerald-500" />
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="text-center mt-3">
            <h3 className="font-medium">Complete Vehicle Protection</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Extend your manufacturer warranty and save on future repairs
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {[
            {
              name: 'Basic',
              period: '+1 Year',
              coverage: 'Mechanical & Electrical',
              price: '₹12,500',
              features: ['Engine components', 'Transmission parts', 'Basic electrical systems']
            },
            {
              name: 'Enhanced',
              period: '+2 Years',
              coverage: 'Comprehensive Cover',
              price: '₹21,999',
              features: ['All Basic coverage', 'Suspension & Steering', 'Fuel system', '24/7 Roadside assistance']
            },
            {
              name: 'Premium',
              period: '+3 Years',
              coverage: 'Complete Protection',
              price: '₹32,999',
              features: ['All Enhanced coverage', 'Interior & Exterior', 'Wear & tear items', 'Free pickup & drop']
            },
          ].map((plan, index) => (
            <motion.div
              key={index}
              className={`border rounded-lg p-3 ${index === 1 ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{plan.name}</h4>
                  <Badge variant="outline" className="mt-1">
                    {plan.period}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{plan.price}</div>
                  <div className="text-xs text-neutral-500">one-time</div>
                </div>
              </div>
              
              <p className="text-xs text-neutral-500 mb-2">{plan.coverage}</p>
              
              <ul className="space-y-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Select warranty plan</Button>
      </CardFooter>
    </Card>
  );
};

// Interface for the main component
interface SalesElementsProps {
  isPreowned?: boolean;
}

// Main component
const SalesElements: React.FC<SalesElementsProps> = ({ isPreowned = false }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isPreowned ? 'preowned-theme' : ''}`}>
      {isPreowned ? (
        // Pre-owned vehicle components
        <>
          <CertifiedPreowned />
          <VehicleHistory />
          <FinancialCalculator />
          <ExtendedWarranty />
        </>
      ) : (
        // New vehicle components
        <>
          <DealershipConnect />
          <LimitedTimeOffers />
          <FinancialCalculator />
          <ExtendedWarranty />
        </>
      )}
    </div>
  );
};

export default SalesElements;