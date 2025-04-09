
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define an interface for the RPC function parameter
interface IncrementCommunityMemberCountParams {
  community_id: string;
}

export const useJoinCommunity = (onSuccess: () => void) => {
  const { user } = useAuth();

  const joinCommunity = async (communityId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to join communities",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Check if user is already a member
      const { data: existingMembership } = await supabase
        .from('community_members')
        .select()
        .eq('community_id', communityId)
        .eq('profile_id', user.id)
        .single();
      
      if (existingMembership) {
        toast({
          title: "Already a member",
          description: "You are already a member of this community"
        });
        return;
      }
      
      // Add user as a member
      const { error: memberError } = await supabase
        .from('community_members')
        .insert({ 
          community_id: communityId, 
          profile_id: user.id,
          is_moderator: false
        });
      
      if (memberError) throw memberError;
      
      // Increment member count with properly typed parameter
      const { error: incrementError } = await supabase.rpc<void, IncrementCommunityMemberCountParams>(
        'increment_community_member_count',
        { community_id: communityId }
      );
      
      if (incrementError) throw incrementError;
      
      toast({
        title: "Joined community",
        description: "You have successfully joined this community!"
      });
      
      onSuccess();
      
    } catch (error) {
      toast({
        title: "Error joining community",
        description: "There was a problem joining this community. Please try again.",
        variant: "destructive"
      });
      console.error("Error joining community:", error);
    }
  };

  return { joinCommunity };
};
