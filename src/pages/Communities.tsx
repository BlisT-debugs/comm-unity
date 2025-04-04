
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import CommunityCard from '@/components/community/CommunityCard';
import { useCommunities } from '@/hooks/useCommunities';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Communities = () => {
  const { communities, isLoading, refetch } = useCommunities();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isCreatingCommunity, setIsCreatingCommunity] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    location: ''
  });

  const handleCreateCommunity = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a community",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (!newCommunity.name || !newCommunity.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingCommunity(true);

    try {
      const { data, error } = await supabase
        .from('communities')
        .insert({
          name: newCommunity.name,
          description: newCommunity.description,
          location: newCommunity.location,
          creator_id: user.id
        })
        .select();

      if (error) throw error;

      if (data && data[0]) {
        // Join the newly created community
        const { error: joinError } = await supabase
          .from('community_members')
          .insert({
            community_id: data[0].id,
            profile_id: user.id,
            is_moderator: true
          });

        if (joinError) throw joinError;

        toast({
          title: "Community created!",
          description: "Your community was successfully created.",
        });
        
        // Refresh the communities list
        refetch();
        
        // Reset form
        setNewCommunity({
          name: '',
          description: '',
          location: ''
        });
      }
    } catch (error) {
      console.error("Error creating community:", error);
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingCommunity(false);
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join a community",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          profile_id: user.id
        });

      if (error) throw error;

      // Update the community member count
      const { error: updateError } = await supabase.rpc('increment_community_member_count', { 
        community_id_param: communityId,
        increment_amount: 1
      });
      
      if (updateError) {
        console.error("Error updating member count:", updateError);
      }

      toast({
        title: "Success!",
        description: "You've joined the community.",
      });
      
      // Refresh the communities list
      refetch();
    } catch (error) {
      console.error("Error joining community:", error);
      toast({
        title: "Error",
        description: "Failed to join community. You might already be a member.",
        variant: "destructive"
      });
    }
  };

  const filteredCommunities = communities
    .filter(community => 
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (community.description && community.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      community.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'members':
          return b.member_count - a.member_count;
        default:
          return 0;
      }
    });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <h1 className="text-3xl font-bold">Communities</h1>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Community
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a New Community</DialogTitle>
                      <DialogDescription>
                        Start a new community to collaborate on local issues.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Community Name*</Label>
                        <Input 
                          id="name" 
                          value={newCommunity.name}
                          onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
                          placeholder="Enter community name"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          value={newCommunity.description}
                          onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                          placeholder="Describe what your community is about"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location*</Label>
                        <Input 
                          id="location" 
                          value={newCommunity.location}
                          onChange={(e) => setNewCommunity({...newCommunity, location: e.target.value})}
                          placeholder="City, neighborhood, or area"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" disabled={isCreatingCommunity} onClick={handleCreateCommunity}>
                        {isCreatingCommunity ? 'Creating...' : 'Create Community'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search communities" 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="members">Most Members</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : filteredCommunities.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCommunities.map(community => (
                    <CommunityCard
                      key={community.id}
                      id={community.id}
                      name={community.name}
                      description={community.description || ''}
                      memberCount={community.member_count}
                      categories={['Community']}
                      imageUrl={community.image_url || undefined}
                      onJoin={() => handleJoinCommunity(community.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No communities found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? 'Try a different search term' : 'Be the first to create a community!'}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Community
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      {/* Same dialog content as above */}
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Communities;
