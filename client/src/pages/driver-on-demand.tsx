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
  History
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

// Booking types
type BookingType = 'hourly' | 'trip' | 'monthly';

const DriverOnDemand = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<BookingType>('hourly');
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    minRating: 4.0,
    maxDistance: 10,
    availableNow: false,
    languages: [] as string[],
    specialties: [] as string[]
  });
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 2,
    pickupLocation: '',
    dropLocation: '',
    vehicleId: ''
  });
  
  // Get vehicles from user's Vehicle Vault
  const { data: userVehicles } = useQuery<any[]>({
    queryKey: ['/api/vehicles'],
    queryFn: async () => {
      const res = await fetch('/api/vehicles');
      if (!res.ok) throw new Error('Failed to fetch vehicles');
      return res.json();
    }
  });

  // Filter drivers based on search and filters
  const filteredDrivers = mockDrivers.filter(driver => {
    // Search query filter
    if (searchQuery && !driver.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Rating filter
    if (driver.rating < filters.minRating) {
      return false;
    }
    
    // Distance filter (parsing the km to a number)
    const distance = parseFloat(driver.distance.split(' ')[0]);
    if (distance > filters.maxDistance) {
      return false;
    }
    
    // Availability filter
    if (filters.availableNow && !driver.availability.includes('Available Now')) {
      return false;
    }
    
    return true;
  });

  // Calculate price based on booking type and duration
  const calculatePrice = (driver: typeof mockDrivers[0], type: BookingType, duration: number) => {
    switch (type) {
      case 'hourly':
        return driver.price.hourly * duration;
      case 'trip':
        // For trips, we'll use a base fare plus per km rate
        return 500 + (driver.price.hourly * 0.8 * duration);
      case 'monthly':
        return driver.price.monthly;
      default:
        return 0;
    }
  };

  // Handle booking
  const handleBookDriver = (driverId: number) => {
    const driver = mockDrivers.find(d => d.id === driverId);
    
    if (!bookingData.vehicleId) {
      toast({
        title: "Vehicle selection required",
        description: "Please select a vehicle for your trip",
        variant: "destructive"
      });
      return;
    }
    
    if (!bookingData.date || !bookingData.time) {
      toast({
        title: "Booking details required",
        description: "Please select date and time for your booking",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'trip' && (!bookingData.pickupLocation || !bookingData.dropLocation)) {
      toast({
        title: "Location details required",
        description: "Please provide pickup and drop locations",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would make an API call here
    toast({
      title: "Booking Successful!",
      description: `Your driver ${driver?.name} has been booked for ${bookingData.date} at ${bookingData.time}`,
      variant: "default"
    });
    
    // Reset state
    setSelectedDriverId(null);
    setBookingData({
      date: '',
      time: '',
      duration: 2,
      pickupLocation: '',
      dropLocation: '',
      vehicleId: ''
    });
  };

  // Page animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-6"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserCheck className="mr-3 h-8 w-8 text-teal-600" /> DriverOnDemand
          </h1>
          <p className="text-gray-600 mt-1">
            Find and book verified drivers for your vehicle
          </p>
        </div>
      </motion.div>

      {selectedDriverId ? (
        // Driver booking view
        <BookingView 
          driver={mockDrivers.find(d => d.id === selectedDriverId)!}
          bookingType={activeTab}
          bookingData={bookingData}
          setBookingData={setBookingData}
          onCancel={() => setSelectedDriverId(null)}
          onBook={() => handleBookDriver(selectedDriverId)}
          vehicles={userVehicles || []}
        />
      ) : (
        // Driver search and listing view
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Left sidebar - Filters */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold">Find Drivers</CardTitle>
                <CardDescription>Filter and search for the perfect driver</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Booking type tabs */}
                <Tabs defaultValue="hourly" onValueChange={(value) => setActiveTab(value as BookingType)}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="hourly">Hourly</TabsTrigger>
                    <TabsTrigger value="trip">Trip</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                {/* Rating filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex justify-between">
                    <span>Minimum Rating</span>
                    <span className="text-teal-600 font-medium">{filters.minRating.toFixed(1)}⭐</span>
                  </Label>
                  <Slider
                    value={[filters.minRating]}
                    min={3.0}
                    max={5.0}
                    step={0.1}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value[0] }))}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>3.0</span>
                    <span>5.0</span>
                  </div>
                </div>
                
                {/* Distance filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex justify-between">
                    <span>Maximum Distance</span>
                    <span className="text-teal-600 font-medium">{filters.maxDistance} km</span>
                  </Label>
                  <Slider
                    value={[filters.maxDistance]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, maxDistance: value[0] }))}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 km</span>
                    <span>20 km</span>
                  </div>
                </div>
                
                {/* Availability filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="available-now" 
                    checked={filters.availableNow}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, availableNow: checked === true }))
                    }
                  />
                  <Label htmlFor="available-now">Available Now</Label>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Right area - Driver listings */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold">
                  Available Drivers ({filteredDrivers.length})
                </CardTitle>
                <CardDescription>
                  {activeTab === 'hourly' && 'Hire by the hour for maximum flexibility'}
                  {activeTab === 'trip' && 'Book for a specific journey or route'}
                  {activeTab === 'monthly' && 'Long-term contracts for regular usage'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDrivers.length > 0 ? (
                    filteredDrivers.map(driver => (
                      <motion.div
                        key={driver.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        layout
                      >
                        <DriverCard
                          driver={driver}
                          bookingType={activeTab}
                          onBook={() => setSelectedDriverId(driver.id)}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Info className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-700">No drivers found</h3>
                      <p className="text-gray-500 mt-1">
                        Try adjusting your filters or search criteria
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Driver Card Component
const DriverCard = ({ 
  driver, 
  bookingType,
  onBook 
}: { 
  driver: typeof mockDrivers[0],
  bookingType: BookingType,
  onBook: () => void
}) => {
  const getBookingTypePrice = () => {
    switch(bookingType) {
      case 'hourly': return `₹${driver.price.hourly}/hour`;
      case 'trip': return `from ₹${driver.price.hourly * 2} per trip`;
      case 'monthly': return `₹${driver.price.monthly}/month`;
      default: return '';
    }
  };
  
  const getAvailabilityColor = () => {
    if (driver.availability.includes('Now')) return 'bg-green-100 text-green-600';
    if (driver.availability.includes('Tomorrow')) return 'bg-amber-100 text-amber-600';
    return 'bg-blue-100 text-blue-600';
  };

  return (
    <Card className="overflow-hidden border-gray-200 hover:border-teal-200 transition-all">
      <div className="flex flex-col sm:flex-row">
        <div className="p-4 flex flex-row sm:flex-col sm:items-center sm:justify-center sm:w-1/4 sm:border-r border-gray-100 bg-gray-50">
          <div className="mr-4 sm:mr-0 sm:mb-3">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
              <AvatarImage src={driver.image} alt={driver.name} />
              <AvatarFallback className="bg-teal-100 text-teal-700">
                {driver.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="sm:text-center">
            <h3 className="font-semibold text-gray-900">{driver.name}</h3>
            <div className="flex items-center mt-1 justify-center">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="ml-1 text-sm">{driver.rating} ({driver.reviews})</span>
            </div>
            <Badge variant="outline" className={`mt-2 ${getAvailabilityColor()}`}>
              {driver.availability}
            </Badge>
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                <span>{driver.experience} years experience</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                <span>{driver.distance} away</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-1.5 text-gray-400" />
                <span className="font-medium text-gray-800">{getBookingTypePrice()}</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs uppercase text-gray-500 mb-1.5">Specialties</h4>
              <div className="flex flex-wrap gap-1.5">
                {driver.specialties.map(specialty => (
                  <Badge key={specialty} variant="secondary" className="bg-gray-100">
                    {specialty}
                  </Badge>
                ))}
              </div>
              
              <h4 className="text-xs uppercase text-gray-500 mt-3 mb-1.5">Languages</h4>
              <div className="flex flex-wrap gap-1.5">
                {driver.languages.map(language => (
                  <Badge key={language} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={onBook}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Booking View Component
const BookingView = ({ 
  driver, 
  bookingType,
  bookingData,
  setBookingData,
  onCancel,
  onBook,
  vehicles
}: { 
  driver: typeof mockDrivers[0],
  bookingType: BookingType,
  bookingData: any,
  setBookingData: (data: any) => void,
  onCancel: () => void,
  onBook: () => void,
  vehicles: any[]
}) => {
  // Calculate total price
  const calculateTotal = () => {
    switch(bookingType) {
      case 'hourly': 
        return driver.price.hourly * bookingData.duration;
      case 'trip': 
        // Simplified calculation - in a real app you'd calculate based on distance
        return 500 + (driver.price.hourly * 0.8 * bookingData.duration);
      case 'monthly': 
        return driver.price.monthly;
      default: 
        return 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Driver Details */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Driver Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 border-2 border-white shadow-sm mb-3">
                <AvatarImage src={driver.image} alt={driver.name} />
                <AvatarFallback className="bg-teal-100 text-teal-700 text-xl">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-gray-900">{driver.name}</h2>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="ml-1">{driver.rating} ({driver.reviews} reviews)</span>
              </div>
              <Badge variant="outline" className="mt-2 bg-green-100 text-green-700 border-green-200">
                {driver.verificationStatus}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                <p className="text-gray-900">{driver.experience} years</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Specialties</h3>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {driver.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary" className="bg-gray-100">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Languages</h3>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {driver.languages.map(language => (
                    <Badge key={language} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="text-gray-900">{driver.distance} away from you</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pricing</h3>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Hourly</p>
                    <p className="font-medium">₹{driver.price.hourly}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Daily</p>
                    <p className="font-medium">₹{driver.price.daily}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Monthly</p>
                    <p className="font-medium">₹{driver.price.monthly}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onCancel}
            >
              Back to Search
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Booking Form */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Book {driver.name}</CardTitle>
            <CardDescription>
              {bookingType === 'hourly' && 'Hourly booking gives you flexibility for shorter durations'}
              {bookingType === 'trip' && 'Trip booking is ideal for one-way or return journeys'}
              {bookingType === 'monthly' && 'Monthly contracts offer the best value for regular usage'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Select Vehicle */}
            <div>
              <Label htmlFor="vehicle" className="text-gray-700 block mb-2">Select Your Vehicle</Label>
              <Select 
                value={bookingData.vehicleId} 
                onValueChange={(value) => setBookingData({...bookingData, vehicleId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2 text-teal-500" />
                        <span>{vehicle.name} ({vehicle.make} {vehicle.model})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Date and Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-gray-700 block mb-2">Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-gray-700 block mb-2">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                />
              </div>
            </div>
            
            {/* Booking Type Specific Fields */}
            {bookingType === 'hourly' && (
              <div>
                <Label htmlFor="duration" className="text-gray-700 block mb-2">
                  Duration (Hours): <span className="font-medium text-teal-600">{bookingData.duration}</span>
                </Label>
                <Slider
                  id="duration"
                  value={[bookingData.duration]}
                  min={1}
                  max={12}
                  step={1}
                  onValueChange={(value) => setBookingData({...bookingData, duration: value[0]})}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 hour</span>
                  <span>12 hours</span>
                </div>
              </div>
            )}
            
            {bookingType === 'trip' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pickup" className="text-gray-700 block mb-2">Pickup Location</Label>
                  <Input
                    id="pickup"
                    placeholder="Enter pickup address"
                    value={bookingData.pickupLocation}
                    onChange={(e) => setBookingData({...bookingData, pickupLocation: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="drop" className="text-gray-700 block mb-2">Drop Location</Label>
                  <Input
                    id="drop"
                    placeholder="Enter destination address"
                    value={bookingData.dropLocation}
                    onChange={(e) => setBookingData({...bookingData, dropLocation: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="tripDuration" className="text-gray-700 block mb-2">
                    Estimated Duration (Hours): <span className="font-medium text-teal-600">{bookingData.duration}</span>
                  </Label>
                  <Slider
                    id="tripDuration"
                    value={[bookingData.duration]}
                    min={1}
                    max={8}
                    step={1}
                    onValueChange={(value) => setBookingData({...bookingData, duration: value[0]})}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 hour</span>
                    <span>8 hours</span>
                  </div>
                </div>
              </div>
            )}
            
            {bookingType === 'monthly' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Monthly Contract Details</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Driver available for up to 12 hours daily (can be customized)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>30-day contract with option to extend</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Includes 2 weekly off days as per mutual agreement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Fuel, toll, and parking charges not included</span>
                  </li>
                </ul>
              </div>
            )}
            
            {/* Cost Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h3 className="font-medium text-gray-900 mb-3">Cost Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base charges</span>
                  {bookingType === 'hourly' && <span>₹{driver.price.hourly} × {bookingData.duration} hours</span>}
                  {bookingType === 'trip' && <span>₹500 (base fare)</span>}
                  {bookingType === 'monthly' && <span>₹{driver.price.monthly}</span>}
                </div>
                
                {bookingType === 'trip' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time charges (estimated)</span>
                    <span>₹{driver.price.hourly * 0.8} × {bookingData.duration} hours</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes & fees</span>
                  <span>₹{Math.round(calculateTotal() * 0.05)}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-teal-700">₹{calculateTotal() + Math.round(calculateTotal() * 0.05)}</span>
                </div>
                
                <div className="text-xs text-gray-500 mt-1">
                  Additional charges may apply based on actual usage and toll fees.
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={onBook}>Confirm Booking</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default DriverOnDemand;