
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BadgeCheck, 
  Home, 
  LightbulbIcon, 
  ListTodo, 
  Map, 
  MessageSquare, 
  Plus, 
  Recycle, 
  School, 
  ShieldAlert, 
  Trophy, 
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useCommunities } from '@/hooks/useCommunities';

const categories = [
  { id: 'waste', name: 'Waste Management', icon: Recycle, color: 'text-green-600' },
  { id: 'education', name: 'Education', icon: School, color: 'text-blue-600' },
  { id: 'safety', name: 'Safety', icon: ShieldAlert, color: 'text-red-600' },
];

const menuItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Communities', href: '/communities', icon: Users },
  { name: 'Explore Issues', href: '/issues', icon: Map },
  { name: 'My Projects', href: '/projects', icon: ListTodo },
  { name: 'Discussions', href: '/discussions', icon: MessageSquare },
  { name: 'Ideas', href: '/ideas', icon: LightbulbIcon },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
];

const AppSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { communities: userCommunities, isLoading } = useCommunities({ userId: user?.id, limit: 5 });
  
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

        // Navigate to the communities page
        navigate("/communities");
        
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

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 py-4">
        <div className="flex items-center gap-2 px-2 font-bold text-xl">
          <div className="rounded-lg bg-primary p-1">
            <span className="text-white">Comm</span>
          </div>
          <span className="text-sidebar-foreground">Unity</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.name} active={location.pathname === item.href}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Issue Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton asChild>
                    <Link to={`/issues?category=${category.id}`} className="flex items-center">
                      <category.icon className={cn("mr-2 h-4 w-4", category.color)} />
                      <span>{category.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>My Communities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="animate-pulse h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
                  <div className="animate-pulse h-4 bg-muted rounded w-2/3 mx-auto"></div>
                </div>
              ) : userCommunities && userCommunities.length > 0 ? (
                userCommunities.map(community => (
                  <SidebarMenuItem key={community.id}>
                    <SidebarMenuButton asChild>
                      <Link to={`/community/${community.id}`} className="flex items-center">
                        <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary-100 text-primary-800">
                          {community.name.charAt(0)}
                        </span>
                        <span>{community.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {user ? "You haven't joined any communities yet" : "Sign in to see your communities"}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Community</span>
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
                <Label htmlFor="sidebar-name">Community Name*</Label>
                <Input 
                  id="sidebar-name" 
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
                  placeholder="Enter community name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sidebar-description">Description</Label>
                <Textarea 
                  id="sidebar-description" 
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                  placeholder="Describe what your community is about"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sidebar-location">Location*</Label>
                <Input 
                  id="sidebar-location" 
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
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
