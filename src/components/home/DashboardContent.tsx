
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCards from '@/components/dashboard/StatCards';
import IssuesTab from '@/components/dashboard/tabs/IssuesTab';
import CommunitiesTab from '@/components/dashboard/tabs/CommunitiesTab';
import LeaderboardTab from '@/components/home/LeaderboardTab';
import AchievementsTab from '@/components/home/AchievementsTab';
import { useAuth } from '@/hooks/useAuth';

const LoggedInDashboard = () => {
  const { profile } = useAuth();
  
  return (
    <div className="space-y-6">
      <DashboardHeader
        name={profile?.full_name || 'Community Member'}
        avatar={profile?.avatar_url}
        username={profile?.username}
      />
      
      <StatCards />
      
      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues" className="space-y-4">
          <IssuesTab limit={3} />
        </TabsContent>
        
        <TabsContent value="communities" className="space-y-4">
          <CommunitiesTab limit={6} />
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-4">
          <LeaderboardTab />
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4">
          <AchievementsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoggedInDashboard;
