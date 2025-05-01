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
  Ban,
  AlertCircle,
  ActivitySquare,
  CircleDot
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
      <div className="mb-6 relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-blue-900/90 to-indigo-900/90 shadow-xl border border-blue-700/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.8))]"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative flex justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
              <Car className="h-8 w-8 text-blue-100" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Vehicle Vault</h1>
              <p className="text-blue-100/80">Manage all your vehicles, documents and service history</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
              <div className="text-xs text-blue-100/70">Total Assets</div>
              <div className="font-semibold text-white">₹ 1.24 Cr</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
              <div className="text-xs text-blue-100/70">Vehicles</div>
              <div className="font-semibold text-white">15</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
              <div className="text-xs text-blue-100/70">Service Due</div>
              <div className="font-semibold text-amber-300">3</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Categories Header - Fixed layout based on screenshot */}
      <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm border border-gray-200/60">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
          <ListFilter className="h-5 w-5 mr-2 text-blue-600" />
          Vehicle Status Categories
        </h3>
        
        <div className="grid grid-cols-7 gap-3 mb-3">
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'active' 
                ? 'bg-gradient-to-r from-emerald-500/90 to-green-600/90 text-white border-0' 
                : 'bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200'
            }`}
            onClick={() => setStatusFilter('active')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'active' ? 'bg-white/20' : 'bg-emerald-100'
              }`}>
                <Activity className="h-4 w-4 text-emerald-600" />
              </div>
              <span>Active</span>
            </div>
            <Badge className={`${
              statusFilter === 'active' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              9
            </Badge>
          </button>
          
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'recently-purchased' 
                ? 'bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white border-0' 
                : 'bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200'
            }`}
            onClick={() => setStatusFilter('recently-purchased')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'recently-purchased' ? 'bg-white/20' : 'bg-blue-100'
              }`}>
                <ShoppingBag className="h-4 w-4 text-blue-600" />
              </div>
              <span>Recently Purchased</span>
            </div>
            <Badge className={`${
              statusFilter === 'recently-purchased' ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700'
            }`}>
              5
            </Badge>
          </button>
          
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'pre-owned' 
                ? 'bg-gradient-to-r from-indigo-500/90 to-indigo-600/90 text-white border-0' 
                : 'bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200'
            }`}
            onClick={() => setStatusFilter('pre-owned')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'pre-owned' ? 'bg-white/20' : 'bg-indigo-100'
              }`}>
                <Clock3 className="h-4 w-4 text-indigo-600" />
              </div>
              <span>Pre-owned</span>
            </div>
            <Badge className={`${
              statusFilter === 'pre-owned' ? 'bg-white text-indigo-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              6
            </Badge>
          </button>
          
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'in-maintenance' 
                ? 'bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-white border-0' 
                : 'bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-200'
            }`}
            onClick={() => setStatusFilter('in-maintenance')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'in-maintenance' ? 'bg-white/20' : 'bg-amber-100'
              }`}>
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <span>In Maintenance</span>
            </div>
            <Badge className={`${
              statusFilter === 'in-maintenance' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-700'
            }`}>
              3
            </Badge>
          </button>
          
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'garage-stored' 
                ? 'bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 text-white border-0' 
                : 'bg-white hover:bg-cyan-50 border border-gray-200 hover:border-cyan-200'
            }`}
            onClick={() => setStatusFilter('garage-stored')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'garage-stored' ? 'bg-white/20' : 'bg-cyan-100'
              }`}>
                <Warehouse className="h-4 w-4 text-cyan-600" />
              </div>
              <span>Garage Stored</span>
            </div>
            <Badge className={`${
              statusFilter === 'garage-stored' ? 'bg-white text-cyan-700' : 'bg-cyan-100 text-cyan-700'
            }`}>
              4
            </Badge>
          </button>
          
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'out-of-service' 
                ? 'bg-gradient-to-r from-gray-500/90 to-gray-600/90 text-white border-0' 
                : 'bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setStatusFilter('out-of-service')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'out-of-service' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                <AlertOctagon className="h-4 w-4 text-gray-600" />
              </div>
              <span>Out of Service</span>
            </div>
            <Badge className={`${
              statusFilter === 'out-of-service' ? 'bg-white text-gray-700' : 'bg-gray-200 text-gray-700'
            }`}>
              3
            </Badge>
          </button>
          
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'commercial-fleet' 
                ? 'bg-gradient-to-r from-violet-500/90 to-violet-600/90 text-white border-0' 
                : 'bg-white hover:bg-violet-50 border border-gray-200 hover:border-violet-200'
            }`}
            onClick={() => setStatusFilter('commercial-fleet')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'commercial-fleet' ? 'bg-white/20' : 'bg-violet-100'
              }`}>
                <Truck className="h-4 w-4 text-violet-600" />
              </div>
              <span>Commercial Fleet</span>
            </div>
            <Badge className={`${
              statusFilter === 'commercial-fleet' ? 'bg-white text-violet-700' : 'bg-violet-100 text-violet-700'
            }`}>
              7
            </Badge>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-3">
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'leased-out' 
                ? 'bg-gradient-to-r from-green-500/90 to-green-600/90 text-white border-0' 
                : 'bg-white hover:bg-green-50 border border-gray-200 hover:border-green-200'
            }`}
            onClick={() => setStatusFilter('leased-out')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'leased-out' ? 'bg-white/20' : 'bg-green-100'
              }`}>
                <KeySquare className="h-4 w-4 text-green-600" />
              </div>
              <span>Leased Out</span>
            </div>
            <Badge className={`${
              statusFilter === 'leased-out' ? 'bg-white text-green-700' : 'bg-green-100 text-green-700'
            }`}>
              5
            </Badge>
          </button>

          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'for-sale' 
                ? 'bg-gradient-to-r from-rose-500/90 to-rose-600/90 text-white border-0' 
                : 'bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-200'
            }`}
            onClick={() => setStatusFilter('for-sale')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'for-sale' ? 'bg-white/20' : 'bg-rose-100'
              }`}>
                <Tag className="h-4 w-4 text-rose-600" />
              </div>
              <span>For Sale</span>
            </div>
            <Badge className={`${
              statusFilter === 'for-sale' ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-700'
            }`}>
              4
            </Badge>
          </button>
          
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'sold' 
                ? 'bg-gradient-to-r from-blue-500/90 to-sky-600/90 text-white border-0' 
                : 'bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200'
            }`}
            onClick={() => setStatusFilter('sold')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'sold' ? 'bg-white/20' : 'bg-blue-100'
              }`}>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <span>Sold</span>
            </div>
            <Badge className={`${
              statusFilter === 'sold' ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700'
            }`}>
              8
            </Badge>
          </button>
          
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'impounded' 
                ? 'bg-gradient-to-r from-red-500/90 to-red-600/90 text-white border-0' 
                : 'bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200'
            }`}
            onClick={() => setStatusFilter('impounded')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'impounded' ? 'bg-white/20' : 'bg-red-100'
              }`}>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <span>Impounded</span>
            </div>
            <Badge className={`${
              statusFilter === 'impounded' ? 'bg-white text-red-700' : 'bg-red-100 text-red-700'
            }`}>
              4
            </Badge>
          </button>
          
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'under-legal-hold' 
                ? 'bg-gradient-to-r from-amber-500/90 to-orange-600/90 text-white border-0' 
                : 'bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-200'
            }`}
            onClick={() => setStatusFilter('under-legal-hold')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'under-legal-hold' ? 'bg-white/20' : 'bg-amber-100'
              }`}>
                <Shield className="h-4 w-4 text-amber-600" />
              </div>
              <span>Under Legal Hold</span>
            </div>
            <Badge className={`${
              statusFilter === 'under-legal-hold' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-700'
            }`}>
              3
            </Badge>
          </button>
          
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'stolen' 
                ? 'bg-gradient-to-r from-red-500/90 to-red-600/90 text-white border-0' 
                : 'bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200'
            }`}
            onClick={() => setStatusFilter('stolen')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'stolen' ? 'bg-white/20' : 'bg-red-100'
              }`}>
                <ShieldOff className="h-4 w-4 text-red-600" />
              </div>
              <span>Stolen</span>
            </div>
            <Badge className={`${
              statusFilter === 'stolen' ? 'bg-white text-red-700' : 'bg-red-100 text-red-700'
            }`}>
              2
            </Badge>
          </button>
          
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'scrapped' 
                ? 'bg-gradient-to-r from-gray-500/90 to-gray-600/90 text-white border-0' 
                : 'bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setStatusFilter('scrapped')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'scrapped' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                <Trash2 className="h-4 w-4 text-gray-600" />
              </div>
              <span>Scrapped</span>
            </div>
            <Badge className={`${
              statusFilter === 'scrapped' ? 'bg-white text-gray-700' : 'bg-gray-200 text-gray-700'
            }`}>
              3
            </Badge>
          </button>
        </div>
        
        <div className="mt-3">
          <button
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-sm ${
              statusFilter === 'totaled' 
                ? 'bg-gradient-to-r from-gray-500/90 to-gray-600/90 text-white border-0' 
                : 'bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setStatusFilter('totaled')}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                statusFilter === 'totaled' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                <Ban className="h-4 w-4 text-gray-600" />
              </div>
              <span>Totaled</span>
            </div>
            <Badge className={`${
              statusFilter === 'totaled' ? 'bg-white text-gray-700' : 'bg-gray-200 text-gray-700'
            }`}>
              2
            </Badge>
          </button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="list" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 rounded-xl p-4 bg-white shadow-sm border border-gray-100">
          <TabsList className="bg-blue-100/50 p-1 rounded-lg">
            <TabsTrigger 
              value="list" 
              className={`${activeTab === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-700 hover:bg-blue-100'}`}
            >
              <Car className="h-4 w-4 mr-2" />
              Vehicle List
            </TabsTrigger>
            <TabsTrigger 
              value="value-trends" 
              className={`${activeTab === 'value-trends' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-700 hover:bg-blue-100'}`}
            >
              <CircleDollarSign className="h-4 w-4 mr-2" />
              Value Insights
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className={`${activeTab === 'documents' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-700 hover:bg-blue-100'}`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="reminders" 
              className={`${activeTab === 'reminders' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-700 hover:bg-blue-100'}`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Reminders
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-blue-500" />
              </div>
              <Input
                type="text"
                placeholder="Search vehicles by name, make, plate..."
                className="w-full pl-10 border-blue-200 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-lg border-blue-200 hover:bg-blue-50 h-10 w-10"
            >
              <Filter className="h-4 w-4 text-blue-600" />
            </Button>
            <Button 
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100/60 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-800">Document Categories</h3>
                  <Button variant="ghost" size="sm" className="text-blue-700 hover:text-blue-900 p-1 h-8 rounded-lg">
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {['Registration', 'Insurance', 'Service Records', 'Purchase Documents', 'Loan/Lease', 'RTO Documents', 'Custom Modifications'].map((category) => (
                    <button key={category} className="w-full flex items-center justify-between p-3 rounded-lg bg-white hover:bg-blue-50 border border-blue-100 transition-colors">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium">{category}</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {Math.floor(Math.random() * 5) + 1}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-8">
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-800">Vehicle Documents</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg border-blue-200 text-blue-700">
                      <FileText className="h-4 w-4 mr-1" />
                      Export All
                    </Button>
                    <Button size="sm" className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                      <Plus className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search documents by name or type..."
                      className="pl-9 bg-gray-50 border-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      {title: 'Vehicle Registration Certificate.pdf', date: '15 Mar 2025', type: 'Registration', size: '1.2 MB'},
                      {title: 'Comprehensive Insurance Policy.pdf', date: '10 Jan 2025', type: 'Insurance', size: '3.5 MB'},
                      {title: 'Pollution Under Control Certificate.pdf', date: '05 Feb 2025', type: 'RTO Documents', size: '0.8 MB'},
                      {title: 'Latest Service Record.pdf', date: '22 Apr 2025', type: 'Service Records', size: '2.1 MB'},
                      {title: 'Vehicle Purchase Invoice.pdf', date: '18 Dec 2024', type: 'Purchase Documents', size: '1.7 MB'},
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700 mr-3">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{doc.title}</div>
                            <div className="text-xs text-gray-500">Added on {doc.date} • {doc.size}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-blue-200 text-blue-700">
                            {doc.type}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-500">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reminders">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-800">Upcoming Reminders</h3>
                  <Button size="sm" className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Reminder
                  </Button>
                </div>
                
                <div className="divide-y">
                  {[
                    {
                      title: 'Insurance Renewal',
                      vehicle: 'Honda City ZX',
                      date: '18 May 2025',
                      days: 17,
                      priority: 'high',
                      icon: <Shield className="h-4 w-4" />
                    },
                    {
                      title: 'Routine Service',
                      vehicle: 'Mahindra XUV700',
                      date: '29 May 2025',
                      days: 28,
                      priority: 'medium',
                      icon: <Clock className="h-4 w-4" />
                    },
                    {
                      title: 'Emission Test',
                      vehicle: 'Toyota Fortuner',
                      date: '10 Jun 2025',
                      days: 40,
                      priority: 'medium',
                      icon: <ActivitySquare className="h-4 w-4" />
                    },
                    {
                      title: 'Tire Rotation',
                      vehicle: 'Honda City ZX',
                      date: '22 Jun 2025',
                      days: 52,
                      priority: 'low',
                      icon: <CircleDot className="h-4 w-4" />
                    },
                    {
                      title: 'Road Tax Renewal',
                      vehicle: 'Toyota Fortuner',
                      date: '15 Jul 2025',
                      days: 75,
                      priority: 'high',
                      icon: <CircleDollarSign className="h-4 w-4" />
                    }
                  ].map((reminder, i) => (
                    <div key={i} className="p-4 flex items-center hover:bg-gray-50 transition-colors">
                      <div className={`flex-shrink-0 w-2 h-12 rounded-full mr-4 ${
                        reminder.priority === 'high' ? 'bg-red-500' :
                        reminder.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <div className={`mr-2 p-1.5 rounded-full ${
                            reminder.priority === 'high' ? 'bg-red-100 text-red-600' :
                            reminder.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {reminder.icon}
                          </div>
                          <h4 className="font-medium">{reminder.title}</h4>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {reminder.vehicle} • Due on {reminder.date}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={`${
                          reminder.days < 30 ? 'bg-red-100 text-red-700' :
                          reminder.days < 60 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {reminder.days} days left
                        </Badge>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          Complete
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-500">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-4">
              <div className="space-y-5">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100/60 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-800">Quick Summary</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <div className="text-blue-800 font-medium mb-2">This Month</div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-700">2 High Priority</Badge>
                        <Badge className="bg-amber-100 text-amber-700">3 Medium</Badge>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <div className="text-blue-800 font-medium mb-2">Categories</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-indigo-100 text-indigo-700">Service: 4</Badge>
                        <Badge className="bg-cyan-100 text-cyan-700">Legal: 3</Badge>
                        <Badge className="bg-emerald-100 text-emerald-700">Maintenance: 5</Badge>
                      </div>
                    </div>
                    
                    <Button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Calendar
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/60 shadow-sm p-5">
                  <div className="flex items-center">
                    <div className="p-2 bg-amber-100 rounded-lg mr-3">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-amber-800">Need Attention</h3>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-amber-100 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Insurance Renewal</div>
                        <div className="text-xs text-gray-500">Honda City ZX • 17 days left</div>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-lg border-amber-200 text-amber-700">
                        Renew
                      </Button>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-amber-100 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Road Tax</div>
                        <div className="text-xs text-gray-500">Toyota Fortuner • 75 days left</div>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-lg border-amber-200 text-amber-700">
                        Pay
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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