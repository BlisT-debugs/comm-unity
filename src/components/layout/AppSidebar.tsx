
// Fix the 'active' prop TypeScript error by fixing the SidebarMenuItem component usage
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, AlertCircle, BarChart3, Settings } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const AppSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Helper to check if the current route matches
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="rounded-lg bg-primary p-1">
            <span className="text-white">Comm</span>
          </div>
          <span className="text-socio-darkgreen">Unity</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Home" 
                isActive={isActive('/')}
                asChild
              >
                <Link to="/">
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Communities" 
                isActive={isActive('/communities')}
                asChild
              >
                <Link to="/communities">
                  <Users className="h-5 w-5" />
                  <span>Communities</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Issues" 
                isActive={isActive('/issues')}
                asChild
              >
                <Link to="/issues">
                  <AlertCircle className="h-5 w-5" />
                  <span>Issues</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Reports" 
                isActive={isActive('/reports')}
                asChild
              >
                <Link to="/reports">
                  <BarChart3 className="h-5 w-5" />
                  <span>Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Settings" 
                  isActive={isActive('/settings')}
                  asChild
                >
                  <Link to="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        {user ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={logout}
          >
            Sign Out
          </Button>
        ) : (
          <Button 
            className="w-full" 
            asChild
          >
            <Link to="/auth">
              Sign In
            </Link>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
