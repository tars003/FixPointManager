import { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('fastag');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [challanTab, setChallanTab] = useState('pending');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [showStateSearch, setShowStateSearch] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('');
  
  // Mock vehicles
  const vehicles = [
    { id: 1, number: "MP04UE2047", model: "Suzuki Burgman", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" },
    { id: 2, number: "DL01AB1234", model: "Honda City", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" },
    { id: 3, number: "MH02CD5678", model: "Tata Nexon", image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" }
  ];

  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);

  // Set vehicle number on selected vehicle change
  useEffect(() => {
    setVehicleNumber(selectedVehicle.number);
  }, [selectedVehicle]);
  
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
  
  // Sample FASTag data for selected vehicle
  const getFastagData = (vehicle: { number: string; model: string }) => ({
    id: `FT${Math.floor(Math.random() * 10000000000)}`,
    vehicleNumber: vehicle.number,
    vehicleModel: vehicle.model,
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
  });
  
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
          
          {/* Vehicle Selector */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 p-2 rounded-lg border hover:bg-neutral-50 transition-colors"
              onClick={() => setShowVehicleSelector(!showVehicleSelector)}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border">
                <img 
                  src={selectedVehicle.image} 
                  alt={selectedVehicle.model}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">{selectedVehicle.number}</div>
                <div className="text-xs text-neutral-light">{selectedVehicle.model}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-neutral-light" />
            </button>
            
            {showVehicleSelector && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-2 border-b text-sm font-medium">
                  Select Vehicle
                </div>
                {vehicles.map(vehicle => (
                  <button
                    key={vehicle.id}
                    className={`w-full flex items-center gap-2 p-2 hover:bg-neutral-50 transition-colors ${selectedVehicle.id === vehicle.id ? 'bg-neutral-50' : ''}`}
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setShowVehicleSelector(false);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border">
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.model}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{vehicle.number}</div>
                      <div className="text-xs text-neutral-light">{vehicle.model}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Main Tabs */}
        <Tabs 
          defaultValue="fastag" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="fastag" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">FASTag</span>
              <span className="sm:hidden">FASTag</span>
            </TabsTrigger>
            <TabsTrigger value="echallan" className="flex items-center gap-1">
              <ReceiptText className="h-4 w-4" />
              <span className="hidden sm:inline">E-Challan</span>
              <span className="sm:hidden">Challan</span>
            </TabsTrigger>
          </TabsList>

          {/* FASTag Content */}
          <TabsContent value="fastag">
            {/* FASTag Account Overview */}
            <Card className="mb-6 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Primary Account</span>
                      <h2 className="text-xl font-bold mt-1">{selectedVehicle.number}</h2>
                      <p className="text-sm text-white/80">{selectedVehicle.model}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="text-sm text-white/80">FASTag Balance</div>
                      <div className="text-3xl font-bold">₹ {getFastagData(selectedVehicle).balance.toFixed(2)}</div>
                      <div className="text-xs text-white/60">Last updated: {getFastagData(selectedVehicle).lastUpdated}</div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                      <History className="h-4 w-4 mr-2" />
                      Transaction History
                    </Button>
                    <Button className="bg-white text-primary hover:bg-white/90">
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Recharge Now
                    </Button>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-light mb-1">Status</h3>
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2" />
                        <span className="font-medium">{getFastagData(selectedVehicle).status === 'active' ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-light mb-1">FASTag ID</h3>
                      <p className="font-medium">{getFastagData(selectedVehicle).id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-light mb-1">Expiry Date</h3>
                      <p className="font-medium">{getFastagData(selectedVehicle).expiryDate}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-md font-semibold mb-3">Monthly Usage Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-neutral-50">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-xl font-bold">{getFastagData(selectedVehicle).monthlyUsage.tollsCrossed}</div>
                            <div className="text-sm text-neutral-light">Tolls crossed this month</div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-neutral-50">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <CircleDollarSign className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-xl font-bold">₹ {getFastagData(selectedVehicle).monthlyUsage.totalSpent}</div>
                            <div className="text-sm text-neutral-light">Total spent this month</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-md font-semibold">Recent Transactions</h3>
                      <Button variant="ghost" size="sm" className="text-sm">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {getFastagData(selectedVehicle).recentTransactions.slice(0, 3).map((transaction) => (
                        <Card key={transaction.id} className="hover:shadow-md cursor-pointer transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-neutral-100 p-2 rounded-full">
                                <MapPin className="h-5 w-5 text-neutral-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{transaction.plaza}</div>
                                <div className="text-xs text-neutral-light">{transaction.date}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">₹ {transaction.amount}</div>
                                <div className="text-xs text-green-600">Success</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-md font-semibold mb-3">Recharge FASTag</h3>
                    <div className="flex gap-3">
                      <Input
                        type="number"
                        placeholder="Enter amount (min ₹100)"
                        className="max-w-[200px]"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                      />
                      <Button onClick={handleRechargeFASTtag}>
                        Recharge Now
                      </Button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[200, 500, 1000, 2000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setRechargeAmount(amount.toString())}
                        >
                          ₹ {amount}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional FASTag Services */}
            <FastagServiceCards />
          </TabsContent>
          
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
                  Pending Challans ({pendingChallans.length})
                </button>
                <button 
                  className={`pb-2 px-1 ${challanTab === 'paid' ? 'border-b-2 border-primary font-medium' : 'text-neutral-light'}`}
                  onClick={() => setChallanTab('paid')}
                >
                  Paid Challans ({paidChallans.length})
                </button>
              </div>
              
              {challanTab === 'pending' && (
                <div className="space-y-4">
                  {pendingChallans.map(challan => (
                    <Card key={challan.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4 bg-white">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">{challan.id}</h3>
                                {challan.hasImage && (
                                  <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded-full">
                                    Evidence Available
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-neutral-light mt-1">
                                <div className="flex items-center gap-1">
                                  <Car className="h-3 w-3" /> {challan.vehicleNumber}
                                </div>
                              </div>
                            </div>
                            <div className="font-bold text-lg text-red-600">₹ {challan.amount}</div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div>
                              <div className="text-neutral-light">Date</div>
                              <div className="font-medium">{challan.date}</div>
                            </div>
                            <div>
                              <div className="text-neutral-light">Location</div>
                              <div className="font-medium">{challan.location}</div>
                            </div>
                            <div>
                              <div className="text-neutral-light">Violation</div>
                              <div className="font-medium">{challan.violation}</div>
                            </div>
                            <div>
                              <div className="text-neutral-light">Due Date</div>
                              <div className="font-medium">{challan.dueDate}</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-2 flex-wrap">
                            <Button 
                              onClick={() => handlePayChallan(challan.id)} 
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Pay Now
                            </Button>
                            <Button variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {pendingChallans.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center p-12 bg-neutral-50 rounded-lg">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                      <h3 className="text-lg font-bold mb-1">No Pending Challans</h3>
                      <p className="text-neutral-light max-w-md">
                        You have no pending challans for this vehicle. Keep following traffic rules and stay safe!
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {challanTab === 'paid' && (
                <div className="space-y-4">
                  {paidChallans.map(challan => (
                    <Card key={challan.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4 bg-white">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold">{challan.id}</h3>
                                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                  Paid
                                </span>
                              </div>
                              <div className="text-sm text-neutral-light mt-1">
                                <div className="flex items-center gap-1">
                                  <Car className="h-3 w-3" /> {challan.vehicleNumber}
                                </div>
                              </div>
                            </div>
                            <div className="font-bold text-lg text-neutral-800">₹ {challan.amount}</div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div>
                              <div className="text-neutral-light">Date</div>
                              <div className="font-medium">{challan.date}</div>
                            </div>
                            <div>
                              <div className="text-neutral-light">Location</div>
                              <div className="font-medium">{challan.location}</div>
                            </div>
                            <div>
                              <div className="text-neutral-light">Violation</div>
                              <div className="font-medium">{challan.violation}</div>
                            </div>
                            <div>
                              <div className="text-neutral-light">Paid On</div>
                              <div className="font-medium">{challan.paidDate}</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline">
                              View Receipt
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {paidChallans.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center p-12 bg-neutral-50 rounded-lg">
                      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-3" />
                      <h3 className="text-lg font-bold mb-1">No Payment History</h3>
                      <p className="text-neutral-light max-w-md">
                        You have no record of previously paid challans for this vehicle.
                      </p>
                    </div>
                  )}
                </div>
              )}
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