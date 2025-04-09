
import React from 'react';
import { useParams } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { Card, CardContent } from '@/components/ui/card';

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <h1 className="text-3xl font-bold mb-6">Community Detail</h1>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Community ID: {id}
                </p>
                <p className="mt-4">The detailed community view is under development.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CommunityDetail;
