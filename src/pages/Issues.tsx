
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { useIssues } from '@/hooks/useIssues';
import IssueCard from '@/components/issues/IssueCard';
import { format } from 'date-fns';
import CreateIssueDialog from '@/components/issues/CreateIssueDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Issues = () => {
  const { issues, isLoading } = useIssues();
  const [createIssueDialogOpen, setCreateIssueDialogOpen] = useState(false);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Explore Issues</h1>
              <Button onClick={() => setCreateIssueDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Issue
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {issues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    id={issue.id}
                    title={issue.title}
                    description={issue.description}
                    category={issue.category}
                    community={issue.community_name || "Unknown Community"}
                    communityId={issue.community_id}
                    status={issue.status}
                    upvotes={issue.upvote_count}
                    comments={0}
                    contributors={0}
                    progress={issue.status === 'completed' ? 100 : issue.status === 'in-progress' ? 50 : 0}
                    createdAt={format(new Date(issue.created_at), 'MMM d, yyyy')}
                  />
                ))}
              </div>
            )}
          </main>

          <CreateIssueDialog 
            isOpen={createIssueDialogOpen}
            onOpenChange={setCreateIssueDialogOpen}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Issues;
