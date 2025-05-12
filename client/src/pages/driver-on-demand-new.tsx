import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  UserCheck, 
  MapPin, 
  Clock, 
  Star, 
  Filter, 
  Calendar, 
  PhoneCall, 
  ArrowLeft,
  Car,
  DollarSign,
  Info,
  Search,
  CreditCard,
  Wallet,
  CheckCircle,
  Clock3,
  XCircle,
  AlertCircle,
  ChevronRight,
  History,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Mock data for drivers
const mockDrivers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    rating: 4.8,
    experience: 5,
    specialties: ['City Driving', 'Long Trips'],
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    price: {
      hourly: 250,
      daily: 1800,
      monthly: 32000
    },
    availability: 'Available Now',
    distance: '2.3 km',
    languages: ['Hindi', 'English', 'Tamil'],
    verificationStatus: 'Verified',
    reviews: 124
  },
  {
    id: 2,
    name: 'Priya Sharma',
    rating: 4.9,
    experience: 7,
    specialties: ['Highway Driving', 'Night Driving'],
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    price: {
      hourly: 300,
      daily: 2200,
      monthly: 38000
    },
    availability: 'Available in 30 min',
    distance: '3.5 km',
    languages: ['Hindi', 'English', 'Gujarati'],
    verificationStatus: 'Verified',
    reviews: 156
  },
  {
    id: 3,
    name: 'Amit Patel',
    rating: 4.6,
    experience: 4,
    specialties: ['City Driving', 'Airport Transfers'],
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    price: {
      hourly: 220,
      daily: 1700,
      monthly: 29000
    },
    availability: 'Available Tomorrow',
    distance: '1.8 km',
    languages: ['Hindi', 'English', 'Marathi'],
    verificationStatus: 'Verified',
    reviews: 89
  }
];

// Mock booking history
const mockBookings = [
  {
    id: 'B-2025-001',
    driverId: 1,
    driverName: 'Rajesh Kumar',
    driverImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'completed',
    date: '12 May 2025',
    time: '09:30 AM - 04:30 PM',
    duration: '7 hours',
    vehicle: 'My BMW',
    location: 'Bengaluru to Mysore',
    fare: 1750,
    paymentStatus: 'paid',
    paymentMethod: 'online',
    rating: 4.8
  },
  {
    id: 'B-2025-002',
    driverId: 2,
    driverName: 'Priya Sharma',
    driverImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'active',
    date: '12 May 2025',
    time: '06:30 PM - 08:30 PM',
    duration: '2 hours',
    vehicle: 'My BMW',
    location: 'Inner Ring Road, Bengaluru',
    fare: 600,
    paymentStatus: 'pending',
    paymentMethod: null,
    rating: null
  },
  {
    id: 'B-2025-003',
    driverId: 3,
    driverName: 'Amit Patel',
    driverImage: 'https://randomuser.me/api/portraits/men/45.jpg',
    status: 'scheduled',
    date: '13 May 2025',
    time: '10:00 AM - 06:00 PM',
    duration: '8 hours',
    vehicle: 'My BMW',
    location: 'Bengaluru to Coorg',
    fare: 1760,
    paymentStatus: 'pending',
    paymentMethod: null,
    rating: null
  },
  {
    id: 'B-2025-004',
    driverId: 2,
    driverName: 'Priya Sharma',
    driverImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'cancelled',
    date: '10 May 2025',
    time: '02:00 PM - 04:00 PM',
    duration: '2 hours',
    vehicle: 'My BMW',
    location: 'Airport Transfer, Bengaluru',
    fare: 600,
    paymentStatus: 'refunded',
    paymentMethod: 'online',
    rating: null
  }
];

// Payment method options
const paymentMethods = [
  { id: 'online', label: 'Online Payment', icon: <CreditCard className="h-4 w-4 mr-2" /> },
  { id: 'cash', label: 'Cash On Service', icon: <Wallet className="h-4 w-4 mr-2" /> }
];

// Status icons and colors
type BookingStatus = 'completed' | 'active' | 'scheduled' | 'cancelled';

const statusConfig: Record<BookingStatus, { 
  icon: React.ReactNode; 
  color: string;
  text: string;
}> = {
  completed: { 
    icon: <CheckCircle className="h-5 w-5 text-green-500" />, 
    color: 'bg-green-100 text-green-700',
    text: 'Completed'
  },
  active: { 
    icon: <Clock3 className="h-5 w-5 text-blue-500" />, 
    color: 'bg-blue-100 text-blue-700',
    text: 'In Progress'
  },
  scheduled: { 
    icon: <Calendar className="h-5 w-5 text-amber-500" />, 
    color: 'bg-amber-100 text-amber-700',
    text: 'Scheduled'
  },
  cancelled: { 
    icon: <XCircle className="h-5 w-5 text-red-500" />, 
    color: 'bg-red-100 text-red-700',
    text: 'Cancelled'
  }
};

// Payment status config
type PaymentStatus = 'paid' | 'pending' | 'refunded';

const paymentStatusConfig: Record<PaymentStatus, {
  icon: React.ReactNode;
  color: string;
  text: string;
}> = {
  paid: { 
    icon: <CheckCircle className="h-4 w-4 text-green-500" />, 
    color: 'text-green-600',
    text: 'Paid'
  },
  pending: { 
    icon: <AlertCircle className="h-4 w-4 text-amber-500" />, 
    color: 'text-amber-600',
    text: 'Pending'
  },
  refunded: { 
    icon: <ArrowLeft className="h-4 w-4 text-blue-500" />, 
    color: 'text-blue-600',
    text: 'Refunded'
  }
};

// Booking types
type BookingType = 'hourly' | 'trip' | 'monthly';

// Driver interface
interface DriverPrice {
  hourly: number;
  daily: number;
  monthly: number;
}

interface Driver {
  id: number;
  name: string;
  rating: number;
  experience: number;
  specialties: string[];
  image: string;
  price: DriverPrice;
  availability: string;
  distance: string;
  languages: string[];
  verificationStatus: string;
  reviews: number;
}

// Booking interface
interface Booking {
  id: string;
  driverId: number;
  driverName: string;
  driverImage: string;
  status: BookingStatus;
  date: string;
  time: string;
  duration: string;
  vehicle: string;
  location: string;
  fare: number;
  paymentStatus: PaymentStatus | null;
  paymentMethod: string | null;
  rating: number | null;
}

// Vehicle interface
interface Vehicle {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
}

// Main component
function DriverOnDemand() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // States
  const [activeTab, setActiveTab] = useState<string>('find');
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [bookingType, setBookingType] = useState<BookingType>('hourly');
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState<string>('');
  const [bookingDuration, setBookingDuration] = useState<number>(2);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('online');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number[]>([500]);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [specialtyFilter, setSpecialtyFilter] = useState<string[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>(mockDrivers);

  // Fetch vehicles from the Vehicle Vault
  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });

  // Filter drivers based on filters
  useEffect(() => {
    let result = [...mockDrivers];
    
    if (locationFilter) {
      result = result.filter(driver => 
        driver.distance.toLowerCase().includes(locationFilter.toLowerCase()));
    }
    
    if (maxPrice[0] < 500) {
      result = result.filter(driver => driver.price.hourly <= maxPrice[0]);
    }
    
    if (minExperience > 0) {
      result = result.filter(driver => driver.experience >= minExperience);
    }
    
    if (specialtyFilter.length > 0) {
      result = result.filter(driver => 
        driver.specialties.some(specialty => 
          specialtyFilter.includes(specialty)));
    }
    
    setFilteredDrivers(result);
  }, [locationFilter, maxPrice, minExperience, specialtyFilter]);

  // Handle selecting a driver
  const handleSelectDriver = (driverId: number) => {
    setSelectedDriver(driverId);
    setIsBookingModalOpen(true);
  };

  // State for new fields
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [driverArrangeParking, setDriverArrangeParking] = useState<boolean>(false);
  const [tollsIncluded, setTollsIncluded] = useState<boolean>(false);
  const [endTime, setEndTime] = useState<string>('');
  
  // Function to format time to 12-hour format
  const formatTo12Hour = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const meridiem = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${meridiem} IST`;
  };
  
  // Calculate end time based on start time and duration
  useEffect(() => {
    if (bookingTime && bookingType === 'hourly') {
      try {
        const [hours, minutes] = bookingTime.split(':');
        const startDate = new Date();
        startDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + bookingDuration);
        
        const endHours = endDate.getHours().toString().padStart(2, '0');
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
        setEndTime(`${endHours}:${endMinutes}`);
      } catch (error) {
        console.error('Error calculating end time', error);
      }
    }
  }, [bookingTime, bookingDuration, bookingType]);

  // Handle booking
  const handleBookNow = () => {
    if (!selectedVehicle) {
      toast({
        title: "Vehicle Required",
        description: "Please select a vehicle for your booking.",
        variant: "destructive",
      });
      return;
    }

    if (!bookingTime) {
      toast({
        title: "Time Required",
        description: "Please select a time for your booking.",
        variant: "destructive",
      });
      return;
    }
    
    if (!pickupLocation) {
      toast({
        title: "Pickup Location Required",
        description: "Please enter a pickup location for your booking.",
        variant: "destructive",
      });
      return;
    }
    
    if (!contactNumber) {
      toast({
        title: "Contact Number Required",
        description: "Please provide a contact number for the driver.",
        variant: "destructive",
      });
      return;
    }

    // Calculate fare based on booking type and duration
    const driver = mockDrivers.find(d => d.id === selectedDriver);
    let fare = 0;
    
    if (driver) {
      if (bookingType === 'hourly') {
        fare = driver.price.hourly * bookingDuration;
      } else if (bookingType === 'trip') {
        fare = driver.price.daily;
      } else if (bookingType === 'monthly') {
        fare = driver.price.monthly;
      }
    }

    // Create new booking
    const newBooking: Booking = {
      id: `B-${Math.floor(Math.random() * 10000)}`,
      driverId: selectedDriver!,
      driverName: driver?.name || '',
      driverImage: driver?.image || '',
      status: 'scheduled',
      date: bookingDate,
      time: bookingTime,
      duration: `${bookingDuration} ${bookingType === 'hourly' ? 'hours' : bookingType === 'trip' ? 'day' : 'month'}`,
      vehicle: selectedVehicle,
      location: locationFilter || 'Not specified',
      fare,
      paymentStatus: 'pending',
      paymentMethod: null,
      rating: null
    };

    // Instead of updating mockBookings, we would send this to the API
    // mockBookings.push(newBooking);
    
    setIsBookingModalOpen(false);
    setIsPaymentModalOpen(true);
    setSelectedBooking(newBooking);
    
    toast({
      title: "Booking Created",
      description: "Your booking has been created successfully.",
    });
  };

  // Handle payment
  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment Processed",
      description: selectedPaymentMethod === 'online' 
        ? "Your online payment has been processed."
        : "Your booking is confirmed with cash payment on service.",
    });

    setIsPaymentModalOpen(false);
    setActiveTab('bookings');
  };

  // Handle cancel booking
  const handleCancelBooking = (bookingId: string) => {
    // API call to cancel booking would go here
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully.",
    });
  };

  // Handle making payment for existing booking
  const handleMakePayment = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  // Header
  const renderHeader = () => {
    return (
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Driver On Demand</h1>
            <p className="text-slate-500">Book verified drivers for your vehicle</p>
          </div>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarFallback>AC</AvatarFallback>
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar>
      </motion.div>
    );
  };

  // Tabs
  const renderTabs = () => {
    return (
      <Tabs defaultValue="find" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="find" className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Find Drivers
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center">
            <History className="h-4 w-4 mr-2" />
            Booking History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="find" className="mt-4">
          {renderDriverSearch()}
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-4">
          {renderBookingHistory()}
        </TabsContent>
      </Tabs>
    );
  };

  // Driver search section
  const renderDriverSearch = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 h-fit sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-teal-600" />
              Filters
            </CardTitle>
            <CardDescription>Refine your driver search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="relative">
                <MapPin className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input 
                  placeholder="Search by location" 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Maximum Hourly Rate (₹)</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm">₹0</span>
                <span className="text-sm">₹500</span>
              </div>
              <Slider 
                defaultValue={[500]} 
                max={500} 
                step={50}
                value={maxPrice}
                onValueChange={setMaxPrice}
              />
              <div className="text-right text-sm font-medium">
                ₹{maxPrice[0]}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Minimum Experience (Years)</Label>
              <Select 
                value={minExperience.toString()} 
                onValueChange={(value) => setMinExperience(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Experience</SelectItem>
                  <SelectItem value="1">1+ Years</SelectItem>
                  <SelectItem value="3">3+ Years</SelectItem>
                  <SelectItem value="5">5+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Specialties</Label>
              <div className="space-y-2">
                {['City Driving', 'Highway Driving', 'Night Driving', 'Long Trips', 'Airport Transfers'].map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox 
                      id={specialty} 
                      checked={specialtyFilter.includes(specialty)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSpecialtyFilter([...specialtyFilter, specialty]);
                        } else {
                          setSpecialtyFilter(specialtyFilter.filter(s => s !== specialty));
                        }
                      }}
                    />
                    <Label htmlFor={specialty} className="text-sm font-normal cursor-pointer">
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setLocationFilter('');
                setMaxPrice([500]);
                setMinExperience(0);
                setSpecialtyFilter([]);
              }}
            >
              Reset Filters
            </Button>
          </CardFooter>
        </Card>
        
        <div className="md:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Available Drivers ({filteredDrivers.length})</h3>
            <Select defaultValue="nearest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nearest">Nearest First</SelectItem>
                <SelectItem value="highest-rated">Highest Rated</SelectItem>
                <SelectItem value="lowest-price">Lowest Price</SelectItem>
                <SelectItem value="most-experienced">Most Experienced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 flex flex-col md:flex-row items-start gap-4 flex-grow">
                        <Avatar className="h-16 w-16 rounded-md">
                          <AvatarImage src={driver.image} />
                          <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-2 flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{driver.name}</h3>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="ml-1 text-sm font-medium">{driver.rating}</span>
                                <span className="text-sm text-slate-500 ml-1">({driver.reviews} reviews)</span>
                              </div>
                            </div>
                            
                            <Badge 
                              variant="secondary" 
                              className="mt-2 md:mt-0 bg-teal-50 text-teal-700 hover:bg-teal-100"
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              {driver.verificationStatus}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-slate-400 mr-1" />
                              <span>{driver.distance}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-slate-400 mr-1" />
                              <span>{driver.experience} years exp.</span>
                            </div>
                            <div className="flex items-center text-green-600">
                              <span className="font-medium">{driver.availability}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {driver.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="bg-slate-50">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l">
                        <div className="space-y-2 mb-4">
                          <div className="text-sm text-slate-500">Starting Price</div>
                          <div className="flex items-baseline">
                            <span className="text-xl font-bold">₹{driver.price.hourly}</span>
                            <span className="text-sm text-slate-500 ml-1">/hour</span>
                          </div>
                          <div className="text-sm text-slate-500">
                            Daily: ₹{driver.price.daily} • Monthly: ₹{driver.price.monthly}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Button 
                            className="w-full bg-teal-600 hover:bg-teal-700"
                            onClick={() => handleSelectDriver(driver.id)}
                          >
                            Book Now
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              toast({
                                title: "Driver Profile",
                                description: `Viewing ${driver.name}'s detailed profile`,
                              });
                            }}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <Info className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Drivers Found</h3>
                  <p className="text-slate-500 mb-4">
                    No drivers match your current filters. Try adjusting your search criteria.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setLocationFilter('');
                      setMaxPrice([500]);
                      setMinExperience(0);
                      setSpecialtyFilter([]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Booking history
  const renderBookingHistory = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Cards */}
          {(Object.entries(statusConfig) as [BookingStatus, typeof statusConfig[BookingStatus]][]).map(([status, config]) => {
            const count = mockBookings.filter(booking => booking.status === status).length;
            return (
              <Card key={status} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-full ${config.color.split(' ')[0]}`}>
                    {config.icon}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{config.text}</p>
                    <h3 className="text-2xl font-bold">{count}</h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Bookings</h3>
          
          {mockBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-start gap-4 flex-grow">
                    <Avatar className="h-12 w-12 rounded-md">
                      <AvatarImage src={booking.driverImage} />
                      <AvatarFallback>{booking.driverName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2 flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{booking.driverName}</h3>
                            <Badge className={`${statusConfig[booking.status].color}`}>
                              {statusConfig[booking.status].icon}
                              <span className="ml-1">{statusConfig[booking.status].text}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">Booking ID: {booking.id}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-slate-400 mr-1" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-slate-400 mr-1" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 text-slate-400 mr-1" />
                          <span>{booking.vehicle}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-slate-400 mr-1" />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col justify-between md:items-end gap-2">
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Fare</div>
                      <div className="font-bold">₹{booking.fare}</div>
                      <div className="flex items-center justify-end text-sm mt-1">
                        {booking.paymentStatus && (
                          <>
                            {paymentStatusConfig[booking.paymentStatus].icon}
                            <span className={`ml-1 ${paymentStatusConfig[booking.paymentStatus].color}`}>
                              {paymentStatusConfig[booking.paymentStatus].text}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {booking.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => toast({
                            title: "Contacting Driver",
                            description: "Connecting you to the driver...",
                          })}
                        >
                          <PhoneCall className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                      )}
                      
                      {booking.status === 'scheduled' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
                      )}
                      
                      {booking.status !== 'cancelled' && booking.paymentStatus === 'pending' && (
                        <Button
                          size="sm"
                          className="w-full bg-teal-600 hover:bg-teal-700"
                          onClick={() => handleMakePayment(booking)}
                        >
                          Pay Now
                        </Button>
                      )}
                      
                      {booking.status === 'completed' && !booking.rating && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => toast({
                            title: "Rate Driver",
                            description: "Rating feature coming soon",
                          })}
                        >
                          Rate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Booking modal
  const renderBookingModal = () => {
    if (!isBookingModalOpen) return null;
    
    const driver = mockDrivers.find(d => d.id === selectedDriver);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div 
          className="bg-white rounded-lg w-full max-w-2xl overflow-auto max-h-[90vh]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">Book Driver</h2>
                <p className="text-slate-500">Complete your booking details</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsBookingModalOpen(false)}
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            {driver && (
              <div className="mb-6 flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={driver.image} />
                  <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{driver.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm">{driver.rating} ({driver.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Booking Type</h3>
                <Tabs 
                  defaultValue="hourly" 
                  className="w-full"
                  value={bookingType}
                  onValueChange={(value) => setBookingType(value as BookingType)}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="hourly">Hourly</TabsTrigger>
                    <TabsTrigger value="trip">Trip-based</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="hourly" className="mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Duration (hours)</Label>
                        <Select 
                          value={bookingDuration.toString()} 
                          onValueChange={(value) => setBookingDuration(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Hours" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                              <SelectItem key={hours} value={hours.toString()}>
                                {hours} {hours === 1 ? 'hour' : 'hours'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {driver && (
                        <div className="bg-slate-50 p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Hourly Rate:</span>
                            <span>₹{driver.price.hourly}/hour</span>
                          </div>
                          <div className="flex justify-between items-center font-medium">
                            <span>Estimated Total:</span>
                            <span>₹{driver.price.hourly * bookingDuration}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="trip" className="mt-4">
                    <div className="space-y-4">
                      <p className="text-sm text-slate-500">
                        Trip-based booking covers a full day of driving service for a fixed price.
                      </p>
                      
                      {driver && (
                        <div className="bg-slate-50 p-4 rounded-md">
                          <div className="flex justify-between items-center font-medium">
                            <span>Fixed Price (1 day):</span>
                            <span>₹{driver.price.daily}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="monthly" className="mt-4">
                    <div className="space-y-4">
                      <p className="text-sm text-slate-500">
                        Monthly contract provides dedicated driver service for 26 days each month (8 hours per day).
                      </p>
                      
                      {driver && (
                        <div className="bg-slate-50 p-4 rounded-md">
                          <div className="flex justify-between items-center font-medium">
                            <span>Monthly Rate:</span>
                            <span>₹{driver.price.monthly}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg mb-4">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" /> 
                  Date & Time Selection
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-blue-700">Booking Date</Label>
                    <div className="relative">
                      <Calendar className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                      <Input 
                        type="date" 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-blue-700">Starting Time (IST)</Label>
                      <div className="relative">
                        <Clock className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                        <Input 
                          type="time" 
                          value={bookingTime}
                          onChange={(e) => {
                            setBookingTime(e.target.value);
                          }}
                          className="pl-9"
                        />
                      </div>
                      <div className="text-xs text-slate-500">
                        {bookingTime && (
                          <span>
                            {(() => {
                              const [hours, minutes] = bookingTime.split(':');
                              const hour = parseInt(hours, 10);
                              const meridiem = hour >= 12 ? 'PM' : 'AM';
                              const hour12 = hour % 12 || 12;
                              return `${hour12}:${minutes} ${meridiem} Indian Standard Time`;
                            })()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-blue-700">Ending Time (IST)</Label>
                      <div className="relative">
                        <Clock3 className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                        <Input 
                          type="time" 
                          value={endTime}
                          className="pl-9 bg-slate-50"
                          disabled
                        />
                      </div>
                      <div className="text-xs text-slate-500">
                        {endTime && (
                          <span>
                            {(() => {
                              const [hours, minutes] = endTime.split(':');
                              const hour = parseInt(hours, 10);
                              const meridiem = hour >= 12 ? 'PM' : 'AM';
                              const hour12 = hour % 12 || 12;
                              return `${hour12}:${minutes} ${meridiem} Indian Standard Time`;
                            })()}
                          </span>
                        )}
                      </div>
                      
                      {bookingTime && endTime && bookingType === 'hourly' && (
                        <div className="p-2 rounded-md bg-blue-50 text-xs text-blue-700 mt-1 flex items-center">
                          <Info className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>
                            Trip duration: {bookingDuration} {bookingDuration > 1 ? 'hours' : 'hour'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-teal-50 rounded-lg mb-4">
                <h4 className="font-medium text-teal-800 mb-2 flex items-center">
                  <Car className="h-4 w-4 mr-2" /> 
                  Vehicle Selection
                </h4>
                <div className="space-y-2">
                  <Label className="text-teal-700">Select Your Vehicle</Label>
                  <Select 
                    value={selectedVehicle} 
                    onValueChange={setSelectedVehicle}
                  >
                    <SelectTrigger className="border-teal-200">
                      <SelectValue placeholder="Select Vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.name}>
                          {vehicle.name} ({vehicle.make} {vehicle.model})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-teal-600 flex items-center gap-1 mt-1">
                    <Info className="h-3 w-3" />
                    <span>Select from your Vehicle Vault or add a new vehicle</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2" /> 
                  Driver Instructions
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label className="text-amber-700">Special Instructions for Driver</Label>
                    <textarea 
                      className="mt-1 p-3 h-24 w-full rounded-md border border-amber-200 focus:border-amber-400 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                      placeholder="e.g. Driver should know the city well, bring a spare mask, needs to be familiar with local language, etc."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-amber-700">Pick-up Location</Label>
                      <div className="relative">
                        <MapPin className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                        <Input 
                          placeholder="Enter specific pick-up location" 
                          className="pl-9 border-amber-200"
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-amber-700">Contact Number</Label>
                      <div className="relative">
                        <PhoneCall className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                        <Input 
                          placeholder="Your contact number" 
                          className="pl-9 border-amber-200"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="ownParking" 
                      checked={driverArrangeParking}
                      onCheckedChange={(checked) => setDriverArrangeParking(!!checked)}
                    />
                    <Label htmlFor="ownParking" className="text-sm cursor-pointer text-amber-800">
                      Driver needs to arrange for parking
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tollsIncluded" 
                      checked={tollsIncluded}
                      onCheckedChange={(checked) => setTollsIncluded(!!checked)}
                    />
                    <Label htmlFor="tollsIncluded" className="text-sm cursor-pointer text-amber-800">
                      Toll charges included in fare
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-8">
              <Button 
                variant="outline" 
                onClick={() => setIsBookingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-teal-600 hover:bg-teal-700"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Payment modal
  const renderPaymentModal = () => {
    if (!isPaymentModalOpen || !selectedBooking) return null;
    
    // Function to format time
    const formatBookingTime = () => {
      if (bookingTime) {
        const startTime = formatTo12Hour(bookingTime);
        if (endTime && bookingType === 'hourly') {
          const endTimeFormatted = formatTo12Hour(endTime);
          return `${startTime} to ${endTimeFormatted}`;
        }
        return startTime;
      }
      return selectedBooking.time;
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div 
          className="bg-white rounded-lg w-full max-w-md overflow-auto max-h-[90vh]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-teal-800">Booking Payment</h2>
                <p className="text-slate-500">Complete your driver booking</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsPaymentModalOpen(false)}
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-teal-50 p-5 rounded-lg space-y-4">
                <div className="flex items-center mb-2">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={selectedBooking.driverImage} />
                    <AvatarFallback>{selectedBooking.driverName?.charAt(0) || 'D'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-teal-900">{selectedBooking.driverName}</h3>
                    <p className="text-xs text-teal-700">Booking ID: {selectedBooking.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-teal-600">Date</p>
                    <p className="text-sm font-medium">{selectedBooking.date}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-teal-600">Time</p>
                    <p className="text-sm font-medium">{formatBookingTime()}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-teal-600">Vehicle</p>
                    <p className="text-sm font-medium">{selectedBooking.vehicle}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-teal-600">Duration</p>
                    <p className="text-sm font-medium">{selectedBooking.duration}</p>
                  </div>
                </div>
                
                {pickupLocation && (
                  <div className="space-y-1 pt-2">
                    <p className="text-xs text-teal-600">Pickup Location</p>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-teal-500 mr-1 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{pickupLocation}</p>
                    </div>
                  </div>
                )}
                
                {specialInstructions && (
                  <div className="space-y-1 pt-1">
                    <p className="text-xs text-teal-600">Special Instructions</p>
                    <p className="text-sm bg-white p-2 rounded-md">{specialInstructions}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-teal-100">
                  <span className="text-teal-800 font-semibold">Total Fare:</span>
                  <span className="text-xl font-bold text-teal-900">₹{selectedBooking.fare.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-slate-800 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-slate-600" />
                  Select Payment Method
                </h3>
                
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label 
                        htmlFor={method.id} 
                        className={`flex items-center cursor-pointer flex-1 p-3 border rounded-md hover:bg-slate-50 transition-colors ${
                          selectedPaymentMethod === method.id ? 'border-teal-400 bg-teal-50' : ''
                        }`}
                      >
                        {method.icon}
                        {method.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {selectedPaymentMethod === 'online' && (
                <motion.div 
                  className="space-y-4 p-4 border border-teal-200 rounded-lg bg-teal-50/50"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-medium text-teal-800">Enter Card Details</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-sm">Card Number</Label>
                      <Input placeholder="XXXX XXXX XXXX XXXX" className="border-teal-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-sm">Expiry Date</Label>
                        <Input placeholder="MM/YY" className="border-teal-200" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm">CVV</Label>
                        <Input placeholder="XXX" className="border-teal-200" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">Cardholder Name</Label>
                      <Input placeholder="Name as on card" className="border-teal-200" />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {selectedPaymentMethod === 'cash' && (
                <motion.div 
                  className="p-4 bg-amber-50 rounded-lg border border-amber-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm text-amber-800 flex items-start gap-2">
                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>
                      Pay the driver directly in cash when the service is completed. 
                      Your booking will be confirmed immediately. Please ensure you have 
                      exact change of ₹{selectedBooking.fare.toLocaleString('en-IN')}.
                    </span>
                  </p>
                </motion.div>
              )}
            </div>
            
            <div className="flex justify-end mt-8">
              <Button 
                className="bg-teal-600 hover:bg-teal-700 w-full text-white font-medium py-6"
                onClick={handlePayment}
              >
                {selectedPaymentMethod === 'online' 
                  ? `Pay ₹${selectedBooking.fare.toLocaleString('en-IN')}` 
                  : 'Confirm Cash Payment on Service'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {renderHeader()}
      {renderTabs()}
      {renderBookingModal()}
      {renderPaymentModal()}
    </div>
  );
}

export default DriverOnDemand;