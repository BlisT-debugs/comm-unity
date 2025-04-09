
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  location: string | null;
  status: 'open' | 'in-progress' | 'completed';
  upvote_count: number;
  community_id: string;
  community_name?: string;
  creator_id: string | null;
  created_at: string;
  updated_at: string;
}

interface UseIssuesOptions {
  limit?: number;
  communityId?: string;
  status?: 'open' | 'in-progress' | 'completed';
}

export const useIssues = (options?: UseIssuesOptions) => {
  const { limit = 10, communityId, status } = options || {};

  const fetchIssues = async (): Promise<Issue[]> => {
    let query = supabase
      .from('issues')
      .select(`
        *,
        communities(name)
      `)
      .order('created_at', { ascending: false });
      
    if (communityId) {
      query = query.eq('community_id', communityId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching issues:', error);
      throw new Error('Failed to fetch issues');
    }
    
    return data.map(issue => ({
      ...issue,
      community_name: issue.communities?.name,
      // Ensure status is one of the allowed types
      status: issue.status as 'open' | 'in-progress' | 'completed'
    })) as Issue[];
  };

  const query = useQuery({
    queryKey: ['issues', { limit, communityId, status }],
    queryFn: fetchIssues,
  });

  return {
    issues: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
