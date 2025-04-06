
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import IssueCardSkeleton from '@/components/issues/IssueCardSkeleton';
import { useAuth } from '@/hooks/useAuth';
import { useIssues } from '@/hooks/useIssues';

// Lazy load the IssueCard component
const IssueCard = lazy(() => import('@/components/issues/IssueCard'));

// Mock data for filters
const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const categoryOptions = [
  { value: 'environment', label: 'Environment' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'safety', label: 'Safety' },
  { value: 'education', label: 'Education' },
  { value: 'waste', label: 'Waste Management' },
];

const communityOptions = [
  { value: 'community1', label: 'Greenville Community' },
  { value: 'community2', label: 'Downtown Association' },
  { value: 'community3', label: 'Riverside Neighbors' },
];

const Issues = () => {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [communityFilter, setCommunityFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
    setStatusFilter(params.get('status'));
    setCategoryFilter(params.get('category'));
    setCommunityFilter(params.get('community'));
    setActiveTab(params.get('mine') === 'true' ? 'mine' : 'all');
  }, [location.search]);
  
  // Fetch issues with filters
  const { issues, isLoading: issuesLoading, refetch } = useIssues({
    search: searchQuery,
    status: statusFilter as any,
    category: categoryFilter || undefined,
    communityId: communityFilter || undefined,
    mine: activeTab === 'mine',
  });
  
  const resetFilters = () => {
    setStatusFilter(null);
    setCategoryFilter(null);
    setCommunityFilter(null);
  };
  
  const applyFilters = () => {
    // Construct URL with query params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (statusFilter) params.set('status', statusFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    if (communityFilter) params.set('community', communityFilter);
    if (activeTab === 'mine') params.set('mine', 'true');
    
    navigate({ search: params.toString() });
    refetch();
  };

  const isLoading = authLoading || issuesLoading;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <AppHeader />
          
          <main className="flex-1 container py-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Community Issues</h1>
              
              <Button onClick={() => navigate({ search: '?create=true' })}>
                <Plus className="mr-2 h-4 w-4" />
                Report an Issue
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-3/4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search issues..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="md:w-1/4 flex gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Issues</SheetTitle>
                      <SheetDescription>
                        Apply filters to narrow down the issues list
                      </SheetDescription>
                    </SheetHeader>
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
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
                            {categoryOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
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
                            {communityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button variant="outline" onClick={resetFilters}>Reset</Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button onClick={applyFilters}>Apply Filters</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            <div className="md:w-1/4">
              {user && (
                <Tabs 
                  value={activeTab} 
                  onValueChange={(value: 'all' | 'mine') => setActiveTab(value)} 
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">All Issues</TabsTrigger>
                    <TabsTrigger value="mine">My Issues</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <IssueCardSkeleton key={i} />
                ))}
              </div>
            ) : issues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {issues.map((issue) => (
                  <Suspense key={issue.id} fallback={<IssueCardSkeleton />}>
                    <IssueCard
                      id={issue.id}
                      title={issue.title}
                      description={issue.description}
                      category={issue.category}
                      community={issue.community_name || 'Community'}
                      communityId={issue.community_id}
                      status={(issue.status || 'open') as 'open' | 'in-progress' | 'completed'}
                      upvotes={issue.upvote_count || 0}
                      comments={0}
                      contributors={0}
                      progress={issue.status === 'completed' ? 100 : issue.status === 'in-progress' ? 50 : 0}
                      createdAt={new Date(issue.created_at).toLocaleDateString()}
                    />
                  </Suspense>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'mine' 
                    ? "You haven't reported any issues yet" 
                    : "No issues found matching your criteria"}
                </p>
                <Button onClick={() => navigate({ search: '?create=true' })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Report an Issue
                </Button>
              </div>
            )}
          </main>
          
          <footer className="border-t py-6 bg-muted/40">
            <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-xl mb-2">
                  <div className="rounded-lg bg-primary p-1">
                    <span className="text-white">Comm</span>
                  </div>
                  <span>Unity</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connecting communities for collaborative problem solving
                </p>
              </div>
              
              <div className="flex gap-6">
                <a href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </a>
                <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </a>
                <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </a>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Issues;
