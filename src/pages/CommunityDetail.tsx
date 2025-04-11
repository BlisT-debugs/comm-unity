
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useJoinCommunity } from '@/hooks/useJoinCommunity';
import { useIssues } from '@/hooks/useIssues';
import IssueCard from '@/components/issues/IssueCard';
import { UserPlus, Users, Plus, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import CreateProjectDialog from '@/components/community/CreateProjectDialog';
import { format } from 'date-fns';

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { joinCommunity, isJoining } = useJoinCommunity();
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  
  // Fetch community details
  const { data: community, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching community:', error);
        throw new Error('Failed to fetch community details');
      }
      
      return data;
    },
    enabled: !!id,
  });
  
  // Check if user is already a member
  const { data: membership, isLoading: isMembershipLoading } = useQuery({
    queryKey: ['community', id, 'membership', user?.id],
    queryFn: async () => {
      if (!id || !user) return null;
      
      const { data, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', id)
        .eq('profile_id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking membership:', error);
      }
      
      if (data) {
        setIsJoined(true);
      }
      
      return data;
    },
    enabled: !!id && !!user,
  });
  
  // Fetch community issues
  const { issues, isLoading: isIssuesLoading } = useIssues({
    communityId: id
  });
  
  // Handle join community
  const handleJoinCommunity = () => {
    if (!user) {
      toast.error('Please log in to join the community');
      return;
    }
    
    if (!id) return;
    
    joinCommunity(id, {
      onSuccess: () => {
        setIsJoined(true);
      }
    });
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : community ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold">{community.name}</h1>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{community.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {user && (
                      <>
                        {isJoined ? (
                          <Button variant="outline" disabled className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Member
                          </Button>
                        ) : (
                          <Button onClick={handleJoinCommunity} disabled={isJoining} className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Join Community
                          </Button>
                        )}
                        
                        <Button 
                          variant="default" 
                          onClick={() => setShowCreateProjectDialog(true)} 
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Create Project
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {community.description ? (
                          <p>{community.description}</p>
                        ) : (
                          <p className="text-muted-foreground">No description available.</p>
                        )}
                        
                        <div className="flex items-center gap-2 mt-4">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{community.member_count} members</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Tabs defaultValue="issues" className="mt-6">
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="issues">Issues</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="discussions">Discussions</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="issues">
                        {isIssuesLoading ? (
                          <div className="space-y-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                          </div>
                        ) : issues.length > 0 ? (
                          <div className="space-y-4">
                            {issues.map(issue => (
                              <IssueCard
                                key={issue.id}
                                id={issue.id}
                                title={issue.title}
                                description={issue.description}
                                category={issue.category}
                                community={community.name}
                                communityId={community.id}
                                status={issue.status}
                                upvotes={issue.upvote_count}
                                comments={0}
                                contributors={0}
                                progress={issue.status === 'completed' ? 100 : issue.status === 'in-progress' ? 50 : 0}
                                createdAt={format(new Date(issue.created_at), 'MMM d, yyyy')}
                              />
                            ))}
                          </div>
                        ) : (
                          <Card>
                            <CardContent className="pt-6 pb-4">
                              <p className="text-muted-foreground">
                                No issues have been reported yet.
                              </p>
                            </CardContent>
                            <CardFooter>
                              <Button>Report an Issue</Button>
                            </CardFooter>
                          </Card>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="projects">
                        <Card>
                          <CardHeader>
                            <CardTitle>Community Projects</CardTitle>
                            <CardDescription>
                              Projects initiated by community members
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              No projects have been created yet.
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button onClick={() => setShowCreateProjectDialog(true)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Create New Project
                            </Button>
                          </CardFooter>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="discussions">
                        <Card>
                          <CardHeader>
                            <CardTitle>Community Discussions</CardTitle>
                            <CardDescription>
                              Join the conversation with community members
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              No discussions have been started yet.
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button>Start a Discussion</Button>
                          </CardFooter>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Categories</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900">Environment</Badge>
                        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">Education</Badge>
                        <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">Community</Badge>
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Community Moderators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isMembershipLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-2/3" />
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            Loading moderators...
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">
                    Community not found
                  </p>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
      
      <CreateProjectDialog
        open={showCreateProjectDialog}
        onOpenChange={setShowCreateProjectDialog}
        communityId={id}
      />
    </SidebarProvider>
  );
};

export default CommunityDetail;
