
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import IssueCard from '@/components/issues/IssueCard';
import { useIssues } from '@/hooks/useIssues';
import { useCommunities } from '@/hooks/useCommunities';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Issues = () => {
  const { issues, isLoading, refetch } = useIssues();
  const { communities } = useCommunities();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: 'Waste Management',
    community_id: '',
    location: ''
  });

  const handleCreateIssue = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an issue",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (!newIssue.title || !newIssue.description || !newIssue.community_id) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingIssue(true);

    try {
      const { data, error } = await supabase
        .from('issues')
        .insert({
          title: newIssue.title,
          description: newIssue.description,
          category: newIssue.category,
          community_id: newIssue.community_id,
          location: newIssue.location || null,
          creator_id: user.id,
          status: 'open'
        })
        .select();

      if (error) throw error;

      toast({
        title: "Issue created!",
        description: "Your issue was successfully created.",
      });
      
      // Refresh the issues list
      refetch();
      
      // Reset form
      setNewIssue({
        title: '',
        description: '',
        category: 'Waste Management',
        community_id: '',
        location: ''
      });
    } catch (error) {
      console.error("Error creating issue:", error);
      toast({
        title: "Error",
        description: "Failed to create issue. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingIssue(false);
    }
  };

  const handleUpvote = async (issueId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote an issue",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    try {
      // Check if user already voted
      const { data: existingVotes, error: checkError } = await supabase
        .from('votes')
        .select('*')
        .eq('issue_id', issueId)
        .eq('profile_id', user.id);
        
      if (checkError) throw checkError;
      
      if (existingVotes && existingVotes.length > 0) {
        toast({
          title: "Already voted",
          description: "You have already upvoted this issue",
          variant: "default"
        });
        return;
      }
      
      // Insert vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          issue_id: issueId,
          profile_id: user.id
        });
        
      if (voteError) throw voteError;
      
      // Update the issue upvote count
      const { error: updateError } = await supabase
        .from('issues')
        .update({ upvote_count: supabase.rpc('increment', { row_id: issueId }) })
        .eq('id', issueId);
        
      if (updateError) throw updateError;

      toast({
        title: "Upvoted!",
        description: "Your vote has been counted.",
      });
      
      // Refresh the issues list
      refetch();
    } catch (error) {
      console.error("Error upvoting issue:", error);
      toast({
        title: "Error",
        description: "Failed to upvote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredIssues = issues
    .filter(issue => 
      (searchTerm === "" || 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || issue.status === statusFilter) &&
      (categoryFilter === "all" || issue.category === categoryFilter)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'upvotes':
          return b.upvote_count - a.upvote_count;
        default:
          return 0;
      }
    });

  const categories = ["Waste Management", "Education", "Safety", "Environment", "Infrastructure", "Transportation"];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <h1 className="text-3xl font-bold">Community Issues</h1>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create a New Issue</DialogTitle>
                      <DialogDescription>
                        Submit an issue that needs attention in your community.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Issue Title*</Label>
                        <Input 
                          id="title" 
                          value={newIssue.title}
                          onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                          placeholder="Brief title for the issue"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description*</Label>
                        <Textarea 
                          id="description"
                          value={newIssue.description}
                          onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                          placeholder="Describe the issue in detail"
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="community">Community*</Label>
                        <Select 
                          value={newIssue.community_id} 
                          onValueChange={(value) => setNewIssue({...newIssue, community_id: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a community" />
                          </SelectTrigger>
                          <SelectContent>
                            {communities.map(community => (
                              <SelectItem key={community.id} value={community.id}>
                                {community.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category*</Label>
                          <Select 
                            value={newIssue.category} 
                            onValueChange={(value) => setNewIssue({...newIssue, category: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            value={newIssue.location}
                            onChange={(e) => setNewIssue({...newIssue, location: e.target.value})}
                            placeholder="Specific location (optional)"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" disabled={isCreatingIssue} onClick={handleCreateIssue}>
                        {isCreatingIssue ? 'Creating...' : 'Create Issue'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search issues" 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="upvotes">Most Upvotes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : filteredIssues.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  {filteredIssues.map(issue => (
                    <IssueCard
                      key={issue.id}
                      id={issue.id}
                      title={issue.title}
                      description={issue.description}
                      category={issue.category}
                      community={issue.community_name || 'Community'}
                      communityId={issue.community_id}
                      status={issue.status}
                      upvotes={issue.upvote_count}
                      comments={0}
                      contributors={0}
                      progress={issue.status === 'completed' ? 100 : issue.status === 'in-progress' ? 50 : 0}
                      createdAt={new Date(issue.created_at).toLocaleDateString()}
                      onUpvote={() => handleUpvote(issue.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No issues found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Be the first to create an issue!'}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Issue
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      {/* Same dialog content as above */}
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Issues;
