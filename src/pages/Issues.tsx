// Fix TypeScript errors
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Filter, Plus, Search, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import IssueCard from '@/components/issues/IssueCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useCommunities } from '@/hooks/useCommunities';
import { useIssues } from '@/hooks/useIssues';

const CATEGORIES = [
  'Environment',
  'Safety',
  'Infrastructure',
  'Education',
  'Health',
  'Waste Management',
  'Transportation',
  'Community Events',
  'Other'
];

const STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

const Issues = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { communities } = useCommunities({});
  
  // State for issue creation
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [communityFilter, setCommunityFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('create') === 'true') {
      setCreateDialogOpen(true);
    }
  }, [location]);
  
  // Get issues based on active tab
  const { issues, isLoading, refetch } = useIssues({
    search: searchQuery || undefined,
    status: statusFilter as 'open' | 'in-progress' | 'completed' | undefined,
    category: categoryFilter || undefined,
    communityId: communityFilter || undefined,
    mine: activeTab === 'mine' ? true : undefined
  });
  
  const handleCreateIssue = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to create an issue",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (!title.trim() || !description.trim() || !category || !communityId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('issues')
        .insert([
          { 
            title, 
            description, 
            category, 
            community_id: communityId,
            status: 'open',
            creator_id: user.id
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Issue created successfully",
        description: "Your issue has been posted to the community"
      });
      
      setCreateDialogOpen(false);
      refetch();
      
      // Clear form
      setTitle('');
      setDescription('');
      setCategory('');
      setCommunityId('');
      
    } catch (error) {
      toast({
        title: "Error creating issue",
        description: "There was a problem creating your issue. Please try again.",
        variant: "destructive"
      });
      console.error("Error creating issue:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpvote = async (issueId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to upvote issues",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Check if user already upvoted this issue
      const { data: existingVote } = await supabase
        .from('votes')
        .select()
        .eq('issue_id', issueId)
        .eq('profile_id', user.id)
        .single();
      
      if (existingVote) {
        // User already upvoted, so remove the upvote
        await supabase
          .from('votes')
          .delete()
          .eq('issue_id', issueId)
          .eq('profile_id', user.id);
          
        // Decrement the upvote count
        await supabase.rpc('decrement_upvote', { row_id: issueId });
      } else {
        // Add new upvote
        await supabase
          .from('votes')
          .insert({ 
            issue_id: issueId, 
            profile_id: user.id 
          });
          
        // Increment the upvote count
        await supabase.rpc('increment_upvote', { row_id: issueId });
      }
      
      // Refresh issues
      refetch();
      
    } catch (error) {
      toast({
        title: "Error upvoting issue",
        description: "There was a problem processing your upvote. Please try again.",
        variant: "destructive"
      });
      console.error("Error upvoting:", error);
    }
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setCategoryFilter(null);
    setCommunityFilter(null);
  };
  
  const hasActiveFilters = searchQuery || statusFilter || categoryFilter || communityFilter;
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Community Issues</h1>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create a New Issue</DialogTitle>
              <DialogDescription>
                Share a community issue that needs attention. Be specific and provide all relevant details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="issue-title">Title</Label>
                <Input 
                  id="issue-title" 
                  placeholder="Short, descriptive title for the issue" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="issue-description">Description</Label>
                <Textarea 
                  id="issue-description" 
                  placeholder="Provide details about the issue, its location, impact, and potential solutions"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="issue-category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="issue-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="issue-community">Community</Label>
                  <Select value={communityId} onValueChange={setCommunityId}>
                    <SelectTrigger id="issue-community">
                      <SelectValue placeholder="Select a community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map((community) => (
                        <SelectItem key={community.id} value={community.id}>{community.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateIssue} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Issue'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4 flex flex-col md:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search issues..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => document.getElementById('filter-dialog-trigger')?.click()}
          >
            <Filter className="h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {(!!statusFilter ? 1 : 0) + 
                 (!!categoryFilter ? 1 : 0) + 
                 (!!communityFilter ? 1 : 0)}
              </Badge>
            )}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="hidden" id="filter-dialog-trigger">
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Issues</DialogTitle>
                <DialogDescription>
                  Narrow down issues by status, category, or community
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select 
                    value={statusFilter || ''} 
                    onValueChange={(val: string) => setStatusFilter(val || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any status</SelectItem>
                      {STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select 
                    value={categoryFilter || ''} 
                    onValueChange={(val: string) => setCategoryFilter(val || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any category</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Community</Label>
                  <Select 
                    value={communityFilter || ''} 
                    onValueChange={(val: string) => setCommunityFilter(val || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any community" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any community</SelectItem>
                      {communities.map((community) => (
                        <SelectItem key={community.id} value={community.id}>{community.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button variant="outline" onClick={clearFilters} type="button">
                  Clear Filters
                </Button>
                <DialogClose asChild>
                  <Button type="button">
                    <Check className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="md:w-1/4">
          {user && (
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Issues</TabsTrigger>
                <TabsTrigger value="mine">My Issues</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {statusFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {STATUSES.find(s => s.value === statusFilter)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter(null)} />
            </Badge>
          )}
          {categoryFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categoryFilter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setCategoryFilter(null)} />
            </Badge>
          )}
          {communityFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Community: {communities.find(c => c.id === communityFilter)?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setCommunityFilter(null)} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>Clear all</Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : issues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {issues.map((issue) => (
            <IssueCard 
              key={issue.id}
              id={issue.id}
              title={issue.title}
              description={issue.description}
              category={issue.category}
              community={issue.community_name || 'Community'}
              communityId={issue.community_id}
              status={issue.status as 'open' | 'in-progress' | 'completed'}
              upvotes={issue.upvote_count || 0}
              comments={0}
              contributors={0}
              progress={issue.status === 'completed' ? 100 : issue.status === 'in-progress' ? 50 : 0}
              createdAt={new Date(issue.created_at).toLocaleDateString()}
              onUpvote={() => handleUpvote(issue.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No issues found matching your criteria</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create an Issue
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Issues;
