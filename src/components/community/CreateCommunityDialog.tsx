
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CreateCommunityDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

const CreateCommunityDialog: React.FC<CreateCommunityDialogProps> = ({
  isOpen,
  setIsOpen,
  onSuccess
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCommunity = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to create a community",
        variant: "destructive"
      });
      return;
    }
    
    if (!name.trim() || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name and description for your community",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the community
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .insert([{ 
          name, 
          description, 
          location: location || null,
          creator_id: user.id,
          member_count: 1 // Creator is the first member
        }])
        .select();
      
      if (communityError) throw communityError;
      
      if (communityData && communityData[0]) {
        // Add creator as a member
        const { error: memberError } = await supabase
          .from('community_members')
          .insert({ 
            community_id: communityData[0].id, 
            profile_id: user.id,
            is_moderator: true
          });
        
        if (memberError) throw memberError;
      }
      
      toast({
        title: "Community created",
        description: "Your community has been created successfully!"
      });
      
      setIsOpen(false);
      onSuccess();
      
      // Clear form
      setName('');
      setDescription('');
      setLocation('');
      
    } catch (error) {
      toast({
        title: "Error creating community",
        description: "There was a problem creating your community. Please try again.",
        variant: "destructive"
      });
      console.error("Error creating community:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create a New Community</DialogTitle>
          <DialogDescription>
            Start a new community to bring people together around shared interests or local issues.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="community-name">Community Name</Label>
            <Input 
              id="community-name" 
              placeholder="Enter a name for your community" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="community-description">Description</Label>
            <Textarea 
              id="community-description" 
              placeholder="Describe the purpose and focus of your community"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="community-location">Location (Optional)</Label>
            <Input 
              id="community-location" 
              placeholder="Location of your community" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreateCommunity} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Community'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunityDialog;
