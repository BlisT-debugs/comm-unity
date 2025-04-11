
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, ThumbsUp, Users, Calendar, MapPin, Tag, Check, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useIssueVote } from '@/hooks/useIssueVote';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const statusStyles = {
  'open': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'completed': 'bg-green-100 text-green-800 border-green-200',
};

const IssueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { voteIssue, isVoting } = useIssueVote();
  
  // Fetch issue details
  const { data: issue, isLoading } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          communities(name, id)
        `)
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching issue:', error);
        throw new Error('Failed to fetch issue details');
      }
      
      return data;
    },
    enabled: !!id,
  });
  
  // Fetch comments
  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ['issue', id, 'comments'],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles(username, avatar_url)
        `)
        .eq('issue_id', id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching comments:', error);
        throw new Error('Failed to fetch comments');
      }
      
      return data || [];
    },
    enabled: !!id,
  });
  
  // Handle upvote
  const handleUpvote = () => {
    if (!user) {
      return;
    }
    
    if (!id) return;
    
    voteIssue(id);
  };

  // Get issue progress
  const getIssueProgress = (status: string) => {
    if (status === 'completed') return 100;
    if (status === 'in-progress') return 50;
    return 0;
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
            ) : issue ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Link 
                    to={`/community/${issue.community_id}`} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {issue.communities?.name}
                  </Link>
                  <span className="text-muted-foreground">/</span>
                  <span>Issue</span>
                </div>
                
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={statusStyles[issue.status as 'open' | 'in-progress' | 'completed']}>
                        {issue.status === 'in-progress' ? 'In Progress' : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={handleUpvote}
                          disabled={isVoting || !user}
                          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                          title={user ? "Upvote this issue" : "Log in to upvote"}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{issue.upvote_count}</span>
                        </button>
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold mt-2">{issue.title}</h1>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created {format(new Date(issue.created_at), 'MMM d, yyyy')}</span>
                      </div>
                      {issue.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{issue.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span>{issue.category}</span>
                      </div>
                    </div>
                    
                    <div className="mb-6 whitespace-pre-wrap">
                      {issue.description}
                    </div>
                    
                    {issue.status !== 'open' && (
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Progress</span>
                          </div>
                          <span className="font-medium">{getIssueProgress(issue.status)}%</span>
                        </div>
                        <Progress value={getIssueProgress(issue.status)} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                  
                  {issue.image_url && (
                    <CardContent className="pt-0">
                      <img 
                        src={issue.image_url} 
                        alt={issue.title} 
                        className="rounded-md w-full max-h-96 object-cover"
                      />
                    </CardContent>
                  )}
                </Card>
                
                <Tabs defaultValue="discussion">
                  <TabsList className="mb-4">
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                    <TabsTrigger value="contributors">Contributors</TabsTrigger>
                    <TabsTrigger value="updates">Updates</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="discussion">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Comments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isCommentsLoading ? (
                          <div className="space-y-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                          </div>
                        ) : comments && comments.length > 0 ? (
                          <div className="space-y-6">
                            {comments.map((comment: any) => (
                              <div key={comment.id} className="border-b pb-4 last:border-0">
                                <div className="flex items-start gap-3">
                                  <Avatar>
                                    <AvatarImage src={comment.profiles?.avatar_url} />
                                    <AvatarFallback>
                                      {comment.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium">
                                        {comment.profiles?.username || 'Anonymous'}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {format(new Date(comment.created_at), 'MMM d, yyyy - h:mm a')}
                                      </span>
                                    </div>
                                    <p>{comment.content}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                        )}
                      </CardContent>
                      {user && (
                        <CardFooter>
                          <Button className="w-full">Add Comment</Button>
                        </CardFooter>
                      )}
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="contributors">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contributors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">No contributors yet.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="updates">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Updates</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">No updates posted yet.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Issue not found</p>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default IssueDetail;
