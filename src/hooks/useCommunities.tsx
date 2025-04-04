
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Community {
  id: string;
  name: string;
  description: string | null;
  location: string;
  image_url: string | null;
  member_count: number;
  created_at: string;
  updated_at: string;
  creator_id: string | null;
}

interface UseCommunitiesOptions {
  limit?: number;
  userId?: string;
}

export const useCommunities = (options?: UseCommunitiesOptions) => {
  const { limit = 10, userId } = options || {};

  const fetchCommunities = async (): Promise<Community[]> => {
    let query = supabase
      .from('communities')
      .select('*')
      .order('member_count', { ascending: false });
      
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching communities:', error);
      throw new Error('Failed to fetch communities');
    }
    
    return data || [];
  };

  const fetchJoinedCommunities = async (): Promise<Community[]> => {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('community_members')
      .select('community_id, communities(*)')
      .eq('profile_id', userId)
      .limit(limit);
      
    if (error) {
      console.error('Error fetching joined communities:', error);
      throw new Error('Failed to fetch joined communities');
    }
    
    // Extract the communities from the response
    return data.map((item: any) => item.communities) || [];
  };

  const query = useQuery({
    queryKey: userId ? ['communities', 'joined', userId, limit] : ['communities', limit],
    queryFn: userId ? fetchJoinedCommunities : fetchCommunities,
  });

  return {
    communities: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
