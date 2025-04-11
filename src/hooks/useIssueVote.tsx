
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useIssueVote = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const voteIssueMutation = useMutation({
    mutationFn: async (issueId: string) => {
      if (!user) {
        throw new Error('You must be logged in to vote');
      }

      setIsLoading(true);
      try {
        // Check if user has already voted
        const { data: existingVote, error: checkError } = await supabase
          .from('votes')
          .select('id')
          .eq('issue_id', issueId)
          .eq('profile_id', user.id)
          .single();

        if (existingVote) {
          // If user has already voted, remove the vote
          const { error: deleteError } = await supabase
            .from('votes')
            .delete()
            .eq('id', existingVote.id);

          if (deleteError) throw deleteError;

          // Decrement the upvote count
          const { error: updateError } = await supabase
            .rpc('decrement_upvote_count', { issue_id: issueId });

          if (updateError) throw updateError;

          return { added: false, message: 'Vote removed' };
        } else {
          // Add a new vote
          const { error: insertError } = await supabase
            .from('votes')
            .insert({
              issue_id: issueId,
              profile_id: user.id,
            });

          if (insertError) throw insertError;

          // Increment the upvote count
          const { error: updateError } = await supabase
            .rpc('increment_upvote_count', { issue_id: issueId });

          if (updateError) throw updateError;

          return { added: true, message: 'Vote added' };
        }
      } catch (error: any) {
        console.error('Error voting on issue:', error);
        throw new Error(error.message || 'Failed to vote on issue');
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  return {
    voteIssue: voteIssueMutation.mutate,
    isVoting: isLoading,
    error: voteIssueMutation.error
  };
};
