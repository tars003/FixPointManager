import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Info,
  Clock,
  CreditCard,
  Car,
  MapPin,
  ChevronDown,
  ChevronRight,
  Tag,
  IndianRupee,
  ReceiptText,
  AlertTriangle,
  CheckCircle,
  CircleDollarSign,
  X,
  Map,
  ArrowRightLeft,
  History,
  Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// FASTag and E-Challan Services
const FastagEchallan = () => {
  const [activeTab, setActiveTab] = useState('echallan');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [challanTab, setChallanTab] = useState('pending');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [showStateSearch, setShowStateSearch] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('');
  
  // Sample pending challans data
  const pendingChallans = [
    { 
      id: 'CH2024001', 
      vehicleNumber: 'MP04UE2047', 
      date: '15 Apr 2024', 
      location: 'Indore, MP', 
      violation: 'Signal Jumping', 
      amount: 1000, 
      dueDate: '15 May 2024',
      hasImage: true
    },
    { 
      id: 'CH2024002', 
      vehicleNumber: 'MP04UE2047', 
      date: '10 Apr 2024', 
      location: 'Bhopal, MP', 
      violation: 'No Helmet', 
      amount: 500, 
      dueDate: '10 May 2024',
      hasImage: false
    }
  ];
  
  // Sample paid challans data
  const paidChallans = [
    { 
      id: 'CH2023095', 
      vehicleNumber: 'MP04UE2047', 
      date: '25 Dec 2023', 
      location: 'Ujjain, MP', 
      violation: 'Speeding', 
      amount: 1500, 
      paidDate: '10 Jan 2024'
    }
  ];
  
  // Sample FASTag data
  const fastagData = {
    id: 'FT0123456789',
    vehicleNumber: 'MP04UE2047',
    vehicleModel: 'Suzuki Burgman',
    balance: 1245.50,
    lastUpdated: 'Today, 10:30 AM',
    status: 'active',
    expiryDate: '31 Dec 2025',
    recentTransactions: [
      { id: 'TR001', plaza: 'NH-44 Nagpur Toll Plaza', amount: 145, date: '22 Apr, 9:15 AM' },
      { id: 'TR002', plaza: 'Mumbai-Pune Expressway', amount: 230, date: '20 Apr, 2:45 PM' },
      { id: 'TR003', plaza: 'Indore Bypass Toll', amount: 95, date: '18 Apr, 11:20 AM' },
      { id: 'TR004', plaza: 'Agra-Lucknow Expressway', amount: 180, date: '15 Apr, 5:30 PM' },
      { id: 'TR005', plaza: 'Delhi-Jaipur Highway', amount: 205, date: '12 Apr, 8:10 AM' }
    ],
    monthlyUsage: {
      tollsCrossed: 12,
      totalSpent: 1860
    }
  };
  
  // List of Indian states
  const indianStates = [
    { code: 'AP', name: 'Andhra Pradesh', landmark: 'Tirupati Temple' },
    { code: 'AR', name: 'Arunachal Pradesh', landmark: 'Tawang Monastery' },
    { code: 'AS', name: 'Assam', landmark: 'Kaziranga National Park' },
    { code: 'BR', name: 'Bihar', landmark: 'Bodh Gaya' },
    { code: 'CG', name: 'Chhattisgarh', landmark: 'Chitrakote Falls' },
    { code: 'GA', name: 'Goa', landmark: 'Beaches' },
    { code: 'GJ', name: 'Gujarat', landmark: 'Statue of Unity' },
    { code: 'HR', name: 'Haryana', landmark: 'Sultanpur Bird Sanctuary' },
    { code: 'HP', name: 'Himachal Pradesh', landmark: 'Shimla' },
    { code: 'JK', name: 'Jammu and Kashmir', landmark: 'Dal Lake' },
    { code: 'JH', name: 'Jharkhand', landmark: 'Hundru Falls' },
    { code: 'KA', name: 'Karnataka', landmark: 'Mysore Palace' },
    { code: 'KL', name: 'Kerala', landmark: 'Backwaters' },
    { code: 'MP', name: 'Madhya Pradesh', landmark: 'Khajuraho Temples' },
    { code: 'MH', name: 'Maharashtra', landmark: 'Gateway of India' },
    { code: 'MN', name: 'Manipur', landmark: 'Loktak Lake' },
    { code: 'ML', name: 'Meghalaya', landmark: 'Living Root Bridges' },
    { code: 'MZ', name: 'Mizoram', landmark: 'Phawngpui Peak' },
    { code: 'NL', name: 'Nagaland', landmark: 'Hornbill Festival' },
    { code: 'OR', name: 'Odisha', landmark: 'Konark Sun Temple' },
    { code: 'PB', name: 'Punjab', landmark: 'Golden Temple' },
    { code: 'RJ', name: 'Rajasthan', landmark: 'Hawa Mahal' },
    { code: 'SK', name: 'Sikkim', landmark: 'Kanchenjunga' },
    { code: 'TN', name: 'Tamil Nadu', landmark: 'Meenakshi Temple' },
    { code: 'TS', name: 'Telangana', landmark: 'Charminar' },
    { code: 'TR', name: 'Tripura', landmark: 'Neermahal Palace' },
    { code: 'UK', name: 'Uttarakhand', landmark: 'Valley of Flowers' },
    { code: 'UP', name: 'Uttar Pradesh', landmark: 'Taj Mahal' },
    { code: 'WB', name: 'West Bengal', landmark: 'Victoria Memorial' },
    { code: 'DL', name: 'Delhi', landmark: 'India Gate' }
  ];
  
  // Format vehicle number with spaces
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
  
  // Handle vehicle number input change
  const handleVehicleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatVehicleNumber(e.target.value);
    setVehicleNumber(formattedValue);
  };
  
  // Validate vehicle number (basic validation)
  const isValidVehicleNumber = () => {
    // Remove spaces and check format (2 letters + 2 numbers + 2 letters + 4 numbers)
    const regex = /^[A-Z]{2}\s?[0-9]{2}\s?[A-Z]{2}\s?[0-9]{4}$/;
    return regex.test(vehicleNumber);
  };
  
  // Handle check pending challans button click
  const handleCheckChallans = () => {
    if (!isValidVehicleNumber()) {
      toast({
        title: "Invalid Vehicle Number",
        description: "Please enter a valid vehicle number in the format: XX 00 XX 0000",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSearching(false);
      if (!otpSent) {
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Please enter the OTP sent to your registered mobile number to view all challans",
          variant: "default",
        });
      } else {
        toast({
          title: "Challans Retrieved",
          description: `Found ${pendingChallans.length} pending challans for ${vehicleNumber}`,
          variant: "default",
        });
      }
    }, 2000);
  };
  
  // Handle OTP verification
  const handleVerifyOTP = () => {
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSearching(false);
      toast({
        title: "OTP Verified",
        description: "Your vehicle has been verified successfully",
        variant: "default",
      });
    }, 1500);
  };
  
  // Handle pay challan button click
  const handlePayChallan = (challanId: string) => {
    toast({
      title: "Payment Initiated",
      description: `Redirecting to payment gateway for challan ${challanId}`,
      variant: "default",
    });
  };
  
  // Handle recharge FASTag button click
  const handleRechargeFASTtag = () => {
    if (!rechargeAmount || isNaN(Number(rechargeAmount)) || Number(rechargeAmount) < 100) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount (minimum ₹100)",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Recharge Initiated",
      description: `Redirecting to payment gateway to recharge ₹${rechargeAmount}`,
      variant: "default",
    });
  };
  
  // Handle state selection
  const handleStateSelect = (stateCode: string) => {
    setSelectedState(stateCode);
    setShowStateSearch(false);
    
    toast({
      title: "State Selected",
      description: `Checking challans from ${indianStates.find(state => state.code === stateCode)?.name}`,
      variant: "default",
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-dark">
              FASTag & E-Challan Services
            </h1>
            <p className="text-neutral-light mt-1">
              Check, pay and manage your traffic challans and FASTag accounts easily
            </p>
          </div>
        </div>
        
        {/* Main Tabs */}
        <Tabs 
          defaultValue="echallan" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="echallan" className="flex items-center gap-1">
              <ReceiptText className="h-4 w-4" />
              <span className="hidden sm:inline">E-Challan</span>
              <span className="sm:hidden">Challan</span>
            </TabsTrigger>
            <TabsTrigger value="fastag" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">FASTag</span>
              <span className="sm:hidden">FASTag</span>
            </TabsTrigger>
          </TabsList>
          
          {/* E-Challan Content */}
          <TabsContent value="echallan">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-1">E-Challan: Check Status and Pay Online</h2>
                <p className="text-neutral-light mb-6">Check Challan Instantly For Free ⚡</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Vehicle Search */}
                  <div className="md:col-span-2">
                    <div className="relative">
                      <div className="flex items-center mb-2">
                        <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                          IND
                        </span>
                      </div>
                      <Input 
                        placeholder="Enter your vehicle number" 
                        value={vehicleNumber}
                        onChange={handleVehicleNumberChange}
                        className="mb-4"
                        maxLength={13} // Accommodate spaces: XX 00 XX 0000
                      />
                      
                      {otpSent && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">
                            Enter OTP sent to your registered mobile
                          </label>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Enter 6-digit OTP" 
                              value={otpValue}
                              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              className="flex-1"
                              maxLength={6}
                            />
                            <Button onClick={handleVerifyOTP} disabled={isSearching}>
                              {isSearching ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                          </div>
                          <div className="mt-2 text-sm text-neutral-light">
                            <button className="text-primary">Resend OTP</button> in 30 seconds
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleCheckChallans} 
                        className="w-full md:w-auto"
                        disabled={isSearching || !vehicleNumber}
                      >
                        {isSearching ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span>
                            Retrieving Challans...
                          </>
                        ) : (
                          <>Check pending challans</>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Info Card */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium mb-1">How to check your challan?</h3>
                        <ul className="text-sm space-y-2 text-neutral-light">
                          <li className="flex items-start gap-2">
                            <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                            <span>Enter your complete vehicle number</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                            <span>Verify with OTP sent to your registered mobile</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                            <span>View and pay your challans online instantly</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Did you travel to other states */}
                <div className="mt-6">
                  <button 
                    className="flex items-center text-primary"
                    onClick={() => setShowStateSearch(!showStateSearch)}
                  >
                    {showStateSearch ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                    <span>Did you travel to other states? Click here for State Wise Challan Search</span>
                  </button>
                  
                  {showStateSearch && (
                    <div className="mt-4 border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Select State for Challan Search</h3>
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input 
                          placeholder="Search state by name" 
                          className="pl-10"
                        />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                        {indianStates.slice(0, 10).map(state => (
                          <Card 
                            key={state.code}
                            className={`cursor-pointer hover:shadow-md transition-shadow ${selectedState === state.code ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => handleStateSelect(state.code)}
                          >
                            <CardContent className="p-3 text-center">
                              <div className="text-lg font-bold">{state.code}</div>
                              <div className="text-xs line-clamp-1">{state.name}</div>
                            </CardContent>
                          </Card>
                        ))}
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-3 text-center flex flex-col items-center justify-center h-full">
                            <span className="text-neutral-light text-sm">More</span>
                            <ChevronRight className="h-4 w-4" />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Challans Listing */}
            <div className="mb-8">
              <div className="flex gap-4 mb-4">
                <button 
                  className={`pb-2 px-1 ${challanTab === 'pending' ? 'border-b-2 border-primary font-medium' : 'text-neutral-light'}`}
                  onClick={() => setChallanTab('pending')}
                >
                  Pending ({pendingChallans.length})
                </button>
                <button 
                  className={`pb-2 px-1 ${challanTab === 'paid' ? 'border-b-2 border-primary font-medium' : 'text-neutral-light'}`}
                  onClick={() => setChallanTab('paid')}
                >
                  Paid ({paidChallans.length})
                </button>
              </div>
              
              {challanTab === 'pending' && (
                <div className="space-y-4">
                  {pendingChallans.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                        <h3 className="text-xl font-medium mb-2">Hurray! You are driving good.</h3>
                        <p className="text-neutral-light">No recent challans found</p>
                        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 max-w-md mx-auto">
                          <h4 className="font-medium mb-1">Predict & Win Rewards</h4>
                          <p className="text-sm text-neutral-light">Your driving deserves rewards. Join our safe driver program.</p>
                          <Button className="mt-3 w-full sm:w-auto">Learn More</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {pendingChallans.map(challan => (
                        <Card key={challan.id} className="overflow-hidden">
                          <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 border-b flex justify-between items-center">
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                              <span className="font-medium">Unpaid Challan</span>
                            </div>
                            <div className="text-sm text-neutral-light">
                              Due: {challan.dueDate}
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-3">
                                  <Car className="h-5 w-5 text-neutral-light" />
                                  <span className="font-medium">{challan.vehicleNumber}</span>
                                  <span className="text-sm text-neutral-light">({challan.id})</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                                  <div className="flex items-start gap-2">
                                    <Clock className="h-4 w-4 text-neutral-light mt-1" />
                                    <div>
                                      <div className="text-sm font-medium">Date & Time</div>
                                      <div className="text-sm text-neutral-light">{challan.date}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-neutral-light mt-1" />
                                    <div>
                                      <div className="text-sm font-medium">Location</div>
                                      <div className="text-sm text-neutral-light">{challan.location}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2 sm:col-span-2">
                                    <Info className="h-4 w-4 text-neutral-light mt-1" />
                                    <div>
                                      <div className="text-sm font-medium">Violation</div>
                                      <div className="text-sm text-neutral-light">{challan.violation}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end justify-between">
                                <div className="text-right mb-3">
                                  <div className="text-sm text-neutral-light">Amount Due</div>
                                  <div className="text-xl font-bold text-red-600">₹{challan.amount.toLocaleString()}</div>
                                </div>
                                <div className="flex gap-2">
                                  {challan.hasImage && (
                                    <Button variant="outline" size="sm">
                                      View Evidence
                                    </Button>
                                  )}
                                  <Button 
                                    size="sm"
                                    onClick={() => handlePayChallan(challan.id)}
                                  >
                                    Pay Now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {pendingChallans.length > 1 && (
                        <div className="flex justify-end mt-4">
                          <Card className="p-4 w-full sm:w-auto">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                              <div>
                                <div className="text-sm text-neutral-light">Total Amount Due</div>
                                <div className="text-xl font-bold text-red-600">
                                  ₹{pendingChallans.reduce((sum, challan) => sum + challan.amount, 0).toLocaleString()}
                                </div>
                              </div>
                              <Button>Pay All Challans</Button>
                            </div>
                          </Card>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              
              {challanTab === 'paid' && (
                <div className="space-y-4">
                  {paidChallans.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Info className="h-12 w-12 mx-auto text-blue-500 mb-3" />
                        <h3 className="text-xl font-medium mb-2">No paid challans found</h3>
                        <p className="text-neutral-light">Your payment history will appear here</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {paidChallans.map(challan => (
                        <Card key={challan.id} className="overflow-hidden">
                          <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 border-b flex justify-between items-center">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                              <span className="font-medium">Paid Challan</span>
                            </div>
                            <div className="text-sm text-neutral-light">
                              Paid: {challan.paidDate}
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-3">
                                  <Car className="h-5 w-5 text-neutral-light" />
                                  <span className="font-medium">{challan.vehicleNumber}</span>
                                  <span className="text-sm text-neutral-light">({challan.id})</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                                  <div className="flex items-start gap-2">
                                    <Clock className="h-4 w-4 text-neutral-light mt-1" />
                                    <div>
                                      <div className="text-sm font-medium">Date & Time</div>
                                      <div className="text-sm text-neutral-light">{challan.date}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-neutral-light mt-1" />
                                    <div>
                                      <div className="text-sm font-medium">Location</div>
                                      <div className="text-sm text-neutral-light">{challan.location}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2 sm:col-span-2">
                                    <Info className="h-4 w-4 text-neutral-light mt-1" />
                                    <div>
                                      <div className="text-sm font-medium">Violation</div>
                                      <div className="text-sm text-neutral-light">{challan.violation}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end justify-between">
                                <div className="text-right mb-3">
                                  <div className="text-sm text-neutral-light">Amount Paid</div>
                                  <div className="text-xl font-bold text-green-600">₹{challan.amount.toLocaleString()}</div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Download Receipt
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* FASTag Content */}
          <TabsContent value="fastag">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-1">FASTag: Purchase, Recharge & Manage</h2>
                <p className="text-neutral-light mb-6">Drive through tolls without stopping ✅</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* FASTag Status Card */}
                  <div className="md:col-span-2">
                    <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 overflow-hidden relative">
                      <div className="absolute top-3 right-3">
                        {fastagData.status === 'active' ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                            Inactive
                          </span>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Tag className="h-6 w-6 text-blue-600" />
                          <span className="font-bold text-lg">FASTag ID: {fastagData.id}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                          <div>
                            <div className="text-sm text-neutral-light mb-1">Linked Vehicle</div>
                            <div className="flex items-center gap-2">
                              <Car className="h-5 w-5 text-neutral-light" />
                              <div>
                                <div className="font-medium">{fastagData.vehicleNumber}</div>
                                <div className="text-sm text-neutral-light">{fastagData.vehicleModel}</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-neutral-light mb-1">Current Balance</div>
                            <div className="flex items-center gap-1">
                              <div className="font-bold text-xl">₹{fastagData.balance.toLocaleString()}</div>
                              <InfoTooltip text={`Last updated: ${fastagData.lastUpdated}`} />
                            </div>
                            {fastagData.balance < 300 && (
                              <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Low balance, please recharge
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                          <div>
                            <div className="text-sm text-neutral-light mb-1">Monthly Usage</div>
                            <div className="font-medium">{fastagData.monthlyUsage.tollsCrossed} tolls crossed</div>
                            <div className="text-sm text-neutral-light">
                              Total spent: ₹{fastagData.monthlyUsage.totalSpent.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-neutral-light mb-1">Expires On</div>
                            <div className="font-medium">{fastagData.expiryDate}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button>
                            Recharge Now
                          </Button>
                          <Button variant="outline">
                            <History className="h-4 w-4 mr-1" />
                            Transaction History
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Quick Recharge */}
                  <div>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-3">Quick Recharge</h3>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {[500, 1000, 1500, 2000].map(amount => (
                            <Button 
                              key={amount}
                              variant={rechargeAmount === amount.toString() ? "default" : "outline"}
                              size="sm"
                              className="text-md"
                              onClick={() => setRechargeAmount(amount.toString())}
                            >
                              ₹{amount}
                            </Button>
                          ))}
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">Custom Amount</label>
                          <div className="relative">
                            <Input 
                              placeholder="Enter amount"
                              value={rechargeAmount}
                              onChange={(e) => setRechargeAmount(e.target.value.replace(/\D/g, ''))}
                              className="pl-8"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-neutral-light">₹</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={handleRechargeFASTtag}
                          disabled={!rechargeAmount || isNaN(Number(rechargeAmount)) || Number(rechargeAmount) < 100}
                        >
                          Proceed to Pay
                        </Button>
                        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">5% cashback</span> on recharges above ₹1000
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Recent Transactions */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Recent Transactions</h3>
                    <Button variant="ghost" size="sm" className="text-sm">
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-neutral-100 dark:bg-neutral-800">
                          <th className="text-left p-3 text-sm font-medium">Date & Time</th>
                          <th className="text-left p-3 text-sm font-medium">Toll Plaza</th>
                          <th className="text-right p-3 text-sm font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {fastagData.recentTransactions.map(transaction => (
                          <tr key={transaction.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                            <td className="p-3 text-sm">{transaction.date}</td>
                            <td className="p-3 text-sm">{transaction.plaza}</td>
                            <td className="p-3 text-sm text-right font-medium">₹{transaction.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional FASTag Services */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Buy New FASTag */}
              <Card>
                <CardContent className="p-4">
                  <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/30 w-12 h-12 flex items-center justify-center mb-3">
                    <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Buy New FASTag</h3>
                  <p className="text-neutral-light text-sm mb-4">
                    Purchase a new FASTag for your vehicle with easy online registration
                  </p>
                  <Button variant="outline" className="w-full">Apply Now</Button>
                </CardContent>
              </Card>
              
              {/* Toll Calculator */}
              <Card>
                <CardContent className="p-4">
                  <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center mb-3">
                    <Map className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Toll Calculator</h3>
                  <p className="text-neutral-light text-sm mb-4">
                    Calculate toll charges for your journey before you start driving
                  </p>
                  <Button variant="outline" className="w-full">Calculate Toll</Button>
                </CardContent>
              </Card>
              
              {/* FASTag Help */}
              <Card>
                <CardContent className="p-4">
                  <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900/30 w-12 h-12 flex items-center justify-center mb-3">
                    <Info className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">FASTag Support</h3>
                  <p className="text-neutral-light text-sm mb-4">
                    Need help with your FASTag? Contact customer support or read FAQs
                  </p>
                  <Button variant="outline" className="w-full">Get Support</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Helper component for info tooltip
const InfoTooltip = ({ text }: { text: string }) => {
  return (
    <div className="relative group">
      <Info className="h-4 w-4 text-neutral-light cursor-help" />
      <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
      </div>
    </div>
  );
};

export default FastagEchallan;