import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Vehicle, InsertVehicle } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UseVehiclesOptions {
  userId?: number;
  enabled?: boolean;
}

export function useVehicles(options: UseVehiclesOptions = {}) {
  const { userId, enabled = true } = options;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get all vehicles for a user
  const {
    data: vehicles,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles', { userId }],
    enabled: !!userId && enabled,
  });
  
  // Get a single vehicle by ID
  const getVehicle = (id: number) => {
    return useQuery<Vehicle>({
      queryKey: [`/api/vehicles/${id}`],
    });
  };
  
  // Add a new vehicle
  const addVehicle = useMutation({
    mutationFn: async (vehicle: InsertVehicle) => {
      const res = await apiRequest('POST', '/api/vehicles', vehicle);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      toast({
        title: 'Vehicle added',
        description: 'Your vehicle has been successfully added.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add vehicle: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Update a vehicle
  const updateVehicle = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertVehicle> }) => {
      const res = await apiRequest('PUT', `/api/vehicles/${id}`, data);
      return await res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      queryClient.invalidateQueries({ queryKey: [`/api/vehicles/${id}`] });
      toast({
        title: 'Vehicle updated',
        description: 'Your vehicle has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update vehicle: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Delete a vehicle
  const deleteVehicle = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/vehicles/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      toast({
        title: 'Vehicle deleted',
        description: 'The vehicle has been successfully removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete vehicle: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  return {
    vehicles,
    isLoading,
    isError,
    error,
    refetch,
    getVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
}
