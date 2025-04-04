
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, PlusCircle, TrendingUp, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityCard from '@/components/community/CommunityCard';
import IssueCard from '@/components/issues/IssueCard';
import LeaderboardTab from '@/components/home/LeaderboardTab';
import AchievementsTab from '@/components/home/AchievementsTab';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { useAuth } from '@/hooks/useAuth';
import { useCommunities } from '@/hooks/useCommunities';
import { useIssues } from '@/hooks/useIssues';

const DashboardContent: React.FC = () => {
  const { profile, user } = useAuth();
  const { communities, isLoading: isCommunitiesLoading, refetch: refetchCommunities } = useCommunities({ limit: 3 });
  const { issues, isLoading: isIssuesLoading } = useIssues({ limit: 4 });
  
  const handleJoinCommunity = async (communityId: string) => {
    // Implementation remains in the Communities page
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/issues?create=true">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Issue
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Active Issues" 
          value={issues.length.toString()} 
          description="Explore community issues"
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard 
          title="My Communities" 
          value={user ? (communities.length || "0") : "0"} 
          description={user ? "Communities you've joined" : "Sign in to join communities"}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard 
          title="Impact Score" 
          value={profile?.impact_score?.toString() || "0"} 
          description="Keep contributing to increase your score"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard 
          title="Achievements" 
          value={user ? "0" : "0"} 
          description="Unlock more by participating"
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="issues">Recent Issues</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {isIssuesLoading ? (
              <>
                <div className="h-64 bg-muted animate-pulse rounded-md"></div>
                <div className="h-64 bg-muted animate-pulse rounded-md"></div>
                <div className="h-64 bg-muted animate-pulse rounded-md"></div>
                <div className="h-64 bg-muted animate-pulse rounded-md"></div>
              </>
            ) : issues.length > 0 ? (
              issues.map((issue) => (
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
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-muted-foreground mb-4">No issues found</p>
                <Button asChild>
                  <Link to="/issues?create=true">Create your first issue</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="outline" asChild>
              <Link to="/issues">View All Issues</Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="communities" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {isCommunitiesLoading ? (
              <>
                <div className="h-64 bg-muted animate-pulse rounded-md"></div>
                <div className="h-64 bg-muted animate-pulse rounded-md"></div>
                <div className="h-64 bg-muted animate-pulse rounded-md"></div>
              </>
            ) : communities.length > 0 ? (
              communities.map((community) => (
                <CommunityCard 
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  description={community.description || ''}
                  memberCount={community.member_count}
                  categories={['Community']}
                  imageUrl={community.image_url || undefined}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground mb-4">No communities found</p>
                <Button asChild>
                  <Link to="/communities">Explore Communities</Link>
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <Button variant="outline" asChild>
              <Link to="/communities">View All Communities</Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements">
          <AchievementsTab />
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <LeaderboardTab profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
