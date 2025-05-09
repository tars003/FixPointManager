import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Vehicle } from '@shared/schema';
import ValueTrendPredictor from '@/components/dashboard/ValueTrendPredictor';
import { AddVehicleDialog } from '@/components/vehicles/add-vehicle-dialog';
import { 
  Car, 
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
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
  CircleDot,
  Download,
  Share,
  X,
  Upload,
  ClipboardCheck,
  Leaf,
  Droplets,
  Brain,
  Users,
  GitBranch
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Label } from '@/components/ui/label';

// Enhanced Vehicle type with additional UI-related properties
interface EnhancedVehicle extends Partial<Vehicle> {
  id: number;
  name: string; 
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status?: string;
  healthScore?: number;
  serviceStatus?: string;
  fuelType?: string;
  lastUpdate?: string;
  imageSrc?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  purchaseValue?: number;
  currentValue?: number;
  monthlyDepreciation?: number;
  color?: string;
}

// Vehicle status type
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

const VehicleVault = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('list');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('active');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<EnhancedVehicle | null>(null);
  const [newStatus, setNewStatus] = useState<VehicleStatus | ''>('');
  const [selectedDocCategory, setSelectedDocCategory] = useState<string>('');
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  
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
      id: 'in-maintenance', 
      label: 'In Maintenance', 
      icon: <Clock className="h-4 w-4 text-amber-600" />,
      count: 3,
      bgClass: 'bg-amber-50 border-amber-200'
    }
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
    <div className="container mx-auto py-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vehicle Vault</h1>
          <p className="text-gray-500">Manage your entire vehicle collection</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select 
            value={statusFilter === 'all' ? 'all' : statusFilter}
            onValueChange={(value: string) => setStatusFilter(value as VehicleStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {statusCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center">
                    {category.icon}
                    <span className="ml-2">{category.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button className="rounded-lg border-0 bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-3">
          <TabsList>
            <TabsTrigger value="list" className="px-6">
              <Car className="h-4 w-4 mr-2" />
              Vehicle List
            </TabsTrigger>
            <TabsTrigger value="value-trends" className="px-6">
              <CircleDollarSign className="h-4 w-4 mr-2" />
              Value Trends
            </TabsTrigger>
            <TabsTrigger value="documents" className="px-6">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="rounded-lg border-blue-200 hover:bg-blue-50 h-10 w-10"
            >
              <Filter className="h-4 w-4 text-blue-600" />
            </Button>
            <Button 
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0"
              onClick={() => setIsAddVehicleOpen(true)}
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
                  {/* Status badge */}
                  {vehicle.status && (
                    <div className="absolute left-3 top-3 z-10">
                      <Badge 
                        className={`
                          ${vehicle.status === 'active' ? 'bg-emerald-100 text-emerald-700' : ''}
                          ${vehicle.status === 'recently-purchased' ? 'bg-blue-100 text-blue-700' : ''}
                          ${vehicle.status === 'in-maintenance' ? 'bg-amber-100 text-amber-700' : ''}
                        `}
                      >
                        {vehicle.status.split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="h-40 bg-gray-100 relative cursor-pointer">
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
                  
                  <div className="p-4 cursor-pointer">
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
            <h2 className="text-lg font-bold mb-4">Vehicle Value Trends</h2>
            <ValueTrendPredictor vehicles={vehiclesList.map(v => ({
              id: v.id,
              name: v.name,
              make: v.make,
              model: v.model,
              year: v.year,
              purchaseValue: v.purchaseValue || 0,
              currentValue: v.currentValue || 0,
              monthlyDepreciation: v.monthlyDepreciation || 0,
              color: v.color || 'unknown',
              condition: v.condition || 'good',
            }))} />
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-xl overflow-hidden bg-gradient-to-r from-blue-800 to-indigo-800 border border-blue-700/30 shadow-lg">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white/10 rounded-lg p-2 mr-3">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Vehicle Document Management</h3>
                    <p className="text-blue-200 text-sm">Manage and track all documents for your vehicles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Vehicle Status</DialogTitle>
            <DialogDescription>
              Update the status of {selectedVehicle?.name} ({selectedVehicle?.licensePlate})
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select 
                value={newStatus} 
                onValueChange={(value: string) => setNewStatus(value as VehicleStatus | '')}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a new status" />
                </SelectTrigger>
                <SelectContent>
                  {statusCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
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
      
      {/* Add Vehicle Dialog */}
      <AddVehicleDialog 
        open={isAddVehicleOpen} 
        onOpenChange={setIsAddVehicleOpen} 
        theme="light" 
      />
    </div>
  );
};

export default VehicleVault;