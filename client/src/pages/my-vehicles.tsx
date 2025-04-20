import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Vehicle } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Plus, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VehicleCard from '@/components/vehicle/vehicle-card';
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="lg:flex lg:items-center lg:justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-dark lg:block hidden">My Vehicles</h2>
        <Button 
          onClick={() => setAddDialogOpen(true)}
          className="flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Vehicle
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl shadow-sm h-64 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Error Loading Vehicles</h3>
          <p className="text-neutral-light mb-4">We couldn't load your vehicles. Please try again later.</p>
          <Button onClick={refreshVehicles}>Try Again</Button>
        </div>
      ) : vehicles && vehicles.length > 0 ? (
        vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onUpdate={refreshVehicles}
          />
        ))
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-neutral-light mb-4">
            <Car className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Vehicles Found</h3>
          <p className="text-neutral-light mb-4">You haven't added any vehicles yet. Add your first vehicle to get started.</p>
          <Button onClick={() => setAddDialogOpen(true)}>Add Your First Vehicle</Button>
        </div>
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
