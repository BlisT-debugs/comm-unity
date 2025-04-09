
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';

const Discussions = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <h1 className="text-3xl font-bold mb-6">Discussions</h1>
            
            <div className="bg-muted p-12 rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
              <p className="text-muted-foreground">
                The Discussions feature is currently under development. Check back later!
              </p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Discussions;
