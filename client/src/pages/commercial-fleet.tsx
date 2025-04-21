import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertItem } from '@/components/dashboard/alert-item';
import { AddVehicleDialog } from '@/components/vehicles/add-vehicle-dialog';
import { ScheduleMaintenanceDialog } from '@/components/maintenance/schedule-maintenance-dialog';
import { NewRentalDialog } from '@/components/rentals/new-rental-dialog';
import { NewInvoiceDialog } from '@/components/finance/new-invoice-dialog';
import { AddDriverDialog } from '@/components/drivers/add-driver-dialog';
import { UploadDocumentDialog } from '@/components/documents/upload-document-dialog';
import { DocumentExpiryCard } from '@/components/documents/document-expiry-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeftFromLine,
  Car,
  TrendingUp,
  Calendar as CalendarIcon2,
  MapPin,
  TruckIcon,
  FileTextIcon,
  UsersIcon,
  WrenchIcon,
  CreditCard,
  AlertCircle,
  Bell,
  FilePlus,
  Search,
  Fuel,
  UserCheck,
  FileBox,
  Users,
  PhoneIcon,
  BarChart3,
  ClipboardCheck,
  Calculator,
  Download,
  Filter,
  MoreHorizontal,
  ChevronRight,
  CheckCircle,
  Plus,
  PlusCircle,
  Settings
} from 'lucide-react';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Mock data for charts
const fleetStatusData = [
  { name: 'Available', value: 45, color: '#10B981' },
  { name: 'On Rent', value: 35, color: '#3B82F6' },
  { name: 'In Maintenance', value: 15, color: '#F59E0B' },
  { name: 'Broken Down', value: 5, color: '#EF4444' }
];

const revenueData = [
  { month: 'Jan', amount: 42000 },
  { month: 'Feb', amount: 45000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 51000 },
  { month: 'May', amount: 53000 },
  { month: 'Jun', amount: 58000 },
  { month: 'Jul', amount: 59000 },
  { month: 'Aug', amount: 61000 },
  { month: 'Sep', amount: 64000 },
  { month: 'Oct', amount: 66000 },
  { month: 'Nov', amount: 68000 },
  { month: 'Dec', amount: 72000 }
];

const vehicleRentalData = [
  { month: 'Jan', count: 28 },
  { month: 'Feb', count: 32 },
  { month: 'Mar', count: 36 },
  { month: 'Apr', count: 30 },
  { month: 'May', count: 35 },
  { month: 'Jun', count: 40 },
  { month: 'Jul', count: 45 },
  { month: 'Aug', count: 48 },
  { month: 'Sep', count: 43 },
  { month: 'Oct', count: 38 },
  { month: 'Nov', count: 42 },
  { month: 'Dec', count: 50 }
];

const fuelEfficiencyData = [
  { vehicle: 'TN01-3456', efficiency: 18 },
  { vehicle: 'DL01-8794', efficiency: 15 },
  { vehicle: 'MH02-4532', efficiency: 22 },
  { vehicle: 'KA01-9834', efficiency: 16 },
  { vehicle: 'GJ05-2143', efficiency: 20 }
];

// Mock vehicles for fleet
const fleetVehicles = [
  {
    id: 1,
    name: 'Toyota Innova Crysta',
    type: '4-Wheeler',
    registrationNumber: 'TN01-3456',
    status: 'Available',
    lastService: '2023-10-15',
    location: 'Chennai Central',
    fuelType: 'Diesel',
    currentDriver: 'Rajesh Kumar',
    value: 1850000
  },
  {
    id: 2,
    name: 'Mahindra Bolero',
    type: '4-Wheeler',
    registrationNumber: 'DL01-8794',
    status: 'On Rent',
    lastService: '2023-11-20',
    location: 'Delhi Airport',
    fuelType: 'Diesel',
    currentDriver: 'Suresh Singh',
    value: 1240000
  },
  {
    id: 3,
    name: 'Tata Ace',
    type: '4-Wheeler',
    registrationNumber: 'MH02-4532',
    status: 'In Maintenance',
    lastService: '2023-12-05',
    location: 'Mumbai Service Center',
    fuelType: 'Diesel',
    currentDriver: 'None',
    value: 950000
  },
  {
    id: 4,
    name: 'Ashok Leyland Dost',
    type: '4-Wheeler',
    registrationNumber: 'KA01-9834',
    status: 'On Rent',
    lastService: '2023-09-25',
    location: 'Bangalore City',
    fuelType: 'Diesel',
    currentDriver: 'Venkatesh Rao',
    value: 1320000
  },
  {
    id: 5,
    name: 'Bajaj RE Auto',
    type: '3-Wheeler',
    registrationNumber: 'GJ05-2143',
    status: 'Available',
    lastService: '2023-12-10',
    location: 'Ahmedabad Depot',
    fuelType: 'CNG',
    currentDriver: 'Mukesh Patel',
    value: 380000
  }
];

// Mock maintenance records
const maintenanceRecords = [
  {
    id: 1,
    vehicle: 'Toyota Innova Crysta (TN01-3456)',
    type: 'Regular Service',
    date: '2023-10-15',
    cost: 12500,
    provider: 'Toyota Service Center',
    notes: 'Oil change, filter replacement, brake inspection'
  },
  {
    id: 2,
    vehicle: 'Mahindra Bolero (DL01-8794)',
    type: 'Tire Replacement',
    date: '2023-11-20',
    cost: 24000,
    provider: 'Mahindra Service',
    notes: 'All four tires replaced'
  },
  {
    id: 3,
    vehicle: 'Tata Ace (MH02-4532)',
    type: 'Engine Repair',
    date: '2023-12-05',
    cost: 35000,
    provider: 'Tata Authorized Workshop',
    notes: 'Engine overhaul required due to oil leakage'
  },
  {
    id: 4,
    vehicle: 'Bajaj RE Auto (GJ05-2143)',
    type: 'Regular Service',
    date: '2023-12-10',
    cost: 4500,
    provider: 'Bajaj Service',
    notes: 'Regular maintenance and tune-up'
  }
];

// Mock rental records
const rentalRecords = [
  {
    id: 1,
    vehicle: 'Toyota Innova Crysta (TN01-3456)',
    client: 'ABC Travels',
    startDate: '2023-12-20',
    endDate: '2023-12-25',
    totalAmount: 25000,
    status: 'Upcoming',
    driver: 'Rajesh Kumar'
  },
  {
    id: 2,
    vehicle: 'Mahindra Bolero (DL01-8794)',
    client: 'XYZ Tours',
    startDate: '2023-12-15',
    endDate: '2023-12-28',
    totalAmount: 32000,
    status: 'Active',
    driver: 'Suresh Singh'
  },
  {
    id: 3,
    vehicle: 'Ashok Leyland Dost (KA01-9834)',
    client: 'Fast Logistics',
    startDate: '2023-12-10',
    endDate: '2023-12-20',
    totalAmount: 28000,
    status: 'Active',
    driver: 'Venkatesh Rao'
  },
  {
    id: 4,
    vehicle: 'Bajaj RE Auto (GJ05-2143)',
    client: 'Local Movers',
    startDate: '2023-12-05',
    endDate: '2023-12-12',
    totalAmount: 12000,
    status: 'Completed',
    driver: 'Mukesh Patel'
  }
];

// Mock documents
const documents = [
  {
    id: "d1",
    title: "Toyota Innova Registration Certificate",
    documentType: "Certificate",
    category: "Registration Certificate",
    entityType: "vehicle" as const,
    entityName: "Toyota Innova Crysta (TN01-3456)",
    entityId: "v1",
    createdAt: "2024-01-15",
    expiryDate: new Date("2025-05-10"),
    issuingAuthority: "Regional Transport Office, Chennai",
    documentPath: "/documents/v1_rc.pdf",
    tags: ["Important", "Legal"]
  },
  {
    id: "d2",
    title: "Rajesh Kumar's Driving License",
    documentType: "License",
    category: "Driving License",
    entityType: "driver" as const,
    entityName: "Rajesh Kumar",
    entityId: "d1",
    createdAt: "2023-06-10",
    expiryDate: new Date("2025-06-09"),
    issuingAuthority: "Regional Transport Office, Chennai",
    documentPath: "/documents/d1_license.pdf",
    tags: ["Important", "Legal"]
  },
  {
    id: "d3",
    title: "Tata Ace Insurance Policy",
    documentType: "Policy",
    category: "Insurance Policy",
    entityType: "vehicle" as const,
    entityName: "Tata Ace (MH02-4532)",
    entityId: "v3",
    createdAt: "2023-11-20",
    expiryDate: new Date("2025-04-28"), // Expiring soon
    issuingAuthority: "ICICI Lombard",
    documentPath: "/documents/v3_insurance.pdf",
    tags: ["Important", "Financial", "Insurance"]
  },
  {
    id: "d4",
    title: "Suresh Singh Aadhar Card",
    documentType: "ID Proof",
    category: "ID Proof",
    entityType: "driver" as const,
    entityName: "Suresh Singh",
    entityId: "d2",
    createdAt: "2023-08-05",
    issuingAuthority: "UIDAI",
    documentPath: "/documents/d2_aadhar.pdf",
    tags: ["Identity", "Verified"]
  },
  {
    id: "d5",
    title: "ABC Travels Contract",
    documentType: "Contract",
    category: "Active Contract",
    entityType: "client" as const,
    entityName: "ABC Travels",
    entityId: "c1",
    createdAt: "2024-02-15",
    expiryDate: new Date("2025-04-25"), // Expiring very soon
    documentPath: "/documents/c1_contract.pdf",
    tags: ["Contract", "Legal", "Financial"]
  },
  {
    id: "d6",
    title: "Mahindra Bolero Fitness Certificate",
    documentType: "Certificate",
    category: "Permit Document",
    entityType: "vehicle" as const,
    entityName: "Mahindra Bolero (DL01-8794)",
    entityId: "v2",
    createdAt: "2023-09-30",
    expiryDate: new Date("2025-05-02"), // Expiring soon
    issuingAuthority: "Delhi Transport Department",
    documentPath: "/documents/v2_fitness.pdf",
    tags: ["Compliance", "Legal"]
  },
  {
    id: "d7",
    title: "Venkatesh Rao Employment Contract",
    documentType: "Contract",
    category: "Employment Contract",
    entityType: "driver" as const,
    entityName: "Venkatesh Rao",
    entityId: "d3",
    createdAt: "2023-04-10",
    expiryDate: new Date("2026-04-09"),
    documentPath: "/documents/d3_employment.pdf",
    tags: ["Contract", "HR", "Legal"]
  }
];

// Filter documents that are expiring soon (within 60 days)
const getExpiringDocuments = () => {
  return documents.filter(doc => {
    if (!doc.expiryDate) return false;
    const daysRemaining = Math.round((doc.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 && daysRemaining <= 60;
  }).sort((a, b) => {
    if (!a.expiryDate || !b.expiryDate) return 0;
    return a.expiryDate.getTime() - b.expiryDate.getTime(); // Sort by earliest expiry
  });
};

// Mock drivers
const drivers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    licenseNumber: 'TN10 20210012345',
    status: 'On Duty',
    experience: '8 years',
    rating: 4.8,
    assignedVehicle: 'Toyota Innova Crysta (TN01-3456)',
    earnings: { thisMonth: 42000, pending: 8000 }
  },
  {
    id: 2,
    name: 'Suresh Singh',
    phone: '+91 9765432109',
    licenseNumber: 'DL05 20180056789',
    status: 'On Duty',
    experience: '5 years',
    rating: 4.5,
    assignedVehicle: 'Mahindra Bolero (DL01-8794)',
    earnings: { thisMonth: 38000, pending: 6000 }
  },
  {
    id: 3,
    name: 'Venkatesh Rao',
    phone: '+91 9654321098',
    licenseNumber: 'KA01 20190034567',
    status: 'On Duty',
    experience: '6 years',
    rating: 4.7,
    assignedVehicle: 'Ashok Leyland Dost (KA01-9834)',
    earnings: { thisMonth: 35000, pending: 7000 }
  },
  {
    id: 4,
    name: 'Mukesh Patel',
    phone: '+91 9543210987',
    licenseNumber: 'GJ06 20170078901',
    status: 'Available',
    experience: '4 years',
    rating: 4.3,
    assignedVehicle: 'Bajaj RE Auto (GJ05-2143)',
    earnings: { thisMonth: 28000, pending: 4000 }
  }
];

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'On Rent':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'In Maintenance':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'Broken Down':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'On Duty':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Upcoming':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'Completed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const CommercialFleet = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [showScheduleMaintenanceDialog, setShowScheduleMaintenanceDialog] = useState(false);
  const [showNewRentalDialog, setShowNewRentalDialog] = useState(false);
  const [showNewInvoiceDialog, setShowNewInvoiceDialog] = useState(false);
  const [showAddDriverDialog, setShowAddDriverDialog] = useState(false);
  const [showUploadDocumentDialog, setShowUploadDocumentDialog] = useState(false);
  
  // Document search state
  const [documentSearchTerm, setDocumentSearchTerm] = useState('');
  const [documentCategoryFilter, setDocumentCategoryFilter] = useState('all');
  
  // Total fleet value
  const totalFleetValue = fleetVehicles.reduce((total, vehicle) => total + vehicle.value, 0);
  
  // Calculate fleet statistics
  const totalVehicles = fleetVehicles.length;
  const onRentCount = fleetVehicles.filter(v => v.status === 'On Rent').length;
  const availableCount = fleetVehicles.filter(v => v.status === 'Available').length;
  const maintenanceCount = fleetVehicles.filter(v => v.status === 'In Maintenance').length;
  const brokenCount = fleetVehicles.filter(v => v.status === 'Broken Down').length;
  
  // Calculate percentages
  const onRentPercentage = Math.round((onRentCount / totalVehicles) * 100);
  const availablePercentage = Math.round((availableCount / totalVehicles) * 100);
  const maintenancePercentage = Math.round((maintenanceCount / totalVehicles) * 100);
  const brokenPercentage = Math.round((brokenCount / totalVehicles) * 100);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Dashboard card click handlers - based on interaction flow
  const handleTotalFleetClick = () => {
    setActiveTab('vehicles');
    // Would query database for all vehicles in a real implementation
    // Already showing all vehicles by default, so no additional filtering needed
  };

  const handleOnRentClick = () => {
    setActiveTab('vehicles');
    // Would query database for vehicles with status = "rented"
    // For demo, we'll filter to "On Rent" status
    setVehicleStatusFilter('on-rent');
  };

  const handleAvailableClick = () => {
    setActiveTab('vehicles');
    // Would query database for vehicles with status = "available"
    // For demo, we'll filter to "Available" status
    setVehicleStatusFilter('available');
  };

  const handleMaintenanceClick = () => {
    setActiveTab('vehicles');
    // Would query database for vehicles with status = "maintenance"
    // For demo, we'll filter to "In Maintenance" status
    setVehicleStatusFilter('maintenance');
  };

  // Vehicle status filter state
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('all');
  
  // Default sort order
  const [sortOrder, setSortOrder] = useState('newest');
  
  // Enhanced vehicle information based on status
  const getEnhancedVehicleInfo = (vehicle: any) => {
    switch(vehicle.status) {
      case 'On Rent':
        return {
          ...vehicle,
          clientInfo: vehicle.clientInfo || 'ABC Travels',
          returnDate: vehicle.returnDate || '2025-05-15',
          quickAction: 'End Rental',
          quickActionColor: 'bg-blue-600 hover:bg-blue-700',
          quickActionIcon: <ArrowLeftFromLine className="h-4 w-4 mr-1" />
        };
      case 'Available':
        return {
          ...vehicle,
          availableSince: vehicle.availableSince || '2025-04-01',
          quickAction: 'Create Rental',
          quickActionColor: 'bg-green-600 hover:bg-green-700',
          quickActionIcon: <PlusCircle className="h-4 w-4 mr-1" />
        };
      case 'In Maintenance':
        return {
          ...vehicle,
          serviceProvider: vehicle.serviceProvider || 'FixPoint Authorized Service',
          estimatedCompletion: vehicle.estimatedCompletion || '2025-04-28',
          quickAction: 'Mark Complete',
          quickActionColor: 'bg-yellow-600 hover:bg-yellow-700',
          quickActionIcon: <CheckCircle className="h-4 w-4 mr-1" />
        };
      default:
        return {
          ...vehicle,
          quickAction: 'Manage Vehicle',
          quickActionColor: 'bg-primary hover:bg-primary/90',
          quickActionIcon: <Settings className="h-4 w-4 mr-1" />
        };
    }
  };

  // Search functionality for vehicles with status filtering
  const filteredVehicles = fleetVehicles
    .filter(vehicle => {
      // Text search filter
      const matchesSearch = 
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.currentDriver?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = 
        vehicleStatusFilter === 'all' || 
        (vehicleStatusFilter === 'on-rent' && vehicle.status === 'On Rent') ||
        (vehicleStatusFilter === 'available' && vehicle.status === 'Available') ||
        (vehicleStatusFilter === 'maintenance' && vehicle.status === 'In Maintenance');
      
      return matchesSearch && matchesStatus;
    })
    .map(vehicle => getEnhancedVehicleInfo(vehicle))
    // Sort by newest first (simulated)
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return a.id < b.id ? 1 : -1; // Higher ID means newer
      } else {
        return a.id > b.id ? 1 : -1;
      }
    });

  return (
    <div className={`container px-4 py-6 max-w-7xl mx-auto ${theme === 'light' ? 'bg-white text-gray-900' : ''}`}>
      {/* Header with title and theme toggle */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text'}`}>
            Commercial Fleet Management
          </h1>
          <p className={`mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Manage and optimize your commercial vehicle operations
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={theme === 'light' ? 'outline' : 'default'}
            onClick={toggleTheme}
            className={theme === 'light' ? 'border-gray-300' : ''}
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>
          <Button 
            className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}
            onClick={() => setShowAddVehicleDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>
      
      {/* Main navigation tabs */}
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid grid-cols-8 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
          <TabsTrigger value="dashboard" className={theme === 'light' ? 'data-[state=active]:bg-white' : 'data-[state=active]:bg-gray-700'}>
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="vehicles" className={theme === 'light' ? 'data-[state=active]:bg-white' : 'data-[state=active]:bg-gray-700'}>
            Vehicles
          </TabsTrigger>
          <TabsTrigger value="maintenance" className={theme === 'light' ? 'data-[state=active]:bg-white' : 'data-[state=active]:bg-gray-700'}>
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="rentals" className={theme === 'light' ? 'data-[state=active]:bg-white' : 'data-[state=active]:bg-gray-700'}>
            Rentals
          </TabsTrigger>
          <TabsTrigger value="finance" className={theme === 'light' ? 'data-[state=active]:bg-white' : 'data-[state=active]:bg-gray-700'}>
            Finance
          </TabsTrigger>
          <TabsTrigger value="drivers" className={theme === 'light' ? 'data-[state=active]:bg-white' : 'data-[state=active]:bg-gray-700'}>
            Drivers
          </TabsTrigger>
          <TabsTrigger value="documents" className={theme === 'light' ? 'data-[state=active]:bg-white' : 'data-[state=active]:bg-gray-700'}>
            Documents
          </TabsTrigger>
          <TabsTrigger value="calculators" className={theme === 'light' ? 'data-[state=active]:bg-white' : 'data-[state=active]:bg-gray-700'}>
            Calculators
          </TabsTrigger>
        </TabsList>
        
        {/* Dashboard Content */}
        <TabsContent value="dashboard" className="mt-6">
          {/* Overview Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card 
              className={`${theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'} cursor-pointer transition-all hover:shadow-md`}
              onClick={handleTotalFleetClick}
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total Fleet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{totalVehicles}</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Vehicles in fleet</p>
                  </div>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/20'}`}>
                    <TruckIcon className={`h-6 w-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className={`${theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'} cursor-pointer transition-all hover:shadow-md`}
              onClick={handleOnRentClick}
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>On Rent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{onRentCount} <span className="text-sm font-normal">({onRentPercentage}%)</span></p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Currently rented out</p>
                  </div>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/20'}`}>
                    <Car className={`h-6 w-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className={`${theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'} cursor-pointer transition-all hover:shadow-md`}
              onClick={handleAvailableClick}
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{availableCount} <span className="text-sm font-normal">({availablePercentage}%)</span></p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Ready for rental</p>
                  </div>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-green-100' : 'bg-green-900/20'}`}>
                    <CheckCircle className={`h-6 w-6 ${theme === 'light' ? 'text-green-600' : 'text-green-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className={`${theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'} cursor-pointer transition-all hover:shadow-md`}
              onClick={handleMaintenanceClick}
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>In Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{maintenanceCount} <span className="text-sm font-normal">({maintenancePercentage}%)</span></p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Under service</p>
                  </div>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900/20'}`}>
                    <WrenchIcon className={`h-6 w-6 ${theme === 'light' ? 'text-yellow-600' : 'text-yellow-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Financial Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className={`col-span-1 ${theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}`}>
              <CardHeader>
                <CardTitle>Fleet Status</CardTitle>
                <CardDescription>Current distribution of your fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fleetStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {fleetStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`col-span-2 ${theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}`}>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Total fleet value: ₹{totalFleetValue.toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Revenue" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Rental Statistics and Most Efficient Vehicles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <CardTitle>Rental Statistics</CardTitle>
                <CardDescription>Monthly rental count for the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={vehicleRentalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Rental Count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <CardTitle>Fuel Efficiency Comparison</CardTitle>
                <CardDescription>Vehicle mileage in km/liter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={fuelEfficiencyData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="vehicle" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="efficiency" name="Fuel Efficiency (km/L)" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest activities across your fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg flex items-start gap-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-green-100' : 'bg-green-900/30'}`}>
                      <Car className={`h-4 w-4 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Vehicle Rental</p>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Toyota Innova Crysta rented to ABC Travels</p>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg flex items-start gap-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900/30'}`}>
                      <WrenchIcon className={`h-4 w-4 ${theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Maintenance Completed</p>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Bajaj RE Auto serviced at Bajaj Service</p>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>5 hours ago</p>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg flex items-start gap-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'}`}>
                      <CreditCard className={`h-4 w-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Payment Received</p>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>₹12,000 received from Local Movers</p>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>Yesterday</p>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg flex items-start gap-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-purple-100' : 'bg-purple-900/30'}`}>
                      <UserCheck className={`h-4 w-4 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Driver Assignment</p>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Rajesh Kumar assigned to Toyota Innova</p>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <CardTitle>Important Alerts</CardTitle>
                <CardDescription>Maintenance and regulatory requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AlertItem 
                    icon={<AlertCircle className={`h-4 w-4 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`} />}
                    title="Urgent: Insurance Expiring"
                    description="Insurance for Tata Ace expires in 3 days"
                    type="danger"
                    theme={theme}
                    actionText="Renew insurance"
                  />
                  
                  <AlertItem 
                    icon={<WrenchIcon className={`h-4 w-4 ${theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'}`} />}
                    title="Maintenance Due"
                    description="Mahindra Bolero due for service in 5 days"
                    type="warning"
                    theme={theme}
                    actionText="Schedule now"
                  />
                  
                  <AlertItem 
                    icon={<FileTextIcon className={`h-4 w-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />}
                    title="Permit Renewal"
                    description="Commercial permit for Toyota Innova expires next week"
                    type="info"
                    theme={theme}
                    actionText="Renew permit"
                  />
                  
                  <AlertItem 
                    icon={<CheckCircle className={`h-4 w-4 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />}
                    title="Driver License Updated"
                    description="Suresh Singh's license has been successfully renewed"
                    type="success"
                    theme={theme}
                    actionText="View details"
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" className="w-full" onClick={() => setShowAlertPanel(true)}>
                    <Settings className="h-4 w-4 mr-2" /> Manage Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Vehicle Management Content */}
        <TabsContent value="vehicles" className="mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : ''}`}>
              Fleet Vehicles
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vehicles..."
                  className={`pl-10 ${theme === 'light' ? 'border-gray-300' : 'bg-gray-800 border-gray-700'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button 
                className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}
                onClick={() => setShowAddVehicleDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          </div>
          
          {/* Filters Row */}
          <div className={`p-4 rounded-lg mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'}`}>
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Vehicle Type</label>
              <Select defaultValue="all">
                <SelectTrigger className={theme === 'light' ? 'border-gray-300 bg-white' : 'bg-gray-700 border-gray-600'}>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="2-wheeler">2-Wheeler</SelectItem>
                  <SelectItem value="3-wheeler">3-Wheeler</SelectItem>
                  <SelectItem value="4-wheeler">4-Wheeler</SelectItem>
                  <SelectItem value="heavy">Heavy Vehicles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Status</label>
              <Select 
                value={vehicleStatusFilter} 
                onValueChange={setVehicleStatusFilter}
              >
                <SelectTrigger className={theme === 'light' ? 'border-gray-300 bg-white' : 'bg-gray-700 border-gray-600'}>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="on-rent">On Rent</SelectItem>
                  <SelectItem value="maintenance">In Maintenance</SelectItem>
                  <SelectItem value="broken">Broken Down</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Fuel Type</label>
              <Select defaultValue="all">
                <SelectTrigger className={theme === 'light' ? 'border-gray-300 bg-white' : 'bg-gray-700 border-gray-600'}>
                  <SelectValue placeholder="All Fuel Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="cng">CNG</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Location</label>
              <Select defaultValue="all">
                <SelectTrigger className={theme === 'light' ? 'border-gray-300 bg-white' : 'bg-gray-700 border-gray-600'}>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Vehicles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filteredVehicles.map(vehicle => (
              <Card 
                key={vehicle.id} 
                className={`overflow-hidden ${theme === 'light' ? 'border-gray-200 hover:shadow-md' : 'bg-gray-800 border-none hover:shadow-lg'} transition-shadow cursor-pointer`}
              >
                <div className={`px-4 py-3 flex justify-between items-center ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                  <div className="flex items-center">
                    <Car className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
                    <h3 className="font-medium">{vehicle.name}</h3>
                  </div>
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Registration</span>
                      <span className="font-medium">{vehicle.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Type</span>
                      <span>{vehicle.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Fuel Type</span>
                      <span>{vehicle.fuelType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Last Serviced</span>
                      <span>{vehicle.lastService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Current Driver</span>
                      <span>{vehicle.currentDriver || 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Location</span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> {vehicle.location}
                      </span>
                    </div>
                    
                    {/* Status-specific information */}
                    {vehicle.status === 'On Rent' && (
                      <>
                        <div className="flex justify-between">
                          <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Client</span>
                          <span>{vehicle.clientInfo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Return Date</span>
                          <span>{vehicle.returnDate}</span>
                        </div>
                      </>
                    )}
                    
                    {vehicle.status === 'Available' && (
                      <div className="flex justify-between">
                        <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Available Since</span>
                        <span>{vehicle.availableSince}</span>
                      </div>
                    )}
                    
                    {vehicle.status === 'In Maintenance' && (
                      <>
                        <div className="flex justify-between">
                          <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Service Provider</span>
                          <span>{vehicle.serviceProvider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Est. Completion</span>
                          <span>{vehicle.estimatedCompletion}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 gap-2 pt-0">
                  <Button 
                    variant="outline" 
                    className={`flex-1 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}
                  >
                    Details
                  </Button>
                  <Button 
                    className={`flex-1 text-white ${vehicle.quickActionColor}`}
                  >
                    {vehicle.quickActionIcon} {vehicle.quickAction}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Maintenance Module */}
        <TabsContent value="maintenance" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : ''}`}>
              Maintenance Management
            </h2>
            
            <Button 
              className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}
              onClick={() => setShowScheduleMaintenanceDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>
          
          {/* Maintenance Schedule Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Scheduled Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Upcoming maintenance</p>
                  </div>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/20'}`}>
                    <CalendarIcon2 className={`h-6 w-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Current Month Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">₹76,000</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total maintenance cost</p>
                  </div>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-green-100' : 'bg-green-900/20'}`}>
                    <CreditCard className={`h-6 w-6 ${theme === 'light' ? 'text-green-600' : 'text-green-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Completed Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Services this month</p>
                  </div>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-green-100' : 'bg-green-900/20'}`}>
                    <CheckCircle className={`h-6 w-6 ${theme === 'light' ? 'text-green-600' : 'text-green-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Maintenance Records */}
          <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Maintenance Records</CardTitle>
                <Button variant="ghost" className="flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className={`w-full text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                  <thead className={theme === 'light' ? 'bg-gray-50 text-gray-600' : 'bg-gray-700 text-gray-300'}>
                    <tr>
                      <th className="px-4 py-3 text-left">Vehicle</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Service Provider</th>
                      <th className="px-4 py-3 text-right">Cost</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {maintenanceRecords.map(record => (
                      <tr key={record.id} className={`hover:${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                        <td className="px-4 py-3">{record.vehicle}</td>
                        <td className="px-4 py-3">{record.type}</td>
                        <td className="px-4 py-3">{record.date}</td>
                        <td className="px-4 py-3">{record.provider}</td>
                        <td className="px-4 py-3 text-right">₹{record.cost.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Rental Management Content */}
        <TabsContent value="rentals" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : ''}`}>
              Rental Management
            </h2>
            
            <Button 
              className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}
              onClick={() => setShowNewRentalDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Rental
            </Button>
          </div>
          
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Active Rentals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">2</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Currently on rent</p>
                  </div>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/20'}`}>
                    <Car className={`h-6 w-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Upcoming Rentals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">1</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Scheduled bookings</p>
                  </div>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-purple-100' : 'bg-purple-900/20'}`}>
                    <CalendarIcon2 className={`h-6 w-6 ${theme === 'light' ? 'text-purple-600' : 'text-purple-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>This Month Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">₹68,000</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>From rentals</p>
                  </div>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-green-100' : 'bg-green-900/20'}`}>
                    <TrendingUp className={`h-6 w-6 ${theme === 'light' ? 'text-green-600' : 'text-green-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">₹15,000</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Outstanding amount</p>
                  </div>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-red-100' : 'bg-red-900/20'}`}>
                    <AlertCircle className={`h-6 w-6 ${theme === 'light' ? 'text-red-600' : 'text-red-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Rental Records */}
          <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Rentals</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className={theme === 'light' ? 'border-gray-200' : 'border-gray-700'}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className={theme === 'light' ? 'border-gray-200' : 'border-gray-700'}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className={`w-full text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                  <thead className={theme === 'light' ? 'bg-gray-50 text-gray-600' : 'bg-gray-700 text-gray-300'}>
                    <tr>
                      <th className="px-4 py-3 text-left">Vehicle</th>
                      <th className="px-4 py-3 text-left">Client</th>
                      <th className="px-4 py-3 text-left">Duration</th>
                      <th className="px-4 py-3 text-left">Driver</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {rentalRecords.map(record => (
                      <tr key={record.id} className={`hover:${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                        <td className="px-4 py-3">{record.vehicle}</td>
                        <td className="px-4 py-3">{record.client}</td>
                        <td className="px-4 py-3">{record.startDate} to {record.endDate}</td>
                        <td className="px-4 py-3">{record.driver}</td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">₹{record.totalAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Finance Module */}
        <TabsContent value="finance" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : ''}`}>
              Financial Management
            </h2>
            
            <div className="flex gap-2">
              <Button variant="outline" className={theme === 'light' ? 'border-gray-200' : 'border-gray-700'}>
                <Download className="h-4 w-4 mr-2" />
                Download Reports
              </Button>
              <Button 
                className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}
                onClick={() => setShowNewInvoiceDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>
          
          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total Revenue (YTD)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div>
                    <p className="text-2xl font-bold">₹8,45,000</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-green-600 font-medium' : 'text-green-400 font-medium'}`}>
                      +15% from last year
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Maintenance Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div>
                    <p className="text-2xl font-bold">₹2,12,000</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-red-600 font-medium' : 'text-red-400 font-medium'}`}>
                      +8% from last year
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Fuel Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div>
                    <p className="text-2xl font-bold">₹1,75,000</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-red-600 font-medium' : 'text-red-400 font-medium'}`}>
                      +12% from last year
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div>
                    <p className="text-2xl font-bold">₹4,58,000</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-green-600 font-medium' : 'text-green-400 font-medium'}`}>
                      +18% from last year
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Revenue Over Time Chart */}
          <Card className={`mb-6 ${theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}`}>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      name="Revenue" 
                      stroke={theme === 'light' ? '#3b82f6' : '#10b981'} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Financial Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <CardTitle>Latest Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg mb-3 flex justify-between items-center ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                  <div>
                    <p className="font-medium">INV-2023-125</p>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>ABC Travels</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Paid
                  </Badge>
                </div>
                <div className={`p-4 rounded-lg mb-3 flex justify-between items-center ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                  <div>
                    <p className="font-medium">INV-2023-124</p>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>XYZ Tours</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Pending
                  </Badge>
                </div>
                <div className={`p-4 rounded-lg flex justify-between items-center ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                  <div>
                    <p className="font-medium">INV-2023-123</p>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Fast Logistics</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Paid
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  View All Invoices
                </Button>
              </CardFooter>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Income</span>
                      <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>₹8,45,000</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Expenses</span>
                      <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>₹3,87,000</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Profit Margin</span>
                      <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>54.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: '54.2%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  Detailed Financial Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <FilePlus className="mr-2 h-4 w-4" />
                  Create New Invoice
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Tax Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Financial Forecasts
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calculator className="mr-2 h-4 w-4" />
                  ROI Calculator
                </Button>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}`}
                >
                  Financial Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Drivers Module */}
        <TabsContent value="drivers" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : ''}`}>
              Driver Management
            </h2>
            
            <Button 
              className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}
              onClick={() => setShowAddDriverDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </div>
          
          {/* Driver Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {drivers.map(driver => (
              <Card 
                key={driver.id} 
                className={`overflow-hidden ${theme === 'light' ? 'border-gray-200 hover:shadow-md' : 'bg-gray-800 border-none hover:shadow-lg'} transition-shadow`}
              >
                <div className={`px-4 py-3 flex justify-between items-center ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                  <h3 className="font-medium">{driver.name}</h3>
                  <Badge className={getStatusColor(driver.status)}>
                    {driver.status}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mt-1 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm">Rating: {driver.rating}/5.0</span>
                          <div className="ml-1 text-yellow-400">★★★★☆</div>
                        </div>
                        <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {driver.experience} experience
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <PhoneIcon className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span>{driver.phone}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>License</span>
                      <span>{driver.licenseNumber}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Assigned Vehicle</span>
                      <span>{driver.assignedVehicle || 'None'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Earnings (Month)</span>
                      <span className="font-medium">₹{driver.earnings.thisMonth.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Pending Payments</span>
                      <span className={theme === 'light' ? 'text-red-600' : 'text-red-400'}>
                        ₹{driver.earnings.pending.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 gap-2 pt-0">
                  <Button 
                    variant="outline" 
                    className={`flex-1 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}
                  >
                    Performance
                  </Button>
                  <Button 
                    className={`flex-1 ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}`}
                  >
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Driver Shift Schedule */}
          <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
            <CardHeader>
              <CardTitle>Driver Shift Schedule</CardTitle>
              <CardDescription>Current and upcoming driver assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                <p className={`mb-3 font-medium ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
                  Schedule feature is currently being developed
                </p>
                <p className={theme === 'light' ? 'text-blue-700' : 'text-blue-400'}>
                  This section will display a calendar view of driver schedules, shift assignments, and availability.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Document Management Module */}
        <TabsContent value="documents" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : ''}`}>
              Document Management
            </h2>
            
            <Button 
              className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}
              onClick={() => setShowUploadDocumentDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
          
          {/* Document Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <FileBox className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                  <CardTitle>Vehicle Documents</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileTextIcon className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span>Registration Certificates</span>
                      </div>
                      <Badge className={theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/30 text-blue-400'}>
                        15 Files
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileTextIcon className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span>Insurance Policies</span>
                      </div>
                      <Badge className={theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/30 text-blue-400'}>
                        12 Files
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileTextIcon className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span>Permit Documents</span>
                      </div>
                      <Badge className={theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/30 text-blue-400'}>
                        8 Files
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All</Button>
              </CardFooter>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <UsersIcon className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                  <CardTitle>Driver Documents</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileTextIcon className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span>Driving Licenses</span>
                      </div>
                      <Badge className={theme === 'light' ? 'bg-purple-100 text-purple-800' : 'bg-purple-900/30 text-purple-400'}>
                        8 Files
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileTextIcon className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span>ID Proofs</span>
                      </div>
                      <Badge className={theme === 'light' ? 'bg-purple-100 text-purple-800' : 'bg-purple-900/30 text-purple-400'}>
                        8 Files
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileTextIcon className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span>Address Proofs</span>
                      </div>
                      <Badge className={theme === 'light' ? 'bg-purple-100 text-purple-800' : 'bg-purple-900/30 text-purple-400'}>
                        8 Files
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All</Button>
              </CardFooter>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <FileTextIcon className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                  <CardTitle>Rental Agreements</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileTextIcon className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span>Active Contracts</span>
                      </div>
                      <Badge className={theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900/30 text-green-400'}>
                        3 Files
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileTextIcon className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span>Completed Contracts</span>
                      </div>
                      <Badge className={theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900/30 text-green-400'}>
                        25 Files
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-md ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileTextIcon className={`h-4 w-4 mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span>Template Documents</span>
                      </div>
                      <Badge className={theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900/30 text-green-400'}>
                        5 Files
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All</Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Document Expiration Alerts */}
          <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Documents Expiring Soon</CardTitle>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Manage Alerts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg flex items-start gap-3 ${theme === 'light' ? 'bg-red-50' : 'bg-red-900/20'}`}>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-red-100' : 'bg-red-900/30'}`}>
                    <AlertCircle className={`h-4 w-4 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${theme === 'light' ? 'text-red-700' : 'text-red-400'}`}>
                      Vehicle Insurance - Tata Ace (MH02-4532)
                    </p>
                    <p className={theme === 'light' ? 'text-red-600' : 'text-red-300'}>
                      Expires in 3 days (Dec 24, 2023)
                    </p>
                  </div>
                  <Button 
                    className={theme === 'light' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}
                    size="sm"
                  >
                    Renew
                  </Button>
                </div>
                
                <div className={`p-4 rounded-lg flex items-start gap-3 ${theme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900/20'}`}>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900/30'}`}>
                    <AlertCircle className={`h-4 w-4 ${theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'}`}>
                      Commercial Permit - Toyota Innova (TN01-3456)
                    </p>
                    <p className={theme === 'light' ? 'text-yellow-600' : 'text-yellow-300'}>
                      Expires in 7 days (Dec 28, 2023)
                    </p>
                  </div>
                  <Button 
                    className={theme === 'light' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}
                    size="sm"
                  >
                    Renew
                  </Button>
                </div>
                
                <div className={`p-4 rounded-lg flex items-start gap-3 ${theme === 'light' ? 'bg-yellow-50' : 'bg-yellow-900/20'}`}>
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900/30'}`}>
                    <AlertCircle className={`h-4 w-4 ${theme === 'light' ? 'text-yellow-600' : 'text-yellow-400'}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'}`}>
                      Driver License - Venkatesh Rao
                    </p>
                    <p className={theme === 'light' ? 'text-yellow-600' : 'text-yellow-300'}>
                      Expires in 15 days (Jan 05, 2024)
                    </p>
                  </div>
                  <Button 
                    className={theme === 'light' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}
                    size="sm"
                  >
                    Renew
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Financial Calculators Module */}
        <TabsContent value="calculators" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : ''}`}>
              Fleet Financial Calculators
            </h2>
          </div>
          
          {/* Calculator Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/20'}`}>
                    <Calculator className={`h-5 w-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                  </div>
                  <CardTitle>ROI Calculator</CardTitle>
                </div>
                <CardDescription>
                  Calculate return on investment for new vehicle purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                  <p className={`mb-2 font-medium ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
                    Helps you determine:
                  </p>
                  <ul className={`list-disc ml-5 ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                    <li>Breakeven point for vehicle purchase</li>
                    <li>Projected annual returns</li>
                    <li>Comparison between different vehicle options</li>
                    <li>Profit projections over vehicle lifetime</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}`}
                >
                  Open Calculator
                </Button>
              </CardFooter>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-green-100' : 'bg-green-900/20'}`}>
                    <Calculator className={`h-5 w-5 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                  </div>
                  <CardTitle>Lease vs. Buy Calculator</CardTitle>
                </div>
                <CardDescription>
                  Compare the financial implications of leasing versus buying
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'}`}>
                  <p className={`mb-2 font-medium ${theme === 'light' ? 'text-green-800' : 'text-green-300'}`}>
                    Helps you determine:
                  </p>
                  <ul className={`list-disc ml-5 ${theme === 'light' ? 'text-green-700' : 'text-green-400'}`}>
                    <li>Total cost comparison over time</li>
                    <li>Cash flow implications</li>
                    <li>Tax benefits for each option</li>
                    <li>End-of-term value comparison</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}`}
                >
                  Open Calculator
                </Button>
              </CardFooter>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-purple-100' : 'bg-purple-900/20'}`}>
                    <Calculator className={`h-5 w-5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                  </div>
                  <CardTitle>Fleet Replacement Optimizer</CardTitle>
                </div>
                <CardDescription>
                  Calculate optimal time to replace vehicles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-900/20'}`}>
                  <p className={`mb-2 font-medium ${theme === 'light' ? 'text-purple-800' : 'text-purple-300'}`}>
                    Helps you determine:
                  </p>
                  <ul className={`list-disc ml-5 ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>
                    <li>Optimal replacement time based on age and costs</li>
                    <li>Maintenance cost projections</li>
                    <li>Depreciation analysis</li>
                    <li>Replacement timing recommendations</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}`}
                >
                  Open Calculator
                </Button>
              </CardFooter>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-amber-100' : 'bg-amber-900/20'}`}>
                    <Calculator className={`h-5 w-5 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                  </div>
                  <CardTitle>TCO Calculator</CardTitle>
                </div>
                <CardDescription>
                  Total Cost of Ownership analysis per vehicle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-amber-50' : 'bg-amber-900/20'}`}>
                  <p className={`mb-2 font-medium ${theme === 'light' ? 'text-amber-800' : 'text-amber-300'}`}>
                    Helps you determine:
                  </p>
                  <ul className={`list-disc ml-5 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`}>
                    <li>Purchase/lease costs</li>
                    <li>Maintenance and repair expenses</li>
                    <li>Fuel and operational costs</li>
                    <li>Insurance and compliance expenses</li>
                    <li>End-of-life residual value</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}`}
                >
                  Open Calculator
                </Button>
              </CardFooter>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-red-100' : 'bg-red-900/20'}`}>
                    <Calculator className={`h-5 w-5 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`} />
                  </div>
                  <CardTitle>Rental Rate Calculator</CardTitle>
                </div>
                <CardDescription>
                  Determine optimal pricing for vehicle rentals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-red-50' : 'bg-red-900/20'}`}>
                  <p className={`mb-2 font-medium ${theme === 'light' ? 'text-red-800' : 'text-red-300'}`}>
                    Helps you determine:
                  </p>
                  <ul className={`list-disc ml-5 ${theme === 'light' ? 'text-red-700' : 'text-red-400'}`}>
                    <li>Competitive market-based pricing</li>
                    <li>Cost-plus pricing analysis</li>
                    <li>Profitability projections</li>
                    <li>Seasonal pricing adjustments</li>
                    <li>Special offer impact analysis</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}`}
                >
                  Open Calculator
                </Button>
              </CardFooter>
            </Card>
            
            <Card className={theme === 'light' ? 'border-gray-200' : 'bg-gray-800 border-none'}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/20'}`}>
                    <Calculator className={`h-5 w-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />
                  </div>
                  <CardTitle>Fuel Efficiency ROI</CardTitle>
                </div>
                <CardDescription>
                  Calculate savings from more fuel-efficient vehicles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-900/20'}`}>
                  <p className={`mb-2 font-medium ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-300'}`}>
                    Helps you determine:
                  </p>
                  <ul className={`list-disc ml-5 ${theme === 'light' ? 'text-indigo-700' : 'text-indigo-400'}`}>
                    <li>Fuel cost savings over time</li>
                    <li>Break-even point for investment premium</li>
                    <li>Environmental impact analysis</li>
                    <li>Comparison between vehicle options</li>
                    <li>Payback period calculator</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${theme === 'light' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-primary hover:bg-primary/90 text-black'}`}
                >
                  Open Calculator
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Alert Management Dialog */}
      <Dialog open={showAlertPanel} onOpenChange={setShowAlertPanel}>
        <DialogContent className={theme === 'light' ? '' : 'bg-gray-800 border-gray-700'}>
          <DialogHeader>
            <DialogTitle className={theme === 'light' ? '' : 'text-white'}>Alert Management</DialogTitle>
            <DialogDescription>
              Configure notification preferences and manage your alerts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
              <h3 className={`font-medium mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Alert Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    <span className="flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      Document Expiry Alerts
                    </span>
                  </label>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="15">15 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    <span className="flex items-center">
                      <WrenchIcon className="h-4 w-4 mr-2" />
                      Maintenance Reminders
                    </span>
                  </label>
                  <Select defaultValue="15">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="15">15 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    <span className="flex items-center">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Driver License Expiry
                    </span>
                  </label>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
              <h3 className={`font-medium mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Notification Channels</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email-notif" className="rounded" defaultChecked />
                  <label htmlFor="email-notif" className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Email Notifications</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sms-notif" className="rounded" defaultChecked />
                  <label htmlFor="sms-notif" className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>SMS Notifications</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="push-notif" className="rounded" defaultChecked />
                  <label htmlFor="push-notif" className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Push Notifications</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="whatsapp-notif" className="rounded" />
                  <label htmlFor="whatsapp-notif" className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>WhatsApp Notifications</label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAlertPanel(false)}
              className={theme === 'light' ? '' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
            >
              Cancel
            </Button>
            <Button 
              className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
              onClick={() => setShowAlertPanel(false)}
            >
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Vehicle Dialog */}
      <AddVehicleDialog 
        open={showAddVehicleDialog}
        onOpenChange={setShowAddVehicleDialog}
        theme={theme}
      />

      {/* Schedule Maintenance Dialog */}
      <ScheduleMaintenanceDialog 
        open={showScheduleMaintenanceDialog}
        onOpenChange={setShowScheduleMaintenanceDialog}
        theme={theme}
      />

      {/* New Rental Dialog */}
      <NewRentalDialog 
        open={showNewRentalDialog}
        onOpenChange={setShowNewRentalDialog}
        theme={theme}
      />

      {/* New Invoice Dialog */}
      <NewInvoiceDialog 
        open={showNewInvoiceDialog}
        onOpenChange={setShowNewInvoiceDialog}
        theme={theme}
      />

      {/* Add Driver Dialog */}
      <AddDriverDialog 
        open={showAddDriverDialog}
        onOpenChange={setShowAddDriverDialog}
        theme={theme}
      />
    </div>
  );
};

export default CommercialFleet;