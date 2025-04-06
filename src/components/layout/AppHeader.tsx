
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AppHeaderProps {
  isLoggedIn?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to log out');
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <SidebarTrigger className="mr-2 lg:hidden">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        
        <div className="flex items-center gap-2 font-bold text-xl text-primary mr-4">
          <div className="hidden md:block rounded-lg bg-primary p-1">
            <span className="text-white">Comm</span>
          </div>
          <span className="text-socio-darkgreen">Unity</span>
        </div>
        
        <div className="hidden md:flex flex-1 items-center gap-5 lg:gap-6">
          <div className="relative w-full max-w-sm lg:max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search communities or issues..."
              className="w-full pl-8 bg-background"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  3
                </span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.username || "User"} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.full_name || profile?.username || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex w-full items-center">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/communities" className="flex w-full items-center">My Communities</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/achievements" className="flex w-full items-center">Achievements</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/auth">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?tab=signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
