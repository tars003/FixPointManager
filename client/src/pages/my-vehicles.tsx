import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Vehicle } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Plus, Car, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import AnimatedVehicleCard from '@/components/vehicle/animated-vehicle-card';
import AddVehicleForm from '@/components/vehicle/add-vehicle-form';

const MyVehicles = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // Fetch current user's vehicles
  // Using a hardcoded userId=1 for demo purposes
  // In a real app, this would come from auth context
  const { data: vehicles, isLoading, isError } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles', { userId: 1 }],
  });
  
  const refreshVehicles = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
  };

  // Get statistics
  const activeVehicles = vehicles?.filter(v => v.status === 'active').length || 0;
  const needsService = vehicles?.filter(v => 
    v.nextService && new Date(v.nextService) < new Date()
  ).length || 0;
  
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div 
        className="lg:flex lg:items-center lg:justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-3xl font-bold fx-text-gradient lg:block hidden">My Vehicles</h2>
          <p className="text-neutral-light mt-1 hidden lg:block">Manage all your vehicles in one place</p>
        </div>
        
        <Button 
          onClick={() => setAddDialogOpen(true)}
          className="fx-button-gradient flex items-center shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Vehicle
        </Button>
      </motion.div>
      
      {/* Statistics cards - only shown if there are vehicles */}
      {vehicles && vehicles.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="fx-card p-4 flex items-center">
            <div className="bg-primary/10 rounded-full p-3 mr-4">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-neutral-light text-sm">Total Vehicles</p>
              <p className="text-2xl font-bold">{vehicles.length}</p>
            </div>
          </div>
          
          <div className="fx-card p-4 flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <Car className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-neutral-light text-sm">Active Vehicles</p>
              <p className="text-2xl font-bold">{activeVehicles}</p>
            </div>
          </div>
          
          <div className="fx-card p-4 flex items-center">
            <div className="bg-amber-100 rounded-full p-3 mr-4">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-neutral-light text-sm">Needs Service</p>
              <p className="text-2xl font-bold">{needsService}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <motion.div 
              key={n} 
              className="bg-white rounded-xl shadow-sm h-64 animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: n * 0.1 }}
            />
          ))}
        </div>
      ) : isError ? (
        <motion.div 
          className="fx-card p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-red-500 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.2
            }}
          >
            <AlertTriangle className="h-16 w-16 mx-auto" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">Error Loading Vehicles</h3>
          <p className="text-neutral-light mb-6">We couldn't load your vehicles. Please try again later.</p>
          <Button 
            onClick={refreshVehicles}
            className="fx-button-gradient"
          >
            Try Again
          </Button>
        </motion.div>
      ) : vehicles && vehicles.length > 0 ? (
        <div>
          {vehicles.map((vehicle, index) => (
            <AnimatedVehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onUpdate={refreshVehicles}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div 
          className="fx-card p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-neutral-light mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.2 
            }}
          >
            <Car className="h-20 w-20 mx-auto" />
          </motion.div>
          <h3 className="text-2xl font-semibold mb-2">No Vehicles Found</h3>
          <p className="text-neutral-light mb-6">You haven't added any vehicles yet. Add your first vehicle to get started.</p>
          <Button 
            onClick={() => setAddDialogOpen(true)} 
            className="fx-button-gradient"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Vehicle
          </Button>
        </motion.div>
      )}
      
      <AddVehicleForm
        userId={1} // Hardcoded for demo
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={refreshVehicles}
      />
    </div>
  );
};

export default MyVehicles;
