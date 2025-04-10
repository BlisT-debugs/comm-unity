
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, Settings, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import GlobalSearch from '@/components/search/GlobalSearch';
import LanguageSelector from '@/components/settings/LanguageSelector';
import NetworkIndicator from '@/components/ui/network-indicator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';

const AppHeader = () => {
  const { user, profile, signOut } = useAuth();
  const { isMobile } = useApp();
  const { toggleSidebar } = useApp();
  const { t } = useLanguage();
  const { connectionStatus } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 h-8 w-8 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        {/* Logo - only show on mobile or when sidebar is closed */}
        <div className="flex items-center gap-2 font-bold text-xl md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1">
              <span className="text-white">Comm</span>
            </div>
            <span>Unity</span>
          </Link>
        </div>
        
        {/* Search */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end md:space-x-4">
          <GlobalSearch />
          
          {/* Language selector */}
          <LanguageSelector variant="minimal" />
          
          {/* Network status indicator */}
          {!isMobile && <NetworkIndicator />}
          
          {/* Notifications */}
          {user && (
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                  {/* Unread indicator */}
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>{t('Notifications')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {connectionStatus === 'offline' ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {t('Notifications unavailable offline')}
                  </div>
                ) : (
                  <>
                    <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                      <div className="font-medium">{t('New issue created in your community')}</div>
                      <div className="text-sm text-muted-foreground">2 hours ago</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                      <div className="font-medium">{t('Your issue was upvoted')}</div>
                      <div className="text-sm text-muted-foreground">Yesterday</div>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/notifications" className="w-full text-center cursor-pointer">
                    {t('View all notifications')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || 'User'} />
                    <AvatarFallback>{profile?.username?.charAt(0) || profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name || profile?.username}</p>
                    {profile?.username && (
                      <p className="text-xs leading-none text-muted-foreground">@{profile?.username}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <UserRound className="mr-2 h-4 w-4" />
                    {t('Profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {t('Settings')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  {t('Log out')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">{t('Log in')}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
