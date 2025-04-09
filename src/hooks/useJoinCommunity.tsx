
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface JoinCommunityResult {
  success: boolean;
  message: string;
}

export const useJoinCommunity = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const joinCommunityMutation = useMutation({
    mutationFn: async (communityId: string): Promise<JoinCommunityResult> => {
      if (!user) {
        throw new Error('User must be logged in to join a community');
      }

      setIsLoading(true);
      try {
        // Check if user is already a member
        const { data: existingMembership, error: checkError } = await supabase
          .from('community_members')
          .select('id')
          .eq('community_id', communityId)
          .eq('profile_id', user.id)
          .single();

        if (existingMembership) {
          return { 
            success: false, 
            message: 'You are already a member of this community' 
          };
        }

        // Join the community
        const { error: joinError } = await supabase
          .from('community_members')
          .insert({
            community_id: communityId,
            profile_id: user.id,
          });

        if (joinError) {
          throw joinError;
        }

        // Update the member count in the communities table
        const { error: updateError } = await supabase.rpc('increment_member_count', {
          community_id: communityId
        } as { community_id: string });

        if (updateError) {
          console.error('Error updating member count:', updateError);
          // Continue since the user is still added to the community
        }

        return { 
          success: true, 
          message: 'Successfully joined the community' 
        };
      } catch (error: any) {
        console.error('Error joining community:', error);
        throw new Error(error.message || 'Failed to join community');
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidate communities queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  return {
    joinCommunity: joinCommunityMutation.mutate,
    isJoining: isLoading,
    error: joinCommunityMutation.error
  };
};
