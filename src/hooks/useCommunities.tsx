
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Community {
  id: string;
  name: string;
  description: string | null;
  location: string | null;  // Changed from required to nullable to match DB schema
  image_url: string | null;
  member_count: number;
  created_at: string;
  updated_at: string;
  creator_id: string | null;
}

interface UseCommunitiesOptions {
  limit?: number;
  search?: string;
  joined?: boolean;
}

export const useCommunities = (options: UseCommunitiesOptions = {}) => {
  const { user } = useAuth();
  const { limit = 10, search, joined } = options;

  const query = useQuery({
    queryKey: ['communities', limit, search, joined, user?.id],
    queryFn: async (): Promise<Community[]> => {
      if (joined) {
        if (!user) return [];
        
        // Get communities the user has joined
        const { data: memberData, error: memberError } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('profile_id', user.id);
          
        if (memberError) {
          console.error('Error fetching joined communities:', memberError);
          throw new Error('Failed to fetch joined communities');
        }
        
        if (!memberData.length) return [];
        
        const communityIds = memberData.map(item => item.community_id);
        
        // Get the actual community data
        let query = supabase
          .from('communities')
          .select('*')
          .in('id', communityIds);
          
        if (search) {
          query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching communities:', error);
          throw new Error('Failed to fetch communities');
        }
        
        return data || [];
        
      } else {
        // Get all communities
        let query = supabase
          .from('communities')
          .select('*')
          .order('member_count', { ascending: false });
        
        if (search) {
          query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }
        
        if (limit) {
          query = query.limit(limit);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching communities:', error);
          throw new Error('Failed to fetch communities');
        }
        
        return data || [];
      }
    },
    enabled: true,
  });

  return {
    communities: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
