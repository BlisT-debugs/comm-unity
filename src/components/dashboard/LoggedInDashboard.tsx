
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, PlusCircle, TrendingUp, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityCard from '@/components/community/CommunityCard';
import IssueCard from '@/components/issues/IssueCard';
import LeaderboardItem from '@/components/gamification/LeaderboardItem';
import AchievementBadge from '@/components/gamification/AchievementBadge';
import DashboardCard from '@/components/dashboard/DashboardCard';
import CreateIssueDialog from '@/components/issues/CreateIssueDialog';
import { useAuth } from '@/hooks/useAuth';
import { useCommunities } from '@/hooks/useCommunities';
import { useIssues } from '@/hooks/useIssues';
import { useUserAchievements } from '@/hooks/useUserAchievements';

const LoggedInDashboard: React.FC = () => {
  const [createIssueDialogOpen, setCreateIssueDialogOpen] = useState(false);
  const { profile } = useAuth();
  const { communities, isLoading: isCommunitiesLoading } = useCommunities({ limit: 3 });
  const { issues, isLoading: isIssuesLoading } = useIssues({ limit: 4 });
  const { achievements, isLoading: isAchievementsLoading } = useUserAchievements();

  // Mock data for leaderboard until backend is connected
  const leaderboard = [
    { id: '1', name: 'Community Champion', points: 850 },
    { id: '2', name: 'Eco Warrior', points: 720 },
    { id: '3', name: 'Park Protector', points: 640 },
    { id: '4', name: 'Green Thumb', points: 580 },
    { id: '5', name: profile?.username || profile?.full_name || 'Current User', points: profile?.impact_score || 550, isCurrentUser: true },
    { id: '6', name: 'Wildlife Guardian', points: 510 },
    { id: '7', name: 'River Cleaner', points: 490 },
    { id: '8', name: 'Neighborhood Helper', points: 460 },
    { id: '9', name: 'Recycling Expert', points: 430 },
    { id: '10', name: 'Urban Gardener', points: 410 },
  ];
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => setCreateIssueDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Issue
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Active Issues" 
          value="12" 
          description="3 awaiting your input"
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard 
          title="My Communities" 
          value="5" 
          description="2 with new activity"
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
          value={achievements ? achievements.length.toString() : "0"} 
          description="Unlock more by participating"
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="issues">Recent Issues</TabsTrigger>
          <TabsTrigger value="communities">My Communities</TabsTrigger>
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
                  status={issue.status as any}
                  upvotes={issue.upvote_count || 0}
                  comments={0}
                  contributors={0}
                  progress={issue.status === 'completed' ? 100 : issue.status === 'in-progress' ? 50 : 0}
                  createdAt={new Date(issue.created_at).toLocaleDateString()}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-muted-foreground mb-4">No issues found</p>
                <Button>Create your first issue</Button>
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
                  joined={false} // We'll implement this later with actual joined status
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't joined any communities yet</p>
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
        
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Track your community impact and unlock new achievements</CardDescription>
            </CardHeader>
            <CardContent>
              {isAchievementsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-muted animate-pulse mb-2"></div>
                      <div className="w-20 h-4 bg-muted animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : achievements && achievements.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex flex-col items-center text-center">
                      <AchievementBadge 
                        name={achievement.name} 
                        description={achievement.description}
                        type={achievement.achievement_type as any}
                        unlocked={true}
                        progress={100}
                        className="mb-2"
                      />
                      <span className="text-sm font-medium">{achievement.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't unlocked any achievements yet</p>
                  <p className="text-sm">Get started by participating in community activities</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Leaderboard</CardTitle>
              <CardDescription>Top contributors making an impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((user, index) => (
                  <LeaderboardItem 
                    key={user.id}
                    rank={index + 1}
                    name={user.name}
                    points={user.points}
                    isCurrentUser={user.isCurrentUser}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateIssueDialog 
        open={createIssueDialogOpen} 
        onOpenChange={setCreateIssueDialogOpen} 
      />
    </div>
  );
};

export default LoggedInDashboard;
