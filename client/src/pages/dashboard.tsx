import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Vehicle } from '@shared/schema';
import { 
  Car, 
  Bell, 
  Wrench, 
  MapPin, 
  History, 
  CreditCard, 
  Search, 
  FileText,
  ShoppingBag,
  Calendar,
  Shield,
  Info,
  ArrowRight,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/format';
import { NotificationPopover } from '@/components/notification/notification-popover';
import FeatureShowcase from '@/components/dashboard/feature-showcase';
import VehiclePortfolioValue from '@/components/vehicle-vault/VehiclePortfolioValue';

const Dashboard = () => {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  // Mock data for user
  const user = {
    name: 'Raj',
    id: 1
  };
  
  // Fetch user's vehicles
  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles', { userId: user.id }],
    enabled: !!user.id,
  });
  
  // Mock upcoming service
  const upcomingService = {
    date: '2025-05-25',
    vehicle: 'Honda City',
    daysLeft: 14
  };
  
  // Mock document status
  const documentStatus = {
    total: 8,
    updated: 8
  };
  
  // Mock health status
  const healthStatus = {
    status: 'Good',
    score: 88
  };
  
  // Function to handle navigation to different sections
  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with greeting */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-neutral-dark mb-1">Welcome, {user.name}!</h2>
        <p className="text-neutral-light">Manage all your vehicles in one place, regardless of fuel type.</p>
        
        <div className="flex items-center justify-end mt-4 space-x-2">
          <NotificationPopover />
          
          <Button 
            className="bg-primary text-white hover:bg-primary-dark flex items-center"
            size="sm"
            onClick={() => navigateTo('/book-service')}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Quick Service
          </Button>
        </div>
      </motion.div>
      
      {/* Quick Actions Cards */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-xl font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <motion.div 
            whileHover={{ y: -5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            className="fx-card p-4 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/vehicles')}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <p className="text-center text-sm font-medium">My Vehicles</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            className="fx-card p-4 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/book-service')}
          >
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
              <Wrench className="h-5 w-5 text-accent" />
            </div>
            <p className="text-center text-sm font-medium">Book Service</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            className="fx-card p-4 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/nearby')}
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <MapPin className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-center text-sm font-medium">Nearby</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            className="fx-card p-4 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/history')}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <History className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-center text-sm font-medium">History</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            className="fx-card p-4 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/card-system')}
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
              <CreditCard className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-center text-sm font-medium">Card System</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            className="fx-card p-4 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/explore')}
          >
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-2">
              <Search className="h-5 w-5 text-pink-500" />
            </div>
            <p className="text-center text-sm font-medium">Find Parts</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            className="fx-card p-4 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/compare')}
          >
            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center mb-2">
              <FileText className="h-5 w-5 text-cyan-500" />
            </div>
            <p className="text-center text-sm font-medium">Compare</p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Status Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Vehicle Health Card */}
        <motion.div 
          className="fx-card p-4 border-l-4 border-primary"
          whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm text-neutral-light font-medium">Vehicle Health</h4>
              <div className="flex items-center mt-1">
                <p className="text-xl font-bold text-neutral-dark">{healthStatus.status}</p>
                <Badge className="ml-2 bg-green-100 text-green-600 hover:bg-green-100">
                  {healthStatus.score}%
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-3 w-full bg-neutral-100 rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthStatus.score}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1.5 rounded-full bg-green-500"
            />
          </div>
        </motion.div>
        
        {/* Upcoming Service Card */}
        <motion.div 
          className="fx-card p-4 border-l-4 border-accent"
          whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="text-sm text-neutral-light font-medium">Upcoming Service</h4>
              <p className="text-xl font-bold text-neutral-dark mt-1">May 25</p>
              <div className="flex items-center mt-1">
                <p className="text-sm text-neutral-light">{upcomingService.vehicle}</p>
                <Badge className="ml-2 bg-accent/10 text-accent hover:bg-accent/10">
                  {upcomingService.daysLeft} days
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Documents Card */}
        <motion.div 
          className="fx-card p-4 border-l-4 border-green-500"
          whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h4 className="text-sm text-neutral-light font-medium">Documents</h4>
              <p className="text-xl font-bold text-neutral-dark mt-1">All Updated</p>
              <p className="text-sm text-neutral-light mt-1">
                {documentStatus.updated}/{documentStatus.total} documents
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 w-full flex items-center justify-center text-primary"
            onClick={() => navigateTo('/documents')}
          >
            <span>View all documents</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto p-1">
            <TabsTrigger value="dashboard" className="py-2">Dashboard</TabsTrigger>
            <TabsTrigger value="new-features" className="py-2">New Features</TabsTrigger>
            <TabsTrigger value="services" className="py-2">Services</TabsTrigger>
            <TabsTrigger value="calculators" className="py-2">Calculators</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">Vehicle Portfolio Value</span>
                <Info className="h-4 w-4 text-neutral-light" />
              </h3>
              <p className="text-neutral-light mb-4">See the total worth of your vehicle collection</p>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <VehiclePortfolioValue
                  vehicles={[
                    {
                      id: 1,
                      vehicle: "Tata Nexon EV",
                      worth: 892500,
                      fuelType: "Electric"
                    },
                    {
                      id: 2,
                      vehicle: "Honda City",
                      worth: 375000,
                      fuelType: "Petrol"
                    },
                    {
                      id: 3,
                      vehicle: "TVS iQube",
                      worth: 73500,
                      fuelType: "Electric"
                    },
                    {
                      id: 4,
                      vehicle: "Mahindra XUV700",
                      worth: 1250000,
                      fuelType: "Diesel"
                    },
                    {
                      id: 5,
                      vehicle: "Royal Enfield Classic 350",
                      worth: 190000,
                      fuelType: "Petrol"
                    }
                  ]}
                />
              )}
              
              <div className="flex justify-center mt-6">
                <Button 
                  variant="outline"
                  onClick={() => navigateTo('/vehicles')}
                  className="flex items-center"
                >
                  View All Vehicles
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="new-features" className="mt-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <FeatureShowcase />
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="mt-4">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Service History</h3>
              <p className="text-neutral-light mb-4">View your complete service history and upcoming appointments</p>
              
              <div className="py-8">
                <Clock className="h-12 w-12 mx-auto text-neutral-light mb-3" />
                <p className="text-neutral-light mb-4">Coming soon! This feature is under development.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calculators" className="mt-4">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Maintenance Calculators</h3>
              <p className="text-neutral-light mb-4">Calculate fuel efficiency, maintenance costs, and more</p>
              
              <div className="py-8">
                <ShoppingBag className="h-12 w-12 mx-auto text-neutral-light mb-3" />
                <p className="text-neutral-light mb-4">Coming soon! This feature is under development.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Dashboard;