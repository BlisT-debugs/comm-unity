import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import CommunityCard from '@/components/community/CommunityCard';
import { useCommunities } from '@/hooks/useCommunities';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Communities = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // States for community creation dialog
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get communities based on active tab
  const { communities, isLoading, refetch } = useCommunities({
    search: searchQuery,
    joined: activeTab === 'joined'
  });
  
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
      
      setCreateDialogOpen(false);
      refetch();
      
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
  
  const handleJoinCommunity = async (communityId: string) => {
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
      
      // Increment member count
      await supabase.rpc('increment_community_member_count', { community_id: communityId });
      
      toast({
        title: "Joined community",
        description: "You have successfully joined this community!"
      });
      
      refetch();
      
    } catch (error) {
      toast({
        title: "Error joining community",
        description: "There was a problem joining this community. Please try again.",
        variant: "destructive"
      });
      console.error("Error joining community:", error);
    }
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Communities</h1>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
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
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search communities..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="md:w-1/4">
          {user && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Communities</TabsTrigger>
                <TabsTrigger value="joined">Joined</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : communities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((community) => (
            <CommunityCard 
              key={community.id}
              id={community.id}
              name={community.name}
              description={community.description || ''}
              memberCount={community.member_count}
              categories={['Community']}
              imageUrl={community.image_url || undefined}
              joined={activeTab === 'joined'}
              onJoin={() => handleJoinCommunity(community.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground mb-4">
            {activeTab === 'joined' 
              ? "You haven't joined any communities yet" 
              : "No communities found matching your search"}
          </p>
          {activeTab === 'joined' ? (
            <Button onClick={() => setActiveTab('all')}>Explore Communities</Button>
          ) : (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create a Community
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Communities;
