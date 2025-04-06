
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

interface UseIssuesOptions {
  limit?: number;
  search?: string;
  status?: 'open' | 'in-progress' | 'completed';
  category?: string;
  communityId?: string;
  mine?: boolean;
}

export const useIssues = (options: UseIssuesOptions = {}) => {
  const { user } = useAuth();
  const { limit, search, status, category, communityId, mine } = options;

  const query = useQuery({
    queryKey: ['issues', limit, search, status, category, communityId, mine, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('issues')
        .select(`
          *,
          communities (
            id,
            name,
            description
          )
        `);

      // Apply filters
      if (limit) {
        query = query.limit(limit);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (communityId) {
        query = query.eq('community_id', communityId);
      }

      // Get issues created by the user
      if (mine && user) {
        query = query.eq('creator_id', user.id);
      }

      // Order by most recent
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Add community_name property to each issue
      return data.map(issue => ({
        ...issue,
        community_name: issue.communities?.name
      }));
    },
    enabled: true,
  });

  return {
    issues: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
