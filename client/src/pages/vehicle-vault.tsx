import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  CircleDollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const VehicleVault = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('list');
  
  // Query for user's vehicles
  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });
  
  // Mock vehicle data if API doesn't return anything
  const vehicleData = [
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
    }
  ];
  
  const vehiclesList = vehicles && vehicles.length > 0 ? vehicles : vehicleData;
  
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
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {vehiclesList.map(vehicle => (
              <motion.div 
                key={vehicle.id}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                variants={itemVariants}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/vehicle-vault/${vehicle.id}`)}
              >
                <div className="h-40 bg-gray-100 relative">
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
                    className="absolute top-3 right-3"
                    variant="outline"
                  >
                    {vehicle.fuelType}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg">{vehicle.name}</h3>
                      <p className="text-gray-500 text-sm">{vehicle.licensePlate}</p>
                    </div>
                    <Badge className={getHealthScoreColor(vehicle.healthScore)}>
                      {vehicle.healthScore}%
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
                    <div className={`flex items-center text-xs ${getServiceStatusColor(vehicle.serviceStatus)}`}>
                      {getServiceStatusIcon(vehicle.serviceStatus)}
                      <span>Service {vehicle.serviceStatus}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated {vehicle.lastUpdate}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
    </div>
  );
};

export default VehicleVault;