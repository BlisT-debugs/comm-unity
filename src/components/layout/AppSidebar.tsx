
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import CreateCommunityDialog from '@/components/community/CreateCommunityDialog';
import { useAuth } from '@/hooks/useAuth';
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
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { user } = useAuth();
  const { communities, isLoading } = useCommunities({ userId: user?.id, limit: 5 });

  return (
    <>
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
                  <SidebarMenuItem key={item.name}>
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
                      <Link to={`/category/${category.id}`} className="flex items-center">
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
                  <div className="px-2 py-1 text-sm text-muted-foreground">Loading...</div>
                ) : communities.length > 0 ? (
                  communities.map((community) => (
                    <SidebarMenuItem key={community.id}>
                      <SidebarMenuButton asChild>
                        <Link to={`/community/${community.id}`} className="flex items-center">
                          <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary">
                            {community.name.charAt(0).toUpperCase()}
                          </span>
                          <span>{community.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    No communities joined yet
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter>
          {user && (
            <Button onClick={() => setShowCreateDialog(true)} className="w-full justify-start gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Community</span>
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>

      <CreateCommunityDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </>
  );
};

export default AppSidebar;
