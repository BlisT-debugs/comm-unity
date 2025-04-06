
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCards from '@/components/dashboard/StatCards';
import IssuesTab from '@/components/dashboard/tabs/IssuesTab';
import CommunitiesTab from '@/components/dashboard/tabs/CommunitiesTab';
import LeaderboardTab from '@/components/home/LeaderboardTab';
import AchievementsTab from '@/components/home/AchievementsTab';
import { useAuth } from '@/hooks/useAuth';
import { useIssues } from '@/hooks/useIssues';
import { useCommunities } from '@/hooks/useCommunities';
import { useUserAchievements } from '@/hooks/useUserAchievements';

const LoggedInDashboard = () => {
  const { profile } = useAuth();
  
  // Fetch data for display
  const { issues = [], isLoading: isIssuesLoading } = useIssues({ limit: 3 });
  const { communities = [], isLoading: isCommunitiesLoading } = useCommunities({ limit: 6 });
  const { achievements = [], isLoading: isAchievementsLoading } = useUserAchievements();
  
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Dashboard"
        createLink="/issues?create=true"
        createLabel="Create Issue"
      />
      
      <StatCards 
        issuesCount={issues.length}
        communitiesCount={communities.length}
        impactScore={profile?.impact_score || 0}
        achievementsCount={achievements?.length || 0}
        isAuthenticated={!!profile}
      />
      
      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues" className="space-y-4">
          <IssuesTab />
        </TabsContent>
        
        <TabsContent value="communities" className="space-y-4">
          <CommunitiesTab showJoined={true} />
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-4">
          <LeaderboardTab profile={profile} />
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <AchievementsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoggedInDashboard;
