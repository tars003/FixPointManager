import { useQuery } from '@tanstack/react-query';
import { ServiceProvider, Availability } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UseProvidersOptions {
  latitude?: string;
  longitude?: string;
  radius?: number;
  enabled?: boolean;
}

export function useProviders(options: UseProvidersOptions = {}) {
  const { latitude, longitude, radius = 10, enabled = true } = options;
  const { toast } = useToast();

  // Determine if we should use nearby search or get all providers
  const shouldUseNearby = !!(latitude && longitude);
  
  // Build query parameters for nearby search
  const getNearbyQueryParams = () => {
    if (!shouldUseNearby) return '';
    return `?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
  };

  // Get all providers or nearby providers based on options
  const {
    data: providers,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<ServiceProvider[]>({
    queryKey: ['/api/service-providers', getNearbyQueryParams()],
    enabled,
  });

  // Get a single provider by ID
  const getProvider = (id: number) => {
    return useQuery<ServiceProvider>({
      queryKey: [`/api/service-providers/${id}`],
    });
  };

  // Get provider availability
  const getProviderAvailability = (providerId: number) => {
    return useQuery<Availability[]>({
      queryKey: [`/api/availability/${providerId}`],
      enabled: !!providerId,
    });
  };

  // Update provider availability
  const updateProviderAvailability = async (
    providerId: number,
    availabilities: { dayOfWeek: number; startTime: string; endTime: string }[]
  ) => {
    try {
      // First, get existing availabilities
      const res = await fetch(`/api/availability/${providerId}`);
      if (!res.ok) throw new Error('Failed to fetch existing availability');
      
      const existingAvailability: Availability[] = await res.json();
      
      // Delete existing availability
      for (const avail of existingAvailability) {
        await apiRequest('DELETE', `/api/availability/${avail.id}`);
      }
      
      // Create new availability for each day
      for (const avail of availabilities) {
        await apiRequest('POST', '/api/availability', {
          providerId,
          ...avail
        });
      }
      
      toast({
        title: 'Availability updated',
        description: 'Your availability settings have been updated.',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update availability. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    }
  };

  return {
    providers,
    isLoading,
    isError,
    error,
    refetch,
    getProvider,
    getProviderAvailability,
    updateProviderAvailability,
  };
}
