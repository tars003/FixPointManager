import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceBooking, InsertServiceBooking } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UseBookingsOptions {
  userId?: number;
  vehicleId?: number;
  providerId?: number;
  enabled?: boolean;
}

export function useBookings(options: UseBookingsOptions = {}) {
  const { userId, vehicleId, providerId, enabled = true } = options;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Determine the proper query parameters
  const getQueryParams = () => {
    if (userId) return `?userId=${userId}`;
    if (vehicleId) return `?vehicleId=${vehicleId}`;
    if (providerId) return `?providerId=${providerId}`;
    return '';
  };

  // Get bookings based on provided filters
  const {
    data: bookings,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<ServiceBooking[]>({
    queryKey: ['/api/bookings', getQueryParams()],
    enabled: enabled && !!(userId || vehicleId || providerId),
  });

  // Get a single booking by ID
  const getBooking = (id: number) => {
    return useQuery<ServiceBooking>({
      queryKey: [`/api/bookings/${id}`],
    });
  };

  // Create a new booking
  const createBooking = useMutation({
    mutationFn: async (booking: InsertServiceBooking) => {
      const res = await apiRequest('POST', '/api/bookings', booking);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({
        title: 'Booking confirmed',
        description: 'Your service booking has been successfully created.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create booking: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update an existing booking
  const updateBooking = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertServiceBooking> }) => {
      const res = await apiRequest('PUT', `/api/bookings/${id}`, data);
      return await res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      queryClient.invalidateQueries({ queryKey: [`/api/bookings/${id}`] });
      toast({
        title: 'Booking updated',
        description: 'Your booking has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update booking: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Cancel a booking
  const cancelBooking = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('PUT', `/api/bookings/${id}`, { status: 'cancelled' });
      return await res.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      queryClient.invalidateQueries({ queryKey: [`/api/bookings/${id}`] });
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to cancel booking: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    bookings,
    isLoading,
    isError,
    error,
    refetch,
    getBooking,
    createBooking,
    updateBooking,
    cancelBooking,
  };
}
