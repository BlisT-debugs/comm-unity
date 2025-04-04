
import React from 'react';
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
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 py-4">
        <div className="flex items-center gap-2 px-2 font-bold text-xl">
          <div className="rounded-lg bg-primary p-1">
            <span className="text-white">Socio</span>
          </div>
          <span className="text-sidebar-foreground">Sphere</span>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/community/greenville" className="flex items-center">
                    <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-100 text-green-800">
                      G
                    </span>
                    <span>Greenville</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/community/techpark" className="flex items-center">
                    <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                      T
                    </span>
                    <span>Tech Park</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <Button className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          <span>Create Community</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
