
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Achievement {
  id: string;
  name: string;
  description: string;
  badge_image: string;
  required_points: number;
  achievement_type: string;
  unlocked_at?: string;
  progress?: number;
}

export const useUserAchievements = () => {
  const { user } = useAuth();

  const fetchUserAchievements = async (): Promise<Achievement[]> => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements(*)
      `)
      .eq('profile_id', user.id);
      
    if (error) {
      console.error('Error fetching user achievements:', error);
      throw new Error('Failed to fetch user achievements');
    }
    
    return data.map((item: any) => ({
      ...item.achievements,
      unlocked_at: item.unlocked_at,
      progress: item.progress
    })) || [];
  };

  const query = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: fetchUserAchievements,
    enabled: !!user,
  });

  return {
    achievements: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
