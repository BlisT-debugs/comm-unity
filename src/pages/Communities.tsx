
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { useCommunities } from '@/hooks/useCommunities';
import CommunityCard from '@/components/community/CommunityCard';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateCommunityDialog from '@/components/community/CreateCommunityDialog';

const Communities = () => {
  const { communities, isLoading } = useCommunities();
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Communities</h1>
              {user && (
                <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
                  <Plus size={16} />
                  Create Community
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : (
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
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      
      <CreateCommunityDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </SidebarProvider>
  );
};

export default Communities;
