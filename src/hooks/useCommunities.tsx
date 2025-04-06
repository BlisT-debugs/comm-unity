
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Community {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
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
      if (joined && !user) return [];
      
      if (joined && user) {
        // Get communities the user has joined using a more optimized query
        const { data, error } = await supabase
          .from('community_members')
          .select(`
            community_id,
            communities:community_id (*)
          `)
          .eq('profile_id', user.id)
          .limit(limit);
          
        if (error) {
          console.error('Error fetching joined communities:', error);
          throw new Error('Failed to fetch joined communities');
        }
        
        if (!data.length) return [];
        
        // Extract communities from the nested structure
        const communities = data
          .map(item => item.communities)
          .filter(Boolean);
          
        if (search) {
          return communities.filter(c => 
            c.name.toLowerCase().includes(search.toLowerCase()) || 
            (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
          );
        }
        
        return communities;
      } else {
        // Get all communities with optimized query and filtering
        const query = supabase
          .from('communities')
          .select('*')
          .order('member_count', { ascending: false });
        
        if (search) {
          query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }
        
        if (limit) {
          query.limit(limit);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching communities:', error);
          throw new Error('Failed to fetch communities');
        }
        
        return data || [];
      }
    },
    staleTime: 60000, // 1 minute
    enabled: !(joined && !user), // Don't run if we need joined communities but user is not logged in
  });

  return {
    communities: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
