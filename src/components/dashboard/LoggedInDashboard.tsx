
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCards from '@/components/dashboard/StatCards';
import IssuesTab from '@/components/dashboard/tabs/IssuesTab';
import CommunitiesTab from '@/components/dashboard/tabs/CommunitiesTab';
import LeaderboardTab from '@/components/home/LeaderboardTab';
import AchievementsTab from '@/components/home/AchievementsTab';

import { useAuth } from '@/hooks/useAuth';
import { useCommunities } from '@/hooks/useCommunities';
import { useIssues } from '@/hooks/useIssues';
import { useUserAchievements } from '@/hooks/useUserAchievements';

const LoggedInDashboard: React.FC = () => {
  const { profile } = useAuth();
  
  // Fetch data for the summary cards
  const { issues, isLoading: isIssuesLoading } = useIssues({ limit: 4 });
  const { communities, isLoading: isCommunitiesLoading } = useCommunities({ limit: 3 });
  const { achievements, isLoading: isAchievementsLoading } = useUserAchievements();

  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Dashboard" 
        createLink="/issues?create=true" 
        createLabel="Create Issue" 
      />
      
      <StatCards 
        issuesCount={issues.length}
        communitiesCount={communities.length}
        impactScore={profile?.impact_score || 0}
        achievementsCount={achievements ? achievements.length : 0}
        isAuthenticated={!!profile}
      />
      
      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="issues">Recent Issues</TabsTrigger>
          <TabsTrigger value="communities">My Communities</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues" className="space-y-4">
          <IssuesTab limit={4} />
        </TabsContent>
        
        <TabsContent value="communities" className="space-y-4">
          <CommunitiesTab limit={3} showJoined={true} />
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

export default LoggedInDashboard;
