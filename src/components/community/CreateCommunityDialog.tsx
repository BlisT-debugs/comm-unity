
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCommunityDialog: React.FC<CreateCommunityDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const createCommunityMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('You must be logged in to create a community');
      }

      if (!name.trim() || !location.trim()) {
        throw new Error('Community name and location are required');
      }

      const { data, error } = await supabase
        .from('communities')
        .insert({
          name: name.trim(),
          description: description.trim(),
          location: location.trim(),
          creator_id: user.id,
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      // Join the user to the community as a moderator
      if (data?.id) {
        const { error: joinError } = await supabase
          .from('community_members')
          .insert({
            community_id: data.id,
            profile_id: user.id,
            is_moderator: true,
          });

        if (joinError) {
          console.error('Error joining community:', joinError);
        }

        // Update member count
        const { error: updateError } = await supabase.rpc('increment_member_count', {
          community_id: data.id
        } as { community_id: string });

        if (updateError) {
          console.error('Error updating member count:', updateError);
        }
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Community created successfully');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create community: ${error.message}`);
    },
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setLocation('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCommunityMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Community</DialogTitle>
            <DialogDescription>
              Create a new community to connect with others and address local issues.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Community Name*</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter community name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location*</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your community"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCommunityMutation.isPending || !name.trim() || !location.trim()}
            >
              {createCommunityMutation.isPending ? 'Creating...' : 'Create Community'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunityDialog;
