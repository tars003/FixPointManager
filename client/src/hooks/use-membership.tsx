import { useQuery } from '@tanstack/react-query';

export type MembershipType = 'basic' | 'premium' | 'elite';

export interface MembershipData {
  userId: number;
  membershipType: MembershipType;
  membershipNumber: string;
  memberSince: string;
  points: number;
  vehicleCount: number;
  expiryDate: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface MembershipResponse {
  hasMembership: boolean;
  membershipData: MembershipData | null;
}

interface UseMembershipOptions {
  userId?: number;
  enabled?: boolean;
}

export const useMembership = (options: UseMembershipOptions = {}) => {
  const { userId = 1, enabled = true } = options;
  
  return useQuery<MembershipResponse>({
    queryKey: ['/api/membership-status', { userId }],
    queryFn: async ({ queryKey, signal }) => {
      const [_, { userId }] = queryKey as [string, { userId: number }];
      const response = await fetch(`/api/membership-status?userId=${userId}`, { signal });
      
      if (!response.ok) {
        throw new Error('Failed to fetch membership status');
      }
      
      return response.json();
    },
    enabled: enabled && !!userId,
  });
};