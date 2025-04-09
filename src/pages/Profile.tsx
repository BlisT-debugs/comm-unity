
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Profile = () => {
  const { user, profile } = useAuth();
  
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            
            {user && (
              <Card className="max-w-md mx-auto">
                <CardHeader className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{profile?.full_name || profile?.username || 'User'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Username</p>
                      <p>{profile?.username || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p>{profile?.location || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bio</p>
                      <p>{profile?.bio || 'No bio available'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
