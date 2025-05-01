import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Vehicle } from '@shared/schema';
import ValueTrendPredictor from '@/components/dashboard/ValueTrendPredictor';
import { 
  Car, 
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ListFilter,
  Clock,
  CheckCircle,
  CarFront,
  Shield,
  FileText,
  Award,
  AlertTriangle,
  Calendar,
  CircleDollarSign,
  Activity,
  ShoppingBag,
  Clock3,
  Warehouse,
  AlertOctagon,
  KeySquare,
  Tag,
  ShieldOff,
  Trash2,
  MoreHorizontal,
  Truck,
  Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';
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
  DialogTitle
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

// Type definitions for vehicle status categories
type VehicleStatus = 
  | 'active' 
  | 'recently-purchased' 
  | 'pre-owned' 
  | 'in-maintenance' 
  | 'garage-stored' 
  | 'out-of-service' 
  | 'commercial-fleet' 
  | 'leased-out' 
  | 'for-sale' 
  | 'sold' 
  | 'impounded' 
  | 'under-legal-hold' 
  | 'stolen' 
  | 'scrapped'
  | 'totaled';

// Enhanced vehicle type with status
interface EnhancedVehicle extends Vehicle {
  status?: VehicleStatus;
}

const VehicleVault = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('list');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('active');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<EnhancedVehicle | null>(null);
  const [newStatus, setNewStatus] = useState<VehicleStatus | ''>('');
  
  // For toast notifications
  const { toast } = useToast();
  // Access query client for cache invalidation
  const queryClient = useQueryClient();
  
  // Query for user's vehicles
  const { data: vehicles, isLoading } = useQuery<EnhancedVehicle[]>({
    queryKey: ['/api/vehicles'],
  });
  
  // Mutation for updating vehicle status
  const updateVehicleStatusMutation = useMutation({
    mutationFn: async (data: { vehicleId: number, newStatus: VehicleStatus }) => {
      const response = await apiRequest('PATCH', `/api/vehicles/${data.vehicleId}/status`, { status: data.newStatus });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      toast({
        title: "Vehicle status updated",
        description: `The vehicle was moved to ${formatStatus(newStatus as VehicleStatus)} category.`,
      });
      // Close dialog
      setShowStatusDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating vehicle status",
        description: error.message || "Failed to update vehicle status. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Handle status change
  const handleStatusChange = () => {
    if (selectedVehicle && newStatus) {
      updateVehicleStatusMutation.mutate({ 
        vehicleId: selectedVehicle.id, 
        newStatus: newStatus as VehicleStatus 
      });
    }
  };
  
  // Format status for display
  const formatStatus = (status: VehicleStatus): string => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Mock vehicle data if API doesn't return anything
  const vehicleData: EnhancedVehicle[] = [
    {
      id: 1,
      name: 'Honda City',
      licensePlate: 'MH02AB1234',
      healthScore: 92,
      serviceStatus: 'up-to-date',
      fuelType: 'petrol',
      lastUpdate: '3 hours ago',
      imageSrc: '',
      make: 'Honda',
      model: 'City',
      year: 2020,
      purchaseValue: 1200000,
      currentValue: 950000,
      monthlyDepreciation: 8500,
      color: 'White',
      condition: 'good',
      status: 'active'
    },
    {
      id: 2,
      name: 'Hyundai Creta',
      licensePlate: 'KA01MJ5678',
      healthScore: 75,
      serviceStatus: 'due',
      fuelType: 'diesel',
      lastUpdate: '1 day ago',
      imageSrc: '',
      make: 'Hyundai',
      model: 'Creta',
      year: 2021,
      purchaseValue: 1500000,
      currentValue: 1100000,
      monthlyDepreciation: 11000,
      color: 'Blue',
      condition: 'fair',
      status: 'in-maintenance'
    },
    {
      id: 3,
      name: 'Maruti Swift',
      licensePlate: 'DL7CX9012',
      healthScore: 95,
      serviceStatus: 'up-to-date',
      fuelType: 'petrol',
      lastUpdate: '5 hours ago',
      imageSrc: '',
      make: 'Maruti',
      model: 'Swift',
      year: 2021,
      purchaseValue: 850000,
      currentValue: 750000,
      monthlyDepreciation: 5000,
      color: 'Red',
      condition: 'excellent',
      status: 'active'
    },
    {
      id: 4,
      name: 'Toyota Fortuner',
      licensePlate: 'GJ05CD7890',
      healthScore: 88,
      serviceStatus: 'up-to-date',
      fuelType: 'diesel',
      lastUpdate: '1 day ago',
      imageSrc: '',
      make: 'Toyota',
      model: 'Fortuner',
      year: 2019,
      purchaseValue: 3200000,
      currentValue: 2600000,
      monthlyDepreciation: 16000,
      color: 'Black',
      condition: 'good',
      status: 'commercial-fleet'
    },
    {
      id: 5,
      name: 'Tata Nexon',
      licensePlate: 'MH14GH5678',
      healthScore: 90,
      serviceStatus: 'up-to-date',
      fuelType: 'petrol',
      lastUpdate: '2 days ago',
      imageSrc: '',
      make: 'Tata',
      model: 'Nexon',
      year: 2022,
      purchaseValue: 1100000,
      currentValue: 950000,
      monthlyDepreciation: 6000,
      color: 'White',
      condition: 'excellent',
      status: 'recently-purchased'
    },
    {
      id: 6,
      name: 'Kia Seltos',
      licensePlate: 'DL08KL1234',
      healthScore: 65,
      serviceStatus: 'overdue',
      fuelType: 'diesel',
      lastUpdate: '10 days ago',
      imageSrc: '',
      make: 'Kia',
      model: 'Seltos',
      year: 2020,
      purchaseValue: 1450000,
      currentValue: 1050000,
      monthlyDepreciation: 8000,
      color: 'Silver',
      condition: 'fair',
      status: 'out-of-service'
    },
    {
      id: 7,
      name: 'Mahindra XUV700',
      licensePlate: 'KA09MN4567',
      healthScore: 85,
      serviceStatus: 'up-to-date',
      fuelType: 'diesel',
      lastUpdate: '5 days ago',
      imageSrc: '',
      make: 'Mahindra',
      model: 'XUV700',
      year: 2022,
      purchaseValue: 1800000,
      currentValue: 1650000,
      monthlyDepreciation: 7500,
      color: 'Red',
      condition: 'good',
      status: 'active'
    },
    {
      id: 8,
      name: 'Honda Amaze',
      licensePlate: 'TN07DE8901',
      healthScore: 78,
      serviceStatus: 'due',
      fuelType: 'petrol',
      lastUpdate: '7 days ago',
      imageSrc: '',
      make: 'Honda',
      model: 'Amaze',
      year: 2019,
      purchaseValue: 900000,
      currentValue: 650000,
      monthlyDepreciation: 5000,
      color: 'Grey',
      condition: 'fair',
      status: 'for-sale'
    },
    {
      id: 9,
      name: 'Maruti Baleno',
      licensePlate: 'HR26PQ3456',
      healthScore: 91,
      serviceStatus: 'up-to-date',
      fuelType: 'petrol',
      lastUpdate: '1 day ago',
      imageSrc: '',
      make: 'Maruti',
      model: 'Baleno',
      year: 2021,
      purchaseValue: 850000,
      currentValue: 720000,
      monthlyDepreciation: 4500,
      color: 'Blue',
      condition: 'excellent',
      status: 'active'
    }
  ];
  
  // Status categories with icons and counts
  const statusCategories = [
    { 
      id: 'active', 
      label: 'Active', 
      icon: <Activity className="h-4 w-4 text-emerald-600" />,
      count: 9,
      bgClass: 'bg-emerald-50 border-emerald-200'
    },
    { 
      id: 'recently-purchased', 
      label: 'Recently Purchased', 
      icon: <ShoppingBag className="h-4 w-4 text-blue-600" />,
      count: 5,
      bgClass: 'bg-blue-50 border-blue-200'
    },
    { 
      id: 'pre-owned', 
      label: 'Pre-owned', 
      icon: <Clock3 className="h-4 w-4 text-indigo-600" />,
      count: 6,
      bgClass: 'bg-indigo-50 border-indigo-200'
    },
    { 
      id: 'in-maintenance', 
      label: 'In Maintenance', 
      icon: <Clock className="h-4 w-4 text-amber-600" />,
      count: 3,
      bgClass: 'bg-amber-50 border-amber-200'
    },
    { 
      id: 'garage-stored', 
      label: 'Garage Stored', 
      icon: <Warehouse className="h-4 w-4 text-cyan-600" />,
      count: 4,
      bgClass: 'bg-cyan-50 border-cyan-200'
    },
    { 
      id: 'out-of-service', 
      label: 'Out of Service', 
      icon: <AlertOctagon className="h-4 w-4 text-gray-600" />,
      count: 3,
      bgClass: 'bg-gray-50 border-gray-200'
    },
    { 
      id: 'commercial-fleet', 
      label: 'Commercial Fleet', 
      icon: <Truck className="h-4 w-4 text-violet-600" />,
      count: 7,
      bgClass: 'bg-violet-50 border-violet-200'
    },
    { 
      id: 'leased-out', 
      label: 'Leased Out', 
      icon: <KeySquare className="h-4 w-4 text-green-600" />,
      count: 5,
      bgClass: 'bg-green-50 border-green-200'
    },
    { 
      id: 'for-sale', 
      label: 'For Sale', 
      icon: <Tag className="h-4 w-4 text-rose-600" />,
      count: 4,
      bgClass: 'bg-rose-50 border-rose-200'
    },
    { 
      id: 'sold', 
      label: 'Sold', 
      icon: <CheckCircle className="h-4 w-4 text-blue-600" />,
      count: 8,
      bgClass: 'bg-blue-50 border-blue-200'
    },
    { 
      id: 'impounded', 
      label: 'Impounded', 
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
      count: 4,
      bgClass: 'bg-red-50 border-red-200'
    },
    { 
      id: 'under-legal-hold', 
      label: 'Under Legal Hold', 
      icon: <Shield className="h-4 w-4 text-amber-600" />,
      count: 3,
      bgClass: 'bg-amber-50 border-amber-200'
    },
    { 
      id: 'stolen', 
      label: 'Stolen', 
      icon: <ShieldOff className="h-4 w-4 text-red-600" />,
      count: 2,
      bgClass: 'bg-red-50 border-red-200'
    },
    { 
      id: 'scrapped', 
      label: 'Scrapped', 
      icon: <Trash2 className="h-4 w-4 text-gray-600" />,
      count: 3,
      bgClass: 'bg-gray-50 border-gray-200'
    },
    { 
      id: 'totaled', 
      label: 'Totaled', 
      icon: <Ban className="h-4 w-4 text-gray-600" />,
      count: 2,
      bgClass: 'bg-gray-50 border-gray-200'
    },
  ];
  
  // Get all vehicles or filter by status
  const vehiclesList = vehicles && vehicles.length > 0 ? vehicles : vehicleData;
  
  // Filter vehicles by selected status
  const filteredVehicles = statusFilter === 'all' 
    ? vehiclesList 
    : vehiclesList.filter(v => v.status === statusFilter);
  
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const getServiceStatusColor = (status: string) => {
    switch(status) {
      case 'up-to-date': return 'text-emerald-600';
      case 'due': return 'text-amber-600';
      default: return 'text-rose-600';
    }
  };
  
  const getServiceStatusIcon = (status: string) => {
    switch(status) {
      case 'up-to-date': return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      default: return <Clock className="h-3.5 w-3.5 mr-1" />;
    }
  };
  
  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-700';
    if (score >= 75) return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Vehicle Vault</h1>
        </div>
        <p className="text-gray-600">Manage all your vehicles, documents and service history</p>
      </div>
      
      {/* Status Categories Header - Fixed layout based on screenshot */}
      <div className="mb-8">
        <div className="grid grid-cols-7 gap-2 mb-2">
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'active' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('active')}
          >
            <Activity className="h-4 w-4 text-emerald-600" />
            <span>Active</span>
            <Badge className={`ml-1 ${statusFilter === 'active' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              9
            </Badge>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'recently-purchased' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('recently-purchased')}
          >
            <ShoppingBag className="h-4 w-4 text-blue-600" />
            <span>Recently Purchased</span>
            <Badge className={`ml-1 ${statusFilter === 'recently-purchased' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              5
            </Badge>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'pre-owned' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('pre-owned')}
          >
            <Clock3 className="h-4 w-4 text-indigo-600" />
            <span>Pre-owned</span>
            <Badge className={`ml-1 ${statusFilter === 'pre-owned' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              6
            </Badge>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'in-maintenance' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('in-maintenance')}
          >
            <Clock className="h-4 w-4 text-amber-600" />
            <span>In Maintenance</span>
            <Badge className={`ml-1 ${statusFilter === 'in-maintenance' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              3
            </Badge>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'garage-stored' ? 'bg-cyan-50 border-cyan-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('garage-stored')}
          >
            <Warehouse className="h-4 w-4 text-cyan-600" />
            <span>Garage Stored</span>
            <Badge className={`ml-1 ${statusFilter === 'garage-stored' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              4
            </Badge>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'out-of-service' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('out-of-service')}
          >
            <AlertOctagon className="h-4 w-4 text-gray-600" />
            <span>Out of Service</span>
            <Badge className={`ml-1 ${statusFilter === 'out-of-service' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              3
            </Badge>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'commercial-fleet' ? 'bg-violet-50 border-violet-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('commercial-fleet')}
          >
            <Truck className="h-4 w-4 text-violet-600" />
            <span>Commercial Fleet</span>
            <Badge className={`ml-1 ${statusFilter === 'commercial-fleet' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              7
            </Badge>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'leased-out' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('leased-out')}
          >
            <KeySquare className="h-4 w-4 text-green-600" />
            <span>Leased Out</span>
            <Badge className={`ml-1 ${statusFilter === 'leased-out' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              5
            </Badge>
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'for-sale' ? 'bg-rose-50 border-rose-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('for-sale')}
          >
            <Tag className="h-4 w-4 text-rose-600" />
            <span>For Sale</span>
            <Badge className={`ml-1 ${statusFilter === 'for-sale' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              4
            </Badge>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'sold' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('sold')}
          >
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span>Sold</span>
            <Badge className={`ml-1 ${statusFilter === 'sold' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              8
            </Badge>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'impounded' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('impounded')}
          >
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span>Impounded</span>
            <Badge className={`ml-1 ${statusFilter === 'impounded' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              4
            </Badge>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'under-legal-hold' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('under-legal-hold')}
          >
            <Shield className="h-4 w-4 text-amber-600" />
            <span>Under Legal Hold</span>
            <Badge className={`ml-1 ${statusFilter === 'under-legal-hold' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              3
            </Badge>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'stolen' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('stolen')}
          >
            <ShieldOff className="h-4 w-4 text-red-600" />
            <span>Stolen</span>
            <Badge className={`ml-1 ${statusFilter === 'stolen' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              2
            </Badge>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'scrapped' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('scrapped')}
          >
            <Trash2 className="h-4 w-4 text-gray-600" />
            <span>Scrapped</span>
            <Badge className={`ml-1 ${statusFilter === 'scrapped' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              3
            </Badge>
          </button>
        </div>
        
        <div className="mt-2">
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all border ${statusFilter === 'totaled' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}
            onClick={() => setStatusFilter('totaled')}
          >
            <Ban className="h-4 w-4 text-gray-600" />
            <span>Totaled</span>
            <Badge className={`ml-1 ${statusFilter === 'totaled' ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
              2
            </Badge>
          </button>
        </div>
        
        <Separator className="my-4 opacity-50" />
      </div>
      
      <Tabs 
        defaultValue="list" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">Vehicle List</TabsTrigger>
            <TabsTrigger value="value-trends">Value Insights</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search vehicles..."
                className="w-64 pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Add Vehicle
            </Button>
          </div>
        </div>
        
        <TabsContent value="list" className="space-y-6">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-10 border rounded-lg">
              <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No vehicles found</h3>
              <p className="text-gray-500 mb-4">There are no vehicles in the selected category</p>
              <Button onClick={() => setStatusFilter('all')}>View All Vehicles</Button>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredVehicles.map(vehicle => (
                <motion.div 
                  key={vehicle.id}
                  className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all relative group"
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                >
                  {/* Action dropdown menu */}
                  <div className="absolute right-3 top-3 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/vehicle-vault/${vehicle.id}`)}>
                          <Search className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setShowStatusDialog(true);
                          }}
                        >
                          <Activity className="h-4 w-4 mr-2" />
                          Change Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Clock className="h-4 w-4 mr-2" />
                          Service History
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Status badge */}
                  {vehicle.status && (
                    <div className="absolute left-3 top-3 z-10">
                      <Badge 
                        className={`
                          ${vehicle.status === 'active' ? 'bg-emerald-100 text-emerald-700' : ''}
                          ${vehicle.status === 'recently-purchased' ? 'bg-blue-100 text-blue-700' : ''}
                          ${vehicle.status === 'in-maintenance' ? 'bg-amber-100 text-amber-700' : ''}
                          ${vehicle.status === 'out-of-service' ? 'bg-gray-100 text-gray-700' : ''}
                          ${vehicle.status === 'commercial-fleet' ? 'bg-violet-100 text-violet-700' : ''}
                          ${vehicle.status === 'for-sale' ? 'bg-rose-100 text-rose-700' : ''}
                          ${vehicle.status === 'stolen' ? 'bg-red-100 text-red-700' : ''}
                        `}
                      >
                        {formatStatus(vehicle.status)}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="h-40 bg-gray-100 relative cursor-pointer" onClick={() => navigate(`/vehicle-vault/${vehicle.id}`)}>
                    {vehicle.imageSrc ? (
                      <img 
                        src={vehicle.imageSrc} 
                        alt={vehicle.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Car className="h-20 w-20 text-gray-300" />
                      </div>
                    )}
                    <Badge 
                      className="absolute bottom-3 right-3"
                      variant="outline"
                    >
                      {vehicle.fuelType}
                    </Badge>
                  </div>
                  
                  <div className="p-4 cursor-pointer" onClick={() => navigate(`/vehicle-vault/${vehicle.id}`)}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg">{vehicle.name}</h3>
                        <p className="text-gray-500 text-sm">{vehicle.licensePlate}</p>
                      </div>
                      <Badge className={getHealthScoreColor(vehicle.healthScore || 0)}>
                        {vehicle.healthScore || 0}%
                      </Badge>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <CarFront className="h-3.5 w-3.5 mr-1.5" />
                        <span>{vehicle.make} {vehicle.model}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span>{vehicle.year}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className={`flex items-center text-xs ${getServiceStatusColor(vehicle.serviceStatus || 'unknown')}`}>
                        {getServiceStatusIcon(vehicle.serviceStatus || 'unknown')}
                        <span>Service {vehicle.serviceStatus || 'unknown'}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Updated {vehicle.lastUpdate || 'recently'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="value-trends">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Vehicle Value Insights</h2>
              <Badge className="bg-indigo-100 text-indigo-700 rounded-full">
                New Feature
              </Badge>
            </div>
            <ValueTrendPredictor vehicles={vehiclesList.map(v => ({
              id: v.id,
              name: v.name,
              make: v.make,
              model: v.model,
              year: v.year,
              purchaseValue: v.purchaseValue,
              currentValue: v.currentValue,
              monthlyDepreciation: v.monthlyDepreciation,
              color: v.color,
              condition: v.condition as 'excellent' | 'good' | 'fair' | 'poor',
            }))} />
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CircleDollarSign className="h-5 w-5 text-blue-600 mr-2" />
              Value Optimization Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white rounded-lg border shadow-sm">
                <div className="text-blue-600 font-medium mb-2">Regular Maintenance</div>
                <p className="text-sm text-gray-600">Following the service schedule can increase resale value by up to 15%</p>
              </div>
              <div className="p-4 bg-white rounded-lg border shadow-sm">
                <div className="text-blue-600 font-medium mb-2">Mileage Management</div>
                <p className="text-sm text-gray-600">Keep annual mileage under 10,000 km to maximize value retention</p>
              </div>
              <div className="p-4 bg-white rounded-lg border shadow-sm">
                <div className="text-blue-600 font-medium mb-2">Documentation</div>
                <p className="text-sm text-gray-600">Maintain complete service records and keep all original features</p>
              </div>
            </div>
          </div>
        </TabsContent>
      
        <TabsContent value="documents">
          <div className="border rounded-lg p-6 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Documents Section</h3>
            <p className="text-gray-500 mb-4">Manage all your vehicle related documents here</p>
            <Button>Upload Documents</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="reminders">
          <div className="border rounded-lg p-6 text-center">
            <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Reminders Section</h3>
            <p className="text-gray-500 mb-4">Set up reminders for insurance, service and more</p>
            <Button>Create Reminder</Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Vehicle Status</DialogTitle>
            <DialogDescription>
              Select a new status for {selectedVehicle?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3 py-4">
            {statusCategories.map((category) => (
              <button
                key={category.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border
                  ${newStatus === category.id ? 
                    `${category.bgClass} ring-2 ring-offset-1 ring-${category.bgClass.split('-')[1]}-400` : 
                    'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
                onClick={() => setNewStatus(category.id as VehicleStatus)}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
          
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setNewStatus('');
                setShowStatusDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={!newStatus || updateVehicleStatusMutation.isPending}
              className="min-w-[100px]"
            >
              {updateVehicleStatusMutation.isPending ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleVault;